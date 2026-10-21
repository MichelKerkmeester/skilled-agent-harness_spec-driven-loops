---
title: "Implementation Summary"
description: "Every one of the 319 tracked paths under the OpenCode plugin folder and the hook tree now has an sk-code review row. 216 of the 258 confirmed findings are fixed, including two path escapes, and 35 that would change behaviour wait on the operator, three of them P0."
trigger_phrases:
  - "sk code opencode alignment audit implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/039-sk-code-opencode-alignment-audit"
    last_updated_at: "2026-10-21T01:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the review with four verifier rounds and the final suite runs"
    next_safe_action: "Operator decides the behaviour-change findings in review.md §3"
    blockers:
      - "21 P0/P1 findings in review.md §3 need an operator decision because fixing them changes behaviour"
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/039-sk-code-opencode-alignment-audit/review.md"
      - ".opencode/plugins/opencode-goal.js"
      - ".skilled/hooks/goal/lib/goal-slice.cjs"
      - ".opencode/plugins/tests/helpers/plugin-inventory.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-039-sk-code-opencode-alignment-audit"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Which of the behaviour-change findings in review.md §3 should be fixed?"
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
| **Spec Folder** | 039-sk-code-opencode-alignment-audit |
| **Completed** | 2026-10-21 |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every tracked file in the OpenCode plugin folder and the hook tree now has a review row in `review.md`, and the confirmed sk-code findings that could be fixed without changing behaviour are fixed. Two of the fixes close path escapes. Before them, a goal id could steer an archived snapshot out of its folder, and a packet `goal.md` could be read from outside the workspace.

### Phase 39: sk-code-opencode-alignment-audit

The review covered 203 real files and 116 symlinks. It confirmed 258 findings: 5 P0, 48 P1 and 205 P2. 216 are fixed (2 P0, 30 P1, 184 P2). 35 wait on the operator because each fix changes behaviour a runtime or an operator would see: 3 P0, 18 P1 and 14 P2. 7 are recorded with the reason they stay, most because the fix needs a new shared module or a file outside both trees. Luna rejected 25 more candidates.

Most fixes are standards work: module headers, numbered section dividers, import order, JSDoc on exports, line length, and test isolation from the operator's hook kill switches. A number of READMEs and the plugin architecture doc said things the code no longer does, and now match it. The plugin inventory scanner had three ways to lose an event check without reporting it. Each now reports the check, and each has a test that fails on the old scanner.

The three held P0s sit in the dispatch lint. Several dispatch shapes slip past it: `codex exec` inside `$(...)`, a dispatch behind `command` or `nohup`, and a negated `--executor` mention that still counts as authorization. Fixing them changes what the lint blocks, so they are the operator's call.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/opencode-goal.js` | Modified | Rebind keeps the prior snapshot inside the archive folder; import wrap; dead helper removed |
| `.skilled/hooks/goal/lib/goal-slice.cjs` | Modified | Refuses a `goal.md` whose real path leaves the workspace |
| `.opencode/plugins/tests/helpers/plugin-inventory.cjs` | Modified | Three lost-check cases now report; JSDoc on the exports |
| `.opencode/plugins/**`, `.skilled/hooks/**` | Modified | 124 other files: headers, dividers, imports, JSDoc, test isolation and doc accuracy |
| `cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` | Modified | States the goal suite's real count, 139 of 139 |
| `review.md` | Created | One row per tracked file, the held list and the recorded list |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max thinking, through cli-pi, reviewed the files in 13 batches and wrote every fix from short briefs. GPT-6 Luna at max effort, through cli-codex, ran read-only. It confirmed or rejected each candidate, then checked the fixes in rounds 2, 3 and 4. The orchestrator reran every brief's checks and every suite, mutation-checked each new test against the old code, and wrote each commit from the writer's FIXED list.

Batch 12 (the inventory scanner, its tests and the plugin architecture doc) waited until phase 038 landed on main. Main was merged first, then the batch was reviewed. Luna's round 4 finished for batch 3. Its runs for batches 10 and 12 stopped at Luna's usage limit, so those last fixes rest on the orchestrator's tests, recorded as such in `review.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hold every fix that changes behaviour | The phase brief says operator-visible behaviour changes are reported, not made. Fixing a lint gap changes what gets blocked |
| Fix the two P0 path escapes anyway | Each lets crafted input write or read outside its folder. Each fix only refuses that input and logs it, and a test proves it |
| Correct READMEs to match the code, not the code to match the README | The other direction changes behaviour (the task-dispatch and git-live-follow READMEs) |
| Re-cite five rejected doc findings in batch 12 | Luna agreed each claim was false and rejected only the rule the writer cited. They were re-cited to review-core's correctness minimum and fixed |
| Leave the 113 missing folder READMEs | Only the verifier's opt-in `--check-folders` asks for them; no sk-code rule requires a README per code folder |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Review coverage | `review.md` rows equal `git ls-files` for both trees, 319 of 319, no duplicates |
| Plugin suite | 481 of 481 (458 before; main's phase 038 added 19, this phase 4) |
| Hook node:test suites | 836 of 836 (834 before) |
| Hook vitest suites | 217 of 217 (217 before) |
| Battery unit tests | 51 of 51 |
| Purity test | 1 of 1 |
| Battery, v1 and v2 | Exit 0: 17 of 17 plugins discovered and loaded on v1, 17 of 17 active on v2, skills and 40 commands listed (`scratch/suites/battery-v1-v2.txt`) |
| Alignment verifier | Default PASS. Opt-in header and section findings went from 35 to 5, and all 5 are symlink targets outside both trees |
| Drift guards | All 4 passed |
| New tests on old code | Archive escape test fails without the guard; goal-slice escape test 24 pass and 1 fail; all three scanner tests fail on the old scanner |
| Luna rounds | Per-batch verdicts in `scratch/luna/` |
| Recursive strict validation of 082 | `RESULT: PASSED` for all 40 folders |
| CI, first push `f6f3e254e1` | 13 runs green, including OpenCode Plugin Tests 39524217239, OpenCode Dual-Version Battery 39524217313 and Spec-Kit Check 39524217338. sk-doc Script Tests 39524217329 failed: its README verdict baseline still expected the tier warning on the seven hook READMEs. Skill Advisor Stress Tests 39524217211 failed on the same four `sa-034` cases it already failed on before this phase (run 39462324507 at `7584ad70b7`) |
| CI, after the baseline fix `e42bdbeaf2` | All 13 runs green: sk-doc Script Tests 39526699904, OpenCode Plugin Tests 39526699974, Changed Packet Validation 39526699918, Advisory Checks 39526699910, Command Tree Parity 39526699919, Dispatch Enforcement Guard 39526699942, Gate Inputs 39526699914, Markdown Link Integrity 39526699901, Message Contract 39526699999, Playbook Operator Contract 39526699921, Rule Canary Sync 39526699973, sk-doc Rename Harness 39526699911, Trigger Index Rebuild 39526699927 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-002 is met.** Every P0 and P1 row names its fix commit. The last one, `b05-relaunch-lib-006`, was fixed in phase 048 at `70c81b37c3` and `1159acb5c5`, where the wrapper builds its seed suffix through the shared core formatter.
2. **Luna's round 4 did not run for batches 10 and 12.** It stopped at the usage limit. Those fixes rest on the orchestrator's tests and mutation checks.
3. **The scanner still names the event type by name.** A value held under another name stays invisible. The two-version battery remains the authoritative guard.
<!-- /ANCHOR:limitations -->

---
