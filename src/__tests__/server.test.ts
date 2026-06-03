import { describe, it, expect } from 'vitest'
import {
  createCommunityAppsInstalledAppHash,
  createServerCallback,
} from '../server'
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
          mode: 'lookup',
          salt: 'launch-salt',
        },
        installAction: {
          mode: 'postMessage',
          method: 'requestInstall',
          type: 'communityApps.installDocker',
        },
        path: '/apps',
        theme: {
          colorMode: 'dark',
          dark: {
            '--color-base-100': '#101014',
            '--color-primary': 'oklch(62% 0.21 252)',
          },
          light: {
            '--color-base-100': '#ffffff',
            '--color-primary': '#0066cc',
          },
          shared: {
            '--radius-box': '0.375rem',
          },
        },
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

  it('should create fixed-length Community Apps installed app hashes', () => {
    const first = createCommunityAppsInstalledAppHash('https://example.com/template.xml', 'launch-salt')
    const second = createCommunityAppsInstalledAppHash('https://example.com/template.xml', 'other-salt')

    expect(first).toHaveLength(22)
    expect(first).toMatch(/^[A-Za-z0-9_-]{22}$/)
    expect(second).toHaveLength(22)
    expect(second).not.toBe(first)
  })
})
