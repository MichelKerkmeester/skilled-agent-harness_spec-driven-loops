// ───────────────────────────────────────────────────────────────────
// MODULE: Executor Branch Contract
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { EXECUTOR_KINDS, executorConfigSchema } from '../../lib/deep-loop/executor-config.js';

const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');
const WORKFLOW_YAMLS = [
  'deep-research-auto.yaml',
  'deep-research-confirm.yaml',
  'deep-review-auto.yaml',
  'deep-review-confirm.yaml',
];
const EXECUTOR_FIELDS = Object.keys(executorConfigSchema.shape);

function unknownBranchKinds(yaml: string): string[] {
  return [...new Set([...yaml.matchAll(/^\s*if_cli_([a-z0-9_]+):/gm)]
    .map((match) => `cli-${match[1].replaceAll('_', '-')}`)
    .filter((kind) => !EXECUTOR_KINDS.includes(kind as typeof EXECUTOR_KINDS[number])))];
}

function unknownExecutorFields(yaml: string, fields: readonly string[]): string[] {
  return [...new Set([...yaml.matchAll(/config\.executor\.([A-Za-z][\w]*)/g)]
    .map((match) => match[1])
    .filter((field) => !fields.includes(field)))];
}

function rejectedPureFlags(yaml: string): string[] {
  return [...yaml.matchAll(/\B--pure\b/g)].map(() => '--pure');
}

function missingNonNativeBranches(yaml: string, kinds: readonly string[]): string[] {
  const branches = new Set([...yaml.matchAll(/^\s*if_cli_([a-z0-9_]+):/gm)]
    .map((match) => `cli-${match[1].replaceAll('_', '-')}`));
  return kinds.filter((kind) => kind !== 'native' && !branches.has(kind));
}

function opencodeBranchesMissingBuilder(yaml: string): number[] {
  const lines = yaml.split(/\r?\n/);
  const missing: number[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const branch = /^(\s*)if_cli_opencode:\s*$/.exec(lines[index]);
    if (!branch) continue;
    const indent = branch[1].length;
    let end = index + 1;
    while (end < lines.length) {
      const line = lines[end];
      if (line.trim() && /^\s*/.exec(line)![0].length <= indent) break;
      end += 1;
    }
    if (!lines.slice(index + 1, end).join('\n').includes('buildLineageCommand')) missing.push(index + 1);
  }
  return missing;
}

const DSH_SINGLE_BRANCH_TOKENS = [
  'buildLineageCommand',
  'DSH_HOME',
  'SYSTEM_SPEC_GATE_DISABLED',
  'REPOSITORY ROOT',
  'validateDshCompletion',
];

// A branch body runs from its key to the next line at the same or a shallower indent.
function dshSingleBranchText(yaml: string): string {
  const lines = yaml.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*if_cli_deepseek_harness:\s*$/.test(line));
  if (start === -1) return '';
  const indent = /^\s*/.exec(lines[start])![0].length;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line.trim() && /^\s*/.exec(line)![0].length <= indent) break;
    end += 1;
  }
  return lines.slice(start + 1, end).join('\n');
}

function dshSingleBranchGaps(yaml: string): string[] {
  const body = dshSingleBranchText(yaml);
  if (body === '') return ['if_cli_deepseek_harness'];
  // The ancestry recursion guard reads the parent shell's command line, which carries
  // the heredoc text, so a bare harness binary word there refuses the dispatch as nested.
  const bareBinary = body
    .split(/\s+/)
    .map((token) => token.replace(/^['"]|['"]$/g, ''))
    .some((token) => token.split('/').pop() === 'dsh');
  return [
    ...DSH_SINGLE_BRANCH_TOKENS.filter((token) => !body.includes(token)),
    ...(bareBinary ? ['bare dsh word'] : []),
  ];
}

function readWorkflows(): Map<string, string> {
  return new Map(WORKFLOW_YAMLS.map((file) => [file, readFileSync(resolve(ASSETS, file), 'utf8')]));
}

describe('deep-loop executor branch contract', () => {
  const workflows = readWorkflows();

  it('uses only admitted executor kinds for CLI branch keys', () => {
    for (const yaml of workflows.values()) expect(unknownBranchKinds(yaml)).toEqual([]);
    expect(unknownBranchKinds('if_cli_copilot:\n  command: copilot')).toEqual(['cli-copilot']);
  });

  it('references only executor fields declared by the schema', () => {
    for (const yaml of workflows.values()) expect(unknownExecutorFields(yaml, EXECUTOR_FIELDS)).toEqual([]);
    expect(unknownExecutorFields('value: "{config.executor.type}"', EXECUTOR_FIELDS)).toEqual(['type']);
  });

  it('does not pass OpenCode the rejected --pure flag', () => {
    for (const yaml of workflows.values()) expect(rejectedPureFlags(yaml)).toEqual([]);
    expect(rejectedPureFlags('command: opencode --pure')).toEqual(['--pure']);
  });

  it('includes each non-native executor branch in both auto workflows', () => {
    for (const file of ['deep-research-auto.yaml', 'deep-review-auto.yaml']) {
      expect(missingNonNativeBranches(workflows.get(file)!, EXECUTOR_KINDS)).toEqual([]);
    }
    expect(missingNonNativeBranches('if_cli_codex:\n', ['native', 'cli-codex', 'cli-cursor']))
      .toEqual(['cli-cursor']);
  });

  it('builds OpenCode dispatch commands through buildLineageCommand', () => {
    for (const yaml of workflows.values()) expect(opencodeBranchesMissingBuilder(yaml)).toEqual([]);
    expect(opencodeBranchesMissingBuilder('if_cli_opencode:\n  command: opencode run\n'))
      .toEqual([1]);
  });

  it('runs a single cli-deepseek-harness lineage through the shared builder in both auto workflows', () => {
    for (const file of ['deep-research-auto.yaml', 'deep-review-auto.yaml']) {
      const yaml = workflows.get(file)!;
      // Other kinds may still refuse a single lineage. Only the harness refusal must be gone.
      expect(yaml).not.toContain('cli-deepseek-harness runs only as a fan-out lineage');
      expect(dshSingleBranchGaps(yaml)).toEqual([]);
    }
    expect(dshSingleBranchGaps('if_cli_deepseek_harness:\n  command: dsh\nif_cli_pi:\n  DSH_HOME\n'))
      .toEqual([...DSH_SINGLE_BRANCH_TOKENS, 'bare dsh word']);
  });

  it('sweeps stale harness homes before it mints a new one in both auto workflows', () => {
    for (const file of ['deep-research-auto.yaml', 'deep-review-auto.yaml']) {
      const body = dshSingleBranchText(workflows.get(file)!);
      const sweepAt = body.indexOf('sweepStaleDshHomes();');
      const mintAt = body.indexOf("mkdtempSync(path.join(os.tmpdir(), 'dsh-home-'))");
      expect(sweepAt, file).toBeGreaterThanOrEqual(0);
      expect(mintAt, file).toBeGreaterThan(sweepAt);
      expect(body, file).toMatch(/sweepStaleDshHomes\(\);\n\s+const dshHome = mkdtempSync/);
    }
    expect(dshSingleBranchText('if_cli_deepseek_harness:\n  command: buildLineageCommand\nif_cli_pi:\n'))
      .not.toContain('sweepStaleDshHomes');
  });

  it('passes echoStdout false so the harness event stream is counted rather than echoed', () => {
    for (const file of ['deep-research-auto.yaml', 'deep-review-auto.yaml']) {
      const body = dshSingleBranchText(workflows.get(file)!);
      expect(body, file).toContain('echoStdout: false');
      expect(body, file).toMatch(/completionCheck: validateDshCompletion,\n\s+echoStdout: false,/);
    }
    expect(dshSingleBranchText('if_cli_deepseek_harness:\n  command: buildLineageCommand\nif_cli_pi:\n'))
      .not.toContain('echoStdout');
  });

  it('refuses a :confirm executor kind that the workflow has no branch for', () => {
    const allowed = ['native', 'cli-claude-code', 'cli-opencode'];
    for (const file of ['deep-research-confirm.yaml', 'deep-review-confirm.yaml']) {
      const yaml = workflows.get(file)!;
      const guard = /unsupported_executor_guard:\s*\n\s*skip_when: "([^"]+)"\s*\n\s*message: "([^"]+)"\s*\n\s*exit_code: 2\s*\n\s*halt: true/.exec(yaml);
      expect(guard, file).not.toBeNull();
      expect(guard![1], file).toBe("config.executor.kind in ['native', 'cli-claude-code', 'cli-opencode']");
      for (const kind of allowed) expect(guard![1], file).toContain(`'${kind}'`);
      expect(guard![2], file).toContain('UNSUPPORTED_EXECUTOR');
      expect(guard![2], file).toContain(':auto');
    }
    expect(/unsupported_executor_guard:/.test('if_cli_codex:\n  command: codex\n')).toBe(false);
  });
});
