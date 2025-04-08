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

const _useCallback = (config: CallbackConfig) => {
  const send = (
    url: string,
    payload: SendPayloads,
    redirectType?: "newTab" | "replace" | null,
    sendType?: string,
    sender?: string
  ) => {
    const stringifiedData = JSON.stringify({
      actions: [...payload],
      sender: sender ?? window.location.href.replace("/Tools/Update", "/Tools"),
      type: sendType,
    });

    const encryptedMessage = AES.encrypt(
      stringifiedData,
      config.encryptionKey
    ).toString();

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
    const decryptedMessage = AES.decrypt(dataToParse, config.encryptionKey);

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
    } else if (window && window.location && !options.skipCurrentUrl) {
      urlToParse = window.location.toString();
    }

    const currentUrl = new URL(urlToParse);
    const uriDecodedEncryptedData = decodeURI(
      options?.dataToParse ?? currentUrl?.searchParams.get("data") ?? ""
    );

    if (!uriDecodedEncryptedData) {
      return undefined;
    }

    return parse(uriDecodedEncryptedData);
  };

  return {
    send,
    parse,
    watcher,
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
