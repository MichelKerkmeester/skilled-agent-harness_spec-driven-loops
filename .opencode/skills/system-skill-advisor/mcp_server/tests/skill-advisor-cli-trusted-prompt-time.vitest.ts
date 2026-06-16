// -----------------------------------------------------------------------------
// MODULE: Skill Advisor CLI Trusted / Prompt-Time Gating Tests
// -----------------------------------------------------------------------------
// Two front-door safety properties:
//   1. Inline boolean values for --trusted/--maintainer must be honored, so a
//      wrapper serializing --trusted=false does NOT silently grant mutation authority.
//   2. A prompt-time invocation must never run a shared-state mutation, even if it
//      also asserts trusted authority (defense-in-depth over the hook convention).

import { afterEach, describe, expect, it } from 'vitest';

import { __testing, parseCliArgs } from '../skill-advisor-cli.js';

const PROMPT_TIME_ENV_KEYS = [
  'OPENCODE_PROMPT_TIME',
  'CODEX_PROMPT_TIME',
  'CLAUDE_CODE_PROMPT_TIME',
  'SPECKIT_CLI_PROMPT_TIME',
  'MK_SKILL_ADVISOR_CLI_PROMPT_TIME',
  'SPECKIT_SKILL_ADVISOR_CLI_PROMPT_TIME',
  'MK_SKILL_ADVISOR_CLI_TRUSTED',
  'SPECKIT_SKILL_ADVISOR_CLI_TRUSTED',
];

const savedEnv = new Map<string, string | undefined>();
for (const key of PROMPT_TIME_ENV_KEYS) savedEnv.set(key, process.env[key]);

afterEach(() => {
  for (const [key, value] of savedEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function clearPromptTimeEnv(): void {
  for (const key of PROMPT_TIME_ENV_KEYS) delete process.env[key];
}

describe('skill-advisor CLI inline --trusted boolean', () => {
  it('treats bare --trusted as true', () => {
    clearPromptTimeEnv();
    expect(parseCliArgs(['advisor_rebuild', '--trusted']).trusted).toBe(true);
  });

  it('treats --trusted=false as not trusted', () => {
    clearPromptTimeEnv();
    expect(parseCliArgs(['advisor_rebuild', '--trusted=false']).trusted).toBe(false);
  });

  it('treats --trusted=0 as not trusted', () => {
    clearPromptTimeEnv();
    expect(parseCliArgs(['advisor_rebuild', '--trusted=0']).trusted).toBe(false);
  });

  it('treats --maintainer=false as not trusted', () => {
    clearPromptTimeEnv();
    expect(parseCliArgs(['advisor_rebuild', '--maintainer=false']).trusted).toBe(false);
  });

  it('rejects a non-boolean inline value for --trusted', () => {
    clearPromptTimeEnv();
    expect(() => parseCliArgs(['advisor_rebuild', '--trusted=maybe'])).toThrow(/must be true or false/i);
  });

  it('blocks the mutation gate when parsed with --trusted=false', () => {
    clearPromptTimeEnv();
    const parsed = parseCliArgs(['advisor_rebuild', '--trusted=false']);
    expect(() => __testing.validateCommand(parsed)).toThrow(/requires --trusted/i);
  });
});

describe('skill-advisor CLI prompt-time mutation block', () => {
  it('blocks a mutation tool at prompt-time even with --trusted', () => {
    clearPromptTimeEnv();
    const parsed = parseCliArgs(['advisor_rebuild', '--trusted', '--prompt-time']);
    expect(parsed.promptTime).toBe(true);
    expect(parsed.trusted).toBe(true);
    expect(() => __testing.validateCommand(parsed)).toThrow(/prompt-time/i);
  });

  it('blocks skill_graph_scan at prompt-time via OPENCODE_PROMPT_TIME=1 even with trusted env', () => {
    clearPromptTimeEnv();
    process.env.OPENCODE_PROMPT_TIME = '1';
    process.env.MK_SKILL_ADVISOR_CLI_TRUSTED = '1';
    const parsed = parseCliArgs(['skill_graph_scan']);
    expect(parsed.promptTime).toBe(true);
    expect(parsed.trusted).toBe(true);
    expect(() => __testing.validateCommand(parsed)).toThrow(/prompt-time/i);
  });

  it('blocks real apply-mode skill_graph_propagate_enhances at prompt-time even with --trusted', () => {
    clearPromptTimeEnv();
    // dryRun defaults true for this tool, so a real apply requires --dry-run false.
    const parsed = parseCliArgs([
      'skill_graph_propagate_enhances',
      '--trusted',
      '--prompt-time',
      '--mode',
      'apply',
      '--dry-run',
      'false',
    ]);
    expect(() => __testing.validateCommand(parsed)).toThrow(/prompt-time/i);
  });

  it('allows a read tool at prompt-time', () => {
    clearPromptTimeEnv();
    process.env.OPENCODE_PROMPT_TIME = '1';
    const parsed = parseCliArgs(['skill_graph_status']);
    expect(parsed.promptTime).toBe(true);
    expect(() => __testing.validateCommand(parsed)).not.toThrow();
  });

  it('allows a trusted mutation when NOT prompt-time', () => {
    clearPromptTimeEnv();
    const parsed = parseCliArgs(['advisor_rebuild', '--trusted']);
    expect(parsed.promptTime).toBe(false);
    expect(() => __testing.validateCommand(parsed)).not.toThrow();
  });
});
