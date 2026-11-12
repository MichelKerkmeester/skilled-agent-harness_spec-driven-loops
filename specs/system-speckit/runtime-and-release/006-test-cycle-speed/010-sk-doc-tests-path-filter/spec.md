---
title: "Feature Specification: Phase 10: sk-doc-tests-path-filter"
description: "The sk-doc script-test step runs on every push because two of its tests walk the whole repository, so an ordinary push waits on all 56 test files it runs. This phase keeps the two repository-walking tests on every push and runs the other 54 only when an sk-doc path changes, without dropping a test file."
trigger_phrases:
  - "sk doc tests path filter"
  - "phase 10 sk doc tests path filter"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: sk-doc-tests-path-filter

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 17 |
| **Predecessor** | 009-legacy-lane-overlap-measurement |
| **Successor** | 011-sparse-checkout-rollout |
| **Handoff Criteria** | Both workflows parse, `check-gate-inputs.sh` prints `RESULT: PASSED`, and the two jobs together print `SAME 56 FILES` against the list recorded before the split. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: The sk-doc script-test jobs only. The `catalog-packages`, `render-gate` and `citation-drift` jobs in `.github/workflows/sk-doc-script-tests.yml` keep their current every-push triggers, and no test file or runner script changes.

**Dependencies**:
- Phase 7 research, rank 3, which recorded the 182 s script-test step and found no path filter on the workflow.
- The `ONLY_TESTS` and `SKIP_TESTS` switches already in `.opencode/skills/sk-doc/scripts/tests/run-script-tests.sh`.

**Deliverables**:
- An every-push job that runs `test_readme_manifest.py` and `test_readme_verdict_parity.py`.
- A path-filtered workflow that runs the other 54 sk-doc script-test files.
- A workflow README row that names the new file, its trigger and its switch group.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.github/workflows/sk-doc-script-tests.yml` has no `paths:` filter, so its script-test step runs on every push. Phase 7 recorded that step at 182 s, and the measured block below shows it runs 56 test files. Only two of them walk the whole repository: the durable-directory manifest (`test_readme_manifest.py`) and the README verdict baseline (`test_readme_verdict_parity.py`). The other 54 do not need to run when no sk-doc path changes, yet on a push that touches no sk-doc path this workflow is the slowest one and therefore sets the wait.

### Purpose
Keep the two repository-walking tests on every push and run the other 54 only when an sk-doc path changes, so a push that does not touch sk-doc no longer waits on the full sk-doc script suite.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ T=.opencode/skills/sk-doc/scripts/tests; W=.github/workflows; c=$( { ( cd "$T" && ls -1 test_*.py ); sed -n 's/^NODE_TESTS=(\(.*\))$/\1/p' "$T"/run-script-tests.sh | tr ' ' '\n'; } | sed '/^$/d' ); s=$(rg -o 'SKIP_TESTS: .*' "$W"/sk-doc-script-tests.yml | sed 's/^SKIP_TESTS: //' | tr ' ' '\n' | sed '/^$/d'); printf 'py=%s node=%s candidate=%s skipped=%s run=%s jobs=%s paths=%s\n' "$(printf '%s\n' "$c" | grep -c '^test_.*\.py$')" "$(printf '%s\n' "$c" | grep -vc '^test_.*\.py$')" "$(printf '%s\n' "$c" | wc -l | tr -d ' ')" "$(printf '%s\n' "$s" | wc -l | tr -d ' ')" "$(printf '%s\n' "$c" | grep -vxF -f <(printf '%s\n' "$s") | wc -l | tr -d ' ')" "$(rg -c '^  (sk-doc-scripts|catalog-packages|render-gate|citation-drift):$' "$W"/sk-doc-script-tests.yml)" "$(rg -c '^\s+paths:' "$W"/sk-doc-script-tests.yml || echo 0)"
py=53 node=4 candidate=57 skipped=1 run=56 jobs=4 paths=0
```

The single step runs 56 files: 53 `test_*.py` files and four `NODE_TESTS` names make 57 candidates, and `SKIP_TESTS` removes `test_rename_tooling_fixture_harness.py`, which runs in `sk-doc-rename-harness.yml`. The workflow holds four jobs and has no `paths:` key.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the two repository-walking tests in `.github/workflows/sk-doc-script-tests.yml`, in a job with no path filter.
- Create `.github/workflows/sk-doc-script-tests-filtered.yml` to run the other 54 files when an sk-doc path changes.
- Remove the Node setup, the three package installs and pytest from the walking job, keeping the pinned PyYAML the verdict baseline needs.
- Document the new workflow, its trigger and its `SKILLED_CI_TESTS` switch in `.github/workflows/README.md`.

### Out of Scope
- Any test file or `run-script-tests.sh` change - its `ONLY_TESTS` and `SKIP_TESTS` switches already select both sets.
- The `catalog-packages`, `render-gate` and `citation-drift` jobs - they guard the whole tree and the phase finding does not ask for them.
- The rename harness - it already runs only when sk-doc script paths change in `sk-doc-rename-harness.yml`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/sk-doc-script-tests.yml` | Modify | Narrow the first job to the two walking tests and drop its unused Node and package installs |
| `.github/workflows/sk-doc-script-tests-filtered.yml` | Create | Run the other 54 script-test files behind an sk-doc path filter |
| `.github/workflows/README.md` | Modify | Add the new workflow row, trigger row and `SKILLED_CI_TESTS` row, and reword the existing row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The two repository-walking tests run on every push in a job with no path filter | `rg -c 'ONLY_TESTS: test_readme_manifest.py test_readme_verdict_parity.py' .github/workflows/sk-doc-script-tests.yml` prints 1, and `rg -c '^\s+paths:' .github/workflows/sk-doc-script-tests.yml \|\| echo 0` prints 0 |
| REQ-002 | The other 54 script-test files run only when an sk-doc path changes | `.github/workflows/sk-doc-script-tests-filtered.yml` filters both `.opencode/skills/sk-doc/**` and `.skilled/skills/sk-doc/**`, and its `SKIP_TESTS` names `test_rename_tooling_fixture_harness.py`, `test_readme_manifest.py` and `test_readme_verdict_parity.py` |
| REQ-003 | No test file is dropped by the split | The set comparison prints `SAME 56 FILES` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The workflow README documents the new file, its trigger and its switch | `rg -c 'sk-doc-script-tests-filtered.yml' .github/workflows/README.md` prints 3 |
| REQ-005 | The new path filter passes the repository gate-input check | `bash .github/scripts/check-gate-inputs.sh` prints `failures=0` and `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A push that touches no sk-doc path runs the two walking tests and starts no filtered sk-doc script test.
- **SC-002**: The set comparison prints `SAME 56 FILES`, so every file the single step ran is still run by one of the two jobs.
- **SC-003**: Both workflow files parse as YAML and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | PyYAML 6.0.3 in the walking job | Without it `validate_document.py` falls back to its lenient parser and the README verdict baseline can differ | Keep the pinned `pyyaml==6.0.3` install; T002 runs the pair before the split |
| Risk | A filtered test breaks from a change outside sk-doc paths | Medium - the break lands unnoticed until the next push that touches an sk-doc path | The filter names both whole sk-doc trees; the two walking tests still run on every push; `plan.md` section 3 records the accepted regression |
| Risk | A path-filter typo stops the filtered job from running | High if silent, because 54 files stop running | `check-gate-inputs.sh` requires both source roots, and T008 proves the 56-file union |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the filtered workflow also trigger on the spec-kit and deep-loop packages its tests load at install time? Decision: no in this phase. The filter names the whole sk-doc tree, and a break in a loaded package waits for the next sk-doc change; `plan.md` records that as the regression this change accepts.
<!-- /ANCHOR:questions -->

---
