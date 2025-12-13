import type {
  CallbackConfig,
  QueryPayloads,
  SendPayloads,
  SignIn,
  SignOut,
  OemSignOut,
  Troubleshoot,
  Recover,
  Replace,
  TrialExtend,
  TrialStart,
  Purchase,
  Redeem,
  Renew,
  Upgrade,
  UpdateOs,
  DowngradeOs,
  Manage,
  MyKeys,
  LinkKey,
  Activate,
  AccountActionTypes,
  AccountKeyActionTypes,
  PurchaseActionTypes,
  ServerActionTypes,
  ServerState,
  ServerData,
  UserInfo,
  ExternalSignIn,
  ExternalSignOut,
  ExternalKeyActions,
  ExternalUpdateOsAction,
  ServerPayload,
  ServerTroubleshoot,
  ExternalActions,
  UpcActions,
  ExternalPayload,
  UpcPayload,
} from "./types.js";
import {
  appendEncryptedDataToUrl,
  createEncryptedPayload,
  parseEncryptedPayload,
} from "./core.js";

/**
 * Server-safe factory that exposes only parse and generateUrl.
 *
 * Uses only AES/UTF-8 helpers and never touches browser globals, making this
 * entrypoint safe to import in server/worker (e.g. Cloudflare Workers) code.
 */
export const createServerCallback = (config: CallbackConfig) => {
  const parse = (
    data: string,
    options?: { isDataURIEncoded?: boolean }
  ): QueryPayloads => {
    return parseEncryptedPayload(data, config.encryptionKey, options);
  };

  const generateUrl = (
    url: string,
    payload: SendPayloads,
    sendType?: string,
    sender?: string
  ): string => {
    const effectiveSender = sender ?? "";
    const encryptedMessage = createEncryptedPayload(
      payload,
      effectiveSender,
      sendType,
      config.encryptionKey
    );

    const shouldUseHash = config.useHash !== false;
    return appendEncryptedDataToUrl(url, encryptedMessage, shouldUseHash);
  };

  return {
    parse,
    generateUrl,
  };
};

// Re-export all types for convenience from the server entry.
export type {
  CallbackConfig,
  QueryPayloads,
  SendPayloads,
  SignIn,
  SignOut,
  OemSignOut,
  Troubleshoot,
  Recover,
  Replace,
  TrialExtend,
  TrialStart,
  Purchase,
  Redeem,
  Renew,
  Upgrade,
  UpdateOs,
  DowngradeOs,
  Manage,
  MyKeys,
  LinkKey,
  Activate,
  AccountActionTypes,
  AccountKeyActionTypes,
  PurchaseActionTypes,
  ServerActionTypes,
  ServerState,
  ServerData,
  UserInfo,
  ExternalSignIn,
  ExternalSignOut,
  ExternalKeyActions,
  ExternalUpdateOsAction,
  ServerPayload,
  ServerTroubleshoot,
  ExternalActions,
  UpcActions,
  ExternalPayload,
  UpcPayload,
};
