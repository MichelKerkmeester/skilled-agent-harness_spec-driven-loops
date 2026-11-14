// ───────────────────────────────────────────────────────────────────
// MODULE: Executor Branch Contract
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { EXECUTOR_KINDS, executorConfigSchema } from '../../lib/deep-loop/executor-config.js';

const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');
const DISPATCH_SCRIPT = resolve(__dirname, '..', '..', 'scripts', 'dispatch-iteration.cjs');
const WORKFLOW_YAMLS = [
  'deep-research.yaml',
  'deep-review.yaml',
];
const EXECUTOR_FIELDS = Object.keys(executorConfigSchema.shape);
const EXECUTOR_BRANCHES = [
  'if_native',
  'if_cli_claude_code',
  'if_cli_codex',
  'if_cli_cursor',
  'if_cli_devin',
  'if_cli_pi',
  'if_cli_opencode',
  'if_cli_deepseek_harness',
] as const;

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

function stepText(yaml: string, step: string): string {
  const start = yaml.indexOf(`      ${step}:\n`);
  if (start === -1) return '';
  const rest = yaml.slice(start + 1);
  const end = rest.search(/\n      step_[a-z_]+:\n/);
  return end === -1 ? rest : rest.slice(0, end);
}

function branchOccurrences(step: string, branch: string): number {
  return [...step.matchAll(new RegExp(`^\\s*${branch}:\\s*$`, 'gm'))].length;
}

function branchBody(step: string, branch: string): string {
  const lines = step.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^\\s*${branch}:\\s*$`).test(line));
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

  it('defines each executor branch exactly once inside step_dispatch_iteration', () => {
    for (const [file, yaml] of workflows) {
      const step = stepText(yaml, 'step_dispatch_iteration');
      expect(step.length, file).toBeGreaterThan(0);
      expect(
        EXECUTOR_BRANCHES.filter((branch) => branchOccurrences(step, branch) !== 1),
        file,
      ).toEqual([]);
    }
    expect(branchOccurrences('if_cli_codex:\n        if_cli_codex:\n', 'if_cli_codex')).toBe(2);
  });

  it('routes the OpenCode branch through dispatch-iteration.cjs', () => {
    for (const [file, yaml] of workflows) {
      const step = stepText(yaml, 'step_dispatch_iteration');
      expect(branchBody(step, 'if_cli_opencode'), file)
        .toContain('dispatch-iteration.cjs --executor cli-opencode');
    }
  });

  it('builds lineage commands through buildLineageCommand in dispatch-iteration.cjs', () => {
    expect(readFileSync(DISPATCH_SCRIPT, 'utf8')).toContain('buildLineageCommand');
  });
});
