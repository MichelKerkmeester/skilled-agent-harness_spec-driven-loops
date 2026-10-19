---
title: "Acceptance Criteria: Phase 7: sk-code-script-kebab-names"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk code script kebab names acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/007-sk-code-script-kebab-names"
    last_updated_at: "2026-10-10T22:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t4-feature-catalog-anchor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: sk-code-script-kebab-names

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/066-feature-catalog-template-anchor-deprecation/007-sk-code-script-kebab-names
**Level:** 2
**Status:** Complete
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given sk-code-skilled, When the strict package check runs, Then it passes | `package_skill.py --check --strict` prints Result: PASS, down from 4 unmet requirements | Met | - |
| AC-002 | REQ-002 | Given the rename, When the tests and guards run, Then they pass as before | Tests 12 and 5 pass, 0 fail; drift guards 4 of 4; parent skill check OK, 0 warnings | Met | - |
| AC-003 | REQ-003 | Given the live tree, When it is searched for the old names, Then none remain | Grep over `.skilled` and `.hermes` excluding changelogs returns 0 | Met | - |

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

**Closeable:** Yes

The three drift-guard scripts and their tests use kebab-case names, and every caller still runs green.
<!-- /ANCHOR:closure -->
