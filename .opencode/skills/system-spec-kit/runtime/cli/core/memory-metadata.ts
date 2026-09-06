// ───────────────────────────────────────────────────────────────────
// MODULE: Memory Metadata
// ───────────────────────────────────────────────────────────────────
// Memory classification, session dedup, causal links, and evidence
// snapshot construction. Extracted from workflow.ts to reduce module size.

import * as crypto from 'node:crypto';
import * as fsSync from 'node:fs';
import * as path from 'node:path';

import { readNamedObject, readStringArray, readNumber, readString } from './workflow-accessors.js';
import { hasAnyCompletionClaim } from '../validation/continuity-freshness.js';

import type { CollectedDataFull } from '../extractors/collect-session-data.js';
import type { MemoryEvidenceSnapshot } from '@spec-kit/shared/parsing/memory-sufficiency';
import type { FileChange } from '../types/session-types.js';
import { buildContinuityFingerprint, ZERO_CONTINUITY_FINGERPRINT } from '@spec-kit/runtime/api';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export type MemoryClassificationContext = {
  MEMORY_TYPE: string;
  HALF_LIFE_DAYS: number;
  BASE_DECAY_RATE: number;
  ACCESS_BOOST_FACTOR: number;
  RECENCY_WEIGHT: number;
  IMPORTANCE_MULTIPLIER: number;
};

export type SessionDedupContext = {
  MEMORIES_SURFACED_COUNT: number;
  DEDUP_SAVINGS_TOKENS: number;
  FINGERPRINT_HASH: string;
  SIMILAR_MEMORIES: Array<{ MEMORY_ID: string; SIMILARITY_SCORE: number }>;
};

export type CausalLinksContext = {
  CAUSED_BY: string[];
  SUPERSEDES: string[];
  DERIVED_FROM: string[];
  BLOCKS: string[];
  RELATED_TO: string[];
};

export type WorkflowObservationEvidence = {
  TITLE?: string;
  title?: string;
  NARRATIVE?: string;
  narrative?: string;
  FACTS?: unknown[];
  facts?: unknown[];
  _synthetic?: boolean;
  _provenance?: string;
  _specRelevant?: boolean;
};

export type WorkflowDecisionEvidence = {
  TITLE?: string;
  CHOSEN?: string;
  RATIONALE?: string;
  CONTEXT?: string;
};

export type WorkflowOutcomeEvidence = {
  OUTCOME?: string;
};

// ───────────────────────────────────────────────────────────────────
// 2. FUNCTIONS
// ───────────────────────────────────────────────────────────────────

export function inferMemoryType(contextType: string, importanceTier: string): string {
  if (importanceTier === 'constitutional') {
    return 'constitutional';
  }
  if (contextType === 'implementation') {
    return 'procedural';
  }
  if (contextType === 'decision' || contextType === 'research' || contextType === 'discovery') {
    return 'semantic';
  }
  return 'episodic';
}

/** Default decay half-life in days for a memory type. */
export function defaultHalfLifeDays(memoryType: string): number {
  switch (memoryType) {
    case 'constitutional':
      return 0;
    case 'procedural':
      return 180;
    case 'semantic':
      return 365;
    case 'episodic':
    default:
      return 30;
  }
}

/** Derive a per-period decay rate from a half-life in days (0 when the half-life is non-positive). */
export function baseDecayRateFromHalfLife(halfLifeDays: number): number {
  if (halfLifeDays <= 0) {
    return 0;
  }

  return Number(Math.pow(0.5, 1 / halfLifeDays).toFixed(4));
}

/** Decay-rate multiplier for an importance tier. */
export function importanceMultiplier(importanceTier: string): number {
  switch (importanceTier) {
    case 'constitutional':
      return 2;
    case 'critical':
      return 1.6;
    case 'important':
      return 1.3;
    case 'temporary':
      return 0.6;
    case 'deprecated':
      return 0.2;
    case 'normal':
    default:
      return 1;
  }
}

/** Build the memory-classification template context (type, half-life, decay factors) from collected data. */
export function buildMemoryClassificationContext(
  collectedData: CollectedDataFull,
  sessionData: { CONTEXT_TYPE: string; IMPORTANCE_TIER: string },
): MemoryClassificationContext {
  const rawClassification = readNamedObject(collectedData, 'memory_classification', 'memoryClassification');
  const rawDecayFactors = readNamedObject(rawClassification, 'decay_factors', 'decayFactors');
  const fallbackType = inferMemoryType(sessionData.CONTEXT_TYPE, sessionData.IMPORTANCE_TIER);
  const memoryType = readString(
    rawClassification,
    readString(collectedData, fallbackType, 'memory_type', 'memoryType'),
    'memory_type',
    'memoryType',
  );
  const halfLifeDays = readNumber(
    rawClassification,
    defaultHalfLifeDays(memoryType),
    'half_life_days',
    'halfLifeDays',
  );

  return {
    MEMORY_TYPE: memoryType,
    HALF_LIFE_DAYS: halfLifeDays,
    BASE_DECAY_RATE: readNumber(
      rawDecayFactors || rawClassification,
      baseDecayRateFromHalfLife(halfLifeDays),
      'base_decay_rate',
      'baseDecayRate',
    ),
    ACCESS_BOOST_FACTOR: readNumber(
      rawDecayFactors || rawClassification,
      0.1,
      'access_boost_factor',
      'accessBoostFactor',
    ),
    RECENCY_WEIGHT: readNumber(
      rawDecayFactors || rawClassification,
      0.5,
      'recency_weight',
      'recencyWeight',
    ),
    IMPORTANCE_MULTIPLIER: readNumber(
      rawDecayFactors || rawClassification,
      importanceMultiplier(sessionData.IMPORTANCE_TIER),
      'importance_multiplier',
      'importanceMultiplier',
    ),
  };
}

/** Build the session-dedup template context, including similar memories and a fallback content fingerprint. */
export function buildSessionDedupContext(
  collectedData: CollectedDataFull,
  sessionData: { SESSION_ID: string; SUMMARY: string },
  memoryTitle: string,
): SessionDedupContext {
  const rawDedup = readNamedObject(collectedData, 'session_dedup', 'sessionDedup');
  const rawSimilarMemories = rawDedup?.['similar_memories'] ?? rawDedup?.['similarMemories'];
  const similarMemories = Array.isArray(rawSimilarMemories)
    ? rawSimilarMemories.flatMap((entry) => {
      if (typeof entry === 'string' && entry.trim().length > 0) {
        return [{ MEMORY_ID: entry.trim(), SIMILARITY_SCORE: 0 }];
      }
      if (entry && typeof entry === 'object') {
        const item = entry as Record<string, unknown>;
        const memoryId = readString(item, '', 'id', 'memory_id', 'memoryId');
        if (memoryId.length === 0) {
          return [];
        }
        return [{
          MEMORY_ID: memoryId,
          SIMILARITY_SCORE: readNumber(item, 0, 'similarity', 'similarity_score', 'similarityScore'),
        }];
      }
      return [];
    })
    : [];
  const fallbackFingerprint = crypto
    .createHash('sha1')
    .update(`${sessionData.SESSION_ID}\n${memoryTitle}\n${sessionData.SUMMARY}`)
    .digest('hex');

  return {
    MEMORIES_SURFACED_COUNT: readNumber(
      rawDedup,
      similarMemories.length,
      'memories_surfaced',
      'memoriesSurfaced',
      'memories_surfaced_count',
      'memoriesSurfacedCount',
    ),
    DEDUP_SAVINGS_TOKENS: readNumber(
      rawDedup,
      0,
      'dedup_savings_tokens',
      'dedupSavingsTokens',
    ),
    FINGERPRINT_HASH: readString(
      rawDedup,
      fallbackFingerprint,
      'fingerprint_hash',
      'fingerprintHash',
    ),
    SIMILAR_MEMORIES: similarMemories,
  };
}

/** Merge snake_case and camelCase causal-link fields into one deduplicated CausalLinksContext. */
export function buildCausalLinksContext(collectedData: CollectedDataFull): CausalLinksContext {
  const snakeCaseLinks = readNamedObject(collectedData, 'causal_links');
  const camelCaseLinks = readNamedObject(collectedData, 'causalLinks');
  const mergeLinkArray = (...keys: string[]): string[] => {
    const merged: string[] = [];
    const seen = new Set<string>();

    for (const source of [snakeCaseLinks, camelCaseLinks]) {
      for (const value of readStringArray(source, ...keys)) {
        if (!seen.has(value)) {
          merged.push(value);
          seen.add(value);
        }
      }
    }

    return merged;
  };

  return {
    CAUSED_BY: mergeLinkArray('caused_by', 'causedBy'),
    SUPERSEDES: mergeLinkArray('supersedes'),
    DERIVED_FROM: mergeLinkArray('derived_from', 'derivedFrom'),
    BLOCKS: mergeLinkArray('blocks'),
    RELATED_TO: mergeLinkArray('related_to', 'relatedTo'),
  };
}

/** Read an explicit title/description pair from collected data, omitting empty fields. */
export function readExplicitMemoryText(collectedData: CollectedDataFull): {
  title?: string;
  description?: string;
} {
  const title = readString(collectedData, '', 'title').trim();
  const description = readString(collectedData, '', 'description').trim();

  return {
    ...(title.length > 0 ? { title } : {}),
    ...(description.length > 0 ? { description } : {}),
  };
}

/** Return the parent spec-folder's relative name when a sibling spec.md exists one level up, else ''. */
export function resolveParentSpec(specFolderPath: string, specFolderName: string): string {
  const parentPath = path.dirname(specFolderPath);
  const parentSpecPath = path.join(parentPath, 'spec.md');
  if (!fsSync.existsSync(parentSpecPath)) {
    return '';
  }

  const normalizedSpecFolder = specFolderName.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  const parentRelative = normalizedSpecFolder.split('/').slice(0, -1).join('/');
  if (!parentRelative || parentRelative === normalizedSpecFolder) {
    return '';
  }

  return parentRelative;
}

function normalizeEvidenceLine(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value && typeof value === 'object' && typeof (value as { text?: unknown }).text === 'string') {
    return String((value as { text?: unknown }).text).trim();
  }

  return '';
}

/** Build a compact evidence snapshot (title, content, trigger phrases, files) for memory sufficiency checks. */
export function buildWorkflowMemoryEvidenceSnapshot(params: {
  title: string;
  content: string;
  triggerPhrases: string[];
  files: FileChange[];
  observations: WorkflowObservationEvidence[];
  decisions: WorkflowDecisionEvidence[];
  outcomes: WorkflowOutcomeEvidence[];
  nextAction?: string;
  blockers?: string;
  recentContext?: Array<{ request?: string; learning?: string }>;
}): MemoryEvidenceSnapshot {
  const {
    title,
    content,
    triggerPhrases,
    files,
    observations,
    decisions,
    outcomes,
    nextAction,
    blockers,
    recentContext,
  } = params;

  const meaningfulBlockers = typeof blockers === 'string'
    && blockers.trim().length > 0
    && !/^none$/i.test(blockers.trim())
    ? [blockers.trim()]
    : [];

  return {
    title,
    content,
    triggerPhrases,
    files: files.map((file) => ({
      path: file.FILE_PATH,
      description: file.DESCRIPTION,
      specRelevant: true,
    })),
    observations: observations.map((observation) => ({
      title: typeof observation.TITLE === 'string'
        ? observation.TITLE
        : (typeof observation.title === 'string' ? observation.title : ''),
      narrative: typeof observation.NARRATIVE === 'string'
        ? observation.NARRATIVE
        : (typeof observation.narrative === 'string' ? observation.narrative : ''),
      facts: Array.isArray(observation.FACTS)
        ? observation.FACTS.map(normalizeEvidenceLine).filter(Boolean)
        : (Array.isArray(observation.facts) ? observation.facts.map(normalizeEvidenceLine).filter(Boolean) : []),
      synthetic: observation._synthetic === true,
      provenance: typeof observation._provenance === 'string' ? observation._provenance : undefined,
      specRelevant: observation._specRelevant !== false,
    })),
    decisions: decisions.map((decision) => (
      [
        typeof decision.TITLE === 'string' ? decision.TITLE : '',
        typeof decision.CHOSEN === 'string' ? decision.CHOSEN : '',
        typeof decision.RATIONALE === 'string' ? decision.RATIONALE : '',
        typeof decision.CONTEXT === 'string' ? decision.CONTEXT : '',
      ].filter(Boolean).join(' ')
    )).filter(Boolean),
    nextActions: typeof nextAction === 'string' && nextAction.trim().length > 0 ? [nextAction.trim()] : [],
    blockers: meaningfulBlockers,
    outcomes: outcomes
      .map((outcome) => (typeof outcome.OUTCOME === 'string' ? outcome.OUTCOME.trim() : ''))
      .filter(Boolean),
    recentContext: (recentContext || []).map((context) => ({
      request: context.request,
      learning: context.learning,
    })),
    anchors: extractAnchorIds(content),
  };
}

/** Also used by frontmatter-editor; exported for reuse. */
export function extractAnchorIds(content: string): string[] {
  // HTML ids are intentionally ignored; comment anchors are the structural source of truth.
  const matches = content.matchAll(/<!--\s*(?:\/)?ANCHOR:\s*([a-zA-Z0-9][a-zA-Z0-9-]*)\s*-->/g);
  return Array.from(new Set(Array.from(matches, (match) => match[1])));
}

// Mirrors the fingerprint-field pattern normalizeForContinuityFingerprint
// (runtime/lib/validation/spec-doc-structure.ts) hashes past, so a value
// stamped here reads back identical through CONTINUITY_FRESHNESS's own
// recomputation. Duplicated rather than imported: that module lives outside
// this package's runtime-API boundary.
const SESSION_DEDUP_FINGERPRINT_LINE_RE = /^(\s{6}fingerprint:\s*)(?:["'])?sha256:[a-f0-9]{64}(?:["'])?(\s*(?:#.*)?)$/m;

/**
 * Stamp implementation-summary.md's `_memory.continuity.session_dedup.fingerprint`
 * with a real, content-derived value whenever the spec folder carries a
 * completion claim in any of the six COMPLETION_DOCS (continuity-freshness.ts's
 * attestation binding: implementation-summary.md is the sole document that
 * fingerprint is ever verified against). Intended as a post-save step so a
 * freshly saved completed packet does not default into CONTINUITY_FRESHNESS's
 * `missing_fingerprint`/`zero_fingerprint` skip codes. A no-op when the
 * document has no session_dedup.fingerprint field to stamp, or when the
 * stored value already matches the recomputed one.
 */
export function stampCompletionFingerprintIfNeeded(specFolderPath: string): void {
  const summaryPath = path.join(specFolderPath, 'implementation-summary.md');
  if (!fsSync.existsSync(summaryPath)) {
    return;
  }
  if (!hasAnyCompletionClaim(specFolderPath)) {
    return;
  }

  const content = fsSync.readFileSync(summaryPath, 'utf-8');
  if (!SESSION_DEDUP_FINGERPRINT_LINE_RE.test(content)) {
    return;
  }

  // The fingerprint field itself is normalized to the zero placeholder before
  // hashing, so recomputing against the pre-stamp content already yields the
  // value the field should hold -- no separate re-read after writing is needed.
  const recomputed = buildContinuityFingerprint(content);
  if (recomputed === ZERO_CONTINUITY_FINGERPRINT) {
    return;
  }

  const stamped = content.replace(SESSION_DEDUP_FINGERPRINT_LINE_RE, `$1"${recomputed}"$2`);
  if (stamped === content) {
    return;
  }
  fsSync.writeFileSync(summaryPath, stamped, 'utf-8');
}
