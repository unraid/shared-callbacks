import AES from "crypto-js/aes.js";
import Utf8 from "crypto-js/enc-utf8.js";
import type { QueryPayloads, SendPayloads } from "./types";

/**
 * Encrypts a string using AES encryption.
 */
export const encryptData = (data: string, encryptionKey: string): string => {
  return AES.encrypt(data, encryptionKey).toString();
};

/**
 * Decrypts an encrypted string using AES decryption.
 * Throws when decryption fails or results in invalid / empty UTF-8.
 */
export const decryptData = (
  encryptedData: string,
  encryptionKey: string
): string => {
  const decryptedMessage = AES.decrypt(encryptedData, encryptionKey);

  let decryptedString: string;
  try {
    decryptedString = decryptedMessage.toString(Utf8);
  } catch {
    throw new Error("Decryption failed. Invalid key or corrupt data.");
  }

  if (!decryptedString) {
    throw new Error("Decryption failed. Invalid key or corrupt data.");
  }

  return decryptedString;
};

/**
 * Stringifies a payload into the standard callback data format.
 */
export const stringifyPayload = (
  payload: SendPayloads,
  sender: string,
  sendType?: string
): string => {
  return JSON.stringify({
    actions: [...payload],
    sender,
    type: sendType,
  });
};

/**
 * Creates an encrypted data string from a payload.
 */
export const createEncryptedPayload = (
  payload: SendPayloads,
  sender: string,
  sendType: string | undefined,
  encryptionKey: string
): string => {
  const stringifiedData = stringifyPayload(payload, sender, sendType);
  return encryptData(stringifiedData, encryptionKey);
};

/**
 * Parses an encrypted callback payload string into its typed structure.
 */
export const parseEncryptedPayload = (
  encryptedData: string,
  encryptionKey: string,
  options?: { isDataURIEncoded?: boolean }
): QueryPayloads => {
  const dataToParse: string = options?.isDataURIEncoded
    ? decodeURI(encryptedData)
    : encryptedData;

  const decryptedString = decryptData(dataToParse, encryptionKey);

  try {
    const decryptedData: QueryPayloads = JSON.parse(decryptedString);
    return decryptedData;
  } catch {
    throw new Error("Failed to parse decrypted data.");
  }
};

/**
 * Appends encrypted callback data to a URL, using either hash or query param.
 */
export const appendEncryptedDataToUrl = (
  url: string,
  encryptedData: string,
  useHash: boolean
): string => {
  const destinationUrl = new URL(url);

  if (useHash) {
    destinationUrl.hash = `data=${encodeURI(encryptedData)}`;
  } else {
    destinationUrl.searchParams.set("data", encodeURI(encryptedData));
  }

  return destinationUrl.toString();
};
