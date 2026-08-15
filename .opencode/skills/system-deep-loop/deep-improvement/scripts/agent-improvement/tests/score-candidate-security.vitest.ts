import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const SCORE_SCRIPT = path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs',
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
| deep-improvement | Owns evaluator scoring |
`, 'utf8');
}

// A candidate whose RELATED RESOURCES inject hostile, traversal-shaped command/skill refs.
// The skill ref "deep-improvement/../deep-improvement" is the load-bearing one:
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
| \`deep-improvement/../deep-improvement\` | traversal oracle |
| \`../../evil\` | hostile |
`, 'utf8');
}

function runScore(candidatePath: string, extraArgs: string[] = [], authoritySource = candidatePath): Record<string, unknown> {
  const targetPath = `${candidatePath}.authority.md`;
  const manifestPath = `${candidatePath}.manifest.jsonc`;
  fs.copyFileSync(authoritySource, targetPath);
  fs.writeFileSync(manifestPath, JSON.stringify({
    targets: [{
      path: targetPath,
      classification: 'canonical',
      profileId: 'authority-profile',
      evaluatorAgentName: 'authority-agent',
      evaluatorEpoch: 'epoch-7',
    }],
  }), 'utf8');
  const output = execFileSync('node', [
    SCORE_SCRIPT,
    `--candidate=${candidatePath}`,
    `--target=${targetPath}`,
    `--manifest=${manifestPath}`,
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

// The cache filename is derived from the inputHash, but the cached blob was
// returned verbatim without re-checking its embedded inputHash. A tampered/mismatched cache
// entry must be treated as a cache MISS and the score recomputed, never trusted.
describe('score-candidate cache read-integrity', () => {
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

// The system-fitness scorer interpolated evaluator command/skill refs into
// fs.existsSync without sanitization, a traversal-based existence oracle. Hostile refs must
// be counted as orphaned (present in total, never in valid) so they gain no validation
// credit and cannot probe arbitrary filesystem paths.
describe('scoreDimSystemFitness resource-ref sanitization', () => {
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
    // None may count as valid: the "deep-improvement/../deep-improvement" skill
    // ref resolves to a real file when interpolated raw, so a valid count above 0 would mean
    // the existence oracle is still live.
    expect(refsDetail.valid).toBe(0);
    expect(refsDetail.pass).toBe(false);
  });
});

describe('score-candidate evaluator authority', () => {
  it('ignores candidate frontmatter when selecting evaluator identity and rubric source', () => {
    const candidatePath = path.join(tmpDir, 'candidate-controlled.md');
    const authoritySource = path.join(tmpDir, 'authority-source.md');
    writeScorableCandidate(candidatePath, 'candidate-selected-evaluator');
    writeScorableCandidate(authoritySource, 'trusted-authority-source');

    const result = runScore(candidatePath, ['--no-cache'], authoritySource);

    expect(result.status).toBe('scored');
    expect(result.evaluatorProfileId).toBe('authority-profile');
    expect(result.evaluatorAgentName).toBe('authority-agent');
    expect(result.evaluatorEpoch).toBe('epoch-7');
    expect(result.evaluatorSourcePath).toBe(`${candidatePath}.authority.md`);
    expect(result.evaluatorAgentName).not.toBe('candidate-selected-evaluator');
  });

  it('fails closed when no evaluator authority manifest is supplied', () => {
    const candidatePath = path.join(tmpDir, 'missing-authority.md');
    writeScorableCandidate(candidatePath);

    const result = spawnSync('node', [SCORE_SCRIPT, `--candidate=${candidatePath}`, '--no-cache'], {
      cwd: WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: 'infra_failure',
      failureModes: ['evaluator-authority-failure'],
    });
  });
});
