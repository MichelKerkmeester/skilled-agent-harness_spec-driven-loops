---
title: "Implementation Plan: Manual Test Verification and Fixes"
description: "Delivered plan for manual verification, defect fixes, daemon recovery checks, and deferred findings."
trigger_phrases:
  - "manual verification plan"
  - "Fable-5 manual test plan"
  - "bm25 scoped fill limit plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/006-speckit-surface-alignment/005-manual-test-verification-and-fixes"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Record manual verification and shipped fixes"
    next_safe_action: "Run strict validation for the surface-alignment parent"
    completion_pct: 100
---
# Implementation Plan: Manual Test Verification and Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation over already-committed TypeScript/JavaScript fixes |
| **Framework** | system-spec-kit, system-code-graph, deep-loop-runtime, cli-opencode manual runners |
| **Storage** | Spec-memory DB and code-graph index were exercised, not modified by this documentation pass |
| **Testing** | Manual scenarios, code-graph scan, memory search, Vitest stress suites, TypeScript check |

### Overview

This phase records a completed manual verification-and-fixes arc. GPT-5.5-fast ran four parallel `cli-opencode` jobs over the runnable Fable-5-refined `008` scenarios. The run produced 25 PASS, 2 FAIL, and 3 BLOCKED outcomes. The two real defects were fixed in commits `bda7f57879` and `e4fcccc320`; the three blocked code-graph scenarios were unblocked by a `code_graph_scan` that restored fresh/ready/live graph status.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Verification scope narrowed from approximately 510 total scenarios to approximately 30 runnable items because most scenarios required the spec-memory daemon.
- [x] Four parallel `cli-opencode` jobs ran the manual verification pass.
- [x] The documentation-only scope for this phase was confirmed: no code/test/product edits in this pass.

### Definition of Done

- [x] Manual verification outcomes recorded: 25 PASS, 2 FAIL, 3 BLOCKED.
- [x] Gold-battery path defect recorded as fixed in commit `bda7f57879`.
- [x] BM25 scoped fill-limit regression recorded as fixed in commit `e4fcccc320`.
- [x] Code-graph stale blockers recorded as unblocked by `code_graph_scan`.
- [x] Open/deferred FTS5 lexical-overlap finding recorded without claiming a fix.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verification-to-fix closure: manual scenarios produce evidence, real defects become minimal source fixes, blocked scenarios require readiness recovery, and unrelated/pre-existing failures remain visible with an owner boundary.

### Key Components

- **Manual scenario execution**: GPT-5.5-fast with four parallel `cli-opencode` jobs.
- **Code graph verifier**: `system-code-graph/mcp_server/lib/gold-query-verifier.ts` consumed `GOLD_BATTERY_RELATIVE_PATH`.
- **Hybrid BM25 search**: `system-spec-kit/mcp_server/lib/search/hybrid-search.ts` resolved scoped candidate fill behavior.
- **Stress harness**: `012-fix` automated Vitest suites for substrate, durability, matrix, and search quality.
- **Daemon readiness**: `code_graph_scan` and spec-memory daemon cold-start checked runtime availability.

### Data Flow

1. Manual runners execute runnable refined-feature scenarios.
2. Failing scenarios are classified as real defect, readiness blocker, pre-existing failure, or safe non-defect.
3. Real defects are fixed in product code before this documentation pass.
4. Readiness blockers are rechecked after daemon/index recovery.
5. This phase records shipped facts, verification evidence, and deferred owner calls.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Manual Verification

- [x] Run deep-loop-runtime scoring and coverage-graph scenarios: 8/8 PASS.
- [x] Run deep-loop observability and convergence scenarios: 7/7 PASS.
- [x] Run system-code-graph 05/06/08 scenarios: 5 PASS, 1 FAIL, 3 BLOCKED before fixes/recovery.
- [x] Run stress harness suites: substrate, durability, and matrix PASS; search-quality had one failing file before the BM25 fix.

### Phase 2: Defect Fixes Already Shipped

- [x] Fix gold-battery path in commit `bda7f57879` by changing `GOLD_BATTERY_RELATIVE_PATH` to the normalized `system-speckit/026-...` path.
- [x] Fix BM25 scoped fill-limit regression in commit `e4fcccc320` by restoring corpus-bounded `candidateLimit` for scoped/database searches while preserving incremental metadata resolution.
- [x] Fix stress-test drift in `bm25-scope-then-limit-stress.vitest.ts` for the `deleted_at` column and intercept string.

### Phase 3: Recovery and Follow-Up Classification

- [x] Run `code_graph_scan`: graph stale to fresh/ready/live; three blocked code-graph scenarios unblocked, including `blast_radius` BLOCKED to ok.
- [x] Cold-start spec-memory daemon and verify real search hits: `memory_search "surface alignment remediation"` returned 3 hits.
- [x] Record `memory_health` degraded/0-memories as a health-reporting/main-DB-init follow-up, not as daemon search failure.
- [x] Record lexical-overlap-quality-gate 18/20 FAIL as pre-existing with delta 0.
- [x] Record `exactTriggerSearch limit*3` as confirmed safe because SQL filters scope/tier/active rows/triggers in `WHERE` before `LIMIT`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual scenarios | Refined `008` features, approximately 30 runnable items | GPT-5.5-fast via four parallel `cli-opencode` jobs |
| Runtime readiness | Code graph and spec-memory daemon availability | `code_graph_scan`, `blast_radius`, `memory_search` |
| Stress suites | `012-fix` automated stress harness | Vitest suites for substrate, durability, matrix, search quality |
| Regression checks | BM25 and TypeScript validation | `stress:harness`, `hybrid-search.vitest`, `tsc` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Code-graph daemon reload | Runtime | Pending for gold-battery runtime effect | Source fix is shipped, but live daemon must reload to consume it. |
| Spec-memory daemon DB rebuild and native ABI rebuild | Runtime | Green for real search hits | Historical crash-on-request is resolved for `memory_search`; health reporter still needs follow-up. |
| FTS/016 owner call | Ownership | Deferred | Determines fixture-vs-engine ownership for lexical-overlap-quality-gate failure. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A recorded fact is later found inaccurate.
- **Procedure**: Patch this phase's markdown evidence and regenerate `description.json` and `graph-metadata.json`. No code rollback is owned by this documentation-only phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Manual verification | Refined `008` scenario corpus | Defect classification |
| Defect fixes | Failure evidence from manual runners and stress harness | Final verification evidence |
| Runtime recovery | Code graph and spec-memory daemon availability | Blocked scenario closure |
| Documentation | Verified facts from completed fixes | Parent strict validation |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Manual verification | Medium | Completed before this documentation pass |
| Defect fixes | Medium | Completed before this documentation pass |
| Documentation | Low | Current phase authoring pass |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

- No persisted data migration is owned by this phase.
- Rollback is limited to this new `015` documentation folder, generated metadata, and the parent phase-map row.
<!-- /ANCHOR:l2-rollback -->
