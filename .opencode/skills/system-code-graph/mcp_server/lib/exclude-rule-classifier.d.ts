export type ExcludeRuleTier = 'high' | 'medium' | 'low';
export interface ExcludeRulePattern {
    pattern: string;
    rationale: string;
    false_positive_examples?: string[];
}
export interface ExcludeRuleConfidenceArtifact {
    schema_version: 1;
    tiers: Record<ExcludeRuleTier, {
        definition: string;
        default_action: string;
        patterns: ExcludeRulePattern[];
    }>;
}
export interface ClassifiedExcludeRule {
    pattern: string;
    tier: ExcludeRuleTier | 'unknown';
    rationale?: string;
    defaultAction?: string;
}
export declare function loadExcludeRuleConfidence(path: string): ExcludeRuleConfidenceArtifact;
export declare function classifyExcludeRule(artifact: ExcludeRuleConfidenceArtifact, pattern: string): ClassifiedExcludeRule;
export declare function classifyExcludeRules(artifact: ExcludeRuleConfidenceArtifact, patterns: string[]): ClassifiedExcludeRule[];
//# sourceMappingURL=exclude-rule-classifier.d.ts.map