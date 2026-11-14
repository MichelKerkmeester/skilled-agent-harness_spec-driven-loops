---
title: "Goal: Phase 10: hub-registration-and-routing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub registration and routing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/010-hub-registration-and-routing"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the plan from the phase plan and the routing baseline"
    next_safe_action: "Run T001 once phases 005 and 009 land"
    blockers:
      - "Phases 005 and 009 are not built"
    key_files:
      - ".skilled/skills/cli-external-orchestration/mode-registry.json"
      - ".skilled/skills/cli-external-orchestration/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a .vibe/agents/ generator with --check exist after phase 006?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: hub-registration-and-routing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the cli-external-orchestration hub route a request to delegate to Mistral Vibe to the `cli-mistral-vibe` mode at both routing stages.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The mode is `routingClass: "metadata"`, so it gets no advisor entry or projection map of its own |
| D2 | No bare `vibe` alias. Aliases are `mistral vibe`, `vibe -p` and `delegate to vibe` |
| D3 | The mode sits last in `routerPolicy.tieBreak`, after `cli-deepseek-harness` |
| D4 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` prints `"workflowMode":"cli-mistral-vibe"`
- [ ] `skill_advisor.py "delegate to vibe" --threshold 0.5` names `cli-external-orchestration`
- [ ] `parent-skill-check.cjs .skilled/skills/cli-external-orchestration` reports 8 modes and no hard failure
- [ ] "give this landing page a calmer vibe" does not route to `cli-mistral-vibe`
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
| Routing baseline | Done | 7 modes, no hub routing file names `cli-mistral-vibe`, compiled router serves `legacy` with `stale-manifest`, advisor picks the hub at 0.5974 (`spec.md` Measured Behavior) |
| Registration | Pending | Waits on phases 005 and 009 |

### Deviations and findings

| Item | Note |
|------|------|
| Stage one passes before any edit | The advisor already picks the hub for "delegate to vibe" on generic delegation words, so stage two is the real handoff test |

Open question: does phase 006 ship a `.vibe/agents/` generator with a `--check` mode? T014 reruns it only if it exists.
<!-- /ANCHOR:log -->
