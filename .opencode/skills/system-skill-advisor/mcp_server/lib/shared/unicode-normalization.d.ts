export declare const CANONICAL_FOLD_VERSION = "nfkc-hidden-mark-confusable-v1";
export interface UnicodeRuntimeFingerprint {
    readonly normalizer: typeof CANONICAL_FOLD_VERSION;
    readonly node: string;
    readonly icu: string;
    readonly unicode: string;
}
export declare function getUnicodeRuntimeFingerprint(): UnicodeRuntimeFingerprint;
export declare function canonicalFold(value: string): string;
//# sourceMappingURL=unicode-normalization.d.ts.map