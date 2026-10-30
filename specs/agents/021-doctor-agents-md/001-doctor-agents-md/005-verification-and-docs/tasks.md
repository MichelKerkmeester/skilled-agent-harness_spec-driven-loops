---
title: "Tasks: verification and docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: verification and docs

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables.** `F` is `.skilled/commands/doctor/scripts/tests/fixtures/agents-md`. `E` is `scratch/e2e`. `D` is `.skilled/commands/doctor`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'run-all' scratch/baseline.txt` prints at least `1`. Evidence: `scratch/baseline.txt` holds the six commands twice, once before this child's first edit and once from the finished tree, and `rg -c 'run-all'` prints 16 across both captures. Every command exits 0 at both ends.
- [x] T002 Resolve the three documentation locations (`D/scripts/README.markdown`, the playbook, the changelog). Verify: the three resolved paths are written into `scratch/doc-locations.txt`. Evidence: `wc -l scratch/doc-locations.txt` prints `3`, one line per location, and `scratch/router-answers.txt` records the three `compiled-route.cjs --hub sk-doc` answers that produced them: `sk-create-changelog`, `sk-create-manual-testing-playbook` and `sk-create-feature-catalog`.
- [x] T003 Confirm children 001 to 004 pass (`specs/agents/021-doctor-agents-md/001-doctor-agents-md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`. Evidence: the recursive gate prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`, and each of the four child folders carries all its tasks `[x]` and all its criteria `Met`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Copy each fixture to a temporary directory and run the check (`E`). Verify: nine transcripts exist and each names its fixture's state. Evidence: `find scratch/e2e -type f | wc -l` prints 9, and every transcript carries its own `A1 install state:` line: `absent`, `adopted`, `claude-only`, `foreign`, `forked`, `forked` (over-budget), `pure`, `forked` (shadowed-pin) and `stale`.
- [x] T005 Run the plan on every copy (`E`). Verify: each transcript carries either `NOTHING TO DO` or a plan digest. Evidence: seven transcripts carry a `plan-digest:` line, `pure.txt` prints `NOTHING TO DO`, and `over-budget.txt` records the engine's refusal at exit 2 with no digest, which is the one state the plan cannot compose.
- [x] T006 Reconcile the two engines per fixture (`E`). Verify: every `pure` or `adopted` result pairs with `NOTHING TO DO`, and every other result pairs with a plan. Evidence: the reconfigured tree pairs in every case. `pure` prints `NOTHING TO DO` on the pre-apply tree, and after each apply the re-plan prints `NOTHING TO DO` with the check reading `pure` (absent, stale) or `adopted` (adopted, claude-only, foreign, forked, shadowed-pin). `over-budget` is refused by name at exit 2 and writes nothing. The table in `implementation-summary.md` records each pair.
- [x] T007 [P] Add the two manual rows at the resolved playbook location. Verify: `rg -c 'agents-md' <resolved playbook file>` prints at least `2`. Evidence: `rg -c 'agents-md' manual-testing-playbook/doctor-commands/README.md` prints 2, and the two scenario files `doctor-agents-md-block-devin-quote.md` (DOC-396) and `doctor-agents-md-cursor-mirror-load.md` (DOC-397) each carry the five-section contract. The index row-set in `../manual-testing-playbook.md` section 7.2 gains both rows.
- [x] T008 Answer both manual rows from a live session or record an unknown with its reason. Verify: each row carries either an observation or `UNKNOWN` with a reason. Evidence: both scenarios' `Recorded answer` tables read `UNKNOWN` with the reason that no Devin session and no Cursor window is reachable from this run, and each names the six steps an operator runs to answer it.
- [x] T009 Add the script README rows (`D/scripts/README.markdown`). Verify: `rg -c 'agents-md' D/scripts/README.markdown` prints at least `1`. Evidence: `rg -c 'agents-md' .skilled/commands/doctor/scripts/README.markdown` prints 16. The directory tree, the key-files table, the diagnostic entrypoints and the mutation-boundary table each name the three engines and their three suites.
- [x] T010 Add the changelog entry at its resolved location. Verify: `rg -c 'agents-md' <resolved changelog file>` prints at least `1`. Evidence: `rg -c 'agents-md' .skilled/changelog/skilled/v4.0.1.4.md` prints 5, and the entry names the command, its three targets and the inactive bridge. Four skill changelogs sit beside it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun every baseline command from the final tree (`scratch/baseline.txt`). Verify: each prints the same pass line it printed before the work started. Evidence: the canary prints `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).`, the gate 1 pointer sync prints `PASS: 1 instruction files carry the root Gate 1 lookup.`, the repo-rules checker prints `RESULT: PASSED (11/11 checks)`, `route-validate.sh` prints `OK: route-validate — 24 routes validated, 5 warnings`, the family runner ends `7 suite(s) passed, 0 failed`, and `wc -c < AGENTS.md` prints 27888, which is unchanged by this child.
- [x] T012 Run the recursive phase gate (`specs/agents/021-doctor-agents-md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`. Evidence: every folder prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`, including this one.
- [x] T013 Confirm the change list (`git status --porcelain`). Verify: the list names only files named by children 001 to 005. Evidence: `git status --porcelain` names the README doctor section, the script README, the catalog and playbook rows, the four changelogs, the two new scenario files, three skill version carriers with their Hermes copies, the generated retrieval corpus, the re-minted sk-doc activation manifest, and this packet's own documents. Every path is named by a child or by this child's own task list, and the deviations are recorded in `implementation-summary.md`.
- [x] T014 Confirm no local-only path appears (`git status --porcelain`). Verify: `rg -n 'local-' <(git status --porcelain)` prints nothing. Evidence: prints nothing, exit 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the nine-fixture pass is captured, the baseline reran green from the final tree, and the recursive gate passes
- [x] The recorded manual answers are quoted in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Children 001 to 004 pass. Verify: the recursive gate exits 0. Evidence: `validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` exits 0 with `RESULT: PASSED`.
- [x] CHK-002 [P0] The baseline is recorded. Verify: `rg -c 'check-rule-copies' scratch/baseline.txt` prints at least `1`. Evidence: prints 2, one capture before this child's edits and one after.
- [x] CHK-003 [P1] The three documentation locations are resolved. Verify: `wc -l scratch/doc-locations.txt` prints `3`. Evidence: prints 3, and `scratch/router-answers.txt` carries the router output behind each one.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No engine file changed in this child. Verify: `git status --porcelain -- .skilled/commands/doctor/scripts/agents-md-*.cjs` prints nothing. Evidence: prints nothing.
- [x] CHK-011 [P0] No route file changed in this child. Verify: `git status --porcelain -- .skilled/commands/doctor/_routes.yaml` prints nothing. Evidence: prints nothing.
- [x] CHK-012 [P1] Documentation rows use the family's existing heading levels. Verify: the new rows render under their existing parent heading. Evidence: the README bullet sits under the existing `#### DOCTOR` heading, the script README rows sit in the existing `| File | Responsibility |` and `| Command | Purpose |` tables, and both playbook scenarios use the same five numbered sections as the rows beside them, which `validate_document.py --type playbook_feature` confirms with 0 issues.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`. Evidence: AC-001 to AC-011 each read `Met` with the command output in its Verification cell.
- [x] CHK-021 [P0] Nine transcripts exist. Verify: `ls scratch/e2e | wc -l` prints `9`. Evidence: prints 9.
- [x] CHK-022 [P1] Every baseline command reran. Verify: `rg -c 'RESULT: PASSED' scratch/baseline.txt` prints at least `1`. Evidence: prints 3: the repo-rules checker twice and the manifest freshness line.
- [x] CHK-023 [P1] The two manual rows carry an answer or a recorded unknown. Verify: both rows are non-empty. Evidence: both `Recorded answer` tables carry four filled fields, `Answer` = `UNKNOWN` and a one-sentence `Reason`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No transcript carries a real consumer path. Verify: `rg -n 'Users/|/home/' scratch/e2e` prints nothing. Evidence: prints nothing. The runner shortens this checkout to `<repo>`, the run root to the fixture name and the backup root to `<tmp>`, and it says so in each transcript's header.
- [x] CHK-031 [P0] No documentation row names a local-only skill or command. Verify: `rg -n 'local-' <the three resolved documentation files>` prints nothing. Evidence: reads two pre-existing matches in the script README and one playbook scenario, and none is a local surface: the script README names the converter's `local-` name prefix as a refused skill name, and `doctor-update-align.md` uses `local-only` as a review verdict. Neither is a row this child added, and no `local-` skill or command is named in a row this child added.
- [x] CHK-032 [P1] No credential appears in a transcript. Verify: `rg -ni 'token|secret|password' scratch/e2e` prints nothing. Evidence: reads three lines, each the shipped template's own `Exact text, token or symbol` table row carried inside a printed block. No credential-shaped string appears, and no engine reads one.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The script README names the three scripts. Verify: `rg -c 'agents-md' .skilled/commands/doctor/scripts/README.markdown` prints at least `1`. Evidence: prints 16.
- [x] CHK-041 [P1] The changelog entry names the three targets. Verify: the entry names `check`, `embed` and `restore`. Evidence: `.skilled/changelog/skilled/v4.0.1.4.md` names all three in its opening paragraph and one bullet per target, and the entry also records that every derived bridge is inactive.
- [x] CHK-042 [P2] The resolved locations are recorded. Verify: `scratch/doc-locations.txt` names all three. Evidence: three lines, one per location.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Transcripts live under `scratch/e2e/`. Verify: `find scratch/e2e -type f | wc -l` prints `9`. Evidence: prints 9. The runner itself lives one level up at `scratch/run-e2e.sh`, so the transcript count stays exactly one per fixture.
- [x] CHK-051 [P1] Temporary fixture copies are removed. Verify: `git status --porcelain` lists no temporary path. Evidence: every composed copy lives under the throwaway run root outside the checkout, and the two unstaged directories the restore leaves empty are there, not in the tree.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
