---
title: "Acceptance Criteria: Phase 16: scaffold-filler-section-trim"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "scaffold filler section trim acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/016-scaffold-filler-section-trim"
    last_updated_at: "2026-10-26T15:03:32Z"
    last_updated_by: "conductor"
    recent_action: "Verified every criterion from the final tree, all Met"
    next_safe_action: "Commit the phase on the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-016-scaffold-filler-section-trim"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 16: scaffold-filler-section-trim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-recommend-level-quiet`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/016-scaffold-filler-section-trim
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--quiet` runs, Then `wc -l` prints 1. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the strict and six-rule census baselines taken after phase 015's template edits, When both censuses rerun from the final tree over the four shard lists in `scratch/baseline/list-0` to `list-3` (4,757 folders, 054 phases 015 to 018 excluded), Then no existing packet changes verdict | `diff <(sort B/census-before.tsv) <(sort B/census-after.tsv)` and `diff <(sort B/rules-before.tsv) <(sort B/rules-after.tsv)` print nothing, where `B` is `scratch/baseline`. Observed: both diffs printed nothing, exit 0; each file has 4,757 rows; the strict census reads 4,562 PASS and 195 FAIL before and after | Met | - |
| AC-002 | REQ-002 | Given the edited templates, When the golden snapshots regenerate, Then the scaffold holds none of the five filler strings | `rg -n 'Phase 1.5\|Feature flag configured\|External service failure\|Network timeout\|Tests passing' .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` prints nothing. Observed: no output, exit 1 | Met | - |
| AC-003 | REQ-003 | Given a Level 2 packet with its `fix-completeness` block deleted, When `ANCHORS_VALID` runs, Then it passes, and the required set at every level omits `fix-completeness` | `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/validation-optional-anchors.vitest.ts` and `cd .skilled/skills/system-spec-kit && npx vitest run --config vitest.config.ts --project cli tests/required-template-anchors.vitest.ts` both print 0 failed. Observed: validation-optional-anchors 2 passed (2), the new case included; required-template-anchors 4 passed in the 40-test run below | Met | - |
| AC-004 | REQ-004 | Given the final tree, When the scaffold guards run, Then each passes | `cd .skilled/skills/system-spec-kit && npx vitest run --config vitest.config.ts --project cli tests/template-fill-guidance.vitest.ts tests/scaffold-golden-snapshots.vitest.ts tests/required-template-anchors.vitest.ts` prints 0 failed without `-u`; `check-card-sync.sh` prints `CARD SYNC OK`; `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`. Observed: Test Files 3 passed (3), Tests 40 passed (40); `CARD SYNC OK`, exit 0; `EXAMPLE_DRIFT_OK`, exit 0 | Met | - |
| AC-005 | REQ-005 | Given card section 6, When a reader looks for the plan shape, Then it matches the `plan.md.tmpl` phases fill note and asks for no Step block | `rg -n '### Step' .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints nothing. Observed: no output, exit 1; section 6 now names three phases, Setup, Implementation and Verification, one line each, and points at `tasks.md`, as the template's fill note does | Met | - |
| AC-006 | REQ-006 | Given a packet with no `decision-record.md`, When it is scaffolded at Level 3, Then no line points at that file as present | Every line `rg -n 'decision-record' .skilled/skills/system-spec-kit/templates/core/` prints contains "when the packet has one". Observed: two lines, `tasks.md.tmpl:232` (CHK-100) and `spec.md.tmpl:441` (the related-docs fill note), and both contain the phrase | Met | - |
| AC-007 | REQ-007 | Given a Level 3 scaffold, When the sign-off section renders, Then it holds one token approver row and no named role | `rg -n 'Technical Lead\|Product Owner\|QA Lead' .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` prints nothing and `rg -n -- '-- ANCHOR:sign-off'` on it prints one line. Observed: the first printed nothing, exit 1; the second printed one line, 288, the opening anchor, and the table under it has one token row | Met | - |
| AC-008 | REQ-008 | Given the edited skill docs, When the Hermes check runs, Then the copies match their sources | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Observed: `PASS: 67 Hermes skill copies in sync`, exit 0 | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Both census diffs printed nothing, and every scaffold guard, test and the Hermes check passed from the final tree.
<!-- /ANCHOR:closure -->
