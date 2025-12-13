import { describe, it, expect } from 'vitest'
import { createServerCallback } from '../server'
import type { ExternalSignOut } from '../types'

describe('createServerCallback (server entry)', () => {
  const config = {
    encryptionKey: 'test-key',
  }

  it('should round-trip data via generateUrl and parse without using window', () => {
    const { parse, generateUrl } = createServerCallback(config)
    const testActions: ExternalSignOut[] = [{ type: 'signOut' }]
    const targetUrl = 'http://test.com/c'
    const sendType = 'forUpc'
    const sender = 'http://sender.com'

    const generatedUrl = generateUrl(targetUrl, testActions, sendType, sender)
    const url = new URL(generatedUrl)

    const encryptedData = url.hash.startsWith('#data=')
      ? url.hash.slice('#data='.length)
      : url.searchParams.get('data') || ''

    const decrypted = parse(encryptedData)

    expect(decrypted).toEqual({
      actions: testActions,
      sender,
      type: sendType,
    })
  })
})

