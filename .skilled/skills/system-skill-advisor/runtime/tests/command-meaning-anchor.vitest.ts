// ───────────────────────────────────────────────────────────────
// MODULE: Command meaning anchor
// ───────────────────────────────────────────────────────────────

// A command bridge passes only on its own authored wording: one of its phrases or
// its runnable slash string, which the explicit-author lane reports. Every other
// command row loses its pass, however well a token or a derived signal matched,
// because a command must not be offered for a prompt that merely shares some of
// its everyday words. Skill rows pass through untouched.
//
// Two withhold rules run after the anchor. A command the prompt names only to
// refuse it or ask about it stops passing, and a prompt that asks for no change
// stops every command that writes while a read-only command keeps its pass.
//
// One case scores whole prompts through the real scorer: every command it passes
// must still rest on an authored phrase.

import { describe, expect, it } from 'vitest';

import {
  requireCommandPhraseAnchor,
  scoreAdvisorPrompt,
  withholdMentionedCommands,
  withholdWritingCommandsOnNoEdit,
} from '../lib/scorer/fusion.js';
import { commandRowFor } from '../lib/command-attach.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';
import type { AdvisorScoredRecommendation, LaneContribution } from '../lib/scorer/types.js';

const ROW_CONFIDENCE = 0.4;

// A derived-lane contribution: generated trigger and keyword evidence that
// describes the prompt in other words. The anchor never counts it.
function derived(score: number): LaneContribution {
  return {
    lane: 'derived_generated',
    rawScore: score,
    weightedScore: 0,
    weight: 0,
    evidence: ['derived:test-trigger'],
    shadowOnly: false,
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

describe('requireCommandPhraseAnchor', () => {
  it('never passes a command on derived evidence alone, whatever its score', () => {
    // Derived evidence describes the prompt in other words and is not the
    // command's own wording, so it never carries the row.
    const ranked = [
      row('command-doctor-env', 'command', [derived(1.5)], { passes_threshold: true }),
      row('create:agent', 'command', [derived(0.99)], { passes_threshold: true }),
    ];

    const result = requireCommandPhraseAnchor(ranked);

    expect(result.map((recommendation) => recommendation.passes_threshold)).toEqual([false, false]);
    expect(result[1]!.confidence).toBe(ROW_CONFIDENCE);
  });

  it('refuses a command row that matched only on shared tokens', () => {
    const ranked = [row('memory:save', 'command', [lexical()], { passes_threshold: true })];

    const result = requireCommandPhraseAnchor(ranked);

    expect(result[0]!.passes_threshold).toBe(false);
  });

  it('keeps an authored command passing as the same row', () => {
    // The authored phrase is the one way in, so a strong derived score beside it
    // changes nothing and the row comes back untouched.
    const authoredRow = row('create:agent', 'command', [authored(), derived(0.99)], {
      passes_threshold: true,
      confidence: 0.9,
    });

    const result = requireCommandPhraseAnchor([authoredRow]);

    expect(result[0]).toBe(authoredRow);
  });

  it('returns a skill row unchanged whatever its derived score', () => {
    const skillRow = row('sk-git', 'skill', [derived(0.99)], { passes_threshold: true, confidence: 0.9 });

    const result = requireCommandPhraseAnchor([skillRow]);

    // The anchor governs commands only, so a skill row comes back as the same object.
    expect(result[0]).toBe(skillRow);
  });
});

describe('withholdMentionedCommands', () => {
  // A command row reaches its pass on the command name in its own wording, so a
  // prompt that names that command only to refuse it or ask about it would carry
  // the row through. The skill row shares no command name and must stay as it was.
  const rows = [
    row('command-speckit-complete', 'command', [], { passes_threshold: true }),
    row('system-spec-kit', 'skill', [], { passes_threshold: true }),
  ];

  it('stops the command row a refusal names', () => {
    const result = withholdMentionedCommands(rows, 'do not run /speckit:complete yet, just explain what it does');

    expect(result[0]!.passes_threshold).toBe(false);
    expect(result[1]).toBe(rows[1]);
  });

  it('leaves both rows passing when the prompt asks for the command', () => {
    const result = withholdMentionedCommands(rows, 'run /speckit:complete for the rate limiter');

    expect(result[0]).toBe(rows[0]);
    expect(result[1]).toBe(rows[1]);
  });

  it('stops the command row a question names', () => {
    const result = withholdMentionedCommands(rows, 'is /speckit:complete overkill for a two line fix?');

    expect(result[0]!.passes_threshold).toBe(false);
  });

  // The prompt names a command with subcommands by its base alone, so the row's
  // own name has to be reduced the same way before the two are compared.
  it('matches a command that carries a subcommand by its base', () => {
    const doctorRow = row('command-doctor-env', 'command', [], { passes_threshold: true });

    const result = withholdMentionedCommands([doctorRow], 'do not run /doctor:env on this machine');

    expect(result[0]!.passes_threshold).toBe(false);
  });
});

describe('withholdWritingCommandsOnNoEdit', () => {
  // Three commands of each writing class beside a skill row, so the gate is
  // shown to choose by the class the command carries rather than by its name.
  const rows = [
    row('command-doctor-speckit', 'command', [], { passes_threshold: true }),
    row('command-speckit-complete', 'command', [], { passes_threshold: true }),
    row('command-doctor-env', 'command', [], { passes_threshold: true }),
    row('system-spec-kit', 'skill', [], { passes_threshold: true }),
  ];

  it('stops every command that writes and keeps the one that only reads', () => {
    // A regenerated table that changes a class fails here by name, before the
    // behavioural assertion below can pass for an unrelated reason.
    expect(commandRowFor('command-doctor-speckit')?.mutating).toBe('add-only');
    expect(commandRowFor('command-speckit-complete')?.mutating).toBe('mutates');
    expect(commandRowFor('command-doctor-env')?.mutating).toBe('read-only');

    const result = withholdWritingCommandsOnNoEdit(
      rows,
      'the trigger index lookup returns nothing for my packet, do not change anything',
    );

    expect(result.filter((recommendation) => recommendation.passes_threshold).map((recommendation) => recommendation.skill))
      .toEqual(['command-doctor-env', 'system-spec-kit']);
  });

  it('leaves every row as it was when the prompt allows a change', () => {
    const result = withholdWritingCommandsOnNoEdit(
      rows,
      'the trigger index lookup returns nothing for my packet',
    );

    expect(result).toEqual(rows);
    expect(result.every((recommendation) => recommendation.passes_threshold)).toBe(true);
  });

  it('keeps a writing command the prompt types and asks for', () => {
    const result = withholdWritingCommandsOnNoEdit(
      rows,
      'run /speckit:complete for the rate limiter, do not change the public api',
    );

    expect(result.find((recommendation) => recommendation.skill === 'command-speckit-complete')?.passes_threshold)
      .toBe(true);
  });

  it('still withholds a writing command the prompt only names', () => {
    const result = withholdWritingCommandsOnNoEdit(
      rows,
      'do not run /speckit:complete, and do not change anything',
    );

    expect(result.find((recommendation) => recommendation.skill === 'command-speckit-complete')?.passes_threshold)
      .toBe(false);
  });
});

describe('scoring whole prompts through the real scorer', () => {
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
