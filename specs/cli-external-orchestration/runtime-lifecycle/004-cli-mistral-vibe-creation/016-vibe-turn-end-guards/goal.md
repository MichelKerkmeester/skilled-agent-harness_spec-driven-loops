---
title: "Goal: Phase 16: vibe-turn-end-guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe turn end guards goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/016-vibe-turn-end-guards"
    last_updated_at: "2026-11-14T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the phase spec, plan, tasks and goal"
    next_safe_action: "Wait for phases 014 and 015, then run T001"
    blockers:
      - "Phase 014 must record whether the final reply is on disk when post_agent starts"
    key_files:
      - ".skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the final assistant reply in the journal when the post_agent hook starts?"
      - "Which journal field gives a per-operator-message turn key, since post_agent carries no turn_id?"
      - "Which tool name do hooks see for the question tool: ask_user_question or a qualified form?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: vibe-turn-end-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Check every main Vibe turn at its end, sending a prose option menu back once and leaving a completion advisory for the next turn.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One registered `post_agent` composer, `match = "main"`, because the first deny skips every later `post_agent` hook |
| D2 | The ask-surface part denies at most once per operator message, and never in a child session, a subagent or a session without the question tool |
| D3 | The completion part is advisory only. It never denies, and its advisory reaches the model through the turn-start composer on the next turn |
| D4 | Every failure path exits 0 with no output, so a guard bug ends the turn normally |
| D5 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` prints `fail 0`
- [ ] `rg -c 'type = "post_agent"' .vibe/hooks.toml` prints 1
- [ ] An operator-run interactive session's journal holds one retry user message starting with `[ask-surface]`
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
| Baseline | Done | No `post_agent` entry in `.vibe/hooks.toml` and no `vibe` row in `ask-surface-core.cjs` (`spec.md` Measured Behavior) |
| Build | Pending | Waits on phases 014 and 015 |

### Deviations and findings

| Item | Note |
|------|------|
| Classification reversed | `guards-and-hooks.md` section 4 marks both guards not portable. Vibe's hook reference says a `post_agent` deny injects a retry message, capped at three per turn, and `_foreign_hooks.py:836-841` maps the deny to a retry. Phase 021 corrects the doc once this phase's run shows it |
| Open question: reply on disk | UNVERIFIED that the final reply is in the journal when the hook starts. Phase 014 settles it; if it is not, the ask-surface part moves to the next turn's `pre_agent` and the spec is amended |
| Open question: turn key | UNVERIFIED. The `post_agent` payload has no `turn_id`, so `markTurn` keys on the `turn_id` the 014 reader's `turnId` helper returns; a user-message id would change on each retry. 014 T006 records whether a retry keeps the `turn_id` |
| Open question: tool name | UNVERIFIED which name hooks see for the question tool. The host runs it as `ask_user_question` (`_host.py:2896`), so the part accepts the short and any qualified form |
| Headless runs | A print-mode run has no question tool, so the ask-surface part passes it by design. Only the completion part acts headless, and only through the advisory log, because a print run has no next turn |
<!-- /ANCHOR:log -->
