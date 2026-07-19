import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  classifyCompliance,
  finalizeSmartRouterCompliancePrompt,
  recordSmartRouterCompliance,
  recordSmartRouterPromptObservation,
  startSmartRouterCompliancePrompt,
  telemetryFilePath,
} from '../../scripts/observability/smart-router-telemetry';

const TELEMETRY_DIR_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_DIR';
const TELEMETRY_PATH_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_PATH';
const createdRoots = new Set<string>();
let previousTelemetryDir: string | undefined;
let previousTelemetryPath: string | undefined;

function createTempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-router-telemetry-'));
  createdRoots.add(root);
  return root;
}

function readJsonl(root: string): unknown[] {
  const filePath = path.join(root, 'compliance.jsonl');
  return fs
    .readFileSync(filePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

beforeEach(() => {
  previousTelemetryDir = process.env[TELEMETRY_DIR_ENV];
  previousTelemetryPath = process.env[TELEMETRY_PATH_ENV];
});

afterEach(() => {
  if (previousTelemetryDir === undefined) {
    delete process.env[TELEMETRY_DIR_ENV];
  } else {
    process.env[TELEMETRY_DIR_ENV] = previousTelemetryDir;
  }
  if (previousTelemetryPath === undefined) {
    delete process.env[TELEMETRY_PATH_ENV];
  } else {
    process.env[TELEMETRY_PATH_ENV] = previousTelemetryPath;
  }

  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('smart-router telemetry compliance classification', () => {
  it('classifies a complete always-only read as always', () => {
    expect(
      classifyCompliance(
        ['always:references/shared/universal_patterns.md'],
        ['references/shared/universal_patterns.md']
      )
    ).toBe('always');
  });

  it('classifies a complete conditional read as conditional_expected', () => {
    expect(
      classifyCompliance(
        ['conditional:references/typescript/style-guide.md'],
        ['references/typescript/style-guide.md']
      )
    ).toBe('conditional_expected');
  });

  it('classifies a complete on-demand read as on_demand_expected', () => {
    expect(
      classifyCompliance(
        ['on_demand:assets/checklists/typescript-checklist.md'],
        ['assets/checklists/typescript-checklist.md']
      )
    ).toBe('on_demand_expected');
  });

  it('classifies an unexpected read as extra', () => {
    expect(
      classifyCompliance(
        ['always:references/shared/universal_patterns.md'],
        [
          'references/shared/universal_patterns.md',
          'references/typescript/style-guide.md',
        ]
      )
    ).toBe('extra');
  });

  it('classifies an unread predicted resource as missing_expected', () => {
    expect(
      classifyCompliance(
        [
          'always:references/shared/universal_patterns.md',
          'expected:references/typescript/style-guide.md',
        ],
        ['references/shared/universal_patterns.md']
      )
    ).toBe('missing_expected');
  });

  it('classifies empty or sentinel allowed resources as unknown_unparsed', () => {
    expect(classifyCompliance([], ['references/shared/universal_patterns.md'])).toBe('unknown_unparsed');
    expect(classifyCompliance(['__unknown_unparsed__'], ['references/shared/universal_patterns.md'])).toBe(
      'unknown_unparsed'
    );
  });
});

describe('smart-router telemetry recording', () => {
  it('writes a JSONL record and returns the same compliance payload', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;

    const record = recordSmartRouterCompliance({
      promptId: 'prompt-1',
      selectedSkill: 'sk-code',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: ['always:references/shared/universal_patterns.md'],
      actualReads: ['references/shared/universal_patterns.md'],
    });

    const rows = readJsonl(root);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(record);
    expect(record.complianceClass).toBe('always');
    expect(record.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('creates the telemetry directory idempotently', () => {
    const root = createTempRoot();
    fs.mkdirSync(root, { recursive: true });
    process.env[TELEMETRY_DIR_ENV] = root;

    expect(() => {
      recordSmartRouterCompliance({
        promptId: 'prompt-2',
        selectedSkill: 'sk-code-review',
        predictedRoute: ['QUALITY'],
        allowedResources: ['conditional:references/code-quality-checklist.md'],
        actualReads: ['references/code-quality-checklist.md'],
      });
      recordSmartRouterCompliance({
        promptId: 'prompt-3',
        selectedSkill: 'sk-code-review',
        predictedRoute: ['SECURITY'],
        allowedResources: ['conditional:references/security-checklist.md'],
        actualReads: ['references/security-checklist.md'],
      });
    }).not.toThrow();

    expect(readJsonl(root)).toHaveLength(2);
  });

  it('sanitizes unsafe resource paths before JSONL persistence', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;

    const record = recordSmartRouterCompliance({
      promptId: 'prompt-4',
      selectedSkill: 'sk-code',
      predictedRoute: ['SHELL'],
      allowedResources: ['always:references/shell/style-guide.md\nbad'],
      actualReads: ['references/shell/style-guide.md\nbad'],
    });

    const fileContent = fs.readFileSync(path.join(root, 'compliance.jsonl'), 'utf8');
    const physicalLines = fileContent.trim().split('\n');
    expect(physicalLines).toHaveLength(1);
    expect(record.allowedResources[0]).not.toContain('\n');
    expect(record.actualReads[0]).not.toContain('\n');
    expect(readJsonl(root)[0]).toEqual(record);
  });

  it('finalizes a zero-read prompt as one compliance record', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;

    startSmartRouterCompliancePrompt({
      promptId: 'prompt-zero',
      selectedSkill: 'sk-code',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: ['expected:references/typescript/style-guide.md'],
      actualReads: [],
    });
    const record = finalizeSmartRouterCompliancePrompt('prompt-zero');

    expect(record?.actualReads).toEqual([]);
    expect(record?.complianceClass).toBe('missing_expected');
    expect(readJsonl(root)).toHaveLength(1);
  });

  it('aggregates multiple reads for the same prompt into one finalized record', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;
    startSmartRouterCompliancePrompt({
      promptId: 'prompt-multi',
      selectedSkill: 'sk-code',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: [
        'always:references/shared/universal_patterns.md',
        'conditional:references/typescript/style-guide.md',
      ],
      actualReads: [],
    });

    recordSmartRouterPromptObservation({
      promptId: 'prompt-multi',
      selectedSkill: 'sk-code',
      observedSkill: 'sk-code',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: ['always:references/shared/universal_patterns.md'],
      actualReads: ['references/shared/universal_patterns.md'],
    });
    recordSmartRouterPromptObservation({
      promptId: 'prompt-multi',
      selectedSkill: 'sk-code',
      observedSkill: 'sk-code',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: ['conditional:references/typescript/style-guide.md'],
      actualReads: ['references/typescript/style-guide.md'],
    });
    const record = finalizeSmartRouterCompliancePrompt('prompt-multi');

    expect(readJsonl(root)).toHaveLength(1);
    expect(record?.actualReads).toEqual([
      'references/shared/universal_patterns.md',
      'references/typescript/style-guide.md',
    ]);
    expect(record?.observedSkill).toBe('sk-code');
    expect(record?.complianceClass).toBe('conditional_expected');
  });

  it('classifies cross-skill reads as non-compliant even when resource names match', () => {
    const record = recordSmartRouterCompliance({
      promptId: 'prompt-cross-skill',
      selectedSkill: 'sk-code',
      observedSkill: 'sk-doc',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: ['always:SKILL.md'],
      actualReads: ['SKILL.md'],
    }, {
      outputPath: path.join(createTempRoot(), 'cross-skill.jsonl'),
    });

    expect(record.observedSkill).toBe('sk-doc');
    expect(record.complianceClass).toBe('extra');
  });

  it('resolves telemetry path precedence as explicit output, env path, env dir, then default', () => {
    const explicit = path.join(createTempRoot(), 'explicit.jsonl');
    const envPath = path.join(createTempRoot(), 'env-path.jsonl');
    const envDir = createTempRoot();
    process.env[TELEMETRY_PATH_ENV] = envPath;
    process.env[TELEMETRY_DIR_ENV] = envDir;

    expect(telemetryFilePath(explicit)).toBe(path.resolve(explicit));
    expect(telemetryFilePath()).toBe(path.resolve(envPath));
    delete process.env[TELEMETRY_PATH_ENV];
    expect(telemetryFilePath()).toBe(path.join(path.resolve(envDir), 'compliance.jsonl'));
  });

  it('falls back to the repo-root telemetry path when no output flag or env override is set', () => {
    delete process.env[TELEMETRY_PATH_ENV];
    delete process.env[TELEMETRY_DIR_ENV];

    // The repo-root marker and the default write path both target the real,
    // plural `.opencode/skills/` directory -- the actual live telemetry file
    // has always lived at `.opencode/skills/.smart-router-telemetry/`, while
    // this module's own default once pointed at a singular `.opencode/skill/`
    // typo left over from an incomplete plural-rename sweep.
    const repoRoot = createTempRoot();
    fs.mkdirSync(path.join(repoRoot, '.opencode', 'skills'), { recursive: true });
    const nestedWorkspace = path.join(repoRoot, 'nested', 'workspace');
    fs.mkdirSync(nestedWorkspace, { recursive: true });
    const resolvedRepoRoot = fs.realpathSync(repoRoot);

    const originalCwd = process.cwd();
    try {
      process.chdir(nestedWorkspace);
      expect(telemetryFilePath()).toBe(
        path.join(resolvedRepoRoot, '.opencode', 'skills', '.smart-router-telemetry', 'compliance.jsonl')
      );
    } finally {
      process.chdir(originalCwd);
    }
  });
});

describe('smart-router telemetry rotation', () => {
  const TELEMETRY_MAX_BYTES_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_MAX_BYTES';
  let previousMaxBytes: string | undefined;

  beforeEach(() => {
    previousMaxBytes = process.env[TELEMETRY_MAX_BYTES_ENV];
  });

  afterEach(() => {
    if (previousMaxBytes === undefined) {
      delete process.env[TELEMETRY_MAX_BYTES_ENV];
    } else {
      process.env[TELEMETRY_MAX_BYTES_ENV] = previousMaxBytes;
    }
  });

  function makeRecordInput(promptId: string) {
    return {
      promptId,
      selectedSkill: 'sk-code',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: ['always:references/shared/universal_patterns.md'],
      actualReads: ['references/shared/universal_patterns.md'],
    };
  }

  it('rotates the telemetry file to .1 once appending would exceed the size cap, and keeps appending to a fresh file', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;
    const filePath = path.join(root, 'compliance.jsonl');
    process.env[TELEMETRY_MAX_BYTES_ENV] = '256';

    // Fill the active file close to the cap with prior (pre-rotation) records.
    recordSmartRouterCompliance(makeRecordInput('prompt-filler'));
    while (fs.statSync(filePath).size < 200) {
      recordSmartRouterCompliance(makeRecordInput('prompt-filler'));
    }
    const sizeBeforeRotation = fs.statSync(filePath).size;

    const triggering = recordSmartRouterCompliance(makeRecordInput('prompt-rotate'));

    // The backup now holds everything written before rotation; the active
    // file holds only the record that triggered rotation.
    const backupPath = `${filePath}.1`;
    expect(fs.existsSync(backupPath)).toBe(true);
    expect(fs.statSync(backupPath).size).toBe(sizeBeforeRotation);

    const activeRows = readJsonl(root);
    expect(activeRows).toHaveLength(1);
    expect(activeRows[0]).toEqual(triggering);
  });

  it('a rotation failure still appends the record (fail-open)', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;
    const filePath = path.join(root, 'compliance.jsonl');
    process.env[TELEMETRY_MAX_BYTES_ENV] = '16';

    // Oversized existing active file, so the next append attempts rotation.
    fs.writeFileSync(filePath, `${'x'.repeat(64)}\n`, 'utf8');

    // Occupy the backup target with a non-empty directory: renaming a
    // regular file onto it fails (EISDIR), a real rotation failure with no
    // mocking required.
    const backupPath = `${filePath}.1`;
    fs.mkdirSync(backupPath);
    fs.writeFileSync(path.join(backupPath, 'occupied.txt'), 'keep', 'utf8');

    const record = recordSmartRouterCompliance(makeRecordInput('prompt-rotation-fail'));

    // Rotation failed, so the backup directory is untouched...
    expect(fs.existsSync(path.join(backupPath, 'occupied.txt'))).toBe(true);
    // ...but the record must still have been appended to the (now oversized) active file.
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    expect(lines[lines.length - 1]).toBe(JSON.stringify(record));
  });

  it('the size cap is env-tunable via SPECKIT_SMART_ROUTER_TELEMETRY_MAX_BYTES', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;
    const filePath = path.join(root, 'compliance.jsonl');
    process.env[TELEMETRY_MAX_BYTES_ENV] = '999999999';

    for (let index = 0; index < 5; index += 1) {
      recordSmartRouterCompliance(makeRecordInput(`prompt-${index}`));
    }

    expect(fs.existsSync(`${filePath}.1`)).toBe(false);
    expect(readJsonl(root)).toHaveLength(5);
  });
});
