# @unraid/shared-callbacks

A TypeScript package for handling callbacks in Unraid applications. This package provides a flexible and type-safe way to handle encrypted callbacks between different parts of the Unraid ecosystem.

## Features

- Type-safe callback handling
- AES encryption/decryption of payloads
- Support for various callback types (sign in, sign out, key actions, etc.)
- Flexible URL handling with support for different redirect types

## Installation

```bash
pnpm add @unraid/shared-callbacks
```

## Usage

```typescript
import { createCallback } from '@unraid/shared-callbacks';

const callback = createCallback({
  encryptionKey: 'your-encryption-key',
  // Optional: when true (default), encrypted data is stored in the hash
  // instead of the `data` query parameter.
  useHash: true,
});

// Send encrypted callbacks (client-only)
callback.send('https://example.com/callback', [
  {
    type: 'signIn',
    apiKey: 'your-api-key',
    user: {
      // user info
    }
  }
]);

// Watch for incoming callbacks (client-only)
const decrypted = callback.watcher();
```

## API

### Types

- `SignIn`, `SignOut`, `OemSignOut`, etc. - Various callback action types
- `ServerData` - Server information structure
- `UserInfo` - User information structure
- `ExternalActions` - Union type of all external actions
- `UpcActions` - Union type of all UPC actions
- `QueryPayloads` - Union type of all payload types

### Store Interface

```typescript
interface CallbackStore {
  send: (url: string, payload: SendPayloads, redirectType?: 'newTab' | 'replace', sendType?: string) => void;
  watcher: () => void;
}
```

### CallbackActionsStore Interface

```typescript
interface CallbackActionsStore {
  saveCallbackData: (decryptedData: QueryPayloads) => void;
  encryptionKey: string;
  sendType: 'fromUpc' | 'forUpc';
}
```

### URL format configuration

By default, encrypted callback data is now placed in the URL hash (fragment) rather than a query parameter to help prevent sensitive data from being sent in referrers.

You can control this behavior via the `CallbackConfig` passed to `createCallback`:

```ts
interface CallbackConfig {
  encryptionKey: string;
  /**
   * When true (default), encrypted data is stored in the URL hash.
   * Set to false to store encrypted data in the `data` query parameter instead.
   */
  useHash?: boolean;
}
```

Parsing helpers (`parse`, `watcher`) support both formats and will read encrypted data from either the hash or the `data` query parameter.

### Server / client entrypoints

To make SSR / Workers usage explicit and safe, the package also exposes split entrypoints:

- `@unraid/shared-callbacks/client` – exports `createCallback` (send, watcher, parse, generateUrl) and all types. This is intended for browser/client-only code.
- `@unraid/shared-callbacks/client` – exports `createCallback` (send, watcher, parse, generateUrl) and all types. This is intended for browser/client-only code.
- `@unraid/shared-callbacks/server` – exports `createServerCallback`, which exposes only `parse` and `generateUrl` and never touches browser globals.

Example server usage:

```ts
import {
  createServerCallback,
  type CallbackConfig,
} from '@unraid/shared-callbacks/server';

const config: CallbackConfig = {
  encryptionKey: 'your-encryption-key',
};

const { parse, generateUrl } = createServerCallback(config);
```
