export function piStoreRoot(options?: {}): any;
export function piProjectDirectory(projectDir: any): string;
export function loadPiSession({ sessionId, projectDir, sessionManager, ...options }?: {}): {
    ok: boolean;
    code: string;
    path?: undefined;
} | {
    ok: boolean;
    path: string;
    code?: undefined;
} | {
    ok: boolean;
    code: string;
    source?: undefined;
    records?: undefined;
} | {
    ok: boolean;
    source: {
        runtime: string;
        sessionId: any;
        locatorKind: string;
        mode: string;
        storePath: any;
    };
    records: any[];
    code?: undefined;
} | {
    ok: boolean;
    source: {
        runtime: string;
        sessionId: any;
        locatorKind: string;
        mode: string;
        storePath: string | undefined;
    };
    records: any[];
};
//# sourceMappingURL=pi.d.mts.map