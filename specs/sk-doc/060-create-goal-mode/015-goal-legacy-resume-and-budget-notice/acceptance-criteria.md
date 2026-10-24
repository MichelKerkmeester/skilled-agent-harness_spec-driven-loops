---
title: "Acceptance Criteria: Phase 15: goal-legacy-resume-and-budget-notice"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal legacy resume budget notice acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/015-goal-legacy-resume-and-budget-notice"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Record the baseline goal suites, then name the retired suppression reasons"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-15-goal-legacy-resume-and-budget-notice"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 15: goal-legacy-resume-and-budget-notice

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/015-goal-legacy-resume-and-budget-notice
**Level:** 2
**Status:** Draft
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a record an older version suppressed with a retired reason, When resume runs, Then the suppression clears and the goal continues | A lifecycle test with a legacy-shaped record, failing against today's plugin | Unmet | - |
| AC-002 | REQ-002 | Given OpenCode with autonomy off and on, When a goal runs, Then off shows no automatic continuation and on shows the counter past 8 | The live transcript and the plugin status read | Unmet | - |
| AC-003 | REQ-003 | Given a recorded budget, When set, Then one line says it is a reading and never enforced | A capabilities test and the option still working | Unmet | - |
| AC-004 | REQ-004 | Given the phase 14 summary, When read, Then limitation 2 names what clears a suppressed record | The corrected line | Unmet | - |
| AC-005 | REQ-005 | Given the goal suites, When rerun, Then they pass at the baseline totals | Gate output against the baseline | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Every row is Unmet because the phase is planned and nothing in it has been built or run. The packet closes when the legacy record resumes, the live run shows the counter past 8, and the suites hold their baselines.
<!-- /ANCHOR:closure -->
