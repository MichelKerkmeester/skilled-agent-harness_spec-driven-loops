---
title: "Decision Record: Bound the background-enrichment scheduler"
description: "Why the in-flight counter is reserved at schedule time and queued enrichment re-arms via setImmediate, rather than lowering the cap or debouncing."
trigger_phrases:
  - "background enrichment cap decision"
  - "enrichment scheduler adr"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/010-background-enrichment-concurrency-cap"
    last_updated_at: "2026-06-14T20:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded ADR-001 for the cap fix"
    next_safe_action: "Run the deep-review"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-background-enrichment-concurrency-cap"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Bound the background-enrichment scheduler

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reserve the slot before scheduling; re-arm via setImmediate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-14 |
| **Deciders** | Michel Kerkmeester (owner), main agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The background-enrichment scheduler bumped `activeBackgroundEnrichments` inside the deferred `run` callback, then gated new scheduling on that counter. Because the callback runs later (via `setImmediate`), a burst — a startup scan calling the scheduler once per indexed row — reads the still-zero counter on every call, passes the cap, and schedules unbounded callbacks that then self-drain as a synchronous microtask chain. The event loop never returns to the poll phase and the daemon spins at ~100% CPU without serving IPC.

### Constraints

- Keep the existing cap value (`MAX_BACKGROUND_ENRICHMENTS = 4`) — the bound is fine, the accounting was wrong.
- Preserve enrichment behavior and the pending-marker backfill safety net.
- TypeScript change compiled to dist; revertible by `git revert` + rebuild.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Increment the counter at schedule time (in a `start` helper that increments then `setImmediate`s), and re-arm dequeued work through that same helper instead of calling it synchronously from the `finally`.

**How it works**: `start(task)` does `activeBackgroundEnrichments++` then `setImmediate(task)`. The initial schedule and every queue drain go through `start`, so the counter reflects reserved slots the moment work is scheduled — a burst sees the true count and queues past the cap. The `finally` decrements once and, if the queue is non-empty, `start`s the next task, returning control to the poll phase between runs.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reserve-before-schedule + setImmediate re-arm (chosen)** | Fixes the root cause directly; minimal; preserves behavior | One `setImmediate` hop per dequeue | 9/10 |
| Lower `MAX_BACKGROUND_ENRICHMENTS` | Trivial | Does not fix the accounting — a burst still over-schedules past any bound | 2/10 |
| Debounce/timestamp scheduling | Could throttle bursts | More state; the correct fix is counter timing, not throttling | 4/10 |

**Why this one**: It corrects the exact defect (counter timing) with the least change and no behavior loss.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The cap holds under any burst; in-flight enrichment is bounded.
- The startup scan and the queue drain both yield the poll phase, so the daemon keeps serving IPC.

**What it costs**:
- A `setImmediate` hop per dequeued task. Mitigation: sub-millisecond, dwarfed by the enrichment work itself.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slot accounting leak | H | One increment per `start`, one decrement per `finally`; regression + deep-review |
| No isolated cap unit test (internal function) | M | Verified by reasoning + regression + 10-iteration deep-review; revisit if the review asks for extraction |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The live wedge traced to this exact loop; root cause of the incident |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives weighed |
| 3 | **Sufficient?** | PASS | ~14 LOC; corrects the counter timing without new mechanism |
| 4 | **Fits Goal?** | PASS | Daemon reliability — pairs with the 009 recovery fix |
| 5 | **Open Horizons?** | PASS | Leaves room for a future extracted, unit-testable scheduler if wanted |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `memory-save.ts` `scheduleBackgroundEnrichment`: `start` helper increments + `setImmediate`s; `finally` re-arms via `start`.
- `context-server.ts` `startupScan`: `await` a `setImmediate` every 50 indexed files.

**How to roll back**: `git revert` the two-file commit, then `npm run build` to regenerate dist. No data migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
