---
title: "Goal: OpenBot parity research for skilled bots"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "openbot parity research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research"
    last_updated_at: "2026-11-24T19:02:43Z"
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
# Goal: OpenBot parity research for skilled bots

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Find the smallest set of OpenBot parts a small team needs from skilled bots, and where to borrow each one, so a build packet can start from a ranked list.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One `/deep:research` run in expansive depth mode, four lineages of 13 iterations: two on Devin `deepseek-v4-1-flash-max`, two on Vibe `deepseek-flash`, with the stop policy set to max iterations |
| D2 | A lineage that runs out of usage is topped up on Codex `gpt-6-luna` at `xhigh` with the `fast` tier, never on DevPass |
| D3 | The use case is a small team. Enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts go on a skip list with reasons |
| D4 | A terminal experience is preferred over a desktop app when it can match OpenBot's |
| D5 | The packet ends at a recommendation. Nothing is built here |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] At least 50 iteration records under `research/`, each with `target_agent: "deep-research"` and `agent_definition_loaded: true`
- [x] `research/research.md` names all eight OpenBot bot parts with a resolving `[SOURCE: path:line]` each, plus a terminal verdict, a small-team section and a skip list
- [ ] `validate.sh --strict` on this packet prints `RESULT: PASSED`
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
| T001 context link | Done | `ls specs/system-skilled-bots/context \| wc -l` printed 8 |
| T002 executor probes | Done | Devin and Codex each printed `PONG`, exit 0. Vibe `3.1.2` with its keychain key |
| T004 fan-out run | Done | 4 lineages x 13 iterations = 52, each lineage exit 0, no fallback needed |
| T006 synthesis | Done | `research/research.md`, 69 of 69 citations resolve |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1, not Level 2 | `recommend-level.sh` printed Level 0, and the authoring card says to use Level 1 and not raise it |
<!-- /ANCHOR:log -->
