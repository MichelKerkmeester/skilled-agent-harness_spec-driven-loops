// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Recommend Surface-Hint Option Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock('node:child_process', () => ({ execFileSync: mockedChild.execFileSync }));

import { handleAdvisorRecommend } from '../handlers/advisor-recommend.js';
import { advisorPromptCache } from '../lib/prompt-cache.js';
import { AdvisorRecommendInputSchema } from '../schemas/advisor-tool-schemas.js';

const COMPILED_ROUTING_FLAG = 'SPECKIT_COMPILED_ROUTING';
const MAX_SURFACE_HINT_CHARS = 64;
const SURFACE_HINT = 'WEBFLOW';
// The scorer maps this prompt to sk-code, a compiled-routing hub, so the
// front-door subprocess is reached and its argv is observable.
const prompt = 'Implement a TypeScript feature with focused tests.';

type RecommendResponse = Awaited<ReturnType<typeof handleAdvisorRecommend>>;
type ResponsePayload = {
  data?: {
    recommendations?: Array<{ skillId: string }>;
  };
};

function responseData(response: RecommendResponse): ResponsePayload {
  return JSON.parse(response.content[0]?.text ?? '{}') as ResponsePayload;
}

// Return the argv of the compiled-route front-door call, or undefined when the
// enrichment never shelled out.
function compiledRouteArgs(): string[] | undefined {
  const call = mockedChild.execFileSync.mock.calls.find(([, args]) => (
    Array.isArray(args) && args.some((argument) => (
      typeof argument === 'string' && argument.endsWith('compiled-route.cjs')
    ))
  ));
  if (!call) return undefined;
  return call[1] as string[];
}

describe('advisor_recommend surface-hint option', () => {
  let previousCompiledRoutingFlag: string | undefined;

  beforeEach(() => {
    previousCompiledRoutingFlag = process.env[COMPILED_ROUTING_FLAG];
    delete process.env[COMPILED_ROUTING_FLAG];
    advisorPromptCache.clear();
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

  it('accepts a bounded surface hint and rejects empty and oversized values', () => {
    const accepted = AdvisorRecommendInputSchema.safeParse({
      prompt,
      options: { surfaceHint: SURFACE_HINT },
    });
    expect(accepted.success).toBe(true);
    if (accepted.success) {
      expect(accepted.data.options?.surfaceHint).toBe(SURFACE_HINT);
    }

    expect(AdvisorRecommendInputSchema.safeParse({
      prompt,
      options: { surfaceHint: '' },
    }).success).toBe(false);

    expect(AdvisorRecommendInputSchema.safeParse({
      prompt,
      options: { surfaceHint: 'S'.repeat(MAX_SURFACE_HINT_CHARS + 1) },
    }).success).toBe(false);
  });

  it('forwards the surface hint to the compiled-route front door as its own argv pair', async () => {
    const response = await handleAdvisorRecommend({
      prompt,
      options: { surfaceHint: SURFACE_HINT },
    });
    expect(responseData(response).data?.recommendations?.[0]?.skillId).toBe('sk-code');

    const args = compiledRouteArgs();
    expect(args).toBeDefined();
    if (!args) return;
    const hintIndex = args.indexOf('--surface-hint');
    expect(hintIndex).toBeGreaterThanOrEqual(0);
    expect(args[hintIndex + 1]).toBe(SURFACE_HINT);
  });

  it('omits the surface hint from the front-door argv when no hint is requested', async () => {
    const response = await handleAdvisorRecommend({ prompt });
    expect(responseData(response).data?.recommendations?.[0]?.skillId).toBe('sk-code');

    const args = compiledRouteArgs();
    expect(args).toBeDefined();
    if (!args) return;
    expect(args).not.toContain('--surface-hint');
  });
});
