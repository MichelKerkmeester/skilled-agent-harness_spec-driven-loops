// ───────────────────────────────────────────────────────────────
// TEST: Query-Intent Routing
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';
import { describe, it, expect, vi } from 'vitest';
import { classifyQueryIntent } from '../lib/code-graph-boundary.js';
import { createContentRouter } from '../lib/routing/content-router.js';

function makeEmbeddingFn() {
  return (text: string): number[] => {
    const buckets = Array.from({ length: 64 }, () => 0);
    for (const token of text.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean)) {
      const digest = createHash('sha256').update(token).digest();
      const bucketIndex = digest[0] % buckets.length;
      buckets[bucketIndex] += 1;
    }
    return buckets;
  };
}

function makeRouterContext() {
  return {
    specFolder: '026-graph-and-context-optimization/015-save-flow-planner-first-trim',
    packetLevel: 'L3+' as const,
    existingAnchors: ['phase-1', 'phase-2', 'what-built', 'how-delivered'],
    sessionMeta: {
      packet_kind: 'phase' as const,
      save_mode: 'auto' as const,
      recent_docs_touched: ['implementation-summary.md'],
      recent_anchors_touched: ['what-built'],
      likely_phase_anchor: 'phase-2',
      session_id: 'runtime-routing-test',
    },
  };
}

async function expectIntent(query: string, intent: 'structural' | 'semantic' | 'hybrid') {
  await expect(classifyQueryIntent(query)).resolves.toMatchObject({ intent });
}

// SKIP: requires stable MCP lifecycle harness — see /008 cluster 2
describe.skip('query-intent routing', () => {
  describe('maps semantic queries to semantic intent', () => {
    it('find code queries', async () => { await expectIntent('find code that handles authentication', 'semantic'); });
    it('find retry logic implementation', async () => { await expectIntent('find code related to retry logic', 'semantic'); });
    it('similar to X', async () => { await expectIntent('find functions similar to parseFile', 'semantic'); });
  });

  describe('maps structural queries to structural intent', () => {
    it('what calls', async () => { await expectIntent('what calls parseFile', 'structural'); });
    it('what imports', async () => { await expectIntent('what imports this module', 'structural'); });
    it('show outline', async () => { await expectIntent('show outline of this file', 'structural'); });
    it('file structure', async () => { await expectIntent('show structure of this file', 'structural'); });
    it('what extends', async () => { await expectIntent('what extends BaseClass', 'structural'); });
  });

  describe('maps session queries to hybrid intent', () => {
    it('previous work', async () => { await expectIntent('what was I working on in the previous session', 'hybrid'); });
    it('resume', async () => { await expectIntent('resume my last session', 'hybrid'); });
    it('prior decisions', async () => { await expectIntent('what was the prior decision about auth', 'hybrid'); });
  });
});

// SKIP: requires stable MCP lifecycle harness — see /008 cluster 2
describe.skip('agent routing validates classifier-backed intent mapping', () => {
  describe('semantic queries map to semantic intent', () => {
    it('explain error handling patterns', async () => { await expectIntent('explain error handling patterns', 'semantic'); });
    it('find similar authentication code', async () => { await expectIntent('find similar authentication code', 'semantic'); });
    it('what is the purpose of the budget allocator', async () => { await expectIntent('what is the purpose of the budget allocator', 'semantic'); });
  });

  describe('structural queries map to structural intent', () => {
    it('what calls allocateBudget', async () => { await expectIntent('what calls allocateBudget', 'structural'); });
    it('show outline of session-prime.ts', async () => { await expectIntent('show outline of session-prime.ts', 'structural'); });
    it('what implements the RuntimeInfo interface', async () => { await expectIntent('what implements the RuntimeInfo interface', 'structural'); });
  });

  describe('session queries map to hybrid intent', () => {
    it('resume my previous work', async () => { await expectIntent('resume my previous work', 'hybrid'); });
    it('what was I doing last session', async () => { await expectIntent('what was I doing last session', 'hybrid'); });
  });

  describe('content-oriented queries still map to semantic intent', () => {
    it('explain the hook system purpose', async () => { await expectIntent('explain the hook system purpose', 'semantic'); });
    it('what is the purpose of the token budget', async () => { await expectIntent('what is the purpose of the token budget', 'semantic'); });
    it('where is authentication handled', async () => { await expectIntent('where is authentication handled', 'semantic'); });
  });

  describe('routing is case-insensitive', () => {
    it('WHAT CALLS parseFile → structural', async () => { await expectIntent('WHAT CALLS parseFile', 'structural'); });
    it('Find Similar Code → semantic', async () => { await expectIntent('Find Similar Code', 'semantic'); });
    it('Resume My Session → hybrid', async () => { await expectIntent('Resume My Session', 'hybrid'); });
  });
});

// SKIP: requires stable MCP lifecycle harness — see /008 cluster 2
describe.skip('runtime routing fallback guardrails', () => {
  it('refuses ambiguous save chunks by default instead of invoking Tier 3', async () => {
    const classifyWithTier3 = vi.fn(async () => ({
      category: 'narrative_delivery',
      confidence: 0.8,
      target_doc: 'implementation-summary.md',
      target_anchor: 'how-delivered',
      merge_mode: 'append-as-paragraph',
      reasoning: 'Tier 3 should stay opt-in on planner-first saves.',
    }));
    const router = createContentRouter({
      embedText: makeEmbeddingFn(),
      classifyWithTier3,
    });

    const decision = await router.classifyContent({
      id: 'runtime-route-01',
      text: 'This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.',
      sourceField: 'unknown',
    }, makeRouterContext());

    expect(decision.refusal).toBe(true);
    expect(decision.warningMessage).toContain('operator should specify routeAs');
    expect(classifyWithTier3).not.toHaveBeenCalled();
  });
});
