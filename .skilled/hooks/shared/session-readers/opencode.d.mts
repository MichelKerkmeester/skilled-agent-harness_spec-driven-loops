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
    records: ({
        id: any;
        role: string;
        timestamp: any;
        content: {
            type: string;
            id: string;
            name: string;
            arguments: any;
        }[];
        toolCallId?: undefined;
    } | {
        id: string;
        role: string;
        timestamp: any;
        content: {
            type: string;
            text: string;
        }[];
        toolCallId: any;
    } | {
        id: any;
        role: string;
        timestamp: string;
        content: {
            type: string;
            text: string;
        }[];
    } | {
        id: any;
        role: string;
        timestamp: string;
        content: {
            type: string;
            thinking: string;
        }[];
    })[];
};
//# sourceMappingURL=opencode.d.mts.map