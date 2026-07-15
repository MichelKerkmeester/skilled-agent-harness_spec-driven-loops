---
title: "Implementation Plan: checkpoint-v2 .needs-rebuild Sentinel"
description: "Write a durable .needs-rebuild sentinel when a post-restore derived rebuild fails or skips, and repair it on boot and before the startup scan via one shared derived-rebuild helper, clearing it on success."
trigger_phrases:
  - "checkpoint needs-rebuild sentinel"
  - "post-restore derived rebuild failure"
  - "boot derived rebuild repair"
  - "shared derived rebuild helper"
  - "checkpoint-v2 rebuild marker"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored sentinel implementation plan from follow-up research"
    next_safe_action: "Thread rebuild result + write sentinel in checkpoints.ts on branch"
    blockers: []
    key_files:
      - "mcp_server/lib/storage/checkpoints.ts"
      - "mcp_server/context-server.ts"
      - "mcp_server/handlers/memory-index.ts"
      - "mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-sentinel-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: checkpoint-v2 .needs-rebuild Sentinel

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

> Line anchors below are from the research read of the current tree and are **approximate**. The
> implementer MUST locate each site by the described function/behavior and read surrounding code first -
> do not edit by blind line number.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | Spec Kit Memory MCP server (`mcp_server/`) |
| **Storage** | SQLite + FTS + derived community/graph artifacts |
| **Testing** | vitest |

### Overview
Add a durable on-disk `.needs-rebuild` sentinel that records a failed or skipped post-restore derived rebuild. The restore still succeeds because the base snapshot is valid. Boot and the pre-scan checkpoint detect the sentinel and run a bounded, non-fatal derived rebuild through ONE shared helper, clearing the sentinel on success.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see `spec.md`)
- [x] Success criteria measurable (SC-001/SC-002)
- [x] Dependencies identified (`checkpoints.ts`, `context-server.ts`, `memory-index.ts`, `vector-index-store.ts`)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-006)
- [ ] Tests passing (new + affected vitest suites)
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Durable sentinel marker plus a shared bounded repair helper invoked at three sites (restore-fail write, boot/pre-scan repair, scan-lease repair).

### Key Components
- **Shared derived-rebuild helper**: the single exported function that rebuilds FTS, communities, and derived graph and returns a `{completed, failed, skipped}` summary. Reused by restore, boot, and scan.
- **Sentinel helpers**: `.needs-rebuild` path resolver, write-on-failure, and clear-on-success, placed next to the restore-journal helpers in `checkpoints.ts`.
- **Boot/pre-scan repair hook**: a `context-server.ts` check after DB init and again before the scheduled startup scan that runs the bounded helper and clears the sentinel on success.
- **Scan-lease repair**: a `memory-index.ts` check under the existing scan lease that runs the helper and reports repair counts.

### Data Flow
`restoreCheckpointV2()` swaps + reopens the DB, calls the shared rebuild helper, and on a failed/skipped summary writes `.needs-rebuild` (restore still returns success). On the next boot, `context-server.ts` probes for the sentinel after DB init and before the startup scan; if present it runs the bounded helper and clears the sentinel on success. The scan path performs the same check under its lease and reports counts. Swap-done journal recovery in `vector-index-store.ts` preserves or creates rebuild-needed state when rebuild evidence is absent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This work touches persistence and startup sequencing, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runPostRestoreRebuilds()` (`checkpoints.ts` ~1701-1772) | Best-effort post-restore rebuild that catches failures | update: return `{completed, failed, skipped}`; export the shared helper | `rg -n 'runPostRestoreRebuilds' mcp_server` + unit test on the summary shape |
| `restoreCheckpointV2()` (`checkpoints.ts` ~2456-2464) | Calls the rebuild after the DB swap/reopen | update: write `.needs-rebuild` on failed/skipped, still return success | unit test: forced rebuild failure → success result + sentinel exists |
| restore-journal helpers (`checkpoints.ts` ~723-768) | Own restore-journal path/write/clear | update: add sibling `.needs-rebuild` path/write/clear helpers | `rg -n 'needs-rebuild' mcp_server` |
| boot FTS auto-heal (`context-server.ts` ~364-418) | Heals FTS via `.unclean-shutdown` marker | unchanged: sentinel path is additive, separate trigger | `rg -n 'unclean-shutdown' mcp_server/context-server.ts` |
| boot/init + startup scan (`context-server.ts` ~1667-1670, ~2066-2091, scan ~1385-1477) | Init DB, then schedule the startup scan | update: probe sentinel after init and before the scan; run bounded helper; clear on success | unit test: sentinel present → bounded rebuild runs → sentinel cleared |
| scan handler (`memory-index.ts` ~249-333) | Indexes under the scan lease (packet 004 also edits here) | update: additive sentinel check + repair count in a distinct region | diff review: no overlap with packet 004 backfill; unit test reports count |
| swap-done journal recovery (`vector-index-store.ts` ~876-925) | Recovers a swap-done journal | update: preserve/create rebuild-needed state when rebuild evidence is absent | unit test: swap-done recovery without evidence → rebuild-needed state present |

Required inventories:
- Same-class producers: `rg -n 'runPostRestoreRebuilds|rebuildDerived|rebuildCommunities|rebuildFts' mcp_server/lib/storage mcp_server/lib/search`.
- Consumers of changed symbols: `rg -n 'runPostRestoreRebuilds|needs-rebuild|restoreCheckpointV2' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: rebuild outcome (success | failed | skipped) x site (restore | boot | pre-scan | scan) - enumerate the rows that change state before implementation.
- Algorithm invariant: the base snapshot is never mutated by the repair path; the sentinel is written only on failed/skipped and cleared only on a fully successful rebuild.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read current `checkpoints.ts`, `context-server.ts`, `memory-index.ts`, `vector-index-store.ts` and confirm the real line ranges and rebuild-step set.
- [ ] Confirm packet 004's `memory-index.ts` edit region so the sentinel check lands in a distinct region.
- [ ] Branch off (no `dist/` rebuild, no daemon restart, no live DB).

### Phase 2: Core Implementation
- [ ] Make `runPostRestoreRebuilds()` return `{completed, failed, skipped}` and export ONE shared derived-rebuild helper.
- [ ] Add `.needs-rebuild` path/write/clear helpers next to the restore-journal helpers.
- [ ] Write the sentinel from `restoreCheckpointV2()` on a failed/skipped summary; keep the restore result success.
- [ ] Add the boot + pre-scan sentinel check in `context-server.ts`; run the bounded helper; clear on success.
- [ ] Add the scan-lease sentinel check + repair count in `memory-index.ts` (additive, distinct region).
- [ ] Preserve/create rebuild-needed state in `vector-index-store.ts` swap-done recovery.

### Phase 3: Verification
- [ ] Run new + affected vitest suites.
- [ ] Scoped typecheck of touched TS - no new errors.
- [ ] `validate.sh --strict` for this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Forced rebuild failure writes the sentinel and restore still returns success | vitest |
| Unit | A successful repair clears the sentinel; a failed repair retains it | vitest |
| Unit | Boot + pre-scan run the bounded rebuild; scan reports repair counts | vitest |
| Integration | Swap-done journal recovery without rebuild evidence preserves/creates rebuild-needed state | vitest (throwaway DB) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `checkpoints.ts` restore + rebuild functions | Internal | Green | No sentinel write site; the stale window remains open. |
| `context-server.ts` boot/scan sequencing | Internal | Green | No boot/pre-scan repair; the sentinel is written but never consumed. |
| `memory-index.ts` (shared with packet 004) | Internal | Yellow | Edit must stay additive + distinct to avoid integration conflict with packet 004. |
| `vector-index-store.ts` swap-done recovery | Internal | Green | Recovery would not preserve rebuild-needed state without rebuild evidence. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Boot regression, startup stall, or test failures attributable to the sentinel repair path.
- **Procedure**: Revert the branch commits (no production deploy occurred); the live DB stays on its current state because no migration or daemon restart was performed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read current code + confirm line ranges and packet 004 region |
| Core Implementation | Medium | Shared helper + sentinel helpers + 4-file wiring |
| Verification | Low | New + affected vitest suites, scoped typecheck, strict validate |
| **Total** | | **Small-medium, low risk** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Branch is isolated (no `dist/` rebuild committed)
- [ ] No daemon restart performed
- [ ] No live-DB mutation performed

### Rollback Procedure
1. Stop using the branch (no feature flag needed; deploy never happened).
2. `git revert` or drop the branch commits.
3. Re-run the affected vitest suites on the prior tree to confirm green.
4. No stakeholder notification needed (no user-facing or production change).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - the sentinel is a local marker file; deleting it is safe and the base snapshot is never mutated.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│ Shared rebuild      │────►│ Sentinel helpers    │────►│ Restore writes      │
│ helper + summary    │     │ (path/write/clear)  │     │ sentinel on fail    │
└─────────────────────┘     └─────────────────────┘     └──────────┬──────────┘
                                                                   │
                                          ┌────────────────────────┼────────────────────────┐
                                          ▼                        ▼                        ▼
                                 ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
                                 │ Boot/pre-scan   │     │ Scan-lease      │     │ Swap-done       │
                                 │ repair          │     │ repair + count  │     │ recovery state  │
                                 └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Shared rebuild helper | None | `{completed, failed, skipped}` summary | Sentinel write, boot/scan repair |
| Sentinel helpers | Shared helper | `.needs-rebuild` path/write/clear | Restore write, boot/scan repair |
| Restore write | Shared helper, sentinel helpers | Sentinel on failed/skipped | Boot/scan repair |
| Boot/pre-scan + scan repair | Shared helper, sentinel helpers | Cleared sentinel on success | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Shared rebuild helper + summary** - read current code, thread the summary - CRITICAL
2. **Sentinel helpers + restore write** - write on failed/skipped, keep restore success - CRITICAL
3. **Boot/pre-scan + scan repair** - consume the sentinel, clear on success - CRITICAL

**Total Critical Path**: Small-medium implementation on a single workstream.

**Parallel Opportunities**:
- The `vector-index-store.ts` swap-done recovery change can proceed alongside the boot/scan wiring once the sentinel helpers exist.
- Test authoring for restore-write can run while the boot/scan repair is being wired.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Shared helper + summary landed | `runPostRestoreRebuilds()` returns `{completed, failed, skipped}` | Phase 2 |
| M2 | Sentinel write on restore failure | Forced-failure test: success result + sentinel present | Phase 2 |
| M3 | Boot/scan repair clears sentinel | Sentinel-present test: bounded rebuild runs, sentinel cleared | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Sentinel-plus-repair over fail-restore or status-quo

**Status**: Accepted

**Context**: A post-restore derived-rebuild failure currently leaves a silent stale-derived window because the restore catches the failure and still returns success.

**Decision**: Write a durable `.needs-rebuild` sentinel on a failed/skipped rebuild and repair it on boot and before the startup scan via one shared helper, clearing it on success. Full rationale and rejected options live in `decision-record.md`.

**Consequences**:
- The stale window closes without changing the restore success contract for a valid base snapshot.
- Repair must be idempotent because boot, pre-scan, and scan can all run it.

**Alternatives Rejected**:
- Fail the restore on a derived-rebuild failure: too harsh, the source snapshot restored fine.
- Keep existing behavior (scan eventually re-indexes): the silent stale window remains.

See `decision-record.md` for the full ADR set.
