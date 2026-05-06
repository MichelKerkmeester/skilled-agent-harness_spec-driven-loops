import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');
const FIXTURE_DIR = join(TEST_DIR, 'fixtures/multi-ai-council');
const HELPER_PATH = join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs',
);
const require = createRequire(import.meta.url);

const helper = require(HELPER_PATH) as {
  parseCouncilReport: (markdown: string) => { ok: boolean; missing: string[] };
  renderArtifacts: (parsed: unknown, options?: Record<string, unknown>) => {
    config: string;
    strategy: string;
    stateLog: string;
    seats: Array<{ path: string; content: string }>;
    deliberation: string;
    councilReport: string;
  };
  writeArtifacts: (packetSpecFolder: string, rendered: unknown) => { written: string[]; conflicts: string[] };
};

const tempDirs: string[] = [];

function makeTempPacket(): string {
  const dir = mkdtempSync(join(tmpdir(), 'multi-ai-council-persist-'));
  tempDirs.push(dir);
  return dir;
}

function fixture(name: string): string {
  return readFileSync(join(FIXTURE_DIR, name), 'utf8');
}

afterEach(() => {
  while (tempDirs.length) {
    rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
});

describe('multi-ai-council persist-artifacts helper', () => {
  it('writes all artifacts for full council output', () => {
    const packet = makeTempPacket();
    const parsed = helper.parseCouncilReport(fixture('council-output-full.md'));
    expect(parsed.ok).toBe(true);

    const rendered = helper.renderArtifacts(parsed, { round: 1, specFolder: packet });
    const result = helper.writeArtifacts(packet, rendered);
    expect(result.conflicts).toEqual([]);

    const required = [
      'ai-council/ai-council-config.json',
      'ai-council/ai-council-strategy.md',
      'ai-council/ai-council-state.jsonl',
      'ai-council/seats/round-001/seat-001-cli-codex.md',
      'ai-council/seats/round-001/seat-002-cli-claude-code.md',
      'ai-council/seats/round-001/seat-003-cli-gemini.md',
      'ai-council/deliberations/round-001.md',
      'ai-council/council-report.md',
    ];

    for (const relativePath of required) {
      const fullPath = join(packet, relativePath);
      expect(existsSync(fullPath), relativePath).toBe(true);
      expect(statSync(fullPath).size, relativePath).toBeGreaterThan(0);
    }
  });

  it('writes minimal artifacts using composition-table seat fallback', () => {
    const packet = makeTempPacket();
    const parsed = helper.parseCouncilReport(fixture('council-output-minimal.md'));
    expect(parsed.ok).toBe(true);

    const rendered = helper.renderArtifacts(parsed, { round: 1, specFolder: packet });
    const result = helper.writeArtifacts(packet, rendered);
    expect(result.conflicts).toEqual([]);
    expect(existsSync(join(packet, 'ai-council/seats/round-001/seat-001-cli-codex.md'))).toBe(true);
    expect(readFileSync(join(packet, 'ai-council/seats/round-001/seat-001-cli-codex.md'), 'utf8'))
      .toContain('derived from Council Composition table');
    expect(existsSync(join(packet, 'ai-council/council-report.md'))).toBe(true);
  });

  it('exits 1 without writes when strict-required sections are missing', () => {
    const packet = makeTempPacket();
    const input = join(FIXTURE_DIR, 'council-output-missing-required.md');

    let exitCode = 0;
    try {
      execFileSync('node', [HELPER_PATH, packet, '--input-file', input], { encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
      exitCode = (error as { status?: number }).status || 1;
    }

    expect(exitCode).toBe(1);
    expect(existsSync(join(packet, 'ai-council'))).toBe(false);
  });

  it('parser export reports missing sections without filesystem writes', () => {
    const packet = makeTempPacket();
    const parsed = helper.parseCouncilReport(fixture('council-output-missing-required.md'));

    expect(parsed.ok).toBe(false);
    expect(parsed.missing).toEqual(expect.arrayContaining(['Recommended Plan', 'Plan Confidence']));
    expect(existsSync(join(packet, 'ai-council'))).toBe(false);
  });
});
