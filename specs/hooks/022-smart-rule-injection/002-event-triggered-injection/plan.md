---
title: "Implementation Plan: Event-triggered injection research"
description: "Plan for the event-keyed research round: test the operator ideas structurally, read each event's state log, and record the deferred candidate."
trigger_phrases:
  - "event-triggered injection plan"
  - "event frequency measurement plan"
  - "deferred candidate record"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/002-event-triggered-injection"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Plan executed: two ideas refused, one candidate deferred on a rate"
    next_safe_action: "Measure the branch-name guard before encoding it"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Event-triggered injection research

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Documentation and evidence only; no runtime code |
| **Sources** | Event definitions, their state logs, and the rules each event can reach |
| **Driver** | Ten research iterations on DeepSeek V4.1 Flash at max thinking through `cli-pi` |
| **Evidence** | A measured rate per candidate; a structural test per refusal |

### Overview

Each event is checked twice: first structurally — does the event reach any rules, and does its trigger have an author outside the model — then empirically, by reading the state log of the event before treating its rarity as a reason to fire on it. Only candidates that pass both tests reach the record, and a candidate that fails on an unmeasured rate is deferred rather than built.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [x] Both operator ideas refused with their structural reason.
- [x] The strongest new candidate measured against its state log.
- [x] The surviving candidate recorded as deferred with the measurement it needs.

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Structural test, then measurement. An event that reaches no rules cannot carry an injection; a trigger with no author outside the model cannot be composed by any surface; and an event admitted on assumed rarity has not been tested at all.

### Key Components

- **The reach test**: whether the event's moment is visible to any rule-consuming surface.
- **The author test**: whether the ask can be composed by anything outside the model.
- **The state log**: the only admissible source for an event's firing rate.

### Data Flow

Event to the structural tests; survivors to their state logs for a measured rate; survivors of that to the record. A candidate that fails measurement is deferred with the measurement named, not encoded.

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Frame
- [x] Take the event-keyed question and both operator ideas as candidates.

### Phase 2: Test
- [x] Apply the reach and author tests; then read the state log of the strongest candidate.

### Phase 3: Record
- [x] Publish the refusals, the measurement, and the deferred candidate.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Evidence standard, applied to every claim in this phase:

| Check | Scope | Rule |
|-------|-------|------|
| Reach | An event claimed as injectable | The event must be visible to a surface that consumes rules |
| Author | A trigger claimed as composable | The ask must have an author outside the model |
| Rate | A candidate claimed as rare | The rate comes from the state log, with its firing count and the observed lifetime |

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Event state logs | Internal | Green | No measured rate, so no candidate survives on rarity |
| The event definitions themselves | Internal | Green | The reach and author tests have nothing to test against |

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A refused event is later shown to reach rules, or a deferred candidate's measurement shows it is rare.
- **Procedure**: No code changed. Re-open the affected record and carry the corrected finding into the decision record; the sentinel's shipped behavior is untouched either way.

<!-- /ANCHOR:rollback -->

## RELATED DOCUMENTS

- **Specification:** `spec.md`
- **Tasks:** `tasks.md`
