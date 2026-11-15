---
title: "Goal: Phase 17: vibe-decision-capture"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe decision capture goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/017-vibe-decision-capture"
    last_updated_at: "2026-11-14T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the phase spec, plan, tasks and goal"
    next_safe_action: "Wait for phase 014 item (d), then run T001"
    blockers:
      - "Phase 014 must record whether post_tool fires for ask_user_question"
    key_files:
      - ".skilled/hooks/decision-capture/lib/capture-core.mjs"
      - ".skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does post_tool fire for ask_user_question, which runs through the host's user-input request?"
      - "Does tool_output carry the answers list, or only tool_output_text?"
    answered_questions:
      - "The shared normalizer yields 0 records for Vibe's answers list, so the adapter must map it first"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: vibe-decision-capture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Queue every answer the operator gives through Vibe's question tool as a decision record that `/speckit:save` can quote.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The Vibe answer list is mapped in a Vibe module; the shared normalizer and the queue record shape do not change |
| D2 | The live adapter and the sweep share one mapper, so both write the same key and the core drops the duplicate |
| D3 | The adapter is silent and fail-open: no stdout, exit 0 on every path |
| D4 | The save nudge rides on the turn-start composer through `takeNudge`, once per rise in the count |
| D5 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/decision-capture/vibe/ask-capture-post-tool.test.mjs .skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs` prints `fail 0`
- [ ] `rg -c 'match = "ask_user_question"' .vibe/hooks.toml` prints 1
- [ ] An operator-run interactive session that answers one question leaves 1 pending queue record
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
| Baseline | Done | No Vibe adapter or sweep, and the shared normalizer returns `records=0` for Vibe's answer list (`spec.md` Measured Behavior) |
| Build | Pending | Waits on phase 014 item (d) |

### Deviations and findings

| Item | Note |
|------|------|
| Classification reversed | `guards-and-hooks.md` section 4 says Vibe has no question tool. `vibe/core/tools/builtins/ask_user_question.py` defines one, with the result model in `vibe/questions.py:58-68`. Phase 021 corrects the doc once this phase's run shows capture |
| Open question: hook fires | UNVERIFIED that `post_tool` fires for the question tool, because it runs through the host's user-input request (`_host.py:2896`) rather than a tool body. If it does not, the sweep is the only capture path and REQ-006 is amended |
| Open question: output shape | UNVERIFIED whether `tool_output` carries the `answers` list or only `tool_output_text` |
| Headless runs | A print-mode run has no question tool, so a dispatched child captures nothing by design |
<!-- /ANCHOR:log -->
