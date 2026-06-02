import { describe, it, expect } from 'vitest'
import { CommunityAppsInstalledAppStatus, createServerCallback } from '../server'
import type { CommunityAppsLaunch, ServerPayload } from '../types'

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

  it('should round-trip a Community Apps launch action', () => {
    const { parse, generateUrl } = createServerCallback(config)
    const testActions: CommunityAppsLaunch[] = [
      {
        type: 'communityApps',
        server: {
          connectPluginVersion: '2024.05.06.1049',
          connectState: 'CONNECTED',
          guid: 'test-guid',
          name: 'Tower',
          osVersion: '7.2.0',
          registered: true,
          state: 'STARTER',
        },
        installUrlTemplate: '/Apps/AddContainer?xmlTemplate={templateUrl}',
        installTarget: '_top',
        installedApps: {
          enabled: true,
          algorithm: 'sha256-128',
          salt: 'launch-salt',
          apps: {
            'a23456789012345678901A': CommunityAppsInstalledAppStatus.Installed,
            'b23456789012345678901B': CommunityAppsInstalledAppStatus.PreviouslyInstalled,
          },
        },
        path: '/apps',
        theme: 'dark',
      },
    ]

    const generatedUrl = generateUrl('https://ca.unraid.net/apps', testActions, 'fromUpc', 'https://tower.local/redirect?target=%2Fapps')
    const url = new URL(generatedUrl)
    const encryptedData = url.hash.startsWith('#data=')
      ? url.hash.slice('#data='.length)
      : url.searchParams.get('data') || ''

    expect(parse(encryptedData)).toEqual({
      actions: testActions,
      sender: 'https://tower.local/redirect?target=%2Fapps',
      type: 'fromUpc',
    })
  })
})
