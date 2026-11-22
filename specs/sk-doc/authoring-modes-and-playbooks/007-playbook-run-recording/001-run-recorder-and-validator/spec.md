---
title: "Feature Specification: Phase 1: run-recorder-and-validator"
description: "A playbook run left no saved verdicts unless someone wrote a report by hand, and the validator only warned when a root dropped the results rule. This phase adds the recorder, the runner hand-off and the validator enforcement."
trigger_phrases:
  - "run recorder and validator"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: run-recorder-and-validator

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/514-playbook-run-recording` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-playbook-marker-backfill |
| **Handoff Criteria** | The validator reports a missing results marker as an error, and the template's Result persistence block is final |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the playbook run recording program. It answers the operator's 2026-11-22 request that test output be saved in the benchmark folder automatically, and that the mode make this clear and enforce it.

**Scope Boundary**: the `sk-create-manual-testing-playbook` mode, meaning its scripts, their tests and fixtures, its `SKILL.md`, README, templates, conversation reference and changelog. The 11 other playbook roots belong to phase 2.

**Dependencies**:
- None. The runner, the validator and the results contract already exist.

**Deliverables**:
- `scripts/record-playbook-run.cjs` and its test file.
- The runner's `scenario.json` and its printed `save results:` command.
- The validator's marker error and its `--coverage` report.
- One results contract across the mode's docs, and changelog v1.2.0.0.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No script writes a run folder under `<skill>/benchmark/reports/`, so a playbook run saves its verdicts only when someone asks for a report and writes it by hand. The conversation runner keeps its verdicts in a scratch folder outside the repository. The validator reports a root that drops the results marker as a warning, 11 times across the fleet, and the mode's docs disagree on whether reports are written by hand.

### Purpose
A run's verdicts reach the skill's benchmark folder through one checked command, and a root that drops the results rule fails validation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs > v.txt; echo "exit=$?"; grep -c RESULT_PERSISTENCE_MARKER_MISSING v.txt
exit=0
11
$ ls .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/
run-conversation-scenario.cjs
tests
validate-playbook-package.cjs
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a recorder that checks verdicts against the playbook and writes the run folder and its index row.
- Make the conversation runner name its scenario and print the recorder command.
- Make a missing results marker a validator error, and add an opt-in coverage report.
- Rewrite the results contract in `SKILL.md`, the README, the templates and the conversation reference.
- Refresh the README audit manifest, whose staleness fails CI's sk-doc script tests.

### Out of Scope
- The 11 roots without the marker - phase 2 owns them.
- A default coverage failure - most playbooks are partly run, and the request was for saved output.
- Converting existing hand-written reports - they stay as written and show up in coverage as runs without `results.csv`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/record-playbook-run.cjs` | Create | The recorder |
| `scripts/tests/record-playbook-run.test.cjs` | Create | Recorder tests |
| `scripts/validate-playbook-package.cjs` and its test | Modify | Marker error, `--coverage` |
| `scripts/run-conversation-scenario.cjs` and its test | Modify | `scenario.json` and the printed command |
| `scripts/tests/fixtures/*/manual-testing-playbook.md` | Modify | The fixtures model conforming roots |
| `SKILL.md`, `README.md`, `references/conversation-scenarios.md`, `assets/*template.md` | Modify | One results contract |
| `manual-testing-playbook/{manual-testing-playbook.md,operator-contract/persist-scenario-result.md}` | Modify | MTP-005 tests the recorder instead of the retired wrapper |
| `changelog/v1.2.0.0.md` | Create | The release entry |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | Regenerated README audit manifest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `record-playbook-run.cjs` writes `results.csv`, `README.md` and `source.md` into `<skill>/benchmark/reports/<date>--<label>/` and puts the run first in the index |
| REQ-002 | The recorder refuses, writing nothing, on an unknown scenario id, a `FAIL` or `SKIP` without a reason and an existing run folder |
| REQ-003 | `validate-playbook-package.cjs` reports `RESULT_PERSISTENCE_MARKER_MISSING` as a violation that fails an operator package |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The runner writes `scenario.json` and prints a recorder command that records its `--out` folder without `--playbook` |
| REQ-005 | `--coverage` reports recorded and unrecorded ids per package and never changes the exit code |
| REQ-006 | No doc in the mode says reports are written by hand or are renderer-owned |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node scripts/tests/record-playbook-run.test.cjs` prints three PASS lines and exits 0.
- **SC-002**: A root without the marker makes `validate-playbook-package.cjs` exit 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The README audit manifest freezes durable directories | Every new run folder fails the audit test until refreshed | The recorder prints the refresh command after each write |
| Risk | The marker error fails 11 roots | High until phase 2 lands | Phase 2 lands in the same branch before any merge |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The recorder runs once per run and reads one playbook.
- **NFR-P02**: N/A. No service runs.

### Security
- **NFR-S01**: The recorder writes only under the playbook's sibling `benchmark/reports/` folder.
- **NFR-S02**: N/A. No credential or network surface.

### Reliability
- **NFR-R01**: A refused record leaves the filesystem unchanged.
- **NFR-R02**: A prior run folder is never overwritten.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a CSV with only a header is refused with "no verdict records to save".
- Maximum input: a CSV field holding commas or quotes round-trips as one field.
- Failure path: an index without a `| Executed | Folder |` table is refused before anything is written.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new script, two changed scripts, tests and docs in one mode |
| Risk | 8/25 | The marker error is a stricter shared contract |
| Research | 6/20 | Runner output shape, index formats and the README audit |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
