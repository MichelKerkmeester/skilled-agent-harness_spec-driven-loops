---
title: "Tasks: Retire three low-value reply rules and fold their unique clauses into the surviving rules"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "reply rule pruning tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Retire three low-value reply rules and fold their unique clauses into the surviving rules

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the corpus baseline (`.skilled/repo-rules/`). Verify: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` printed `files=13` and `RESULT: PASSED (11/11 checks)` before any edit.
- [x] T002 Capture the script test baseline (`.skilled/skills/sk-doc/scripts/tests/`). Verify: `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py .skilled/skills/sk-doc/scripts/tests/test_rule_experiment.py -q` printed `20 passed` before any edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Merge the sentence, punctuation, decision and long-stretch clauses into the reply rule (`.skilled/repo-rules/communication.md`). Verify: `rg -c 'No semicolon|Recommend one path|A synthesis is not a file path' .skilled/repo-rules/communication.md` prints 3.
- [x] T004 Add the invented-constraint and honest-decline clause (`.skilled/repo-rules/uncertainty-and-honesty.md`). Verify: `rg -c 'you cannot point to' .skilled/repo-rules/uncertainty-and-honesty.md` prints 1.
- [x] T005 Remove the three pointers from Gate 6 (`AGENTS.md`). Verify: `rg -c 'communication-prose|communication-decisions|answer-the-actual-request' AGENTS.md` prints nothing and exits 1.
- [x] T006 Remove three index rows and three trigger rows and widen the two rows that take their conditions (`REPO RULES.md`). Verify: `rg -c 'communication-prose|communication-decisions|answer-the-actual-request' "REPO RULES.md"` prints nothing and exits 1.
- [x] T007 Repoint the two section links (`.skilled/repo-rules/communication-handoff.md`). Verify: `rg -c 'communication-decisions' .skilled/repo-rules/communication-handoff.md` prints nothing and exits 1.
- [x] T008 Delete the three retired files (`.skilled/repo-rules/`). Verify: `ls .skilled/repo-rules | wc -l` prints 10.
- [x] T009 Key the reply rule set and the punctuation checks to the merged rule (`.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py`). Verify: `rg -c 'communication-prose' .skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py` prints nothing and exits 1.
- [x] T010 Key the reply rule set to the merged rule (`.skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py`). Verify: `rg -c 'communication-prose' .skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py` prints nothing and exits 1.
- [x] T011 Drop the retired rule from the fixtures (`.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py`). Verify: `rg -c 'communication-prose' .skilled/skills/sk-doc/scripts/tests/` prints nothing and exits 1.
- [x] T012 Regenerate the shipped manifest (`.skilled/commands/doctor/assets/agents-md-manifest.json`). Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` prints `PASS: 44 sections`.
- [x] T013 Update the rule counts and the merged guard row (`README.md`). Verify: `rg -c 'the 10 rule files' README.md` prints 1.
- [x] T017 Remove the three rows for retired rules from the card arm (`specs/agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing/008-gate5-card-pilot/experiment/arms.json`). Verify: `python3 .skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py build --arms <that file> --out <temp>` prints `built full` and `built cards`.
- [x] T018 Make the current arm rebuild the long wording, since the short wording is live (`specs/agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing/007-table-wording-experiment/experiment/arms.json`). Verify: the same build command on that file prints `built current` and `built short`, and `diff -r -x .git` on the two templates prints the one hunk `82,86c82,84`.
- [x] T019 Rewrite the expected output of the build scenario from a real run (`.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-loading-experiments/experiment-environment-build.md`). Verify: `rg -c 'check 2' .skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-loading-experiments/experiment-environment-build.md` prints 1.
- [x] T020 Restore the reader-triage sentence (`.skilled/repo-rules/communication.md`). Verify: `rg -c 'Decide who will read this' .skilled/repo-rules/communication.md` prints 1.
- [x] T021 Fold the retirement into the open sections of the release entry (`.skilled/changelog/skilled/v4.0.2.1.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `pass=1 fail=0`.
- [x] T022 Write the packet's changelog entry and raise its version (`.skilled/skills/sk-doc/sk-create-repo-rule/changelog/v1.1.8.0.md`). Verify: the same shape check on that file prints `pass=1 fail=0`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `all hard invariants passed`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rerun the corpus gate from the final state (`.skilled/repo-rules/`). Verify: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `files=10 triggerRows=10 indexRows=10` and `RESULT: PASSED (11/11 checks)`.
- [x] T015 Rerun the script suites (`.skilled/skills/sk-doc/scripts/tests/`). Verify: the T002 command prints `20 passed`.
- [x] T016 Rerun the doctor suites (`.skilled/commands/doctor/scripts/tests/`). Verify: `node --test` on the four `agents-md` test files prints `fail 0` for each.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
