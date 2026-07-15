---
title: "Feature Specification: Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop"
description: "The background-enrichment concurrency cap is defeated because the in-flight counter is incremented inside the deferred callback, so a burst (a startup scan calling it per row) schedules unbounded setImmediate work that drains as a microtask chain and starves the event loop — the IPC accept() never runs and the daemon wedges at 100% CPU."
trigger_phrases:
  - "background enrichment cap"
  - "enrichment scheduler starvation"
  - "daemon event loop wedge"
  - "scheduleBackgroundEnrichment unbounded"
  - "memory-save concurrency cap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/010-background-enrichment-concurrency-cap"
    last_updated_at: "2026-06-14T20:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored spec from confirmed root cause"
    next_safe_action: "Run the 10-iteration deep-review on the fix"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-background-enrichment-concurrency-cap"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Bound the background-enrichment scheduler so a save or startup-scan burst cannot starve the daemon event loop

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The spec-memory daemon's background-enrichment scheduler has a broken concurrency cap: it increments the in-flight counter *inside* the deferred `setImmediate` callback, not at schedule time. A burst of saves — most acutely a startup scan calling it once per indexed row — all read the still-zero counter before any callback runs, all pass the `< 4` gate, and pile up unbounded `setImmediate` callbacks that then self-drain as a synchronous microtask chain. The event loop never returns to the poll phase, so the daemon's IPC `accept()` is starved and the process spins at ~100% CPU serving nothing. This is the trigger behind the live incident the 009 supervisor fix recovers from. The fix reserves the slot at schedule time and re-arms queued work via `setImmediate`.

**Key Decisions**: Reserve the concurrency slot before scheduling (not inside the callback); re-arm the queue through `setImmediate` rather than a synchronous call; add a periodic poll-phase yield to the startup scan loop.

**Critical Dependencies**: None — localized to `memory-save.ts` and `context-server.ts`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/003-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`scheduleBackgroundEnrichment` (`handlers/memory-save.ts`) incremented `activeBackgroundEnrichments` inside the deferred `run` callback (executed later via `setImmediate`), then gated scheduling on `activeBackgroundEnrichments < MAX_BACKGROUND_ENRICHMENTS`. A burst calls the function many times before any callback runs, so every call saw the still-zero counter, passed the cap, and scheduled a callback — the cap was defeated. The `finally` then called the next queued task synchronously, so queued work drained as a microtask chain that never yielded to libuv's poll phase. With thousands of rows (a startup scan over 11,507 paths left 2,947 incomplete enrichments in the incident), the daemon spun at ~100% CPU and never serviced IPC.

### Purpose
The enrichment scheduler honors its concurrency cap under any burst and always yields the event loop between runs, so the daemon stays responsive during large scans.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix `scheduleBackgroundEnrichment` so the slot is reserved at schedule time and queued work re-arms via `setImmediate`.
- Add a periodic poll-phase yield to the `startupScan` indexing loop (`context-server.ts`).

### Out of Scope
- The 009 supervisor recovery fix (already shipped) — this is the trigger, that was the recovery.
- Re-tuning `MAX_BACKGROUND_ENRICHMENTS` (4 stays) — the bug is the accounting, not the bound.
- Reworking the enrichment work itself (entity extraction, summary embedding, graph lifecycle).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Reserve the slot before scheduling; re-arm queued work via `setImmediate` |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Periodic `setImmediate` yield in the startup-scan loop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The cap holds under a burst | `activeBackgroundEnrichments` is incremented at schedule time, so concurrent in-flight + scheduled runs never exceed `MAX_BACKGROUND_ENRICHMENTS` |
| REQ-002 | Queued work yields the event loop | Dequeued tasks are re-armed via `setImmediate`, not a synchronous call, so the poll phase runs between batches |
| REQ-003 | No enrichment behavior regression | Existing enrichment/async-scan tests stay green; deferred-result semantics unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Startup scan yields periodically | The scan loop awaits a `setImmediate` every N files so a large scan does not monopolize the loop |
| REQ-005 | Clean typecheck/build | `tsc --noEmit` stays at the 0-error baseline; `npm run build` regenerates dist |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Under a save/scan burst the daemon's event loop continues to service IPC (no ~100% CPU wedge); the enrichment cap is honored.
- **SC-002**: `tsc --noEmit` 0 errors (delta vs baseline 0); enrichment + async-scan regression tests green; dist rebuilt with the fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Counter accounting off-by-one (slot leak or premature schedule) | Med | Increment once in `start` (schedule + dequeue), decrement once in `finally`; reasoned through + regression tests |
| Risk | Scan yield slows large scans | Low | Yield every 50 files only; `setImmediate` overhead is negligible vs per-file DB work |
| Risk | Bounded-cap invariant lacks a direct unit test | Med | Function is internal; verified by reasoning + regression + a 10-iteration deep-review |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Enrichment throughput is unchanged (same cap of 4); the only timing change is a `setImmediate` hop between runs, sub-millisecond.

### Security
- **NFR-S01**: No security surface change; purely internal scheduling.

### Reliability
- **NFR-R01**: A burst of any size keeps the daemon responsive — the cap and the periodic yield bound CPU occupancy.

---

## 8. EDGE CASES

### Data Boundaries
- Single save (no burst): scheduled immediately, runs, drains — unchanged behavior.
- Burst >> cap: first `MAX` reserved and scheduled, remainder queued; queue drains one-per-completion via `setImmediate`.

### Error Scenarios
- Enrichment run throws: `finally` still decrements and re-arms the next queued task (no slot leak).
- DB unavailable mid-run: run returns early; row stays enrichment-pending for the backfill path (unchanged).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 7/25 | Files: 2, LOC: ~14, Systems: 1 |
| Risk | 16/25 | Core save path + event-loop behavior; no API/schema change |
| Research | 13/20 | Live incident forensic + sampled stack + DB corroboration |
| Multi-Agent | 3/15 | gpt-5.5 council root cause; single-author fix |
| Coordination | 4/15 | Pairs with the 009 recovery fix |
| **Total** | **43/100** | **Level 3 (risk-driven)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Slot accounting leaks (cap drifts down over time) | H | L | Single increment/decrement pairing; regression + deep-review |
| R-002 | Fix does not actually prevent the wedge | H | L | Reserve-before-schedule is the documented root-cause remedy; matches the sampled-stack signature |
| R-003 | Scan yield introduces a behavior change in indexing | M | L | Yield is a no-op `setImmediate`; indexing counts unchanged |

---

## 11. USER STORIES

### US-001: Operator runs a large startup scan (Priority: P0)

**As an** operator whose daemon indexes thousands of files at boot, **I want** the scan to not peg a core and stop serving requests, **so that** memory tooling stays usable during and after indexing.

**Acceptance Criteria**:
1. Given a scan over thousands of rows, When enrichment is scheduled per row, Then in-flight enrichment never exceeds the cap and the daemon keeps answering IPC.

---

### US-002: Saves remain enriched (Priority: P1)

**As a** caller saving memories, **I want** background enrichment to still run, **so that** entity/summary/graph data is populated as before — just bounded.

**Acceptance Criteria**:
1. Given a normal save, When enrichment is scheduled, Then it runs and records results exactly as before the fix.

---

## 12. OPEN QUESTIONS

- None outstanding. The bounded-cap invariant has no isolated unit test (the scheduler is internal); the 10-iteration deep-review is the deep correctness check.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
