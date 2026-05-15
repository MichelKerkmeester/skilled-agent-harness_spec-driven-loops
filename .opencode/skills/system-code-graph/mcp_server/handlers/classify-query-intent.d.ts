export interface ClassifyQueryIntentArgs {
    query: string;
}
export declare function handleClassifyQueryIntent(args: ClassifyQueryIntentArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=classify-query-intent.d.ts.map
