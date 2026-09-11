---
title: "DV-022 -- Session-bound Devin goal injection"
description: "Verify the Devin goal adapter injects a bound packet goal on SessionStart and UserPromptSubmit, carries the resend reminder, never leaks frontmatter, and fails open on bad input."
version: 1.0.0.0
---

# DV-022 -- Session-bound Devin goal injection

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-022`.

## 1. OVERVIEW

Devin receives the session goal through `.opencode/hooks/goal/devin/goal-inject.mjs`, registered in `.devin/hooks.v1.json` under both `SessionStart` and `UserPromptSubmit`. The adapter reads the native `session_id` from the payload, resolves the workspace from `cwd` or `DEVIN_PROJECT_DIR`, and returns the active-goal brief as `hookSpecificOutput.additionalContext`. When the session is bound to a packet, the brief is rendered from that packet's `goal.md` durable slice on every turn, frontmatter excluded, and a `[goal_resend_pending]` line follows the brief while the operator copy is behind the file.

Three `UserPromptSubmit` hooks in this repository write `hookSpecificOutput.additionalContext` (the spec-kit prompt adapter, the spec-gate classifier and this adapter). The host concatenates them: a live `devin -p` run on 2026-09-11 against CLI 3000.6.14, with a write-intent prompt so the classifier fired, reported both the advisor line the spec-kit adapter emits and the classifier's own sentence in the same turn. Ordering is therefore not load-bearing, and an adapter that emits nothing costs the others nothing. Re-check this after a Devin CLI upgrade, since it is host behaviour rather than a documented contract.

Devin is injection-only. The repository exposes no Devin prompt-command surface, so binding happens on a runtime whose command carries the session identity, and the record is shared through the same core under `OPENCODE_GOAL_STATE_DIR`.

### Why This Matters

A Devin session that works a packet without its goal drifts from the directive the operator set. This scenario proves the brief reaches Devin's context on both lifecycle events, that the file is the source (an edit shows on the next turn), and that no path can surface the file's bookkeeping or block a turn.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the Devin goal adapter injects a bound packet goal on `SessionStart` and `UserPromptSubmit`, carries the resend reminder until `resent`, never emits frontmatter, and returns `{}` on missing identity, a paused goal, a disabled plugin, or malformed stdin.
- Real user request: `Keep this Devin session on the packet goal I set, and remind me when the goal file changes.`
- Prompt: `As a hook validator, bind a scratch Devin session to a packet that carries a goal.md, pipe SessionStart and UserPromptSubmit payloads through the Devin goal adapter, and prove the brief comes from the file with no frontmatter, that the resend reminder appears until the slice is marked resent, and that every failure path returns an empty object. Return the captured envelopes and a PASS/FAIL verdict.`
- Expected execution process: Create a temporary `OPENCODE_GOAL_STATE_DIR` -> bind `session-d` to a packet with `bin/goal.cjs bind <packet> --runtime devin --session session-d --workspace "$PWD"` -> pipe a `SessionStart` payload and a `UserPromptSubmit` payload through the adapter -> inspect `additionalContext` -> run `resent` and pipe again -> pipe a payload with no `session_id`, then `not json`, then with `OPENCODE_GOAL_PLUGIN_DISABLED=1` -> parse `.devin/hooks.v1.json` for the two registrations.
- Expected signals: both envelopes carry `hookSpecificOutput.hookEventName` matching the payload and an `additionalContext` starting with `[active_goal:` whose `objective:` line starts with `Execute <packet>/goal.md.`; no `---` fence and no `session_id:` line anywhere in the context; `[goal_resend_pending]` present before `resent` and absent after; `{}` for missing identity, malformed stdin and the disabled switch; two `goal-inject.mjs` entries in the registration, each with a `|| printf %s "{}"` fallback.
- Evidence requirements: Capture both envelopes before and after `resent`, the three fail-open outputs, and the parsed registration entries.
- Desired user-visible outcome: A concise PASS or FAIL verdict with the envelope excerpts. SKIP is allowed only when the sandbox cannot execute `node` or cannot write a temporary `OPENCODE_GOAL_STATE_DIR`; name that blocker in the verdict.
- Pass/fail: PASS when both events inject the packet-rendered brief with no frontmatter, the reminder tracks `resent`, and every failure path returns `{}`. FAIL on any frontmatter leak, a non-empty response without identity, or a missing registration.
- Failure triage: Check `session_id` in the payload first, then the workspace resolution (`cwd` or `DEVIN_PROJECT_DIR`), then whether the packet path resolves inside that workspace. A leak means the slice module's fence handling regressed; run `node --test .opencode/hooks/goal/lib/goal-slice.test.cjs`.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
export OPENCODE_GOAL_STATE_DIR="$(mktemp -d /tmp/goal-devin.XXXXXX)"
PACKET=specs/system-speckit/033-system-speckit-v4/036-goal-unification
node .opencode/hooks/goal/bin/goal.cjs bind "$PACKET" --runtime devin --session session-d --workspace "$PWD"
printf '%s' '{"session_id":"session-d","hook_event_name":"SessionStart","cwd":"'"$PWD"'"}' | node .opencode/hooks/goal/devin/goal-inject.mjs
printf '%s' '{"session_id":"session-d","hook_event_name":"UserPromptSubmit","cwd":"'"$PWD"'"}' | node .opencode/hooks/goal/devin/goal-inject.mjs
node .opencode/hooks/goal/bin/goal.cjs resent --runtime devin --session session-d --workspace "$PWD"
printf '%s' '{"session_id":"session-d","hook_event_name":"UserPromptSubmit","cwd":"'"$PWD"'"}' | node .opencode/hooks/goal/devin/goal-inject.mjs
printf '%s' '{"hook_event_name":"UserPromptSubmit","cwd":"'"$PWD"'"}' | node .opencode/hooks/goal/devin/goal-inject.mjs
printf 'not json' | node .opencode/hooks/goal/devin/goal-inject.mjs
printf '%s' '{"session_id":"session-d","hook_event_name":"UserPromptSubmit","cwd":"'"$PWD"'"}' | OPENCODE_GOAL_PLUGIN_DISABLED=1 node .opencode/hooks/goal/devin/goal-inject.mjs
python3 -c 'import json;d=json.load(open(".devin/hooks.v1.json"));print(sum("goal-inject" in json.dumps(d[e]) for e in ("SessionStart","UserPromptSubmit")))'
```

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| DV-022 | Session-bound Devin goal injection | Packet-rendered brief on both lifecycle events with reminder and fail-open paths | `As a hook validator, bind a scratch Devin session to a packet that carries a goal.md, pipe SessionStart and UserPromptSubmit payloads through the Devin goal adapter, and prove the brief comes from the file with no frontmatter, that the resend reminder appears until the slice is marked resent, and that every failure path returns an empty object.` | The sequence above | Two envelopes with `hookEventName` and a packet-rendered `additionalContext`, reminder present then absent, `{}` on the three failure paths, registration count `2` | Captured envelopes and registration count | PASS when every signal is observed; FAIL on any leak, non-empty failure-path response, or missing registration | Payload identity -> workspace resolution -> packet path -> slice tests |

### Automated companion gate

```bash
node --test .opencode/hooks/goal/devin/goal-devin.test.mjs .opencode/hooks/goal/lib/goal-slice.test.cjs
```

### Rollback

Set `OPENCODE_GOAL_PLUGIN_DISABLED=1` or remove the two Devin goal registrations as one controlled change. Preserve scoped state. A disabled adapter must return only `{}`.

---

## 4. SOURCE FILES

|| File | Role |
||---|---|
|| `../../../../../hooks/goal/devin/goal-inject.mjs` | Devin session-bound injection adapter. |
|| `../../../../../hooks/goal/lib/goal-core.cjs` | Scoped core, packet binding and reminder. |
|| `../../../../../hooks/goal/lib/goal-slice.cjs` | Packet `goal.md` projections and the frontmatter boundary. |
|| `../../../../../../.devin/hooks.v1.json` | Registration under `SessionStart` and `UserPromptSubmit`. |
|| `../../../../../hooks/goal/README.md` | Support matrix, state layout and rollback. |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: DV-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
