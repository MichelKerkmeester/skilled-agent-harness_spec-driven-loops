---
title: "Implementation Summary"
description: "A Claude hand-over now carries a goal whose packet lives only in a linked git worktree. The resolver finds the packet in the worktrees the session log names, the note records that worktree as goal_root, and the relaunched session starts on /goal with the slice read from it."
trigger_phrases:
  - "worktree goal carry implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry"
    last_updated_at: "2026-11-21T22:26:35Z"
    last_updated_by: "generate-context"
    recent_action: "Remediated deep-review findings; suites green"
    next_safe_action: "Run doc and skilled alignment on 509"
    packet_purpose: "Purpose: A Claude hand-over carries a goal whose packet lives only in a linked worktree the session worked in, and the receiver starts on that goal without the operator typing it."
    blockers: []
    key_files:
      - ".skilled/hooks/session-handover/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-handover/tests/session-handover-cli.test.cjs"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:474727a143bc7559f208fb288d88d464323ae736a401c89da899540494bf4d59"
      session_id: "scaffold-056-worktree-goal-carry"
      parent_session_id: null
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
| **Spec Folder** | 056-worktree-goal-carry |
| **Completed** | 2026-11-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You no longer set the goal by hand after a hop when your packet lives in a linked git worktree. The hand-over finds the packet in that worktree, writes the worktree on the note and starts the next Claude session on `/goal <slice>` read from it.

### Phase 56: worktree-goal-carry

The Claude goal resolver used to search only the primary checkout and the note's working directory. A session that worked in worktree 505 from the primary checkout therefore handed over with `goal not carried: the active goal names no packet this hand-over can find`. When those roots now hold no match, the resolver lists the repository's worktrees with git. It walks only the ones whose path the session log names, and accepts a packet only when exactly one worktree and packet pair carries the goal's opening line.

The note gets `goal_root` beside `goal_packet`. `consume`, `claim` and the wrapper accept it only while git still lists it as a worktree of this repository. The wrapper renders the slice from that worktree alone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modified | `repositoryWorktrees`, `worktreeHeadlinePackets`, `usableGoal` and the `goal_root` field |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modified | Writes `goal_root` on prepare and keep, reports it on consume and in the claim goal line |
| `.skilled/bin/skilled-loop` | Modified | Passes `goal_root` to the slice render on a hop and a seeded first launch |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modified | Worktree happy path, two-worktree refusal, tampered root |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Modified | Hop and seeded first launch start on the worktree goal |
| `.skilled/hooks/session-handover/tests/relaunch-core.test.cjs` | Modified | `goal_root` written with its packet and never left behind |
| `.skilled/hooks/session-handover/goal-carry-over.md` | Modified | The worktree search, `goal_root` and the slice root |
| `.skilled/hooks/session-handover/troubleshooting.md` | Modified | The worktree case under the missing goal packet entry |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md` | Modified | The worktree search and `goal_root` in the goal carry-over entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three CLI tests were written first and failed on the old core with the same reason the real hops printed. The core, CLI and wrapper changes followed. The two wrapper tests were then run against the unchanged wrapper, where both fail, and against the new one, where both pass. The full node suite, the OpenCode plugin suite and hooks vitest ran last, and a read-only probe resolved the real failed session.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the worktree on the note as `goal_root` | `consume`, `claim` and the wrapper re-check the packet against the primary checkout and would drop it. Re-searching there could also pick a different copy of the packet. |
| Walk only the worktrees the session log names | A walk of all 26 worktrees took 14 seconds. A worktree the session never touched also proves nothing about its goal. |
| Search worktrees only after the usual roots find nothing, except the claimed note's `goal_root` | A packet that exists on main and in a worktree keeps resolving the way it did before. The claimed note's worktree is asked first, because it is where this session's goal came from. |
| Keep the receiver's working directory | Moving it would change which hooks, state directory and `CLAUDE.md` the receiver reads. The goal is start-prompt text, so the recorded root is enough. |
| Fix three P2s from an independent Opus 5.5 medium review on the second Claude account | A stale `goal_root` no longer falls back to another checkout, git repository variables are stripped before listing worktrees, and the `goal_root` of the claimed note counts as named so the next hop keeps the goal. Each new test fails with its fix undone. |
| Leave `spec_folder` unchanged | The receiver resumes that path from its own working directory, where a worktree-only packet does not exist. |
| Fix the deep review's P1 and four P2 code findings (`review/review-report.md`) | The worktree search now reads the whole log in fixed chunks, the claimed note's `goal_root` wins over a primary copy and a second log-mentioned worktree, a `prunable` worktree is never trusted, and both refusals read `the active goal headline appears in more than one packet`. The primary-checkout refusal used to print `appears in 2 packets`, so its stderr changed too. Each new test fails on the code before the fixes (`scratch/remediation-red.txt`). |
| Decline a uniform `root` key on every `resolveGoalPacketResult` path | `root` is a documented optional key. Adding it everywhere would change seven `deepEqual` assertions, the OpenCode plugin test among them, for no change in behavior. |
| Accept the trust-base residual | Any worktree git lists is a checkout of this repository, packet containment is checked inside it, and two matches refuse. The risk table in `spec.md` records it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-handover/tests/*.test.cjs` | PASS, 1073 of 1073, exit 0 (baseline 1065 of 1065) |
| `node --test .opencode/plugins/tests/session-handover.test.cjs` | PASS, 75 of 75, exit 0 (baseline 75 on primary main) |
| `npx vitest run --config hooks/vitest.config.ts` from `.skilled` | PASS, 509 of 509, exit 0 (baseline 509 on primary main) |
| Wrapper worktree tests against the unchanged wrapper | FAIL as expected, pass 0 and fail 2 |
| Real session 123e1c5d through the remediated core (claimed-root precedence, whole-log scan) | Packet `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` with root worktree 505: 1234 ms on the first call, 575 and 598 ms on two warm repeats. The pre-remediation core took 2088 ms; the old core gave no packet in 2323 ms. |
| `renderGoalSlice` for that packet and root | `ok`, 3130 characters, starting `# Goal: mcp-browser-use hub` |
| Deep-review remediation, seven selected CLI tests on the code before the fixes | `pass 2`, `fail 5`, each failing for the case it targets (`scratch/remediation-red.txt`) |
| The same seven on the fixed code | `pass 7`, `fail 0`, exit 0 (`scratch/remediation-green.txt`) |
| The 16 MiB test with the scan chunk overlap set to 0 | FAIL as expected, the path straddling the chunk boundary is missed |
| Node suite after the remediation | PASS, 1077 of 1077, exit 0 (baseline 1073 of 1073) |
| OpenCode plugin suite and hooks vitest after the remediation | PASS, 75 of 75 and 509 of 509, both exit 0 (baselines 75 and 509) |
| `validate.sh <this packet> --strict` | `RESULT: PASSED`, Errors 0, Warnings 0, after `repair-derived.cjs --apply` re-derived the graph metadata the spec edits had left stale |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A changed goal is not re-set inside a session.** Claude has no goal tool a model can call, so a `goal.md` slice that changes mid-session reaches Claude on the next hop, not before.
2. **The log or the claimed note must name the worktree.** A session that edited the worktree only through paths its log never records, and that claimed no note with a `goal_root`, carries no goal. The `goal not carried` line on stderr says so.
3. **Only a Claude receiver gets a worktree packet.** Pi, OpenCode, Vibe, Devin and Cursor bind `SESSION_HANDOVER_GOAL_PACKET` against their own checkout, which can hold an older copy of the same packet. `skilled-loop` therefore leaves the variable unset for them when the note carries a `goal_root`, on a hop and on a seeded first launch, and prints one warning line naming the worktree. Two wrapper tests cover the Pi hop and the seeded Pi first launch, and both fail with the check removed.
<!-- /ANCHOR:limitations -->

---
