export function envOf(options?: {}): any;
export function homeDir(options?: {}): any;
export function isSafeSessionId(sessionId: any): boolean;
export function samePath(left: any, right: any): boolean;
/**
 * Whether `child` is `parent` or a folder below it, compared by real path. A
 * runtime that hands its hooks the project root while recording the session's
 * own subfolder still proves the session belongs to that checkout.
 */
export function atOrBelow(child: any, parent: any): boolean;
export function resolveInside({ path, root }: {
    path: any;
    root: any;
}): {
    ok: boolean;
    code: string;
    path?: undefined;
} | {
    ok: boolean;
    path: string;
    code?: undefined;
};
export function guardSessionPath({ path, root, sessionId, recordedId }?: {}): {
    ok: boolean;
    code: string;
    path?: undefined;
} | {
    ok: boolean;
    path: string;
    code?: undefined;
};
//# sourceMappingURL=identity.d.mts.map