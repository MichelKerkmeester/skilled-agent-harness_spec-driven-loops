// ───────────────────────────────────────────────────────────────────
// MODULE: Review Divergent Pivot Inputs
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type {
  PivotCandidate,
} from '../../runtime/lib/deep-loop/pivot-candidates.ts';
import type {
  PivotConfigInput,
  PivotIdentityInput,
  PivotSeatMandate,
  PivotUsage,
} from '../../runtime/lib/deep-loop/divergent-pivot.ts';

type JsonRecord = Record<string, unknown>;

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** One persisted review-state fact that can become a read-only pivot candidate. */
export interface ReviewCandidateSeed {
  readonly source: string;
  readonly title: string;
  readonly focus: string;
  readonly evidenceRefs: readonly string[];
  readonly relevanceRationale: string;
  readonly scopeGrounded: boolean;
}

/** Files and loop facts needed to derive one review pivot input. */
export interface BuildReviewPivotInputOptions {
  readonly artifactRoot: string;
  readonly configPath: string;
  readonly stateLogPath: string;
  readonly strategyPath: string;
  readonly registryPath: string;
  readonly currentIteration: number;
  readonly maxIterations: number;
  readonly triggerReason: 'all_dimensions_clean';
}

/** Complete review-owned input for the mechanics-only pivot adapter. */
export interface ReviewPivotPreparationInput {
  readonly artifactRoot: string;
  readonly identity: PivotIdentityInput;
  readonly config: PivotConfigInput;
  readonly usage: PivotUsage;
  readonly seats: readonly PivotSeatMandate[];
  readonly candidates: readonly PivotCandidate[];
  readonly priorCandidates: readonly PivotCandidate[];
  readonly previousFocus: string;
  readonly saturatedDirections: readonly string[];
  readonly boundaryRejections: readonly ReviewCandidateSeed[];
}

// ───────────────────────────────────────────────────────────────────
// 2. INPUT HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/gu, ' ').trim() : '';
}

function normalizedKey(value: unknown): string {
  return normalizeText(value).normalize('NFKC').toLowerCase();
}

function readJson(path: string): JsonRecord {
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  if (!isRecord(parsed)) throw new TypeError(`${path} must contain a JSON object.`);
  return parsed;
}

function readJsonl(path: string): JsonRecord[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        const parsed = JSON.parse(line) as unknown;
        if (!isRecord(parsed)) throw new TypeError('record must be a JSON object');
        return parsed;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSONL at ${path}:${index + 1}: ${message}`);
      }
    });
}

function extractSection(markdown: string, headings: readonly string[]): string {
  for (const heading of headings) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    const match = markdown.match(new RegExp(
      `^##[ \\t]+${escaped}[ \\t]*\\r?\\n([\\s\\S]*?)(?=^##[ \\t]+|(?![\\s\\S]))`,
      'mu',
    ));
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return '';
}

function readStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(normalizeText).filter(Boolean) : [];
}

function fingerprint(title: string, focus: string): string {
  return createHash('sha256')
    .update(`${normalizedKey(title)}|${normalizedKey(focus)}`)
    .digest('hex');
}

function candidateFromSeed(seed: ReviewCandidateSeed): PivotCandidate {
  const digest = fingerprint(seed.title, seed.focus);
  return {
    id: `review-${seed.source}-${digest.slice(0, 12)}`,
    title: seed.title,
    focus: seed.focus,
    evidenceRefs: [...seed.evidenceRefs],
    relevanceRationale: seed.relevanceRationale,
    boundaryVerdict: {
      status: 'within_boundary',
      rationale: 'Derived from persisted review state inside the configured target. This direction authorizes no fix, target expansion, or file mutation; it is a read-only proposal for the next review pass.',
    },
    fingerprint: digest,
    seatProvenance: [`review-state:${seed.source}`],
  };
}

function priorCandidate(text: string, source: string, evidenceRef: string): PivotCandidate | null {
  const focus = normalizeText(text);
  if (!focus) return null;
  return candidateFromSeed({
    source,
    title: focus,
    focus,
    evidenceRefs: [evidenceRef],
    relevanceRationale: 'This direction is already current, swept, ruled out, or previously selected.',
    scopeGrounded: true,
  });
}

function uniqueCandidates(candidates: readonly PivotCandidate[]): PivotCandidate[] {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const key = `${candidate.id}|${normalizedKey(candidate.fingerprint)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function readPivotEvents(artifactRoot: string): JsonRecord[] {
  const pivotsRoot = join(artifactRoot, 'divergent', 'pivots');
  if (!existsSync(pivotsRoot)) return [];
  return readdirSync(pivotsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => readJsonl(join(pivotsRoot, entry.name, 'council', 'state.jsonl')));
}

function seedViolatesReadOnlyBoundary(seed: ReviewCandidateSeed): boolean {
  if (!seed.scopeGrounded || seed.evidenceRefs.length === 0) return true;
  const material = normalizedKey(`${seed.title} ${seed.focus}`);
  return [
    /\bimplement\b/u,
    /\bapply (?:a )?fix\b/u,
    /\bmodify\b/u,
    /\bmutat(?:e|ion)\b/u,
    /\brewrite\b/u,
    /\bexpand (?:the )?(?:scope|target)\b/u,
    /\bwrite (?:to|the)\b/u,
  ].some((pattern) => pattern.test(material));
}

function ledgerMethods(row: JsonRecord): Set<string> {
  const actions = Array.isArray(row.searchActions) ? row.searchActions : [];
  return new Set(actions.filter(isRecord).map((action) => normalizeText(action.method)).filter(Boolean));
}

function ledgerEvidence(row: JsonRecord): string[] {
  const actions = Array.isArray(row.searchActions) ? row.searchActions : [];
  return [...new Set([
    ...readStringList(row.targetRefs),
    ...actions.filter(isRecord).flatMap((action) => readStringList(action.evidenceRefs)),
  ])];
}

// ───────────────────────────────────────────────────────────────────
// 3. CANDIDATE GENERATION
// ───────────────────────────────────────────────────────────────────

function buildCandidateSeeds(
  config: JsonRecord,
  registry: JsonRecord,
  stateRecords: readonly JsonRecord[],
): ReviewCandidateSeed[] {
  const seeds: ReviewCandidateSeed[] = [];
  const add = (seed: ReviewCandidateSeed): void => {
    if (normalizeText(seed.focus)) seeds.push(seed);
  };
  const coverage = isRecord(registry.dimensionCoverage) ? registry.dimensionCoverage : {};
  readStringList(config.reviewDimensions).forEach((dimension) => {
    if (coverage[dimension] === true) return;
    add({
      source: 'unswept-dimension',
      title: `Sweep configured review dimension: ${dimension}`,
      focus: `Perform a read-only review pass on the configured ${dimension} dimension and report findings without changing the target.`,
      evidenceRefs: [`deep-review-config.json#reviewDimensions:${dimension}`],
      relevanceRationale: 'The configured review dimension has not been marked covered by the reducer.',
      scopeGrounded: true,
    });
  });

  const searchDebt = Array.isArray(registry.searchDebt) ? registry.searchDebt : [];
  searchDebt.filter(isRecord).forEach((entry, index) => {
    const refs = readStringList(entry.targetRefs).concat(readStringList(entry.evidenceRefs));
    const bugClass = normalizeText(entry.bugClass) || `search obligation ${index + 1}`;
    add({
      source: 'search-debt',
      title: `Review persisted search obligation: ${bugClass}`,
      focus: `Inspect the persisted in-scope ${bugClass} obligation read-only and report whether it yields a finding or can be ruled out.`,
      evidenceRefs: refs,
      relevanceRationale: 'The reducer retains this deferred or blocked search obligation in canonical state.',
      scopeGrounded: refs.length > 0,
    });
  });

  stateRecords.filter((record) => record.type === 'iteration' && record.reviewDepthSchemaVersion === 2)
    .forEach((record, recordIndex) => {
      const rows = Array.isArray(record.searchLedger) ? record.searchLedger : [];
      rows.filter(isRecord).forEach((row, rowIndex) => {
        const refs = ledgerEvidence(row);
        const methods = ledgerMethods(row);
        const dimension = normalizeText(row.dimension) || 'review';
        const bugClass = normalizeText(row.bugClass) || 'recorded candidate';
        const evidenceRef = `deep-review-state.jsonl#record-${recordIndex + 1}-ledger-${rowIndex + 1}`;
        if (!methods.has('producer_consumer_trace')) {
          add({
            source: 'producer-consumer-gap',
            title: `Trace producer-consumer boundary for ${bugClass}`,
            focus: `Read-only trace the persisted producer-consumer or boundary path for ${bugClass} within the ${dimension} review dimension; report findings only.`,
            evidenceRefs: refs.length ? refs.concat(evidenceRef) : [],
            relevanceRationale: 'The persisted v2 search ledger covers this in-scope candidate without a producer_consumer_trace action.',
            scopeGrounded: refs.length > 0,
          });
        }
        if (!methods.has('negative_test_inspection')) {
          add({
            source: 'negative-test-gap',
            title: `Inspect negative-test coverage for ${bugClass}`,
            focus: `Read-only inspect negative-test coverage for the persisted in-scope ${bugClass} candidate in the ${dimension} dimension; report findings only.`,
            evidenceRefs: refs.length ? refs.concat(evidenceRef) : [],
            relevanceRationale: 'The persisted v2 search ledger covers this in-scope candidate without a negative_test_inspection action.',
            scopeGrounded: refs.length > 0,
          });
        }
      });
    });

  const traceability = isRecord(registry.traceability) ? registry.traceability : {};
  const results = Array.isArray(traceability.results) ? traceability.results : [];
  results.filter(isRecord).forEach((result, index) => {
    const status = normalizedKey(result.status);
    if (status === 'pass' || status === 'notapplicable' || status === 'not_applicable' || status === 'not applicable' || status === 'n/a') return;
    const protocol = normalizeText(result.protocol || result.id) || `protocol ${index + 1}`;
    const refs = readStringList(result.evidenceRefs);
    add({
      source: 'traceability-gap',
      title: `Re-examine traceability protocol: ${protocol}`,
      focus: `Read-only re-examine the configured ${protocol} traceability protocol and report unresolved drift without changing the review target.`,
      evidenceRefs: refs.length ? refs : [`deep-review-findings-registry.json#traceability-result-${index + 1}`],
      relevanceRationale: 'The reducer-owned traceability rollup does not record this configured protocol as passing or not applicable.',
      scopeGrounded: true,
    });
  });

  return seeds;
}

// ───────────────────────────────────────────────────────────────────
// 4. SEAT PROMPTS
// ───────────────────────────────────────────────────────────────────

/** Render the parseable result contract and read-only boundary for one native review seat. */
export function renderReviewPivotSeatPrompt(
  seat: PivotSeatMandate,
  dispatchContext: {
    readonly candidates: readonly PivotCandidate[];
    readonly previousFocus: string;
    readonly normalizedTrigger: string;
  },
): string {
  return [
    'You are one native review direction-selection Council seat. Do not dispatch sub-agents or write files.',
    'Review target is READ-ONLY. Do not modify reviewed files.',
    'Do not implement fixes during review. A candidate is a proposed review direction only and must not authorize a fix, expand the review target, or imply any file mutation.',
    'SCOPE VIOLATION PROTOCOL: reject any candidate that would require an out-of-scope mutation; never execute it.',
    '',
    `Seat id: ${seat.id}`,
    `Mandate: ${seat.mandate}`,
    `Saturation trigger: ${dispatchContext.normalizedTrigger}`,
    `Previous focus: ${dispatchContext.previousFocus}`,
    '',
    'Candidate frontier:',
    JSON.stringify(dispatchContext.candidates, null, 2),
    '',
    'Return exactly one parseable JSON object and no surrounding prose or markdown:',
    '{"seatId":"' + seat.id + '","selectedCandidateId":null,"materialEndorsement":false,"rationale":"<non-empty rationale>","blockers":[]}',
    'Replace selectedCandidateId with one candidate id string and set materialEndorsement to true only for a material endorsement. Blockers may contain {severity, message, candidateId?}.',
  ].join('\n');
}

// ───────────────────────────────────────────────────────────────────
// 5. ADAPTER INPUT
// ───────────────────────────────────────────────────────────────────

/** Derive bounded candidates, prior directions, usage, identity, and mandates from review state. */
export function buildReviewPivotPreparationInput(
  options: BuildReviewPivotInputOptions,
): ReviewPivotPreparationInput {
  if (!Number.isInteger(options.currentIteration) || options.currentIteration < 0) {
    throw new TypeError('currentIteration must be a non-negative integer.');
  }
  if (!Number.isInteger(options.maxIterations) || options.maxIterations < 1) {
    throw new TypeError('maxIterations must be a positive integer.');
  }
  if (options.triggerReason !== 'all_dimensions_clean') {
    throw new TypeError('Review divergent pivots require the all_dimensions_clean legal-stop reason.');
  }

  const config = readJson(options.configPath);
  const registry = readJson(options.registryPath);
  const strategy = readFileSync(options.strategyPath, 'utf8');
  const stateRecords = readJsonl(options.stateLogPath);
  const pivotEvents = readPivotEvents(options.artifactRoot);
  const sessionId = normalizeText(config.sessionId);
  const generation = typeof config.generation === 'number' || typeof config.generation === 'string'
    ? config.generation
    : 1;
  if (!sessionId) throw new TypeError('Review config sessionId is required for a pivot.');
  if (!normalizeText(config.reviewTarget)) throw new TypeError('Review config reviewTarget is required for boundary validation.');

  const latestIteration = stateRecords.filter((record) => record.type === 'iteration').at(-1);
  const strategyFocus = extractSection(strategy, ['12. NEXT FOCUS', '11. NEXT FOCUS']);
  const previousFocus = normalizeText(strategyFocus) || normalizeText(latestIteration?.focus);
  if (!previousFocus) throw new TypeError('A current review dimension or direction is required for a pivot.');

  const seeds = buildCandidateSeeds(config, registry, stateRecords);
  const boundaryRejections = seeds.filter(seedViolatesReadOnlyBoundary);
  const candidates = uniqueCandidates(seeds.filter((seed) => !seedViolatesReadOnlyBoundary(seed)).map(candidateFromSeed));
  const completedEvents = pivotEvents.filter((event) => event.event === 'pivot_completed');
  const selectedEvents = pivotEvents.filter((event) => event.event === 'pivot_selected');
  const rejectedEvents = pivotEvents.filter((event) => event.event === 'pivot_candidate_rejected');
  const mainOverrides = stateRecords.filter((event) => event.event === 'pivot_override_accepted');
  const saturatedDirections = [...new Set([
    ...completedEvents.flatMap((event) => readStringList(event.saturatedDirections)),
    ...completedEvents.map((event) => normalizeText(event.previousFocus)).filter(Boolean),
    ...mainOverrides.flatMap((event) => readStringList(event.saturatedDirections)),
    previousFocus,
  ])];

  const priorCandidates: PivotCandidate[] = [];
  const addPrior = (value: unknown, source: string, evidenceRef: string): void => {
    const candidate = priorCandidate(normalizeText(value), source, evidenceRef);
    if (candidate) priorCandidates.push(candidate);
  };
  addPrior(previousFocus, 'current-focus', 'deep-review-strategy.md#next-focus');
  saturatedDirections.forEach((direction, index) => addPrior(direction, 'swept-direction', `divergent/pivots#swept-${index + 1}`));
  (Array.isArray(registry.ruledOutCandidates) ? registry.ruledOutCandidates : []).filter(isRecord)
    .forEach((entry, index) => addPrior(entry.rationale || entry.reason || entry.bugClass, 'ruled-out-direction', `deep-review-findings-registry.json#ruled-out-${index + 1}`));
  (Array.isArray(registry.cleanSearchProof) ? registry.cleanSearchProof : []).filter(isRecord)
    .forEach((entry, index) => addPrior(entry.proof || entry.rationale || entry.bugClass, 'clean-search-proof', `deep-review-findings-registry.json#clean-proof-${index + 1}`));
  selectedEvents.forEach((event, index) => {
    if (isRecord(event.selectedCandidate)) priorCandidates.push(event.selectedCandidate as unknown as PivotCandidate);
    else addPrior(event.selectedCandidate, 'selected-direction', `divergent/pivots#selected-${index + 1}`);
  });
  mainOverrides.forEach((event, index) => {
    if (isRecord(event.selectedCandidate)) priorCandidates.push(event.selectedCandidate as unknown as PivotCandidate);
    else addPrior(event.selectedCandidate, 'override-direction', `deep-review-state.jsonl#override-${index + 1}`);
  });
  rejectedEvents.forEach((event, index) => {
    const candidate = isRecord(event.candidate) ? event.candidate : null;
    if (candidate) priorCandidates.push(candidate as unknown as PivotCandidate);
    else addPrior(event.candidate, 'adapter-rejected-direction', `divergent/pivots#candidate-rejected-${index + 1}`);
  });

  const seats: readonly PivotSeatMandate[] = [
    { id: 'seat-001', mandate: 'Analytical: select the read-only review direction that closes the most consequential persisted coverage gap without expanding the configured target.' },
    { id: 'seat-002', mandate: 'Critical: challenge candidate evidence, target-boundary safety, read-only compliance, and risk of re-entering swept dimensions.' },
    { id: 'seat-003', mandate: 'Pragmatic: select the most evidence-efficient read-only review direction that can produce material findings within the remaining iterations.' },
  ];
  const usage: PivotUsage = {
    completedPivots: completedEvents.length,
    councilSeatOutputs: pivotEvents.filter((event) => event.event === 'pivot_seat_returned').length,
    remainingIterations: Math.max(0, options.maxIterations - options.currentIteration),
  };

  return {
    artifactRoot: options.artifactRoot,
    identity: {
      sessionId,
      generation,
      loopType: 'review',
      sourceIteration: options.currentIteration,
      normalizedTrigger: `review saturation: ${options.triggerReason}`,
      ordinal: usage.completedPivots + 1,
    },
    config: config as unknown as PivotConfigInput,
    usage,
    seats,
    candidates,
    priorCandidates: uniqueCandidates(priorCandidates),
    previousFocus,
    saturatedDirections,
    boundaryRejections,
  };
}
