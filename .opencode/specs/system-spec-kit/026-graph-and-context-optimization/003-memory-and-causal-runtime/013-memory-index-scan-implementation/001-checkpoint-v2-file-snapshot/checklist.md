---
title: "Verification Checklist: Checkpoint v2 File-Based Full-DB Snapshots"
description: "Verification Date: 2026-06-01"
trigger_phrases:
  - "checkpoint v2 checklist"
  - "vacuum into verification gates"
  - "full db checkpoint live proof"
  - "schema v29 verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-checkpoint-v2-file-snapshot"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored checkpoint-v2 child packet docs"
    next_safe_action: "Dispatch Phase 1 schema v29 via cli-opencode"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - "lib/search/vector-index-store.ts"
      - "lib/search/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-v2-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Checkpoint v2 File-Based Full-DB Snapshots

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-009)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (3 gated phases)
- [ ] CHK-003 [P1] Dependencies identified and available (VACUUM INTO, shard attach lifecycle)
- [ ] CHK-004 [P0] Worktree node_modules symlinks in place (mcp_server, system-spec-kit, shared/dist)
- [ ] CHK-005 [P0] Main committed and RM-8 recovery-baseline hash recorded before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npm run typecheck` shows 0 new errors (TS5101 baseUrl noise excluded)
- [ ] CHK-011 [P0] No `npm run build` run against the live daemon
- [ ] CHK-012 [P1] Error handling implemented for `ENOSPC`/`SQLITE_FULL` and VACUUM target collisions
- [ ] CHK-013 [P1] Code reuses existing primitives (barrier, manifest, rebuilds, retry loop) rather than reinventing them
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `npm run test:core` green per phase (all 12 existing v1 checkpoint vitest files plus new v2 tests)
- [ ] CHK-021 [P0] Live full-DB proof: `checkpoint_create` on the ~1 GB DB succeeds with no `Invalid string length`, `checkpoint_list` shows the v2 row
- [ ] CHK-022 [P0] Live restore round-trip into a scratch/verified copy restores main plus shard; `memory_health` reports `rowsTotal == ftsRowsTotal == vecRowsTotal`, `mismatchedIds: []`
- [ ] CHK-023 [P1] `includeEmbeddings:false` create is markedly smaller (no shard file) and restore leaves live vectors intact
- [ ] CHK-024 [P1] v1 scoped create and restore behavior unchanged (existing tests green, snapshot_format stays 'v1')
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (`snapshot_format`/`snapshot_path`/`memory_snapshot` producers), or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `createCheckpoint`, `restoreCheckpoint`, `includeEmbeddings`, `reopenActiveDatabase`, `SCHEMA_VERSION`.
- [ ] CHK-FIX-004 [P0] Path-safety fix (`sanitizeCheckpointName`) includes adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: format (v1, v2) x includeEmbeddings (true, false) x shard-attached (yes, no).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed where tests read process-wide DB connection state.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] `sanitizeCheckpointName` rejects `/`, `\`, `..`, NUL and caps length before any path is built
- [ ] CHK-032 [P1] Restore guards refuse downgrade (`manifest.schemaVersion > SCHEMA_VERSION`) and embedder-slug mismatch
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized after each phase
- [ ] CHK-041 [P1] implementation-summary.md reconciled per phase as code lands
- [ ] CHK-042 [P2] decision-record.md ADR statuses updated if a decision changes during implementation
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] No edits outside this child packet for docs, and code edits confined to the dispatch ALLOWED WRITE PATHS
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 15 | [ ]/15 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: 2026-06-01
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-004)
- [ ] CHK-101 [P1] All ADRs have status (Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (chunked NDJSON, row-copy restore, metadata-JSON marker, scoped rewrite)
- [ ] CHK-103 [P2] v1-to-v2 selection boundary documented (scope-based branch)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Full-DB v2 create completes within the SQLITE_BUSY retry budget (NFR-P01)
- [ ] CHK-111 [P1] VACUUM window does not block the daemon beyond expectations
- [ ] CHK-112 [P2] Snapshot disk footprint measured against ~10x DB headroom assumption
- [ ] CHK-113 [P2] Create/restore timings recorded on the ~1 GB DB
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and validated (v29 columns additive, v1 verbatim)
- [ ] CHK-121 [P0] Deliberate daemon rebuild/restart is the explicit final step, not done mid-implementation
- [ ] CHK-122 [P1] `pkill -9 -f "opencode run"` run between dispatches
- [ ] CHK-123 [P1] Per-phase commits to main with explicit paths
- [ ] CHK-124 [P2] Free-space precheck behavior confirmed on the target host
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] Mandatory post-implementation deep-review run; surfaces no P0/P1 before any completion claim
- [ ] CHK-131 [P1] Dependency licenses unchanged (no new dependencies introduced)
- [ ] CHK-132 [P2] Path-handling change reviewed against traversal classes
- [ ] CHK-133 [P2] Data-handling review for snapshot files at rest
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet documents synchronized at completion
- [ ] CHK-141 [P1] `checkpoint_create` tool schema documents `includeEmbeddings`
- [ ] CHK-142 [P2] Operator note on file-swap manual catastrophic-recovery fallback recorded
- [ ] CHK-143 [P2] Knowledge transfer captured in handover if the session ends mid-phase
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Orchestrator | [ ] Approved | |
| Deep-review | Quality gate | [ ] Approved | |
| Operator | Live-proof witness | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
