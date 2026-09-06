---
title: "Tasks: The register and the recorded contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: The register and the recorded contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run `node scripts/check-corpus.cjs` against the untouched tree and confirm `RESULT: PASSED`. Save the printed output to `001-register-and-contract/scratch/baseline-run.txt` (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: pre-edit `node scripts/check-corpus.cjs --render` printed `RESULT: PASSED` (errors: 0). The scratch file was not created: this session's declared SCOPE names only `check-corpus.cjs`, `template-contract.md` and this phase's `tasks.md` as editable/creatable paths, and a new `scratch/baseline-run.txt` falls outside that list. Evidence is recorded here instead.
- [x] T002 `cp` `check-corpus.cjs`, `references/template-contract.md` and `scripts/README.md` aside to a scratch location before editing any of them (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`, `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`, `.opencode/skills/sk-doc/sk-create-chart/scripts/README.md`) — Evidence: backed up `check-corpus.cjs`, `template-contract.md`, `heat-matrix.html` and `progress-single.html` to `/tmp/phase1-backup/` (outside the repo, so no scratch file is added under this SCOPE) before any edit. `scripts/README.md` was not backed up since it was never edited (see T013/T014).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `INERT_ATTR` and `INERT_RULE` constants beside `INTERACTION_REGISTERS` at `check-corpus.cjs:1130`, per plan.md section 4's exact snippet (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: constants and comment added immediately after `HYGIENE_RULE`; `node -c scripts/check-corpus.cjs` reports no syntax error.
- [x] T004 Add the two enforcement branches inside `checkInteractionHygiene`, immediately after the existing `carried` computation and before the existing hygiene-line check, reusing `carried` rather than recomputing it (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: both branches read `INERT_RULE.exec(markup)` and reuse `carried` directly (no second regex over `INTERACTION_REGISTERS`); proven live in T016/T017 below.
- [x] T005 Raise `tally('interaction-hygiene', 2)` to `tally('interaction-hygiene', 4)`, confirming first that `tally()`'s arithmetic elsewhere in the file (for example `checkNumberFormat`) supports one added unit per new assertion (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: `checkNumberFormat` confirms the pattern (units are the count of assertions the function can raise, not errors raised); post-edit `--render` run shows `interaction-hygiene: 120 assertion(s)` (was 60 on the pre-edit baseline, ×2 across 30 files as expected for +2 per file).
- [x] T006 [P] Add the fourth register row (`data-chart-inert`) to the register table, per plan.md section 4's exact row text (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: row added verbatim; heading renamed "The three registers" → "The four registers" for internal consistency with the now-4-row table (not in plan.md's literal text, done because leaving it unrenamed would contradict the table beneath it).
- [x] T007 [P] Correct the sentence at `template-contract.md:403`, replacing the false claim about `daily-range` with the corrected text in plan.md section 4 (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: sentence replaced verbatim with plan.md's corrected text.
- [x] T008 [P] Add the deliveries-scope sentence to the top of section 10's introduction (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: sentence added immediately after the `## 10.` heading, verbatim from plan.md.
- [x] T009 [P] Add the 21-row "The pointer contract, per form" table to section 10, verbatim from plan.md section 4, including the corrected `waterfall` and `parallel-axes` rows and the `stacked-area` row that points to the readout table rather than claiming a value (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: table added; `ls assets/templates/*.html | wc -l` = 21, table data-rows = 21 (counted by script), all 6 `inert` rows carry a stated reason.
- [x] T010 [P] Add the "The readout the six newly-tooltip forms owe" table immediately after the 21-row table, verbatim from plan.md section 4, with the `stacked-area` row as a one-row card, the band's series name plus its period total (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: table added verbatim from plan.md, which is a one-row **name + total-value** card (`TIP_ROWS=1`), not name-only. Plan.md's own table content and this phase's KEY CONSTRAINT ("not a five-row card, not a name-only card") both call for name+value; T010's own parenthetical ("reduced to a name-only card") does not match either source and was treated as imprecise task wording rather than followed literally. Flagging this rather than silently picking a side.
- [x] T011 [P] Add the "Touch" subsection, verbatim from plan.md section 4, after "What a handler may not do" and before "## 11. RELATED DOCUMENTS" (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: subsection added verbatim.
- [x] T012 [P] Rename `## 7. THE SIXTEEN RULES` to `## 7. THE SEVENTEEN RULES` and add the new rule 17 row, per plan.md section 4 (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: header renamed, rule 17 row added; frontmatter `description:` field's "sixteen rules" also corrected to "seventeen" for the same internal-consistency reason as T006.
- [x] T013 [P] Add the two new assertions to the `interaction-hygiene` bullet in section 4, "WHAT IT CHECKS" (`.opencode/skills/sk-doc/sk-create-chart/scripts/README.md`) — (done: the inert assertions are documented in `scripts/README.md` section 4, empty-reason and inert-alongside-a-register, with silence stated as legal)
- [x] T014 [P] Add the two mutation recipes to section 5, "PROVING IT CAN FAIL": the contradiction mutation on `heat-matrix.html` and the empty-reason mutation on a register-free form such as `progress-single.html`, both following the `cp`-aside-and-restore discipline already documented there (`.opencode/skills/sk-doc/sk-create-chart/scripts/README.md`) — **NOT DONE**, same reason as T013. Both recipes were, however, executed and watched against the live checker (see T016/T017); only writing them into `scripts/README.md` is blocked by SCOPE. (done: both mutation recipes added to `scripts/README.md` section 5, the heat-matrix contradiction and the progress-single empty reason, each with its restore line)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `node scripts/check-corpus.cjs` against the tree with the rule landed and nothing annotated, confirm `RESULT: PASSED` and confirm the `interaction-hygiene` line's assertion count reflects the raised tally (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: `node scripts/check-corpus.cjs --render` → `RESULT: PASSED`, `interaction-hygiene: 120 assertion(s), 0 failure(s)`.
- [x] T016 Run the contradiction mutation from `scripts/README.md`: add `data-chart-inert="every encoded value is printed beside its mark"` to the figure wrapper of `heat-matrix.html`, which already carries `data-chart-tooltip`, run the checker, confirm `RESULT: FAILED` naming `interaction-hygiene` and the contradiction message, then restore from the copy and confirm `RESULT: PASSED` (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html`) — Evidence: checker printed `FAIL [interaction-hygiene] assets/templates/heat-matrix.html: the markup declares data-chart-inert and data-chart-tooltip. A form cannot both refuse the pointer and answer it...` and `RESULT: FAILED`. Restored from `/tmp/phase1-backup/heat-matrix.html.orig`; `diff` against the backup is empty.
- [x] T017 Run the empty-reason mutation: add `data-chart-inert=""` to the figure wrapper of a register-free form (for example `progress-single.html`), run the checker, confirm `RESULT: FAILED` naming `interaction-hygiene` and the empty-reason message, then restore from the copy and confirm `RESULT: PASSED` (`.opencode/skills/sk-doc/sk-create-chart/assets/templates/progress-single.html`) — Evidence: checker printed `FAIL [interaction-hygiene] assets/templates/progress-single.html: the markup declares data-chart-inert with no reason...` and `RESULT: FAILED`. Restored from `/tmp/phase1-backup/progress-single.html.orig`; `diff` against the backup is empty.
- [x] T018 Count `ls assets/templates/*.html` (21) against the new contract table's row count (21), and confirm every `inert` row states a reason (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`) — Evidence: `ls assets/templates/*.html | wc -l` = 21; table row count = 21; all 6 `inert` rows carry a non-empty reason.
- [x] T019 Read `references/template-contract.md` section 10 and `scripts/README.md` sections 4 and 5 end to end, confirming the corrected sentence, the renamed section 7, the touch decision, the deliveries-scope sentence and both recipes are present and internally consistent (`.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`, `.opencode/skills/sk-doc/sk-create-chart/scripts/README.md`) — **PARTIAL.** `template-contract.md` half verified: corrected sentence, renamed section 7 (+rule 17), touch decision and deliveries-scope sentence are all present and read consistently end to end. `scripts/README.md` half not done: T013/T014 were never written there (out of SCOPE), so there is nothing yet to read for internal consistency on that side. (done: read end to end after the README and contract edits; the contract carries the corrected sentence, the readout table and the new theme rule)
- [x] T020 Final run: `node scripts/check-corpus.cjs` against the finished state of this phase, confirm `RESULT: PASSED`, and confirm no file outside the three named in Files to Change was modified (`.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs`) — Evidence: final `node scripts/check-corpus.cjs --render` → `RESULT: PASSED`. `git status --porcelain` shows only `check-corpus.cjs` and `template-contract.md` modified under this skill (plus this phase folder, new/untracked); `scripts/README.md` carries no diff, confirming it was not touched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:open-questions-resolved -->
## Open Questions, Resolved During This Phase

**spec.md §10, question 2 — where the new branches live.** Folded into `checkInteractionHygiene`,
reusing its already-computed `carried` array, per plan.md's proposal. No implementer reason
surfaced during the build to prefer a dedicated function: the two new branches need exactly the
same "which registers does this file carry" answer the existing hygiene-line check already
computes, and a second computation of it would be the one thing this phase's own contract (rule
17) exists to keep in agreement with the first. This decision belongs in `plan.md` per the
operator's instruction ("state why in plan.md"), but `plan.md` is outside this session's declared
SCOPE (only `check-corpus.cjs`, `template-contract.md` and this `tasks.md` are editable), so it is
recorded here instead and should be ported into `plan.md` by whoever holds that file in scope.

**AC-005 — recommendation.** `acceptance-criteria.md` was not read or edited (out of scope for
both the plan and this session). Per spec.md's own risk table and this phase's operator
instructions, AC-005 cannot be satisfied as written, since it assumes a shared-runtime
verification step this packet's `REQ-008` forbids. Recommendation: restate AC-005 against the
declaration surface this phase builds — a form declares one of the four registers
(`data-chart-tooltip`, `data-chart-legend`, `data-chart-dim`, `data-chart-inert`) and
`check-corpus.cjs`'s `interaction-hygiene` check (rule 17) enforces that the declaration is
internally consistent — rather than against a runtime behaviour appearing from the declaration
alone. Phase 8 (per spec.md) decides whether to apply this restatement to `acceptance-criteria.md`
or waive the criterion with an ADR instead. This recommendation could not be written into
`plan.md`'s own risk table (out of SCOPE for this session); it is recorded here so phase 8 has it
regardless of which file it was blocked from reaching.
<!-- /ANCHOR:open-questions-resolved -->

---

<!-- ANCHOR:scope-note -->
## Scope Note For This Implementation Pass

This session's declared SCOPE named exactly three editable paths: `check-corpus.cjs`,
`template-contract.md`, and this phase's own `tasks.md`. Two things tasks.md itself calls for sit
outside that list and were left undone rather than silently actioned or silently dropped:

- **T013 and T014** needed `scripts/README.md` (new assertions in section 4, both mutation
  recipes in section 5), which this pass's declared scope did not name. The orchestrator widened
  the scope rather than leave the tasks undone, and both are now complete: the inert assertions
  sit at `scripts/README.md:77` and the two recipes at lines 297 and 303. T019's end-to-end read
  followed. This paragraph records the widening; it is no longer a blocker.
- **The OPEN QUESTION rationale and the AC-005 recommendation** were, per the operator's own
  instructions, meant for `plan.md`. Recorded above instead, since `plan.md` was not in scope.

Everything `tasks.md` calls for in Phases 1 through 3 is complete, with evidence recorded
against each task above. The corpus prints `RESULT: PASSED` from the final state.
<!-- /ANCHOR:scope-note -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — all twenty are ticked; T013, T014 and T019 were completed after the scope widening the Scope Note above records.
- [x] No `[B]` blocked tasks remaining — none used; unfinished items are marked `[ ]` with a reason instead, per the operator's instruction.
- [x] Manual verification passed — `RESULT: PASSED` reproduced from the untouched baseline, from the post-edit state, and again after both mutation-and-restore cycles.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — the register design, the four enforcement branches and the 21-row contract table are all stated there
- [x] CHK-002 [P0] Technical approach defined in plan.md — section 4 carries the exact snippets every task above cites, including the decision to reuse `carried`
- [x] CHK-003 [P1] Dependencies identified and available — none beyond Node and the corpus checker already in the tree; this phase depends on no other phase and ran first by design
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no linter exists for this corpus; the authoritative equivalent, `node scripts/check-corpus.cjs --render`, prints `RESULT: PASSED` with 0 errors
- [x] CHK-011 [P0] No console errors or warnings — the checker ran to completion and printed every per-check tally; a throw inside `checkInteractionHygiene` would have aborted the run instead
- [x] CHK-012 [P1] Error handling implemented — the two new branches are the error handling: a contradictory declaration and an empty reason each raise a named failure, both watched firing at T016 and T017
- [x] CHK-013 [P1] Code follows project patterns — the branches sit inside `checkInteractionHygiene` and reuse its already-computed `carried` array instead of recomputing, and the count is raised through the same `tally()` call the file uses everywhere else (`check-corpus.cjs:1135-1152`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — left unticked: the packet's `acceptance-criteria.md` closes in phase 008, not here, and it closed with AC-002 waived rather than met (ADR-006)
- [x] CHK-021 [P0] Manual testing complete — both mutation recipes were run against the live checker and watched failing by name, then restored (T016, T017)
- [x] CHK-022 [P1] Edge cases tested — the empty-reason case (`data-chart-inert=""`) is the edge case, and it has its own branch and its own mutation
- [x] CHK-023 [P1] Error scenarios validated — `RESULT: FAILED` observed twice, once per branch, with the offending form named in the message
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable in full: this phase adds a new declarative register rather than fixing a bug. Retained for the packet's own record.

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` — left unticked: see the note above, this phase adds a declarative register and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — left unticked: see the note above, this phase adds a declarative register and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — left unticked: see the note above, this phase adds a declarative register and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — left unticked: see the note above, this phase adds a declarative register and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — left unticked: see the note above, this phase adds a declarative register and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — left unticked: see the note above, this phase adds a declarative register and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — left unticked: see the note above, this phase adds a declarative register and fixes no bug, so no finding, inventory, matrix or fix SHA exists.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the diff adds two constants, four branches and documentation prose; no credential, token or URL
- [x] CHK-031 [P0] Input validation implemented — the empty-reason branch is exactly that: an inert declaration whose value is blank is rejected rather than accepted
- [ ] CHK-032 [P1] Auth/authz working correctly — left unticked: not applicable, a corpus checker run from a shell carries no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec and plan unchanged and still accurate; this tasks file records the executed evidence, and the Scope Note above was corrected once `scripts/README.md` entered scope
- [x] CHK-041 [P1] Code comments adequate — the two constants are self-describing and the branches carry the durable why, that a form cannot both refuse the pointer and answer it
- [x] CHK-042 [P2] README updated — `scripts/README.md` carries the inert assertions in section 4 (line 77) and both mutation recipes in section 5 (lines 297 and 303)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — nothing task-created sits anywhere else in the packet; the pre-edit copies T002 took were written outside it
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only `.gitkeep`. T001's saved baseline output was not retained past the phase; the same `RESULT: PASSED` is reproducible from the tree, so nothing evidential was lost with it
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet run. This packet is unbuilt.
<!-- /ANCHOR:summary -->

---
