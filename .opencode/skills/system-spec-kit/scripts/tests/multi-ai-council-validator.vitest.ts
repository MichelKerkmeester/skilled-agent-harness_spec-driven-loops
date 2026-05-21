import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');
const VALIDATE_SH = join(WORKSPACE_ROOT, '.opencode/skills/system-spec-kit/scripts/spec/validate.sh');
const SOURCE_SPEC = join(
  WORKSPACE_ROOT,
  '.opencode/specs/skilled-agent-orchestration/089-ai-council-persistence',
);

const specDocs = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  'description.json',
  'graph-metadata.json',
];

function makeSyntheticSpecFolder(): { tmp: string; packet: string } {
  const tmp = mkdtempSync(join(tmpdir(), 'spec-kit-089-validator-'));
  const packet = join(tmp, '089-ai-council-persistence');
  mkdirSync(packet, { recursive: true });

  for (const doc of specDocs) {
    const source = join(SOURCE_SPEC, doc);
    if (existsSync(source)) {
      copyFileSync(source, join(packet, doc));
    }
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
