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
  COMMAND_AS_DOCUMENT,
  COMMAND_ASK_LEAD_WORDS,
  COMMAND_ASK_TARGET,
  COMMAND_BARE_ASK_LEAD,
  COMMAND_CLAUSE_END,
  COMMAND_DECLINE_LEAD_WORDS,
  COMMAND_GAP_WORDS,
  COMMAND_NOT_WORD,
  COMMAND_OR_LIST,
  COMMAND_USE_VERB,
  COUNT_AS_SUBJECT,
  COUNT_NOUN,
  COUNT_WORDS,
  DEFECT_CHECK_NOUNS,
  DEFECT_CHECK_VERBS,
  HYPHEN_COUNT,
  HYPHEN_COUNT_MEASURES_LOOP,
  ITERATIONS_OF_SUBJECT,
  ITERATION_COUNT,
  ITERATIVE_ACTIVITY,
  ITERATIVE_ASK,
  ITERATIVE_VERBS,
  LEAD_WINDOW,
  LOOP_ARTIFACT_NOUNS,
  LOOP_ASK_REFUSED_AFTER,
  LOOP_CONTINUE_VERB,
  LOOP_COUNT,
  LOOP_COUNT_LEAD,
  LOOP_EFFORT_CHANGE_VERBS,
  LOOP_EFFORT_COPULA,
  LOOP_EFFORT_INTENSIFIER,
  LOOP_EFFORT_LEADS,
  LOOP_EFFORT_WORDS,
  LOOP_NAMES,
  LOOP_OBJECT_GAP,
  LOOP_QUESTION_AUXILIARIES,
  LOOP_RUN_BY_PRONOUN,
  LOOP_RUN_REQUESTED,
  LOOP_RUN_SUBJECT,
  LOOP_RUN_SYMPTOMS,
  LOOP_SUBJECT,
  LOOP_WANT_LEADS,
  LOOP_WORDING,
  MODE_COMMANDS,
  MODE_CUES,
  MODE_CUE_WORDS,
  MODE_SUFFIXES,
  MULTI_PASS,
  NAMED_LOOP_MODE,
  NO_EDIT_REQUEST,
  PASS_GAP,
  PASS_NOUN,
  PAST_RUN_OUTPUT,
  PAST_RUN_READ_VERBS,
  READ_ONLY_LOOP_MODES,
  RERUN_MARKER,
  RERUN_PRONOUNS,
  RUN_ASK_REFUSAL_CANCEL_LEADS,
  RUN_ASK_REFUSAL_GAP,
  RUN_ASK_REFUSAL_LEADS,
  RUN_ASK_REFUSAL_VERBS,
  RUN_COMMAND_WITHDRAWN,
  RUN_CONTINUED,
  RUN_REFUSED,
  RUN_REPORTED_AFTER,
  TRACKED_COMMANDS,
  WRITING_ABOUT_TOPIC,
  asksForLoopRun,
  attachCommand,
  isNoEditRequest,
  isPastRunRead,
  isStuckRunComplaint,
  isWritingAboutTopic,
} from '../lib/command-attach.js';
import { ADVISOR_PROMPT_MAX_CHARS } from '../schemas/advisor-tool-schemas.js';
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
  readonly readOnlyRunKept?: 'review' | 'research';
  readonly servedRun?: 'review' | 'research' | 'none';
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
  ['LOOP_EFFORT_LEADS', '_LOOP_EFFORT_LEAD_LIST', LOOP_EFFORT_LEADS],
  ['LOOP_EFFORT_WORDS', '_LOOP_EFFORT_WORD_LIST', LOOP_EFFORT_WORDS],
  ['LOOP_EFFORT_CHANGE_VERBS', '_LOOP_EFFORT_CHANGE_VERB_LIST', LOOP_EFFORT_CHANGE_VERBS],
  ['LOOP_QUESTION_AUXILIARIES', '_LOOP_QUESTION_AUXILIARY_LIST', LOOP_QUESTION_AUXILIARIES],
  ['PAST_RUN_READ_VERBS', '_PAST_RUN_READ_VERB_LIST', PAST_RUN_READ_VERBS],
  ['RERUN_PRONOUNS', '_RERUN_PRONOUN_LIST', RERUN_PRONOUNS],
  ['ITERATIVE_VERBS', '_ITERATIVE_VERB_LIST', ITERATIVE_VERBS],
  ['LOOP_WORDING', '_LOOP_WORDING_LIST', LOOP_WORDING],
  ['LOOP_NAMES', '_LOOP_NAME_LIST', LOOP_NAMES],
  ['LOOP_WANT_LEADS', '_LOOP_WANT_LEAD_LIST', LOOP_WANT_LEADS],
  ['MODE_CUE_WORDS.research', '_RESEARCH_MODE_CUE_LIST', MODE_CUE_WORDS.research],
  ['MODE_CUE_WORDS.review', '_REVIEW_MODE_CUE_LIST', MODE_CUE_WORDS.review],
  ['DEFECT_CHECK_VERBS', '_DEFECT_CHECK_VERB_LIST', DEFECT_CHECK_VERBS],
  ['DEFECT_CHECK_NOUNS', '_DEFECT_CHECK_NOUN_LIST', DEFECT_CHECK_NOUNS],
  ['MODE_SUFFIXES', '_MODE_SUFFIX_LIST', MODE_SUFFIXES],
  ['READ_ONLY_LOOP_MODES', '_READ_ONLY_LOOP_MODE_LIST', READ_ONLY_LOOP_MODES],
  ['COMMAND_DECLINE_LEAD_WORDS', '_COMMAND_DECLINE_LEAD_LIST', COMMAND_DECLINE_LEAD_WORDS],
  ['COMMAND_ASK_LEAD_WORDS', '_COMMAND_ASK_LEAD_LIST', COMMAND_ASK_LEAD_WORDS],
  ['RUN_ASK_REFUSAL_LEADS', '_RUN_ASK_REFUSAL_LEAD_LIST', RUN_ASK_REFUSAL_LEADS],
  ['RUN_ASK_REFUSAL_CANCEL_LEADS', '_RUN_ASK_REFUSAL_CANCEL_LEAD_LIST', RUN_ASK_REFUSAL_CANCEL_LEADS],
  ['RUN_ASK_REFUSAL_VERBS', '_RUN_ASK_REFUSAL_VERB_LIST', RUN_ASK_REFUSAL_VERBS],
];

// Two numbers are spelled on both sides too: the window a lead is read inside
// and the prompt head the schema and the fallback both cut at. Neither has a
// pattern to compare, so each is read back from the Python source and compared
// with the native value.
const NUMERIC_PAIRS: readonly (readonly [string, number])[] = [
  ['_LEAD_WINDOW', LEAD_WINDOW],
  ['ADVISOR_PROMPT_MAX_CHARS', ADVISOR_PROMPT_MAX_CHARS],
];

function escapeWord(word: string): string {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A word counts only where it stands alone, so `stall` is not satisfied by `stalls`
// and `check` is not satisfied by `checking`. The prompt is read case-insensitively
// because a reader may open a sentence with the word.
function usesWord(prompt: string, word: string): boolean {
  return new RegExp(`\\b${escapeWord(word)}\\b`, 'i').test(prompt);
}

// Every loop name and wording, as the gate spells it, so a case can be read for
// the noun its loop name takes. The possessive before the noun is the one the
// gate allows, as in "the deep review's findings".
const LOOP_NAME_SOURCE = [...LOOP_NAMES, ...LOOP_WORDING].map(escapeWord).join('|');

function followsLoopName(prompt: string, word: string): boolean {
  const lower = prompt.toLowerCase().replace(/[\u2018\u2019]/g, "'");
  return new RegExp(`(?:${LOOP_NAME_SOURCE})(?:'s)? ${escapeWord(word)}\\b`).test(lower);
}

// The Python mirror spells these numbers as plain literals, so the source text is
// read rather than parsed. A name that moves or disappears answers undefined and
// fails the parity test instead of comparing as zero.
function pythonInteger(source: string, name: string): number | undefined {
  const assignment = new RegExp(`^${name} = (\\d[\\d_]*)`, 'm').exec(source);
  return assignment === null ? undefined : Number(assignment[1].replace(/_/g, ''));
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
const readOnlyCases = cases.filter((entry) => entry.readOnlyRunKept !== undefined);
const servedCases = cases.filter((entry) => entry.servedRun !== undefined);

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

  // A no-edit clause rules out a change to the code, and a loop mode only reads
  // the code and reports on it, so the run the prompt asks for is still offered.
  // The Python gate keeps the same run row on these cases.
  it.each(readOnlyCases.map((entry) => [entry.id, entry] as const))('read-only run: %s', (_id, entry) => {
    expect(isNoEditRequest(entry.prompt), 'rules out a change').toBe(true);
    const mode = entry.readOnlyRunKept ?? 'review';
    const route = { action: 'route', selectionKind: 'single', targets: [{ workflowMode: mode }] };
    expect(attachCommand('system-deep-loop', route, entry.prompt), entry.prompt).toBe(LOOP_COMMANDS[mode]);
  });

  // A loop ask that names its mode as often as it names the loop serves that
  // mode's command, which is the deferred route's whole job when the hub's router
  // finds no phrase to score. A prompt that names no single mode leaves the
  // choice with the reader, so the route offers no command rather than guessing
  // one the reader never asked for. The column spells that absence "none", and
  // the Python gate answers it with no run row at all.
  it.each(servedCases.map((entry) => [entry.id, entry] as const))('served run: %s', (_id, entry) => {
    const served = entry.servedRun === undefined || entry.servedRun === 'none'
      ? undefined
      : LOOP_COMMANDS[entry.servedRun];
    expect(attachCommand('system-deep-loop', { action: 'defer' }, entry.prompt), entry.prompt).toBe(served);
  });

  // Two readings share one value when the column is null: an ask that serves no
  // run and an ask that serves both. The column is therefore read for an explicit
  // answer, so no case can hide its run count behind a missing value.
  it('answers the served column explicitly', () => {
    const answered = cases.filter((entry) => 'servedRun' in entry);
    expect(answered.length).toBeGreaterThan(0);
    for (const entry of answered) expect(['review', 'research', 'none'], entry.id).toContain(entry.servedRun);
  });

  // A plural loop name is an ask for the run as well as for the loop, so the
  // command it serves is pinned as well: a row that checks only the predicate
  // cannot pass as covered.
  it('pins a served run for the eight plural asks', () => {
    const servedRows = cases.filter((entry) => entry.id.endsWith('-served'));
    expect(servedRows).toHaveLength(8);
    for (const row of servedRows) {
      expect(row.servedRun, row.id).not.toBeUndefined();
      expect(cases.some((entry) => entry.prompt === row.prompt && entry.asksForLoopRun), row.id).toBe(true);
    }
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

  // An artifact noun behind a loop name names what the loop produced, as in "open
  // the review loop config", so its coverage case reads that way and asks for no
  // run. A noun added to one copy alone otherwise passes every case that never
  // puts it behind a loop name.
  it.each(LOOP_ARTIFACT_NOUNS)('has a no-run case where a loop name is followed by "%s"', (noun) => {
    const used = cases.some((entry) => !entry.asksForLoopRun && followsLoopName(entry.prompt, noun));
    expect(used).toBe(true);
  });

  // An effort word names what a complaint is about, and an effort lead is the
  // verb whose object the loop name is, so each carries a case that asks for no
  // run. A word added to one copy alone otherwise passes every case that never
  // uses it.
  it.each(LOOP_EFFORT_WORDS)('has a no-run case that carries the effort word "%s"', (word) => {
    const used = cases.some((entry) => !entry.asksForLoopRun && usesWord(entry.prompt, word));
    expect(used).toBe(true);
  });

  it.each(LOOP_EFFORT_LEADS)('has a no-run case where "%s" leads the loop name', (phrase) => {
    const used = cases.some((entry) => !entry.asksForLoopRun && entry.prompt.toLowerCase().includes(phrase));
    expect(used).toBe(true);
  });

  // A change verb leads the loop name the same way and takes an effort word as
  // its complement, as in "make the deep review faster", so each verb needs a
  // case that asks for no run in that shape.
  it.each(LOOP_EFFORT_CHANGE_VERBS)('has a no-run case where "%s" changes the loop', (phrase) => {
    const used = cases.some((entry) => !entry.asksForLoopRun
      && entry.prompt.toLowerCase().startsWith(`${phrase} `));
    expect(used).toBe(true);
  });

  // A past-run read verb wants a finished run's output, as in "recap the last deep
  // research run", so its coverage case is a past-run read that asks for no new
  // run, and the Python suite reads the same cases.
  it.each(PAST_RUN_READ_VERBS)('has a past-run case that uses the verb "%s"', (verb) => {
    const used = cases.some((entry) => !entry.asksForLoopRun
      && isPastRunRead(entry.prompt) && usesWord(entry.prompt, verb));
    expect(used).toBe(true);
  });

  // A pronoun rerun repeats the deep run the prompt names and asks for that run,
  // so each pronoun needs a case that reads as the ask, and the Python copy reads
  // the same cases. The shape is spelled here rather than imported, so a pronoun
  // that stops being read as a rerun fails this guard as well as the case.
  it.each(RERUN_PRONOUNS)('has a pronoun-rerun case that uses "%s"', (pronoun) => {
    const rerunShape = new RegExp(
      `\\b(?:rerun|re-run) ${escapeWord(pronoun)}\\b`
      + `|\\b(?:run|do|start|launch|kick off) ${escapeWord(pronoun)} (?:again|once again|once more)\\b`,
      'i',
    );
    const used = cases.some((entry) => entry.asksForLoopRun
      && !entry.stuckRun && rerunShape.test(entry.prompt));
    expect(used, `no pronoun-rerun case uses "${pronoun}"`).toBe(true);
  });

  // The gate's four exceptions are grammar as much as vocabulary: a refusal lead
  // stops at a conjunction, a question lead masks the loop its words name, a
  // past-run read wants a finished run's output, and a stuck symptom asks for a
  // diagnosis instead of a run. Each shape below is carried by a shared case, so
  // a grammar edit on one side of the gate fails the other side's suite as well
  // as its own. Every shape an exception's grammar takes is listed, because a
  // case that drifts onto another reading still asks for no run and would hide
  // the loss of the shape it was added for.
  const EXCEPTION_GRAMMAR_CASES: Readonly<Record<string, readonly string[]>> = {
    'refusal lead before a conjunction': [
      'refusal-gap-but',
      'refusal-gap-then',
      'refusal-gap-or',
      'refusal-verb-refused-to',
    ],
    'question lead': [
      'question-describe-lead',
      'question-when-lead',
      'question-explain-what-lead',
      'question-didnt-auxiliary',
    ],
    'past-run read': [
      'past-output-noun',
      'past-dated-of',
      'past-previous-results',
    ],
    'stuck symptom': [
      'stuck-symptom-spinning-up',
      'stuck-symptom-keeps-looping',
      'stuck-symptom-hasnt-moved',
      'stuck-symptom-no-progress',
      'stuck-symptom-isnt-converging',
    ],
  };

  it.each(Object.entries(EXCEPTION_GRAMMAR_CASES))('carries a case for a %s', (_shape, ids) => {
    for (const id of ids) expect(cases.some((entry) => entry.id === id), id).toBe(true);
  });

  // A negation the prompt puts directly before a refusal word cancels it, so the
  // loop phrase after it asks for the run. The shape is spelled here rather than
  // imported, so a word that stops being cancellable fails this guard as well as
  // the case that carries it.
  it.each(RUN_ASK_REFUSAL_VERBS)('has a case where a negation cancels the refusal "%s"', (verb) => {
    const negations = RUN_ASK_REFUSAL_CANCEL_LEADS.map(escapeWord).join('|');
    const shape = new RegExp(`\\b(?:${negations})\\s+(?:to\\s+)?${escapeWord(verb)}\\b`, 'i');
    const used = cases.some((entry) => entry.asksForLoopRun && shape.test(entry.prompt));
    expect(used, `no negated-refusal case cancels "${verb}"`).toBe(true);
  });

  // The two lists are views of the refusal leads, because a cancellation is only
  // meaningful on a word the gate already reads as a refusal.
  it('holds the cancellation vocabulary inside the refusal leads', () => {
    const unknown = [...RUN_ASK_REFUSAL_CANCEL_LEADS, ...RUN_ASK_REFUSAL_VERBS]
      .filter((word) => !RUN_ASK_REFUSAL_LEADS.includes(word));
    expect(unknown, 'every cancellation word is a refusal lead').toEqual([]);
  });
});

// A pattern is the grammar no word list holds: the bound between a verb and its
// object, the count a lookbehind reads, the anchor a lead is matched against. The
// native gate and the fallback spell each of those in their own source, so a bound
// changed on one side alone leaves both suites green on every case that never
// exercises it. Each pair below is therefore read back out of the fallback's source
// and compared with the native pattern.
//
// The fallback spells a long pattern over several source lines, because Python caps
// how long a line may be, and that break is typing rather than grammar: the reader
// joins the raw literals of one assignment before the comparison. A pattern the
// fallback builds by concatenating a variable is not spelled anywhere, so the reader
// answers undefined rather than a shortened pattern, and that pair is carried by one
// of the tables below instead of slipping past this one as a prefix.
const PATTERN_PAIRS: readonly (readonly [string, RegExp])[] = [
  ['_NAMED_LOOP_MODE_RE', NAMED_LOOP_MODE],
  ['_RUN_CONTINUED_RE', RUN_CONTINUED],
  ['_LOOP_DIGIT_COUNT_RE', ITERATION_COUNT],
  ['_LOOP_RUN_BY_PRONOUN_RE', LOOP_RUN_BY_PRONOUN],
  ['_LOOP_RUN_SUBJECT_RE', LOOP_RUN_SUBJECT],
  ['_LOOP_RUN_REQUESTED_RE', LOOP_RUN_REQUESTED],
  ['_PAST_RUN_OUTPUT_RE', PAST_RUN_OUTPUT],
  ['_WRITING_ABOUT_TOPIC_RE', WRITING_ABOUT_TOPIC],
  ['_RUN_REFUSED_RE', RUN_REFUSED],
  ['_NO_EDIT_RE', NO_EDIT_REQUEST],
  ['_CMD_CLAUSE_SPLIT_RE', COMMAND_CLAUSE_END],
  ['_CMD_RUN_WITHDRAWN_RE', RUN_COMMAND_WITHDRAWN],
];

// The two engines reach a position rather than spell it: Python matches from an
// index and writes `\Z` for the end of the text, where the native copy writes `^`
// and `$`. That token is the only part of these pairs the engines force apart, so it
// is folded to one spelling and the rest of each pair is compared as written. The
// fold is narrow on purpose: it can hide a change to the anchor and nothing else.
const ANCHORED_PATTERN_PAIRS: readonly (readonly [string, RegExp])[] = [
  ['_RUN_REPORTED_AFTER_RE', RUN_REPORTED_AFTER],
  ['_HYPHEN_COUNT_RE', HYPHEN_COUNT],
  ['_HYPHEN_COUNT_MEASURES_LOOP_RE', HYPHEN_COUNT_MEASURES_LOOP],
  ['_COUNT_NOUN_RE', COUNT_NOUN],
  ['_ITERATIONS_OF_SUBJECT_RE', ITERATIONS_OF_SUBJECT],
  ['_COUNT_AS_SUBJECT_RE', COUNT_AS_SUBJECT],
  ['_LOOP_ASK_REFUSED_AFTER_RE', LOOP_ASK_REFUSED_AFTER],
  ['_CMD_AS_DOCUMENT_RE', COMMAND_AS_DOCUMENT],
];

// A fragment is pattern source rather than a compiled pattern: both gates paste it
// into the patterns above, so its bound sits inside a string that no compiled object
// exposes.
const FRAGMENT_PAIRS: readonly (readonly [string, string])[] = [
  ['_LOOP_PASS_GAP', PASS_GAP],
  ['_LOOP_PASS_NOUN', PASS_NOUN],
  ['_ITERATIVE_ACTIVITY', ITERATIVE_ACTIVITY],
  ['_LOOP_CONTINUE_VERB', LOOP_CONTINUE_VERB],
  ['_LOOP_OBJECT_GAP', LOOP_OBJECT_GAP],
  ['_LOOP_EFFORT_COPULA', LOOP_EFFORT_COPULA],
  ['_LOOP_EFFORT_INTENSIFIER', LOOP_EFFORT_INTENSIFIER],
  ['_RERUN_MARKER', RERUN_MARKER],
  ['_LOOP_SUBJECT', LOOP_SUBJECT],
  ['_LOOP_USE_VERB', COMMAND_USE_VERB],
  ['_CMD_USE_VERB', COMMAND_USE_VERB],
  ['_CMD_GAP_WORDS', COMMAND_GAP_WORDS],
  ['_CMD_NOT_WORD', COMMAND_NOT_WORD],
  ['_CMD_OR_LIST', COMMAND_OR_LIST],
  ['_CMD_ASK_TARGET', COMMAND_ASK_TARGET],
  ['_CMD_BARE_ASK_LEAD', COMMAND_BARE_ASK_LEAD],
];

// Four of the fragments are built in code on both sides, so neither source holds the
// whole pattern. The count each one pastes in is still a number both copies have to
// agree on, so it is looked for in the native source and in the fallback's own
// assignment: a bound widened on one side fails here even where no case reaches it.
const QUANTIFIER_PAIRS: readonly (readonly [string, string, string])[] = [
  ['_ITERATIVE_ASK', ITERATIVE_ASK.source, '{0,6}?'],
  ['_LOOP_COUNT', LOOP_COUNT.source, '{0,2}?'],
  ['_LOOP_COUNT_LEAD', LOOP_COUNT_LEAD, '{2,}'],
  ['_RUN_ASK_REFUSAL_GAP', RUN_ASK_REFUSAL_GAP, '{0,2}'],
];

// Everything else is built in code on both sides, or is grammar one engine spells
// and the other expresses some other way. Each entry says why it cannot be compared,
// and the last test in this block reads the fallback's gate for compiled names, so a
// pattern that appears in none of these tables fails rather than going uncovered.
const PATTERNS_NOT_COMPARED: readonly (readonly [string, string])[] = [
  ['_LOOP_PASSES_ASK_RE', 'one alternation of the iterative ask, the multi-pass grammar and the count, each read in its own row'],
  ['_LOOP_REQUEST_RE', 'one alternation of the object gap, the use, continue and want forms and the three ask patterns, each read in its own row'],
  ['_LOOP_EDIT_LEAD_RE', 'the edit verbs pasted in front of the object gap, which is compared whole in its own row'],
  ['_LOOP_EFFORT_LEAD_RE', 'the effort verbs, compared as a vocabulary pair, pasted in front of the object gap, compared in its own row'],
  ['_LOOP_EFFORT_CHANGE_LEAD_RE', 'the change verbs, compared as a vocabulary pair, pasted in front of the object gap, compared in its own row'],
  ['_LOOP_ARTIFACT_AFTER_RE', 'the artifact nouns, compared as a vocabulary pair, pasted in behind their possessive'],
  ['_LOOP_EFFORT_AFTER_RE', 'the copula, the intensifier and the effort word pasted together, the first two compared in their own rows'],
  ['_LOOP_EFFORT_COMPLEMENT_AFTER_RE', 'the intensifier and the effort word pasted together, the intensifier compared in its own row'],
  ['_LOOP_RUN_SYMPTOM_RE', 'the negation is one alternation of lookbehinds natively and one fixed-width lookbehind per word in Python'],
  ['_PRONOUN_RERUN_ASK_RE', 'the rerun pronouns pasted between the verbs, compared as a vocabulary pair'],
  ['_PAST_RUN_READ_VERB_RE', 'the read verbs pasted into one alternation, compared as a vocabulary pair'],
  ['_LOOP_QUESTION_RE', 'the question auxiliaries and the loop subject pasted together, both compared in their own rows'],
  ['_LOOP_HOW_TO_QUESTION_RE', 'the question auxiliaries and the loop subject pasted together, both compared in their own rows'],
  ['_COUNTED_RUN_ASK_RE', 'a use verb pasted in front of the count grammar, which is read in its own row'],
  ['_EXPLICIT_RUN_ASK_RE', 'one alternation of the three run-ask patterns it joins, each read in its own row'],
  ['_TYPED_DEEP_COMMAND_RE', 'the mode suffixes pasted into a command shape; the native gate reads its command tables rather than one pattern'],
  ['_RUN_ASK_NEGATED_RE', 'the refusal vocabulary pasted into a lead alternation on both sides, compared as a vocabulary pair'],
  ['_RUN_ASK_REFUSAL_CANCELLED_RE', 'the refusal vocabulary pasted into a lead alternation on both sides, compared as a vocabulary pair'],
  ['_CMD_ASKED_BY_PRONOUN_RE', 'the shared command use verb pasted into a clause shape, compared in its own row'],
  ['_CMD_DECLINED_BY_PRONOUN_RE', 'the shared command use verb pasted into a clause shape, compared in its own row'],
  ['_SENTENCE_END_RE', 'the native gate writes this class inline rather than naming it, so there is no pattern to read back'],
  ['_QUESTION_MARK_RE', 'the native gate reads the question mark inline rather than naming it, so there is no pattern to read back'],
  ['_TYPED_DOCTOR_RE', 'the native gate reads the doctor from its command table rather than from one pattern'],
  ['_DEFECT_CHECK_PATTERN', 'the check verbs and nouns pasted together, both compared as vocabulary pairs'],
  ['_MODE_CUE_PATTERNS', 'one cue pattern per mode, built from the cue word lists, compared as vocabulary pairs'],
  ['_LOOP_MULTI_PASS', 'the pass gap and the pass noun pasted together, the gap compared in its own row'],
  ['_LOOP_COUNT_WORDS', 'the count words pasted into one alternation, compared as a vocabulary pair'],
  ['_LOOP_COUNT_BACK_POINTER', 'one lookbehind per back-pointer word, spelled as a comprehension rather than a pattern'],
  ['_ITERATIVE_VERB', 'the iterative verbs pasted into one alternation, compared as a vocabulary pair'],
  ['_LOOP_NAME', 'the loop names pasted into one alternation, compared as a vocabulary pair'],
  ['_LOOP_WANT_LEAD', 'the want leads pasted into one alternation, compared as a vocabulary pair'],
  ['_LOOP_EFFORT_WORD', 'the effort words pasted into one alternation, compared as a vocabulary pair'],
  ['_RERUN_PRONOUN', 'the rerun pronouns pasted into one alternation, compared as a vocabulary pair'],
  ['_LOOP_QUESTION_AUX', 'the question auxiliaries pasted into one alternation, compared as a vocabulary pair'],
  ['_CMD_DECLINE_LEADS', 'the decline leads, built from the two lead shapes whose words are compared as a vocabulary pair'],
  ['_CMD_DECLINE_VERB_TAIL', 'the command use verb and the command gap pasted behind the lead, both compared in their own rows'],
  ['_CMD_DECLINE_WORK_TAIL', 'the command use verb pasted into the work gap, compared in its own row'],
  ['_CMD_ASK_LEADS', 'the ask leads, built from the two lead shapes whose words are compared as a vocabulary pair'],
];

// The statement a fallback name is assigned, from its own line to the line that
// closes the assignment. A short assignment ends with its own line; a long one opens
// a bracket there and closes it on a line of its own.
function pythonAssignment(source: string, name: string): string | undefined {
  const start = new RegExp(`^${name} = `, 'm').exec(source);
  if (start === null) return undefined;
  const rest = source.slice(start.index);
  const lineEnd = rest.indexOf('\n');
  const line = lineEnd === -1 ? rest : rest.slice(0, lineEnd);
  if (!line.trimEnd().endsWith('(')) return line;
  const close = /^\)$/m.exec(rest);
  return close === null ? line : rest.slice(0, close.index + 1);
}

// The pattern a fallback name is given, with its raw literals joined: a raw literal's
// value is its own source text, so the join is the pattern an engine is handed. A
// name that moves, or that concatenates a variable, answers undefined, which fails
// the pair it belongs to instead of comparing as a shorter pattern.
function pythonPatternSource(source: string, name: string): string | undefined {
  const assignment = pythonAssignment(source, name);
  if (assignment === undefined) return undefined;
  const text = assignment.replace(/#[^\n]*/g, '');
  const literals = [...text.matchAll(/r?"((?:\\[\s\S]|[^"\\])*)"|r?'((?:\\[\s\S]|[^'\\])*)'/g)];
  if (literals.length === 0) return undefined;
  const residue = literals.reduce((left, match) => left.replace(match[0], ''), text)
    .replace(new RegExp(`^${name} = `), '')
    .replace(/re\.compile/g, '')
    .replace(/[+()\s]/g, '');
  return residue === '' ? literals.map((match) => match[1] ?? match[2]).join('') : undefined;
}

function unanchored(source: string): string {
  return source.replace(/^\^/, '').replace(/\\Z/g, '$');
}

describe('deep-loop patterns shared with the Python fallback', () => {
  const python = readFileSync(PY_ADVISOR, 'utf8');

  it.each(PATTERN_PAIRS.map((pair) => pair as const))('%s spells the native pattern', (pythonName, pattern) => {
    const copied = pythonPatternSource(python, pythonName);
    expect(copied, `${pythonName} must spell the native pattern`).toBeDefined();
    expect(copied).toBe(pattern.source);
  });

  it.each(ANCHORED_PATTERN_PAIRS.map((pair) => pair as const))('%s spells the native pattern up to its anchor', (pythonName, pattern) => {
    const copied = pythonPatternSource(python, pythonName);
    expect(copied, `${pythonName} must spell the native pattern`).toBeDefined();
    expect(unanchored(copied ?? '')).toBe(unanchored(pattern.source));
  });

  it.each(FRAGMENT_PAIRS.map((pair) => pair as const))('%s spells the native fragment', (pythonName, fragment) => {
    const copied = pythonPatternSource(python, pythonName);
    expect(copied, `${pythonName} must spell the native fragment`).toBeDefined();
    expect(copied).toBe(fragment);
  });

  it.each(QUANTIFIER_PAIRS.map((pair) => pair as const))('%s pastes in the native count %s', (pythonName, nativeSource, count) => {
    const statement = pythonAssignment(python, pythonName);
    expect(statement, `${pythonName} must be assigned`).toBeDefined();
    expect(nativeSource, `the native pattern must hold ${count}`).toContain(count);
    expect(statement ?? '', `${pythonName} must hold ${count}`).toContain(count);
  });

  it.each(PATTERNS_NOT_COMPARED.map((pair) => pair as const))('%s carries the reason it cannot be compared', (_pythonName, reason) => {
    expect(reason.length).toBeGreaterThan(0);
  });

  // The gate section is the stretch of the fallback that decides the loop's offer: it
  // opens with the first fragment the cue pattern is built from and closes where the
  // offer gate reads it. A marker that moves leaves the slice empty, which fails here
  // rather than quietly checking nothing.
  const gateOpen = python.indexOf('_DEFECT_CHECK_PATTERN = (');
  const gateClose = python.indexOf('\ndef _apply_deep_loop_offer_gate(', gateOpen + 1);
  const gate = gateOpen === -1 || gateClose === -1 ? '' : python.slice(gateOpen, gateClose);

  it('compares or accounts for every pattern the fallback compiles in its gate', () => {
    expect(gate, 'the gate section must be found').not.toBe('');
    const compiled = [...gate.matchAll(/^(_[A-Z0-9_]+_RE) = re\.compile\(/gm)].map((match) => match[1]).sort();
    expect(compiled.length).toBeGreaterThan(0);
    const accounted = [
      ...PATTERN_PAIRS.map(([name]) => name),
      ...ANCHORED_PATTERN_PAIRS.map(([name]) => name),
      ...PATTERNS_NOT_COMPARED.map(([name]) => name),
    ];
    // A name carried by two tables would be compared twice, or excused after being
    // compared, so each one is accounted for exactly once.
    expect(new Set(accounted).size).toBe(accounted.length);
    expect(accounted.filter((name) => /_RE$/.test(name)).sort(), 'every compiled gate pattern is accounted for').toEqual(compiled);
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

describe('deep-loop constants shared with the Python fallback', () => {
  const python = readFileSync(PY_ADVISOR, 'utf8');

  it.each(NUMERIC_PAIRS)('%s holds the native %d', (pythonName, value) => {
    const copied = pythonInteger(python, pythonName);
    expect(copied, `${pythonName} must hold the native value`).toBeDefined();
    expect(copied).toBe(value);
  });
});

// The deep-loop modes are spelled on four surfaces: the loop names the gate scans
// for, the cue words it counts, the named-mode pattern that settles a mode before
// the cues are read, and the hub's own router vocabulary. Nothing compares them,
// so a word changed on one surface alone leaves the other three naming a mode the
// first one never serves. The surfaces are therefore read against each other, and
// where one of them decides an answer rather than spelling a word, the answer is
// read through the gate: a prompt whose topic word is the other mode pins the mode
// the named-mode pattern settles, without a copy of its own reading.
interface DeepLoopHubRouter {
  readonly routerSignals: Readonly<Record<string, { readonly classes: readonly string[] }>>;
  readonly vocabularyClasses: Readonly<Record<string, { readonly keywords: readonly string[] }>>;
}

const DEEP_LOOP_HUB = 'system-deep-loop';
const HUB_ROUTER = JSON.parse(readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), `../../../${DEEP_LOOP_HUB}/hub-router.json`),
  'utf8',
)) as DeepLoopHubRouter;
const SERVED_MODES = Object.keys(MODE_COMMANDS[DEEP_LOOP_HUB]).sort();

describe('deep-loop mode vocabulary on every surface that carries it', () => {
  it('keys the same modes on the command table, the cue words and the hub router', () => {
    expect(Object.keys(MODE_CUES).sort()).toEqual(SERVED_MODES);
    expect(Object.keys(MODE_CUE_WORDS).sort()).toEqual(SERVED_MODES);
    expect(Object.keys(HUB_ROUTER.routerSignals).sort()).toEqual(SERVED_MODES);
  });

  it.each(SERVED_MODES)('names the mode "%s" as a cue word of its own', (mode) => {
    expect(MODE_CUE_WORDS[mode]).toContain(mode);
  });

  it.each(SERVED_MODES)('holds a loop name for "%s" in the hub vocabulary for it', (mode) => {
    const classes = HUB_ROUTER.routerSignals[mode].classes;
    expect(classes.length).toBeGreaterThan(0);
    for (const name of classes) expect(HUB_ROUTER.vocabularyClasses[name], name).toBeDefined();
    const keywords = classes.flatMap((name) => HUB_ROUTER.vocabularyClasses[name]?.keywords ?? []);
    // A loop name is how the hub and the gate both spell a mode, so the two have
    // to hold one in common rather than a vocabulary of their own.
    const shared = keywords.filter((keyword) => LOOP_NAMES.includes(keyword) && usesWord(keyword, mode));
    expect(shared, `no hub keyword names the ${mode} loop`).not.toHaveLength(0);
  });

  it.each(LOOP_NAMES)('serves the mode "%s" spells and no other', (name) => {
    const spelled = SERVED_MODES.filter((mode) => usesWord(name, mode));
    const command = attachCommand(DEEP_LOOP_HUB, { action: 'defer' }, `I'd like a ${name} on the cache layer`);
    expect(command).toBe(spelled.length === 1 ? `/deep:${spelled[0]}` : undefined);
  });

  it.each(SERVED_MODES)('serves "%s" when the ask names it and only the topic names another mode', (mode) => {
    const topic = SERVED_MODES.find((candidate) => candidate !== mode);
    expect(topic, 'a second mode is needed for a topic word').toBeDefined();
    const prompt = `run 5 ${mode} iterations on ${topic} tooling`;
    expect(attachCommand(DEEP_LOOP_HUB, { action: 'defer' }, prompt), prompt).toBe(`/deep:${mode}`);
  });
});
