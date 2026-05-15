export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
}
export declare const CODE_GRAPH_TOOL_SCHEMAS: ToolDefinition[];
export declare const TOOL_DEFINITIONS: ToolDefinition[];
//# sourceMappingURL=tool-schemas.d.ts.map