// ───────────────────────────────────────────────────────────────────
// MODULE: Upgrade Legacy Spec Folders
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { readTriggerPhrases } from '../retrieval/lib/frontmatter.mjs';
import { judgeTriggerPhrase } from '../retrieval/lib/phrase-judge.mjs';
import { planLayoutMove } from '../spec/upgrade-legacy.mjs';
import { renderInlineGates } from '../templates/inline-gate-renderer';

const skillRoot = path.resolve(__dirname, '../../..');
const PACKET = 'specs/system-spec-kit/001-legacy-packet';
const DIRTY_PACKET = 'specs/system-spec-kit/002-dirty-packet';

// The command derives its repository from its own location and refuses roots
// outside it, so the sweep runs against a full copy of the skill inside a
// throwaway repository rather than this checkout.
let sandbox: string;
let copy: string;
let baselineHead: string;

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

// Cases may build packets for one run, but nothing needs to survive into the
// next one. Restoring the suite's own commit, an empty specs tree and an
// absent reversibility manifest keeps the order the cases run in from deciding
// what each of them sees.
function resetSandbox(): void {
  if (!fs.existsSync(sandbox)) return;
  if (fs.existsSync(path.join(sandbox, '.git'))) {
    execFileSync('git', ['-C', sandbox, 'reset', '--hard', baselineHead], { stdio: 'pipe' });
    clearUpgradeManifest();
  }
  // A hard reset leaves untracked files in place, and specs/ is hidden from
  // git by the machine's global excludes, so the paths a case can create are
  // removed by name.
  for (const relative of ['specs', 'docs', 'git-shim', 'specs-set-aside', '.opencode/specs']) {
    fs.rmSync(path.join(sandbox, relative), { recursive: true, force: true });
  }
  for (const relative of ['head-moved.txt', 'layout-map-link.mjs', 'outside-preview-target.md']) {
    fs.rmSync(path.join(sandbox, relative), { force: true });
  }
  fs.mkdirSync(path.join(sandbox, 'specs'), { recursive: true });
  // The build record for the copied dist is keyed by an absolute path, so the
  // copy is judged by mtimes. A reset can delete the record a check wrote, and
  // a source a case restored carries a fresh mtime, so the dist files are
  // re-stamped to keep the copy looking built from its own sources.
  refreshCopiedDistMtimes();
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

// The reversibility manifest exists for a dirty tree, so every case that reads
// one rebuilds the same state: both packets committed, then an edit in progress
// on the second, then an apply that has to record the before-images.
function prepareDirtyManifest(): void {
  writeLegacyPacket();
  commitChanges('committed legacy packet', [PACKET]);
  writeLegacyPacket(DIRTY_PACKET);
  commitChanges('committed second legacy packet', [DIRTY_PACKET]);
  const dirtySpec = path.join(sandbox, DIRTY_PACKET, 'spec.md');
  const dirtyPlan = path.join(sandbox, DIRTY_PACKET, 'plan.md');
  fs.appendFileSync(dirtySpec, '\nUncommitted legacy edit.\n');
  fs.appendFileSync(dirtyPlan, '\nUncommitted plan edit.\n');
  const applied = runUpgrade(['--apply', '--roots', 'specs/system-spec-kit']);
  expect(applied.status, applied.stdout + applied.stderr).toBe(0);
}

// The legacy shape plus a questions anchor whose opener sits above an earlier
// heading, the nested layout the anchor repair exists to fix.
function nestedQuestionsSpec(): string {
  return [
    '---',
    'title: "Legacy Packet"',
    'description: "A packet written before v4."',
    '---',
    '# Legacy Packet',
    '',
    'Old packet written before the v4 contract.',
    '',
    '<!-- ANCHOR:questions -->',
    '## L2: EDGE CASES',
    'Boundary notes.',
    '',
    '## 10. OPEN QUESTIONS',
    '- None open.',
    '<!-- /ANCHOR:questions -->',
    '',
  ].join('\n');
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
  baselineHead = execFileSync('git', ['-C', sandbox, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}, 180_000);

afterAll(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

// The tests share one sandbox on purpose: the copy of the skill and its
// repository are expensive to build, and each case resets that sandbox to the
// same clean baseline, so the order they run in does not decide what they see.
describe('upgrade-legacy', () => {
  afterEach(resetSandbox);

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
    writeLegacyPacket();
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
    writeLegacyPacket();
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
    writeLegacyPacket();
    const applied = runUpgrade(['--apply', '--roots', PACKET]);
    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
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
    const goalAuthored = '---\ntitle: "Authored Goal"\ndescription: "An authored goal."\n';
    const goalBody = '# Goal: Authored\n\nOne line of authored prose.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'goal.md'), `${goalAuthored}---\n${goalBody}`);
    const tasksAuthored = '---\ntitle: "Authored Tasks"\ndescription: "An authored task list."\nimportance_tier: "critical"\n';
    const tasksBody = '# Tasks\n\n- [ ] T001 Authored task\n';
    fs.writeFileSync(path.join(sandbox, folder, 'tasks.md'), `${tasksAuthored}---\n${tasksBody}`);
    // The addon docs arrive in different states: one with no block at all and
    // one whose block already carries an authored tier, so the fill has to
    // supply a whole block for the first and only the missing key for the second.
    const acceptanceBody = '# Acceptance Criteria\n\nLegacy criteria written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'acceptance-criteria.md'), acceptanceBody);
    const resourceAuthored = '---\ntitle: "Authored Resource Map"\ndescription: "An authored resource map."\nimportance_tier: "critical"\n';
    const resourceBody = '# Resource Map\n\nLegacy map written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'resource-map.md'), `${resourceAuthored}---\n${resourceBody}`);
    // The spec-doc classes below carry only title and description, so the fill
    // has to supply both managed value keys from each class's template.
    const summaryAuthored = '---\ntitle: "Authored Implementation Summary"\ndescription: "An authored implementation summary."\n';
    const summaryBody = '# Implementation Summary\n\nLegacy summary written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'implementation-summary.md'), `${summaryAuthored}---\n${summaryBody}`);
    const decisionAuthored = '---\ntitle: "Authored Decision Record"\ndescription: "An authored decision record."\n';
    const decisionBody = '# Decision Record\n\nLegacy decision written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'decision-record.md'), `${decisionAuthored}---\n${decisionBody}`);
    const researchAuthored = '---\ntitle: "Authored Research"\ndescription: "An authored investigation."\n';
    const researchBody = '# Research\n\nLegacy research written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'research.md'), `${researchAuthored}---\n${researchBody}`);
    const handoverAuthored = '---\ntitle: "Authored Handover"\ndescription: "An authored handover."\n';
    const handoverBody = '# Handover\n\nLegacy handover written before v4.\n';
    fs.writeFileSync(path.join(sandbox, folder, 'handover.md'), `${handoverAuthored}---\n${handoverBody}`);
    // A missing key takes the value its document class's template declares, so
    // the expectations are read from the copied templates; the literal checks
    // fail here first if a template's defaults change.
    const templateDefaults = (relative: string) => {
      const lines = fs.readFileSync(path.join(copy, 'templates', relative), 'utf8').replace(/\r/g, '').split('\n');
      const opening = lines.findIndex((line) => line.trim() === '---');
      const closing = lines.findIndex((line, index) => index > opening && line.trim() === '---');
      const frontmatter = lines.slice(opening + 1, closing);
      const value = (key: string): string => {
        const match = frontmatter.find((line) => line.trim().startsWith(`${key}:`))?.match(/:\s*"([^"]*)"/u);
        expect(match, `${relative} ${key}`).not.toBeNull();
        return match?.[1] ?? '';
      };
      return { importance_tier: value('importance_tier'), contextType: value('contextType') };
    };
    const specDefaults = templateDefaults('core/spec.md.tmpl');
    const planDefaults = templateDefaults('core/plan.md.tmpl');
    const tasksDefaults = templateDefaults('core/tasks.md.tmpl');
    const goalDefaults = templateDefaults('addons/goal.md.tmpl');
    const acceptanceDefaults = templateDefaults('addons/acceptance-criteria.md.tmpl');
    const resourceDefaults = templateDefaults('addons/resource-map.md.tmpl');
    const summaryDefaults = templateDefaults('core/implementation-summary.md.tmpl');
    const decisionDefaults = templateDefaults('addons/decision-record.md.tmpl');
    const researchDefaults = templateDefaults('addons/research.md.tmpl');
    const handoverDefaults = templateDefaults('addons/handover.md.tmpl');
    expect(specDefaults.importance_tier).toBe('normal');
    expect(specDefaults.contextType).toBe('general');
    expect(planDefaults.importance_tier).toBe('normal');
    expect(planDefaults.contextType).toBe('general');
    expect(tasksDefaults.contextType).toBe('general');
    expect(goalDefaults.importance_tier).toBe('important');
    expect(goalDefaults.contextType).toBe('planning');
    expect(acceptanceDefaults.importance_tier).toBe('important');
    expect(acceptanceDefaults.contextType).toBe('implementation');
    expect(resourceDefaults.contextType).toBe('general');
    expect(summaryDefaults.importance_tier).toBe('normal');
    expect(summaryDefaults.contextType).toBe('general');
    // The fill follows each class's template literal even where the
    // document-class tables disagree with it: implementation-summary and
    // research differ on the context type, the decision record on both values.
    expect(decisionDefaults.importance_tier).toBe('normal');
    expect(decisionDefaults.contextType).toBe('general');
    expect(researchDefaults.importance_tier).toBe('normal');
    expect(researchDefaults.contextType).toBe('general');
    expect(handoverDefaults.importance_tier).toBe('normal');
    expect(handoverDefaults.contextType).toBe('general');
    const result = runUpgrade(['--apply', '--roots', 'specs/fm-track']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    const spec = fs.readFileSync(path.join(sandbox, folder, 'spec.md'), 'utf8');
    expect(spec.startsWith(authored), spec).toBe(true);
    expect(spec, spec).toContain('importance_tier:');
    expect(spec, spec).toContain(`importance_tier: "${specDefaults.importance_tier}"`);
    expect(spec, spec).toContain(`contextType: "${specDefaults.contextType}"`);
    expect(spec.endsWith(body), spec).toBe(true);
    const plan = fs.readFileSync(path.join(sandbox, folder, 'plan.md'), 'utf8');
    expect(plan.startsWith('---\ntitle: '), plan).toBe(true);
    expect(plan, plan).toContain(`importance_tier: "${planDefaults.importance_tier}"`);
    expect(plan, plan).toContain(`contextType: "${planDefaults.contextType}"`);
    const goal = fs.readFileSync(path.join(sandbox, folder, 'goal.md'), 'utf8');
    expect(goal.startsWith(goalAuthored), goal).toBe(true);
    expect(goal, goal).toContain(`importance_tier: "${goalDefaults.importance_tier}"`);
    expect(goal, goal).toContain(`contextType: "${goalDefaults.contextType}"`);
    const tasks = fs.readFileSync(path.join(sandbox, folder, 'tasks.md'), 'utf8');
    // "critical" is a canonical tier, so the authored value survives the fill as written.
    expect(tasks.match(/importance_tier: "critical"/gu)?.length, tasks).toBe(1);
    expect(tasks, tasks).toContain(`contextType: "${tasksDefaults.contextType}"`);
    const acceptance = fs.readFileSync(path.join(sandbox, folder, 'acceptance-criteria.md'), 'utf8');
    expect(acceptance.startsWith('---\ntitle: '), acceptance).toBe(true);
    expect(acceptance, acceptance).toContain(`importance_tier: "${acceptanceDefaults.importance_tier}"`);
    expect(acceptance, acceptance).toContain(`contextType: "${acceptanceDefaults.contextType}"`);
    expect(acceptance.endsWith(acceptanceBody), acceptance).toBe(true);
    const resourceMap = fs.readFileSync(path.join(sandbox, folder, 'resource-map.md'), 'utf8');
    expect(resourceMap.startsWith(resourceAuthored), resourceMap).toBe(true);
    // The authored tier is present, so the fill leaves it alone and supplies
    // only the key the block lacks.
    expect(resourceMap.match(/importance_tier: "critical"/gu)?.length, resourceMap).toBe(1);
    expect(resourceMap, resourceMap).toContain(`contextType: "${resourceDefaults.contextType}"`);
    expect(resourceMap.endsWith(resourceBody), resourceMap).toBe(true);
    const summary = fs.readFileSync(path.join(sandbox, folder, 'implementation-summary.md'), 'utf8');
    expect(summary.startsWith(summaryAuthored), summary).toBe(true);
    expect(summary, summary).toContain(`importance_tier: "${summaryDefaults.importance_tier}"`);
    expect(summary, summary).toContain(`contextType: "${summaryDefaults.contextType}"`);
    expect(summary.endsWith(summaryBody), summary).toBe(true);
    const decision = fs.readFileSync(path.join(sandbox, folder, 'decision-record.md'), 'utf8');
    expect(decision.startsWith(decisionAuthored), decision).toBe(true);
    expect(decision, decision).toContain(`importance_tier: "${decisionDefaults.importance_tier}"`);
    expect(decision, decision).toContain(`contextType: "${decisionDefaults.contextType}"`);
    expect(decision.endsWith(decisionBody), decision).toBe(true);
    const research = fs.readFileSync(path.join(sandbox, folder, 'research.md'), 'utf8');
    expect(research.startsWith(researchAuthored), research).toBe(true);
    expect(research, research).toContain(`importance_tier: "${researchDefaults.importance_tier}"`);
    expect(research, research).toContain(`contextType: "${researchDefaults.contextType}"`);
    expect(research.endsWith(researchBody), research).toBe(true);
    const handover = fs.readFileSync(path.join(sandbox, folder, 'handover.md'), 'utf8');
    expect(handover.startsWith(handoverAuthored), handover).toBe(true);
    expect(handover, handover).toContain(`importance_tier: "${handoverDefaults.importance_tier}"`);
    expect(handover, handover).toContain(`contextType: "${handoverDefaults.contextType}"`);
    expect(handover.endsWith(handoverBody), handover).toBe(true);
  }, 180_000);

  // A template the fill cannot read must not fail the run and must leave the
  // document-class defaults in charge of the missing keys. Each fresh run
  // starts with an empty literal cache, and the defaults pinned here disagree
  // with the hidden template, so a cached read could not satisfy this case.
  it('fills from the class defaults when a template cannot be read', () => {
    clearUpgradeManifest();
    const folder = 'specs/fm-fallback/001-unreadable-template';
    const packetFolder = path.join(sandbox, folder);
    try {
      writeLegacyPacket(folder);
      const authored = '---\ntitle: "Authored Decision Record"\ndescription: "An authored decision record."\n';
      const body = '# Decision Record\n\nLegacy decision written before v4.\n';
      fs.writeFileSync(path.join(sandbox, folder, 'decision-record.md'), `${authored}---\n${body}`);

      // The template is renamed rather than deleted, so the copy is restored
      // even if the run throws.
      const template = path.join(copy, 'templates/addons/decision-record.md.tmpl');
      const hidden = `${template}.hidden`;
      fs.renameSync(template, hidden);
      const applied = (() => {
        try {
          return runUpgrade(['--apply', '--roots', 'specs/fm-fallback']);
        } finally {
          fs.renameSync(hidden, template);
        }
      })();
      expect(applied.status, applied.stdout + applied.stderr).toBe(0);

      const decision = fs.readFileSync(path.join(sandbox, folder, 'decision-record.md'), 'utf8');
      expect(decision.startsWith(authored), decision).toBe(true);
      expect(decision, decision).toContain('importance_tier: "important"');
      expect(decision, decision).toContain('contextType: "planning"');
      expect(decision.endsWith(body), decision).toBe(true);
    } finally {
      // The packet is removed because it was repaired while its template was
      // hidden, so a later whole-tree run would still find work in it.
      fs.rmSync(packetFolder, { recursive: true, force: true });
      clearUpgradeManifest();
    }
  }, 180_000);

  it('groups each failing packet\'s errors by rule with a detail count', () => {
    clearUpgradeManifest();
    const folder = 'specs/grouped-track/001-two-links';
    writeLegacyPacket(folder);
    fs.appendFileSync(
      path.join(sandbox, folder, 'spec.md'),
      '\nSee [a](./grouped-missing-a.md).\nSee [b](./grouped-missing-b.md).\n',
    );

    // The headings are rebuilt from the validator's own report, so a rule
    // rename or a changed detail count flows through instead of failing here.
    const report = JSON.parse(validateJson(folder).stdout) as {
      entries: { rule: string; status: string; details: string[] }[];
    };
    const detailsByRule = new Map<string, number>();
    for (const entry of report.entries) {
      if (entry.status !== 'error') continue;
      const count = entry.details.length > 0 ? entry.details.length : 1;
      detailsByRule.set(entry.rule, (detailsByRule.get(entry.rule) ?? 0) + count);
    }
    expect(detailsByRule.size, JSON.stringify(report.entries)).toBeGreaterThan(0);
    const headings = [...detailsByRule.keys()]
      .sort()
      .map((rule) => `### ${folder} / x ${rule} (${detailsByRule.get(rule)})`);

    const dryRun = runUpgrade(['--roots', 'specs/grouped-track']);
    const applied = runUpgrade(['--apply', '--roots', 'specs/grouped-track']);
    try {
      const dryOutput = dryRun.stdout + dryRun.stderr;
      expect(dryRun.status, dryOutput).toBe(1);
      const groupedAt = dryRun.stdout.indexOf('grouped detail:');
      const downgradesAt = dryRun.stdout.indexOf('\nDowngrades:\n');
      expect(groupedAt, dryOutput).toBeGreaterThanOrEqual(0);
      expect(downgradesAt, dryOutput).toBeGreaterThan(groupedAt);
      const groupedSection = dryRun.stdout.slice(groupedAt, downgradesAt);

      const positions = headings.map((heading) => {
        const first = groupedSection.indexOf(heading);
        expect(first, dryOutput).toBeGreaterThanOrEqual(0);
        expect(groupedSection.lastIndexOf(heading), dryOutput).toBe(first);
        return first;
      });
      expect(positions, dryOutput).toEqual([...positions].sort((a, b) => a - b));

      // A heading owns the detail lines that follow it, so both missing links
      // must land under one rule rather than merely somewhere in the output.
      const blocks: string[][] = [];
      for (const line of groupedSection.split('\n')) {
        if (line.startsWith('### ')) blocks.push([]);
        else if (blocks.length > 0) blocks[blocks.length - 1].push(line);
      }
      expect(blocks.length, dryOutput).toBe(headings.length);
      expect(blocks.some((block) => block.some((line) => line.includes('grouped-missing-a.md'))
        && block.some((line) => line.includes('grouped-missing-b.md'))), dryOutput).toBe(true);

      // The grouped lines sit before the Downgrades section, so its row parser
      // must never mistake one of them for a downgraded finding.
      expect(downgradeRows(dryRun.stdout).some((line) => line.startsWith('###') || line.startsWith('- ')), dryOutput).toBe(false);

      const applyOutput = applied.stdout + applied.stderr;
      expect(applied.status, applyOutput).toBe(0);
      expect(applied.stdout.slice(applied.stdout.lastIndexOf('grouped detail:')), applyOutput)
        .toBe('grouped detail:\n  none\n');
    } finally {
      fs.rmSync(path.join(sandbox, 'specs/grouped-track'), { recursive: true, force: true });
      clearUpgradeManifest();
    }
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
    writeLegacyPacket('specs/nest-track/001-parent');
    writeLegacyPacket('specs/nest-track/001-parent/001-child');
    const settled = runUpgrade(['--apply', '--roots', 'specs/nest-track']);
    expect(settled.status, settled.stdout + settled.stderr).toBe(0);
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
  // written. Its prose is history and stays as written; the questions opener is
  // a marker line, so moving it above its heading un-nests the anchor without
  // changing a word of the prose.
  it('un-nests only the questions anchor in an archived packet and leaves every prose line as written', () => {
    clearUpgradeManifest();
    const folder = path.join(sandbox, 'specs/z_archive/001-frozen');
    writeLegacyPacket('specs/z_archive/001-frozen');
    fs.writeFileSync(path.join(folder, 'spec.md'), [
      '---',
      'title: "Legacy Packet"',
      'description: "A packet written before v4."',
      '---',
      '# Legacy Packet',
      '',
      'Old packet written before the v4 contract.',
      '',
      '<!-- ANCHOR:notes -->',
      'First notes paragraph.',
      '<!-- /ANCHOR:notes -->',
      '',
      '<!-- ANCHOR:notes -->',
      'Second notes paragraph.',
      '<!-- /ANCHOR:notes -->',
      '',
      '<!-- ANCHOR:questions -->',
      '## L2: EDGE CASES',
      'Boundary notes.',
      '',
      '## 10. OPEN QUESTIONS',
      '- None open.',
      '<!-- /ANCHOR:questions -->',
      '',
    ].join('\n'));

    const markerLine = /^\s*<!--\s*\/?ANCHOR:[a-z0-9-]+\s*-->\s*$/;
    const markerLines = (text: string) => text.split('\n').filter((line) => markerLine.test(line)).sort();
    const proseLines = (text: string) => text.split('\n').filter((line) => !markerLine.test(line));
    const before = fs.readFileSync(path.join(folder, 'spec.md'), 'utf8');
    const names = fs.readdirSync(folder).filter((name) => name.endsWith('.md')).sort();
    const others = Object.fromEntries(fs.readdirSync(folder).filter((name) => name.endsWith('.md') && name !== 'spec.md').map((name) => [name, fs.readFileSync(path.join(folder, name), 'utf8')]));

    const result = runUpgrade(['--apply', '--include-archive', '--roots', 'specs/z_archive']);
    expect(result.status, result.stdout + result.stderr).toBe(0);
    expect(result.stdout).toContain('step anchor-unnest (archived): ok');
    expect(result.stdout).toContain('step repair-derived (archived): ok');

    const after = fs.readFileSync(path.join(folder, 'spec.md'), 'utf8');
    expect(after, after).not.toBe(before);
    const afterLines = after.split('\n');
    const heading = afterLines.indexOf('## 10. OPEN QUESTIONS');
    expect(heading, after).toBeGreaterThan(0);
    expect(afterLines[heading - 1]).toBe('<!-- ANCHOR:questions -->');
    expect(proseLines(after)).toEqual(proseLines(before));
    expect(markerLines(after)).toEqual(markerLines(before));
    expect(after.match(/<!-- ANCHOR:notes -->/g)?.length, after).toBe(2);
    expect(after.includes('notes-2'), after).toBe(false);

    expect(fs.readdirSync(folder).filter((name) => name.endsWith('.md')).sort()).toEqual(names);
    for (const [name, content] of Object.entries(others)) {
      expect(fs.readFileSync(path.join(folder, name), 'utf8'), name).toBe(content);
    }

    const check = validate('specs/z_archive/001-frozen');
    expect(check.stdout, check.stdout + check.stderr).toContain('RESULT: PASSED');
  }, 180_000);

  // openSync's mode argument is masked by the umask, so the archived un-nesting
  // has to re-apply the document's own bits; without that a restrictive umask
  // silently strips them from a file the run only meant to un-nest.
  it('keeps an archived document mode under a restrictive umask', () => {
    clearUpgradeManifest();
    writeLegacyPacket('specs/z_archive/002-mode');
    const specFile = path.join(sandbox, 'specs/z_archive/002-mode/spec.md');
    fs.writeFileSync(specFile, nestedQuestionsSpec());
    fs.chmodSync(specFile, 0o664);

    const previousUmask = process.umask(0o077);
    try {
      const result = runUpgrade(['--apply', '--include-archive', '--roots', 'specs/z_archive']);
      expect(result.status, result.stdout + result.stderr).toBe(0);
      expect(result.stdout).toContain('step anchor-unnest (archived): ok');
    } finally {
      process.umask(previousUmask);
    }

    // The mode only proves anything if the write path ran, so the moved opener
    // is asserted beside it.
    const lines = fs.readFileSync(specFile, 'utf8').split('\n');
    const heading = lines.indexOf('## 10. OPEN QUESTIONS');
    expect(heading, lines.join('\n')).toBeGreaterThan(0);
    expect(lines[heading - 1]).toBe('<!-- ANCHOR:questions -->');
    expect(fs.statSync(specFile).mode & 0o777).toBe(0o664);
  }, 180_000);

  it('repairs a nested questions anchor on apply and shows it on the dry run', () => {
    clearUpgradeManifest();
    const folder = 'specs/anchor-track/001-nested';
    writeLegacyPacket(folder);
    // A fresh specs/ tree is hidden by the machine's global excludes, so the
    // packet is force-committed first and the overwrite below is then a
    // visible dirty edit the run can capture a before-image for.
    commitChanges('committed nested questions packet', [folder]);
    const specFile = path.join(sandbox, folder, 'spec.md');
    fs.writeFileSync(specFile, nestedQuestionsSpec());
    const nested = fs.readFileSync(specFile);
    const before = manifest('specs/anchor-track');

    const dryRun = runUpgrade(['--roots', 'specs/anchor-track']);
    expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(1);
    expect(dryRun.stdout, dryRun.stdout + dryRun.stderr).toContain(`would repair ${folder}/spec.md: moved questions opener`);
    expect(manifest('specs/anchor-track')).toBe(before);

    const applied = runUpgrade(['--apply', '--roots', 'specs/anchor-track']);
    expect(applied.status, applied.stdout + applied.stderr).toBe(0);
    expect(applied.stdout, applied.stdout + applied.stderr).toContain('step anchor-repair: ok');

    const lines = fs.readFileSync(specFile, 'utf8').split('\n');
    const heading = lines.indexOf('## 10. OPEN QUESTIONS');
    expect(heading, lines.join('\n')).toBeGreaterThan(0);
    expect(lines[heading - 1]).toBe('<!-- ANCHOR:questions -->');

    const body = JSON.parse(fs.readFileSync(upgradeManifestPath(), 'utf8'));
    const image = body.beforeImages.find((entry: { path: string }) => entry.path === `${folder}/spec.md`);
    expect(image, JSON.stringify(body.beforeImages)).toBeDefined();
    expect(Buffer.from(image.beforeImage.content, 'base64')).toEqual(nested);
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
        beforeImage: expect.objectContaining({ kind: 'file-bytes', encoding: 'base64' }),
      }),
    ]));
    const specImage = body.beforeImages.find((image: { path: string }) => image.path === `${DIRTY_PACKET}/spec.md`);
    expect(Buffer.from(specImage.beforeImage.content, 'base64')).toEqual(originalSpec);
    const planImage = body.beforeImages.find((image: { path: string }) => image.path === `${DIRTY_PACKET}/plan.md`);
    expect(Buffer.from(planImage.beforeImage.content, 'base64')).toEqual(originalPlan);
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
    const planSourceLine = '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->';
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

// ───────────────────────────────────────────────────────────────────
// planLayoutMove
// ───────────────────────────────────────────────────────────────────

// Each case builds its own root instead of reusing the shared sandbox: the map
// and the steps it prints act on whichever repository holds them, and the
// sandbox above already carries the state its own sweep tests left behind.
function makeLayoutRoot(): string {
  return fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'layout-map-')));
}

function runLayoutSteps(root: string, steps: Array<{ id: string; argv: string[] }>): void {
  for (const step of steps) {
    const result = spawnSync(step.argv[0], step.argv.slice(1), { cwd: root, encoding: 'utf8' });
    expect(result.status, `${step.id}: ${result.stdout}${result.stderr}`).toBe(0);
  }
}

// The machine's global excludes can hide a fresh spec root, and git mv only
// moves what the index knows, so the add runs with the excludes file off.
function initLayoutRepo(root: string): void {
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['-c', 'core.excludesFile=/dev/null', 'add', '-A'], { cwd: root });
}

function fileContentDigests(root: string, relative: string): string[] {
  const digests: string[] = [];
  const walk = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === '.DS_Store') continue;
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) walk(abs);
      else if (item.isFile()) digests.push(crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'));
    }
  };
  walk(path.join(root, relative));
  return digests.sort();
}

function treeFingerprint(root: string): string {
  const entries: string[] = [];
  const walk = (dir: string, rel: string): void => {
    for (const name of fs.readdirSync(dir).sort()) {
      const abs = path.join(dir, name);
      const childRel = `${rel}/${name}`;
      const stat = fs.lstatSync(abs);
      if (stat.isSymbolicLink()) {
        entries.push(`${childRel}->${fs.readlinkSync(abs)}`);
      } else if (stat.isDirectory()) {
        entries.push(`${childRel}/`);
        walk(abs, childRel);
      } else {
        entries.push(`${childRel} ${crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex')}`);
      }
    }
  };
  walk(root, '');
  return crypto.createHash('sha256').update(entries.join('\n')).digest('hex');
}

describe('planLayoutMove', () => {
  it('reports none without roots and v4 with a current root', () => {
    const empty = makeLayoutRoot();
    try {
      expect(planLayoutMove(empty)).toEqual({
        state: 'none', moves: [], alreadyMoved: [], collisions: [], steps: [],
      });
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }

    const current = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(current, 'specs/track/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(current, 'specs/track/001-packet/spec.md'), '---\ntitle: "Packet"\n---\n');
      expect(planLayoutMove(current)).toEqual({
        state: 'v4', moves: [], alreadyMoved: [], collisions: [], steps: [],
      });

      fs.mkdirSync(path.join(current, '.opencode'));
      fs.symlinkSync('../specs', path.join(current, '.opencode/specs'));
      expect(planLayoutMove(current)).toEqual({
        state: 'v4', moves: [], alreadyMoved: [], collisions: [], steps: [],
      });
    } finally {
      fs.rmSync(current, { recursive: true, force: true });
    }
  }, 60_000);

  it('plans the v3 move with and without the specs symlink, and the steps leave v4', () => {
    const plain = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(plain, '.opencode/specs/track/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(plain, '.opencode/specs/track/001-packet/spec.md'), '---\ntitle: "Packet"\n---\n');
      initLayoutRepo(plain);
      const plan = planLayoutMove(plain);
      expect(plan.state).toBe('v3');
      expect(plan.moves).toEqual([{ from: '.opencode/specs', to: 'specs' }]);
      expect(plan.alreadyMoved).toEqual([]);
      expect(plan.collisions).toEqual([]);
      expect(plan.steps).toEqual([
        { id: 'move-tree', argv: ['git', 'mv', '.opencode/specs', 'specs'] },
        { id: 'link-legacy-path', argv: ['ln', '-s', '../specs', '.opencode/specs'] },
      ]);
      runLayoutSteps(plain, plan.steps);
      expect(planLayoutMove(plain).state).toBe('v4');
      expect(fs.readlinkSync(path.join(plain, '.opencode/specs'))).toBe('../specs');
    } finally {
      fs.rmSync(plain, { recursive: true, force: true });
    }

    const linked = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(linked, '.opencode/specs/track/001-packet'), { recursive: true });
      fs.writeFileSync(path.join(linked, '.opencode/specs/track/001-packet/spec.md'), '---\ntitle: "Packet"\n---\n');
      fs.symlinkSync('.opencode/specs', path.join(linked, 'specs'));
      initLayoutRepo(linked);
      const plan = planLayoutMove(linked);
      expect(plan.state).toBe('v3');
      expect(plan.steps).toEqual([
        { id: 'remove-specs-link', argv: ['rm', '-f', 'specs'] },
        { id: 'move-tree', argv: ['git', 'mv', '.opencode/specs', 'specs'] },
        { id: 'link-legacy-path', argv: ['ln', '-s', '../specs', '.opencode/specs'] },
      ]);
      runLayoutSteps(linked, plan.steps);
      expect(planLayoutMove(linked).state).toBe('v4');
      expect(fs.readlinkSync(path.join(linked, '.opencode/specs'))).toBe('../specs');
    } finally {
      fs.rmSync(linked, { recursive: true, force: true });
    }
  }, 120_000);

  it('moves a partial tree without collisions, keeps every file digest and skips finder metadata', () => {
    const root = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(root, '.opencode/specs/legacy-track/001-old'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/current-track/002-new'), { recursive: true });
      fs.writeFileSync(path.join(root, '.opencode/specs/legacy-track/001-old/spec.md'), 'legacy spec\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/legacy-track/001-old/plan.md'), 'legacy plan\n');
      fs.writeFileSync(path.join(root, 'specs/current-track/002-new/spec.md'), 'current spec\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/.DS_Store'), 'legacy root metadata\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/legacy-track/.DS_Store'), 'legacy track metadata\n');
      fs.writeFileSync(path.join(root, 'specs/.DS_Store'), 'current root metadata\n');
      fs.writeFileSync(path.join(root, 'specs/current-track/.DS_Store'), 'current track metadata\n');
      expect(fs.existsSync(path.join(root, '.opencode/specs/.DS_Store'))).toBe(true);
      expect(fs.existsSync(path.join(root, 'specs/.DS_Store'))).toBe(true);

      const before = [...fileContentDigests(root, '.opencode/specs'), ...fileContentDigests(root, 'specs')].sort();
      const plan = planLayoutMove(root);
      expect(plan.state).toBe('partial');
      expect(plan.moves).toEqual([{ from: '.opencode/specs/legacy-track', to: 'specs/legacy-track' }]);
      expect(plan.alreadyMoved).toEqual(['specs/current-track']);
      expect(plan.collisions).toEqual([]);
      expect(plan.steps.map((step) => step.id)).toEqual([
        'move-1', 'remove-finder-metadata', 'remove-empty-legacy-dirs', 'remove-legacy-root', 'link-legacy-path',
      ]);

      runLayoutSteps(root, plan.steps);
      expect(planLayoutMove(root).state).toBe('v4');
      expect(fs.readlinkSync(path.join(root, '.opencode/specs'))).toBe('../specs');
      expect(fileContentDigests(root, 'specs')).toEqual(before);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('lists one collision per reason with from and to, and plans no steps', () => {
    const root = makeLayoutRoot();
    try {
      // The same packet name sits at track depth and at packet depth, so the
      // walk has to recurse to find what collides at each level.
      fs.mkdirSync(path.join(root, '.opencode/specs/Other-Track'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/other-track'), { recursive: true });
      fs.mkdirSync(path.join(root, '.opencode/specs/case-track/Demo-Packet'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/case-track/demo-packet'), { recursive: true });
      fs.mkdirSync(path.join(root, '.opencode/specs/mix-track/001-packet/001-child'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/mix-track/001-packet/001-child'), { recursive: true });
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/spec.md'), 'legacy spec\n');
      fs.writeFileSync(path.join(root, 'specs/mix-track/001-packet/spec.md'), 'current spec\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/001-child/spec.md'), 'legacy child\n');
      fs.writeFileSync(path.join(root, 'specs/mix-track/001-packet/001-child/spec.md'), 'current child\n');
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/plan.md'), 'legacy plan\n');
      fs.mkdirSync(path.join(root, 'specs/mix-track/001-packet/plan.md'));
      fs.writeFileSync(path.join(root, '.opencode/specs/mix-track/001-packet/notes.md'), 'legacy notes\n');
      fs.writeFileSync(path.join(root, 'specs/mix-track/001-packet/README.md'), 'current readme\n');

      const plan = planLayoutMove(root);
      expect(plan.state).toBe('partial');
      expect(plan.moves).toEqual([
        { from: '.opencode/specs/mix-track/001-packet/notes.md', to: 'specs/mix-track/001-packet/notes.md' },
      ]);
      expect(plan.alreadyMoved).toEqual(['specs/mix-track/001-packet/README.md']);
      expect(plan.collisions).toEqual([
        { from: '.opencode/specs/Other-Track', to: 'specs/other-track', reason: 'case-only-difference' },
        { from: '.opencode/specs/case-track/Demo-Packet', to: 'specs/case-track/demo-packet', reason: 'case-only-difference' },
        { from: '.opencode/specs/mix-track/001-packet/001-child/spec.md', to: 'specs/mix-track/001-packet/001-child/spec.md', reason: 'exists-in-both' },
        { from: '.opencode/specs/mix-track/001-packet/plan.md', to: 'specs/mix-track/001-packet/plan.md', reason: 'type-mismatch' },
        { from: '.opencode/specs/mix-track/001-packet/spec.md', to: 'specs/mix-track/001-packet/spec.md', reason: 'exists-in-both' },
      ]);
      expect(plan.steps).toEqual([]);
      for (const collision of plan.collisions) {
        expect(collision.from, JSON.stringify(collision)).toBeTruthy();
        expect(collision.to, JSON.stringify(collision)).toBeTruthy();
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }

    const elsewhere = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(elsewhere, 'specs/track'), { recursive: true });
      fs.mkdirSync(path.join(elsewhere, 'elsewhere'));
      fs.mkdirSync(path.join(elsewhere, '.opencode'));
      fs.symlinkSync('../elsewhere', path.join(elsewhere, '.opencode/specs'));
      expect(planLayoutMove(elsewhere)).toEqual({
        state: 'partial',
        moves: [],
        alreadyMoved: [],
        collisions: [{ from: '.opencode/specs', to: 'specs', reason: 'unexpected-symlink' }],
        steps: [],
      });
    } finally {
      fs.rmSync(elsewhere, { recursive: true, force: true });
    }

    const notADirectory = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(notADirectory, '.opencode/specs/track'), { recursive: true });
      fs.writeFileSync(path.join(notADirectory, 'specs'), 'not a directory\n');
      expect(planLayoutMove(notADirectory)).toEqual({
        state: 'partial',
        moves: [],
        alreadyMoved: [],
        collisions: [{ from: '.opencode/specs', to: 'specs', reason: 'type-mismatch' }],
        steps: [],
      });
    } finally {
      fs.rmSync(notADirectory, { recursive: true, force: true });
    }
  }, 60_000);

  it('writes nothing while it plans', () => {
    const root = makeLayoutRoot();
    try {
      fs.mkdirSync(path.join(root, '.opencode/specs/track/001-packet'), { recursive: true });
      fs.mkdirSync(path.join(root, 'specs/track/002-packet'), { recursive: true });
      fs.writeFileSync(path.join(root, '.opencode/specs/track/001-packet/spec.md'), 'legacy spec\n');
      fs.writeFileSync(path.join(root, 'specs/track/002-packet/spec.md'), 'current spec\n');
      const before = treeFingerprint(root);
      planLayoutMove(root);
      expect(treeFingerprint(root)).toBe(before);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }, 60_000);

  it('serves --layout-map over the CLI and stays quiet when imported', () => {
    const mapped = runUpgrade(['--layout-map']);
    expect([0, 1]).toContain(mapped.status);
    const layout = JSON.parse(mapped.stdout);
    expect(['v3', 'partial', 'v4', 'none']).toContain(layout.state);
    expect(Array.isArray(layout.steps)).toBe(true);

    const rejected = runUpgrade(['--layout-map', '--apply']);
    expect(rejected.status, rejected.stdout + rejected.stderr).toBe(2);

    const link = path.join(sandbox, 'layout-map-link.mjs');
    fs.symlinkSync(path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs'), link);
    try {
      const throughLink = spawnSync(process.execPath, [link, '--layout-map'], { cwd: sandbox, encoding: 'utf8' });
      expect([0, 1]).toContain(throughLink.status);
      const linkedLayout = JSON.parse(throughLink.stdout);
      expect(['v3', 'partial', 'v4', 'none']).toContain(linkedLayout.state);
    } finally {
      fs.rmSync(link, { force: true });
    }

    const script = path.join(copy, 'runtime/cli/spec/upgrade-legacy.mjs');
    const probe = `import(${JSON.stringify(script)}).then((module) => console.log(typeof module.planLayoutMove))`;
    const imported = spawnSync(process.execPath, ['--input-type=module', '-e', probe], { cwd: sandbox, encoding: 'utf8' });
    expect(imported.status, imported.stdout + imported.stderr).toBe(0);
    expect(imported.stdout.trim()).toBe('function');
  }, 180_000);
});
