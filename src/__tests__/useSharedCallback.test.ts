import { describe, it, expect, beforeEach, vi } from 'vitest'
import AES from 'crypto-js/aes.js'
import Utf8 from 'crypto-js/enc-utf8.js'
import type { ExternalSignOut } from '../types'

let useCallback: any

describe('useCallback', () => {
  const mockConfig = {
    encryptionKey: 'test-key'
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    // Ensure window exists (JS DOM or stubbed) before importing the module.
    if (typeof window === 'undefined') {
      vi.stubGlobal('window', {
        location: {
          href: 'http://test.com/Tools/Update',
          toString: () => 'http://test.com/Tools/Update',
          replace: vi.fn(),
        },
        open: vi.fn(),
      })
    }

    // Re-import useCallback fresh for each test so configuration
    // (including useHash) can vary per test.
    vi.resetModules()
    const mod = await import('../index')
    useCallback = mod.useCallback

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

  it('should create a callback instance', () => {
    const callback = useCallback(mockConfig)
    expect(callback).toBeDefined()
    expect(typeof callback.send).toBe('function')
    expect(typeof callback.parse).toBe('function')
    expect(typeof callback.watcher).toBe('function')
  })

  it('should create a new instance per call', () => {
    const callback1 = useCallback(mockConfig)
    const callback2 = useCallback(mockConfig)
    expect(callback1).not.toBe(callback2)
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
      const encryptedData = url.hash.startsWith('#data=')
        ? url.hash.slice('#data='.length)
        : ''
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
      const encryptedData = url.hash.startsWith('#data=')
        ? url.hash.slice('#data='.length)
        : ''
      const decryptedData = callback.parse(encryptedData)
      expect(decryptedData).toEqual(testData)
    })

    it('should use window.location.href when redirectType is null or undefined', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      
      // Mock window.location.href setter to capture the value
      let hrefValue = ''
      const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href')
      Object.defineProperty(window.location, 'href', {
        set: (val) => { hrefValue = val },
        get: () => 'http://test.com/Tools/Update',
        configurable: true
      })
      
      try {
        callback.send('http://test.com/Tools', testActions, null, 'test', 'http://test.com/Tools')
        
        const url = new URL(hrefValue)
        const encryptedData = url.hash.startsWith('#data=')
          ? url.hash.slice('#data='.length)
          : ''
        const decryptedData = callback.parse(encryptedData)
        expect(decryptedData).toEqual(testData)
      } finally {
        // Restore original href property
        if (originalHref) {
          Object.defineProperty(window.location, 'href', originalHref)
        }
      }
    })

    it('should normalize /Tools/Update to /Tools in destination URL', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      
      let hrefValue = ''
      const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href')
      Object.defineProperty(window.location, 'href', {
        set: (val) => { hrefValue = val },
        get: () => 'http://test.com/Tools/Update',
        configurable: true
      })
      
      try {
        callback.send('http://test.com/Tools/Update', testActions, null, 'test', 'http://test.com/Tools')
        
        const url = new URL(hrefValue)
        expect(url.pathname).toBe('/Tools')
      } finally {
        // Restore original href property
        if (originalHref) {
          Object.defineProperty(window.location, 'href', originalHref)
        }
      }
    })

    it('should support query parameter mode when useHash is false', () => {
      const callback = useCallback({ encryptionKey: 'test-key', useHash: false })
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }

      callback.send('http://test.com/Tools', testActions, 'newTab', 'test', 'http://test.com/Tools')

      const [[urlString]] = (window.open as any).mock.calls
      const url = new URL(urlString)

      const encryptedData = url.searchParams.get('data') || ''
      const decryptedData = callback.parse(encryptedData)
      expect(decryptedData).toEqual(testData)
    })

    it('should use window.location.href as default sender when sender is not provided', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools', // Should use window.location.href normalized
        type: 'test'
      }
      
      // Call send without providing sender parameter (undefined)
      callback.send('http://test.com/Tools', testActions, 'newTab', 'test')
      
      // Get the URL from the spy call
      const [[urlString]] = (window.open as any).mock.calls
      const url = new URL(urlString)
      
      // Verify the decrypted data uses default sender
      const encryptedData = url.hash.startsWith('#data=')
        ? url.hash.slice('#data='.length)
        : ''
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

    it('should decode URI when isDataURIEncoded option is true', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()
      const uriEncodedData = encodeURI(encryptedData)

      const decryptedData = callback.parse(uriEncodedData, { isDataURIEncoded: true })
      expect(decryptedData).toEqual(testData)
    })

    it('should throw an error for malformed JSON after successful decryption', () => {
      const callback = useCallback(mockConfig)
      // Create encrypted data that decrypts to invalid JSON
      const invalidJson = 'not valid json'
      const encryptedData = AES.encrypt(invalidJson, mockConfig.encryptionKey).toString()

      expect(() => callback.parse(encryptedData)).toThrow('Failed to parse decrypted data.')
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

    it('should use baseUrl hash when provided', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }

      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()
      const uriEncodedData = encodeURI(encryptedData)

      const url = new URL('http://test.com/Tools')
      url.hash = `data=${uriEncodedData}`

      const result = callback.watcher({ baseUrl: url.toString() })
      expect(result).toEqual(testData)
    })

    it('should handle hash without # prefix', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }

      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()
      const uriEncodedData = encodeURI(encryptedData)

      // Mock URL constructor to return an object with hash that doesn't start with "#"
      // This tests the branch where rawHash doesn't start with "#"
      const OriginalURL = global.URL
      global.URL = class MockURL {
        searchParams: URLSearchParams
        private _hash: string
        constructor(url: string) {
          this.searchParams = new URLSearchParams()
          // Extract hash from URL string, but store it without "#" prefix
          const hashMatch = url.match(/#(.+)$/)
          this._hash = hashMatch ? hashMatch[1] : ''
        }
        get hash() {
          // Return hash without "#" prefix to test the uncovered branch
          return this._hash
        }
        toString() {
          return `http://test.com/Tools${this._hash ? '#' + this._hash : ''}`
        }
      } as any

      try {
        const baseUrlWithHash = `http://test.com/Tools#data=${uriEncodedData}`
        const result = callback.watcher({ baseUrl: baseUrlWithHash })
        expect(result).toEqual(testData)
      } finally {
        global.URL = OriginalURL
      }
    })

    it('should handle hash without # prefix and without data= prefix', () => {
      const callback = useCallback(mockConfig)
      
      // Mock URL constructor to return an object with hash that doesn't start with "#"
      // and doesn't start with "data=" to test the uncovered branch at line 133
      const OriginalURL = global.URL
      global.URL = class MockURL {
        searchParams: URLSearchParams
        private _hash: string
        constructor(url: string) {
          this.searchParams = new URLSearchParams()
          // Extract hash from URL string, but store it without "#" prefix
          const hashMatch = url.match(/#(.+)$/)
          this._hash = hashMatch ? hashMatch[1] : ''
        }
        get hash() {
          // Return hash without "#" prefix and without "data=" prefix
          return this._hash
        }
        toString() {
          return `http://test.com/Tools${this._hash ? '#' + this._hash : ''}`
        }
      } as any

      try {
        // URL with hash that doesn't start with "#" and doesn't start with "data="
        const baseUrlWithHash = `http://test.com/Tools#someOtherHash=value`
        const result = callback.watcher({ baseUrl: baseUrlWithHash })
        // Should return undefined since there's no valid data
        expect(result).toBeUndefined()
      } finally {
        global.URL = OriginalURL
      }
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

    it('should work without window (server-side) when dataToParse is provided', () => {
      const originalWindow = global.window
      // @ts-ignore - removing window to simulate server-side
      delete global.window

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

      // Restore window
      global.window = originalWindow
    })

    it('should return undefined on server-side when no data source is provided', () => {
      const originalWindow = global.window
      // @ts-ignore - removing window to simulate server-side
      delete global.window

      const callback = useCallback(mockConfig)
      const result = callback.watcher()
      expect(result).toBeUndefined()

      // Restore window
      global.window = originalWindow
    })

    it('should skip current URL when skipCurrentUrl is true but still use dataToParse', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()

      // When skipCurrentUrl is true, baseUrl is ignored, so we need to use dataToParse
      const result = callback.watcher({ skipCurrentUrl: true, dataToParse: encryptedData })
      expect(result).toEqual(testData)
    })

    it('should handle invalid URL gracefully in watcher', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()

      // Provide invalid URL as baseUrl - should fall back to dataToParse
      const result = callback.watcher({ 
        baseUrl: 'not-a-valid-url',
        dataToParse: encryptedData 
      })
      expect(result).toEqual(testData)
    })

    it('should return undefined when URL parsing fails and no dataToParse is provided', () => {
      const callback = useCallback(mockConfig)
      
      // Provide invalid URL without dataToParse
      const result = callback.watcher({ baseUrl: 'not-a-valid-url' })
      expect(result).toBeUndefined()
    })

    it('should handle URL with no hash (null/undefined hash)', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const testData = {
        actions: testActions,
        sender: 'http://test.com/Tools',
        type: 'test'
      }
      
      // Create URL with data in search params but no hash
      const stringifiedData = JSON.stringify(testData)
      const encryptedData = AES.encrypt(stringifiedData, mockConfig.encryptionKey).toString()
      
      // Mock URL constructor to return an object with hash as null/undefined
      const OriginalURL = global.URL
      global.URL = class MockURL {
        searchParams: URLSearchParams
        constructor(url: string) {
          this.searchParams = new URLSearchParams()
          // Parse search params from URL string manually
          const searchMatch = url.match(/\?([^#]*)/)
          if (searchMatch) {
            searchMatch[1].split('&').forEach(param => {
              const [key, value] = param.split('=')
              if (key) {
                this.searchParams.set(key, decodeURIComponent(value || ''))
              }
            })
          }
        }
        get hash() {
          // Return null to test the nullish coalescing on line 127
          return null as any
        }
        toString() {
          const search = this.searchParams.toString()
          return `http://test.com/Tools${search ? '?' + search : ''}`
        }
      } as any

      try {
        const baseUrl = `http://test.com/Tools?data=${encodeURI(encryptedData)}`
        const result = callback.watcher({ baseUrl })
        expect(result).toEqual(testData)
      } finally {
        global.URL = OriginalURL
      }
    })
  })

  describe('generateUrl function', () => {
    it('should generate a URL with encrypted data', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const targetUrl = 'http://test.com/c'
      const sendType = 'forUpc'
      const sender = 'http://test.com/Tools'

      const generatedUrl = callback.generateUrl(targetUrl, testActions, sendType, sender)
      const url = new URL(generatedUrl)

      expect(url.origin + url.pathname).toBe(targetUrl)
      expect(url.hash).not.toBe('')

      // Verify the encrypted data can be decrypted
      const encryptedData = url.hash.startsWith('#data=')
        ? url.hash.slice('#data='.length)
        : ''
      const decryptedData = callback.parse(encryptedData)
      expect(decryptedData).toEqual({
        actions: testActions,
        sender,
        type: sendType
      })
    })

    it('should use window.location.href as default sender on client-side', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const targetUrl = 'http://test.com/c'
      const sendType = 'forUpc'

      const generatedUrl = callback.generateUrl(targetUrl, testActions, sendType)
      const url = new URL(generatedUrl)

      const encryptedData = url.hash.startsWith('#data=')
        ? url.hash.slice('#data='.length)
        : ''
      const decryptedData = callback.parse(encryptedData)
      
      // Should use window.location.href (mocked to 'http://test.com/Tools/Update')
      // which gets normalized to 'http://test.com/Tools'
      expect(decryptedData.sender).toBe('http://test.com/Tools')
    })

    it('should use empty string as default sender on server-side', () => {
      const originalWindow = global.window
      // @ts-ignore - removing window to simulate server-side
      delete global.window

      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const targetUrl = 'http://test.com/c'
      const sendType = 'forUpc'

      const generatedUrl = callback.generateUrl(targetUrl, testActions, sendType)
      const url = new URL(generatedUrl)

      const encryptedData = url.hash.startsWith('#data=')
        ? url.hash.slice('#data='.length)
        : ''
      const decryptedData = callback.parse(encryptedData)
      
      // Should use empty string when window is not available
      expect(decryptedData.sender).toBe('')

      // Restore window
      global.window = originalWindow
    })

    it('should work with different URL formats', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      
      const urls = [
        'http://test.com/c',
        'https://example.com/Tools',
        'https://server.local:8080/c'
      ]

      urls.forEach(targetUrl => {
        const generatedUrl = callback.generateUrl(targetUrl, testActions, 'forUpc', 'http://sender.com')
        const url = new URL(generatedUrl)
        
        expect(url.origin + url.pathname).toBe(targetUrl)
        expect(url.hash).not.toBe('')
      })
    })

    it('should preserve URL query parameters', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const targetUrl = 'http://test.com/c?existing=param'

      const generatedUrl = callback.generateUrl(targetUrl, testActions, 'forUpc', 'http://sender.com')
      const url = new URL(generatedUrl)

      expect(url.searchParams.get('existing')).toBe('param')
      expect(url.hash).not.toBe('')
    })

    it('should preserve URL path in generateUrl (no normalization)', () => {
      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const targetUrl = 'http://test.com/Tools/Update'

      const generatedUrl = callback.generateUrl(targetUrl, testActions, 'forUpc', 'http://sender.com')
      const url = new URL(generatedUrl)

      // generateUrl does not normalize URLs (unlike send which does)
      expect(url.pathname).toBe('/Tools/Update')
      expect(url.hash).not.toBe('')
    })

    it('should handle empty payload arrays', () => {
      const callback = useCallback(mockConfig)
      const emptyActions: ExternalSignOut[] = []
      const targetUrl = 'http://test.com/c'

      const generatedUrl = callback.generateUrl(targetUrl, emptyActions, 'forUpc', 'http://sender.com')
      const url = new URL(generatedUrl)
      const encryptedData = url.hash.startsWith('#data=')
        ? url.hash.slice('#data='.length)
        : ''
      const decryptedData = callback.parse(encryptedData)

      expect(decryptedData).toEqual({
        actions: [],
        sender: 'http://sender.com',
        type: 'forUpc'
      })
    })

    it('should support query parameter mode in generateUrl when useHash is false', () => {
      const callback = useCallback({ encryptionKey: 'test-key', useHash: false })
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const targetUrl = 'http://test.com/c'
      const sendType = 'forUpc'
      const sender = 'http://test.com/Tools'

      const generatedUrl = callback.generateUrl(targetUrl, testActions, sendType, sender)
      const url = new URL(generatedUrl)

      expect(url.origin + url.pathname).toBe(targetUrl)
      expect(url.searchParams.has('data')).toBe(true)

      const encryptedData = url.searchParams.get('data') || ''
      const decryptedData = callback.parse(encryptedData)
      expect(decryptedData).toEqual({
        actions: testActions,
        sender,
        type: sendType
      })
    })
  })

  describe('SSR compatibility', () => {
    it('should throw error when send() is called on server-side', () => {
      const originalWindow = global.window
      // @ts-ignore - removing window to simulate server-side
      delete global.window

      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]

      expect(() => {
        callback.send('http://test.com/Tools', testActions, null, 'test', 'http://sender.com')
      }).toThrow('send() can only be called on the client side')

      // Restore window
      global.window = originalWindow
    })

    it('should allow parse() to work on server-side', () => {
      const originalWindow = global.window
      // @ts-ignore - removing window to simulate server-side
      delete global.window

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

      // Restore window
      global.window = originalWindow
    })

    it('should allow generateUrl() to work on server-side', () => {
      const originalWindow = global.window
      // @ts-ignore - removing window to simulate server-side
      delete global.window

      const callback = useCallback(mockConfig)
      const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
      const targetUrl = 'http://test.com/c'
      const sender = 'http://sender.com'

      const generatedUrl = callback.generateUrl(targetUrl, testActions, 'forUpc', sender)
      const url = new URL(generatedUrl)

      expect(url.origin + url.pathname).toBe(targetUrl)
      expect(url.hash).not.toBe('')

      // Restore window
      global.window = originalWindow
    })
  })
}) 
