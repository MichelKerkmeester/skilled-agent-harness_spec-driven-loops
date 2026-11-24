// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Prompt Policy Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractMetalinguisticSkillMentions,
  shouldFireAdvisor,
  stripLeadingPastedReply,
} from '../../lib/prompt-policy.js';

interface PastedReplyStripCase {
  readonly id: string;
  readonly input: string;
  readonly expected: string;
  readonly ideal?: string;
}

// The Python advisor test reads the same file, so both scorers drop the same text.
const PASTED_REPLY_STRIP_CASES: readonly PastedReplyStripCase[] = (JSON.parse(
  readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), '../fixtures/pasted-reply-strip-cases.json'),
    'utf8',
  ),
) as { cases: PastedReplyStripCase[] }).cases;

describe('skill advisor prompt policy', () => {
  it('skips empty, whitespace, and exact navigation commands', () => {
    expect(shouldFireAdvisor('').fire).toBe(false);
    expect(shouldFireAdvisor('   ').reason).toBe('empty_prompt');
    expect(shouldFireAdvisor('/help').reason).toBe('skip_command');
    expect(shouldFireAdvisor(' /CLEAR ').reason).toBe('skip_command');
  });

  it('skips short casual acknowledgements with no work intent', () => {
    expect(shouldFireAdvisor('ok')).toMatchObject({
      fire: false,
      reason: 'short_casual_acknowledgement',
    });
    expect(shouldFireAdvisor('thanks').fire).toBe(false);
    expect(shouldFireAdvisor('hi').fire).toBe(false);
  });

  it('fires for explicit skill, command, and governance markers', () => {
    expect(shouldFireAdvisor('use sk-code here')).toMatchObject({
      fire: true,
      reason: 'explicit_skill_or_governance_marker',
    });
    // A skill outside the sk- family is named just as explicitly, and a short prompt must not skip it.
    for (const name of ['system-deep-loop', 'cli-classifier', 'mcp-tooling']) {
      expect(shouldFireAdvisor(`use the ${name} skill`)).toMatchObject({
        fire: true,
        reason: 'explicit_skill_or_governance_marker',
        metalinguisticMentions: [name],
      });
    }
    // A bare family word without a name after the hyphen is not a skill mention.
    expect(shouldFireAdvisor('fix the system').fire).toBe(false);
    expect(shouldFireAdvisor('/speckit:resume now').fire).toBe(true);
    expect(shouldFireAdvisor('spec kit packet alignment').fire).toBe(true);
  });

  it('fires for work-intent verbs with at least three meaningful tokens', () => {
    expect(shouldFireAdvisor('implement feature X')).toMatchObject({
      fire: true,
      reason: 'work_intent_with_meaningful_tokens',
    });
  });

  it('fires for length plus meaningful-token thresholds', () => {
    expect(shouldFireAdvisor('please examine routing behavior today').reason).toBe('length_and_token_threshold');
    expect(shouldFireAdvisor('This prompt has enough visible detail to deserve advisor routing even without a leading verb.').fire)
      .toBe(true);
  });

  it('canonical-folds Unicode before classification and extracts metalinguistic skill names', () => {
    const prompt = 'explain sk-git skill with hidden\u200bspace';
    const result = shouldFireAdvisor(prompt);

    expect(result.fire).toBe(true);
    expect(result.canonicalPrompt).not.toContain('\u200b');
    expect(result.metalinguisticMentions).toEqual(['sk-git']);
    expect(extractMetalinguisticSkillMentions(prompt)).toEqual(['sk-git']);
  });
});

describe('pasted reply stripping', () => {
  it.each(PASTED_REPLY_STRIP_CASES.map((row) => [row.id, row] as const))('%s', (_id, row) => {
    const stripped = stripLeadingPastedReply(row.input);
    expect(stripped).toBe(row.expected);
    // The handler and the scorer both strip, so a second pass must return the same text.
    expect(stripLeadingPastedReply(stripped)).toBe(stripped);
  });

  it('strips a 64K whitespace run with newlines in linear time', () => {
    const input = `Claude replied: ok.${' \n'.repeat(32768)}x`;
    const startedAt = performance.now();
    const stripped = stripLeadingPastedReply(input);
    const elapsedMs = performance.now() - startedAt;

    expect(stripped).toBe(input);
    expect(elapsedMs).toBeLessThan(50);
  });

  it.each([
    ['an indented marker after a newline', 'Claude replied: done.\n   Now: refactor the store'],
    ['a marker after a CRLF line break', 'Claude replied: done.\r\nNow: refactor the store'],
  ])('keeps the task after %s', (_label, input) => {
    expect(stripLeadingPastedReply(input)).toBe('refactor the store');
  });
});
