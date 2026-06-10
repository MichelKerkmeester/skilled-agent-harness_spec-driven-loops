// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Apply Patch
// ───────────────────────────────────────────────────────────────
// Idempotent JSON patching for applying enhance edges to graph-metadata.json.

import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve, sep } from 'node:path';
import type { EdgeSourceKind, EdgeWriteIntent, InboundEnhanceCandidate } from './types.js';

// ───────────────────────────────────────────────────────────────
// 1. APPLY EDGE
// ───────────────────────────────────────────────────────────────

const PROTECTED_SOURCE_KINDS = new Set<EdgeSourceKind>(['manual', 'trusted']);

function deriveSourceKind(writeIntent: EdgeWriteIntent): EdgeSourceKind {
  return writeIntent === 'trusted-maintainer' ? 'trusted' : 'automated';
}

function readSourceKind(edge: Record<string, unknown>): EdgeSourceKind | null {
  const value = edge.source_kind;
  if (value === 'automated' || value === 'manual' || value === 'trusted') {
    return value;
  }
  return null;
}

function buildAutomatedReason(candidate: InboundEnhanceCandidate): string {
  return candidate.rules.map(r => `${r.rule}:${r.contribution.toFixed(2)}`).join(' + ');
}

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
 * Idempotent for automated writes and protects manually maintained provenance.
 *
 * @param candidate - The candidate to apply
 * @param skillsRoot - Optional trusted workspace root. When provided, candidate.sourcePath
 *                    MUST resolve under this root and have basename 'graph-metadata.json'.
 * This guards against path traversal in apply mode.
 */
export async function applyEnhanceEdge(
  candidate: InboundEnhanceCandidate,
  skillsRoot?: string,
  writeIntent: EdgeWriteIntent = 'automated',
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
    const sourceKind = deriveSourceKind(writeIntent);
    const existingEdge = enhances.find(e => e.target === candidate.targetSkillId);

    if (existingEdge && writeIntent === 'automated') {
      const existingSourceKind = readSourceKind(existingEdge);
      if (existingSourceKind && PROTECTED_SOURCE_KINDS.has(existingSourceKind)) {
        return { applied: false, reason: 'edge already exists: manual provenance protected' };
      }
      return { applied: false, reason: 'edge already exists' };
    }

    if (existingEdge) {
      existingEdge.weight = candidate.weight;
      existingEdge.context = candidate.context;
      existingEdge.source_kind = sourceKind;
      await writeFile(candidate.sourcePath, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
      return { applied: true, reason: 'edge updated by trusted maintainer' };
    }

    const newEdge = {
      target: candidate.targetSkillId,
      weight: candidate.weight,
      context: candidate.context,
      source_kind: sourceKind,
    };

    if (writeIntent === 'automated') {
      Object.assign(newEdge, {
        auto_added_at: new Date().toISOString(),
        auto_added_reason: buildAutomatedReason(candidate),
      });
    }

    enhances.push(newEdge);
    parsed.edges.enhances = enhances;

    await writeFile(candidate.sourcePath, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
    return { applied: true, reason: `edge added with ${sourceKind} provenance` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { applied: false, reason: `failed to apply edge: ${message}` };
  }
}
