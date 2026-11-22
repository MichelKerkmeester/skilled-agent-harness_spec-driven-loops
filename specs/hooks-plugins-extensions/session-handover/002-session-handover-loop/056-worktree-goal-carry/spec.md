---
title: "Feature Specification: Phase 56: worktree-goal-carry"
description: "A Claude session whose goal packet exists only in a linked git worktree hands over with no goal, because the resolver searches only the repository checkout and the note's working directory. This phase finds the packet in the worktrees the session log names, records that worktree on the note and renders the receiver's goal slice from it."
trigger_phrases:
  - "worktree goal carry"
  - "phase 56 worktree goal carry"
  - "goal_root worktree"
  - "goal not carried worktree"
  - "goal packet in a linked worktree"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 56: worktree-goal-carry

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/509-handover-worktree-goal-carry` |
| **Parent Spec** | ../spec.md |
| **Phase** | 56 of 56 |
| **Predecessor** | 055-cross-checkout-root-pinning |
| **Successor** | None |
| **Handoff Criteria** | Node suite, OpenCode plugin suite and hooks vitest all pass. The two CLI carry tests and both wrapper tests fail on the old code. The tampered-root test fails on the old code too, because the old code carries the repository's older copy of the packet. The four review-remediation tests fail on the code before the review fixes (`scratch/remediation-red.txt`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 56** of the session-handover loop. It follows an operator instruction: session handovers set the goal automatically, and the operator is never asked to paste a goal slice again.

**Scope Boundary**: the goal packet resolver and note fields in `lib/relaunch-core.cjs`, the hand-over CLI's `prepare`, `keep`, `consume` and `claim`, the wrapper's goal slice render in `.skilled/bin/skilled-loop`, their tests and the two docs that describe the goal fields.

**Dependencies**:
- `git worktree list --porcelain` names the repository's checkouts.
- `goal.cjs packet <packet> --workspace <root>` renders a slice from any checkout that holds the packet and the budget manifest.

**Deliverables**:
- A Claude goal whose packet lives only in a linked worktree is carried with a `goal_root` field, and the relaunched Claude session starts on `/goal <slice>` read from that worktree.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator worked packet `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` in worktree 505 from a Claude session whose working directory was the primary checkout. The packet exists only in that worktree, so the note's `spec_folder` stayed empty and the goal text names no `specs/` path. `prepare` searched the primary checkout and the note's working directory, found nothing and wrote no `goal_packet`, so hops 2 and 3 relaunched with no goal and the operator had to set it by hand.

### Purpose
A Claude hand-over carries a goal whose packet lives only in a linked worktree the session worked in, and the receiver starts on that goal without the operator typing it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e '<resolveGoalPacketResult for session 123e1c5d, roots = primary checkout and the note cwd>'   # unchanged core
OLD {"packet":"","reason":"the active goal names no packet this hand-over can find","ended":false} 2323ms

$ node --test --test-name-pattern='linked worktree|two linked worktrees|not a linked worktree' session-handover-cli.test.cjs   # unchanged core
    actual: '[session-handover] goal not carried: the active goal names no packet this hand-over can find\n',
    expected: '',

$ grep -o 'worktrees/public/[0-9]*-[a-z0-9-]*/' 123e1c5d-fd97-4045-b198-d3b23df4bbdd.jsonl | sort | uniq -c
 268 worktrees/public/505-mcp-browser-use-hub/

$ time (find /Users/michelkerkmeester/worktrees/public/*/specs -name goal.md | wc -l)
   27776   14.343 total
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Search the linked worktrees the session log names when the usual roots hold no packet with the goal's opening line, and accept a match only when exactly one worktree and packet pair carries it.
- Record the worktree as `goal_root` beside `goal_packet`, written and removed by `prepare` and `keep`.
- Accept a note's `goal_root` only while `git worktree list` names it, and report it from `consume` and in the `claim` goal line.
- Render the relaunched Claude session's goal slice from `goal_root`, on a hop and on a seeded first launch.
- Added after the second-account review: a stale `goal_root` never falls back to another checkout, git repository variables are stripped before listing worktrees, and the claimed note's `goal_root` counts as a named worktree.
- Added after the deep review: the worktree search reads the whole log, the claimed note's `goal_root` wins over a primary copy and over a second log-mentioned worktree, and a worktree git marks `prunable` is never trusted.

### Out of Scope
- Moving the receiver's working directory into the worktree. The goal is start-prompt text, and a moved directory would change which hooks, state directory and `CLAUDE.md` the receiver reads.
- Accepting a worktree-only `spec_folder`. The receiver resumes that path from its own working directory, where it does not exist.
- Walking every worktree. One walk of all 26 took 14 seconds, which a hand-over cannot spend.
- A Pi or OpenCode receiver of a worktree packet. Both bind `SESSION_HANDOVER_GOAL_PACKET` against their own checkout and still skip a packet they cannot find.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | Worktree listing without prunable entries, whole-log worktree search, claimed-root precedence, `goal_root` field, `usableGoal` |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modify | Write `goal_root` on prepare, report it on consume and claim |
| `.skilled/bin/skilled-loop` | Modify | Pass `goal_root` to the slice render on a hop and a seeded first launch |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modify | Nine CLI worktree tests: happy path, two-worktree refusal, tampered root, claimed note without a log path, `GIT_DIR`, a mention before the last 16 MiB, claimed root over a primary copy, claimed root over a second worktree, prunable worktree |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Modify | Hop and first launch start on `/goal <slice>` from the worktree |
| `.skilled/hooks/session-handover/tests/relaunch-core.test.cjs` | Modify | `goal_root` written with its packet and never left behind |
| `.skilled/hooks/session-handover/goal-carry-over.md` | Modify | Document the worktree search and `goal_root` |
| `.skilled/hooks/session-handover/troubleshooting.md` | Modify | Name the worktree case under the missing goal packet entry |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md` | Modify | Name the worktree search and `goal_root` in the goal carry-over entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `prepare` carries a Claude goal whose packet lives only in a linked worktree the log names | The CLI test `prepare carries a Claude goal whose packet lives only in a linked worktree` passes: empty stderr, note holds `goal_packet` and `goal_root`, consume reports both |
| REQ-002 | The relaunched Claude session starts on the goal from that worktree | The wrapper tests `a Claude hop sets the goal ...` and `a seeded Claude first launch sets the goal ...` pass and fail on the old wrapper |
| REQ-003 | A `goal_root` git does not list as a worktree of this repository is ignored | The CLI test `consume and claim drop a goal_root that is not a linked worktree` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Two worktrees carrying the headline refuse, like two packets do | The CLI test `prepare refuses a worktree goal headline that two linked worktrees carry` prints `the active goal headline appears in more than one packet`. This also changes the primary-checkout refusal, which used to print `appears in 2 packets` |
| REQ-005 | No regression in the session-handover suites | Node suite, OpenCode plugin suite and hooks vitest pass with counts against the baseline |
| REQ-006 | A worktree listing ignores git repository variables the caller exported | The CLI test `prepare lists this repository worktrees even when GIT_DIR names another repository` passes |
| REQ-007 | The claimed note's `goal_root` counts as a named worktree when the log names none | The CLI test `prepare carries the worktree goal of the note this session claimed when its log names no worktree path` passes |
| REQ-008 | The worktree search sees every log byte the goal reader sees | The CLI test `prepare finds a worktree the log names only before its last 16 MiB` passes, with the path straddling a scan chunk boundary |
| REQ-009 | The claimed note's `goal_root` wins while it still holds the packet with the headline | The CLI tests `prepare keeps the claimed worktree goal ahead of a primary copy with the same headline` and `prepare keeps the claimed worktree goal when the log also names a second worktree with it` pass |
| REQ-010 | A worktree git marks `prunable` is neither searched nor trusted as a `goal_root` | The CLI test `a worktree git marks prunable is neither searched nor trusted as a goal_root` passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new core resolves the real session 123e1c5d to `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` with `root` `/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub`, and `renderGoalSlice` returns `ok` for it.
- **SC-002**: `node --test .skilled/hooks/session-handover/tests/*.test.cjs` passes every test, 1073, up from the 1065 baseline by the new cases, then 1077 after the deep-review remediation added four.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git` on the PATH | No git means no worktree list | The listing fails closed to an empty list, so the hand-over behaves as before |
| Risk | A hand-edited `goal_root` points the slice render at an arbitrary directory | High | The root counts only while `git worktree list` names it, and packet containment is checked inside it |
| Risk | A session that touched two worktrees with the same packet picks the wrong copy | Med | Matches are keyed by worktree and packet, so two copies refuse unless the claimed note's `goal_root` holds one of them, which is the copy this session's goal came from |
| Risk | The trust base is any worktree git lists, and the log mentions a model writes decide which are searched | Low | Accepted residual: a listed worktree is a checkout of this repository, packet containment is checked inside it, and two matches refuse |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
