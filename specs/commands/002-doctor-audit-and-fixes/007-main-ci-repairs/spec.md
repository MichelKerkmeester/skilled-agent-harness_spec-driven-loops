---
title: "Feature Specification: Phase 7: main-ci-repairs"
description: "Three CI workflows failed on every push to main: 18 links still pointed at the create-goal packet's old number, the sk-doc README manifest missed three new folders, and one doctor scenario lacked the Prompt label the playbook contract requires."
trigger_phrases:
  - "main ci repairs"
  - "phase 7 main ci repairs"
  - "markdown link integrity create goal"
  - "readme manifest refresh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: main-ci-repairs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-02 |
| **Branch** | `worktrees/308-doctor-update-local-state` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-doctor-update-local-state |
| **Successor** | None |
| **Handoff Criteria** | The link guard, the sk-doc script tests and the playbook operator contract pass locally, and their workflows pass on main after the push |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the doctor audit and fixes packet.

**Scope Boundary**: the three failures that kept Markdown Link Integrity, sk-doc Script Tests and Playbook Operator Contract red on main. No validator or workflow changes.

**Dependencies**:
- The create-goal packet now lives at `specs/sk-doc/056-create-goal-mode/`, moved there by the specs renumber.

**Deliverables**:
- The two create-goal benchmark reports point at `056-create-goal-mode`.
- The durable-directory manifest lists the three folders added since it was frozen.
- DOC-406 carries a `Prompt:` line, and the root playbook names DOC-407 as the next free number.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three workflows failed on every push to main since 2026-11-01, so a real regression in any of them would have gone unnoticed. Each failure had one small cause left behind by other work: a packet renumber, three new folders and a plural label.

### Purpose
Main runs these three workflows green again.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
check-markdown-links: 7591 files, 14038 links checked, 18 broken
  .skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal/README.md  ](../../../../../../specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/scratch/playbook-run/SCG-001.md)
$ python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py
- frozen durable-directory manifest is not reproducible (added: .skilled/hooks/decision-capture/bin, .skilled/manual-testing-playbook/doctor-commands, .skilled/skills/.state/decision-capture; removed: none).
$ node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --no-strict --format json
REQUIRED_PROMPT doctor-commands/doctor-routing-helper-handoff.md: operator or orchestrator prompt is missing
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint the create-goal benchmark reports from `specs/sk-doc/060-create-goal-mode/` to `specs/sk-doc/056-create-goal-mode/`.
- Refresh the durable-directory manifest with its own `--write` mode.
- Add a `Prompt:` line to DOC-406 and move the root playbook's next free number to DOC-407.

### Out of Scope
- Old changelog entries that name `060-create-goal-mode` - they record history and the link guard does not scan them.
- The 12 playbook warnings - they were present before and do not fail the workflow.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal*/` (`README.md`, `failed-runs.md`, `source.md`, `results.csv`) | Modify | Packet path |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | Three new folders |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md` | Modify | `Prompt:` line |
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` | Modify | Next free DOC number |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No broken markdown link in skills, commands or agents | `check-markdown-links.cjs` prints `0 broken` and exits 0 |
| REQ-002 | The sk-doc script tests pass | `run-script-tests.sh` prints `all sk-doc script tests passed` and exits 0 |
| REQ-003 | The root playbook has no contract violation | `validate-playbook-package.cjs --strict` prints `PASS package=.skilled/manual-testing-playbook` with `violations=0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The three workflows pass on main after the push | `gh run list` shows success for each on the pushed commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Markdown Link Integrity, sk-doc Script Tests and Playbook Operator Contract conclude `success` on the pushed commit.
- **SC-002**: The root playbook keeps its 12 warnings and gains none.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The renumbered packet keeps every linked file | Links would still break | All 18 targets checked to exist under `056-create-goal-mode` |
| Risk | A manifest refresh hides a folder that should not exist | Low | The three added folders were each read and are real, committed folders |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
