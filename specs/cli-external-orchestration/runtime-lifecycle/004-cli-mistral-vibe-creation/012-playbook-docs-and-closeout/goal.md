---
title: "Goal: Phase 12: playbook-docs-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook docs and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/012-playbook-docs-and-closeout"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the plan from the phase plan and the sibling closeout layout"
    next_safe_action: "Run T001 once phases 010 and 011 close"
    blockers:
      - "Phases 010 and 011 are not built"
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/manual-testing-playbook.md"
      - ".skilled/CROSS-CLI.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which playbook categories do phases 004 to 011 actually need?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: playbook-docs-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the cli-mistral-vibe mode end to end with a recorded playbook, name it in every runtime list and close the parent packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The playbook lives in the mode packet, and `.vibe/manual-testing-playbook` links to it, as `.dsh/manual-testing-playbook` does for DeepSeek Harness |
| D2 | No playbook scenario for a deferred item: ACP supervisor, session relaunch, turn-stopping guards or sandbox mode |
| D3 | Env docs carry variable names only, never values |
| D4 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation --strict --recursive --quiet` prints `RESULT: PASSED`
- [ ] `rg -l -i 'result: pending' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook` prints nothing
- [ ] `rg -c 'cli-mistral-vibe' .skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` prints at least 1
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
| Baseline | Done | No playbook, no doc names `cli-mistral-vibe` or `.vibe/`, catalog says seven, no env doc names `MISTRAL_API_KEY` (`spec.md` Measured Behavior) |
| Playbook and docs | Pending | Waits on phases 010 and 011 |

### Deviations and findings

| Item | Note |
|------|------|
| Hub playbook | The hub `manual-testing-playbook.md` names no per-mode playbook today, so this phase adds no hub playbook row |

Open question: which playbook scenario categories are needed beyond the built phases? UNKNOWN until phases 004 to 011 close.
<!-- /ANCHOR:log -->
