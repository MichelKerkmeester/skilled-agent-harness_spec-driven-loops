---
title: "Implementation Summary: The wrapper starts without a leftover relaunch record"
description: "The skilled-loop wrapper now removes a relaunch record that already carries its own loop id before the first launch, so a record left by an earlier process with the same id cannot be read as this loop's hand-over."
trigger_phrases:
  - "loop start record cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup"
    last_updated_at: "2026-11-12T14:33:52Z"
    last_updated_by: "generate-context"
    recent_action: "Closed all seven children and ran the goal gate"
    next_safe_action: "Await the operator's decision on commit and merge of worktree 351"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/claude/subagent-guard.mjs"
    session_dedup:
      fingerprint: "sha256:2f7c3505fda52ce36c1e5edee30448c52be5d504fb4e02b7133c700d3862e7fa"
      session_id: "scaffold-007-loop-start-record-cleanup"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-loop-start-record-cleanup |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A loop can no longer inherit a hand-over it never made. The wrapper's loop id is its process id, and process ids are reused. Before the first launch the wrapper now removes the one record file that carries its own id. Records of other loops stay.

### Phase 7: loop-start-record-cleanup

The wrapper reads `relaunch-<loop id>.json` after a runtime exits to decide whether to start the next session. A wrapper that died without consuming its record left that file behind. A later wrapper that received the same process id would have read it as its own.

The cleanup runs once, after the loop id is set and before the launch loop. It asks the core module for the record path, and only when the state directory is a real directory that you own. It removes that one path with `rm -f`. When the lookup cannot run, the launch goes ahead unchanged. No signal trap was added and the loop id is generated as before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Removes this loop's own record before the first launch, with the path built by `relaunchFilePath` behind the state directory check |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Adds the own-record case with a runtime-start probe, the other-loop case and the symlinked-record case, with a launcher that plants a record under the wrapper's own process id |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at max built the change through OpenCode Go in two passes, and the orchestrator reran every command outside the builder's session. The own-record case failed before the fix: `scratch/red.txt` records 2 tests, 1 pass and 1 fail, the runtime-start probe reading `present`. SWE reviewed the diff read-only through Devin and returned PASS with no finding. The orchestrator then found that the plan's adversarial list names an own record that is a symlink and no case covered it. The second pass added that case, which passed without a wrapper change, as expected: `rm` removes the link and leaves its target. The final runs are `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree` on branch `worktrees/351-session-relaunch-review-remediation`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The record path comes from the core module | The state directory then keeps one owner for its naming and its safety check, and the wrapper holds no second copy of either |
| The cleanup is skipped for a state directory that fails the check | A removal must not follow a symlinked or foreign-owned directory |
| A cleanup that cannot run leaves the launch intact | A missing `node` or a core error must not stop a session from starting |
| No signal trap | The phase goal excludes it, and removing the record at the next start covers a wrapper that died without one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | PASS: 184 tests, 184 pass, 0 fail, exit 0, in `scratch/green.txt` (181 before this phase) |
| The own-record case before the fix | FAIL as required: 2 tests, 1 pass, 1 fail in `scratch/red.txt` |
| `--test-name-pattern 'leftover'` on the wrapper file | PASS: 3 pass, 0 fail |
| The two named patterns with `--test-reporter=tap` | PASS: each prints `# pass 1` and `# fail 0` |
| `bash -n .skilled/bin/skilled-loop` | PASS: exit 0 |
| `rg -n 'relaunchFilePath' .skilled/bin/skilled-loop` | PASS: one line, the cleanup's path lookup |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | PASS: 862 tests, 862 pass, 0 fail, exit 0, in `scratch/green-full.txt` |
| `node --test .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 65 tests, 65 pass, 0 fail, exit 0, in `scratch/green-opencode.txt` |
| Pi vitest suite | PASS: 59 passed, exit 0 |
| SWE review through Devin, read-only | PASS with no finding |
| Second SWE review through Devin, read-only, on the later passes | PASS with one P2: the symlink case passed without the cleanup, because the wrapper consumes the record after the runtime exits. The case now reads the launch-time probe. With the cleanup replaced by a no-op it fails, in `scratch/mutation.txt` (3 tests, 1 pass, 2 fail), and with the real wrapper all three pass |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The wrapper starts one more `node` process.** The path lookup runs once per wrapper start. Its cost was not measured.
2. **The record's lock directory is not removed.** A `relaunch-<id>.json.lock` left by the same dead process stays and is reclaimed by age, which phase 006 covers.
3. **An own record that cannot be removed has no case.** The plan lists that row. `rm -f` fails quietly and the launch goes ahead, and the record is then read as before this phase.
4. **The mutation run is not part of the suite.** Proving that a case fails without the cleanup means editing the wrapper by hand. `scratch/mutation.txt` records the one run.
<!-- /ANCHOR:limitations -->

---


