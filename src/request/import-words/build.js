// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
// @ts-nocheck
/* eslint-disable */

/**
 * This file was generated from the @nimiq/rpc package source, with `RpcServer` being the only target.
 *
 * HOWTO:
 * - Remove `export * from './RpcClient';` from @nimiq/rpc/src/main.ts
 * - Run `yarn build` in the @nimiq/rpc directory
 * - @nimiq/rpc/dist/rpc.es.js is the wanted module file
 * - The following changes where made to this file afterwards:
 *   https://github.com/nimiq/keyguard-next/pull/93/commits/0a9797cbe195f7eda8b66a75927cc11786ea9625
 */

var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["OK"] = "ok";
    ResponseStatus["ERROR"] = "error";
})(ResponseStatus || (ResponseStatus = {}));

/* tslint:disable:no-bitwise */
class Base64 {
    static decode(b64) {
        Base64._initRevLookup();
        const [validLength, placeHoldersLength] = Base64._getLengths(b64);
        const arr = new Uint8Array(Base64._byteLength(validLength, placeHoldersLength));
        let curByte = 0;
        // if there are placeholders, only get up to the last complete 4 chars
        const len = placeHoldersLength > 0 ? validLength - 4 : validLength;
        let i = 0;
        for (; i < len; i += 4) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 18) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 12) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] << 6) |
                Base64._revLookup[b64.charCodeAt(i + 3)];
            arr[curByte++] = (tmp >> 16) & 0xFF;
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 2) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 2) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[curByte++] = tmp & 0xFF;
        }
        if (placeHoldersLength === 1) {
            const tmp = (Base64._revLookup[b64.charCodeAt(i)] << 10) |
                (Base64._revLookup[b64.charCodeAt(i + 1)] << 4) |
                (Base64._revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[curByte++] = (tmp >> 8) & 0xFF;
            arr[curByte /*++ not needed*/] = tmp & 0xFF;
        }
        return arr;
    }
    static encode(uint8) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = length - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(Base64._encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            const tmp = uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 2] +
                Base64._lookup[(tmp << 4) & 0x3F] +
                '==');
        }
        else if (extraBytes === 2) {
            const tmp = (uint8[length - 2] << 8) + uint8[length - 1];
            parts.push(Base64._lookup[tmp >> 10] +
                Base64._lookup[(tmp >> 4) & 0x3F] +
                Base64._lookup[(tmp << 2) & 0x3F] +
                '=');
        }
        return parts.join('');
    }
    static _initRevLookup() {
        if (Base64._revLookup.length !== 0)
            return;
        Base64._revLookup = [];
        for (let i = 0, len = Base64._lookup.length; i < len; i++) {
            Base64._revLookup[Base64._lookup.charCodeAt(i)] = i;
        }
        // Support decoding URL-safe base64 strings, as Node.js does.
        // See: https://en.wikipedia.org/wiki/Base64#URL_applications
        Base64._revLookup['-'.charCodeAt(0)] = 62;
        Base64._revLookup['_'.charCodeAt(0)] = 63;
    }
    static _getLengths(b64) {
        const length = b64.length;
        if (length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        let validLength = b64.indexOf('=');
        if (validLength === -1)
            validLength = length;
        const placeHoldersLength = validLength === length ? 0 : 4 - (validLength % 4);
        return [validLength, placeHoldersLength];
    }
    static _byteLength(validLength, placeHoldersLength) {
        return ((validLength + placeHoldersLength) * 3 / 4) - placeHoldersLength;
    }
    static _tripletToBase64(num) {
        return Base64._lookup[num >> 18 & 0x3F] +
            Base64._lookup[num >> 12 & 0x3F] +
            Base64._lookup[num >> 6 & 0x3F] +
            Base64._lookup[num & 0x3F];
    }
    static _encodeChunk(uint8, start, end) {
        const output = [];
        for (let i = start; i < end; i += 3) {
            const tmp = ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF);
            output.push(Base64._tripletToBase64(tmp));
        }
        return output.join('');
    }
}
Base64._lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
Base64._revLookup = [];

var ExtraJSONTypes;
(function (ExtraJSONTypes) {
    ExtraJSONTypes[ExtraJSONTypes["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
})(ExtraJSONTypes || (ExtraJSONTypes = {}));
class JSONUtils {
    static stringify(value) {
        return JSON.stringify(value, JSONUtils._jsonifyType);
    }
    static parse(value) {
        return JSON.parse(value, JSONUtils._parseType);
    }
    static _parseType(key, value) {
        if (value && value.hasOwnProperty &&
            value.hasOwnProperty(JSONUtils.TYPE_SYMBOL) && value.hasOwnProperty(JSONUtils.VALUE_SYMBOL)) {
            switch (value[JSONUtils.TYPE_SYMBOL]) {
                case ExtraJSONTypes.UINT8_ARRAY:
                    return Base64.decode(value[JSONUtils.VALUE_SYMBOL]);
            }
        }
        return value;
    }
    static _jsonifyType(key, value) {
        if (value instanceof Uint8Array) {
            return JSONUtils._typedObject(ExtraJSONTypes.UINT8_ARRAY, Base64.encode(value));
        }
        return value;
    }
    static _typedObject(type, value) {
        const obj = {};
        obj[JSONUtils.TYPE_SYMBOL] = type;
        obj[JSONUtils.VALUE_SYMBOL] = value;
        return obj;
    }
}
JSONUtils.TYPE_SYMBOL = '__';
JSONUtils.VALUE_SYMBOL = 'v';

class UrlRpcEncoder {
    static receiveRedirectCommand(url) {
        // Need referrer for origin check
        if (!document.referrer)
            return null;
        // Parse query
        const params = new URLSearchParams(url.search);
        const referrer = new URL(document.referrer);
        // Ignore messages without a command
        if (!params.has('command'))
            return null;
        // Ignore messages without an ID
        if (!params.has('id'))
            return null;
        // Ignore messages without a valid return path
        if (!params.has('returnURL'))
            return null;
        // Only allow returning to same origin
        const returnURL = new URL(params.get('returnURL'));
        if (returnURL.origin !== referrer.origin)
            return null;
        // Parse args
        let args = [];
        if (params.has('args')) {
            try {
                args = JSONUtils.parse(params.get('args'));
            }
            catch (e) {
                // Do nothing
            }
        }
        args = Array.isArray(args) ? args : [];
        return {
            origin: referrer.origin,
            data: {
                id: parseInt(params.get('id'), 10),
                command: params.get('command'),
                args,
            },
            returnURL: params.get('returnURL'),
        };
    }
    static prepareRedirectReply(state, status, result) {
        const params = new URLSearchParams();
        params.set('status', status);
        params.set('result', JSONUtils.stringify(result));
        params.set('id', state.id.toString());
        // TODO: what if it already includes a query string
        return `${state.returnURL}?${params.toString()}`;
    }
}

class State {
    get id() {
        return this._id;
    }
    get origin() {
        return this._origin;
    }
    get data() {
        return this._data;
    }
    get returnURL() {
        return this._returnURL;
    }
    static fromJSON(json) {
        const obj = JSON.parse(json);
        return new State(obj);
    }
    constructor(message) {
        if (!message.data.id)
            throw Error('Missing id');
        this._origin = message.origin;
        this._id = message.data.id;
        this._returnURL = 'returnURL' in message ? message.returnURL : null;
        this._data = message.data;
    }
    toJSON() {
        const obj = {
            origin: this._origin,
            data: this._data,
        };
        obj.returnURL = this._returnURL;
        return JSON.stringify(obj);
    }
    reply(status, result) {
        console.debug('RpcServer REPLY', result);
        if (status === ResponseStatus.ERROR) {
            // serialize error objects
            result = typeof result === 'object'
                ? { message: result.message, stack: result.stack }
                : { message: result };
        }

        // Send via top-level navigation
        window.location.href = UrlRpcEncoder.prepareRedirectReply(this, status, result);
    }
}

class RpcServer {
    static _ok(state, result) {
        state.reply(ResponseStatus.OK, result);
    }
    static _error(state, error) {
        state.reply(ResponseStatus.ERROR, error);
    }
    constructor(allowedOrigin) {
        this._allowedOrigin = allowedOrigin;
        this._responseHandlers = new Map();
        this._responseHandlers.set('ping', () => 'pong');
        this._receiveListener = this._receive.bind(this);
    }
    onRequest(command, fn) {
        this._responseHandlers.set(command, fn);
    }
    init() {
        window.addEventListener('message', this._receiveListener);
        this._receiveRedirect();
    }
    close() {
        window.removeEventListener('message', this._receiveListener);
    }
    _receiveRedirect() {
        const message = UrlRpcEncoder.receiveRedirectCommand(window.location);
        if (message) {
            this._receive(message);
        }
    }
    _receive(message) {
        let state = null;
        try {
            state = new State(message);
            // Cannot reply to a message that has no return URL
            if (!('returnURL' in message))
                return;
            // Ignore messages without a command
            if (!('command' in state.data)) {
                return;
            }
            if (this._allowedOrigin !== '*' && message.origin !== this._allowedOrigin) {
                throw new Error('Unauthorized');
            }
            const args = message.data.args && Array.isArray(message.data.args) ? message.data.args : [];
            // Test if request calls a valid handler with the correct number of arguments
            if (!this._responseHandlers.has(state.data.command)) {
                throw new Error(`Unknown command: ${state.data.command}`);
            }
            const requestedMethod = this._responseHandlers.get(state.data.command);
            // Do not include state argument
            if (Math.max(requestedMethod.length - 1, 0) < args.length) {
                throw new Error(`Too many arguments passed: ${message}`);
            }
            console.debug('RpcServer ACCEPT', state.data);
            // Call method
            const result = requestedMethod(state, ...args);
            // If a value is returned, we take care of the reply,
            // otherwise we assume the handler to do the reply when appropriate.
            if (result instanceof Promise) {
                result
                    .then((finalResult) => {
                    if (finalResult !== undefined) {
                        RpcServer._ok(state, finalResult);
                    }
                })
                    .catch((error) => RpcServer._error(state, error));
            }
            else if (result !== undefined) {
                RpcServer._ok(state, result);
            }
        }
        catch (error) {
            if (state) {
                RpcServer._error(state, error);
            }
        }
    }
}
/* global Nimiq */

class Key {
    /**
     * @param {Uint8Array} secret
     * @param {Key.Type} [type]
     */
    constructor(secret, type = Key.Type.BIP39) {
        this._secret = secret;
        this._type = type;
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PublicKey}
     */
    derivePublicKey(path) {
        return Nimiq.PublicKey.derive(this._derivePrivateKey(path));
    }

    /**
     * @param {string} path
     * @returns {Nimiq.Address}
     */
    deriveAddress(path) {
        return this.derivePublicKey(path).toAddress();
    }

    /**
     * @param {string} path
     * @param {Uint8Array} data
     * @returns {Nimiq.Signature}
     */
    sign(path, data) {
        const privateKey = this._derivePrivateKey(path);
        const publicKey = Nimiq.PublicKey.derive(privateKey);
        return Nimiq.Signature.create(privateKey, publicKey, data);
    }

    /**
     * @param {string} path
     * @returns {Nimiq.PrivateKey}
     * @private
     */
    _derivePrivateKey(path) {
        return this._type === Key.Type.LEGACY
            ? new Nimiq.PrivateKey(this._secret)
            : new Nimiq.Entropy(this._secret).toExtendedPrivateKey().derivePath(path).privateKey;
    }

    /**
     * @type {Uint8Array}
     */
    get secret() {
        return this._secret;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {string}
     */
    get id() {
        const input = this._type === Key.Type.LEGACY
            ? Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._secret)).toAddress().serialize()
            : this._secret;
        return Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(input).subarray(0, 6));
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this.id);
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    static idToUserFriendlyId(id) {
        // Stub
        return `UserFriendly ${id}`;
    }
}
Key.Type = {
    LEGACY: /** @type {Key.Type} */ 0,
    BIP39: /** @type {Key.Type} */ 1,
};
/* global Key */

// eslint-disable-next-line no-unused-vars
class KeyInfo {
    /**
     * @param {string} id
     * @param {Key.Type} type
     * @param {boolean} encrypted
     */
    constructor(id, type, encrypted) {
        /** @private */
        this._id = id;
        /** @private */
        this._type = type;
        /** @private */
        this._encrypted = encrypted;
    }

    /**
     * @type {string}
     */
    get id() {
        return this._id;
    }

    /**
     * @type {Key.Type}
     */
    get type() {
        return this._type;
    }

    /**
     * @type {boolean}
     */
    get encrypted() {
        return this._encrypted;
    }

    /**
     * @type {string}
     */
    get userFriendlyId() {
        return Key.idToUserFriendlyId(this._id);
    }

    /**
     * @returns {KeyInfoObject}
     */
    toObject() {
        return {
            id: this.id,
            type: this.type,
            encrypted: this.encrypted,
            // userFriendlyId: this.userFriendlyId,
        };
    }

    /**
     * @param {KeyInfoObject} obj
     * @returns {KeyInfo}
     */
    static fromObject(obj) {
        return new KeyInfo(obj.id, obj.type, obj.encrypted);
    }
}
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

class AutoComplete { // eslint-disable-line no-unused-vars
    /**
     * @param {Object} options
     */
    constructor(options) {
        if (!document.querySelector) return;

        // helpers
        /**
         * @param {string} elClass
         * @param {string} event
         * @param {function(HTMLElement, Event):void} cb
         * @param {Node} context
         */
        function live(elClass, event, cb, context = document) {
            context.addEventListener(event, e => {
                let el = /** @type {HTMLElement | null} */ (e.target || e.srcElement);
                let found = false;
                do {
                    if (!el) break;
                    found = !!el && el.classList.contains(elClass);
                    if (found) break;
                    el = el.parentElement;
                } while (!found);
                if (el && found) cb((/** @type {HTMLElement} */ (el)), e);
            });
        }

        const defaultOptions = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: /** @param {string} item */ item => {
                const element = document.createElement('div');
                element.classList.add('autocomplete-suggestion');
                element.dataset.val = item;
                element.textContent = item;
                return element;
            },
            // onSelect: /** @param {Event} e @param {string} term @param {Element} item */ (e, term, item) => {},
            onSelect: () => {},
        };
        const o = Object.assign(defaultOptions, options);

        // init
        this.elems = typeof o.selector === 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = `autocomplete-suggestions ${o.menuClass}`;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = /** @param {boolean} resize @param {Element} next */ (resize, next) => {
                const rect = that.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                that.sc.style.left = `${Math.round(rect.left + scrollX + o.offsetLeft)}px`;
                that.sc.style.top = `${Math.round(rect.bottom + scrollY + o.offsetTop)}px`;
                that.sc.style.width = `${Math.round(rect.right - rect.left)}px`; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) {
                        const style = window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle;
                        that.sc.maxHeight = parseInt(style.maxHeight, 10);
                    }
                    if (!that.sc.suggestionHeight) {
                        that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    }
                    if (that.sc.suggestionHeight) {
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            const scrTop = that.sc.scrollTop; const
                                selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0) {
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            } else if (selTop < 0) {
                                that.sc.scrollTop = selTop + scrTop;
                            }
                        }
                    }
                }
            };
            window.addEventListener('resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', () => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(() => { sel.classList.remove('selected'); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', el => {
                const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.classList.remove('selected');
                el.classList.add('selected');
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', (el, e) => {
                if (el.classList.contains('autocomplete-suggestion')) { // else outside click
                    const v = el.dataset.val;
                    that.value = v;
                    o.onSelect(e, v, el);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = () => {
                let suggestionOverlay;
                try {
                    suggestionOverlay = document.querySelector('.autocomplete-suggestions:hover');
                } catch (e) {} // eslint-disable-line no-empty
                if (!suggestionOverlay) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(() => { that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(() => { that.focus(); }, 20);
            };
            that.addEventListener('blur', that.blurHandler);

            /** @param {string[]} data */
            const suggest = data => {
                const val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    that.sc.innerHTML = '';
                    for (let x = 0; x < data.length; x++) {
                        that.sc.appendChild(o.renderItem(data[x]));
                    }
                    that.updateSC(0);
                } else that.sc.style.display = 'none';
            };

            /**
             * @param {KeyboardEvent} e
             * @returns {boolean}
             */
            that.keydownHandler = e => {
                const key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key === 40 || key === 38) && that.sc.innerHTML) {
                    let next;
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key === 40) ? that.sc.querySelector('.autocomplete-suggestion')
                            : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        } else {
                            sel.className = sel.className.replace('selected', '');
                            that.value = that.last_val; next = 0;
                        }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                if (key === 27) {
                    that.value = that.last_val;
                    that.sc.style.display = 'none';
                } else if (key === 13 || key === 9) {
                    const sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display !== 'none') {
                        o.onSelect(e, sel.getAttribute('data-val'), sel);
                        setTimeout(() => { that.sc.style.display = 'none'; }, 20);
                    }
                }
                return true;
            };
            that.addEventListener('keydown', that.keydownHandler);

            that.keyupHandler = /** @param {KeyboardEvent} e */ e => {
                const key = window.event ? e.keyCode : e.which;
                if (!key || ((key < 35 || key > 40) && key !== 13 && key !== 27)) {
                    const val = that.value;
                    if (val.length >= o.minChars) {
                        if (val !== that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (let x = 1; x < val.length - o.minChars; x++) {
                                    const part = val.slice(0, val.length - x);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(() => { o.source(val, suggest); }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            that.addEventListener('keyup', that.keyupHandler);

            that.focusHandler = /** @param {Event} e */ e => {
                that.last_val = '\n';
                that.keyupHandler(e);
            };
            if (!o.minChars) that.addEventListener('focus', that.focusHandler);
        }
    }

    destroy() {
        for (let i = 0; i < this.elems.length; i++) {
            const that = this.elems[i];
            window.removeEventListener('resize', that.updateSC);
            that.removeEventListener('blur', that.blurHandler);
            that.removeEventListener('focus', that.focusHandler);
            that.removeEventListener('keydown', that.keydownHandler);
            that.removeEventListener('keyup', that.keyupHandler);
            if (that.autocompleteAttr !== undefined) that.setAttribute('autocomplete', that.autocompleteAttr);
            else that.removeAttribute('autocomplete');
            document.body.removeChild(that.sc);
        }
    }
}
class AnimationUtils { // eslint-disable-line no-unused-vars
    /**
     * @param {string} className
     * @param {HTMLElement} el
     * @param {Function} [afterStartCallback]
     * @param {Function} [beforeEndCallback]
     */
    static async animate(className, el, afterStartCallback, beforeEndCallback) {
        return new Promise(resolve => {
            // 'animiationend' is a native DOM event that fires upon CSS animation completion
            /** @param {Event} e */
            const listener = e => {
                if (e.target !== el) return;
                if (beforeEndCallback instanceof Function) beforeEndCallback();
                this.stopAnimate(className, el);
                el.removeEventListener('animationend', listener);
                resolve();
            };
            el.addEventListener('animationend', listener);
            el.classList.add(className);
            if (afterStartCallback instanceof Function) afterStartCallback();
        });
    }

    /**
     * @param {string} className
     * @param {HTMLElement} el
     */
    static stopAnimate(className, el) {
        el.classList.remove(className);
    }
}
class BrowserDetection { // eslint-disable-line no-unused-vars
    /**
     * @returns {boolean}
     */
    static isDesktopSafari() {
        // see https://stackoverflow.com/a/23522755
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent);
    }

    /**
     * @returns {boolean}
     */
    static isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    }

    /**
     * @returns {boolean}
     */
    static isIos() {
        // @ts-ignore (MSStream is not on window)
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * @returns {number[]}
     */
    static iosVersion() {
        if (BrowserDetection.isIos()) {
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (v) {
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
        }

        throw new Error('No iOS version detected');
    }

    /**
     * @returns {boolean}
     */
    static isBadIos() {
        const version = this.iosVersion();
        return version[0] < 11 || (version[0] === 11 && version[1] === 2); // Only 11.2 has the WASM bug
    }
}
/* global KeyInfo */

class CookieJar { // eslint-disable-line no-unused-vars
    /**
     * @param {KeyInfo[]} keys
     */
    static fill(keys) {
        const maxAge = 60 * 60 * 24 * 365;
        const encodedKeys = this._encodeCookie(keys);
        document.cookie = `k=${encodedKeys};max-age=${maxAge.toString()}`;
    }

    /**
     * @param {boolean} [listDeprecatedAccounts] - @deprecated Only for database migration
     * @returns {KeyInfo[] | AccountInfo[]}
     */
    static eat(listDeprecatedAccounts) {
        // Legacy cookie
        if (listDeprecatedAccounts) {
            const match = document.cookie.match(new RegExp('accounts=([^;]+)'));
            if (match && match[1]) {
                const decoded = decodeURIComponent(match[1]);
                return JSON.parse(decoded);
            }
            return [];
        }

        const match = document.cookie.match(new RegExp('k=([^;]+)'));
        if (match && match[1]) {
            return this._decodeCookie(match[1]);
        }

        return [];
    }

    /**
     * @param {KeyInfo[]} keys
     * @returns {string}
     */
    static _encodeCookie(keys) {
        return keys.map(keyInfo => `${keyInfo.type}${keyInfo.encrypted ? 1 : 0}${keyInfo.id}`).join('');
    }

    /**
     * @param {string} str
     * @returns {KeyInfo[]}
     */
    static _decodeCookie(str) {
        if (!str) return [];

        if (str.length % 14 !== 0) throw new Error('Malformed cookie');

        const keys = str.match(/.{14}/g);
        if (!keys) return []; // Make TS happy (match() can potentially return NULL)

        return keys.map(key => {
            const type = /** @type {Key.Type} */ (parseInt(key[0], 10));
            const encrypted = key[1] === '1';
            const id = key.substr(2);
            return new KeyInfo(id, type, encrypted);
        });
    }
}
/**
 * DEPRECATED
 * This class is only used for retrieving keys and accounts from the old KeyStore.
 *
 * Usage:
 * <script src="lib/account-store-indexeddb.js"></script>
 *
 * const accountStore = AccountStore.instance;
 * const accounts = await accountStore.list();
 * accountStore.drop();
 */

class AccountStore {
    /** @type {AccountStore} */
    static get instance() {
        /** @type {AccountStore} */
        this._instance = this._instance || new AccountStore();
        return this._instance;
    }

    /**
     * @param {string} dbName
     * @constructor
     */
    constructor(dbName = AccountStore.ACCOUNT_DATABASE) {
        this._dbName = dbName;
        this._dropped = false;
        /** @type {Promise<IDBDatabase>|null} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise.<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this._dbName, AccountStore.VERSION);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                // account database doesn't exist
                this._dropped = true;
                request.transaction.abort();
                resolve(null);
            };
        });

        return this._dbPromise;
    }

    /**
     * @returns {Promise<AccountInfo[]>}
     */
    async list() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountInfo[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = cursor.value;

                    // Because: To use Key.getPublicInfo(), we would need to create Key
                    // instances out of the key object that we receive from the DB.
                    /** @type {AccountInfo} */
                    const accountInfo = {
                        userFriendlyAddress: key.userFriendlyAddress,
                        type: key.type,
                        label: key.label,
                    };

                    results.push(accountInfo);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    /**
     * @returns {Promise<AccountRecord[]>}
     * @deprecated Only for database migration
     *
     * @description Returns the encrypted keypairs!
     */
    async dangerousListPlain() {
        const db = await this.connect();
        if (!db) return [];
        return new Promise((resolve, reject) => {
            const results = /** @type {AccountRecord[]} */ ([]);
            const openCursorRequest = db.transaction([AccountStore.ACCOUNT_DATABASE], 'readonly')
                .objectStore(AccountStore.ACCOUNT_DATABASE)
                .openCursor();
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    const key = /** @type {AccountRecord} */ (cursor.value);
                    results.push(key);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            openCursorRequest.onerror = () => reject(openCursorRequest.error);
        });
    }

    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * @returns {Promise<void>}
     */
    async drop() {
        if (this._dropped) return Promise.resolve();
        await this.close();

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(this._dbName);

            request.onsuccess = () => {
                this._dropped = true;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }
}

AccountStore.VERSION = 2;
AccountStore.ACCOUNT_DATABASE = 'accounts';
/* global Nimiq */
/* global Key */
/* global KeyInfo */
/* global AccountStore */
/* global BrowserDetection */

/**
 * Usage:
 * <script src="lib/key.js"></script>
 * <script src="lib/key-store-indexeddb.js"></script>
 *
 * const keyStore = KeyStore.instance;
 * const accounts = await keyStore.list();
 */
class KeyStore {
    /** @type {KeyStore} */
    static get instance() {
        /** @type {KeyStore} */
        KeyStore._instance = KeyStore._instance || new KeyStore();
        return KeyStore._instance;
    }

    constructor() {
        /** @type {?Promise<IDBDatabase>} */
        this._dbPromise = null;
    }

    /**
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    async connect() {
        if (this._dbPromise) return this._dbPromise;

        this._dbPromise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open(KeyStore.DB_NAME, KeyStore.DB_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = event => {
                /** @type {IDBDatabase} */
                const db = request.result;

                if (event.oldVersion < 1) {
                    // Version 1 is the first version of the database.
                    db.createObjectStore(KeyStore.DB_KEY_STORE_NAME, { keyPath: 'id' });
                }
            };
        });

        return this._dbPromise;
    }

    /**
     * @param {string} id
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<?Key>}
     */
    async get(id, passphrase) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        if (!keyRecord) {
            return null;
        }

        if (!keyRecord.encrypted) {
            return new Key(keyRecord.secret, keyRecord.type);
        }

        if (!passphrase) {
            throw new Error('Passphrase required');
        }

        const plainSecret = await Nimiq.CryptoUtils.decryptOtpKdf(new Nimiq.SerialBuffer(keyRecord.secret), passphrase);
        return new Key(plainSecret, keyRecord.type);
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyInfo>}
     */
    async getInfo(id) {
        /** @type {?KeyRecord} */
        const keyRecord = await this._get(id);
        return keyRecord ? new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted) : null;
    }

    /**
     * @param {string} id
     * @returns {Promise<?KeyRecord>}
     * @private
     */
    async _get(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME])
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .get(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {Key} key
     * @param {Uint8Array} [passphrase]
     * @returns {Promise<void>}
     */
    async put(key, passphrase) {
        const secret = !passphrase
            ? key.secret
            : await Nimiq.CryptoUtils.encryptOtpKdf(new Nimiq.SerialBuffer(key.secret), passphrase);

        const keyRecord = /** @type {KeyRecord} */ {
            id: key.id,
            type: key.type,
            encrypted: !!passphrase && passphrase.length > 0,
            secret,
        };

        return this._put(keyRecord);
    }

    /**
     * @param {KeyRecord} keyRecord
     * @returns {Promise<void>}
     */
    async _put(keyRecord) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .put(keyRecord);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async remove(id) {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readwrite')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .delete(id);
        return KeyStore._requestToPromise(request);
    }

    /**
     * @returns {Promise<KeyInfo[]>}
     */
    async list() {
        const db = await this.connect();
        const request = db.transaction([KeyStore.DB_KEY_STORE_NAME], 'readonly')
            .objectStore(KeyStore.DB_KEY_STORE_NAME)
            .openCursor();

        const results = /** KeyRecord[] */ await KeyStore._readAllFromCursor(request);
        return results.map(keyRecord => new KeyInfo(keyRecord.id, keyRecord.type, keyRecord.encrypted));
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (!this._dbPromise) return;
        // If failed to open database (i.e. _dbPromise rejects) we don't need to close the db
        const db = await this._dbPromise.catch(() => null);
        this._dbPromise = null;
        if (db) db.close();
    }

    /**
     * To migrate from the 'account' database and store (AccountStore) to this new
     * 'nimiq-keyguard' database with the 'keys' store, this function is called by
     * the account manager (via IFrameApi.migrateAccountstoKeys()) after it successfully
     * stored the existing account labels. Both the 'accounts' database and cookie are
     * deleted afterwards.
     *
     * @returns {Promise<void>}
     * @deprecated Only for database migration
     */
    async migrateAccountsToKeys() {
        const keys = await AccountStore.instance.dangerousListPlain();
        keys.forEach(async key => {
            const address = Nimiq.Address.fromUserFriendlyAddress(key.userFriendlyAddress);
            const legacyKeyId = Nimiq.BufferUtils.toHex(Nimiq.Hash.blake2b(address.serialize()).subarray(0, 6));

            const keyRecord = /** @type {KeyRecord} */ {
                id: legacyKeyId,
                type: Key.Type.LEGACY,
                encrypted: true,
                secret: key.encryptedKeyPair,
            };

            await this._put(keyRecord);
        });

        // FIXME Uncomment after/for testing (and also adapt KeyStoreIndexeddb.spec.js)
        // await AccountStore.instance.drop();

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Delete migrate cookie
            document.cookie = 'migrate=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Delete accounts cookie
            document.cookie = 'accounts=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<*>}
     * @private
     */
    static _requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * @param {IDBRequest} request
     * @returns {Promise<KeyRecord[]>}
     * @private
     */
    static _readAllFromCursor(request) {
        return new Promise((resolve, reject) => {
            /** @type {KeyRecord[]} */
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }
}
/** @type {?KeyStore} */
KeyStore._instance = null;

KeyStore.DB_VERSION = 1;
KeyStore.DB_NAME = 'nimiq-keyguard';
KeyStore.DB_KEY_STORE_NAME = 'keys';
/* global TRANSLATIONS */ // eslint-disable-line no-unused-vars
/* global Nimiq */

/**
 * @typedef {{[language: string]: {[id: string]: string}}} dict
 */

class I18n { // eslint-disable-line no-unused-vars
    /**
     * @param {dict} dictionary - Dictionary of all languages and phrases
     * @param {string} fallbackLanguage - Language to be used if no translation for the current language can be found
     */
    static initialize(dictionary, fallbackLanguage) {
        this._dict = dictionary;

        if (!(fallbackLanguage in this._dict)) {
            throw new Error(`Fallback language "${fallbackLanguage}" not defined`);
        }
        /** @type {string} */
        this._fallbackLanguage = fallbackLanguage;

        this.language = navigator.language;
    }

    /**
     * @param {HTMLElement} [dom] - The DOM element to be translated, or body by default
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     */
    static translateDom(dom = document.body, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;

        /* eslint-disable-next-line valid-jsdoc */ // Multi-line descriptions are not valid JSDoc, apparently
        /**
         * @param {string} tag
         * @param {(element: HTMLElement, translation: string) => void} callback - callback(element, translation) for
         * each matching element
         */
        const translateElements = (tag, callback) => {
            const attribute = `data-${tag}`;
            /** @type {NodeListOf<HTMLElement>} */
            const elements = dom.querySelectorAll(`[${attribute}]`);
            elements.forEach(element => {
                const id = element.getAttribute(attribute);
                if (!id) return;
                callback(element, this._translate(id, language));
            });
        };

        /**
         * @param {string} tag
         */
        const translateAttribute = tag => {
            translateElements(`i18n-${tag}`, (element, translation) => element.setAttribute(tag, translation));
        };

        translateElements('i18n', (element, translation) => {
            const sanitized = translation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const withMarkup = sanitized.replace(/\[strong]/g, '<strong>').replace(/\[\/strong]/g, '</strong>');
            element.innerHTML = withMarkup;
        });
        translateAttribute('value');
        translateAttribute('placeholder');
    }

    /**
     * @param {string} id - translation dict ID
     * @param {string} [enforcedLanguage] - ISO code of language to translate to
     * @returns {string}
     */
    static translatePhrase(id, enforcedLanguage) {
        const language = enforcedLanguage ? this.getClosestSupportedLanguage(enforcedLanguage) : this.language;
        return this._translate(id, language);
    }

    /**
     * @param {string} id
     * @param {string} language
     * @returns {string}
     */
    static _translate(id, language) {
        if (!this.dictionary[language] || !this.dictionary[language][id]) {
            throw new Error(`I18n: ${language}/${id} is undefined!`);
        }
        return this.dictionary[language][id];
    }

    /**
     * @returns {string[]} ISO codes of all available languages.
     */
    static availableLanguages() {
        return Object.keys(this.dictionary);
    }

    /**
     * @param {string} language
     */
    static switchLanguage(language) {
        this.language = language;
    }

    /**
     * Selects a supported language closed to the desired language. Examples it might return:
     * en-us => en-us, en-us => en, en => en-us, fr => en.
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     * @returns {string}
     */
    static getClosestSupportedLanguage(language) {
        // If this language is supported, return it directly
        if (language in this.dictionary) return language;

        // Return the base language, if it exists in the dictionary
        const baseLanguage = language.split('-')[0];
        if (baseLanguage !== language && baseLanguage in this.dictionary) return baseLanguage;

        // Check if other versions (siblings) of the base language exist
        const languagePrefix = `${baseLanguage}-`;
        const siblingLanguage = this.availableLanguages()
            .find(supportedLanguage => supportedLanguage.startsWith(languagePrefix));

        return siblingLanguage || this.fallbackLanguage;
    }

    /**
     * @param {string} language - ISO 639-1 language codes, e.g. en, en-us, de, de-at
     */
    static set language(language) {
        const languageToUse = this.getClosestSupportedLanguage(language);

        if (languageToUse !== language) {
            // eslint-disable-next-line no-console
            console.warn(`Language ${language} not supported, using ${languageToUse} instead.`);
        }

        if (this._language !== languageToUse) {
            /** @type {string} */
            this._language = languageToUse;

            if (({ interactive: 1, complete: 1 })[document.readyState]) {
                this.translateDom();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.translateDom();
                });
            }
            I18n.observer.fire(I18n.Events.LANGUAGE_CHANGED, this._language);
        }
    }

    /** @type {string} */
    static get language() {
        return this._language || this.fallbackLanguage;
    }

    /** @type {dict} */
    static get dictionary() {
        if (!this._dict) throw new Error('I18n not initialized');
        return this._dict;
    }

    /** @type {string} */
    static get fallbackLanguage() {
        if (!this._fallbackLanguage) throw new Error('I18n not initialized');
        return this._fallbackLanguage;
    }

    /** @returns {DOMParser} */
    static get parser() {
        /** @type {DOMParser} */
        this._parser = this._parser || new DOMParser();

        return this._parser;
    }
}

I18n.observer = new Nimiq.Observable();
I18n.Events = {
    LANGUAGE_CHANGED: 'language-changed',
};
class Iqons {
    /* Public API */

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async svg(text) {
        const hash = this._hash(text);
        return this._svgTemplate(
            parseInt(hash[0], 10),
            parseInt(hash[2], 10),
            parseInt(hash[3] + hash[4], 10),
            parseInt(hash[5] + hash[6], 10),
            parseInt(hash[7] + hash[8], 10),
            parseInt(hash[9] + hash[10], 10),
            parseInt(hash[11], 10),
        );
    }

    /**
     * @param {string} text
     * @returns {Promise<string>}
     */
    static async toDataUrl(text) {
        const base64string = btoa(await this.svg(text));
        return `data:image/svg+xml;base64,${base64string.replace(/#/g, '%23')}`;
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholder(color, strokeWidth) {
        color = color || '#bbb';
        strokeWidth = strokeWidth || 1;
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <path fill="none" stroke="${color}" stroke-width="${2 * strokeWidth}" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <circle cx="80" cy="80" r="40" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity=".9"></circle>
        <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>\`
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} [color]
     * @param {number} [strokeWidth]
     * @returns {string}
     */
    static placeholderToDataUrl(color, strokeWidth) {
        return `data:image/svg+xml;base64,${btoa(this.placeholder(color, strokeWidth))}`;
    }

    /* Private API */

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _svgTemplate(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        return this._$svg(await this._$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor));
    }

    /**
     * @param {number} color
     * @param {number} backgroundColor
     * @param {number} faceNr
     * @param {number} topNr
     * @param {number} sidesNr
     * @param {number} bottomNr
     * @param {number} accentColor
     * @returns {Promise<string>}
     */
    static async _$iqons(color, backgroundColor, faceNr, topNr, sidesNr, bottomNr, accentColor) {
        if (color === backgroundColor) {
            color += 1;
            if (color > 9) color = 0;
        }

        while (accentColor === color || accentColor === backgroundColor) {
            accentColor += 1;
            if (accentColor > 9) accentColor = 0;
        }

        const colorString = this.colors[color];
        const backgroundColorString = this.colors[backgroundColor];
        const accentColorString = this.colors[accentColor];

        /* eslint-disable max-len */
        return `<g color="${colorString}" fill="${accentColorString}">
    <rect fill="${backgroundColorString}" x="0" y="0" width="160" height="160"></rect>
    <circle cx="80" cy="80" r="40" fill="${colorString}"></circle>
    <g opacity=".1" fill="#010101"><path d="M119.21,80a39.46,39.46,0,0,1-67.13,28.13c10.36,2.33,36,3,49.82-14.28,10.39-12.47,8.31-33.23,4.16-43.26A39.35,39.35,0,0,1,119.21,80Z"/></g>
    ${await this._generatePart('top', topNr)}
    ${await this._generatePart('side', sidesNr)}
    ${await this._generatePart('face', faceNr)}
    ${await this._generatePart('bottom', bottomNr)}
</g>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    static _$svg(content) {
        const randomId = this._getRandomId();
        /* eslint-disable max-len */
        return `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink" >
    <defs>
        <clipPath id="hexagon-clip-${randomId}" transform="scale(0.5) translate(0, 16)">
            <path d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
        </clipPath>
    </defs>
    <path fill="white" stroke="#bbbbbb" transform="translate(0, 8) scale(0.5)" d="M251.6 17.34l63.53 110.03c5.72 9.9 5.72 22.1 0 32L251.6 269.4c-5.7 9.9-16.27 16-27.7 16H96.83c-11.43 0-22-6.1-27.7-16L5.6 159.37c-5.7-9.9-5.7-22.1 0-32L69.14 17.34c5.72-9.9 16.28-16 27.7-16H223.9c11.43 0 22 6.1 27.7 16z"/>
    <g transform="scale(0.9) translate(9, 8)">
        <g clip-path="url(#hexagon-clip-${randomId})">
            ${content}
        </g>
    </g>
</svg>`;
        /* eslint-enable max-len */
    }

    /**
     * @param {string} part
     * @param {number} index
     * @returns {Promise<string>}
     */
    static async _generatePart(part, index) {
        const assets = await this._getAssets();
        const selector = `#${part}_${this._assetIndex(index, part)}`;
        const $part = assets.querySelector(selector);
        return ($part && $part.innerHTML) || '';
    }

    /**
     * @returns {Promise<Document>}
     */
    static async _getAssets() {
        /** @type {Promise<Document>} */
        this._assetPromise = this._assetPromise || fetch(this.svgPath)
            .then(response => response.text())
            .then(assetsText => {
                const parser = new DOMParser();
                const assets = parser.parseFromString(assetsText, 'image/svg+xml');
                this._assets = assets;
                return assets;
            });
        return this._assetPromise;
    }

    static get hasAssets() {
        return !!this._assets;
    }

    /** @type {string[]} */
    static get colors() {
        return [
            '#fb8c00', // orange-600
            '#d32f2f', // red-700
            '#fbc02d', // yellow-700
            '#3949ab', // indigo-600
            '#03a9f4', // light-blue-500
            '#8e24aa', // purple-600
            '#009688', // teal-500
            '#f06292', // pink-300
            '#7cb342', // light-green-600
            '#795548', // brown-400
        ];
    }

    /** @type {object} */
    static get assetCounts() {
        return {
            face: Iqons.CATALOG.face.length,
            side: Iqons.CATALOG.side.length,
            top: Iqons.CATALOG.top.length,
            bottom: Iqons.CATALOG.bottom.length,
        };
    }

    /**
     * @param {number} index
     * @param {string} part
     * @returns {string}
     */
    static _assetIndex(index, part) {
        index = (index % this.assetCounts[part]) + 1;
        let fullIndex = index.toString();
        if (index < 10) fullIndex = `0${fullIndex}`;
        return fullIndex;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    static _hash(text) {
        return (`${text
            .split('')
            .map(c => Number(c.charCodeAt(0)) + 3)
            .reduce((a, e) => a * (1 - a) * this._chaosHash(e), 0.5)}`)
            .split('')
            .reduce((a, e) => e + a, '')
            .substr(4, 17);
    }

    /**
     * @param {number} number
     * @returns {number}
     */
    static _chaosHash(number) {
        const k = 3.569956786876;
        let an = 1 / number;
        for (let i = 0; i < 100; i++) {
            an = (1 - an) * an * k;
        }
        return an;
    }

    /**
     * @returns {number}
     */
    static _getRandomId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
}

Iqons.svgPath = '../../lib/Iqons.min.svg';

Iqons.CATALOG = {
    face: [
        'face_01', 'face_02', 'face_03', 'face_04', 'face_05', 'face_06', 'face_07',
        'face_08', 'face_09', 'face_10', 'face_11', 'face_12', 'face_13', 'face_14',
        'face_15', 'face_16', 'face_17', 'face_18', 'face_19', 'face_20', 'face_21',
    ],
    side: [
        'side_01', 'side_02', 'side_03', 'side_04', 'side_05', 'side_06', 'side_07',
        'side_08', 'side_09', 'side_10', 'side_11', 'side_12', 'side_13', 'side_14',
        'side_15', 'side_16', 'side_17', 'side_18', 'side_19', 'side_20', 'side_21',
    ],
    top: [
        'top_01', 'top_02', 'top_03', 'top_04', 'top_05', 'top_06', 'top_07',
        'top_08', 'top_09', 'top_10', 'top_11', 'top_12', 'top_13', 'top_14',
        'top_15', 'top_16', 'top_17', 'top_18', 'top_19', 'top_20', 'top_21',
    ],
    bottom: [
        'bottom_01', 'bottom_02', 'bottom_03', 'bottom_04', 'bottom_05', 'bottom_06', 'bottom_07',
        'bottom_08', 'bottom_09', 'bottom_10', 'bottom_11', 'bottom_12', 'bottom_13', 'bottom_14',
        'bottom_15', 'bottom_16', 'bottom_17', 'bottom_18', 'bottom_19', 'bottom_20', 'bottom_21',
    ],
};
const TRANSLATIONS = {
    en: {
        _language: 'English',
        loading: 'Loading...',
        continue: 'Continue',

        'passphrase-strength': 'Strength',
        'passphrase-placeholder': 'Enter passphrase',
        'passphrase-repeat-placeholder': 'Repeat passphrase',

        'privacy-warning-heading': 'Are you being watched?',
        'privacy-warning-text': 'Now is the perfect time to assess your surroundings. '
                              + 'Nearby windows? Hidden cameras? Shoulder spies? '
                              + 'Anyone with your backup phrase can access and spend your NIM.',
        'privacy-agent-continue': 'Continue',

        'recovery-words-title': 'Recovery Words',
        'recovery-words-input-label': 'Recovery Words',
        'recovery-words-input-field-placeholder': 'word #',
        'recovery-words-explanation': 'There really is no password recovery. The following words are a backup '
                                    + 'of your Key File and will grant you access to your wallet even if your '
                                    + 'Key File is lost.',
        'recovery-words-storing': 'Write those words on a piece of paper and store it at a safe, offline place.',

        'create-heading-choose-identicon': 'Choose your account avatar',
        'create-text-select-avatar': 'Select an avatar for your wallet\'s default account from the selection below.',
        'create-hint-more-accounts': 'You can add more accounts later.',
        'create-heading-keyfile': 'This is your Key File',
        'create-text-keyfile-info': 'Your Key File gives you full access to your wallet. '
                                  + 'You\'ll need it everytime you log in.',
        'create-hint-keyfile-password': 'To protect your wallet, first protect it with a password.',
        'create-heading-backup-account': 'Create a backup',
        'create-heading-validate-backup': 'Validate your backup',

        'import-heading-log-in': 'Log in',
        'import-link-no-wallet': 'Don\'t have a wallet yet?',
        'import-heading-protect': 'Protect your wallet',
        'import-text-set-password': 'You can now set a password to encrypt your wallet on this device.',

        'import-file-lost-file': 'Lost your Key File? You can recover your account with your 24 Recovery Words.',
        'import-file-button-words': 'Enter Recovery Words',
        'import-file-heading-unlock': 'Unlock your Key File',
        'import-file-text-unprotected-keyfile': 'Your Key File is unprotected.',

        'file-import-prompt': 'Drop your Key File here',
        'file-import-click-hint': 'Or click to select a file.',

        'enter-recovery-words-heading': 'Import from recovery words',
        'enter-recovery-words-subheading': 'Please enter your 24 recovery words.',

        'choose-key-type-heading': 'Choose key type',
        'choose-key-type-subheading': 'We couldn\'t determine the type of your key. Please select it below.',
        'choose-key-type-or': 'or',
        'choose-key-type-legacy-address-heading': 'Single address',
        'choose-key-type-legacy-address-info': 'Created before xx/xx/2018',
        'choose-key-type-bip39-address-heading': 'Multiple addresses',
        'choose-key-type-bip39-address-info': 'Created after xx/xx/2018',

        'sign-tx-heading': 'New Transaction',
        'sign-tx-includes': 'includes',
        'sign-tx-fee': 'fee',
        'sign-tx-youre-sending': 'You\'re sending',
        'sign-tx-to': 'to',
        'sign-tx-pay-with': 'Pay with',

        'passphrasebox-enter-passphrase': 'Enter your passphrase',
        'passphrasebox-protect-keyfile': 'Protect your keyfile with a password',
        'passphrasebox-repeat-password': 'Repeat your password',
        'passphrasebox-continue': 'Continue',
        'passphrasebox-log-in': 'Log in to your wallet',
        'passphrasebox-log-out': 'Confirm logout',
        'passphrasebox-download': 'Download key file',
        'passphrasebox-confirm-tx': 'Confirm transaction',
        'passphrasebox-password-strength-8': 'Great, that\'s a good password!',
        'passphrasebox-password-strength-10': 'Super, that\'s a strong password!',
        'passphrasebox-password-strength-12': 'Excellent, that\'s a very strong password!',
        'passphrasebox-password-hint': 'Your password should have at least 8 characters.',
        'passphrasebox-password-skip': 'Skip password protection for now',

        'identicon-selector-loading': 'Mixing colors',
        'identicon-selector-button-select': 'Select',
        'identicon-selector-link-back': 'Back',

        'downloadkeyfile-heading-protected': 'Your Key File is protected!',
        'downloadkeyfile-heading-unprotected': 'Your Key File is not protected!',
        'downloadkeyfile-safe-place': 'Store it in a safe place. If you lose it, it cannot be recovered!',
        'downloadkeyfile-download': 'Download Key File',
        'downloadkeyfile-download-anyway': 'Download anyway',

        'validate-words-text': 'Please select the correct word from your list of recovery words.',
        'validate-words-back': 'Back to words',
        'validate-words-skip': 'Skip validation for now',
    },
    de: {
        _language: 'Deutsch',
        loading: 'Wird geladen...',
        continue: 'Weiter',

        'passphrase-strength': 'Stärke',
        'passphrase-placeholder': 'Passphrase eingeben',
        'passphrase-repeat-placeholder': 'Passphrase wiederholen',

        'privacy-warning-heading': 'Wirst du beobachtet?',
        'privacy-warning-text': 'Jetzt ist eine gute Zeit um sich umzuschauen. Gibt es Fenster in der Nähe? '
                              + 'Versteckte Kameras? Jemand der über deine Schulter schaut? '
                              + 'Jeder der deine Wiederherstellungswörter hat, kann auf deine NIM zugreifen '
                              + 'und sie ausgeben.',
        'privacy-agent-continue': 'Weiter',

        'recovery-words-title': 'Wiederherstellungswörter',
        'recovery-words-input-label': 'Wiederherstellungswörter',
        'recovery-words-input-field-placeholder': 'Wort ',
        'recovery-words-explanation': 'Es gibt wirklich keine Password-Wiederherstellung. Die folgenden Wörter '
                                    + 'sind ein Backup von deiner Schlüsseldatei und werden dir Zugang zu deiner '
                                    + 'Wallet gewähren, auch wenn deine Schlüsseldatei verloren ist.',
        'recovery-words-storing': 'Schreibe diese Wörter auf ein Stück Papier und verwahre es an einem sicheren, '
                                + 'analogen Ort.',

        'create-heading-choose-identicon': 'Wähle deinen Konto Avatar',
        'create-text-select-avatar': 'Wähle einen Avatar für den Standard-Account deiner Wallet aus der Auswahl unten.',
        'create-hint-more-accounts': 'Neue Konten kannst du später hinzufügen.',
        'create-heading-keyfile': 'Das ist deine Wallet Datei',
        'create-text-keyfile-info': 'Deine Wallet Datei gibt dir vollen Zugang zu deiner Wallet. '
                                  + 'Du brauchst sie jedesmal wenn du dich einloggst.',
        'create-hint-keyfile-password': 'Um deine Wallet zu schützen, schütze es mit einem Passwort.',
        'create-heading-backup-account': 'Erstelle ein Backup',
        'create-heading-validate-backup': 'Überprüfe dein Backup',

        'import-heading-log-in': 'Einloggen',
        'import-link-no-wallet': 'Du hast noch keine Wallet?',
        'import-heading-protect': 'Wallet verschlüsseln',
        'import-text-set-password': 'Du kannst jetzt ein Passwort eingeben, um deine Wallet auf diesem '
                                  + 'Gerät zu verschlüsseln.',

        'import-file-lost-file': 'Schlüsseldatei verloren? Du kannst deinen Account mit deinen 24 '
                               + 'Wiederherstellungswörtern wiederherstellen',
        'import-file-button-words': 'Wiederherstellungswörter eingeben',
        'import-file-heading-unlock': 'Entsperre deine Schlüsseldatei',
        'import-file-text-unprotected-keyfile': 'Deine Schlüsseldatei ist ungeschützt.',

        'file-import-prompt': 'Ziehe deine Schlüsseldatei auf dieses Feld',
        'file-import-click-hint': 'Oder klicke um eine Datei auszuwählen.',

        'enter-recovery-words-heading': 'Mit Wiederherstellungswörtern importieren',
        'enter-recovery-words-subheading': 'Bitte gib deine 24 Wiederherstellungswörter ein.',

        'choose-key-type-heading': 'Schlüsseltyp wählen',
        'choose-key-type-subheading': 'Wir konnten den Typ deines Schlüssels nicht automatisch ermitteln. '
                                    + 'Bitte wähle ihn unten aus.',
        'choose-key-type-or': 'oder',
        'choose-key-type-legacy-address-heading': 'Einzelne Adresse',
        'choose-key-type-legacy-address-info': 'Erstellt vor xx.xx.2018',
        'choose-key-type-bip39-address-heading': 'Mehrere Adressen',
        'choose-key-type-bip39-address-info': 'Erstellt nach xx.xx.2018',

        'sign-tx-heading': 'Neue Überweisung',
        'sign-tx-includes': 'inklusive',
        'sign-tx-fee': 'Gebühr',
        'sign-tx-youre-sending': 'Du sendest',
        'sign-tx-to': 'an',
        'sign-tx-pay-with': 'Zahle mit',

        'passphrasebox-enter-passphrase': 'Gib deine Passphrase ein',
        'passphrasebox-protect-keyfile': 'Sichere dein KeyFile mit einem Passwort',
        'passphrasebox-repeat-password': 'Wiederhole dein Passwort',
        'passphrasebox-continue': 'Weiter',
        'passphrasebox-log-in': 'In deine Wallet einloggen',
        'passphrasebox-log-out': 'Abmeldung bestätigen',
        'passphrasebox-download': 'KeyFile herunterladen',
        'passphrasebox-confirm-tx': 'Überweisung bestätigen',
        'passphrasebox-password-strength-8': 'Schön, das ist ein gutes Passwort!',
        'passphrasebox-password-strength-10': 'Super, das ist ein starkes Passwort!',
        'passphrasebox-password-strength-12': 'Exzellent, das ist ein sehr starkes Passwort!',
        'passphrasebox-password-hint': 'Dein Passwort muss mindestens 8 Zeichen haben.',
        'passphrasebox-password-skip': 'Passwortschutz erstmal überspringen',

        'identicon-selector-loading': 'Mische Farben',
        'identicon-selector-button-select': 'Auswählen',
        'identicon-selector-link-back': 'Zurück',

        'downloadkeyfile-heading-protected': 'Dein Schlüsseldatei ist geschützt!',
        'downloadkeyfile-heading-unprotected': 'Dein Schlüsseldatei ist nicht geschützt!',
        'downloadkeyfile-safe-place': 'Lagere sie in einem sicheren Ort. Wenn du sie verlierst, '
                                    + 'kann sie nicht wiederhergestellt werden!',
        'downloadkeyfile-download': 'Schlüsseldatei herunterladen',
        'downloadkeyfile-download-anyway': 'Trotzdem herunterladen',

        'validate-words-text': 'Bitte wähle das richtige Wort aus deiner Liste von Wiederherstellungswörtern aus.',
        'validate-words-back': 'Zurück zu den Wörtern',
        'validate-words-skip': 'Überprüfung erstmal überspringen',
    },
};

if (typeof module !== 'undefined') module.exports = TRANSLATIONS;
else window.TRANSLATIONS = TRANSLATIONS;
/* global Nimiq */
/* global RpcServer */

/**
 * @returns {string}
 */
function allowedOrigin() {
    switch (window.location.origin) {
    case 'https://keyguard-next.nimiq.com': return 'https://accounts.nimiq.com';
    case 'https://keyguard-next.nimiq-testnet.com': return 'https://accounts.nimiq-testnet.com';
    default: return '*';
    }
}

/**
 * @param {Newable} RequestApiClass - Class object of the API which is to be exposed via postMessage RPC
 * @param {object} [options]
 */
async function runKeyguard(RequestApiClass, options) { // eslint-disable-line no-unused-vars
    const defaultOptions = {
        loadNimiq: true,
        whitelist: ['request'],
    };

    options = Object.assign(defaultOptions, options);

    if (options.loadNimiq) {
        // Load web assembly encryption library into browser (if supported)
        await Nimiq.WasmHelper.doImportBrowser();
        // Configure to use test net for now
        Nimiq.GenesisConfig.test();
    }

    // If user navigates back to loading screen, skip it
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '') {
            window.history.back();
        }
    });

    // Back arrow functionality
    document.body.addEventListener('click', event => {
        // @ts-ignore
        if (!event.target || !event.target.matches('a.page-header-back-button')) return;
        window.history.back();
    });

    // Instantiate handler.
    /** @type {TopLevelApi} */
    const api = new RequestApiClass();

    window.rpcServer = new RpcServer(allowedOrigin());

    // TODO: Use options.whitelist when adding onRequest handlers (iframe uses different methods)
    window.rpcServer.onRequest('request', (state, request) => api.request(request));

    window.rpcServer.init();
}
/* global Iqons */

class Identicon { // eslint-disable-line no-unused-vars
    /**
     * @param {string} [address]
     * @param {HTMLDivElement} [$el]
     */
    constructor(address, $el) {
        this._address = address;

        this.$el = Identicon._createElement($el);
        this.$imgEl = this.$el.firstChild;

        this._updateIqon();
    }

    /**
     * @returns {HTMLDivElement}
     */
    getElement() {
        return this.$el;
    }

    /**
     * @param {string} address
     */
    set address(address) {
        this._address = address;
        this._updateIqon();
    }

    /**
     * @param {HTMLDivElement} [$el]
     * @returns {HTMLDivElement}
     */
    static _createElement($el) {
        const $element = $el || document.createElement('div');
        const imageElement = document.createElement('img');
        $element.classList.add('identicon');
        $element.appendChild(imageElement);

        return $element;
    }

    _updateIqon() {
        if (!this._address || !Iqons.hasAssets) {
            /** @type {HTMLImageElement} */ (this.$imgEl).src = Iqons.placeholderToDataUrl();
        }

        if (this._address) {
            Iqons.toDataUrl(this._address).then(url => {
                // Placeholder setting above is synchronous, thus this async result will replace the placeholder
                /** @type {HTMLImageElement} */ (this.$imgEl).src = url;
            });
        }
    }
}
/* global I18n */
/* global Nimiq */
/* global PrivacyWarning */

class PrivacyAgent extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [element]
     */
    constructor(element) {
        super();
        this.$el = this._createElement(element);

        /** @type {HTMLElement} */
        const $privacyWarning = (this.$el.querySelector('.privacy-warning'));

        /** @type {HTMLButtonElement} */
        const $button = (this.$el.querySelector('button'));

        this._privacyWarning = new PrivacyWarning($privacyWarning);

        $button.addEventListener('click', () => {
            this.fire(PrivacyAgent.Events.CONFIRM);
        });
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-agent');

        $el.innerHTML = `
            <div class="privacy-warning"></div>
            <div class="grow"></div>
            <button data-i18n="privacy-agent-continue">Continue</button>
        `;

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}

PrivacyAgent.Events = {
    CONFIRM: 'privacy-agent-confirm',
};
/* global I18n */

class PrivacyWarning { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLElement} [$el]
     */
    constructor($el) {
        this.$el = PrivacyWarning._createElement($el);
    }

    /**
     * @param {HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        /** @type HTMLElement */
        $el = $el || document.createElement('div');
        $el.classList.add('privacy-warning');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="privacy-warning-top">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 76 76" xml:space="preserve">
                <g>
                    <path d="M38,0C17.05,0,0,17.05,0,38s17.05,38,38,38s38-17.05,38-38S58.95,0,38,0z M24.47,28.26L24.18,28l-0.04-0.03
                        c0.49-2.86,1.28-6.61,2.44-9.77c0.66-1.8,1.45-3.39,2.29-4.45c0.84-1.06,1.63-1.53,2.44-1.53c1.42,0,2.27,0.43,3.21,0.97
                        c0.94,0.53,2,1.25,3.48,1.25s2.54-0.72,3.48-1.25c0.94-0.53,1.79-0.97,3.21-0.97c0.81,0,1.6,0.47,2.44,1.53
                        c0.84,1.06,1.63,2.65,2.29,4.45c1.32,3.59,2.18,8.01,2.64,10.94c0.08,0.47,0.44,0.84,0.91,0.92c2.8,0.5,5.07,1.14,6.56,1.82
                        c0.74,0.34,1.28,0.69,1.58,0.97c0.3,0.28,0.32,0.43,0.32,0.49c0,0.05-0.01,0.15-0.21,0.38c-0.2,0.22-0.59,0.51-1.13,0.8
                        c-1.09,0.59-2.82,1.18-4.98,1.67c-0.81,0.18-1.72,0.35-2.65,0.51c-0.1,0.01-0.2,0.02-0.24,0.04c-3.97,0.65-8.88,1.05-14.2,1.05
                        s-10.23-0.4-14.2-1.05c-0.05-0.02-0.15-0.03-0.24-0.04c-0.94-0.16-1.84-0.33-2.65-0.51c-2.16-0.49-3.89-1.08-4.98-1.67
                        c-0.54-0.29-0.93-0.58-1.13-0.8c-0.2-0.23-0.21-0.33-0.21-0.38c0-0.06,0.02-0.2,0.32-0.49c0.3-0.28,0.84-0.63,1.58-0.97
                        c1.49-0.68,3.76-1.32,6.56-1.82c0.13-0.02,0.25-0.07,0.36-0.13l0.61,0.05l0.67-0.74L24.47,28.26z M23.26,38.92
                        c0.02,0.01,0.03,0.01,0.05,0.03c0.19,0.1,0.45,0.24,0.74,0.41l1.68,0.98v-1.08c0.78,0.1,1.57,0.2,2.39,0.28
                        c-0.1,0.27-0.16,0.56-0.16,0.91c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.17-0.03-0.31-0.06-0.46C37.22,39.99,37.6,40,38,40
                        s0.78-0.01,1.17-0.01c-0.02,0.15-0.06,0.29-0.06,0.46c0,2.2,2,4,4.46,4c2.47,0,4.46-1.79,4.46-4c0-0.35-0.07-0.64-0.16-0.91
                        c0.82-0.08,1.62-0.17,2.39-0.28v1.08l1.68-0.98c0.29-0.16,0.55-0.31,0.74-0.41c0.02-0.01,0.03-0.01,0.05-0.03
                        c0.51,0.05,0.88,0.41,0.88,0.86c0,0.08-0.13,0.73-0.3,1.32c-0.09,0.29-0.17,0.58-0.25,0.84c-0.07,0.26-0.15,0.45-0.15,0.84
                        c0,0.3-0.24,0.56-0.63,0.56h-2.02v1.52c0,6.02-4.36,11-10.1,12.02l-0.32,0.05l-0.24,0.22c-0.44,0.39-0.98,0.63-1.61,0.63
                        s-1.17-0.23-1.61-0.63l-0.24-0.22l-0.32-0.05c-5.74-1.02-10.1-6-10.1-12.02v-1.52h-2.02c-0.38,0-0.63-0.26-0.63-0.56
                        c0-0.39-0.07-0.58-0.15-0.84c-0.07-0.26-0.16-0.56-0.25-0.84c-0.17-0.58-0.3-1.23-0.3-1.32C22.38,39.33,22.75,38.98,23.26,38.92z
                            M49.92,62.2l5.45,6.53l-2.61,2.09c-3.6,1.62-7.51,2.68-11.61,3.03c0.38-0.85,0.79-1.81,1.23-2.89c1.67-4.15,3.35-9.37,3.42-14.02
                        c2.55-1.64,4.54-4.06,5.64-6.93c1.44,0.23,3.08,1.08,4.39,1.98c1.05,0.73,1.37,1.08,1.78,1.46L49.92,62.2z M56.05,58.6
                        c1.98,1.23,4.1,3.14,5.74,5.17c0.19,0.24,0.38,0.48,0.55,0.73c-1.43,1.31-2.97,2.51-4.6,3.58l-4.89-5.84L56.05,58.6z M30.21,56.94
                        c0.06,4.65,1.75,9.88,3.42,14.03c0.43,1.08,0.85,2.04,1.23,2.89c-4.11-0.36-8.01-1.41-11.61-3.03l-2.61-2.09l5.45-6.53l-7.68-8.75
                        c0.41-0.38,0.72-0.73,1.78-1.46c1.31-0.91,2.95-1.76,4.39-1.98C25.67,52.88,27.66,55.3,30.21,56.94z M23.15,62.24l-4.89,5.84
                        c-1.6-1.05-3.11-2.22-4.51-3.5c0.17-0.22,0.34-0.45,0.53-0.67c1.67-2,3.83-3.89,5.85-5.11L23.15,62.24z M37.4,73.98
                        c-0.43-0.84-0.94-1.91-1.72-3.84c-1.46-3.63-2.89-8.13-3.2-12.01c0.85,0.35,1.73,0.63,2.66,0.82C35.93,59.58,36.91,60,38,60
                        c1.08,0,2.06-0.42,2.84-1.04c0.93-0.18,1.82-0.46,2.67-0.82c-0.31,3.87-1.74,8.37-3.2,12c-0.78,1.93-1.29,3-1.72,3.84
                        c-0.2,0-0.4,0.02-0.6,0.02S37.6,73.99,37.4,73.98z M63.93,62.93c-0.14-0.18-0.26-0.37-0.41-0.55c-1.71-2.12-3.83-4.08-5.99-5.47
                        l3.18-3.62l-0.73-0.73c0,0-1.18-1.19-2.88-2.38c-1.39-0.96-3.13-1.96-5.03-2.31c0.16-0.76,0.27-1.55,0.3-2.34
                        c1.5-0.05,2.77-1.23,2.77-2.74c0,0.16,0.01-0.05,0.07-0.26c0.06-0.21,0.14-0.49,0.23-0.8c0.18-0.6,0.4-1.22,0.4-1.94
                        c0-0.51-0.14-0.99-0.37-1.41c0.03-0.01,0.08-0.02,0.12-0.02c2.28-0.52,4.15-1.13,5.54-1.87c0.69-0.37,1.28-0.78,1.73-1.28
                        c0.45-0.5,0.78-1.15,0.78-1.86c0-0.82-0.44-1.55-1.01-2.09c-0.57-0.55-1.3-0.99-2.19-1.39c-1.58-0.72-3.83-1.28-6.32-1.77
                        c-0.49-2.98-1.3-7.06-2.63-10.66c-0.71-1.93-1.55-3.69-2.63-5.06C47.81,11.02,46.39,10,44.69,10c-1.92,0-3.3,0.68-4.32,1.26
                        c-1.02,0.58-1.63,0.96-2.37,0.96s-1.36-0.39-2.37-0.96c-1.02-0.58-2.4-1.26-4.32-1.26c-1.7,0-3.12,1.02-4.19,2.38
                        c-1.08,1.36-1.92,3.13-2.63,5.06c-1.33,3.6-2.13,7.67-2.63,10.66c-2.49,0.49-4.74,1.05-6.32,1.77c-0.89,0.4-1.62,0.84-2.19,1.39
                        c-0.57,0.54-1.01,1.26-1.01,2.09c0,0.71,0.33,1.36,0.78,1.86c0.45,0.5,1.04,0.91,1.73,1.28c1.39,0.74,3.26,1.35,5.54,1.87
                        c0.04,0,0.08,0.01,0.12,0.02c-0.23,0.43-0.37,0.9-0.37,1.41c0,0.72,0.22,1.34,0.4,1.94c0.09,0.3,0.17,0.59,0.23,0.8
                        c0.06,0.21,0.07,0.42,0.07,0.26c0,1.51,1.27,2.69,2.77,2.74c0.03,0.8,0.14,1.58,0.3,2.34c-1.9,0.35-3.64,1.35-5.03,2.31
                        c-1.7,1.18-2.88,2.38-2.88,2.38l-0.73,0.73l3.35,3.82c-2.18,1.38-4.34,3.31-6.08,5.39c-0.14,0.17-0.27,0.35-0.41,0.52
                        C5.87,56.53,2,47.71,2,38C2,18.15,18.15,2,38,2s36,16.15,36,36C74,47.67,70.16,56.45,63.93,62.93z"/>
                    <polygon points="45.58,32.59 45.97,32.57 46.08,32.55 46.87,31.94 46.85,30.95 46.03,30.36 45.64,30.38 45.53,30.4
                        44.74,31.01 44.76,32.01"/>
                    <polygon points="50.15,31.46 50.54,31.39 50.65,31.35 51.34,30.64 51.18,29.66 50.3,29.2 49.91,29.26 49.8,29.3
                        49.11,30.01 49.27,30.99"/>
                    <polygon points="41.29,33.21 41.4,33.2 42.27,32.7 42.38,31.71 41.66,31.03 41.26,30.99 41.15,30.99 40.29,31.49
                        40.17,32.48 40.9,33.16"/>
                    <polygon points="31.94,32.89 32.04,32.9 33,32.6 33.32,31.65 32.75,30.83 32.38,30.71 32.27,30.69 31.32,31
                        30.99,31.94 31.56,32.76"/>
                    <polygon points="36.63,33.3 36.74,33.31 37.64,32.88 37.84,31.91 37.17,31.16 36.78,31.09 36.68,31.08 35.77,31.51
                        35.58,32.49 36.24,33.23"/>
                    <polygon points="27.33,31.82 27.43,31.85 28.42,31.68 28.87,30.8 28.43,29.91 28.08,29.73 27.98,29.7 26.99,29.86
                        26.54,30.75 26.98,31.64"/>
                </g>
                </svg>
                <h1 data-i18n="privacy-warning-heading">Are you being watched?</h1>
            </div>
            <p data-i18n="privacy-warning-text">Now is the perfect time to assess your surroundings. Nearby windows? Hidden cameras? Shoulder spies? Anyone with your backup phrase can access and spend your NIM.</p>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWordsInputField */
/* global AnimationUtils */

class RecoveryWords extends Nimiq.Observable {
    /**
     *
     * @param {HTMLElement} [$el]
     * @param {boolean} providesInput
     */
    constructor($el, providesInput) {
        super();

        /** @type {Object[]} */
        this.$fields = [];

        /** @type {HTMLElement} */
        this.$el = this._createElement($el, providesInput);

        /**
         * @type {?{words: Array<string>, type: number}}
         * @private
         */
        this._mnemonic = null;
    }

    /**
     * @param {string[]} words
     */
    setWords(words) {
        for (let i = 0; i < 24; i++) {
            this.$fields[i].textContent = words[i];
        }
    }

    /**
     * @param {Nimiq.Entropy | Uint8Array} entropy
     */
    set entropy(entropy) {
        const words = Nimiq.MnemonicUtils.entropyToMnemonic(entropy, Nimiq.MnemonicUtils.DEFAULT_WORDLIST);
        this.setWords(words);
    }

    /**
     * @param {HTMLElement} [$el]
     * @param {boolean} input
     * @returns {HTMLElement}
     * */
    _createElement($el, input = true) {
        $el = $el || document.createElement('div');
        $el.classList.add('recovery-words');

        $el.innerHTML = `
            <div class="words-container">
                <div class="title-wrapper">
                    <div class="title" data-i18n="recovery-words-title">Recovery Words</div>
                </div>
                <div class="word-section"> </div>
            </div>
        `;

        const wordSection = /** @type {HTMLElement} */ ($el.querySelector('.word-section'));

        for (let i = 0; i < 24; i++) {
            if (input) {
                const field = new RecoveryWordsInputField(i);
                field.element.classList.add('word');
                field.element.dataset.i = i.toString();
                field.on(RecoveryWordsInputField.Events.VALID, this._onFieldComplete.bind(this));
                field.on(RecoveryWordsInputField.Events.INVALID, this._onFieldIncomplete.bind(this));
                field.on(RecoveryWordsInputField.Events.FOCUS_NEXT, this._setFocusToNextInput.bind(this));

                this.$fields.push(field);
                wordSection.appendChild(field.element);
            } else {
                const content = document.createElement('span');
                content.classList.add('word-content');
                content.title = `word #${i + 1}`;
                this.$fields.push(content);

                const word = document.createElement('div');
                word.classList.add('word');
                word.classList.add('recovery-words-input-field');
                word.appendChild(content);
                wordSection.appendChild(word);
            }
        }

        I18n.translateDom($el);

        return $el;
    }

    focus() {
        this.$fields[0].focus();
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    _onFieldComplete() {
        this._checkPhraseComplete();
    }

    _onFieldIncomplete() {
        if (this._mnemonic) {
            this._mnemonic = null;
            this.fire(RecoveryWords.Events.INCOMPLETE);
        }
    }

    _checkPhraseComplete() {
        // Check if all fields are complete
        if (this.$fields.some(field => !field.complete)) {
            this._onFieldIncomplete();
            return;
        }

        try {
            const mnemonic = this.$fields.map(field => field.value);
            const type = Nimiq.MnemonicUtils.getMnemonicType(mnemonic); // throws on invalid mnemonic
            this._mnemonic = { words: mnemonic, type };
            this.fire(RecoveryWords.Events.COMPLETE, mnemonic, type);
        } catch (e) {
            if (e.message !== 'Invalid checksum') {
                console.error(e); // eslint-disable-line no-console
            } else {
                // wrong words
                if (this._mnemonic) {
                    this._mnemonic = null;
                    this.fire(RecoveryWords.Events.INVALID);
                }
                this._animateError();
            }
        }
    }

    /**
     * @param {number} index
     * @param {?string} paste
     */
    _setFocusToNextInput(index, paste) {
        if (index < this.$fields.length) {
            this.$fields[index].focus();
            if (paste) {
                this.$fields[index].fillValueFrom(paste);
            }
        }
    }

    _animateError() {
        AnimationUtils.animate('shake', this.$el);
    }

    get mnemonic() {
        return this._mnemonic ? this._mnemonic.words : null;
    }

    get mnemonicType() {
        return this._mnemonic ? this._mnemonic.type : null;
    }
}

RecoveryWords.Events = {
    COMPLETE: 'recovery-words-complete',
    INCOMPLETE: 'recovery-words-incomplete',
    INVALID: 'recovery-words-invalid',
};
/* global Nimiq */
/* global I18n */
/* global AutoComplete */
/* global AnimationUtils */

class RecoveryWordsInputField extends Nimiq.Observable {
    /**
     *
     * @param {number} index
     */
    constructor(index) {
        super();

        this._index = index;

        /** @type {string} */
        this._value = '';

        this.complete = false;

        this.dom = this._createElements();
        this._setupAutocomplete();
    }

    /**
     * @param {string} paste
     */
    fillValueFrom(paste) {
        if (paste.indexOf(' ') !== -1) {
            this.value = paste.substr(0, paste.indexOf(' '));
            this._checkValidity();

            this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1, paste.substr(paste.indexOf(' ') + 1));
        } else {
            this.value = paste;
            this._checkValidity();
        }
    }

    /**
     * @returns {{ element: HTMLElement, input: HTMLInputElement, placeholder: HTMLDivElement }}
     */
    _createElements() {
        const element = document.createElement('div');
        element.classList.add('recovery-words-input-field');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'none');
        input.setAttribute('spellcheck', 'false');

        /** */
        const setPlaceholder = () => {
            input.placeholder = `${I18n.translatePhrase('recovery-words-input-field-placeholder')}${this._index + 1}`;
        };
        I18n.observer.on(I18n.Events.LANGUAGE_CHANGED, setPlaceholder);
        setPlaceholder();

        input.addEventListener('keydown', this._onKeydown.bind(this));
        input.addEventListener('keyup', this._onKeyup.bind(this));
        input.addEventListener('paste', this._onPaste.bind(this));
        input.addEventListener('blur', this._onBlur.bind(this));

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.textContent = (this._index + 1).toString();
        element.appendChild(input);

        return { element, input, placeholder };
    }

    _setupAutocomplete() {
        this.autocomplete = new AutoComplete({
            selector: this.dom.input,
            source: /** @param{string} term @param{function} response */ (term, response) => {
                term = term.toLowerCase();
                const list = Nimiq.MnemonicUtils.DEFAULT_WORDLIST.filter(word => word.startsWith(term));
                response(list);
            },
            onSelect: this._focusNext.bind(this),
            minChars: 3,
            delay: 0,
        });
    }

    focus() {
        // cf. https://stackoverflow.com/questions/20747591
        setTimeout(() => this.dom.input.focus(), 50);
    }

    get value() {
        return this.dom.input.value;
    }

    set value(value) {
        this.dom.input.value = value;
        this._value = value;
    }

    get element() {
        return this.dom.element;
    }

    _onBlur() {
        this._checkValidity();
    }

    /**
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
        if (e.keyCode === 32 /* space */) {
            e.preventDefault();
        }

        if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
            this._checkValidity(true);
        }
    }

    _onKeyup() {
        this._onValueChanged();
    }

    /**
     * @param {ClipboardEvent} e
     */
    _onPaste(e) {
        // @ts-ignore window.clipboardData not defined
        let paste = (e.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/\s+/g, ' ');
        if (paste && paste.split(' ').length > 1) {
            e.preventDefault();
            e.stopPropagation();
            this.fillValueFrom(paste);
        }
    }

    /**
     *
     * @param {boolean} [setFocusToNextInput]
     */
    _checkValidity(setFocusToNextInput = false) {
        if (Nimiq.MnemonicUtils.DEFAULT_WORDLIST.indexOf(this.value.toLowerCase()) >= 0) {
            this.complete = true;
            this.dom.element.classList.add('complete');
            this.fire(RecoveryWordsInputField.Events.VALID, this);

            if (setFocusToNextInput) {
                this._focusNext();
            }
        } else {
            this._onInvalid();
        }
    }

    _focusNext() {
        this.fire(RecoveryWordsInputField.Events.FOCUS_NEXT, this._index + 1);
    }

    _onInvalid() {
        this.dom.input.value = '';
        this._onValueChanged();
        AnimationUtils.animate('shake', this.dom.input);
    }

    _onValueChanged() {
        if (this.value === this._value) return;

        if (this.complete) {
            this.complete = false;
            this.dom.element.classList.remove('complete');
            this.fire(RecoveryWordsInputField.Events.INVALID, this);
        }

        this._value = this.value;
    }
}

/**
 * @type {RecoveryWordsInputField | undefined} _revealedWord
 */
RecoveryWordsInputField._revealedWord = undefined;

RecoveryWordsInputField.Events = {
    FOCUS_NEXT: 'recovery-words-focus-next',
    VALID: 'recovery-word-valid',
    INVALID: 'recovery-word-invalid',
};
/* global Nimiq */
/* global AnimationUtils */
/* global I18n */

class PassphraseInput extends Nimiq.Observable {
    /**
     * @param {?HTMLElement} $el
     * @param {string} placeholder
     * @param {boolean} [showStrengthIndicator]
     */
    constructor($el, placeholder = '••••••••', showStrengthIndicator = false) {
        super();
        this._minLength = PassphraseInput.DEFAULT_MIN_LENGTH;
        this._showStrengthIndicator = showStrengthIndicator;
        this.$el = PassphraseInput._createElement($el);
        this.$inputContainer = /** @type {HTMLElement} */ (this.$el.querySelector('.input-container'));
        this.$input = /** @type {HTMLInputElement} */ (this.$el.querySelector('input.password'));
        this.$eyeButton = /** @type {HTMLElement} */ (this.$el.querySelector('.eye-button'));

        /** @type {HTMLElement} */
        this.$strengthIndicator = (this.$el.querySelector('.strength-indicator'));
        /** @type {HTMLElement} */
        this.$strengthIndicatorContainer = (this.$el.querySelector('.strength-indicator-container'));
        if (!showStrengthIndicator) {
            this.$strengthIndicatorContainer.style.display = 'none';
        }

        this.$input.placeholder = placeholder;

        this.$eyeButton.addEventListener('click', () => this._changeVisibility());

        this._onInputChanged();
        this.$input.addEventListener('input', () => this._onInputChanged());
    }

    /**
     * @param {?HTMLElement} [$el]
     * @returns {HTMLElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-input');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <div class="input-container">
                <input class="password" type="password" placeholder="Enter Passphrase">
                <span class="eye-button icon-eye"/>
            </div>
            <div class="strength-indicator-container">
                <div class="label"><span data-i18n="passphrase-strength">Strength</span>:</div>
                <meter max="130" low="10" optimum="100" class="strength-indicator"></meter>
            </div>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    /** @type {HTMLInputElement} */
    get input() {
        return this.$input;
    }

    focus() {
        this.$input.focus();
    }

    reset() {
        this.$input.value = '';
        this._changeVisibility(false);
        this._onInputChanged();
    }

    async onPassphraseIncorrect() {
        await AnimationUtils.animate('shake', this.$inputContainer);
        this.reset();
    }

    /** @param {boolean} [becomeVisible] */
    _changeVisibility(becomeVisible) {
        becomeVisible = typeof becomeVisible !== 'undefined'
            ? becomeVisible
            : this.$input.getAttribute('type') === 'password';
        this.$input.setAttribute('type', becomeVisible ? 'text' : 'password');
        this.$eyeButton.classList.toggle('icon-eye-off', becomeVisible);
        this.$eyeButton.classList.toggle('icon-eye', !becomeVisible);
        this.$input.focus();
    }

    _onInputChanged() {
        const passphraseLength = this.$input.value.length;
        this._updateStrengthIndicator();
        this.valid = passphraseLength >= this._minLength;

        this.fire(PassphraseInput.Events.VALID, this.valid);
    }

    _updateStrengthIndicator() {
        const passphraseLength = this.$input.value.length;
        let strengthIndicatorValue;
        if (passphraseLength === 0) {
            strengthIndicatorValue = 0;
        } else if (passphraseLength < 7) {
            strengthIndicatorValue = 10;
        } else if (passphraseLength < 10) {
            strengthIndicatorValue = 70;
        } else if (passphraseLength < 14) {
            strengthIndicatorValue = 100;
        } else {
            strengthIndicatorValue = 130;
        }
        this.$strengthIndicator.setAttribute('value', String(strengthIndicatorValue));
    }

    /**
     * @returns {string}
     */
    get text() {
        return this.$input.value;
    }

    /**
     * @param {number} [minLength]
     */
    setMinLength(minLength) {
        this._minLength = minLength || PassphraseInput.DEFAULT_MIN_LENGTH;
    }
}

PassphraseInput.Events = {
    VALID: 'passphraseinput-valid',
};

PassphraseInput.DEFAULT_MIN_LENGTH = 8;
/* global Nimiq */
/* global I18n */
/* global PassphraseInput */

class PassphraseSetterBox extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} $el
     * @param {object} [options]
     */
    constructor($el, options = {}) {
        const defaults = {
            bgColor: 'purple',
        };

        super();

        this._password = '';

        /** @type {object} */
        this.options = Object.assign(defaults, options);

        this.$el = PassphraseSetterBox._createElement($el, this.options);

        this._passphraseInput = new PassphraseInput(this.$el.querySelector('[passphrase-input]'));
        this._passphraseInput.on(PassphraseInput.Events.VALID, isValid => this._onInputChangeValidity(isValid));

        this.$el.addEventListener('submit', event => this._onSubmit(event));

        /** @type {HTMLElement} */
        (this.$el.querySelector('.password-skip')).addEventListener('click', () => this._onSkip());
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @param {object} options
     * @returns {HTMLFormElement}
     */
    static _createElement($el, options) {
        $el = $el || document.createElement('form');
        $el.classList.add('passphrase-box', 'actionbox', 'setter', 'center', options.bgColor);

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h2 class="prompt protect" data-i18n="passphrasebox-protect-keyfile">Protect your keyfile with a password</h2>
            <h2 class="prompt repeat" data-i18n="passphrasebox-repeat-password">Repeat your password</h2>

            <div passphrase-input></div>

            <div class="password-strength strength-8"  data-i18n="passphrasebox-password-strength-8" >Great, that's a good password!</div>
            <div class="password-strength strength-10" data-i18n="passphrasebox-password-strength-10">Super, that's a strong password!</div>
            <div class="password-strength strength-12" data-i18n="passphrasebox-password-strength-12">Excellent, that's a very strong password!</div>

            <div class="password-hint" data-i18n="passphrasebox-password-hint">Your password should have at least 8 characters.</div>
            <a tabindex="0" class="password-skip" data-i18n="passphrasebox-password-skip">Skip password protection for now</a>

            <button class="submit" data-i18n="passphrasebox-continue">Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    /** @returns {HTMLElement} @deprecated */
    getElement() {
        return this.$el;
    }

    /** @type {HTMLElement} */
    get element() {
        return this.$el;
    }

    focus() {
        this._passphraseInput.focus();
    }

    /**
     * @param {boolean} [isWrongPassphrase]
     */
    async reset(isWrongPassphrase) {
        this._password = '';

        if (isWrongPassphrase) await this._passphraseInput.onPassphraseIncorrect();
        else this._passphraseInput.reset();

        this.$el.classList.remove('repeat');
    }

    /**
     * @param {boolean} isValid
     */
    _onInputChangeValidity(isValid) {
        this.$el.classList.toggle('input-valid', isValid);

        const length = this._passphraseInput.text.length;
        this.$el.classList.toggle('strength-8', length < 10);
        this.$el.classList.toggle('strength-10', length >= 10 && length < 12);
        this.$el.classList.toggle('strength-12', length >= 12);
    }

    /**
     * @param {Event} event
     */
    _onSubmit(event) {
        event.preventDefault();

        if (!this._password) {
            this._password = this._passphraseInput.text;
            this._passphraseInput.reset();
            this.$el.classList.add('repeat');
        } else if (this._password !== this._passphraseInput.text) {
            this.reset(true);
        } else {
            this.fire(PassphraseSetterBox.Events.SUBMIT, this._password);
            this.reset();
        }
    }

    _onSkip() {
        this.fire(PassphraseSetterBox.Events.SKIP);
    }
}

PassphraseSetterBox.Events = {
    SUBMIT: 'passphrasebox-submit',
    SKIP: 'passphrasebox-skip',
};
/* global BrowserDetection */
/* global KeyStore */
/* global CookieJar */
/* global I18n */

/**
 * A common parent class for pop-up requests.
 *
 * Usage:
 * Inherit this class in your popup request API class:
 * ```
 *  class SignTransactionApi extends TopLevelApi {
 *
 *      // Define the onRequest method to receive the client's request object:
 *      onRequest(request) {
 *          // do something...
 *
 *          // When done, call this.resolve() with the result object
 *          this.resolve(result);
 *
 *          // Or this.reject() with an error
 *          this.reject(error);
 *      }
 *  }
 *
 *  // Finally, start your API:
 *  runKeyguard(SignTransactionApi);
 * ```
 */
class TopLevelApi { // eslint-disable-line no-unused-vars
    constructor() {
        if (window.self !== window.top) {
            // PopupAPI may not run in a frame
            throw new Error('Illegal use');
        }

        /** @type {Function} */
        this._resolve = () => { throw new Error('Method not defined'); };

        /** @type {Function} */
        this._reject = () => { throw new Error('Method not defined'); };

        I18n.initialize(window.TRANSLATIONS, 'en');
        I18n.translateDom();

        window.addEventListener('beforeunload', () => {
            this.reject(new Error('Keyguard popup closed'));
        });
    }

    /**
     * Method to be called by the Keyguard client via RPC
     *
     * @param {KeyguardRequest} request
     */
    async request(request) {
        /**
         * Detect migrate signalling set by the iframe
         *
         * @deprecated Only for database migration
         */
        if ((BrowserDetection.isIos() || BrowserDetection.isSafari()) && this._hasMigrateFlag()) {
            await KeyStore.instance.migrateAccountsToKeys();
        }

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            this.onRequest(request).catch(reject);
        });
    }

    /**
     * Overwritten by each request's API class
     *
     * @param {KeyguardRequest} request
     * @abstract
     */
    async onRequest(request) { // eslint-disable-line no-unused-vars
        throw new Error('Not implemented');
    }

    /**
     * Called by a page's API class on success
     *
     * @param {*} result
     * @returns {Promise<void>}
     */
    async resolve(result) {
        // Keys might have changed, so update cookie for iOS and Safari users
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            const keys = await KeyStore.instance.list();
            CookieJar.fill(keys);
        }

        this._resolve(result);
    }

    /**
     * Called by a page's API class on error
     *
     * @param {Error} error
     */
    reject(error) {
        this._reject(error);
    }

    /**
     * @deprecated Only for database migration
     * @returns {boolean}
     */
    _hasMigrateFlag() {
        const match = document.cookie.match(new RegExp('migrate=([^;]+)'));
        return !!match && match[1] === '1';
    }
}
/* global Nimiq */
/* global I18n */
/* global RecoveryWords */
class EnterRecoveryWords extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     * @param {HTMLFormElement} [$el]
     */
    constructor($el) {
        super();

        this.$el = EnterRecoveryWords._createElement($el);

        /** @type {HTMLElement} */
        const $wordsInput = (this.$el.querySelector('.input'));
        /** @type {HTMLButtonElement} */
        const $wordsConfirm = (this.$el.querySelector('button'));

        const recoveryWords = new RecoveryWords($wordsInput, true);
        recoveryWords.on(RecoveryWords.Events.COMPLETE, () => { $wordsConfirm.disabled = false; });
        recoveryWords.on(RecoveryWords.Events.INCOMPLETE, () => { $wordsConfirm.disabled = true; });
        recoveryWords.on(RecoveryWords.Events.INVALID, () => { $wordsConfirm.disabled = true; });

        this.$el.addEventListener('submit', event => {
            event.preventDefault();
            if (recoveryWords.mnemonic) {
                this.fire(EnterRecoveryWords.Events.COMPLETE, recoveryWords.mnemonic, recoveryWords.mnemonicType);
            }
        });

        this._recoveryWords = recoveryWords;
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="enter-recovery-words-heading">Import from recovery words</h1>
            <h2 data-i18n="enter-recovery-words-subheading">Please enter your 24 recovery words.</h2>
            <div class="grow"></div>
            <div class="input"></div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        I18n.translateDom($el);
        return $el;
    }

    focus() {
        this._recoveryWords.focus();
    }
}

EnterRecoveryWords.Events = {
    COMPLETE: 'enter-recovery-words-complete',
};
/* global Nimiq */
/* global I18n */
/* global Identicon */
class ChooseKeyType extends Nimiq.Observable {
    /**
     * @param {?HTMLFormElement} [$el]
     * @param {string} [defaultKeyPath]
     * @param {Nimiq.Entropy} [entropy]
     */
    constructor($el, defaultKeyPath = 'm/44\'/242\'/0\'/0\'', entropy) {
        super();
        this._defaultKeyPath = defaultKeyPath;
        this._entropy = entropy;

        /** @type {HTMLFormElement} */
        this.$el = ChooseKeyType._createElement($el);

        /** @type {HTMLInputElement} */
        const $radioLegacy = (this.$el.querySelector('input#key-type-legacy'));
        $radioLegacy.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLInputElement} */
        const $radioBip39 = (this.$el.querySelector('input#key-type-bip39'));
        $radioBip39.addEventListener('change', this._checkEnableContinue.bind(this));

        /** @type {HTMLDivElement} */
        const $identiconLegacy = (this.$el.querySelector('.identicon-legacy'));
        this._identiconLegacy = new Identicon(undefined, $identiconLegacy);

        /** @type {HTMLDivElement} */
        const $identiconBip39 = (this.$el.querySelector('.identicon-bip39'));
        this._identiconBip39 = new Identicon(undefined, $identiconBip39);

        /** @type {HTMLDivElement} */
        this.$addressLegacy = (this.$el.querySelector('.address-legacy'));

        /** @type {HTMLDivElement} */
        this.$addressBip39 = (this.$el.querySelector('.address-bip39'));

        /** @type {HTMLButtonElement} */
        this.$confirmButton = (this.$el.querySelector('button'));

        this.$el.addEventListener('submit', event => this._submit(event));

        this._update();
    }

    /**
     * @param {?HTMLFormElement} [$el]
     * @returns {HTMLFormElement}
     */
    static _createElement($el) {
        $el = $el || document.createElement('form');

        /* eslint-disable max-len */
        $el.innerHTML = `
            <h1 data-i18n="choose-key-type-heading">Choose key type</h1>
            <h2 data-i18n="choose-key-type-subheading">We couldn't determine the type of your key. Please select it below.</h2>
            <div class="grow"></div>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-legacy" value="0">
                <label for="key-type-legacy" class="row">
                    <div class="identicon-legacy"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-legacy-address-heading">Single address</strong><br>
                        <span data-i18n="choose-key-type-legacy-address-info">Created before xx/xx/2018</span><br>
                        <br>
                        <span class="address-legacy"></span>
                    </div>
                </label>
            </div>
            <h2 class="key-type-or" data-i18n="choose-key-type-or">or</h2>
            <div class="key-type-option">
                <input type="radio" name="key-type" id="key-type-bip39" value="1">
                <label for="key-type-bip39" class="row">
                    <div class="identicon-bip39"></div>
                    <div class="key-type-info">
                        <strong data-i18n="choose-key-type-bip39-address-heading">Multiple addresses</strong><br>
                        <span data-i18n="choose-key-type-bip39-address-info">Created after xx/xx/2018</span><br>
                        <br>
                        <span class="address-bip39"></span>
                    </div>
                </label>
            </div>
            <div class="grow"></div>
            <button data-i18n="continue" type="submit" disabled>Continue</button>
        `;
        /* eslint-enable max-len */

        $el.classList.add('key-type-form');

        I18n.translateDom($el);
        return $el;
    }

    _update() {
        // Reset choice.
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        if (selected) {
            selected.checked = false;
        }
        this._checkEnableContinue();

        if (!this._entropy) {
            return;
        }

        const legacyAddress = Nimiq.PublicKey.derive(new Nimiq.PrivateKey(this._entropy.serialize()))
            .toAddress().toUserFriendlyAddress();
        this._identiconLegacy.address = legacyAddress;
        this.$addressLegacy.textContent = legacyAddress;

        const bip39Address = this._entropy.toExtendedPrivateKey().derivePath(this._defaultKeyPath)
            .toAddress().toUserFriendlyAddress();
        this._identiconBip39.address = bip39Address;
        this.$addressBip39.textContent = bip39Address;
    }

    /**
     * @param {Nimiq.Entropy} entropy
     */
    set entropy(entropy) {
        this._entropy = entropy;
        this._update();
    }

    get value() {
        /** @type {HTMLInputElement} */
        const selected = (this.$el.querySelector('input[name="key-type"]:checked'));
        return selected ? parseInt(selected.value, 10) : null;
    }

    /**
     * @private
     */
    _checkEnableContinue() {
        this.$confirmButton.disabled = this.value === null;
    }

    /** @param {Event} event */
    _submit(event) {
        event.preventDefault();
        if (this.value !== null) {
            this.fire(ChooseKeyType.Events.CHOOSE, this.value, this._entropy);
        }
    }
}

ChooseKeyType.Events = {
    CHOOSE: 'choose-key-type',
};
/* global Nimiq */
/* global Key */
/* global KeyStore */
/* global PrivacyAgent */
/* global EnterRecoveryWords */
/* global ChooseKeyType */
/* global PassphraseSetterBox */

class ImportWords {
    /**
     * @param {ImportRequest} request
     * @param {Function} resolve
     */
    constructor(request, resolve) {
        // Pages
        /** @type {HTMLElement} */
        const $privacy = (document.getElementById(ImportWords.Pages.PRIVACY_AGENT));
        /** @type {HTMLFormElement} */
        const $words = (document.getElementById(ImportWords.Pages.ENTER_WORDS));
        /** @type {HTMLFormElement} */
        const $chooseKeyType = (document.getElementById(ImportWords.Pages.CHOOSE_KEY_TYPE));
        /** @type {HTMLFormElement} */
        const $setPassphrase = (document.getElementById(ImportWords.Pages.SET_PASSPHRASE));

        /** @type {HTMLElement} */
        const $privacyAgent = ($privacy.querySelector('.agent'));

        // Components
        const privacyAgent = new PrivacyAgent($privacyAgent);
        const recoveryWords = new EnterRecoveryWords($words);
        const chooseKeyType = new ChooseKeyType($chooseKeyType);
        const setPassphrase = new PassphraseSetterBox($setPassphrase);

        // Events
        privacyAgent.on(PrivacyAgent.Events.CONFIRM, () => {
            window.location.hash = ImportWords.Pages.ENTER_WORDS;
            recoveryWords.focus();
        });

        recoveryWords.on(EnterRecoveryWords.Events.COMPLETE, this._onRecoveryWordsComplete.bind(this));

        chooseKeyType.on(ChooseKeyType.Events.CHOOSE, this._onKeyTypeChosen.bind(this));

        setPassphrase.on(PassphraseSetterBox.Events.SUBMIT, /** @param {string} passphrase */ async passphrase => {
            document.body.classList.add('loading');
            if (this._key) {
                resolve(await KeyStore.instance.put(this._key, Nimiq.BufferUtils.fromAscii(passphrase)));
            }
        });

        this._chooseKeyType = chooseKeyType;
    }

    run() {
        this._key = null;
        window.location.hash = ImportWords.Pages.PRIVACY_AGENT;
    }

    /**
     * Store key and request passphrase
     *
     * @param {Array<string>} mnemonic
     * @param {number} mnemonicType
     */
    _onRecoveryWordsComplete(mnemonic, mnemonicType) {
        switch (mnemonicType) {
        case Nimiq.MnemonicUtils.MnemonicType.BIP39: {
            const entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.BIP39);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.LEGACY: {
            const entropy = Nimiq.MnemonicUtils.legacyMnemonicToEntropy(mnemonic);
            this._key = new Key(entropy.serialize(), Key.Type.LEGACY);
            break;
        }
        case Nimiq.MnemonicUtils.MnemonicType.UNKNOWN: {
            this._chooseKeyType.entropy = Nimiq.MnemonicUtils.mnemonicToEntropy(mnemonic);
            break;
        }
        default:
            throw new Error('Invalid mnemonic type');
        }

        window.location.hash = mnemonicType === Nimiq.MnemonicUtils.MnemonicType.UNKNOWN
            ? ImportWords.Pages.CHOOSE_KEY_TYPE
            : ImportWords.Pages.SET_PASSPHRASE;
    }

    /**
     * @param {Key.Type} keyType
     * @param {Nimiq.Entropy} entropy
     * @private
     */
    _onKeyTypeChosen(keyType, entropy) {
        this._key = new Key(entropy.serialize(), keyType);
        window.location.hash = ImportWords.Pages.SET_PASSPHRASE;
    }
}

ImportWords.Pages = {
    PRIVACY_AGENT: 'privacy',
    ENTER_WORDS: 'words',
    CHOOSE_KEY_TYPE: 'choose-key-type',
    SET_PASSPHRASE: 'set-passphrase',
};
/* global TopLevelApi */
/* global ImportWords */

class ImportWordsApi extends TopLevelApi { // eslint-disable-line no-unused-vars
    /**
     * @param {ImportRequest} request
     */
    async onRequest(request) {
        const parsedRequest = ImportWordsApi._parseRequest(request);
        const handler = new ImportWords(parsedRequest, this.resolve.bind(this));
        handler.run();
    }

    /**
     * @param {ImportRequest} request
     * @returns {ImportRequest}
     * @private
     */
    static _parseRequest(request) {
        if (!request) {
            throw new Error('Empty request');
        }

        if (typeof request.appName !== 'string' || !request.appName) {
            throw new Error('appName is required');
        }

        return request;
    }
}
/* global runKeyguard */
/* global ImportWordsApi */

runKeyguard(ImportWordsApi);
