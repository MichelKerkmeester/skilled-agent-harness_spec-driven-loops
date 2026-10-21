---
title: "Implementation Summary"
description: "The Skill Advisor Stress Tests workflow has four failing sa-034 tests, not a broken plugin: the harness called the plugin's dual export as a function. Four test files now go through `.server`, a new test pins the export shape, and the stress suite reports 65 of 65."
trigger_phrases:
  - "skill advisor stress ci implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/044-skill-advisor-stress-ci"
    last_updated_at: "2026-10-21T07:41:00Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "All four test callers moved to `.server`, the shape test added, suites and battery rerun"
    next_safe_action: "None; the advisor owner picks up the two recorded follow-ups"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-044-skill-advisor-stress-ci"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-skill-advisor-stress-ci |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Skill Advisor Stress Tests workflow has failed every run since 2026-10-19, and it had nothing to do with the plugin it tests. Four of its 64 sa-034 tests died on `TypeError: default is not a function` because the harness called the plugin's default export as a function, while that export has been the `{ id, setup, server }` object the dual-export contract requires since commit `32e1f92687`. The harness now calls `.server`, the v1 factory the object carries, and the stress suite reports 65 passed of 65.

### Phase 44: skill-advisor-stress-ci

You get a red workflow back to green without weakening what it checks. The plugin and the bridge are untouched: the dual-export object is what OpenCode 1 and OpenCode 2 both load, and `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` asserts that shape for every plugin in the folder. The harness was the stale side of the contract, so the harness is what moved.

Three runtime tests called the same export the same way, so they moved with it. They are not run by any workflow today, which is why they were still calling it, and the first review round is what found them. One new test in the stress harness asserts that the default export keeps `id`, `setup` and `server`, so a change to the export's shape fails there. A harness that drifts back to calling the default directly is caught by the four behavioural tests, as the mutation record shows.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Modified | `makePlugin` calls `skillAdvisorPlugin.server(...)`; imports the export as the dual-export object; adds the shape test |
| `.skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-consumption.vitest.ts` | Modified | Both call sites, including the reset hook, go through `.server` |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-diagnostic-redaction.vitest.ts` | Modified | The plugin hooks come from `.server` |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modified | The extracted factory is `skillAdvisorPlugin.default.server` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The counts were taken first, in `scratch/baseline/`: the stress suite at 4 failed of 64, the runtime vitest suite at 108 failed and 1090 passed, and the failing file list that proves which failures predate the change. Each test file then changed from its own brief in `scratch/briefs/` in the worktree `worktrees/186-skill-advisor-stress-ci`, starting with the stress harness and the shape test.

Luna (read-only) reviewed the whole diff in round 1 and failed it: one P1, the three runtime callers the first brief never named, and one P2, a comment that claimed the new shape test catches a direct call when it only asserts the export's fields. Both were fixed, the comment now describes what the assertions actually check, and round 2 passed with no findings. The harness call was then reverted on its own and the original four failures came back, so the fix is proven to be the thing that carries the workflow.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the harness, not the plugin export | The dual-export object is the contract both OpenCode versions load and the purity test enforces; a plugin change would have broken v1 and v2 loading to satisfy a stale test |
| Pin the export shape in the stress harness | The four behavioural tests already catch a direct call, but only as a `TypeError`; a named shape assertion says what the harness depends on when it fails |
| Move the three runtime callers in the same phase | They fail the same way the moment anyone runs the runtime's default suite, so leaving them would have moved the same bug one directory over |
| Leave the 8 remaining runtime failures alone | They assert scorer, corpus and settings behaviour, fail identically before the change, and no workflow runs that suite; folding them in would have hidden this fix inside an unrelated repair |
| No workflow added for the runtime's default suite | CI coverage of that suite is a decision about cost and ownership, recorded as a follow-up for the advisor owner rather than taken here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Skill advisor stress suite (`SPECKIT_RUN_STRESS=true vitest run --config vitest.stress.config.ts`) | PASS 65/65 (baseline 60/64, 4 failed) - `scratch/after/stress-after.txt` |
| Runtime vitest (default config) | 8 failed / 1190 passed / 6 skipped of 1204 (baseline 108 failed / 1090 passed) - the 8 are python-compat, settings-driven-invocation-parity x2, advisor-corpus-parity, advisor-graph-health, python-ts-parity, ambiguity-slice, skill-advisor-cli-parity |
| Typecheck | Exit 0 |
| OpenCode plugin suite (`.opencode/plugins/tests`, tap) | PASS 516/516 - `scratch/after/plugins.txt` |
| Plugin folder purity test | PASS 1/1 |
| Dual-version battery, v1 | PASS 4/4: family present, 17 plugin files discovered, 17 loaded, 40 of 40 commands listed - `scratch/after/battery-v1.txt` |
| Dual-version battery, v2 | PASS 4/4: family present, 17 plugins active, 60 of 74 skill entries visible, 40 required commands listed - `scratch/after/battery-v2.txt` |
| Mutation: harness call reverted to the direct call | 4 failed of 5, all `TypeError: default is not a function` - `scratch/mutation/m1-call-default-directly.txt` |
| Luna review (read-only) | Round 1 FAIL (1 P1, 1 P2), both fixed; round 2 PASS, no findings - `scratch/luna/` |
| CI on main at `53fd0cbbde` | All 14 workflows succeeded. Skill Advisor Stress Tests 39564216421 reports 65 passed of 65. The others: Advisory Checks 39564216089, Changed Packet Validation 39564216329, Command Tree Parity 39564216211, Dispatch Enforcement Guard 39564216324, Gate Inputs 39564216176, Markdown Link Integrity 39564216245, Message Contract 39564216445, OpenCode Plugin Tests 39564216306, Playbook Operator Contract 39564216071, Routing Registry Drift Guard 39564216118, Rule Canary Sync 39564216518, sk-doc Script Tests 39564216352, Trigger Index Rebuild 39564216172 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 8 runtime vitest failures are still there.** python-compat, settings-driven-invocation-parity (2), advisor-corpus-parity, advisor-graph-health, python-ts-parity, ambiguity-slice and skill-advisor-cli-parity assert scorer, corpus and settings behaviour and fail the same way before this change. They belong to the advisor owner.
2. **No CI workflow runs the advisor runtime's default vitest suite.** That gap is why the 98 plugin-test failures in it went unseen, and why the three stale callers survived the plugin port. Adding that suite to a workflow is follow-up work with its own cost.
3. **The shape test proves the export, not the harness.** A harness that regressed to a direct call would still pass it; the four behavioural tests are what catch that, and the mutation run shows they do.
<!-- /ANCHOR:limitations -->

---
