---
title: "Implementation Summary: Event-triggered injection research"
description: "Closeout record for the event-keyed research round: two structural refusals, one measured death, and the deferred branch-name guard."
trigger_phrases:
  - "event-triggered injection closeout"
  - "event rate measurement finding"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/002-event-triggered-injection"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Phase 2 closed: both event ideas refused, one candidate deferred"
    next_safe_action: "Measure the branch-name guard before encoding it"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: Event-triggered injection research

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-event-triggered-injection |
| **Status** | Complete |
| **Completed** | 2026-09-12 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The event-keyed question is settled the same way the prompt-keyed one was, and the answer is smaller: both operator ideas are refused as fatal rather than expensive, the round's strongest new candidate died on a measurement instead of an opinion, and one narrow candidate survives as deferred.

### Refused as Fatal

Completion-presentation injection fails because the completion event reaches no rules, and its one historically model-visible channel lost its reader when a structural index was removed. Question-tool triggering fails because a question has no author outside the model, so no surface can compose the ask; a turn-end nudge can only reach the next turn, which is not the one that needed it.

### Died on Measurement

An existing gate advisory looked like the cleanest fit until its state log was read: it fires roughly eight times a minute at peak while gates sit unresolved for tens of minutes. The assumed rarity was false, and an event's frequency has to be read from the log rather than reasoned about.

### Deferred

A narrow git branch-name allocation guard survives as the only candidate with a real moment behind it. It is deferred pending measurement, not encoded.

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ten research iterations ran on DeepSeek V4.1 Flash at max thinking through `cli-pi` with no early convergence. Candidates were tested twice: structurally, against whether the event reaches any rules and whether the trigger has an author outside the model; then empirically, by reading the state log of the strongest candidate before treating its rarity as a reason to fire. The sentinel's shipped event placement was left alone, and the two closed items were recorded with why they were not built.

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refuse completion-presentation injection | The completion event reaches no rules, and its one model-visible channel lost its reader |
| Refuse question-tool triggering | A question has no author outside the model, so no surface can compose the ask |
| Reject the gate-advisory candidate on measurement | Its firing rate was about eight a minute at peak against gates unresolved for tens of minutes |
| Defer the branch-name guard rather than encode it | Its rarity is still an assumption until its own log is read |
| Leave the sentinel's event placement unchanged | With no documentation settling the question and the log unread, moving shipped behavior is the wrong trade |

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reach test | The completion event reaches no rules; recorded with the channel it lost |
| Author test | No surface outside the model can compose a question; recorded as structural |
| Rate | The gate advisory's firing count and gate lifetime were read from its state log |
| Deferred candidate | The branch-name guard names the measurement that must precede encoding |

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. The branch-name guard is unproven; its measurement has not been taken, so the packet records a deferral rather than a design.
2. Five of six runtimes carry a live completion detector and no model-visible channel from any completion event; that is one fleet-wide pattern, and this phase refused the injection answer rather than fixing the pattern.

<!-- /ANCHOR:limitations -->
