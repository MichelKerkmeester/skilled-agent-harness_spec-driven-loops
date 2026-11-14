---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "lifecycle lock and limits implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/003-lifecycle-lock-and-limits"
    last_updated_at: "2026-11-14T11:33:20Z"
    last_updated_by: "template-author"
    recent_action: "Closed phase 003 with every acceptance row met"
    next_safe_action: "Implement phase 004, workflow single source and drift guard"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-lifecycle-lock-and-limits"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-lifecycle-lock-and-limits |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A deep-research run can now be restarted the way a deep-review run can, and a restart keeps its lineage. The packet lock outlives the longest allowed dispatch and is released on every halt, and a run stops and synthesizes when it has used its wall-clock budget.

### Phase 3: lifecycle-lock-and-limits

Before this phase a research run in auto mode had no way to restart, and a review restart wrote generation 1 into the new config. You now pass `--restart` or `--lineage-mode=restart` to either command. The workflow reads the old session id, generation and state log digest first, archives the packet before the lock is taken in auto mode, and writes the next generation with lineage mode `restart`. In confirm mode the lock is already held when you choose restart, so the archive moves the packet contents and leaves the lock file in place.

The lock used a fixed 30-minute TTL while a dispatch may run for 60 minutes. The TTL now follows the dispatch timeout, and the lock is refreshed right before and after each dispatch. Every halt, lost lock and cancel choice after the lock is taken names the one shared release step. Each loop pass also compares `maxDurationMinutes` with the config's `createdAt`. When the limit is reached the loop skips the dispatch and goes to synthesis with stop reason `maxDurationReached`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modified | Restart binding and archive, restart lineage in the config, the derived lock TTL, the dispatch refreshes, the release routing, the duration check and the native dispatch timeout |
| `.skilled/commands/deep/research.md`, `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modified | The `--restart` and `--lineage-mode` flags and the `lineage_mode` setup row |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Modified | Rebuilt from the new workflow files |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modified | `deep_research.run_restarted` is marked spoken by both research workflows |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts`, `workflow-lock-lifetime.vitest.ts`, `workflow-max-duration.vitest.ts` | Created | 32, 14 and 8 cases for restart, lock lifetime and the duration stop |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-lock-release.vitest.ts` | Modified | A new block lists every terminal path after the acquire and requires the release step |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts`, `deep-review-lock-refresh.vitest.ts`, `deep-research-bookkeeping-emission.vitest.ts` | Modified | Each states a fact this phase changed: the spoken stem count, the derived TTL argument and valid sample values for the restarted row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each change was written as one literal brief and dispatched to DeepSeek V4.1 Flash at max effort through `opencode run` on the `llmgateway` provider, ten dispatches in all. The orchestrating session read every diff and reran every check before the commit. Tests came first and failed before the workflow edits.

The first full suite run after the edits had 7 failures in 4 files and the second had 2 in 1 file. Each was traced to this phase's changes and fixed at its source, and the third run passed. The work landed in one commit on branch `worktrees/382-deep-loop-workflow-logic-hardening`: `0554ea051f`. Nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The duration stop prints its row and does not append it | The gateway refuses an event with no ledger stem, and a new stem is outside this phase's file list |
| The restarted row uses the structured stem form with a state log digest | The stem checker credits only a `"stem":` key, and the stem's schema requires the digest of the prior log |
| The lock TTL reads the setup value `executor_timeout` | No config exists yet when the lock is taken |
| The native dispatch branch carries `timeout_seconds` | The lock lifetime assumes no dispatch outlives the dispatch timeout, and the native branch held no bound |
| The confirm restart moves the packet contents, never the folder | The operator answers after the lock is taken, and the held lock file must stay in place |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Full runtime suite, `npm test` in the runtime folder | PASS: 179 test files, 3060 passed, 8 skipped, 0 failed, exit 0. Baseline on the phase 002 close: 176 files, 3002 passed. The 58 added tests are in the three new files and the new lock release block |
| The four phase test files | PASS: 66 passed. Restart 32, lock lifetime 14, lock release 12, duration 8 |
| Each `-t` filter the acceptance rows name | PASS: `research flags` 3, `research auto restart order` 1, `no post-lock move` 7, `prior lineage binding` 8, `config lineage` 8, `routes to step_release_lock` 4, `stops and synthesizes` 4 |
| `check-contract-drift.cjs` | PASS: `[CONTRACT DRIFT] OK commands=3` |
| YAML parse of the four workflow files | PASS: `yaml ok` with Python and `js-yaml ok 4` with Node |
| `npm run typecheck` in the runtime folder | PASS: exit 0 |
| Restart drill on a scratch copy of a research packet | PASS: one archive folder, generation 2 archived, generation 3 in the new config, and a repeat against the same archive name exits 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The native dispatch timeout is workflow text.** The orchestrating runtime is told the bound. No runtime script stops a native dispatch that runs past it.
2. **The duration stop leaves no row in the state log.** The row is printed. The stop reason reaches the synthesis report through the bound `reason`.
3. **A crashed run blocks its packet for twice the TTL.** That is 60 minutes at the default dispatch timeout and 120 minutes at the 3600-second cap.
4. **Two review restart gaps remain.** Review confirm `on_restart_choice` skips scope discovery, and the review restarted row uses values a fresh restart does not bind.
5. **The pivot seat dispatches are not covered.** They carry neither a lock refresh nor a timeout.
6. **The skill and reference docs still describe the old behavior.** They are phase 005's.
<!-- /ANCHOR:limitations -->

---


