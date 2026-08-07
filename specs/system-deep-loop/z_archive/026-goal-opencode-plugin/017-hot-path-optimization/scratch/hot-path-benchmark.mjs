import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';

const pluginUrl = pathToFileURL(join(process.cwd(), '.opencode/plugins/mk-goal.js')).href;
const pluginModule = await import(`${pluginUrl}?benchmark-${Date.now()}`);
const MkGoalPlugin = pluginModule.default;
const helpers = MkGoalPlugin.__test;

function elapsedMs(start) {
  return Number((performance.now() - start).toFixed(3));
}

async function benchmarkAppendGoalBrief() {
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-bench-append-'));
  const metrics = {};
  try {
    const sessionID = 'bench-append-session';
    await helpers.setGoal(sessionID, 'Benchmark unchanged appendGoalBrief calls', {
      stateDir,
      goalIdFactory: () => 'bench-append-goal',
      metrics,
    });

    metrics.readGoalReadFile = 0;
    let start = performance.now();
    for (let index = 0; index < 10; index += 1) {
      const goal = await helpers.readGoal(sessionID, { stateDir, metrics });
      helpers.renderGoalInjection(goal, { stateDir, metrics });
    }
    const before = {
      wallMs: elapsedMs(start),
      readFileCount: metrics.readGoalReadFile || 0,
    };

    const plugin = await MkGoalPlugin({}, { stateDir, metrics });
    metrics.briefReadFile = 0;
    start = performance.now();
    for (let index = 0; index < 10; index += 1) {
      await plugin['experimental.chat.system.transform']({ sessionID }, { system: [] });
    }
    const after = {
      wallMs: elapsedMs(start),
      readFileCount: metrics.briefReadFile || 0,
    };

    return { before, after };
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}

async function benchmarkMessageUpdated() {
  const stateDir = await mkdtemp(join(tmpdir(), 'mk-goal-bench-message-'));
  const metrics = {};
  try {
    const beforeSessionID = 'bench-message-before';
    const beforeGoal = await helpers.setGoal(beforeSessionID, 'Benchmark two-write message update shape', {
      stateDir,
      goalIdFactory: () => 'bench-message-before-goal',
      tokenBudget: 10000,
      metrics,
    });

    metrics.writeCycles = 0;
    let start = performance.now();
    for (let index = 0; index < 10; index += 1) {
      const current = await helpers.readGoal(beforeSessionID, { stateDir, metrics });
      await helpers.writeGoalAtomic({
        ...current,
        lastActivityAtMs: 2000 + index,
        lastActivityMessageID: `bench-before-${index}`,
        lastEvidence: `before evidence ${index}`,
        updatedAtMs: 2000 + index,
        updatedAt: new Date(2000 + index).toISOString(),
      }, { stateDir, metrics });
      await helpers.accountUsage(beforeSessionID, beforeGoal.goalId, {
        tokenDelta: 1,
        timeDeltaSeconds: 1,
        messageID: `bench-before-${index}`,
        usageSource: 'benchmark-before',
      }, { stateDir, metrics });
    }
    const before = {
      wallMs: elapsedMs(start),
      writeCycles: metrics.writeCycles || 0,
    };

    const afterSessionID = 'bench-message-after';
    await helpers.setGoal(afterSessionID, 'Benchmark merged message update shape', {
      stateDir,
      goalIdFactory: () => 'bench-message-after-goal',
      tokenBudget: 10000,
      metrics,
    });
    const plugin = await MkGoalPlugin({}, { stateDir, metrics });
    metrics.writeCycles = 0;
    start = performance.now();
    for (let index = 0; index < 10; index += 1) {
      await plugin.event({
        event: {
          type: 'message.updated',
          properties: {
            sessionID: afterSessionID,
            info: {
              id: `bench-after-${index}`,
              role: 'assistant',
              content: `after evidence ${index}`,
              usage: { totalTokens: index + 1, source: 'benchmark-after' },
            },
          },
        },
      });
    }
    const after = {
      wallMs: elapsedMs(start),
      writeCycles: metrics.writeCycles || 0,
    };

    return { before, after };
  } finally {
    await rm(stateDir, { recursive: true, force: true });
  }
}

const result = {
  appendGoalBrief10Calls: await benchmarkAppendGoalBrief(),
  messageUpdated10Events: await benchmarkMessageUpdated(),
};

console.log(JSON.stringify(result, null, 2));
