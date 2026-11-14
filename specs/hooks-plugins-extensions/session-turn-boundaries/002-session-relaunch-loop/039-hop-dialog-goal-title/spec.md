---
title: "Feature Specification: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title"
description: "On Claude Code a pending hand-over refuses a question dialog, a sender with no goal hands on the unfinished goal of its packet and a session with only a generated title keeps it after a hop."
trigger_phrases:
  - "hop dialog goal title phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title"
    last_updated_at: "2026-11-13T18:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Filled the phase map for three Complete children"
    next_safe_action: "None. Merged into main and pushed on 2026-11-13"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "c94686c5-0bc1-4208-81e9-35feb056d30a"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/366-hop-after-question-dialog` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop |
| **Predecessor** | 038-goal-and-workflow-resume |
| **Successor** | None |
| **Handoff Criteria** | All three children are Complete, the relaunch, OpenCode plugin, goal hook and Pi suites pass, both sync checks print `PASS` and recursive strict validation prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three gaps showed on 2026-11-13 in Claude Code sessions that hand over near the context limit.

A sender that opens a question dialog after `prepare` never hops. Only the Stop hook arms a prepared hand-over, and a dialog keeps the turn open, so Stop never fires and the record stays pending. Four of fourteen live attempts in child 016 of packet 038 ended this way.

A sender that never set a goal hands on nothing. The receiver starts with the claim seed only, and because Claude Code lets no hook set a goal, the operator types `/goal` again in every new session of a packet that already has a `goal.md`.

A session with no launch name and no `/rename` has only the title Claude generated. The hop carried no name for it, so the receiver got a new generated title and the operator could no longer tell which session continued which.

### Purpose
A Claude Code hand-over cannot be parked behind a question dialog. Its receiver starts on the unfinished goal of the packet the note names when the sender set no goal. A session that only has a generated title keeps that title, with the hop count added, in the next session.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Claude PreToolUse guard refuses `AskUserQuestion` while this session's relaunch record is pending, and names the handoff note and the cancel command in the refusal.
- The Claude goal resolver names the nearest packet in the note's spec folder lineage whose `goal.md` is within budget and still has an unticked criterion, when the session log was read whole and holds no goal entry.
- The Claude settings reader returns the last generated title, and `prepare` records it as the session name when there is no renamed title and no launch name.
- The tests for each change, the hook registry binding with the generated `.claude/settings.json` and the README lines that state the new behavior.

### Out of Scope
- Pi, OpenCode, Codex, Cursor and Devin. Each child changes Claude Code only.
- A live hop. None was run for any child, and each child records that as a known limitation.
- Other dialogs that hold a turn open, such as a plan approval. The guard matches `AskUserQuestion` only.
- Carrying the ending of a goal through the hop chain. It needs a new note field, and the operator chose to skip finished goal documents instead.
- A new module or a new relaunch record key.

### Files to Change
Files touched across all phases, for the audit trail. Each child's `plan.md` holds the detail.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modify | 001 | Deny a question dialog over a pending hand-over of this session |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Modify | 001 | One denial test and five pass-through tests |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | 001 | The `AskUserQuestion` PreToolUse binding |
| `.claude/settings.json` | Modify | 001 | Generated from the registry |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | 001 | The new matcher and the denial |
| `.skilled/hooks/README.md` | Modify | 001 | The new matcher in the concern table |
| `.skilled/hooks/session-relaunch/README.md` | Modify | 001, 002, 003 | The new matcher, the goal fallback and the generated title fallback |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | 002, 003 | The packet goal fallback with its whole-log flag, and the generated title passed through the settings resolver |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | 002 | The fallback test and the ended or unreadable test |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | 002, 003 | `prepare` cases for the goal packet and for the recorded name |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify | 003 | The settings reader returns the last generated title |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | 003 | `prepare` falls back to the generated title for the name |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` | Modify | 003 | Generated title cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-sender-dialog-after-prepare/ | The Claude PreToolUse guard refuses a question dialog while this session's hand-over is pending, so the turn ends and the Stop hook can arm the hop | Complete |
| 2 | 002-packet-goal-fallback/ | A Claude sender whose whole session log holds no goal entry hands on the nearest unfinished packet goal in the note's spec folder lineage, so the receiver starts on it | Complete |
| 3 | 003-generated-title-carry/ | `prepare` records the title Claude generated as the session name when there is no renamed title and no launch name, so the receiver keeps it with the hop count | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-sender-dialog-after-prepare | 002-packet-goal-fallback | Phase 001 is Complete and the relaunch and OpenCode plugin suites pass | `validate.sh 001-sender-dialog-after-prepare --strict` RESULT: PASSED and no row of `001-sender-dialog-after-prepare/acceptance-criteria.md` is Unmet |
| 002-packet-goal-fallback | 003-generated-title-carry | Phase 002 is Complete and the relaunch, OpenCode plugin and goal hook suites pass | `validate.sh 002-packet-goal-fallback --strict` RESULT: PASSED and no row of `002-packet-goal-fallback/acceptance-criteria.md` is Unmet |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does each fix hold in a live hop? No live hop was run for any child. Each rests on unit and CLI tests, and each child's known limitations name what a live run would confirm.
- Do Pi, OpenCode or Codex hold a prepared hand-over open behind a dialog the same way? Not examined.
- Under research: close the gaps, unknowns and open ends of packets `038-goal-and-workflow-resume` and `039-hop-dialog-goal-title` of the session relaunch loop. Find what a Claude `/rename` made in the mobile app writes and whether a hop can carry it, check each recorded known limitation of both packets against the code, name the smallest set of live runs that proves the fixes not yet run live, explain the open packet-level and parent-level items, and name the smallest change for each gap that survives.

**Research Context:** a deep-research run covered the topic above on 2026-11-13. `research/research.md` is the canonical source for its findings.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Findings of the 2026-11-13 deep-research run, abridged from `research/research.md`. The ten iterations ran nothing against a live runtime. One finding rests on what the orchestrating session observed about its own hop.

- Every relaunch wrapper running on 2026-11-13 started before the name-carry code landed in `.skilled/bin/skilled-loop`, and a wrapper runs the code it started with. No session those wrappers launched has a `--name` flag. The cause is inferred. One hop from a freshly started wrapper confirms or refutes it.
- `prepare` reads a Claude name from the transcript only. Claude keeps a second title store under `~/.claude/sessions` that no relaunch code reads. What a rename in the mobile app writes is unconfirmed.
- A hop is a new session in the app. Whether the app title follows `--name`, and whether a replayed `--remote-control <old name>` outranks it, is unconfirmed.
- Child 001: a pending record that Stop cannot arm blocks every question until `cancel`, except after a background-task deferral. `ExitPlanMode` and permission prompts are not guarded. A record with no `handoff` is treated as pending. Pi, OpenCode and Codex have no guard.
- Child 002: a goal cleared by hand comes back one hop later, and the fallback can pick any ancestor with an open criterion.
- Child 003: a generated title that ends in the sender's own hop number loses that number.
- Packet 038: each of its 49 recorded limits has a verdict. Five are refuted, among them two stale rows in the summary of child 011.
- Parent level: the 002 parent goal binds neither 038 nor 039 and has seven characters left. Phase 033 says Draft while its nine children say Complete. The sk-git sentence that a rebase keeps a `Commit-Id` is wrong.
- Ten shipped fixes or groups of fixes have no live hop behind them. Six live runs close what a live run can close.
- These changes fall outside this packet's frozen scope. `research/research.md` section 9 ranks 23 of them and section 10 names five operator decisions.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
