// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Generation Manifest Tests                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createFixtureCorpus } from '../engine/fixtures.mjs';
import { buildStyleDatabase } from '../../lib/database/indexer.mjs';
import { resolvePublishedDatabasePath, STYLE_DATABASE_POINTER_SUFFIX } from '../../lib/database/schema.mjs';
import {
  buildManifest,
  hashArtifactFile,
  pruneManifestGenerations,
  readManifest,
  resolveManifestArtifacts,
  resolvePublishedTarget,
  writeManifestPointer,
} from '../../lib/database/generation-manifest.mjs';

async function scratchDir() {
  const base = await mkdtemp(path.join(os.tmpdir(), 'style-manifest-'));
  return base;
}

async function writeArtifact(directory, file, bytes) {
  await writeFile(path.join(directory, file), bytes);
  const { sha256, bytes: byteLength } = await hashArtifactFile(path.join(directory, file));
  return { role: file, file, sha256, bytes: byteLength };
}

test('a build publishes a manifest pointer that resolves every artifact', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const databasePath = path.join(fixture.base, 'manifest-style.sqlite');
  const built = await buildStyleDatabase({ corpusRoot: fixture.root, databasePath });

  const pointerPath = `${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`;
  const manifest = await readManifest(pointerPath);
  assert.equal(manifest.document.manifestVersion, 1);
  assert.equal(manifest.generationHash, built.generationHash);
  assert.equal(manifest.document.artifacts.sqlite.file, path.basename(built.generationDatabasePath));
  assert.ok(manifest.document.artifacts.sqlite.sha256.startsWith('sha256:'));
  assert.ok(Number.isInteger(manifest.document.artifacts.sqlite.bytes));

  const resolved = await resolveManifestArtifacts(pointerPath, { verifyDigests: true });
  assert.equal(resolved.generationHash, built.generationHash);
  assert.equal(resolved.legacy, false);
  assert.ok(resolved.artifacts.sqlite.path.endsWith(path.basename(built.generationDatabasePath)));
});

test('an interrupted publish leaves the prior manifest fully readable', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const databasePath = path.join(fixture.base, 'interrupted-style.sqlite');
  const first = await buildStyleDatabase({ corpusRoot: fixture.root, databasePath });

  const { appendDesignText } = await import('../engine/fixtures.mjs');
  await appendDesignText(fixture.root, 'alpha', 'An interrupted second generation.');
  await assert.rejects(buildStyleDatabase({
    corpusRoot: fixture.root,
    databasePath,
    failureInjector: ({ phase }) => {
      if (phase === 'PUBLISH') throw new Error('simulated-pre-pointer-failure');
    },
  }), /simulated-pre-pointer-failure/);

  assert.equal(resolvePublishedDatabasePath(databasePath), first.generationDatabasePath);
  const resolved = await resolveManifestArtifacts(
    `${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`,
    { verifyDigests: true },
  );
  assert.equal(resolved.generationHash, first.generationHash);
});

test('a multi-artifact manifest publishes and validates every artifact', async (context) => {
  const directory = await scratchDir();
  context.after(() => rm(directory, { recursive: true, force: true }));
  const pointerPath = path.join(directory, 'style.sqlite.current.json');

  const artifacts = {
    sqlite: await writeArtifact(directory, 'style.sqlite.sha256-gen1.sqlite', 'sqlite-gen1-bytes'),
    screenshotFeatures: await writeArtifact(directory, 'style.features.gen1.bin', 'feature-gen1-bytes'),
    modelProfiles: await writeArtifact(directory, 'style.models.gen1.json', '{"profile":"gen1"}'),
  };
  const manifest = buildManifest({
    generationHash: 'sha256:gen1',
    createdAt: '2026-01-01T00:00:00.000Z',
    artifacts,
  });
  await writeManifestPointer(pointerPath, manifest);

  const resolved = await resolveManifestArtifacts(pointerPath, { verifyDigests: true });
  assert.deepEqual(Object.keys(resolved.artifacts).sort(), ['modelProfiles', 'screenshotFeatures', 'sqlite']);
  assert.equal(resolved.generationHash, 'sha256:gen1');
});

test('a tampered artifact fails digest verification', async (context) => {
  const directory = await scratchDir();
  context.after(() => rm(directory, { recursive: true, force: true }));
  const pointerPath = path.join(directory, 'style.sqlite.current.json');
  const artifacts = {
    sqlite: await writeArtifact(directory, 'style.sqlite.sha256-genT.sqlite', 'original-bytes'),
  };
  await writeManifestPointer(pointerPath, buildManifest({
    generationHash: 'sha256:genT',
    createdAt: '2026-01-01T00:00:00.000Z',
    artifacts,
  }));
  await writeFile(path.join(directory, 'style.sqlite.sha256-genT.sqlite'), 'tampered-bytes');
  await assert.rejects(
    resolveManifestArtifacts(pointerPath, { verifyDigests: true }),
    (error) => error.code === 'generation-artifact-tampered',
  );
});

test('an interrupted pointer flip is atomic and never leaves a temp file', async (context) => {
  const directory = await scratchDir();
  context.after(() => rm(directory, { recursive: true, force: true }));
  const pointerPath = path.join(directory, 'style.sqlite.current.json');

  const genOne = buildManifest({
    generationHash: 'sha256:gen1',
    createdAt: '2026-01-01T00:00:00.000Z',
    artifacts: { sqlite: await writeArtifact(directory, 'style.sqlite.sha256-gen1.sqlite', 'gen1') },
  });
  await writeManifestPointer(pointerPath, genOne);

  const genTwo = buildManifest({
    generationHash: 'sha256:gen2',
    createdAt: '2026-01-02T00:00:00.000Z',
    parentGenerationHash: 'sha256:gen1',
    artifacts: { sqlite: await writeArtifact(directory, 'style.sqlite.sha256-gen2.sqlite', 'gen2') },
  });
  await assert.rejects(writeManifestPointer(pointerPath, genTwo, {
    afterRename: () => { throw new Error('simulated-post-rename-failure'); },
  }), /simulated-post-rename-failure/);

  const manifest = await readManifest(pointerPath);
  assert.ok(['sha256:gen1', 'sha256:gen2'].includes(manifest.generationHash));
  assert.ok(existsSync(path.join(directory, 'style.sqlite.sha256-gen1.sqlite')));
  const leftovers = (await readdir(directory)).filter((name) => name.includes('.tmp-'));
  assert.deepEqual(leftovers, []);
});

test('retention prunes whole generations while keeping the retained set intact', async (context) => {
  const directory = await scratchDir();
  context.after(() => rm(directory, { recursive: true, force: true }));

  const manifestFor = async (generation) => buildManifest({
    generationHash: `sha256:${generation}`,
    createdAt: '2026-01-01T00:00:00.000Z',
    artifacts: {
      sqlite: await writeArtifact(directory, `style.sqlite.sha256-${generation}.sqlite`, `${generation}-db`),
      screenshotFeatures: await writeArtifact(directory, `style.features.${generation}.bin`, `${generation}-feat`),
    },
  });
  const genOne = await manifestFor('gen1');
  const genTwo = await manifestFor('gen2');
  const genThree = await manifestFor('gen3');

  const outcome = await pruneManifestGenerations({
    directory,
    retain: [genThree, genTwo],
    prune: [genOne],
  });
  assert.deepEqual(outcome.removed.sort(), ['style.features.gen1.bin', 'style.sqlite.sha256-gen1.sqlite']);
  assert.equal(existsSync(path.join(directory, 'style.sqlite.sha256-gen1.sqlite')), false);
  assert.equal(existsSync(path.join(directory, 'style.features.gen1.bin')), false);
  for (const generation of ['gen2', 'gen3']) {
    assert.ok(existsSync(path.join(directory, `style.sqlite.sha256-${generation}.sqlite`)));
    assert.ok(existsSync(path.join(directory, `style.features.${generation}.bin`)));
  }
});

test('retention never removes an artifact shared with a retained manifest', async (context) => {
  const directory = await scratchDir();
  context.after(() => rm(directory, { recursive: true, force: true }));
  const shared = await writeArtifact(directory, 'style.models.shared.json', '{"shared":true}');
  const retained = buildManifest({
    generationHash: 'sha256:keep',
    createdAt: '2026-01-01T00:00:00.000Z',
    artifacts: {
      sqlite: await writeArtifact(directory, 'style.sqlite.sha256-keep.sqlite', 'keep'),
      modelProfiles: shared,
    },
  });
  const pruned = buildManifest({
    generationHash: 'sha256:drop',
    createdAt: '2026-01-01T00:00:00.000Z',
    artifacts: {
      sqlite: await writeArtifact(directory, 'style.sqlite.sha256-drop.sqlite', 'drop'),
      modelProfiles: shared,
    },
  });
  const outcome = await pruneManifestGenerations({ directory, retain: [retained], prune: [pruned] });
  assert.deepEqual(outcome.removed, ['style.sqlite.sha256-drop.sqlite']);
  assert.ok(existsSync(path.join(directory, 'style.models.shared.json')));
});

test('a legacy single-file pointer still resolves', async (context) => {
  const directory = await scratchDir();
  context.after(() => rm(directory, { recursive: true, force: true }));
  const databasePath = path.join(directory, 'legacy.sqlite');
  const generationFile = 'legacy.sqlite.sha256-legacy.sqlite';
  await writeFile(path.join(directory, generationFile), 'legacy-db-bytes');
  await writeFile(`${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`, `${JSON.stringify({
    schemaVersion: 1,
    generationHash: 'sha256:legacy',
    databaseFile: generationFile,
  }, null, 2)}\n`);

  const target = resolvePublishedTarget(databasePath, STYLE_DATABASE_POINTER_SUFFIX);
  assert.equal(target.generationHash, 'sha256:legacy');
  assert.equal(path.basename(target.databasePath), generationFile);

  const manifest = await readManifest(`${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`);
  assert.equal(manifest.legacy, true);
  assert.equal(manifest.artifacts.sqlite.file, generationFile);
});

test('an invalid pointer shape is rejected', async (context) => {
  const directory = await scratchDir();
  context.after(() => rm(directory, { recursive: true, force: true }));
  const databasePath = path.join(directory, 'broken.sqlite');
  await writeFile(`${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`, `${JSON.stringify({
    manifestVersion: 1,
    generationHash: 'sha256:broken',
    artifacts: { sqlite: { file: '../escape.sqlite' } },
  })}\n`);
  assert.throws(
    () => resolvePublishedTarget(databasePath, STYLE_DATABASE_POINTER_SUFFIX),
    (error) => error.code === 'generation-pointer-invalid',
  );
});
