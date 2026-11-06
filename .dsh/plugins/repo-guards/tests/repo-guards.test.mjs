import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import * as dispatchAuditCore from '../../../../.skilled/hooks/dispatch/lib/dispatch-audit.mjs';
import * as dispatchRuleCore from '../../../../.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs';
import * as specGateCore from '../../../../.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs';
import completionCore from '../../../../.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs';
import taskDispatchCore from '../../../../.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs';
import qualityCore from '../../../../.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs';
import * as injectionCore from '../../../../.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs';
import goalCore from '../../../../.skilled/hooks/goal/lib/goal-core.cjs';
import { ContractError } from '../../../../.skilled/skills/sk-git/scripts/lib/message-contract.mjs';
import { evaluateCommand } from '../../../../.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs';

import { ERROR_POLICY as goalPolicy, registerGoalContext } from '../adapters/goal-context.mjs';
import { ERROR_POLICY as auditPolicy, registerDispatchAudit } from '../adapters/dispatch-audit.mjs';
import { ERROR_POLICY as preflightPolicy, registerDispatchPreflightLint } from '../adapters/dispatch-preflight-lint.mjs';
import { ERROR_POLICY as gitGatePolicy, registerGitMessageGate } from '../adapters/git-message-gate.mjs';
import { ERROR_POLICY as gitAdvisoryPolicy, registerGitPreflightAdvisory } from '../adapters/git-preflight-advisory.mjs';
import { ERROR_POLICY as classifyPolicy, registerSpecGateClassify } from '../adapters/spec-gate-classify.mjs';
import { ERROR_POLICY as enforcePolicy, registerSpecGateEnforce } from '../adapters/spec-gate-enforce.mjs';
import { ERROR_POLICY as completionPolicy, registerCompletionEvidence } from '../adapters/completion-evidence.mjs';
import { ERROR_POLICY as taskPolicy, registerTaskDispatchGuard } from '../adapters/task-dispatch-guard.mjs';
import { ERROR_POLICY as qualityPolicy, registerPostEditQuality } from '../adapters/post-edit-quality.mjs';
import { ERROR_POLICY as injectionPolicy, registerClassifierInjectionScreen } from '../adapters/classifier-injection-screen.mjs';
import { ERROR_POLICY as advisorPolicy, registerPromptAdvisor } from '../adapters/prompt-advisor.mjs';
import { ERROR_POLICY as sessionStartPolicy, registerSessionStartContext } from '../adapters/session-start-context.mjs';
import { apply } from '../index.mjs';

function harness() {
  const handlers = new Map();
  const logs = [];
  return {
    handlers,
    logs,
    ctx: {
      on(name, handler) {
        handlers.set(name, handler);
      },
      logger: {
        warn(message) { logs.push({ level: 'warn', message }); },
        error(message) { logs.push({ level: 'error', message }); },
      },
    },
  };
}

const REPO_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

function tempDir() {
  return mkdtempSync(path.join(os.tmpdir(), 'repo-guards-test-'));
}

function cleanup(directory) {
  rmSync(directory, { recursive: true, force: true });
}

const enabled = () => true;
const accept = async () => ({ kind: 'accept', content: [] });
const allow = async () => ({ kind: 'allow' });

test('parity: dispatch audit observes the shared core verdict without blocking bash', async () => {
  const command = 'echo ready';
  const expected = dispatchAuditCore.inspectDispatch(command);
  assert.equal(expected.kind, 'none');

  const { ctx, handlers } = harness();
  registerDispatchAudit(ctx, { core: dispatchAuditCore, isEnabled: enabled });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command }, callId: 'audit-1' },
    { content: [{ type: 'text', text: 'ready' }] },
    accept,
  );
  assert.equal(result.kind, 'accept');
});

test('parity: dispatch preflight allows a command with no shared-core violations', async () => {
  const command = 'echo ready';
  const expected = dispatchRuleCore.evaluateDispatch(command, path.join(process.cwd(), '.skilled', 'skills'));
  assert.deepEqual(expected, []);

  const { ctx, handlers } = harness();
  registerDispatchPreflightLint(ctx, { core: dispatchRuleCore, isEnabled: enabled });
  const result = await handlers.get('tools/pre-execute')({ name: 'bash', arguments: { command } }, allow);
  assert.equal(result.kind, 'allow');
});

test('preflight reads the hard rules of this checkout even when the session runs outside it', async () => {
  const outside = tempDir();
  try {
    const command = 'dsh --profile headless --json -';
    const expected = dispatchRuleCore.evaluateDispatch(command, path.join(REPO_ROOT, '.skilled', 'skills'));
    assert.ok(expected.length > 0, 'an unguarded dsh dispatch must violate a hard rule');

    const { ctx, handlers } = harness();
    registerDispatchPreflightLint(ctx, { core: dispatchRuleCore, isEnabled: enabled });
    const result = await handlers.get('tools/pre-execute')(
      { name: 'bash', arguments: { command }, agent: { session: { header: { cwd: outside } } } },
      allow,
    );
    assert.equal(result.kind, 'deny');
  } finally {
    rmSync(outside, { recursive: true, force: true });
  }
});

test('parity: spec classification defers an open gate without stopping the model step', async () => {
  const directory = tempDir();
  try {
    const env = {};
    const prompt = 'I need to create a new file for this change.';
    const sessionID = specGateCore.resolveSessionKey({ sessionId: 'classify-parity' });
    const expected = specGateCore.runClassifyGate({ prompt, sessionID, projectDir: directory, env, runtimeLabel: 'DSH' });
    assert.ok(expected.question);

    const { ctx, handlers } = harness();
    registerSpecGateClassify(ctx, {
      core: specGateCore,
      env,
      cwd: directory,
      createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
    });
    const result = await handlers.get('agent/pre-step')({
      agent: { session: { id: 'classify-parity', header: { cwd: directory } } },
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    }, async () => ({ kind: 'enter', messages: [] }));
    assert.equal(result.kind, 'enter');
    assert.equal(result.messages.length, 1);
    assert.match(result.messages[0].content[0].text, /first file mutation/);
  } finally {
    cleanup(directory);
  }
});

test('parity: spec enforcement allows a child-session mutation under the shared core', async () => {
  const directory = tempDir();
  try {
    const env = { AI_SESSION_CHILD: '1' };
    const sessionID = specGateCore.resolveSessionKey({ sessionId: 'enforce-parity' });
    const expected = specGateCore.runEnforceGate({
      tool: 'bash', filePath: undefined, sessionID, projectDir: directory, env, runtimeKey: 'dsh',
    });
    assert.equal(expected.decision, 'allow');

    const { ctx, handlers } = harness();
    registerSpecGateEnforce(ctx, { core: specGateCore, env, cwd: directory });
    const result = await handlers.get('tools/pre-execute')({
      name: 'bash', arguments: { command: 'echo ready' },
      agent: { session: { id: 'enforce-parity', header: { cwd: directory } } },
    }, allow);
    assert.equal(result.kind, 'allow');
  } finally {
    cleanup(directory);
  }
});

test('parity: completion stop does not inject context when the shared core sees no claim', async () => {
  const { ctx, handlers } = harness();
  registerCompletionEvidence(ctx, { core: completionCore, isEnabled: enabled });
  const claimText = 'I will continue checking the work.';
  const expected = completionCore.detectCompletionClaim(claimText);
  assert.equal(expected, false);

  let injected = false;
  await handlers.get('agent/turn-stopping')({
    turn: 2,
    agent: {
      session: {
        snapshotEvents: () => [{
          type: 'assistant/message',
          data: { turn: 2, message: { role: 'assistant', content: [{ type: 'text', text: claimText }] } },
        }],
      },
      inject() { injected = true; },
    },
  });
  assert.equal(injected, false);
});

test('parity: task dispatch guard allows an unknown hand-off identity', async () => {
  const directory = tempDir();
  try {
    const taskEnv = { AI_SESSION_CHILD: '1' };
    const request = {
      subagentType: 'unregistered-fixture-agent',
      prompt: 'Handle one ordinary local task.',
      sessionID: 'task-parity',
      projectDir: directory,
      env: taskEnv,
    };
    const expected = taskDispatchCore.evaluateDispatch(request);
    assert.equal(expected.decision, 'allow');

    const { ctx, handlers } = harness();
    registerTaskDispatchGuard(ctx, { core: taskDispatchCore, isEnabled: enabled, cwd: directory, env: taskEnv });
    const result = await handlers.get('tools/pre-execute')({
      name: 'subagent_fork',
      arguments: { agent_preset: request.subagentType, prompt: request.prompt },
      agent: { session: { id: request.sessionID, header: { cwd: directory } } },
    }, allow);
    assert.equal(result.kind, 'allow');
  } finally {
    cleanup(directory);
  }
});

test('parity: post-edit quality preserves an ordinary file result with no core findings', async () => {
  const directory = tempDir();
  const filePath = path.join(directory, 'notes.txt');
  writeFileSync(filePath, 'plain text');
  try {
    const entries = qualityCore.resolveDispatch(filePath, directory);
    const findings = qualityCore.runChecks(entries, qualityCore.CLAUDE_HOOK_BUDGET_MS, {
      perChildTimeoutMs: qualityCore.CLAUDE_CHECKER_TIMEOUT_MS,
      minCheckerMs: qualityCore.CLAUDE_MIN_CHECKER_MS,
    });
    const banner = qualityCore.runDistStalenessCheck(filePath, directory, {
      timeoutMs: qualityCore.CLAUDE_CHECKER_TIMEOUT_MS,
    });
    assert.deepEqual(findings, []);
    assert.equal(banner, null);

    const { ctx, handlers } = harness();
    registerPostEditQuality(ctx, { core: qualityCore, isEnabled: enabled, cwd: directory });
    const result = await handlers.get('tools/post-execute')(
      { name: 'write', arguments: { file_path: 'notes.txt' } },
      { content: [{ type: 'text', text: 'written' }] },
      async () => ({ kind: 'accept', content: [{ type: 'text', text: 'written' }] }),
    );
    assert.deepEqual(result.content, [{ type: 'text', text: 'written' }]);
  } finally {
    cleanup(directory);
  }
});

test('parity: injection screen preserves a fetched result with no text to screen', async () => {
  const expectedText = injectionCore.fetchedText([]);
  const expected = await injectionCore.screenAdvisory(expectedText);
  assert.equal(expected, null);

  const { ctx, handlers } = harness();
  registerClassifierInjectionScreen(ctx, {
    core: injectionCore,
    isEnabled: enabled,
    createNotice: async () => assert.fail('unexpected injection advisory'),
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'web_fetch', arguments: { url: 'https://example.invalid' } },
    { content: [] },
    accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(result.additionalContexts, undefined);
});

test('throw policy: dispatch audit fails open and logs when its core throws', async () => {
  assert.equal(auditPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerDispatchAudit(ctx, {
    core: { recordDispatch() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command: 'echo ready' } }, { content: [] }, accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(logs.length, 1);
});

test('throw policy: dispatch preflight fails closed and logs when its core throws', async () => {
  assert.equal(preflightPolicy, 'fail-closed');
  const { ctx, handlers, logs } = harness();
  registerDispatchPreflightLint(ctx, {
    core: { evaluateDispatch() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  let delegated = false;
  const result = await handlers.get('tools/pre-execute')(
    { name: 'bash', arguments: { command: 'echo ready' } },
    async () => { delegated = true; return { kind: 'allow' }; },
  );
  assert.equal(result.kind, 'deny');
  assert.equal(delegated, false);
  assert.equal(logs.length, 1);
});

test('throw policy: spec classification fails open and logs when its core throws', async () => {
  assert.equal(classifyPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerSpecGateClassify(ctx, {
    core: {
      ...specGateCore,
      runClassifyGate() { throw new Error('fixture failure'); },
    },
    cwd: process.cwd(),
  });
  const result = await handlers.get('agent/pre-step')({
    agent: { session: { id: 'classify-throw', header: { cwd: process.cwd() } } },
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Please make a new file.' }] }],
  }, async () => ({ kind: 'enter', messages: [] }));
  assert.equal(result.kind, 'enter');
  assert.equal(logs.length, 1);
});

test('throw policy: spec enforcement fails closed and logs when its core throws', async () => {
  assert.equal(enforcePolicy, 'fail-closed');
  const { ctx, handlers, logs } = harness();
  registerSpecGateEnforce(ctx, {
    core: {
      resolveSessionKey: specGateCore.resolveSessionKey,
      runEnforceGate() { throw new Error('fixture failure'); },
    },
  });
  let delegated = false;
  const result = await handlers.get('tools/pre-execute')({
    name: 'write', arguments: { path: 'notes.txt' },
    agent: { session: { id: 'enforce-throw', header: { cwd: process.cwd() } } },
  }, async () => { delegated = true; return { kind: 'allow' }; });
  assert.equal(result.kind, 'deny');
  assert.equal(delegated, false);
  assert.equal(logs.length, 1);
});

test('spec enforcement records the notice it delivers through ask, and only then', async () => {
  let observed = 0;
  const verdicts = [
    { decision: 'advise', detail: 'Choose a spec folder.', gateOpenUndelivered: true },
    { decision: 'advise', detail: 'Choose a spec folder.', gateOpenUndelivered: false },
  ];
  const { ctx, handlers } = harness();
  registerSpecGateEnforce(ctx, {
    core: {
      resolveSessionKey: specGateCore.resolveSessionKey,
      runEnforceGate() { return { ...verdicts.shift(), observe() { observed += 1; } }; },
    },
  });
  const call = { name: 'write', arguments: { path: 'notes.txt' }, agent: { session: { id: 'enforce-observe' } } };
  const asked = await handlers.get('tools/pre-execute')(call, allow);
  assert.equal(asked.kind, 'ask');
  assert.equal(observed, 1);
  const passed = await handlers.get('tools/pre-execute')(call, allow);
  assert.equal(passed.kind, 'allow');
  assert.equal(observed, 1);
});

test('throw policy: completion evidence fails open and logs when its core throws', async () => {
  assert.equal(completionPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerCompletionEvidence(ctx, {
    core: { detectCompletionClaim() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  await handlers.get('agent/turn-stopping')({
    turn: 1,
    agent: {
      session: { snapshotEvents: () => [] },
      inject() { assert.fail('fail-open throw path must not inject'); },
    },
  });
  assert.equal(logs.length, 1);
});

test('throw policy: task dispatch guard fails open and logs when its core throws', async () => {
  assert.equal(taskPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerTaskDispatchGuard(ctx, {
    core: { evaluateDispatch() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/pre-execute')({
    name: 'subagent', arguments: { agent_preset: 'fixture-agent', prompt: 'Do one task.' },
  }, allow);
  assert.equal(result.kind, 'allow');
  assert.equal(logs.length, 1);
});

test('throw policy: post-edit quality fails open and logs when its core throws', async () => {
  assert.equal(qualityPolicy, 'fail-open');
  const directory = tempDir();
  writeFileSync(path.join(directory, 'notes.txt'), 'plain text');
  try {
    const { ctx, handlers, logs } = harness();
    registerPostEditQuality(ctx, {
      core: { resolveDispatch() { throw new Error('fixture failure'); } },
      isEnabled: enabled,
      cwd: directory,
    });
    const result = await handlers.get('tools/post-execute')(
      { name: 'write', arguments: { file_path: 'notes.txt' } }, { content: [] }, accept,
    );
    assert.equal(result.kind, 'accept');
    assert.equal(logs.length, 1);
  } finally {
    cleanup(directory);
  }
});

test('throw policy: injection screening fails open and logs when its core throws', async () => {
  assert.equal(injectionPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerClassifierInjectionScreen(ctx, {
    core: {
      fetchedText() { return 'fixture text'; },
      screenAdvisory() { throw new Error('fixture failure'); },
    },
    isEnabled: enabled,
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'mcp__sample__lookup', arguments: {} }, { content: [{ type: 'text', text: 'fixture text' }] }, accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(logs.length, 1);
});

test('goal context injects the exact CLI chat slice without frontmatter', async () => {
  const directory = tempDir();
  try {
    execFileSync('git', ['-C', directory, 'init', '-q'], { stdio: 'ignore' });
    const packetRelative = path.join(['spec', 's'].join(''), 'fixture-track', '001-goal-context');
    const packetDirectory = path.join(directory, packetRelative);
    mkdirSync(packetDirectory, { recursive: true });
    writeFileSync(path.join(packetDirectory, 'goal.md'), [
      '---',
      'title: Fixture Goal',
      'status: active',
      '---',
      '# Goal: Fixture',
      '',
      '## DURABLE DIRECTIVE',
      '',
      '**Objective:** Keep this exact directive in model context.',
      '',
    ].join('\n'));

    const cliPath = fileURLToPath(new URL(
      '../../../../.skilled/hooks/goal/bin/goal.cjs',
      import.meta.url,
    ));
    const cli = spawnSync(process.execPath, [
      cliPath,
      'packet',
      packetRelative.split(path.sep).join('/'),
      '--workspace',
      directory,
    ], { cwd: directory, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    const sliceLine = cli.stdout.split(/\r?\n/).find((line) => line.startsWith('chat_slice='));
    assert.ok(sliceLine, cli.stdout);
    const expectedSlice = JSON.parse(sliceLine.slice('chat_slice='.length));
    assert.doesNotMatch(expectedSlice, /^---$/m);

    const { ctx, handlers } = harness();
    const injected = [];
    registerGoalContext(ctx, {
      core: goalCore,
      env: { DSH_SPEC_FOLDER: packetRelative },
      cwd: directory,
      createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
    });
    await handlers.get('agent/created')({
      agent: {
        session: { id: 'goal-context-fixture', header: { cwd: directory } },
        inject(message) { injected.push(message); },
      },
      source: 'startup',
    });
    const injectedText = injected[0].content[0].text;
    assert.equal(injectedText, expectedSlice);
    assert.doesNotMatch(injectedText, /^---$/m);
  } finally {
    cleanup(directory);
  }
});

test('goal context logs and continues when its core throws', async () => {
  assert.equal(goalPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerGoalContext(ctx, {
    core: { describePacketGoal() { throw new Error('fixture failure'); } },
    env: { DSH_SPEC_FOLDER: 'fixture-track/001-goal-context' },
    createNotice: async () => assert.fail('a failed goal read must not inject'),
  });
  const result = await handlers.get('agent/created')({
    agent: { session: { id: 'goal-context-throw' }, inject() { assert.fail('unexpected injection'); } },
    source: 'startup',
  });
  assert.equal(result, undefined);
  assert.equal(logs.length, 1);
  assert.equal(handlers.has('tools/pre-execute'), false);
});

test('session-start context injects the session-prime output on agent creation', async () => {
  const { ctx, handlers } = harness();
  const injected = [];
  const calls = [];
  registerSessionStartContext(ctx, {
    core: {
      runSessionPrime(input) {
        calls.push(input);
        return 'Session context fixture';
      },
    },
    isEnabled: enabled,
    createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
  });
  await handlers.get('agent/created')({
    agent: {
      session: { id: 'session-start-fixture', header: { cwd: '/fixture/workspace' } },
      inject(message) { injected.push(message); },
    },
    source: 'resume',
  });
  assert.deepEqual(calls, [{
    sessionId: 'session-start-fixture',
    projectDir: '/fixture/workspace',
    source: 'resume',
  }]);
  assert.equal(injected[0].content[0].text, 'Session context fixture');
});

test('session-start context logs and continues when session-prime throws', async () => {
  assert.equal(sessionStartPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerSessionStartContext(ctx, {
    core: { runSessionPrime() { throw new Error('fixture failure'); } },
    isEnabled: enabled,
  });
  const result = await handlers.get('agent/created')({
    agent: {
      session: { id: 'session-start-throw' },
      inject() { assert.fail('a failed session read must not inject'); },
    },
    source: 'startup',
  });
  assert.equal(result, undefined);
  assert.equal(logs.length, 1);
});

test('prompt advisor stays disabled by default and registers when its row flag is true', () => {
  const patchText = readFileSync(fileURLToPath(new URL('../../../patches/guards.patch.yml', import.meta.url)), 'utf8');
  assert.match(patchText, /promptAdvisor:\s*false/);

  const registrations = [];
  const ctx = {
    on(name) { registrations.push(name); },
    logger: { warn() {}, error() {} },
  };
  apply(ctx);
  assert.equal(registrations.filter((name) => name === 'agent/pre-step').length, 1);

  registrations.length = 0;
  apply(ctx, { adapters: { promptAdvisor: true } });
  assert.equal(registrations.filter((name) => name === 'agent/pre-step').length, 2);
});

test('prompt advisor appends returned context on the pre-step waterfall', async () => {
  const { ctx, handlers } = harness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    core: { runAdvisor: async () => ({ hookSpecificOutput: { additionalContext: 'Advisor fixture' } }) },
    createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
  });
  const result = await handlers.get('agent/pre-step')({
    agent: { session: { id: 'advisor-fixture', header: { cwd: '/fixture/workspace' } } },
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Help me choose.' }] }],
  }, async () => ({ kind: 'enter', messages: [] }));
  assert.equal(result.kind, 'enter');
  assert.equal(result.messages[0].content[0].text, 'Advisor fixture');
});

test('prompt advisor logs and continues when its core throws', async () => {
  assert.equal(advisorPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerPromptAdvisor(ctx, {
    enabled: true,
    core: { runAdvisor() { throw new Error('fixture failure'); } },
  });
  const downstream = { kind: 'enter', messages: [] };
  const result = await handlers.get('agent/pre-step')({
    agent: { session: { id: 'advisor-throw' } },
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Continue.' }] }],
  }, async () => downstream);
  assert.equal(result, downstream);
  assert.equal(logs.length, 1);
});

test('git preflight attaches advisory context without changing the tool result', async () => {
  const { ctx, handlers } = harness();
  registerGitPreflightAdvisory(ctx, {
    core: {
      GIT_SHAPE: /git/,
      GIT_CHECKS: { fixture: true },
      readHardRules: () => [{ id: 'fixture-rule', check: 'fixture' }],
      createGitContext: () => ({ isRepo: () => true }),
      evaluate: () => [{ id: 'fixture-rule', message: 'Check this command.' }],
    },
    isEnabled: enabled,
    env: {},
    createNotice: async (text) => ({ role: 'user', content: [{ type: 'text', text }] }),
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command: 'git checkout -b feature/x' } },
    { content: [] },
    accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(result.additionalContexts[0].content[0].text.includes('fixture-rule'), true);
});

test('git preflight logs and continues when its core throws', async () => {
  assert.equal(gitAdvisoryPolicy, 'fail-open');
  const { ctx, handlers, logs } = harness();
  registerGitPreflightAdvisory(ctx, {
    core: {
      GIT_SHAPE: /git/,
      GIT_CHECKS: { fixture: true },
      readHardRules: () => [{ id: 'fixture-rule', check: 'fixture' }],
      createGitContext: () => ({ isRepo: () => true }),
      evaluate() { throw new Error('fixture failure'); },
    },
    isEnabled: enabled,
    env: {},
  });
  const result = await handlers.get('tools/post-execute')(
    { name: 'bash', arguments: { command: 'git checkout -b feature/x' } },
    { content: [] },
    accept,
  );
  assert.equal(result.kind, 'accept');
  assert.equal(result.additionalContexts, undefined);
  assert.equal(logs.length, 1);
});

test('git message gate applies the shared contract to fixture repositories', async () => {
  assert.equal(gitGatePolicy, 'fail-open');
  const directory = tempDir();
  try {
    const contractDir = fileURLToPath(new URL(
      '../../../../.skilled/skills/sk-git/assets',
      import.meta.url,
    ));
    execFileSync('git', ['-C', directory, 'init', '-q'], { stdio: 'ignore' });
    execFileSync('git', ['-C', directory, 'config', 'skgit.contractDir', contractDir], { stdio: 'ignore' });

    const { ctx, handlers } = harness();
    registerGitMessageGate(ctx, { cwd: directory });
    let delegated = false;
    const invalid = await handlers.get('tools/pre-execute')({
      name: 'bash', arguments: { command: 'git commit -m "update stuff"' },
    }, async () => { delegated = true; return { kind: 'allow' }; });
    assert.equal(invalid.kind, 'deny');
    assert.match(invalid.reason, /subject\.format/);
    assert.equal(delegated, false);

    const valid = await handlers.get('tools/pre-execute')({
      name: 'bash',
      arguments: { command: 'git commit -m "feat(sk-git): add a thing" -m "Explains why."' },
    }, async () => ({ kind: 'allow' }));
    assert.equal(valid.kind, 'allow');
  } finally {
    cleanup(directory);
  }
});

test('git message gate logs unexpected core errors and fails closed on contract errors', async () => {
  const { ctx, handlers, logs } = harness();
  registerGitMessageGate(ctx, {
    core: { evaluateCommand() { throw new Error('fixture failure'); } },
    cwd: '/fixture/workspace',
  });
  let delegated = false;
  const call = { name: 'bash', arguments: { command: 'git commit -m "update stuff"' } };
  const result = await handlers.get('tools/pre-execute')(call, async () => {
    delegated = true;
    return { kind: 'allow' };
  });
  assert.equal(result.kind, 'allow');
  assert.equal(delegated, true);
  assert.equal(logs.length, 1);

  const second = harness();
  registerGitMessageGate(second.ctx, {
    core: { evaluateCommand() { throw new ContractError('fixture contract unavailable'); } },
    cwd: '/fixture/workspace',
  });
  let contractDelegated = false;
  const blocked = await second.handlers.get('tools/pre-execute')(call, async () => {
    contractDelegated = true;
    return { kind: 'allow' };
  });
  assert.equal(blocked.kind, 'deny');
  assert.match(blocked.reason, /contract could not be read/);
  assert.equal(contractDelegated, false);
  assert.equal(second.logs.length, 1);
});

test('the dsh-llm loader resolves from the dsh binary, and a bad anchor does not poison the cache', async (t) => {
  const which = spawnSync('sh', ['-c', 'command -v dsh'], { encoding: 'utf8' });
  if (which.status !== 0) {
    t.skip('dsh is not installed');
    return;
  }
  // A query string gives this test its own module instance, so no other test has filled the cache.
  const { loadDshLlm } = await import('../adapters/dsh-llm.mjs?isolated');
  await assert.rejects(loadDshLlm(path.join(os.tmpdir(), 'no-such-dsh-entry.js')));
  const llm = await loadDshLlm(which.stdout.trim());
  assert.equal(typeof llm.createUserMessage, 'function');
});

test('every adapter loads the harness message helpers through the anchored loader', () => {
  const adapterDir = fileURLToPath(new URL('../adapters/', import.meta.url));
  const bare = readdirSync(adapterDir)
    .filter((file) => file.endsWith('.mjs') && file !== 'dsh-llm.mjs')
    .filter((file) => readFileSync(path.join(adapterDir, file), 'utf8').includes("import('@deepseek-ai/dsh-llm')"));
  assert.deepEqual(bare, []);
});
