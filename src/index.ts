import AES from "crypto-js/aes.js";
import Utf8 from "crypto-js/enc-utf8.js";
import { createSharedComposable } from "@vueuse/core";
import type {
  CallbackConfig,
  QueryPayloads,
  SendPayloads,
  WatcherOptions,
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

/**
 * Encrypts a string using AES encryption
 */
const encryptData = (data: string, encryptionKey: string): string => {
  return AES.encrypt(data, encryptionKey).toString();
};

/**
 * Decrypts an encrypted string using AES decryption
 */
const decryptData = (encryptedData: string, encryptionKey: string): string => {
  const decryptedMessage = AES.decrypt(encryptedData, encryptionKey);

  let decryptedString: string;
  try {
    decryptedString = decryptedMessage.toString(Utf8);
  } catch (e) {
    // Catch errors during UTF-8 conversion (likely due to bad decryption)
    throw new Error('Decryption failed. Invalid key or corrupt data.');
  }

  // Check if decryption resulted in an empty string (another failure case)
  if (!decryptedString) {
    throw new Error('Decryption failed. Invalid key or corrupt data.');
  }

  return decryptedString;
};

/**
 * Stringifies a payload into the standard callback data format
 */
const stringifyPayload = (
  payload: SendPayloads,
  sender: string,
  sendType?: string
): string => {
  return JSON.stringify({
    actions: [...payload],
    sender,
    type: sendType,
  });
};

/**
 * Creates an encrypted data string from a payload
 */
const createEncryptedPayload = (
  payload: SendPayloads,
  sender: string,
  sendType: string | undefined,
  encryptionKey: string
): string => {
  const stringifiedData = stringifyPayload(payload, sender, sendType);
  return encryptData(stringifiedData, encryptionKey);
};

const _useCallback = (config: CallbackConfig) => {
  const send = (
    url: string,
    payload: SendPayloads,
    redirectType?: "newTab" | "replace" | null,
    sendType?: string,
    sender?: string
  ) => {
    // send() requires browser APIs and is client-only
    if (typeof window === "undefined") {
      throw new Error("send() can only be called on the client side");
    }

    const defaultSender = sender ?? window.location.href.replace("/Tools/Update", "/Tools");
    const encryptedMessage = createEncryptedPayload(
      payload,
      defaultSender,
      sendType,
      config.encryptionKey
    );

    const destinationUrl = new URL(url.replace("/Tools/Update", "/Tools"));
    destinationUrl.searchParams.set("data", encodeURI(encryptedMessage));

    if (redirectType === "newTab") {
      window.open(destinationUrl.toString(), "_blank");
      return;
    }
    if (redirectType === "replace") {
      window.location.replace(destinationUrl.toString());
      return;
    }
    window.location.href = destinationUrl.toString();
  };

  const parse = (data: string, options?: { isDataURIEncoded?: boolean }) => {
    const dataToParse: string = options?.isDataURIEncoded
      ? decodeURI(data)
      : data;
    
    const decryptedString = decryptData(dataToParse, config.encryptionKey);

    try {
      const decryptedData: QueryPayloads = JSON.parse(decryptedString);
      return decryptedData;
    } catch (e) {
      // Catch potential JSON parse errors even if decryption seemed successful
      throw new Error('Failed to parse decrypted data.');
    }
  };

  const watcher = (options: WatcherOptions = {}): QueryPayloads | undefined => {
    let urlToParse: string = "";
    if (options?.baseUrl && !options.skipCurrentUrl) {
      urlToParse = options.baseUrl;
    } else if (typeof window !== "undefined" && window.location && !options.skipCurrentUrl) {
      urlToParse = window.location.toString();
    } else if (!options?.dataToParse && !options?.baseUrl) {
      // If no window and no explicit data/baseUrl provided, return undefined
      return undefined;
    }

    // If we have dataToParse, use it directly; otherwise parse from URL
    const uriDecodedEncryptedData = options?.dataToParse 
      ? decodeURI(options.dataToParse)
      : (() => {
          try {
            const currentUrl = new URL(urlToParse);
            return decodeURI(currentUrl.searchParams.get("data") ?? "");
          } catch {
            return "";
          }
        })();

    if (!uriDecodedEncryptedData) {
      return undefined;
    }

    return parse(uriDecodedEncryptedData);
  };

  const generateUrl = (
    url: string,
    payload: SendPayloads,
    sendType?: string,
    sender?: string
  ): string => {
    // generateUrl() works on both server and client
    // If no sender provided and we're on client, use window.location; otherwise use empty string
    const defaultSender = sender ?? (
      typeof window !== "undefined" 
        ? window.location.href.replace("/Tools/Update", "/Tools")
        : ""
    );

    const encryptedMessage = createEncryptedPayload(
      payload,
      defaultSender,
      sendType,
      config.encryptionKey
    );

    const destinationUrl = new URL(url);
    destinationUrl.searchParams.set("data", encodeURI(encryptedMessage));

    return destinationUrl.toString();
  };

  return {
    send,
    parse,
    watcher,
    generateUrl,
  };
};

export const useCallback = createSharedComposable(_useCallback);

// Re-export all types
export type {
  CallbackConfig,
  QueryPayloads,
  SendPayloads,
  WatcherOptions,
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
