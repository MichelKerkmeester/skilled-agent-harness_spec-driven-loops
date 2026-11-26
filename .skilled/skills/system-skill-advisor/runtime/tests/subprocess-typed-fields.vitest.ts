// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Subprocess Typed Command Fields
// ───────────────────────────────────────────────────────────────

// The Python advisor path is the one the hook takes when no daemon answers, and
// its rows reach the brief head only through the subprocess parser. A parser
// that drops the command fields leaves a typed deep command offering the mode
// choices the reader already made, so these cases feed a synthetic advisor
// payload through the real subprocess runner and then the brief renderer.

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderAdvisorBrief } from '../lib/render.js';
import { runAdvisorSubprocess } from '../lib/subprocess.js';
import { degradedRecommendations } from '../skill-advisor-cli.js';
import { resultFromCliData } from '../../hooks/lib/skill-advisor-cli-fallback.js';

const DIRECTIVES_LABEL = '\nDirectives:';

let workspaceRoot = '';

// The child stands in for the Python advisor: it prints the given payload as its
// stdout, so the case exercises the parser without depending on what the live
// script emits today. The prompt types no command, so the runner adds no typed
// command of its own and each field the case asserts is the one the parser kept.
async function recommendationsFor(payload: unknown[]) {
  const scriptPath = join(workspaceRoot, 'advisor-child.cjs');
  writeFileSync(scriptPath, `
process.stdin.resume();
process.stdin.on('end', () => {
  process.stdout.write(${JSON.stringify(JSON.stringify(payload))});
});
`, 'utf8');
  const result = await runAdvisorSubprocess('review the auth module for regressions', {
    workspaceRoot,
    pythonBin: process.execPath,
    scriptPath,
    timeoutMs: 10000,
  });
  expect(result.errorCode).toBeNull();
  return result.recommendations;
}

function deepReviewRow(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    skill: 'command-spec-kit-deep-review',
    kind: 'command',
    command: '/deep:review',
    policy: 'ask',
    ownerSkillId: 'system-deep-loop',
    confidence: 0.94,
    uncertainty: 0.12,
    passes_threshold: true,
    ...overrides,
  };
}

function headFor(recommendations: Awaited<ReturnType<typeof recommendationsFor>>): string {
  const rendered = renderAdvisorBrief({
    status: 'ok',
    freshness: 'live',
    recommendations,
    metrics: { tokenCap: 80 },
  });
  if (rendered === null) {
    throw new Error('expected a rendered brief');
  }
  return rendered.split(DIRECTIVES_LABEL)[0];
}

beforeEach(() => {
  workspaceRoot = mkdtempSync(join(tmpdir(), 'subprocess-typed-fields-'));
  // The expected head is the interactive one, so a run inside a dispatched child
  // must not turn it into the child form.
  vi.stubEnv('AI_SESSION_CHILD', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(workspaceRoot, { recursive: true, force: true });
});

describe('runAdvisorSubprocess command fields', () => {
  it('keeps the command, policy, owner and typed marker of a typed deep row', async () => {
    const [recommendation] = await recommendationsFor([deepReviewRow({ typed: true })]);

    expect(recommendation).toMatchObject({
      skill: 'command-spec-kit-deep-review',
      command: '/deep:review',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
      typed: true,
    });

    const head = headFor([recommendation!]);
    expect(head).toContain('/deep:review (ask)');
    expect(head).not.toContain('A /deep:review:auto');
  });

  it.each([
    ['the string true', 'true'],
    ['the number one', 1],
  ])('drops a typed marker given as %s', async (_label, typed) => {
    const [recommendation] = await recommendationsFor([deepReviewRow({ typed })]);

    expect(recommendation).not.toHaveProperty('typed');
    expect(recommendation).toMatchObject({ command: '/deep:review', policy: 'ask' });
    expect(headFor([recommendation!])).toContain('A /deep:review:auto (Recommended)');
  });

  it('drops blank command fields instead of printing them', async () => {
    const [recommendation] = await recommendationsFor([
      deepReviewRow({ command: '  ', policy: '', ownerSkillId: ' ' }),
    ]);

    expect(recommendation).not.toHaveProperty('command');
    expect(recommendation).not.toHaveProperty('policy');
    expect(recommendation).not.toHaveProperty('ownerSkillId');
  });
});

// The synthetic rows above prove the parser keeps what it is given, but the live
// Python advisor never names the command it saw: a typed deep command comes back
// as its legacy mode id with no command fields at all. These cases run the real
// script, so a head that still offers the modes on a typed command fails here.
describe('runAdvisorSubprocess against the real Python advisor', () => {
  const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..', '..', '..', '..');

  async function realRecommendations(prompt: string) {
    vi.stubEnv('SPECKIT_SKILL_ADVISOR_FORCE_LOCAL', '1');
    const result = await runAdvisorSubprocess(prompt, { workspaceRoot: repoRoot, timeoutMs: 60000 });
    expect(result.errorCode).toBeNull();
    return result.recommendations;
  }

  function degradedHead(recommendations: Awaited<ReturnType<typeof realRecommendations>>, prompt: string): string {
    const result = resultFromCliData({
      data: { freshness: 'stale', recommendations: degradedRecommendations(recommendations, prompt) } as never,
      options: { maxTokens: 80 } as never,
      startedAt: 0,
      now: () => 1,
    });
    const rendered = renderAdvisorBrief({ ...result, metrics: { tokenCap: 80 } });
    if (rendered === null) throw new Error('expected a rendered brief');
    return rendered.split(DIRECTIVES_LABEL)[0];
  }

  it.each([
    '/deep:review:confirm the auth module',
    'my deep review run is stuck, /deep:review again',
  ])('prints the typed deep command plainly for %s', async (prompt) => {
    const recommendations = await realRecommendations(prompt);

    expect(recommendations[0]).toMatchObject({
      command: '/deep:review',
      policy: 'ask',
      ownerSkillId: 'system-deep-loop',
      typed: true,
    });
    for (const head of [headFor(recommendations), degradedHead(recommendations, prompt)]) {
      expect(head).toContain('system-deep-loop → /deep:review (ask)');
      expect(head).not.toContain('A /deep:review:auto');
    }
  }, 120000);

  // The Python fallback reads no refusal around a typed deep command, because
  // its row is an ask the reader can decline. The degraded rows go through the
  // native typed-command reader, which still reads the refusal and leaves the row
  // unmarked, so the brief keeps the offer's no-loop option.
  it('marks a refused deep command typed in Python and unmarked on the degraded rows', async () => {
    const prompt = 'never run /deep:review on this';
    const recommendations = await realRecommendations(prompt);

    expect(recommendations[0]).toHaveProperty('typed', true);
    expect(degradedRecommendations(recommendations, prompt)[0]).not.toHaveProperty('typed');
  }, 120000);
});
