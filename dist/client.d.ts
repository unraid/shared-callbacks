import type { CallbackConfig, QueryPayloads, SendPayloads, WatcherOptions, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, CommunityApps, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ConnectState, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, CommunityAppsInstalledAppsAlgorithm, CommunityAppsInstalledAppsMode, CommunityAppsInstalledAppHash, CommunityAppsInstalledAppStatusMap, CommunityAppsInstalledAppsBatch, CommunityAppsInstalledAppsLookup, CommunityAppsInstalledApps, CommunityAppsInstalledAppStatusRequest, CommunityAppsInstalledAppStatusResponse, CommunityAppsLaunch, ExternalActions, UpcActions, ExternalPayload, UpcPayload } from "./types.js";
import { CommunityAppsInstalledAppStatus } from "./types.js";
export { COMMUNITY_APPS_INSTALLED_APP_HASH_LENGTH, COMMUNITY_APPS_INSTALLED_APPS_ALGORITHM, createCommunityAppsInstalledAppHash, isCommunityAppsInstalledAppHash, } from "./community-apps.js";
export { createCommunityAppsInstalledAppsHostBridge, type CommunityAppsInstalledAppsHostBridge, type CommunityAppsInstalledAppsHostMethods, type CreateCommunityAppsInstalledAppsHostBridgeOptions, } from "./community-apps-client.js";
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
export { CommunityAppsInstalledAppStatus };
export type { CallbackConfig, QueryPayloads, SendPayloads, WatcherOptions, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, CommunityApps, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ConnectState, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, CommunityAppsInstalledAppsAlgorithm, CommunityAppsInstalledAppsMode, CommunityAppsInstalledAppHash, CommunityAppsInstalledAppStatusMap, CommunityAppsInstalledAppsBatch, CommunityAppsInstalledAppsLookup, CommunityAppsInstalledApps, CommunityAppsInstalledAppStatusRequest, CommunityAppsInstalledAppStatusResponse, CommunityAppsLaunch, ExternalActions, UpcActions, ExternalPayload, UpcPayload, };
