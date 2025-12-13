import type { CallbackConfig, QueryPayloads, SendPayloads, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, ExternalActions, UpcActions, ExternalPayload, UpcPayload } from "./types.js";
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
export type { CallbackConfig, QueryPayloads, SendPayloads, SignIn, SignOut, OemSignOut, Troubleshoot, Recover, Replace, TrialExtend, TrialStart, Purchase, Redeem, Renew, Upgrade, UpdateOs, DowngradeOs, Manage, MyKeys, LinkKey, Activate, AccountActionTypes, AccountKeyActionTypes, PurchaseActionTypes, ServerActionTypes, ServerState, ServerData, UserInfo, ExternalSignIn, ExternalSignOut, ExternalKeyActions, ExternalUpdateOsAction, ServerPayload, ServerTroubleshoot, ExternalActions, UpcActions, ExternalPayload, UpcPayload, };
