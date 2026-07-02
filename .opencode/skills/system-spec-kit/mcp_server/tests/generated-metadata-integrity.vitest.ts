import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  GRAPH_METADATA_STATUS_VALUES,
  GENERATED_METADATA_GRANDFATHER_ENV,
  STATUS_COMPLETION_CONSISTENCY_GATE_ENV,
  checkGeneratedMetadataIntegrity,
  deriveGraphMetadata,
  graphMetadataSchema,
  isGeneratedMetadataGrandfatherEnabled,
  isStatusCompletionConsistencyGateEnabled,
  resolveGeneratedMetadataIntegrity,
  serializeGraphMetadata,
  validateFolder,
  type GraphMetadata,
} from '../api';
import { __testables as parserTestables } from '../lib/graph/graph-metadata-parser.js';

const { normalizeDerivedStatus } = parserTestables;

const PROSE_STATUS = 'complete — shipped + verified (d4 measured 54/100, n=5)';
const NOW = '2026-06-22T00:00:00.000Z';

const createdRoots = new Set<string>();

function makeSpecFolder(slug: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-metadata-integrity-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', slug);
  fs.mkdirSync(specFolder, { recursive: true });
  return specFolder;
}

function writeSpecDoc(folder: string, name: string, status: string | null): void {
  const lines = ['---', 'title: "Integrity Fixture"', 'description: "Fixture packet for integrity checks."'];
  if (status !== null) {
    lines.push(`status: "${status}"`);
  }
  lines.push('---', '', '# Integrity Fixture', '', '### Overview', 'A fixture packet.', '');
  fs.writeFileSync(path.join(folder, name), lines.join('\n'), 'utf-8');
}

function writeGoodGeneratedFiles(folder: string): GraphMetadata {
  writeSpecDoc(folder, 'spec.md', 'planned');
  const metadata = deriveGraphMetadata(folder, null, { now: NOW });
  fs.writeFileSync(path.join(folder, 'graph-metadata.json'), serializeGraphMetadata(metadata), 'utf-8');
  fs.writeFileSync(
    path.join(folder, 'description.json'),
    `${JSON.stringify(
      {
        specFolder: metadata.spec_folder,
        description: 'Fixture packet for integrity checks.',
        keywords: ['integrity', 'fixture'],
        lastUpdated: NOW,
      },
      null,
      2,
    )}\n`,
    'utf-8',
  );
  return metadata;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
  delete process.env[GENERATED_METADATA_GRANDFATHER_ENV];
  delete process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV];
});

describe('derived.status enum closure', () => {
  it('rejects an em-dash prose status at the schema boundary and accepts every enum member', () => {
    const folder = makeSpecFolder('900-enum-closure');
    const valid = writeGoodGeneratedFiles(folder);

    const prosePayload = { ...valid, derived: { ...valid.derived, status: PROSE_STATUS } };
    expect(() => graphMetadataSchema.parse(prosePayload)).toThrow();

    for (const member of GRAPH_METADATA_STATUS_VALUES) {
      const payload = { ...valid, derived: { ...valid.derived, status: member } };
      expect(graphMetadataSchema.parse(payload).derived.status).toBe(member);
    }
  });

  it('normalizes synonyms and closed-set values but returns null for prose', () => {
    expect(normalizeDerivedStatus('Done')).toBe('complete');
    expect(normalizeDerivedStatus('In Progress')).toBe('in_progress');
    expect(normalizeDerivedStatus('Draft')).toBe('draft');
    expect(normalizeDerivedStatus('blocked')).toBe('blocked');
    expect(normalizeDerivedStatus(PROSE_STATUS)).toBeNull();
    expect(normalizeDerivedStatus('approved')).toBeNull();
    expect(normalizeDerivedStatus('   ')).toBeNull();
  });
});

describe('legacy status preservation rule', () => {
  it('drops a non-enum legacy status and falls back to planned with the review flag', () => {
    const folder = makeSpecFolder('901-legacy-prose');
    writeSpecDoc(folder, 'spec.md', null);
    const base = deriveGraphMetadata(folder, null, { now: NOW });
    const existingProse = { ...base, derived: { ...base.derived, status: PROSE_STATUS } } as unknown as GraphMetadata;

    const rederived = deriveGraphMetadata(folder, existingProse, { now: NOW });

    expect(rederived.derived.status).toBe('planned');
    expect(rederived.status_review_required).toBe(true);
  });

  it('preserves an existing status that is already an enum value with no review flag', () => {
    const folder = makeSpecFolder('902-legacy-enum');
    writeSpecDoc(folder, 'spec.md', null);
    const base = deriveGraphMetadata(folder, null, { now: NOW });
    const existingEnum = { ...base, derived: { ...base.derived, status: 'in_progress' } } as unknown as GraphMetadata;

    const rederived = deriveGraphMetadata(folder, existingEnum, { now: NOW });

    expect(rederived.derived.status).toBe('in_progress');
    expect(rederived.status_review_required).toBeUndefined();
  });
});

describe('generated-metadata integrity validator', () => {
  it('passes a clean folder through the schema, enum and path-prefix invariants', () => {
    const folder = makeSpecFolder('903-clean');
    writeGoodGeneratedFiles(folder);

    const report = checkGeneratedMetadataIntegrity(folder);

    expect(report.checked).toBe(true);
    expect(report.violations).toEqual([]);
    expect(resolveGeneratedMetadataIntegrity(report, { grandfather: false }).status).toBe('pass');
  });

  it('flags a prose status and a prefixed spec_folder in a bad folder', () => {
    const folder = makeSpecFolder('904-bad');
    const good = writeGoodGeneratedFiles(folder);
    const badGraph = {
      ...good,
      spec_folder: `.opencode/specs/${good.spec_folder}`,
      derived: { ...good.derived, status: PROSE_STATUS },
    };
    fs.writeFileSync(path.join(folder, 'graph-metadata.json'), `${JSON.stringify(badGraph, null, 2)}\n`, 'utf-8');
    fs.writeFileSync(
      path.join(folder, 'description.json'),
      `${JSON.stringify(
        {
          specFolder: `specs/${good.spec_folder}`,
          description: 'Fixture packet for integrity checks.',
          keywords: ['integrity'],
          lastUpdated: NOW,
        },
        null,
        2,
      )}\n`,
      'utf-8',
    );

    const report = checkGeneratedMetadataIntegrity(folder);
    const codes = report.violations.map((violation) => violation.code);

    expect(codes).toContain('STATUS_NOT_IN_ENUM');
    expect(codes.filter((code) => code === 'SPEC_FOLDER_PREFIXED').length).toBe(2);
  });

  it('skips an authored-only folder with no generated files', () => {
    const folder = makeSpecFolder('905-authored-only');
    writeSpecDoc(folder, 'spec.md', 'planned');

    const report = checkGeneratedMetadataIntegrity(folder);

    expect(report.checked).toBe(false);
    expect(resolveGeneratedMetadataIntegrity(report, { grandfather: false }).status).toBe('pass');
  });
});

describe('status-completion consistency check (D4-P0-001 regression)', () => {
  // Regression for a real, repo-wide deriveStatus defect: 213 folders were already
  // mislabeled derived.status:'complete' because implementation-summary.md's mere
  // presence, not its actual completion evidence, drove the derivation. This check
  // catches the same class of disagreement independently at the --strict layer, so a
  // pre-existing malformed graph-metadata.json cannot silently pass validation.
  // Writes spec.md + implementation-summary.md + tasks.md, THEN derives graph-metadata.json
  // over the full doc set (so source_fingerprint is computed correctly), THEN overwrites
  // only derived.status. Writing implementation-summary.md/tasks.md after the derive (as a
  // naive test would) leaves source_fingerprint stale against the newly-added docs, which
  // trips an unrelated SOURCE_FINGERPRINT_MISMATCH violation alongside the one under test.
  function writeFixtureWithForcedStatus(
    folder: string,
    completionPct: number | null,
    taskItems: string[],
    forcedStatus: string,
  ): void {
    writeSpecDoc(folder, 'spec.md', 'planned');
    const implementationSummaryLines = ['---', 'title: "Implementation Summary"'];
    if (completionPct !== null) {
      implementationSummaryLines.push('_memory:', '  continuity:', `    completion_pct: ${completionPct}`);
    }
    implementationSummaryLines.push('---', '', '# Implementation Summary');
    fs.writeFileSync(path.join(folder, 'implementation-summary.md'), implementationSummaryLines.join('\n'), 'utf-8');
    fs.writeFileSync(path.join(folder, 'tasks.md'), ['# Tasks', '', ...taskItems].join('\n'), 'utf-8');

    const metadata = deriveGraphMetadata(folder, null, { now: NOW });
    const forced = { ...metadata, derived: { ...metadata.derived, status: forcedStatus } };
    fs.writeFileSync(path.join(folder, 'graph-metadata.json'), serializeGraphMetadata(forced), 'utf-8');
    fs.writeFileSync(
      path.join(folder, 'description.json'),
      `${JSON.stringify(
        { specFolder: metadata.spec_folder, description: 'Fixture packet for integrity checks.', keywords: ['integrity'], lastUpdated: NOW },
        null,
        2,
      )}\n`,
      'utf-8',
    );
  }

  it('flags a stored complete status when completion_pct is absent, in report mode by default', () => {
    const folder = makeSpecFolder('906-status-mismatch-no-pct');
    writeFixtureWithForcedStatus(folder, null, [], 'complete');

    const report = checkGeneratedMetadataIntegrity(folder);
    const codes = report.violations.map((violation) => violation.code);
    expect(codes).toContain('STATUS_COMPLETE_EVIDENCE_MISMATCH');

    expect(resolveGeneratedMetadataIntegrity(report, { grandfather: false }).status).toBe('info');
    expect(
      resolveGeneratedMetadataIntegrity(report, { grandfather: false, statusCompletionConsistencyEnforced: true }).status,
    ).toBe('error');
  });

  it('flags a stored complete status when completion_pct is below 100', () => {
    const folder = makeSpecFolder('907-status-mismatch-low-pct');
    writeFixtureWithForcedStatus(folder, 60, [], 'complete');

    const report = checkGeneratedMetadataIntegrity(folder);
    expect(report.violations.map((violation) => violation.code)).toContain('STATUS_COMPLETE_EVIDENCE_MISMATCH');
  });

  it('flags a stored complete status when tasks.md still has open items', () => {
    const folder = makeSpecFolder('908-status-mismatch-open-tasks');
    writeFixtureWithForcedStatus(folder, 100, ['- [x] Done', '- [ ] Still open'], 'complete');

    const report = checkGeneratedMetadataIntegrity(folder);
    expect(report.violations.map((violation) => violation.code)).toContain('STATUS_COMPLETE_EVIDENCE_MISMATCH');
  });

  it('does not flag a genuinely complete folder (completion_pct 100, no open tasks)', () => {
    const folder = makeSpecFolder('909-status-genuinely-complete');
    writeFixtureWithForcedStatus(folder, 100, ['- [x] Done one', '- [x] Done two'], 'complete');

    const report = checkGeneratedMetadataIntegrity(folder);
    expect(report.violations.map((violation) => violation.code)).not.toContain('STATUS_COMPLETE_EVIDENCE_MISMATCH');
  });

  it('does not flag a non-complete stored status regardless of completion evidence', () => {
    const folder = makeSpecFolder('910-status-not-complete');
    writeFixtureWithForcedStatus(folder, null, ['- [ ] Open item'], 'in_progress');

    const report = checkGeneratedMetadataIntegrity(folder);
    expect(report.violations.map((violation) => violation.code)).not.toContain('STATUS_COMPLETE_EVIDENCE_MISMATCH');
  });

  // Regression for T2-P1-002/T2-P1-003: the MCP validation orchestrator (validateFolder,
  // the entrypoint the MCP server actually calls) never passed the flag through to
  // resolveGeneratedMetadataIntegrity, so SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE had
  // no effect via that path even though the CLI bridge (validate.sh) wired it correctly.
  it('enforces the gate at the orchestrator entrypoint (validateFolder) when explicitly enabled', () => {
    const folder = makeSpecFolder('911-orchestrator-status-mismatch-enforced');
    writeFixtureWithForcedStatus(folder, null, [], 'complete');

    delete process.env[GENERATED_METADATA_GRANDFATHER_ENV];
    process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV] = 'true';
    try {
      const report = validateFolder(folder, { strict: true });
      const integrityEntry = report.entries.find((item) => item.rule === 'GENERATED_METADATA_INTEGRITY');
      expect(integrityEntry?.status).toBe('error');
      expect(integrityEntry?.details.join(' ')).toContain('STATUS_COMPLETE_EVIDENCE_MISMATCH');
    } finally {
      delete process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV];
    }
  });

  it('leaves the orchestrator entrypoint in report mode by default (flag unset)', () => {
    const folder = makeSpecFolder('912-orchestrator-status-mismatch-default');
    writeFixtureWithForcedStatus(folder, null, [], 'complete');

    delete process.env[GENERATED_METADATA_GRANDFATHER_ENV];
    delete process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV];
    const report = validateFolder(folder, { strict: true });
    const integrityEntry = report.entries.find((item) => item.rule === 'GENERATED_METADATA_INTEGRITY');
    expect(integrityEntry?.status).not.toBe('error');
  });
});

describe('grandfather report mode arms', () => {
  it('resolves violations to non-blocking info under grandfather and error when enforced', () => {
    const report = {
      rule: 'GENERATED_METADATA_INTEGRITY' as const,
      checked: true,
      violations: [{ file: 'graph-metadata.json' as const, code: 'STATUS_NOT_IN_ENUM', message: 'derived.status: prose' }],
    };

    expect(resolveGeneratedMetadataIntegrity(report, { grandfather: true }).status).toBe('info');
    expect(resolveGeneratedMetadataIntegrity(report, { grandfather: false }).status).toBe('error');
  });

  it('reads the grandfather flag from the environment on both arms', () => {
    // Graduated default-OFF-enforcing: an unset env now enforces rather than
    // grandfathers, and an explicit opt-in restores the report mode.
    delete process.env[GENERATED_METADATA_GRANDFATHER_ENV];
    expect(isGeneratedMetadataGrandfatherEnabled()).toBe(false);

    process.env[GENERATED_METADATA_GRANDFATHER_ENV] = 'true';
    expect(isGeneratedMetadataGrandfatherEnabled()).toBe(true);

    process.env[GENERATED_METADATA_GRANDFATHER_ENV] = '1';
    expect(isGeneratedMetadataGrandfatherEnabled()).toBe(true);

    process.env[GENERATED_METADATA_GRANDFATHER_ENV] = 'false';
    expect(isGeneratedMetadataGrandfatherEnabled()).toBe(false);
  });

  it('reads the status-completion-consistency gate flag, defaulting to report mode', () => {
    // Inverse polarity from the other flags in this module: default-OFF (report mode)
    // because a known repo-wide backlog of 213 already-mislabeled folders would otherwise
    // immediately fail --strict for every session touching them the moment this ships.
    delete process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV];
    expect(isStatusCompletionConsistencyGateEnabled()).toBe(false);

    process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV] = 'true';
    expect(isStatusCompletionConsistencyGateEnabled()).toBe(true);

    process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV] = '1';
    expect(isStatusCompletionConsistencyGateEnabled()).toBe(true);

    process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV] = 'false';
    expect(isStatusCompletionConsistencyGateEnabled()).toBe(false);

    delete process.env[STATUS_COMPLETION_CONSISTENCY_GATE_ENV];
  });
});
