export type AdvisorErrorClass = 'timeout' | 'parse' | 'spawn' | 'unknown';
export interface AdvisorErrorDiagnostics {
    readonly errorClass: AdvisorErrorClass;
    readonly errorMessage?: string;
}
export declare function classifyAdvisorException(error: unknown): AdvisorErrorDiagnostics;
export declare function classifyAdvisorFailure(errorCode: string | null | undefined, errorDetails?: unknown): AdvisorErrorDiagnostics | null;
//# sourceMappingURL=error-diagnostics.d.ts.map