---
title: "Acceptance Criteria: Root README Section Spacing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "root readme section spacing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/067-root-readme-section-spacing"
    last_updated_at: "2026-10-17T16:59:22Z"
    last_updated_by: "claude-opus"
    recent_action: "Filled the acceptance criteria: all five met with observed evidence"
    next_safe_action: "Record the sk-doc suite and validate.sh --strict results, then tick the pending checks"
    blockers: []
    key_files:
      - "README.md"
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/shared/scripts/extract_structure.py"
      - ".skilled/skills/sk-doc/scripts/tests/test_structure_validation.py"
      - ".skilled/skills/sk-doc/shared/references/core-standards.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Root README Section Spacing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/067-root-readme-section-spacing
**Level:** 2
**Status:** Complete
**Date:** 2026-10-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the root README.md, When it is read for dividers, Then it has no `---` lines and uses `&nbsp;` forced blank lines between H2 sections | grep: 0 `---` lines, 60 `&nbsp;` lines in `README.md:9` and `README.md:27` | Met | - |
| AC-002 | REQ-002 | Given the root README.md, When `validate_document.py README.md` runs, Then it reports VALID with no `general_h2_separator` finding | `validate_document.py README.md`: VALID, 0 issues, exit 0. Helper at `.skilled/skills/sk-doc/shared/scripts/validate_document.py:576`, exemption at `.skilled/skills/sk-doc/shared/scripts/validate_document.py:1777` | Met | - |
| AC-003 | REQ-003 | Given a README outside the repository root, When it has a numbered ALL-CAPS H2 with no `---` above it, Then the validator still raises `general_h2_separator` | Nested-README test at `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py:206` passes. Mutation check (helper forced False) fails both new tests | Met | - |
| AC-004 | REQ-004 | Given the root README.md, When the DQI is scored, Then the divider score stays at 6 of 30 | `.skilled/skills/sk-doc/shared/scripts/extract_structure.py:1119` keeps divider_score 6 for the root README, pinned by `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py:219` | Met | - |
| AC-005 | REQ-005 | Given the sk-doc validator and its `--fix` path, When the root README has no dividers, Then no auto-fix or hook re-inserts `---` | `.skilled/skills/sk-doc/shared/scripts/validate_document.py:631` is the only emitter of `general_h2_separator`, and `--fix` has no fixer for it. No git hook or CI job checks README dividers | Met | - |

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

AC-001 through AC-005 are Met, with the evidence in section 2. No waivers were needed. Left out by decision: the table-detection heuristic in `extract_structure.py`, which is outside the divider rule. The sk-doc script suite and `validate.sh --strict` runs are pending in `tasks.md` (T009, T010) and are recorded by the orchestrator.
<!-- /ANCHOR:closure -->
