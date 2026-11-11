// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders — core B
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { readTriggerPhrases } from '../retrieval/lib/frontmatter.mjs';
import { judgeTriggerPhrase } from '../retrieval/lib/phrase-judge.mjs';
import { renderInlineGates } from '../templates/inline-gate-renderer';

import { PACKET, DIRTY_PACKET, sandbox, copy, runUpgrade, validate, downgradeRows, manifest, upgradeManifestPath, clearUpgradeManifest, resetSandbox, refreshCopiedDistMtimes, commitChanges, writeLegacyPacket, prepareDirtyManifest, readmeRecoveryScript, setCopy, setSandbox, setupSandbox, teardownSandbox } from './helpers/upgrade-legacy-harness';

beforeAll(setupSandbox, 180_000);
afterAll(teardownSandbox);

describe('upgrade-legacy', () => {
  afterEach(resetSandbox);

  it('records a detail the validator repeats once per copy', () => {
    clearUpgradeManifest();
    const folder = 'specs/dup-track/001-repeated';
    writeLegacyPacket(folder);
    const spec = path.join(sandbox, folder, 'spec.md');
    fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace('# Legacy Packet\n', '# Legacy Packet\n\n<!-- SPECKIT_LEVEL: CORE -->\n'));
    const result = runUpgrade(['--apply', '--roots', 'specs/dup-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    const baseline = JSON.parse(fs.readFileSync(path.join(sandbox, folder, 'upgrade-baseline.json'), 'utf8'));
    const repeated = baseline.findings.filter((finding: { rule: string; detail: string }) => finding.rule === 'LEVEL_MATCH' && finding.detail.includes('invalid level declaration'));
    expect(repeated.length, JSON.stringify(baseline.findings)).toBe(2);
    const check = validate(folder);
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');
  }, 180_000);

  it('exits 2 and names a packet the tools cannot fix', () => {
    // A graph file that is not JSON makes the metadata refresh fail. The rules a
    // re-derive clears are never recorded in an active packet, so the packet
    // still fails after --apply, and the run must say so instead of passing.
    clearUpgradeManifest();
    const folder = 'specs/broken-track/001-broken-graph';
    writeLegacyPacket(folder);
    fs.writeFileSync(path.join(sandbox, folder, 'graph-metadata.json'), '{ not json');
    try {
      const result = runUpgrade(['--apply', '--roots', 'specs/broken-track']);
      expect(result.status, result.stdout + result.stderr).toBe(2);
      expect(result.stdout, result.stdout + result.stderr).toContain(`still failing ${folder}`);
      expect(result.stdout, result.stdout + result.stderr).toContain('after=0/1');
    } finally {
      fs.rmSync(path.join(sandbox, 'specs/broken-track'), { recursive: true, force: true });
    }
  }, 180_000);

  it('names a document whose frontmatter it cannot read and leaves it as is', () => {
    clearUpgradeManifest();
    const folder = 'specs/malformed-track/001-unclosed';
    writeLegacyPacket(folder);
    const spec = path.join(sandbox, folder, 'spec.md');
    const unclosed = '---\ntitle: "Unclosed Frontmatter"\ndescription: "No closing fence."\n# Unclosed Frontmatter\n\nOld packet written before the v4 contract.\n';
    fs.writeFileSync(spec, unclosed);
    const result = runUpgrade(['--apply', '--roots', 'specs/malformed-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain(`left as is ${folder}/spec.md: Frontmatter opening delimiter has no closing delimiter`);
    expect(fs.readFileSync(spec, 'utf8')).toBe(unclosed);
  }, 180_000);

  it('asks for the v4 layout, and the move it prints works on a v3 checkout', () => {
    // v3 kept packets under .opencode/specs and tracked specs as a symlink to
    // it. The test rebuilds that layout for its own duration, runs the move
    // the command prints, then upgrades the result.
    clearUpgradeManifest();
    const aside = path.join(sandbox, 'specs-set-aside');
    fs.renameSync(path.join(sandbox, 'specs'), aside);
    try {
      writeLegacyPacket('.opencode/specs/legacy-track/001-old-packet');
      fs.symlinkSync('.opencode/specs', path.join(sandbox, 'specs'));
      execFileSync('git', ['-c', 'core.excludesFile=/dev/null', 'add', '.opencode/specs', 'specs'], { cwd: sandbox });
      const before = manifest('.opencode/specs');
      const refused = runUpgrade(['--apply']);
      expect(refused.status, refused.stdout + refused.stderr).toBe(2);
      expect(manifest('.opencode/specs')).toBe(before);
      const move = refused.stderr.split('\n').map((line) => line.trim()).find((line) => line.startsWith('rm -f specs'));
      expect(move, refused.stderr).toBeDefined();
      execFileSync('bash', ['-c', move as string], { cwd: sandbox });
      const upgraded = runUpgrade(['--apply']);
      expect(upgraded.status, upgraded.stdout + upgraded.stderr).toBe(0);
      expect(upgraded.stdout, upgraded.stdout + upgraded.stderr).toContain('after=1/1');
    } finally {
      fs.rmSync(path.join(sandbox, 'specs'), { recursive: true, force: true });
      fs.rmSync(path.join(sandbox, '.opencode/specs'), { recursive: true, force: true });
      execFileSync('git', ['rm', '-r', '-q', '--cached', '--ignore-unmatch', 'specs', '.opencode/specs'], { cwd: sandbox });
      fs.renameSync(aside, path.join(sandbox, 'specs'));
    }
  }, 180_000);

  it('writes nothing when the first validation cannot be read', () => {
    clearUpgradeManifest();
    writeLegacyPacket();
    const source = path.join(copy, 'runtime/lib/validation/orchestrator.ts');
    const original = fs.readFileSync(source, 'utf8');
    // A validator source that no longer matches its build makes validate.sh
    // refuse to run, the same gap a real stale build leaves. The freshness check
    // compares content, so touching the file alone would not do it.
    fs.writeFileSync(source, `${original}\n// edited after the build\n`);
    try {
      const before = manifest();
      const result = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit']);
      expect(result.status, result.stdout + result.stderr).toBe(2);
      expect(result.stderr, result.stdout + result.stderr).toContain('nothing was written');
      expect(manifest()).toBe(before);
    } finally {
      fs.writeFileSync(source, original);
    }
  }, 180_000);

  it('writes no phrase the judge rejects when it repairs a legacy packet', () => {
    clearUpgradeManifest();
    const folder = 'specs/phrase-track/001-phrase-fixture';
    writeLegacyPacket(folder);
    // Two documents declare the list but leave it empty, so the healer refills
    // them from the packet slug; spec.md omits the key, so the fill step infers
    // candidates from the document and keeps only the ones the judge admits.
    fs.writeFileSync(
      path.join(sandbox, folder, 'plan.md'),
      '---\ntitle: "Phrase Fixture Plan"\ndescription: "Plan for the phrase fixture."\ntrigger_phrases: []\n---\n# Phrase Fixture Plan\n\nOld plan.\n',
    );
    fs.writeFileSync(
      path.join(sandbox, folder, 'implementation-summary.md'),
      '---\ntitle: "Phrase Fixture Summary"\ndescription: "Summary for the phrase fixture."\ntrigger_phrases: []\n---\n# Phrase Fixture Summary\n\nOld summary.\n',
    );
    const result = runUpgrade(['--apply', '--roots', 'specs/phrase-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);

    const spec = readTriggerPhrases(fs.readFileSync(path.join(sandbox, folder, 'spec.md'), 'utf8')).phrases;
    const plan = readTriggerPhrases(fs.readFileSync(path.join(sandbox, folder, 'plan.md'), 'utf8')).phrases;
    const tasks = readTriggerPhrases(fs.readFileSync(path.join(sandbox, folder, 'tasks.md'), 'utf8')).phrases;
    const summary = readTriggerPhrases(fs.readFileSync(path.join(sandbox, folder, 'implementation-summary.md'), 'utf8')).phrases;
    // Without a phrase in hand the judge loop below proves nothing, so pin the
    // refills first: the empty list is the case the healer exists to repair.
    expect(plan.length, plan.map((phrase) => phrase.raw).join(', ')).toBeGreaterThan(0);
    expect(summary.length, summary.map((phrase) => phrase.raw).join(', ')).toBeGreaterThan(0);
    for (const phrase of [...spec, ...plan, ...tasks, ...summary]) {
      expect(judgeTriggerPhrase(phrase.raw), phrase.raw).toBeNull();
    }
  }, 180_000);

  it('dirty-tree-writes-manifest', () => {
    writeLegacyPacket();
    const manifestFile = upgradeManifestPath();
    fs.rmSync(manifestFile, { force: true });
    commitChanges('committed legacy packet', [PACKET]);
    const cleanStatus = execFileSync('git', ['-c', 'core.fsmonitor=false', 'status', '--porcelain', '--untracked-files=all'], {
      cwd: sandbox,
      encoding: 'utf8',
    });
    expect(cleanStatus).toBe('');

    expect(fs.existsSync(manifestFile)).toBe(false);
    const cleanApply = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit/001-legacy-packet']);
    expect(cleanApply.status, cleanApply.stdout + cleanApply.stderr).toBe(0);
    expect(fs.existsSync(manifestFile)).toBe(false);

    writeLegacyPacket(DIRTY_PACKET);
    commitChanges('committed second legacy packet', [DIRTY_PACKET]);
    const dirtySpec = path.join(sandbox, DIRTY_PACKET, 'spec.md');
    const dirtyPlan = path.join(sandbox, DIRTY_PACKET, 'plan.md');
    fs.appendFileSync(dirtySpec, '\nUncommitted legacy edit.\n');
    fs.appendFileSync(dirtyPlan, '\nUncommitted plan edit.\n');
    const originalSpec = fs.readFileSync(dirtySpec);
    const originalPlan = fs.readFileSync(dirtyPlan);
    const dirtyApply = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit']);
    expect(dirtyApply.status, dirtyApply.stdout + dirtyApply.stderr).toBe(0);
    expect(fs.readFileSync(dirtySpec)).not.toEqual(originalSpec);
    expect(fs.readFileSync(dirtyPlan)).not.toEqual(originalPlan);
    expect(fs.existsSync(manifestFile), dirtyApply.stdout + dirtyApply.stderr).toBe(true);

    const body = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    expect(body.schema).toBe(1);
    expect(body.headSha).toBe(execFileSync('git', ['-C', sandbox, 'rev-parse', '--verify', 'HEAD'], { encoding: 'utf8' }).trim());
    expect(Number.isNaN(Date.parse(body.recordedAt))).toBe(false);
    expect(body.baselineMap[DIRTY_PACKET]).toBeNull();
    expect(body.recordedBaselineMap[DIRTY_PACKET].length).toBeGreaterThan(0);
    expect(body.beforeImages).toEqual(expect.arrayContaining([
      expect.objectContaining({
        path: `${DIRTY_PACKET}/spec.md`,
        beforeImage: expect.objectContaining({
          kind: 'file-bytes',
          sha256: expect.stringMatching(/^[0-9a-f]{64}$/u),
        }),
      }),
    ]));
    const readBeforeImage = (relative: string) => {
      const image = body.beforeImages.find((entry: { path: string }) => entry.path === relative);
      return fs.readFileSync(path.join(path.dirname(manifestFile), image.beforeImage.sidecar));
    };
    expect(readBeforeImage(`${DIRTY_PACKET}/spec.md`)).toEqual(originalSpec);
    expect(readBeforeImage(`${DIRTY_PACKET}/plan.md`)).toEqual(originalPlan);
  }, 180_000);

  it('manifest-before-image-restores', () => {
    prepareDirtyManifest();
    const body = JSON.parse(fs.readFileSync(upgradeManifestPath(), 'utf8'));
    const relative = `${DIRTY_PACKET}/spec.md`;
    const image = body.beforeImages.find((entry: { path: string }) => entry.path === relative);
    expect(image, JSON.stringify(body.beforeImages)).toBeDefined();
    expect(image.beforeImage.kind).toBe('file-bytes');

    const file = path.join(sandbox, relative);
    const current = fs.readFileSync(file);
    const restored = fs.readFileSync(path.join(path.dirname(upgradeManifestPath()), image.beforeImage.sidecar));
    expect(crypto.createHash('sha256').update(restored).digest('hex')).toBe(image.beforeImage.sha256);
    expect(current).not.toEqual(restored);
    try {
      fs.writeFileSync(file, restored);
      expect(fs.readFileSync(file)).toEqual(restored);
    } finally {
      fs.writeFileSync(file, current);
    }
  }, 180_000);

  it('keeps before-image bytes out of the manifest in sidecar files', () => {
    const folder = 'specs/bulk-dirty/001-packet';
    writeLegacyPacket(folder);
    const payloads = 24;
    for (let index = 0; index < payloads; index += 1) {
      fs.writeFileSync(
        path.join(sandbox, folder, `payload-${index}.bin`),
        Buffer.alloc(1024 * 1024, index % 251),
      );
    }
    commitChanges('committed bulk packet', [folder]);
    const originals = new Map<string, Buffer>();
    for (let index = 0; index < payloads; index += 1) {
      const relative = `${folder}/payload-${index}.bin`;
      const file = path.join(sandbox, relative);
      fs.appendFileSync(file, 'dirty\n');
      originals.set(relative, fs.readFileSync(file));
    }

    const result = runUpgrade(['--apply', '--roots', folder]);
    expect(result.status, result.stdout + result.stderr).toBe(0);

    const manifestFile = upgradeManifestPath();
    const body = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const fileImages = body.beforeImages.filter(
      (entry: { beforeImage: { kind: string } }) => entry.beforeImage.kind === 'file-bytes',
    );
    expect(fileImages.length).toBe(payloads);
    // One JSON string holding the whole corpus is the shape that breaks a
    // large tree, so the manifest holds paths and hashes while the sidecars
    // hold the bytes.
    expect(fs.statSync(manifestFile).size).toBeLessThan(256 * 1024);
    for (const entry of fileImages) {
      expect(entry.beforeImage.content).toBeUndefined();
      expect(entry.beforeImage.sha256).toMatch(/^[0-9a-f]{64}$/u);
      const sidecar = path.join(path.dirname(manifestFile), entry.beforeImage.sidecar);
      const saved = fs.readFileSync(sidecar);
      expect(crypto.createHash('sha256').update(saved).digest('hex')).toBe(entry.beforeImage.sha256);
      expect(saved).toEqual(originals.get(entry.path));
    }
  }, 180_000);

  // A record that was replaced or removed leaves its sidecars behind, so the
  // next manifest write drops what it does not reference and keeps the rest as
  // a restorable recovery record.
  it('prunes orphan before-image sidecars but keeps the ones the manifest references', () => {
    prepareDirtyManifest();
    const manifestFile = upgradeManifestPath();
    const sidecarDir = path.join(path.dirname(manifestFile), 'upgrade-legacy.before-images');
    expect(fs.readdirSync(sidecarDir).length).toBeGreaterThan(0);
    fs.rmSync(manifestFile, { force: true });
    const orphan = path.join(sidecarDir, `${'f'.repeat(64)}.bin`);
    fs.writeFileSync(orphan, 'orphan bytes\n');

    fs.appendFileSync(path.join(sandbox, DIRTY_PACKET, 'spec.md'), '\nFresh mistake [x](./prune-missing.md).\n');
    const second = runUpgrade(['--apply', '--roots', DIRTY_PACKET]);
    expect(second.status, second.stdout + second.stderr).toBe(0);

    const body = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const referenced = new Set<string>();
    for (const entry of body.beforeImages) {
      if (entry.beforeImage.kind === 'file-bytes' && typeof entry.beforeImage.sidecar === 'string') {
        referenced.add(path.basename(entry.beforeImage.sidecar));
      }
    }
    expect(referenced.size).toBeGreaterThan(0);
    const remaining = fs.readdirSync(sidecarDir)
      .filter((name) => fs.lstatSync(path.join(sidecarDir, name)).isFile());
    expect(new Set(remaining)).toEqual(referenced);
    expect(fs.existsSync(orphan)).toBe(false);
  }, 180_000);

  it('no-git-refuses-apply', () => {
    prepareDirtyManifest();
    const before = manifest();
    const manifestFile = upgradeManifestPath();
    const manifestBytes = fs.readFileSync(manifestFile);
    const fakeGitDir = path.join(sandbox, 'not-a-git-directory');
    const result = runUpgrade(['--apply'], { GIT_DIR: fakeGitDir });
    expect(result.status, result.stdout + result.stderr).toBe(2);
    expect(result.stderr, result.stdout + result.stderr).toContain('--apply requires REPO to be a git repository');
    expect(manifest()).toBe(before);
    expect(fs.readFileSync(manifestFile)).toEqual(manifestBytes);
    expect(fs.existsSync(fakeGitDir)).toBe(false);
  }, 180_000);

  it('dirty-tree-idempotent', () => {
    prepareDirtyManifest();
    const before = manifest();
    const first = runUpgrade(['--apply']);
    expect(first.status, first.stdout + first.stderr).toBe(0);
    const afterFirst = manifest();
    const second = runUpgrade(['--apply']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(second.stdout, second.stdout + second.stderr).toContain('plan changes=0');
    expect(afterFirst).toBe(before);
    expect(manifest()).toBe(afterFirst);
  }, 180_000);

  it('manifest-recovery', () => {
    prepareDirtyManifest();
    const manifestFile = upgradeManifestPath();
    fs.rmSync(manifestFile, { force: true });
    fs.appendFileSync(
      path.join(sandbox, DIRTY_PACKET, 'spec.md'),
      '\nSee [manifest baseline target](./manifest-recovery-missing.md).\n',
    );
    const written = runUpgrade(['--apply', '--roots', DIRTY_PACKET]);
    expect(written.status, written.stdout + written.stderr).toBe(0);

    const body = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const findings = body.recordedBaselineMap[DIRTY_PACKET] as Array<{ rule: string; detail: string }>;
    expect(body.status).toBe('complete');
    expect(findings.length).toBeGreaterThan(0);
    const expectedRows = findings.map((finding) => {
      const detail = finding.detail.replace(/\s+/gu, ' ').trim();
      return `${DIRTY_PACKET} | ${finding.rule} | error -> warning${detail ? ` | ${detail}` : ''}`;
    }).sort();
    expect(expectedRows.some((row) => row.includes('manifest-recovery-missing.md'))).toBe(true);

    const manifestBytes = fs.readFileSync(manifestFile);
    const originalRoot = sandbox;
    const movedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-moved-'));
    fs.rmdirSync(movedRoot);
    fs.renameSync(originalRoot, movedRoot);
    // An imported binding cannot be reassigned, so the harness setters move it.
    setSandbox(movedRoot);
    setCopy(path.join(sandbox, '.skilled/skills/system-spec-kit'));
    refreshCopiedDistMtimes();
    expect(body.repoRoot).not.toBe(sandbox);

    const readInNewSession = runUpgrade(['--roots', DIRTY_PACKET]);
    expect(readInNewSession.status, readInNewSession.stdout + readInNewSession.stderr).toBe(0);
    expect(downgradeRows(readInNewSession.stdout)).toEqual(expectedRows);
    expect(fs.readFileSync(upgradeManifestPath())).toEqual(manifestBytes);
  }, 180_000);

  it('readme recovery resolves paths from the exported repository root', () => {
    const readme = fs.readFileSync(path.join(copy, 'runtime/cli/spec/README.md'), 'utf8');
    const recoverySection = readme.slice(readme.indexOf('### Recover an Interrupted Apply'));
    const fence = String.fromCharCode(96).repeat(3);
    const recoveryScript = recoverySection.match(new RegExp(fence + 'js\\n([\\s\\S]*?)\\n' + fence, 'u'))?.[1];
    expect(recoveryScript).toBeDefined();

    const repoRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-recovery-root-')));
    const callerRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-recovery-cwd-')));
    const relative = 'specs/recovery-packet/spec.md';
    const target = path.join(repoRoot, relative);
    const original = Buffer.from('saved repository bytes\n');
    const manifestFile = path.join(callerRoot, 'manifest.json');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, 'changed repository bytes\n');
    fs.writeFileSync(manifestFile, JSON.stringify({
      beforeImages: [{
        path: relative,
        beforeImage: {
          kind: 'file-bytes',
          encoding: 'base64',
          content: original.toString('base64'),
          mode: 0o644,
        },
      }],
      scopeHashes: {},
    }));

    try {
      const result = spawnSync(
        process.execPath,
        ['--input-type=module', '-e', recoveryScript!, manifestFile],
        {
          cwd: callerRoot,
          encoding: 'utf8',
          env: { ...process.env, UPGRADE_LEGACY_REPO_ROOT: repoRoot },
        },
      );
      expect(result.status, result.stdout + result.stderr).toBe(0);
      expect(fs.readFileSync(target)).toEqual(original);
      expect(fs.existsSync(path.join(callerRoot, 'specs'))).toBe(false);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
      fs.rmSync(callerRoot, { recursive: true, force: true });
    }
  }, 180_000);

  it('readme recovery reads a before-image sidecar and refuses a changed digest', () => {
    const readme = fs.readFileSync(path.join(copy, 'runtime/cli/spec/README.md'), 'utf8');
    const recoverySection = readme.slice(readme.indexOf('### Recover an Interrupted Apply'));
    const fence = String.fromCharCode(96).repeat(3);
    const recoveryScript = recoverySection.match(new RegExp(fence + 'js\\n([\\s\\S]*?)\\n' + fence, 'u'))?.[1];
    expect(recoveryScript).toBeDefined();

    const repoRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-sidecar-root-')));
    const callerRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-sidecar-cwd-')));
    const relative = 'specs/recovery-packet/plan.md';
    const target = path.join(repoRoot, relative);
    const original = Buffer.from('sidecar repository bytes\n');
    const digest = crypto.createHash('sha256').update(original).digest('hex');
    const sidecar = `upgrade-legacy.before-images/${digest}.bin`;
    const manifestFile = path.join(callerRoot, 'manifest.json');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.mkdirSync(path.dirname(path.join(callerRoot, sidecar)), { recursive: true });
    fs.writeFileSync(target, 'changed repository bytes\n');
    fs.writeFileSync(path.join(callerRoot, sidecar), original);
    fs.writeFileSync(manifestFile, JSON.stringify({
      beforeImages: [{
        path: relative,
        beforeImage: { kind: 'file-bytes', sidecar, sha256: digest, mode: 0o644 },
      }],
      scopeHashes: {},
    }));

    const runRecovery = () => spawnSync(
      process.execPath,
      ['--input-type=module', '-e', recoveryScript!, manifestFile],
      { cwd: callerRoot, encoding: 'utf8', env: { ...process.env, UPGRADE_LEGACY_REPO_ROOT: repoRoot } },
    );

    try {
      const restored = runRecovery();
      expect(restored.status, restored.stdout + restored.stderr).toBe(0);
      expect(fs.readFileSync(target)).toEqual(original);

      // A sidecar whose digest no longer matches the manifest must not reach
      // the repository.
      fs.writeFileSync(target, 'changed repository bytes\n');
      fs.writeFileSync(path.join(callerRoot, sidecar), 'tampered sidecar bytes\n');
      const refused = runRecovery();
      expect(refused.status, refused.stdout + refused.stderr).not.toBe(0);
      expect(fs.readFileSync(target, 'utf8')).toBe('changed repository bytes\n');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
      fs.rmSync(callerRoot, { recursive: true, force: true });
    }
  }, 180_000);

  it('readme recovery refuses an escaping sidecar name before it writes anything', () => {
    const recoveryScript = readmeRecoveryScript();
    const repoRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-restore-root-')));
    const callerRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-restore-cwd-')));
    const first = 'specs/recovery-packet/plan.md';
    const second = 'specs/recovery-packet/tasks.md';
    const firstTarget = path.join(repoRoot, first);
    const secondTarget = path.join(repoRoot, second);
    const original = Buffer.from('first before-image bytes\n');
    fs.mkdirSync(path.dirname(firstTarget), { recursive: true });
    fs.writeFileSync(firstTarget, 'changed first bytes\n');
    fs.writeFileSync(secondTarget, 'changed second bytes\n');
    const manifestFile = path.join(callerRoot, 'manifest.json');
    fs.writeFileSync(manifestFile, JSON.stringify({
      beforeImages: [
        {
          path: first,
          beforeImage: { kind: 'file-bytes', encoding: 'base64', content: original.toString('base64'), mode: 0o644 },
        },
        {
          path: second,
          beforeImage: { kind: 'file-bytes', sidecar: '..', sha256: '0'.repeat(64), mode: 0o644 },
        },
      ],
      scopeHashes: {},
    }));

    try {
      const result = spawnSync(
        process.execPath,
        ['--input-type=module', '-e', recoveryScript, manifestFile],
        { cwd: callerRoot, encoding: 'utf8', env: { ...process.env, UPGRADE_LEGACY_REPO_ROOT: repoRoot } },
      );
      expect(result.status, result.stdout + result.stderr).not.toBe(0);
      expect(result.stderr).toContain('escapes the manifest directory');
      // The valid entry sorts before the bad one, so a script that verified
      // sidecars as it went would already have written this one.
      expect(fs.readFileSync(firstTarget, 'utf8')).toBe('changed first bytes\n');
      expect(fs.readFileSync(secondTarget, 'utf8')).toBe('changed second bytes\n');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
      fs.rmSync(callerRoot, { recursive: true, force: true });
    }
  }, 180_000);

  it('readme recovery refuses a linked sidecar directory and writes nothing', () => {
    const recoveryScript = readmeRecoveryScript();
    const repoRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-sidecar-link-root-')));
    const callerRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-sidecar-link-cwd-')));
    const elsewhere = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-sidecar-link-out-')));
    const relative = 'specs/recovery-packet/spec.md';
    const target = path.join(repoRoot, relative);
    const original = Buffer.from('sidecar bytes behind a linked directory\n');
    const digest = crypto.createHash('sha256').update(original).digest('hex');
    const sidecar = `upgrade-legacy.before-images/${digest}.bin`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, 'changed bytes\n');
    fs.mkdirSync(path.join(elsewhere, 'upgrade-legacy.before-images'));
    fs.writeFileSync(path.join(elsewhere, sidecar), original);
    fs.symlinkSync(path.join(elsewhere, 'upgrade-legacy.before-images'), path.join(callerRoot, 'upgrade-legacy.before-images'), 'dir');
    const manifestFile = path.join(callerRoot, 'manifest.json');
    fs.writeFileSync(manifestFile, JSON.stringify({
      beforeImages: [{ path: relative, beforeImage: { kind: 'file-bytes', sidecar, sha256: digest, mode: 0o644 } }],
      scopeHashes: {},
    }));

    try {
      const result = spawnSync(
        process.execPath,
        ['--input-type=module', '-e', recoveryScript, manifestFile],
        { cwd: callerRoot, encoding: 'utf8', env: { ...process.env, UPGRADE_LEGACY_REPO_ROOT: repoRoot } },
      );
      expect(result.status, result.stdout + result.stderr).not.toBe(0);
      expect(result.stderr).toContain('symbolic link, not followed');
      expect(fs.readFileSync(target, 'utf8')).toBe('changed bytes\n');
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
      fs.rmSync(callerRoot, { recursive: true, force: true });
      fs.rmSync(elsewhere, { recursive: true, force: true });
    }
  }, 180_000);

  it('stale-manifest-head-refuses-apply', () => {
    prepareDirtyManifest();
    const firstApply = runUpgrade(['--apply', '--roots', DIRTY_PACKET]);
    expect(firstApply.status, firstApply.stdout + firstApply.stderr).toBe(0);
    const manifestFile = upgradeManifestPath();
    const body = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    const recordedHead = body.headSha;

    fs.writeFileSync(path.join(sandbox, 'head-moved.txt'), 'advance the fixture head\n');
    commitChanges('advance fixture head');
    const currentHead = execFileSync('git', ['-C', sandbox, 'rev-parse', '--verify', 'HEAD'], { encoding: 'utf8' }).trim();
    expect(currentHead).not.toBe(recordedHead);
    fs.appendFileSync(path.join(sandbox, DIRTY_PACKET, 'spec.md'), '\nSee [new missing target](./head-moved-missing.md).\n');

    const beforeTree = manifest(DIRTY_PACKET);
    const manifestBytes = fs.readFileSync(manifestFile);
    const dryRun = runUpgrade(['--roots', DIRTY_PACKET]);
    const dryOutput = `${dryRun.stdout}${dryRun.stderr}`;
    expect(dryRun.status, dryOutput).not.toBe(2);
    expect(dryOutput).toContain(manifestFile);
    expect(dryOutput).toContain(recordedHead);
    expect(dryOutput).toContain(currentHead);
    expect(dryOutput).toContain('inspected=1');
    expect(fs.readFileSync(manifestFile)).toEqual(manifestBytes);

    const refused = runUpgrade(['--apply', '--roots', DIRTY_PACKET]);
    const refusedOutput = `${refused.stdout}${refused.stderr}`;
    expect(refused.status, refusedOutput).toBe(2);
    expect(refusedOutput).toContain(manifestFile);
    expect(refusedOutput).toContain(recordedHead);
    expect(refusedOutput).toContain(currentHead);
    expect(refusedOutput).toContain('Restore');
    expect(refusedOutput).toContain('remove the manifest deliberately');
    expect(fs.readFileSync(manifestFile)).toEqual(manifestBytes);
    expect(manifest(DIRTY_PACKET)).toBe(beforeTree);
  }, 180_000);

  it('stale-manifest-tree-refuses-apply', () => {
    prepareDirtyManifest();
    const manifestFile = upgradeManifestPath();
    fs.rmSync(manifestFile, { force: true });
    const specFile = path.join(sandbox, DIRTY_PACKET, 'spec.md');
    fs.appendFileSync(specFile, '\nSee [tree baseline target](./tree-baseline-missing.md).\n');

    const firstApply = runUpgrade(['--apply', '--roots', DIRTY_PACKET]);
    expect(firstApply.status, firstApply.stdout + firstApply.stderr).toBe(0);
    expect(fs.existsSync(manifestFile)).toBe(true);

    fs.appendFileSync(specFile, '\nThe packet changed after its manifest was written.\n');
    const changedSpec = fs.readFileSync(specFile);
    const manifestBytes = fs.readFileSync(manifestFile);
    const refused = runUpgrade(['--apply', '--roots', DIRTY_PACKET]);
    const refusedOutput = `${refused.stdout}${refused.stderr}`;
    expect(refused.status, refusedOutput).toBe(2);
    expect(refusedOutput).toContain('tree mismatch');
    expect(refusedOutput).toContain('recorded packet hash');
    expect(fs.readFileSync(manifestFile)).toEqual(manifestBytes);
    expect(fs.readFileSync(specFile)).toEqual(changedSpec);
  }, 180_000);

  // Every lane mode meets this packet at once: an unwrapped section, a link
  // whose only target sits outside specs/, a half-authored continuity pair, a
  // document with no level, and a missing template-source header. The second
  // run proves each repair settled rather than moving the defect around.
  it('all-modes-sequence', () => {
    const folder = 'specs/lane-track/001-all-modes';
    const packetFolder = path.join(sandbox, folder);
    fs.mkdirSync(packetFolder, { recursive: true });

    // The one indexed file ending in the link's own trailing segments, kept
    // outside specs/ so only a repoint can connect the document to it.
    const guide = path.join(sandbox, 'docs/moved-notes/guide.md');
    fs.mkdirSync(path.dirname(guide), { recursive: true });
    fs.writeFileSync(guide, '# Moved guide\n');

    const rendered = (relative: string) =>
      renderInlineGates(fs.readFileSync(path.join(copy, relative), 'utf8'), '2');
    fs.writeFileSync(
      path.join(packetFolder, 'spec.md'),
      `${rendered('templates/core/spec.md.tmpl')}\nSee [guide](../moved-notes/guide.md).\n`,
    );

    // The source line and the architecture pair are removed so the modes have
    // to put them back; the removed lines are kept to compare the result to.
    // The stamp comes from the manifest, so a template version bump keeps this
    // line equal to the one the rendered template carries.
    const planVersion = (JSON.parse(
      fs.readFileSync(path.join(copy, 'templates/spec-kit-docs.json'), 'utf8'),
    ) as { versions: Record<string, string> }).versions['plan.md.tmpl'];
    const planSourceLine = `<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | ${planVersion} -->`;
    const architectureOpen = '<!-- ANCHOR:architecture -->';
    const architectureClose = '<!-- /ANCHOR:architecture -->';
    fs.writeFileSync(
      path.join(packetFolder, 'plan.md'),
      rendered('templates/core/plan.md.tmpl')
        .split('\n')
        .filter((line) => line !== planSourceLine && line !== architectureOpen && line !== architectureClose)
        .join('\n'),
    );

    // One continuity field is authored, so the pair is an edit in progress and
    // the mode has to refuse it rather than complete it.
    fs.writeFileSync(
      path.join(packetFolder, 'tasks.md'),
      rendered('templates/core/tasks.md.tmpl')
        .split('\n')
        .filter((line) => line !== '<!-- SPECKIT_LEVEL: 2 -->')
        .join('\n')
        .replace(
          'contextType: "general"\n---',
          [
            'contextType: "general"',
            '_memory:',
            '  continuity:',
            '    recent_action: "Wrote the task list"',
            '    next_safe_action: "Replace continuity placeholders"',
            '---',
          ].join('\n'),
        ),
    );

    fs.writeFileSync(
      path.join(packetFolder, 'implementation-summary.md'),
      rendered('templates/core/implementation-summary.md.tmpl'),
    );

    clearUpgradeManifest();
    const first = runUpgrade(['--apply', '--roots', 'specs/lane-track']);
    expect(first.status, first.stdout + first.stderr).toBe(0);

    const healedPlan = fs.readFileSync(path.join(packetFolder, 'plan.md'), 'utf8');
    const planLines = healedPlan.split('\n');
    const architectureHeading = planLines.indexOf('## 3. ARCHITECTURE');
    expect(architectureHeading, healedPlan).toBeGreaterThan(0);
    expect(planLines[architectureHeading - 1], healedPlan).toBe(architectureOpen);
    expect(planLines.indexOf(architectureClose), healedPlan).toBeGreaterThan(architectureHeading);
    expect(healedPlan).toContain(planSourceLine);

    const healedTasks = fs.readFileSync(path.join(packetFolder, 'tasks.md'), 'utf8');
    const tasksLines = healedTasks.split('\n');
    const tasksFrontmatterEnd = tasksLines.indexOf('---', 1);
    expect(tasksFrontmatterEnd, healedTasks).toBeGreaterThan(1);
    expect(tasksLines.slice(0, tasksFrontmatterEnd), healedTasks).toContain('level: 2');

    const healedSpec = fs.readFileSync(path.join(packetFolder, 'spec.md'), 'utf8');
    const guideTarget = healedSpec.match(/\[guide\]\(([^)]+)\)/u)?.[1];
    expect(guideTarget, healedSpec).toBeDefined();
    expect(fs.realpathSync(path.resolve(packetFolder, guideTarget!)), healedSpec).toBe(fs.realpathSync(guide));

    const healedSummary = fs.readFileSync(path.join(packetFolder, 'implementation-summary.md'), 'utf8');
    expect(healedSummary).toContain('No continuity update was recorded');
    expect(healedSummary).toContain('None recorded');

    const baselineFile = path.join(packetFolder, 'upgrade-baseline.json');
    const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
    expect(baseline.refusals).toEqual(expect.arrayContaining([
      expect.objectContaining({ mode: 'continuity-placeholders', document: 'tasks.md' }),
    ]));

    const check = validate(folder);
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');

    // Every .md text and the recorded findings, kept to prove the second run
    // changes neither.
    const markdownTexts = (root: string): Record<string, string> => {
      const texts: Record<string, string> = {};
      const walk = (dir: string): void => {
        for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
          const abs = path.join(dir, item.name);
          if (item.isDirectory()) walk(abs);
          else if (item.isFile() && item.name.endsWith('.md')) {
            texts[path.relative(root, abs).split(path.sep).join('/')] = fs.readFileSync(abs, 'utf8');
          }
        }
      };
      walk(root);
      return texts;
    };
    const savedTexts = markdownTexts(packetFolder);
    const savedFindings = baseline.findings;
    const savedRefusals = baseline.refusals;

    // The baseline is what lets the repaired packet pass, so deleting it puts
    // the same findings back in front of every mode: the second run heals text
    // it has already healed and has to come away with identical bytes and an
    // identical record.
    fs.rmSync(baselineFile, { force: true });
    clearUpgradeManifest();

    const second = runUpgrade(['--apply', '--roots', 'specs/lane-track']);
    expect(second.status, second.stdout + second.stderr).toBe(0);

    expect(markdownTexts(packetFolder)).toEqual(savedTexts);
    const secondBaseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
    expect(secondBaseline.findings).toEqual(savedFindings);
    expect(secondBaseline.refusals).toEqual(savedRefusals);

    const recheck = validate(folder);
    expect(recheck.stdout, recheck.stdout + recheck.stderr).toContain('RESULT: PASSED');
  }, 180_000);

  // The healer visits one document at a time (spec.md, plan.md, tasks.md) and
  // runs every mode on it, so it meets these refusals document by document.
  // The baseline lists them by mode, then document, then reason. The link
  // refusals pin the last two keys: plan.md sorts before spec.md while its
  // reason sorts after, and spec.md's own two links are written against reason
  // order. Reasons are matched by a distinguishing fragment, so a reworded
  // message does not read as an ordering failure.
  it('records lane-mode refusals in mode, document and reason order', () => {
    const folder = 'specs/lane-track/002-refusal-order';
    const packetFolder = path.join(sandbox, folder);
    writeLegacyPacket(folder);

    // spec.md carries a section but no ANCHOR marker, and two links nothing can
    // be matched to, written against reason order. plan.md carries one more
    // whose reason sorts after both: by document it comes first, by reason
    // last. None of the three documents declares a level, which refuses
    // level-from-spec and header-add.
    fs.appendFileSync(
      path.join(packetFolder, 'spec.md'),
      [
        '',
        '## 1. OVERVIEW',
        '',
        'Read [mike](./mike-absent.md) first, then [alpha](./alpha-absent.md).',
        '',
      ].join('\n'),
    );
    fs.appendFileSync(path.join(packetFolder, 'plan.md'), '\nSee [zulu](./zulu-absent.md).\n');

    clearUpgradeManifest();
    const result = runUpgrade(['--apply', '--roots', 'specs/lane-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);

    const baseline = JSON.parse(fs.readFileSync(path.join(packetFolder, 'upgrade-baseline.json'), 'utf8'));
    expect(baseline.refusals).toEqual([
      { mode: 'anchor-wrap', document: 'spec.md', reason: expect.stringContaining('no ANCHOR marker') },
      { mode: 'link-repoint', document: 'plan.md', reason: expect.stringContaining('zulu-absent.md') },
      { mode: 'link-repoint', document: 'spec.md', reason: expect.stringContaining('alpha-absent.md') },
      { mode: 'link-repoint', document: 'spec.md', reason: expect.stringContaining('mike-absent.md') },
      { mode: 'level-from-spec', document: 'plan.md', reason: expect.stringContaining('no SPECKIT_LEVEL marker') },
      { mode: 'level-from-spec', document: 'tasks.md', reason: expect.stringContaining('no SPECKIT_LEVEL marker') },
      { mode: 'header-add', document: 'plan.md', reason: expect.stringContaining('no level is recorded') },
      { mode: 'header-add', document: 'spec.md', reason: expect.stringContaining('no level is recorded') },
      { mode: 'header-add', document: 'tasks.md', reason: expect.stringContaining('no level is recorded') },
    ]);
  }, 180_000);
});
