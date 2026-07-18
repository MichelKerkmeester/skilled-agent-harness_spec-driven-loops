// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Stable Manifest Check Fixture                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { runBuild, runQuery } from '../style-library.mjs';
import { STYLE_ALPHA, createFixtureCorpus } from './fixtures.mjs';

test('build --check is byte-stable and never writes', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  const written = await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  assert.equal(written.ok, true);
  const firstBytes = await readFile(manifestPath, 'utf8');
  const firstCheck = await runBuild(['--check'], { corpusRoot: fixture.root, manifestPath });
  const secondCheck = await runBuild(['--check'], { corpusRoot: fixture.root, manifestPath });
  assert.equal(firstCheck.ok, true);
  assert.equal(secondCheck.ok, true);
  assert.deepEqual(secondCheck.diff, { added: [], changed: [], removed: [] });
  assert.equal(await readFile(manifestPath, 'utf8'), firstBytes);
});

test('build --check is byte-stable under a Turkish process locale', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const committedBytes = await readFile(manifestPath, 'utf8');
  const moduleUrl = new URL('../style-library.mjs', import.meta.url).href;
  const script = `
    import { runBuild } from ${JSON.stringify(moduleUrl)};
    const result = await runBuild(['--check'], {
      corpusRoot: ${JSON.stringify(fixture.root)},
      manifestPath: ${JSON.stringify(manifestPath)},
    });
    process.stdout.write(JSON.stringify(result));
    process.exitCode = result.ok ? 0 : 1;
  `;
  const child = spawnSync(process.execPath, ['--input-type=module', '--eval', script], {
    encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'tr_TR.UTF-8', LANG: 'tr_TR.UTF-8' },
  });
  assert.equal(child.status, 0, child.stderr || child.stdout);
  assert.equal(JSON.parse(child.stdout).ok, true);
  assert.equal(await readFile(manifestPath, 'utf8'), committedBytes);
});

test('build --check rejects poisoned derived fields with unchanged source hashes', async (context) => {
  const fixture = await createFixtureCorpus();
  context.after(fixture.cleanup);
  const manifestPath = path.join(fixture.root, '_retrieval-manifest.json');
  await runBuild(['--write'], { corpusRoot: fixture.root, manifestPath });
  const poisoned = JSON.parse(await readFile(manifestPath, 'utf8'));
  const record = poisoned.styles.find((style) => style.id === STYLE_ALPHA.id);
  const contentHash = record.contentHash;
  record.facets = ['motion', 'poisoned'];
  record.provenance.licenseStatus = 'licensed';
  record.provenance.rightsKnown = true;
  await writeFile(manifestPath, `${JSON.stringify(poisoned, null, 2)}\n`);

  const checked = await runBuild(['--check'], { corpusRoot: fixture.root, manifestPath });
  assert.equal(checked.ok, false);
  assert.deepEqual(checked.diff.changed, [STYLE_ALPHA.id]);
  const persisted = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(persisted.styles.find((style) => style.id === STYLE_ALPHA.id).contentHash, contentHash);
  assert.deepEqual(
    persisted.styles.find((style) => style.id === STYLE_ALPHA.id).facets,
    ['motion', 'poisoned'],
  );
  await assert.rejects(
    runQuery({}, { corpusRoot: fixture.root, manifestPath }),
    (error) => error.code === 'manifest-stale',
  );
});
