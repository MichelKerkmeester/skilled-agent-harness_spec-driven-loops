---
title: "Acceptance Criteria: mark policies, tooltip indicator kinds, reference lines and cursor guides"
description: "Acceptance criteria for mark and indicator policies."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/025-mark-and-indicator-policies"
    last_updated_at: "2026-09-08T18:22:04Z"
    last_updated_by: "scaffold"
    recent_action: "Planned from the phase 21 synthesis; waits for phase 022"
    next_safe_action: "Dispatch the build after phase 022 lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: mark policies, tooltip indicator kinds, reference lines and cursor guides

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/025-mark-and-indicator-policies
**Level:** 2
**Status:** Planned
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given any form, When its declarations are read, Then MARKS, indicator, REFERENCE and guide are present as required and each family fails its mutated copy | `check-corpus.cjs` RESULT: PASSED with mark-policy 144, tooltip-indicator 24, reference-line 33 and cursor-guide 100 assertions, 0 failures; eleven mutated copies recorded in `scratch/mutations.md` | Met | - |
| AC-002 | REQ-002 | Given the corpus, When rendered, Then card-readout and pointer-reach pass with guides on and the captures show the four effects | `check-corpus.cjs --render` RESULT: PASSED, 40 files rendered 0 failed; captures read for daily-line (reference line and guide), bar-line-composed (key kinds and guide) and parallel-axes (rules) | Met | - |

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

The build has not started; phase 022 lands first.
<!-- /ANCHOR:closure -->
