import { describe, expect, it } from 'vitest';

import { __testing, runSpecMemoryCli } from '../spec-memory-cli.js';
import { TOOL_DEFINITIONS } from '../tool-schemas.js';

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
  for (const tool of TOOL_DEFINITIONS) {
    for (const alias of __testing.commandAliases(tool.name)) {
      const existing = seen.get(alias);
      if (existing && existing !== tool.name) {
        collisions.push(`${alias}: ${existing}, ${tool.name}`);
      }
      seen.set(alias, tool.name);
    }
  }
  return collisions;
}

describe('spec-memory CLI help, aliases, and unknown command recovery', () => {
  it('prints per-command schema help without daemon access', async () => {
    const io = captureIo();

    const exitCode = await runSpecMemoryCli(['memory_search', '--help'], io);
    const { stdout, stderr } = io.output();

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain('spec-memory memory_search');
    expect(stdout).toContain('Aliases:');
    expect(stdout).toContain('memory-search');
    expect(stdout).toContain('memorySearch');
    expect(stdout).toContain('Input schema:');
    expect(stdout).toContain('"query"');
  });

  it('registers snake, kebab, and camel aliases without collisions', () => {
    const commandMap = __testing.commandMap();

    expect(aliasCollisions()).toEqual([]);
    for (const tool of TOOL_DEFINITIONS) {
      for (const alias of __testing.commandAliases(tool.name)) {
        expect(commandMap.get(alias)?.name).toBe(tool.name);
      }
    }
  });

  it('adds camel aliases to list-tools while preserving the 37-tool count', async () => {
    const io = captureIo();

    const exitCode = await runSpecMemoryCli(['list-tools', '--format', 'json'], io);
    const payload = JSON.parse(io.output().stdout) as {
      readonly data: { readonly count: number; readonly tools: Array<{ readonly name: string; readonly camelCommand?: string }> };
    };

    expect(exitCode).toBe(0);
    expect(payload.data.count).toBe(37);
    expect(payload.data.tools.find((tool) => tool.name === 'memory_search')?.camelCommand).toBe('memorySearch');
  });

  it('returns a list-tools hint and closest command suggestion for unknown commands', async () => {
    const io = captureIo();

    const exitCode = await runSpecMemoryCli(['memory_serch', '--format', 'json'], io);
    const payload = JSON.parse(io.output().stderr) as { readonly hint?: string; readonly suggestion?: string };

    expect(exitCode).toBe(__testing.EXIT_USAGE);
    expect(payload.hint).toBe('Try `list-tools` to see available commands.');
    expect(payload.suggestion).toBe('memory_search');
  });
});
