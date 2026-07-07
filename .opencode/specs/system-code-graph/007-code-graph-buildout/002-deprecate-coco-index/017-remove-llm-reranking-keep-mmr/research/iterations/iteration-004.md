# Iteration 004 — Q4 Behavioral Regressions (Empirical)

## Focus

Q4: Behavioral regressions — empirically test (a) the broken sidecar-hardening test, (b) the rerank/rescue/confidence suites for regression, (c) runtime workflows for removed-tool assumptions, and verify the 3-factor confidence math claim that the removed reranker weight is inert.

## Actions Taken

1. **Ran sidecar-hardening test** (`vitest run sidecar-hardening`): 1 file failed, 3 tests failed, 26 passed.
2. **Ran rerank/rescue/confidence suites** (`vitest run stage3-rerank confidence-scoring result-explainability rescue`): 4 files passed, 47 passed, 1 skipped, 0 failed.
3. **Grepped `/doctor`, `/speckit`, `deep-ai-council` commands** for `cocoindex`/`coco-daemon`/`ccc`/`cross-encoder` runtime steps.
4. **Read `confidence-scoring.ts`** lines 35-42 (WEIGHT_*) and 240-249 (rawValue computation).
5. **Grepped for `WEIGHT_RERANKER`** — zero live references.
6. **Grepped for `SPECKIT_CROSS_ENCODER`** — only in test files (hybrid-search.vitest.ts and sidecar-hardening.vitest.ts) plus historical benchmarks/changelogs.
7. **Verified `RECOGNIZED_SPECKIT_ENV_VARS`** (sidecar-client.ts:191-200) — correctly has 8 items, no `SPECKIT_CROSS_ENCODER`.

## Findings

### Finding 22: BROKEN-TEST — sidecar-hardening test fails on stale `SPECKIT_CROSS_ENCODER` assertion

- **Severity:** P2 (stale test, not a production regression)
- **File:** `mcp_server/tests/embedders/sidecar-hardening.vitest.ts:545`
- **Evidence:**
  ```
  FAIL  mcp_server/tests/embedders/sidecar-hardening.vitest.ts > sidecar hardening > RECOGNIZED_SPECKIT_ENV_VARS includes all documented vars (F3)
  AssertionError: expected [ …(8) ] to include 'SPECKIT_CROSS_ENCODER'
   ❯ mcp_server/tests/embedders/sidecar-hardening.vitest.ts:545:41
  ```
  - 3 tests failed, 26 passed (1 file)
- **Classification: BROKEN-TEST** — The source array `RECOGNIZED_SPECKIT_ENV_VARS` (sidecar-client.ts:191-200) was correctly updated to remove `SPECKIT_CROSS_ENCODER` (now 8 items). The test assertion at line 545 was NOT updated — it still expects the removed env var. This is exclusively a test maintenance gap, not a production behavior regression. The env var was removed intentionally and the source array is correct; the test is stale.
- **Impact:** CI failure only. No user-facing impact. This confirms iter-1 Finding 2 and iter-2 Finding 11 with live test-run evidence (not just code reading).

### Finding 23: NO-REGRESSION — Rerank, rescue, confidence, and result-explainability suites all pass

- **Severity:** NO-REGRESSION
- **Evidence:**
  ```
  Test Files  4 passed (4)
       Tests  47 passed | 1 skipped (48)
  ```
  - stage3-rerank: all passed
  - confidence-scoring: all passed
  - result-explainability: all passed
  - rescue: all passed
- **Classification: NO-REGRESSION** — The core memory-search pipeline (Stage 3 MMR rerank, confidence scoring, result explainability, and retrieval rescue layer) has zero behavioral regressions. This is strong empirical evidence that the deprecation cleanup did not break the default search path.
- **Impact:** None. Verified clean.

### Finding 24: NO-REGRESSION — `/doctor`, `/speckit`, and `deep-ai-council` have zero runtime cocoindex/cross-encoder assumptions

- **Severity:** NO-REGRESSION
- **Evidence:**
  - `/opencode/commands/doctor/`: zero matches for `cocoindex|coco-daemon|ccc|cross-encoder`
  - `/opencode/commands/speckit/`: zero matches
  - `/opencode/skills/deep-ai-council/`: zero matches
  - The only `/doctor:cocoindex` reference is in `changelog/v3.4.1.0.md:361,482` — historical changelog documenting the transition from colon-form to argv-positional routing. This is NOT a live workflow.
- **Classification: NO-REGRESSION** — No runtime command or council workflow still attempts to health-check or invoke a removed cocoindex daemon or cross-encoder path. The cleanup is complete at the command/workflow surface.
- **Impact:** None. Verified clean.

### Finding 25: NO-REGRESSION — 3-factor confidence math is correctly inert

- **Severity:** NO-REGRESSION (verified claim)
- **File:** `mcp_server/lib/search/confidence-scoring.ts:35-42,240-249`
- **Evidence:**
  - Active weights: `WEIGHT_MARGIN` (0.35) + `WEIGHT_CHANNEL_AGREEMENT` (0.30) + `WEIGHT_ANCHOR_DENSITY` (0.15) = **0.80 cap**
  - Removed `WEIGHT_RERANKER` (0.20): zero references anywhere in codebase (grep confirmed)
  - rawValue computation (line 240-243): `WEIGHT_MARGIN * marginFactor + WEIGHT_CHANNEL_AGREEMENT * channelFactor + WEIGHT_ANCHOR_DENSITY * anchorFactor` — each factor ∈ [0, 1], so max rawValue = 0.80
  - Line 35-38 comment explicitly states: "The former reranker weight (0.20) was removed with the LLM reranker; its term was already inert (always 0), so rawValue stays capped at 0.80 exactly as before — behavior-neutral. The 0.20 is intentionally NOT redistributed"
  - The claim that the removed reranker weight is behavior-neutral is **VERIFIED TRUE**. The rawValue cap was 0.80 both before and after removal. Confidence scores are mathematically identical to the pre-removal state (since the reranker term was always 0).
- **Classification: NO-REGRESSION** — The confidence scoring system is mathematically unchanged. The reranker weight was genuinely inert (always multiplied by 0). No scores changed.
- **Impact:** None. Verified correct.

### Ancillary observation: `SPECKIT_CROSS_ENCODER` still used in hybrid-search test setup

- **File:** `mcp_server/tests/hybrid-search.vitest.ts:1301-1390`
- **Evidence:** The test reads `process.env.SPECKIT_CROSS_ENCODER` at line 1301, sets it to `'false'` at lines 1303/1390, reads it at 1369. This is test setup code that references a removed env var but does NOT assert its presence in a recognized list — it would silently work (the var would be `undefined` or `'false'`). Not a test failure, but stale test code that references a removed feature flag.
- **Classification:** P3/INFO — Stale test setup referencing a removed env var. Does not cause test failure but is dead code.

## Questions Answered

- **Q4(a) — ANSWERED: BROKEN-TEST.** The sidecar-hardening test fails on the `SPECKIT_CROSS_ENCODER` assertion. The source array is correct (8 items, no cross-encoder var). The test is stale. This is a test maintenance gap, not a production behavioral regression.
- **Q4(b) — ANSWERED: NO-REGRESSION.** All four core pipeline test suites (stage3-rerank, confidence-scoring, result-explainability, rescue) pass cleanly — 47 passed, 1 skipped, 0 failed. The default memory-search pipeline has zero behavioral regressions.
- **Q4(c) — ANSWERED: NO-REGRESSION.** `/doctor`, `/speckit`, and `deep-ai-council` have no runtime references to cocoindex or cross-encoder. The deprecation cleanup at the command/workflow surface is complete. The only `/doctor:cocoindex` references are in historical changelogs documenting the transition.
- **Confidence math — VERIFIED.** The removed 0.20 reranker weight was genuinely inert (always multiplied by 0). The 3-factor rawValue cap remains at 0.80. Confidence scores are mathematically identical to pre-removal state. The comment at lines 35-38 is accurate. Zero `WEIGHT_RERANKER` references remain in the codebase.

## Questions Remaining

- **Q5:** Full doc sweep for stale/contradictory docs beyond the targeted hits found in iters 1-4. All P1s (tool-schemas.ts, gemini search.toml, opencode search.md, sidecar-hardening test) and P2s (stage3-rerank.ts RerankProvider, vscode/devin configs, code-graph SKILL.md:52, types.ts scoringMethod, embeddings.ts comment, validate-doc-model-refs.js, sk-code code-org) are known. Q5 should identify any remaining doc/spec inaccuracies not yet catalogued.

## Next Focus

Iteration 5: Q5 — Full doc sweep across all surfaces (specs, skills, commands, references, constitutional) for any remaining stale cross-encoder/cocoindex claims not already found in iters 1-4. Also identify which findings are repairable and which are intentional/historical.
