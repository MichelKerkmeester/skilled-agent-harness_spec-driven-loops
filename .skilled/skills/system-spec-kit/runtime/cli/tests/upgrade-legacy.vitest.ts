// ───────────────────────────────────────────────────────────────────
// TEST: Upgrade Legacy Spec Folders
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const skillRoot = path.resolve(__dirname, '../../..');
const PACKET = 'specs/system-spec-kit/001-legacy-packet';

// The command derives its repository from its own location and refuses roots
// outside it, so the sweep runs against a full copy of the skill inside a
// throwaway repository rather than this checkout.
let sandbox: string;
let copy: string;

function runUpgrade(args: string[]) {
  return spawnSync(process.execPath, [path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs'), ...args], { cwd: sandbox, encoding: 'utf8' });
}

function validate(folder: string) {
  return spawnSync('bash', [path.join(copy, 'runtime/cli/spec/validate.sh'), folder, '--strict'], { cwd: sandbox, encoding: 'utf8' });
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

  fs.mkdirSync(path.join(sandbox, '.opencode'));
  fs.mkdirSync(path.join(sandbox, 'specs'));
  execFileSync('git', ['init', '-q'], { cwd: sandbox });
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

  it('reports a failing legacy packet on a dry run and writes nothing', () => {
    writeLegacyPacket();
    const before = manifest();
    const result = runUpgrade([]);
    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stdout, result.stdout + result.stderr).toContain(`failing ${PACKET}`);
    expect(manifest()).toBe(before);
  }, 180_000);

  it('repairs with --apply, records what remains and leaves the packet passing', () => {
    const result = runUpgrade(['--apply']);
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

  it('changes nothing on a second --apply', () => {
    const before = manifest();
    const result = runUpgrade(['--apply']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(manifest()).toBe(before);
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
    writeLegacyPacket('specs/nest-track/001-parent');
    writeLegacyPacket('specs/nest-track/001-parent/001-child');
    const first = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(first.status, first.stdout + first.stderr).toBe(0);
    expect(first.stdout, first.stdout + first.stderr).toContain('after=2/2');

    const child = manifest('specs/nest-track/001-parent/001-child');
    fs.appendFileSync(path.join(sandbox, 'specs/nest-track/001-parent/spec.md'), '\nA note added after the upgrade.\n');
    const second = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(second.status, second.stdout + second.stderr).toBe(0);
    expect(manifest('specs/nest-track/001-parent/001-child')).toBe(child);
  }, 180_000);

  it('lists a packet once when the given roots overlap', () => {
    const result = runUpgrade(['--roots', 'specs/nest-track', '--roots', 'specs/nest-track/001-parent']);
    expect(result.stdout, result.stdout + result.stderr).toContain('inspected=2 ');
  }, 180_000);

  it('leaves a spec folder copy inside a research tree untouched', () => {
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
    writeLegacyPacket('specs/z_archive/001-frozen');
    const before = manifest('specs/z_archive');
    const result = runUpgrade(['--apply', '--roots', 'specs/z_archive']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout, result.stdout + result.stderr).toContain('no spec folders found');
    expect(manifest('specs/z_archive')).toBe(before);
  }, 180_000);

  it('only records an archived packet and never rewrites its documents', () => {
    const folder = path.join(sandbox, 'specs/z_archive/001-frozen');
    const docs = Object.fromEntries(fs.readdirSync(folder).map((name) => [name, fs.readFileSync(path.join(folder, name), 'utf8')]));
    const result = runUpgrade(['--apply', '--include-archive', '--roots', 'specs/z_archive']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(fs.readdirSync(folder).sort()).toEqual([...Object.keys(docs), 'upgrade-baseline.json'].sort());
    for (const [name, content] of Object.entries(docs)) {
      expect(fs.readFileSync(path.join(folder, name), 'utf8'), name).toBe(content);
    }
    const check = validate('specs/z_archive/001-frozen');
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');
  }, 180_000);

  it('records a detail the validator repeats once per copy', () => {
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
});
