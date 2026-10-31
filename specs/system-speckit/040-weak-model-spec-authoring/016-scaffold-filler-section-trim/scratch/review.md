# Phase 016 review: scaffold filler section trim

Fresh read-only review, 2026-10-26. Paths below use `S` = `.skilled/skills/system-spec-kit` and `P` = this phase folder. Inputs: `P/spec.md`, `P/tasks.md`, `P/scratch/doc-sweep.md`, and `git diff HEAD` over the scoped paths (36 files, +310/-358).

## What holds

- **Validator safety.** `S/runtime/lib/validation/orchestrator.ts:648` marks a section optional when its H2 matches `/^(?:L(?:2|3\+?)|FIX ADDENDUM)\s*:/iu`; its twin `S/runtime/cli/utils/template-structure.js:20` has the same pattern. So `## FIX ADDENDUM: FIX COMPLETENESS` (`S/templates/core/tasks.md.tmpl:166`) drops `fix-completeness` from the required set with no code change. The removed `effort` and `enhanced-rollback` sections were already `L2:` (optional). No anchor the validator requires was removed. `sectionGates` is read for required anchors only for lazy docs (`S/runtime/lib/validation/spec-doc-structure.ts:1182-1193`), so dropping `effort`/`enhanced-rollback` from the manifest cannot fail a core doc.
- **Balance.** A script count over the three core templates: plan IF 25/25, anchors 15/15; spec IF 62/62, anchors 18/18; tasks IF 12/12, anchors 21/21. Nesting never goes negative and ends at depth 0.
- **Manifest.** `S/templates/spec-kit-docs.json` parses; `rg '"effort"|enhanced-rollback'` over it, `runtime/cli/utils` and `runtime/lib` prints nothing (exit 1). Versions moved to v2.4 for the four core templates and acceptance-criteria, matching the template stamps; `rg 'v2\.3'` over `templates/core` prints nothing.
- **Decision-record pointers (REQ-006).** `rg -n 'decision-record' S/templates/core/` prints two lines, `spec.md.tmpl:437` and `tasks.md.tmpl:232`, and both say "when the packet has one".
- **DoD, phase-deps, edge cases, sign-off, effort, enhanced-rollback** in the core templates match the spec decisions and T005-T012 text.
- **Snapshot regenerated.** In the `.snap`: `ANCHOR:effort` 0, `ANCHOR:enhanced-rollback` 0, `## Fix Completeness` 0, `FIX ADDENDUM: FIX COMPLETENESS` 3, `Setup ──► Implementation` 3.
- **Tests.** The new case in `S/runtime/tests/validation-optional-anchors.vitest.ts:72-96` restamps the fixture to v2.4, deletes the block and asserts `ANCHORS_VALID` passes, as T016 asks. The `upgrade-legacy` change reads the version from the manifest instead of hardcoding it. I did not run any test (read-only brief).
- **Phase 015/017 overlap.** The Measured Behavior anchor has no H2, so it is never required (`orchestrator.ts:687-692`), and the new `MEASURED_BEHAVIOR` rule is WARNING. Neither breaks 016's intent.

## Findings

### F1 [P1] Card section 6 does not give the plan template's shape (counted as a wrong edit)

`S/references/workflows/spec-authoring-card.md:91`: "A plan names its 3 or 4 phases, one line each, under `## 4. IMPLEMENTATION PHASES`. That is the plan template's phases fill note."

`S/templates/core/plan.md.tmpl:124`: "Point to `tasks.md` and name the three phases in one line."

The card says 3 or 4 phases on one line each; the template says three phases on one line. `:101` repeats "3 or 4 phases in one line each". The card's own sample (`:98`) is one line with three phases, which matches the template and not the card's text. REQ-005 asks for "the same plan shape as the `plan.md.tmpl` phases fill note", and CHK-040 says both "name three phases". `tasks.md.tmpl` also fixes three phases (Setup, Implementation, Verification), so a fourth phase has nowhere to go. Fix: "A plan names its three phases in one line under `## 4. IMPLEMENTATION PHASES` and points at `tasks.md`", and match `:101` and the section 11 bullet at `:172`. The verify line `rg -n '^## 4'` (`:102`) proves only that the heading exists, not the shape (P2).

### F2 [P1] An example still points at the removed Enhanced Rollback section

`S/templates/examples/level-3+/implementation-summary.md:347`: "- Rollback: See plan.md L2: Enhanced Rollback section". This phase deleted that section from `examples/level-3+/plan.md`, so the pointer names a section that no longer exists. The doc sweep did not cover `templates/examples`. Fix: point at `plan.md` section 7 ROLLBACK PLAN.

### F3 [P1] The phase's own verify commands fail on the current tree

These are reruns of commands the packet itself names, run from the final tree:

- AC-002 / T020: `rg -n 'Phase 1.5|Feature flag configured|External service failure|Network timeout|Tests passing' <snap>` prints `2169:` and `3150:- [ ] CHK-121 [P0] Feature flag configured (if applicable)`.
- `P/plan.md:117` (Step 2 verify): `rg -n 'Phase 1.5|Feature flag configured|Tests passing \(if applicable\)' S/templates/core/` prints `tasks.md.tmpl:257`.
- CHK-FIX-002 (`P/tasks.md:164`) over `S/templates` prints four lines: `core/tasks.md.tmpl:257`, `addons/handover.md.tmpl:114` ("Tests passing (if applicable)"), `examples/level-1/plan.md:52` ("Tests passing (if applicable)"), `examples/level-2/plan.md:156` ("Phase 1.5 (Schema)").

REQ-002 itself passes, because it checks only a Level 2 scaffold and CHK-121 is Level 3+. The snapshot and template checks still cannot be marked Met as written. Either trim the rows (see the open point below) or narrow the checks to Level 2 and the paths the spec scopes. This is not a wrong edit; the edits are correct, and the checks were written wider than the edits.

### F4 [P2] Examples keep the category edge-case layout the template dropped

`S/templates/examples/level-2/spec.md:168` "### Data Boundaries", `:174` "### Error Scenarios", plus "### Concurrent Operations"; the same in `examples/level-3/spec.md:206,212` and `examples/level-3+/spec.md:207,213`. The template now asks for three lines: empty input, maximum input, failure path (`spec.md.tmpl:261-263`). The example content is real and feature-specific, not filler, and the drift guard compares headers, so this is a shape mismatch rather than a regression. A model copying the example will still write category subsections.

### F5 [P2] The filler strings survive outside the T013 example set

`examples/level-1/plan.md:52` "- [x] Tests passing (if applicable)" (Level 1 was not in T013's list); `addons/handover.md.tmpl:114` "- [ ] Tests passing (if applicable)" (an add-on, out of scope); `examples/level-2/plan.md:156` "Phase 1.5 (Schema) ───┘" (filled content, but it is the exact diagram shape graders counted 6 times). None is a wrong edit, but each one fails CHK-FIX-002 (F3).

### F6 [P2] The sign-off fill note still describes several roles

`S/templates/core/tasks.md.tmpl:291`: "Name the real approver for each role. Delete a row when the role does not exist. ... GOOD: Conductor, runs every task. Operator, merges the commit." The table now has one row (`:295`), so "delete a row" and a two-approver GOOD example fit the old three-row table. Suggest: "Name the real approver and role. Add a row per extra approver."

### F7 [P2] The L2 edge-case token lines sit outside their anchor

`spec.md.tmpl:251-254` opens and closes `ANCHOR:edge-cases` around the heading and fill note only, and the three new token lines are at `:261-263`, after the `/IF`. The fill note says "delete the whole section", and an author who deletes the anchored block leaves three orphan token lines. The structure predates this phase, but the new lines inherit it.

### F8 [P2] The doc-sweep record disagrees with the diff

`P/scratch/doc-sweep.md:29-31` marks `assets/level-decision-matrix.md:264`, `assets/template-mapping.md:400` and `references/templates/level-specifications.md:387` "Unchanged; reported to the conductor". The diff changes all three: they now say the approval workflow is in spec.md and the sign-off section is in tasks.md. The new text is correct; update the record.

### F9 [P2, phase 015 text] Unbalanced backtick placeholder

`S/templates/core/spec.md.tmpl:404`: "GOOD: v1.0 2026-10-24: added `--keep <n`." is missing the `>`. Cosmetic. It does not affect 016.

## Open point: Level 3 deploy-readiness rows

`S/templates/core/tasks.md.tmpl:257` "- [ ] CHK-121 [P0] Feature flag configured (if applicable)" and `:258` "- [ ] CHK-122 [P1] Monitoring/alerting configured".

**Verdict: yes, phase 016 should trim CHK-121 and CHK-122.** I recommend replacing them with one `[YOUR_VALUE_HERE: one check per deployment step, with its command]` row and keeping CHK-120, since a tested rollback is checkable.

Evidence:
1. The phase's own checks name the string. `Feature flag configured` appears in REQ-002, AC-002, T020, `P/plan.md:117` and CHK-FIX-002, and CHK-121 is the only template line left that matches it (F3). Trimming CHK-121 turns all four checks green with no rewording.
2. They are the same filler class this phase removed. The deleted enhanced-rollback block carried "Feature flag configured" and "Monitoring alerts set", which graders counted as filler 8 times out of 12 (`../015-template-example-neutralization/scratch/evidence-summary.md:28`). CHK-121 and CHK-122 are the same two items on the tasks side. The updated contract (`S/references/validation/template-compliance-contract.md:143`) says deployment detail belongs in `rollback`, which removes these rows' only remaining source.
3. Removing them is low risk. `deploy-ready` is an `L3+:` header, so it is optional (`orchestrator.ts:648`), and no rule reads its rows. The benchmark report records a run that deleted `deploy-ready` and was excused (`S/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:26`), which is consistent with models treating it as optional.

Limit on the evidence: the grader count in point 2 is for the plan.md pre-deployment rows, not for these tasks.md rows. Applying it to CHK-121 and CHK-122 is an inference from identical wording. A grep of the 12 graded packets for `CHK-121.*Feature flag` would confirm it.

## Not checked

- No vitest, census, `check-card-sync.sh`, `check-example-drift.sh` or Hermes sync was run (read-only brief).
- `P/scratch/baseline` has no `cli-before.txt`, which CHK-002 expects. The census used four shard lists (`list-0`..`list-3`), while `P/tasks.md:31` says shards 0, 1 and 2. These are task-record mismatches, not edits.

wrong edit: 1

## Re-review 2026-10-26

Fresh read-only re-review of the shared tree. `S` = `.skilled/skills/system-spec-kit`.

First-review status: F1 fixed (`S/references/workflows/spec-authoring-card.md:91`, `:101` and `:172` name three phases, `rg '3 or 4|### Step|plan steps'` on the card prints nothing). F2 fixed (`S/templates/examples/level-3+/implementation-summary.md:347` points at plan section 7 ROLLBACK PLAN). F3 fixed: `rg 'Phase 1.5|Feature flag configured|External service failure|Network timeout|Tests passing'` over `S/templates` and the snapshot prints only three filled example lines, "Tests passing (unit and integration)" at `examples/level-2/plan.md:52`, `level-3/plan.md:54` and `level-3+/plan.md:56`, which are real content and do not match the CHK-FIX-002 pattern `Tests passing \(if applicable\)`. F4 fixed: the level-2, 3 and 3+ example specs hold the template's three lines (empty input, maximum input, failure path) at `examples/level-2/spec.md:166-170`, `level-3/spec.md:204-208` and `level-3+/spec.md:205-209`. F5 fixed (no `Phase 1.5` and no `Tests passing (if applicable)` left in templates or examples; `handover.md.tmpl` clean). F6 fixed (`S/templates/core/tasks.md.tmpl:290` asks for one approver and a row per extra approver). F7 fixed (`S/templates/core/spec.md.tmpl:251-258`, the three token lines sit inside `ANCHOR:edge-cases`). F8 not fixed but disclosed (`implementation-summary.md:137`). F9 fixed (`spec.md.tmpl:408`).

Checks rerun: IF and ANCHOR markers balance in all core templates (plan 25/25 and 15/15, spec 62/62 and 18/18, tasks 12/12 and 21/21); `rg decision-record S/templates/core/` prints `tasks.md.tmpl:232` and `spec.md.tmpl:441`, both conditional; sign-off anchor at `tasks.md.tmpl:288` with one token row; `## FIX ADDENDUM: FIX COMPLETENESS` at `tasks.md.tmpl:166`; `template-compliance-contract.md:143` drops the two addenda. `scaffold-golden-snapshots.vitest.ts` 12 passed, `template-fill-guidance.vitest.ts` 24 passed, `CARD SYNC OK`, `EXAMPLE_DRIFT_OK`.

Findings:

1. P2 `tasks.md:212` lists CHK-002 and CHK-010 as open P0 items and `tasks.md:208` counts P0 7/10, but `tasks.md:134` and `:143` mark both `[x]`; only CHK-001 is open, so P0 is 9/10. Fix: "P0 9/10; open: CHK-001 (P0), CHK-023 and CHK-FIX-007 (P1)".
2. P2 `spec.md:24` reads Status Complete and `implementation-summary.md:13` says "Closed out", while T001 (`tasks.md:44`) and T023 (`tasks.md:82`) are open and `tasks.md:92` leaves "All tasks marked [x]" unticked. The acceptance file is the closure gate and reads Closeable Yes, so this is a wording gap. Fix: tick T023 and CHK-023 against this re-review, and record T001 as a deviation (the baseline was taken after 015's template edits) or leave the spec In Progress until 015 closes.
3. P2 `scratch/doc-sweep.md:29-31` still marks three rows "Unchanged" that the diff corrected (F8). Fix: update the three rows.

wrong edit: none

## Fix check 2026-10-26

A fresh checker read the tree after the fixer's pass.

1. P2 Verification Summary: fixed. `tasks.md:208` reads P0 10/10 and `:209` P1 6/7; the only open box is CHK-FIX-007 (`:169`), named at `:212`. CHK-001 and CHK-002 are ticked as deviations (`:133`, `:134`).
2. P2 Complete with open tasks: fixed. T001 is a recorded deviation (`tasks.md:44`), T023 and CHK-023 are ticked against the re-review (`:82`, `:156`), and "All tasks marked [x]" is ticked (`:92`). `implementation-summary.md:135` records the 015 deviation.
3. P2 doc-sweep rows: fixed. `scratch/doc-sweep.md:29-31` name the shipped corrections, and the text matches `assets/level-decision-matrix.md:264`, `assets/template-mapping.md:400` and `references/templates/level-specifications.md:387`.

Strict validation of this phase with `SPECKIT_DRAFT_AUTO_REPAIR=0`: Errors 0, Warnings 0, RESULT: PASSED, exit 0. Side effect: this section adds a second `wrong edit: none` line, so T023's verify at `tasks.md:82`, which expects one line, now prints two; reword it to "at least one line".

wrong edit: none
