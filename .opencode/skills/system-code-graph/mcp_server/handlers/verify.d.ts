export type VerifyCategory = 'mcp-tool' | 'cross-module' | 'exported-type' | 'regression-detection';
export interface VerifyArgs {
    rootDir?: string;
    batteryPath?: string;
    category?: VerifyCategory;
    failFast?: boolean;
    includeDetails?: boolean;
    persistBaseline?: boolean;
    allowInlineIndex?: boolean;
}
export declare function handleCodeGraphVerify(args: VerifyArgs): Promise<{
    content: {
        type: 'text';
        text: string;
    }[];
}>;
//# sourceMappingURL=verify.d.ts.map