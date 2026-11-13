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
    injected?: undefined;
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
    injected: {
        source: any;
        text: string;
    }[];
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
    injected: {
        source: any;
        text: string;
    }[];
};
//# sourceMappingURL=pi.d.mts.map