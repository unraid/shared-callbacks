import type { CommunityAppsInstalledAppStatusRequest, CommunityAppsInstalledAppStatusResponse } from "./types.js";
export type CommunityAppsInstalledAppsHostMethods = {
    getInstalledAppStatuses: (request: CommunityAppsInstalledAppStatusRequest) => CommunityAppsInstalledAppStatusResponse | Promise<CommunityAppsInstalledAppStatusResponse>;
};
export type CommunityAppsInstalledAppsHostBridge = {
    close: () => void;
};
export type CreateCommunityAppsInstalledAppsHostBridgeOptions = {
    iframeWindow: Window;
    iframeOrigin: string;
    methods: CommunityAppsInstalledAppsHostMethods;
    localWindow?: Window;
    maxHandshakeAttempts?: number;
    handshakeAttemptIntervalMs?: number;
};
export declare const createCommunityAppsInstalledAppsHostBridge: ({ iframeWindow, iframeOrigin, methods, localWindow, maxHandshakeAttempts, handshakeAttemptIntervalMs, }: CreateCommunityAppsInstalledAppsHostBridgeOptions) => Promise<CommunityAppsInstalledAppsHostBridge>;
