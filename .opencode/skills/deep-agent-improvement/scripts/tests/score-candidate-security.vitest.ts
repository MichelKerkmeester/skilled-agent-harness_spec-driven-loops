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

// A well-formed candidate that scores numerically (all dimensions scored), used for the
// cache-integrity assertions where a deterministic numeric score matters.
function writeScorableCandidate(filePath: string, agentName = 'security-smoke-agent'): void {
  fs.writeFileSync(filePath, `---
name: ${agentName}
mode: subagent
permission:
  edit: allow
---
# Security Smoke Agent

## 1. CORE WORKFLOW

Read files first and then validate evidence.

## 2. OUTPUT VERIFICATION

Evidence is cited

## 3. ANTI-PATTERNS

- Never skip verification

## 4. CAPABILITY SCAN

| Tool | Purpose |
| --- | --- |
| \`Read\` | Inspect files |

## 5. RULES

### ALWAYS

- Read files before editing

### NEVER

- Skip verification

## 6. RELATED RESOURCES

### Skills

| Skill | Purpose |
| --- | --- |
| deep-agent-improvement | Owns evaluator scoring |
`, 'utf8');
}

// A candidate whose RELATED RESOURCES inject hostile, traversal-shaped command/skill refs.
// The skill ref "deep-agent-improvement/../deep-agent-improvement" is the load-bearing one:
// if interpolated raw into `.opencode/skills/${sk}/SKILL.md` it RESOLVES to a real existing
// SKILL.md, which is exactly the traversal-based existence oracle F017-P2-13b describes. The
// guard must reject it on the separator, so it must NOT count as a valid ref.
function writeHostileRefCandidate(filePath: string, agentName = 'hostile-ref-agent'): void {
  fs.writeFileSync(filePath, `---
name: ${agentName}
mode: subagent
permission:
  edit: allow
---
# Hostile Ref Agent

## 1. CORE WORKFLOW

Read files first and then validate evidence.

## 2. OUTPUT VERIFICATION

Evidence is cited

## 3. ANTI-PATTERNS

- Never skip verification

## 4. CAPABILITY SCAN

| Tool | Purpose |
| --- | --- |
| \`Read\` | Inspect files |

## 5. RULES

### ALWAYS

- Read files before editing

### NEVER

- Skip verification

## 6. RELATED RESOURCES

### Commands

Use \`/../../../../etc/passwd\` to traverse.

### Skills

| Skill | Purpose |
| --- | --- |
| \`deep-agent-improvement/../deep-agent-improvement\` | traversal oracle |
| \`../../evil\` | hostile |
`, 'utf8');
}

function runScore(candidatePath: string, extraArgs: string[] = []): Record<string, unknown> {
  const output = execFileSync('node', [
    SCORE_SCRIPT,
    `--candidate=${candidatePath}`,
    ...extraArgs,
  ], {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8',
  });
  return JSON.parse(output) as Record<string, unknown>;
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-security-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// F017-P2-10: the cache filename is derived from the inputHash, but the cached blob was
// returned verbatim without re-checking its embedded inputHash. A tampered/mismatched cache
// entry must be treated as a cache MISS and the score recomputed, never trusted.
describe('score-candidate cache read-integrity (F017-P2-10)', () => {
  it('rejects a tampered cache entry and recomputes the score', () => {
    const candidatePath = path.join(tmpDir, 'candidate.md');
    const cacheDir = path.join(tmpDir, 'cache');
    writeScorableCandidate(candidatePath);

    const clean = runScore(candidatePath, [`--cache-dir=${cacheDir}`]);
    expect(clean.status).toBe('scored');

    // Tamper the persisted cache entry: forge a wrong embedded inputHash and an absurd
    // score. The filename still matches the legitimate hash, so without the integrity
    // check this forged payload would be served back verbatim.
    const cacheFile = path.join(cacheDir, `${String(clean.inputHash)}.json`);
    const tampered = JSON.parse(fs.readFileSync(cacheFile, 'utf8')) as Record<string, unknown>;
    tampered.inputHash = 'TAMPERED_HASH';
    tampered.score = 99999;
    fs.writeFileSync(cacheFile, `${JSON.stringify(tampered, null, 2)}\n`, 'utf8');

    const reRun = runScore(candidatePath, [`--cache-dir=${cacheDir}`]);
    // The tampered payload must never surface.
    expect(reRun.score).not.toBe(99999);
    expect(reRun.inputHash).not.toBe('TAMPERED_HASH');
    // The recompute must reproduce the legitimate score and hash.
    expect(reRun.score).toBe(clean.score);
    expect(reRun.inputHash).toBe(clean.inputHash);
  });

  it('rejects a cache entry whose status is not scored', () => {
    const candidatePath = path.join(tmpDir, 'candidate-status.md');
    const cacheDir = path.join(tmpDir, 'cache-status');
    writeScorableCandidate(candidatePath, 'status-smoke-agent');

    const clean = runScore(candidatePath, [`--cache-dir=${cacheDir}`]);
    const cacheFile = path.join(cacheDir, `${String(clean.inputHash)}.json`);
    const tampered = JSON.parse(fs.readFileSync(cacheFile, 'utf8')) as Record<string, unknown>;
    // Keep the correct inputHash but downgrade status; a non-scored blob is not trustworthy.
    tampered.status = 'infra_failure';
    tampered.score = 12345;
    fs.writeFileSync(cacheFile, `${JSON.stringify(tampered, null, 2)}\n`, 'utf8');

    const reRun = runScore(candidatePath, [`--cache-dir=${cacheDir}`]);
    expect(reRun.status).toBe('scored');
    expect(reRun.score).not.toBe(12345);
    expect(reRun.score).toBe(clean.score);
  });
});

// F017-P2-13b: scoreDimSystemFitness interpolated candidate-derived command/skill refs into
// fs.existsSync without sanitization, a traversal-based existence oracle. Hostile refs must
// be counted as orphaned (present in total, never in valid) so they gain no validation
// credit and cannot probe arbitrary filesystem paths.
describe('scoreDimSystemFitness resource-ref sanitization (F017-P2-13b)', () => {
  function resourceRefsDetail(result: Record<string, unknown>): Record<string, unknown> {
    const dims = result.dimensions as Array<Record<string, unknown>>;
    const systemFitness = dims.find((d) => d.name === 'systemFitness');
    const details = systemFitness?.details as Array<Record<string, unknown>>;
    return details.find((d) => d.id === 'resource-refs-valid') as Record<string, unknown>;
  }

  it('does not credit a traversal skill ref that would resolve to a real SKILL.md', () => {
    const candidatePath = path.join(tmpDir, 'hostile.md');
    writeHostileRefCandidate(candidatePath);

    const result = runScore(candidatePath, ['--no-cache']);
    expect(result.status).toBe('scored');

    const refsDetail = resourceRefsDetail(result);
    // Three hostile refs are derived (1 command + 2 skills) and all are counted.
    expect(refsDetail.total).toBe(3);
    // None may count as valid: the "deep-agent-improvement/../deep-agent-improvement" skill
    // ref resolves to a real file when interpolated raw, so a valid count above 0 would mean
    // the existence oracle is still live.
    expect(refsDetail.valid).toBe(0);
    expect(refsDetail.pass).toBe(false);
  });
});
