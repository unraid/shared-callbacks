import type { CallbackConfig, QueryPayloads, SendPayloads, WatcherOptions } from './types.js';
export declare const useCallback: (config: CallbackConfig) => {
    send: (url: string, payload: SendPayloads, redirectType?: "newTab" | "replace" | null, sendType?: string, sender?: string) => void;
    parse: (data: string, options?: {
        isDataURIEncoded?: boolean;
    }) => QueryPayloads;
    watcher: (options?: WatcherOptions) => QueryPayloads | undefined;
};
