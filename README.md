# @unraid/callback

A TypeScript package for handling callbacks in Unraid applications. This package provides a flexible and type-safe way to handle encrypted callbacks between different parts of the Unraid ecosystem.

## Features

- Type-safe callback handling
- AES encryption/decryption of payloads
- Pinia store integration
- Support for various callback types (sign in, sign out, key actions, etc.)
- Flexible URL handling with support for different redirect types

## Installation

```bash
pnpm add @unraid/callback
```

## Usage

```typescript
import { createCallbackStore, CallbackActionsStore } from '@unraid/callback';

// Define your callback actions store
const useCallbackActions = (): CallbackActionsStore => ({
  saveCallbackData: (decryptedData) => {
    // Handle the decrypted callback data
    console.log(decryptedData);
  },
  encryptionKey: 'your-encryption-key',
  sendType: 'forUpc'
});

// Create the callback store
const callbackStore = createCallbackStore(useCallbackActions);

// Use the store to send callbacks
callbackStore.send('https://example.com/callback', [
  {
    type: 'signIn',
    apiKey: 'your-api-key',
    user: {
      // user info
    }
  }
]);

// Watch for incoming callbacks
callbackStore.watcher();
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

## License

MIT 