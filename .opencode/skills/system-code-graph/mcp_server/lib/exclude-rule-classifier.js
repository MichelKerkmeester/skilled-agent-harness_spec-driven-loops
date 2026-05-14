// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Exclude Rule Classifier
// ───────────────────────────────────────────────────────────────
import { readFileSync } from 'node:fs';
function isTier(value) {
    return value === 'high' || value === 'medium' || value === 'low';
}
export function loadExcludeRuleConfidence(path) {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error(`Exclude-rule confidence artifact at ${path} must be an object`);
    }
    const record = parsed;
    if (record.schema_version !== 1) {
        throw new Error(`Exclude-rule confidence artifact at ${path} must declare schema_version === 1`);
    }
    const tiers = record.tiers;
    if (typeof tiers !== 'object' || tiers === null) {
        throw new Error(`Exclude-rule confidence artifact at ${path} must include tiers`);
    }
    for (const tier of ['high', 'medium', 'low']) {
        const tierRecord = tiers[tier];
        if (typeof tierRecord !== 'object' || tierRecord === null) {
            throw new Error(`Exclude-rule confidence artifact at ${path} missing ${tier} tier`);
        }
        if (!Array.isArray(tierRecord.patterns)) {
            throw new Error(`Exclude-rule confidence artifact at ${path} has invalid ${tier}.patterns`);
        }
    }
    return parsed;
}
export function classifyExcludeRule(artifact, pattern) {
    const normalized = pattern.trim();
    for (const [tierName, tier] of Object.entries(artifact.tiers)) {
        if (!isTier(tierName)) {
            continue;
        }
        const match = tier.patterns.find((entry) => entry.pattern === normalized);
        if (match) {
            return {
                pattern: normalized,
                tier: tierName,
                rationale: match.rationale,
                defaultAction: tier.default_action,
            };
        }
    }
    return {
        pattern: normalized,
        tier: 'unknown',
    };
}
export function classifyExcludeRules(artifact, patterns) {
    return patterns.map((pattern) => classifyExcludeRule(artifact, pattern));
}
//# sourceMappingURL=exclude-rule-classifier.js.map