---
title: "Implementation Summary"
description: "A map of the six test files that read loop state, and a sparse checkout for the CLI, runtime and deep-loop vitest jobs with every test still run."
trigger_phrases:
  - "ci sparse big suites implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/023-ci-sparse-big-suites"
    last_updated_at: "2026-11-13T05:55:22Z"
    last_updated_by: "generate-context"
    recent_action: "Mapped loop-state reads and proved three narrowed checkouts on pull request 104"
    next_safe_action: "Verify the checkout and job times of the edited jobs over several main runs"
    blockers: []
    key_files:
      - ".github/workflows/spec-kit-check.yml"
      - ".github/workflows/deep-loop-runtime.yml"
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/023-ci-sparse-big-suites/spec.md"
    session_dedup:
      fingerprint: "sha256:8982e913bca92cbce37f22a2049f9f13f282f702864d99087f443071b7abe301"
      session_id: "scaffold-023-ci-sparse-big-suites"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/361-ci-sparse-big-suites"
      savedAt: "2026-11-13T05:55:22Z"
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
| **Spec Folder** | 023-ci-sparse-big-suites |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Only six test files in the spec-kit, deep-loop and sk-doc suites read loop state. With that known, the CLI and runtime vitest jobs of Spec-Kit Check and the deep-loop job now skip the loop-state folders too, and every test still runs.

### Phase 23: ci-sparse-big-suites

Phase 22 left these suites alone because 30 of their files name a loop-state path. Running them without the folders showed how few tests read one at run time: nine tests in three CLI files, one deep-loop test and two sk-doc script tests. The runtime lane reads none.

The gain in time is modest and uneven. The edited jobs check out in 32 to 37 s. A full checkout on `main` takes about 57 s most of the time, but 13 of 48 measured steps finished in under 30 s, faster than the sparse one. So expect about 25 s less per job on a typical run and nothing on a fast one.

### The map

| Suite | Test file | What it reads |
|-------|-----------|---------------|
| Spec-kit CLI | `gate-3-classifier.vitest.ts` | The archived packet `025-deep-loop-gpt-reliability/006-reliability-fixes/002-gate3-precedence-and-validator` |
| Spec-kit CLI | `multi-ai-council-validator.vitest.ts` | The archived packet `021-multi-ai-council-write-protocol/002-multi-ai-council-persistence` |
| Spec-kit CLI | `alignment-drift-fixture-preservation.vitest.ts` | `malformed.json` in an archived `scratch/001-test-agent-08` folder |
| Deep-loop | `deep-research-ledger-schema.vitest.ts` | Recorded loop logs listed in `tests/helpers/legacy-real-log.ts` |
| Sk-doc | `test_readme_verdict_parity.py` | Every README in the repository, archived ones included |
| Sk-doc | `test_root_name_consumer_matrix.py` | Not examined. It fails without the folders and passes with them |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/spec-kit-check.yml` | Modified | Sparse checkout in the `cli-vitest` and `runtime-vitest` jobs |
| `.github/workflows/deep-loop-runtime.yml` | Modified | Sparse checkout, with five log folders named again |
| `.github/workflows/README.md` | Modified | Names the three jobs and the rule for a new test that reads loop state |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modified | Two cited line numbers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A scratch clone ran the three suites without the four folder kinds, then again with the full checkout. The second run was the control: the deep-loop suite fails 71 tests in that clone either way, and without it those would have been blamed on the missing folders. The narrowed patterns were then tried in the clone, where the dependent files passed. Pull request 104 passed on its first run, and its test totals and checkout times were read against `main`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run a control in the same clone | A scratch clone breaks tests for its own reasons. Only a test that fails without the folders and passes with them is a reader |
| Name the paths again, not move the fixtures | Moving a fixture out of an archive changes tests and the packets they bind to. A pattern line changes neither |
| Name the folder that directly holds each file | Git matches a file through its nearest parent folder first, so a pattern for a packet root does not restore a `scratch/` folder below it |
| Include all five recorded logs for deep-loop, though one test failed | The helper lists five. A test that guards on a missing file would pass silently |
| Leave four jobs of Spec-Kit Check and the sk-doc suites on the full checkout | The scratch run did not cover everything those jobs execute, and sk-doc walks the whole repository |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scratch clone, suites without loop state against the full checkout | 9, 1 and 2 tests fail only without loop state. Totals are equal: 2,541, 1,662 and 2,893 |
| Scratch clone, narrowed patterns | The three CLI files pass 74 tests with 1 skipped. The deep-loop ledger file passes 52 |
| Pull request 104 | 35 checks pass, 0 fail, 2 Dependabot jobs skip, on the first run |
| Test totals, branch against `main` | Equal: CLI shards 797, 1,076 and 646, runtime 1,649, deep-loop 2,885 |
| Checkout step, five edited jobs | 32 to 37 s on the branch. 23 to 60 s for the same jobs in the `main` run compared |
| Full checkout on `main`, 48 steps in six runs | 21 to 80 s, median near 57 s, 13 steps under 30 s |
| `actionlint` on every workflow and `check-gate-inputs.sh` | Exit 0 and `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The time saved is not reliable.** A full checkout is sometimes faster than the sparse one. The job times on the pull request were mixed as well: the deep-loop job took 509 s against 440 s on `main`, while two of the three CLI shards and the runtime job took less. One run each, so neither figure settles anything.
2. **Why a full checkout is sometimes fast was not found.** It may be a runner cache. Until that is known, the 25 s figure is a typical case, not a floor.
3. **A new test that reads loop state fails only on the runner.** It passes locally, where the folders exist. The path must be added to the job's pattern list.
4. **Four jobs of Spec-Kit Check keep the full checkout.** The legacy and validation lanes reported equal totals in the scratch run, but that run did not cover the whole job, so it was left alone.
5. **The map is one snapshot.** It was taken from local `main` before phase 22 merged and was not repeated afterwards.
<!-- /ANCHOR:limitations -->

---
