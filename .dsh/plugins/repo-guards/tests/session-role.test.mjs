import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { isLineageLeaf } from '../adapters/session-role.mjs';
import { ADVISOR_RUNTIME, registerPromptAdvisor, runAdvisor } from '../adapters/prompt-advisor.mjs';
import { apply as applyLineageLeaf, name as lineageLeafName } from '../lineage-leaf.mjs';
import {
  disabled,
  enabled,
  fakeAgent,
  humanMessage,
  interactive,
  leaf,
  noticeText,
  plainNotice,
  pluginHarness,
} from './harness.mjs';

const LEAF_MARKER = Symbol.for('skilled.repo-guards.lineage-leaf');

function readPatch(fileName) {
  return readFileSync(fileURLToPath(new URL(`../../../patches/${fileName}`, import.meta.url)), 'utf8');
}

function advisorRuntimeValues() {
  const source = readFileSync(fileURLToPath(new URL(
    '../../../../.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts',
    import.meta.url,
  )), 'utf8');
  const tuple = source.match(/ADVISOR_RUNTIME_VALUES\s*=\s*\[([^\]]*)\]/);
  return tuple ? [...tuple[1].matchAll(/'([^']+)'/g)].map((match) => match[1]) : [];
}

function advisorCore(context, calls = []) {
  return {
    runAdvisor: async (input) => {
      calls.push(input);
      return { hookSpecificOutput: { additionalContext: context } };
    },
  };
}

async function step(fire, agent, messages) {
  return fire('agent/pre-step', { agent, messages }, async () => ({ kind: 'enter', messages: [] }));
}

test('the guards patch turns the advisor on and only the lineage patch marks a fan-out leaf', () => {
  assert.match(readPatch('guards.patch.yml'), /promptAdvisor:\s*true/);
  const lineage = readPatch('lineage.patch.yml');
  assert.match(lineage, /id:\s*repo-guards-lineage-leaf/);
  assert.match(lineage, /name:\s*\.\.\/plugins\/repo-guards\/lineage-leaf\.mjs/);
  assert.doesNotMatch(readPatch('guards.patch.yml'), /lineage-leaf/);
});

test('the lineage patch also turns off the native goal tools a leaf cannot use', () => {
  const lineage = readPatch('lineage.patch.yml');
  assert.match(lineage, /- id:\s*tool-goal\s*\n\s*disabled:\s*true/);
  assert.match(lineage, /- id:\s*goal-round-driver\s*\n\s*disabled:\s*true/);
  assert.match(lineage, /- id:\s*command-goal\s*\n\s*disabled:\s*true/);
});

test('the prompt advisor reports itself as dsh, a runtime the advisor accepts', async () => {
  assert.equal(ADVISOR_RUNTIME, 'dsh');
  assert.ok(advisorRuntimeValues().includes('dsh'), `advisor runtimes: ${advisorRuntimeValues().join(', ')}`);
  const seen = [];
  await runAdvisor({ prompt: 'probe' }, async () => ({
    handleClaudeUserPromptSubmit: async (input, dependencies) => {
      seen.push(dependencies.runtime);
      return {};
    },
  }));
  assert.deepEqual(seen, ['dsh']);
});

test('the lineage leaf plugin marks the process as a fan-out leaf', () => {
  const previous = globalThis[LEAF_MARKER];
  try {
    globalThis[LEAF_MARKER] = undefined;
    assert.equal(isLineageLeaf(), false);
    assert.equal(lineageLeafName, 'repo-guards-lineage-leaf');
    applyLineageLeaf();
    assert.equal(isLineageLeaf(), true);
  } finally {
    globalThis[LEAF_MARKER] = previous;
  }
});

test('the prompt advisor stays silent in a fan-out leaf', async () => {
  const calls = [];
  const { ctx, fire } = pluginHarness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    isLeaf: leaf,
    core: advisorCore('Advisor: fixture', calls),
    createNotice: plainNotice,
  });
  const { agent } = fakeAgent();
  const result = await step(fire, agent, [humanMessage('Which skill fits?')]);
  assert.deepEqual(result.messages, []);
  assert.equal(calls.length, 0);
});

test('the prompt advisor briefs an interactive turn', async () => {
  const calls = [];
  const { ctx, fire } = pluginHarness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    isLeaf: interactive,
    core: advisorCore('Advisor: fixture', calls),
    createNotice: plainNotice,
  });
  const { agent } = fakeAgent();
  const result = await step(fire, agent, [humanMessage('Which skill fits?')]);
  assert.equal(noticeText(result.messages[0]), 'Advisor: fixture');
  assert.equal(calls[0].prompt, 'Which skill fits?');
});

test('the prompt advisor reads only what the operator typed, never an injected advisory', async () => {
  const calls = [];
  const { ctx, fire } = pluginHarness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    isLeaf: interactive,
    core: advisorCore('Advisor: fixture', calls),
    createNotice: plainNotice,
  });
  const { agent } = fakeAgent();
  const advisory = await plainNotice('[sk-code] comment hygiene finding');
  const result = await step(fire, agent, [advisory]);
  assert.deepEqual(result.messages, []);
  assert.equal(calls.length, 0);
});

test('directive lifecycle: the directive block is sent once per lifecycle epoch', async () => {
  const brief = 'Advisor: route sk-code\nDirectives: keep comments durable';
  const { ctx, fire, handlers } = pluginHarness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    isLeaf: interactive,
    isEnabled: enabled,
    core: advisorCore(brief),
    createNotice: plainNotice,
  });
  const { agent } = fakeAgent({ id: 'session-directives' });

  const first = await step(fire, agent, [humanMessage('Fix the parser.')]);
  assert.equal(noticeText(first.messages[0]), brief);

  const repeat = await step(fire, agent, [humanMessage('Now the tests.')]);
  assert.equal(noticeText(repeat.messages[0]), 'Advisor: route sk-code');

  // A compaction drops the earlier delivery from context, so the next turn gets the full block again.
  const sessionEvent = handlers.get('session/event')[0];
  sessionEvent(agent.session, { type: 'compaction/end', data: { compactionId: 'c1', turn: 2 } });
  const afterCompaction = await step(fire, agent, [humanMessage('Continue.')]);
  assert.equal(noticeText(afterCompaction.messages[0]), brief);

  // A failed compaction leaves the earlier delivery in context.
  sessionEvent(agent.session, { type: 'compaction/end', data: { compactionId: 'c2', turn: 3, error: 'boom' } });
  const afterFailure = await step(fire, agent, [humanMessage('Continue again.')]);
  assert.equal(noticeText(afterFailure.messages[0]), 'Advisor: route sk-code');

  const created = handlers.get('agent/created')[0];
  await created({ agent, source: 'resume' });
  const afterResume = await step(fire, agent, [humanMessage('Resume work.')]);
  assert.equal(noticeText(afterResume.messages[0]), brief);
});

test('directive lifecycle: its kill switch restores the full brief on every turn', async () => {
  const brief = 'Advisor: route sk-code\nDirectives: keep comments durable';
  const { ctx, fire } = pluginHarness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    isLeaf: interactive,
    isEnabled: disabled,
    core: advisorCore(brief),
    createNotice: plainNotice,
  });
  const { agent } = fakeAgent({ id: 'session-directives-off' });
  await step(fire, agent, [humanMessage('One.')]);
  const repeat = await step(fire, agent, [humanMessage('Two.')]);
  assert.equal(noticeText(repeat.messages[0]), brief);
});
