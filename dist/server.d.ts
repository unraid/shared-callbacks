import type { CallbackConfig, QueryPayloads, SendPayloads, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, CommunityApps, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ConnectState, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, CommunityAppsInstalledAppsAlgorithm, CommunityAppsInstalledAppHash, CommunityAppsInstalledAppStatusMap, CommunityAppsInstalledApps, CommunityAppsLaunch, ExternalActions, UpcActions, ExternalPayload, UpcPayload } from "./types.js";
import { CommunityAppsInstalledAppStatus } from "./types.js";
/**
 * Server-safe factory that exposes only parse and generateUrl.
 *
 * Uses only AES/UTF-8 helpers and never touches browser globals, making this
 * entrypoint safe to import in server/worker (e.g. Cloudflare Workers) code.
 */
export declare const createServerCallback: (config: CallbackConfig) => {
    parse: (data: string, options?: {
        isDataURIEncoded?: boolean;
    }) => QueryPayloads;
    generateUrl: (url: string, payload: SendPayloads, sendType?: string, sender?: string) => string;
};
export { CommunityAppsInstalledAppStatus };
export type { CallbackConfig, QueryPayloads, SendPayloads, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, CommunityApps, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ConnectState, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, CommunityAppsInstalledAppsAlgorithm, CommunityAppsInstalledAppHash, CommunityAppsInstalledAppStatusMap, CommunityAppsInstalledApps, CommunityAppsLaunch, ExternalActions, UpcActions, ExternalPayload, UpcPayload, };
