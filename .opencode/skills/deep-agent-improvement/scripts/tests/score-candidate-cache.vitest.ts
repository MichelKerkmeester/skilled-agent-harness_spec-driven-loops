import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const SCORE_SCRIPT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs',
);

let tmpDir: string;

function writeCandidate(filePath: string, agentName = 'cache-smoke-agent'): void {
  fs.writeFileSync(filePath, `---
name: ${agentName}
mode: subagent
permission:
  edit: allow
---
# Cache Smoke Agent

## 1. CORE WORKFLOW

Read files first and then validate evidence.

## 2. OUTPUT VERIFICATION

□ Evidence is cited

## 3. ANTI-PATTERNS

- **Never** skip verification

## 4. CAPABILITY SCAN

| Tool | Purpose |
| --- | --- |
| \`Read\` | Inspect files |

## 5. RULES

### ALWAYS

- Read files before editing
- Validate outputs before completion

### NEVER

- Skip verification

## 6. RELATED RESOURCES

### Skills

| Skill | Purpose |
| --- | --- |
| deep-agent-improvement | Owns evaluator scoring |
`, 'utf8');
}

function runScore(candidatePath: string, cacheDir: string): Record<string, unknown> {
  const output = execFileSync('node', [
    SCORE_SCRIPT,
    `--candidate=${candidatePath}`,
    `--cache-dir=${cacheDir}`,
  ], {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8',
  });
  return JSON.parse(output) as Record<string, unknown>;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-cache-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('score-candidate cache reproducibility', () => {
  it('returns the same hash and score for identical inputs across two runs', () => {
    const candidatePath = path.join(tmpDir, 'candidate.md');
    const cacheDir = path.join(tmpDir, 'cache');
    writeCandidate(candidatePath);

    const first = runScore(candidatePath, cacheDir);
    const second = runScore(candidatePath, cacheDir);

    expect(second.inputHash).toBe(first.inputHash);
    expect(second.score).toBe(first.score);
    expect(second.dimensions).toEqual(first.dimensions);
  });

  // F-P1-12: the cache key must bind candidate identity (path), so two different
  // candidates can never collide on a single cache entry even with a shared cache dir.
  it('never shares a cache hit between two different candidates', () => {
    const cacheDir = path.join(tmpDir, 'shared-cache');
    const candidateA = path.join(tmpDir, 'candidate-a.md');
    const candidateB = path.join(tmpDir, 'candidate-b.md');
    writeCandidate(candidateA, 'cache-agent-a');
    writeCandidate(candidateB, 'cache-agent-b');

    const resultA = runScore(candidateA, cacheDir);
    const resultB = runScore(candidateB, cacheDir);

    // Distinct candidate identity must produce distinct cache keys.
    expect(resultB.inputHash).not.toBe(resultA.inputHash);
    // Each result reports its own candidate path, never the other's.
    expect(resultA.candidate).toBe(candidateA);
    expect(resultB.candidate).toBe(candidateB);

    // Re-running B must reuse B's own cache entry (same hash, same candidate path),
    // never silently return A's cached payload.
    const resultBAgain = runScore(candidateB, cacheDir);
    expect(resultBAgain.inputHash).toBe(resultB.inputHash);
    expect(resultBAgain.candidate).toBe(candidateB);
    expect(resultBAgain.inputHash).not.toBe(resultA.inputHash);
  });
});
