---
title: "OpenCode Goal Plugin Contract"
description: "Operator contract for the local /goal OpenCode plugin, session-goal state, prompt injection, lifecycle events, and validation surfaces."
trigger_phrases:
  - "goal plugin"
  - "mk-goal"
  - "/goal command"
  - "active_goal"
  - "session goal"
importance_tier: "important"
contextType: "implementation"
---

# OpenCode Goal Plugin Contract

Use this reference when changing, validating, or operating the local `/goal` OpenCode plugin. It names the plugin-owned state, injection hooks, command boundary, environment controls, and restart requirements.

## 1. Purpose

`/goal` gives an OpenCode session a durable completion objective. The command is a thin router; the plugin owns state, injection, lifecycle tracking, status output, completion supervision, and guarded continuation.

This is a local OpenCode plugin contract, not a Spec Kit Memory MCP tool and not a daemon-backed CLI bridge. The plugin is documented here because it participates in the same OpenCode runtime-injection layer as the Spec Kit memory, code graph, and skill-advisor plugin surfaces.

## 2. Runtime Surfaces

| Surface | Path | Role |
|---|---|---|
| Plugin | `.opencode/plugins/mk-goal.js` | Auto-loaded OpenCode plugin with `event`, `experimental.chat.system.transform`, `mk_goal`, and `mk_goal_status`. |
| Command | `.opencode/commands/goal.md` | State-free `/goal` router for `set`, `show`, `clear`, `complete`, and `pause`. |
| State | `.opencode/skills/.goal-state/` | Runtime JSON state, keyed by session id, intentionally outside spec docs. |
| Tests | `.opencode/plugins/__tests__/mk-goal-*.test.cjs` | Unit coverage for state, tool path, lifecycle, supervisor, continuation, export contract, and injection behavior. |

## 3. Behavior Contract

- `/goal set <objective>` stores a sanitized raw `objective`, derives a deterministic `goalPrompt`, and records prompt metadata under `promptEnhancement`.
- `experimental.chat.system.transform` injects one `[active_goal:<goalId>]` block only for active goals.
- The injected block keeps a short raw `objective:` preview for auditability and uses `goal_prompt:` for model-facing steering.
- The `event` hook restores active goals on `session.created`, records usage/evidence on `message.updated`, tracks prompt blockers, verifies on `session.idle`, and attempts continuation only when autonomy gates pass.
- `/goal show` and `mk_goal_status` expose the exact injection preview plus prompt metadata so operators can inspect what the model receives.

## 4. Environment Variables

| Variable | Default | Effect |
|---|---|---|
| `MK_GOAL_PLUGIN_DISABLED` | unset | Set `1` to disable goal injection and plugin behavior. |
| `MK_GOAL_AUTONOMY` | unset | `active` enables guarded continuation; `smoke` logs would-fire decisions; unset or `passive` suppresses continuation. |
| `MK_GOAL_DEBUG` | unset | Set `1` to append bounded debug events under `.goal-state`. |
| `MK_GOAL_MAX_OBJECTIVE_CHARS` | `4000` | Caps stored raw objective text. |
| `MK_GOAL_MAX_GOAL_PROMPT_CHARS` | `4000` | Caps generated `goalPrompt`; values above 4000 are clamped. |
| `MK_GOAL_MAX_INJECTION_CHARS` | `4800` | Caps the active-goal injection block. |
| `MK_GOAL_MAX_EVIDENCE_CHARS` | `1200` | Caps verifier evidence retained in state. |

## 5. Boundaries

- Keep `.opencode/commands/goal.md` as a thin one-tool router. Do not duplicate state parsing or prompt construction in command markdown.
- Do not route `mk-goal` through Spec Kit Memory or the code-index/skill-advisor daemon CLIs. Goal state is session-local plugin state.
- Do not store objective-derived runtime state in spec docs or memory rows unless the user explicitly asks to save continuity.
- Do not auto-run shell commands inferred from the goal objective. Verification evidence must come from explicit tests, command output, or supervisor-safe state.
- Restart OpenCode after changing `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal.md`, or this plugin's load-time configuration.

## 6. Verification

Run these checks after modifying goal-plugin behavior or docs that describe the plugin:

```bash
node .opencode/plugins/__tests__/mk-goal-state.test.cjs
node .opencode/plugins/__tests__/mk-goal-tool-path.test.cjs
node .opencode/plugins/__tests__/mk-goal-export-contract.test.cjs
node .opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs
node .opencode/plugins/__tests__/mk-goal-supervisor.test.cjs
node .opencode/plugins/__tests__/mk-goal-continuation.test.cjs
python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins
python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js
```

For documentation-only changes under `system-spec-kit`, also run the relevant `sk-doc` structure check and the active spec folder's strict validation.

## 7. Related References

- `references/config/hook_system.md` - cross-runtime hook and plugin transport map.
- `feature_catalog/18--ux-hooks/goal-opencode-plugin.md` - current feature catalog entry.
- `manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md` - operator validation scenario.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/` - implementation packet for `/goal`.
