// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { readTriggerPhrases } from '../retrieval/lib/frontmatter.mjs';
import { judgeTriggerPhrase } from '../retrieval/lib/phrase-judge.mjs';

const skillRoot = path.resolve(__dirname, '../../..');
const PACKET = 'specs/system-spec-kit/001-legacy-packet';
const DIRTY_PACKET = 'specs/system-spec-kit/002-dirty-packet';

// The command derives its repository from its own location and refuses roots
// outside it, so the sweep runs against a full copy of the skill inside a
// throwaway repository rather than this checkout.
let sandbox: string;
let copy: string;

function runUpgrade(args: string[], env: Record<string, string | undefined> = {}) {
  return spawnSync(process.execPath, [path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs'), ...args], {
    cwd: sandbox,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

function validate(folder: string) {
  return spawnSync('bash', [path.join(copy, 'runtime/cli/spec/validate.sh'), folder, '--strict'], { cwd: sandbox, encoding: 'utf8' });
}

function validateJson(folder: string) {
  return spawnSync(
    'bash',
    [path.join(copy, 'runtime/cli/spec/validate.sh'), folder, '--strict', '--json', '--no-recursive'],
    { cwd: sandbox, encoding: 'utf8' },
  );
}

function downgradeRows(output: string): string[] {
  const section = output.split('\nDowngrades:\n')[1]?.split('\ninspected=')[0] ?? '';
  return section.split('\n').filter((line) => line.startsWith('  ') && line.trim() !== 'none').map((line) => line.trim());
}

// One digest standing for the whole specs tree, or one folder of it — every
// file's relative path plus content hash, sorted — so a write anywhere in the
// tree shows up here.
function manifest(relative = 'specs'): string {
  const specs = path.join(sandbox, relative);
  const entries: string[] = [];
  const walk = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(abs);
      } else {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
        entries.push(`${path.relative(specs, abs).split(path.sep).join('/')} ${digest}`);
      }
    }
  };
  walk(specs);
  return crypto.createHash('sha256').update(entries.sort().join('\n')).digest('hex');
}

function gitDir(): string {
  return execFileSync('git', ['-C', sandbox, 'rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim();
}

function upgradeManifestPath(): string {
  return path.join(gitDir(), 'upgrade-legacy.manifest.json');
}

function clearUpgradeManifest(): void {
  fs.rmSync(upgradeManifestPath(), { force: true });
}

function refreshCopiedDistMtimes(): void {
  const now = new Date();
  const touchDist = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === 'node_modules') continue;
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) touchDist(abs);
      else if (item.isFile() && abs.includes('/dist/')) fs.utimesSync(abs, now, now);
    }
  };
  touchDist(path.join(copy, 'runtime'));
}

function commitChanges(message: string, forcePaths: string[] = []): void {
  execFileSync('git', ['add', '-A'], { cwd: sandbox });
  if (forcePaths.length > 0) execFileSync('git', ['add', '-f', '-A', '--', ...forcePaths], { cwd: sandbox });
  execFileSync(
    'git',
    ['-c', 'user.name=Upgrade Legacy Test', '-c', 'user.email=upgrade-legacy@test.invalid', 'commit', '-q', '-m', message],
    { cwd: sandbox },
  );
}

function writeLegacyPacket(relative = PACKET): void {
  const folder = path.join(sandbox, relative);
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, 'spec.md'), '---\ntitle: "Legacy Packet"\ndescription: "A packet written before v4."\n---\n# Legacy Packet\n\nOld packet written before the v4 contract.\n');
  fs.writeFileSync(path.join(folder, 'plan.md'), '# Plan\n\nOld plan.\n');
  fs.writeFileSync(path.join(folder, 'tasks.md'), '# Tasks\n\n- [ ] T001 Old task\n');
}

beforeAll(() => {
  sandbox = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-legacy-')));
  copy = path.join(sandbox, '.skilled/skills/system-spec-kit');
  fs.cpSync(skillRoot, copy, { recursive: true, filter: (src) => path.basename(src) !== 'node_modules' });

  // node_modules stays out of the copy and is linked back in at its real
  // location: it is large and identical, and the copied runtime resolves its
  // dependencies through the same relative paths.
  for (const relative of ['node_modules', 'runtime/node_modules', 'runtime/cli/node_modules']) {
    const source = path.join(skillRoot, relative);
    if (fs.existsSync(source)) fs.symlinkSync(source, path.join(copy, relative), 'dir');
  }
  // A hoisted install gives runtime/ no node_modules of its own, and the
  // freshness check then calls it unprovisioned and never reports it stale.
  // An empty folder counts as provisioned, and resolution still walks up.
  fs.mkdirSync(path.join(copy, 'runtime/node_modules'), { recursive: true });

  // The build record that proves the dist fresh is keyed by the dist's
  // absolute path, so a copy falls back to mtimes, and its dist was built
  // from these sources.
  refreshCopiedDistMtimes();

  fs.mkdirSync(path.join(sandbox, '.opencode'));
  fs.mkdirSync(path.join(sandbox, 'specs'));
  execFileSync('git', ['init', '-q'], { cwd: sandbox });
  commitChanges('test repository baseline');
}, 180_000);

afterAll(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

// The tests share one sandbox on purpose: each one builds on the state the
// previous one left, so the order below is the order they must run in.
describe('upgrade-legacy', () => {
  it('exits 0 on an empty specs tree and says it found nothing', () => {
    const result = runUpgrade([]);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('no spec folders found');
  }, 180_000);

  it('dirty-tree-unwritable-manifest', () => {
    writeLegacyPacket();
    const realGit = (process.env.PATH || '').split(path.delimiter)
      .map((directory) => path.join(directory, 'git'))
      .find((candidate) => fs.existsSync(candidate));
    expect(realGit).toBeDefined();
    const shimDirectory = path.join(sandbox, 'git-shim');
    fs.mkdirSync(shimDirectory, { recursive: true });
    const gitShim = path.join(shimDirectory, 'git');
    fs.writeFileSync(gitShim, [
      '#!/bin/sh',
      'if [ "$1" = "-C" ] && [ "$3" = "rev-parse" ] && [ "$4" = "--absolute-git-dir" ]; then',
      '  printf "/dev/null\\n"',
      '  exit 0',
      'fi',
      'exec "$UPGRADE_REAL_GIT" "$@"',
      '',
    ].join('\n'));
    fs.chmodSync(gitShim, 0o755);
    const before = manifest(PACKET);
    try {
      const result = runUpgrade(['--apply', '--roots', PACKET], {
        PATH: `${shimDirectory}${path.delimiter}${process.env.PATH || ''}`,
        UPGRADE_REAL_GIT: realGit,
      });
      expect(result.status, result.stdout + result.stderr).toBe(2);
      expect(`${result.stdout}${result.stderr}`).toContain('/dev/null/upgrade-legacy.manifest.json');
      expect(`${result.stdout}${result.stderr}`).toContain('could not write reversibility manifest');
      expect(manifest(PACKET)).toBe(before);
    } finally {
      fs.rmSync(shimDirectory, { force: true, recursive: true });
    }
  }, 180_000);

  it('reports a failing legacy packet on a dry run and writes nothing', () => {
    writeLegacyPacket();
    const before = manifest();
    const result = runUpgrade([]);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stdout, result.stdout + result.stderr).toContain(`failing ${PACKET}`);
    expect(result.stdout, result.stdout + result.stderr).toContain('\nDowngrades:\n');
    expect(result.stdout, result.stdout + result.stderr).toContain('error -> warning');
    expect(manifest()).toBe(before);
  }, 180_000);

  it('dry run repairs a symlinked packet document only inside the preview', () => {
    const folder = 'specs/symlink-preview/001-packet';
    fs.rmSync(upgradeManifestPath(), { force: true });
    writeLegacyPacket(folder);
    const packetFolder = path.join(sandbox, folder);
    const specFile = path.join(packetFolder, 'spec.md');
    const outsideTarget = path.join(sandbox, 'outside-preview-target.md');
    const targetBytes = fs.readFileSync(specFile);
    fs.writeFileSync(outsideTarget, targetBytes);
    fs.rmSync(specFile);
    fs.symlinkSync(outsideTarget, specFile);

    try {
      const result = runUpgrade(['--roots', folder]);
      expect(result.status, result.stdout + result.stderr).toBe(1);
      expect(fs.readFileSync(outsideTarget)).toEqual(targetBytes);
      expect(fs.readlinkSync(specFile)).toBe(outsideTarget);
    } finally {
      fs.rmSync(packetFolder, { recursive: true, force: true });
      fs.rmSync(outsideTarget, { force: true });
    }
  }, 180_000);

  it('dry-run Downgrades match the baseline recorded by apply', () => {
    const specFile = path.join(sandbox, PACKET, 'spec.md');
    fs.appendFileSync(specFile, '\nSee [missing preview target](./preview-missing.md).\n');
    const before = validateJson(PACKET);
    expect(before.stdout, before.stdout + before.stderr).not.toBe('');
    const beforeReport = JSON.parse(before.stdout);
    expect(beforeReport.summary.errors).toBeGreaterThan(0);
    const dryRun = runUpgrade(['--roots', PACKET]);
    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(1);

    const applied = runUpgrade(['--apply', '--roots', PACKET]);
    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    const baseline = JSON.parse(fs.readFileSync(path.join(sandbox, PACKET, 'upgrade-baseline.json'), 'utf8'));
    const expectedRows = baseline.findings.map((finding: { rule: string; detail: string }) =>
      `${PACKET} | ${finding.rule} | error -> warning${finding.detail ? ` | ${finding.detail.replace(/\s+/gu, ' ').trim()}` : ''}`,
    ).sort();
    expect(downgradeRows(dryRun.stdout)).toEqual(expectedRows);

    const beforeErrors = beforeReport.entries
      .filter((entry: { status: string }) => entry.status === 'error')
      .flatMap((entry: { rule: string; details: string[]; message: string }) =>
        (entry.details.length > 0 ? entry.details : [entry.message]).map((detail) => ({ rule: entry.rule, detail })),
      );
    const baselineKeys = new Set(baseline.findings.map((finding: { rule: string; detail: string }) => `${finding.rule}\0${finding.detail}`));
    const filledFrontmatterErrors = beforeErrors.filter(({ rule, detail }: { rule: string; detail: string }) =>
      rule === 'GREP_CONVENTION' && /path=(?:plan|tasks)\.md/u.test(detail),
    );
    expect(filledFrontmatterErrors.length).toBeGreaterThan(0);
    expect(filledFrontmatterErrors.every(({ rule, detail }: { rule: string; detail: string }) =>
      !baselineKeys.has(`${rule}\0${detail}`),
    )).toBe(true);
    expect(beforeErrors.some(({ rule, detail }: { rule: string; detail: string }) =>
      detail.includes('preview-missing.md') && baselineKeys.has(`${rule}\0${detail}`),
    )).toBe(true);
  }, 180_000);

  it('repairs with --apply, records what remains and leaves the packet passing', () => {
    const result = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit/001-legacy-packet']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('after=1/1');

    const baseline = JSON.parse(fs.readFileSync(path.join(sandbox, PACKET, 'upgrade-baseline.json'), 'utf8'));
    expect(baseline.schema).toBe(1);
    expect(baseline.findings.length).toBeGreaterThanOrEqual(1);
    // A finding the validator never downgrades in an active packet would only
    // mislead in the baseline, so the recorder must leave it out.
    expect(baseline.findings.map((finding: { rule: string }) => finding.rule)).not.toContain('GENERATED_METADATA_INTEGRITY');

    const check = validate(PACKET);
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');
  }, 180_000);

  it('still fails validation on a fresh mistake beside recorded findings', () => {
    fs.appendFileSync(path.join(sandbox, PACKET, 'spec.md'), '\nSee [missing](./does-not-exist.md).\n');
    const check = validate(PACKET);
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: FAILED');
    expect(check.stdout, check.stdout + check.stderr).toMatch(/^x SPEC_DOC_INTEGRITY/m);
  }, 180_000);

  it('refuses a root outside the repository', () => {
    const result = runUpgrade(['--roots', os.tmpdir()]);
    expect(result.status, result.stdout + result.stderr).toBe(2);
  }, 180_000);

  it('fills missing frontmatter keys and keeps an authored title as written', () => {
    clearUpgradeManifest();
    const folder = 'specs/fm-track/001-authored';
    writeLegacyPacket(folder);
    const authored = '---\ntitle: "Authored Title Kept As Written"\ndescription: "An authored description."\n';
    const body = '# Authored Title Kept As Written\n\nOld packet written before the v4 contract.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'spec.md'), `${authored}---\n${body}`);
    const result = runUpgrade(['--apply', '--roots', 'specs/fm-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    const spec = fs.readFileSync(path.join(sandbox, folder, 'spec.md'), 'utf8');
    expect(spec.startsWith(authored), spec).toBe(true);
    expect(spec, spec).toContain('importance_tier:');
    expect(spec.endsWith(body), spec).toBe(true);
    const plan = fs.readFileSync(path.join(sandbox, folder, 'plan.md'), 'utf8');
    expect(plan.startsWith('---\ntitle: '), plan).toBe(true);
  }, 180_000);

  it('repairs a failing parent without touching its passing child', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/nest-track/001-parent');
    writeLegacyPacket('specs/nest-track/001-parent/001-child');
    const first = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(first.status, first.stdout + first.stderr).toBe(0);
    expect(first.stdout, first.stdout + first.stderr).toContain('after=2/2');

    const child = manifest('specs/nest-track/001-parent/001-child');
    fs.appendFileSync(path.join(sandbox, 'specs/nest-track/001-parent/spec.md'), '\nA note added after the upgrade.\n');
    clearUpgradeManifest();
    const second = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(manifest('specs/nest-track/001-parent/001-child')).toBe(child);
  }, 180_000);

  it('lists a packet once when the given roots overlap', () => {
    const result = runUpgrade(['--roots', 'specs/nest-track', '--roots', 'specs/nest-track/001-parent']);
    expect(result.stdout, result.stdout + result.stderr).toContain('inspected=2 ');
  }, 180_000);

  it('leaves a spec folder copy inside a research tree untouched', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/research-track/001-host');
    const snapshot = 'specs/research-track/001-host/research/snapshots/001-copy';
    writeLegacyPacket(snapshot);
    const before = manifest(snapshot);
    const result = runUpgrade(['--apply', '--roots', 'specs/research-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('inspected=1 active=1');
    expect(manifest(snapshot)).toBe(before);
  }, 180_000);

  it('leaves a root inside z_archive alone unless --include-archive is given', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/z_archive/001-frozen');
    const before = manifest('specs/z_archive');
    const result = runUpgrade(['--apply', '--roots', 'specs/z_archive']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('no spec folders found');
    expect(manifest('specs/z_archive')).toBe(before);
  }, 180_000);

  // An archived packet records where it lives now, so its derived files may be
  // written, but what its documents say is history and stays byte for byte.
  it('repairs only an archived packet\'s derived files and never rewrites its documents', () => {
    clearUpgradeManifest();
    const folder = path.join(sandbox, 'specs/z_archive/001-frozen');
    const docs = Object.fromEntries(fs.readdirSync(folder).filter((name) => name.endsWith('.md')).map((name) => [name, fs.readFileSync(path.join(folder, name), 'utf8')]));
    const result = runUpgrade(['--apply', '--include-archive', '--roots', 'specs/z_archive']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain('step repair-derived (archived): ok');
    expect(fs.readdirSync(folder).filter((name) => name.endsWith('.md')).sort()).toEqual(Object.keys(docs).sort());
    for (const [name, content] of Object.entries(docs)) {
      expect(fs.readFileSync(path.join(folder, name), 'utf8'), name).toBe(content);
    }
    const check = validate('specs/z_archive/001-frozen');
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');
  }, 180_000);

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
        beforeImage: expect.objectContaining({ kind: 'file-bytes', encoding: 'base64' }),
      }),
    ]));
    const specImage = body.beforeImages.find((image: { path: string }) => image.path === `${DIRTY_PACKET}/spec.md`);
    expect(Buffer.from(specImage.beforeImage.content, 'base64')).toEqual(originalSpec);
    const planImage = body.beforeImages.find((image: { path: string }) => image.path === `${DIRTY_PACKET}/plan.md`);
    expect(Buffer.from(planImage.beforeImage.content, 'base64')).toEqual(originalPlan);
  }, 180_000);

  it('manifest-before-image-restores', () => {
    const body = JSON.parse(fs.readFileSync(upgradeManifestPath(), 'utf8'));
    const relative = `${DIRTY_PACKET}/spec.md`;
    const image = body.beforeImages.find((entry: { path: string }) => entry.path === relative);
    expect(image, JSON.stringify(body.beforeImages)).toBeDefined();
    expect(image.beforeImage.kind).toBe('file-bytes');

    const file = path.join(sandbox, relative);
    const current = fs.readFileSync(file);
    const restored = Buffer.from(image.beforeImage.content, 'base64');
    expect(current).not.toEqual(restored);
    try {
      fs.writeFileSync(file, restored);
      expect(fs.readFileSync(file)).toEqual(restored);
    } finally {
      fs.writeFileSync(file, current);
    }
  }, 180_000);

  it('no-git-refuses-apply', () => {
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
    sandbox = movedRoot;
    copy = path.join(sandbox, '.skilled/skills/system-spec-kit');
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

  it('stale-manifest-head-refuses-apply', () => {
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
});
