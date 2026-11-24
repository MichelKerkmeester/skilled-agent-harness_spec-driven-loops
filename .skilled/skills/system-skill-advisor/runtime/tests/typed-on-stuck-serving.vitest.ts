// ───────────────────────────────────────────────────────────────
// MODULE: Typed Command On Stuck Run Serving Tests
// ───────────────────────────────────────────────────────────────

// A typed command outranks the stuck-run diagnosis on the served head, because
// the reader named the workflow they want and the diagnosis is only a guess.
// These cases drive the real advisor_recommend handler, so the compiled-route
// attach and the typed pass run in the order a caller sees them. Only the
// front-door subprocess is stubbed, with the shape it emits for a review route.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockedChild = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock('node:child_process', () => ({ execFileSync: mockedChild.execFileSync }));

import { handleAdvisorRecommend } from '../handlers/advisor-recommend.js';
import { attachCommand } from '../lib/command-attach.js';
import { advisorPromptCache } from '../lib/prompt-cache.js';
import type { AdvisorRecommendOutput } from '../schemas/advisor-tool-schemas.js';

type Recommendation = AdvisorRecommendOutput['recommendations'][number];

interface OfferCase {
  readonly id: string;
  readonly prompt: string;
  readonly typedReviewKept?: boolean;
  readonly servedReviewKept?: boolean;
}

const COMPILED_ROUTING_FLAG = 'SPECKIT_COMPILED_ROUTING';
const DEEP_LOOP_HUB = 'system-deep-loop';

// The single review route the front door returns for a deep-loop review prompt.
const REVIEW_ROUTE = {
  hubId: DEEP_LOOP_HUB,
  action: 'route',
  selectionKind: 'single',
  targets: [{
    backendKind: 'runtime-loop-type',
    packetId: 'deep-review',
    packetKind: 'workflow',
    runtimeDiscriminator: 'review',
    skillId: DEEP_LOOP_HUB,
    workflowMode: 'review',
  }],
  effectivePolicyHash: 'test-policy-hash',
  generation: 4,
};

const FIXTURE_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'deep-loop-offer-cases.json');
const typedCases = (JSON.parse(readFileSync(FIXTURE_PATH, 'utf8')) as { cases: OfferCase[] }).cases
  .filter((entry) => entry.typedReviewKept !== undefined);

// The served answer lives in the fixture beside the gate answer, so a single row
// pins both layers and they cannot drift apart. The two differ on the stuck case:
// the gate swaps the review for the diagnosis, and the typed pass then puts the
// reader's /deep:review back.

function hubArgument(args: unknown): string | undefined {
  if (!Array.isArray(args)) return undefined;
  const index = args.indexOf('--hub');
  return index >= 0 ? String(args[index + 1]) : undefined;
}

function deepLoopRouteCalls(): number {
  return mockedChild.execFileSync.mock.calls.filter(([, args]) => hubArgument(args) === DEEP_LOOP_HUB).length;
}

async function servedHead(prompt: string): Promise<Recommendation> {
  const response = await handleAdvisorRecommend({ prompt });
  const payload = JSON.parse(response.content[0]?.text ?? '{}') as { data?: AdvisorRecommendOutput };
  const head = payload.data?.recommendations?.[0];
  expect(head).toBeDefined();
  // A shifted ranking would leave the typed pass nothing to do, so the head
  // has to be the deep-loop hub for any of the assertions below to mean much.
  expect(head?.skillId).toBe(DEEP_LOOP_HUB);
  return head as Recommendation;
}

describe('typed command against the stuck-run diagnosis on the served head', () => {
  let previousCompiledRoutingFlag: string | undefined;

  beforeEach(() => {
    previousCompiledRoutingFlag = process.env[COMPILED_ROUTING_FLAG];
    delete process.env[COMPILED_ROUTING_FLAG];
    advisorPromptCache.clear();
    vi.clearAllMocks();
    mockedChild.execFileSync.mockImplementation((_command: unknown, args: unknown) => JSON.stringify(
      hubArgument(args) === DEEP_LOOP_HUB
        ? REVIEW_ROUTE
        : { servingAuthority: 'legacy', hubId: hubArgument(args) },
    ));
  });

  afterEach(() => {
    if (previousCompiledRoutingFlag === undefined) {
      delete process.env[COMPILED_ROUTING_FLAG];
    } else {
      process.env[COMPILED_ROUTING_FLAG] = previousCompiledRoutingFlag;
    }
  });

  it('serves the typed /deep:review over the diagnosis a stuck complaint earns', async () => {
    const prompt = 'my deep review run is stuck, /deep:review again';
    expect(attachCommand(DEEP_LOOP_HUB, REVIEW_ROUTE, prompt)).toBe('/doctor:deep-loop');

    const head = await servedHead(prompt);

    expect(deepLoopRouteCalls()).toBeGreaterThan(0);
    expect(head.compiledRoute).toBeDefined();
    expect(head).toEqual(expect.objectContaining({
      command: '/deep:review',
      policy: 'ask',
      ownerSkillId: DEEP_LOOP_HUB,
      typed: true,
    }));
  });

  it('serves a typed command that carries a mode suffix with the ask policy', async () => {
    const prompt = '/deep:review:confirm the auth module';
    expect(attachCommand(DEEP_LOOP_HUB, REVIEW_ROUTE, prompt)).toBe('/deep:review');

    const head = await servedHead(prompt);

    expect(head.compiledRoute).toBeDefined();
    expect(head).toEqual(expect.objectContaining({
      command: '/deep:review',
      policy: 'ask',
      typed: true,
    }));
  });

  it.each([
    "don't run /deep:review, explain the review loop",
    'what does /deep:review do?',
    'see (/deep:review.md) for the flags',
  ])('serves no typed command when the prompt only mentions it: %s', async (prompt) => {
    const head = await servedHead(prompt);

    expect(head.typed).toBeUndefined();
    expect(head.command).not.toBe('/deep:review');
  });

  it('keeps the diagnosis on an untyped stuck complaint', async () => {
    const head = await servedHead('my deep review run is stuck');

    expect(deepLoopRouteCalls()).toBeGreaterThan(0);
    expect(head.compiledRoute).toBeDefined();
    expect(head.command).toBe('/doctor:deep-loop');
    expect(head.policy).toBe('run');
    expect(head.typed).toBeUndefined();
  });

  // An absent column is not an expected false. It says nobody decided what the
  // served head should carry, so the case names no expectation and must fail here
  // rather than pass on a comparison against undefined.
  it('marks every typed fixture case with its served answer', () => {
    expect(typedCases.length).toBeGreaterThan(0);
    expect(typedCases.every((entry) => entry.servedReviewKept !== undefined)).toBe(true);
  });

  it.each(typedCases.map((entry) => [entry.id, entry] as const))(
    'serves the fixture typed case %s as expected',
    async (_id, entry) => {
      const head = await servedHead(entry.prompt);

      expect(head.command === '/deep:review').toBe(entry.servedReviewKept);
    },
  );
});
