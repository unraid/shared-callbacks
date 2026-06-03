import {
  ParentHandshake,
  WindowMessenger,
} from "post-me";
import type {
  CommunityAppsInstallRequest,
  CommunityAppsInstallResponse,
  CommunityAppsInstalledAppStatusRequest,
  CommunityAppsInstalledAppStatusResponse,
} from "./types.js";

export type CommunityAppsInstalledAppsHostMethods = {
  getInstalledAppStatuses: (
    request: CommunityAppsInstalledAppStatusRequest
  ) =>
    | CommunityAppsInstalledAppStatusResponse
    | Promise<CommunityAppsInstalledAppStatusResponse>;
  requestInstall?: (
    request: CommunityAppsInstallRequest
  ) => CommunityAppsInstallResponse | Promise<CommunityAppsInstallResponse>;
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

export const createCommunityAppsInstalledAppsHostBridge = async ({
  iframeWindow,
  iframeOrigin,
  methods,
  localWindow,
  maxHandshakeAttempts = 20,
  handshakeAttemptIntervalMs = 100,
}: CreateCommunityAppsInstalledAppsHostBridgeOptions): Promise<CommunityAppsInstalledAppsHostBridge> => {
  const connection = await ParentHandshake(
    new WindowMessenger({
      localWindow,
      remoteWindow: iframeWindow,
      remoteOrigin: iframeOrigin,
    }),
    methods,
    maxHandshakeAttempts,
    handshakeAttemptIntervalMs
  );

  return {
    close: () => connection.close(),
  };
};
