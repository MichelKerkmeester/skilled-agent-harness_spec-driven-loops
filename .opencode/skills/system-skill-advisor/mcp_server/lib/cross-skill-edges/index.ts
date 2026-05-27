// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Public Entry Point
// ───────────────────────────────────────────────────────────────
// Orchestration for cross-skill edge propagation.

import type { PropagateEnhancesOptions, PropagateEnhancesResult } from './types.js';
import { loadAllSkillMetadataWithErrors } from './metadata-loader.js';
import { detectInboundEnhances } from './detect-inbound-enhances.js';
import { applyEnhanceEdge } from './apply-graph-metadata-patch.js';

// ───────────────────────────────────────────────────────────────
// 1. PUBLIC API
// ───────────────────────────────────────────────────────────────

/**
 * Detect and optionally apply missing inbound enhances edges across skills.
 *
 * Modes:
 * - report: Return candidates without making any changes (default)
 * - propose: Return candidates without making any changes (alias for report)
 * - apply: Apply selected candidates to source graph-metadata.json files
 *
 * @param options - Propagation options including skillsRoot, mode, confidence threshold, and apply filters
 * @returns Result including candidates, applied edges, skipped edges, and errors
 */
export async function propagateInboundEnhances(options: PropagateEnhancesOptions): Promise<PropagateEnhancesResult> {
  // Capture per-file parse errors at the loader boundary instead of silently dropping skills
  const { records: skills, errors: loaderErrors } = await loadAllSkillMetadataWithErrors(options.skillsRoot);
  const detectOpts = {
    minConfidence: options.minConfidence ?? 0.75,
    targetSkillIds: options.targetSkillIds,
    sourceSkillIds: options.sourceSkillIds,
  };
  const candidates = detectInboundEnhances(skills, detectOpts);

  const result: PropagateEnhancesResult = {
    candidates,
    applied: [],
    skipped_existing: [],
    errors: [...loaderErrors],
    dryRun: options.dryRun ?? true,
    mode: options.mode,
  };

  // Apply mode with optional dry run
  if (options.mode === 'apply' && (options.dryRun !== true)) {
    const toApply = candidates.filter(c => {
      // Apply if explicitly selected by ID
      if (options.applyCandidateIds?.includes(c.id)) return true;
      // Apply if high-confidence and applyAllHighConfidence is set
      if (options.applyAllHighConfidence && c.confidenceLabel === 'high' && c.applyable) return true;
      return false;
    });

    for (const c of toApply) {
      // Pass skillsRoot to enforce path-boundary at write time
      const r = await applyEnhanceEdge(c, options.skillsRoot);
      if (r.applied) {
        result.applied.push(c.id);
      } else if (r.reason === 'edge already exists') {
        result.skipped_existing.push(c.id);
      } else {
        result.errors.push({ skillId: c.sourceSkillId, error: r.reason });
      }
    }
  }

  return result;
}
