import { describe, expect, it } from 'vitest';

import { __testing, runSkillAdvisorCli } from '../skill-advisor-cli.js';
import { SKILL_ADVISOR_CLI_TOOL_MANIFEST } from '../skill-advisor-cli-manifest.js';

interface CapturedIo {
  readonly stdout: { write: (chunk: string) => boolean };
  readonly stderr: { write: (chunk: string) => boolean };
  readonly output: () => { readonly stdout: string; readonly stderr: string };
}

function captureIo(): CapturedIo {
  let stdout = '';
  let stderr = '';
  return {
    stdout: {
      write(chunk: string): boolean {
        stdout += chunk;
        return true;
      },
    },
    stderr: {
      write(chunk: string): boolean {
        stderr += chunk;
        return true;
      },
    },
    output: () => ({ stdout, stderr }),
  };
}

function aliasCollisions(): string[] {
  const seen = new Map<string, string>();
  const collisions: string[] = [];
  for (const tool of SKILL_ADVISOR_CLI_TOOL_MANIFEST) {
    for (const alias of tool.aliases) {
      const existing = seen.get(alias);
      if (existing && existing !== tool.name) {
        collisions.push(`${alias}: ${existing}, ${tool.name}`);
      }
      seen.set(alias, tool.name);
    }
  }
  return collisions;
}

describe('skill-advisor CLI aliases and unknown command recovery', () => {
  it('keeps per-command schema help available for camel aliases', async () => {
    const io = captureIo();

    const exitCode = await runSkillAdvisorCli(['advisorRecommend', '--help'], io);
    const { stdout, stderr } = io.output();

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain('skill-advisor advisor_recommend');
    expect(stdout).toContain('advisor-recommend');
    expect(stdout).toContain('advisorRecommend');
    expect(stdout).toContain('Input schema:');
    expect(stdout).toContain('"prompt"');
  });

  it('registers snake, kebab, and camel aliases without collisions', () => {
    const commandMap = __testing.commandMap();

    expect(aliasCollisions()).toEqual([]);
    for (const tool of SKILL_ADVISOR_CLI_TOOL_MANIFEST) {
      for (const alias of tool.aliases) {
        expect(commandMap.get(alias)?.name).toBe(tool.name);
      }
    }
  });

  it('preserves the 9-tool list-tools count', async () => {
    const io = captureIo();

    const exitCode = await runSkillAdvisorCli(['list-tools', '--format', 'json'], io);
    const payload = JSON.parse(io.output().stdout) as { readonly data: { readonly count: number } };

    expect(exitCode).toBe(0);
    expect(payload.data.count).toBe(9);
  });

  it('returns a list-tools hint and closest command suggestion for unknown commands', async () => {
    const io = captureIo();

    const exitCode = await runSkillAdvisorCli(['advisor_recomend', '--format', 'json'], io);
    const payload = JSON.parse(io.output().stderr) as { readonly hint?: string; readonly suggestion?: string };

    expect(exitCode).toBe(__testing.EXIT_USAGE);
    expect(payload.hint).toBe('Try `list-tools` to see available commands.');
    expect(payload.suggestion).toBe('advisor_recommend');
  });
});
