---
title: "Acceptance Criteria: Phase 8: containment-promise-and-severity-scale"
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/009-containment-promise-and-severity-scale"
    last_updated_at: "2026-09-15T14:23:17Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-009-containment-promise-and-severity-scale"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: containment-promise-and-severity-scale

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/009-containment-promise-and-severity-scale
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every containment promise site, When each is read against the runner, Then none claims a revert the default mode does not perform | no remaining revert-and-fail-closed claim in either auto comment, either confirm note, or the guard docstring | Met | - |
| AC-002 | REQ-002 | Given a reader of the verdict check, When they look for what it guarantees, Then the contract says format only and names the authoritative rollup | stated at the check, the hub severity section and the rendered prompt pack | Met | - |
| AC-003 | REQ-003 | Given a registry carrying a severity outside the scale, When the merge runs, Then it reports the value with its lineage and finding | negative control: the pre-change module reported nothing for the same registry | Met | - |
| AC-004 | REQ-004 | Given a rater assigning a severity, When they read the scale, Then the collapse rule for an out-of-scale rating is stated | the hub severity table and the prompt pack template | Met | - |
| AC-005 | REQ-005 | Given this change set, When the deep-loop suite runs, Then it exits zero | 154 files, 2678 passed, 8 skipped, exit 0 | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
