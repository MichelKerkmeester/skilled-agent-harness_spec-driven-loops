---
title: "Implementation Summary"
description: "A plan to take a local spec-kit test run from 29 minutes to about four, then to one command that matches CI. Nothing is built yet."
trigger_phrases:
  - "test cycle speed implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/005-test-cycle-speed"
    last_updated_at: "2026-11-10T16:37:20Z"
    last_updated_by: "generate-context"
    recent_action: "Built cuts 2 to 5; deep-loop 1130 s to about 505 s"
    next_safe_action: "Commit worktree 340 after the operator approves"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/vitest.config.ts"
      - ".skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs"
      - ".skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts"
      - ".skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md"
      - ".skilled/skills/system-spec-kit/vitest.config.ts"
    session_dedup:
      fingerprint: "sha256:da2755ebd663c8172c6b92f5c4154be23653b4a0db6b19152f8a033c42bdf1b8"
      session_id: "scaffold-005-test-cycle-speed"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      workspace: "/Users/michelkerkmeester/worktrees/public/340-local-test-scope"
      savedAt: "2026-11-10T16:37:20Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1"
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
| **Spec Folder** | 005-test-cycle-speed |
| **Completed** | 2026-11-10. All five cuts built and measured |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All five cuts are built. The deep-loop suite takes 504 to 511 s instead of 1,130 s. Spec-kit's `npm test` now covers what CI covers, the `cli` project included, in 834 to 911 s. Before, its Vitest lane alone took 1,767 s and still skipped the `cli` project.

### The finding behind the plan

A local `npm test` in the spec-kit runtime runs another skill's suite. The deep-loop tests are 166 of 299 files and 86 percent of the test time. CI never runs them that way. The spec-kit job runs a project that leaves them out, and the deep-loop workflow runs them alone. The local config is the only place the two are joined, so the first cut is one include line and one setup file.

### Cut 1

The spec-kit runtime config no longer collects the deep-loop tests or loads deep-loop's setup file. Those 173 files still run under deep-loop's own config, which is what CI already used. All 126 spec-kit test files that run still pass, so none depended on the removed setup file.

The 4-minute estimate was wrong. Import time stayed at 302 s, and the run takes 8.7 minutes. Import time is now the largest share and the next thing to look at.

`test:council` named two deep-loop files, and once they left the include it dropped them without a word. It now runs them in a second step under deep-loop's own config. It covers the same 8 files it did before.

### Cuts 2 to 5

**Cut 2.** `npm test` in the spec-kit runtime now runs the `cli` project after the core lane. A new script runs it the way CI does, with the slow `upgrade-legacy` file in its own process. The lane takes about 400 s, and its one heavy file sets that time.

**Cut 3.** `sk-code-skilled`'s verify doctrine now says which suite a change owes: the full suite of each package it touches. It also says a rebase that brought only generated files owes no rerun.

**Cut 4.** A JSON profile ranked all 173 deep-loop files. The ten slowest take 51% of the time. Three ledger files built the same expensive fixture in several tests. They now build it once and share it with the tests that only read it. No test or assertion was removed. Read-only DeepSeek reviews also proposed caching inside the ledger code. That changes runtime behavior, so it was left out.

**Cut 5.** Test files now run side by side in all three configs. The first parallel runs found one real shared resource. The graph scripts all wrote to the checked-in coverage database, and two files fought over its writer lock. The test helper now gives each file its own coverage database, and the lifecycle test reads the lock from there. Twelve deep-loop files time child processes or race for that lock, so they run after the rest, one at a time. The test time caps rose from 30 s to 120 s, because heavy tests run slower when files share the disk.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | The measured problem and the scope |
| `plan.md` | Created | The five cuts and the three process habits |
| `tasks.md` | Created | One task per cut, each with its check |
| `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` | Modified | No deep-loop include or setup file |
| `.skilled/skills/system-spec-kit/runtime/package.json` | Modified | `test:council` runs its deep-loop files under their own config |
| `.skilled/skills/system-deep-loop/runtime/vitest.config.ts` | Modified | Header comment |
| `.skilled/skills/system-deep-loop/runtime/references/integration-points.md` | Modified | Section 6 describes the real test discovery |
| `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs` | Modified | `npm test` runs the `cli` lane |
| `.skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh` | Created | The `cli` project, split as CI splits it |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` | Modified | Which suite a change owes |
| `.skilled/skills/system-spec-kit/vitest.config.ts` | Modified | Parallel files, 120 s cap |
| `.skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts` | Modified | A coverage database per test file |
| `.skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts` | Modified | Reads the writer lock beside that database |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts` | Modified | Child process cap 15 s to 60 s |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/` three ledger files | Modified | One shared fixture each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The timings come from the full run on the v4.0.2.1 work. The CI claim was checked by reading `spec-kit-check.yml` and both Vitest configs in this worktree. No test was run for the plan. DeepSeek v4.1 flash max made every edit through the Devin CLI, from short briefs, with independent edits run side by side. Each diff was read against its brief before a test ran. Five read-only DeepSeek reviews profiled the slowest files in parallel. Every gate ran with no other load on the machine, after an early run under load gave false failures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cut 1 before all else | It is one config edit, it changes no workflow and it removes 1199 s of test time |
| Cut 2 second though it adds time | A local green that skips 203 files CI runs is a larger risk than ten minutes |
| Parallelism last | Both configs say files share temp roots and locks. Turning it on first would trade time for flaky runs |
| No test deleted on speed grounds | A slow test is not a redundant test. Cut 4 profiles first |
| `test:council` runs its deep-loop files under their own config | The operator chose to keep the council matrix whole over dropping the two files |
| Timing-sensitive files run after the rest, alone | With every file parallel they failed on elapsed-time limits under load. Raising those limits would weaken what they check |
| Raise the per-test cap, not the assertions | The cap only catches a hung test. No assertion or expected value changed |
| No production code changed | The profile's ledger caching ideas change runtime behavior and belong in their own change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh` on this folder with `--strict` | RESULT: PASSED |
| CI runs the `root` project for spec-kit | Read at `spec-kit-check.yml` lines 170 to 176 |
| No deep-loop test names spec-kit's setup file | `grep -rln vitest-setup` on the deep-loop tests prints nothing |
| Files collected by the spec-kit config | 302 before, 129 after, none from deep-loop |
| Files collected by the deep-loop config | 173 before and after, the same list |
| `npm test` in the spec-kit runtime | Exit 0. Vitest: 126 files passed, 3 skipped, 1638 tests passed, 523 s. Whole command 597 s |
| `test:council` | Exit 0. 6 files and 10 tests, then 2 files and 16 tests |
| `npm test` in `system-deep-loop/runtime`, three runs | Exit 0 each. 173 files and 2873 tests passed. 507, 511 and 504 s |
| `npm test` in `system-spec-kit/runtime`, three runs | Core lane: 126 files passed each time, 348 to 399 s. `cli` lane: one save test hit the old 30 s cap in the first run. With the 120 s cap, the two runs after passed 202 files and 2452 tests, 397 to 430 s. Whole command 841 and 911 s |
| Edited ledger test files | No `it` or `expect` line added or removed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `cli` lane did not get faster.** Its heaviest file, `upgrade-legacy`, takes about 400 s alone and sets the lane's time.
2. **One machine.** Every timing comes from an 18-core Mac. A smaller CI runner gets less from parallel files.
3. **`test:council` still skips one file, as it did before this work.** It names `cli/tests/multi-ai-council-persist-artifacts.vitest.ts`, and the spec-kit config excludes `runtime/cli/**`. That file runs in the `cli` project instead.
4. **The twelve serial deep-loop files take about 265 s.** They set much of the suite's new time. Shortening their waits would need care, because they measure time.
<!-- /ANCHOR:limitations -->

---
