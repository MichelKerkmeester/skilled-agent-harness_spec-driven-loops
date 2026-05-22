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
  '.opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs',
);
const require = createRequire(import.meta.url);

const helper = require(HELPER_PATH) as {
  parseCouncilReport: (markdown: string) => { ok: boolean; missing: string[] };
  parseStateLog: (jsonl: string) => Array<Record<string, unknown>>;
  renderArtifacts: (parsed: unknown, options?: Record<string, unknown>) => {
    config: string;
    strategy: string;
    stateLog: string;
    seats: Array<{ path: string; content: string }>;
    deliberation: string;
    councilReport: string;
  };
  writeArtifacts: (packetSpecFolder: string, rendered: unknown) => { written: string[]; conflicts: string[] };
  SCHEMA_VERSION: string;
  PROTOCOL: string;
  PRODUCER_VERSION: string;
};

const tempDirs: string[] = [];

function makeTempPacket(): string {
  const dir = mkdtempSync(join(tmpdir(), 'ai-council-persist-'));
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

describe('ai-council persist-artifacts helper', () => {
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

  it('emits v1.1 metadata on all generated state lines', () => {
    const parsed = helper.parseCouncilReport(fixture('council-output-full.md'));
    const rendered = helper.renderArtifacts(parsed, { round: 1 });
    const events = helper.parseStateLog(rendered.stateLog);

    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(event.schema_version).toBe(helper.SCHEMA_VERSION);
      expect(event.protocol).toBe(helper.PROTOCOL);
      expect(event.producer).toBe(helper.PRODUCER_VERSION);
    }
  });

  it('parses v1 state logs with implicit schema version', () => {
    const stateLog = [
      '{"event":"round_start","round":1,"timestamp":"2026-05-06T12:00:00.000Z","seats":["seat-001"]}',
      '{"event":"council_complete","timestamp":"2026-05-06T12:01:00.000Z","final_report_path":"ai-council/council-report.md"}',
      '',
    ].join('\n');

    const events = helper.parseStateLog(stateLog);
    expect(events).toHaveLength(2);
    expect(events[0].schema_version).toBe('1');
    expect(events[1].event).toBe('council_complete');
  });

  it('writes generate-context compatible payload when payload flag is present', () => {
    const packet = makeTempPacket();
    const payloadPath = join(packet, 'payload.json');
    const input = join(FIXTURE_DIR, 'council-output-full.md');

    const stdout = execFileSync('node', [
      HELPER_PATH,
      packet,
      '--input-file',
      input,
      '--memory-save-payload-out',
      payloadPath,
    ], { encoding: 'utf8', stdio: 'pipe' });

    expect(stdout).toContain('[ai-council] Wrote');
    expect(existsSync(payloadPath)).toBe(true);
    const payload = JSON.parse(readFileSync(payloadPath, 'utf8'));
    expect(payload).toMatchObject({
      spec_folder: packet,
      files_changed: [],
      tests: [],
    });
    expect(typeof payload.topic).toBe('string');
    expect(typeof payload.session_summary).toBe('string');
    expect(Array.isArray(payload.decisions)).toBe(true);
    expect(Array.isArray(payload.follow_ups)).toBe(true);
    expect(['complete', 'complete-with-deferrals']).toContain(payload.completion_status);
  });

  it('does not write a memory payload when payload flag is absent', () => {
    const packet = makeTempPacket();
    const payloadPath = join(packet, 'payload.json');
    const input = join(FIXTURE_DIR, 'council-output-full.md');

    execFileSync('node', [HELPER_PATH, packet, '--input-file', input], { encoding: 'utf8', stdio: 'pipe' });

    expect(existsSync(payloadPath)).toBe(false);
    expect(existsSync(join(packet, 'ai-council/council-report.md'))).toBe(true);
    expect(existsSync(join(packet, 'ai-council/ai-council-state.jsonl'))).toBe(true);
  });
});
