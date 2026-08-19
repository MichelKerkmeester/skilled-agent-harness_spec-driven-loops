import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AppendOnlyLedger } from '../../lib/authorized-ledger/index.js';
import { createDeepResearchEventRegistry } from '../../lib/deep-research-ledger-schema/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'append-mode-event.cjs');

type CliResult = {
  exitCode: number | null;
  json: Record<string, unknown>;
  rawStdout: string;
  stderr: string;
};

function runCli(args: string[]): CliResult {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
  });
  const stdout = (result.stdout ?? '').trim();
  const lastLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let json: Record<string, unknown> = {};
  try {
    json = JSON.parse(lastLine);
  } catch {
    json = { raw: lastLine };
  }
  return {
    exitCode: result.status,
    json,
    rawStdout: stdout,
    stderr: result.stderr ?? '',
  };
}

const temporaryDirectories: string[] = [];

function createTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), `append-mode-event-cli-${prefix}-`));
  temporaryDirectories.push(dir);
  return dir;
}

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const dir = temporaryDirectories.pop();
    if (dir) {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup failures
      }
    }
  }
});

describe('append-mode-event CLI subprocess execution', () => {
  it('appends a plain JSON event record to deep-research ledger and exits 0', async () => {
    const runDir = createTempDir('happy-research');
    const eventJsonPath = join(runDir, 'event.json');

    const sampleEvent = {
      stem: 'deep_research.run_initialized',
      scope: {
        runId: 'run-cli-001',
        lineageId: 'lineage-cli-001',
      },
      data: {
        generation: 1,
        charterDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        configDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        executorFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        replayFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        maxIterations: 10,
        convergencePolicyVersion: '1.0.0',
      },
    };

    writeFileSync(eventJsonPath, JSON.stringify(sampleEvent, null, 2), 'utf8');

    const result = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      eventJsonPath,
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.json.ok).toBe(true);
    expect(result.json.projectionRefreshed).toBe(true);
    expect(result.json.projectionError).toBeNull();

    const receipt = result.json.receipt as Record<string, unknown>;
    expect(receipt).toBeDefined();
    expect(receipt.ledgerId).toBe('deep-research-ledger');
    expect(receipt.sequence).toBe(1);
    expect(receipt.eventType).toBe('deep-research.ledger.run-initialized');

    // Read the event back directly from the ledger on disk to verify it landed
    const registry = createDeepResearchEventRegistry();
    const ledger = new AppendOnlyLedger({
      rootDirectory: runDir,
      ledgerId: 'deep-research-ledger',
      auditLedgerId: 'deep-research-audit-ledger',
      authorityProvider: () => ({ state: 'legacy_authoritative', epoch: 1 }),
    }, registry);

    const events = await ledger.readVerifiedEvents();
    expect(events).toHaveLength(1);
    expect(events[0].frame.sequence).toBe(1);
    expect(events[0].event.effective.envelope.event_type).toBe('deep-research.ledger.run-initialized');
    expect(events[0].event.effective.envelope.payload.stem).toBe('deep_research.run_initialized');

    // Verify the projected legacy state file exists and has valid contents
    const projectedPath = join(runDir, 'research', 'deep-research-state.jsonl');
    expect(existsSync(projectedPath)).toBe(true);
    const projectedContent = readFileSync(projectedPath, 'utf8').trim();
    const projectedRow = JSON.parse(projectedContent);
    expect(projectedRow.type).toBe('config');
    expect(projectedRow.topic).toBe('run-cli-001');
    expect(projectedRow.maxIterations).toBe(10);
    expect(projectedRow.generation).toBe(1);
  });

  it('supports sequential appends across multiple CLI invocations', async () => {
    const runDir = createTempDir('sequential');

    const event1Path = join(runDir, 'event1.json');
    const event1 = {
      stem: 'deep_research.run_initialized',
      scope: {
        runId: 'run-seq-1',
        lineageId: 'lineage-seq-1',
      },
      data: {
        generation: 1,
        charterDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        configDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        executorFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        replayFingerprint: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        maxIterations: 10,
        convergencePolicyVersion: '1.0.0',
      },
    };
    writeFileSync(event1Path, JSON.stringify(event1, null, 2), 'utf8');

    const result1 = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      event1Path,
    ]);
    expect(result1.exitCode).toBe(0);
    expect(result1.json.projectionRefreshed).toBe(true);
    expect(result1.json.projectionError).toBeNull();
    expect((result1.json.receipt as Record<string, unknown>).sequence).toBe(1);

    const event2Path = join(runDir, 'event2.json');
    const event2 = {
      stem: 'deep_research.question_registered',
      scope: {
        runId: 'run-seq-1',
        lineageId: 'lineage-seq-1',
        questionId: 'question-1',
      },
      data: {
        normalizedQuestionDigest: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        dependencyQuestionIds: [],
        requiredSourceClasses: ['academic-paper'],
        disconfirmingQueryRecipeIds: [],
        budgetRef: 'budget-001',
      },
    };
    writeFileSync(event2Path, JSON.stringify(event2, null, 2), 'utf8');

    const result2 = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      event2Path,
    ]);
    expect(result2.exitCode).toBe(0);
    expect(result2.json.projectionRefreshed).toBe(true);
    expect(result2.json.projectionError).toBeNull();
    expect((result2.json.receipt as Record<string, unknown>).sequence).toBe(2);

    const registry = createDeepResearchEventRegistry();
    const ledger = new AppendOnlyLedger({
      rootDirectory: runDir,
      ledgerId: 'deep-research-ledger',
      auditLedgerId: 'deep-research-audit-ledger',
      authorityProvider: () => ({ state: 'legacy_authoritative', epoch: 1 }),
    }, registry);

    const events = await ledger.readVerifiedEvents();
    expect(events).toHaveLength(2);
    expect(events[0].frame.sequence).toBe(1);
    expect(events[1].frame.sequence).toBe(2);

    // Verify sequential projected rows on disk
    const projectedPath = join(runDir, 'research', 'deep-research-state.jsonl');
    expect(existsSync(projectedPath)).toBe(true);
    const lines = readFileSync(projectedPath, 'utf8').trim().split(/\r?\n/).filter(Boolean);
    expect(lines).toHaveLength(2);
    const row1 = JSON.parse(lines[0]);
    const row2 = JSON.parse(lines[1]);
    expect(row1.type).toBe('config');
    expect(row1.topic).toBe('run-seq-1');
    expect(row2.type).toBe('event');
    expect(row2.event).toBe('question_registered');
    expect(row2.questionId).toBe('question-1');
  });

  it('exits with status 1 when event JSON file does not exist', () => {
    const runDir = createTempDir('missing-file');
    const result = runCli([
      '--mode',
      'deep-research',
      '--run-directory',
      runDir,
      '--event-json',
      join(runDir, 'nonexistent.json'),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.json.ok).toBe(false);
    expect(result.json.code).toBe('INPUT_ERROR');
  });
});
