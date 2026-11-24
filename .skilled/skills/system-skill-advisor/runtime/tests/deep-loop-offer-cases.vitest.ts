// ───────────────────────────────────────────────────────────────
// MODULE: Deep-loop offer cases
// ───────────────────────────────────────────────────────────────

// The Python fallback carries its own copy of the deep-loop offer gate, so both
// gates read one fixture file. A case that fails here and passes in the Python
// suite, or the reverse, means the two copies drifted apart.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { attachTypedCommand } from '../handlers/advisor-recommend.js';
import {
  COMMAND_ASK_LEAD_WORDS,
  COMMAND_DECLINE_LEAD_WORDS,
  COUNT_WORDS,
  ITERATIVE_VERBS,
  LOOP_ARTIFACT_NOUNS,
  LOOP_NAMES,
  LOOP_RUN_SYMPTOMS,
  LOOP_WANT_LEADS,
  LOOP_WORDING,
  MODE_SUFFIXES,
  PAST_RUN_READ_VERBS,
  TRACKED_COMMANDS,
  asksForLoopRun,
  attachCommand,
  isStuckRunComplaint,
  isWritingAboutTopic,
} from '../lib/command-attach.js';
import { withholdDeepLoopDoctorWithoutRun, withholdWritingCommandsOnNoEdit } from '../lib/scorer/fusion.js';
import type { AdvisorScoredRecommendation } from '../lib/scorer/types.js';
import type { AdvisorRecommendOutput } from '../schemas/advisor-tool-schemas.js';

interface OfferCase {
  readonly id: string;
  readonly prompt: string;
  readonly asksForLoopRun: boolean;
  readonly stuckRun: boolean;
  readonly writingAbout: boolean;
  readonly typedReviewKept?: boolean;
  readonly servedReviewKept?: boolean;
  readonly typedRunsKept?: readonly string[];
  readonly doctorWithheld?: boolean;
}

const FIXTURE = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures/deep-loop-offer-cases.json');
const { cases } = JSON.parse(readFileSync(FIXTURE, 'utf8')) as { readonly cases: readonly OfferCase[] };
const PY_ADVISOR = resolve(dirname(fileURLToPath(import.meta.url)), '../scripts/skill_advisor.py');

// The native gate and the Python fallback build every pattern from their own copy
// of the vocabulary, so a word added to one copy alone still passes every case that
// never uses that word. Each copy is therefore read as a set and compared, which
// fails the moment one side gains a word the other never got. The pairs are spelled
// out rather than derived, because the two languages name the same list differently.
// A command lead list is kept in shapes, one tuple per grammar its lead words take,
// and every entry inside the block is a lead word, so the pair reads the union.
const VOCABULARY_PAIRS: readonly (readonly [string, string, readonly string[]])[] = [
  ['COUNT_WORDS', '_COUNT_WORD_LIST', COUNT_WORDS],
  ['LOOP_RUN_SYMPTOMS', '_LOOP_RUN_SYMPTOM_LIST', LOOP_RUN_SYMPTOMS],
  ['LOOP_ARTIFACT_NOUNS', '_LOOP_ARTIFACT_NOUN_LIST', LOOP_ARTIFACT_NOUNS],
  ['PAST_RUN_READ_VERBS', '_PAST_RUN_READ_VERB_LIST', PAST_RUN_READ_VERBS],
  ['ITERATIVE_VERBS', '_ITERATIVE_VERB_LIST', ITERATIVE_VERBS],
  ['LOOP_WORDING', '_LOOP_WORDING_LIST', LOOP_WORDING],
  ['LOOP_NAMES', '_LOOP_NAME_LIST', LOOP_NAMES],
  ['LOOP_WANT_LEADS', '_LOOP_WANT_LEAD_LIST', LOOP_WANT_LEADS],
  ['MODE_SUFFIXES', '_MODE_SUFFIX_LIST', MODE_SUFFIXES],
  ['COMMAND_DECLINE_LEAD_WORDS', '_COMMAND_DECLINE_LEAD_LIST', COMMAND_DECLINE_LEAD_WORDS],
  ['COMMAND_ASK_LEAD_WORDS', '_COMMAND_ASK_LEAD_LIST', COMMAND_ASK_LEAD_WORDS],
];

// A word counts only where it stands alone, so `stall` is not satisfied by `stalls`
// and `check` is not satisfied by `checking`. The prompt is read case-insensitively
// because a reader may open a sentence with the word.
function usesWord(prompt: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(prompt);
}

// Each tuple holds one quoted entry per line, so a literal regex reads the block
// back without importing the Python module. An absent tuple answers undefined so a
// renamed or deleted list fails the parity test instead of comparing as empty.
function pythonTupleEntries(source: string, tupleName: string): readonly string[] | undefined {
  const block = new RegExp(`^${tupleName} = \\(([\\s\\S]*?)^\\)$`, 'm').exec(source);
  if (block === null) return undefined;
  return [...block[1].matchAll(/"([^"\n]*)"|'([^'\n]*)'/g)].map((match) => match[1] ?? match[2]);
}

function asSet(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort();
}

// A route that picks the review mode alone, as the hub's router returns for a
// prompt that types the review command.
const REVIEW_ROUTE = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'review' }] };
const typedCases = cases.filter((entry) => entry.typedReviewKept !== undefined);
const multiTypedCases = cases.filter((entry) => entry.typedRunsKept !== undefined);
const LOOP_COMMANDS = { review: '/deep:review', research: '/deep:research' } as const;
const doctorCases = cases.filter((entry) => entry.doctorWithheld !== undefined);

// The served head as the handler builds it: the deep-loop hub on top, carrying
// whatever the route's attach named, before the typed-command pass runs.
function servedOutput(command: string | undefined): AdvisorRecommendOutput {
  const tracked = command === undefined ? undefined : TRACKED_COMMANDS[command];
  return {
    workspaceRoot: '/workspace',
    effectiveThresholds: { confidenceThreshold: 0.5, uncertaintyThreshold: 0.2, confidenceOnly: false },
    recommendations: [{
      skillId: 'system-deep-loop',
      score: 0.9,
      confidence: 0.95,
      uncertainty: 0.05,
      dominantLane: 'explicit_author',
      ...(command !== undefined && tracked !== undefined
        ? { command, policy: tracked.policy, ownerSkillId: tracked.ownerSkillId }
        : {}),
    }],
    ambiguous: false,
    freshness: 'live',
    trustState: {
      state: 'live',
      reason: null,
      generation: 1,
      checkedAt: '2026-11-13T00:00:00.000Z',
      lastLiveAt: '2026-11-13T00:00:00.000Z',
    },
    generatedAt: '2026-11-13T00:00:00.000Z',
    cache: { hit: false, sourceSignaturePresent: true },
  };
}

describe('deep-loop offer cases shared with the Python fallback', () => {
  it('has cases on both sides of the gate', () => {
    expect(cases.some((entry) => entry.asksForLoopRun)).toBe(true);
    expect(cases.some((entry) => !entry.asksForLoopRun)).toBe(true);
  });

  it.each(cases.map((entry) => [entry.id, entry] as const))('%s', (_id, entry) => {
    expect(asksForLoopRun(entry.prompt), 'asks for a loop run').toBe(entry.asksForLoopRun);
    expect(isStuckRunComplaint(entry.prompt), 'stuck run').toBe(entry.stuckRun);
    expect(isWritingAboutTopic(entry.prompt), 'writing about the loop').toBe(entry.writingAbout);
  });

  // The gate column is the attach layer alone, before the typed pass, so it pins
  // what the route's own reading of the prompt keeps.
  it.each(typedCases.map((entry) => [entry.id, entry] as const))('typed: %s', (_id, entry) => {
    expect(attachCommand('system-deep-loop', REVIEW_ROUTE, entry.prompt) === '/deep:review').toBe(entry.typedReviewKept);
  });

  // The Python gate is the fallback's served layer, so the served column pins the
  // native head after the typed pass to the same answer. The gate column above
  // and this one differ where a typed command meets a stuck-run complaint.
  it('marks every typed case with its served answer', () => {
    expect(typedCases.length).toBeGreaterThan(0);
    expect(typedCases.every((entry) => entry.servedReviewKept !== undefined)).toBe(true);
  });

  it.each(typedCases.map((entry) => [entry.id, entry] as const))('served: %s', (_id, entry) => {
    const attached = attachCommand('system-deep-loop', REVIEW_ROUTE, entry.prompt);
    const served = attachTypedCommand(servedOutput(attached), entry.prompt);
    expect(served.recommendations[0].command === '/deep:review').toBe(entry.servedReviewKept);
  });

  // A prompt that types more than one command keeps each typed loop on the
  // route of that loop's mode, so a longer typed command never hides a shorter
  // one. The Python gate keeps the same run rows.
  it.each(multiTypedCases.map((entry) => [entry.id, entry] as const))('typed runs: %s', (_id, entry) => {
    const kept = Object.entries(LOOP_COMMANDS)
      .filter(([workflowMode, command]) => attachCommand(
        'system-deep-loop',
        { action: 'route', selectionKind: 'single', targets: [{ workflowMode }] },
        entry.prompt,
      ) === command)
      .map(([, command]) => command)
      .sort();
    expect(kept).toEqual([...(entry.typedRunsKept ?? [])].sort());
  });

  // A stuck run is answered by the doctor unless the reader refused any run or
  // fix; the Python gate drops its doctor row on the same cases.
  it.each(doctorCases.map((entry) => [entry.id, entry] as const))('doctor: %s', (_id, entry) => {
    expect(attachCommand('system-deep-loop', REVIEW_ROUTE, entry.prompt) === '/doctor:deep-loop').toBe(!entry.doctorWithheld);
  });

  // The scorer withholds the doctor row in two steps, the refusal and the
  // no-edit wording, so the fused row has to agree with the hub route and with
  // the Python gate on the same cases.
  const DOCTOR_ROW = {
    skill: 'command-doctor-deep-loop',
    kind: 'command',
    passes_threshold: true,
  } as unknown as AdvisorScoredRecommendation;
  it.each(doctorCases.map((entry) => [entry.id, entry] as const))('fused doctor row: %s', (_id, entry) => {
    const lower = entry.prompt.toLowerCase();
    const [row] = withholdWritingCommandsOnNoEdit(withholdDeepLoopDoctorWithoutRun([DOCTOR_ROW], lower), lower);
    expect(row.passes_threshold).toBe(!entry.doctorWithheld);
  });

  // The Python copy spells this vocabulary inline in its patterns, so a word
  // added to one side and not the other passes every case that never uses it.
  // Each entry therefore needs a case that asks for a run through it, and the
  // Python suite reads the same cases.
  it.each([...LOOP_WORDING, ...LOOP_NAMES, ...LOOP_WANT_LEADS])('has a run case that uses "%s"', (phrase) => {
    const used = cases.some((entry) => entry.asksForLoopRun
      && entry.prompt.toLowerCase().replace(/[\u2018\u2019]/g, "'").includes(phrase));
    expect(used).toBe(true);
  });

  // A count word and a loop verb are read from a list too, so the same drift hides
  // there, and each one needs a case that asks for a run through it.
  it.each([...COUNT_WORDS, ...ITERATIVE_VERBS])('has a run case that uses the word "%s"', (word) => {
    const used = cases.some((entry) => entry.asksForLoopRun && usesWord(entry.prompt, word));
    expect(used).toBe(true);
  });

  // A symptom word names the fault the doctor answers, so its coverage case is a
  // stuck-run complaint rather than a run ask.
  it.each(LOOP_RUN_SYMPTOMS)('has a stuck-run case that uses the word "%s"', (word) => {
    const used = cases.some((entry) => entry.stuckRun && usesWord(entry.prompt, word));
    expect(used).toBe(true);
  });
});

describe('deep-loop vocabulary shared with the Python fallback', () => {
  const python = readFileSync(PY_ADVISOR, 'utf8');

  it.each(VOCABULARY_PAIRS.map((pair) => pair as const))('%s matches %s', (nativeName, pythonName, words) => {
    const copied = pythonTupleEntries(python, pythonName);
    expect(copied, `${pythonName} must hold the ${nativeName} vocabulary`).toBeDefined();
    expect(asSet(copied ?? [])).toEqual(asSet(words));
  });
});
