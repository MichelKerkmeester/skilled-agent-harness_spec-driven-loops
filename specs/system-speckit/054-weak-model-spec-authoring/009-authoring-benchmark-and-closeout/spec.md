---
title: "Feature Specification: Phase 9: authoring-benchmark-and-closeout"
description: "Rerun the frozen authoring task three times on the final tree, report the before and after for five metrics, publish the benchmark report and changelogs, regenerate the trigger index and close the 054 packet."
trigger_phrases:
  - "authoring benchmark and closeout"
  - "phase 9 authoring benchmark and closeout"
  - "weak model authoring delta"
  - "054 packet closeout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 9: authoring-benchmark-and-closeout

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 1 measured how a DeepSeek V4.1 Flash worker authored a Level 2 packet before any template changed. This phase measures the same task the same way on the final tree and reports the difference for five metrics, each as a minimum and a maximum over three runs. It then publishes the benchmark report, writes the changelogs, regenerates the trigger index, refreshes the track roots and closes the packet against the seven criteria in `../goal.md` section 3.

**Key Decisions**: the frozen task text is copied byte for byte from phase 1, and leftover hints are counted as bare v2.2 hints plus v2.3 value tokens so the two sides share one definition.

**Critical Dependencies**: phases 1 to 8 are closed, the write-recipe child is closed and the launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-playbook-run-in-worktree |
| **Successor** | None |
| **Handoff Criteria** | `scratch/baseline/baseline.json` holds three final runs, the report folder holds the delta for all five metrics, `validate.sh --recursive --strict` on `../` prints `RESULT: PASSED`, and all seven parent criteria carry a PASS evidence line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: Edits land in this phase folder, in the benchmark report folder, in the two changelog locations, in the trigger index artifacts, in the `system-speckit` track metadata, in the parent `spec.md` and `goal.md`, and in one row of the `041-write-recipe-fixes` phase map. No template, validator, rule, command, agent or playbook file changes. This is the only phase allowed to edit the parent `spec.md`, the parent `goal.md` and the 041 phase map. The exact rows are the nine status rows of the parent phase map for phases 1 to 9, the seven completion checkboxes in parent `goal.md` section 3, the progress and log rows in parent `goal.md` section 4, and the row for `006-fix-write-recipe-move-destination` in the 041 phase map.

**Dependencies**:
- The launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.
- Phases 1 to 8 are closed. Phase 1 leaves `../001-template-drift-census-and-baseline/scratch/baseline/baseline.json` and `hints-v2.2.txt`. Phase 3 leaves the frozen folder list in `../003-versioned-placeholder-gate/scratch/census/`. Phase 4 leaves `check-example-drift.sh`. Phase 5 leaves `check-card-sync.sh`. Phase 8 leaves one playbook run report.
- The write-recipe child `specs/system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination/` is closed and passes strict validation.

**Deliverables**:
- `scratch/baseline/hints-v2.3.txt` and `scratch/baseline/anchors-v2.3.txt`: the final token vocabulary and anchor counts from a fresh Level 2 scaffold.
- `scratch/baseline/runs.jsonl` and `scratch/baseline/baseline.json`: three final runs, each with five metrics.
- `scratch/baseline/delta.json` and `scratch/baseline/delta.md`: the minimum, the maximum and the mean of each metric per side, with the delta.
- `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/`: `README.md`, `results.csv` and `source.md`, plus one new index row in the reports `README.md`.
- `.skilled/changelog/system-spec-kit/v2.9.0.0.md`: the global changelog entry.
- `../changelog/changelog-054-root.md` and `../changelog/changelog-054-009-authoring-benchmark-and-closeout.md`: the packet-local changelogs.
- `scratch/closeout/criteria.txt`: one PASS line with its command output for each of the seven parent criteria.
- `scratch/review/T016.txt`: the frontier review reply, one line per finding or `NO FINDINGS`.

**Changelog**:
- This phase writes the matching file in `../changelog/` with the nested generator and the global component entry in `.skilled/changelog/system-spec-kit/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 1 to 8 change the templates, the validator, the examples, the authoring card, the commands and the playbooks. Without a second measurement on the same task, the packet can only claim that the files changed. It cannot say whether a weak model leaves fewer unfilled hints, hits the required anchors more often or writes outside its track less often. The packet also cannot close while the generated index, the track roots, the changelogs and the parent maps still describe a planned state.

### Purpose
The closing report states the before and after per metric as a range, and the packet closes with every generated artifact and every status row reconciled to one observed state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three serial final runs of the frozen authoring task from `../001-template-drift-census-and-baseline/tasks.md` T009, with no word changed.
- The five metrics M1 to M5, measured by the same commands on both sides, with M2 extended to count v2.3 value tokens.
- A delta report with the minimum, the maximum and the mean of each metric per side, and an explicit statement that three runs cannot support a significance claim.
- One benchmark report folder that follows the run folder grammar and the ten-section report contract.
- A global changelog entry and two packet-local changelog files.
- One trigger index regeneration and one track root refresh.
- Reconciliation of the parent phase map, the parent goal log, the 041 phase map row and the completion metadata of this phase.
- One proof line per parent completion criterion, written before any parent goal box is ticked.
- One read-only frontier review of the closeout diff.

### Out of Scope
- Any template, validator, rule, command, agent or playbook edit. Phases 2 to 8 own those.
- Any change to the frozen task text, the four measured documents or the metric definitions. A change makes the delta meaningless.
- A significance claim. Three runs per side cannot support one.
- A commit or a push. Both stay with the operator.
- Fixing another phase folder. A child that fails strict validation is named and the closeout stops, because another phase owns its docs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/baseline/hints-v2.3.txt`, `anchors-v2.3.txt` | Create | Final token vocabulary and anchor counts |
| `scratch/baseline/runs.jsonl`, `baseline.json`, `delta.json`, `delta.md` | Create | Three runs and the before and after |
| `scratch/closeout/criteria.txt` | Create | Seven parent criteria, one PASS line each |
| `scratch/review/T016.txt` | Create | Frontier review reply |
| `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/README.md` | Create | Ten-section benchmark report |
| `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/results.csv` | Create | Six runs, one row each |
| `.skilled/skills/system-spec-kit/benchmark/reports/$DATE--model-eval--authoring-baseline/source.md` | Create | Evidence map back to this packet |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modify | One new run index row |
| `.skilled/changelog/system-spec-kit/v2.9.0.0.md` | Create | Global component changelog |
| `../changelog/changelog-054-root.md` | Create | Packet root changelog |
| `../changelog/changelog-054-009-authoring-benchmark-and-closeout.md` | Create | Phase changelog |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Version carrier becomes 2.9.0.0 |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Regenerated index |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | Modify | Regenerated sidecar |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | Modify | Regenerated sidecar |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | Modify | Regenerated sidecar |
| `specs/system-speckit/graph-metadata.json` | Modify | Track children refreshed by the tool |
| `../spec.md` | Modify | Nine phase map rows become Complete, Status becomes Complete |
| `../goal.md` | Modify | Launch preconditions, log rows, seven criteria ticked with evidence |
| `specs/system-speckit/041-write-recipe-fixes/spec.md` | Modify | One phase map row becomes Complete |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modify | Plan, progress and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scratch/baseline/hints-v2.3.txt` and `anchors-v2.3.txt` are built from a fresh Level 2 scaffold on the final tree with the extractors in `tasks.md` T004, and the throwaway track is deleted afterwards. |
| REQ-002 | Three final runs of the frozen task are recorded in `scratch/baseline/baseline.json`, each with its run number and all five metrics. |
| REQ-003 | M2 counts bare v2.2 hint occurrences plus v2.3 value token occurrences, the comparability rule is recorded as an ADR, and the final side uses the exact command in `tasks.md` T006. |
| REQ-004 | `scratch/baseline/delta.md` holds the minimum, the maximum and the mean of each of the five metrics for both sides, the delta per metric, and one sentence stating that three runs cannot support a significance claim. |
| REQ-005 | The report folder name follows `<YYYY-MM-DD>--<subject>--<variant>`, `README.md` holds the ten numbered ALL CAPS sections, `results.csv` holds six rows and `source.md` names this packet. The reports index gains one row. |
| REQ-006 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict` prints `RESULT: PASSED`. |
| REQ-007 | The global changelog entry and both packet-local changelog files exist, follow their templates and pass `validate_document.py`. |
| REQ-008 | The trigger index is regenerated, `--check` exits 0, and no path outside the four index artifacts changed in that step. |
| REQ-009 | The track root refresh ran with `--apply`, a second dry run prints `system-speckit: up to date` and exits 0, and `children_ids` equals the numbered folders on disk. |
| REQ-010 | `check-goal.cjs` passes on the parent and on all nine phase goals, the parent phase map holds nine `Complete` rows and no `Pending` row, and the 041 phase map row for `006-fix-write-recipe-move-destination` reads `Complete`. |
| REQ-011 | Each of the seven criteria in `../goal.md` section 3 has one PASS line in `scratch/closeout/criteria.txt` with the command and its output, and a parent box is ticked only after its PASS line exists. |
| REQ-012 | No file outside the declared scope differs from the phase start state, except the paths listed in section 3. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-013 | A read-only frontier review of the closeout diff ran, and each finding is either applied or recorded in `goal.md` section 4 with the reason it was not. |
| REQ-014 | `implementation-summary.md` ends with the operator handoff list: nothing is committed and nothing is pushed, and both stay with the operator. |
| REQ-015 | Completion metadata is reconciled across `spec.md`, `acceptance-criteria.md`, the continuity fields, `goal.md` and `implementation-summary.md`, so no document claims a different state. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The report answers "did the work help" with a minimum and a maximum per metric on both sides, and a reader can recompute every number from one command.
- **SC-002**: The operator can commit and push the whole packet without editing a generated artifact, a status row or a map first.
- **SC-003**: A later packet can rerun the same report by copying `tasks.md` T004 to T008 with a new date.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1 to 8 closed | There is no final tree to measure and no report from phase 8 | `tasks.md` T002 checks nine closeable statements and stops the phase when one is missing |
| Dependency | LLM Gateway provider for `llmgateway/deepseek-v4.1-flash-1017` | No final run can start | T001 checks `opencode.json` before the first dispatch and records the error when it fails |
| Dependency | Phase 8 playbook report | Parent criterion 6 cannot be proven | T015 names the missing report and leaves the criterion unticked |
| Risk | The three final runs vary so much that the delta is noise | The report overclaims | The report prints the range and states that three runs cannot support a significance claim |
| Risk | A final run writes outside its throwaway track | The tree is dirty and the next phase inherits it | M4 counts those writes and the conductor restores each path before the next run |
| Risk | The report folder name uses the authoring date | The index row misdates the run | T008 takes the date from `date +%F` at execution time and validates the name with the kebab checker |
| Risk | A phase 1 to 8 document fails recursive strict | The packet cannot close | T017 names the failing child and stops. This phase does not edit another phase folder |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each final run is one Task call. Three runs run serially. A run that fails is recorded and dispatched once more.

### Security
- **NFR-S01**: Every brief carries no credential, token or key. Workers inherit the session model and its provider login.

### Reliability
- **NFR-R01**: Every number in the report is produced by a command in `tasks.md`, so a second conductor on the same tree gets the same numbers from the same runs.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a final run that leaves a document empty still counts as a run. M2 and M3 record the result. The report does not drop the run.
- Maximum length: a metric value that is not an integer is written in `delta.md` to one decimal place and never rounded in `delta.json`.

### Error Scenarios
- External service failure: a provider refusal stops the dispatch. The conductor records the error, retries once after 10 minutes and then stops the phase with the failed run named.
- Network timeout: handled as in NFR-P01.
- Missing phase 8 report: T015 prints `C6 MISSING-008-REPORT`, the parent criterion stays unticked and the closeout stops.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: about 20 changed. Systems: benchmark, changelog, trigger index, track metadata, parent maps |
| Risk | 8/25 | Auth: N, API: N, Breaking: N. A wrong number would misstate the result |
| Research | 6/20 | The metric commands are copied from phase 1 and phase 3 |
| Multi-Agent | 8/15 | Workstreams: 3 final runs, 1 review |
| Coordination | 12/15 | Dependencies: phases 1 to 8 and the write-recipe child |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The final task text drifts from phase 1 | H | L | T005 copies the block from phase 1 and prints `TASK_FROZEN` from a `cmp` of the two extracts |
| R-002 | M2 counts one hint twice | H | L | The two patterns are disjoint, shown by the scratch test in `plan.md` ADR-001 |
| R-003 | The report invents a number | H | M | T008 writes the tables from `delta.json` with `jq`, never by hand |
| R-004 | The index regeneration also rewrites an unrelated file | M | L | T011 diffs the status of the four artifacts before and after |
| R-005 | A parent box is ticked without evidence | H | M | T015 writes the PASS lines first and T017 ticks only when all seven read `PASS` |

---

## 11. USER STORIES

### US-001: A number, not an impression (Priority: P0)

**As the** operator, **I want** the same authoring task measured before and after with a range per metric, **so that** I can tell whether the packet helped a weak model and by how much.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A packet that is ready to commit (Priority: P0)

**As the** operator, **I want** every generated artifact, changelog and status row already reconciled at close, **so that** my only remaining step is the commit and the push.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. Every choice it needs is frozen in `goal.md` section 1 and in the ADRs in `plan.md`.
- Where a phase 1 to 8 artifact named in `tasks.md` does not exist, the task records the exact missing path in `goal.md` section 4 and follows the blocked task protocol. It never invents a substitute.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---
