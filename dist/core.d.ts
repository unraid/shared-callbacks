import type { QueryPayloads, SendPayloads } from "./types";
/**
 * Encrypts a string using AES encryption.
 */
export declare const encryptData: (data: string, encryptionKey: string) => string;
/**
 * Decrypts an encrypted string using AES decryption.
 * Throws when decryption fails or results in invalid / empty UTF-8.
 */
export declare const decryptData: (encryptedData: string, encryptionKey: string) => string;
/**
 * Stringifies a payload into the standard callback data format.
 */
export declare const stringifyPayload: (payload: SendPayloads, sender: string, sendType?: string) => string;
/**
 * Creates an encrypted data string from a payload.
 */
export declare const createEncryptedPayload: (payload: SendPayloads, sender: string, sendType: string | undefined, encryptionKey: string) => string;
/**
 * Parses an encrypted callback payload string into its typed structure.
 */
export declare const parseEncryptedPayload: (encryptedData: string, encryptionKey: string, options?: {
    isDataURIEncoded?: boolean;
}) => QueryPayloads;
/**
 * Appends encrypted callback data to a URL, using either hash or query param.
 */
export declare const appendEncryptedDataToUrl: (url: string, encryptedData: string, useHash: boolean) => string;
