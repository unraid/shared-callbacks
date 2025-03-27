export type SignIn = 'signIn';
export type SignOut = 'signOut';
export type OemSignOut = 'oemSignOut';
export type Troubleshoot = 'troubleshoot';
export type Recover = 'recover';
export type Replace = 'replace';
export type TrialExtend = 'trialExtend';
export type TrialStart = 'trialStart';
export type Purchase = 'purchase';
export type Redeem = 'redeem';
export type Renew = 'renew';
export type Upgrade = 'upgrade';
export type UpdateOs = 'updateOs';
export type DowngradeOs = 'downgradeOs';
export type Manage = 'manage';
export type MyKeys = 'myKeys';
export type LinkKey = 'linkKey';
export type Activate = 'activate';
export type AccountActionTypes = Troubleshoot | SignIn | SignOut | OemSignOut | Manage | MyKeys | LinkKey;
export type AccountKeyActionTypes = Recover | Replace | TrialExtend | TrialStart | UpdateOs | DowngradeOs;
export type PurchaseActionTypes = Purchase | Redeem | Renew | Upgrade | Activate;

export type ServerActionTypes = AccountActionTypes | AccountKeyActionTypes | PurchaseActionTypes;

export type ServerState = 'BASIC'
  | 'PLUS'
  | 'PRO'
  | 'TRIAL'
  | 'EEXPIRED'
  | 'ENOKEYFILE'
  | 'EGUID'
  | 'EGUID1'
  | 'ETRIAL'
  | 'ENOKEYFILE2'
  | 'ENOKEYFILE1'
  | 'ENOFLASH'
  | 'ENOFLASH1'
  | 'ENOFLASH2'
  | 'ENOFLASH3'
  | 'ENOFLASH4'
  | 'ENOFLASH5'
  | 'ENOFLASH6'
  | 'ENOFLASH7'
  | 'EBLACKLISTED'
  | 'EBLACKLISTED1'
  | 'EBLACKLISTED2'
  | 'ENOCONN'
  | 'STARTER'
  | 'UNLEASHED'
  | 'LIFETIME'
  | 'STALE'
  | undefined;

export interface ServerData {
  description?: string;
  deviceCount?: number;
  expireTime?: number;
  flashProduct?: string;
  flashVendor?: string;
  guid?: string;
  keyfile?: string;
  locale?: string;
  name?: string;
  osVersion?: string;
  osVersionBranch?: 'stable' | 'next' | 'preview' | 'test';
  registered: boolean;
  regExp?: number;
  regUpdatesExpired?: boolean;
  regGen?: number;
  regGuid?: string;
  regTy?: string;
  state: ServerState;
  wanFQDN?: string;
}

export interface UserInfo {
  'custom:ips_id'?: string;
  email?: string;
  email_verifed?: 'true' | 'false';
  preferred_username?: string;
  sub?: string;
  username?: string;
  identities?: string;
  'cognito:groups'?: string[];
}

export interface ExternalSignIn {
  type: SignIn;
  apiKey: string;
  user: UserInfo;
}

export interface ExternalSignOut {
  type: SignOut | OemSignOut;
}

export interface ExternalKeyActions {
  type: PurchaseActionTypes | AccountKeyActionTypes;
  keyUrl: string;
}

export interface ExternalUpdateOsAction {
  type: DowngradeOs | UpdateOs;
  sha256: string;
}

export interface ServerPayload {
  type: ServerActionTypes;
  server: ServerData;
}

export interface ServerTroubleshoot {
  type: Troubleshoot;
  server: ServerData;
}

export type ExternalActions = ExternalSignIn | ExternalSignOut | ExternalKeyActions | ExternalUpdateOsAction;

export type UpcActions = ServerPayload | ServerTroubleshoot;

export type SendPayloads = ExternalActions[] | UpcActions[];

export interface ExternalPayload {
  type: 'forUpc';
  actions: ExternalActions[];
  sender: string;
}

export interface UpcPayload {
  actions: UpcActions[];
  sender: string;
  type: 'fromUpc';
}

export type QueryPayloads = ExternalPayload | UpcPayload;

export interface WatcherOptions {
  baseUrl?: string;
  skipCurrentUrl?: boolean;
  dataToParse?: string;
}

export interface CallbackConfig {
  encryptionKey: string;
} 