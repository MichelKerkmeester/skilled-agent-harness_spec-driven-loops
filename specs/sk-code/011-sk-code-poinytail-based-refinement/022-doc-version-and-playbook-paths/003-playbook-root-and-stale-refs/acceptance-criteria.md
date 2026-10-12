---
title: "Acceptance Criteria: Playbook root and stale refs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "playbook root and stale refs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs"
    last_updated_at: "2026-10-12T10:00:00Z"
    last_updated_by: "builder"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-022-003-ac"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Playbook root and stale refs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs
**Level:** 2
**Status:** Complete
**Date:** 2026-10-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the built phase, When the playbook validator runs with `--strict`, Then it exits 0, prints 1 scenario warning, and prints as many root warnings as there are Remaining rows | Goal criterion 1 prints ok: the validator exits 0 with 1 root and 1 scenario warning, and there is 1 Remaining row | Met | - |
| AC-002 | REQ-002 | Given the ledger in `implementation-summary.md`, When its rows are counted, Then all 20 are Fixed with a backticked proof or Closed with a reason | Goal criteria 2 and 3 print 20, then 0 twice | Met | - |
| AC-003 | REQ-003 | Given this phase's commits, found by their Spec trailer, When the changelog files they add are listed, Then the only one is sk-doc's v2.3.9.0 | Goal criterion 6 prints `.skilled/skills/sk-doc/changelog/v2.3.9.0.md` only | Met | - |
| AC-004 | REQ-004 | Given the root-file check, When its test runs with and without the change, Then it fails without and passes with it | RR-1 ledger line: the test exits 1 with the validator line reverted and 0 with it | Met | - |
| AC-005 | REQ-005 | Given the Remaining table, When each row is read, Then it names the path, the citing file and line, and a reason | RM-1 in `implementation-summary.md` names the path, the file and line, and the reason | Met | - |

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

All five criteria are Met. The validator prints one root `BACKTICK_PATH_UNRESOLVED` line, matching RM-1, and the scenario count is still 1. The ledger holds all 20 rows. sk-doc is the only skill released, once, for the validator change.
<!-- /ANCHOR:closure -->
