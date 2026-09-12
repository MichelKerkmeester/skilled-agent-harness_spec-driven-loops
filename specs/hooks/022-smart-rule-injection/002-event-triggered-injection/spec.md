---
title: "Feature Specification: Event-triggered injection research"
description: "Ask what should be injected at an event keyed on what just happened, and measure an event's frequency from its state log before treating it as rare."
trigger_phrases:
  - "event-triggered injection research"
  - "inject on what just happened"
  - "completion event reaches no rules"
  - "measure event frequency from the log"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/002-event-triggered-injection"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Research closed: both event ideas refused, one candidate deferred"
    next_safe_action: "Measure the branch-name guard before encoding it"
    blockers: []
    key_files:
      - "decisions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Event-triggered injection research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `022-smart-rule-injection` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Successor** | `003-shallow-evidence-claims` |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child asks the different question: not what to inject when the user types, but what to inject at an event, keyed on what just happened. It ran ten research iterations with no early convergence on DeepSeek V4.1 Flash at max thinking through `cli-pi`, refused both operator ideas as fatal, and lost its strongest new candidate to a measurement.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An event carries a moment an always-loaded document cannot know about. The pull is to inject something at that moment. Two operator ideas looked like the right first candidates, and the round's strongest new candidate looked like the cleanest fit of all, so the cost of not checking was a hook that fires at a rate nobody had read.

### Purpose

Decide from evidence whether any rule earns an event-keyed injection, refuse what is structurally impossible, and measure an event's frequency from its own state log before treating rarity as a reason to fire on it.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The event-keyed question and the operator ideas proposed for it.
- Each candidate's frequency, read from its state log rather than assumed.
- The one candidate that survived, with the measurement it still needs.

### Out of Scope

- The prompt-keyed question, owned by phase 1.
- The sentinel's event placement, closed as decided and not built; it is revisited only if its log gains a consumer.
- Spec-gate detector quality, which is a real backlog owned by a different concern.

### Files to Change

None. The phase output is evidence and a deferred candidate, feeding the parent decision record.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A refusal states the structural reason, not a cost | The completion idea is refused because the event reaches no rules; the question idea because a question has no author outside the model |
| REQ-002 | Every candidate's frequency is read from its state log | The refused candidate carries the measured firing rate and the observed gate lifetime |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A surviving candidate is recorded as deferred with the measurement it needs | The branch-name guard names the measurement that must precede encoding |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both operator ideas are refused as fatal, each with the structural reason that decided it.
- **SC-002**: The candidate that died on measurement shows why: an existing gate advisory fires about eight times a minute at peak while gates sit unresolved for tens of minutes, so the assumed rarity was false.
- **SC-003**: An event's frequency is read from the log, never reasoned about.
- **SC-004**: The branch-name allocation guard is deferred pending measurement rather than built on an unread rate.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rarity assumed from the shape of an event | A hook fires far more often than its trigger suggests | Read the state log first; a rate that is not measured is not a reason to fire |
| Risk | Changing shipped behavior on contested evidence | A working event is moved to serve an unread log | Leave the sentinel's placement as it is; revisit only if the log gains a consumer |
| Dependency | Each candidate's own state log | No frequency can be established without it | Prefer candidates whose log exists and records firings |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The branch-name allocation guard still needs its measurement before it can be encoded.
- Whether the sentinel log ever gains a reader is the condition that would re-open its event placement.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Decision record:** `../decisions.md`
- **Predecessor:** `../001-deep-research/spec.md`
