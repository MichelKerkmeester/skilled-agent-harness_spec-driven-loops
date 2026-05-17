export interface AdvisorPromptPolicyResult {
    readonly fire: boolean;
    readonly reason: string;
    readonly canonicalPrompt: string;
    readonly meaningfulTokenCount: number;
    readonly visibleCharCount: number;
    readonly metalinguisticMentions: string[];
}
/** Extract explicit `sk-*` mentions used for prompt-policy diagnostics. */
export declare function extractMetalinguisticSkillMentions(prompt: string): string[];
/** Decide whether a user prompt should invoke the advisor producer. */
export declare function shouldFireAdvisor(prompt: string): AdvisorPromptPolicyResult;
//# sourceMappingURL=prompt-policy.d.ts.map