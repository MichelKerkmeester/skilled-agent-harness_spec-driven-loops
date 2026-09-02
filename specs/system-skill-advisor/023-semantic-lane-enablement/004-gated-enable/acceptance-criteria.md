---
title: "Acceptance Criteria: Phase 4: gated-enable"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/004-gated-enable"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this phase"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-004-gated-enable"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: gated-enable

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/023-semantic-lane-enablement/004-gated-enable
**Level:** 3
**Status:** Draft
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the researched weight, When it is applied, Then it takes effect through the environment override with no code change | `advisor_status` reports resolved lane weights matching the intended set, and `git status --porcelain` shows no runtime file changed | Unmet | - |
| AC-002 | REQ-002 | Given the enable, When the override is unset and the daemon restarted, Then every metric returns to its pre-enable value | The ratchet metrics and the Gate B count both match the phase 001 record | Unmet | - |
| AC-003 | REQ-003 | Given the new weight, When the accuracy ratchet runs, Then no metric sits below its committed baseline | `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given the frozen corpus, When it is re-measured, Then at least 30 of 172 rows reach their intended mode first | The recorded count in `research/enable-measurement.md`, with the raw replies kept | Unmet | - |
| AC-005 | REQ-005 | Given five named canary prompts, When each is sent, Then each returns its intended hub at the top of the list | Five recorded replies, each naming the hub at `recommendations[0]` | Unmet | - |
| AC-006 | REQ-006 | Given the 224 out-of-scope controls, When they are re-run, Then no prompt is lost and the abstain failures do not rise | The control count and the abstain counts both match or improve on the phase 001 record | Unmet | - |
| AC-007 | REQ-007 | Given the override held through a full gate run, When the committed default moves, Then the decision names the order and the evidence | `decision-record.md` carries the weight, the target, the revert rule and the sequencing | Unmet | - |
| AC-008 | REQ-001 | Given a malformed override, When the daemon starts, Then the defaults are used and the read-back shows it | A deliberately broken value produces default weights on the status surface | Unmet | - |

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

Nothing has run yet. This phase closes when the lane runs at a measured weight, every gate is at
or above its recorded value, and the revert has been executed once rather than described.
<!-- /ANCHOR:closure -->
