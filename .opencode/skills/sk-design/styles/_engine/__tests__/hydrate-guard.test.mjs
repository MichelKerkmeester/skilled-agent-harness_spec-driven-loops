// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Hydration Generation and Path Guards                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { hydrateStyle } from '../hydrate.mjs';
import { buildManifest } from '../manifest.mjs';
import { STYLE_ALPHA, createFixtureCorpus } from './fixtures.mjs';

function artifactDigest(content) {
  return `sha256:${createHash('sha256').update(content).digest('hex')}`;
}

test('hydration refuses a stale generation and honors byte caps', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifest = await buildManifest(fixture.root);
  const stale = await hydrateStyle(manifest, {
    id: STYLE_ALPHA.id,
    generationHash: 'sha256:stale',
    mode: 'interface',
  }, { corpusRoot: fixture.root });
  assert.deepEqual(stale, { ok: false, error: 'generation-mismatch' });

  const current = await hydrateStyle(manifest, {
    id: STYLE_ALPHA.id,
    generationHash: manifest.generationHash,
    mode: 'interface',
    includes: ['DESIGN.md'],
    maxBytes: 128,
  }, { corpusRoot: fixture.root });
  assert.equal(current.ok, true);
  assert.ok(current.totalBytes <= 128);
});

test('stale artifact hashes and unknown exact-reuse rights are refused', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifest = await buildManifest(fixture.root);
  const styleIndex = manifest.styles.findIndex((style) => style.id === STYLE_ALPHA.id);
  const staleStyle = structuredClone(manifest.styles[styleIndex]);
  const designIndex = staleStyle.artifacts.findIndex(
    (artifact) => artifact.path.endsWith('/DESIGN.md'),
  );
  staleStyle.artifacts[designIndex].sha256 = artifactDigest('stale');
  const craftedManifest = structuredClone(manifest);
  craftedManifest.styles[styleIndex] = staleStyle;
  const unavailable = await hydrateStyle(craftedManifest, {
    id: STYLE_ALPHA.id,
    generationHash: manifest.generationHash,
    mode: 'interface',
    includes: ['DESIGN.md'],
  }, { corpusRoot: fixture.root });
  assert.equal(unavailable.error, 'unavailable');

  const rightsRestricted = await hydrateStyle(manifest, {
    id: STYLE_ALPHA.id,
    generationHash: manifest.generationHash,
    mode: 'interface',
    usage: 'exact-reuse',
  }, { corpusRoot: fixture.root });
  assert.equal(rightsRestricted.error, 'rights-restricted');
});

test('crafted traversal and escaping symlink paths return path-escape', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifest = await buildManifest(fixture.root);
  const ghostId = '44444444-4444-4444-8444-444444444444';
  const ghostBase = {
    ...manifest.styles[0],
    id: ghostId,
    slug: '_crafted',
  };

  const traversalManifest = {
    ...manifest,
    styles: [...manifest.styles, {
      ...ghostBase,
      artifacts: [{
        path: '../outside/DESIGN.md',
        bytes: 1,
        sha256: artifactDigest('x'),
      }],
    }],
  };
  const traversal = await hydrateStyle(traversalManifest, {
    id: ghostId,
    generationHash: manifest.generationHash,
    mode: 'interface',
    includes: ['DESIGN.md'],
  }, { corpusRoot: fixture.root });
  assert.equal(traversal.error, 'path-escape');

  const outsidePath = path.join(fixture.base, 'outside-design.md');
  const content = 'outside';
  await writeFile(outsidePath, content);
  await mkdir(path.join(fixture.root, '_crafted'));
  await symlink(outsidePath, path.join(fixture.root, '_crafted', 'DESIGN.md'));
  const symlinkManifest = {
    ...manifest,
    styles: [...manifest.styles, {
      ...ghostBase,
      artifacts: [{
        path: '_crafted/DESIGN.md',
        bytes: Buffer.byteLength(content),
        sha256: artifactDigest(content),
      }],
    }],
  };
  const symlinkEscape = await hydrateStyle(symlinkManifest, {
    id: ghostId,
    generationHash: manifest.generationHash,
    mode: 'interface',
    includes: ['DESIGN.md'],
  }, { corpusRoot: fixture.root });
  assert.equal(symlinkEscape.error, 'path-escape');
});
