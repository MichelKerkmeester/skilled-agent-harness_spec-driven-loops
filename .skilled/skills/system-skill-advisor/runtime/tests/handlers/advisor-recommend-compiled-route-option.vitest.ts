// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Recommend Compiled-Route Option Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock('node:child_process', () => ({ execFileSync: mockedChild.execFileSync }));

import { handleAdvisorRecommend } from '../../handlers/advisor-recommend.js';

const COMPILED_ROUTING_FLAG = 'SPECKIT_COMPILED_ROUTING';
const prompt = 'Implement a TypeScript feature with focused tests.';

type RecommendResponse = Awaited<ReturnType<typeof handleAdvisorRecommend>>;
type ResponsePayload = {
  data?: {
    recommendations?: Array<{ skillId: string }>;
    cache?: { hit: boolean };
  };
};

function responseData(response: RecommendResponse): ResponsePayload {
  return JSON.parse(response.content[0]?.text ?? '{}') as ResponsePayload;
}

function callsCompiledRoute(): boolean {
  return mockedChild.execFileSync.mock.calls.some(([, args]) => (
    Array.isArray(args)
      && args.some((argument) => (
        typeof argument === 'string' && argument.endsWith('compiled-route.cjs')
      ))
  ));
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
});
