// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Detection
// ───────────────────────────────────────────────────────────────
// Detect missing inbound enhances edges via composite scoring.

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { CandidateRuleEvidence, DetectInboundEnhancesOptions, InboundEnhanceCandidate, SkillMetadataRecord } from './types.js';
import { groupByFamily } from './metadata-loader.js';
import { inferEdgePayload } from './context-template.js';

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
 * Check if source already has an enhance edge to target.
 */
function hasEnhanceEdge(source: SkillMetadataRecord, targetSkillId: string): boolean {
  const enhances = source.edges?.enhances ?? [];
  return enhances.some(e => e.target === targetSkillId);
}

/**
 * Generate a stable hash for a candidate (source + target + edge_type).
 */
function hashCandidate(sourceSkillId: string, targetSkillId: string): string {
  const hashInput = `${sourceSkillId}->${targetSkillId}->enhances`;
  return createHash('sha256').update(hashInput).digest('hex').substring(0, 16);
}

/**
 * Stable sort candidates by confidence descending.
 */
function stableSortByConfidenceDesc(candidates: InboundEnhanceCandidate[]): InboundEnhanceCandidate[] {
  return [...candidates].sort((a, b) => {
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    // Tie-breaker by source skill ID for stability
    return a.sourceSkillId.localeCompare(b.sourceSkillId);
  });
}

// ───────────────────────────────────────────────────────────────
// 2. SCORERS
// ───────────────────────────────────────────────────────────────

/**
 * Score family-inference rule (max contribution 0.45).
 * Detects when source skill already enhances many peers in target's family.
 */
function scoreFamilyInference(
  source: SkillMetadataRecord,
  target: SkillMetadataRecord,
  byFamily: Map<string, SkillMetadataRecord[]>,
): CandidateRuleEvidence {
  // Skip if source and target are same family (avoid self-enhance within family)
  if (source.family === target.family) {
    return { rule: 'family-inference', contribution: 0, detail: 'source and target same family — skip (avoid self-enhance)' };
  }

  const sourceEnhances = source.edges?.enhances ?? [];
  if (sourceEnhances.length < 3) {
    return { rule: 'family-inference', contribution: 0, detail: 'source has < 3 existing enhances entries' };
  }

  const targetFamilyPeers = byFamily.get(target.family) ?? [];
  const sameFamilyTargets = sourceEnhances.filter(e => {
    return targetFamilyPeers.some(s => s.skillId === e.target);
  });

  const familyPeers = targetFamilyPeers.length;
  // family-share denominator excludes target itself
  const denominator = Math.max(1, familyPeers - 1);
  const familyShare = sameFamilyTargets.length / denominator;

  if (familyShare < 0.5) {
    return { rule: 'family-inference', contribution: 0, detail: `family-share ${Math.round(familyShare * 100)}% below 50% threshold` };
  }

  const contribution = 0.45 * familyShare;
  return {
    rule: 'family-inference',
    contribution,
    detail: `${sameFamilyTargets.length}/${denominator} ${target.family}-family peers already enhanced (${Math.round(familyShare * 100)}%)`,
  };
}

/**
 * Score asset-shape rule (max contribution 0.30).
 * Checks if target has files/assets matching source's enhance_when rules.
 */
function scoreAssetShape(
  source: SkillMetadataRecord,
  target: SkillMetadataRecord,
): CandidateRuleEvidence {
  const rules = source.enhance_when ?? [];
  for (const rule of asArray(rules)) {
    if (rule.skill_has_asset && targetHasFile(target, rule.skill_has_asset)) {
      return {
        rule: 'asset-shape',
        contribution: 0.30,
        detail: `target has ${rule.skill_has_asset}`,
      };
    }
    // Array.isArray guard before .every()
    if (
      Array.isArray(rule.skill_has_files) &&
      rule.skill_has_files.length > 0 &&
      rule.skill_has_files.every(f => typeof f === 'string' && targetHasFile(target, f))
    ) {
      return {
        rule: 'asset-shape',
        contribution: 0.30,
        detail: `target has all of ${rule.skill_has_files.join(', ')}`,
      };
    }
  }
  return { rule: 'asset-shape', contribution: 0, detail: 'no enhance_when rule matches target' };
}

/**
 * Score sibling-transitivity rule (max contribution 0.15).
 * If source enhances B, and B has target as sibling, contribute 0.15.
 */
function scoreSiblingTransitivity(
  source: SkillMetadataRecord,
  target: SkillMetadataRecord,
  byId: Map<string, SkillMetadataRecord>,
): CandidateRuleEvidence {
  const sourceEnhances = source.edges?.enhances ?? [];

  for (const edge of sourceEnhances) {
    const enhancedSkill = byId.get(edge.target);
    if (!enhancedSkill) continue;

    const siblings = enhancedSkill.edges?.siblings ?? [];
    if (siblings.some(s => s.target === target.skillId)) {
      return {
        rule: 'sibling-transitivity',
        contribution: 0.15,
        detail: `source enhances ${edge.target} which has ${target.skillId} as sibling`,
      };
    }
  }

  return { rule: 'sibling-transitivity', contribution: 0, detail: 'no sibling-transitivity path found' };
}

// ───────────────────────────────────────────────────────────────
// 3. MAIN DETECTOR
// ───────────────────────────────────────────────────────────────

/**
 * Detect missing inbound enhances edges across all skills.
 * Deterministic function — may check filesystem for asset-shape matching (existsSync via targetHasFile).
 * Returns candidates sorted by confidence.
 */
export function detectInboundEnhances(
  skills: SkillMetadataRecord[],
  options: DetectInboundEnhancesOptions,
): InboundEnhanceCandidate[] {
  const byId = new Map(skills.map(s => [s.skillId, s]));
  const byFamily = groupByFamily(skills);
  const out: InboundEnhanceCandidate[] = [];

  for (const target of skills) {
    if (options.targetSkillIds && !options.targetSkillIds.includes(target.skillId)) continue;

    for (const source of skills) {
      if (source.skillId === target.skillId) continue;
      if (options.sourceSkillIds && !options.sourceSkillIds.includes(source.skillId)) continue;

      // Skip if edge already exists
      if (hasEnhanceEdge(source, target.skillId)) continue;

      // Score each rule
      const familyScore = scoreFamilyInference(source, target, byFamily);
      const assetScore = scoreAssetShape(source, target);
      const transitivityScore = scoreSiblingTransitivity(source, target, byId);

      const rules: CandidateRuleEvidence[] = [];
      if (familyScore.contribution > 0) rules.push(familyScore);
      if (assetScore.contribution > 0) rules.push(assetScore);
      if (transitivityScore.contribution > 0) rules.push(transitivityScore);

      const confidence = rules.reduce((sum, r) => sum + r.contribution, 0);
      if (confidence < options.minConfidence) continue;

      // Infer weight and context from same-family exemplars or enhance_when rules
      const { weight, context, blockers } = inferEdgePayload(source, target, byFamily);

      // Applyable requires deterministically-inferred weight + context, not just empty blockers
      const applyable = weight !== null && context !== null && blockers.length === 0;
      out.push({
        id: hashCandidate(source.skillId, target.skillId),
        sourceSkillId: source.skillId,
        targetSkillId: target.skillId,
        edgeType: 'enhances',
        weight,
        context,
        confidence,
        confidenceLabel: confidence >= 0.80 ? 'high' : confidence >= 0.60 ? 'medium' : 'low',
        rules,
        sourcePath: source.filePath,
        targetPath: target.filePath,
        applyable,
        blockers,
      });
    }
  }

  return stableSortByConfidenceDesc(out);
}
