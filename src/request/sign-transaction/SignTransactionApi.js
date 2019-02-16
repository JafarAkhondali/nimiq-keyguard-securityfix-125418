/* global I18n */
/* global TopLevelApi */
/* global SignTransaction */
/* global Errors */

class SignTransactionApi extends TopLevelApi {
    /**
     * @param {ParsedSignTransactionRequest} request
     */
    async onRequest(request) {
        const handler = new SignTransaction(request, this.resolve.bind(this), this.reject.bind(this));

        if (request.layout === SignTransactionApi.Layouts.CHECKOUT) {
            this.setGlobalCloseButtonText(I18n.translatePhrase('sign-tx-cancel-payment'));
        } else {
            this.setGlobalCloseButtonText(`${I18n.translatePhrase('back-to')} ${request.appName}`);
        }

        handler.run();
    }

    /**
     * Checks that the given layout is valid
     * @param {any} layout
     * @returns {any}
     */
    parseLayout(layout) {
        if (!layout) {
            return SignTransactionApi.Layouts.STANDARD;
        }
        // @ts-ignore (Property 'values' does not exist on type 'ObjectConstructor'.)
        if (Object.values(SignTransactionApi.Layouts).indexOf(layout) === -1) {
            throw new Errors.InvalidRequestError('Invalid selected layout');
        }
        return layout;
    }

    /**
     * @param {KeyguardRequest.SignTransactionRequest} request
     * @returns {Promise<ParsedSignTransactionRequest>}
     */
    async parseRequest(request) {
        if (!request) {
            throw new Errors.InvalidRequestError('request is required');
        }

        const parsedRequest = {};
        parsedRequest.appName = this.parseAppName(request.appName);
        parsedRequest.keyInfo = await this.parseKeyId(request.keyId);
        parsedRequest.keyLabel = this.parseLabel(request.keyLabel);
        parsedRequest.keyPath = this.parsePath(request.keyPath, 'keyPath');
        parsedRequest.senderLabel = this.parseLabel(request.senderLabel);
        parsedRequest.recipientLabel = this.parseLabel(request.recipientLabel);
        parsedRequest.transaction = this.parseTransaction(request);
        parsedRequest.layout = this.parseLayout(request.layout);
        if (parsedRequest.layout === SignTransactionApi.Layouts.CHECKOUT) {
            parsedRequest.shopOrigin = this.parseShopOrigin(request.shopOrigin);
            parsedRequest.shopLogoUrl = this.parseShopLogoUrl(request.shopLogoUrl);
            if (parsedRequest.shopLogoUrl && parsedRequest.shopLogoUrl.origin !== parsedRequest.shopOrigin) {
                throw new Errors.InvalidRequestError('origin of shopLogoUrl must be same as referrer');
            }
        } else {
            parsedRequest.shopOrigin = undefined;
        }

        return parsedRequest;
    }
}

/** @type {{[layout: string]: string}} */
SignTransactionApi.Layouts = {
    STANDARD: 'standard',
    CHECKOUT: 'checkout',
    CASHLINK: 'cashlink',
};
