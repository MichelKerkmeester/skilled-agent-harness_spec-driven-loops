---
title: "Acceptance Criteria: Phase 20: operator-approved-closeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "operator approved closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/020-operator-approved-closeout"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 20: operator-approved-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `020-operator-approved-closeout`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the cut AGENTS.md, When `check-rule-copies.js` runs, Then it prints OK and the Blast-Radius clause ends at least 512 bytes under 16,384 | OK; `15800  #### Blast-Radius Management` (was 16379), margin 584; file 27,587 to 27,008 bytes; first 16,384 bytes hold the whole clause; `check-rule-copies.test.sh` passes; readers' tests 16/16 vitest and 17/17 pytest, same as before | Met | - |
| AC-002 | REQ-002 | Given the manifest write, When `--check`, the six doctor test files and the CI step run, Then all pass | `--check`: `PASS: 44 sections, 30 pins, derived matches AGENTS.md`, exit 0; doctor tests 178/184 before, 184/184 after; CI step script exit 0 | Met | - |
| AC-003 | REQ-003 | Given sk-design without the none outcome, When its compiled-routing and package checks run, Then they pass | freshness `fresh` (policy hash 2130e0cc to 13bd283e); guard all hubs fresh; sync 7 hubs, 55 copies match; `validate_skill_package.py` package, compiled-ready, parent check PASS; bin tests 46/46; chart, diagram and extraction probes route single | Met | - |
| AC-004 | REQ-004 | Given the rebuilt trigger index, When `--check` and the retrieval parity tests run, Then both pass | `generate-trigger-index.mjs` rebuilt the index and its three sidecars after the last document write; `--check` exit 0; retrieval tests (8 files, parity included) 169 passed, 1 skipped, the same as after phase 018 | Met | - |
| AC-005 | REQ-005 | Given this decision record, When it is read, Then each operator answer appears verbatim in its own ADR | ADR-002 to ADR-005 quote the four answers | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
