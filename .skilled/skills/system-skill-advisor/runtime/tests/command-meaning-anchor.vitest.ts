// ───────────────────────────────────────────────────────────────
// MODULE: Command meaning anchor
// ───────────────────────────────────────────────────────────────

// A command bridge normally passes on its own authored wording, so a prompt that
// shares no words with that wording can only reach the command through meaning.
// The pair under test owns that second way in: a real prompt embedding has to clear
// the cosine bar, lead the other command rows by the margin, and only then may it
// outrank a passing skill. The word-overlap stand-in used under test measures shared
// words rather than shared meaning, so it must never carry a command on its own.
//
// The matrix covers seven axes over seventeen cases:
//   evidence kind  a real cosine, the stand-in, no semantic lane at all
//   bar            at the bar, under the bar, and a bar no cosine can reach
//   margin         a clear lead, and a lead that sits inside the margin
//   anchor         an authored phrase present, and absent
//   row kind       command, skill, doctor command
//   rank outcome   moved first, keeps its place, input order returned
//   eligibility    a plain request, a read-only question, an explicit no-edit
//                  request, each against a mutating and a read-only command
//
// One case scores a whole prompt with no embedder and no stored vectors, which is
// the state of a machine that never ran one: every command it passes must still
// rest on an authored phrase.
//
// Both bars are tuned by measurement, so no case pins them. Each derives its cosines
// from the exported constants and asserts the behaviour those constants imply: while
// the bar sits above 1 it is unreachable on purpose, and every case that would
// otherwise assert a meaning pass asserts instead that meaning passes nothing.

import { describe, expect, it } from 'vitest';

import {
  COMMAND_MEANING_MARGIN,
  COMMAND_MEANING_MIN_COSINE,
  commandMeaningEligible,
  rankMeaningPassedCommandFirst,
  requireCommandPhraseAnchor,
  scoreAdvisorPrompt,
} from '../lib/scorer/fusion.js';
import { COMMAND_BRIDGES } from '../lib/scorer/projection.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';
import type { AdvisorScoredRecommendation, LaneContribution } from '../lib/scorer/types.js';

const BAR = COMMAND_MEANING_MIN_COSINE;
const MARGIN = COMMAND_MEANING_MARGIN;

// Real cosines live in 0..1, so a bar above 1 means the meaning path is switched
// off rather than merely strict.
const MEANING_REACHABLE = BAR <= 1;
// At or above the bar when it can be reached, and a real cosine just under it when
// it cannot, so the same constant drives both readings.
const AT_BAR = Math.min(BAR + 0.01, 1);
const UNDER_BAR = Math.min(Math.max(BAR - 0.01, 0), 0.99);
// A rival that leads by less than the margin, so its lead is not enough to clear it.
// With a zero margin the row may not trail its peers at all, so any lead is inside.
const INSIDE_MARGIN = Math.max(MARGIN, 0.02) / 2;

const CONFIDENCE_THRESHOLD = 0.65;
const ROW_CONFIDENCE = 0.4;

// The lane reports a real embedder cosine as "cosine:" and the stand-in as "shadow:",
// and only the first may count as meaning.
function semantic(cosine: number, evidenceKind: 'cosine' | 'shadow' = 'cosine'): LaneContribution {
  const evidence = evidenceKind === 'cosine' ? `cosine:${cosine}` : 'shadow:test-fallback';
  return {
    lane: 'semantic_shadow',
    rawScore: cosine,
    weightedScore: 0,
    weight: 0,
    evidence: [evidence],
    shadowOnly: evidenceKind === 'shadow',
  };
}

// The lane that reports a command's own authored phrase matched the prompt.
function authored(rawScore = 1): LaneContribution {
  return {
    lane: 'explicit_author',
    rawScore,
    weightedScore: 0,
    weight: 0,
    evidence: ['author:save the session context'],
    shadowOnly: false,
  };
}

// A tabular token match, which is what an unauthored command row usually has.
function lexical(): LaneContribution {
  return {
    lane: 'lexical',
    rawScore: 0.25,
    weightedScore: 0,
    weight: 0,
    evidence: ['token:save'],
    shadowOnly: false,
  };
}

function row(
  skill: string,
  kind: 'skill' | 'command',
  laneContributions: readonly LaneContribution[],
  overrides: Partial<AdvisorScoredRecommendation> = {},
): AdvisorScoredRecommendation {
  return {
    skill,
    kind,
    confidence: ROW_CONFIDENCE,
    uncertainty: 0.2,
    passes_threshold: false,
    reason: '',
    score: 1,
    laneContributions,
    dominantLane: null,
    lifecycleStatus: 'active',
    ...overrides,
  };
}

function ids(rows: readonly AdvisorScoredRecommendation[]): string[] {
  return rows.map((recommendation) => recommendation.skill);
}

describe('requireCommandPhraseAnchor', () => {
  it('passes a command whose real cosine clears the bar with a clear lead', () => {
    const meaningPassed = new Set<string>();
    // The rival trails by more than the margin, so the lead is clear rather than
    // merely non-negative.
    const ranked = [
      row('create:agent', 'command', [semantic(AT_BAR)]),
      row('sk-doc', 'skill', [], { passes_threshold: true }),
      row('memory:save', 'command', [semantic(Math.max(AT_BAR - MARGIN - 0.05, 0))]),
    ];

    const result = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, meaningPassed);
    const anchored = result[0]!;

    if (!MEANING_REACHABLE) {
      expect(BAR).toBeGreaterThan(1);
      expect(anchored.passes_threshold).toBe(false);
      expect(anchored.confidence).toBe(ROW_CONFIDENCE);
      expect(meaningPassed.size).toBe(0);
      return;
    }

    expect(anchored.passes_threshold).toBe(true);
    // A meaning match rarely clears the threshold on its lane weight, so the anchor
    // lifts the row to it rather than leaving it scored but unpassed.
    expect(anchored.confidence).toBe(CONFIDENCE_THRESHOLD);
    expect(meaningPassed.has('create:agent')).toBe(true);
    expect(meaningPassed.size).toBe(1);
  });

  it('refuses a cosine under the bar and drops a pass it cannot justify', () => {
    const meaningPassed = new Set<string>();
    const ranked = [row('create:agent', 'command', [semantic(UNDER_BAR)], { passes_threshold: true })];

    const result = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, meaningPassed);

    expect(result[0]!.passes_threshold).toBe(false);
    expect(result[0]!.confidence).toBe(ROW_CONFIDENCE);
    expect(meaningPassed.size).toBe(0);
  });

  it('refuses a cosine above the bar that sits inside the margin of another command', () => {
    const meaningPassed = new Set<string>();
    // The candidate reaches the bar on its own, so the margin is the only thing left
    // that can refuse it.
    const ranked = [
      row('create:agent', 'command', [semantic(AT_BAR)]),
      row('memory:save', 'command', [semantic(AT_BAR + INSIDE_MARGIN)]),
    ];

    const result = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, meaningPassed);

    expect(result[0]!.passes_threshold).toBe(false);
    expect(meaningPassed.has('create:agent')).toBe(false);
  });

  it('never passes a command on stand-in evidence, whatever its score', () => {
    const meaningPassed = new Set<string>();
    // A score far above any bar still proves nothing: the stand-in counts shared
    // words, and a prompt sharing common words did not ask for this command.
    const ranked = [row('command-doctor-env', 'command', [semantic(1.5, 'shadow')], { passes_threshold: true })];

    const result = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, meaningPassed);

    expect(result[0]!.passes_threshold).toBe(false);
    expect(meaningPassed.size).toBe(0);
  });

  it('refuses a command row with no semantic contribution at all', () => {
    const meaningPassed = new Set<string>();
    const ranked = [row('memory:save', 'command', [lexical()], { passes_threshold: true })];

    const result = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, meaningPassed);

    expect(result[0]!.passes_threshold).toBe(false);
    expect(meaningPassed.size).toBe(0);
  });

  it('keeps an authored command passing and out of the meaning set', () => {
    const meaningPassed = new Set<string>();
    // Two ways in, and the authored phrase wins first: its row is untouched, because
    // only a pass that needed meaning may later be reordered on it.
    const ranked = [row('create:agent', 'command', [authored(), semantic(AT_BAR)], {
      passes_threshold: true,
      confidence: 0.9,
    })];

    const result = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, meaningPassed);

    expect(result[0]!.passes_threshold).toBe(true);
    expect(result[0]!.confidence).toBe(0.9);
    expect(meaningPassed.size).toBe(0);
  });

  it('refuses a command the caller rules out, however close its meaning', () => {
    const ranked = [row('create:agent', 'command', [semantic(AT_BAR)])];

    const ruledOut = new Set<string>();
    const refused = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, ruledOut, () => false);
    expect(refused[0]!.passes_threshold).toBe(false);
    expect(refused[0]!.confidence).toBe(ROW_CONFIDENCE);
    expect(ruledOut.size).toBe(0);

    // The same row with the caller's consent, which is what shows the refusal
    // above came from the caller and not from the bar.
    const allowed = new Set<string>();
    const passed = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, allowed, () => true);
    expect(passed[0]!.passes_threshold).toBe(MEANING_REACHABLE);
    expect(allowed.has('create:agent')).toBe(MEANING_REACHABLE);
  });

  it('returns a skill row unchanged even at a cosine above the bar', () => {
    const meaningPassed = new Set<string>();
    const skillRow = row('sk-git', 'skill', [semantic(AT_BAR)], { passes_threshold: true, confidence: 0.9 });
    const ranked = [skillRow];

    const result = requireCommandPhraseAnchor(ranked, CONFIDENCE_THRESHOLD, meaningPassed);

    // The anchor governs commands only, so a skill row comes back as the same object
    // and never enters the meaning set that reorders commands.
    expect(result[0]).toBe(skillRow);
    expect(meaningPassed.size).toBe(0);
  });
});

describe('rankMeaningPassedCommandFirst', () => {
  const SKILL_COSINE = 0.4;
  // A lead that clears the margin, so the command has earned the front.
  const CLEARS_MARGIN = SKILL_COSINE + MARGIN + 0.05;
  // A lead that stops short of it, so the skill keeps its place.
  const INSIDE = SKILL_COSINE + MARGIN - 0.01;

  it('moves a meaning-passed command ahead of a passing skill it leads by the margin', () => {
    const ranked = [
      row('sk-git', 'skill', [semantic(SKILL_COSINE)], { passes_threshold: true }),
      row('create:agent', 'command', [semantic(CLEARS_MARGIN)], { passes_threshold: true }),
    ];

    const result = rankMeaningPassedCommandFirst(ranked, new Set(['create:agent']));

    expect(ids(result)).toEqual(['create:agent', 'sk-git']);
  });

  it('keeps the order when the lead sits inside the margin', () => {
    const ranked = [
      row('sk-git', 'skill', [semantic(SKILL_COSINE)], { passes_threshold: true }),
      row('create:agent', 'command', [semantic(INSIDE)], { passes_threshold: true }),
    ];

    const result = rankMeaningPassedCommandFirst(ranked, new Set(['create:agent']));

    expect(ids(result)).toEqual(['sk-git', 'create:agent']);
  });

  it('moves a doctor command first over a passing skill when it clears the margin', () => {
    // A doctor bridge is the command most likely to pass on meaning, since a problem
    // described in other words names none of its own phrases.
    const ranked = [
      row('sk-env', 'skill', [semantic(SKILL_COSINE)], { passes_threshold: true }),
      row('command-doctor-env', 'command', [semantic(CLEARS_MARGIN)], { passes_threshold: true }),
    ];

    const result = rankMeaningPassedCommandFirst(ranked, new Set(['command-doctor-env']));

    expect(ids(result)).toEqual(['command-doctor-env', 'sk-env']);
  });

  it('returns the input order when nothing passed on meaning', () => {
    const ranked = [
      row('sk-git', 'skill', [semantic(SKILL_COSINE)], { passes_threshold: true }),
      row('create:agent', 'command', [semantic(CLEARS_MARGIN)], { passes_threshold: true }),
    ];

    const result = rankMeaningPassedCommandFirst(ranked, new Set());

    // A command that passed on its own wording keeps the order its own lane order
    // earned, so the empty set must not even copy-shuffle it.
    expect(ids(result)).toEqual(['sk-git', 'create:agent']);
    expect(result).not.toBe(ranked);
  });
});

describe('commandMeaningEligible', () => {
  // Real rows, so the cases follow the flag the generator derives from each
  // command's own route class rather than a hand-made stand-in for it.
  const readOnlyCommand = COMMAND_BRIDGES.find((bridge) => bridge.readOnly === true);
  const mutatingCommand = COMMAND_BRIDGES.find((bridge) => bridge.readOnly !== true && bridge.routingEnabled !== false);

  it('finds one command of each kind to test against', () => {
    expect(readOnlyCommand, 'a command whose route only reads').toBeDefined();
    expect(mutatingCommand, 'a command whose route may change things').toBeDefined();
  });

  it('lets any command pass on meaning for a plain request', () => {
    const prompt = 'my optional behaviour toggles need sorting out';
    expect(commandMeaningEligible(prompt, false, mutatingCommand)).toBe(true);
    expect(commandMeaningEligible(prompt, false, readOnlyCommand)).toBe(true);
  });

  it('lets only a read-only command answer a read-only question', () => {
    const prompt = 'what does sorting out the optional behaviour toggles involve?';
    expect(commandMeaningEligible(prompt, true, mutatingCommand)).toBe(false);
    expect(commandMeaningEligible(prompt, true, readOnlyCommand)).toBe(true);
    expect(commandMeaningEligible(prompt, true, undefined)).toBe(false);
  });

  it('rules out every command when the prompt asks for no change', () => {
    const prompt = 'walk me through the optional behaviour toggles, do not change anything';
    expect(commandMeaningEligible(prompt, false, mutatingCommand)).toBe(false);
    expect(commandMeaningEligible(prompt, false, readOnlyCommand)).toBe(false);
    expect(commandMeaningEligible(prompt, true, readOnlyCommand)).toBe(false);
  });
});

describe('scoring with no embedder and no stored vectors', () => {
  it('passes a command only on its own authored phrase', () => {
    const workspaceRoot = findAdvisorWorkspaceRoot(import.meta.dirname);
    const prompts = [
      'my optional behaviour toggles need sorting out',
      'put what we talked about somewhere the next sitting can pick it up',
      '/speckit:save',
    ];
    let passingCommands = 0;
    for (const prompt of prompts) {
      const result = scoreAdvisorPrompt(prompt, { workspaceRoot, includeAllCandidates: true });
      for (const recommendation of result.recommendations) {
        if (recommendation.kind !== 'command' || !recommendation.passes_threshold) continue;
        passingCommands += 1;
        const authoredPhrase = recommendation.laneContributions.some((contribution) => (
          contribution.lane === 'explicit_author' && contribution.rawScore > 0
        ));
        expect(authoredPhrase, `${prompt} -> ${recommendation.skill}`).toBe(true);
      }
    }
    // The typed command is in the list so the loop above is known to have seen a
    // passing command and is not vacuously green.
    expect(passingCommands).toBeGreaterThan(0);
  });
});
