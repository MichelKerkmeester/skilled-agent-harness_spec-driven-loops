---
title: "228 -- Retired runtime shims and inert compatibility flags"
description: "This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior."
audited_post_018: true
phase_018_change: "Validated against phase-018 canonical continuity refactor; keeps the compatibility-only checks for lazy warmup, shadow scoring, novelty, and adaptive fusion."
version: 3.6.0.13
id: implement-and-remove-deprecated-features-retired-runtime-shims
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 228 -- Retired runtime shims and inert compatibility flags

## 1. OVERVIEW

This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior.
- Real user request: `Please validate Retired runtime shims and inert compatibility flags against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts and tell me whether the expected signals are present: Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through SPECKIT_ADAPTIVE_FUSION without consulting retired RSF compatibility flags.`
- Prompt: `Validate retired runtime shims and inert compatibility flags against the targeted runtime and scoring checks.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through SPECKIT_ADAPTIVE_FUSION without consulting retired RSF compatibility flags
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms the deprecated flag surface is compatibility-only and no longer steers production behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a canonical-continuity validation operator, confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts. Verify targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through SPECKIT_ADAPTIVE_FUSION without consulting retired RSF compatibility flags. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts`
2. inspect source-backed assertions or snapshots showing eager warmup stays disabled and deprecated warmup flags only surface as compatibility warnings
3. inspect source-backed assertions or snapshots showing shadow scoring runtime helpers return inert values and retired novelty boost symbols are absent from current source
4. inspect source-backed assertions or snapshots showing hybrid search selects adaptive versus fixed fusion through `SPECKIT_ADAPTIVE_FUSION` without consulting retired RSF compatibility flags

### Expected

Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through `SPECKIT_ADAPTIVE_FUSION` without consulting retired RSF compatibility flags

### Evidence

Command 1 transcript:

```text
$ cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

{"timestamp":"2026-07-02T23:54:44.453Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T23:54:44.472Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T23:54:44.482Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

 Test Files  3 passed (3)
      Tests  470 passed (470)
   Start at  01:54:42
   Duration  1.74s (transform 750ms, setup 17ms, import 731ms, tests 817ms, environment 0ms)
```

Warmup compatibility evidence:

```text
$ rg -n -C 2 "function shouldEagerWarmup|return false|warmup: false|deprecated compatibility flags" "shared/embeddings.ts" "mcp-server/context-server.ts"
mcp-server/context-server.ts-2108-
mcp-server/context-server.ts-2109-  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
mcp-server/context-server.ts:2110:  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
mcp-server/context-server.ts-2111-
mcp-server/context-server.ts-2112-  // Integrity check and module initialization
--
shared/embeddings.ts-359- * Initialization Flow:
shared/embeddings.ts-360- * 1. On first embedding request, get_provider() creates the instance
shared/embeddings.ts:361: * 2. Provider is created without warmup (warmup: false)
shared/embeddings.ts-362- * 3. First actual embedding call triggers model loading
shared/embeddings.ts-363- *
--
shared/embeddings.ts-378- * SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING env vars are inert.
shared/embeddings.ts-379- */
shared/embeddings.ts:380:function shouldEagerWarmup(): boolean {
shared/embeddings.ts:381:  return false;
shared/embeddings.ts-382-}
shared/embeddings.ts-383-
--
shared/embeddings.ts-409-    try {
shared/embeddings.ts-410-      providerInstance = await createEmbeddingsProvider({
shared/embeddings.ts:411:        warmup: false, // No warmup at creation; model loads on first embed call
shared/embeddings.ts-412-      });
shared/embeddings.ts-413-      MODEL_NAME = getProviderModelName(providerInstance);
```

Shadow scoring compatibility evidence:

```text
$ rg -n -C 2 "Shadow scoring runtime is retired|runShadowScoring|return null|logShadowComparison|return false" "mcp-server/lib/eval/shadow-scoring.ts"
351- * Run an alternative scoring algorithm in shadow mode alongside production results.
352- *
353: * Shadow scoring runtime is retired. The SPECKIT_SHADOW_SCORING flag is retained
354- * for compatibility only, so this returns null without running the shadow function.
355- *
--
360- * @param shadowConfig - Configuration including the shadow scoring function.
361- * @returns ShadowComparison when enabled and successful, null when disabled or on error.
362: * @deprecated Shadow scoring runtime is retired; this always returns null.
363- */
364:export async function runShadowScoring(
365-  query: string,
366-  productionResults: ScoredResult[],
--
370-  void productionResults;
371-  void shadowConfig;
372:  return null;
373-}
374-
--
483- * Persist a shadow comparison to the eval database.
484- *
485: * Shadow scoring runtime is retired. The SPECKIT_SHADOW_SCORING flag is retained
486- * for compatibility only, so this returns false immediately without writing.
487- *
--
490- * @deprecated Shadow scoring persistence is retired; this always returns false.
491- */
492:export function logShadowComparison(comparison: ShadowComparison): boolean {
493-  void comparison;
494:  return false;
495-}
```

Novelty retirement evidence:

```text
$ rg -n "novelty|NOVELTY" "mcp-server/lib/scoring/composite-scoring.ts"
(no output; retired novelty symbols are absent)
```

Adaptive fusion evidence:

```text
$ rg -n -C 2 "function isFeatureEnabled|rawFlag === undefined|isAdaptiveFusionEnabled" "shared/algorithms/adaptive-fusion.ts"
95-const RECENCY_BOOST_SCALE = 0.1;
96-
97:function isFeatureEnabled(flagName: string, identity?: string): boolean {
98-  const rawFlag = process.env[flagName]?.toLowerCase();
99-  if (rawFlag === 'false') return false;
100-
101:  const flagEnabled = rawFlag === undefined || rawFlag.trim().length === 0 || rawFlag === 'true';
102-  if (!flagEnabled) return false;
103-
--
127- * @returns True if adaptive fusion is enabled
128- */
129:export function isAdaptiveFusionEnabled(identity?: string): boolean {
130-  return isFeatureEnabled(FEATURE_FLAG, identity);
131-}
```

```text
$ rg -n -C 2 "adaptiveEnabled|adaptiveFuse|SPECKIT_ADAPTIVE_FUSION|RSF" "mcp-server/lib/search/hybrid-search.ts" "shared/algorithms/adaptive-fusion.ts"
shared/algorithms/adaptive-fusion.ts-85-/* --- 3. FEATURE FLAG --- */
shared/algorithms/adaptive-fusion.ts-86-
shared/algorithms/adaptive-fusion.ts:87:const FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION';
shared/algorithms/adaptive-fusion.ts-88-
shared/algorithms/adaptive-fusion.ts-89-/** Proportional weight shift factor applied per document type to fine-tune intent weights.
--
mcp-server/lib/search/hybrid-search.ts-6-// 1. IMPORTS
mcp-server/lib/search/hybrid-search.ts-7-
mcp-server/lib/search/hybrid-search.ts:8:import { adaptiveFuse, getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
mcp-server/lib/search/hybrid-search.ts-9-import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
mcp-server/lib/search/hybrid-search.ts-10-import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
--
mcp-server/lib/search/hybrid-search.ts-1582-    })
mcp-server/lib/search/hybrid-search.ts-1583-      ?? detectedIntent;
mcp-server/lib/search/hybrid-search.ts:1584:    const adaptiveEnabled = isAdaptiveFusionEnabled();
mcp-server/lib/search/hybrid-search.ts-1585-    const documentType = resolveAdaptiveDocumentType(lists.map((list) => ({
mcp-server/lib/search/hybrid-search.ts-1586-      results: list.results as Array<Record<string, unknown>>,
mcp-server/lib/search/hybrid-search.ts-1587-    })));
mcp-server/lib/search/hybrid-search.ts:1588:    const fusionWeights = adaptiveEnabled
mcp-server/lib/search/hybrid-search.ts-1589-      ? getAdaptiveWeights(intent, documentType)
mcp-server/lib/search/hybrid-search.ts-1590-      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
--
mcp-server/lib/search/hybrid-search.ts-1653-    const vectorList = fusionLists.find((list) => list.source === 'vector');
mcp-server/lib/search/hybrid-search.ts-1654-    const passthroughLists = fusionLists.filter((list) => list.source !== 'graph' && list.source !== 'vector' && list.source !== 'keyword');
mcp-server/lib/search/hybrid-search.ts:1655:    const fused = adaptiveEnabled
mcp-server/lib/search/hybrid-search.ts:1656:      ? (adaptiveFuse as unknown as (
mcp-server/lib/search/hybrid-search.ts-1657-        semanticResults: Array<Record<string, unknown>>,
mcp-server/lib/search/hybrid-search.ts-1658-        keywordResults: Array<Record<string, unknown>>,
```

```text
$ rg -n "RSF" "mcp-server/lib/search/hybrid-search.ts" "shared/algorithms/adaptive-fusion.ts"
(no output)
```

### Pass / Fail

- **Pass**: The targeted suites passed, warmup and shadow-scoring compatibility helpers are inert, retired novelty symbols are absent from current source, and adaptive fusion is selected through `SPECKIT_ADAPTIVE_FUSION` without retired RSF compatibility gating.

### Failure Triage

Inspect `shared/embeddings.ts`, `mcp-server/context-server.ts`, `mcp-server/lib/eval/shadow-scoring.ts`, `mcp-server/lib/scoring/composite-scoring.ts`, and `mcp-server/lib/search/hybrid-search.ts` if any deprecated flag appears to change live execution

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [implement-and-remove-deprecated-features/category-stub.md](../../feature-catalog/implement-and-remove-deprecated-features/category-stub.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 228
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `implement-and-remove-deprecated-features/retired-runtime-shims.md`
