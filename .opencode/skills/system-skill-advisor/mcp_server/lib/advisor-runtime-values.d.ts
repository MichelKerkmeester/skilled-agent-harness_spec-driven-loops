export declare const ADVISOR_RUNTIME_VALUES: readonly ["claude", "gemini", "copilot", "codex", "opencode", "devin"];
export type AdvisorRuntime = (typeof ADVISOR_RUNTIME_VALUES)[number];
export declare function isAdvisorRuntime(value: unknown): value is AdvisorRuntime;
//# sourceMappingURL=advisor-runtime-values.d.ts.map