import AES from "crypto-js/aes.js";
import Utf8 from "crypto-js/enc-utf8.js";
import { createSharedComposable } from "@vueuse/core";
const _useCallback = (config) => {
    const send = (url, payload, redirectType, sendType, sender) => {
        // send() requires browser APIs and is client-only
        if (typeof window === "undefined") {
            throw new Error("send() can only be called on the client side");
        }
        const stringifiedData = JSON.stringify({
            actions: [...payload],
            sender: sender ?? window.location.href.replace("/Tools/Update", "/Tools"),
            type: sendType,
        });
        const encryptedMessage = AES.encrypt(stringifiedData, config.encryptionKey).toString();
        const destinationUrl = new URL(url.replace("/Tools/Update", "/Tools"));
        destinationUrl.searchParams.set("data", encodeURI(encryptedMessage));
        if (redirectType === "newTab") {
            window.open(destinationUrl.toString(), "_blank");
            return;
        }
        if (redirectType === "replace") {
            window.location.replace(destinationUrl.toString());
            return;
        }
        window.location.href = destinationUrl.toString();
    };
    const parse = (data, options) => {
        const dataToParse = options?.isDataURIEncoded
            ? decodeURI(data)
            : data;
        const decryptedMessage = AES.decrypt(dataToParse, config.encryptionKey);
        let decryptedString;
        try {
            decryptedString = decryptedMessage.toString(Utf8);
        }
        catch (e) {
            // Catch errors during UTF-8 conversion (likely due to bad decryption)
            throw new Error('Decryption failed. Invalid key or corrupt data.');
        }
        // Check if decryption resulted in an empty string (another failure case)
        if (!decryptedString) {
            throw new Error('Decryption failed. Invalid key or corrupt data.');
        }
        try {
            const decryptedData = JSON.parse(decryptedString);
            return decryptedData;
        }
        catch (e) {
            // Catch potential JSON parse errors even if decryption seemed successful
            throw new Error('Failed to parse decrypted data.');
        }
    };
    const watcher = (options = {}) => {
        let urlToParse = "";
        if (options?.baseUrl && !options.skipCurrentUrl) {
            urlToParse = options.baseUrl;
        }
        else if (typeof window !== "undefined" && window.location && !options.skipCurrentUrl) {
            urlToParse = window.location.toString();
        }
        else if (!options?.dataToParse && !options?.baseUrl) {
            // If no window and no explicit data/baseUrl provided, return undefined
            return undefined;
        }
        // If we have dataToParse, use it directly; otherwise parse from URL
        const uriDecodedEncryptedData = options?.dataToParse
            ? decodeURI(options.dataToParse)
            : (() => {
                try {
                    const currentUrl = new URL(urlToParse);
                    return decodeURI(currentUrl.searchParams.get("data") ?? "");
                }
                catch {
                    return "";
                }
            })();
        if (!uriDecodedEncryptedData) {
            return undefined;
        }
        return parse(uriDecodedEncryptedData);
    };
    const generateUrl = (url, payload, sendType, sender) => {
        // generateUrl() works on both server and client
        // If no sender provided and we're on client, use window.location; otherwise use empty string
        const defaultSender = sender ?? (typeof window !== "undefined"
            ? window.location.href.replace("/Tools/Update", "/Tools")
            : "");
        const stringifiedData = JSON.stringify({
            actions: [...payload],
            sender: defaultSender,
            type: sendType,
        });
        const encryptedMessage = AES.encrypt(stringifiedData, config.encryptionKey).toString();
        const destinationUrl = new URL(url);
        destinationUrl.searchParams.set("data", encodeURI(encryptedMessage));
        return destinationUrl.toString();
    };
    return {
        send,
        parse,
        watcher,
        generateUrl,
    };
};
export const useCallback = createSharedComposable(_useCallback);
