export enum KeyguardCommand {
    CREATE = 'create',
    REMOVE = 'remove-key',
    IMPORT = 'import',
    EXPORT_WORDS = 'export-words',
    EXPORT_FILE = 'export-file',
    EXPORT = 'export',
    CHANGE_PASSPHRASE = 'change-passphrase',
    SIGN_TRANSACTION = 'sign-transaction',
    SIGN_MESSAGE = 'sign-message',

    // Iframe requests
    LIST = 'list',
    MIGRATE_ACCOUNTS_TO_KEYS = 'migrateAccountsToKeys',
    DERIVE_ADDRESSES = 'deriveAddresses',
    RELEASE_KEY = 'releaseKey',
}

declare namespace Key {
    type Type = 0 | 1;
}

interface BasicRequest {
    appName: string;
}
export interface SimpleRequest extends BasicRequest {
    keyId: string;
    keyLabel?: string;
}

export interface SimpleResult {
    success: boolean;
}

export interface CreateRequest extends BasicRequest {
    defaultKeyPath?: string;
}

export interface CreateResult {
    keyId: string;
    keyPath: string;
    address: Uint8Array;
}

export interface ImportRequest extends BasicRequest {
    defaultKeyPath: string;
    requestedKeyPaths: string[];
}

export interface ImportResult {
    keyId: string;
    keyType: Key.Type;
    addresses: Array<{keyPath: string, address: Uint8Array}>;
}

export interface SignTransactionRequest extends SimpleRequest {
    layout?: 'standard' | 'checkout' | 'cashlink';
    shopOrigin?: string;

    keyPath: string;

    sender: Uint8Array;
    senderType?: Nimiq.Account.Type;
    senderLabel?: string;
    recipient: Uint8Array;
    recipientType?: Nimiq.Account.Type;
    recipientLabel?: string;
    value: number;
    fee: number;
    validityStartHeight: number;
    data?: Uint8Array;
    flags?: number;
    networkId?: number;
}

export interface SignTransactionResult {
    publicKey: Uint8Array;
    signature: Uint8Array;
}

export interface SignMessageRequest extends SimpleRequest {
    keyPath: string;

    addressLabel?: string;
    message: string | Uint8Array;
}

export interface SignMessageResult {
    publicKey: Uint8Array;
    signature: Uint8Array;
}

export type RpcResult = CreateResult
    | ImportResult
    | SignTransactionResult
    | SignMessageResult
    | SimpleRequest;

// Deprecated, only used for migrating databases
export interface AccountInfo {
    userFriendlyAddress: string;
    type: string;
    label: string;
}

export interface KeyInfoObject {
    id: string;
    type: Key.Type;
    encrypted: boolean;
    userFriendlyId?: string;
}
