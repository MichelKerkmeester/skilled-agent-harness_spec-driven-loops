---
title: "Goal: Phase 10: post-fix-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "post fix research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/010-post-fix-research"
    last_updated_at: "2026-10-19T20:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Checked all three completion criteria"
    next_safe_action: "Operator decides which verified findings to fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: post-fix-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Five more research iterations on the session relaunch loop after phase 009, run with DeepSeek V4.1 Flash at max through cli-pi on LLM Gateway, end with every finding verified at its cited line.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The run uses its own `research/` in this folder; the parent's `research/` stays as it is, as the operator chose on 2026-10-19. |
| D2 | Research only. Fixing a verified finding is a later phase the operator opens. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The cli-pi lineage ends `fulfilled` with five iterations and no gateway refusal (AC-001)
- [x] `research/research.md` gives every finding a verdict and a verified severity (AC-002)
- [x] The parent names this phase, and `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` prints `RESULT: PASSED` (AC-003, AC-004)
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
| Lineage run | Done | `fulfilled`, about 12 minutes, five iterations |
| Verification | Done | 20 findings: 6 worth fixing, 10 optional, 4 not defects |

### Deviations and findings

| Item | Note |
|------|------|
| Fan-out route with one entry | The single-executor path would have the orchestrator drive the loop by hand; one `--executors` entry hands it to the runner, which `research.md` documents as a fan-out trigger |
<!-- /ANCHOR:log -->
