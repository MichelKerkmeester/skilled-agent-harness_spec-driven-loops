---
title: "Implementation Summary"
description: "The hook vitest tree now runs from `hook-vitest-suites.yml` under its own name, so a red run says which suite broke, and the dispatch guard owns only the dispatch rule suite again."
trigger_phrases:
  - "hook suite job split implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/015-hook-suite-job-split"
    last_updated_at: "2026-11-12T08:22:01Z"
    last_updated_by: "orchestrator"
    recent_action: "Moved the hook vitest job out of the dispatch guard workflow into its own workflow"
    next_safe_action: "None. Both workflows pass on the pull request"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-hook-suite-job-split"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 015-hook-suite-job-split |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A failure in the hook vitest tree now turns the run titled `Hook Vitest Suites` red, not `Dispatch Enforcement Guard`. The guard file owns one job again, so its name is a true statement about what failed.

### Phase 15: hook-suite-job-split

The `hooks-vitest` job covers the runtime adapter suites, Pi's preflight lint and directive dedup, and the Codex shell-tool names. None of that is dispatch enforcement, yet a rename in any adapter filed its failure under the guard's name and rode inside the guard's protection rationale. Moving the job keeps the check itself identical: same triggers, same `SKILLED_CI` and `SKILLED_CI_FRESHNESS` condition, same ten-minute timeout, same pinned checkout and setup-node steps, same `npm --prefix .skilled ci` install and the same vitest run line. Only the file that owns the job, and therefore the workflow name a run carries, changes.

`/doctor:ci report` still reads the directory as clean: every workflow parses and no row, switch, timeout, permissions or pin flag is raised. The new file is not added to the profile's protected set, because protection covers guard classes and a test suite is not one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/hook-vitest-suites.yml` | Created | Owns the moved `hooks-vitest` job under the workflow name `Hook Vitest Suites`, with the guard file's `on`, `permissions`, `concurrency` and `env` blocks copied verbatim. |
| `.github/workflows/dispatch-enforcement-guard.yml` | Modified | Drops the `hooks-vitest` job and keeps the dispatch job, its fail-closed suite check, its comments and every workflow-level block. |
| `.github/workflows/README.md` | Modified | Adds the contents row, the push-versus-pull-request coverage entry and the `SKILLED_CI_FRESHNESS` row for the new file. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The move was proved structurally on the checkout, because the job's own suite runs where it always ran. A YAML parse listed the guard file's two jobs before the split and one job after it, and the new file's name and job key after it. A `rg` census found `hooks/vitest.config.ts` in one workflow before the split and in the other one after it. A field-by-field parse compared `on`, `permissions`, `concurrency` and `env` across the two files and matched the two jobs' `if` strings. The last check piped `/doctor:ci report` into a counter that printed the workflow count, the parse-error count and the flag count.

The report's workflow count reads `34`, one above the `33` the plan recorded, because the worktree already carried 33 workflow files when the split began: a sibling packet had added one after this packet measured 32. The baseline was captured as 33 and the post-split count is 34, so the new file accounts for exactly the one-file change. The two drift values that the check exists for, parse errors and flags, are both zero. The counts in `spec.md`, `plan.md` and `tasks.md` were corrected to the tree this phase ran on, and the correction is recorded under T003 and T010.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Moved the job into a new file instead of renaming the job | The job name `Every hook vitest suite passes` already says what it runs and keeps its check label; it was the workflow title that filed the failure under the guard. |
| Left the test command, timeout, install step and switch untouched | Anything else would be a behavior change wearing a move's clothes, and the phase exists to change only which file owns the job. |
| Put the new file in the push-versus-pull-request table's whole-tree row | It answers every push to `main` and `skilled/**` and every pull request with no path filter, so it belongs with the guards, not with the path-filtered suites. |
| Kept the new file out of the profile's protected set | Protection records a guard role. A test suite has none, and adding it would claim a rationale that does not exist. |
| Corrected the packet's workflow counts rather than leave three stale numbers | The tree the phase ran on carried 33 files, so the `32` baseline and the `33 0 0` expectation described a tree that no longer existed; the corrected values keep the packet's own proof readable. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All commands ran from the repository root with `W=.github/workflows` and `H=.github/workflows/hook-vitest-suites.yml`.

| Check | Result |
|-------|--------|
| T001 parse of the guard file's job keys, before the split | `dispatch-enforcement-guard,hooks-vitest` |
| T002 census before the split | `.github/workflows/dispatch-enforcement-guard.yml` |
| T003 workflow file count before the split | `33` (plan wrote `32`; the baseline moved before this phase ran, see How It Was Delivered) |
| T004 new file name and job keys | `Hook Vitest Suites hooks-vitest` |
| T005 guard file's job keys after the split | `dispatch-enforcement-guard` |
| T006 README occurrences of the new file name | `3` |
| T007 `on`, `permissions`, `concurrency` and `env` comparison, plus the two `if` strings | `on-same permissions-same concurrency-same env-same switch-same` |
| T008 byte-identical run line in the new file | `1` |
| T009 census after the split | `.github/workflows/hook-vitest-suites.yml` |
| T010 report counter | `34 0 0` (workflows, parse errors, flags) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/015-hook-suite-job-split --strict --quiet` | `RESULT: PASSED (errors=0 warnings=0)`. The first run found only derived-metadata drift, and the validator's draft auto-repair rewrote `graph-metadata.json` once before the quoted run. |
| `bash .github/scripts/check-gate-inputs.sh` | `files=47 inputs_resolved=325 dynamic_inputs=38 twin_pairs=375 failures=0`, `RESULT: PASSED`, exit 0. The new workflow carries no path filter and no input. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The first CI run of the change is the first run of the moved job under its new name.** Nothing on the checkout can prove the run list shows `Hook Vitest Suites`; only the push that starts it can. The job's definition is provably unchanged by the T007 and T008 checks.
2. **The workflow count in this packet now reads 34, not the 33 the first plan expected.** Any later packet that quotes a workflow count has to re-read it, because another packet can add a workflow file to the same worktree, which is what happened here.
<!-- /ANCHOR:limitations -->

---
