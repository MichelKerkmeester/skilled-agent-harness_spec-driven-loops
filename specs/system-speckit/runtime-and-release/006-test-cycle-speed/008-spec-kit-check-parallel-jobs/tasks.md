---
title: "Tasks: Phase 8: spec-kit-check-parallel-jobs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "spec kit check parallel jobs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: spec-kit-check-parallel-jobs

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

**Paths**: Each task names its file in full, so no path variables are used. The only file this phase changes is `.github/workflows/spec-kit-check.yml`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the four step blocks that must survive the split (`.github/workflows/spec-kit-check.yml`). Verify: `rg -n '^      - name: (Install and build the spec-kit packages|CLI vitest project|Legacy module lanes and the bash validation suites|Runtime vitest project)$' .github/workflows/spec-kit-check.yml` prints four lines, one for each step.
- [x] T002 Confirm the unedited workflow lints clean (`.github/workflows/spec-kit-check.yml`). Verify: `actionlint .github/workflows/spec-kit-check.yml && echo actionlint-ok` prints `actionlint-ok`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `cli-vitest` job, name `CLI vitest project`, with the existing `if:` guard, `runs-on: ubuntu-latest`, `timeout-minutes: 51`, checkout, Setup Node, the install-and-build step, the ripgrep install and the unchanged CLI command (`.github/workflows/spec-kit-check.yml`). Verify: `rg -c '^  cli-vitest:$' .github/workflows/spec-kit-check.yml` prints `1`.
- [x] T004 Add the `legacy-lanes` job, name `Legacy module lanes and the bash validation suites`, with the existing `if:` guard, `runs-on: ubuntu-latest`, `timeout-minutes: 51`, checkout, Setup Node, the install-and-build step and the two unchanged lane commands (`.github/workflows/spec-kit-check.yml`). Verify: `rg -c '^  legacy-lanes:$' .github/workflows/spec-kit-check.yml` prints `1`.
- [x] T005 Add the `runtime-vitest` job, name `Runtime vitest project`, with the existing `if:` guard, `runs-on: ubuntu-latest`, `timeout-minutes: 51`, checkout, Setup Node, the install-and-build step and the unchanged root project command (`.github/workflows/spec-kit-check.yml`). Verify: `rg -c '^  runtime-vitest:$' .github/workflows/spec-kit-check.yml` prints `1`.
- [x] T006 Delete the three suite steps and the ripgrep step from `check`, leaving the gate, the typecheck and the shared tests (`.github/workflows/spec-kit-check.yml`). Verify: `ruby -ryaml -e 'y=YAML.load_file(ARGV[0]); puts y["jobs"]["check"]["steps"].map { |s| s["name"] || s["uses"] }.none? { |n| n.to_s.match?(/vitest|Legacy|ripgrep/) }' .github/workflows/spec-kit-check.yml` prints `true`.
- [x] T007 Confirm the edited workflow parses into six jobs (`.github/workflows/spec-kit-check.yml`). Verify: `ruby -ryaml -e 'y=YAML.load_file(ARGV[0]); puts y["jobs"].keys.sort.join(",")' .github/workflows/spec-kit-check.yml` prints `check,cli-vitest,doctor-scripts,legacy-lanes,mirrors,runtime-vitest`.
- [x] T008 Run the linter on the edited workflow (`.github/workflows/spec-kit-check.yml`). Verify: `actionlint .github/workflows/spec-kit-check.yml && echo actionlint-ok` prints `actionlint-ok`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm the four suite and lane commands appear once each (`.github/workflows/spec-kit-check.yml`). Verify: `rg -c -e 'npx vitest run --config ../../vitest.config.ts --project cli' -e 'npm --prefix .opencode/skills/system-spec-kit/runtime/cli run test:legacy' -e 'npm --prefix .opencode/skills/system-spec-kit/runtime/cli run test:validation' -e 'npx vitest run --config ../vitest.config.ts --project root' .github/workflows/spec-kit-check.yml` prints `4`.
- [x] T010 Confirm each suite job has one checkout, one install step and no `needs:` (`.github/workflows/spec-kit-check.yml`). Verify: `ruby -ryaml -e 'y=YAML.load_file(ARGV[0]); puts %w[cli-vitest legacy-lanes runtime-vitest].map { |j| s=y["jobs"][j]; [j, s["needs"].inspect, s["steps"].count { |x| x["uses"].to_s.include?("actions/checkout") }, s["steps"].count { |x| x["name"] == "Install and build the spec-kit packages" }].join(":") }' .github/workflows/spec-kit-check.yml` prints `cli-vitest:nil:1:1`, `legacy-lanes:nil:1:1` and `runtime-vitest:nil:1:1`.
- [x] T011 Confirm the triggers, the `check` steps, `mirrors` and `doctor-scripts` are unchanged (`.github/workflows/spec-kit-check.yml`). Verify: `ruby -ryaml -e 'y=YAML.load_file(ARGV[0]); t=y.keys.find { |k| k == true || k.to_s == "on" }; puts "push=#{y[t]["push"]["paths"].size} pr=#{y[t]["pull_request"]["paths"].size} checkouts=#{y["jobs"].values.sum { |j| j["steps"].count { |s| s["uses"].to_s.include?("actions/checkout") } }} check_steps=#{y["jobs"]["check"]["steps"].size} mirrors_steps=#{y["jobs"]["mirrors"]["steps"].size} doctor_steps=#{y["jobs"]["doctor-scripts"]["steps"].size}"' .github/workflows/spec-kit-check.yml` prints `push=24 pr=24 checkouts=6 check_steps=5 mirrors_steps=4 doctor_steps=5`.
- [x] T012 With the operator's written go-ahead, push `worktrees/350-test-ci-wait-cuts` and open a pull request to `main`, because the workflow's `push` trigger accepts only `main` and `skilled/**` while its `pull_request` trigger accepts this branch. Wait for the run to appear and complete, then read it (`.github/workflows/spec-kit-check.yml`). Verify: `id=$(gh run list --workflow=spec-kit-check.yml --branch worktrees/350-test-ci-wait-cuts --limit 1 --json databaseId --jq '.[0].databaseId'); gh run view "$id" --json jobs --jq '.jobs[] | select(.name | test("^(CLI vitest project|Legacy module lanes and the bash validation suites|Runtime vitest project)$")) | "\(.name): \(.conclusion) \((.completedAt|fromdateiso8601) - (.startedAt|fromdateiso8601)) s"' | tee /dev/stderr | rg -c '^(CLI vitest project|Legacy module lanes and the bash validation suites|Runtime vitest project): success [0-9]+ s$'` prints the three job lines and then `3`. Evidence: pull request 97, run 43232523671 on `48de2f42`: CLI vitest project 627 s, legacy lanes 191 s, runtime vitest 197 s, all success. The earlier runs gave 384 s and 499 s for the slowest job against the 867 s single-job baseline.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/008-spec-kit-check-parallel-jobs --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Timing baseline**: See `../007-test-and-ci-bloat-research/research/research.md` section 3
<!-- /ANCHOR:cross-refs -->

---
