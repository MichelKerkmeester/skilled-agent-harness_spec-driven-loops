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
**Status:** In Progress
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a record an older version suppressed with a retired reason, When resume runs, Then the suppression clears and the goal continues | A lifecycle test with a legacy-shaped record, failing against today's plugin. Observed: `resume clears a suppression an older version set with a retired cap or budget reason` failed before the change and passes after; the unknown-reason and plain-active guard tests also pass (`.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs:466`) | Met | - |
| AC-002 | REQ-002 | Given OpenCode with autonomy off and on, When a goal runs, Then off shows no automatic continuation and on shows the counter past 8 | The live transcript and the plugin status read. Observed: SKIP. The only approved model route returned `provider.quota` 402 (`scratch/live-run-skip.txt`), so no live turn ran. A no-model plugin harness (`scratch/plugin-harness-output.txt`) read `continuation_attempts=12` with autonomy on and `promptAsync_calls=0` with autonomy off, which supports the claim and does not satisfy this row (`specs/sk-doc/060-create-goal-mode/015-goal-legacy-resume-and-budget-notice/scratch/live-run-skip.txt:1`) | Unmet | - |
| AC-003 | REQ-003 | Given a recorded budget, When set, Then one line says it is a reading and never enforced | A capabilities test and the option still working. Observed: `recording a token budget prints one notice that it is a reading and never enforced` failed before the change and passes after; `token budget appears in status` still passes (`.opencode/plugins/tests/opencode-goal-capabilities.test.cjs:226`) | Met | - |
| AC-004 | REQ-004 | Given the phase 14 summary, When read, Then limitation 2 names what clears a suppressed record | The corrected line. Observed: limitation 2 in the phase 14 summary now names `session.deleted` archiving and the hourly orphan sweep (files untouched for more than two days) as the only cleanup, and says neither clears the flag (`specs/sk-doc/060-create-goal-mode/014-goal-no-budget-stop/implementation-summary.md:121`) | Met | - |
| AC-005 | REQ-005 | Given the goal suites, When rerun, Then they pass at the baseline totals | Gate output against the baseline. Observed: OpenCode goal suites 151 of 151 to 155 of 155 (exit 0 both), goal core 87 of 87 to 87 of 87 (exit 0 both) (`specs/sk-doc/060-create-goal-mode/015-goal-legacy-resume-and-budget-notice/scratch/gate-summary.txt:1`) | Met | - |

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

AC-001, AC-003, AC-004 and AC-005 are Met. AC-002 stays Unmet because the live OpenCode run was a SKIP: the model provider answered with a 402 quota error. The packet closes when the live run is repeated with a model that has quota and the counter is read past 8, or when the operator waives AC-002 with a decision record.
<!-- /ANCHOR:closure -->
