---
title: "Implementation Summary"
description: "Seven CI workflows no longer check out loop state, which cuts their checkout step from about a minute to about half a minute with every test still run."
trigger_phrases:
  - "ci sparse loop state implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/022-ci-sparse-loop-state"
    last_updated_at: "2026-11-13T05:02:58Z"
    last_updated_by: "generate-context"
    recent_action: "Built the ci sparse loop state checkouts and proved them on pull request 103"
    next_safe_action: "Verify the checkout times of the seven workflows on the next main run"
    blockers: []
    key_files:
      - ".github/workflows/opencode-plugin-tests.yml"
      - ".github/workflows/README.md"
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/022-ci-sparse-loop-state/spec.md"
    session_dedup:
      fingerprint: "sha256:199d6e9d5440aa7e6a783a48a1ffebb29a9b70d8cca79fe158eb5902630986a8"
      session_id: "scaffold-022-ci-sparse-loop-state"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/360-ci-sparse-loop-state"
      savedAt: "2026-11-13T05:02:58Z"
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
| **Spec Folder** | 022-ci-sparse-loop-state |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Seven CI workflows no longer check out the research, review, scratch and archive folders under `specs/`. Their checkout step takes about half as long, and every test they ran before still runs.

### Phase 22: ci-sparse-loop-state

You asked for this in place of the three options phase 17 wrote down: keep everything tracked and stop CI from fetching what a job does not read. Nothing was untracked, moved or deleted.

The gain is smaller than the file count suggests. The checkout skips two thirds of the files and saves about 25 s per job. Why it does not save more was not measured. The larger suites could not take the change at all. Spec-Kit Check, the deep-loop suite and the sk-doc suites have tests that read real loop-state files, so they keep the full checkout and your longest wait is unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Seven workflow files under `.github/workflows/` | Modified | Nine checkout steps exclude the four folder kinds |
| `.github/workflows/opencode-plugin-tests.yml` | Modified | Also names one archived packet again, because a plugin test reads it |
| `.github/workflows/README.md` | Modified | Describes which workflows skip loop state and which keep the full checkout |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modified | Three cited line numbers |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The patterns were proven in a local clone first. A search for concrete loop-state paths in code then ruled out the suites that read them. The first run on pull request 103 failed two checks: a plugin test that reads an archived packet, and a README check after a divider moved. Both were fixed and the second run passed. Test counts and checkout times were then read from the branch run and the last `main` run of each workflow.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exclude four folder kinds, not include a list of folders | A job keeps working when a new top-level folder appears, and the pattern is the same in every workflow |
| Prove it with test counts, not with green checks | A test can skip itself when a file is missing, and a skipped test is green |
| Leave Spec-Kit Check, deep-loop and sk-doc on the full checkout | Their tests read recorded loop logs, `research.md` and a scratch patch file |
| Name the archived packet again for the plugin job | One test reads its graph metadata, and reverting that job would bring back the checkout that hit the time limit |
| Leave the protected workflows and `agent-mirror-sync.yml` alone | The first need a second named confirmation, the second fetches full history |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Local clone with the patterns | 46,049 files checked out, 88,252 skipped, 0 loop-state files left |
| Pull request 103, second run | 33 checks pass, 0 fail, 2 Dependabot jobs skip |
| Test counts, branch against `main` | Equal for six workflows: plugin tests 1,594 and 582, hook vitest 491, sk-git 1, advisor 65 and 1,393 with 8 skipped, dual-version 84, command-tree-parity four mirror counts. The playbook check prints the same two warnings on both sides |
| Checkout step, five workflows | 56 to 59 s on `main`, 32 to 34 s on the branch |
| Checkout step, `skill-advisor-stress.yml` | 56 s on `main`, 11 s on the branch |
| Checkout steps, `opencode-dual-version.yml` | 34, 33 and 34 s on the branch against 68, 26 and 29 s on `main` |
| `actionlint` on every workflow and `check-gate-inputs.sh` | Exit 0 and `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Each time is one run.** Runner speed varies, as the 11 s and the 26 s figures show. Treat the saving as about 25 s per job, not as a measured constant.
2. **The longest waits are unchanged.** Spec-Kit Check, deep-loop and the sk-doc suites keep the full checkout.
3. **A slow fetch can still happen.** The 8 min 39 s checkout on pull request 102 was not reproduced, so this phase did not show that a sparse checkout avoids it. It fetches about a third of the files.
4. **A new test that reads loop state fails only on the runner.** It passes locally, where the folders exist. The error names the missing path.
5. **The `playbook-operator-contract.yml` check prints no count.** Its output is the same two warnings on both sides, which is weaker evidence than a count.
<!-- /ANCHOR:limitations -->

---
