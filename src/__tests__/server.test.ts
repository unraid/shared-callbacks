import { describe, it, expect } from 'vitest'
import { createServerCallback } from '../server'
import type { ServerPayload } from '../types'

describe('createServerCallback (server entry)', () => {
  const config = {
    encryptionKey: 'test-key',
  }

  it('should round-trip data via generateUrl and parse without using window', () => {
    const { parse, generateUrl } = createServerCallback(config)
    const testActions: ServerPayload[] = [
      {
        type: 'signIn',
        server: {
          connectPluginVersion: '2024.05.06.1049',
          connectState: 'CONNECTED',
          guid: 'test-guid',
          registered: false,
          state: 'ENOCONN',
        },
      },
    ]
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

  it('should default sender to an empty string when generateUrl omits it', () => {
    const { parse, generateUrl } = createServerCallback(config)
    const testActions: ServerPayload[] = [
      {
        type: 'signIn',
        server: {
          connectPluginVersion: '2024.05.06.1049',
          connectState: 'CONNECTED',
          guid: 'test-guid',
          registered: false,
          state: 'ENOCONN',
        },
      },
    ]

    const generatedUrl = generateUrl('http://test.com/c', testActions, 'forUpc')
    const url = new URL(generatedUrl)
    const encryptedData = url.hash.startsWith('#data=')
      ? url.hash.slice('#data='.length)
      : url.searchParams.get('data') || ''

    expect(parse(encryptedData)).toEqual({
      actions: testActions,
      sender: '',
      type: 'forUpc',
    })
  })
})
