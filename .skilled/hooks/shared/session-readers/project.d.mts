export function textBlock(text: any): {
    type: string;
    text: string;
};
export function thinkingBlock(thinking: any): {
    type: string;
    thinking: string;
};
export function toolCallBlock({ id, name, arguments: args }?: {}): {
    type: string;
    id: string;
    name: string;
    arguments: any;
};
export function imageBlock({ data, mimeType }?: {}): {
    type: string;
    data: string;
    mimeType: string;
};
export function parseJsonObject(value: any): any;
export function parseJsonLines(text: any): any[];
export function contentText(content: any): string;
export function isoOr(value: any, fallback?: string): string;
export function projectEntries(records: any): {
    ok: boolean;
    reason: any;
} | {
    ok: boolean;
    items: any[];
};
export const PROJECTION_ERRORS: Readonly<{
    DUPLICATE_ENTRY_ID: "DUPLICATE_ENTRY_ID";
    INVALID_ENTRY: "INVALID_ENTRY";
    DUPLICATE_TOOL_CALL: "DUPLICATE_TOOL_CALL";
    ORPHAN_TOOL_RESULT: "ORPHAN_TOOL_RESULT";
    DUPLICATE_TOOL_RESULT: "DUPLICATE_TOOL_RESULT";
    MISMATCHED_TOOL_RESULT: "MISMATCHED_TOOL_RESULT";
    INCOMPLETE_TOOL_RESULTS: "INCOMPLETE_TOOL_RESULTS";
}>;
//# sourceMappingURL=project.d.mts.map