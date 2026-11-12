---
title: "Implementation Summary"
description: "The three spec-kit suites are three parallel CI jobs with their own checkout and install, and every test command is byte-identical to the pre-change text."
trigger_phrases:
  - "spec kit check parallel jobs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/008-spec-kit-check-parallel-jobs"
    last_updated_at: "2026-11-12T17:43:48Z"
    last_updated_by: "generate-context"
    recent_action: "Proved the parallel jobs on pull request 97 and merged them to main"
    next_safe_action: "Verify the Spec-Kit Check job durations on later main pushes"
    blockers: []
    key_files:
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/008-spec-kit-check-parallel-jobs/implementation-summary.md"
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:4480d0c96a2689009bc5eb079e8b8b1b184692ee5b0e67a40f1b52a38b1d3626"
      session_id: "scaffold-008-spec-kit-check-parallel-jobs"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/354-test-ci-alignment-fixes"
      savedAt: "2026-11-12T17:43:48Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-spec-kit-check-parallel-jobs |
| **Completed** | 2026-11-12, proven on pull request 97: the slowest job took 384 to 627 s on three runs against 867 s for the single job |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The wait after a spec-kit push no longer includes the legacy lanes and the runtime project. A matching push starts `check`, `cli-vitest`, `legacy-lanes` and `runtime-vitest` at the same time, each suite job checks out and installs its own workspace, and the run ends when the longest suite ends instead of after the sum of all three.

### Phase 8: spec-kit-check-parallel-jobs

`check` keeps the work that happens once: the checkout, the Node setup, the install and build, the CLI check gate and typecheck, and the shared package tests. It no longer runs a suite or installs ripgrep. Three jobs own the suites:

- `cli-vitest` carries the ripgrep install and the 490 s CLI vitest project, because the recipe and residue-sweep suites that spawn `rg` live in that project.
- `legacy-lanes` carries the 161 s `test:legacy` and `test:validation` commands.
- `runtime-vitest` carries the 79 s root vitest project.

Each suite job copies the existing switch guard, the `ubuntu-latest` runner and the 51-minute timeout, and none carries a `needs:` edge. The trigger paths, the `concurrency` block, the `permissions` block, the `mirrors` job and the `doctor-scripts` job are untouched. The four suite and lane command lines are byte-identical to the pre-change text, and the diff adds lines without removing any.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/spec-kit-check.yml` | Modified | Adds `cli-vitest`, `legacy-lanes` and `runtime-vitest`; leaves `check` with the gate, the typecheck and the shared tests |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/008-spec-kit-check-parallel-jobs/tasks.md` | Modified | Ticks T001 through T011 against their verification runs and leaves T012 for the operator |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/008-spec-kit-check-parallel-jobs/implementation-summary.md` | Modified | Records the change, every check with its output, and the pending run |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/008-spec-kit-check-parallel-jobs/graph-metadata.json` | Modified | Derived metadata, rewritten by the validator's draft auto-repair to match the edited docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The four step blocks that had to survive were recorded first, and the unedited workflow was linted. The three jobs were then added one at a time, and the duplicate steps plus the ripgrep step were removed from `check` once the new jobs existed.

The structural proof ran against the file on disk: a Ruby YAML parse printed the six job keys and each suite job's shape, `actionlint` printed `actionlint-ok`, and `rg` counted each of the four command lines once. Nothing was pushed. T012 needs the operator's written go-ahead, because the workflow's `push` trigger accepts only `main` and `skilled/**` and the job timings exist only in a pull-request run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the `check` job's name | Its name is the existing status context, and the shared package tests still run there, so renaming it would change a context for no gain |
| Repeat the install in each job instead of sharing a workspace | No artifact or workspace state crosses a job boundary, and setup that runs in parallel costs no extra wait |
| Keep the ripgrep install only in the CLI job | The recipe and residue-sweep suites that spawn `rg` live in the CLI vitest project; the other two suites never call it |
| Copy the 51-minute timeout to each suite job | The phase has no measurement that justifies a tighter limit, and the floor-plus-doubling formula would land well above the observed step times |
| Replace the per-job install comment in the three new jobs | The original comment explains the CLI check gate, which only `check` runs; the new comment names the fact that matters in a suite job, that the build is runner-local |
| Leave the four `run:` blocks untouched | The phase proves the same suites still run, so any command edit would change what is measured |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001, record the four step blocks | PASS, `rg -n` printed `111:      - name: Install and build the spec-kit packages`, `145:      - name: CLI vitest project`, `151:      - name: Legacy module lanes and the bash validation suites`, `159:      - name: Runtime vitest project`, before the edit |
| T002, lint the unedited workflow | PASS, `actionlint .github/workflows/spec-kit-check.yml && echo actionlint-ok` printed `actionlint-ok` |
| T003, add `cli-vitest` | PASS, `rg -c '^  cli-vitest:$' .github/workflows/spec-kit-check.yml` printed `1` |
| T004, add `legacy-lanes` | PASS, `rg -c '^  legacy-lanes:$' .github/workflows/spec-kit-check.yml` printed `1` |
| T005, add `runtime-vitest` | PASS, `rg -c '^  runtime-vitest:$' .github/workflows/spec-kit-check.yml` printed `1` |
| T006, remove the suite and ripgrep steps from `check` | PASS, the Ruby step-name check printed `true` |
| T007, parse the job keys | PASS, printed `check,cli-vitest,doctor-scripts,legacy-lanes,mirrors,runtime-vitest` |
| T008, lint the edited workflow | PASS, printed `actionlint-ok` |
| T009, count the four suite and lane commands | PASS, `rg -c` printed `4` |
| T010, check each suite job's shape | PASS, printed `cli-vitest:nil:1:1`, `legacy-lanes:nil:1:1` and `runtime-vitest:nil:1:1` |
| T011, check triggers, `check`, `mirrors` and `doctor-scripts` | PASS, printed `push=24 pr=24 checkouts=6 check_steps=5 mirrors_steps=4 doctor_steps=5` |
| T012, read the three job durations from a pull-request run | NOT RUN, it needs the operator's go-ahead to push the branch and open the pull request |
| `validate.sh --strict --quiet` | PASS, `RESULT: PASSED (errors=0 warnings=0)`, exit 0. The first run reported the same line after its draft auto-repair rewrote `graph-metadata.json`; the rerun was clean |
| `git status --short` | Four modified paths: `.github/workflows/spec-kit-check.yml` and the packet's `tasks.md`, `implementation-summary.md` and `graph-metadata.json` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The saving is inferred, not measured.** The 867 s baseline and the three step times are observed, but the parallel job durations exist only in a GitHub run. The T012 command reads them once the branch is pushed and a pull request to `main` is opened. Until then the phase stays Draft.
2. **The split adds billed runner minutes.** Three extra checkouts and three extra installs run in parallel, so the wait drops while the billed minutes rise by an amount this phase does not measure.
<!-- /ANCHOR:limitations -->

---
