export interface ContextHandlerArgs {
    input?: string;
    queryMode?: string;
    subject?: string;
    seeds?: Array<{
        filePath?: string;
        file_path?: string;
        startLine?: number;
        start_line?: number;
        endLine?: number;
        end_line?: number;
        query?: string;
        provider?: string;
        source?: string;
        file?: string;
        range?: {
            start: number;
            end: number;
        };
        lines?: {
            start?: number;
            end?: number;
        };
        score?: number;
        snippet?: string;
        content?: string;
        symbolName?: string;
        kind?: string;
        nodeId?: string;
        symbolId?: string;
        rawScore?: number;
        raw_score?: number;
        pathClass?: string;
        path_class?: string;
        rankingSignals?: string[];
    }>;
    budgetTokens?: number;
    profile?: string;
    includeTrace?: boolean;
}
/** Handle code_graph_context tool call */
export declare function handleCodeGraphContext(args: ContextHandlerArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=context.d.ts.map