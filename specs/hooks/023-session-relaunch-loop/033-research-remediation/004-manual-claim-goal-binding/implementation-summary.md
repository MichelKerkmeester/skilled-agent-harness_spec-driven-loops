---
title: "Implementation Summary"
description: "A manual first launch from the printed claim command now binds the goal packet of the note its seed names, on every runtime that takes one."
trigger_phrases:
  - "manual claim goal binding implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/004-manual-claim-goal-binding"
    last_updated_at: "2026-10-25T13:42:30Z"
    last_updated_by: "claude-opus"
    recent_action: "Built and verified the seeded first-launch goal binding"
    next_safe_action: "Commit the phase; phase 006 edits usableGoalPacket in relaunch-core.cjs"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-manual-claim-goal-binding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-manual-claim-goal-binding |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When you start a receiver by hand with the claim command a session printed, it now starts bound to the same goal a hop would have handed it. Before this, a manual start was an ordinary first launch, which drops every goal value on purpose, so the receiver started with no goal on every runtime.

### Phase 4: manual-claim-goal-binding

The wrapper looks through your launch arguments for the claim seed by its prefix, wherever the runtime puts it: positional on Claude, Pi, Codex and Cursor, after `--prompt` on OpenCode, after `-q` on Hermes, after `--` on Devin, and after the `--no-daemon` or `--standalone` the wrapper itself prepends. When it finds one, a single node call reads the note the seed names. Only an open note whose real path is inside the repository's handoffs directory counts, and its packet must pass the same switch and `goal.md` checks `consume` applies. The wrapper then exports `SESSION_RELAUNCH_GOAL_PACKET`, sets `HERMES_SPEC_FOLDER` on Hermes, and on Claude swaps that one argument for `/goal <slice>` and moves the seed into `SKILLED_LOOP_CLAIM_SEED` for the start hook. Every other argument you typed stays where you put it, and a launch with no seed makes no extra call.

The seed is read by `parseClaimSeed`, the inverse of the core's seed builder, and the packet check `usableGoalPacket` now lives in the core so the CLI and the wrapper apply one rule.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | `seeded_goal_packet` helper and the seed scan after the first-launch prepends |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `parseClaimSeed`, `goalRoots` and `usableGoalPacket`, exported |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Local `usableGoalPacket` removed; claim and consume call the core through `noteGoalPacket` |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Parser round trip with adversarial cases, and the core helper |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Six seeded first-launch tests across all seven runtimes |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Goal paragraph and the Devin and Cursor bullet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tests came first. The two core tests failed with `parseClaimSeed is not a function` and `usableGoalPacket is not a function`, and five of the six wrapper tests failed on an empty packet while their argument assertions already passed. The sixth, the ignore test, passes on the old code by nature, so it was checked the other way: with the open-state guard removed, and separately with the containment guard removed, it failed. Both guards were restored. The full suites then ran from the final tree. The change is uncommitted in the working tree on HEAD `20dfa9fec6`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `usableGoalPacket(frontmatter, switches, repoRoot)`, with `goalRoots(repoRoot, noteCwd)` moved into the core beside it | The plan sketched `(frontmatter, switches, roots)`, but the roots depend on the note's own `cwd`, so each caller would have rebuilt them. Passing the repository root keeps the logic in one place and leaves consume's output unchanged, as its existing CLI tests show |
| The parser splits at the last marker | A spec folder can never contain the marker text and a note path can, so the last marker is the one the builder wrote. That makes the parser a true inverse |
| A note counts only when its real path is inside the handoffs directory | The claim the receiver runs accepts only such notes, so the wrapper never binds a goal for a note the claim would refuse. The spec says "inside the repository", and this is the stricter form of it |
| `goal-handover.test.cjs` was not edited | That file covers the slice renderer, not consume. Consume's goal-switch behaviour is already covered by `session-relaunch-cli.test.cjs` ("consume reports the goal packet only while the switch is on..." and the two claim tests), which pass after the move, so another copy would only repeat them |
| The new wrapper tests set `SYSTEM_SESSION_RELAUNCH_ENABLED=1` | A coming change makes the hooks off by default behind that variable; main ignores it today |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | PASS, 915 of 915, exit 0 (baseline 907 of 907, +8 new) |
| `npx vitest run ... pi/session-relaunch.test.ts` | PASS, 59 of 59, exit 0 (baseline 59) |
| `bash -n` and `shellcheck -S warning` on `skilled-loop` | PASS, both exit 0 |
| `rg -n "function usableGoalPacket" .skilled/hooks/session-relaunch` | Only `lib/relaunch-core.cjs` |
| Negative controls on the ignore test | FAIL as expected with either guard removed, PASS once restored |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The receiver's seed parser differs on one odd path.** `nudge.cjs` cuts a seed at the first marker, the new core parser at the last. They agree on every path the nudge plans; only a note path that itself holds ` | Spec folder: ` would be read differently, and that path's claim already fails today. Pointing `nudge.cjs` at `parseClaimSeed` would remove the gap, but that file is outside this phase.
2. **No live run.** The optional manual Pi claim (T011) was not run; the stub-runtime tests drive the real wrapper on all seven runtimes.
3. **One README paragraph is now loose.** The Codex paragraph under "Goal In A Claude Or Hermes Receiver" says no Codex receiver is ever handed a packet. A manual Codex start from a note that carries a packet now gets the variable. Codex senders write no packet, so this happens only when a note from another runtime is claimed in Codex. The paragraph is outside the lines this phase names.
<!-- /ANCHOR:limitations -->
