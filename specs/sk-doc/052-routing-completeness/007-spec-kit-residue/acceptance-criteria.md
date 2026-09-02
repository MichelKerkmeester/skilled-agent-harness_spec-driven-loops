---
title: "Acceptance Criteria: Phase 7: spec-kit-residue"
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
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-02T23:50:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Reconciled the criteria against the ADR dispositions and the two implemented decisions"
    next_safe_action: "Close AC-001 to AC-003, each of which needs work outside this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-residue-decisions"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "AC-001 to AC-003 each need a change outside this phase's frozen scope."
    answered_questions:
      - "AC-004 is met: every contract question has a ruling, and five of the eight are closed as superseded by 049."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: spec-kit-residue

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/007-spec-kit-residue
**Level:** 3
**Status:** In Progress
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given a suite that cannot finish, When it is run sharded, Then every module reports and the run completes | `npm run test:sharded` reports all shards with a final line naming the failing count, and no shard exits 124 | Unmet | |
| AC-002 | REQ-002 | Given roughly one hundred and fifteen failures with no mechanism, When the phase closes, Then each belongs to a named group | The residue document accounts for every failing test in a group with a worked example, and the unexplained count is zero | Unmet | |
| AC-003 | REQ-003 | Given twenty-five references to names that do not exist, When the tests typecheck lane runs, Then each is fixed or recorded | `npm run typecheck:tests` reports zero TS2304 findings | Unmet | |
| AC-004 | REQ-004 | Given five contract questions where test and code disagree, When the phase closes, Then each has a decision naming which side moves | The decision record holds eight entries plus the daemon-recycle entry, each naming the contract, the two positions and the ruling | Met | |
| AC-005 | REQ-004 | Given a decision whose subject files are inside 049's delete list, When the phase closes, Then it is recorded as superseded rather than implemented | Every ADR in `decision-record.md` carries `Accepted` or `Superseded` and a Resolution naming the paths it checked. None is left `Proposed` | Met | |
| AC-006 | REQ-004 | Given the two decisions that survive 049, When they are implemented, Then the tests they name run and their failures are named rather than silenced | ADR-005: 4 files erroring at load became 47 passing assertions with 2 named drift failures. ADR-008: 7 failed / 4 passed became 11 passed, exit 0, with no write into the repository | Met | |

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

AC-004 to AC-006 carried this pass: every contract question now has a ruling, five of them
closed as superseded because the files they would edit are inside the `mcp-server/` tree that
049 deletes, and the two that survive are implemented and verified. AC-001 to AC-003 stay open
deliberately, the sharded-suite run, the residue grouping and a tests typecheck lane are each
work outside this phase's frozen scope, and the last of them is recorded as adjacent finding A4.
<!-- /ANCHOR:closure -->
