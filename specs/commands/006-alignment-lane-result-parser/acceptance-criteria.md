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
    last_updated_at: "2026-11-14T19:05:00Z"
    last_updated_by: "builder"
    recent_action: "Marked every criterion Met with observed evidence"
    next_safe_action: "Review the tracked packet diff and commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planner-006-alignment-lane-result-parser"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a lane transcript with an unmatched brace and quote in prose before a valid lane object, When the lane exits 0, Then `lanes/A.json` holds that object and `A.error.txt` is absent | `scratch/green.txt:20` passes `recovers a lane object after prose with a brace and quote`. `A.json` holds `{"lane":"A","findings":[{"id":"L1"}]}` and `A.error.txt` is absent. Exit 0. | Met | - |
| AC-002 | REQ-002 | Given a lane transcript with the lane object first and a later nested object that has a `findings` array, When the lane exits 0, Then `lanes/A.json` is the object that carries `lane` A | `scratch/green.txt:21` passes `prefers the lane object over a later nested findings object`. `A.json` carries `lane` A and the L1 finding, not the later nested object. | Met | - |
| AC-003 | REQ-003 | Given a critic transcript with a pretty-printed multi-line findings object after an unmatched prose brace, When the critic exits 0, Then `critic.json` holds that object and `critic.error.txt` is absent | `scratch/green.txt:22` passes `recovers a pretty-printed critic object`. `critic.json` holds the multi-line findings object and `critic.error.txt` is absent. | Met | - |
| AC-004 | REQ-004 | Given a transcript with no top-level findings object, When the lane exits 0, Then `lanes/A.json` is absent and `A.error.txt` is `no JSON object with findings` | `scratch/green.txt:23` passes `records no JSON object with findings and removes a stale result`. The stale `A.json` is removed and the reason is exactly `no JSON object with findings`. | Met | - |
| AC-005 | REQ-005 | Given the existing valid lane transcript, When the owning suite runs, Then `writes a findings object for valid lane output` still passes and no dependency is added | `scratch/green.txt:3` passes `writes a findings object for valid lane output`, and `scratch/green.txt:27` reports 19 of 19 passing with exit 0. The tool has no `package.json`, and the parser adds no dependency. | Met | - |
| AC-006 | REQ-006 | Given the parser call for lane A and the call for the critic, When each transcript is read, Then the lane call prefers an object with `lane` and the critic call returns the last top-level findings object | `scratch/green.txt:21` and `scratch/green.txt:22` show the lane preference and critic cases passing under one stub, and `plan.md:60` records the `{ expectLane: state.id !== 'critic' }` caller option. | Met | - |
| AC-007 | REQ-001 | Given the packet's final tree, When strict validation runs, Then the folder passes | `scratch/validate-result.txt:2` shows `RESULT: PASSED` from `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/006-alignment-lane-result-parser --strict`, exit 0. | Met | - |

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

The parser change and its four cases are complete, and every criterion above is Met with observed evidence. The private runner and test are not tracked, so the rollback remains the orchestrator backup copy, and `scratch/code.diff` records the exact change.
<!-- /ANCHOR:closure -->
