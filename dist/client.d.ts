import type { CallbackConfig, QueryPayloads, SendPayloads, WatcherOptions, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, ExternalActions, UpcActions, ExternalPayload, UpcPayload } from "./types.js";
export declare const createCallback: (config: CallbackConfig) => {
    send: (url: string, payload: SendPayloads, redirectType?: "newTab" | "replace" | null, sendType?: string, sender?: string) => void;
    parse: (data: string, options?: {
        isDataURIEncoded?: boolean;
    }) => QueryPayloads;
    watcher: (options?: WatcherOptions) => QueryPayloads | undefined;
    generateUrl: (url: string, payload: SendPayloads, sendType?: string, sender?: string) => string;
};
/**
 * Backwards-compatible alias for older consumers.
 * This no longer returns a shared singleton; it is a plain factory.
 */
export declare const useCallback: (config: CallbackConfig) => {
    send: (url: string, payload: SendPayloads, redirectType?: "newTab" | "replace" | null, sendType?: string, sender?: string) => void;
    parse: (data: string, options?: {
        isDataURIEncoded?: boolean;
    }) => QueryPayloads;
    watcher: (options?: WatcherOptions) => QueryPayloads | undefined;
    generateUrl: (url: string, payload: SendPayloads, sendType?: string, sender?: string) => string;
};
export type { CallbackConfig, QueryPayloads, SendPayloads, WatcherOptions, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, ExternalActions, UpcActions, ExternalPayload, UpcPayload, };
