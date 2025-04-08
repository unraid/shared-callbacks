import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCallback } from '../index'
import { createSharedComposable } from '@vueuse/core'
import AES from 'crypto-js/aes.js'
import Utf8 from 'crypto-js/enc-utf8.js'
import type { ExternalSignOut } from '../types'

describe('useCallback', () => {
  const mockConfig = {
    encryptionKey: 'test-key'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.open
    vi.spyOn(window, 'open').mockImplementation(() => null)
    
    // Mock window.location
    const mockUrl = new URL('http://test.com/Tools/Update')
    const mockLocation = {
      href: mockUrl.toString(),
      replace: vi.fn(),
      toString: () => mockUrl.toString(),
      searchParams: mockUrl.searchParams
    }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    })
  })

  it('should create a shared callback instance', () => {
    const callback = useCallback(mockConfig)
    expect(callback).toBeDefined()
    expect(typeof callback.send).toBe('function')
    expect(typeof callback.parse).toBe('function')
    expect(typeof callback.watcher).toBe('function')
  })

  it('should maintain the same instance for the same config', () => {
    const callback1 = useCallback(mockConfig)
    const callback2 = useCallback(mockConfig)
    expect(callback1).toBe(callback2)
  })

  it('should maintain the same instance even with different configs due to createSharedComposable', () => {
    const callback1 = useCallback({ encryptionKey: 'key1' })
    const callback2 = useCallback({ encryptionKey: 'key2' })
    expect(callback1).toBe(callback2)
  })

  it('should work with createSharedComposable', () => {
    const useTestComposable = createSharedComposable(() => {
      return useCallback(mockConfig)
    })

    const callback1 = useTestComposable()
    const callback2 = useTestComposable()

    expect(callback1).toBe(callback2)
  })

  describe('send function', () => {
    it('should open in new tab when redirectType is newTab', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      
      callback.send('http://test.com/Tools', testActions, 'newTab', 'test', 'http://test.com/Tools')
      
      // Get the URL from the spy call
      const [[urlString]] = (window.open as any).mock.calls
      const url = new URL(urlString)
      
      // Verify the decrypted data
      const encryptedData = url.searchParams.get('data') || ''
      const decryptedData = callback.parse(encryptedData)
      expect(decryptedData).toEqual(testData)
    })

    it('should replace location when redirectType is replace', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      
      callback.send('http://test.com/Tools', testActions, 'replace', 'test', 'http://test.com/Tools')
      
      // Get the URL from the spy call
      const [[urlString]] = (window.location.replace as any).mock.calls
      const url = new URL(urlString)
      
      // Verify the decrypted data
      const encryptedData = url.searchParams.get('data') || ''
      const decryptedData = callback.parse(encryptedData)
      expect(decryptedData).toEqual(testData)
    })
  })

  describe('parse function', () => {
    it('should correctly parse valid encrypted data', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()

      const decryptedData = callback.parse(encryptedData)
      expect(decryptedData).toEqual(testData)
    })

    it('should throw an error for data encrypted with a wrong key', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      const stringifiedData = JSON.stringify(testData)
      // Encrypt with a different key
      const wrongKey = 'wrong-test-key'
      const wronglyEncryptedData = AES.encrypt(stringifiedData, wrongKey).toString()

      // Expect parse to throw the specific decryption error
      expect(() => callback.parse(wronglyEncryptedData)).toThrow('Decryption failed. Invalid key or corrupt data.');
    })

    it('should throw an error for invalid (non-encrypted) data', () => {
      const callback = useCallback(mockConfig)
      const invalidData = 'this is not encrypted data'
      
      // Expect parse to throw (likely the decryption error)
      expect(() => callback.parse(invalidData)).toThrow('Decryption failed. Invalid key or corrupt data.');
    })
  })

  describe('watcher function', () => {
    it('should return undefined when no data is available', () => {
      const callback = useCallback(mockConfig)
      const result = callback.watcher()
      expect(result).toBeUndefined()
    })

    it('should use baseUrl when provided', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      
      // Create and encrypt the test data
      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()
      
      // Create URL with encrypted data
      const url = new URL('http://test.com/Tools')
      url.searchParams.set('data', encryptedData)

      // The global URL is already mocked in setup.ts
      // const originalURL = global.URL
      // global.URL = MockURL as any // Use the mocked URL class

      const result = callback.watcher({ baseUrl: url.toString() })
      
      // Restore the original URL constructor
      // global.URL = originalURL
      
      expect(result).toEqual(testData)
    })

    it('should use dataToParse when provided', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()

      const result = callback.watcher({ dataToParse: encryptedData })
      expect(result).toEqual(testData)
    })
  })
}) 