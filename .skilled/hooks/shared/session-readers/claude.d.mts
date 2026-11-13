export function claudeStoreRoot(options?: {}): any;
export function loadClaudeSession({ sessionId, transcriptPath, ...options }?: {}): {
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
    injected: {
        source: string;
        text: string;
    }[];
};
//# sourceMappingURL=claude.d.mts.map