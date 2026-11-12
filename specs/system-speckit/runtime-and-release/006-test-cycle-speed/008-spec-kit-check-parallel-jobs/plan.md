---
title: "Implementation Plan: Phase 8: spec-kit-check-parallel-jobs"
description: "Split the three serial suite steps in spec-kit-check.yml into three jobs that each check out and install their own copy. Prove the split with a YAML parse, actionlint, the four unchanged command lines and one pull-request run that reports three job durations."
trigger_phrases:
  - "spec kit check parallel jobs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: spec-kit-check-parallel-jobs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions workflow YAML |
| **Framework** | GitHub Actions, Node 22 |
| **Storage** | None |
| **Testing** | Vitest projects, legacy Node lanes, bash validation suites, `actionlint`, `validate.sh` |

### Overview
Edit one file. Move the CLI vitest, legacy lane and runtime vitest steps into three jobs, copy the install-and-build step into each, and leave every `run:` command alone. Prove the split first with a YAML parse and `actionlint`, then with the three job durations from a pull-request run that the operator-approved push starts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] The YAML parser prints `check,cli-vitest,doctor-scripts,legacy-lanes,mirrors,runtime-vitest`
- [ ] `actionlint .github/workflows/spec-kit-check.yml && echo actionlint-ok` prints `actionlint-ok`
- [ ] The four suite and lane command lines each appear once, so the combined `rg -c` count prints 4
- [ ] `gh run view` prints three `success` lines with durations after the operator-approved push and pull request
- [ ] `validate.sh --strict --quiet` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel job fan-out

### Key Components
- **`check`**: owns the install, the CLI check gate, the typecheck and the shared package tests. It no longer runs a suite.
- **`cli-vitest`** (name `CLI vitest project`): owns the 490 s CLI vitest project and the ripgrep install that its recipe and residue-sweep suites need.
- **`legacy-lanes`** (name `Legacy module lanes and the bash validation suites`): owns the 161 s `test:legacy` and `test:validation` commands.
- **`runtime-vitest`** (name `Runtime vitest project`): owns the 79 s root vitest project.

Each new job copies the existing `if:` guard, `runs-on: ubuntu-latest` and `timeout-minutes: 51`, so the workflow's on/off switch and runner image do not change.

### Data Flow
A push to a matching branch, or a pull request to `main`, starts one workflow run. GitHub schedules all six jobs in parallel, each suite job checks out the repository and builds its own workspace, and the run finishes when the slowest job finishes. No artifact or workspace state crosses a job boundary, so the install step is repeated rather than shared.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: Read `.github/workflows/spec-kit-check.yml` and record the four `run:` blocks that must survive unchanged.
- **Implementation**: Add `cli-vitest`, `legacy-lanes` and `runtime-vitest`, then remove the three suite steps and the ripgrep step from `check`.
- **Verification**: Parse the YAML, run `actionlint`, count the four commands, and after the operator-approved push and pull request read the three job durations with `gh run view`.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No test file changes. The local proof is structural: the YAML parser prints the six job keys, `actionlint` exits 0, and the four command lines appear exactly once. The behavioral proof is one pull-request run from the branch, which the operator-approved push starts. `gh run view` must print three `success` lines with durations, and the CLI job must carry the longest duration. Running the suites locally is not part of the proof, because the commands are unchanged and the CI run is the environment that matters.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`actionlint`, present at `/opt/homebrew/bin/actionlint` on 2026-11-12. `gh`, authenticated on 2026-11-12. No new package, and no change to any `package.json`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the operator-approved run is slower than the 867 s serial baseline, or a suite job fails for a setup reason the serial job did not have. Revert the one commit that touches `.github/workflows/spec-kit-check.yml`, which restores the serial `check` job. Nothing else in the phase needs a rollback.
<!-- /ANCHOR:rollback -->

---
