// ───────────────────────────────────────────────────────────────────
// MODULE: Research Divergent Pivot Inputs
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

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

/** One research-state fact that can become an in-boundary pivot candidate. */
export interface CandidateSeed {
  readonly source: string;
  readonly title: string;
  readonly focus: string;
  readonly evidenceRef: string;
  readonly relevanceRationale: string;
}

/** Files and loop facts needed to derive one research pivot input. */
export interface BuildResearchPivotInputOptions {
  readonly artifactRoot: string;
  readonly configPath: string;
  readonly stateLogPath: string;
  readonly strategyPath: string;
  readonly registryPath: string;
  readonly currentIteration: number;
  readonly maxIterations: number;
  readonly triggerReason: 'all_questions_answered' | 'composite_converged';
}

/** Complete mode-owned input for the mechanics-only pivot adapter. */
export interface ResearchPivotPreparationInput {
  readonly artifactRoot: string;
  readonly identity: PivotIdentityInput;
  readonly config: PivotConfigInput;
  readonly usage: PivotUsage;
  readonly seats: readonly PivotSeatMandate[];
  readonly candidates: readonly PivotCandidate[];
  readonly priorCandidates: readonly PivotCandidate[];
  readonly previousFocus: string;
  readonly saturatedDirections: readonly string[];
  readonly boundaryRejections: readonly CandidateSeed[];
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
  if (!isRecord(parsed)) {
    throw new TypeError(`${path} must contain a JSON object.`);
  }
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

function extractSection(markdown: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const match = markdown.match(new RegExp(
    `^##[ \\t]+${escaped}[ \\t]*\\r?\\n([\\s\\S]*?)(?=^##[ \\t]+|(?![\\s\\S]))`,
    'mu',
  ));
  return match?.[1]?.trim() ?? '';
}

function extractListText(section: string): string[] {
  return section
    .split(/\r?\n/u)
    .map((line) => normalizeText(line.replace(/^[-*]\s+(?:\[[ xX]\]\s*)?/u, '')))
    .filter((line) => line !== '' && !line.startsWith('['));
}

function fingerprint(title: string, focus: string): string {
  return createHash('sha256')
    .update(`${normalizedKey(title)}|${normalizedKey(focus)}`)
    .digest('hex');
}

function candidateFromSeed(seed: CandidateSeed, boundaryRationale: string): PivotCandidate {
  const digest = fingerprint(seed.title, seed.focus);
  return {
    id: `research-${seed.source}-${digest.slice(0, 12)}`,
    title: seed.title,
    focus: seed.focus,
    evidenceRefs: [seed.evidenceRef],
    relevanceRationale: seed.relevanceRationale,
    boundaryVerdict: {
      status: 'within_boundary',
      rationale: boundaryRationale,
    },
    fingerprint: digest,
    seatProvenance: [`research-state:${seed.source}`],
  };
}

function priorCandidate(text: string, source: string, evidenceRef: string): PivotCandidate | null {
  const focus = normalizeText(text);
  if (!focus) return null;
  return candidateFromSeed({
    source,
    title: focus,
    focus,
    evidenceRef,
    relevanceRationale: 'This direction is already current, saturated, rejected, or previously selected.',
  }, 'Prior-state entry retained only for deduplication inside the existing research boundary.');
}

function readText(value: unknown): string {
  if (typeof value === 'string') return normalizeText(value);
  if (!isRecord(value)) return '';
  for (const field of ['text', 'focus', 'title', 'question', 'direction', 'pattern', 'message']) {
    const text = normalizeText(value[field]);
    if (text) return text;
  }
  return '';
}

function readStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(readText).filter(Boolean) : [];
}

function readPivotEvents(artifactRoot: string): JsonRecord[] {
  const pivotsRoot = join(artifactRoot, 'divergent', 'pivots');
  if (!existsSync(pivotsRoot)) return [];
  return readdirSync(pivotsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => readJsonl(join(pivotsRoot, entry.name, 'council', 'state.jsonl')));
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

function conflictsWithNonGoal(seed: CandidateSeed, nonGoals: readonly string[]): boolean {
  const material = ` ${normalizedKey(`${seed.title} ${seed.focus}`)} `;
  return nonGoals.some((nonGoal) => {
    const excluded = ` ${normalizedKey(nonGoal)} `;
    return excluded.trim() !== '' && (material.includes(excluded) || excluded.includes(material));
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. CANDIDATE GENERATION
// ───────────────────────────────────────────────────────────────────

function buildCandidateSeeds(
  registry: JsonRecord,
  stateRecords: readonly JsonRecord[],
): CandidateSeed[] {
  const seeds: CandidateSeed[] = [];
  const add = (seed: CandidateSeed): void => {
    if (normalizeText(seed.focus) && normalizeText(seed.evidenceRef)) seeds.push(seed);
  };

  for (const [index, question] of [
    ...(Array.isArray(registry.openQuestions) ? registry.openQuestions : []),
    ...(Array.isArray(registry.carriedForwardOpenQuestions) ? registry.carriedForwardOpenQuestions : []),
  ].entries()) {
    const text = readText(question);
    if (!text) continue;
    add({
      source: 'adjacent-question',
      title: `Investigate adjacent question: ${text}`,
      focus: text,
      evidenceRef: `findings-registry.json#open-question-${index + 1}`,
      relevanceRationale: 'The canonical research registry still carries this question inside the current topic.',
    });
  }

  const questionConflicts = Array.isArray(registry.questionConflicts) ? registry.questionConflicts : [];
  questionConflicts.forEach((conflict, index) => {
    if (!isRecord(conflict)) return;
    const inboxValue = normalizeText(conflict.inboxValue);
    const registryValue = normalizeText(conflict.registryValue);
    if (!inboxValue || !registryValue) return;
    add({
      source: 'contradiction-gap',
      title: `Resolve conflicting research question ${index + 1}`,
      focus: `Verify whether "${inboxValue}" or "${registryValue}" is supported by the current evidence.`,
      evidenceRef: `findings-registry.json#question-conflict-${index + 1}`,
      relevanceRationale: 'The reducer recorded an unresolved contradiction in canonical question state.',
    });
  });

  stateRecords.forEach((record, recordIndex) => {
    const evidenceRef = `deep-research-state.jsonl#record-${recordIndex + 1}`;
    for (const [field, source, titlePrefix, rationale] of [
      ['verificationGaps', 'verification-gap', 'Verify recorded gap', 'The iteration history explicitly records an unresolved verification gap.'],
      ['contradictions', 'contradiction-gap', 'Resolve recorded contradiction', 'The iteration history explicitly records contradictory evidence.'],
      ['missingSourceClasses', 'missing-source-class', 'Add missing source class', 'The iteration history explicitly identifies an unrepresented source class.'],
      ['alternateEvidenceMethods', 'alternate-evidence', 'Apply alternate evidence method', 'The iteration history explicitly identifies an unused evidence method.'],
      ['unansweredAdjacentQuestions', 'adjacent-question', 'Investigate adjacent question', 'The iteration history explicitly carries an unanswered adjacent question.'],
    ] as const) {
      readStringList(record[field]).forEach((text) => add({
        source,
        title: `${titlePrefix}: ${text}`,
        focus: text,
        evidenceRef,
        relevanceRationale: rationale,
      }));
    }

    if (Array.isArray(record.graphEvents)) {
      record.graphEvents.forEach((event, eventIndex) => {
        if (!isRecord(event) || normalizeText(event.relation).toUpperCase() !== 'CONTRADICTS') return;
        const sourceId = normalizeText(event.source);
        const targetId = normalizeText(event.target);
        if (!sourceId || !targetId) return;
        add({
          source: 'contradiction-gap',
          title: `Verify contradiction ${sourceId} -> ${targetId}`,
          focus: `Resolve the recorded contradiction between ${sourceId} and ${targetId} using independent evidence.`,
          evidenceRef: `${evidenceRef}:graph-event-${eventIndex + 1}`,
          relevanceRationale: 'The current coverage graph records this contradiction inside the active research topic.',
        });
      });
    }
  });

  const findings = Array.isArray(registry.keyFindings) ? registry.keyFindings : [];
  findings.slice(-3).forEach((finding, index) => {
    const text = readText(finding);
    if (!text) return;
    add({
      source: 'alternate-evidence',
      title: `Independently verify finding: ${text}`,
      focus: `Cross-check the finding "${text}" with an evidence method not used by its recorded support.`,
      evidenceRef: `findings-registry.json#key-finding-${Math.max(1, findings.length - 2 + index)}`,
      relevanceRationale: 'The direction tests an existing in-scope finding rather than widening the research topic.',
    });
  });

  return seeds;
}

// ───────────────────────────────────────────────────────────────────
// 4. SEAT PROMPTS
// ───────────────────────────────────────────────────────────────────

/** Render the exact parseable result contract for one native research Council seat. */
export function renderResearchPivotSeatPrompt(
  seat: PivotSeatMandate,
  dispatchContext: {
    readonly candidates: readonly PivotCandidate[];
    readonly previousFocus: string;
    readonly normalizedTrigger: string;
  },
): string {
  return [
    'You are one native research direction-selection Council seat. Do not dispatch sub-agents, write files, or widen the research charter.',
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

/** Derive bounded candidates, prior directions, usage, identity, and mandates from research state. */
export function buildResearchPivotPreparationInput(
  options: BuildResearchPivotInputOptions,
): ResearchPivotPreparationInput {
  if (!Number.isInteger(options.currentIteration) || options.currentIteration < 0) {
    throw new TypeError('currentIteration must be a non-negative integer.');
  }
  if (!Number.isInteger(options.maxIterations) || options.maxIterations < 1) {
    throw new TypeError('maxIterations must be a positive integer.');
  }
  const config = readJson(options.configPath);
  const legacyRegistryPath = join(dirname(options.registryPath), 'deep-research-findings-registry.json');
  const registry = readJson(existsSync(options.registryPath) ? options.registryPath : legacyRegistryPath);
  const strategy = readFileSync(options.strategyPath, 'utf8');
  const stateRecords = readJsonl(options.stateLogPath);
  const pivotEvents = readPivotEvents(options.artifactRoot);
  const lineage = isRecord(config.lineage) ? config.lineage : {};
  const sessionId = normalizeText(lineage.sessionId);
  const generation = typeof lineage.generation === 'number' || typeof lineage.generation === 'string'
    ? lineage.generation
    : 1;
  if (!sessionId) throw new TypeError('Research config lineage.sessionId is required for a pivot.');

  const latestIteration = stateRecords.filter((record) => record.type === 'iteration').at(-1);
  const strategyFocus = extractSection(strategy, '11. NEXT FOCUS');
  const previousFocus = normalizeText(strategyFocus) || normalizeText(latestIteration?.focus);
  if (!previousFocus) throw new TypeError('A current research focus is required for a pivot.');

  const topic = normalizeText(config.topic);
  if (!topic) throw new TypeError('Research config topic is required for boundary validation.');
  const nonGoals = extractListText(extractSection(strategy, '4. NON-GOALS'));
  const seeds = buildCandidateSeeds(registry, stateRecords);
  const boundaryRejections = seeds.filter((seed) => conflictsWithNonGoal(seed, nonGoals));
  const acceptedSeeds = seeds.filter((seed) => !conflictsWithNonGoal(seed, nonGoals));
  const boundaryRationale = nonGoals.length > 0
    ? `Derived from canonical state for topic "${topic}" and checked against ${nonGoals.length} explicit non-goal(s).`
    : `Derived from canonical state for topic "${topic}"; no populated non-goal excluded this direction.`;
  const candidates = uniqueCandidates(acceptedSeeds.map((seed) => candidateFromSeed(seed, boundaryRationale)));

  const completedEvents = pivotEvents.filter((event) => event.event === 'pivot_completed');
  const selectedEvents = pivotEvents.filter((event) => event.event === 'pivot_selected');
  const rejectedEvents = pivotEvents.filter((event) => event.event === 'pivot_candidate_rejected');
  const saturatedDirections = [...new Set([
    ...completedEvents.flatMap((event) => readStringList(event.saturatedDirections)),
    ...completedEvents.map((event) => normalizeText(event.previousFocus)).filter(Boolean),
    previousFocus,
  ])];

  const priorCandidates: PivotCandidate[] = [];
  const addPriorText = (value: unknown, source: string, evidenceRef: string): void => {
    const candidate = priorCandidate(readText(value), source, evidenceRef);
    if (candidate) priorCandidates.push(candidate);
  };
  addPriorText(previousFocus, 'current-focus', 'deep-research-strategy.md#next-focus');
  saturatedDirections.forEach((direction, index) => addPriorText(
    direction,
    'saturated-direction',
    `divergent/pivots#saturated-${index + 1}`,
  ));
  (Array.isArray(registry.ruledOutDirections) ? registry.ruledOutDirections : []).forEach((entry, index) => addPriorText(
    entry,
    'ruled-out-direction',
    `findings-registry.json#ruled-out-${index + 1}`,
  ));
  (Array.isArray(registry.rejectedPatterns) ? registry.rejectedPatterns : []).forEach((entry, index) => addPriorText(
    entry,
    'rejected-pattern',
    `findings-registry.json#rejected-pattern-${index + 1}`,
  ));
  selectedEvents.forEach((event, index) => {
    if (isRecord(event.selectedCandidate)) {
      priorCandidates.push(event.selectedCandidate as unknown as PivotCandidate);
    } else {
      addPriorText(event.selectedCandidate, 'selected-direction', `divergent/pivots#selected-${index + 1}`);
    }
  });
  rejectedEvents.forEach((event, index) => addPriorText(
    event.candidate,
    'adapter-rejected-direction',
    `divergent/pivots#candidate-rejected-${index + 1}`,
  ));

  const seats: readonly PivotSeatMandate[] = [
    {
      id: 'seat-001',
      mandate: 'Analytical: select the direction that closes the most consequential unanswered evidence gap while remaining inside the research charter.',
    },
    {
      id: 'seat-002',
      mandate: 'Critical: challenge candidate relevance, boundary safety, contradiction handling, and risk of re-entering saturated directions.',
    },
    {
      id: 'seat-003',
      mandate: 'Pragmatic: select the most evidence-efficient next direction that can produce material information within the remaining iterations.',
    },
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
      loopType: 'research',
      sourceIteration: options.currentIteration,
      normalizedTrigger: `research saturation: ${options.triggerReason}`,
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
