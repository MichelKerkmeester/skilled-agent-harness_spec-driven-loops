import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../../');
const VALIDATE_SH = join(WORKSPACE_ROOT, '.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh');
const SOURCE_SPEC = join(
  WORKSPACE_ROOT,
  'specs/system-deep-loop/z_archive/021-multi-ai-council-write-protocol/002-multi-ai-council-persistence',
);

// checklist.md is deliberately absent: the standalone verification checklist was
// retired and is no longer part of the canonical doc set.
const specDocs = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'decision-record.md',
  'implementation-summary.md',
  'description.json',
  'graph-metadata.json',
];

function makeSyntheticSpecFolder(): { tmp: string; packet: string } {
  if (!existsSync(SOURCE_SPEC)) {
    throw new Error(
      `Council fixture source is missing: ${SOURCE_SPEC}. `
      + 'Repoint SOURCE_SPEC at the packet it moved to rather than validating an empty folder.',
    );
  }

  const tmp = mkdtempSync(join(tmpdir(), 'spec-kit-council-validator-'));
  // The copied documents record the folder name they were authored under, so the
  // synthetic packet must reuse that name or the disk/metadata consistency rule
  // reports a stale reference and strict validation fails.
  const packet = join(tmp, basename(SOURCE_SPEC));
  mkdirSync(packet, { recursive: true });

  for (const doc of specDocs) {
    const source = join(SOURCE_SPEC, doc);
    if (!existsSync(source)) {
      throw new Error(`Council fixture source is missing a required document: ${source}`);
    }
    copyFileSync(source, join(packet, doc));
  }

  return { tmp, packet };
}

function validate(packet: string): string {
  return execSync(`bash "${VALIDATE_SH}" "${packet}" --strict`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

describe('Multi-AI Council validator awareness (packet 080)', () => {
  const variations: Array<[string, (packet: string) => void]> = [
    ['empty ai-council folder', (packet) => {
      mkdirSync(join(packet, 'ai-council'), { recursive: true });
    }],
    ['only council-report.md', (packet) => {
      mkdirSync(join(packet, 'ai-council'), { recursive: true });
      writeFileSync(join(packet, 'ai-council/council-report.md'), '# Arbitrary report\n', 'utf8');
    }],
    ['only seats folder', (packet) => {
      mkdirSync(join(packet, 'ai-council/seats/round-001'), { recursive: true });
      writeFileSync(join(packet, 'ai-council/seats/round-001/seat-001-anything.md'), '# Seat\n', 'utf8');
    }],
    ['mixed arbitrary internals', (packet) => {
      mkdirSync(join(packet, 'ai-council/seats/round-001'), { recursive: true });
      mkdirSync(join(packet, 'ai-council/custom-nested'), { recursive: true });
      writeFileSync(join(packet, 'ai-council/council-report.md'), '# Report\n', 'utf8');
      writeFileSync(join(packet, 'ai-council/custom-nested/freeform.txt'), 'free-form\n', 'utf8');
    }],
  ];

  it.each(variations)('passes strict validation with %s', (_name, arrange) => {
    const { tmp, packet } = makeSyntheticSpecFolder();
    try {
      arrange(packet);
      const result = validate(packet);
      expect(result).toMatch(/RESULT: PASSED/);
      expect(result).toMatch(/Errors:\s+0/);
      expect(result).not.toMatch(/unknown.*ai-council|ai-council.*unknown/i);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
