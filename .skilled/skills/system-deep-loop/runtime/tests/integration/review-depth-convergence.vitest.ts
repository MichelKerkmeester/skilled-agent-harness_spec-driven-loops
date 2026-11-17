// ───────────────────────────────────────────────────────────────────
// MODULE: Review Depth Convergence Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  cleanupNamespace,
  namespaceArgs,
  runScript,
  seedReviewNode,
  uniqueNamespace,
  type ScriptNamespace,
} from '../helpers/spawn-cjs';

const testDir = dirname(fileURLToPath(import.meta.url));
const opencodeRoot = resolve(testDir, '../../../../..');

/**
 * Reads the deep-review workflow YAML fixture from the commands directory.
 */
function readWorkflow(): string {
  return readFileSync(
    resolve(opencodeRoot, 'commands/deep/assets/deep-review.yaml'),
    'utf8',
  );
}

describe('review-depth convergence v2 fixtures', () => {
  it('blocks graphless standard-scope STOP when fallback ledger rows are missing', () => {
    const workflow = readWorkflow();
    expect(workflow).toContain('candidateCoverageGate');
    expect(workflow).toContain('graphlessFallbackGate');
    expect(workflow).toContain('"gateResults":{gate_results_array_json}');
    expect(workflow).toMatch(/gate_results_array_json: "One \{gateId,status,reasonCode,evidenceDigest\} row per legal-stop gate \([^)]*graphlessFallbackGate[^)]*\)/);
  });
});

describe('review minIterations floor from loop state', () => {
  const tempDirs: string[] = [];
  const namespaces: ScriptNamespace[] = [];

  afterEach(async () => {
    while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
    while (namespaces.length > 0) await cleanupNamespace(namespaces.pop() as ScriptNamespace);
  });

  // Each iteration covers the only configured dimension with falling novelty, so the
  // loop reaches a stop candidate; only the configured floor can hold it at CONTINUE.
  function stopDecisionAt(iterationCount: number): Record<string, unknown> {
    const namespace = uniqueNamespace('convergence', 'review');
    namespaces.push(namespace);
    expect(seedReviewNode(namespace).exitCode).toBe(0);
    const base = resolve(testDir, '../.tmp');
    mkdirSync(base, { recursive: true });
    const dir = mkdtempSync(join(base, 'review-floor-'));
    tempDirs.push(dir);
    const configPath = join(dir, 'config.json');
    const stateLogPath = join(dir, 'state.jsonl');
    const registryPath = join(dir, 'registry.json');
    writeFileSync(configPath, JSON.stringify({
      maxIterations: 7,
      convergenceThreshold: 0.1,
      stopPolicy: 'convergence',
      stuckThreshold: 2,
      reviewDimensions: ['correctness'],
      crossReference: { core: [] },
      antiConvergence: { minIterations: 3 },
    }), 'utf8');
    const ratios = [0.3, 0.2, 0.1].slice(0, iterationCount);
    writeFileSync(stateLogPath, ratios.map((newFindingsRatio, index) => JSON.stringify({
      type: 'iteration',
      iteration: index + 1,
      status: 'complete',
      newFindingsRatio,
      dimensions: ['correctness'],
    })).join('\n') + '\n', 'utf8');
    writeFileSync(registryPath, JSON.stringify({
      dimensionCoverage: { correctness: true },
      findingsBySeverity: { P0: 0, P1: 0, P2: 0 },
      openFindings: [],
    }), 'utf8');
    const result = runScript('convergence', [
      ...namespaceArgs(namespace),
      '--stop-decision',
      '--config-path', configPath,
      '--state-log', stateLogPath,
      '--registry-path', registryPath,
    ]);
    expect(result.exitCode).toBe(0);
    return result.json.stop_decision as Record<string, unknown>;
  }

  it('holds a review run with a configured floor of 3 at CONTINUE at iteration 2, then releases it at iteration 3', () => {
    const atTwo = stopDecisionAt(2);
    expect(atTwo.decision).toBe('CONTINUE');
    expect(atTwo.reasonDetail).toBe('minIterationsNotReached');
    const atThree = stopDecisionAt(3);
    expect(atThree.reasonDetail).not.toBe('minIterationsNotReached');
  });
});
