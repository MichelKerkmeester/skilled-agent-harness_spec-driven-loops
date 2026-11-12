---
title: "Tasks: Phase 10: sk-doc-tests-path-filter"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk doc tests path filter tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: sk-doc-tests-path-filter

<!-- SPECKIT_LEVEL: 1 -->

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

Run every command from the repository root with `T=.opencode/skills/sk-doc/scripts/tests` and `W=.github/workflows` set in the shell.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the 56-file baseline the current step runs (`$T/run-script-tests.sh`). The 53 `test_*.py` files plus the four `NODE_TESTS` names give 57 candidates, and `SKIP_TESTS` removes `test_rename_tooling_fixture_harness.py`. Verify: `printf 'py=%s node=%s\n' "$(ls -1 "$T"/test_*.py | wc -l | tr -d ' ')" "$(sed -n 's/^NODE_TESTS=(\(.*\))$/\1/p' "$T"/run-script-tests.sh | wc -w | tr -d ' ')"` prints `py=53 node=4`.
- [ ] T002 Confirm the walking pair passes with Python and PyYAML alone (`$T/test_readme_verdict_parity.py`). Verify: `ONLY_TESTS="test_readme_manifest.py test_readme_verdict_parity.py" bash "$T"/run-script-tests.sh` prints `PASS test_readme_manifest.py`, `PASS test_readme_verdict_parity.py`, then `all sk-doc script tests passed`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Narrow the always-on job to the two walking tests and rewrite its header comment (`$W/sk-doc-script-tests.yml`). Replace the step's `SKIP_TESTS` with `ONLY_TESTS: test_readme_manifest.py test_readme_verdict_parity.py`, and name the job and step for the repository walk. Verify: `printf 'only=%s skip=%s\n' "$(rg -c 'ONLY_TESTS: test_readme_manifest.py test_readme_verdict_parity.py' "$W"/sk-doc-script-tests.yml)" "$(rg -c 'SKIP_TESTS: test_rename' "$W"/sk-doc-script-tests.yml || echo 0)"` prints `only=1 skip=0`.
- [ ] T004 Drop the Node setup, the three package installs and pytest from the walking job, keeping the pinned PyYAML the verdict baseline needs (`$W/sk-doc-script-tests.yml`). Verify: `printf 'node=%s pkgs=%s pyyaml=%s\n' "$(rg -c 'name: Setup Node' "$W"/sk-doc-script-tests.yml)" "$(rg -c 'Install the packages the scripts load' "$W"/sk-doc-script-tests.yml || echo 0)" "$(rg -c 'pyyaml==6.0.3' "$W"/sk-doc-script-tests.yml)"` prints `node=1 pkgs=0 pyyaml=2`.
- [ ] T005 Create the path-filtered workflow for the other 54 files (`$W/sk-doc-script-tests-filtered.yml`). Trigger `pull_request` and `push` on `main` and `skilled/**`, filter both `.opencode/skills/sk-doc/**` and `.skilled/skills/sk-doc/**` plus the workflow file, use `SKILLED_CI_TESTS`, copy the five action pins, and set `SKIP_TESTS: test_rename_tooling_fixture_harness.py test_readme_manifest.py test_readme_verdict_parity.py`. Verify: `python3 -c 'import yaml,sys; yaml.safe_load(open(sys.argv[1])); print("YAML OK")' "$W"/sk-doc-script-tests-filtered.yml` prints `YAML OK`.
- [ ] T006 Document the new workflow, its trigger and its switch group (`$W/README.md`). Add the contents row, the path-filtered trigger row and the `SKILLED_CI_TESTS` row, and reword the `sk-doc-script-tests.yml` row to the two walking tests. Verify: `rg -c 'sk-doc-script-tests-filtered.yml' "$W"/README.md` prints 3.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Prove both workflow files parse (`$W/sk-doc-script-tests-filtered.yml`). Verify: `for f in "$W"/sk-doc-script-tests.yml "$W"/sk-doc-script-tests-filtered.yml; do python3 -c 'import yaml,sys; yaml.safe_load(open(sys.argv[1]))' "$f" || exit 1; done; echo '2 YAML FILES OK'` prints `2 YAML FILES OK`.
- [ ] T008 Prove the two jobs together run the same 56 files the single step ran before (`$W/sk-doc-script-tests-filtered.yml`). Verify: `c=$( { ( cd "$T" && ls -1 test_*.py ); sed -n 's/^NODE_TESTS=(\(.*\))$/\1/p' "$T"/run-script-tests.sh | tr ' ' '\n'; } | sed '/^$/d' ); before=$(printf '%s\n' "$c" | grep -vx test_rename_tooling_fixture_harness.py); walking=$(rg -o 'ONLY_TESTS: .*' "$W"/sk-doc-script-tests.yml | sed 's/^ONLY_TESTS: //' | tr ' ' '\n' | sed '/^$/d'); skip=$(rg -o 'SKIP_TESTS: .*' "$W"/sk-doc-script-tests-filtered.yml | sed 's/^SKIP_TESTS: //' | tr ' ' '\n' | sed '/^$/d'); after=$( { printf '%s\n' "$walking"; printf '%s\n' "$c" | grep -vxF -f <(printf '%s\n' "$skip"); } | sort -u ); diff <(printf '%s\n' "$before" | sort) <(printf '%s\n' "$after") && printf 'SAME %s FILES\n' "$(printf '%s\n' "$after" | wc -l | tr -d ' ')"` prints `SAME 56 FILES`.
- [ ] T009 Prove the new path filter passes the repository gate-input check (`$W/sk-doc-script-tests-filtered.yml`). Verify: `bash .github/scripts/check-gate-inputs.sh` prints `failures=0` and `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] T008 printed `SAME 56 FILES` and T009 printed `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../007-test-and-ci-bloat-research/research/research.md`, section 4 rank 3
<!-- /ANCHOR:cross-refs -->

---
