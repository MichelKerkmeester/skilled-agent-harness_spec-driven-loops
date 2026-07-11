---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Residual inactive LLM-reranker vestiges were removed from active code, docs, and tests while the algorithmic MMR diversity reranker stayed live and verified."
trigger_phrases:
  - "implementation summary"
  - "remove llm reranking"
  - "keep mmr"
  - "reranker cleanup"
  - "packet 017"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr"
    last_updated_at: "2026-05-25T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored final packet docs"
    next_safe_action: "commit 017 changeset"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:6587d9dbefe05b61a2b6749dfc08d87f9e0321641eb442f35ef528a02dd0cb0b"
      session_id: "017-remove-llm-reranking-keep-mmr-doc-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Core removal belongs to 014/003 commit b564013c0e; this packet documents the residual cleanup layer."
      - "Next safe action is committing the 017 changeset."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-remove-llm-reranking-keep-mmr |
| **Completed** | 2026-05-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The active memory-search surfaces now match reality: the inactive LLM-model reranking remnants are gone, and MMR remains the Stage 3 diversity reranker. The predecessor packet 014/003, commit `b564013c0e`, removed the core cross-encoder/local reranker modules and gate; this packet is the 39-file cleanup layer that removes the leftover confidence, explainability, audit, documentation, and test vestiges.

### Committed-vs-This-Packet Split

The core removal already landed in packet 014/003, commit `b564013c0e` (`chore(014/003): remove mk-spec-memory rerank-sidecar coupling`). That commit deleted `mcp_server/lib/search/{cross-encoder,local-reranker,reranker,rerank-gate}.ts`, removed seven cross-encoder/reranker test files, removed Stage 3 Step 1 cross-encoder reranking from `pipeline/stage3-rerank.ts`, kept MMR plus MPAB, removed `isCrossEncoderEnabled`/`isRerankerExpected`, and removed `RerankGateDecision` from the search-decision envelope and `pipeline/types.ts`.

This packet completes the cleanup. It removes residual dead confidence and explainability plumbing, active-doc claims about retired rerankers, stale flag references, and tests that still expected the removed LLM reranker path.

### Code Cleanup

`confidence-scoring.ts` now uses three confidence factors: margin at 0.35, channel agreement at 0.30, and anchor density at 0.15. The removed 0.20 reranker factor was already inert because the cross-encoder gate was hard-OFF, so it was intentionally not redistributed and rawValue remains capped at 0.80.

`result-explainability.ts` no longer emits the dead `reranker_support` signal, `decision-audit.ts` no longer reports `rerankTriggerRate`, and `stage2-fusion.ts` no longer carries the stale canonical reranker output comment.

### Documentation Alignment

Active documentation now describes Stage 3 as MMR diversity reranking plus MPAB chunk collapse. Retired flags were removed from active config and feature-flag references: `SPECKIT_CROSS_ENCODER`, `RERANKER_LOCAL`, `SPECKIT_RERANKER_MODEL`, `SPECKIT_RERANKER_TIMEOUT_MS`, and `ENABLE_RERANKER`. The stale `COHERE_API_KEY` row was also removed.

The dangling "Local GGUF reranker via Ollama runtime" feature-catalog section, playbook scenario 098, and index row were deleted because they referenced a sub-file already deleted earlier. Confidence docs were corrected from four factors to three factors, UX docs dropped `reranker_support` and `reranker_boost`, and shutdown evidence no longer mentions local reranker disposal.

Post-deprecation alignment also fixed root README drift: stale shipped/embedder sections were deleted, a second Stage 3 bullet was corrected to MMR-only, doc links were fixed, and tool counts were corrected. `references/memory/embedder_pluggability.md` was rewritten to mk-spec-memory-only, preserving live mk-spec-memory content while collapsing obsolete code-graph embedder content to a no-embedder-since-014 note. `scripts/tests/memory-pipeline-regressions.vitest.ts` corrected the stale default embedder assertion to `nomic-ai/nomic-embed-text-v1.5`.

### Tests

Reranker-specific assertions, fixtures, and cases were removed from affected tests, including scoring opt-in reranker-gap cases, D5/result-confidence reranker assertions, and decision-envelope/decision-audit rerank-gate fixtures. The `result-confidence` high-envelope fixture was strengthened with `sources: ['vector','fts']` and a second anchor so it reaches `high` legitimately without the removed reranker boost.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modified | Remove inert reranker confidence factor, fields, helper, and driver. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts` | Modified | Remove dead `reranker_support` signal and summary case. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts` | Modified | Remove stale `rerankTriggerRate` metric. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | Remove stale canonical reranker output comment. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md` | Modified | Align search docs to MMR-only Stage 3. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md` | Modified | Align pipeline docs to MMR diversity reranking plus MPAB. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/README.md` | Modified | Remove stale reranker-sidecar quality references. |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Align system-spec-kit README to MMR-only and current embedder/tool counts. |
| `.opencode/skills/system-spec-kit/references/config/environment_variables.md` | Modified | Remove retired reranker flags and stale cloud key row. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Align catalog index and confidence factor count. |
| `.opencode/skills/system-spec-kit/feature_catalog/retrieval/02-semantic-and-lexical-search-memorysearch.md` | Modified | Align retrieval docs to MMR-only Stage 3. |
| `.opencode/skills/system-spec-kit/feature_catalog/retrieval/04-hybrid-search-pipeline.md` | Modified | Align hybrid pipeline docs to MMR-only behavior. |
| `.opencode/skills/system-spec-kit/feature_catalog/retrieval/05-4-stage-pipeline-architecture.md` | Modified | Align Stage 3 architecture wording. |
| `.opencode/skills/system-spec-kit/feature_catalog/retrieval/10-fast-delegated-search-memory-quick-search.md` | Modified | Remove stale reranker references. |
| `.opencode/skills/system-spec-kit/feature_catalog/scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md` | Modified | Align effective-score Stage 3 docs. |
| `.opencode/skills/system-spec-kit/feature_catalog/pipeline-architecture/01-4-stage-pipeline-refactor.md` | Modified | Align pipeline architecture to MMR-only. |
| `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/14-result-explainability.md` | Modified | Remove `reranker_support`. |
| `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/19-result-confidence.md` | Modified | Remove `reranker_boost`. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature-flag-reference/01-1-search-pipeline-features-speckit.md` | Modified | Remove retired reranker flags and correct confidence factors. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature-flag-reference/05-5-embedding-and-api.md` | Modified | Remove stale cloud reranker row. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | Remove dangling local GGUF reranker playbook index row. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/180-result-confidence-speckit-result-confidence-v1.md` | Modified | Correct confidence factor count. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts` | Modified | Remove reranker confidence assertions and strengthen high-envelope fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts` | Modified | Remove reranker confidence expectations. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/scoring-opt-in.vitest.ts` | Modified | Remove reranker-gap cases and env helpers. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts` | Modified | Remove reranker-specific fixture dependencies. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts` | Modified | Remove reranker-specific fixture dependencies. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts` | Modified | Remove `RerankGateDecision` envelope fixture dependency. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Remove reranker-specific fixture dependencies. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/search-extended.vitest.ts` | Modified | Remove reranker-specific assertions/fixtures. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/search-flags.vitest.ts` | Modified | Remove retired reranker flag coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts` | Modified | Remove reranker scoring expectations. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts` | Modified | Preserve and verify MMR-only Stage 3 behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Modified | Remove reranker envelope expectations. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts` | Modified | Remove `RerankGateDecision` fixture dependency. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w13-decision-audit.vitest.ts` | Modified | Remove `rerankTriggerRate` fixture dependency. |
| `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md` | Modified | Rewrite to mk-spec-memory-only and current embedder reality. |
| `.opencode/skills/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts` | Modified | Correct stale embedder-default assertion. |
| `README.md` | Modified | Remove stale shipped/embedder claims, fix MMR-only bullet, links, and tool counts. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the operator directive by separating model-based reranking from algorithmic MMR. It deleted only the residual inactive LLM-reranker surfaces, kept `applyMMR` in Stage 3 behind `SPECKIT_MMR`, preserved MPAB chunk collapse plus `effectiveScore`/`floorScore`, and kept historical records intact.

Verification used compile coverage across all mcp_server files plus focused and broad Vitest runs. The full 528-file mcp_server Vitest suite was not run to completion because it projected 5+ hours on this machine and reached only 64/528 files in 39 minutes; the recorded substitute evidence has no failures attributable to this packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| D-017-1: Keep MMR. | MMR is algorithmic diversity vector math, not a separate LLM model reranker; this directly follows the operator directive. |
| D-017-2: Remove the 0.20 reranker confidence weight without redistributing it. | The term was already always 0 because the cross-encoder gate was hard-OFF, so redistributing it would change behavior instead of preserving it. |
| D-017-3: Remove dead reranker explainability/confidence vestiges. | `rerankerScore` had zero live assignments in `mcp_server/lib` plus handlers after the core removal, so `reranker_boost`, `rerankerApplied`, `hasRerankerSignal()`, and `reranker_support` could never fire. |
| D-017-4: Preserve historical records. | Delete-not-archive applies to live code and docs, not changelog, benchmark, or decision history. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node_modules/.bin/tsc --noEmit -p mcp_server/tsconfig.json` | PASS: 0 errors. |
| Affected test set | PASS: 14 files / 493 tests passed. |
| Broad search/scoring/pipeline/retrieval subsystem subset | PASS: 107 files / 2371 tests passed. |
| Full 528-file mcp_server Vitest suite | NOT RUN TO COMPLETION: projected 5+ hours; only 64/528 files in 39 minutes. Substituted with full compile, affected tests, and broad subsystem subset. |
| MMR independence | PASS: no cross-encoder imports; `SPECKIT_MMR`-gated Stage 3 step intact; `stage3-rerank-regression` passes MMR-only. |
| Residual `rerankerScore` live assignments | PASS: zero live assignments verified in `mcp_server/lib` plus handlers. |
| Packet validation | PASS: strict `validate.sh` exit 0 after `description.json` generation. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full suite runtime** The full 528-file mcp_server Vitest suite was not run to completion because it projected 5+ hours on this machine. The packet uses `tsc` across all compiled files, affected tests, and a broad subsystem subset as substitute evidence.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dash, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
