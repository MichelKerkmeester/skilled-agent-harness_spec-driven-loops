// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Recommend Compiled-Route Option Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock('node:child_process', () => ({ execFileSync: mockedChild.execFileSync }));

import { frontDoorReadsPromptFromStdin, handleAdvisorRecommend } from '../../handlers/advisor-recommend.js';
import { MODE_COMMANDS } from '../../lib/command-attach.js';
import { advisorPromptCache } from '../../lib/prompt-cache.js';

const COMPILED_ROUTING_FLAG = 'SPECKIT_COMPILED_ROUTING';
const prompt = 'Implement a TypeScript feature with focused tests.';
const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_PATH = resolve(HERE, '../../scripts/routing-accuracy/command-prompts.jsonl');

type RecommendResponse = Awaited<ReturnType<typeof handleAdvisorRecommend>>;
type ResponsePayload = {
  data?: {
    recommendations?: Array<{ skillId: string; command?: string; needsMode?: boolean }>;
    cache?: { hit: boolean };
  };
};
type CorpusRow = { id: string; split: string; prompt: string };

function responseData(response: RecommendResponse): ResponsePayload {
  return JSON.parse(response.content[0]?.text ?? '{}') as ResponsePayload;
}

function compiledRouteCallCount(): number {
  return mockedChild.execFileSync.mock.calls.filter(([, args]) => (
    Array.isArray(args)
      && args.some((argument) => (
        typeof argument === 'string' && argument.endsWith('compiled-route.cjs')
      ))
  )).length;
}

function callsCompiledRoute(): boolean {
  return compiledRouteCallCount() > 0;
}

describe('advisor_recommend compiled-route option', () => {
  let previousCompiledRoutingFlag: string | undefined;

  beforeEach(() => {
    previousCompiledRoutingFlag = process.env[COMPILED_ROUTING_FLAG];
    delete process.env[COMPILED_ROUTING_FLAG];
    vi.clearAllMocks();
    mockedChild.execFileSync.mockReturnValue(JSON.stringify({
      action: 'route',
      hubId: 'sk-code',
      targets: ['quality'],
      servingAuthority: 'compiled',
      fingerprint: 'abc123',
      generation: 3,
    }));
  });

  afterEach(() => {
    if (previousCompiledRoutingFlag === undefined) {
      delete process.env[COMPILED_ROUTING_FLAG];
    } else {
      process.env[COMPILED_ROUTING_FLAG] = previousCompiledRoutingFlag;
    }
  });

  it('skips compiled-route enrichment on fresh and cached results when requested', async () => {
    const withoutOption = await handleAdvisorRecommend({
      prompt,
      options: { includeAttribution: true },
    });
    expect(responseData(withoutOption).data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(callsCompiledRoute()).toBe(true);

    mockedChild.execFileSync.mockClear();
    const withoutCompiledRoute = await handleAdvisorRecommend({
      prompt,
      options: { includeCompiledRoute: false },
    });
    expect(responseData(withoutCompiledRoute).data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(responseData(withoutCompiledRoute).data?.cache?.hit).toBe(false);
    expect(callsCompiledRoute()).toBe(false);

    const cachedWithoutCompiledRoute = await handleAdvisorRecommend({
      prompt,
      options: { includeCompiledRoute: false },
    });
    expect(responseData(cachedWithoutCompiledRoute).data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(responseData(cachedWithoutCompiledRoute).data?.cache?.hit).toBe(true);
    expect(callsCompiledRoute()).toBe(false);
  });

  it('sends the prompt to the compiled-route front door on stdin, never in argv', async () => {
    await handleAdvisorRecommend({ prompt, options: { includeAttribution: true } });
    const call = mockedChild.execFileSync.mock.calls.find(([, args]) => (
      Array.isArray(args) && args.some((argument) => typeof argument === 'string' && argument.endsWith('compiled-route.cjs'))
    ));
    expect(call).toBeDefined();
    if (!call) return;
    const [, args, options] = call as [string, string[], { input?: string }];
    expect(args).toContain('--prompt-stdin');
    expect(args).not.toContain(prompt);
    expect(options.input).toBe(prompt);
  });

  it('looks up the route for the first recommendation alone when asked to', async () => {
    const hubPrompt = 'create a new agent for code review';
    await handleAdvisorRecommend({ prompt: hubPrompt, options: { includeCompiledRoute: true } });
    const everyHub = compiledRouteCallCount();
    expect(everyHub, 'the prompt ranks more than one hub').toBeGreaterThan(1);

    mockedChild.execFileSync.mockClear();
    const topOnly = responseData(await handleAdvisorRecommend({
      prompt: hubPrompt,
      options: { includeCompiledRoute: true, compiledRouteTopOnly: true },
    })).data?.recommendations ?? [];
    expect(compiledRouteCallCount()).toBeLessThanOrEqual(1);
    expect(topOnly.slice(1).every((row) => !('compiledRoute' in row))).toBe(true);
  });

  it('never offers one command through both its own row and the owning hub', async () => {
    const command = '/create:agent';
    const mode = Object.entries(MODE_COMMANDS['sk-doc']).find(([, value]) => value === command)?.[0];
    expect(mode, 'sk-doc declares a mode for /create:agent').toBeTruthy();
    mockedChild.execFileSync.mockReturnValue(JSON.stringify({
      action: 'route',
      hubId: 'sk-doc',
      selectionKind: 'single',
      targets: [{ workflowMode: mode }],
    }));

    // The command row ranks beside the hub here, so the hub stays silent.
    const both = responseData(await handleAdvisorRecommend({
      prompt: 'create a new agent for code review',
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    expect(both.map((row) => row.skillId)).toContain('create:agent');
    const hubBesideRow = both.find((row) => row.skillId === 'sk-doc');
    expect(hubBesideRow, 'the hub still ranks').toBeDefined();
    expect(hubBesideRow?.command).toBeUndefined();

    // With no command row in the result the same route does carry the command,
    // which is what proves the silence above came from the collision.
    const hubOnly = responseData(await handleAdvisorRecommend({
      prompt: 'Write a README for the payments module',
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    expect(hubOnly.map((row) => row.skillId)).not.toContain('create:agent');
    expect(hubOnly.find((row) => row.skillId === 'sk-doc')?.command).toBe(command);
  });

  it('lets the top hub carry its command under every request shape', async () => {
    const corpusRow = readFileSync(CORPUS_PATH, 'utf8')
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line) as CorpusRow)
      .find((row) => row.id === 'cmd-create-agent-plain-tune-01');
    expect(corpusRow, 'the corpus holds the create-agent row').toBeDefined();
    if (!corpusRow) return;
    expect(corpusRow.split).toBe('tune');

    const command = '/create:agent';
    const mode = Object.entries(MODE_COMMANDS['sk-doc']).find(([, value]) => value === command)?.[0];
    expect(mode, 'sk-doc declares a mode for /create:agent').toBeTruthy();
    mockedChild.execFileSync.mockReturnValue(JSON.stringify({
      action: 'route',
      hubId: 'sk-doc',
      selectionKind: 'single',
      targets: [{ workflowMode: mode }],
    }));

    const topOnly = responseData(await handleAdvisorRecommend({
      prompt: corpusRow.prompt,
      options: { includeCompiledRoute: true, compiledRouteTopOnly: true },
    })).data?.recommendations ?? [];
    expect(topOnly[0]?.skillId).toBe('sk-doc');
    expect(topOnly[0]?.command).toBe(command);
    expect(topOnly.slice(1).map((row) => row.skillId)).toContain('create:agent');

    const everyRow = responseData(await handleAdvisorRecommend({
      prompt: corpusRow.prompt,
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    expect(everyRow[0]?.skillId).toBe('sk-doc');
    expect(everyRow[0]?.command).toBe(command);
    expect(everyRow[0]?.command).toBe(topOnly[0]?.command);
  });

  it('marks a hub that needs a mode without marking a hub that has none', async () => {
    mockedChild.execFileSync.mockReturnValue(JSON.stringify({
      action: 'defer',
      hubId: 'sk-doc',
      selectionKind: null,
      targets: [],
    }));

    const withModeFlag = responseData(await handleAdvisorRecommend({
      prompt: 'Use the sk-doc skill to write a README for the ledger module',
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    const skDoc = withModeFlag.find((row) => row.skillId === 'sk-doc');
    expect(skDoc, 'sk-doc ranks for the request').toBeDefined();
    expect(skDoc?.needsMode).toBe(true);
    expect(skDoc?.command).toBeUndefined();

    const withoutNamedHub = responseData(await handleAdvisorRecommend({
      prompt: 'Write a README for the ledger module',
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    const guessedSkDoc = withoutNamedHub.find((row) => row.skillId === 'sk-doc');
    expect(guessedSkDoc, 'sk-doc still ranks without being named').toBeDefined();
    expect(guessedSkDoc).not.toHaveProperty('needsMode');

    mockedChild.execFileSync.mockReturnValue(JSON.stringify({
      action: 'defer',
      hubId: 'sk-code',
      selectionKind: null,
      targets: [],
    }));

    const withoutModeFlag = responseData(await handleAdvisorRecommend({
      prompt: 'Implement a TypeScript feature with focused tests for the ledger.',
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    const skCode = withoutModeFlag.find((row) => row.skillId === 'sk-code');
    expect(skCode, 'sk-code ranks for the request').toBeDefined();
    expect(skCode).not.toHaveProperty('needsMode');
  });

  // An iteration count asks for the loop itself, while depth wording asks for
  // care inside one pass, so the same review target lands on different hubs.
  it('sends a review with an iteration count to the deep loop and a thorough review to sk-code', async () => {
    advisorPromptCache.clear();
    mockedChild.execFileSync.mockImplementation((_file: string, args: unknown) => (
      JSON.stringify(Array.isArray(args) && args.includes('system-deep-loop')
        ? { action: 'route', hubId: 'system-deep-loop', selectionKind: 'single', targets: [{ workflowMode: 'review' }] }
        : { action: 'defer', hubId: 'sk-code', selectionKind: null, targets: [] })
    ));

    const loop = responseData(await handleAdvisorRecommend({
      prompt: 'run 5 review iterations on the parser',
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    expect(loop[0]?.skillId).toBe('system-deep-loop');
    expect(loop[0]?.command).toBe('/deep:review');

    const singlePass = responseData(await handleAdvisorRecommend({
      prompt: 'do a thorough code review of the parser',
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    expect(singlePass[0]?.skillId).toBe('sk-code');
  });

  it('recognizes only a front door that reads the prompt from stdin', () => {
    const dir = mkdtempSync(join(tmpdir(), 'front-door-'));
    try {
      writeFileSync(join(dir, 'current.cjs'), "const promptFromStdin = args.includes('--prompt-stdin');\n");
      writeFileSync(join(dir, 'older.cjs'), "const promptIdx = args.indexOf('--prompt');\n");
      expect(frontDoorReadsPromptFromStdin(join(dir, 'current.cjs'))).toBe(true);
      expect(frontDoorReadsPromptFromStdin(join(dir, 'older.cjs'))).toBe(false);
      expect(frontDoorReadsPromptFromStdin(join(dir, 'missing.cjs'))).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('keeps a command typed in a pasted reply off the task on a miss and a hit', async () => {
    advisorPromptCache.clear();
    const leakPrompt = 'Earlier you replied: Run /doctor:sk-code quality. Now: Refactor the session store module to remove duplicated locking code';

    const miss = responseData(await handleAdvisorRecommend({
      prompt: leakPrompt,
      options: { includeCompiledRoute: true },
    })).data;
    const hit = responseData(await handleAdvisorRecommend({
      prompt: leakPrompt,
      options: { includeCompiledRoute: true },
    })).data;

    expect(miss?.cache?.hit).toBe(false);
    expect(hit?.cache?.hit).toBe(true);
    for (const data of [miss, hit]) {
      expect(data?.recommendations?.[0]?.skillId).toBe('sk-code');
      expect(data?.recommendations?.[0]?.command).not.toBe('/doctor:sk-code quality');
    }
  });

  it('routes a pasted reply the same as the plain task', async () => {
    advisorPromptCache.clear();
    const plainTask = 'Refactor the session store module to remove duplicated locking code';
    const pastedPrompt = `Earlier you replied: I ran /deep:review on the hook changes. Now: ${plainTask}`;
    // The answer depends on the text the front door reads, so a prompt that still
    // carries the pasted reply gets a different route than the task alone.
    mockedChild.execFileSync.mockImplementation((_file: string, _args: unknown, options?: { input?: string }) => (
      JSON.stringify(options?.input?.includes('/deep:review')
        ? { action: 'route', hubId: 'sk-code', selectionKind: 'single', targets: [{ workflowMode: 'sk-code-review' }] }
        : { action: 'defer', hubId: 'sk-code', selectionKind: null, targets: [] })
    ));

    const pasted = responseData(await handleAdvisorRecommend({
      prompt: pastedPrompt,
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];
    const plain = responseData(await handleAdvisorRecommend({
      prompt: plainTask,
      options: { includeCompiledRoute: true },
    })).data?.recommendations ?? [];

    const shape = (rows: typeof pasted) => rows.map((row) => ({
      skillId: row.skillId,
      compiledRoute: (row as { compiledRoute?: unknown }).compiledRoute ?? null,
      command: row.command ?? null,
    }));
    expect(pasted.length).toBeGreaterThan(0);
    expect(shape(pasted)).toEqual(shape(plain));
    const frontDoorInputs = mockedChild.execFileSync.mock.calls
      .filter(([, args]) => Array.isArray(args) && args.some((argument) => (
        typeof argument === 'string' && argument.endsWith('compiled-route.cjs')
      )))
      .map(([, , options]) => (options as { input?: string } | undefined)?.input);
    expect(frontDoorInputs.length).toBeGreaterThan(0);
    expect(frontDoorInputs.every((input) => input === plainTask)).toBe(true);
  });
});
