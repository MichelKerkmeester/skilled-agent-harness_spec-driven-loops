---
title: "Decision Record: checkpoint-v2 .needs-rebuild Sentinel"
description: "Architectural decisions for the post-restore derived-rebuild sentinel: why a durable marker plus boot/scan repair was chosen over failing the restore or leaving the silent stale window."
trigger_phrases:
  - "checkpoint needs-rebuild sentinel"
  - "post-restore derived rebuild failure"
  - "sentinel decision record"
  - "fail restore vs sentinel"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/005-checkpoint-needs-rebuild-sentinel"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored sentinel decision record from follow-up research"
    next_safe_action: "Implement the chosen sentinel + repair approach on branch"
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
# Decision Record: checkpoint-v2 .needs-rebuild Sentinel

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Durable sentinel plus boot/scan repair

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to close a silent stale-derived window after a checkpoint-v2 restore. `runPostRestoreRebuilds()` rebuilds FTS, communities, and the derived graph best-effort and catches failures, and `restoreCheckpointV2()` calls it after the DB swap and reopen. When a rebuild step fails the restore still returns success, the base snapshot is valid, but the derived artifacts stay stale with nothing scheduled to repair them. The existing boot FTS auto-heal is tied to the `.unclean-shutdown` marker, not to checkpoint-restore rebuild failures, and the startup scan does not invoke the checkpoint derived-rebuild helper.

### Constraints

- The restore must keep returning success for a valid base snapshot - the source data restored correctly even when a derived rebuild failed.
- No `dist/` rebuild, no daemon restart, and no live-DB access in this packet; implementation and unit tests run on a branch only.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: write a durable `.needs-rebuild` sentinel when a post-restore derived rebuild fails or is skipped, and repair it on boot and immediately before the startup scan, clearing it on success.

**How it works**: `runPostRestoreRebuilds()` returns a `{completed, failed, skipped}` summary and exports one shared derived-rebuild helper. `restoreCheckpointV2()` writes the sentinel beside the restore-journal artifacts when the summary has failed or skipped steps and still returns success. Boot and the pre-scan checkpoint probe for the sentinel, run the bounded shared helper, and delete the sentinel on a fully successful rebuild.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **(C) Sentinel + repair on boot/scan (Chosen)** | Durable, non-blocking, closes the window without changing the restore contract | One shared helper and idempotent repair needed across three sites | 9/10 |
| (A) Keep existing behavior | No work | The silent stale window remains until an unrelated scan re-indexes | 2/10 |
| (B) Fail the restore on a derived-rebuild failure | Eliminates the window outright | Too harsh - the source snapshot restored fine, so failing a valid restore loses good data access | 3/10 |

**Why this one**: it repairs exactly the post-restore rebuild hole without touching the restore success contract, and it degrades safely because the repair is bounded and never blocks boot or scan.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A post-restore derived-rebuild failure becomes self-healing on the next boot and before the startup scan.
- Restore, boot, and scan share one derived-rebuild helper, so derived state stays consistent across paths.

**What it costs**:
- Repair must be idempotent because boot, pre-scan, and scan can each run it. Mitigation: rebuild steps replace derived rows rather than appending, and a repeated-repair test asserts stable derived state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Heavy rebuild at boot stalls startup | M | Bounded + non-fatal rebuild, logged, scheduled right before the startup scan. |
| Persistently failing rebuild retries every boot | L | Sentinel retained on failure but never blocks boot or scan. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A real silent stale-derived window exists today after a caught post-restore rebuild failure. |
| 2 | **Beyond Local Maxima?** | PASS | Fail-restore and status-quo were both considered and rejected. |
| 3 | **Sufficient?** | PASS | One marker plus a shared bounded repair closes the window with no schema change. |
| 4 | **Fits Goal?** | PASS | Directly on the path to reliable derived search after a restore. |
| 5 | **Open Horizons?** | PASS | The shared helper and marker generalize to other rebuild-needed triggers later. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `checkpoints.ts`: rebuild summary + exported shared helper, `.needs-rebuild` path/write/clear helpers, sentinel write from `restoreCheckpointV2()` on failed/skipped.
- `context-server.ts`: boot + pre-scan sentinel check that runs the bounded helper and clears on success.
- `memory-index.ts`: scan-lease sentinel check + repair count (additive, distinct from packet 004).
- `vector-index-store.ts`: swap-done journal recovery preserves/creates rebuild-needed state.

**How to roll back**: revert the branch commits; no deploy happened, so the live DB is untouched, and any leftover `.needs-rebuild` marker file can be deleted safely.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Export one shared derived-rebuild helper

**Status**: Accepted

**Context**: The sentinel is written by restore and consumed by boot, the pre-scan checkpoint, and the scan. If each site reimplemented the rebuild, the derived state could drift between paths.

**Decision**: Export ONE shared derived-rebuild helper from `checkpoints.ts` and reuse it from `restoreCheckpointV2()`, the boot/pre-scan repair, and the scan-lease repair. The helper returns the `{completed, failed, skipped}` summary that the sentinel write keys off.

**Consequences**: A single rebuild implementation keeps derived artifacts consistent and makes idempotency easy to test in one place. The cost is a small refactor of `runPostRestoreRebuilds()` to expose the helper and its summary.

## ADR-003: Sentinel retained on failure, never blocking

**Status**: Accepted

**Context**: A persistently failing rebuild must not wedge the daemon. The repair runs on every boot and before every scan when the sentinel is present.

**Decision**: On a failed repair, leave the `.needs-rebuild` sentinel in place and continue boot and the scan; the repair is best-effort each cycle. The sentinel is cleared only on a fully successful rebuild.

**Consequences**: The system retries until a rebuild succeeds without ever blocking startup. The accepted trade-off is that a permanently broken rebuild repeats bounded work each cycle; a future backoff or attempt counter is left as an open question.

## ADR-004: Keep the boot FTS .unclean-shutdown auto-heal unchanged

**Status**: Accepted

**Context**: Boot already has an FTS auto-heal keyed on the `.unclean-shutdown` marker. That trigger fires on unclean shutdown, not on checkpoint-restore rebuild failures, so it does not cover this window.

**Decision**: Leave the `.unclean-shutdown` auto-heal contract as is and add the `.needs-rebuild` sentinel as a separate, additive trigger. The two markers are independent and may both fire.

**Consequences**: No regression to the existing auto-heal behavior, and the new sentinel path is isolated and easy to reason about. The minor cost is two distinct boot-time repair triggers that must each stay non-fatal.

## Open question for the operator (research deferral override)

The follow-up research recommended DEFERRING this work. The operator explicitly authorized implementing it now alongside packet 004, so this packet is active by operator decision. Whether to bound sentinel retries with a backoff or attempt counter is left open; the current contract retries best-effort each boot/scan cycle without ever blocking.
