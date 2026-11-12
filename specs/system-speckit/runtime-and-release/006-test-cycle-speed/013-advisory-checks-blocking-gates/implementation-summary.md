---
title: "Implementation Summary"
description: "A blocking gate-critical job now runs 12 spec-kit node suites, so a regression in them turns the advisory workflow red instead of reporting success."
trigger_phrases:
  - "advisory checks blocking gates implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates"
    last_updated_at: "2026-11-12T17:43:56Z"
    last_updated_by: "generate-context"
    recent_action: "Shipped the blocking job on 12 suites after two corrections"
    next_safe_action: "Verify the gate-critical job stays green on later main pushes"
    blockers: []
    key_files:
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates/implementation-summary.md"
      - ".github/workflows/advisory-checks.yml"
    session_dedup:
      fingerprint: "sha256:2a5a8f06cd60d4a53834a7d05ee4972aedab024550a808a9234b483525d625fd"
      session_id: "scaffold-013-advisory-checks-blocking-gates"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/354-test-ci-alignment-fixes"
      savedAt: "2026-11-12T17:43:56Z"
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
| **Spec Folder** | 013-advisory-checks-blocking-gates |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> As shipped: the job blocks on 12 suites. The build chose eleven. A correction added the two it had excluded, which made 13, and a second correction removed `hook-stdin-deadline.test.mjs` after it lost a timing race on the runner. The job also installs and builds the skill advisor, which the hook entries import. Where the text below says eleven, read it as the build's first state.

The advisory workflow no longer reports success while gate-critical suites fail. Eleven of the thirteen spec-kit node suites now run in a blocking `gate-critical` job, so a regression in any of them turns the check red. The two suites that fail on the current tree stay report-only and are named in the run record.

### Phase 13: advisory-checks-blocking-gates

The workflow used to be one job whose four steps all carried `continue-on-error: true`, which left the whole file green no matter what the suites printed. That was acceptable while the gate-critical suites had a known-failing backlog, but it also meant a new regression in the eleven suites that do pass could not fail a check. The new `gate-critical` job closes that gap: it checks out the repository, installs the spec-kit workspace from its lockfile, builds the shared package, then runs the eleven passing suites in one `node --test` invocation with no `continue-on-error` anywhere.

The two suites that fail locally, `hook-stdin-deadline.test.mjs` and `spec-gate-core.test.mjs`, never enter the blocking job. They keep running in the report-only node step, so their output stays readable and the job stays honest about what it enforces. The census that decided the split is recorded in `scratch/gate-critical-run.md`, and the workflow header and its row in the workflows README now say which job blocks and which four steps only report.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/advisory-checks.yml` | Modified | Adds the blocking `gate-critical` job and rewrites the header comment so it no longer claims every check is report-only. |
| `.github/workflows/README.md` | Modified | Replaces the "Reports without gating" sentence on the `advisory-checks.yml` row with the blocking job description. |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates/scratch/gate-critical-run.md` | Created | Records the 13-suite census, the per-suite pass and fail counts, and the eleven-in, two-out split. |
> Correction after the build: `hook-stdin-deadline.test.mjs` and `spec-gate-core.test.mjs` failed only because the build ran with `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` set. With both unset they pass, 56 of 56 and 107 of 107 with 3 skipped. The blocking job therefore runs all 13 suites: 265 tests, 262 pass, 0 fail. Second correction, after the runner runs: `hook-stdin-deadline.test.mjs` lost a timing race on one of six runs and went back to report-only, so the job blocks on 12 suites.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The census ran first: each `.test.mjs` suite under `.skilled/skills/system-spec-kit/runtime` ran on its own through `node --test --test-reporter=tap`, and the `# pass` and `# fail` summary lines were recorded per suite. That produced eleven passing suites and two failing ones, which fixed the job's path list before the workflow was edited.

The job was then added after the existing `advisory` job, copying that job's switch condition and the pinned checkout and setup-node revisions already in the file. It installs with `npm --prefix .skilled/skills/system-spec-kit ci` and builds with `npm --prefix .skilled/skills/system-spec-kit run build`, because the suites import the built shared package and `js-yaml` from that workspace.

Verification ran the same invocation the job uses, over the paths extracted from the job block, then checked the block statically and parsed the workflow. No task was skipped: every task in `tasks.md` was buildable here, and none of them pushes a branch, opens a pull request or asks the operator for a decision.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Block on eleven suites, leave two report-only | Eleven pass on the current tree, so a red job means a new regression. Blocking on the two that already fail would leave the job permanently red and teach everyone to ignore it. |
| Name the eleven paths explicitly instead of discovering them | The blocking set must not silently grow to include a suite that fails today, and an explicit list makes the next addition a deliberate edit. The cost is that a new suite runs report-only until it is added. |
| Install and build the spec-kit workspace inside the job | A fresh runner has neither `js-yaml` nor `shared/dist/gate-3-classifier.js`, so the suites would fail or skip before testing anything. |
| Leave the four report-only steps untouched | Removing or narrowing them is the successor phase's cleanup. Keeping them preserves the signal from the two failing suites and keeps this change reviewable. |
| Reuse the `advisory` job's switch condition | Both jobs belong to the same workflow, so `SKILLED_CI` and `SKILLED_CI_FRESHNESS` turn them off together and the on/off tables in the README stay accurate. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All commands ran from the repository root on 2026-11-12 with Node v26.13.0.

| Check | Result |
|-------|--------|
| Census loop over the 13 suites, one suite per invocation | `pass=11 fail=2 named=2` |
| Report-only steps and runner callers | `continue=4 callers=1` |
| `continue-on-error` occurrences inside the `gate-critical` block | `0` |
| Workflow header names `gate-critical` | `HEADER_OK` |
| README no longer says "Reports without gating" | `README_OK` |
| The job's eleven paths in one `node --test` run | `count=11` then `# fail 0` |
| Paths and exclusions in the job block | `paths=11 excluded=0` |
| `continue-on-error: true` lines across the workflow | `4` |
| `ruby -ryaml` job keys | `advisory,gate-critical` |
| `actionlint .github/workflows/advisory-checks.yml` | exit 0, no findings |
| `check-comment-hygiene.sh .github/workflows/advisory-checks.yml` | exit 0, no violations |
| `validate.sh --strict --quiet` | `RESULT: PASSED (errors=0 warnings=0)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The eleven-path list is maintained by hand.** A new gate-critical suite runs only in the report-only step until someone adds it to the job and to the run record. Adding one means re-running the census first and confirming it passes.
2. **The CI Node version differs from the machine that produced the counts.** CI uses Node 22 and the local run used Node 26.13.0, so the first workflow run is the real confirmation. A suite that fails only on 22 moves to the report-only list by name.
3. **The report-only step still has no install.** `run-node-tests.mjs` skips the node suites when the dependency trees are absent, so on a fresh runner the two known-failing suites may not run at all. The new job installs its own dependencies; repairing the report-only step belongs to the successor phase.
4. **The stdin deadline suite is not blocking.** `hook-stdin-deadline.test.mjs` was added to the job after the build and then removed. It writes a payload 800 ms after spawning a hook and expects the hook's 500 ms deadline to have passed, which failed on one of six runner runs with no code change. The job blocks on 12 suites. Making that suite blocking needs a wider margin in the test first.
<!-- /ANCHOR:limitations -->

---
