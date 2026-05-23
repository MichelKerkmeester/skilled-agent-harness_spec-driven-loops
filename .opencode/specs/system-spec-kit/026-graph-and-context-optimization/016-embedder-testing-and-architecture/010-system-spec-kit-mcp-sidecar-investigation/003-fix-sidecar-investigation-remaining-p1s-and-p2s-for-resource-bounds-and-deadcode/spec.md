---
title: "Feature Specification: Fix Sidecar-Investigation Remaining P1s + P2s — Resource Bounds and Dead Code"
description: "Phase parent for closing 24 remaining P1 + 68 P2 findings from arc 010/001 deep-research that were not covered by 010/002's 4 children. Grouped by surface for surgical batches."
trigger_phrases:
  - "arc 010 003"
  - "remaining sidecar investigation fixes"
  - "sidecar dead-code cleanup"
  - "sidecar p1 p2 cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold phase parent lean trio for remaining-findings remediation"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast on phase 001 (sidecar-worker P1s)"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/001-deep-research-drift-and-simplification/research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Fix Sidecar-Investigation Remaining P1s + P2s — Resource Bounds and Dead Code

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (010 sidecar-investigation arc) |
| **Predecessor** | `../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/` (closed 18 findings: 3 P0 + 15 P1) |
| **Successor** | None |
| **Handoff Criteria** | All 6 phase children pass independently; arc 010 reaches ≥ 80% P1 closure |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
arc 010/002 closed 18 findings (3 P0 + 15 P1) from arc 010/001's deep-research synthesis. 92 remain: 24 P1 + 68 P2. Operators need the remaining P1s closed for hardening completeness, and the P2s closed (or explicitly deferred-as-out-of-scope) to keep the sidecar module surface tight before downstream work depends on it.

### Purpose
Close 24 remaining P1 findings via 4 surface-grouped surgical batches, then 68 P2 findings via 2 cleanup batches. Each batch is its own phase child with finding-IDs in its tasks.md.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 24 P1 findings remaining from arc 010/001 deep-research, grouped by primary surface.
- 68 P2 findings remaining, grouped by surface theme (dead-code cleanup, drift normalization, comment hygiene).
- Per-batch verification: vitest + pytest (where applicable) + typecheck + strict validate.

### Out of Scope
- Re-litigating findings already closed in arc 010/002.
- Touching deep-loop-runtime (separate arc).
- Touching arc 009 owner-lease/launcher work (closed in arc 009/014).
- New feature work — purely remediation.

### Files to Change (summary, per-phase detail in children)

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Modify | 001 (P1), 005 (P2) | F5, F14, F19, F26, F30, F94, F95 + 8 P2 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modify | 002 (P1), 006 (P2) | F6, F31, F52, F53, F58, F61, F74 + 8 P2 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modify | 003 (P1), 005 (P2) | F18, F20, F25, F57, F62, F73, F91 + 13 P2 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | 004 (P1), 006 (P2) | F105 + 16 P2 |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | 004 (P1), 005 (P2) | F15, F49 + 13 P2 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` / `registry.ts` / `schema.ts` / `types.ts` | Modify | 006 (P2) | 10 P2 (barrel hygiene, dead exports) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode/` | 7 P1 in sidecar-worker.ts: F5, F14, F19, F26, F30, F94, F95 | Planned |
| 002 | `002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks/` | 7 P1 in execution-router.ts: F6, F31, F52, F53, F58, F61, F74 | Pending 001 |
| 003 | `003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers/` | 7 P1 in sidecar-client.ts: F18, F20, F25, F57, F62, F73, F91 | Pending 002 |
| 004 | `004-fix-investigation-p1s-for-launcher-and-reindex-deadcode/` | 3 P1: F15, F49 (ensure-rerank-sidecar.cjs), F105 (reindex.ts) | Pending 003 |
| 005 | `005-fix-investigation-p2s-for-sidecar-client-launcher-worker-cleanup/` | 34 P2: 13 sidecar-client + 13 ensure-rerank + 8 sidecar-worker | Pending 004 |
| 006 | `006-fix-investigation-p2s-for-reindex-router-barrel-deadcode/` | 34 P2: 16 reindex + 8 execution-router + 10 barrel (index/registry/schema/types) | Pending 005 |

### Phase Transition Rules

- Each phase MUST pass `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase> --strict` before the next starts.
- Each phase runs as ONE cli-codex gpt-5.5 high fast dispatch (per memory: practical concurrency ceiling 3-4, and per-batch dispatch is the recommended pattern from arc 010/002).
- Parent main-agent commits Codex's Commit Handoff path list after each phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 7 P1 sidecar-worker closed; vitest sidecar-hardening green | Strict validate exit 0; commit |
| 002 | 003 | 7 P1 execution-router closed; vitest execution-router green | Strict validate exit 0; commit |
| 003 | 004 | 7 P1 sidecar-client closed; vitest sidecar-hardening green | Strict validate exit 0; commit |
| 004 | 005 | 3 P1 launcher + reindex closed | Strict validate exit 0; commit |
| 005 | 006 | 34 P2 closed; no regressions across vitest + pytest | Strict validate exit 0; commit |
| 006 | done | 34 P2 closed; barrel hygiene clean | Strict validate exit 0; arc parent re-validate; commit |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- For dead-export P2s (F7, F8, F44, F45, F68, F77 etc.) — delete outright OR add `@internal` tag and keep? Default: delete unless ≥ 1 test depends on the export.
- For 4-level fallback ladders with dead branches (F52, F61) — collapse to 2-level OR keep and document the dead branch? Default: collapse.
- Should `__embedderExecutionRouterTestables` (F6) move to a test-only module? Default: yes, mirror what 010/002/004 did for `SidecarClientOptions`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Arc**: `../spec.md`
- **Findings source**: `../001-deep-research-drift-and-simplification/research/research.md` + `findings-registry.json`
- **Predecessor remediation**: `../002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/`
