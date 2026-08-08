// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Cache Optimizer Ownership Composition Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';
import { createJiti } from 'jiti';

import type { OwnershipFixture } from '../../shared/composition/one-owner.js';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

// Keep both forks pointed at one fixture so their ownership decisions cannot drift silently.
const fixture = JSON.parse(
  readFileSync(join(process.cwd(), '..', 'shared', 'deepseek-ownership.json'), 'utf8'),
) as OwnershipFixture;

let previousAgentDir: string | undefined;
let agentDir: string;

async function prepareAgentDir() {
  // Extension loading reads process-scoped configuration, so each suite uses an isolated directory.
  previousAgentDir = process.env.PI_CODING_AGENT_DIR;
  agentDir = await mkdtemp(join(tmpdir(), 'pi-ownership-composition-'));
  process.env.PI_CODING_AGENT_DIR = agentDir;
}

async function restoreAgentDir() {
  if (previousAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
  else process.env.PI_CODING_AGENT_DIR = previousAgentDir;
  await rm(agentDir, { recursive: true, force: true });
}

before(prepareAgentDir);
after(restoreAgentDir);

async function loadCrossForkModules() {
  // Disable Jiti caching so both forks and the shared composition helper load fresh for each test.
  const jiti = createJiti(join(process.cwd(), 'tests', 'ownership-composition.test.ts'), {
    interopDefault: false,
    moduleCache: false,
  });
  const deepPi = await jiti.import(join(process.cwd(), '..', 'deep-pi', 'extensions', 'deeppi.ts'));
  const eligibility = await jiti.import(
    join(process.cwd(), '..', 'deep-pi', 'extensions', 'deeppi', 'eligibility.ts'),
  );
  const fakePi = await jiti.import(join(process.cwd(), '..', 'deep-pi', 'tests', 'fake-pi.ts'));
  const composition = await jiti.import(
    join(process.cwd(), '..', 'shared', 'composition', 'one-owner.ts'),
  );
  const optimizer = await jiti.import(join(process.cwd(), '..', 'pi-cache-optimizer', 'index.ts'));
  return { deepPi, eligibility, fakePi, composition, optimizer } as any;
}

function runtimeModel(model: { provider: string; id: string }) {
  return {
    ...model,
    name: model.id,
    api: 'openai-completions',
    baseUrl: 'https://proxy.example/v1',
    compat: {},
    reasoning: false,
    input: ['text'],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128_000,
    maxTokens: 4096,
  };
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('DeepSeek ownership contract', () => {
  test('keeps both real predicates aligned with the shared fixture', async () => {
    const { eligibility, optimizer } = await loadCrossForkModules();
    for (const model of fixture.owned) {
      assert.equal(eligibility.isDeepPiModel(model), true, `${model.provider}/${model.id}`);
      assert.equal(
        optimizer.__internals_for_tests.isDeepPiOwned(model),
        true,
        `${model.provider}/${model.id}`,
      );
    }
    for (const model of fixture.excluded) {
      assert.equal(eligibility.isDeepPiModel(model), false, `${model.provider}/${model.id}`);
      assert.equal(
        optimizer.__internals_for_tests.isDeepPiOwned(model),
        false,
        `${model.provider}/${model.id}`,
      );
    }
  });

  test('composes one owner from both real predicates', async () => {
    const { eligibility, composition, optimizer } = await loadCrossForkModules();
    const results = composition.composeOneOwner(
      fixture,
      eligibility.isDeepPiModel,
      optimizer.__internals_for_tests.isDeepPiOwned,
    );

    for (const result of results) {
      assert.deepEqual(result.actualOwners, [result.expectedOwner], result.modelId);
    }
  });

  test('observes exactly one extension reacting in the combined host', async () => {
    const { deepPi, fakePi, optimizer } = await loadCrossForkModules();
    for (const model of [...fixture.owned, ...fixture.excluded]) {
      const fake = new fakePi.FakePi();
      deepPi.default(fake.asExtensionAPI());
      optimizer.default(fake.asExtensionAPI());
      const ctx = fakePi.fakeContext(runtimeModel(model));

      await fake.emit('session_start', { reason: 'new' }, ctx);
      await fake.emit('model_select', { model: runtimeModel(model) }, ctx);

      const modelId = `${model.provider}/${model.id}`;
      if (fixture.owned.some((entry) => `${entry.provider}/${entry.id}` === modelId)) {
        assert.ok(fake.activeTools.includes('edit_lines'), modelId);
        assert.equal(ctx.statuses.get('deeppi'), 'DeepPi · warming', modelId);
        assert.equal(ctx.statuses.get('pi-cache-stats'), undefined, modelId);
      } else {
        assert.equal(fake.activeTools.includes('edit_lines'), false, modelId);
        assert.equal(ctx.statuses.get('deeppi'), undefined, modelId);
        assert.equal(typeof ctx.statuses.get('pi-cache-stats'), 'string', modelId);
      }
    }
  });
});
