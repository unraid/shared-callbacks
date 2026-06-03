import type { CommunityAppsInstalledAppHash, CommunityAppsInstalledAppsAlgorithm } from "./types.js";
export declare const COMMUNITY_APPS_INSTALLED_APPS_ALGORITHM: CommunityAppsInstalledAppsAlgorithm;
export declare const COMMUNITY_APPS_INSTALLED_APP_HASH_LENGTH = 22;
export declare const createCommunityAppsInstalledAppHash: (stableIdentifier: string, salt: string) => CommunityAppsInstalledAppHash;
export declare const isCommunityAppsInstalledAppHash: (value: unknown) => value is CommunityAppsInstalledAppHash;
