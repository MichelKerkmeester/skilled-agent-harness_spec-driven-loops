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
    recent_action: "Built the Vibe session-start goal and context hook"
    next_safe_action: "Phase 012 writes the playbook and docs"
    blockers: []
    key_files:
      - ".skilled/hooks/goal/bin/goal.cjs"
      - ".skilled/hooks/goal/lib/goal-core.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A Vibe hook process inherits the dispatch environment: the keyed run read VIBE_SPEC_FOLDER"
      - "The hook injects at packet_budget=unknown too"
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

- [x] `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`
- [x] `rg -c 'session_start' .vibe/hooks.toml` prints 1
- [x] One keyed dispatch bound to a packet repeats that packet's Objective line in its first reply
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
| Hook build | Done | `node --check` exits 0 on both adapters; `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `tests 3`, `pass 3`, `fail 0` |
| Registration | Done | `rg -c 'session_start' .vibe/hooks.toml` prints 1 |
| First turn | Done | Keyed `vibe --prompt-file ... --model deepseek-flash` from the checkout root with `VIBE_SPEC_FOLDER` set replied with the exact Objective line; `scratch/first-turn/export.json` has `exit_code` 0, and the journal holds the slice in a block tagged `vibe.hookContext: true` beside the session context and the stale-dist warning |

### Deviations and findings

| Item | Note |
|------|------|
| Packet variable | The packet is named through `VIBE_SPEC_FOLDER`, as `DSH_SPEC_FOLDER` names it for dsh. The keyed run proved the hook process inherits it |
| Replaced 008's start entry | Phase 008 had registered `session-cleanup-start` as a `session_start` entry, so adding a second would break D3 and the T007 count. The new `session-start` entry runs `session-cleanup.mjs` as one of its four parts and replaces that entry; `session-cleanup-end` is unchanged. Rollback is to restore the old entry, not only to remove the new one |
| Dist freshness folded in | Phase 008's classification left the dist-freshness warning to this phase, so the one entry also runs `check-dist-staleness.sh --all` under the `dist-freshness` switch |
| Reply shape | `vibe/app_server/_host_hooks.py:193-195` reads `hook_specific_output.additional_context`, and line 336 joins several entries' contexts with a blank line |
| Budget unknown | The hook injects whatever `chat_slice` the packet renders, including at `packet_budget=unknown`; the slice length is the packet's own concern |
| Objective met by amendment | First closed holding only for a session opened in the checkout. Amended 2026-11-14 on operator approval: `render-home-hooks.cjs` copies the hooks with absolute paths into the run's `VIBE_HOME`, which Vibe reads whatever the cwd (`_harness_manager.py:142-143`); the lineage adapter renders it and passes `VIBE_SPEC_FOLDER`, and the dispatch shape renders it and sets `AI_SESSION_CHILD=1`. A keyed scratch-cwd run quoted the Objective line, loaded the `user:` guard bindings and wrote a file (`scratch/scratch-cwd-home-hooks/`). A hand-composed dispatch that skips the render step still runs without them |
| Where the hook runs | This run trusted the checkout root, so the repository hooks loaded, and it ran from the root on purpose, against the skill's `no-repo-root-cwd` rule. A scratch-cwd dispatch and a fan-out lineage trust only their own folder, so the project file never loads there; they get the hooks from the rendered home copy |


Answered by phase 004: `--output text` stdout prints the reply, and `--output json` prints a session-entry array whose assistant entry holds it. `export.json` stays the verdict.
<!-- /ANCHOR:log -->
