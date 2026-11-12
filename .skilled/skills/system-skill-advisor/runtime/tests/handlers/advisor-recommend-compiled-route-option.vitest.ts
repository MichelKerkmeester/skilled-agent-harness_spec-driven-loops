// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Recommend Compiled-Route Option Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock('node:child_process', () => ({ execFileSync: mockedChild.execFileSync }));

import { frontDoorReadsPromptFromStdin, handleAdvisorRecommend } from '../../handlers/advisor-recommend.js';
import { MODE_COMMANDS } from '../../lib/command-attach.js';

const COMPILED_ROUTING_FLAG = 'SPECKIT_COMPILED_ROUTING';
const prompt = 'Implement a TypeScript feature with focused tests.';

type RecommendResponse = Awaited<ReturnType<typeof handleAdvisorRecommend>>;
type ResponsePayload = {
  data?: {
    recommendations?: Array<{ skillId: string; command?: string }>;
    cache?: { hit: boolean };
  };
};

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
});
