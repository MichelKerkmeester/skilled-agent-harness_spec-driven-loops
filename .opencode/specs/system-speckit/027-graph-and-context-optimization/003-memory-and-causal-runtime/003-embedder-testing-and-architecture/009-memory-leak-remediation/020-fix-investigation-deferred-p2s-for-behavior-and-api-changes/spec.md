---
title: "Feature Specification: Fix Investigation Deferred P2s for Behavior and API Changes"
description: "Phase parent for closing 34 P2 findings DEFERRED by 017/005 codex sweep for behavior-safety reasons. Bucketed by risk category and dispatched per-bucket with ADRs."
trigger_phrases:
  - "020 deferred p2 remediation"
  - "fix deferred sidecar p2"
  - "sidecar behavior change p2"
  - "sidecar api change p2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes"
    last_updated_at: "2026-05-23T12:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold phase parent for deferred-P2 buckets"
    next_safe_action: "Dispatch cli-codex on bucket 6 (test-only/shared exports — safest)"
    blockers: []
    key_files:
      - ".../015-deep-research-drift-and-simplification/research/findings-registry.json"
      - ".../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Buckets 2/3/5 contract-breaking changes require sign-off; mark DEFERRED-AGAIN if unclear?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Fix Investigation Deferred P2s for Behavior and API Changes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (009 memory-leak remediation arc) |
| **Predecessor** | `../017-.../005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/` (closed 34/68 P2; deferred 34 for behavior-safety) |
| **Handoff Criteria** | Each bucket child passes validate + vitest/pytest independently; arc 017 + 020 cumulative P2 closure approaches 68/68 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
arc 017/005's P2 sweep correctly DEFERRED 34 findings whose closure would change observable behavior, public API shape, or process lifecycle. The deferral was the safe call at the time — but the work still needs to land. Each deferred finding needs an explicit ADR documenting the behavior contract change + alternatives considered, plus regression coverage where possible. This packet structures that work into 6 risk-ordered buckets.

### Purpose
Close 34 deferred P2 findings in 6 bucket children, one cli-codex dispatch per bucket, sequential (NOT parallel). Each bucket emits ≥ 1 ADR per behavior change and either a passing regression fixture OR an explicit "no regression test possible; manual smoke confirms" note + the smoke procedure.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Detailed planning, task breakdowns, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 34 deferred P2 findings grouped into 6 buckets (see Phase Documentation Map).
- ADR-shaped reasoning per behavior change (≥ 1 ADR per bucket; more if multiple behavior shifts in one bucket).
- Regression fixtures where the change is testable.
- Sequential dispatch with halt-on-first-regression rule.
- Cumulative arc 009/017 + 020 P2 closure tracking.

### Out of Scope
- Re-opening already-CLOSED items from 017/005.
- Refactors beyond the 34 deferred IDs.
- Implementing new features unrelated to the deferred set.
- The 2 z_archive references to old 010- paths (frozen-historical).

### Files to Change (per-phase detail in children)

| Bucket | Surface | Phase | Finding count |
|---|---|---|---|
| 6 Test-only / shared exports | `index.ts`, `registry.ts` | 001 | 2 (F44, F109) |
| 1 Env / config behavior | `sidecar-client.ts`, `ensure-rerank-sidecar.cjs` | 002 | 4 (F17, F16, F40, F46) |
| 4 Filesystem durability | `ensure-rerank-sidecar.cjs` | 003 | 9 (F72, F89, F103, F104, F67, F22, F59, F28, F66) |
| 2 API / response-shape | `sidecar-client.ts` | 004 | 5 (F32, F39, F97, F9, F99) |
| 3 Runtime / process lifecycle | `reindex.ts`, `execution-router.ts` | 005 | 5 (F43, F110, F51, F90, F41) |
| 5 Provider / adapter redesign | `execution-router.ts`, `sidecar-worker.ts` | 006 | 6 (F23, F63, F64, F10, F71, F75) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Bucket | Findings | Status |
|---|---|---|---|---|
| 001 | `001-fix-deferred-p2s-for-test-only-and-shared-exports/` | 6 (safest) | F44, F109 | Planned |
| 002 | `002-fix-deferred-p2s-for-env-and-config-behavior/` | 1 (moderate) | F17, F16, F40, F46 | Pending 001 |
| 003 | `003-fix-deferred-p2s-for-filesystem-durability/` | 4 (moderate-high) | F72, F89, F103, F104, F67, F22, F59, F28, F66 | Pending 002 |
| 004 | `004-fix-deferred-p2s-for-api-response-shape/` | 2 (high) | F32, F39, F97, F9, F99 | Pending 003 |
| 005 | `005-fix-deferred-p2s-for-runtime-process-lifecycle/` | 3 (high) | F43, F110, F51, F90, F41 | Pending 004 |
| 006 | `006-fix-deferred-p2s-for-provider-adapter-redesign/` | 5 (highest) | F23, F63, F64, F10, F71, F75 | Pending 005 |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` AND surface-targeted vitest/pytest before next starts.
- Halt-on-first-regression: if any bucket dispatch surfaces a regression in sibling tests, STOP — do NOT proceed to the next bucket until investigated.
- Per-bucket ADRs document the behavior contract change + alternatives considered.
- If a bucket dispatch surfaces a finding that REQUIRES operator sign-off (e.g. a public API rename), mark DEFERRED-AGAIN in that child's checklist + skip to next bucket.
- Strictly sequential — NO parallel bucket dispatches.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | F44 + F109 closed; index.ts/registry.ts barrel exports verified; vitest embedders green | Strict validate exit 0 |
| 002 | 003 | F17/F16/F40/F46 closed; env-allowlist behavior ADR'd; client tests pass | Strict validate exit 0 |
| 003 | 004 | 9 P2 closed; fsync / state-dir / log-path ADRs; ensure-rerank-sidecar.vitest green | Strict validate exit 0 |
| 004 | 005 | 5 P2 closed; response-shape API change ADR + backward-compat note; client tests green | Strict validate exit 0 |
| 005 | 006 | 5 P2 closed; signal/lifecycle ADRs; reindex + router tests green | Strict validate exit 0 |
| 006 | done | 6 P2 closed; provider adapter redesign ADR with affected-consumer list; arc 020 PHASE MAP all rows complete | Strict validate exit 0 on parent + each child |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should bucket 4 (api/response-shape) emit a backward-compatibility shim layer or a hard break with version-bump? Default: shim layer for one release cycle.
- Bucket 5 (provider/adapter redesign) is the largest refactor surface. If F23 (DirectProviderAdapter removal) reveals more cross-consumer fallout than expected, defer-again rather than partially complete?
- Bucket 6 (test-only exports F44/F109) — confirm no live consumer beyond the test files. If a live consumer found, document the migration in the ADR.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor**: `../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/checklist.md`
- **Source registry**: `../015-deep-research-drift-and-simplification/research/findings-registry.json`
- **Parent arc**: `../spec.md`
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` (TBD).
