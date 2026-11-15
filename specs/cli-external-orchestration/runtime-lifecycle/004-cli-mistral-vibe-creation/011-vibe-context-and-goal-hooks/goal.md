---
title: "Goal: Phase 11: vibe-context-and-goal-hooks"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe context and goal hooks goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the plan from the phase plan and research section 6"
    next_safe_action: "Run T001 once phase 008 settles the hook wire format"
    blockers:
      - "Phase 008 has not settled the hook wire format"
      - "MISTRAL_API_KEY is needed for the first-turn dispatch"
    key_files:
      - ".skilled/hooks/goal/bin/goal.cjs"
      - ".skilled/hooks/goal/lib/goal-core.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a Vibe hook process inherit the dispatch environment?"
      - "Should the hook inject when goal.cjs packet prints packet_budget=unknown?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: vibe-context-and-goal-hooks

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every Vibe dispatch bound to a packet that packet's goal slice and the session context in its first turn.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Injection only, through the `session_start` hook's `additional_context`. No goal object, `/goal` command or goal tool |
| D2 | The injected goal text is exactly the `chat_slice` that `goal.cjs packet` prints for the bound packet |
| D3 | One registered `session_start` entry composes the goal slice and the session context |
| D4 | The hook fails open: bad input yields an empty context and exit 0, never a blocked session |
| D5 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`
- [ ] `rg -c 'session_start' .vibe/hooks.toml` prints 1
- [ ] One keyed dispatch bound to a packet repeats that packet's Objective line in its first reply
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
| Baseline | Done | No `.vibe/`, no `goal/vibe/` or `session-lifecycle/vibe/`, and `goal.cjs packet` prints one `chat_slice=` line for `003-dsh-mistral-route` (`spec.md` Measured Behavior) |
| Hook build | Pending | Waits on phase 008's wire format |

### Deviations and findings

| Item | Note |
|------|------|
| Packet variable | The plan names the packet through a `VIBE_SPEC_FOLDER` variable, by analogy to the `DSH_SPEC_FOLDER` read in `.skilled/hooks/goal/dsh/goal-context.mjs` |

Open question: does a Vibe hook process inherit the dispatch environment, so `VIBE_SPEC_FOLDER` reaches the hook? UNKNOWN until phase 008 settles the wire format.

Open question: what does the `session_start` hook receive on stdin, and what reply shape carries `additional_context`? UNKNOWN until phase 008.

Open question: where is the first reply read for T011, the `--output text` stdout or the session journal beside `export.json`? UNKNOWN until phase 004 pins the payload shapes.

Open question: should the hook inject when `goal.cjs packet` prints `packet_budget=unknown`, as it does for `003-dsh-mistral-route` today?
<!-- /ANCHOR:log -->
