---
title: "Acceptance Criteria: Phase 3: chart-research-cleanup"
description: "The criteria this cleanup phase must meet before the packet closes, each one met with a command from the final gate run."
trigger_phrases:
  - "chart research cleanup acceptance criteria"
  - "chart citation removal criteria"
  - "phase 3 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/003-chart-research-cleanup"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the acceptance evidence for every criterion"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-003-chart-research-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: chart-research-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 003-chart-research-cleanup
**Level:** 2
**Status:** Complete
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four chart files, When the cleanup completes, Then no line cites a research packet or a phase and the four files validate clean | `validate_document.py` reports VALID 0 issues on `color-system.md`, `catalog.md`, `template-contract.md` and `origin.md` | Met | - |
| AC-002 | REQ-002 | Given each citation the cleanup removed, When the rule it backed is read, Then the rule stands on its own, with the measured hue and contrast figures and the radar, pie and stacked-area decisions | The four files read against their rules, and `changelog/v0.23.7.0.md` names the same three rule groups under What's New at a Glance | Met | - |
| AC-003 | REQ-003 | Given every `sk-design` mode, When the leak sweep runs, Then no other research leak remains and the only leak hits are the three record classes | The sweep over `.skilled/skills/sk-design` reports the changelog "Spec folder:" lines, the dated benchmark run report and the style-library site descriptions only | Met | - |
| AC-004 | REQ-004 | Given the chart skill, When its version is read, Then it reads 0.23.7.0 and a changelog entry exists | `rg -n 'version: 0.23.7.0' .skilled/skills/sk-design/sk-design-chart/SKILL.md` prints one line and `changelog/v0.23.7.0.md` exists | Met | - |
| AC-005 | REQ-005 | Given this packet, When the gate runs, Then the validator passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup --strict` prints RESULT: PASSED | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met with a command from the final gate run and nothing was waived, so the decision record carries no closure ADR.
<!-- /ANCHOR:closure -->
