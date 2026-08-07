---
title: "Implementation Plan: Phase 17: Fanout Stall Watchdog"
description: "Plan for the shipped opt-in lag-ceiling stall watchdog with abort-requeue behavior in the fanout pool."
trigger_phrases:
  - "fanout stall watchdog"
  - "lag-ceiling abort-requeue"
  - "hung lineage abort"
  - "pool slot stall detection"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/017-fanout-stall-watchdog"
    last_updated_at: "2026-07-01T21:52:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped fanout stall-watchdog content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed opt-in stall watchdog"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
    session_dedup:
      fingerprint: "sha256:017a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e1c"
      session_id: "scaffold-content-remediation-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: Fanout Stall Watchdog

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS fanout pool runner |
| **Framework** | Opt-in stall watchdog over active fanout slots |
| **Storage** | Existing retry ledger receives `failure_class:"timeout"` entries for aborted stalled items |
| **Testing** | Spec acceptance requires default behavior unchanged, opt-in abort after lag ceiling, timeout ledger entry, and active-slot concurrency invariant; no dedicated test file is named in spec.md |

### Overview
This phase shipped an opt-in stall watchdog in `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`. When `lagCeilingAction:"abort-requeue"` and an explicit `lagCeilingMs` are configured, active slots get abort handles and stalled items are aborted/requeued through the existing timeout retry ledger without oversubscribing the pool.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: a hung lineage could block queued work until hard child timeout.
- [x] Success criteria measurable: watchdog never activates by default; enabled lag ceiling aborts within one poll cycle after threshold.
- [x] Dependencies identified: timeout retry ledger and active slot abort handles are accessible.

### Definition of Done
- [x] `lagCeilingAction:"abort-requeue"` config added as opt-in only.
- [x] Explicit `lagCeilingMs` threshold required for watchdog activation.
- [x] Active-item abort handles attached per slot.
- [x] Stall polling aborts exceeded slots and settles them through `failure_class:"timeout"` retry ledger.
- [x] Active-slot count remains within configured concurrency after abort.
- [x] Default pool behavior remains unchanged when opt-in is absent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in active-slot stall detection with abort-requeue through existing retry semantics.

### Key Components
- **`lagCeilingAction:"abort-requeue"`**: Explicit opt-in switch; absent config keeps old behavior.
- **`lagCeilingMs`**: Required threshold that defines when a slot is considered stalled.
- **Active abort handles**: Per-slot controls attached when an item starts.
- **Watchdog polling**: Checks active item lag and aborts exceeded slots when configured.
- **Timeout retry ledger**: Existing `failure_class:"timeout"` path used to settle aborted items.

### Data Flow
When the watchdog is enabled, each active pool item gets an abort handle and start/progress timing. A poll loop compares item lag against `lagCeilingMs`; once exceeded, it aborts the slot, records the item through the timeout retry ledger, and frees the slot without increasing active concurrency beyond the configured max.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Runs fanout pool active slots and queue | Add opt-in stall watchdog and abort-requeue behavior | Spec acceptance covers default and enabled behavior |
| Retry ledger | Records failed/requeued work | Use existing `failure_class:"timeout"` path for aborted items | Integration acceptance asserts timeout ledger entry |
| Cross-process abort | Out-of-band abort across processes | Unchanged/out of scope | Spec explicitly excludes cross-process abort |

Required inventories:
- Same-class producers: inspect active slot lifecycle and retry ledger path before adding watchdog behavior.
- Consumers of changed symbols: default callers see unchanged behavior unless opt-in config is present.
- Matrix axes: no `lagCeilingAction`, enabled action without threshold, enabled under threshold, enabled exceeded threshold, retry ledger settlement, and concurrency invariant after abort.
- Algorithm invariant: aborting a stalled item must free exactly its slot and must not increase active slots above the configured max.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is only `fanout-pool.cjs`.
- [x] Confirm timeout retry ledger is reachable from the pool abort path.
- [x] Confirm default pool behavior must remain unchanged.

### Phase 2: Core Implementation
- [x] Add opt-in `lagCeilingAction:"abort-requeue"` config handling.
- [x] Require explicit `lagCeilingMs` threshold when the action is enabled.
- [x] Attach abort handles to active items per slot.
- [x] Add watchdog polling that detects lag beyond the configured ceiling.
- [x] Abort and requeue stalled items through `failure_class:"timeout"` retry ledger.
- [x] Preserve active-slot concurrency accounting after abort.

### Phase 3: Verification
- [x] Verify pool without `lagCeilingAction` lets slow items run to completion unaborted.
- [x] Verify enabled watchdog aborts an exceeded stalled item within one poll cycle.
- [x] Verify aborted item records `failure_class:"timeout"` in retry ledger.
- [x] Verify active slots never exceed configured max after abort.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Default config slot lifecycle matches pre-patch behavior | Spec acceptance criteria; no dedicated test file named |
| Unit/behavior | Enabled watchdog aborts stalled item after `lagCeilingMs` | Mocked hanging item |
| Integration | Aborted item settles through `failure_class:"timeout"` retry ledger | Retry ledger assertion |
| Concurrency | Active slot count remains `<= max` immediately after abort | Pool invariant assertion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing timeout retry ledger | Internal | Available | Aborted stalled items must settle through existing retry semantics |
| Active-item abort handle support | Internal | Available | Required to free a hung slot safely |
| Cross-process abort IPC | Future design | Deferred | Out-of-process abort is not handled by this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Watchdog aborts slow-but-valid work unexpectedly, breaks default pool behavior, or violates active-slot concurrency.
- **Procedure**: Disable/remove `lagCeilingAction:"abort-requeue"` handling in `fanout-pool.cjs`; pool returns to hard child timeout behavior until thresholds and slot accounting are corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
