import type { CallbackConfig, QueryPayloads, SendPayloads, WatcherOptions, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, ExternalActions, UpcActions, ExternalPayload, UpcPayload } from "./types.js";
export declare const useCallback: (config: CallbackConfig) => {
    send: (url: string, payload: SendPayloads, redirectType?: "newTab" | "replace" | null, sendType?: string, sender?: string) => void;
    parse: (data: string, options?: {
        isDataURIEncoded?: boolean;
    }) => QueryPayloads;
    watcher: (options?: WatcherOptions) => QueryPayloads | undefined;
};
export type { CallbackConfig, QueryPayloads, SendPayloads, WatcherOptions, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, ExternalActions, UpcActions, ExternalPayload, UpcPayload, };
