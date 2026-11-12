---
title: "Implementation Plan: Phase 10: sk-doc-tests-path-filter"
description: "Split the sk-doc script-test step into an always-on job for the two repository-walking tests and a path-filtered workflow for the other 54 files, using the runner's existing ONLY_TESTS and SKIP_TESTS switches, and prove the union is still the same 56 test files."
trigger_phrases:
  - "sk doc tests path filter plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: sk-doc-tests-path-filter

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML and Bash |
| **Framework** | GitHub Actions |
| **Storage** | None |
| **Testing** | The sk-doc script runner (`run-script-tests.sh`), Python 3 with PyYAML 6.0.3, Node 22 |

### Overview
Change two workflow files and one README row. The existing always-on workflow keeps its script-test job but runs only `test_readme_manifest.py` and `test_readme_verdict_parity.py`; a new path-filtered workflow runs the other 50 Python files and four Node tests. The runner's existing `ONLY_TESTS` and `SKIP_TESTS` switches select both sets, so no test file changes. Prove it with a YAML parse, a before-and-after set comparison, and the repository gate-input check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both workflow files parse: the loop in T007 prints `2 YAML FILES OK`
- [ ] The union proof in T008 prints `SAME 56 FILES`
- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`; the pre-change baseline on 2026-11-12 was `files=45 inputs_resolved=274 dynamic_inputs=35 twin_pairs=371 failures=0`
- [ ] Docs updated (spec/plan/tasks and `.github/workflows/README.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-trigger job split.

### Key Components
- **`.github/workflows/sk-doc-script-tests.yml`**: keeps four jobs and no `paths:` filter. Its first job runs `ONLY_TESTS: test_readme_manifest.py test_readme_verdict_parity.py`; the `catalog-packages`, `render-gate` and `citation-drift` jobs keep their current triggers and steps.
- **`.github/workflows/sk-doc-script-tests-filtered.yml`**: new. Filters pull requests and pushes on `.opencode/skills/sk-doc/**`, `.skilled/skills/sk-doc/**` and its own file, then runs the runner with `SKIP_TESTS: test_rename_tooling_fixture_harness.py test_readme_manifest.py test_readme_verdict_parity.py`.
- **`.opencode/skills/sk-doc/scripts/tests/run-script-tests.sh`**: unchanged. It globs `test_*.py`, adds the four names in `NODE_TESTS`, and subtracts `SKIP_TESTS`; `ONLY_TESTS`, when set, keeps just the named files.
- **`.github/workflows/README.md`**: records the new file in the contents table, the path-filtered trigger row and the `SKILLED_CI_TESTS` row, and rewords the existing `sk-doc-script-tests.yml` row to the two walking tests.

### Data Flow
A push or pull request reaches GitHub, which evaluates each workflow's trigger. The existing workflow has no path filter, so its walking job starts, installs Python and PyYAML, and runs two files. The new workflow's filter matches only when an sk-doc path changed; its job installs Python, Node and the three packages, then runs the same runner with the three-name skip list. The runner prints one `PASS` or `FAIL` line per file, so each job's log names every file it ran.

**Regression accepted**: the 54 filtered tests stop catching a break introduced by a change outside the named sk-doc paths, such as a broken `@spec-kit/shared` build or a deep-loop script the root-name matrix loads. That break waits for the next push that touches an sk-doc path. The two walking tests stop catching nothing, because they still run on every push.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the 56-file baseline and confirms the walking pair passes on Python and PyYAML alone. Implementation narrows `.github/workflows/sk-doc-script-tests.yml` to the two walking tests, creates `.github/workflows/sk-doc-script-tests-filtered.yml` for the other 54, and documents both in `.github/workflows/README.md`. Verification parses both YAML files, proves the union equals the 56-file list recorded before the split, and runs `check-gate-inputs.sh`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run every command from the repository root.

1. Parse both files: `for f in .github/workflows/sk-doc-script-tests.yml .github/workflows/sk-doc-script-tests-filtered.yml; do python3 -c 'import yaml,sys; yaml.safe_load(open(sys.argv[1]))' "$f" || exit 1; done; echo '2 YAML FILES OK'` prints `2 YAML FILES OK`.
2. Compare the lists: T008's command builds the before set from the test directory (57 candidates minus the rename harness) and the after set from the walking job's `ONLY_TESTS` plus the filtered job's candidates minus `SKIP_TESTS`, then prints `SAME 56 FILES`.
3. Check the path filter's twins: `bash .github/scripts/check-gate-inputs.sh` prints `failures=0` and `RESULT: PASSED`.
4. Run the walking pair locally: `ONLY_TESTS="test_readme_manifest.py test_readme_verdict_parity.py" bash .opencode/skills/sk-doc/scripts/tests/run-script-tests.sh` printed `PASS test_readme_manifest.py`, `PASS test_readme_verdict_parity.py` and `all sk-doc script tests passed`. `/usr/bin/time -p` reported `real 68.11` on this worktree on 2026-11-12. The baseline holds 1,144 tracked READMEs and the durable manifest holds 924 directories, read from `code-folder/baseline-readme-verdicts.json` and `code-folder/durable-directory-manifest.json`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Python 3 with PyYAML 6.0.3 for the walking job; Python 3, Node 22 and the three `npm ci` trees for the filtered job. The five action pins are copied from the existing workflow (`actions/checkout` v7.0.1, `actions/setup-python` v7.1.0, `actions/setup-node` v7.1.0, each by commit SHA). No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: T008 prints anything but `SAME 56 FILES`, or a walking test fails in CI after the split. Revert the commit that changes the two workflow files and `.github/workflows/README.md`; the revert removes the new workflow file and restores the single script-test step. No state, cache or test data needs undoing.
<!-- /ANCHOR:rollback -->

---
