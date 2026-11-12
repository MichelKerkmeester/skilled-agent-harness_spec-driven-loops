---
title: "Tasks: Phase 18: cli-vitest-shards"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli vitest shards tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 18: cli-vitest-shards

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

Commands run from the repository root unless the task's command starts with `cd`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the `cli` project's current file count from `VITEST_CONFIG` (`.skilled/skills/system-spec-kit/vitest.config.ts`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest list --config ../../vitest.config.ts --project cli --filesOnly | wc -l` prints `209`.
- [ ] T002 Confirm the installed vitest accepts `--shard` together with `--project` (`.skilled/skills/system-spec-kit/runtime/cli/package.json`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli --shard=1/3 --reporter=dot` exits 0 and prints `Test Files  69 passed | 1 skipped (70)` with no `failed`.
- [ ] T003 Confirm the four timeout lines that the sk-code-ci reference table cites (`.github/workflows/spec-kit-check.yml`). Verify: `rg -n '^    timeout-minutes: 51$' .github/workflows/spec-kit-check.yml` prints the lines `98`, `142`, `185` and `223`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `strategy: fail-fast: false` and `matrix: shard: [1, 2, 3]` to the `cli-vitest` job, after its `timeout-minutes: 51` line (`.github/workflows/spec-kit-check.yml`). Verify: `actionlint .github/workflows/spec-kit-check.yml` exits 0, `rg -n -F 'shard: [1, 2, 3]' .github/workflows/spec-kit-check.yml` prints one line at `146`, and `rg -c 'timeout-minutes: 51' .github/workflows/spec-kit-check.yml` prints `4`.
- [ ] T005 Append `--shard=${{ matrix.shard }}/3` to the job's vitest command and rewrite the two-line comment that says the project runs as one process (`.github/workflows/spec-kit-check.yml`). Verify: `rg -n -F -- '--shard=${{ matrix.shard }}/3' .github/workflows/spec-kit-check.yml` prints one line at `183`, and `rg -F 'runs as one process' .github/workflows/spec-kit-check.yml` exits 1 with no output.
- [ ] T006 Change the matrix count to three and move the `set -uo pipefail` citation from `:177` to `:181` in `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md`. Verify: `rg -n -F 'All three matrix workflows set it' .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` prints one line, and `rg -n -F 'spec-kit-check.yml:143' .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` plus `rg -n -F 'spec-kit-check.yml:181' .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` print one line each.
- [ ] T007 Mirror T006's text into `.opencode/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md`. Verify: `diff -q .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md .opencode/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` prints nothing and exits 0.
- [ ] T008 Move the `legacy-lanes` timeout citation from `:185` to `:189` and `runtime-vitest` from `:223` to `:227` in `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md`. Verify: `sed -n '56,59p' .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` prints the four `spec-kit-check.yml` rows ending in `:98`, `:142`, `:189` and `:227`.
- [ ] T009 Mirror T008's text into `.opencode/skills/sk-code/sk-code-ci/references/job-shape-rules.md`. Verify: `diff -q .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md .opencode/skills/sk-code/sk-code-ci/references/job-shape-rules.md` prints nothing and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the `cli` project three times, once per shard, against `.skilled/skills/system-spec-kit/vitest.config.ts`. Verify: from `.skilled/skills/system-spec-kit/runtime/cli`, the three `npx vitest run --config ../../vitest.config.ts --project cli --shard=N/3 --reporter=dot` runs print `Test Files  69 passed | 1 skipped (70)`, `Test Files  69 passed | 1 skipped (70)` and `Test Files  68 passed | 1 skipped (69)`, their collected counts 70, 70 and 69 sum to the `209` that `npx vitest list --config ../../vitest.config.ts --project cli --filesOnly | wc -l` prints, and no run prints `failed`.
- [ ] T011 Validate the packet's documents (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/018-cli-vitest-shards --strict --quiet` prints `RESULT: PASSED` as its first line.
- [ ] T012 Push the branch and confirm the matrix expanded (`.github/workflows/spec-kit-check.yml`). Verify: after the push, `gh run list --workflow spec-kit-check.yml --limit 1 --json databaseId --jq '.[0].databaseId'` prints the run id, `gh run view <run-id> --json jobs --jq '[.jobs[] | select(.name | startswith("CLI vitest project"))] | length'` prints `3`, and `gh run view <run-id> --json jobs --jq '[.jobs[] | select(.name | startswith("CLI vitest project")) | .conclusion] | unique'` prints `["success"]`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The pushed run reports three `CLI vitest project` jobs, all `success`, and their `Test Files` counts sum to 209
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../007-test-and-ci-bloat-research/research/research.md`, rank 1 and the CLI vitest step timing
- **Linted intended patch**: `scratch/spec-kit-check.sharded.yml`
<!-- /ANCHOR:cross-refs -->

---
