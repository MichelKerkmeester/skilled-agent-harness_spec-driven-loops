// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor CLI JSON-On-Stdin Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { parseCliArgs, runSkillAdvisorCli } from '../skill-advisor-cli.js';

function captureIo(stdinText: string) {
  let stderr = '';
  return {
    stdout: { write: (_chunk: string): boolean => true },
    stderr: {
      write(chunk: string): boolean {
        stderr += chunk;
        return true;
      },
    },
    readStdin: async (): Promise<string> => stdinText,
    stderrText: () => stderr,
  };
}

describe('skill-advisor CLI --json -', () => {
  it('marks a stdin payload during parsing without reading stdin', () => {
    const parsed = parseCliArgs(['advisor_recommend', '--json', '-', '--format', 'json']);
    expect(parsed.jsonFromStdin).toBe(true);
    expect(parsed.args).toEqual({});
    expect(parseCliArgs(['advisor_recommend', '--json', '{"prompt":"x"}']).jsonFromStdin).toBeUndefined();
  });

  it('refuses per-parameter flags next to a stdin payload', () => {
    expect(() => parseCliArgs(['advisor_recommend', '--json', '-', '--prompt', 'x']))
      .toThrow('--json cannot be combined with per-parameter flags');
  });

  it('validates the stdin text as the command payload', async () => {
    const notObject = captureIo('[1]');
    expect(await runSkillAdvisorCli(['advisor_recommend', '--json', '-', '--format', 'json'], notObject)).toBe(64);
    expect(notObject.stderrText()).toContain('--json must be a JSON object');

    const unknownKey = captureIo('{"prompt":"x","bogus":1}');
    expect(await runSkillAdvisorCli(['advisor_recommend', '--json', '-', '--format', 'json'], unknownKey)).toBe(64);
    expect(unknownKey.stderrText()).toContain('bogus');
  });
});
