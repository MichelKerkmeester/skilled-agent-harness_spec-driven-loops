---
title: "Feature Specification: Phase 11: relocate-and-restore-fixes"
description: "Two reviews of the finished packet found one resume gap and four smaller defects in relocate.mjs and archive.sh. A phase moved to another parent loses its phase rows when the run stops after the move, exit 3 also covers a validator that never ran, and the restore preflight costs a full dry run. This phase fixes each with a failing test first."
trigger_phrases:
  - "relocate and restore fixes"
  - "phase 11 relocate and restore fixes"
  - "re-parent resume phase rows"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: relocate-and-restore-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | Chosen by the operator before the build, worktree or current branch |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 13 |
| **Predecessor** | 010-real-pipeline-tests |
| **Successor** | 012-catalog-and-playbook-alignment |
| **Handoff Criteria** | A re-parent stopped after its move step is finished by a rerun of the same map, with the phase rows in both parents rewritten, and the relocate and archive suites exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: Code and help text in `relocate.mjs` and `archive.sh`, and their suites. No feature catalog, playbook, reference, README or changelog edit: phases 012 and 013 describe the behavior this phase leaves.

**Dependencies**:
- The Fable 5.2 review in `../review/fable-5-2-review.md`, which names five of the six defects
- The DeepSeek review in `../review/review-report.md`, which names the stale `archive.sh --help`

**Deliverables**:
- A rerun that writes the phase rows of a re-parent whose run stopped after the move
- Exit status 3 only when a `RESULT: FAILED` line was read, and a close that stays open when the validator never ran
- A bare-name rewrite that leaves another track's packet alone
- A restore mixed-track check that needs no relocate dry run
- `archive.sh --help` naming the mixed-track refusal and the status 3 outcome
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`relocate.mjs` promises that rerunning a stopped map finishes it, and for one case it does not. When a phase moves to another parent and the run stops after the move step, the rerun reads the entry as done and plans no phase-row edits, so the old parent keeps rows for a folder that is gone and the new parent never gets them. Four smaller defects sit beside it: exit 3 reports a successful restore when the validator never ran, the bare-name pass can rename another track's packet, every restore into a flat track pays a 27-second dry run, and `archive.sh --help` predates the restore guards.

### Purpose
A rerun of a stopped re-parent leaves both parents' phase rows correct, and each smaller defect is fixed with a test that failed before the fix.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n '779,781p' .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs
  for (const entry of entries.filter((item) => item.state === 'pending')) {
    const oldParent = parentId(entry.from);
    const newParent = parentId(entry.to);
$ sed -n '1578,1583p' .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs
  if (!step('move', () => {
    const kinds = order.map((entry) => moveFolder(entry, tracked));
    return `${kinds.length} folder(s)`;
  })) return false;

  if (!step('rewrite references', () => {
```
The move step runs before the rewrite step. On a rerun, `recordedMove` at line 1301 reads the moved folder as `done` from git or the ledger, and the filter at line 779 then skips it. This is read from the code. Neither reviewer ran the failing case, and T001 runs it before any fix. The 27-second figure is the Fable review's own timing of one dry run on the real tree, not a planning-time measurement.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. `F` numbers are the findings of `../review/fable-5-2-review.md`. `D` names a row of `../review/review-report.md`.

### In Scope
- Plan phase-row edits for a re-parent entry that is done but whose parents' rows are still stale, read the moved child at its new place, and write the new parent before the old one (F1).
- Set exit 3 only when the moved packet's validation printed `RESULT: FAILED`. A run with no `RESULT` line exits 2 and leaves the close open so a rerun validates again (F2). The header comment of `relocate.mjs` states the narrowed condition.
- Leave a bare name preceded by another folder's name and a slash unrewritten (F4).
- Decide the restore mixed-track refusal in `archive.sh` from the declared sub-tracks it already finds, without a relocate dry run (F3).
- Name the mixed-track refusal and the status 3 outcome in `archive.sh --help` (D, P2 row for `archive.sh:83`).
- One happy-path case and one edge case per changed surface.

### Out of Scope
- An untracked packet stopped before the ledger step stays a refusal that names the move back (F5). The refusal is intended behavior from phase 006. Phase 013 documents it.
- The case-fold probe for an all-capitals specs folder (F6). It is unreachable: `relocate.mjs:61` fixes `SPECS` to `<repo>/specs`, so the probe always flips the literal `specs`, and no test could exercise the other case.
- Every document outside the two scripts. Phases 012 and 013 own them.
- The Phase column number of a map row and a `Phase N` title after a renumber, a residual phase 007 recorded.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `C/spec/relocate.mjs` | Modify | Phase-row planning for done re-parents, exit 3 condition and its header comment, bare-name boundary |
| `C/spec/archive.sh` | Modify | Mixed-track check without a dry run, help text |
| `C/tests/relocate.vitest.ts` | Modify | Cases for REQ-001, REQ-002 and REQ-003 |
| `C/tests/archive-track.vitest.ts` | Modify | Cases for REQ-002, REQ-004 and REQ-005 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

Every check runs in `SCRATCH`, a `mktemp -d` copy of the tooling with its own git repository. `R` is `node C/spec/relocate.mjs`.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Closes F1 at `relocate.mjs:779` and `:860`. Failing scenario: `R --from <parentA>/003-x --to <parentB>/004-x --apply` stops after the move, and the same command again ends as finished with `<parentA>/spec.md` still holding a map row for `003-x` and `<parentB>/spec.md` holding none for `004-x`. The rewrite step is in-process, so the stopped state is made by hand, as the case at `relocate.vitest.ts:848` does: a `git mv` of the folder before the run, and for the second case also the old parent's rows already removed. A rerun must plan the phase-row edits of a done re-parent while either parent's rows are stale, read the moved child's `spec.md` at `entry.to`, and write the new parent's files before the old parent's | Case 1, folder moved and no row rewritten: `R --apply` exits 0, `rg -n '003-x' <parentA>/spec.md <parentA>/goal.md` prints nothing, `<parentB>/spec.md` holds a map row and a binding row for `004-x`, and the moved child's Predecessor and Successor rows name its new neighbours. Case 2, folder moved and the old parent already rewritten: `R --apply` exits 0 and `<parentB>/spec.md` holds the map row. In both, the next run prints `relocate: nothing to do` and exits 0. A clean re-parent still prints `relocate: nothing to do` on its second run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Closes F2 at `relocate.mjs:1659-1666`. Exit 3 is set only when the moved packet's validation output holds a `RESULT: FAILED` line. A non-zero validation with no `RESULT` line, a validator that did not run, exits 2 and leaves the close open, because the sweep mark at `:1651` today closes the map before validation runs. Across entries 2 outranks 3 | With a `validate.sh` stub that prints `RESULT: FAILED` and exits 1, the run exits 3 and the next prints `relocate: nothing to do`. With a stub that prints nothing and exits 1 once, run 1 exits 2 and prints `no RESULT line`, and run 2 validates again and exits 0. With one entry of each kind, the run exits 2. An `archive-track.vitest.ts` case shows `archive.sh --restore` reporting a failed restore for the no-`RESULT` case |
| REQ-003 | Closes F4 at `relocate.mjs:980-983`. A bare name preceded by `<name>/`, where `<name>` is not `.`, `..` or the phase parent's own folder name, is left alone. `bareNamePattern` has three call sites, `:746`, `:989` and `:1096`, and each passes the parent name it needs | Renumbering `003-gamma` to `002-gamma` in a phase parent `005-p` whose `spec.md` holds `other-track/003-gamma`, `005-p/003-gamma`, `./003-gamma/` and `../003-gamma/spec.md`: the first is unchanged and the other three read `002-gamma`. The boundary is chosen from the forms the setup search lists |
| REQ-004 | Closes F3 at `archive.sh:381`. The restore mixed-track refusal is decided in the shell, with no `relocate.mjs` dry run, by the same rule as the relocate preflight: a declared sub-track in the destination track, using the declaration check that honors the container-name rule at `relocate.mjs:215`. The guard at `archive.sh:371` stays. The refusal text and exit 1 stay as they are | The refusal case at `archive-track.vitest.ts:645` still exits 1 and the flat-track case at `:666` still exits 0. A new case shows the flat-track restore runs no `relocate.mjs` process before its move, through a stub that records its calls |
| REQ-005 | Closes the stale help named at `archive.sh:83`. `--help` names the mixed-track restore refusal and that a restore whose packet fails its own validation is reported as restored with a warning | `bash C/spec/archive.sh --help` prints both lines, and a case greps for them |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In `SCRATCH`, a re-parent whose rewrite step failed once is finished by run 2 with both parents' phase rows correct, and run 3 prints `relocate: nothing to do`.
- **SC-002**: From `C`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts tests/relocate-real-pipeline.vitest.ts` exits 0 with the new cases included, each of which failed before its fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Planning row edits for done entries makes a finished re-parent report work forever | High: the second-run criterion of the parent goal breaks | REQ-001 plans the edits only while a stale row exists, and its acceptance ends on `relocate: nothing to do` |
| Risk | The narrower bare-name boundary misses a relative link the tree uses | Med: a renumber leaves a stale link | T001 lists every form in the real tree first, and REQ-003 keeps `./` and `../` |
| Risk | The shell check and the relocate preflight disagree on what counts as mixed | Med: a restore is refused or allowed against the engine's rule | REQ-004 uses the declaration check the preflight's container-name rule follows, keeps the refusal case and the flat-track case, and adds the no-dry-run case. The engine's own preflight still refuses a mixed `--apply` |
| Dependency | `archive.sh` reads exit status 3 at `archive.sh:437` | REQ-002 changes when 3 is set, not what it means | The restore cases in `archive-track.vitest.ts` cover both outcomes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- F1 is read from the code by two readers, not run. The setup reproduces it in `SCRATCH`. If the rerun already fixes the rows, REQ-001 becomes a regression test only and the deviation is recorded in `goal.md`.
- Which segment the real tree writes directly before a bare phase name is listed by the setup search. The plan verifier counted 5715 behind a numbered parent, 1815 behind `..` and 87 behind `...` on 2026-11-14. REQ-003's boundary is chosen from the full list.
<!-- /ANCHOR:questions -->

---
