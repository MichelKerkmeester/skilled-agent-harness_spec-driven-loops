import { copyFileSync, existsSync } from 'node:fs';
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  parseJsonOutput,
  pythonAdvisorScript,
  repoRoot,
  runSkillAdvisorShim,
  type IsolatedCliScope,
} from './skill-advisor-cli-test-utils.js';

interface PythonRecommendation {
  readonly skill?: string;
}

interface CliRecommendation {
  readonly skillId?: string;
}

interface CliRecommendPayload {
  readonly status?: string;
  readonly data?: {
    readonly recommendations?: readonly CliRecommendation[];
  };
}

const scopes: IsolatedCliScope[] = [];
const canonicalSkillGraphDb = join(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite',
);

const parityPrompts: ReadonlyArray<{ readonly skill: string; readonly prompt: string }> = [
  { skill: 'sk-code', prompt: 'Use sk-code to implement a TypeScript test and run the code verification gate.' },
  { skill: 'sk-code', prompt: 'Use sk-code code-review to inspect this pull request for blocker findings first.' },
  { skill: 'system-spec-kit', prompt: 'Use system-spec-kit for the approved spec folder and update implementation tracking.' },
  { skill: 'system-code-graph', prompt: 'Use system-code-graph for structural callers, imports, and blast-radius analysis.' },
  { skill: 'sk-doc', prompt: 'Use sk-doc to rewrite this install guide with clean markdown headings and examples.' },
  { skill: 'sk-git', prompt: 'Use sk-git to create a conventional commit and open a pull request.' },
  { skill: 'sk-prompt', prompt: 'Use sk-prompt to improve this prompt and score it with the CLEAR rubric.' },
  { skill: 'mcp-code-mode', prompt: 'Use mcp-code-mode for external MCP orchestration with search_tools, list_tools, and call_tool_chain.' },
  { skill: 'mcp-chrome-devtools', prompt: 'Use mcp-chrome-devtools to inspect the local page and capture console failures.' },
  { skill: 'system-deep-loop', prompt: 'Use system-deep-loop for a multi-seat planning council with persisted artifacts.' },
];

function pythonFixtureUnavailableReason(): string | null {
  if (!existsSync(pythonAdvisorScript)) return `python advisor script missing at ${pythonAdvisorScript}`;
  const result = spawnSync('python3', ['--version'], {
    cwd: repoRoot,
    env: process.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 5000,
  }) as SpawnSyncReturns<string>;
  if (result.error) return `python3 unavailable: ${result.error.message}`;
  if (result.status !== 0) return `python3 unavailable: ${result.stderr || result.stdout || `exit ${result.status}`}`;
  return null;
}

const pythonUnavailableReason = pythonFixtureUnavailableReason();
const parityIt = pythonUnavailableReason === null ? it : it.skip;

function pythonTopSkill(prompt: string, env: NodeJS.ProcessEnv): string | null {
  const result = spawnSync('python3', [
    pythonAdvisorScript,
    prompt,
    '--force-local',
    '--threshold',
    '0.8',
    '--uncertainty',
    '0.35',
  ], {
    cwd: repoRoot,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 30_000,
    maxBuffer: 1024 * 1024 * 5,
  }) as SpawnSyncReturns<string>;
  if (result.status !== 0) {
    throw new Error(`Python advisor failed: ${result.stderr || result.stdout}`);
  }
  const recommendations = JSON.parse(result.stdout || '[]') as PythonRecommendation[];
  return recommendations[0]?.skill ?? null;
}

function cliTopSkill(prompt: string, scope: IsolatedCliScope): string | null {
  const run = runSkillAdvisorShim([
    'advisor_recommend',
    '--json',
    JSON.stringify({
      prompt,
      options: {
        topK: 1,
        includeAttribution: false,
        includeAbstainReasons: true,
      },
    }),
    '--format',
    'json',
    '--timeout-ms',
    '120000',
  ], scope.env, { timeoutMs: 120_000 });
  expect(run.exitCode, run.stderr).toBe(0);
  const payload = parseJsonOutput<CliRecommendPayload>(run);
  expect(payload.status).toBe('ok');
  return payload.data?.recommendations?.[0]?.skillId ?? null;
}

function seedCliProjection(scope: IsolatedCliScope): void {
  expect(existsSync(canonicalSkillGraphDb)).toBe(true);
  for (const suffix of ['', '-wal', '-shm']) {
    const source = `${canonicalSkillGraphDb}${suffix}`;
    if (existsSync(source)) copyFileSync(source, join(scope.skillAdvisorDbDir, `skill-graph.sqlite${suffix}`));
  }
}

afterEach(async () => {
  while (scopes.length > 0) {
    const scope = scopes.pop();
    if (scope) await cleanupSkillAdvisorScope(scope);
  }
});

describe('skill-advisor CLI local/native parity fixture', () => {
  parityIt(
    pythonUnavailableReason === null
      ? 'keeps top recommendations identical across ten representative prompts'
      : `skips parity fixture: ${pythonUnavailableReason}`,
    () => {
    const scope = createIsolatedCliScope('parity');
    scopes.push(scope);
    seedCliProjection(scope);

    for (const row of parityPrompts) {
      expect(existsSync(join(repoRoot, '.opencode/skills', row.skill, 'SKILL.md'))).toBe(true);
    }

    const mismatches: Array<{ prompt: string; pythonTop: string | null; cliTop: string | null }> = [];
    for (const row of parityPrompts) {
      const pythonTop = pythonTopSkill(row.prompt, scope.env);
      const cliTop = cliTopSkill(row.prompt, scope);
      expect(pythonTop).toBe(row.skill);
      expect(cliTop).toBe(row.skill);
      if (pythonTop !== cliTop) mismatches.push({ prompt: row.prompt, pythonTop, cliTop });
    }

    expect(mismatches).toEqual([]);
  }, 240_000);
});
