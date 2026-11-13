export function decodeSessionLog(buffer: any, fileName: any): any;
export function dshStoreRoot(options?: {}): any;
export function dshProjectKey(cwd: any): string;
export function loadDshSession({ sessionId, projectDir, sessionPath, ...options }?: {}): {
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
    injected: {
        source: any;
        text: string;
    }[];
};
//# sourceMappingURL=dsh.d.mts.map