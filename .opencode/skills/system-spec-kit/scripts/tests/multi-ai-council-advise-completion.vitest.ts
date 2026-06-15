import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');
const ADVISOR_PATH = join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-loop-workflows/ai-council/scripts/advise-council-completion.cjs',
);

const tempDirs: string[] = [];

function makeTempPacket(): string {
  const dir = mkdtempSync(join(tmpdir(), 'ai-council-advise-'));
  tempDirs.push(dir);
  return dir;
}

function writeCompleteCouncil(packet: string): void {
  const councilRoot = join(packet, 'ai-council');
  const roundRoot = join(councilRoot, 'seats/round-001');
  mkdirSync(roundRoot, { recursive: true });
  writeFileSync(join(councilRoot, 'ai-council-config.json'), `${JSON.stringify({ seats: ['a', 'b'] })}\n`);
  writeFileSync(join(councilRoot, 'council-report.md'), '# Report\n');
  writeFileSync(join(roundRoot, 'seat-001-a.md'), '# Seat 1\n');
  writeFileSync(join(roundRoot, 'seat-002-b.md'), '# Seat 2\n');
  writeFileSync(
    join(councilRoot, 'ai-council-state.jsonl'),
    '{"event":"round_start","round":1,"timestamp":"2026-05-06T12:00:00.000Z","seats":["seat-001","seat-002"]}\n{"event":"council_complete","timestamp":"2026-05-06T12:01:00.000Z","final_report_path":"ai-council/council-report.md"}\n',
  );
}

function runAdvisor(packet: string): { stdout: string; status: number } {
  try {
    return {
      stdout: execFileSync('node', [ADVISOR_PATH, packet], { encoding: 'utf8', stdio: 'pipe' }),
      status: 0,
    };
  } catch (error) {
    return {
      stdout: (error as { stdout?: Buffer }).stdout?.toString() || '',
      status: (error as { status?: number }).status || 1,
    };
  }
}

afterEach(() => {
  while (tempDirs.length) {
    rmSync(tempDirs.pop()!, { recursive: true, force: true });
  }
});

describe('ai-council completion advisor', () => {
  it('reports no advisories for a complete packet and exits 0', () => {
    const packet = makeTempPacket();
    writeCompleteCouncil(packet);

    const result = runAdvisor(packet);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('No advisories.');
  });

  it('reports missing council-report.md despite seats and exits 0', () => {
    const packet = makeTempPacket();
    writeCompleteCouncil(packet);
    rmSync(join(packet, 'ai-council/council-report.md'));

    const result = runAdvisor(packet);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('council-report.md missing despite seats present in round-001');
  });

  it('reports missing council_complete event and exits 0', () => {
    const packet = makeTempPacket();
    writeCompleteCouncil(packet);
    writeFileSync(
      join(packet, 'ai-council/ai-council-state.jsonl'),
      '{"event":"round_start","round":1,"timestamp":"2026-05-06T12:00:00.000Z","seats":["seat-001","seat-002"]}\n',
    );

    const result = runAdvisor(packet);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('state.jsonl missing council_complete event');
  });

  it('supports json and quiet modes without failing', () => {
    const packet = makeTempPacket();
    writeCompleteCouncil(packet);

    const json = execFileSync('node', [ADVISOR_PATH, packet, '--json'], { encoding: 'utf8', stdio: 'pipe' });
    const quiet = execFileSync('node', [ADVISOR_PATH, packet, '--quiet'], { encoding: 'utf8', stdio: 'pipe' });

    expect(JSON.parse(json)).toMatchObject({ packet, advisories: [] });
    expect(quiet).toBe('');
    expect(existsSync(packet)).toBe(true);
  });
});
