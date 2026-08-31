---
title: "Acceptance Criteria: Phase 4: Creation Standards and Guardrails"
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
    packet_pointer: "sk-doc/040-create-repo-rules/004-creation-standards-and-guardrails"
    last_updated_at: "2026-08-31T11:33:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for creation standards and guardrails"
    next_safe_action: "Capture the corpus baseline, then derive candidate standards"
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
# Acceptance Criteria: Phase 4: Creation Standards and Guardrails

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/004-creation-standards-and-guardrails
**Level:** 2
**Status:** Draft
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given any standard, When a reader asks what breaks without it, Then the document answers | Every standard carries a named failure; any that cannot is cut by its own rule | Unmet | - |
| AC-002 | REQ-002 | Given the eight shipped rules, When every standard is applied, Then all eight pass | Result recorded per rule per standard; a failure either drops the standard or records the rule as an exception | Unmet | - |
| AC-003 | REQ-003 | Given a draft rule, When a reviewer applies the standards, Then no tooling is needed | Each standard is a yes-or-no question answerable by reading | Unmet | - |
| AC-004 | REQ-004 | Given phase 3 thin sample, When the standards are applied, Then it fails and the failing tests are named | The negative control; a bar that passes it measures nothing | Unmet | - |
| AC-005 | REQ-005 | Given a don't, When its basis is checked, Then it is an observed failure rather than a preference | Each cites where the failure was seen | Unmet | - |
| AC-006 | REQ-006 | Given the standards, When compared with phase 3 assertions, Then none is restated | Diffed against the structural assertion list | Unmet | - |
| AC-007 | REQ-007 | Given the misreading guard, When it is read, Then it cites the shipped rules that needed one | Three rules added a "what this is not" section after being misread | Unmet | - |
| AC-008 | REQ-008 | Given the standards document, When measured, Then it fits the bands it teaches | Line count inside 250, ideally under 160 | Unmet | - |
| AC-009 | REQ-002 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict` prints `RESULT: PASSED` | Unmet | - |

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

Written when the phase closes. AC-002 and AC-004 are the pair that matters: a bar the shipped corpus fails is set too high, and a bar the thin sample passes is not a bar at all.
<!-- /ANCHOR:closure -->
