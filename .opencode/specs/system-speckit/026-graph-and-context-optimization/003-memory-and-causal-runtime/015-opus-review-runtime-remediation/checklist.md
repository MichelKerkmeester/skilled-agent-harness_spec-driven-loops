---
title: "Verification Checklist: Opus Review Runtime Remediation (013 cross-review)"
description: "Verification Date: 2026-06-02"
trigger_phrases:
  - "opus review remediation checklist"
  - "013 cross-review verification gates"
  - "restore crash window verification"
  - "front-proxy utf-8 frame verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/015-opus-review-runtime-remediation"
    last_updated_at: "2026-06-02T16:07:14Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 015 remediation packet from validated 013/002 sibling"
    next_safe_action: "Fix P1-1 checkpoint-restore data-loss crash window first"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "lib/storage/incremental-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-review-remediation-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Opus Review Runtime Remediation (013 cross-review)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Findings documented in spec.md (REQ-001..REQ-007; 4 P1 + 17 P2)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (3 gated phases)
- [ ] CHK-003 [P1] Each cited finding verified against the current deployed source before editing
- [ ] CHK-004 [P0] Worktree node_modules symlinks in place (mcp_server, system-spec-kit, shared/dist)
- [ ] CHK-005 [P0] Main committed and recovery-baseline hash recorded before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npm run typecheck` shows 0 new errors (TS5101 baseUrl noise excluded)
- [ ] CHK-011 [P0] No `npm run build` run against the live daemon
- [ ] CHK-012 [P1] Each fix is a minimal diff at the cited line; no adjacent cleanup
- [ ] CHK-013 [P1] No file outside a cited finding is modified (SCOPE LOCK)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] P1-1 crash-window vitest fails pre-fix, passes post-fix: crash mid-swap → boot recovery yields one live DB
- [ ] CHK-021 [P0] P1-2 split-sequence vitest fails pre-fix, passes post-fix: multi-byte frame split across reads decodes byte-identical
- [ ] CHK-022 [P0] P1-3 reconcile vitest fails pre-fix, passes post-fix: moved row keeps `spec_folder` (set + NULL)
- [ ] CHK-023 [P1] Existing restore, front-proxy, and reconcile vitest files stay green
- [ ] CHK-024 [P1] Any behavior-changing P2 advisory gains a focused vitest that is run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (restore-swap ordering, per-chunk decode, row-rewrite omission), or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the restore swap, the front-proxy decode path, and `reconcileMoves`.
- [ ] CHK-FIX-004 [P0] P1-1 recovery covers both partial-swap directions (before and after snapshot in place); P1-2 covers split at the final byte.
- [ ] CHK-FIX-005 [P1] P1-4 doc sweep enumerates every cited `SCHEMA_VERSION`/tool-count location before editing.
- [ ] CHK-FIX-006 [P1] Hostile/edge variant executed where a fix touches process-wide or filesystem state (restore recovery).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] Front-proxy byte accumulator is bounded so a never-completing frame cannot exhaust memory
- [ ] CHK-032 [P1] No fix widens an input-trust boundary
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized after each phase
- [ ] CHK-041 [P1] implementation-summary.md reconciled per phase as fixes land
- [ ] CHK-042 [P2] decision-record.md ADR statuses updated if a decision changes during implementation
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] No edits outside this packet for docs, and code edits confined to the dispatch ALLOWED WRITE PATHS
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | Pending — packet In Progress; fill with evidence as fixes land |
| P1 Items | 15 | Pending |
| P2 Items | 4 | Pending |

**Verification Date**: 2026-06-02 — packet scaffolded, In Progress
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-004)
- [ ] CHK-101 [P1] All ADRs have status (Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (runtime refactor, batch decode rewrite, schema bump)
- [ ] CHK-103 [P2] Surgical-fix boundary documented (cited-line-only edits)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Front-proxy buffering adds no allocation beyond a single accumulating buffer per frame (NFR-P01)
- [ ] CHK-111 [P1] Restore-swap reorder does not lengthen the restore window beyond expectations
- [ ] CHK-112 [P2] Accumulator bound measured against worst-case frame size
- [ ] CHK-113 [P2] Recovery timing recorded on a representative DB
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and validated (per-fix revert; no schema migration)
- [ ] CHK-121 [P0] Deliberate daemon rebuild/restart is the explicit final step, not done mid-implementation
- [ ] CHK-122 [P1] `pkill -9 -f "opencode run"` run between dispatches
- [ ] CHK-123 [P1] Per-fix commits to main with explicit paths
- [ ] CHK-124 [P2] Front-proxy buffering verified on the target host
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] Mandatory post-implementation review run; surfaces no new P0/P1 before any completion claim
- [ ] CHK-131 [P1] Dependency licenses unchanged (no new dependencies introduced)
- [ ] CHK-132 [P2] Front-proxy input-handling change reviewed against frame-injection classes
- [ ] CHK-133 [P2] Restore file-handling reviewed for partial-state classes
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet documents synchronized at completion
- [ ] CHK-141 [P1] P1-4: every cited `SCHEMA_VERSION`/tool-count claim matches the deployed value
- [ ] CHK-142 [P2] Deferred P2 advisories recorded with rationale in implementation-summary.md
- [ ] CHK-143 [P2] Knowledge transfer captured in handover if the session ends mid-phase
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Orchestrator | [ ] Approved | |
| Review | Quality gate | [ ] Approved | |
| Operator | Live-proof witness | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
