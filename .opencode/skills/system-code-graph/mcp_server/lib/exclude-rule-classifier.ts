// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Exclude Rule Classifier
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

function isTier(value: string): value is ExcludeRuleTier {
  return value === 'high' || value === 'medium' || value === 'low';
}

export function loadExcludeRuleConfidence(path: string): ExcludeRuleConfidenceArtifact {
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`Exclude-rule confidence artifact at ${path} must be an object`);
  }
  const record = parsed as Record<string, unknown>;
  if (record.schema_version !== 1) {
    throw new Error(`Exclude-rule confidence artifact at ${path} must declare schema_version === 1`);
  }
  const tiers = record.tiers;
  if (typeof tiers !== 'object' || tiers === null) {
    throw new Error(`Exclude-rule confidence artifact at ${path} must include tiers`);
  }
  for (const tier of ['high', 'medium', 'low']) {
    const tierRecord = (tiers as Record<string, unknown>)[tier];
    if (typeof tierRecord !== 'object' || tierRecord === null) {
      throw new Error(`Exclude-rule confidence artifact at ${path} missing ${tier} tier`);
    }
    if (!Array.isArray((tierRecord as Record<string, unknown>).patterns)) {
      throw new Error(`Exclude-rule confidence artifact at ${path} has invalid ${tier}.patterns`);
    }
  }
  return parsed as ExcludeRuleConfidenceArtifact;
}

export function classifyExcludeRule(
  artifact: ExcludeRuleConfidenceArtifact,
  pattern: string,
): ClassifiedExcludeRule {
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

export function classifyExcludeRules(
  artifact: ExcludeRuleConfidenceArtifact,
  patterns: string[],
): ClassifiedExcludeRule[] {
  return patterns.map((pattern) => classifyExcludeRule(artifact, pattern));
}

export const DEFAULT_EXCLUDE_RULE_CONFIDENCE_FILENAME = 'exclude-rule-confidence.json';

/**
 * Resolve the shipped default confidence artifact. The classifier module
 * always lives under `<workspace>/.opencode/skills/system-code-graph/
 * mcp_server/{lib,dist/...}`, so anchoring on the on-path `.opencode` segment
 * resolves the SOURCE data file the same whether we run from dist or source —
 * no build-time copy of the artifact is required.
 */
export function defaultExcludeRuleConfidencePath(): string {
  let current = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 12; i += 1) {
    if (basename(current) === '.opencode') {
      return join(
        dirname(current), '.opencode', 'skills', 'system-code-graph', 'mcp_server', 'data',
        DEFAULT_EXCLUDE_RULE_CONFIDENCE_FILENAME,
      );
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return join(process.cwd(), '.opencode', 'skills', 'system-code-graph', 'mcp_server', 'data', DEFAULT_EXCLUDE_RULE_CONFIDENCE_FILENAME);
}

/**
 * Resolve the confidence artifact for a prune-excludes run. An explicit path
 * is the operator's responsibility and throws on missing/invalid input. With
 * no explicit path we fall back to the shipped default; if that is absent or
 * unreadable we return null so the caller degrades to the conservative
 * unknown-everything no-op rather than breaking an apply on a stripped
 * install.
 */
export function resolveExcludeRuleConfidence(explicitPath?: string): ExcludeRuleConfidenceArtifact | null {
  if (explicitPath) {
    return loadExcludeRuleConfidence(explicitPath);
  }
  const defaultPath = defaultExcludeRuleConfidencePath();
  if (!existsSync(defaultPath)) {
    return null;
  }
  try {
    return loadExcludeRuleConfidence(defaultPath);
  } catch {
    return null;
  }
}
