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
      readonly data: { readonly count: number; readonly tools: Array<{ readonly name: string; readonly camelCommand?: string; readonly inputSchema?: unknown }> };
    };

    expect(exitCode).toBe(0);
    expect(payload.data.count).toBe(8);
    expect(payload.data.tools.find((tool) => tool.name === 'code_graph_query')?.camelCommand).toBe('codeGraphQuery');
    expect(payload.data.tools.find((tool) => tool.name === 'code_graph_query')?.inputSchema).toBeTruthy();
  });

  it('renders compact and names-only list-tools JSON without schemas', async () => {
    const fullIo = captureIo();
    const compactIo = captureIo();
    const namesIo = captureIo();

    await runCodeIndexCli(['list-tools', '--format', 'json'], fullIo);
    const compactExit = await runCodeIndexCli(['list-tools', '--compact'], compactIo);
    const namesExit = await runCodeIndexCli(['list-tools', '--names-only'], namesIo);
    const compact = JSON.parse(compactIo.output().stdout) as {
      readonly data: { readonly count: number; readonly mode: string; readonly tools: Array<{ readonly name: string; readonly description: string; readonly inputSchema?: unknown }> };
    };
    const names = JSON.parse(namesIo.output().stdout) as { readonly data: { readonly count: number; readonly mode: string; readonly names: string[] } };

    expect(compactExit).toBe(0);
    expect(namesExit).toBe(0);
    expect(compact.data.count).toBe(8);
    expect(compact.data.mode).toBe('compact');
    expect(compact.data.tools.find((tool) => tool.name === 'code_graph_query')?.description).toContain('Query structural relationships');
    expect(compact.data.tools.some((tool) => Object.prototype.hasOwnProperty.call(tool, 'inputSchema'))).toBe(false);
    expect(names.data.count).toBe(8);
    expect(names.data.mode).toBe('names-only');
    expect(names.data.names).toContain('code_graph_query');
    expect(compactIo.output().stdout.length).toBeLessThan(fullIo.output().stdout.length / 2);
  });

  it('generates bash and zsh completion from the tool registry', async () => {
    const bashIo = captureIo();
    const zshIo = captureIo();

    const bashExit = await runCodeIndexCli(['completion', 'bash'], bashIo);
    const zshExit = await runCodeIndexCli(['completion', 'zsh'], zshIo);

    expect(bashExit).toBe(0);
    expect(zshExit).toBe(0);
    expect(bashIo.output().stdout).toContain('complete -F _code_index_completion code-index');
    expect(bashIo.output().stdout).toContain('code_graph_query');
    expect(bashIo.output().stdout).toContain('--compact');
    expect(zshIo.output().stdout).toContain('#compdef code-index');
    expect(zshIo.output().stdout).toContain('code_graph_query');
    expect(zshIo.output().stdout).toContain('--names-only');
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
