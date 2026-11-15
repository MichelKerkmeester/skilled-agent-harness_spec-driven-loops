---
title: "Goal: Phase 2: mistral-provider-roster"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "mistral provider roster goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/002-mistral-provider-roster"
    last_updated_at: "2026-11-14T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive and closed the criteria"
    next_safe_action: "None in this phase"
    blockers: []
    key_files:
      - "evidence/probes.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: mistral-provider-roster

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make Mistral's DeepSeek V4.1 Flash 1017 and GLM-5.3-Flash dispatchable roster routes on cli-opencode and cli-pi.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` join the roster from the `mistral` provider |
| D2 | The DevPass defaults stay; the Mistral routes are non-default |
| D3 | On Pi the routes are direct dispatch only |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Both roster files list both ids: `rg -c 'mistral/(deepseek-v4-1-flash-1017|zai-glm-5-3-flash)'` prints at least 2 for each
- [x] All four id and CLI pairs replied `OK` in `evidence/probes.md`
- [x] `validate_document.py` prints `Total issues: 0` for the four edited files
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
| Probes | Done | `evidence/probes.md` |
| Roster edits | Done | Four skill files, validator 0 issues |

### Deviations and findings

| Item | Note |
|------|------|
| Pi stored key | Malformed (`/va` prefix, 114 chars); verified with a per-run key instead; the operator re-enters it |
<!-- /ANCHOR:log -->
