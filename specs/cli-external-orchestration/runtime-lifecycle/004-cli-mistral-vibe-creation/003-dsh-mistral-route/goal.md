---
title: "Goal: Phase 3: dsh-mistral-route"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh mistral route goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/003-dsh-mistral-route"
    last_updated_at: "2026-11-14T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive from the feasibility check"
    next_safe_action: "Operator exports MISTRAL_API_KEY, then run T003"
    blockers:
      - "MISTRAL_API_KEY is not exported for dispatched shells"
    key_files:
      - "scratch/draft-route-mistral-deepseek.patch.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Mistral rejects the thinking field with 422 and accepts reasoning_effort high and max"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: dsh-mistral-route

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let DeepSeek Harness dispatch Mistral's hosted DeepSeek V4.1 Flash 1017 as a third, non-default roster route.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The Mistral patch carries no `compat.thinkingFormat: deepseek`, because Mistral answers 422 to a `thinking` field |
| D2 | The LLM Gateway route stays the dsh default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `--dump-config` with `.dsh/patches/route-mistral-deepseek.patch.yml` exits 0 with empty stderr
- [ ] A keyed harmless dispatch exits 0 with `final.reason.kind` `completed`
- [ ] A dispatch naming an unlisted patch is still refused
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
| Offline composition | Done | Draft patch exit 0, empty stderr |
| API field check | Done | `reasoning_effort` 200, `thinking` 422 |
| Keyed dsh run | Blocked | The key is exported now (2026-11-14), but the installed `dsh --version` prints `0.2.2-rc.3` and the pin is `0.2.2-rc.1` (`hard-rules.json` `pinned-version-required`, `dispatch-rule-checks.mjs` `DSH_PINNED_VERSION`). rc.1 is not in the npx cache, so running it means a fetch, which waits for the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Keyed run attempt | The cli-deepseek-harness PreToolUse hook refused the off-roster patch, as designed |
| Version drift | T008 and T009 are `[B]`. Operator choice: fetch rc.1 through `npx -y @deepseek-ai/dsh@0.2.2-rc.1` (undo: `rm -rf` its `~/.npm/_npx/<hash>` folder), or re-pin to rc.3 as its own offline contract-pin packet |
<!-- /ANCHOR:log -->
