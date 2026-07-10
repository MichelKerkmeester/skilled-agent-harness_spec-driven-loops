import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(scriptsRoot, '..', '..', '..', '..');
const validateScript = path.join(scriptsRoot, 'spec', 'validate.sh');
const statusClassifier = path.join(scriptsRoot, 'lib', 'status-classifier.sh');
const sweepScript = path.join(scriptsRoot, 'sweep', 'strict-pass-freshness.ts');
const tsxLoader = path.join(scriptsRoot, 'node_modules', 'tsx', 'dist', 'loader.mjs');
const createdRoots = new Set<string>();

function makeWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-hardening-'));
  createdRoots.add(root);
  return root;
}

function makeRepoWorkspace(): string {
  const scratchRoot = path.join(repoRoot, 'scratch');
  fs.mkdirSync(scratchRoot, { recursive: true });
  const root = fs.mkdtempSync(path.join(scratchRoot, 'validation-hardening-'));
  createdRoots.add(root);
  return root;
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function createPacket(workspace: string, packetId: string, options: {
  specStatus?: string;
  implementationStatus?: string;
  metadataId?: string;
  parentId?: string | null;
  checklist?: string;
  tasks?: string;
  scaffoldMarker?: boolean;
} = {}): string {
  const folder = path.join(workspace, '.opencode', 'specs', packetId);
  const specStatus = options.specStatus ?? 'Planned';
  const implementationStatus = options.implementationStatus ?? specStatus;
  const metadataId = options.metadataId ?? packetId;
  const parentId = options.parentId === undefined ? packetId.split('/').slice(0, -1).join('/') : options.parentId;
  fs.mkdirSync(folder, { recursive: true });
  writeFile(path.join(folder, 'spec.md'), [
    '---',
    'title: "Fixture Spec"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${metadataId}"`,
    '---',
    '# Fixture Spec',
    '<!-- SPECKIT_LEVEL: 2 -->',
    '| Field | Value |',
    '|-------|-------|',
    `| **Status** | ${specStatus} |`,
  ].join('\n'));
  writeFile(path.join(folder, 'plan.md'), '# Plan\n');
  writeFile(path.join(folder, 'tasks.md'), options.tasks ?? '- [ ] T001 Pending task\n');
  writeFile(path.join(folder, 'checklist.md'), options.checklist ?? '- [ ] CHK-001 [P0] Pending check\n');
  writeFile(path.join(folder, 'implementation-summary.md'), [
    '---',
    'title: "Implementation Summary"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${metadataId}"`,
    options.scaffoldMarker ? '    last_updated_by: "template-author"' : '    last_updated_by: "test-author"',
    '    completion_pct: 100',
    '---',
    '# Implementation Summary',
    '| Field | Value |',
    '|-------|-------|',
    `| **Status** | ${implementationStatus} |`,
  ].join('\n'));
  writeFile(path.join(folder, 'description.json'), JSON.stringify({ specFolder: metadataId, description: 'fixture' }, null, 2));
  writeFile(path.join(folder, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    packet_id: metadataId,
    spec_folder: metadataId,
    parent_id: parentId,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: { status: 'complete', source_docs: ['spec.md'] },
  }, null, 2));
  return folder;
}

function runValidate(folder: string, rules: string, env: Record<string, string> = {}): { code: number; stdout: string; stderr: string } {
  const result = spawnSync('bash', [validateScript, folder, '--strict', '--no-recursive'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_RULES: rules, ...env },
  });
  return { code: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('validation gate hardening', () => {
  it('classifies complete and non-complete status variants', () => {
    const script = `source "${statusClassifier}"; for value in "Complete" "Shipped" "Done" "COMPLETE " "complete." "Planned" "Draft" "In Progress"; do classify_status "$value"; done`;
    const result = spawnSync('bash', ['-lc', script], { encoding: 'utf8' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim().split('\n')).toEqual([
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'planned',
      'planned',
      'in-progress',
    ]);
  });

  it('classifies "Implemented"/"Implementing" as complete without misclassifying "not implemented"', () => {
    // Regression coverage: adding "implemented" to the complete bucket must not
    // hijack the pre-existing "not implemented" / "not yet implemented" phrases
    // that the planned bucket already owns (real Status values use both forms,
    // e.g. system-skill-advisor/008-skill-advisor-cli/*/spec.md).
    const script = `source "${statusClassifier}"; for value in "Implemented" "Implementing" "Implemented, with broad-suite caveat documented in implementation-summary.md" "Implemented, verification-limited" "Not Implemented" "Planned (not implemented)" "Not Yet Implemented"; do classify_status "$value"; done`;
    const result = spawnSync('bash', ['-lc', script], { encoding: 'utf8' });
    expect(result.status).toBe(0);
    expect(result.stdout.trim().split('\n')).toEqual([
      'complete',
      'complete',
      'complete',
      'complete',
      'planned',
      'planned',
      'planned',
    ]);
  });

  it('metadata disk drift is enforcing by default, advisory when disabled, enforcing when flagged', () => {
    const workspace = makeWorkspace();
    const folder = createPacket(workspace, 'system-speckit/999-real-packet', {
      metadataId: 'system-speckit/999-stale-packet',
      parentId: 'system-speckit',
    });
    const byDefault = runValidate(folder, 'METADATA_DISK_PATH_CONSISTENCY');
    expect(byDefault.code).toBe(2);
    expect(byDefault.stdout).toContain('Generated metadata path drift detected');

    const advisory = runValidate(folder, 'METADATA_DISK_PATH_CONSISTENCY', {
      SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE: 'false',
    });
    expect(advisory.code).toBe(0);
    expect(advisory.stdout).toContain('ADVISORY');
    expect(advisory.stdout).toContain('description.specFolder=system-speckit/999-stale-packet expected=system-speckit/999-real-packet');

    const enforced = runValidate(folder, 'METADATA_DISK_PATH_CONSISTENCY', {
      SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE: 'true',
    });
    expect(enforced.code).toBe(2);
    expect(enforced.stdout).toContain('Generated metadata path drift detected');
  });

  it('status drift is enforcing by default, advisory when disabled, enforcing when flagged', () => {
    const workspace = makeWorkspace();
    const folder = createPacket(workspace, 'system-speckit/998-status-drift', {
      specStatus: 'Planned',
      implementationStatus: 'Complete',
    });
    const byDefault = runValidate(folder, 'STATUS_CROSS_DOC_CONSISTENCY');
    expect(byDefault.code).toBe(2);
    expect(byDefault.stdout).toContain('spec.md and implementation-summary.md statuses disagree');

    const advisory = runValidate(folder, 'STATUS_CROSS_DOC_CONSISTENCY', {
      SPECKIT_STATUS_CROSS_DOC_ENFORCE: 'false',
    });
    expect(advisory.code).toBe(0);
    expect(advisory.stdout).toContain('status cross-doc ADVISORY');

    const enforced = runValidate(folder, 'STATUS_CROSS_DOC_CONSISTENCY', {
      SPECKIT_STATUS_CROSS_DOC_ENFORCE: 'true',
    });
    expect(enforced.code).toBe(2);
    expect(enforced.stdout).toContain('spec.md and implementation-summary.md statuses disagree');
    expect(enforced.stdout).toContain('spec.md Status=Planned classified=planned');
  });

  it('uses the shared status classifier for scaffold marker enforcement', () => {
    const workspace = makeWorkspace();
    const shipped = createPacket(workspace, 'system-speckit/997-shipped-marker', {
      specStatus: 'Shipped',
      implementationStatus: 'Shipped',
      scaffoldMarker: true,
    });
    const planned = createPacket(workspace, 'system-speckit/996-planned-marker', {
      specStatus: 'Planned',
      implementationStatus: 'Planned',
      scaffoldMarker: true,
    });
    expect(runValidate(shipped, 'SCAFFOLD_NEVER_TOUCHED').code).toBe(2);
    expect(runValidate(planned, 'SCAFFOLD_NEVER_TOUCHED').code).toBe(0);
  });

  it('requires substantive evidence in checklist and task items', () => {
    const workspace = makeWorkspace();
    const bare = createPacket(workspace, 'system-speckit/995-bare-evidence', {
      checklist: '- [x] CHK-001 [P0] Environment variables override config file [EVIDENCE: tested]\n',
      tasks: '- [x] T031 `validate.sh` run on spec folder [Evidence: PASSED]\n',
    });
    const prose = createPacket(workspace, 'system-speckit/994-prose-evidence', {
      checklist: [
        '- [x] CHK-001 [P0] Code passes typecheck -- `npm run typecheck` exits 0 and reports `25 passed (25)` in validator-hardening.vitest.ts:42.',
        '  Continued evidence line cites validate.sh output: Errors: 0 Warnings: 0.',
      ].join('\n'),
      tasks: '- [x] T001 [P0] Fixture validates -- validation-gate-hardening.vitest.ts:200 asserts the command output includes 25/25 passing.\n',
    });
    const bareResult = runValidate(bare, 'EVIDENCE_CITED');
    expect(bareResult.code).toBe(2);
    expect(bareResult.stdout).toContain('Found 2 completed item(s) without evidence');

    const proseResult = runValidate(prose, 'EVIDENCE_CITED');
    expect(proseResult.code).toBe(0);
    expect(proseResult.stdout).toContain('substantive evidence');
  });

  it('closes the bare-filename loophole while keeping filename:linenum and DEFERRED markers correct', () => {
    // Regression coverage: closes a false-negative/false-positive pair in
    // the evidence-substance checker.
    //  - a bare filename mention (no linenum, no other evidence signal) alone
    //    must no longer count as evidence (was the loophole);
    //  - filename:linenum is untouched and must still pass;
    //  - a genuine [DEFERRED: ...] reason must now pass without needing to look
    //    evidence-shaped (was the regression);
    //  - a trivial [DEFERRED: tbd] placeholder must still fail.
    const workspace = makeWorkspace();
    const folder = createPacket(workspace, 'system-speckit/992-evidence-fixes', {
      checklist: [
        '- [x] CHK-001 [P0] Update memory-search.ts routing table with new query logic',
        '- [x] CHK-002 [P0] Update memory-search.ts:42 routing table with new query logic',
        '- [x] CHK-003 [P0] Deferred pending decision [DEFERRED: blocked on operator decision]',
        '- [x] CHK-004 [P0] Deferred with only a placeholder reason attached here [DEFERRED: tbd]',
      ].join('\n'),
    });
    const result = runValidate(folder, 'EVIDENCE_CITED');
    expect(result.code).toBe(2);
    expect(result.stdout).toContain('Found 2 completed item(s) without evidence');
    expect(result.stdout).toContain('CHK-001');
    expect(result.stdout).toContain('CHK-004');
    expect(result.stdout).not.toContain('CHK-002');
    expect(result.stdout).not.toContain('CHK-003');
  });

  it('strict-pass freshness sweep is report-only and reports malformed validate output', () => {
    const workspace = makeRepoWorkspace();
    const folder = createPacket(workspace, 'system-speckit/993-sweep-target', {
      specStatus: 'Complete',
      implementationStatus: 'Complete',
    });
    const before = fs.readFileSync(path.join(folder, 'implementation-summary.md'), 'utf8');
    const badValidate = path.join(workspace, 'bad-validate.sh');
    writeFile(badValidate, '#!/usr/bin/env bash\nprintf "not-json"\n');
    fs.chmodSync(badValidate, 0o755);

    const result = spawnSync('node', ['--import', tsxLoader, sweepScript, '--roots', path.join(workspace, '.opencode', 'specs'), '--format', 'json'], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, SPECKIT_VALIDATE_SCRIPT: badValidate },
    });
    expect(result.status).toBe(1);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.errors).toBe(1);
    expect(parsed.results[0].message).toContain('malformed output');
    expect(fs.readFileSync(path.join(folder, 'implementation-summary.md'), 'utf8')).toBe(before);
  });

  it('reports a first-run status (not regression) for a failing folder with no baseline, but still reports regression against a real baseline', () => {
    // Regression coverage: readBaseline() returning an empty Set (no
    // --baseline flag here) must not make wasBaselinePass default to true for
    // every folder.
    const workspace = makeRepoWorkspace();
    const specsRoot = path.join(workspace, '.opencode', 'specs');
    const folder = createPacket(workspace, 'test-track/991-known-failing', {
      specStatus: 'Complete',
      implementationStatus: 'Complete',
      checklist: '- [x] CHK-001 [P0] Something with no evidence at all here whatsoever\n',
    });
    const relativeFolder = path.relative(repoRoot, folder);

    // Confirm this fixture is a genuine known-failing folder before trusting
    // the sweep's classification of it.
    const directCheck = runValidate(folder, 'EVIDENCE_CITED');
    expect(directCheck.code).toBe(2);

    const noBaseline = spawnSync('node', ['--import', tsxLoader, sweepScript, '--roots', specsRoot, '--format', 'json'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    const noBaselinePayload = JSON.parse(noBaseline.stdout);
    expect(noBaselinePayload.regressions).toBe(0);
    expect(noBaselinePayload.firstRun).toBe(1);
    const noBaselineResult = noBaselinePayload.results.find((entry: { folder: string }) => entry.folder === relativeFolder);
    expect(noBaselineResult.status).toBe('first-run');

    const baselinePath = path.join(workspace, 'baseline.json');
    writeFile(baselinePath, JSON.stringify({
      results: [{ folder: relativeFolder, status: 'pass', exitCode: 0, errors: 0, warnings: 0, message: 'recorded as a prior pass' }],
    }));
    const withBaseline = spawnSync('node', ['--import', tsxLoader, sweepScript, '--roots', specsRoot, '--baseline', baselinePath, '--format', 'json'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });
    const withBaselinePayload = JSON.parse(withBaseline.stdout);
    expect(withBaselinePayload.regressions).toBe(1);
    expect(withBaselinePayload.firstRun).toBe(0);
    const withBaselineResult = withBaselinePayload.results.find((entry: { folder: string }) => entry.folder === relativeFolder);
    expect(withBaselineResult.status).toBe('regression');
  });
});
