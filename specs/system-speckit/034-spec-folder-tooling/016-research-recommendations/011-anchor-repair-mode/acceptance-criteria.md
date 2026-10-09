---
title: "Acceptance Criteria: Phase 11: anchor-repair-mode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "anchor repair mode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode"
    last_updated_at: "2026-10-09T00:00:00Z"
    last_updated_by: "closeout"
    recent_action: "Third closeout pass re-cited all eight criteria to the tree5 gate after the Opus alignment fixes"
    next_safe_action: "Ship with the combined commit under parent decision D6"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: anchor-repair-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
**Closed:** 2026-10-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a document with glued template pairs, When anchor-repair runs in dry-run, Then findings are reported and no files are written. | Test: `heal-anchor-repair.vitest.ts`, "dry-runs and removes a glued overlapping duplicate pair on apply". It asserts the dry run prints "would repair" and leaves the packet manifest unchanged, then that apply removes the glued pair. Observed 2026-10-09: pass in the isolated run of the four anchor-repair test files (52 of 52) and in the whole-tree gate. Second pass 2026-10-09: the verbose run of the four files (gates/closeout2-011/focused-verbose-3.out) passes 62 of 62, including "dry-runs and removes a glued overlapping duplicate pair on apply" (81 ms). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes this file, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 whole-tree cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-002 | REQ-002 | Given ambiguous duplicates with collision risk, When numbering runs, Then the collision is detected and reported instead of applied. | Test: `heal-anchor-repair.vitest.ts`, "reports a suffix collision without renaming the duplicate pair". A second `section` pair cannot take the suffix `section-2` that an existing anchor already uses, so the dry run and apply both report `collision: section` and the file stays byte-identical. Observed 2026-10-09: pass in the isolated run. Second pass 2026-10-09: the same run passes "reports a suffix collision without renaming the duplicate pair" (78 ms). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes this file, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 whole-tree cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-003 | REQ-003 | Given a spec.md with the nested questions layout, When the mode detects it, Then it moves only anchor markers to match the fixed template. | Test: `heal-anchor-repair.vitest.ts`, "moves only marker lines when un-nesting questions", where the marker lines change and the prose does not. `anchor-repair-sample.vitest.ts` runs `parseAnchoredSections` on each repaired copy and requires exactly one questions section that holds only its own opener, with the un-nesting complete. Observed 2026-10-09: pass in the isolated run. Second pass 2026-10-09: the same run passes "moves only marker lines when un-nesting questions" (0 ms), and the sample test passes "dry-runs and applies the repair on the frozen corpus sample of nested questions layouts" (425 ms). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes this file, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 whole-tree cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-004 | REQ-004 | Given a document with defects, When apply runs, Then all edits complete atomically or none do. | Test: `heal-anchor-repair.vitest.ts`, "preserves file mode and leaves the original intact when rename fails". A simulated rename failure throws, the document keeps its previous bytes, and no temporary file is left in the packet. Observed 2026-10-09: pass in the isolated run. Second pass 2026-10-09: the same run passes "preserves file mode and leaves the original intact when rename fails" (11 ms). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes this file, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 whole-tree cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-005 | REQ-005 | Given anchors inside code fences, When pairing logic runs, Then fence boundaries are respected. | Test: `heal-anchor-repair.vitest.ts`, "does not pair an anchor across a %s fence" (one template run with the backtick fence and one with the tilde fence), plus "ignores duplicate marker examples in backtick and tilde fences". Observed 2026-10-09: pass in the isolated run. Second pass 2026-10-09: the same run passes both template runs, "does not pair an anchor across a ``` fence" (1 ms) and "does not pair an anchor across a ~~~ fence" (0 ms), and "ignores duplicate marker examples in backtick and tilde fences" (78 ms). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes this file, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 whole-tree cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-006 | REQ-006 | Given a failing packet in `upgrade-legacy --apply`, When repair steps run, Then anchor-repair is one step and applies when needed. | Test: `upgrade-legacy.vitest.ts`, "repairs a nested questions anchor on apply and shows it on the dry run". The apply run prints `step anchor-repair: ok` and exits 0. upgrade-legacy returns 0 only when no packet in scope still fails, so the document passes after the step. The opener sits directly above the OPEN QUESTIONS heading. Observed 2026-10-09: pass in the isolated run. Second pass 2026-10-09: the same run passes "repairs a nested questions anchor on apply and shows it on the dry run" (11340 ms). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes this file, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 whole-tree cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |
| AC-007 | REQ-007 | Given the spec-kit test suite, When it runs, Then all tests pass. | Command: `npx vitest run runtime/cli/tests`, run from the system-spec-kit skill root. Observed 2026-10-09: exit 0, with Test Files 171 passed and 3 skipped (174) and Tests 1752 passed and 19 skipped (1771), no failures. The package gate `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` also exits 0 on the whole tree, with the same counts. Second pass 2026-10-09: on tree4, `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` exits 0 (gates/tree4/cli-test.rc) with Test Files 171 passed and 3 skipped (174), and Tests 1775 passed and 19 skipped (1794). The count is 23 above tree3 because the test round added tests. Third pass 2026-10-09 (closeout 3): tree5 cli-test exited 0 (gates/tree5/cli-test.rc) with Test Files 171 passed, 3 skipped (174) and Tests 1775 passed, 19 skipped (1794). The tree5 root-test cli sub-step reports the same counts (gates/tree5/root-test.log), and that run straddled a commit by another session at 10:37, see implementation-summary.md. | Met | - |
| AC-008 | REQ-008 | Given an archived packet whose spec.md has the nested questions layout, When `upgrade-legacy --apply --include-archive` runs, Then only the anchor marker lines move and every prose line is unchanged. | Test: `upgrade-legacy.vitest.ts`, "un-nests only the questions anchor in an archived packet and leaves every prose line as written". It runs `upgrade-legacy --apply --include-archive`, compares the prose lines and the sorted marker lines before and after, checks that the other archived documents are byte-identical, and requires `validate` to print RESULT: PASSED. Observed 2026-10-09: pass in the isolated run. Second pass 2026-10-09: the same run passes "un-nests only the questions anchor in an archived packet and leaves every prose line as written" (7083 ms). Third pass 2026-10-09 (closeout 3): the tree5 focused run of eight files, which includes this file, passed 152 of 152 with exit 0 (gates/tree5/focused-vitest.log), and the tree5 whole-tree cli test exited 0 (gates/tree5/cli-test.rc). | Met | - |

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

**Closeable:** Yes, on 2026-10-09. All eight rows are Met, and none is waived or superseded.

The packet closes on eight criteria: the three anchor defect types are detected and fixed, collisions are prevented, atomic writes are guaranteed, the step integrates with upgrade-legacy, archived documents are un-nested by marker moves only and the test suite passes. The open task T011 in tasks.md is not an acceptance row, so it does not change this result.
<!-- /ANCHOR:closure -->
