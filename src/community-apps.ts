import SHA256 from "crypto-js/sha256.js";
import Base64 from "crypto-js/enc-base64.js";
import type {
  CommunityAppsInstalledAppHash,
  CommunityAppsInstalledAppsAlgorithm,
} from "./types.js";

export const COMMUNITY_APPS_INSTALLED_APPS_ALGORITHM: CommunityAppsInstalledAppsAlgorithm =
  "sha256-128";
export const COMMUNITY_APPS_INSTALLED_APP_HASH_LENGTH = 22;

export const createCommunityAppsInstalledAppHash = (
  stableIdentifier: string,
  salt: string
): CommunityAppsInstalledAppHash => {
  const digest = SHA256(`${salt}\0${stableIdentifier}`);
  digest.sigBytes = 16;
  digest.clamp();

  return digest
    .toString(Base64)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

export const isCommunityAppsInstalledAppHash = (
  value: unknown
): value is CommunityAppsInstalledAppHash =>
  typeof value === "string" &&
  /^[A-Za-z0-9_-]{22}$/.test(value) &&
  value.length === COMMUNITY_APPS_INSTALLED_APP_HASH_LENGTH;
