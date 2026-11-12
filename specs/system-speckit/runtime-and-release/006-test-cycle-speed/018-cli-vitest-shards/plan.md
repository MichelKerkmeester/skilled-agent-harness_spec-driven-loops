---
title: "Implementation Plan: Phase 18: cli-vitest-shards"
description: "Split the cli-vitest job in spec-kit-check.yml into a three-entry shard matrix, append the matching vitest flag, keep the 51-minute timeout, and refresh the two sk-code-ci references whose counts and line citations the edit moves."
trigger_phrases:
  - "cli vitest shards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: cli-vitest-shards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions YAML over a TypeScript test project |
| **Framework** | GitHub Actions; vitest 4.1.12 |
| **Storage** | None |
| **Testing** | vitest `cli` project, 209 test files |

### Overview
Change one job in one workflow: add a three-entry shard matrix to `cli-vitest` and append `--shard=${{ matrix.shard }}/3` to its existing vitest command, leaving `timeout-minutes: 51` and every other step alone. The same edit moves two timeout-line citations and one `set -uo pipefail` citation and changes the matrix-workflow count in the two sk-code-ci reference files, so both they and their `.opencode` twins are refreshed in the same change.

The intended workflow was assembled and linted during planning in `scratch/spec-kit-check.sharded.yml`: `actionlint` exits 0 on it, and `diff -u` against the current workflow shows only two hunks — the four-line `strategy` block, and the comment plus command line in the same step. The real file is unedited. Prove the result with `actionlint` on the real file, three local shard runs whose file counts sum to the 209 the unsharded list prints, and the orchestrator's push showing three `CLI vitest project` jobs.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] `actionlint .github/workflows/spec-kit-check.yml` exits 0
- [ ] Three shard runs collect 70, 70 and 69 files, sum to the 209 the unsharded list prints, and report 0 failed
- [ ] Both reference files and their `.opencode` twins are byte-identical, the matrix-workflow count names three, and the moved line citations point at the right lines
- [ ] The pushed run lists three `CLI vitest project` jobs, all `success`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-job matrix.

### Key Components
- **`cli-vitest` job**: one job id that GitHub expands into three independent instances, each on its own runner with its own checkout and build.
- **`--shard=N/3`**: vitest splits the collected `cli` file list into three chunks; the local split is 70, 70 and 69 files, while the shard times were 68.96 s, 195.52 s and 223.05 s.
- **`fail-fast: false`**: one failing shard does not cancel the other two, so every shard reports its own conclusion.
- **Reference pair**: `ci-workflow-standards.md` and `job-shape-rules.md` in sk-code-ci, plus their `.opencode` twins. The matrix-workflow count goes from `Both` to three while the 34-workflow count holds; the `50 of 50` timeout count holds because a matrix adds instances, not a job id; only the `set -uo pipefail` citation and the two timeout-line citations move, and the `strategy` block sits after `timeout-minutes` so the `cli-vitest` citation stays at `:142`.

### Data Flow
A push runs the workflow. GitHub expands `cli-vitest` into three jobs; each checks out, installs and builds the workspaces, installs ripgrep, then runs `npx vitest run --config ../../vitest.config.ts --project cli --shard=N/3` from `.opencode/skills/system-spec-kit/runtime/cli`. Each job reports separately, and the workflow's conclusion is the aggregate of the three.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the `cli` project's 209-file list, the installed vitest's `--shard` support and the four `timeout-minutes: 51` lines. Implementation adds the matrix, appends the flag, rewrites the comment that says the project runs as one process, and refreshes both references and both twins. Verification runs the three shards, lints the workflow, validates the packet, and ends with the orchestrator's push showing three reported jobs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The coverage floor is the existing suite; this change adds no test and removes none. Three checks stand in for it:

- `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest list --config ../../vitest.config.ts --project cli --filesOnly | wc -l` prints 209 before the change.
- The same command with `run --shard=N/3 --reporter=dot`, run three times, prints `Test Files ... (70)`, `(70)` and `(69)`; the counts sum to 209 and every run reports 0 failed. Note that `vitest list` ignores `--shard` and prints all 209 for every shard, so the sum comes from the three runs' `Test Files` lines, not from `list --shard`.
- `actionlint .github/workflows/spec-kit-check.yml` exits 0.

After the push, `gh run view <run-id> --json jobs` lists three jobs whose names start with `CLI vitest project`, and each one's conclusion is `success`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `actionlint` 1.7.12, present at `/opt/homebrew/bin/actionlint`.
- An authenticated `gh` for the run reads and the post-push check.
- vitest 4.1.12 from the workspace install, declared as `^4.1.12` in `.skilled/skills/system-spec-kit/runtime/cli/package.json`.
- No new package, secret, permission or runner image.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a shard fails for a reason the unsharded run does not reproduce, or the slowest shard's step still approaches the current 479 s. Revert the one commit (`git revert <sha>`); the job returns to one vitest process and the two references return to their previous counts and citations. No data or configuration is migrated, so the revert is complete.
<!-- /ANCHOR:rollback -->

---
