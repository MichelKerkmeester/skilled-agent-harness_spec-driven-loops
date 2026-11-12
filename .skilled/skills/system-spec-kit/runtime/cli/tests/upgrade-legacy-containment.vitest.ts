// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders — link containment and release apply lock
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { recordFindings } from '../spec/upgrade-legacy.mjs';

import { DIRTY_PACKET, sandbox, runUpgrade, manifest, upgradeManifestPath, clearUpgradeManifest, resetSandbox, commitChanges, writeLegacyPacket, prepareDirtyManifest, nestedQuestionsSpec, treeFingerprint, setupSandbox, teardownSandbox } from './helpers/upgrade-legacy-harness';

beforeAll(setupSandbox, 180_000);
afterAll(teardownSandbox);

// A link inside a packet can point anywhere, so a write or a before-image must
// be confined to the packet folder. Each case plants a link whose target lives in
// the OS temp directory, outside the repository, and checks that target afterwards.
describe('upgrade-legacy link containment', () => {
  afterEach(resetSandbox);

  it('refuses a packet whose document is a link out of the packet and leaves the link target as it was', () => {
    const folder = 'specs/link-containment/001-packet';
    writeLegacyPacket(folder);
    const specFile = path.join(sandbox, folder, 'spec.md');
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const outsideFile = path.join(outsideDir, 'target.md');
    const outsideText = '# Outside target\n\nNo frontmatter here.\n';
    fs.writeFileSync(outsideFile, outsideText);
    fs.rmSync(specFile);
    fs.symlinkSync(outsideFile, specFile);

    try {
      const result = runUpgrade(['--apply', '--roots', folder]);
      const output = result.stdout + result.stderr;
      expect(fs.readFileSync(outsideFile, 'utf8')).toBe(outsideText);
      expect(fs.lstatSync(specFile).isSymbolicLink()).toBe(true);
      expect(output).toContain(`refused ${folder}`);
      expect(output).toContain('symbolic link, not followed');
      expect(result.status, output).toBe(2);
    } finally {
      fs.rmSync(specFile, { force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  it('does not copy a file read through a link into the reversibility manifest', () => {
    const folder = 'specs/link-containment/002-packet';
    writeLegacyPacket(folder);
    const nested = path.join(sandbox, folder, 'nested', 'deeper');
    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(path.join(nested, 'notes.md'), '# Inside note\n');
    commitChanges('committed packet with a nested note', [folder]);
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const outsideNote = path.join(outsideDir, 'notes.md');
    const secret = 'outside note bytes\n';
    fs.writeFileSync(outsideNote, secret);
    fs.rmSync(nested, { recursive: true, force: true });
    fs.symlinkSync(outsideDir, nested);

    try {
      const result = runUpgrade(['--apply', '--roots', folder]);
      const manifest = fs.existsSync(upgradeManifestPath()) ? fs.readFileSync(upgradeManifestPath(), 'utf8') : '';
      expect(manifest).not.toContain(Buffer.from(secret).toString('base64'));
      // The bytes live in sidecars now, so the manifest alone no longer proves
      // the secret stayed out; no sidecar may hold it either.
      const secretBytes = Buffer.from(secret);
      const secretDigest = crypto.createHash('sha256').update(secretBytes).digest('hex');
      const beforeImagesDir = path.join(path.dirname(upgradeManifestPath()), 'upgrade-legacy.before-images');
      const sidecarNames = fs.existsSync(beforeImagesDir)
        ? fs.readdirSync(beforeImagesDir).filter((name) => fs.lstatSync(path.join(beforeImagesDir, name)).isFile())
        : [];
      for (const name of sidecarNames) {
        const sidecar = path.join(beforeImagesDir, name);
        expect(fs.readFileSync(sidecar).equals(secretBytes), sidecar).toBe(false);
      }
      expect(sidecarNames).not.toContain(`${secretDigest}.bin`);
      expect(fs.readFileSync(outsideNote, 'utf8')).toBe(secret);
      expect(result.status, result.stdout + result.stderr).toBe(2);
    } finally {
      fs.rmSync(nested, { force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  it('writes the baseline under a fresh temporary name so a link planted at a guessable name is not written through', () => {
    const folder = path.join(sandbox, 'specs/link-containment/003-packet');
    fs.mkdirSync(folder, { recursive: true });
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const outsideFile = path.join(outsideDir, 'target.json');
    fs.writeFileSync(outsideFile, 'outside bytes\n');
    // The temporary name the old writer used was predictable from the process id alone.
    fs.symlinkSync(outsideFile, path.join(folder, `upgrade-baseline.json.${process.pid}.tmp`));
    const finding = { rule: 'SAMPLE_RULE', detail: 'sample detail' };

    try {
      recordFindings(folder, [finding], [fs.realpathSync(path.join(sandbox, 'specs'))]);
      expect(fs.readFileSync(outsideFile, 'utf8')).toBe('outside bytes\n');
      expect(JSON.parse(fs.readFileSync(path.join(folder, 'upgrade-baseline.json'), 'utf8')).findings).toEqual([finding]);
    } finally {
      fs.rmSync(folder, { recursive: true, force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  });

  it('still repairs a link whose target stays inside the packet', () => {
    const folder = 'specs/link-containment/004-packet';
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const source = path.join(packetFolder, 'sources', 'plan-source.md');
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.renameSync(path.join(packetFolder, 'plan.md'), source);
    fs.symlinkSync(path.join('sources', 'plan-source.md'), path.join(packetFolder, 'plan.md'));

    const result = runUpgrade(['--apply', '--roots', folder]);
    const output = result.stdout + result.stderr;
    expect(output).not.toContain('refused');
    expect(fs.readFileSync(source, 'utf8').startsWith('---\n')).toBe(true);
  }, 180_000);

  it('does not read findings from a baseline that is a link out of the packet', () => {
    const folder = 'specs/link-containment/005-packet';
    writeLegacyPacket(folder);
    const baseline = path.join(sandbox, folder, 'upgrade-baseline.json');
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const outsideBaseline = path.join(outsideDir, 'baseline.json');
    const outsideText = `${JSON.stringify({ schema: 1, recordedBy: 'outside', findings: [{ rule: 'OUTSIDE_FINDING', detail: 'outside detail' }] }, null, 2)}\n`;
    fs.writeFileSync(outsideBaseline, outsideText);
    fs.symlinkSync(outsideBaseline, baseline);

    try {
      const result = runUpgrade(['--roots', folder]);
      const output = result.stdout + result.stderr;
      expect(output).not.toContain('OUTSIDE_FINDING');
      expect(output).toContain(`refused ${folder}: upgrade-baseline.json is a symbolic link, not followed`);
      expect(fs.readFileSync(outsideBaseline, 'utf8')).toBe(outsideText);
      expect(result.status, output).toBe(1);
    } finally {
      fs.rmSync(baseline, { force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  // The archived un-nesting rewrites spec.md. Reading through a link and writing
  // back would replace the link with a copy of its target, so the link is skipped
  // and the file it points at is left as it was.
  it('leaves an archived spec.md that links to a file in the same packet, and that file, unchanged', () => {
    clearUpgradeManifest();
    const folder = 'specs/z_archive/006-linked';
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const targetText = nestedQuestionsSpec();
    fs.writeFileSync(path.join(packetFolder, 'spec-source.txt'), targetText);
    fs.rmSync(path.join(packetFolder, 'spec.md'));
    fs.symlinkSync('spec-source.txt', path.join(packetFolder, 'spec.md'));

    const result = runUpgrade(['--apply', '--include-archive', '--roots', 'specs/z_archive']);
    const output = result.stdout + result.stderr;
    expect(output).toContain(`left unchanged ${folder}/spec.md: symbolic link, not followed`);
    expect(fs.lstatSync(path.join(packetFolder, 'spec.md')).isSymbolicLink()).toBe(true);
    expect(fs.readlinkSync(path.join(packetFolder, 'spec.md'))).toBe('spec-source.txt');
    expect(fs.readFileSync(path.join(packetFolder, 'spec-source.txt'), 'utf8')).toBe(targetText);
  }, 180_000);

  it('leaves findings read through a linked baseline out of the apply census', () => {
    clearUpgradeManifest();
    const folder = 'specs/link-containment/007-packet';
    writeLegacyPacket(folder);
    const baseline = path.join(sandbox, folder, 'upgrade-baseline.json');
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const outsideBaseline = path.join(outsideDir, 'baseline.json');
    const outsideText = `${JSON.stringify({ schema: 1, recordedBy: 'outside', findings: [{ rule: 'OUTSIDE_CENSUS_RULE', detail: 'outside detail' }] }, null, 2)}\n`;
    fs.writeFileSync(outsideBaseline, outsideText);
    fs.symlinkSync(outsideBaseline, baseline);

    try {
      const result = runUpgrade(['--apply', '--roots', folder]);
      const output = result.stdout + result.stderr;
      expect(output).toContain('recorded findings by rule:');
      expect(output).not.toContain('OUTSIDE_CENSUS_RULE');
      expect(fs.readFileSync(outsideBaseline, 'utf8')).toBe(outsideText);
    } finally {
      fs.rmSync(baseline, { force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  // A link is a write target for the repair steps. A dangling one is refused
  // rather than followed, since a write through it would create the file it names.
  it.each([
    { label: 'inside the packet', outside: false },
    { label: 'outside the repository', outside: true },
  ])('refuses a packet whose document is a dangling link to a file $label, and writes nothing', ({ outside }) => {
    const folder = 'specs/link-containment/008-dangling';
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const missing = outside
      ? path.join(outsideDir, 'never-written.md')
      : path.join(packetFolder, 'sources', 'never-written.md');
    fs.mkdirSync(path.dirname(missing), { recursive: true });
    fs.rmSync(path.join(packetFolder, 'plan.md'));
    fs.symlinkSync(missing, path.join(packetFolder, 'plan.md'));
    const refusal = `plan.md is a symbolic link, not followed, and does not resolve inside the packet`;

    try {
      const before = treeFingerprint(packetFolder);
      const dryRun = runUpgrade(['--roots', folder]);
      expect(dryRun.stdout + dryRun.stderr).toContain(`would refuse ${folder}: ${refusal}`);
      expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(1);

      const result = runUpgrade(['--apply', '--roots', folder]);
      const output = result.stdout + result.stderr;
      expect(output).toContain(`refused ${folder}: ${refusal}`);
      expect(result.status, output).toBe(2);
      expect(fs.existsSync(missing), output).toBe(false);
      expect(treeFingerprint(packetFolder)).toBe(before);
      expect(fs.existsSync(path.join(packetFolder, 'upgrade-baseline.json'))).toBe(false);
    } finally {
      fs.rmSync(packetFolder, { recursive: true, force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  // A document that links into a neighbouring packet reaches a folder outside its
  // own packet, so it is refused and the neighbour is neither read nor written.
  it('refuses a document that links to a sibling packet, and leaves the sibling as it was', () => {
    const folder = 'specs/link-containment/009-linker';
    const sibling = 'specs/link-containment/010-sibling';
    writeLegacyPacket(folder);
    writeLegacyPacket(sibling);
    const packetFolder = path.join(sandbox, folder);
    fs.rmSync(path.join(packetFolder, 'plan.md'));
    fs.symlinkSync(path.join('..', '010-sibling', 'plan.md'), path.join(packetFolder, 'plan.md'));
    const linkerBefore = treeFingerprint(packetFolder);
    const siblingBefore = manifest(sibling);

    const result = runUpgrade(['--apply', '--roots', folder]);
    const output = result.stdout + result.stderr;
    expect(output).toContain(`refused ${folder}: plan.md is a symbolic link, not followed, and does not resolve inside the packet`);
    expect(result.status, output).toBe(2);
    expect(manifest(sibling)).toBe(siblingBefore);
    expect(treeFingerprint(packetFolder)).toBe(linkerBefore);
  }, 180_000);

  // A packet that already passes is not repaired, so an in-packet link in it is
  // neither written through nor reflected in its recorded baseline.
  it('writes nothing for a passing packet that links inside itself, and keeps its baseline', () => {
    clearUpgradeManifest();
    const folder = 'specs/link-containment/011-inside';
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const settled = runUpgrade(['--apply', '--roots', folder]);
    expect(settled.status, settled.stdout + settled.stderr).toBe(0);
    const baseline = path.join(packetFolder, 'upgrade-baseline.json');
    const baselineBefore = fs.readFileSync(baseline);
    fs.mkdirSync(path.join(packetFolder, 'sources'));
    fs.renameSync(path.join(packetFolder, 'plan.md'), path.join(packetFolder, 'sources', 'plan.md'));
    fs.symlinkSync(path.join('sources', 'plan.md'), path.join(packetFolder, 'plan.md'));
    clearUpgradeManifest();
    const linkedBefore = treeFingerprint(packetFolder);

    const result = runUpgrade(['--apply', '--roots', folder]);
    const output = result.stdout + result.stderr;
    expect(output).toContain('passing before=1/1');
    expect(output).toContain('plan changes=0');
    expect(result.status, output).toBe(0);
    expect(treeFingerprint(packetFolder)).toBe(linkedBefore);
    expect(fs.readFileSync(baseline)).toEqual(baselineBefore);
  }, 180_000);

  // With no --roots the run falls back to the default specs roots, so a default root that is
  // a link out of the repository is refused the same way an explicit one is.
  it('refuses a default specs root that is a link to a directory outside the repository, with no --roots', () => {
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    writeLegacyPacket('specs/default-roots/001-legacy-packet');
    fs.mkdirSync(path.join(outsideDir, 'specs'), { recursive: true });
    fs.renameSync(path.join(sandbox, 'specs/default-roots/001-legacy-packet'), path.join(outsideDir, 'specs', '001-legacy-packet'));
    fs.rmSync(path.join(sandbox, 'specs'), { recursive: true, force: true });
    fs.symlinkSync(path.join(outsideDir, 'specs'), path.join(sandbox, 'specs'), 'dir');
    const before = treeFingerprint(outsideDir);

    try {
      const dryRun = runUpgrade([]);
      expect(dryRun.stdout + dryRun.stderr).toContain('root outside the repository');
      expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(2);

      const result = runUpgrade(['--apply']);
      const output = result.stdout + result.stderr;
      expect(output).toContain('root outside the repository');
      expect(result.status, output).toBe(2);
      expect(treeFingerprint(outsideDir)).toBe(before);
      expect(fs.lstatSync(path.join(sandbox, 'specs')).isSymbolicLink()).toBe(true);
    } finally {
      fs.rmSync(path.join(sandbox, 'specs'), { recursive: true, force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  it('refuses a reversibility manifest that is a link, and reuses no baseline from its target', () => {
    prepareDirtyManifest();
    const file = upgradeManifestPath();
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const outsideManifest = path.join(outsideDir, 'manifest.json');
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
    saved.recordedBaselineMap = {
      ...(saved.recordedBaselineMap || {}),
      [DIRTY_PACKET]: [{ rule: 'OUTSIDE_MANIFEST_FINDING', detail: 'outside manifest detail' }],
    };
    const outsideText = `${JSON.stringify(saved, null, 2)}\n`;
    fs.writeFileSync(outsideManifest, outsideText);
    fs.rmSync(file);
    fs.symlinkSync(outsideManifest, file);

    try {
      const result = runUpgrade(['--roots', 'specs/system-spec-kit']);
      const output = result.stdout + result.stderr;
      expect(output).not.toContain('OUTSIDE_MANIFEST_FINDING');
      expect(output).toContain('symbolic link, not followed');
      expect(result.status, output).toBe(2);
      expect(fs.readFileSync(outsideManifest, 'utf8')).toBe(outsideText);
      expect(fs.lstatSync(file).isSymbolicLink()).toBe(true);
    } finally {
      fs.rmSync(file, { force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);

  it('refuses a dangling reversibility manifest link in dry run and apply', () => {
    prepareDirtyManifest();
    const file = upgradeManifestPath();
    const outsideDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-outside-')));
    const missingManifest = path.join(outsideDir, 'missing-manifest.json');
    fs.rmSync(file);
    fs.symlinkSync(missingManifest, file);
    const beforePackets = manifest('specs/system-spec-kit');

    try {
      const dryRun = runUpgrade(['--roots', 'specs/system-spec-kit']);
      expect(dryRun.stderr).toContain('symbolic link, not followed');
      expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(2);
      expect(fs.lstatSync(file).isSymbolicLink()).toBe(true);
      expect(fs.existsSync(missingManifest)).toBe(false);
      expect(manifest('specs/system-spec-kit')).toBe(beforePackets);

      const applied = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit']);
      expect(applied.stderr).toContain('symbolic link, not followed');
      expect(applied.status, applied.stdout + applied.stderr).toBe(2);
      expect(fs.lstatSync(file).isSymbolicLink()).toBe(true);
      expect(fs.existsSync(missingManifest)).toBe(false);
      expect(manifest('specs/system-spec-kit')).toBe(beforePackets);
    } finally {
      fs.rmSync(file, { force: true });
      fs.rmSync(outsideDir, { recursive: true, force: true });
    }
  }, 180_000);
});

describe('upgrade-legacy release apply lock', () => {
  afterEach(resetSandbox);

  function holdReleaseApplyLock(): string {
    const lock = path.join(sandbox, '.skilled/skills/.state/doctor-update/.apply.lock');
    fs.mkdirSync(path.dirname(lock), { recursive: true });
    fs.writeFileSync(lock, '{"command":"apply"}\n');
    return lock;
  }

  it('refuses --layout-map while the release apply lock exists, and writes nothing', () => {
    writeLegacyPacket();
    const lock = holdReleaseApplyLock();
    const before = manifest();

    try {
      const result = runUpgrade(['--layout-map']);
      const output = result.stdout + result.stderr;
      expect(output).toContain(lock);
      expect(result.status, output).toBe(2);
      expect(manifest()).toBe(before);
    } finally {
      fs.rmSync(lock, { force: true });
    }
  }, 180_000);

  it('refuses the dry run while the release apply lock exists, and writes nothing', () => {
    writeLegacyPacket();
    const lock = holdReleaseApplyLock();
    const before = manifest();

    try {
      const result = runUpgrade([]);
      const output = result.stdout + result.stderr;
      expect(output).toContain(lock);
      expect(result.status, output).toBe(2);
      expect(manifest()).toBe(before);
    } finally {
      fs.rmSync(lock, { force: true });
    }
  }, 180_000);

  it('refuses --apply while the release apply lock exists, and writes no packet or manifest', () => {
    writeLegacyPacket();
    const lock = holdReleaseApplyLock();
    const before = manifest();

    try {
      const result = runUpgrade(['--apply']);
      const output = result.stdout + result.stderr;
      expect(output).toContain(lock);
      expect(result.status, output).toBe(2);
      expect(manifest()).toBe(before);
      expect(fs.existsSync(upgradeManifestPath())).toBe(false);
    } finally {
      fs.rmSync(lock, { force: true });
    }
  }, 180_000);

  it('runs --layout-map and the dry run normally when no release apply lock exists', () => {
    writeLegacyPacket();

    const layout = runUpgrade(['--layout-map']);
    expect(layout.stdout + layout.stderr).not.toContain('.apply.lock');
    expect(layout.status, layout.stdout + layout.stderr).toBe(0);

    const dryRun = runUpgrade([]);
    expect(dryRun.stdout + dryRun.stderr).not.toContain('.apply.lock');
    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(1);
  }, 180_000);
});
