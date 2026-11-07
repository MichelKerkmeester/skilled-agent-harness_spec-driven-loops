// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Adapter Tests - Prompt Advisor (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers the advisor brief on the pre-step waterfall, its dsh runtime label,
// leaf silence, operator-only prompts, the directive lifecycle and the throw policy.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { ADVISOR_RUNTIME, ERROR_POLICY as advisorPolicy, registerPromptAdvisor, runAdvisor } from '../dsh/prompt-advisor.mjs';
import {
  adapterHarness,
  disabled,
  enabled,
  fakeAgent,
  humanMessage,
  interactive,
  leaf,
  noticeText,
  plainNotice,
  pluginHarness,
} from '../../../../hooks/shared/tests/dsh-plugin-harness.mjs';

function advisorRuntimeValues() {
  const source = readFileSync(fileURLToPath(new URL(
    '../../runtime/lib/advisor-runtime-values.ts',
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

test('prompt advisor appends returned context on the pre-step waterfall', async () => {
  const { ctx, handlers } = adapterHarness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    core: { runAdvisor: async () => ({ hookSpecificOutput: { additionalContext: 'Advisor fixture' } }) },
    createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
  });
  const result = await handlers.get('agent/pre-step')({
    agent: { session: { id: 'advisor-fixture', header: { cwd: '/fixture/workspace' } } },
    messages: [{ role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'Help me choose.' }] }],
  }, async () => ({ kind: 'enter', messages: [] }));
  assert.equal(result.kind, 'enter');
  assert.equal(result.messages[0].content[0].text, 'Advisor fixture');
});

test('prompt advisor logs and continues when its core throws', async () => {
  assert.equal(advisorPolicy, 'fail-open');
  const { ctx, handlers, logs } = adapterHarness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    core: { runAdvisor() { throw new Error('fixture failure'); } },
  });
  const downstream = { kind: 'enter', messages: [] };
  const result = await handlers.get('agent/pre-step')({
    agent: { session: { id: 'advisor-throw' } },
    messages: [{ role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'Continue.' }] }],
  }, async () => downstream);
  assert.equal(result, downstream);
  assert.equal(logs.length, 1);
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
