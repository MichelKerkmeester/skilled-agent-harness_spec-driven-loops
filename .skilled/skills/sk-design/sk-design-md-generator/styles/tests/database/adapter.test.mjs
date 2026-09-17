// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Legacy Adapter Parity and Timing Tests                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import test from 'node:test';

import { runHydrate, runQuery } from '../../lib/engine/style-library.mjs';
import { resolveStyleDatabaseMode } from '../../lib/engine/persistent-adapter.mjs';
import { createIndexedFixture } from './fixtures.mjs';

function timingStyles(count) {
  return Array.from({ length: count }, (_, index) => {
    const ordinal = index + 1;
    const hexadecimal = ordinal.toString(16);
    return {
      id: `${hexadecimal.padStart(8, '0')}-0000-4000-8000-${hexadecimal.padStart(12, '0')}`,
      slug: `timing-${String(ordinal).padStart(2, '0')}`,
      title: `Timing Style ${ordinal}`,
      thesis: ordinal % 2 === 0 ? 'Product motion system.' : 'Warm editorial system.',
      theme: ordinal % 2 === 0 ? 'dark' : 'light',
      industry: 'Testing',
      text: ordinal % 2 === 0
        ? 'Dark product interface motion animation.'
        : 'Warm cream editorial serif interface.',
    };
  });
}

async function medianDuration(operation, samples = 3) {
  const durations = [];
  for (let index = 0; index < samples; index += 1) {
    const startedAt = performance.now();
    await operation();
    durations.push(performance.now() - startedAt);
  }
  durations.sort((left, right) => left - right);
  return durations[Math.floor(durations.length / 2)];
}

test('adapter defaults to legacy and shadow preserves the legacy result', async (context) => {
  const { database, fixture, manifestPath } = await createIndexedFixture(context);
  const prior = process.env.SK_DESIGN_STYLE_DB_MODE;
  delete process.env.SK_DESIGN_STYLE_DB_MODE;
  context.after(() => {
    if (prior === undefined) delete process.env.SK_DESIGN_STYLE_DB_MODE;
    else process.env.SK_DESIGN_STYLE_DB_MODE = prior;
  });
  assert.equal(resolveStyleDatabaseMode(), 'legacy');
  const request = { text: 'warm cream editorial serif', requiredFacets: ['warm-surface'] };
  const legacy = await runQuery(request, { corpusRoot: fixture.root, manifestPath });
  const shadow = await runQuery(request, {
    corpusRoot: fixture.root,
    manifestPath,
    database,
    styleDatabaseMode: 'shadow',
  });
  assert.deepEqual(shadow.cards, legacy.cards);
  assert.equal(shadow.shadow.ok, true);
});

test('persistent query and hydration preserve card and refusal contracts', async (context) => {
  const { database, fixture } = await createIndexedFixture(context);
  const query = await runQuery({ text: 'editorial serif' }, {
    database,
    corpusRoot: fixture.root,
    styleDatabaseMode: 'persistent',
  });
  assert.equal(query.ok, true);
  assert.equal(typeof query.cards[0].score.total, 'number');
  const hydrated = await runHydrate({
    id: query.cards[0].id,
    generationHash: query.generationHash,
    mode: 'interface',
    includes: ['DESIGN.md'],
    maxBytes: 128,
  }, { database, corpusRoot: fixture.root, styleDatabaseMode: 'persistent' });
  assert.equal(hydrated.ok, true);
  assert.ok(hydrated.totalBytes <= 128);
  const stale = await runHydrate({
    id: query.cards[0].id,
    generationHash: 'sha256:stale',
    mode: 'interface',
  }, { database, corpusRoot: fixture.root, styleDatabaseMode: 'persistent' });
  assert.deepEqual(stale, { ok: false, error: 'generation-mismatch' });
  const malformed = await runHydrate({
    id: query.cards[0].id,
    generationHash: query.generationHash,
    mode: 'interface',
    maxBytes: -1,
  }, { database, corpusRoot: fixture.root, styleDatabaseMode: 'persistent' });
  assert.deepEqual(malformed, { ok: false, error: 'invalid-input' });
  const accessorRequest = { id: query.cards[0].id, mode: 'interface' };
  Object.defineProperty(accessorRequest, 'generationHash', {
    enumerable: true,
    get: () => query.generationHash,
  });
  const accessor = await runHydrate(accessorRequest, {
    database,
    corpusRoot: fixture.root,
    styleDatabaseMode: 'persistent',
  });
  assert.deepEqual(accessor, { ok: false, error: 'invalid-input' });
});

test('bounded persistent query is faster than legacy on the 20-style fixture', async (context) => {
  const { database, fixture, manifestPath } = await createIndexedFixture(
    context,
    timingStyles(20),
  );
  const request = { text: 'product interface motion', limit: 2 };
  await runQuery(request, { corpusRoot: fixture.root, manifestPath });
  await runQuery(request, {
    database,
    corpusRoot: fixture.root,
    styleDatabaseMode: 'persistent',
  });
  const legacyMilliseconds = await medianDuration(() => runQuery(request, {
    corpusRoot: fixture.root,
    manifestPath,
  }));
  const persistentMilliseconds = await medianDuration(() => runQuery(request, {
    database,
    corpusRoot: fixture.root,
    styleDatabaseMode: 'persistent',
  }));
  assert.ok(persistentMilliseconds < legacyMilliseconds, JSON.stringify({
    legacyMilliseconds,
    persistentMilliseconds,
  }));
});
