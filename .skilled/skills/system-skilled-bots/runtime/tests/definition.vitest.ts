import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { executorConfigSchema } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { DEFAULT_BUDGET, DEFAULT_RUNTIME, checkExecutorBounds, parseDefinition, readDefinition, resolveIsolation } from '../lib/definition.js';
import { defaultRepoConfig } from '../lib/repo-config.js';

const FIXTURES = join(import.meta.dirname, 'fixtures');
const TEMPLATE = join(import.meta.dirname, '..', '..', 'assets', 'bot-template.txt');

function fixture(name: string) {
  return readDefinition(join(FIXTURES, name));
}

describe('worked shapes', () => {
  it('parses the scheduled deep review', () => {
    const result = fixture('scheduled-deep-review.md');
    if (!result.ok) throw new Error(result.reason);
    expect(result.value.trigger).toEqual({ kind: 'cron', expression: '0 9 * * 1-5' });
    expect(result.value.runtime).toEqual({ kind: 'cli-opencode', model: 'deepseek-v4-flash' });
    expect(result.value.budget).toEqual({ ...DEFAULT_BUDGET, maxIterations: 6 });
    expect(result.value.enabled).toBe(true);
    expect(result.value.delivery).toEqual({ mode: 'targets', targets: [], onFailure: null });
  });

  it('parses the queued event with its precheck', () => {
    const result = fixture('queued-event.md');
    if (!result.ok) throw new Error(result.reason);
    expect(result.value.trigger).toEqual({ kind: 'queue', name: 'review' });
    expect(result.value.precheck).toBe('git diff --quiet HEAD~1 || echo changed');
  });

  it('parses the manual bot with every default', () => {
    const result = fixture('manual.md');
    if (!result.ok) throw new Error(result.reason);
    expect(result.value).toEqual({
      id: 'tidy-notes',
      trigger: { kind: 'manual' },
      routine: null,
      runtime: { kind: 'native' },
      budget: DEFAULT_BUDGET,
      enabled: true,
      memory: true,
      skills: [],
      delivery: { mode: 'targets', targets: [], onFailure: null },
      posture: { isolation: null, sandbox: null, secrets: null, apps: null },
      precheck: null,
      specFolder: null,
      body: 'Tidy the notes folder when asked.',
    });
  });

  it('carries the routine block and derives the trigger', () => {
    const text = [
      '---',
      'id: nightly-report',
      'routine:',
      '  what: the nightly report',
      '  starts:',
      '    - {kind: cron, expression: "0 2 * * *"}',
      '  does: act',
      '  until: the report is filed',
      '  until_check: test -f reports/nightly.md',
      'runtime: {kind: cli-codex}',
      'isolation: shared',
      '---',
      'Write the nightly report.',
    ].join('\n');

    const result = parseDefinition(text);
    if (!result.ok) throw new Error(result.reason);
    expect(result.value.trigger).toEqual({ kind: 'cron', expression: '0 2 * * *' });
    expect(result.value.routine).toEqual({
      what: 'the nightly report',
      starts: [{ kind: 'cron', expression: '0 2 * * *' }],
      does: 'act',
      until: 'the report is filed',
      untilCheck: 'test -f reports/nightly.md',
    });
    expect(result.value.delivery).toEqual({ mode: 'targets', targets: [], onFailure: null });

    const conflicted = text.replace('id: nightly-report', 'id: nightly-report\ntrigger: {kind: manual}');
    expect(parseDefinition(conflicted)).toMatchObject({ ok: false, reason: 'routine-trigger-conflict' });

    const told = parseDefinition(text.replace('does: act', 'does: tell'));
    if (!told.ok) throw new Error(told.reason);
    expect(told.value.delivery).toEqual({ mode: 'local-only' });
  });
});

describe('rejected definitions', () => {
  it('names each defect', () => {
    expect(fixture('missing-id.md')).toMatchObject({ ok: false, reason: 'missing-id' });
    expect(fixture('missing-trigger.md')).toMatchObject({ ok: false, reason: 'missing-trigger' });
    expect(fixture('empty-body.md')).toMatchObject({ ok: false, reason: 'empty-body' });
    expect(fixture('unknown-key.md')).toMatchObject({ ok: false, reason: 'unknown-key', detail: 'isolaton' });
  });

  it('checks each trigger kind against its own fields', () => {
    const bot = (trigger: string) => `---\nid: b\ntrigger: ${trigger}\n---\nbody\n`;
    expect(parseDefinition(bot('{kind: webhook}'))).toMatchObject({ reason: 'trigger-kind-invalid' });
    expect(parseDefinition(bot('{kind: cron}'))).toMatchObject({ reason: 'trigger-expression-missing' });
    expect(parseDefinition(bot('{kind: queue, name: "../x"}'))).toMatchObject({ reason: 'trigger-name-invalid' });
    expect(parseDefinition(bot('{kind: manual, expression: "* * * * *"}'))).toMatchObject({
      reason: 'unknown-key',
      detail: 'trigger.expression',
    });
    expect(parseDefinition(bot('{kind: git-hook}'))).toMatchObject({ ok: true });
  });

  it('never throws on bad input', () => {
    expect(parseDefinition('no frontmatter')).toMatchObject({ ok: false, reason: 'missing-frontmatter' });
    expect(parseDefinition('---\nid: [unclosed\n---\nbody')).toMatchObject({ ok: false, reason: 'frontmatter-invalid' });
    expect(parseDefinition('---\n- a list\n---\nbody')).toMatchObject({ ok: false, reason: 'frontmatter-invalid' });
    expect(readDefinition(join(FIXTURES, 'absent.md'))).toMatchObject({ ok: false, reason: 'definition-unreadable' });
  });

  it('validates delivery, budget and posture values', () => {
    const bot = (extra: string) => `---\nid: b\ntrigger: {kind: manual}\n${extra}\n---\nbody\n`;
    expect(parseDefinition(bot('delivery: local-only'))).toMatchObject({ ok: true, value: { delivery: { mode: 'local-only' } } });
    expect(parseDefinition(bot('delivery: {targets: [desktop], onFailure: [desktop, slack]}'))).toMatchObject({
      ok: true,
      value: { delivery: { mode: 'targets', targets: ['desktop'], onFailure: ['desktop', 'slack'] } },
    });
    expect(parseDefinition(bot('delivery: {to: [desktop]}'))).toMatchObject({ reason: 'unknown-key', detail: 'delivery.to' });
    expect(parseDefinition(bot('budget: {maxIterations: 0}'))).toMatchObject({ reason: 'budget.maxIterations-invalid' });
    expect(parseDefinition(bot('isolation: sometimes'))).toMatchObject({ reason: 'isolation-invalid' });
    expect(parseDefinition(bot('enabled: "no"'))).toMatchObject({ reason: 'enabled-invalid' });
    expect(parseDefinition(bot('version: 1.0.0.0'))).toMatchObject({ ok: true });
    expect(parseDefinition(bot('version: 2'))).toMatchObject({ reason: 'version-invalid' });
  });
});

describe('resolveIsolation', () => {
  const manual = () => {
    const result = fixture('manual.md');
    if (!result.ok) throw new Error(result.reason);
    return result.value;
  };

  it('refuses when neither the definition nor the config declares isolation', () => {
    expect(resolveIsolation(manual(), defaultRepoConfig())).toEqual({ ok: false, reason: 'isolation-undeclared' });
  });

  it('takes the repository default, and the definition over it', () => {
    const config = { ...defaultRepoConfig(), defaultIsolation: 'shared' as const };
    expect(resolveIsolation(manual(), config)).toEqual({ ok: true, value: 'shared' });
    const declared = { ...manual(), posture: { isolation: 'worktree' as const, sandbox: null, secrets: null, apps: null } };
    expect(resolveIsolation(declared, config)).toEqual({ ok: true, value: 'worktree' });
  });
});

describe('author template', () => {
  it('parses once its placeholder id is filled', () => {
    const text = readFileSync(TEMPLATE, 'utf8').replace('id: <your-bot-id>', 'id: example-bot');
    const result = parseDefinition(text);
    if (!result.ok) throw new Error(`${result.reason} ${result.detail ?? ''}`);
    expect(result.value.id).toBe('example-bot');
  });

  it('fails as written, so an unfilled template never runs', () => {
    expect(parseDefinition(readFileSync(TEMPLATE, 'utf8'))).toMatchObject({ ok: false, reason: 'id-invalid' });
  });
});

describe('checkExecutorBounds', () => {
  // Read from the executor schema so the test follows the executor's own bound.
  const ceiling = (executorConfigSchema.shape.timeoutSeconds.unwrap() as unknown as { maxValue: number }).maxValue;

  it('accepts the default runtime and budget', () => {
    expect(checkExecutorBounds({ runtime: { ...DEFAULT_RUNTIME }, budget: { ...DEFAULT_BUDGET } })).toEqual({ ok: true, value: null });
  });

  it('refuses an unknown executor kind and a timeout one past the executor ceiling', () => {
    expect(checkExecutorBounds({ runtime: { kind: 'cli-unknown' }, budget: { ...DEFAULT_BUDGET } }))
      .toMatchObject({ ok: false, reason: 'runtime-kind-unknown' });
    expect(Number.isInteger(ceiling)).toBe(true);
    expect(checkExecutorBounds({ runtime: { ...DEFAULT_RUNTIME }, budget: { ...DEFAULT_BUDGET, timeoutSeconds: ceiling } }).ok).toBe(true);
    expect(checkExecutorBounds({ runtime: { ...DEFAULT_RUNTIME }, budget: { ...DEFAULT_BUDGET, timeoutSeconds: ceiling + 1 } }))
      .toMatchObject({ ok: false, reason: 'budget.timeoutSeconds-out-of-bounds' });
  });
});

describe('memory key', () => {
  it('boolean', () => {
    // A cli runtime keeps the memory key the only thing the definition varies.
    const bot = (...lines: string[]) =>
      ['---', 'id: b', 'trigger: {kind: manual}', 'runtime: {kind: cli-codex}', ...lines, '---', 'body', ''].join('\n');

    const absent = parseDefinition(bot());
    if (!absent.ok) throw new Error(absent.reason);
    expect(absent.value.memory).toBe(true);

    const off = parseDefinition(bot('memory: false'));
    if (!off.ok) throw new Error(off.reason);
    expect(off.value.memory).toBe(false);

    const on = parseDefinition(bot('memory: true'));
    if (!on.ok) throw new Error(on.reason);
    expect(on.value.memory).toBe(true);

    expect(parseDefinition(bot('memory: maybe'))).toMatchObject({ ok: false, reason: 'memory-invalid' });
    expect(parseDefinition(bot('memory: 1'))).toMatchObject({ reason: 'memory-invalid' });
  });
});

describe('parseDefinition', () => {
  // A cli runtime keeps the skills key the only thing the definition varies.
  const bot = (...lines: string[]) =>
    ['---', 'id: b', 'trigger: {kind: manual}', 'runtime: {kind: cli-codex}', ...lines, '---', 'body', ''].join('\n');

  it('carries the skills list', () => {
    const one = parseDefinition(bot('skills: [sk-code]'));
    if (!one.ok) throw new Error(one.reason);
    expect(one.value.skills).toEqual(['sk-code']);

    const two = parseDefinition(bot('skills: [sk-code, sk-doc]'));
    if (!two.ok) throw new Error(two.reason);
    expect(two.value.skills).toEqual(['sk-code', 'sk-doc']);
  });

  it('defaults skills to an empty list', () => {
    const absent = parseDefinition(bot());
    if (!absent.ok) throw new Error(absent.reason);
    expect(absent.value.skills).toEqual([]);

    const empty = parseDefinition(bot('skills: []'));
    if (!empty.ok) throw new Error(empty.reason);
    expect(empty.value.skills).toEqual([]);
  });

  it('refuses a skills value that is not a list', () => {
    expect(parseDefinition(bot('skills: sk-code'))).toMatchObject({
      ok: false,
      reason: 'skills-name-invalid',
      detail: 'not a list',
    });
    expect(parseDefinition(bot('skills: [sk-code, sk-code]'))).toMatchObject({ ok: false, reason: 'skills-duplicate' });
    expect(parseDefinition(bot('skills: [Sk-Code]'))).toMatchObject({ ok: false, reason: 'skills-name-invalid' });
  });
});
