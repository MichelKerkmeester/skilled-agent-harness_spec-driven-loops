---
title: "Implementation Plan: Fan-Out Hardening"
description: "Plan for hardening the detached CLI fan-out path: prompt bindings, salvage/retry, opt-in sandbox, leaf-only merge, observability."
trigger_phrases:
  - "fan out hardening plan"
  - "detached cli fanout salvage retry plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/008-loop-systems-remediation/007-fan-out-hardening"
    last_updated_at: "2026-06-30T15:30:00Z"
    last_updated_by: "glm-fanout-review"
    recent_action: "Planned and shipped fan-out hardening"
    next_safe_action: "Phase complete; fixes shipped and verified"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-fanout-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mixed salvage is retryable, not fatal; dangerous permission bypass is opt-in via sandboxMode."
---
# Implementation Plan: Fan-Out Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, TypeScript (Zod) config, Vitest |
| **Framework** | deep-loop-runtime fan-out pool + merge + CLI guards |
| **Storage** | Filesystem JSONL state logs, lineage artifact dirs, registries |
| **Testing** | Vitest with hermetic stub-binary harness |

### Overview
The detached CLI fan-out dispatch, salvage/retry classification, merge lineage selection, and observability status mapping each missed a guard or binding surfaced by the GLM fan-out review. The implementation adds setup bindings to the CLI prompt, a salvage-failure gate, an `artifact_miss` retry class, opt-in permission bypass, a leaf-only merge fallback, and typed lag-ceiling statuses — each with a regression that fails when the bug returns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (phases 001-006 shipped; suite loadable)

### Definition of Done
- [x] All seven findings remediated in-code
- [x] Each fix has a runnable regression (exit-0/no-artifact guard, merge reconstruction, sandboxMode acceptance)
- [x] Full requested Vitest suite passed (549 tests)
- [x] Docs updated with current verification state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted guards at four boundaries: prompt construction (`buildLoopPrompt`), the post-run success gate (`fanout-run` worker), failure classification (`classifyLineageFailure`), and merge lineage selection (`fanout-merge` main).

### Key Components
- **buildLoopPrompt**: emits review setup bindings for detached CLI review/context lineages.
- **Salvage gate + classifier**: `salvage.failed > 0` throws; `artifact_miss` makes mixed-salvage retryable.
- **Opt-in sandbox**: cli-opencode honors `sandboxMode`; dangerous bypass is gated + warned.
- **reconstructReviewRegistryFromState**: rebuilds a registry from JSONL `findingDetails` for leaf-only lineages.
- **statusForLedgerEvent**: maps `lag_ceiling_*` events to typed statuses.

### Data Flow
Worker runs → salvage sweep → missing-artifact gate → salvage-failed gate → (on throw) `classifyLineageFailure` → retry/fatal. At merge, registry-absent lineages get a reconstructed registry before `mergeReviewRegistries`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Fix Addendum: Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-run.cjs` `buildLoopPrompt` | Builds the detached CLI lineage prompt. | Add review setup bindings. | grep `review_target`; preflight no longer infers. |
| `fanout-run.cjs` worker | Validates lineage artifacts after run. | Add salvage-failed gate; opt-in sandbox; lag-ceiling status map. | exit-0/no-artifact regression test. |
| `cli-guards.cjs` `classifyLineageFailure` | Classifies lineage failures as retryable/fatal. | Add `artifact_miss` retry class. | fanout-pool failure-class tests. |
| `fanout-merge.cjs` main | Selects registry-backed lineages for merge. | Reconstruct registry from state log when absent. | reconstruction unit tests. |
| `executor-config.ts` | Per-kind flag support. | Allow `sandboxMode` for cli-opencode. | executor-config contract test. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read fan-out dispatch, classifier, merge selection
- [x] Capture baseline suite state (2 files failed to transform)

### Phase 2: Core Implementation
- [x] Prompt bindings, salvage gate, artifact_miss class
- [x] Opt-in sandbox + sandboxMode support
- [x] Leaf-only merge reconstruction, lag-ceiling status mapping
- [x] Fix pre-existing spawn-cjs duplicate declaration

### Phase 3: Verification
- [x] Add regressions (exit-0/no-artifact, reconstruction, sandboxMode acceptance)
- [x] Run full suite (549 green); comment hygiene; strict spec validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Suite | All deep-loop-runtime tests including new regressions | `PATH=/opt/homebrew/bin:$PATH npx vitest run` |
| Mutation check | sandboxMode contract goes true-RED then green | executor-config.vitest.ts |
| Comment hygiene | Modified code files | `python3 .../check-comment-hygiene.sh` |
| Spec validation | Level-1 phase docs | `bash .../validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node at `/opt/homebrew/bin` | External runtime | Green | Cannot run suite |
| Vitest binary | External dev dependency | Green | Suite cannot execute |
| `spawn-cjs.ts` helper | Internal test harness | Green (fixed) | Fanout suite cannot transform |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Full suite reveals a fan-out compatibility regression, or downstream detached lineages cannot run without default skip-permissions.
- **Procedure**: Revert the per-file changes in `fanout-run.cjs`, `cli-guards.cjs`, `fanout-merge.cjs`, `executor-config.ts`, and the three test files; restore the prior docs state. Note that reverting the sandbox change restores unconditional `--dangerously-skip-permissions`.
<!-- /ANCHOR:rollback -->
