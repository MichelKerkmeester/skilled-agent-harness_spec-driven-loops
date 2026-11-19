export function openCodeStoreRoot(options?: {}): any;
export function openCodeDatabasePath(options?: {}): any;
export function loadOpenCodeSession({ sessionId, ...options }?: {}): {
    ok: boolean;
    code: string;
    path?: undefined;
} | {
    ok: boolean;
    path: string;
    code?: undefined;
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
//# sourceMappingURL=opencode.d.mts.map