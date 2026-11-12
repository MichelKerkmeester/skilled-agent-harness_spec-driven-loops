---
title: "Goal: Research which fresh-context plan checks fit spec-kit and how chat sessions stay on their workflow"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/001-research-egm-checks-and-chat-path-gaps"
    last_updated_at: "2026-11-11T21:40:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Research which fresh-context plan checks fit spec-kit and how chat sessions stay on their workflow

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Sourced findings state which Elephant-Goldfish checks fit the planning steps and how a chat-started loop is kept on its workflow.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase produces findings only. No skill, template, workflow or script file changes. |
| D2 | Invalid single-session runs stay in `research_archive/` as incident evidence. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `research/research.md` exists and names the fan-out refusal as its verdict
- [x] `research_archive/2026-11-11T20-11-35Z/research.md` exists with the chat-path edit set
- [x] `scratch/trust-checks.md` records each trust check with the command that settled it
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
| Phase opened | Done | Three criteria checked 2026-11-11 |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the spec review pass | Criteria come from `../scratch/phase-facts.md` and get rechecked against the reviewed spec |
<!-- /ANCHOR:log -->
