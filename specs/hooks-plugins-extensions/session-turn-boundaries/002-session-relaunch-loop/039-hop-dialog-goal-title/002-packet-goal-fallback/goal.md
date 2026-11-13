---
title: "Goal: Phase 2: packet-goal-fallback"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal fallback goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback"
    last_updated_at: "2026-11-13T19:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the packet goal fallback, its tests and the checks run in worktree 366"
    next_safe_action: "None. Merged into main and pushed on 2026-11-13"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-packet-goal-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: packet-goal-fallback

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude sender that never set a goal hands on the unfinished goal of its note's packet, so the receiver starts on `/goal` without the operator typing it.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The fallback runs only when the Claude log is readable, was read whole and holds no goal entry. A goal the sender set still wins. Met, failed and cleared goals stay uncarried. |
| D2 | The carried packet is the nearest in `packetLineage(specFolder)` that passes `goalPacketProblem`, has `budgetState` `ok` and has an unticked `- [ ]` line in its durable slice. |
| D3 | A finished `goal.md` is skipped. Carrying the ending of a goal through the chain is not built. |
| D4 | No module is added and the relaunch record is not touched. |
| D5 | Claude only. Pi, OpenCode, Devin, Cursor and Codex are unchanged. |
| D6 | No live hop in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`, and `scratch/red.txt` shows `fail 1` before the edit.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` exits 0 with `fail 0`.
- [x] `git show --summary --format= c461b79a71 | rg 'create mode'` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Operator request | Done | 2026-11-13: "claude code will ask you to manually set goal after in session handover we want to bypass that somehow so it can keep working on goal without user needing to set it maybe utilize a hook or something thats auto triggered that references nested goal parent and phase goal docs" |
| Operator answers | Done | 2026-11-13, through the question tool: spec folder "C) Related: children 019 and 020 (Recommended)". Goal rule "The note's packet goal (Recommended)". Workspace "Same worktree 366 (Recommended)". After the review: "Skip finished goal docs (Recommended)". The spec folder answer was replaced by "Move to new packet 039 (Recommended)" |
| Live gap | Done | 2026-11-13, seen by the orchestrator: the sender of the hop into session `53e771b8` had no goal set, the receiver started with the claim seed only and the operator set the goal by hand. No file in this packet saves it |
| Review | Done | Fable 5.2 at medium effort through `claude2`, read-only, three findings, each checked in the code by the orchestrator. Finding 2 closed by the `whole` flag. Findings 1 and 3 narrowed by skipping finished goal docs |
| Test-first red | Done | `scratch/red.txt`: 12 tests, 11 pass, 1 fail on `resolveGoalPacket gives a Claude sender with no goal entry the nearest unfinished packet goal` |
| Tests after edit | Done | `scratch/green.txt`: 159 of 159. Rerun 2026-11-13: 159 of 159, exit 0. New CLI test rerun: 1 of 1, exit 0 |
| Mutation check | Done | Reported by the orchestrator: removing `if (!whole) return none;` fails `a log read only in part` |
| Whole suites | Done | Run by the orchestrator at the final state: relaunch and OpenCode plugin suites 1536 of 1536, goal hook suites 200 of 200, Pi adapter suite 62 of 62, the node suites with exit 0 |
| Commit | Done | `c461b79a71` on `worktrees/366-hop-after-question-dialog`. These documents are committed on the same branch |
| Packet documents | Done | 2026-11-13: spec, plan, tasks, criteria, summary and goal written from the diff, the saved runs and the orchestrator's facts. Every criterion Met |
| Validation | Done | 2026-11-13: `repair-derived.cjs --apply` re-derived the graph metadata, then `validate.sh ... --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` |
| Goal budget | Not applicable | `goal.cjs packet` prints `packet_durable_chars=2273` and `packet_budget=unknown`. A leaf phase child has no slice budget, as for sibling 001 |
| Merge and push | Done | 2026-11-13: merged into main as `bc670ffc21` and pushed, on the operator's answers "Merge to main locally (Recommended)" and "Push after tests pass (Recommended)" |

### Deviations and findings

| Item | Note |
|------|------|
| Cleared goal comes back | A goal the operator cleared by hand while criteria are still unticked comes back two hops later. `SESSION_RELAUNCH_GOAL=0` or ticking the criteria stops it |
| No live hop | The receiver starting on `/goal` from a fallback packet is proven by unit and CLI tests only. The wrapper path is unchanged and was live-proven in earlier phases 028 and 038/016 |
| CLI test red not saved | Only the resolver tests were run before the edit |
| Misplaced comment, fixed | The code commit left the `claudeSessionLogPath` comment above `packetGoalIsSettable`. Commit `085449ab6a` put it back above its function, with no change of behaviour and the resolver test file at 159 of 159 |
| Packet move | This child was written as `038-goal-and-workflow-resume/019-packet-goal-fallback` and moved here on the operator's answer "Move to new packet 039 (Recommended)". The `Spec:` line of the code commit was reworded to this folder, which changed its hash from `b0040f0516` to `c461b79a71` with the same tree |
<!-- /ANCHOR:log -->
