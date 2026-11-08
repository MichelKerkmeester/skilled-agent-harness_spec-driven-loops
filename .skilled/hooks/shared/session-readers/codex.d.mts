export function codexStoreRoot(options?: {}): any;
export function loadCodexSession({ sessionId, transcriptPath, ...options }?: {}): {
    ok: boolean;
    code: string;
    path?: undefined;
} | {
    ok: boolean;
    source: {
        runtime: string;
        sessionId: any;
        locatorKind: string;
        storePath: string | undefined;
    };
    records: any[];
};
//# sourceMappingURL=codex.d.mts.map