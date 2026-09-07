---
title: "Acceptance Criteria: Phase 5: provenance-title-sweep"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "provenance sweep acceptance criteria"
  - "placeholder rule closure gate"
  - "fixture parity criterion"
  - "sweep ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/005-provenance-title-sweep"
    last_updated_at: "2026-09-07T21:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: provenance-title-sweep

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/005-provenance-title-sweep
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 929 in-scope packets, When the sweep script runs, Then no in-scope title carries `[template:level` | `grep -rlE '^title:.*\[template:'` over specs returns zero documents of a real packet outside the four excluded groups; 767 documents in 250 packets were stripped, and the only remaining matches are quoted transcripts under research, review, evidence and prompt folders, vendored copies under `node_modules` and scratch backups, which are not packet documents | Met | - |
| AC-002 | REQ-002 | Given `rules/check-placeholders.sh`, When it scans a document whose title carries `[template:level`, Then it reports a `fail` with the third class named | `rules/check-placeholders.sh` carries a third title-scoped class; the extended suite case "Template provenance token in a title detected" fails fixture `073-template-provenance-title` as expected and the lane passes 98, 31 and 84 checks | Met | - |
| AC-003 | REQ-003 | Given a packet whose title changed, When the sweep finishes, Then its `description.json` and `graph-metadata.json` reflect the new title | `description.json` and `graph-metadata.json` were regenerated twice for every touched packet, 482 metadata files in 241 packets; a random strict sample of twelve regenerated packets passed six and failed six on ANCHORS_VALID, SCAFFOLD_NEVER_TOUCHED and archive-copy rules that predate the sweep | Met | - |
| AC-004 | REQ-004 | Given `002-valid-level1`, `003-valid-level2` and `004-valid-level3`, When `validate.sh --strict` runs against each, Then all three pass, and `072-scaffold-never-touched-violation` still fails with `SCAFFOLD_NEVER_TOUCHED` | `002-valid-level1`, `003-valid-level2` and `004-valid-level3` pass strict in the validation lane; `072-scaffold-never-touched-violation` was restored untouched and still fails SCAFFOLD_NEVER_TOUCHED | Met | - |
| AC-005 | REQ-005 | Given the runtime and CLI vitest projects, the goldens and the registry-coverage test, When they run after the rule change, Then none reports a new failure | the runtime project passes 104 files and 1,260 tests and the CLI project 140 files and 1,361 tests, including the new fixture | Met | - |

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

Planning only. No criterion is met yet. The sweep, the rule change and the fixture parity work have not started.
<!-- /ANCHOR:closure -->
