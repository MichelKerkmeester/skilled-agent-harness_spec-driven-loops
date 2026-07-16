---
title: "Tasks: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory retention forgetting tasks"
  - "c7-a dominance cap tasks"
  - "spare only eligibility tasks"
  - "trust gated quarantine tasks"
  - "erasure surface deferral tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/013-retention-forgetting"
    last_updated_at: "2026-07-04T17:51:08.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author retention/forgetting impl tasks"
    next_safe_action: "Implement T101 spare-only forget eligibility"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-011-retention-forgetting"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

> STATUS NOTE: None of the 8 candidates shipped in 030 Wave-0 (verified against `030/spec.md` §14 + `git log 1ecc531431..HEAD`). Current task state below reflects this implementation pass: retention spare-only and live-edge allowlist are done. Benchmark-gated recall shaping and shared-infra quarantine remain pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm forget-learning double-gate (`SPECKIT_FEEDBACK_RETENTION_LEARNING` + `mode=shadow`) and register a default-OFF reconsolidation flag (`.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`)
- [x] T002 [P] Locate the forget-allowlist symbol, decided live-edge join using `causal_edges.relation` plus `idx_causal_edges_retention_incoming` (`.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T003 [P] Capture recall baseline for C7-A + never-truncate (regression-baseline rule, result-set changes)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T101 **P0 M-spare-only-eligibility**: implemented `SPECKIT_RETENTION_FORGETTING_V1` default-OFF spare-only behavior, finite-guards, trust/age axes and both-floors-at-ceiling refusal (`.opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-retention-reducer.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/feedback-retention-reducer.vitest.ts`)
- [ ] T102 **P0 C7-A dominance cap**: in-place partition before the stage-4 final slice, default N=3, spill-if-underfilled, key `spec_folder` primary / `sessionId` secondary, no scoring change (`.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:305-309`) [research: deltas/iter-004 c7-a]
- [x] T103 **P1 forget-allowlist**: implemented live 6-label incoming-edge protection (`DERIVED_FROM`/`SUPPORTS`/`DEPENDS_ON`/`RELATES_TO`/`HAS_FAILURE`/`MENTIONS`), excludes AUDIT/provenance/scope, default-OFF behind `SPECKIT_RETENTION_FORGETTING_V1` (`.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts`)
- [ ] T104 [B] **P1 M-never-truncate-always-surface**: cap the constitutional always-surface prefix so it cannot starve regular results, blocked on T003 benchmark (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:435`) [research: synthesis/01 200-iter recovery]
- [ ] T105 **P1 M-trust-gated-quarantine**: trust gate before `reconsolidate()` merge routing, quarantine low-trust side via CONTRADICTS edge-presence read-exclusion, surfaced reconcile signal (victim/trust/survivor), default-OFF flag (`.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:121`) [research: deltas/iter-013, iter-018]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T120 Unit tests: spare-on-positive-feedback, non-finite-spare, both-floors-at-ceiling refusal (spare-only)
- [ ] T121 Unit tests: allowlist-vs-ambient-edge is done. Single-folder-dominance + spill-if-underfilled (C7-A), constitutional-starvation (never-truncate) and gate-only-when-trust>=0.7 (quarantine) remain pending with their candidates
- [ ] T122 Re-run touched-module vitest, confirm primary order unchanged where order-preserving, re-run recall baseline and report the delta
- [x] T123 Reconcile spec §6 STATUS table against 030 §14 (done → implemented in worktree, pending → gate)

### Deferral recording (erasure surface, own-packet / threat-model-gated)

- [x] T140 Record **M-erasure-cascade-refuse-whole** as PENDING (DEFER → own GDPR packet), seam `tools/memory-tools.ts` (GAP), only in aionforge `purge_write.rs` (spec §6) [research: synthesis/01 recovery, deltas/iter-016 O16-01]
- [x] T141 Record **M-namespace-authorize-before-erase** as PENDING (DEFER → threat-model-gated, single-tenant N/A), seam `scope-governance.ts:289` (spec §6) [research: deltas/iter-012, iter-019 O19-01]
- [x] T142 Record **M-writer-signing** as PENDING (DEFER → threat-model-gated, single-trusted-host out-of-scope, S-effort transport hardening is the real value), seam GAP (spec §6) [research: deltas/iter-014, O14-01]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implement tasks (T101-T105) marked `[x]` OR carried as user-approved deferrals with gate
- [ ] No `[B]` blocked tasks remaining (T103/T104 unblocked by T002/T003)
- [ ] Per-candidate verification passed, spec §6 STATUS reconciled against 030 §14
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `06`
<!-- /ANCHOR:cross-refs -->
