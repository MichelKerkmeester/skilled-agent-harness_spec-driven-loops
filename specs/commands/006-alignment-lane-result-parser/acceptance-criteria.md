---
title: "Acceptance Criteria: Recover the last findings object from alignment lane output"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment lane result parser acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/006-alignment-lane-result-parser"
    last_updated_at: "2026-11-14T17:25:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Build the planned parser change and tests"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planner-006-alignment-lane-result-parser"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Recover the last findings object from alignment lane output

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-alignment-lane-result-parser
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a lane transcript with an unmatched brace and quote in prose before a valid lane object, When the lane exits 0, Then `lanes/A.json` holds that object and `A.error.txt` is absent | `node --test .skilled/commands/assets/local-skilled-alignment/tests/run-lanes.test.cjs` case `recovers a lane object after prose with a brace and quote` passes | Unmet | - |
| AC-002 | REQ-002 | Given a lane transcript with the lane object first and a later nested object that has a `findings` array, When the lane exits 0, Then `lanes/A.json` is the object that carries `lane` A | `node --test` case `prefers the lane object over a later nested findings object` passes | Unmet | - |
| AC-003 | REQ-003 | Given a critic transcript with a pretty-printed multi-line findings object after an unmatched prose brace, When the critic exits 0, Then `critic.json` holds that object and `critic.error.txt` is absent | `node --test` case `recovers a pretty-printed critic object` passes | Unmet | - |
| AC-004 | REQ-004 | Given a transcript with no top-level findings object, When the lane exits 0, Then `lanes/A.json` is absent and `A.error.txt` is `no JSON object with findings` | The no-match assertion in the same owning test file passes | Unmet | - |
| AC-005 | REQ-005 | Given the existing valid lane transcript, When the owning suite runs, Then `writes a findings object for valid lane output` still passes and no dependency is added | `node --test` exits 0 and `package.json` is unchanged | Unmet | - |
| AC-006 | REQ-006 | Given the parser call for lane A and the call for the critic, When each transcript is read, Then the lane call prefers an object with `lane` and the critic call returns the last top-level findings object | The three new cases assert the lane and critic paths | Unmet | - |
| AC-007 | REQ-001 | Given the packet's final tree, When strict validation runs, Then the folder passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/006-alignment-lane-result-parser --strict` prints `RESULT: PASSED` | Unmet | - |

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

The packet is a plan. AC-001, AC-002, AC-003 and AC-004 stay unmet until the builder writes the parser and the three cases. The private runner is not tracked, and the rollback is the orchestrator backup copy.
<!-- /ANCHOR:closure -->
