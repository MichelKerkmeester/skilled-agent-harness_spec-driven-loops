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
    const payload = JSON.parse(io.output().stdout) as {
      readonly data: { readonly count: number; readonly tools: Array<{ readonly name: string; readonly inputSchema?: unknown }> };
    };

    expect(exitCode).toBe(0);
    expect(payload.data.count).toBe(9);
    expect(payload.data.tools.find((tool) => tool.name === 'advisor_recommend')?.inputSchema).toBeTruthy();
  });

  it('renders compact and names-only list-tools JSON without schemas', async () => {
    const fullIo = captureIo();
    const compactIo = captureIo();
    const namesIo = captureIo();

    await runSkillAdvisorCli(['list-tools', '--format', 'json'], fullIo);
    const compactExit = await runSkillAdvisorCli(['list-tools', '--compact'], compactIo);
    const namesExit = await runSkillAdvisorCli(['list-tools', '--names-only'], namesIo);
    const compact = JSON.parse(compactIo.output().stdout) as {
      readonly data: { readonly count: number; readonly mode: string; readonly tools: Array<{ readonly name: string; readonly description: string; readonly inputSchema?: unknown }> };
    };
    const names = JSON.parse(namesIo.output().stdout) as { readonly data: { readonly count: number; readonly mode: string; readonly names: string[] } };

    expect(compactExit).toBe(0);
    expect(namesExit).toBe(0);
    expect(compact.data.count).toBe(9);
    expect(compact.data.mode).toBe('compact');
    expect(compact.data.tools.find((tool) => tool.name === 'advisor_recommend')?.description).toContain('Recommend skills');
    expect(compact.data.tools.some((tool) => Object.prototype.hasOwnProperty.call(tool, 'inputSchema'))).toBe(false);
    expect(names.data.count).toBe(9);
    expect(names.data.mode).toBe('names-only');
    expect(names.data.names).toContain('advisor_recommend');
    expect(compactIo.output().stdout.length).toBeLessThan(fullIo.output().stdout.length / 2);
  });

  it('generates bash and zsh completion from the tool manifest', async () => {
    const bashIo = captureIo();
    const zshIo = captureIo();

    const bashExit = await runSkillAdvisorCli(['completion', 'bash'], bashIo);
    const zshExit = await runSkillAdvisorCli(['completion', 'zsh'], zshIo);

    expect(bashExit).toBe(0);
    expect(zshExit).toBe(0);
    expect(bashIo.output().stdout).toContain('complete -F _skill_advisor_completion skill-advisor');
    expect(bashIo.output().stdout).toContain('advisor_recommend');
    expect(bashIo.output().stdout).toContain('--trusted');
    expect(zshIo.output().stdout).toContain('#compdef skill-advisor');
    expect(zshIo.output().stdout).toContain('advisor_recommend');
    expect(zshIo.output().stdout).toContain('--names-only');
  });

  it('returns a list-tools hint and closest command suggestion for unknown commands', async () => {
    const io = captureIo();

    const exitCode = await runSkillAdvisorCli(['advisor_recomend', '--format', 'json'], io);
    const payload = JSON.parse(io.output().stderr) as { readonly hint?: string; readonly suggestion?: string };

    expect(exitCode).toBe(__testing.EXIT_USAGE);
    expect(payload.hint).toBe('Try `list-tools` to see available commands.');
    expect(payload.suggestion).toBe('advisor_recommend');
  });

  it('accepts advisor_validate outcomeEvents through CLI schema validation', () => {
    expect(() => __testing.validateCommand({
      command: 'advisor_validate',
      format: 'json',
      timeoutMs: 1000,
      warmOnly: false,
      toolListMode: 'full',
      args: {
        confirmHeavyRun: true,
        outcomeEvents: [{
          runtime: 'codex',
          outcome: 'accepted',
          skillId: 'system-spec-kit',
          timestamp: '2026-06-10T00:00:00.000Z',
        }],
      },
      help: false,
      version: false,
      trusted: false,
      promptTime: false,
    })).not.toThrow();
  });
});
