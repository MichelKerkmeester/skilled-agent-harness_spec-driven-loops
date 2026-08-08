// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Ownership Composition Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import deepPi from '../extensions/deeppi.js';
import { isDeepPiModel } from '../extensions/deeppi/eligibility.js';
import { composeOneOwner } from '../../shared/composition/one-owner.js';
import { fakeContext, FakePi } from './fake-pi.js';

import type { OwnershipFixture } from '../../shared/composition/one-owner.js';

// ───────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ───────────────────────────────────────────────────────────────────

const fixture = JSON.parse(
  readFileSync(join(process.cwd(), '..', 'shared', 'deepseek-ownership.json'), 'utf8'),
) as OwnershipFixture;

let optimizer: any;
let agentDir: string;
let previousAgentDir: string | undefined;

// Load the sibling optimizer through Jiti.
// This composition test must exercise the TypeScript module boundary used by the package loader.
beforeAll(async () => {
  previousAgentDir = process.env.PI_CODING_AGENT_DIR;
  agentDir = await mkdtemp(join(tmpdir(), 'pi-ownership-composition-'));
  process.env.PI_CODING_AGENT_DIR = agentDir;
  const require = createRequire(import.meta.url);
  const { createJiti } = require(
    '../node_modules/@earendil-works/pi-coding-agent/node_modules/jiti',
  ) as {
    createJiti: (id: string, options: { interopDefault: boolean; moduleCache: boolean }) => {
      import(path: string): Promise<any>;
    };
  };
  const jiti = createJiti(join(process.cwd(), 'tests', 'ownership-composition.test.ts'), {
    interopDefault: false,
    moduleCache: false,
  });
  optimizer = await jiti.import(join(process.cwd(), '..', 'pi-cache-optimizer', 'index.ts'));
});

afterAll(async () => {
  if (previousAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
  else process.env.PI_CODING_AGENT_DIR = previousAgentDir;
  await rm(agentDir, { recursive: true, force: true });
});

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

// The fixture enumerates only a handful of concrete models.
// Comparing both predicates only against those expected answers could miss divergence.
// An unlisted model could expose a new id added to only one hardcoded list.
// The candidate set includes near-miss ids and compares both real predicates directly.
// A one-sided change therefore produces a disagreement without a fixed expected answer.
const candidateProviders = ['deepseek', 'opencode', 'opencode-go', 'openai', 'anthropic', 'cursor'];
const candidateModelIds = [
  'deepseek-v4-flash',
  'deepseek-v4-pro',
  'deepseek-v4-flash-free',
  'deepseek-v4-ultra',
  'deepseek-v4-flash-2',
  'deepseek-v3',
  'deepseek-r2',
  'deepseek-coder',
  'gpt-5.6-sol',
  'claude-sonnet-5',
];

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('DeepSeek ownership contract', () => {
  it('keeps the two real predicates in agreement across a wide synthetic candidate space', () => {
    const disagreements: string[] = [];
    for (const provider of candidateProviders) {
      for (const id of candidateModelIds) {
        const candidate = { provider, id };
        const deepPiSays = isDeepPiModel(candidate as any);
        const optimizerSays = optimizer.__internals_for_tests.isDeepPiOwned(candidate);
        if (deepPiSays !== optimizerSays) {
          disagreements.push(
            `${provider}/${id} → deep-pi=${deepPiSays} optimizer-owned=${optimizerSays}`,
          );
        }
      }
    }
    expect(disagreements).toEqual([]);
  });

  it('keeps both real predicates aligned with the shared fixture', () => {
    for (const model of fixture.owned) {
      expect(isDeepPiModel(model as any)).toBe(true);
      expect(optimizer.__internals_for_tests.isDeepPiOwned(model)).toBe(true);
    }
    for (const model of fixture.excluded) {
      expect(isDeepPiModel(model as any)).toBe(false);
      expect(optimizer.__internals_for_tests.isDeepPiOwned(model)).toBe(false);
    }
  });

  it('composes one owner from both real predicates', () => {
    const results = composeOneOwner(
      fixture,
      (model) => isDeepPiModel(model as any),
      optimizer.__internals_for_tests.isDeepPiOwned,
    );

    for (const result of results) {
      expect(result.actualOwners, result.modelId).toEqual([result.expectedOwner]);
    }
  });

  it('observes exactly one extension reacting in the combined host', async () => {
    for (const model of [...fixture.owned, ...fixture.excluded]) {
      const fake = new FakePi();
      deepPi(fake.asExtensionAPI());
      optimizer.default(fake.asExtensionAPI());
      const ctx = fakeContext(runtimeModel(model));

      await fake.emit('session_start', { reason: 'new' }, ctx);
      await fake.emit('model_select', { model: runtimeModel(model) }, ctx);

      const modelId = `${model.provider}/${model.id}`;
      if (fixture.owned.some((entry) => `${entry.provider}/${entry.id}` === modelId)) {
        expect(fake.activeTools, modelId).toContain('edit_lines');
        expect(ctx.statuses.get('deeppi'), modelId).toBe('DeepPi · warming');
        expect(ctx.statuses.get('pi-cache-stats'), modelId).toBeUndefined();
      } else {
        expect(fake.activeTools, modelId).not.toContain('edit_lines');
        expect(ctx.statuses.get('deeppi'), modelId).toBeUndefined();
        expect(ctx.statuses.get('pi-cache-stats'), modelId).toEqual(expect.any(String));
      }
    }
  });
});
