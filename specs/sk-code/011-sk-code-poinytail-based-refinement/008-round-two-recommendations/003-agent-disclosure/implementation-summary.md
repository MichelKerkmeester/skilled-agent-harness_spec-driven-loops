---
title: "Implementation Summary"
description: "The code, debug and orchestrate agents gained a reach list, a not-checked disclosure, a harness read, a hypothesis count and a Reach field in their canonical and Claude copies. The generated Codex, Pi and Hermes copies wait for the orchestrator to regenerate them."
trigger_phrases:
  - "agent disclosure implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/003-agent-disclosure"
    last_updated_at: "2026-10-10T07:46:21Z"
    last_updated_by: "builder-003-agent-disclosure"
    recent_action: "Hand edits to the six authored agent files are in and verified; generated copies not regenerated"
    next_safe_action: "Committed with its sibling children in folder order"
    blockers:
      - "Codex, Pi and Hermes copies await the orchestrator's regeneration run"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-003-agent-disclosure"
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
| **Spec Folder** | 003-agent-disclosure |
| **Completed** | 2026-10-10 (build done, generated copies pending) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three agents that do code work now say what they reach and what they did not check. The code agent lists every place a change must reach before it edits, and it ends its RETURN with a required `**Not checked:**` line. The debug agent reads the test harness before any reproduction, states how many hypotheses it left out, and ends each of its three response shapes with the same not-checked line. The orchestrator Task Format gained a `Reach:` field directly after `Scope:`, so a leaf starts with the reach set in hand.

### Phase 3: agent-disclosure

The added text is identical in each canonical file under `.skilled/agents` and in its Claude fork under `.claude/agents`. The Claude forks were edited by hand, because they are the authored copies. The Cursor and Devin copies are symlinks into the Claude forks, so they show the same text without an edit. The Codex, Pi and Hermes copies are generated and were not edited by hand. They still carry the old text until the orchestrator runs the sync scripts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/code.md` | Modified | Reach checklist item, `**Not checked:**` line in the RETURN, `not_checked` in the Required fields list |
| `.skilled/agents/debug.md` | Modified | Harness read as Phase 2 item 1, hypothesis count in Phase 3, not-checked line in each response shape |
| `.skilled/agents/orchestrate.md` | Modified | `Reach:` field in the Task Format, directly after `Scope:` |
| `.claude/agents/code.md`, `.claude/agents/debug.md`, `.claude/agents/orchestrate.md` | Modified | The same three edits, by hand |
| `.codex/agents/*.toml`, `.pi/agents/*.md`, `.hermes/skills/agent-*/SKILL.md` (nine copies) | Awaiting regeneration | Written by the three sync scripts in write mode, run once by the orchestrator |
| `scratch/` | Created | Scope snapshots and before-copies of the 15 touched paths |
| `implementation-summary.md`, `goal.md`, `description.json`, `graph-metadata.json` | Modified | Close-out records and derived metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran tasks.md in order. Before any edit, it captured the scope snapshots, the before-copies of the 15 touched paths, the seven mirror and rule checks, and the authoring validator results. The six authored files were then edited with the exact text from plan.md section 3. Each canonical file and its fork were checked for placement, presence counts, fork diff counts and validator output.

Per the parallel build order, the three generators were not run in write mode. Each one rewrites every drifted copy it finds, and a second builder works on the review agent in the same worktree. Their check modes were run to record the drift, and it names only the code, debug and orchestrate copies. No commit was made.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The not-checked disclosure is a native required field of the code RETURN | `agent-io-contract.md` fixes only the optional result envelope, and no script reads the code RETURN fields. The contract file therefore stays unchanged, as the parent decision requires. |
| The added text names no path, and it has no em dash or triple single quote | The same text reads identically in the canonical and Claude copies, and it sits safely inside the Codex TOML literal string. |
| The Blocked and Escalation shapes take a blank line before the not-checked line, as the Resolution shape does | The disclosure stays apart from the bracketed body in all three shapes. tasks.md named the blank line only for the Resolution shape, so this is a small deviation, recorded here. |
| The generated copies were not regenerated in this build | The parallel build order gives regeneration to the orchestrator after both builders finish, so the sync scripts cannot overwrite a sibling builder's copies. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| C1: presence counts across the six authored files | PASS. `rg -c` prints code 3, debug 5 and orchestrate 1 in both the canonical and the Claude copies. Exit 0. |
| C2: mirror, runtime, roster and rule checks | PASS on orchestrator rerun: agent mirrors 12 in sync, runtime mirrors 187 in sync, STATUS=OK agent-roster-mirror, rule invariants OK; exit 0 |
| C3: Codex, Pi and Hermes `--check` | PASS on orchestrator rerun after one run of each generator: Codex and Pi 12 agents in sync, Hermes 70 copies in sync; exit 0 |
| C4: Hermes scope and protected-path diff | PASS on orchestrator rerun after the review-contract commit: `.hermes` shows exactly agent-code, agent-debug and agent-orchestrate; protected-path diff empty, exit 0 |
| C5: authoring validator, `Total issues: 1` six times | PASS. Six `Total issues: 1` lines and exit 0. The kebab checker exits 0 on all six files. |
| C6: `validate.sh --strict` prints `RESULT: PASSED` | PASS. The strict run prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`, exit 0. |

Supporting checks: the fork diff counts hold at 34, 22 and 14, as they were before the edit. The runtime-mirror, roster and rule-copy checks pass. `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Generated copies are pending.** Until the orchestrator runs the three sync scripts in write mode, criteria C2 to C4 fail as shown above, and the Codex, Pi and Hermes agents do not yet carry the new text. The completion percentage stays below 100 until then.
2. **Codex write access.** The packet records an earlier EPERM refusal on `.codex/`. That refusal was not reproduced here, because write mode was not run. If the Codex write is refused, the copies cannot be regenerated, and the right move is to stop and report, not to hand-edit.
3. **Objective and criteria.** `authoring-standards.md` section 4 asks that the criteria repeat in the objective. The goal keeps the one-sentence objective from the brief, and the orchestrator decides that conflict.
4. **Sibling writes in the shared worktree.** Child 002 (review agent) changed `review.md`, its Claude fork and the sk-code review files after this build's baseline. Those writes add review drift to the Codex, Pi and Hermes checks and make the protected-path diff non-empty. The orchestrator's generator run must rewrite the review copies and the Hermes sk-code-review copy as well, because each Hermes run rewrites every drifted copy it finds.
<!-- /ANCHOR:limitations -->

---

