export function devinDataDirectory(options?: {}): any;
export function devinTranscriptRoot(options?: {}): string;
export function devinDatabasePath(options?: {}): any;
export function loadDevinSession({ sessionId, projectDir, ...options }?: {}): {
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
        text: any;
    }[];
};
//# sourceMappingURL=devin.d.mts.map