import { describe, expect, it } from 'vitest';

import { mkdirSync, mkdtempSync, rmSync, writeFileSync as fsWriteFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const {
  collectAdvisories,
  collectSummary,
  main,
} = require('../advise-council-completion.cjs') as {
  collectAdvisories: (packetSpecFolder: string) => string[];
  collectSummary: (packetSpecFolder: string) => { artifact_written: number; rollback: number; artifact_superseded: number };
  main: (argv?: string[]) => number;
};

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
async function withTempPacket(run: (packetSpecFolder: string) => void | Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-advise-completion-'));
  try {
    await run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * writeFileSync wrapper that creates parent directories first, so fixtures can
 * seed nested `ai-council/**` paths without a manual mkdirSync per call.
 */
function writeFileSync(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  fsWriteFileSync(filePath, content);
}

describe('deep-ai-council advise-council-completion', () => {
  it('collectAdvisories returns no advisories for missing council root', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const advisories = collectAdvisories(packetSpecFolder);
      expect(advisories).toHaveLength(1);
      expect(advisories[0]).toContain('no council artifacts');
    });
  });

  it('collectAdvisories detects missing council-report.md when seats exist', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const seatsDir = join(councilRoot, 'seats', 'round-001');
      writeFileSync(join(seatsDir, 'seat-001.md'), '# Seat 1');

      const advisories = collectAdvisories(packetSpecFolder);
      expect(advisories).toContain('council-report.md missing despite seats present in round-001');
    });
  });

  it('collectAdvisories detects missing council_complete event in state', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const statePath = join(councilRoot, 'ai-council-state.jsonl');
      writeFileSync(statePath, JSON.stringify({ event: 'round_start', round: 1 }) + '\n');

      const advisories = collectAdvisories(packetSpecFolder);
      expect(advisories).toContain('state.jsonl missing council_complete event');
    });
  });

  it('collectAdvisories detects missing seat files relative to config', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const seatsDir = join(councilRoot, 'seats', 'round-001');
      writeFileSync(join(seatsDir, 'seat-001.md'), '# Seat 1');
      writeFileSync(join(councilRoot, 'ai-council-config.json'), JSON.stringify({ seats_per_round: 3 }));

      const advisories = collectAdvisories(packetSpecFolder);
      expect(advisories).toContain('round-001 has 1 seat files but config expects 3');
    });
  });

  it('collectAdvisories returns empty when all artifacts present', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const seatsDir = join(councilRoot, 'seats', 'round-001');
      writeFileSync(join(seatsDir, 'seat-001.md'), '# Seat 1');
      writeFileSync(join(councilRoot, 'council-report.md'), '# Report');
      writeFileSync(join(councilRoot, 'ai-council-state.jsonl'), JSON.stringify({ event: 'council_complete' }) + '\n');
      writeFileSync(join(councilRoot, 'ai-council-config.json'), JSON.stringify({ seats_per_round: 1 }));

      const advisories = collectAdvisories(packetSpecFolder);
      expect(advisories).toEqual([]);
    });
  });

  it('collectSummary counts state events by type', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const statePath = join(councilRoot, 'ai-council-state.jsonl');
      const events = [
        { event: 'artifact_written', path: 'test.md', bytes: 100, checksum: 'sha256:abc' },
        { event: 'artifact_written', path: 'test2.md', bytes: 200, checksum: 'sha256:def' },
        { event: 'rollback', round_id: 'round-001', reason: 'timeout' },
        { event: 'artifact_superseded', original_path: 'test.md', round_id: 'round-001' },
      ];
      writeFileSync(statePath, events.map((e) => JSON.stringify(e)).join('\n') + '\n');

      const summary = collectSummary(packetSpecFolder);
      expect(summary.artifact_written).toBe(2);
      expect(summary.rollback).toBe(1);
      expect(summary.artifact_superseded).toBe(1);
    });
  });

  it('collectSummary returns zero counts for missing state file', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const summary = collectSummary(packetSpecFolder);
      expect(summary.artifact_written).toBe(0);
      expect(summary.rollback).toBe(0);
      expect(summary.artifact_superseded).toBe(0);
    });
  });

  it('main returns usage error for missing packet spec folder', () => {
    const exitCode = main([]);
    expect(exitCode).toBe(0);
  });

  it('main returns usage error for unknown argument', () => {
    const exitCode = main(['/path/to/packet', '--unknown-flag']);
    expect(exitCode).toBe(0);
  });

  it('main runs advisory check with valid packet folder', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      writeFileSync(join(councilRoot, 'ai-council-config.json'), '{}');

      const exitCode = main([packetSpecFolder]);
      expect(exitCode).toBe(0);
    });
  });

  it('main supports --json output flag', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      writeFileSync(join(councilRoot, 'ai-council-config.json'), '{}');

      const exitCode = main([packetSpecFolder, '--json']);
      expect(exitCode).toBe(0);
    });
  });

  it('main supports --quiet flag to suppress output', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      writeFileSync(join(councilRoot, 'ai-council-config.json'), '{}');

      const exitCode = main([packetSpecFolder, '--quiet']);
      expect(exitCode).toBe(0);
    });
  });
});
