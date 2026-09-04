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
    last_updated_at: "2026-09-03T23:30:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Closed AC-001 to AC-003 on measured evidence from a completed suite run"
    next_safe_action: "Close the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-residue-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "AC-004 is met: every contract question has a ruling, and five of the eight are closed as superseded by 049."
      - "AC-001 is met: the sharded run completed, 12 of 12 shards, 34m00s, no shard killed by a bound."
      - "AC-002 is met as a split: 31 surviving failures in 15 named mechanisms, 150 inside the delete counted and attributed."
      - "AC-003 is met as a split: 27 surviving references fixed, 21 inside the delete recorded."
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
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given a suite that cannot finish, When it is run sharded, Then every module reports and the run completes | Met 2026-09-03. `npm run test:sharded` in `mcp-server/` ran 12 of 12 shards, each printing its own status line, 34m00s wall over 2,040s of shard time, 989 modules. `Test Files 98 failed \| 874 passed \| 16 skipped`, `Tests 181 failed \| 14744 passed \| 317 skipped \| 1 todo`. No shard exited 124. Exit 1 comes from failing tests, which the runner distinguishes from a bound by the per-shard line | Met | |
| AC-002 | REQ-002 | Given roughly one hundred and fifteen failures with no mechanism, When the phase closes, Then each belongs to a named group | Met 2026-09-03 as a split, and the count is 181 rather than 115. All 31 failures in surviving trees are grouped into 15 named mechanisms with a worked example each, in `implementation-summary.md` under *The residue, grouped*. The other 150, plus 3 files that fail at load, are inside 049's delete: counted and attributed by file, 28 of them already ruled by ADR-001 to ADR-004 and ADR-007, and deliberately not diagnosed per ADR-009. Nothing is unaccounted for, and 153 carry a disposition rather than a mechanism | Met | |
| AC-003 | REQ-003 | Given twenty-five references to names that do not exist, When the tests typecheck lane runs, Then each is fixed or recorded | Met 2026-09-03 as a split, and the count is 48 rather than 25. `npm run typecheck:tests` in `mcp-server/` reports 21, 13 names across 5 files, all inside 049's delete along with the lane itself, recorded by ADR-009. The surviving `scripts/tests/` tree holds the other 27, and they are fixed: 27 to 0, total errors 496 to 469. The deep-loop runtime tests hold none | Met | |
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

**Closeable:** Yes

Every row is `Met`. AC-004 to AC-006 closed the contract questions: five superseded because the
files they would edit are inside the `mcp-server/` tree 049 deletes, two implemented and verified,
one already shipped. AC-001 to AC-003 closed on measurement rather than assumption. The suite runs
to the end. Its residue splits 31 surviving failures, each in a named mechanism group, from 150
inside the delete that carry a count and an attribution. The missing references split the same way,
27 fixed where they survive and 21 recorded where they do not.

Two of the three numbers the criteria carried were wrong, and both were low: 115 failures measured
at 181, and 25 references measured at 48. The criteria keep their original wording so the
correction stays visible.

What is not closed here is written down rather than absorbed. No typecheck lane covers a surviving
test file, and the two surviving trees report 469 and 283 non-reference type errors, so switching
one on is its own change with its own backlog. That is adjacent finding A4. Findings A5 to A7 came
out of the grouping and name a dead import guard, a fixture missing its track metadata, and a test
anchored on renamed repository paths.
<!-- /ANCHOR:closure -->
