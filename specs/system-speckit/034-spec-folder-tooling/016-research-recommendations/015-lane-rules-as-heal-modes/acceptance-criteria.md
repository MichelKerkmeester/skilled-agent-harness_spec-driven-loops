---
title: "Acceptance Criteria: Phase 15: lane-rules-as-heal-modes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lane rules as heal modes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/015-lane-rules-as-heal-modes"
    last_updated_at: "2026-10-09T11:20:00Z"
    last_updated_by: "closeout"
    recent_action: "Third closeout pass: gates and citations re-cited to tree5"
    next_safe_action: "Commit with the D6 combined commit, then pin the SHA in CHK-FIX-007"
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
# Acceptance Criteria: Phase 15: lane-rules-as-heal-modes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet with anchors but no wrapping section markers, When anchor-wrap mode runs, Then anchors are wrapped in their enclosing section markers | Met, 2026-10-09. `heal-lane-modes.vitest.ts:452` (`anchor-wrap-positive`) asserts the wrapper pair is added around the section, and that removing the anchor lines gives back the original text. Gate: `gates/tree5/focused-vitest.log`, rc 0, which ran this file. | Met | - |
| AC-002 | REQ-001 | Given a document with no anchors, When anchor-wrap mode runs, Then the mode refuses and records refusal in baseline | Met, 2026-10-09. `heal-lane-modes.vitest.ts:476` (`anchor-wrap-refuses-no-anchors`) asserts one anchor-wrap refusal for plan.md with a reason that says the target is not proven, and that the document and the packet tree are unchanged. Baseline recording is pinned by `upgrade-legacy.vitest.ts:1240`, which reads a refusal back from `upgrade-baseline.json`. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-003 | REQ-001 | Given a document with a unique broken link and one new target, When link-repoint mode runs, Then the link is updated to the new target | Met, 2026-10-09. `heal-lane-modes.vitest.ts:594` (`link-repoint-positive`) asserts the link target changes to the single indexed match, and that the label and the fragment are kept. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-004 | REQ-001 | Given a document with multiple broken links matching the same new target, When link-repoint mode runs, Then the mode refuses due to ambiguity | Met, 2026-10-09. `heal-lane-modes.vitest.ts:632` (`link-repoint-refuses-multiple-matches`) asserts one refusal with the reason "2 files end with 002-moved/spec.md", and that the document is unchanged. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-005 | REQ-001 | Given a continuity field that is empty, When continuity-placeholders mode runs, Then recent_action and next_safe_action are filled with appropriate defaults | Met, 2026-10-09. `heal-lane-modes.vitest.ts:849` (`continuity-placeholders-positive`) asserts both empty fields are filled with the fixed values, and that the rest of the document is unchanged. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-006 | REQ-001 | Given a continuity field that is already partially authored, When continuity-placeholders mode runs, Then the mode refuses and preserves the authored choice | Met, 2026-10-09. `heal-lane-modes.vitest.ts:994` (`continuity-placeholders-refuses-authored`) asserts one refusal for implementation-summary.md with the reason "edit in progress", and that the file and the packet tree are unchanged. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-007 | REQ-001 | Given a packet whose spec.md has `<!-- SPECKIT_LEVEL: N -->` but frontmatter level is missing, When level-from-spec mode runs, Then the level is copied to frontmatter | Met, 2026-10-09. `heal-lane-modes.vitest.ts:1046` (`level-from-spec-positive`) asserts `level: 2` is written into the frontmatter of plan.md, and that removing that line gives back the original text. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-008 | REQ-001 | Given a packet whose spec.md has no SPECKIT_LEVEL header, When level-from-spec mode runs, Then the mode refuses | Met, 2026-10-09. `heal-lane-modes.vitest.ts:1100` (`level-from-spec-refuses-missing-header`) asserts one refusal with the reason "no SPECKIT_LEVEL marker", and that plan.md is unchanged. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-009 | REQ-001 | Given a document whose anchors exactly match a template signature, When header-add mode runs, Then the template header is added | Met, 2026-10-09. `heal-lane-modes.vitest.ts:1164` (`header-add-positive`) asserts the template-source marker is stamped after the frontmatter, and that removing the stamp gives back the original text. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-010 | REQ-001 | Given a document whose anchors do not match any template, When header-add mode runs, Then the mode refuses | Met, 2026-10-09. `heal-lane-modes.vitest.ts:1213` (`header-add-refuses-no-match`) asserts one refusal with the reason "beyond the anchors rendered for Level 2", and that plan.md is unchanged. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-011 | REQ-002 | Given a packet fixed by anchor-wrap, When upgrade-legacy runs again, Then the second run reports zero changes for anchor-wrap | Met, 2026-10-09. `heal-lane-modes.vitest.ts:491` (`anchor-wrap-idempotence`) asserts that the second run has no actions, no refusals, no changed files, and an identical packet tree. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-012 | REQ-002 | Given a packet fixed by link-repoint, When upgrade-legacy runs again, Then the second run reports zero changes for link-repoint | Met, 2026-10-09. `heal-lane-modes.vitest.ts:664` (`link-repoint-idempotence`) asserts the same second-run result as AC-011, for link-repoint. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-013 | REQ-002 | Given a packet fixed by all five modes, When upgrade-legacy runs again, Then per-folder validation reports no new findings (all modes are idempotent) | Met, 2026-10-09. The literal command was replaced, see the deviation list in implementation-summary.md. `upgrade-legacy.vitest.ts:1154` (`all-modes-sequence`) runs `upgrade-legacy --apply` on one packet, asserts `validate.sh --strict` prints RESULT: PASSED, deletes the baseline, reruns `--apply`, and asserts that every .md text and the recorded findings and refusals are identical, with RESULT: PASSED again (`upgrade-legacy.vitest.ts:1277-1283`). Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-014 | REQ-003 | Given a packet requiring reconstruction (lane rule 3), When the healer runs, Then the mode is only reported, never automated | Met, 2026-10-09. `grep -n -i "reconstruct"` in `heal-spec-docs.cjs` finds one hit, a header comment at line 16 that says rule 3 stays reported. `LANE_MODES` at `heal-spec-docs.cjs:155` lists the five modes and no reconstruction mode, and `heal-lane-modes.vitest.ts:1284` (`lane-modes-order`) pins that list. Corrected 2026-10-09: the lowercase pattern `reconstruction` above has no hit, because the comment reads "Reconstructing". The case-insensitive `grep -n -i "reconstruct"` is the check that finds the line 16 comment. | Met | - |
| AC-015 | REQ-003 | Given a packet with status mismatch (lane rule 7), When the healer runs, Then the mode is only reported, never automated | Met, 2026-10-09. `grep -n -i "status"` in `heal-spec-docs.cjs` finds a header comment at line 16 that says summary status stays reported, and `git.status` in the lane repo-root helper at line 948. `LANE_MODES` at `heal-spec-docs.cjs:155` and `heal-lane-modes.vitest.ts:1284` pin the five-mode list. | Met | - |
| AC-016 | REQ-004 | Given a packet with multiple findings fixed by the five modes, When per-folder validation runs after apply, Then validation catches any transformation that violates the packet's own structure | Met, 2026-10-09. `upgrade-legacy.vitest.ts:1154` (`all-modes-sequence`) runs `validate.sh --strict` after the first `--apply` and asserts `RESULT: PASSED`. Gate: `gates/tree5/focused-vitest.log`, rc 0. | Met | - |
| AC-017 | REQ-005 | Given the `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` file, When the phase closes, Then each of the five modes is documented with its derivability rule and refusal condition | Met, 2026-10-09. The "Heal Lane Modes" table in `spec/README.md:218` has one row per mode, with an "Acts when" column for the derivability rule and a "Refuses when" column. Checked by reading the file. | Met | - |
| AC-018 | REQ-006 | Given the existing test suite in upgrade-legacy.vitest.ts, When this phase's modes are added, Then all prior tests still pass | Met, 2026-10-09. `upgrade-legacy.vitest.ts:1154` (`all-modes-sequence`) is one case in the suite. `gates/tree5/focused-vitest.log` ran that file with seven other files, and 8 of 8 files passed (152 tests), rc 0. `gates/tree5/cli-test.rc` is 0 for the whole CLI test script, which runs the cli vitest project plus the legacy and validation suites. | Met | - |
| AC-019 | REQ-007 | Given a corpus run with the new modes, When a second run is performed on the same packets, Then no findings are contradicted (no mode reports a fix that another mode undoes) | Met, 2026-10-09. The verification text was corrected, see the deviation list in implementation-summary.md. `validate.sh` has no `--corpus-mode` flag. The row was checked with the lane-mode runner, `heal-spec-docs.cjs:1332`, through `heal-spec-docs.cjs --lane-modes --roots <copy>/specs --apply --json`, run twice over a scratch copy outside the repository that holds all 42,353 corpus .md files. Pass 1 walked 2,200 live packets and made 264 actions, 130 refusals and 132 changed files (`gates/closeout-015`, run before the 2026-10-09 simplification pass). Re-run on the final code, 2026-10-09 (`gates/closeout3-015`): pass 1 walked 2,200 live packets and made 262 actions, 132 refusals and 131 changed files. Pass 2 made 0 actions and 0 changed files, its 132 refusals are the same set as pass 1, and the SHA-256 of all 42,353 .md copies is unchanged (`gates/closeout3-015/corpus-pass2-hash.diff` is empty). Archived and scratch packets are outside the lane walk by design. | Met | - |

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

**Closeable:** Yes (Complete)

All 19 rows are Met, and none is waived or superseded. AC-001 to AC-012 are proven by the focused unit cases in `heal-lane-modes.vitest.ts`, which ran in the tree5 gate with 8 of 8 files passing (152 tests). AC-013 and AC-016 are proven by `upgrade-legacy.vitest.ts::all-modes-sequence`. AC-014 and AC-015 are proven by grep and by the pinned five-mode list. AC-017 is proven by the README table. AC-018 is proven by the focused and whole-CLI gate runs. AC-019 is proven by a two-pass corpus CLI run, with its verification text corrected.

Not closed by these rows, and listed in tasks.md and implementation-summary.md: T022 (a corpus-scale `upgrade-legacy --apply` run), checklist row CHK-FIX-007, and the plan's phase-13 fixture check.
<!-- /ANCHOR:closure -->
