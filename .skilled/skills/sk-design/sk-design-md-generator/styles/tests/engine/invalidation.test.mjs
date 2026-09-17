// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Manifest Invalidation Fixtures                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import {
  CorpusChangingError,
  ManifestBuildError,
  buildManifest,
  diffManifests,
  isManifestBuildError,
  loadManifest,
  manifestErrorResult,
  writeManifestAtomic,
} from '../../lib/engine/manifest.mjs';
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
    (error) => {
      assert.equal(error instanceof CorpusChangingError, true);
      assert.equal(error instanceof ManifestBuildError, true);
      assert.equal(isManifestBuildError(error), true);
      assert.deepEqual(manifestErrorResult(error), {
        ok: false,
        error: 'corpus-changing',
      });
      return true;
    },
  );
});

test('mid-build disappearance surfaces a closed typed unavailable result', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  await assert.rejects(
    buildManifest(fixture.root, {
      beforeVerification: () => rm(
        path.join(fixture.root, 'crawl-manifest.json'),
      ),
    }),
    (error) => {
      assert.equal(error instanceof ManifestBuildError, true);
      const result = manifestErrorResult(error);
      assert.deepEqual(result, { ok: false, error: 'unavailable' });
      assert.deepEqual(Object.keys(result), ['ok', 'error']);
      assert.equal(Object.isFrozen(result), true);
      return true;
    },
  );
});

test('top-level manifest symlinks cannot escape the corpus root', async (context) => {
  const crawlFixture = await createFixtureCorpus();
  const retrievalFixture = await createFixtureCorpus();
  context.after(crawlFixture.cleanup);
  context.after(retrievalFixture.cleanup);

  const crawlPath = path.join(crawlFixture.root, 'crawl-manifest.json');
  const outsideCrawlPath = path.join(crawlFixture.base, 'outside-manifest.json');
  await writeFile(outsideCrawlPath, await readFile(crawlPath));
  await rm(crawlPath);
  await symlink(outsideCrawlPath, crawlPath);
  await assert.rejects(
    buildManifest(crawlFixture.root),
    (error) => error instanceof ManifestBuildError && error.code === 'path-escape',
  );

  const retrievalPath = path.join(retrievalFixture.root, '_retrieval-manifest.json');
  const outsideRetrievalPath = path.join(
    retrievalFixture.base,
    'outside-retrieval-manifest.json',
  );
  await writeFile(outsideRetrievalPath, '{}\n');
  await symlink(outsideRetrievalPath, retrievalPath);
  await assert.rejects(
    loadManifest(retrievalPath, { corpusRoot: retrievalFixture.root }),
    (error) => error instanceof ManifestBuildError && error.code === 'path-escape',
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
