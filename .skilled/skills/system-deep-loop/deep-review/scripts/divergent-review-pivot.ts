// ───────────────────────────────────────────────────────────────────
// MODULE: Review Divergent Pivot Inputs
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';

import type {
  PivotCandidate,
} from '../../runtime/lib/deep-loop/pivot-candidates.ts';
import { derivePivotId } from '../../runtime/lib/deep-loop/divergent-pivot.ts';
import {
  fingerprint,
  isRecord,
  normalizedKey,
  normalizeText,
  readJson,
  readJsonl,
  readPivotEvents,
  uniqueCandidates,
} from '../../runtime/lib/deep-loop/divergent-pivot-io.ts';

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
  /**
   * Path entries quoted inside the focus. A path is data, not an instruction, so the
   * read-only guard skips it. Only path-shaped entries are listed: free text in a
   * scope is still read by the guard.
   */
  readonly quotedPaths?: readonly string[];
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

/** Per-dispatch facts every seat prompt shows: the candidates, the previous focus and the normalized saturation trigger. */
interface PivotSeatDispatchContext {
  readonly candidates: readonly PivotCandidate[];
  readonly previousFocus: string;
  readonly normalizedTrigger: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. INPUT HELPERS
// ───────────────────────────────────────────────────────────────────

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

// A scope entry reads as a path when it has no whitespace and carries a path
// separator or a file extension. A bare word such as "implement" does not, so
// the read-only guard still reads it.
function isPathShaped(entry: string): boolean {
  return entry !== '' && !/\s/u.test(entry) && /[/.]/u.test(entry);
}

function seedViolatesReadOnlyBoundary(seed: ReviewCandidateSeed): boolean {
  if (!seed.scopeGrounded || seed.evidenceRefs.length === 0) return true;
  const focus = (seed.quotedPaths ?? []).reduce((text, quoted) => text.split(quoted).join(' '), seed.focus);
  const material = normalizedKey(`${seed.title} ${focus}`);
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

// The frontier queue only exists under the expansive depth mode, so a run that
// never asked for it projects no nodes and every frontier-aware branch below
// stays on its default path.
function expansiveFrontierNodes(config: JsonRecord, registry: JsonRecord): JsonRecord[] {
  const antiConvergence = isRecord(config.antiConvergence) ? config.antiConvergence : {};
  if (antiConvergence.depthMode !== 'expansive') return [];
  const frontier = isRecord(registry.frontier) ? registry.frontier : {};
  return Array.isArray(frontier.nodes) ? frontier.nodes.filter(isRecord) : [];
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

  // A frontier node the run closed without answering is review depth it already
  // paid for, and revisiting that sub-target is read-only work inside the same
  // configured target, so it seeds a fresh direction instead of being dropped.
  expansiveFrontierNodes(config, registry).forEach((node) => {
    const status = normalizeText(node.status);
    if (status !== 'exhausted' && status !== 'blocked') return;
    const nodeId = normalizeText(node.nodeId);
    const scopeList = Array.isArray(node.scope) ? readStringList(node.scope) : [normalizeText(node.scope)].filter(Boolean);
    const scope = scopeList.join(', ') || 'unscoped';
    const quotedPaths = scopeList.filter(isPathShaped);
    add({
      source: 'frontier-unanswered',
      title: `Revisit ${status} frontier node ${nodeId}`,
      focus: `Read-only review of the ${status} frontier sub-target ${nodeId} (${scope}) and report findings without expanding the review target.`,
      evidenceRefs: [`frontier-nodes.jsonl#${nodeId}`],
      relevanceRationale: `The frontier closed this sub-target ${status} without covering every configured dimension.`,
      scopeGrounded: true,
      quotedPaths,
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
  dispatchContext: PivotSeatDispatchContext,
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

  // The stop veto already keeps the run going while frontier nodes are open, so a
  // pivot reaching this point with one still open means the caller skipped it. An
  // accepted direction becomes the next review focus, not a frontier node, so the
  // pivot needs a closed queue to avoid competing with open frontier work.
  const frontierOpen = expansiveFrontierNodes(config, registry)
    .some((node) => ['open', 'active'].includes(normalizeText(node.status)));
  if (frontierOpen) {
    throw new TypeError('A review pivot under the expansive depth mode needs a terminal frontier; open frontier nodes remain.');
  }
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
  const identity: PivotIdentityInput = {
    sessionId,
    generation,
    loopType: 'review',
    sourceIteration: options.currentIteration,
    normalizedTrigger: `review saturation: ${options.triggerReason}`,
    ordinal: completedEvents.length + 1,
  };
  const currentPivotId = derivePivotId(identity);
  const currentAttempt = pivotEvents.some((event) => event.pivotId === currentPivotId && event.event === 'pivot_attempt_failed') ? 2 : 1;
  const usage: PivotUsage = {
    completedPivots: completedEvents.length,
    // Seat outputs are capped per council attempt, so only the pivot about to be prepared counts.
    councilSeatOutputs: pivotEvents.filter((event) => event.event === 'pivot_seat_returned'
      && event.pivotId === currentPivotId
      && (event.attempt ?? 1) === currentAttempt).length,
    remainingIterations: Math.max(0, options.maxIterations - options.currentIteration),
  };

  return {
    artifactRoot: options.artifactRoot,
    identity,
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
