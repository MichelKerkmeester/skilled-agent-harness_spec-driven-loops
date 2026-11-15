---
title: "Tasks: Phase 20: vibe-dispatch-hardening"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe dispatch hardening tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: vibe-dispatch-hardening

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

`D` is `.skilled/hooks/dispatch/lib`. `V` is `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`. `W` is `.github/workflows/opencode-plugin-tests.yml`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the rule and audit suites as the baseline (`scratch/baseline.txt`). Verify: `node --test D/dispatch-rule-checks.test.mjs` prints `fail 0` and `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` reports every test passed, and the pass count is recorded.
- [x] T002 [P] Confirm phase 013's `isolated-vibe-home` fix is in (`D/dispatch-rule-checks.mjs`). Verify: `rg -n 'vibeWorkingDirectory' D/dispatch-rule-checks.mjs` shows a call inside the `isolated-vibe-home` check.
- [x] T003 [P] Record whether the repository's pre-commit hook runs any hook node:test suite (`scratch/pre-commit-tests.md`). Verify: the file names the hook script read and a yes or no with the line it rests on.
- [x] T004 Prepare the lineage posture options with evidence: the tools a research and a review iteration call, what `--enabled-tools`, `--add-dir` and `--agent` restrict, the guards a lineage already runs, and the spec-gate axis (`SYSTEM_SPEC_GATE_DISABLED=1` at `fanout-run.cjs:3891`) (`scratch/posture-options.md`). Verify: `rg -c '^### Option' scratch/posture-options.md` prints at least 2 and `rg -c 'SYSTEM_SPEC_GATE_DISABLED' scratch/posture-options.md` prints at least 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Ask the operator to choose a posture on both axes and append the decision and the approval to the parent's decision record (`../decision-record.md`). Verify: `rg -n 'Approved by the operator' ../decision-record.md` prints one more line than before.
- [x] T006 Add the `rendered-home-hooks` check that refuses a `vibe` dispatch unless the same command runs `render-home-hooks.cjs`, chained before the run, with a home argument textually equal to its `VIBE_HOME`, literal or variable (`D/dispatch-rule-checks.mjs`). Verify: `node --check D/dispatch-rule-checks.mjs` exits 0.
- [x] T007 Add the rule row with its message naming the one-line render step (`V/hard-rules.json`). Verify: `node -e 'console.log(require("./V/hard-rules.json").length)'` prints 7.
- [x] T008 Add three refuse cases (literal home with no render, `$RUN_DIR/.vibe-home` with the render removed, render naming a different home) and one accept case (the documented shape) for the new rule (`D/dispatch-rule-checks.test.mjs`). Verify: `node --test D/dispatch-rule-checks.test.mjs` prints `fail 0` and a pass count four above T001.
- [x] T009 If T005 tightened the posture, change the Vibe lineage flags (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: `rg -n "'--auto-approve'" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` matches the decision, present when kept and absent when replaced.
- [x] T010 [P] Add `.vibe/**` to both path filters and the repo-guards tests to the node:test collection (`W`). Verify: `rg -c '\.vibe/' W` prints at least 3.
- [x] T011 [P] Document the lineage's `SPECKIT_DIST_AUTO_REBUILD=0` and why (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`). Verify: `rg -n 'SPECKIT_DIST_AUTO_REBUILD' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints a Vibe lineage line.
- [x] T012 [P] Document the same switch in the lineage section (`V/references/cli-reference.md`). Verify: `rg -c 'SPECKIT_DIST_AUTO_REBUILD' V/references/cli-reference.md` prints at least 1.
- [x] T013 [P] Add a node:test suite for the agents mirror generator. Cases: collision detection, pruning, the reserved `main` stem, and a stray `.DS_Store`, mirroring the dsh suite with `VIBE_*_SOURCE_DIR` and `VIBE_*_OUTPUT_DIR` temp folders (`.skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-vibe.test.mjs`). Verify: `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-vibe.test.mjs` prints `fail 0`.
- [x] T014 [P] Add a node:test suite for the prompts mirror generator. Cases: collision detection, pruning, the reserved `main` stem, and a stray `.DS_Store`, mirroring the dsh suite with `VIBE_*_SOURCE_DIR` and `VIBE_*_OUTPUT_DIR` temp folders (`.skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-vibe.test.mjs`). Verify: `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-vibe.test.mjs` prints `fail 0`.
- [x] T015 [P] Extend the skills mirror generator suite that phase 013 creates with its `.DS_Store` case. Add cases for collision detection, pruning and the reserved `main` stem, mirroring the dsh suite with `VIBE_*_SOURCE_DIR` and `VIBE_*_OUTPUT_DIR` temp folders (`.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-vibe.test.mjs`). Verify: `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-vibe.test.mjs` prints `fail 0`.
- [x] T016 List the three Vibe sync-generator suites beside the dsh siblings (`.github/workflows/advisory-checks.yml`). Verify: `rg -c 'sync-.*-vibe.test.mjs' .github/workflows/advisory-checks.yml` prints 3.
- [x] T017 If T003 found the pre-commit hook runs hook node:test suites, add the Vibe hook suites to it; otherwise record why CI is the gate (`scratch/pre-commit-tests.md`). Verify: the file ends with either the added hook line quoted from the hook script or a one-line reason naming the hook script T003 read.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run the rule and audit suites (`D/`). Verify: `node --test D/dispatch-rule-checks.test.mjs` prints `fail 0` and `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` reports every test passed.
- [x] T019 Run the CI collection command from `W` locally with the widened roots (`scratch/ci-collection.txt`). Verify: the output lists every file `ls .vibe/plugins/repo-guards/tests/*.test.mjs` prints and `node --test .vibe/plugins/repo-guards/tests/*.test.mjs` prints `fail 0`.
- [x] T020 If T009 changed flags, run the deep-loop Vibe unit and stress cases (`.skilled/skills/system-deep-loop/runtime/tests/`). Verify: the Vibe cases print `fail 0`, or the task records "not applicable: posture kept".
- [x] T021 Validate this phase folder (`spec.md`). Verify: `validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the posture decision carries the operator's approval
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md` once T005 writes it
<!-- /ANCHOR:cross-refs -->

---
