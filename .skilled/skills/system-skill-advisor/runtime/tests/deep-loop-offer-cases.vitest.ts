// ───────────────────────────────────────────────────────────────
// MODULE: Deep-loop offer cases
// ───────────────────────────────────────────────────────────────

// The native deep-loop offer gate reads every case in one fixture file. The
// Python fallback carries no copy of this gate: it keeps a deep-loop command row
// only when the prompt types the command, so it reads none of these cases.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { attachTypedCommand } from '../handlers/advisor-recommend.js';
import {
  COUNT_WORDS,
  ITERATIVE_VERBS,
  LOOP_ARTIFACT_NOUNS,
  LOOP_EFFORT_CHANGE_VERBS,
  LOOP_EFFORT_LEADS,
  LOOP_EFFORT_WORDS,
  LOOP_NAMES,
  LOOP_RUN_SYMPTOMS,
  LOOP_WANT_LEADS,
  LOOP_WORDING,
  MODE_COMMANDS,
  MODE_CUES,
  MODE_CUE_WORDS,
  PAST_RUN_READ_VERBS,
  RERUN_PRONOUNS,
  RUN_ASK_REFUSAL_CANCEL_LEADS,
  RUN_ASK_REFUSAL_LEADS,
  RUN_ASK_REFUSAL_VERBS,
  TRACKED_COMMANDS,
  asksForLoopRun,
  attachCommand,
  isNoEditRequest,
  isPastRunRead,
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
  readonly readOnlyRunKept?: 'review' | 'research';
  readonly servedRun?: 'review' | 'research' | 'none';
  readonly doctorWithheld?: boolean;
}

const FIXTURE = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures/deep-loop-offer-cases.json');
const { cases } = JSON.parse(readFileSync(FIXTURE, 'utf8')) as { readonly cases: readonly OfferCase[] };
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

describe('deep-loop offer cases', () => {
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

  // The served column pins the native head after the typed pass. The gate column above
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
  // one.
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
  // fix.
  it.each(doctorCases.map((entry) => [entry.id, entry] as const))('doctor: %s', (_id, entry) => {
    expect(attachCommand('system-deep-loop', REVIEW_ROUTE, entry.prompt) === '/doctor:deep-loop').toBe(!entry.doctorWithheld);
  });

  // The scorer withholds the doctor row in two steps, the refusal and the
  // no-edit wording, so the fused row has to agree with the hub route on the
  // same cases.
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
  // one the reader never asked for. The column spells that absence "none".
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

  // A vocabulary word no case uses can change without failing any case, so each
  // entry needs a case that asks for a run through it.
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
  // run.
  it.each(PAST_RUN_READ_VERBS)('has a past-run case that uses the verb "%s"', (verb) => {
    const used = cases.some((entry) => !entry.asksForLoopRun
      && isPastRunRead(entry.prompt) && usesWord(entry.prompt, verb));
    expect(used).toBe(true);
  });

  // A pronoun rerun repeats the deep run the prompt names and asks for that run,
  // so each pronoun needs a case that reads as the ask. The shape is spelled here rather than imported, so a pronoun
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
