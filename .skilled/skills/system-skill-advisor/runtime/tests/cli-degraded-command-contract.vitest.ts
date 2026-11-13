// ───────────────────────────────────────────────────────────────
// MODULE: Degraded CLI command contract
// ───────────────────────────────────────────────────────────────

// The degraded path is the only one where a recommendation can still arrive as a
// raw command row id. A reader can act on a command they typed and on the skill
// that owns an untyped row, so these cases pin both shapes: the typed row keeps
// its runnable string and policy, and the untyped row collapses to one owner
// skill that names no command at all.
//
// The second case feeds the owner skill in ahead of the command row, because the
// two would otherwise both survive as separate entries and the reader would see
// the same skill twice with one offer they never asked for.

import { describe, expect, it } from 'vitest';

import { degradedRecommendations } from '../skill-advisor-cli.js';

// A passing entry, so a case fails on the field it asserts rather than on the
// threshold filter dropping the row before the contract is reached.
function entry(skill: string): {
  skill: string;
  confidence: number;
  uncertainty: number;
  passes_threshold: boolean;
} {
  return { skill, confidence: 0.82, uncertainty: 0.16, passes_threshold: true };
}

describe('degradedRecommendations', () => {
  it('keeps the command and the policy of a row the prompt typed', () => {
    const result = degradedRecommendations([entry('command-speckit-save')], '/speckit:save this session');

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      skillId: 'command-speckit-save',
      kind: 'command',
      command: '/speckit:save',
      policy: 'start',
      ownerSkillId: 'system-spec-kit',
    });
  });

  it('collapses an untyped row to one owner skill that offers no command', () => {
    const result = degradedRecommendations(
      [entry('sk-doc'), entry('command-create-readme')],
      'create a readme for the utils folder',
    );

    expect(result).toHaveLength(1);
    expect(result).toMatchObject([{ skillId: 'sk-doc' }]);
    expect(result[0]).not.toHaveProperty('command');
  });
});
