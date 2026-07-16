---
title: "Decision Record: Fence the enrichment scheduler and startup scan in fatalShutdown"
description: "Why the scheduler is fenced synchronously (flag + drop) and the scan is bounded-awaited, rather than fully draining enrichment before close."
trigger_phrases:
  - "enrichment scan shutdown fence decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/011-enrichment-and-scan-shutdown-fence"
    last_updated_at: "2026-06-15T08:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded ADR-001"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-enrichment-and-scan-shutdown-fence"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Fence the enrichment scheduler and startup scan in fatalShutdown

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Synchronous enrichment fence + bounded scan await before closeDb

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Michel Kerkmeester (owner), main agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

`fatalShutdown` already fences the file watcher and ingest worker before `closeDb()` because they re-resolve the DB through `requireDb()`/`getDb()`, which reopens a closed connection — a write after the TRUNCATE checkpoint leaves a non-empty WAL at rest. The 010 deep-review (F-008, F-012) confirmed the enrichment scheduler and the fire-and-forget startup scan have the same reopen-after-close hazard but were not fenced.

### Constraints

- Cannot fully drain enrichment at shutdown — a run awaits an embedding (network), so a drain is unbounded.
- Must not stall shutdown beyond the existing `SHUTDOWN_DEADLINE_MS`.
- Reuse the established fence machinery and the `shuttingDown` flag.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Fence the enrichment scheduler synchronously (a `enrichmentShuttingDown` flag + clear the queue) in fatalShutdown's pre-await block, with in-flight runs bailing before `requireDb()` and after the embed await; and bound the startup scan by breaking on `shuttingDown` at the loop head and awaiting the tracked promise before `closeDb`.

**How it works**: The enrichment flag is set before any awaited drain, so a queued `setImmediate(run)` that fires during the drain sees the flag and bails before touching the DB; a run mid-embed-await bails after the await, before the write. The scan breaks within the current file and `fatalShutdown` awaits it (bounded by the shutdown deadline). Dropped work stays enrichment-pending → recovered by the backfill on next boot.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sync flag-and-drop + bounded scan await (chosen)** | Bounded; reuses the fence idiom; no data loss (backfill) | A few LOC on the shutdown path | 9/10 |
| Await full enrichment drain before close | "Complete" enrichment | Unbounded (network embeddings) — could blow the shutdown deadline | 2/10 |
| Route enrichment DB access through a shutdown-refusing accessor (job-queue style) | Centralized | Larger change; the flag-bail is sufficient and minimal | 5/10 |
| Leave it (rely on autocheckpoint + boot integrity gate) | Zero change | The codebase fences this exact hazard twice; leaving it inconsistent + a needless boot rebuild | 2/10 |

**Why this one**: Minimal, bounded, mirrors the proven fileWatcher/ingestWorker fences, and loses no data.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A clean shutdown leaves a clean WAL — no needless boot integrity rebuild from a re-dirtied WAL.
- The two reopen-capable background writers are now consistent with the other fenced writers.

**What it costs**:
- A bounded scan await on the shutdown path. Mitigation: the scan breaks within the current file and the existing deadline caps it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fence stalls shutdown | H | Bounded await + `SHUTDOWN_DEADLINE_MS`; real-shutdown test green |
| A write slips past after close | H | Two bail checks + synchronous-thread argument |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 010 deep-review confirmed the reopen-after-close hazard (2 models + source) |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives weighed |
| 3 | **Sufficient?** | PASS | ~25 LOC mirroring the proven fence pattern |
| 4 | **Fits Goal?** | PASS | Shutdown durability — pairs with 009/010 and the 007 durability work |
| 5 | **Open Horizons?** | PASS | Leaves the P2 backlog (queue cap, observability) for follow-ups |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `memory-save.ts`: `enrichmentShuttingDown` flag + exported `shutdownBackgroundEnrichment()`; `run` bails before `requireDb()` and after the embed await; re-arm + schedule guards.
- `context-server.ts`: import + call the fence in fatalShutdown's sync block; `shuttingDown` break in the scan loop; track `startupScanPromise`; await it before `closeDb`.

**How to roll back**: `git revert` the two-file commit + `npm run build`. No data migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
