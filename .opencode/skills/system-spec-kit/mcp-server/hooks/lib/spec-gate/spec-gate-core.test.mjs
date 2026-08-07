// Golden-loop + fail-open + answerParse() corpus test for the spec-gate core.
// Run with: node --test spec-gate-core.test.mjs
// A handful of tests (marked below) additionally exercise ESM module mocking
// via `t.mock.module()` and self-skip when the process was not started with
// --experimental-test-module-mocks; run with that flag for full coverage:
//   node --experimental-test-module-mocks --test spec-gate-core.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, chmodSync, symlinkSync, realpathSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import * as core from './spec-gate-core.mjs';

const CORE_SOURCE_PATH = fileURLToPath(new URL('./spec-gate-core.mjs', import.meta.url));
const CORE_MODULE_URL = new URL('./spec-gate-core.mjs', import.meta.url).href;
const CLASSIFIER_MODULE_PATH = fileURLToPath(new URL('../../../../shared/dist/gate-3-classifier.js', import.meta.url));

function makeWorkspace() {
  const root = mkdtempSync(join(tmpdir(), 'spec-gate-test-'));
  const folderRel = '.opencode/specs/999-test-folder';
  const folderAbs = join(root, folderRel);
  mkdirSync(folderAbs, { recursive: true });
  writeFileSync(join(folderAbs, 'spec.md'), '# Test Spec\n\n| **Status** | Active |\n');
  writeFileSync(join(folderAbs, 'description.json'), '{}\n');
  writeFileSync(join(folderAbs, 'graph-metadata.json'), '{}\n');
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(root, 'src', 'login.ts'), '// placeholder\n');
  return { root, folderRel };
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

let sessionCounter = 0;
function nextSessionID() {
  sessionCounter += 1;
  return `test-session-${sessionCounter}-${Date.now()}`;
}

function makeGate3DeliveryRequest(overrides = {}) {
  return {
    question: core.GATE_3_QUESTION,
    sessionID: nextSessionID(),
    lifecycleEpoch: 0,
    gateState: {
      status: 'open',
      taskScopeFingerprint: 'task-alpha|scope-alpha',
      answerState: 'awaiting-answer',
      lifecycleState: 'steady',
    },
    env: {
      [core.GATE_3_DELIVERY_SUPPRESSION_ENV]: '1',
      [core.CHILD_SESSION_ENV]: '0',
    },
    deliveryConfirmed: false,
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Golden loop
// ─────────────────────────────────────────────────────────────────────────────

test('golden loop: open -> deny -> answer -> allow', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = nextSessionID();

    // 1. A mutating prompt opens the gate and returns the bounded question.
    const opened = core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
    assert.equal(opened.status, 'open');
    assert.ok(opened.question && opened.question.includes('SPEC FOLDER QUESTION'));

    // 2. A Write to a real in-repo source file denies while enforce is on.
    // The deny detail is the model-audience string, NOT the human-facing
    // relay question -- a denied model needs an instruction ("go ask the
    // user"), not the menu itself.
    const denied = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(denied.decision, 'deny');
    assert.equal(denied.detail, core.GATE_3_DENY_DETAIL);
    assert.notEqual(denied.detail, core.GATE_3_QUESTION);
    assert.equal(denied.wouldDeny, true);

    // 3. Answering with a real, validated folder satisfies the gate.
    const answered = core.classifyIntent({
      prompt: `B, use ${folderRel}`,
      sessionID,
      projectDir: root,
    });
    assert.equal(answered.status, 'satisfied');
    assert.equal(answered.question, null);

    // 4. The same Write now allows.
    const allowed = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(allowed.decision, 'allow');
    assert.equal(allowed.wouldDeny, false);
  } finally {
    cleanup(root);
  }
});

test('enforce-env unset returns advise, not deny', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the new endpoint', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: {},
    });
    assert.equal(result.decision, 'advise');
    assert.ok(result.detail);
    // wouldDeny is computed independent of the enforce env: this is exactly
    // the row an operator measures to size a future enforce flip.
    assert.equal(result.wouldDeny, true);
  } finally {
    cleanup(root);
  }
});

test('E / skip closes the gate without a binding', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'refactor the parser module', sessionID, projectDir: root });

    const skipped = core.classifyIntent({ prompt: 'E, no spec folder needed', sessionID, projectDir: root });
    assert.equal(skipped.status, 'skipped');

    const allowed = core.evaluateMutation({
      tool: 'Edit',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(allowed.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('a letter with no named folder stays open (no guessed binding)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'update the config loader', sessionID, projectDir: root });

    const stillOpen = core.classifyIntent({ prompt: 'A', sessionID, projectDir: root });
    assert.equal(stillOpen.status, 'open');
    assert.ok(stillOpen.question);
  } finally {
    cleanup(root);
  }
});

test('an invalid/nonexistent folder answer stays open and re-asks', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'build the export pipeline', sessionID, projectDir: root });

    const stillOpen = core.classifyIntent({
      prompt: 'B, use .opencode/specs/does-not-exist',
      sessionID,
      projectDir: root,
    });
    assert.equal(stillOpen.status, 'open');
    assert.ok(stillOpen.question);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Open-gate silence & answer-attempt re-ask (question surface semantics)
// ─────────────────────────────────────────────────────────────────────────────

test('an open gate stays open but silent on a read-only turn (no question re-injection)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const opened = core.classifyIntent({ prompt: 'refactor the parser module', sessionID, projectDir: root });
    assert.equal(opened.status, 'open');
    assert.ok(opened.question);

    const quiet = core.classifyIntent({ prompt: 'review the auth module', sessionID, projectDir: root });
    assert.equal(quiet.status, 'open');
    assert.equal(quiet.question, null);

    // The gate is still enforced even while the question is withheld: the
    // very next mutation is denied until the user actually answers.
    const mutation = core.evaluateMutation({
      tool: 'Edit',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'deny');
  } finally {
    cleanup(root);
  }
});

test('an answer attempt without a named folder re-surfaces the question', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'update the config loader', sessionID, projectDir: root });

    const reAsk = core.classifyIntent({ prompt: 'option C', sessionID, projectDir: root });
    assert.equal(reAsk.status, 'open');
    assert.ok(reAsk.question);
  } finally {
    cleanup(root);
  }
});

test('a self-contradicting skip attempt re-surfaces the question', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'build the export pipeline', sessionID, projectDir: root });

    const reAsk = core.classifyIntent({ prompt: 'skip, use A instead', sessionID, projectDir: root });
    assert.equal(reAsk.status, 'open');
    assert.ok(reAsk.question);
  } finally {
    cleanup(root);
  }
});

test('letter-led ordinary prose stays silent on an open gate (no false answer attempt)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'build the export pipeline', sessionID, projectDir: root });

    const quiet = core.classifyIntent({ prompt: 'A pretty big problem needs a plan', sessionID, projectDir: root });
    assert.equal(quiet.status, 'open');
    assert.equal(quiet.question, null);
  } finally {
    cleanup(root);
  }
});

test('a D answer naming a real folder binds and satisfies (path outranks the skip default)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'build the export pipeline', sessionID, projectDir: root });

    const satisfied = core.classifyIntent({
      prompt: 'D, .opencode/specs/999-test-folder',
      sessionID,
      projectDir: root,
    });
    assert.equal(satisfied.status, 'satisfied');
    assert.equal(satisfied.question, null);
  } finally {
    cleanup(root);
  }
});

test('Gate-3 delivery flag off preserves byte-identical baseline output', () => {
  core.resetGate3DeliveryShadow();
  const baseline = core.GATE_3_QUESTION;
  const seededRequest = makeGate3DeliveryRequest({ deliveryConfirmed: true });
  core.observeGate3QuestionDelivery(seededRequest);
  const result = core.observeGate3QuestionDelivery({ ...seededRequest, env: { [core.CHILD_SESSION_ENV]: '0' } });

  assert.deepEqual(Buffer.from(result.question, 'utf8'), Buffer.from(baseline, 'utf8'));
  assert.equal(result.suppressionEligible, false);
  assert.equal(result.suppressionConsumed, false);
  assert.equal(core.getGate3ShadowReceipts().length, 1);

  const reenabled = core.observeGate3QuestionDelivery({
    ...seededRequest,
    deliveryConfirmed: false,
  });
  assert.equal(reenabled.suppressionEligible, false, 'turning the flag off must clear delivery state');
  assert.deepEqual(Buffer.from(reenabled.question, 'utf8'), Buffer.from(baseline, 'utf8'));
});

test('Gate-3 shadow receipt records the planned and emitted full relay', () => {
  core.resetGate3DeliveryShadow();
  const receipts = [];
  const firstRequest = makeGate3DeliveryRequest({
    sessionID: 'receipt-session',
    deliveryConfirmed: true,
    onShadowReceipt: (receipt) => receipts.push(receipt),
  });
  core.observeGate3QuestionDelivery(firstRequest);
  const repeated = core.observeGate3QuestionDelivery({ ...firstRequest, deliveryConfirmed: false });

  assert.equal(repeated.suppressionEligible, true);
  assert.equal(repeated.suppressionConsumed, false);
  assert.equal(receipts.length, 2);
  assert.equal(receipts[0].plannedHash, receipts[0].emittedHash);
  assert.equal(receipts[1].plannedHash, receipts[1].emittedHash);
  assert.equal(receipts[1].byteCount, Buffer.byteLength(core.GATE_3_QUESTION, 'utf8'));
  assert.equal(receipts[0].gateStateHash, receipts[1].gateStateHash);
  assert.equal(receipts[1].suppressionEligible, true);
  assert.equal(receipts[1].suppressionConsumed, false);
  assert.deepEqual(Buffer.from(repeated.question, 'utf8'), Buffer.from(core.GATE_3_QUESTION, 'utf8'));
});

test('Gate-3 delivery flag off does not create a shadow receipt', () => {
  core.resetGate3DeliveryShadow();
  const baseline = core.GATE_3_QUESTION;
  const result = core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({
    env: { [core.CHILD_SESSION_ENV]: '0' },
    deliveryConfirmed: true,
  }));

  assert.deepEqual(Buffer.from(result.question, 'utf8'), Buffer.from(baseline, 'utf8'));
  assert.equal(result.suppressionEligible, false);
  assert.equal(result.suppressionConsumed, false);
  assert.deepEqual(core.getGate3ShadowReceipts(), []);
});

test('Gate-3 delivery state hash separates task/scope, answer, epoch, and session', () => {
  const baseState = {
    status: 'open',
    taskScopeFingerprint: 'task-alpha|scope-alpha',
    answerState: 'awaiting-answer',
    lifecycleState: 'steady',
  };
  const baseHash = core.buildGate3StateHash(baseState);
  assert.ok(baseHash);
  assert.notEqual(
    baseHash,
    core.buildGate3StateHash({ ...baseState, taskScopeFingerprint: 'task-beta|scope-beta' }),
  );
  assert.notEqual(
    baseHash,
    core.buildGate3StateHash({ ...baseState, answerState: 'invalid-answer' }),
  );

  const baseKey = core.buildGate3DeliveryKey({ sessionID: 'session-alpha', lifecycleEpoch: 0, gateStateHash: baseHash });
  assert.ok(baseKey);
  assert.notEqual(baseKey, core.buildGate3DeliveryKey({ sessionID: 'session-beta', lifecycleEpoch: 0, gateStateHash: baseHash }));
  assert.notEqual(baseKey, core.buildGate3DeliveryKey({ sessionID: 'session-alpha', lifecycleEpoch: 1, gateStateHash: baseHash }));
  assert.equal(core.buildGate3DeliveryKey({ sessionID: core.UNKNOWN_SESSION_ID, lifecycleEpoch: 0, gateStateHash: baseHash }), null);
});

test('Gate-3 fallback state identity separates delimiter-colliding task and scope pairs', () => {
  const first = core.buildGate3StateHash({
    status: 'open',
    taskFingerprint: 'a|b',
    scopeFingerprint: 'c',
    answerState: 'awaiting-answer',
    lifecycleState: 'steady',
  });
  const second = core.buildGate3StateHash({
    status: 'open',
    taskFingerprint: 'a',
    scopeFingerprint: 'b|c',
    answerState: 'awaiting-answer',
    lifecycleState: 'steady',
  });

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
});

test('Gate-3 delivery matrix keeps only unchanged repeated positive eligible for suppression', () => {
  const outcomes = [];
  const record = (label, result, baseline) => {
    assert.equal(result.question, baseline, `${label} changed the baseline relay`);
    assert.equal(result.suppressionConsumed, false, `${label} consumed a shadow decision`);
    outcomes.push({ label, eligible: result.suppressionEligible });
  };

  core.resetGate3DeliveryShadow();
  record(
    'read-only',
    core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({ question: null })),
    null,
  );

  const firstRequest = makeGate3DeliveryRequest({ sessionID: 'matrix-session', deliveryConfirmed: true });
  record('first positive', core.observeGate3QuestionDelivery(firstRequest), core.GATE_3_QUESTION);

  record(
    'repeated unchanged positive',
    core.observeGate3QuestionDelivery({ ...firstRequest, deliveryConfirmed: false }),
    core.GATE_3_QUESTION,
  );
  const repeatReceipts = core.getGate3ShadowReceipts();
  assert.equal(repeatReceipts.length, 2);
  assert.equal(repeatReceipts[0].plannedHash, repeatReceipts[0].emittedHash);
  assert.equal(repeatReceipts[1].plannedHash, repeatReceipts[1].emittedHash);
  assert.equal(repeatReceipts[1].suppressionEligible, true);
  assert.equal(repeatReceipts[1].suppressionConsumed, false);
  assert.equal(repeatReceipts[1].byteCount, Buffer.byteLength(core.GATE_3_QUESTION, 'utf8'));

  record(
    'invalid answer',
    core.observeGate3QuestionDelivery({
      ...makeGate3DeliveryRequest({ sessionID: 'matrix-session', deliveryConfirmed: true }),
      gateState: { ...firstRequest.gateState, answerState: 'invalid-answer' },
    }),
    core.GATE_3_QUESTION,
  );

  const { root, folderRel } = makeWorkspace();
  try {
    for (const [letter, expectedStatus] of [['A', 'satisfied'], ['B', 'satisfied'], ['C', 'satisfied'], ['D', 'satisfied'], ['E', 'skipped']]) {
      const sessionID = nextSessionID();
      const interactiveEnv = { [core.CHILD_SESSION_ENV]: '0' };
      const opened = core.classifyIntent({
        prompt: 'implement the matrix change',
        sessionID,
        projectDir: root,
        env: interactiveEnv,
      });
      assert.equal(opened.status, 'open');
      const answer = letter === 'E' ? 'E' : `${letter}, use ${folderRel}`;
      const answered = core.classifyIntent({ prompt: answer, sessionID, projectDir: root, env: interactiveEnv });
      assert.equal(answered.status, expectedStatus);
    }
    record('valid A-E', core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({ question: null })), null);
  } finally {
    cleanup(root);
  }

  record(
    'new task/scope',
    core.observeGate3QuestionDelivery({
      ...makeGate3DeliveryRequest({ sessionID: 'matrix-session', deliveryConfirmed: true }),
      gateState: { ...firstRequest.gateState, taskScopeFingerprint: 'task-beta|scope-beta' },
    }),
    core.GATE_3_QUESTION,
  );

  record(
    'recovery',
    core.observeGate3QuestionDelivery({
      ...makeGate3DeliveryRequest({ sessionID: 'matrix-session', lifecycleEpoch: 1, deliveryConfirmed: true }),
      gateState: { ...firstRequest.gateState, lifecycleState: 'resumed' },
    }),
    core.GATE_3_QUESTION,
  );

  const { root: enforcementRoot } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the matrix change', sessionID, projectDir: enforcementRoot, env: { [core.CHILD_SESSION_ENV]: '0' } });
    const denied = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: enforcementRoot,
      env: { [core.ENFORCE_ENV]: '1', [core.CHILD_SESSION_ENV]: '0' },
    });
    assert.equal(denied.decision, 'deny');
    record(
      'enforcement denial',
      core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({
        question: denied.detail,
        deliveryKind: 'enforcement',
        sessionID,
      })),
      core.GATE_3_DENY_DETAIL,
    );
  } finally {
    cleanup(enforcementRoot);
  }

  record(
    'child bypass',
    core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({
      question: null,
      env: {
        [core.GATE_3_DELIVERY_SUPPRESSION_ENV]: '1',
        [core.CHILD_SESSION_ENV]: '1',
      },
    })),
    null,
  );
  const childFullRelay = core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({
    sessionID: 'matrix-child-session',
    deliveryConfirmed: true,
    env: {
      [core.GATE_3_DELIVERY_SUPPRESSION_ENV]: '1',
      [core.CHILD_SESSION_ENV]: '1',
    },
  }));
  assert.equal(childFullRelay.question, core.GATE_3_QUESTION);
  assert.equal(childFullRelay.suppressionEligible, false);
  assert.equal(childFullRelay.suppressionConsumed, false);

  record(
    'disabled',
    core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({
      question: null,
      env: {
        [core.GATE_3_DELIVERY_SUPPRESSION_ENV]: '1',
        [core.DISABLED_ENV]: '1',
        [core.CHILD_SESSION_ENV]: '0',
      },
    })),
    null,
  );

  const throwingState = {};
  Object.defineProperty(throwingState, 'status', { get() { throw new Error('state read failed'); } });
  record(
    'error',
    core.observeGate3QuestionDelivery(makeGate3DeliveryRequest({ gateState: throwingState })),
    core.GATE_3_QUESTION,
  );

  const eligibleRows = outcomes.filter((outcome) => outcome.eligible);
  assert.equal(outcomes.length, 11);
  assert.deepEqual(eligibleRows.map((outcome) => outcome.label), ['repeated unchanged positive']);
});

test('Gate-3 suppression predicate has no classify or enforcement call site', () => {
  const source = readFileSync(CORE_SOURCE_PATH, 'utf8');
  const predicateName = 'shouldSuppressGate3Delivery';
  const classifyStart = source.indexOf('export function classifyIntent');
  const enforceStart = source.indexOf('export function evaluateMutation');
  assert.ok(classifyStart !== -1 && enforceStart !== -1);
  assert.equal(source.slice(classifyStart, enforceStart).includes(predicateName), false);
  assert.equal(source.slice(enforceStart).includes(predicateName), false);
});

test('isAnswerAttempt: answer-shaped turns are attempts, ordinary prose is not', () => {
  assert.equal(core.isAnswerAttempt('A'), true);
  assert.equal(core.isAnswerAttempt('A) Use an existing spec folder'), true);
  assert.equal(core.isAnswerAttempt('A - the auth folder'), true);
  assert.equal(core.isAnswerAttempt('A use an existing folder'), true);
  assert.equal(core.isAnswerAttempt('B create a new folder'), true);
  assert.equal(core.isAnswerAttempt('option C'), true);
  assert.equal(core.isAnswerAttempt('skip'), true);
  assert.equal(core.isAnswerAttempt('E, no spec folder needed'), true);
  assert.equal(core.isAnswerAttempt('D, no spec folder needed'), true);
  // Ordinary prose that merely starts with a letter must not read as an
  // answer attempt on an open gate.
  assert.equal(core.isAnswerAttempt('A pretty big problem'), false);
  assert.equal(core.isAnswerAttempt('D is the wrong option, use A instead'), false);
  assert.equal(core.isAnswerAttempt('review the auth module'), false);
  assert.equal(core.isAnswerAttempt(''), false);
});

test('resolveSessionKey: session file wins, id and unknown token are fallbacks', () => {
  assert.equal(
    core.resolveSessionKey({ sessionId: 'uuid-1', sessionFile: '/tmp/sessions/--proj--/2026-08-02T00-00-00.sess.jsonl' }),
    'file:2026-08-02T00-00-00.sess.jsonl',
  );
  assert.equal(core.resolveSessionKey({ sessionId: 'uuid-1', sessionFile: '' }), 'uuid-1');
  assert.equal(core.resolveSessionKey({ sessionId: 'uuid-1', sessionFile: '/' }), 'uuid-1');
  assert.equal(core.resolveSessionKey({ sessionId: 'uuid-1', sessionFile: '   ' }), 'uuid-1');
  assert.equal(core.resolveSessionKey({ sessionId: 'uuid-1' }), 'uuid-1');
  assert.equal(core.resolveSessionKey({}), core.UNKNOWN_SESSION_ID);
});

test('sanitizePromptForClassify: strips injected advisor tail and history, keeps the user turn', () => {
  const advisorTail = '\n\nAdvisor: live; use sk-code 0.9/0.2 pass.\nDirectives:\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR- ids in code comments\n- Governor: move on; write the durable WHY';
  // Clean user turn with the injected advisor capsule appended: the bullet
  // block (which carries trigger words) is cut; the one-line advisor
  // summary before the label may remain -- it cannot carry trigger words.
  const withInjection = 'review the auth module' + advisorTail;
  assert.equal(
    core.sanitizePromptForClassify(withInjection),
    'review the auth module\n\nAdvisor: live; use sk-code 0.9/0.2 pass.',
  );
  // No injected layers: unchanged.
  assert.equal(core.sanitizePromptForClassify('fix the login bug'), 'fix the login bug');
  // Embedded history with [user] markers: only the last turn survives.
  assert.equal(
    core.sanitizePromptForClassify('[user] create a spec folder [assistant] ok [user] review the auth module'),
    ' review the auth module',
  );
  // Marker-only tail: falls back to the whole text rather than dropping it.
  assert.equal(core.sanitizePromptForClassify('review the auth module [user]'), 'review the auth module [user]');
  // Realistic combined shape: embedded history, then the current turn, then
  // the injected advisor tail -- both layers stripped in one pass (the
  // one-line advisor summary before the label may ride along).
  assert.equal(
    core.sanitizePromptForClassify('[user] create a spec folder [assistant] ok [user] review the auth module' + advisorTail),
    ' review the auth module\n\nAdvisor: live; use sk-code 0.9/0.2 pass.',
  );
  // Non-string input degrades to empty, never throws.
  assert.equal(core.sanitizePromptForClassify(undefined), '');
});

// ─────────────────────────────────────────────────────────────────────────────
// Read-only guard
// ─────────────────────────────────────────────────────────────────────────────

test('read-only prompts never open the gate', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({ prompt: 'review the auth module', sessionID, projectDir: root });
    assert.equal(result.status, 'closed');
    assert.equal(result.question, null);

    // Confirm no state file was written for a non-triggering prompt: a
    // subsequent Write is allowed with no gate ever having opened.
    const mutation = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('empty/whitespace-only prompt never triggers Gate 3', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({ prompt: '   ', sessionID, projectDir: root });
    assert.equal(result.status, 'closed');
    assert.equal(result.question, null);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Exempt-path
// ─────────────────────────────────────────────────────────────────────────────

test('exempt path: writing the spec folder itself is always allowed', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'create the migration script', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'Write',
      filePath: `${folderRel}/spec.md`,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('path traversal cannot masquerade a real source file as exempt', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the sync job', sessionID, projectDir: root });

    // "/tmp/../<real source file>" starts with the exempt "/tmp/" prefix as a
    // raw string, but resolves to a real in-repo file -- it must still deny.
    const traversal = `/tmp/../${join(root, 'src', 'login.ts').replace(/^\//, '')}`;
    const result = core.evaluateMutation({
      tool: 'write',
      filePath: traversal,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny');
  } finally {
    cleanup(root);
  }
});

test('exempt path: /tmp scratchpad, dist, node_modules, .git, out-of-repo', () => {
  const { root } = makeWorkspace();
  const sessionID = nextSessionID();
  core.classifyIntent({ prompt: 'implement the new handler', sessionID, projectDir: root });

  const cases = [
    '/tmp/some-scratch-file.md',
    join(root, 'dist', 'bundle.js'),
    join(root, 'node_modules', 'pkg', 'index.js'),
    join(root, '.git', 'HEAD'),
    '/completely/outside/the/repo.ts',
  ];

  try {
    for (const filePath of cases) {
      const result = core.evaluateMutation({
        tool: 'Write',
        filePath,
        sessionID,
        projectDir: root,
        env: { [core.ENFORCE_ENV]: '1' },
      });
      assert.equal(result.decision, 'allow', `expected allow for exempt path ${filePath}`);
    }
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Bash is always advise-only
// ─────────────────────────────────────────────────────────────────────────────

test('bash never denies even with enforce on and gate open', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'delete the stale cache', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'bash',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.notEqual(result.decision, 'deny');
    assert.equal(result.decision, 'advise');
    // bash is never deny-capable, so it can never register as would-deny either.
    assert.equal(result.wouldDeny, false);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// enforcement matrix: deny appears only for the single all-true row
// ─────────────────────────────────────────────────────────────────────────────

test('deny matrix: only enforce-on + write/edit + open + non-exempt denies', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const tools = ['write', 'edit', 'bash', 'patch'];
    const enforceValues = [undefined, '1'];
    const targets = [
      { label: 'source', filePath: 'src/login.ts', exempt: false },
      { label: 'exempt', filePath: `${folderRel}/spec.md`, exempt: true },
    ];

    let denyCount = 0;
    for (const tool of tools) {
      for (const enforceValue of enforceValues) {
        for (const target of targets) {
          const sessionID = nextSessionID();
          core.classifyIntent({ prompt: 'implement the sync job', sessionID, projectDir: root });
          const env = enforceValue ? { [core.ENFORCE_ENV]: enforceValue } : {};
          const result = core.evaluateMutation({
            tool,
            filePath: target.filePath,
            sessionID,
            projectDir: root,
            env,
          });

          const expectDeny = enforceValue === '1' && (tool === 'write' || tool === 'edit') && !target.exempt;
          // wouldDeny is independent of the enforce env entirely: it is true
          // for exactly the (write|edit) + non-exempt rows, regardless of
          // enforceValue -- the discriminator this telemetry signal exists
          // to measure would-be-deny traffic while enforce stays off.
          const expectWouldDeny = (tool === 'write' || tool === 'edit') && !target.exempt;
          if (expectDeny) {
            denyCount += 1;
            assert.equal(result.decision, 'deny', `expected deny for ${tool}/${enforceValue}/${target.label}`);
          } else {
            assert.notEqual(result.decision, 'deny', `expected non-deny for ${tool}/${enforceValue}/${target.label}`);
          }
          assert.equal(
            result.wouldDeny,
            expectWouldDeny,
            `expected wouldDeny=${expectWouldDeny} for ${tool}/${enforceValue}/${target.label}`,
          );
        }
      }
    }
    // 4 tools x 2 enforce values x 2 targets = 16 rows; exactly 2 should deny
    // (write+enforce-on+non-exempt, edit+enforce-on+non-exempt).
    assert.equal(denyCount, 2);
  } finally {
    cleanup(root);
  }
});

test('gate never opened this session: satisfied/skipped/closed all allow', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Fail-open assertions
// ─────────────────────────────────────────────────────────────────────────────

test('fail-open: corrupt state file reads as never-opened', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const { stateDir } = core.resolveGuardPaths(root);
    mkdirSync(stateDir, { recursive: true });
    const statePath = join(stateDir, `${core.sessionStateKey(sessionID)}.json`);
    writeFileSync(statePath, '{ not valid json');

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('fail-open: unwritable state directory never blocks classify or enforce', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const { stateDir } = core.resolveGuardPaths(root);
    // Occupy the state-dir path with a plain file so mkdirSync(recursive) fails.
    mkdirSync(join(root, '.opencode', 'skills'), { recursive: true });
    writeFileSync(stateDir, 'not a directory');

    // Classify is advisory-only: even though the write fails (and the answer
    // cannot be remembered), it still surfaces the question this turn rather
    // than silently dropping it -- the load-bearing fail-open guarantee is
    // that evaluateMutation (the one surface that can actually block) never
    // denies on a persistence failure, asserted below.
    assert.doesNotThrow(() => {
      core.classifyIntent({ prompt: 'fix the auth bug', sessionID, projectDir: root });
    });

    const mutation = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    try { chmodSync(join(root, '.opencode', 'skills', '.spec-gate-state'), 0o644); } catch (_) { /* best-effort */ }
    cleanup(root);
  }
});

test('fail-open: unexpected argument shape never throws and always allows', () => {
  assert.doesNotThrow(() => {
    const classified = core.classifyIntent({ prompt: 'fix the bug', sessionID: 's', projectDir: 12345 });
    assert.equal(classified.status, 'closed');
  });
  assert.doesNotThrow(() => {
    const result = core.evaluateMutation({ tool: 'write', filePath: 'x.ts', sessionID: 's', projectDir: 12345, env: { [core.ENFORCE_ENV]: '1' } });
    assert.equal(result.decision, 'allow');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fix 2/4: a null (not merely malformed-but-object) request must never throw
// -- request.env / the kill-switch used to be read BEFORE the try/catch
// boundary, so classifyIntent(null)/evaluateMutation(null) threw a raw
// TypeError instead of failing open. Isolated to a fresh empty cwd (via
// process.chdir) so the "no real gate state present" assumption holds
// regardless of this repo's own ambient .spec-gate-state contents.
// ─────────────────────────────────────────────────────────────────────────────

test('classifyIntent(null) fails open: never throws, returns the closed/no-question shape', () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'spec-gate-null-request-'));
  const originalCwd = process.cwd();
  try {
    process.chdir(tempDir);
    assert.doesNotThrow(() => {
      const result = core.classifyIntent(null);
      assert.equal(result.status, 'closed');
      assert.equal(result.question, null);
    });
  } finally {
    process.chdir(originalCwd);
    cleanup(tempDir);
  }
});

test('evaluateMutation(null) fails open: never throws, always allows', () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'spec-gate-null-request-'));
  const originalCwd = process.cwd();
  try {
    process.chdir(tempDir);
    assert.doesNotThrow(() => {
      const result = core.evaluateMutation(null);
      assert.equal(result.decision, 'allow');
      assert.equal(result.detail, null);
      assert.equal(result.wouldDeny, false);
    });
  } finally {
    process.chdir(originalCwd);
    cleanup(tempDir);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Kill switch
// ─────────────────────────────────────────────────────────────────────────────

test('MK_SPEC_GATE_DISABLED=1 makes both entrypoints a full no-op', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const classified = core.classifyIntent({
      prompt: 'fix the login bug',
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1' },
    });
    assert.equal(classified.status, 'closed');
    assert.equal(classified.question, null);

    const mutation = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1', [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
    assert.equal(mutation.wouldDeny, false);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// no console output; enforce never walks the specs tree
// ─────────────────────────────────────────────────────────────────────────────

test('static shape: core never writes console output', () => {
  const source = readFileSync(CORE_SOURCE_PATH, 'utf8');
  assert.equal(/console\.(log|warn|error|info|debug)/.test(source), false);
});

test('static shape: evaluateMutation never calls validateSpecFolderBinding', () => {
  const source = readFileSync(CORE_SOURCE_PATH, 'utf8');
  const start = source.indexOf('export function evaluateMutation');
  assert.ok(start !== -1, 'evaluateMutation not found in source');
  const nextExport = source.indexOf('\nexport function', start + 1);
  const body = nextExport === -1 ? source.slice(start) : source.slice(start, nextExport);
  assert.equal(body.includes('validateSpecFolderBinding'), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// answerParse() corpus: false-positive / false-negative rate
// ─────────────────────────────────────────────────────────────────────────────

const POSITIVE_ANSWER_CORPUS = [
  { prompt: 'B, use .opencode/specs/059-login', expect: 'binding' },
  { prompt: 'C, .opencode/specs/track/042-foo', expect: 'binding' },
  { prompt: 'E - .opencode/specs/parent/003-phase', expect: 'binding' },
  // E is the question menu's Skip letter: standalone E (and punctuation
  // forms) closes the gate without a binding.
  { prompt: 'E', expect: 'skip' },
  { prompt: 'e', expect: 'skip' },
  { prompt: 'skip', expect: 'skip' },
  { prompt: 'Skip - handled elsewhere', expect: 'skip' },
  { prompt: 'A, 059-login-fix', expect: 'binding' },
  { prompt: 'C: specs/legacy-042-bar', expect: 'binding' },
  // standalone-E immediately followed by punctuation still skips.
  { prompt: 'E, no spec folder needed', expect: 'skip' },
  { prompt: 'E) no spec folder needed', expect: 'skip' },
  // WS5: "skip it" natural form, separated cleanly from any trailing aside.
  { prompt: 'skip it, no folder needed', expect: 'skip' },
  // WS5: closed-set natural lead-ins register the letter for a bare-token bind.
  { prompt: 'option B, 042-foo', expect: 'binding' },
  { prompt: 'go with C, 099-bar-baz', expect: 'binding' },
  // A natural-lead-in letter E is ALWAYS the skip choice, never a
  // stalled/no-folder-named binding attempt -- even with a trailing
  // folder-shaped token, E wins as skip.
  { prompt: 'option E', expect: 'skip' },
  { prompt: 'option E, 999-valid', expect: 'skip' },
  // D is a folder option in the menu, so a D answer with a folder token
  // binds; without one it stays open (see the negative corpus).
  { prompt: 'option D, 999-valid', expect: 'binding' },
  // A full named path always binds, even when the turn also carries a skip
  // shape (standalone letter, skip word) -- naming a real folder outranks
  // the default skip reading.
  { prompt: 'D, .opencode/specs/parent/003-phase', expect: 'binding' },
  { prompt: 'skip, use .opencode/specs/059-login', expect: 'binding' },
];

const NEGATIVE_PROMPT_CORPUS = [
  'fix the login bug',
  'review the auth module',
  'can you explain how classifyPrompt works',
  'add a new endpoint for exports',
  'analyze the decomposition phase',
  'delete the abandoned branch',
  'the deploy failed at 2am, any idea why',
  'discuss the tradeoffs before deciding',
  'audit the recent commits',
  'run the test suite again',
  '404-not-found is the error page component',
  'A pretty big refactor is coming',
  // WS5: a bare "skip" running straight into a full sentence is prose ABOUT
  // skipping something else, not an answer to Gate 3 -- must not false-close.
  'skip the lint errors for now, just fix the parser bug',
  // WS5: a bare "D" running into ordinary prose about option D, not a chosen skip.
  'D is the wrong option, use A instead',
  // D is a folder option in the menu, not the skip letter: pathless D
  // answers stay open (re-ask) rather than closing the gate.
  'D',
  'd',
  'D, no spec folder needed',
  'D) no spec folder needed',
  'option D',
  // E-prose is not a chosen skip either.
  'E is the wrong option, use A instead',
  // fix 5: "D-danger" is a compound word fused directly onto the letter (no
  // separating whitespace before the hyphen) -- prose ABOUT danger, not a
  // chosen skip. Must never false-close the gate.
  'D-danger is not a skip answer',
  // fix 5: contradictory prose -- explicitly negates the skip AND names a
  // different lettered option in the same breath. Ambiguous: must return
  // null (stay open, re-ask), never guess toward either reading.
  'D: do not skip; use A instead',
];

test('answerParse() corpus: recognized answers parse correctly (false-negative rate)', () => {
  let falseNegatives = 0;
  for (const { prompt, expect } of POSITIVE_ANSWER_CORPUS) {
    const parsed = core.answerParse(prompt);
    if (!parsed || parsed.type !== expect) {
      falseNegatives += 1;
    }
  }
  const rate = falseNegatives / POSITIVE_ANSWER_CORPUS.length;
  assert.equal(falseNegatives, 0, `answerParse() false-negative rate ${rate} on the answer corpus`);
});

test('answerParse() corpus: ordinary prompts are never misread as answers (false-positive rate)', () => {
  let falsePositives = 0;
  const misreads = [];
  for (const prompt of NEGATIVE_PROMPT_CORPUS) {
    const parsed = core.answerParse(prompt);
    if (parsed) {
      falsePositives += 1;
      misreads.push(prompt);
    }
  }
  const rate = falsePositives / NEGATIVE_PROMPT_CORPUS.length;
  assert.equal(falsePositives, 0, `answerParse() false-positive rate ${rate} on prompts: ${misreads.join(' | ')}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// State helpers: sweep / evict sanity
// ─────────────────────────────────────────────────────────────────────────────

test('state round-trip: write, read, evict', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const { stateDir } = core.resolveGuardPaths(root);
    const wrote = core.writeGateStateAtomic(stateDir, sessionID, { status: 'open', askedAtMs: 1 });
    assert.equal(wrote, true);

    const read = core.readGateState(stateDir, sessionID);
    assert.equal(read.status, 'open');

    const evicted = core.evictGateState(stateDir, sessionID);
    assert.equal(evicted, true);

    const readAfterEvict = core.readGateState(stateDir, sessionID);
    assert.deepEqual(readAfterEvict, {});
  } finally {
    cleanup(root);
  }
});

test('sweepStaleGateStates never throws on an empty or missing state dir', () => {
  const { root } = makeWorkspace();
  try {
    const { stateDir } = core.resolveGuardPaths(root);
    assert.doesNotThrow(() => core.sweepStaleGateStates(stateDir, {}));
  } finally {
    cleanup(root);
  }
});

test('appendWarningLog never throws and is fail-open on an unwritable dir', () => {
  assert.doesNotThrow(() => {
    core.appendWarningLog('/definitely/not/writable/path/xyz', 'test detail');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// WS1: formatSpecGateEvent -- the shared telemetry line formatter
// ─────────────────────────────────────────────────────────────────────────────

test('formatSpecGateEvent: composes the canonical pipe-delimited fields in order', () => {
  const line = core.formatSpecGateEvent({
    runtime: 'opencode',
    sessionID: 'sess-123',
    tool: 'write',
    filePath: 'src/login.ts',
    decision: 'would-deny',
  });
  assert.equal(line, 'opencode | sess-123 | write | src/login.ts | would-deny');
});

test('formatSpecGateEvent: missing/empty fields render as "-", never break the field count', () => {
  const line = core.formatSpecGateEvent({ runtime: 'claude', decision: 'advise' });
  const fields = line.split(' | ');
  assert.equal(fields.length, 5);
  assert.equal(fields[0], 'claude');
  assert.equal(fields[1], '-'); // sessionID missing
  assert.equal(fields[2], '-'); // tool missing
  assert.equal(fields[3], '-'); // filePath missing
  assert.equal(fields[4], 'advise');
});

test('fix 1: formatSpecGateEvent redacts a secret-looking path segment, never leaks it verbatim', () => {
  const line = core.formatSpecGateEvent({
    runtime: 'claude',
    sessionID: 'sess-secret',
    tool: 'write',
    filePath: 'src/token=sk_live_SECRETVALUE123.ts',
    decision: 'would-deny',
  });
  assert.equal(line.includes('SECRETVALUE123'), false, 'the secret value must never appear verbatim in the emitted line');
  assert.ok(line.includes('[REDACTED]'), 'a redaction placeholder must replace the secret-shaped segment');
  const fields = line.split(' | ');
  assert.equal(fields.length, 5);
  assert.equal(fields[4], 'would-deny');
});

test('fix 1: formatSpecGateEvent leaves an ordinary, non-secret-shaped filePath untouched', () => {
  const line = core.formatSpecGateEvent({
    runtime: 'claude',
    sessionID: 'sess-plain',
    tool: 'write',
    filePath: 'src/login.ts',
    decision: 'advise',
  });
  assert.ok(line.includes('src/login.ts'));
});

test('formatSpecGateEvent: a hostile filePath (pipe/newline) cannot inject a second field or line', () => {
  const line = core.formatSpecGateEvent({
    runtime: 'opencode',
    sessionID: 'sess-1',
    tool: 'write',
    filePath: 'src/evil.ts | fake-field\ninjected second line',
    decision: 'would-deny',
  });
  assert.equal(line.includes('\n'), false, 'no raw newline may survive sanitization');
  const fields = line.split(' | ');
  // The formatter still emits exactly 5 fields even though the hostile
  // filePath TRIED to smuggle in extra pipes -- every internal '|' in the
  // field is stripped before the real separators are joined.
  assert.equal(fields.length, 5);
  assert.equal(fields[4], 'would-deny');
});

test('formatSpecGateEvent: the runtime field is the only thing that differs between the two adapters', () => {
  const shared = { sessionID: 'sess-9', tool: 'edit', filePath: 'src/x.ts', decision: 'advise' };
  const opencodeLine = core.formatSpecGateEvent({ runtime: 'opencode', ...shared });
  const claudeLine = core.formatSpecGateEvent({ runtime: 'claude', ...shared });
  assert.equal(opencodeLine.replace(/^opencode/, 'RUNTIME'), claudeLine.replace(/^claude/, 'RUNTIME'));
});

test('appendWarningLog + formatSpecGateEvent: a source-file mutation event produces exactly one parseable line', () => {
  const { root } = makeWorkspace();
  try {
    const { stateDir } = core.resolveGuardPaths(root);
    const logPath = join(stateDir, 'spec-gate-warnings.log');

    const line = core.formatSpecGateEvent({
      runtime: 'opencode',
      sessionID: 'sess-parse',
      tool: 'write',
      filePath: 'src/login.ts | injected\nsecond-line',
      decision: 'would-deny',
    });
    core.appendWarningLog(stateDir, line);

    const contents = readFileSync(logPath, 'utf8');
    const lines = contents.split('\n').filter((entry) => entry.length > 0);
    assert.equal(lines.length, 1, 'a hostile field must never split one advisory into two log lines');
    assert.ok(lines[0].includes('[mk-spec-gate]'));
    const [, payload] = lines[0].split('[mk-spec-gate] ');
    const fields = payload.split(' | ');
    assert.equal(fields.length, 5);
    assert.equal(fields[0], 'opencode');
    assert.equal(fields[1], 'sess-parse');
    assert.equal(fields[2], 'write');
    assert.equal(fields[4], 'would-deny');
  } finally {
    cleanup(root);
  }
});

test('MK_SPEC_GATE_DISABLED=1: the kill-switch means no telemetry line is ever written', () => {
  const { root } = makeWorkspace();
  const sessionID = nextSessionID();
  const { stateDir } = core.resolveGuardPaths(root);
  const logPath = join(stateDir, 'spec-gate-warnings.log');
  try {
    core.classifyIntent({
      prompt: 'fix the login bug',
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1' },
    });
    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1', [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
    assert.equal(result.wouldDeny, false);
    // The disabled path never even reaches the adapter's log call (decision
    // is 'allow'), so this test only pins evaluateMutation's own contract;
    // no log file should exist from this sequence at all.
    assert.equal(existsSync(logPath), false);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P1 fix: a classify-path exception must evict a previously persisted 'open'
// session state, never leave it stale for a later enforce hook to read.
// ─────────────────────────────────────────────────────────────────────────────

test('classify-path exception evicts a previously persisted open state (fail-open, not fail-stale)', async (t) => {
  if (typeof t.mock?.module !== 'function') {
    t.skip('requires --experimental-test-module-mocks (Node ESM module mocking)');
    return;
  }

  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();

    // 1. Genuinely open the gate with the real classifier.
    const opened = core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
    assert.equal(opened.status, 'open');
    const { stateDir } = core.resolveGuardPaths(root);
    assert.equal(core.readGateState(stateDir, sessionID).status, 'open');

    // 2. Force the classifier to throw on the NEXT turn, via a freshly
    // dynamically-imported core instance bound to the mocked dependency
    // (the top-level `core` import already resolved the real classifier).
    t.mock.module(CLASSIFIER_MODULE_PATH, {
      namedExports: {
        classifyPrompt: () => { throw new Error('forced classifier failure'); },
        validateSpecFolderBinding: () => ({ valid: false }),
      },
    });
    const mockedCore = await import(`${CORE_MODULE_URL}?mock-classifier-throw=${Date.now()}`);

    const result = mockedCore.classifyIntent({ prompt: 'still working on it', sessionID, projectDir: root });
    assert.equal(result.status, 'closed');

    // 3. The stale 'open' state must be GONE, not merely unreturned this
    // turn -- otherwise a later enforce hook reading the same session state
    // would still see 'open' and could deny despite this turn reporting closed.
    assert.deepEqual(core.readGateState(stateDir, sessionID), {});

    // 4. A subsequent Write/Edit for this session must allow, never deny,
    // proving the fail-open contract holds end-to-end after the exception.
    const mutation = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P1 fix: exemption/containment is decided on the REAL path (realpath), not
// the lexical one -- an in-repo symlink escaping the repo must be exempt.
// ─────────────────────────────────────────────────────────────────────────────

test('symlink escape: an in-repo symlink whose real target lands outside the repo is exempt', () => {
  const { root } = makeWorkspace();
  const outsideDir = mkdtempSync(join(tmpdir(), 'spec-gate-outside-'));
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the escape hatch', sessionID, projectDir: root });

    const outsideFile = join(outsideDir, 'real-target.ts');
    writeFileSync(outsideFile, '// outside the repo\n');
    const linkPath = join(root, 'src', 'escape-link.ts');
    symlinkSync(outsideFile, linkPath);

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: linkPath,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow', 'an in-repo symlink resolving outside the repo must be exempt, not enforceable');
  } finally {
    cleanup(root);
    cleanup(outsideDir);
  }
});

test('symlink sanity: an in-repo symlink whose real target stays in-repo is still enforceable', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the redirect', sessionID, projectDir: root });

    const linkPath = join(root, 'src', 'inside-link.ts');
    symlinkSync(join(root, 'src', 'login.ts'), linkPath);

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: linkPath,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny', 'an in-repo symlink resolving to another in-repo file must still be enforceable');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 fix: answerParse() is state-gated structurally (isOpen), not merely by
// caller convention -- a direct call with isOpen:false must never parse.
// ─────────────────────────────────────────────────────────────────────────────

test('answerParse() never parses an answer when isOpen is explicitly false', () => {
  assert.equal(core.answerParse('B, .opencode/specs/059-login', false), null);
  assert.equal(core.answerParse('E', false), null);
  assert.equal(core.answerParse('skip', false), null);
  // Omitting isOpen preserves the raw-parser contract the answerParse()
  // corpus tests above rely on (default true).
  assert.notEqual(core.answerParse('E'), null);
  assert.equal(core.answerParse('D'), null);
  assert.notEqual(core.answerParse('B, .opencode/specs/059-login', true), null);
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 fix: UNKNOWN_SESSION_ID is exported so every adapter can key a missing
// sessionID to the EXACT same state file the core's own internal fallback
// resolves to -- this is the anchor the OpenCode adapter's classify/enforce
// unification (mk-spec-gate.js sessionIdFrom()) depends on.
// ─────────────────────────────────────────────────────────────────────────────

test('sessionStateKey: an omitted/nullish sessionID resolves to the SAME key as the exported UNKNOWN_SESSION_ID constant', () => {
  assert.equal(core.sessionStateKey(undefined), core.sessionStateKey(core.UNKNOWN_SESSION_ID));
  assert.equal(core.sessionStateKey(null), core.sessionStateKey(core.UNKNOWN_SESSION_ID));
});

// ─────────────────────────────────────────────────────────────────────────────
// P2 fix: exemption/containment must canonicalize path CASING (via
// realpathSync.native), not just symlink targets -- a case-variant path
// pointing at a real in-repo file must never read as exempt.
// ─────────────────────────────────────────────────────────────────────────────

test('case-insensitive FS: a case-variant path to a real in-repo file is still enforceable, never falsely exempt', (t) => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the case check', sessionID, projectDir: root });

    const realPath = join(root, 'src', 'login.ts');
    const variantPath = join(root, 'SRC', 'LOGIN.ts');

    // Only meaningful on a case-insensitive-but-case-preserving filesystem
    // (default macOS APFS, Windows NTFS): confirm the variant path actually
    // resolves to the SAME on-disk file before asserting anything. On a
    // genuinely case-sensitive host, the variant is a different, nonexistent
    // path -- the vulnerability this test pins does not exist there.
    let isSameFile = false;
    try {
      isSameFile = realpathSync.native(variantPath) === realpathSync.native(realPath);
    } catch (_) {
      isSameFile = false;
    }
    if (!isSameFile) {
      t.skip('host filesystem is case-sensitive; case-variant path is a genuinely different file here');
      return;
    }

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: variantPath,
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny', 'a case-variant path to a real in-repo file must still be enforceable, not exempt');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// HIGHEST BLAST proof: MK_SPEC_GATE_ENFORCE unset never denies, across the
// full tool/target/gate-state matrix; every known error path fails OPEN.
// ─────────────────────────────────────────────────────────────────────────────

test('HIGHEST BLAST proof: with MK_SPEC_GATE_ENFORCE unset, no tool/target/gate-state combination ever denies', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const tools = ['write', 'edit', 'Write', 'Edit', 'patch', 'multiedit', 'apply_patch', 'bash', 'read', 'glob', 'bogus-tool'];
    const targets = [
      'src/login.ts',
      `${folderRel}/spec.md`,
      '/tmp/scratch.md',
      join(root, 'dist', 'out.js'),
      '/completely/outside/the/repo.ts',
    ];
    const gateSetups = [
      (sessionID) => { core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root }); }, // -> open
      (sessionID) => {
        core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
        core.classifyIntent({ prompt: 'E', sessionID, projectDir: root });
      }, // -> skipped
      (sessionID) => {
        core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
        core.classifyIntent({ prompt: `B, use ${folderRel}`, sessionID, projectDir: root });
      }, // -> satisfied
      () => {}, // never opened
    ];

    let checked = 0;
    for (const tool of tools) {
      for (const target of targets) {
        for (const setup of gateSetups) {
          const sessionID = nextSessionID();
          setup(sessionID);
          // env has NO ENFORCE_ENV key at all -- the unset case.
          const result = core.evaluateMutation({ tool, filePath: target, sessionID, projectDir: root, env: {} });
          assert.notEqual(result.decision, 'deny', `enforce unset must never deny for ${tool}/${target}`);
          checked += 1;
        }
      }
    }
    assert.equal(checked, tools.length * targets.length * gateSetups.length);
  } finally {
    cleanup(root);
  }
});

test('HIGHEST BLAST proof: every known error path resolves to allow, even with enforce=1', () => {
  const enforceEnv = { [core.ENFORCE_ENV]: '1' };

  // 1. Corrupt/unreadable state file.
  {
    const { root } = makeWorkspace();
    try {
      const sessionID = nextSessionID();
      const { stateDir } = core.resolveGuardPaths(root);
      mkdirSync(stateDir, { recursive: true });
      writeFileSync(join(stateDir, `${core.sessionStateKey(sessionID)}.json`), '{ not valid json');
      const result = core.evaluateMutation({ tool: 'write', filePath: 'src/login.ts', sessionID, projectDir: root, env: enforceEnv });
      assert.notEqual(result.decision, 'deny');
    } finally {
      cleanup(root);
    }
  }

  // 2. Unwritable state directory.
  {
    const { root } = makeWorkspace();
    try {
      const sessionID = nextSessionID();
      const { stateDir } = core.resolveGuardPaths(root);
      mkdirSync(join(root, '.opencode', 'skills'), { recursive: true });
      writeFileSync(stateDir, 'not a directory');
      const result = core.evaluateMutation({ tool: 'write', filePath: 'src/login.ts', sessionID, projectDir: root, env: enforceEnv });
      assert.notEqual(result.decision, 'deny');
    } finally {
      try { chmodSync(join(root, '.opencode', 'skills', '.spec-gate-state'), 0o644); } catch (_) { /* best-effort */ }
      cleanup(root);
    }
  }

  // 3. Unexpected argument shape (non-string projectDir).
  {
    const result = core.evaluateMutation({ tool: 'write', filePath: 'x.ts', sessionID: 's', projectDir: 12345, env: enforceEnv });
    assert.notEqual(result.decision, 'deny');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// WS2: trigger-turn self-binding -- a prompt that BOTH triggers Gate 3 AND
// names a valid folder in the same breath binds on that turn, never opens.
// ─────────────────────────────────────────────────────────────────────────────

test('WS2 self-bind: a trigger prompt naming a valid spec-path folder satisfies on the same turn', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({
      prompt: `fix the login bug, use ${folderRel}`,
      sessionID,
      projectDir: root,
    });
    assert.equal(result.status, 'satisfied');
    assert.equal(result.question, null);

    // The very next Write allows even with enforce on -- no second turn needed.
    const mutation = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('WS2 self-bind: a trigger prompt naming a valid bare NNN-slug folder satisfies on the same turn', () => {
  const { root } = makeWorkspace();
  const folderName = '997-self-bind-bare';
  mkdirSync(join(root, '.opencode', 'specs', folderName), { recursive: true });
  writeFileSync(join(root, '.opencode', 'specs', folderName, 'spec.md'), '# Test\n');
  writeFileSync(join(root, '.opencode', 'specs', folderName, 'description.json'), '{}\n');
  writeFileSync(join(root, '.opencode', 'specs', folderName, 'graph-metadata.json'), '{}\n');
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({
      prompt: `implement the export pipeline, ${folderName}`,
      sessionID,
      projectDir: root,
    });
    assert.equal(result.status, 'satisfied');
  } finally {
    cleanup(root);
  }
});

test('WS2 self-bind: a trigger prompt naming an INVALID folder still opens the gate (never guesses)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({
      prompt: 'fix the login bug, use .opencode/specs/does-not-exist',
      sessionID,
      projectDir: root,
    });
    assert.equal(result.status, 'open');
    assert.ok(result.question && result.question.includes('SPEC FOLDER QUESTION'));
  } finally {
    cleanup(root);
  }
});

test('WS2 self-bind: a trigger prompt naming no folder at all still opens the gate (unchanged)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
    assert.equal(result.status, 'open');
  } finally {
    cleanup(root);
  }
});

test('WS2 self-bind: an incidental digit-dash token in ordinary prose never falsely self-binds', () => {
  // "404-not-found" looks like a bare NNN-slug token but is not a real spec
  // folder -- classifyIntent must fall through to opening the gate, not deny
  // or silently satisfy against a nonexistent path. This prompt does not
  // trigger Gate 3 at all (no file-write verb), so it should not even open.
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({
      prompt: '404-not-found is the error page component',
      sessionID,
      projectDir: root,
    });
    assert.equal(result.status, 'closed');
  } finally {
    cleanup(root);
  }
});

test('extractSpecFolderCandidate: returns a spec-path token, a bare token, or null with no letter/skip grammar', () => {
  assert.equal(core.extractSpecFolderCandidate('fix the bug, use .opencode/specs/059-login'), '.opencode/specs/059-login');
  assert.equal(core.extractSpecFolderCandidate('implement the feature, 042-foo'), '042-foo');
  assert.equal(core.extractSpecFolderCandidate('fix the login bug'), null);
  assert.equal(core.extractSpecFolderCandidate(''), null);
  assert.equal(core.extractSpecFolderCandidate(undefined), null);
});

test('WS2 options-threading: classificationOptions with a satisfying prebound folder closes the gate without a question', async (t) => {
  if (typeof t.mock?.module !== 'function') {
    t.skip('requires --experimental-test-module-mocks (Node ESM module mocking)');
    return;
  }
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    t.mock.module(CLASSIFIER_MODULE_PATH, {
      namedExports: {
        classifyPrompt: () => ({
          triggersGate3: true,
          requiresGate3Prompt: false,
          satisfiedBy: 'prebound_spec_folder',
          writeBoundary: '.opencode/specs/999-mock',
          reason: 'file_write_match',
          matched: [],
          readOnlyMatched: [],
        }),
        validateSpecFolderBinding: () => ({ valid: false, reason: 'missing_binding', path: null, resolvedPath: null, resolvedAbsolutePath: null, writeBoundary: null }),
      },
    });
    const mockedCore = await import(`${CORE_MODULE_URL}?mock-options-satisfied=${Date.now()}`);

    const result = mockedCore.classifyIntent({
      prompt: 'run the autonomous workflow',
      sessionID,
      projectDir: root,
      classificationOptions: { executionMode: 'AUTONOMOUS' },
    });
    assert.equal(result.status, 'satisfied');
    assert.equal(result.question, null);
  } finally {
    cleanup(root);
  }
});

test('WS2 options-threading regression guard: requiresGate3Prompt=true still opens the gate as before', async (t) => {
  if (typeof t.mock?.module !== 'function') {
    t.skip('requires --experimental-test-module-mocks (Node ESM module mocking)');
    return;
  }
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    t.mock.module(CLASSIFIER_MODULE_PATH, {
      namedExports: {
        classifyPrompt: () => ({
          triggersGate3: true,
          requiresGate3Prompt: true,
          satisfiedBy: null,
          writeBoundary: null,
          reason: 'file_write_match',
          matched: [],
          readOnlyMatched: [],
        }),
        validateSpecFolderBinding: () => ({ valid: false, reason: 'missing_binding', path: null, resolvedPath: null, resolvedAbsolutePath: null, writeBoundary: null }),
      },
    });
    const mockedCore = await import(`${CORE_MODULE_URL}?mock-options-open=${Date.now()}`);

    const result = mockedCore.classifyIntent({
      prompt: 'do something without a resolvable prebound folder',
      sessionID,
      projectDir: root,
      classificationOptions: { executionMode: 'AUTONOMOUS' },
    });
    assert.equal(result.status, 'open');
    assert.ok(result.question);
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// WS3: scaffolded-folder acceptance -- a folder with only spec.md (no
// description.json/graph-metadata.json yet) satisfies a prior_answer binding.
// ─────────────────────────────────────────────────────────────────────────────

test('WS3 scaffolded accept: a folder with ONLY spec.md (no save-time trio) still satisfies the gate', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/042-scaffolded-only';
  mkdirSync(join(root, folderRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'spec.md'), '# Scaffolded Spec\n\n| **Status** | Active |\n');
  // Deliberately NO description.json / graph-metadata.json -- these are
  // produced at memory-save time, not at scaffold time.
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({ prompt: `B, ${folderRel}`, sessionID, projectDir: root });
    assert.equal(answered.status, 'satisfied');

    const mutation = core.evaluateMutation({
      tool: 'Write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(mutation.decision, 'allow');
  } finally {
    cleanup(root);
  }
});

test('WS3 scaffolded accept: a folder with description.json but NO spec.md still stays open', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/043-no-spec-md';
  mkdirSync(join(root, folderRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'description.json'), '{}\n');
  writeFileSync(join(root, folderRel, 'graph-metadata.json'), '{}\n');
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({ prompt: `B, ${folderRel}`, sessionID, projectDir: root });
    assert.equal(answered.status, 'open');
    assert.ok(answered.question);
  } finally {
    cleanup(root);
  }
});

test('WS3 scaffolded accept: a genuinely non-existent folder still stays open (unaffected by the relaxation)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({
      prompt: 'B, .opencode/specs/999-never-scaffolded',
      sessionID,
      projectDir: root,
    });
    assert.equal(answered.status, 'open');
  } finally {
    cleanup(root);
  }
});

test('WS3 scaffolded accept: an out-of-tree / traversal candidate still stays open', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    // Parses as a path candidate (SPEC_PATH_REGEX requires an alnum right
    // after "specs/"), so it actually reaches validateSpecFolderBinding's
    // traversal check and comes back 'out_of_tree', not 'missing_metadata' --
    // the scaffolded-accept relaxation must never paper over that.
    const answered = core.classifyIntent({
      prompt: 'B, .opencode/specs/foo/../../../etc',
      sessionID,
      projectDir: root,
    });
    assert.equal(answered.status, 'open');
  } finally {
    cleanup(root);
  }
});

test('WS3/fix-3 scaffolded accept: a Deprecated folder with ONLY spec.md (no save-time trio) still stays open', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/046-deprecated-scaffold-only';
  mkdirSync(join(root, folderRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'spec.md'), '# Deprecated Scaffold\n\n| **Status** | Deprecated |\n');
  // Deliberately NO description.json / graph-metadata.json: the classifier
  // returns 'missing_metadata' before it ever reaches its own deprecated
  // check, so the scaffolded-accept relaxation must re-run that check
  // itself (fix 3) rather than accept a scaffold's spec.md regardless of status.
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({ prompt: `B, ${folderRel}`, sessionID, projectDir: root });
    assert.equal(answered.status, 'open', 'a Deprecated scaffold must stay open even though only the trio is missing');
    assert.ok(answered.question);
  } finally {
    cleanup(root);
  }
});

test('WS3/fix-3 scaffolded accept: an Active-status folder with ONLY spec.md still satisfies (unaffected by the deprecated re-check)', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/046-active-scaffold-only';
  mkdirSync(join(root, folderRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'spec.md'), '# Active Scaffold\n\n| **Status** | Active |\n');
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({ prompt: `B, ${folderRel}`, sessionID, projectDir: root });
    assert.equal(answered.status, 'satisfied', 'an Active scaffold with only spec.md must still satisfy the gate');
  } finally {
    cleanup(root);
  }
});

test('fix-3 scaffolded accept: a phase-parent scaffold with no resolvable last_active_child_id stays open', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/047-phase-parent-scaffold';
  const childRel = `${folderRel}/001-child-phase`;
  mkdirSync(join(root, childRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'spec.md'), '# Phase Parent Scaffold\n\n| **Status** | Active |\n');
  writeFileSync(join(root, childRel, 'spec.md'), '# Child Phase\n');
  // A real phase-parent with a genuine child folder, but no graph-metadata.json
  // on the parent -- derived.last_active_child_id lives in exactly the file
  // this scaffold relaxation exists to tolerate the absence of, so with no
  // way to resolve which child is active, it must stay open, never guess.
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({ prompt: `B, ${folderRel}`, sessionID, projectDir: root });
    assert.equal(answered.status, 'open', 'a phase-parent scaffold with no resolvable active child must stay open');
  } finally {
    cleanup(root);
  }
});

test('fix-3 scaffolded accept: a phase-parent scaffold WITH a resolvable last_active_child_id satisfies via the child', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/048-phase-parent-resolvable';
  const childRel = `${folderRel}/001-child-phase`;
  mkdirSync(join(root, childRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'spec.md'), '# Phase Parent Scaffold\n\n| **Status** | Active |\n');
  // graph-metadata.json IS present on the parent (with a resolvable active
  // child) even though description.json is not -- the trio is still
  // "missing" by the classifier's own all-three check.
  writeFileSync(join(root, folderRel, 'graph-metadata.json'), JSON.stringify({ derived: { last_active_child_id: '001-child-phase' } }));
  writeFileSync(join(root, childRel, 'spec.md'), '# Child Phase\n\n| **Status** | Active |\n');
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({ prompt: `B, ${folderRel}`, sessionID, projectDir: root });
    assert.equal(answered.status, 'satisfied', 'a phase-parent scaffold with a resolvable active child must satisfy via that child');
  } finally {
    cleanup(root);
  }
});

test('WS3 scaffolded accept: a deprecated folder carrying the FULL trio still stays open (unchanged)', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/044-deprecated-full-trio';
  mkdirSync(join(root, folderRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'spec.md'), '# Deprecated Spec\n\n| **Status** | Deprecated |\n');
  writeFileSync(join(root, folderRel, 'description.json'), '{}\n');
  writeFileSync(join(root, folderRel, 'graph-metadata.json'), '{}\n');
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'implement the export pipeline', sessionID, projectDir: root });

    const answered = core.classifyIntent({ prompt: `B, ${folderRel}`, sessionID, projectDir: root });
    assert.equal(answered.status, 'open', 'a deprecated folder must still be rejected regardless of the scaffolded relaxation');
  } finally {
    cleanup(root);
  }
});

test('WS3 scaffolded accept: MK_SPEC_GATE_DISABLED=1 short-circuits before the relaxation ever runs', () => {
  const { root } = makeWorkspace();
  const folderRel = '.opencode/specs/045-disabled-check';
  mkdirSync(join(root, folderRel), { recursive: true });
  writeFileSync(join(root, folderRel, 'spec.md'), '# Test\n');
  try {
    const sessionID = nextSessionID();
    const result = core.classifyIntent({
      prompt: `B, ${folderRel}`,
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1' },
    });
    assert.equal(result.status, 'closed');
  } finally {
    cleanup(root);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// WS4: headless / subagent enforce scoping -- a dispatched/child session
// (AI_SESSION_CHILD=1) is a COMPLETE Gate-3 no-op: it never denies, never
// advises, never reads or writes gate state, and never surfaces the question,
// even with enforce on, because it has no user turn to answer Gate 3.
// ─────────────────────────────────────────────────────────────────────────────

test('isChildSession: only the exact value "1" reads as a child session', () => {
  assert.equal(core.isChildSession({ [core.CHILD_SESSION_ENV]: '1' }), true);
  for (const value of ['', '0', 'true', 'yes', '2', undefined]) {
    assert.equal(core.isChildSession({ [core.CHILD_SESSION_ENV]: value }), false, `value ${JSON.stringify(value)} must NOT read as a child`);
  }
  assert.equal(core.isChildSession({}), false);
  assert.equal(core.isChildSession(undefined), false);
  assert.equal(core.isChildSession(null), false);
});

test('WS4 child matrix: enforce on + child session -> complete allow, no telemetry, no state read', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const classify = core.classifyIntent({
      prompt: 'fix the login bug',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1', [core.CHILD_SESSION_ENV]: '1' },
    });
    // Classify is a no-op too: a child has no user turn, so the gate never
    // opens and the question never surfaces.
    assert.equal(classify.status, 'closed');
    assert.equal(classify.question, null);

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1', [core.CHILD_SESSION_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
    assert.equal(result.wouldDeny, false);
    assert.equal(result.detail, null);

    // A child must never persist or read session gate state.
    const { stateDir } = core.resolveGuardPaths(root);
    assert.equal(existsSync(join(stateDir, `${core.sessionStateKey(sessionID)}.json`)), false);
  } finally {
    cleanup(root);
  }
});

test('WS4 child matrix: a child ignores a pre-existing open state and still allows', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const { stateDir } = core.resolveGuardPaths(root);
    // Seed open state as if an earlier interactive turn left it behind; a child
    // must not consult it.
    assert.equal(core.writeGateStateAtomic(stateDir, sessionID, { status: 'open', askedAtMs: 1 }), true);

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1', [core.CHILD_SESSION_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
    assert.equal(result.wouldDeny, false);
  } finally {
    cleanup(root);
  }
});

test('WS4 child matrix: enforce on + NO child signal -> still denies (unchanged interactive behavior)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });

    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1' },
    });
    assert.equal(result.decision, 'deny');
  } finally {
    cleanup(root);
  }
});

test('WS4 child matrix: child + disabled -> allow (kill-switch still outranks everything)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.evaluateMutation({
      tool: 'write',
      filePath: 'src/login.ts',
      sessionID,
      projectDir: root,
      env: { [core.DISABLED_ENV]: '1', [core.ENFORCE_ENV]: '1', [core.CHILD_SESSION_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
    assert.equal(result.wouldDeny, false);
  } finally {
    cleanup(root);
  }
});

test('WS4 child matrix: AI_SESSION_CHILD value variants -- only exact "1" becomes a no-op', () => {
  const { root } = makeWorkspace();
  try {
    for (const value of ['', '0', 'true', 'yes', '2']) {
      const sessionID = nextSessionID();
      core.classifyIntent({ prompt: 'fix the login bug', sessionID, projectDir: root });
      const result = core.evaluateMutation({
        tool: 'write',
        filePath: 'src/login.ts',
        sessionID,
        projectDir: root,
        env: { [core.ENFORCE_ENV]: '1', [core.CHILD_SESSION_ENV]: value },
      });
      assert.equal(result.decision, 'deny', `AI_SESSION_CHILD=${JSON.stringify(value)} must NOT suppress deny (only exact '1' does)`);
    }
  } finally {
    cleanup(root);
  }
});

test('WS4 child matrix: bash is a complete allow no-op for a child session too', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = nextSessionID();
    const result = core.evaluateMutation({
      tool: 'bash',
      sessionID,
      projectDir: root,
      env: { [core.ENFORCE_ENV]: '1', [core.CHILD_SESSION_ENV]: '1' },
    });
    assert.equal(result.decision, 'allow');
    assert.equal(result.wouldDeny, false);
    assert.equal(result.detail, null);
  } finally {
    cleanup(root);
  }
});
