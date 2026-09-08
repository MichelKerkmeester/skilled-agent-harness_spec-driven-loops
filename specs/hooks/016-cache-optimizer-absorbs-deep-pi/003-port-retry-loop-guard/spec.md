---
title: "Feature Specification: Phase 3: break paid retry loops"
description: "A failing turn can re-issue the same billable tool batch until the budget is gone. The guard tracks tool calls as batches and escalates only when a whole batch fails repeatedly, with any success resetting the streak, so a genuine single retry is untouched while a storm is stopped."
trigger_phrases:
  - "pi cache break"
  - "cache optimizer loops"
  - "phase 3 cache optimizer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/003-port-retry-loop-guard"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped and independently verified"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-003-port-retry-loop-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Batch-level failure tracking, not a per-call retry counter: a per-call counter fires on legitimate retries and misses non-converging partial successes"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: break paid retry loops

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

A turn whose tool batch keeps failing keeps costing money for the same request. This phase adds batch-level failure tracking: the whole batch has to fail repeatedly before anything escalates, and any successful call resets both streaks.

**Key Decisions**: batch-level, not per-call; success resets; the guard breaks a loop and never rewrites the request to make one succeed

**Critical Dependencies**: phase 002-port-cache-economics.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 002-port-cache-economics |
| **Successor** | 004-port-hash-verified-edits |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the parent decomposition.

**Scope Boundary**: this capability only. No change to cache measurement, prompt rewriting or compat handling.

**Dependencies**: phase 002-port-cache-economics landed.

**Deliverables**: the behavior described below, with tests that fail without it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A retry loop is expensive in a way that is invisible until the bill arrives: the same request is
issued again and again, each attempt billed, with nothing in the extension noticing the repetition.
A naive per-call retry counter is the wrong instrument — it fires on a single legitimate retry and
misses the case where a batch partially succeeds each time and never converges. The signal that
matters is a whole batch failing repeatedly with no success in between.

### Purpose

A turn that keeps failing the same way stops re-issuing the same billable request, while a single legitimate retry is unaffected.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Batch assembly from a message's tool calls, and outcome recording per call.
- A failure streak that escalates only when the entire batch fails repeatedly.
- Reset of both streaks on any successful call.
- Session-scoped state, surfaced when it fires.

### Out of Scope

- **Rewriting the request to make it succeed.** The guard stops a loop; it never edits what the user asked for.
- **Cross-session persistence.** Guard state lives for the session and is not written to disk.
- **Provider-level retry policy.** Transport retries are the provider's concern, not this guard's.
- **Cache measurement, prompt rewriting and compat handling** — untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Batch state, outcome recording, streak escalation, reset on success, wired to the tool-call and tool-result hooks |
| `.pi/extensions/pi-cache-optimizer/tests/*.test.ts` | Create | Storm stopped; single retry unaffected; success resets; guard cannot fire on a first attempt |
| `.pi/extensions/pi-cache-optimizer/README.md` | Modify | Document when the guard fires and what it does not do |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A repeated whole-batch failure escalates instead of re-issuing indefinitely |
| REQ-002 | Any successful call resets the streaks |
| REQ-003 | The guard cannot fire on a first attempt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | When the guard fires it surfaces the blocker rather than failing quietly |
| REQ-005 | Guard state does not persist across sessions |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A test drives a retry storm and asserts it stops.
- **SC-002**: A test drives one legitimate retry and asserts the guard stays silent.
- **SC-003**: `npm --prefix .pi/extensions/pi-cache-optimizer run check` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Guard fires on a legitimate retry | High — breaks working flows | Escalation requires a repeated whole-batch failure; a single retry and any partial success cannot trigger it |
| Risk | Guard masks a real error by swallowing it | High | Firing surfaces the blocker; it never silently succeeds |
| Risk | Batch identity mis-derived, so unrelated calls share a streak | Medium | Batches come from the message's own tool calls, tested against a two-batch sequence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether escalation should be a hard stop or a warning on the first escalation. Decide from what the hook API allows the extension to do without ending the turn on the user's behalf.
<!-- /ANCHOR:questions -->
