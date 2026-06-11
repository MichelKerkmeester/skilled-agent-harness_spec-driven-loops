import { describe, expect, it } from 'vitest';

import { __testing, runCodeIndexCli } from '../code-index-cli.js';
import { CODE_GRAPH_TOOL_SCHEMAS } from '../tool-schemas.js';

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
  for (const tool of CODE_GRAPH_TOOL_SCHEMAS) {
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

describe('code-index CLI help, aliases, and unknown command recovery', () => {
  it('prints per-command schema help without daemon access', async () => {
    const io = captureIo();

    const exitCode = await runCodeIndexCli(['code_graph_query', '--help'], io);
    const { stdout, stderr } = io.output();

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain('code-index code_graph_query');
    expect(stdout).toContain('Aliases:');
    expect(stdout).toContain('code-graph-query');
    expect(stdout).toContain('codeGraphQuery');
    expect(stdout).toContain('Input schema:');
    expect(stdout).toContain('"operation"');
  });

  it('registers snake, kebab, and camel aliases without collisions', () => {
    const commandMap = __testing.commandMap();

    expect(aliasCollisions()).toEqual([]);
    for (const tool of CODE_GRAPH_TOOL_SCHEMAS) {
      for (const alias of __testing.commandAliases(tool.name)) {
        expect(commandMap.get(alias)?.name).toBe(tool.name);
      }
    }
  });

  it('adds camel aliases to list-tools while preserving the 8-tool count', async () => {
    const io = captureIo();

    const exitCode = await runCodeIndexCli(['list-tools', '--format', 'json'], io);
    const payload = JSON.parse(io.output().stdout) as {
      readonly data: { readonly count: number; readonly tools: Array<{ readonly name: string; readonly camelCommand?: string }> };
    };

    expect(exitCode).toBe(0);
    expect(payload.data.count).toBe(8);
    expect(payload.data.tools.find((tool) => tool.name === 'code_graph_query')?.camelCommand).toBe('codeGraphQuery');
  });

  it('returns a list-tools hint and closest command suggestion for unknown commands', async () => {
    const io = captureIo();

    const exitCode = await runCodeIndexCli(['code_graph_qery', '--format', 'json'], io);
    const payload = JSON.parse(io.output().stderr) as { readonly hint?: string; readonly suggestion?: string };

    expect(exitCode).toBe(__testing.EXIT_USAGE);
    expect(payload.hint).toBe('Try `list-tools` to see available commands.');
    expect(payload.suggestion).toBe('code_graph_query');
  });
});
