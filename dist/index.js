import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import { createSharedComposable } from "@vueuse/core";
const _useCallback = (config) => {
    const send = (url, payload, redirectType, sendType, sender) => {
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
        const decryptedData = JSON.parse(decryptedMessage.toString(Utf8));
        return decryptedData;
    };
    const watcher = (options = {}) => {
        let urlToParse = "";
        if (options?.baseUrl && !options.skipCurrentUrl) {
            urlToParse = options.baseUrl;
        }
        else if (window && window.location && !options.skipCurrentUrl) {
            urlToParse = window.location.toString();
        }
        const currentUrl = new URL(urlToParse);
        const uriDecodedEncryptedData = decodeURI(options?.dataToParse ?? currentUrl?.searchParams.get("data") ?? "");
        if (!uriDecodedEncryptedData) {
            return undefined;
        }
        return parse(uriDecodedEncryptedData);
    };
    return {
        send,
        parse,
        watcher,
    };
};
export const useCallback = createSharedComposable(_useCallback);
