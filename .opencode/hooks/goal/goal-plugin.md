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
version: 3.8.1.0
---

# OpenCode Goal Plugin Contract

Use this reference when changing, validating, or operating the local `/goal` OpenCode plugin. It names the plugin-owned state, injection hooks, command boundary, environment controls, and restart requirements.

## 1. OVERVIEW

`/goal` gives an OpenCode session a durable completion objective. The command is a thin router; the plugin owns state, injection, lifecycle tracking, status output, completion supervision, and guarded continuation.

This is a local OpenCode plugin contract, not a Spec Kit Memory MCP tool and not a daemon-backed CLI bridge. The plugin is documented here because it participates in the same OpenCode runtime-injection layer as the Spec Kit memory, code graph, and skill-advisor plugin surfaces.

## 2. RUNTIME SURFACES

| Surface | Path | Role |
|---|---|---|
| Plugin | `.opencode/plugins/mk-goal.js` | Auto-loaded OpenCode plugin with `event`, `experimental.chat.system.transform`, `mk_goal`, and `mk_goal_status`. |
| Command | `.opencode/commands/goal-opencode.md` | State-free `/goal` router for `set`, `show`, `history`, `doctor`, `health`, `clear`, `complete`, `pause`, and `resume`. |
| State | `.opencode/skills/.goal-state/` | Runtime JSON state, keyed by a fixed SHA-256 digest of the session id, intentionally outside spec docs. |
| Tests | `.opencode/plugins/tests/mk-goal-*.test.cjs` | Unit coverage for state, tool path, lifecycle, supervisor, continuation, export contract, and injection behavior. |

## 3. BEHAVIOR CONTRACT

- `/goal set <objective>` stores a sanitized raw `objective`, derives a deterministic `goalPrompt`, and records prompt metadata under `promptEnhancement`.
- `/goal set <objective> --budget N` passes `tokenBudget: N` through the command router; invalid, zero, negative, or missing budget values fail before a tool call.
- `/goal history` lists archived goal records from `.opencode/skills/.goal-state/.archive/` without creating or mutating active state.
- Reads adopt valid legacy hex-keyed active and archived files into the fixed digest path without overwriting an occupied target. Malformed or mismatched sources remain untouched.
- `/goal doctor` and `/goal health` are read-only inspections that report active state-file count, archive-file count, `.continuation.log` and `.goal-events.log` byte sizes, last sweep time, and orphan-candidate count.
- `/goal resume` reactivates only `paused` or `usage_limited` goals, clears `continuationSuppressed`, clears `continuationSuppressedReason`, and rejects terminal resurrection.
- `experimental.chat.system.transform` injects one `[active_goal:<goalId>]` block only for active goals.
- The injected block keeps a short raw `objective:` preview for auditability and uses `goal_prompt:` for model-facing steering.
- The `event` hook restores active goals on `session.created`, records usage/evidence on `message.updated`, tracks prompt blockers, verifies on `session.idle`, and attempts continuation only when autonomy gates pass. Provider usage-limit recovery is lazy: a retry-after deadline recorded from a 429 payload is evaluated on the next `message.updated` or `session.idle`, with no timer.
- Idle verification uses an injected `supervisorVerifier` when tests or callers provide one; otherwise it uses the production default verifier. The default is a fail-closed heuristic over the latest assistant evidence and the goal objective. Set `MK_GOAL_VERIFIER=llm` to opt into the model-backed verifier that calls `ctx.client.session.promptAsync` and parses a structured verdict.
- `/goal show` and `mk_goal_status` expose the exact injection preview plus prompt metadata so operators can inspect what the model receives.

## 4. ENVIRONMENT VARIABLES

| Variable | Default | Effect |
|---|---|---|
| `MK_GOAL_PLUGIN_DISABLED` | unset | Set `1` to disable goal injection and plugin behavior. |
| `MK_GOAL_AUTONOMY` | unset | `active` enables guarded continuation; `smoke` logs would-fire decisions; unset or `passive` suppresses continuation. |
| `MK_GOAL_DEBUG` | unset | Set `1` to append bounded debug events under `.goal-state`. |
| `MK_GOAL_VERIFIER` | `heuristic` | `heuristic` uses the deterministic fail-closed verifier; `llm` opts into `ctx.client.session.promptAsync` semantic verdicts. |
| `MK_GOAL_MAX_OBJECTIVE_CHARS` | `4000` | Caps stored raw objective text. |
| `MK_GOAL_MAX_GOAL_PROMPT_CHARS` | `4000` | Caps generated `goalPrompt`; values above 4000 are clamped. |
| `MK_GOAL_MAX_INJECTION_CHARS` | `4800` | Caps the active-goal injection block. |
| `MK_GOAL_MAX_EVIDENCE_CHARS` | `1200` | Caps verifier evidence retained in state. |
| `MK_GOAL_MAX_AUTO_TURNS` | `8` | Caps guarded auto-continuation turns for new and normalized goals. |
| `MK_GOAL_MAX_WALL_MS` | `1800000` | Caps guarded auto-continuation wall-clock duration in milliseconds. |
| `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` | `90` | Days before an archived goal-state file is pruned. |
| `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` | `2` | Age threshold before an orphaned active-state file is swept and archived. |
| `MK_GOAL_STATE_SWEEP_INTERVAL_MS` | `3600000` (1 hour) | Minimum interval between orphaned-active-state sweep passes. |

## 5. OUTPUT FIELDS

`mk_goal_status` and `/goal set` responses expose these status fields in addition to the injection preview and prompt metadata:

| Field | Values | Meaning |
|---|---|---|
| `store_health` | `no_active_goal`, `state_age_ms:<N>` | Diagnostic on the active-goal state file: absent, or its age in milliseconds. |
| `mutation` | `created`, `refreshed`, `replaced` | Set-time outcome: `created` when no goal existed, `refreshed` when the same objective was re-set, `replaced` when a different objective overwrote an existing goal. |
| `max_auto_turns` | positive integer | Effective auto-turn cap after `MK_GOAL_MAX_AUTO_TURNS` and stored state normalization. |
| `remaining_auto_turns` | integer >= 0 | Auto-continuation turns still available before the cap suppresses continuation. |
| `max_wall_ms` | positive integer | Effective wall-clock cap after `MK_GOAL_MAX_WALL_MS`. |
| `remaining_wall_ms` | integer >= 0 | Wall-clock budget still available for guarded continuation. |
| `provider_retry_after_ms` | epoch ms or `none` | Stored retry-after recovery deadline for `usage_limited` goals. |
| `verifier_source` | `none`, `injected`, `default-heuristic`, `default-llm` | Provenance for the last verifier verdict. Injected verifiers keep precedence over defaults. |

The default heuristic marks a goal `met` only when the latest assistant evidence is long enough to carry signal, contains an explicit completion phrase, and references enough objective keywords to tie the claim to the active goal. Empty, short, truncated, unrelated, merely repetitive, investigation-only, or mixed completion-plus-blocker evidence remains `not_met`; blocker words such as failed, error, cannot, TODO, not yet, partially, still need, pending, or waiting override completion phrases.

`/goal history` returns `archive_count` plus `archive_N_file`, `archive_N_goal_id`, `archive_N_session_id`, `archive_N_status`, `archive_N_objective`, `archive_N_updated_at_ms`, and `archive_N_size_bytes` rows. `/goal doctor` and `/goal health` return `active_state_file_count`, `archive_file_count`, `continuation_log_bytes`, `goal_events_log_bytes`, `last_sweep_at_ms`, `last_sweep_at`, and `orphan_candidate_count`.

### Canonical Usage Fields

`tokens_used` and `usage_source` are the canonical status-output fields for usage accounting. They mirror the stored `tokensUsed` and `usageSource` goal-state properties and appear before the budget-prefixed aliases in live `mk_goal_status` output.

`budget_tokens_used` and `budget_usage_source` are legacy-compatible aliases for the same values. They remain in output for existing tests, docs, and operators that read the budget-prefixed field names, but new integrations should read `tokens_used` and `usage_source`.

## 6. BOUNDARIES

- Keep `.opencode/commands/goal-opencode.md` as a thin one-tool router. Do not duplicate state parsing or prompt construction in command markdown.
- Do not route `mk-goal` through Spec Kit Memory or the code-index/skill-advisor daemon CLIs. Goal state is session-local plugin state.
- Do not store objective-derived runtime state in spec docs or memory rows unless the user explicitly asks to save continuity.
- Do not auto-run shell commands inferred from the goal objective. Verification evidence must come from explicit tests, command output, or supervisor-safe state.
- Restart OpenCode after changing `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal-opencode.md`, or this plugin's load-time configuration.

## 7. VERIFICATION

Run these checks after modifying goal-plugin behavior or docs that describe the plugin:

```bash
node .opencode/plugins/tests/mk-goal-state.test.cjs
node .opencode/plugins/tests/mk-goal-tool-path.test.cjs
node .opencode/plugins/tests/mk-goal-export-contract.test.cjs
node .opencode/plugins/tests/mk-goal-capabilities.test.cjs
node .opencode/plugins/tests/mk-goal-lifecycle.test.cjs
node .opencode/plugins/tests/mk-goal-supervisor.test.cjs
node .opencode/plugins/tests/mk-goal-continuation.test.cjs
python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/plugins
python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh .opencode/plugins/mk-goal.js
```

For documentation-only changes, also run the relevant `sk-doc` structure check and the active spec folder's strict validation.

## 8. CROSS-RUNTIME RELATIONSHIP

This plugin is the OpenCode-native goal system. Cursor and Pi reach the same passive-goal behavior through a runtime-neutral sibling under `.opencode/hooks/goal/` — not this plugin.

**State model.** `mk-goal` keeps per-OpenCode-session state and native token accounting under `<full-sha256-of-session-id>.json`. Valid files from the earlier reversible hex-key format migrate lazily on active reads, injection, orphan sweeps, and history access; occupied digest targets remain authoritative. The sibling core hashes the unambiguous serialization of repository root, runtime, and native session id into one opaque `<full-sha256>.json` basename with a matching archive namespace. Its legacy `active-goal.json` is diagnostic-only and never supplies prompt injection. Cross-runtime usage accounting remains `turn-count-estimate` because these adapters do not expose OpenCode's native token feed.

**Current support matrix:**

| Runtime | Injection | Management | Verify / continue |
|---|---|---|---|
| OpenCode | Native plugin | `/goal-opencode` | Native verifier and guarded continuation |
| Pi | Native session-bound extension | Native registered `/goal-pi` | `turn_end` heuristic; no forced continuation |
| Cursor | Session-bound `sessionStart` hook | Unsupported without native command identity | Turn touch only; no continuation |
| Claude Code | No sibling-core adapter | No repository command; live native capability unverified here | Outside this contract |
| Codex | None | None | None |

**Command surface.** Each retained goal-capable runtime uses its own command boundary:

| Runtime | Command | Source | Drives |
|---|---|---|---|
| OpenCode | `/goal-opencode` | `.opencode/commands/goal-opencode.md` | `mk_goal` / `mk_goal_status` plugin tools |
| Cursor | `/goal-cursor` | `.cursor/commands/goal-cursor.md` | Fails with `UNSUPPORTED_SESSION_BINDING`; never calls the CLI |
| Pi | `/goal-pi` | Registered by `.opencode/hooks/goal/pi/goal-context.ts` | Shared CLI with native runtime/session/workspace flags appended by the extension |

The shared CLI keeps the base OpenCode action envelope and adds explicit `legacy-inspect`, `legacy-migrate`, and `legacy-archive` actions. All current-session actions require explicit native binding; only aggregate diagnostics and non-binding legacy inspection/archive work without it. See `.opencode/hooks/goal/README.md` for state layout, error behavior, rollback, and verification.

## 9. RELATED REFERENCES

- [`hook-system.md`](../../skills/system-spec-kit/references/config/hook-system.md) - cross-runtime hook and plugin transport map.
- [`injection-contract.md`](../injection-contract.md) - the active-goal block's per-runtime visibility.
- [`goal-opencode-plugin.md`](../../skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md) - current feature catalog entry.
- [`goal-opencode-plugin.md`](../../skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md) - operator validation scenario.
- [`README.md`](README.md) - current cross-runtime session-isolation and legacy-cutover contract.
