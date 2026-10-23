---
title: "Feature Specification: Phase 1: template-drift-census-and-baseline"
description: "Build a verified ledger of every defect and drift in the system-spec-kit templates, examples and authoring docs, and record how well DeepSeek V4.1 Flash authors a packet before anything changes."
trigger_phrases:
  - "template drift census and baseline"
  - "phase 1 template drift census and baseline"
  - "spec kit defect ledger"
  - "weak model authoring baseline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: template-drift-census-and-baseline

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

This phase changes no system-spec-kit file. It produces two things every later phase depends on: a ledger with one row per defect, each row carrying the exact replacement text and a command that reproduces the defect, and a baseline of how a DeepSeek V4.1 Flash worker authors a Level 2 packet today. Phases 2 to 7 fix ledger rows. Phase 9 reruns the baseline and reports the change.

**Key Decisions**: three read-only census lanes split by directory, and three baseline runs of one fixed authoring task.

**Critical Dependencies**: the launch preconditions in `../spec.md` section 3: a build worktree, provider login and the three-lane authorization.

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
| **Phase** | 1 of 9 |
| **Predecessor** | None |
| **Successor** | 002-template-and-example-defect-repair |
| **Handoff Criteria** | `scratch/ledger/ledger.jsonl` exists, every row reproduces, and `scratch/baseline/baseline.md` holds three runs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: Read-only on `.skilled/skills/system-spec-kit/`. Writes land only inside this phase folder, plus the throwaway tracks `specs/zz-bench-authoring/` and `specs/zz-bench-hints/`, which this phase creates and deletes.

**Dependencies**:
- The launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.

**Deliverables**:
- `scratch/ledger/ledger.jsonl`: the merged, verified defect ledger.
- `scratch/ledger/coverage.txt`: the files each lane read, against that lane's file count.
- `scratch/baseline/hints-v2.2.txt`: every placeholder hint string a fresh Level 2 scaffold contains.
- `scratch/baseline/anchors-v2.2.txt`: the anchor count in each of the four scaffold docs.
- `scratch/baseline/runs.jsonl`: one JSON line per baseline run, the source of `baseline.json`.
- `scratch/baseline/baseline.md` and `scratch/baseline/baseline.json`: three baseline runs, each with its run number and the five metrics.
- `scratch/review/T011.txt`: the frontier review reply, one line per finding or `NO FINDINGS`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five template and doc defects are confirmed, but they came from a spot check, not a census, so the full list is unknown. Without a full list the repair phases would fix what someone happened to notice. Without a before-number, phase 9 cannot say whether the work helped a weak model at all.

### Purpose
Every later phase works from one verified ledger, and phase 9 compares against measured numbers instead of an impression.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three read-only census lanes over the system-spec-kit templates, examples, template references, workflow references and `SKILL.md` router.
- A merged ledger in the frozen schema of `plan.md` section 3, with every row re-run by the conductor.
- The five confirmed defects present as ledger rows.
- Three baseline runs of the fixed authoring task in `tasks.md` T009.
- One read-only frontier review of the ledger before the phase closes.

### Out of Scope
- Fixing any defect. Phases 2 to 7 own the fixes, and the `owner_phase` field routes each row.
- Editing any file under `.skilled/`. This phase is read-only there.
- Measuring models other than DeepSeek V4.1 Flash max. The question is about that model.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/ledger/lane-a.jsonl`, `lane-b.jsonl`, `lane-c.jsonl` | Create | One file per census lane |
| `scratch/ledger/lane-*.read.txt`, `lane-*.all.txt`, `lane-*.missing.txt` | Create | Files each lane opened, the lane file lists and the unread paths |
| `scratch/ledger/candidates.jsonl`, `dropped.jsonl`, `unsafe.jsonl` | Create | Merge input, dropped rows and quarantined commands |
| `scratch/ledger/ledger.jsonl` | Create | Merged rows that reproduced |
| `scratch/ledger/coverage.txt` | Create | Files read per lane |
| `scratch/baseline/hints-v2.2.txt`, `anchors-v2.2.txt` | Create | Hint strings and anchor counts from a fresh scaffold |
| `scratch/baseline/runs.jsonl`, `baseline.json`, `baseline.md` | Create | Three runs, the run number and five metrics |
| `scratch/baseline/status-before-*.txt`, `status-after-*.txt` | Create | Tree state before and after each run |
| `scratch/baseline/status-start.txt`, `suite-start.txt` | Create | Tree state and suite result at the start commit |
| `scratch/runs/T009-*.txt`, `T009-*.t0`, `T009-*.t1`, `scratch/review/T011.txt` | Create | Worker replies, dispatch times and the frontier review |
| `scratch/briefs/*.txt` | Create | Every brief this phase dispatched |
| `tasks.md`, `goal.md`, `implementation-summary.md`, `acceptance-criteria.md` | Modify | Progress and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scratch/ledger/ledger.jsonl` exists, every line parses as JSON, and every line has the ten fields of the frozen schema in `plan.md` section 3. |
| REQ-002 | For every ledger row, running its `evidence_cmd` prints its `evidence_expect` on the unchanged tree. |
| REQ-003 | The ledger holds a row for each of the five confirmed defects listed in `plan.md` section 3. |
| REQ-004 | `scratch/baseline/baseline.json` holds three runs, each with a run number and all five metrics. |
| REQ-005 | No file outside this phase folder differs from the phase start commit when the phase closes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A frontier review of the ledger ran, and each finding it raised is either applied to the ledger or recorded in `goal.md` section 4 with the reason it was not. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A conductor in phase 2 can turn any ledger row into a worker brief without asking anyone a question.
- **SC-002**: Phase 9 can compute a delta for each of the five baseline metrics.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway provider for `llmgateway/deepseek-v4.1-flash-1017` | No lane or baseline run can start | The conductor runs the provider pre-flight in `plan.md` before the first dispatch and stops with a recorded blocker when it fails |
| Dependency | Build worktree can run `validate.sh` | Baseline metric M1 cannot be measured | `tasks.md` T002 proves it on an existing packet first |
| Risk | A lane worker invents a defect | False rows reach phase 2 | The conductor keeps only rows whose evidence command reproduces, and the frontier review reads the rest |
| Risk | A baseline run writes outside its throwaway track | The tree is dirty for phase 2 | Metric M4 counts those writes, and the conductor restores from the start commit before the next run |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each census lane is one worker dispatch. A lane that has not returned in 30 minutes is cancelled and dispatched once more.

### Security
- **NFR-S01**: Briefs carry no credential, token or key. Workers inherit provider login from the conductor's session only.

### Reliability
- **NFR-R01**: Every metric is computed by a command in `tasks.md`, so a second conductor running the same commands on the same runs gets the same numbers.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a lane that finds no defect writes an empty JSONL file, and the conductor records "0 rows" for it rather than re-dispatching.
- Maximum length: a row whose `expected_text` would exceed 2,000 characters is split into one row per paragraph.

### Error Scenarios
- External service failure: a provider error such as a billing or region refusal stops the dispatch. The conductor records it and retries once after 10 minutes, then stops the phase.
- Network timeout: handled as in NFR-P01.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: about 70 read, 0 changed outside this folder. Systems: templates, references, router |
| Risk | 6/25 | Auth: N, API: N, Breaking: N |
| Research | 14/20 | Full census of three directories plus a model baseline |
| Multi-Agent | 12/15 | Workstreams: 3 census lanes, 3 baseline runs, 1 review |
| Coordination | 8/15 | Dependencies: launch preconditions only |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Lane worker reports a defect that is not there | M | H | Reproduce-or-drop rule in `tasks.md` T006 |
| R-002 | Lane worker misses a defect class | M | M | Each lane brief lists the detection command for every class, and the frontier review reads the files again |
| R-003 | Baseline runs vary so much that a delta is noise | M | M | Three runs per side, and phase 9 reports the range, not only the mean |

---

## 11. USER STORIES

### US-001: One row is one brief (Priority: P0)

**As a** phase 2 conductor, **I want** every defect as a row with its exact current text and its exact replacement, **so that** I can dispatch it as one worker brief with no judgment of my own.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A before-number (Priority: P0)

**As the** operator, **I want** the authoring quality of DeepSeek V4.1 Flash measured before any template changes, **so that** the phase 9 result shows what the work changed.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. Every choice it needs is frozen in `goal.md` section 1.
- A ledger row that a later phase cannot fix inside its frozen scope is recorded in that phase's goal log and raised to the operator, not absorbed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---


