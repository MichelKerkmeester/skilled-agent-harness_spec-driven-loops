---
title: "Implementation Plan: Delete the inactive LLM-model reranking (cross-encoder + local GGUF reranker + reranker interface + conditional-rerank gate + 7 tests; remove stage3 Step 1) while preserving the active algorithmic MMR diversity reranker; behavior-neutral, triple-verified via tsc + full memory-search vitest [template:level_2/plan.md]"
description: "Plan for the completed 017 cleanup layer: remove residual inactive LLM-reranker code/docs/tests, preserve MMR, and verify with compile plus targeted and broad subsystem vitest evidence."
trigger_phrases:
  - "implementation plan"
  - "remove llm reranking"
  - "keep mmr"
  - "reranker cleanup"
  - "stage 3 mmr"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr"
    last_updated_at: "2026-05-25T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Captured the implemented A/B/C cleanup breakdown and verification plan."
    next_safe_action: "commit 017 changeset"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md"
    session_dedup:
      fingerprint: "sha256:6587d9dbefe05b61a2b6749dfc08d87f9e0321641eb442f35ef528a02dd0cb0b"
      session_id: "017-remove-llm-reranking-keep-mmr-doc-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The implementation is already complete and verified; this plan documents the completed approach."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Delete the inactive LLM-model reranking (cross-encoder + local GGUF reranker + reranker interface + conditional-rerank gate + 7 tests; remove stage3 Step 1) while preserving the active algorithmic MMR diversity reranker; behavior-neutral, triple-verified via tsc + full memory-search vitest

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Markdown |
| **Framework** | mk-spec-memory MCP server search pipeline |
| **Storage** | Existing memory/search fixtures only; no migrations |
| **Testing** | `tsc --noEmit` and Vitest |

### Overview
This packet documents the completion layer after the predecessor 014/003 core removal, commit `b564013c0e`. The implementation removes residual dead LLM-reranker confidence, explainability, audit, doc, and test vestiges while preserving the active `SPECKIT_MMR` algorithmic Stage 3 diversity step.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified: predecessor 014/003 removal already landed in `b564013c0e`.

### Definition of Done
- [x] Residual inactive LLM-model reranker confidence, explainability, audit, doc, and test vestiges removed from active surfaces.
- [x] MMR diversity reranker preserved and verified independent of cross-encoder imports.
- [x] Verification evidence captured: `tsc`, affected test set, and broad subsystem subset.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
MCP server search pipeline cleanup with behavior-neutral removal of dead code paths and docs.

### Key Components
- **Confidence scoring**: Uses margin, channel agreement, and anchor density. The inert reranker confidence factor is removed and not redistributed.
- **Result explainability**: Reports live signals only; dead `reranker_support` is removed.
- **Decision audit**: Tracks live decision metrics only; stale `rerankTriggerRate` is removed.
- **Stage 3 reranking**: Keeps algorithmic MMR diversity reranking and MPAB chunk collapse.
- **Documentation and tests**: Align active references and fixtures to the MMR-only pipeline.

### Data Flow
Search results still flow through fusion, MMR diversity reranking, MPAB chunk collapse, effective-score/floor-score handling, confidence scoring, explainability, and response envelopes. The removed paths no longer add model-based reranker confidence or audit metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Confidence scoring | Computes result confidence drivers. | Remove inert reranker factor, driver, fields, and signal helper. | `tsc` 0 errors; affected confidence tests pass. |
| Explainability | Builds result support signals and summaries. | Remove dead `reranker_support`. | Affected result-confidence/explainability tests pass. |
| Decision audit | Reports search decision metrics. | Remove `rerankTriggerRate`. | Decision-envelope and decision-audit fixtures pass. |
| Stage 3 MMR | Algorithmic diversity reranking. | Preserve. | MMR independence confirmed; `stage3-rerank-regression` passes MMR-only. |
| Active docs | Operator-facing current behavior. | Align to MMR diversity reranking plus MPAB chunk collapse; remove retired flags and stale sidecar/cloud rows. | Docs changed in packet; active docs no longer describe cross-encoder/local GGUF sidecar reranking as live. |
| Tests | Regression coverage for scoring, envelopes, retrieval, and pipeline behavior. | Remove reranker-specific assertions/fixtures/cases; strengthen high-confidence fixture without reranker boost. | Affected set: 14 files / 493 tests passed; broad subset: 107 files / 2371 tests passed. |

Required inventories:
- Same-class producers: verified zero live assignments of `rerankerScore` in `mcp_server/lib` plus handlers.
- Consumers of changed symbols: affected scoring, envelope, audit, search, and Stage 3 regression tests updated and passing.
- Matrix axes: code vestiges, active docs, tests, MMR preservation, historical records.
- Algorithm invariant: MMR remains independent algorithmic vector math and does not share cross-encoder imports.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm predecessor scope: 014/003 core removal landed in commit `b564013c0e`.
- [x] Classify active MMR as distinct from LLM-model reranking.
- [x] Identify out-of-scope historical records to preserve.

### Phase 2: Core Implementation
- [x] **A. Code cleanup**: Remove inert confidence reranker factor, dead explainability signal, stale audit metric, and stale stage2-fusion comment.
- [x] **B. Documentation alignment**: Align Stage 3 docs to MMR diversity reranking plus MPAB chunk collapse; remove retired flags and stale sidecar/cloud reranker references from active docs.
- [x] **C. Test cleanup**: Remove reranker-specific assertions, fixtures, and cases; strengthen high-confidence fixture without reranker boost.
- [x] **Post-deprecation doc alignment**: Correct root README, embedder pluggability docs, tool counts, and the stale embedder-default test assertion.

### Phase 3: Verification
- [x] Run `node_modules/.bin/tsc --noEmit -p mcp_server/tsconfig.json`.
- [x] Run affected 14-file / 493-test set.
- [x] Run broad search/scoring/pipeline/retrieval subsystem subset: 107 files / 2371 tests.
- [x] Document full 528-file suite limitation and substitution evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type check | All compiled mcp_server files; catches broken imports to deleted reranker modules. | `node_modules/.bin/tsc --noEmit -p mcp_server/tsconfig.json` |
| Affected regression | Confidence, scoring, envelopes, search, Stage 3, and decision-audit affected files. | Vitest, 14 files / 493 tests |
| Broad subsystem regression | Search/scoring/pipeline/retrieval subsystem subset. | Vitest, 107 files / 2371 tests |
| Manual/code review evidence | MMR preservation and no live `rerankerScore` assignments. | Source inspection and grep evidence recorded in brief |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 014/003 core removal commit `b564013c0e` | Internal predecessor | Complete | 017 would not be a residual cleanup layer without the core module/gate removal. |
| MMR Stage 3 path | Internal algorithmic behavior | Preserved | Removing it would violate the operator directive. |
| Existing Vitest suites | Internal verification | Available | Used for affected and broad subsystem verification. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verified regression attributable to removing residual reranker vestiges, broken imports, incorrect docs, or MMR behavior drift.
- **Procedure**: Revert the 017 cleanup changeset, then re-run `tsc`, affected tests, and Stage 3 MMR regression before retrying a narrower cleanup.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Classify) ──► Phase 2A (Code) ─────┐
                         Phase 2B (Docs) ───┼──► Phase 3 (Verify)
                         Phase 2C (Tests) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Classify | Predecessor commit `b564013c0e` | Code, Docs, Tests |
| Code | Classify | Verify |
| Docs | Classify | Verify |
| Tests | Code | Verify |
| Verify | Code, Docs, Tests | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup/Classify | Medium | Completed |
| Core Implementation | Medium | Completed |
| Verification | Medium | Completed |
| **Total** | | **Completed before packet authoring** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations involved.
- [x] No new feature flag added.
- [x] MMR flag `SPECKIT_MMR` remains the relevant Stage 3 diversity control.

### Rollback Procedure
1. Revert the 017 cleanup changeset.
2. Re-run `node_modules/.bin/tsc --noEmit -p mcp_server/tsconfig.json`.
3. Re-run affected confidence, search, envelope, decision-audit, and Stage 3 tests.
4. Re-check active docs for MMR-only wording before a corrected follow-up.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
