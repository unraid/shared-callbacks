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
import {
  appendEncryptedDataToUrl,
  createEncryptedPayload,
  parseEncryptedPayload,
} from "./core";

export const createCallback = (config: CallbackConfig) => {
  const shouldUseHash = config.useHash !== false;

  const send = (
    url: string,
    payload: SendPayloads,
    redirectType?: "newTab" | "replace" | null,
    sendType?: string,
    sender?: string
  ) => {
    if (typeof window === "undefined") {
      throw new Error("send() can only be called on the client side");
    }

    const defaultSender =
      sender ?? window.location.href.replace("/Tools/Update", "/Tools");

    const encryptedMessage = createEncryptedPayload(
      payload,
      defaultSender,
      sendType,
      config.encryptionKey
    );

    const destinationUrl = appendEncryptedDataToUrl(
      url.replace("/Tools/Update", "/Tools"),
      encryptedMessage,
      shouldUseHash
    );

    if (redirectType === "newTab") {
      window.open(destinationUrl, "_blank");
      return;
    }
    if (redirectType === "replace") {
      window.location.replace(destinationUrl);
      return;
    }
    window.location.href = destinationUrl;
  };

  const parse = (
    data: string,
    options?: { isDataURIEncoded?: boolean }
  ): QueryPayloads => {
    return parseEncryptedPayload(data, config.encryptionKey, options);
  };

  const watcher = (
    options: WatcherOptions = {}
  ): QueryPayloads | undefined => {
    let urlToParse = "";

    if (options?.baseUrl && !options.skipCurrentUrl) {
      urlToParse = options.baseUrl;
    } else if (
      typeof window !== "undefined" &&
      window.location &&
      !options.skipCurrentUrl
    ) {
      urlToParse = window.location.toString();
    } else if (!options?.dataToParse && !options?.baseUrl) {
      return undefined;
    }

    const uriDecodedEncryptedData = options?.dataToParse
      ? decodeURI(options.dataToParse)
      : (() => {
          try {
            const currentUrl = new URL(urlToParse);

            const searchParamData =
              currentUrl.searchParams.get("data") ?? "";

            let hashData = "";
            const rawHash = currentUrl.hash ?? "";
            if (rawHash) {
              const hashWithoutHash = rawHash.startsWith("#")
                ? rawHash.slice(1)
                : rawHash;

              if (hashWithoutHash.startsWith("data=")) {
                hashData = hashWithoutHash.slice("data=".length);
              }
            }

            const dataFromUrl = searchParamData || hashData;
            return decodeURI(dataFromUrl);
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
    const defaultSender =
      sender ??
      (typeof window !== "undefined"
        ? window.location.href.replace("/Tools/Update", "/Tools")
        : "");

    const encryptedMessage = createEncryptedPayload(
      payload,
      defaultSender,
      sendType,
      config.encryptionKey
    );

    return appendEncryptedDataToUrl(url, encryptedMessage, shouldUseHash);
  };

  return {
    send,
    parse,
    watcher,
    generateUrl,
  };
};

/**
 * Backwards-compatible alias for older consumers.
 * This no longer returns a shared singleton; it is a plain factory.
 */
export const useCallback = createCallback;

// Re-export all types for convenience from the client entry.
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
