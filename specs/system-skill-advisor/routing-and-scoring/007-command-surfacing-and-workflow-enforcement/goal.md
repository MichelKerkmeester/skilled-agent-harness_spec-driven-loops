---
title: "Goal: Research how the skill advisor should surface slash commands and how native chat reaches the proper command workflow without the user typing a command"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "command surfacing and workflow enforcement goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/007-command-surfacing-and-workflow-enforcement"
    last_updated_at: "2026-11-12T09:26:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Research how the skill advisor should surface slash commands and how native chat reaches the proper command workflow without the user typing a command

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Establish, with repository evidence from three model lenses, how the skill advisor should surface every slash command with a run-or-ask decision and how a chat-only request reaches the proper command workflow.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The research runs through the `/deep:research:auto` workflow as a fan-out, never a hand-rolled loop |
| D2 | Three lineages of 10 iterations: `cli-codex` Luna max fast, `cli-pi` DeepSeek V4.1 Flash max through LLM Gateway, `cli-opencode` DeepSeek V4.1 Flash max through OpenCode Go |
| D3 | The packet ends at the synthesis and changes no runtime code |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `research/lineages` holds three lineage directories with iteration files
- [x] `research/research.md` exists and answers the ten angles in `spec.md`
- [x] `validate.sh --strict --quiet` on this packet prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet and angles | Done | `spec.md` section 3 lists ten angles |
| Fan-out run | Done | `orchestration-summary.json`: 3 succeeded, 0 failed, 10 iterations each |
| Merged synthesis | Done | `research/research.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The OpenCode lineage runs on `opencode1` 1.19.4 | OpenCode 2.2.7 lists no `opencode-go` models, and OpenCode 1 does |
| Pi is pinned to 1.5.0 for the run | Pi 1.5.2 fails to load 16 repository extensions, repaired in its own packet |
<!-- /ANCHOR:log -->
