---
title: "Feature Specification: Phase 8: playbook-run-in-worktree"
description: "Run every new or changed manual-testing-playbook scenario from phase 007 inside a disposable sk-git worktree, record a scripted PASS or FAIL for each one and publish the result as a benchmark report package."
trigger_phrases:
  - "playbook run in worktree"
  - "phase 8 playbook run in worktree"
  - "manual testing playbook execution"
  - "disposable worktree scenario run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 8: playbook-run-in-worktree

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 007 writes eight manual-testing-playbook scenarios that describe the new placeholder gate, the example drift guard, the golden render, the card router, the card sync guard and a DeepSeek authoring run. Nothing has executed them. This phase runs every one of them for real inside a disposable sk-git worktree and records PASS or FAIL against each scenario's stated criterion. The result is a report package that phase 009 and the operator can read without rerunning anything.

**Key Decisions**: one disposable worktree built from a ref that already holds the phase 002 to 007 changes, scenarios executed from their own command blocks and a report package under the skill benchmark reports folder.

**Critical Dependencies**: the operator records `BASE_REF` in `../goal.md` section 4, and that ref contains the phase 002 to 007 changes.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-playbook-catalog-readme-alignment |
| **Successor** | 009-authoring-benchmark-and-closeout |
| **Handoff Criteria** | Every mapped scenario has a captured run and a recorded verdict, the report package holds one outcome file per scenario and the disposable worktree is gone |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: Scenario execution happens only inside the disposable worktree. Durable writes land in this phase folder and in one new benchmark report folder plus one index row. No source file under `.skilled/` is edited, except through a fix brief that names exactly one file inside the disposable worktree.

**Dependencies**:
- The launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.
- Phase 007 is closed, its eight scenario files exist at the paths frozen in its plan section 3.1 and the playbook index lists them.
- The operator records a `BASE_REF` in `../goal.md` section 4, and that ref contains the phase 002 to 007 changes.

**Deliverables**:
- `scratch/scenarios.tsv`: the eight scenario rows, each with its playbook id, its file and its pass patterns.
- `scratch/worktree/create.out`, `create.err`, `provision.out`, `provision-exit.txt`, `own-code.txt`, `precondition.txt`: how the disposable worktree was made and proved.
- `scratch/runs/<playbook-id>.txt`: one captured run per scenario.
- `scratch/results.tsv` and `scratch/verdicts.md`: the verdict, the reason and the evidence for each scenario.
- `scratch/fix/<scenario>-<n>.txt`: one fix brief per failed attempt.
- `scratch/fixes/fix.patch` and `scratch/fixes/status.txt`: the worktree diff and status saved before removal, so a fix survives the worktree.
- `.skilled/skills/system-spec-kit/benchmark/reports/<date>--manual-testing-playbook--weak-model-authoring/`: the report package.
- `scratch/review/T017.txt`: the frontier review reply, one line per finding or `NO FINDINGS`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 007 adds scenarios that claim the placeholder gate warns in Draft, fails at Complete, the drift guard catches a leaked description, the golden render holds, the router loads the card, the sync guard fails on drift and a DeepSeek worker can author a Level 1 packet from the card. A scenario file is a claim until someone runs its commands on a tree that contains phases 002 to 007. Without that run, phase 009 would measure templates while the playbook that describes them is untested.

### Purpose
Every scenario this packet adds has a real execution record and a verdict that another person can check from the captured output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One disposable worktree created through `.skilled/skills/sk-git/scripts/worktree-naming.sh` from the operator's `BASE_REF`.
- Provisioning that worktree with its own dependency trees and its own build, proved by a realpath check.
- Literal execution of the eight scenarios phase 007 added, with output captured under `scratch/runs/`.
- A scripted compare of each run against a frozen pass pattern, with the scenario file's own Pass section as the fallback authority.
- At most three fix briefs and reruns for a failing scenario, then an escalation record.
- One report package with the real file set of an existing report folder, plus one row in the reports index.
- One read-only frontier review of the report and the runs.

### Out of Scope
- Editing the scenario files. Phase 007 owns their text, and a scenario defect is escalated to its owner.
- Fixing product code by hand. A fix is one Task subagent brief with one named file inside the disposable worktree.
- Measuring the authoring benchmark delta. Phase 009 owns that comparison.
- Pushing. It stays with the operator. The conductor makes one local commit of this phase folder and the report package after validation, and it is never pushed.
- Running anything in the primary checkout. The only scenario host is the disposable worktree.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/scenarios.tsv`, `scratch/results.tsv`, `scratch/verdicts.md` | Create | Scenario map, verdict rows and the human-readable verdict page |
| `scratch/worktree/*`, `scratch/tools/*` | Create | Worktree proofs and the three scratch scripts |
| `scratch/runs/*`, `scratch/fix/*`, `scratch/fixes/*`, `scratch/review/*` | Create | Captured runs, fix briefs, the pre-removal patch and the review reply |
| `.skilled/skills/system-spec-kit/benchmark/reports/<date>--manual-testing-playbook--weak-model-authoring/README.md` | Create | Report with the ten required sections |
| `.skilled/skills/system-spec-kit/benchmark/reports/<date>--manual-testing-playbook--weak-model-authoring/results.csv` | Create | One row per scenario |
| `.skilled/skills/system-spec-kit/benchmark/reports/<date>--manual-testing-playbook--weak-model-authoring/source.md` | Create | Where the runs and the raw evidence live |
| `.skilled/skills/system-spec-kit/benchmark/reports/<date>--manual-testing-playbook--weak-model-authoring/outcomes/<playbook-id>.json` | Create | One outcome record per scenario |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modify | One new row at the top of the run index |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modify | Progress and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The disposable worktree is created through `worktree-naming.sh create` from `BASE_REF`, its provisioning exits 0 and the own-code check prints no `FOREIGN` line. |
| REQ-002 | `scratch/scenarios.tsv` holds exactly eight rows, each row names an existing scenario file and no row is a duplicate. |
| REQ-003 | Every scenario row has a non-empty `scratch/runs/<playbook-id>.txt` and a verdict of `PASS`, `FAIL`, `FIXED`, `ESCALATED` or `SCENARIO_DEFECT` in `scratch/results.tsv`. |
| REQ-004 | The report package holds `README.md`, `results.csv`, `source.md` and one `outcomes/<playbook-id>.json` per scenario, and `results.csv` holds eight data rows. |
| REQ-005 | The primary checkout status shows no change outside this phase folder, the new report folder and the one index row. When the conductor works in a build worktree, the primary checkout shows no change at all. |
| REQ-006 | The disposable worktree and its branch are removed after the evidence is copied, and the removal was allowed only when every changed path in `scratch/fixes/status.txt` appeared in `scratch/fixes/fix.patch`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | One read-only frontier review of the report and the runs ran, and each finding is applied or recorded in `goal.md` section 4 with the reason it was not. |
| REQ-008 | Every failed scenario has at most three fix briefs, each naming one file, and an `ESCALATED` row when the third fix did not pass. |
| REQ-009 | Before the worktree is removed, its diff and status are saved to `scratch/fixes/fix.patch` and `scratch/fixes/status.txt`, so a fix made inside the worktree survives as a patch. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 009 can read `results.csv` and know which scenarios passed without opening a run file.
- **SC-002**: The operator can rerun the scenario set from the report's REPRODUCIBILITY section and get the same verdicts on the same `BASE_REF`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `BASE_REF` contains the phase 002 to 007 changes | Every scenario tests an old tree and fails for the wrong reason | `tasks.md` T007 checks the card, both guard scripts and the v2.3 stamp inside the disposable worktree before the first run |
| Dependency | The disposable worktree gets its own `node_modules` and `dist` | The run silently uses the primary checkout code | `tasks.md` T006 rejects any realpath outside the worktree and stops on `FOREIGN` |
| Dependency | npm can install from the registry or the local cache | Provisioning fails and no scenario can run | `worktree-naming.sh create` reports the failing package, and `tasks.md` T006 retries provisioning once, then records the blocker |
| Risk | A scenario file is not copy-runnable | The run fails and looks like a product defect | The failure protocol names the scenario as the owner, records `SCENARIO_DEFECT` and escalates to phase 007 |
| Risk | Worktree removal deletes the only copy of a run | The report loses its evidence | Every run is captured under `$PHASE/scratch/runs/` in the conductor's checkout before removal, and T016 checks eight recorded rows and every run file before it removes the worktree |
| Risk | A scenario leaves a throwaway track in the worktree | Removal is refused by the clean-status gate | The gate refuses removal while any changed path is missing from `scratch/fixes/fix.patch`, and T016 prints every changed path before it decides |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One scenario run is stopped by the runner's 30 minute alarm. A run that ends with `exit=142` is recorded as `FAIL` and handled as a failure.
- **NFR-P02**: Provisioning the disposable worktree finishes within 45 minutes. A longer run is stopped by a 45 minute alarm and recorded as a blocker.

### Security
- **NFR-S01**: No brief carries a credential, a token or a key. A Task subagent inherits the conductor session's model and provider login.
- **NFR-S02**: Every worker is one Task subagent, and its brief states that the spec-folder question is pre-resolved under the child-dispatch exemption.

### Reliability
- **NFR-R01**: A verdict comes from a captured output file and a frozen pattern, never from a chat message. A second conductor with the same files reaches the same verdict.
- **NFR-R02**: The report package is written after the last run and before the worktree is removed, so no evidence depends on a deleted directory.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a scenario file with no `### Commands` block is `SCENARIO_DEFECT` and is escalated, never executed from a guessed command.
- Maximum length: a run file above 2 MB is truncated by `run-scenario.sh` to its first 2 MB and last 200 lines, which writes a `truncated=yes` line that the comparator records in the verdict reason.
- Duplicate match: two playbook index rows that carry one S label's playbook id stop the map build with `AMBIGUOUS <S label>`, and no scenario runs until phase 007 is fixed.

### Error Scenarios
- External service failure: a provider error stops the S8 dispatch. T010 records the error line, waits 10 minutes and retries once, then marks S8 `ESCALATED`.
- Network timeout: a provisioning failure is retried once with `worktree-naming.sh provision`. A second failure stops the phase with `BLOCKED provisioning`.
- Worktree removal refused: the gate names every changed path that is missing from `scratch/fixes/fix.patch`. When a path is listed, the worktree is kept and the operator is asked to decide.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 8 scenarios read, 0 source files changed by hand. Systems: playbook, validator, guards, report index |
| Risk | 8/25 | Auth: N, API: N, Breaking: Y (the report index row) |
| Research | 8/20 | The scenario map is read from phase 007 and the report shape from an existing folder |
| Multi-Agent | 8/15 | Workstreams: one runner, one S8 worker, up to three fix workers, one reviewer |
| Coordination | 10/15 | Dependencies: `BASE_REF`, provider login, provisioning |
| **Total** | **44/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A scenario passes because the worktree ran the primary checkout's code | M | M | Own-code realpath check in T006 and a `FOREIGN` stop |
| R-002 | A scenario fails on a real product defect and the fix worker edits the wrong file | M | M | The fix brief names the `- Implementation:` file from the scenario's `## 4. SOURCE FILES` list and no other path |
| R-003 | The report is assembled from chat output rather than run files | M | L | Every report field is generated from `scratch/results.tsv` and the captured run files, and T017 reads the files |
| R-004 | The report index row is added twice on a rerun | L | M | T014 greps for the exact report folder name before it inserts the row |

---

## 11. USER STORIES

### US-001: One run per scenario (Priority: P0)

**As a** conductor, **I want** each scenario's own command block executed on a tree that holds every prior phase, **so that** the verdict describes the shipped behavior and not a retyped copy.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Evidence after the worktree is gone (Priority: P0)

**As the** operator, **I want** every captured run and verdict to survive the disposable worktree, **so that** I can audit the phase without recreating it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. The one open input is the operator's `BASE_REF`, and `tasks.md` T001 stops the phase when it is absent.
- A scenario whose own Pass section disagrees with the frozen pass pattern is a phase 007 defect. The run records `SCENARIO_DEFECT` and the phase continues with the other scenarios.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---

