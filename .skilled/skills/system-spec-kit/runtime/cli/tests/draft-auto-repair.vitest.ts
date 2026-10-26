// ───────────────────────────────────────────────────────────────────
// MODULE: Draft Auto-Repair Test
// ───────────────────────────────────────────────────────────────────

// Proves the validate CLI repairs derived metadata on its own only while a
// packet is a Draft whose every error is derived, and that every other path
// leaves the packet byte for byte as it was.
//
// The refusal cases matter more than the repair case. A validator that writes
// is a check whose subject can change under it, so each refusal is asserted on
// the packet's file hashes rather than on the tool's account of what it did.
// The runs go through validate.sh, which uses the compiled orchestrator, so this
// file needs a runtime build that holds the current source.

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  draftAutoRepairRefusal,
  validateFolder,
  type ValidationReport,
} from '../../lib/validation/orchestrator.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const TOOL_TREE = path.resolve(here, '../../../../../..');
const SPEC_KIT = '.skilled/skills/system-spec-kit/runtime/cli/spec';
const VALIDATE = `${SPEC_KIT}/validate.sh`;
const CREATE = `${SPEC_KIT}/create.sh`;
const REPAIR = `${SPEC_KIT}/repair-derived.cjs`;
const PACKET_REL = 'specs/staging/001-draft-auto-repair-probe';
const PARENT_REL = 'specs/staging/002-draft-auto-repair-parent';
const DERIVED_RULES = new Set([
  'DESCRIPTION_SHAPE',
  'GENERATED_METADATA_INTEGRITY',
  'GENERATED_METADATA_DRIFT',
  'GRAPH_METADATA_SHAPE',
  'METADATA_DISK_PATH_CONSISTENCY',
]);
const RUN_TIMEOUT_MS = 120_000;

// The repair tool works from its working directory and refuses a target outside
// <root>/specs, so every run happens in a throwaway root that links the checked-in
// tool tree. The graph writer needs the `.opencode` anchor to accept a packet, and
// create.sh scaffolds only inside a git repository.
let ROOT = '';
let PACKET = '';
let SCRATCH = '';
let BASE = '';
let COUNT_PRELOAD = '';
let FAIL_PRELOAD = '';
let COUNT_LOG = '';

type RunResult = { status: number; stdout: string; stderr: string };

function cleanEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  delete env.CI;
  delete env.SPECKIT_DRAFT_AUTO_REPAIR;
  delete env.SPECKIT_SKIP_VALIDATION;
  return env;
}

function runTool(command: string, args: string[], env: NodeJS.ProcessEnv): RunResult {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    env,
    maxBuffer: 64 * 1024 * 1024,
    timeout: RUN_TIMEOUT_MS,
  });
  return { status: result.status ?? -1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

// Every node process the run starts loads the counting preload, so the log holds
// one line per start of the repair tool, whichever process started it. The
// failing preload acts only when a case asks for a repair that does not finish.
function validate(args: string[], overrides: Record<string, string> = {}, target = PACKET_REL): RunResult {
  const env = cleanEnv();
  env.NODE_OPTIONS = [process.env.NODE_OPTIONS, `--require ${COUNT_PRELOAD}`, `--require ${FAIL_PRELOAD}`]
    .filter(Boolean)
    .join(' ');
  env.DRAFT_AUTO_REPAIR_COUNT_LOG = COUNT_LOG;
  Object.assign(env, overrides);
  return runTool('bash', [VALIDATE, target, '--strict', ...args], env);
}

function repairStarts(): number {
  if (!fs.existsSync(COUNT_LOG)) return 0;
  return fs.readFileSync(COUNT_LOG, 'utf8').split('\n').filter(Boolean).length;
}

function hashTree(root: string): Record<string, string> {
  const hashes: Record<string, string> = {};
  const walk = (dir: string): void => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else hashes[path.relative(root, file)] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  };
  walk(root);
  return hashes;
}

function hashPacket(): Record<string, string> {
  return hashTree(PACKET);
}

// Every file under the spec root except the packet's own, so a repair that
// writes beside or above the packet it validates shows up as a changed hash.
function hashOutsidePacket(): Record<string, string> {
  const specs = path.join(ROOT, 'specs');
  const packetRel = path.relative(specs, PACKET);
  return Object.fromEntries(Object.entries(hashTree(specs))
    .filter(([file]) => file !== packetRel && !file.startsWith(`${packetRel}${path.sep}`)));
}

function setDescription(folder: string, value: string): void {
  const spec = path.join(folder, 'spec.md');
  const text = fs.readFileSync(spec, 'utf8');
  const edited = text.replace(/^description: .*$/mu, `description: "${value}"`);
  expect(edited).not.toBe(text);
  fs.writeFileSync(spec, edited);
}

// An author edits the summary after the metadata was generated, so the graph
// metadata no longer matches its source. Nothing else is wrong.
function makeGraphStale(folder = PACKET): void {
  setDescription(folder, 'A summary the author changed after the metadata was generated.');
}

function setStatus(value: string, folder = PACKET): void {
  const spec = path.join(folder, 'spec.md');
  const text = fs.readFileSync(spec, 'utf8');
  const edited = text.replace(/^\| \*\*Status\*\* \| Draft \|$/mu, `| **Status** | ${value} |`);
  expect(edited).not.toBe(text);
  fs.writeFileSync(spec, edited);
}

function errorRules(report: ValidationReport): string[] {
  return report.entries.filter((item) => item.status === 'error').map((item) => item.rule);
}

function ruleStatuses(report: ValidationReport): string[] {
  return report.entries.map((item) => `${item.rule}=${item.status}`);
}

beforeAll(() => {
  ROOT = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'draft-auto-repair-')));
  SCRATCH = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'draft-auto-repair-scratch-')));
  PACKET = path.join(ROOT, PACKET_REL);
  BASE = path.join(SCRATCH, 'base-packet');
  COUNT_LOG = path.join(SCRATCH, 'repair-starts.log');
  COUNT_PRELOAD = path.join(SCRATCH, 'count-repair-starts.cjs');
  fs.writeFileSync(COUNT_PRELOAD, [
    "const fs = require('node:fs');",
    "const script = process.argv[1] || '';",
    "if (script.endsWith('repair-derived.cjs') && process.env.DRAFT_AUTO_REPAIR_COUNT_LOG) {",
    "  fs.appendFileSync(process.env.DRAFT_AUTO_REPAIR_COUNT_LOG, `${process.pid}\\n`);",
    '}',
    '',
  ].join('\n'));
  // Stands in for a repair that fails: the repair tool exits 2 before it reads anything.
  FAIL_PRELOAD = path.join(SCRATCH, 'fail-repair.cjs');
  fs.writeFileSync(FAIL_PRELOAD, [
    "const script = process.argv[1] || '';",
    "if (script.endsWith('repair-derived.cjs') && process.env.DRAFT_AUTO_REPAIR_FAIL === '1') {",
    "  process.stderr.write('simulated repair failure\\n');",
    '  process.exit(2);',
    '}',
    '',
  ].join('\n'));

  fs.mkdirSync(path.join(ROOT, 'specs', 'staging'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, '.opencode'));
  fs.symlinkSync(path.join(TOOL_TREE, '.skilled'), path.join(ROOT, '.skilled'), 'dir');
  const git = runTool('git', ['init', '--quiet'], cleanEnv());
  expect(git.status, git.stderr).toBe(0);

  const created = runTool('bash', [CREATE, '--json', '--skip-branch', '--path', PACKET_REL, 'Draft auto repair probe'], cleanEnv());
  expect(created.status, created.stderr).toBe(0);
  // The scaffold carries a placeholder packet pointer, which the repair rewrites
  // only once some derived rule fails. Making one fail and repairing it here
  // leaves a base whose only later failures are the ones each case makes.
  const spec = path.join(PACKET, 'spec.md');
  fs.writeFileSync(spec, fs.readFileSync(spec, 'utf8').replace(/^description: .*$/mu, 'description: "The probe packet as first written."'));
  const settle = runTool('node', [REPAIR, '--folder', PACKET_REL, '--apply'], { ...cleanEnv(), SPECKIT_DRAFT_AUTO_REPAIR: '0' });
  expect(settle.status, settle.stdout + settle.stderr).toBe(0);
  const baseline = runTool('bash', [VALIDATE, PACKET_REL, '--strict', '--quiet'], { ...cleanEnv(), SPECKIT_DRAFT_AUTO_REPAIR: '0' });
  expect(baseline.stdout, baseline.stderr).toContain('RESULT: PASSED');
  fs.cpSync(PACKET, BASE, { recursive: true });
}, RUN_TIMEOUT_MS * 3);

beforeEach(() => {
  fs.rmSync(PACKET, { recursive: true, force: true });
  fs.cpSync(BASE, PACKET, { recursive: true });
  fs.rmSync(COUNT_LOG, { force: true });
});

afterAll(() => {
  if (ROOT) {
    // Remove the tool-tree link first so the recursive remove never walks into the real tree.
    fs.rmSync(path.join(ROOT, '.skilled'), { force: true });
    fs.rmSync(ROOT, { recursive: true, force: true });
  }
  if (SCRATCH) fs.rmSync(SCRATCH, { recursive: true, force: true });
});

describe('Draft auto-repair in the validate CLI', () => {
  it('repairs a Draft packet whose only errors are stale derived metadata in one run, and names the file', () => {
    // A file beside the packet gives the outside hash something to hold, so an
    // empty map cannot pass for an untouched parent.
    const sibling = path.join(path.dirname(PACKET), 'sibling-note.md');
    try {
      fs.writeFileSync(sibling, 'A file the repair of another packet must not touch.\n');
      makeGraphStale();
      const before = hashPacket();
      const outsideBefore = hashOutsidePacket();
      expect(Object.keys(outsideBefore).length).toBeGreaterThan(0);

      const first = validate([]);

      expect(first.status, first.stdout + first.stderr).toBe(0);
      expect(first.stdout).toContain('Draft auto-repair');
      expect(first.stdout).toContain(`rewrote ${PACKET_REL}/graph-metadata.json`);
      expect(first.stdout).toContain('RESULT: PASSED');
      expect(repairStarts()).toBe(1);
      const after = hashPacket();
      const changed = Object.keys(after).filter((file) => after[file] !== before[file]);
      expect(changed).toEqual(['graph-metadata.json']);
      expect(hashOutsidePacket()).toEqual(outsideBefore);

      // A second run over the repaired packet has nothing to repair and writes nothing.
      const second = validate([]);
      expect(second.status).toBe(0);
      expect(second.stdout).not.toContain('Draft auto-repair');
      expect(hashPacket()).toEqual(after);
      expect(repairStarts()).toBe(1);
    } finally {
      fs.rmSync(sibling, { force: true });
    }
  }, RUN_TIMEOUT_MS);

  it('keeps stdout to one parseable report under --json and sends the notice to stderr', () => {
    makeGraphStale();

    const result = validate(['--json']);

    expect(result.status, result.stderr).toBe(0);
    const report = JSON.parse(result.stdout) as ValidationReport;
    expect(report.passed).toBe(true);
    expect(result.stdout).not.toContain('Draft auto-repair');
    expect(result.stderr).toContain(`rewrote ${PACKET_REL}/graph-metadata.json`);
    expect(repairStarts()).toBe(1);
  }, RUN_TIMEOUT_MS);

  it('keeps stdout to one RESULT line under --quiet', () => {
    makeGraphStale();

    const result = validate(['--quiet']);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout.trim().split('\n')).toHaveLength(1);
    expect(result.stdout).toMatch(/^RESULT: PASSED/u);
    expect(result.stderr).toContain('Draft auto-repair');
  }, RUN_TIMEOUT_MS);

  for (const value of ['0', 'false', 'off']) {
    it(`writes nothing when the switch is ${value}, though the packet would qualify`, () => {
      makeGraphStale();
      const before = hashPacket();

      const result = validate(['--json'], { SPECKIT_DRAFT_AUTO_REPAIR: value });

      expect(result.status).toBe(2);
      const report = JSON.parse(result.stdout) as ValidationReport;
      // Every error is derived, so the switch is the only thing that held the repair back.
      expect(errorRules(report).length).toBeGreaterThan(0);
      expect(errorRules(report).every((rule) => DERIVED_RULES.has(rule))).toBe(true);
      expect(result.stderr).not.toContain('Draft auto-repair');
      expect(hashPacket()).toEqual(before);
      expect(repairStarts()).toBe(0);
    }, RUN_TIMEOUT_MS);
  }

  it('writes nothing when CI is set', () => {
    makeGraphStale();
    const before = hashPacket();

    const result = validate([], { CI: '1' });

    expect(result.status).toBe(2);
    expect(result.stdout).not.toContain('Draft auto-repair');
    expect(hashPacket()).toEqual(before);
    expect(repairStarts()).toBe(0);
  }, RUN_TIMEOUT_MS);

  it('writes nothing when the status is In Progress', () => {
    setStatus('In Progress');
    const before = hashPacket();

    const result = validate([]);

    expect(result.status).toBe(2);
    expect(result.stdout).not.toContain('Draft auto-repair');
    expect(hashPacket()).toEqual(before);
    expect(repairStarts()).toBe(0);
  }, RUN_TIMEOUT_MS);

  it('writes nothing when a content error sits beside the derived ones', () => {
    makeGraphStale();
    fs.appendFileSync(path.join(PACKET, 'plan.md'), '\n<!-- ANCHOR:orphan-anchor -->\n');
    const before = hashPacket();

    const result = validate(['--json']);

    expect(result.status).toBe(2);
    const rules = errorRules(JSON.parse(result.stdout) as ValidationReport);
    expect(rules.some((rule) => DERIVED_RULES.has(rule))).toBe(true);
    expect(rules.some((rule) => !DERIVED_RULES.has(rule))).toBe(true);
    expect(result.stderr).not.toContain('Draft auto-repair');
    expect(hashPacket()).toEqual(before);
    expect(repairStarts()).toBe(0);
  }, RUN_TIMEOUT_MS);

  it('writes nothing when validateFolder is called as a library on a qualifying packet', () => {
    makeGraphStale();
    const before = hashPacket();

    const report = validateFolder(PACKET, { strict: true });

    expect(report.passed).toBe(false);
    expect(errorRules(report).every((rule) => DERIVED_RULES.has(rule))).toBe(true);
    expect(draftAutoRepairRefusal(report, {}, { strict: true })).toBeNull();
    expect(hashPacket()).toEqual(before);
  }, RUN_TIMEOUT_MS);

  // The In Progress run above also fails on authored placeholders, so the status
  // alone is pinned here on a report whose every error is derived.
  it('refuses on the status alone, the switch and CI, given a derived-only report', () => {
    makeGraphStale();
    const report = validateFolder(PACKET, { strict: true });
    const strict = { strict: true };
    expect(draftAutoRepairRefusal(report, {}, strict)).toBeNull();
    expect(draftAutoRepairRefusal(report, { SPECKIT_DRAFT_AUTO_REPAIR: 'OFF' }, strict)).toBe('switch-off');
    expect(draftAutoRepairRefusal(report, { CI: 'true' }, strict)).toBe('ci');

    setStatus('In Progress');
    expect(draftAutoRepairRefusal(report, {}, strict)).toBe('not-draft');
  }, RUN_TIMEOUT_MS);

  // A derived-only error list proves nothing when some content rules never ran,
  // so a narrowed run and a run without --strict both refuse.
  it('refuses a narrowed rule set and a run without --strict, given a derived-only report', () => {
    makeGraphStale();
    const report = validateFolder(PACKET, { strict: true });
    expect(draftAutoRepairRefusal(report, { SPECKIT_RULES: 'GENERATED_METADATA_DRIFT' }, { strict: true })).toBe('rule-subset');
    expect(draftAutoRepairRefusal(report, { SPECKIT_RULES: ' , ' }, { strict: true })).toBeNull();
    expect(draftAutoRepairRefusal(report, {}, {})).toBe('not-strict');

    const before = hashPacket();
    const narrowed = validate(['--json'], { SPECKIT_RULES: 'GENERATED_METADATA_DRIFT' });
    expect(narrowed.status).toBe(2);
    expect(narrowed.stderr).not.toContain('Draft auto-repair');
    expect(hashPacket()).toEqual(before);
    expect(repairStarts()).toBe(0);
  }, RUN_TIMEOUT_MS);

  it('keeps the first report, the repair hint and exit 2 when the repair child fails', () => {
    makeGraphStale();
    const before = hashPacket();
    const original = validate(['--json'], { SPECKIT_DRAFT_AUTO_REPAIR: '0' });
    expect(original.status).toBe(2);

    const failedJson = validate(['--json'], { DRAFT_AUTO_REPAIR_FAIL: '1' });

    expect(failedJson.status).toBe(2);
    expect(failedJson.stderr).toContain('The repair did not finish (exit 2: simulated repair failure)');
    expect(failedJson.stderr).not.toContain('Validated again');
    expect(ruleStatuses(JSON.parse(failedJson.stdout) as ValidationReport))
      .toEqual(ruleStatuses(JSON.parse(original.stdout) as ValidationReport));
    expect(repairStarts()).toBe(1);

    const failedText = validate([], { DRAFT_AUTO_REPAIR_FAIL: '1' });

    expect(failedText.status).toBe(2);
    expect(failedText.stdout).toContain('The report below is from before it.');
    expect(failedText.stdout).toContain('RESULT: FAILED');
    expect(failedText.stdout).toContain(`repair-derived.cjs --folder ${PACKET_REL} --apply`);
    expect(hashPacket()).toEqual(before);
    expect(repairStarts()).toBe(2);
  }, RUN_TIMEOUT_MS);

  // Each child of a phase parent is its own validation, so each is judged on its
  // own status and errors: the Draft child repairs, the In Progress one does not.
  it('judges each child of a --recursive parent on its own status', () => {
    const parent = path.join(ROOT, PARENT_REL);
    const draftChild = path.join(parent, '001-draft-child');
    const progressChild = path.join(parent, '002-progress-child');
    try {
      const created = runTool('bash', [
        CREATE, '--json', '--skip-branch', '--phase', '--phases', '2',
        '--phase-names', 'draft-child,progress-child', '--path', PARENT_REL, 'Draft auto repair parent',
      ], cleanEnv());
      expect(created.status, created.stderr).toBe(0);
      // Settle each child the way the base packet is settled, so the only later
      // failures are the ones this case makes.
      for (const child of [draftChild, progressChild]) {
        setDescription(child, 'The child as first written.');
        const settle = runTool('node', [REPAIR, '--folder', path.relative(ROOT, child), '--apply'], cleanEnv());
        expect(settle.status, settle.stdout + settle.stderr).toBe(0);
      }
      const baseline = validate(['--recursive', '--quiet'], { SPECKIT_DRAFT_AUTO_REPAIR: '0' }, PARENT_REL);
      expect(baseline.status, baseline.stdout + baseline.stderr).toBe(0);

      makeGraphStale(draftChild);
      makeGraphStale(progressChild);
      setStatus('In Progress', progressChild);
      const draftBefore = hashTree(draftChild);
      const progressBefore = hashTree(progressChild);
      const parentBefore = Object.fromEntries(
        fs.readdirSync(parent).filter((name) => fs.statSync(path.join(parent, name)).isFile())
          .map((name) => [name, fs.readFileSync(path.join(parent, name), 'utf8')]),
      );

      const result = validate(['--recursive'], {}, PARENT_REL);

      expect(result.status).toBe(2);
      expect(result.stdout).toContain(`rewrote ${PARENT_REL}/001-draft-child/graph-metadata.json`);
      expect(result.stdout).not.toContain(`rewrote ${PARENT_REL}/002-progress-child/`);
      expect(repairStarts()).toBe(1);
      const draftAfter = hashTree(draftChild);
      expect(draftAfter['graph-metadata.json']).not.toBe(draftBefore['graph-metadata.json']);
      expect(hashTree(progressChild)).toEqual(progressBefore);
      for (const [name, text] of Object.entries(parentBefore)) {
        expect(fs.readFileSync(path.join(parent, name), 'utf8'), name).toBe(text);
      }
    } finally {
      fs.rmSync(parent, { recursive: true, force: true });
    }
  }, RUN_TIMEOUT_MS * 3);
});

describe('repair-derived.cjs dry run', () => {
  it('leaves a qualifying Draft packet byte for byte as it was without --apply', () => {
    makeGraphStale();
    const before = hashPacket();

    const result = runTool('node', [REPAIR, '--folder', PACKET_REL], cleanEnv());

    expect(result.status, result.stdout + result.stderr).toBe(1);
    expect(result.stdout).toContain('repairable=1');
    expect(hashPacket()).toEqual(before);
  }, RUN_TIMEOUT_MS);
});
