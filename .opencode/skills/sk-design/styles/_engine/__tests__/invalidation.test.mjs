// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Manifest Invalidation Fixtures                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  buildManifest,
  diffManifests,
  writeManifestAtomic,
} from '../manifest.mjs';
import {
  STYLE_ALPHA,
  STYLE_BETA,
  appendDesignText,
  createFixtureCorpus,
  writeFixtureCrawlManifest,
  writeFixtureStyle,
} from './fixtures.mjs';

const STYLE_GAMMA = Object.freeze({
  id: '33333333-3333-4333-8333-333333333333',
  slug: 'gamma',
  title: 'Gamma Motion',
  thesis: 'Motion-led reference with a clear temporal owner.',
  theme: 'dark',
  industry: 'Media',
  text: 'Kinetic animation and transition timing.',
});

test('add, change, and delete invalidate exact style ids', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  let committed = await buildManifest(fixture.root);

  await writeFixtureStyle(fixture.root, STYLE_GAMMA);
  await writeFixtureCrawlManifest(fixture.root, [STYLE_ALPHA, STYLE_BETA, STYLE_GAMMA]);
  let generated = await buildManifest(fixture.root, { previousManifest: committed });
  assert.deepEqual(diffManifests(committed, generated), {
    added: [STYLE_GAMMA.id], changed: [], removed: [],
  });
  committed = generated;

  await appendDesignText(fixture.root, STYLE_ALPHA.slug, 'A unique changed marker.');
  generated = await buildManifest(fixture.root, { previousManifest: committed });
  assert.deepEqual(diffManifests(committed, generated), {
    added: [], changed: [STYLE_ALPHA.id], removed: [],
  });
  committed = generated;

  await rm(path.join(fixture.root, STYLE_BETA.slug), { recursive: true });
  await writeFixtureCrawlManifest(fixture.root, [STYLE_ALPHA, STYLE_GAMMA]);
  generated = await buildManifest(fixture.root, { previousManifest: committed });
  assert.deepEqual(diffManifests(committed, generated), {
    added: [], changed: [], removed: [STYLE_BETA.id],
  });
  await writeManifestAtomic(path.join(fixture.root, '_retrieval-manifest.json'), generated);
});

test('a pre/post fingerprint change aborts publication', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  await assert.rejects(
    buildManifest(fixture.root, {
      beforeVerification: () => appendDesignText(
        fixture.root,
        STYLE_ALPHA.slug,
        'Mutation between fingerprints.',
      ),
    }),
    (error) => error.code === 'corpus-changing',
  );
});

test('a symlink target mutation aborts publication', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const targetRoot = path.join(fixture.root, '_targets');
  const targetPath = path.join(targetRoot, 'DESIGN.md');
  const linkedPath = path.join(fixture.root, STYLE_ALPHA.slug, 'DESIGN.md');
  const original = await readFile(linkedPath, 'utf8');
  await mkdir(targetRoot);
  await writeFile(targetPath, original);
  await rm(linkedPath);
  await symlink('../_targets/DESIGN.md', linkedPath);

  await assert.rejects(
    buildManifest(fixture.root, {
      beforeVerification: () => writeFile(
        targetPath,
        `${original}\nMutation of the resolved target.\n`,
      ),
    }),
    (error) => error.code === 'corpus-changing',
  );
});
