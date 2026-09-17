// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Context Template
// ───────────────────────────────────────────────────────────────
// Deterministic inference of edge weight and context from same-family exemplars.

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { SkillMetadataRecord } from './types.js';

// ───────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Normalize a value to an array for consistent handling.
 */
function asArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Check if a target skill has a specific file in its bundle.
 */
function targetHasFile(target: SkillMetadataRecord, filePath: string): boolean {
  const targetDir = dirname(target.filePath);
  const absolutePath = join(targetDir, filePath);
  return existsSync(absolutePath);
}

/**
 * Check if all values in an array are equal.
 */
function allEqual<T>(values: T[]): boolean {
  if (values.length === 0) return true;
  const first = values[0];
  return values.every(v => v === first);
}

/**
 * Compute median of an array of numbers.
 */
function medianOf(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Clip weight to [0.3, 0.7] range.
 */
function clipWeight(w: number | null | undefined): number | null {
  if (w == null) return null;
  return Math.min(0.7, Math.max(0.3, w));
}

/**
 * Substitute template variables in a context string.
 * Replaces ${target.id}, ${target.family}, ${target.category}.
 */
function substituteTemplate(template: string, target: SkillMetadataRecord): string {
  return template
    .replace(/\$\{target\.id\}/g, target.skillId)
    .replace(/\$\{target\.family\}/g, target.family ?? '')
    .replace(/\$\{target\.category\}/g, target.category ?? '');
}

/**
 * Escape regex metacharacters in a string so it can be safely embedded in a RegExp.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Substitute provider name in an exemplar context.
 * Replaces peer skill IDs appearing in the context with the target skill ID.
 * Returns null when context is null/undefined.
 */
function substituteProviderName(context: string | null | undefined, peerIds: string[], targetSkillId: string): string | null {
  if (context == null) return null;
  let result = context;
  // Escape $ in replacement to avoid $1/$& pattern-substitution surprises
  const replacement = targetSkillId.replace(/\$/g, '$$$$');
  for (const peerId of peerIds) {
    if (!peerId) continue;
    result = result.replace(new RegExp(`\\b${escapeRegex(peerId)}\\b`, 'g'), replacement);
  }
  return result;
}

// ───────────────────────────────────────────────────────────────
// 2. PAYLOAD INFERENCE
// ───────────────────────────────────────────────────────────────

/**
 * Infer edge weight and context from source skill's enhance_when rules
 * or from same-family exemplar edges.
 */
export function inferEdgePayload(
  source: SkillMetadataRecord,
  target: SkillMetadataRecord,
  byFamily: Map<string, SkillMetadataRecord[]>,
): { weight: number | null; context: string | null; blockers: string[] } {
  const blockers: string[] = [];
  const familyEdges = (source.edges?.enhances ?? [])
    .filter(e => byFamily.get(target.family)?.some(s => s.skillId === e.target));

  // 1. enhance_when explicit template wins
  const rules = asArray(source.enhance_when ?? []);
  for (const rule of rules) {
    const assetMatch = rule.skill_has_asset && targetHasFile(target, rule.skill_has_asset);
    // Array.isArray guard before .every()
    const filesMatch = Array.isArray(rule.skill_has_files) &&
      rule.skill_has_files.length > 0 &&
      rule.skill_has_files.every(f => typeof f === 'string' && targetHasFile(target, f));

    if (assetMatch || filesMatch) {
      const inferredWeight = clipWeight(rule.weight);
      const template = typeof rule.context_template === 'string' ? rule.context_template : '';
      const inferredContext = template.length > 0 ? substituteTemplate(template, target) : null;
      const ruleBlockers: string[] = [];
      if (inferredWeight === null) ruleBlockers.push('enhance_when rule missing weight');
      if (inferredContext === null) ruleBlockers.push('enhance_when rule missing context_template');
      return {
        weight: inferredWeight,
        context: inferredContext,
        blockers: ruleBlockers,
      };
    }
  }

  // 2. Same-family exemplar — verbatim weight + context if stable
  if (familyEdges.length === 0) {
    blockers.push('no same-family exemplar to infer payload');
    return { weight: null, context: null, blockers };
  }

  const weights = familyEdges.map(e => e.weight);
  const stableWeight = allEqual(weights) ? weights[0] : medianOf(weights);

  // Context: if all family edges share verbatim context, use it. Else try provider-template substitution.
  const contexts = familyEdges.map(e => e.context);
  let context: string | null = null;
  if (allEqual(contexts)) {
    context = contexts[0] ?? null;
  } else {
    // Provider-template substitution: replace any peer-skill-id appearing in an exemplar context
    const exemplar = familyEdges[0];
    const peerIds = familyEdges.map(e => e.target);
    // substituteProviderName now guards null/undefined and returns null
    context = substituteProviderName(exemplar?.context, peerIds, target.skillId);
  }

  if (!context) {
    blockers.push('context not deterministically inferrable');
  }

  const finalWeight = clipWeight(stableWeight);
  if (finalWeight === null) {
    blockers.push('weight not deterministically inferrable');
  }

  return {
    weight: finalWeight,
    context,
    blockers,
  };
}
