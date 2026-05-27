// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Apply Patch
// ───────────────────────────────────────────────────────────────
// Idempotent JSON patching for applying enhance edges to graph-metadata.json.

import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve, sep } from 'node:path';
import type { InboundEnhanceCandidate } from './types.js';

// ───────────────────────────────────────────────────────────────
// 1. APPLY EDGE
// ───────────────────────────────────────────────────────────────

/**
 * Validate that the source path is a graph-metadata.json file under the trusted skills root.
 * Prevents path traversal in apply mode.
 */
function isPathWithin(candidatePath: string, trustedRoot: string): boolean {
  const resolvedCandidate = resolve(candidatePath);
  const resolvedRoot = resolve(trustedRoot);
  const rootWithSep = resolvedRoot.endsWith(sep) ? resolvedRoot : resolvedRoot + sep;
  return resolvedCandidate.startsWith(rootWithSep) && basename(resolvedCandidate) === 'graph-metadata.json';
}

/**
 * Apply an enhance edge to the source skill's graph-metadata.json.
 * Idempotent - skips if edge already exists.
 * Adds auto-marker fields (auto_added_at, auto_added_reason).
 *
 * @param candidate - The candidate to apply
 * @param skillsRoot - Optional trusted workspace root. When provided, candidate.sourcePath
 *                    MUST resolve under this root and have basename 'graph-metadata.json'.
 * This guards against path traversal in apply mode.
 */
export async function applyEnhanceEdge(
  candidate: InboundEnhanceCandidate,
  skillsRoot?: string,
): Promise<{ applied: boolean; reason: string }> {
  if (!candidate.applyable) {
    return { applied: false, reason: `not applyable: ${candidate.blockers.join('; ')}` };
  }

  if (skillsRoot && !isPathWithin(candidate.sourcePath, skillsRoot)) {
    return {
      applied: false,
      reason: `path-boundary violation: ${candidate.sourcePath} not under ${skillsRoot}`,
    };
  }

  try {
    const raw = await readFile(candidate.sourcePath, 'utf-8');
    const parsed = JSON.parse(raw);

    if (!parsed.edges) {
      parsed.edges = {};
    }
    if (!parsed.edges.enhances) {
      parsed.edges.enhances = [];
    }

    const enhances: Array<Record<string, unknown>> = parsed.edges.enhances;

    // Idempotence guard
    if (enhances.some(e => e.target === candidate.targetSkillId)) {
      return { applied: false, reason: 'edge already exists' };
    }

    const newEdge = {
      target: candidate.targetSkillId,
      weight: candidate.weight,
      context: candidate.context,
      auto_added_at: new Date().toISOString(),
      auto_added_reason: candidate.rules.map(r => `${r.rule}:${r.contribution.toFixed(2)}`).join(' + '),
    };

    enhances.push(newEdge);
    parsed.edges.enhances = enhances;

    await writeFile(candidate.sourcePath, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
    return { applied: true, reason: 'edge added with auto-marker fields' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { applied: false, reason: `failed to apply edge: ${message}` };
  }
}
