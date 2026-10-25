// ───────────────────────────────────────────────────────────────────
// MODULE: Placeholder Token Gate
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

// Every path below is derived from this file's own location, so the test always
// exercises the checkout it sits in and never a linked copy of another one.
const here = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(here, '..');
const runtimeRoot = path.resolve(cliRoot, '..');
const validateScript = path.join(cliRoot, 'spec', 'validate.sh');
const shellRule = path.join(cliRoot, 'rules', 'check-placeholders.sh');
const fixturesRoot = path.join(cliRoot, 'test-fixtures');
const createdRoots = new Set<string>();

type RuleStatus = 'pass' | 'warn' | 'error';

interface RuleEntry {
  rule: string;
  status: RuleStatus;
  message: string;
  details: string[];
}

interface PacketShape {
  stamp: 'v2.2' | 'v2.3';
  status: 'Draft' | 'Complete' | 'In Progress' | 'Implemented' | 'Implementing' | 'Not implemented';
  line: string;
  title?: string;
}

const TOKEN_LINE = '[YOUR_VALUE_HERE: one-paragraph problem statement]';
const QUESTION_LINE = '[NEEDS CLARIFICATION: which owner?]';
const FIXTURE_TITLE = 'title: "Feature Specification: Template Compliant Level 2 Fixture"';

// Builds a throwaway packet from the clean Level 2 fixture. Only spec.md is
// changed: the stamp, the Status cell, one extra block in the problem section
// and, when a shape asks for it, the frontmatter title.
function buildPacket(shape: PacketShape): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'placeholder-token-gate-'));
  createdRoots.add(root);
  const folder = path.join(root, 'packet');
  fs.cpSync(path.join(fixturesRoot, '053-template-compliant-level2'), folder, { recursive: true });
  const spec = path.join(folder, 'spec.md');
  const text = fs
    .readFileSync(spec, 'utf8')
    .replace('| v2.2 -->', `| ${shape.stamp} -->`)
    .replace('| **Status** | Complete |', `| **Status** | ${shape.status} |`)
    .replace(FIXTURE_TITLE, shape.title ?? FIXTURE_TITLE)
    .replace('### Purpose', `${shape.line}\n\n### Purpose`);
  fs.writeFileSync(spec, text, 'utf8');
  return folder;
}

function runOrchestrator(folder: string): { entry: RuleEntry; passed: boolean } {
  const result = spawnSync('bash', [validateScript, folder, '--no-recursive', '--strict', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_RULES: 'PLACEHOLDER_FILLED' },
  });
  const report = JSON.parse(result.stdout) as { entries: RuleEntry[]; passed: boolean };
  const matches = report.entries.filter((item) => item.rule === 'PLACEHOLDER_FILLED');
  if (matches.length !== 1) throw new Error(`expected one PLACEHOLDER_FILLED entry, found ${matches.length}`);
  return { entry: matches[0], passed: report.passed };
}

// The shell rule is the mirror the isolated rule tests drive. It reports fail
// where the orchestrator reports error, so the two are compared after that mapping.
function runShellRule(folder: string): RuleStatus {
  const script = `source "${path.join(cliRoot, 'lib', 'shell-common.sh')}"; source "${shellRule}"; run_check "${folder}" 2; echo "$RULE_STATUS"`;
  const result = spawnSync('bash', ['-c', script], { encoding: 'utf8' });
  const status = result.stdout.trim().split('\n').pop();
  return status === 'fail' ? 'error' : (status as RuleStatus);
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('PLACEHOLDER_FILLED token gate', () => {
  it('runs the orchestrator built from this checkout', () => {
    const built = path.join(runtimeRoot, 'dist', 'lib', 'validation', 'orchestrator.js');
    const resolved = fs.realpathSync(built);
    const home = fs.realpathSync(runtimeRoot) + path.sep;
    expect(resolved.startsWith(home), `${built} resolves to ${resolved}, outside ${home}`).toBe(true);
  });

  it('warns on a v2.3 doc with an unfilled token while the packet is a Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Draft', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('warn');
    expect(passed).toBe(true);
    expect(entry.details.some((detail) => detail.startsWith('spec.md:'))).toBe(true);
    expect(runShellRule(folder)).toBe('warn');
  });

  it('fails a v2.3 doc with an unfilled token once the status is not Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Complete', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(passed).toBe(false);
    expect(runShellRule(folder)).toBe('error');
  });

  it('keeps the strict verdict for a v2.2 doc even while the packet is a Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.2', status: 'Draft', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(passed).toBe(false);
    expect(runShellRule(folder)).toBe('error');
  });

  it('never defers an open question, even in a v2.3 Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Draft', line: QUESTION_LINE });
    const { entry } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(runShellRule(folder)).toBe('error');
  });

  it('fails an in-progress v2.3 line that quotes a token and then leaves one unfilled', { timeout: 30_000 }, () => {
    const mixed = 'Example `[YOUR_VALUE_HERE: example]` then Owner: [YOUR_VALUE_HERE: owner name]';
    const unfilled = runOrchestrator(buildPacket({ stamp: 'v2.3', status: 'In Progress', line: mixed }));
    expect(unfilled.entry.status).toBe('error');
    expect(unfilled.passed).toBe(false);

    const filled = 'Example `[YOUR_VALUE_HERE: example]` then Owner: the platform team';
    const done = runOrchestrator(buildPacket({ stamp: 'v2.3', status: 'In Progress', line: filled }));
    expect(done.entry.status).toBe('pass');
  });
});

// Every marker shape the two implementations read, at both stamps and both
// lifecycle states. A v2.3 doc gets the code-span, fence, all-matches and
// title rules in both implementations, so its verdicts must agree. A v2.2 doc
// keeps the verdict each implementation always gave it, including the shapes
// where the two disagree, so an older packet's result never moves.
type Verdicts = { orchestrator: RuleStatus; shell: RuleStatus };
type Shape = {
  name: string;
  line: string;
  title?: string;
  v23: { Draft: RuleStatus; Complete: RuleStatus };
  v22: Verdicts;
};

const TOKEN = '[YOUR_VALUE_HERE: owner name]';
const SHAPES: Shape[] = [
  { name: 'a bare token', line: `Owner: ${TOKEN}`, v23: { Draft: 'warn', Complete: 'error' }, v22: { orchestrator: 'error', shell: 'error' } },
  { name: 'a backticked token', line: `Example: \`${TOKEN}\``, v23: { Draft: 'pass', Complete: 'pass' }, v22: { orchestrator: 'pass', shell: 'pass' } },
  {
    name: 'a backticked token then a bare one',
    line: `Example \`[YOUR_VALUE_HERE: example]\` then Owner: ${TOKEN}`,
    v23: { Draft: 'warn', Complete: 'error' },
    v22: { orchestrator: 'pass', shell: 'pass' },
  },
  {
    name: 'a token inside a longer code span',
    line: `Run \`create.sh --owner ${TOKEN} --force\` first`,
    v23: { Draft: 'pass', Complete: 'pass' },
    v22: { orchestrator: 'error', shell: 'error' },
  },
  { name: 'a backtick fence', line: ['```text', `Owner: ${TOKEN}`, '```'].join('\n'), v23: { Draft: 'pass', Complete: 'pass' }, v22: { orchestrator: 'pass', shell: 'pass' } },
  { name: 'a tilde fence', line: ['~~~text', `Owner: ${TOKEN}`, '~~~'].join('\n'), v23: { Draft: 'pass', Complete: 'pass' }, v22: { orchestrator: 'error', shell: 'error' } },
  { name: 'an indented fence', line: ['   ```text', `   Owner: ${TOKEN}`, '   ```'].join('\n'), v23: { Draft: 'pass', Complete: 'pass' }, v22: { orchestrator: 'pass', shell: 'error' } },
  { name: 'the angle-bracket form', line: 'Owner: <YOUR_VALUE_HERE: owner name>', v23: { Draft: 'error', Complete: 'error' }, v22: { orchestrator: 'error', shell: 'pass' } },
  {
    name: 'a [template: title',
    line: 'The problem is stated below.',
    title: 'title: "Feature Specification: Fixture [template:level_2/spec.md]"',
    v23: { Draft: 'error', Complete: 'error' },
    v22: { orchestrator: 'pass', shell: 'error' },
  },
];

describe('PLACEHOLDER_FILLED parity matrix', () => {
  for (const shape of SHAPES) {
    for (const status of ['Draft', 'Complete'] as const) {
      it(`v2.3 ${status}: ${shape.name} gives ${shape.v23[status]} in both`, { timeout: 30_000 }, () => {
        const folder = buildPacket({ stamp: 'v2.3', status, line: shape.line, title: shape.title });
        expect(runOrchestrator(folder).entry.status).toBe(shape.v23[status]);
        expect(runShellRule(folder)).toBe(shape.v23[status]);
      });

      it(`v2.2 ${status}: ${shape.name} keeps its earlier verdicts`, { timeout: 30_000 }, () => {
        const folder = buildPacket({ stamp: 'v2.2', status, line: shape.line, title: shape.title });
        expect(runOrchestrator(folder).entry.status).toBe(shape.v22.orchestrator);
        expect(runShellRule(folder)).toBe(shape.v22.shell);
      });
    }
  }
});

// The implemented words sit in the complete bucket unless "not" comes first. As
// the only Status row each is a value other than Draft. As a later table's row
// under a Draft first row, a complete one wins over Draft and the negated one
// does not, so both implementations must classify the word the same way.
const IMPLEMENTED_STATUSES: { status: 'Implemented' | 'Implementing' | 'Not implemented'; laterRow: RuleStatus }[] = [
  { status: 'Implemented', laterRow: 'error' },
  { status: 'Implementing', laterRow: 'error' },
  { status: 'Not implemented', laterRow: 'warn' },
];

describe('PLACEHOLDER_FILLED parity matrix, implemented statuses', () => {
  for (const { status, laterRow } of IMPLEMENTED_STATUSES) {
    it(`v2.3 ${status} as the only Status row gives error in both`, { timeout: 30_000 }, () => {
      const folder = buildPacket({ stamp: 'v2.3', status, line: `Owner: ${TOKEN}` });
      expect(runOrchestrator(folder).entry.status).toBe('error');
      expect(runShellRule(folder)).toBe('error');
    });

    it(`v2.3 ${status} in a later table under a Draft row gives ${laterRow} in both`, { timeout: 30_000 }, () => {
      const table = ['| Field | Value |', '| --- | --- |', `| **Status** | ${status} |`].join('\n');
      const folder = buildPacket({ stamp: 'v2.3', status: 'Draft', line: `Owner: ${TOKEN}\n\n${table}` });
      expect(runOrchestrator(folder).entry.status).toBe(laterRow);
      expect(runShellRule(folder)).toBe(laterRow);
    });
  }
});
