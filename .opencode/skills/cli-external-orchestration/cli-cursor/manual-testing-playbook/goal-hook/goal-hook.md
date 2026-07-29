---
title: "CU-027 -- Cross-runtime goal hook (sessionStart injection, recorded-evidence tier)"
description: "This scenario validates the cross-runtime goal core's Cursor adapter for `CU-027`. It focuses on the sessionStart-only injection surface, honestly scoped to the recorded-evidence tier this runtime actually supports: the hook fires and forwards agent_message, but delivery into the model-visible transcript is confirmed non-occurring."
version: 1.0.0.0
---

# CU-027 -- Cross-runtime goal hook (sessionStart injection, recorded-evidence tier)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-027`.

---

## 1. OVERVIEW

This scenario validates `.opencode/hooks/goal/` -- the runtime-neutral cross-runtime goal core built in packet `032-goal-hooks-cross-runtime` -- for Cursor's single adapter, `cursor/goal-inject.mjs`, wired into `.cursor/hooks.json` under `sessionStart`. Cursor gets the narrowest parity tier of the three shipped runtimes: `beforeSubmitPrompt`'s `agent_message` field is confirmed present in Cursor's own JSON response but never spliced into the model-visible transcript, and `stop` never fires under the tested CLI build, so `sessionStart` is the only lifecycle event this concern can attach to. This is documented in the adapter's own header comment, not discovered here for the first time -- this scenario reproduces it with a fresh live run rather than trusting the comment alone.

### Why This Matters

A hook that silently claims delivery it cannot actually provide is worse than no hook at all -- an operator or downstream tooling that trusts `agent_message` reaching the model would be wrong every time under Cursor. This scenario's PASS condition is deliberately inverted from what a naive reading of "goal injection scenario" would expect: PASS means the adapter fires and forwards the field (proving the wiring works) **and** the goal text is confirmed absent from the model-visible transcript (proving the honesty claim in the header comment, not a delivery guarantee). Treating "the hook ran" as equivalent to "the model saw it" would be the exact mistake this scenario exists to prevent.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-027` and confirm the expected signals without contradictory evidence.

- Objective: Verify the Cursor `sessionStart` goal adapter fires, increments the shared turn counter, and forwards the rendered `active_goal` block as `agent_message` in Cursor's response envelope -- while confirming that content is correctly absent from the model-visible transcript, per this runtime's documented recorded-evidence tier.
- Real user request: `Set a session goal before I start working in Cursor, and tell me honestly whether Cursor actually shows you that goal or not.`
- Prompt: `As a QA engineer verifying the cross-runtime session-goal tooling under Cursor, dispatch a real cursor-agent -p session against an isolated goal state, confirm the sessionStart hook fired (turn counter increments) and its JSON response carries agent_message with the active_goal block, then grep the real agent transcript to confirm the canary objective text is absent from what the model actually saw. Return a PASS/FAIL verdict that names both facts separately.`
- Expected execution process: Isolate `MK_GOAL_STATE_DIR` to a scratch directory -> set a canary-marked goal via `bin/goal.cjs` -> confirm `.cursor/hooks.json` registers `cursor/goal-inject.mjs` under `sessionStart` -> dispatch a real `cursor-agent -p` session against the isolated state -> confirm `turns_used` incremented from `0` to `1` -> grep the real Cursor agent-transcript JSONL for the canary and the `[active_goal` marker -> confirm zero occurrences in the model-visible transcript.
- Expected signals: `.cursor/hooks.json` names `cursor/goal-inject.mjs` under `sessionStart`; a direct adapter invocation returns `{"permission":"allow","agent_message":"[active_goal:...] ... [/active_goal]"}` and `turns_used` moves `0` -> `1`; the real `cursor-agent -p` dispatch's transcript JSONL shows `0` occurrences of both the canary string and `[active_goal` after the same dispatch; when no goal is active the adapter returns the bare `{"permission":"allow"}` with no `agent_message` key at all.
- Desired user-visible outcome: A concise PASS/FAIL verdict that separately states "hook fired: yes/no" and "goal reached the model: yes/no", never collapsing the two into a single claim.
- Pass/fail: PASS when the hook registration is confirmed, the adapter's own JSON output carries `agent_message`, `turns_used` increments by exactly `1`, AND the live transcript grep returns zero matches for the canary/marker (the documented, correct behavior for this runtime). FAIL if the hook does not fire, does not forward `agent_message`, does not increment the turn counter, or if the canary unexpectedly DOES appear in the model-visible transcript (a real behavior change that would need to be escalated and the tier's documentation revised, not silently absorbed).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.cursor/hooks.json` registers `.opencode/hooks/goal/cursor/goal-inject.mjs` under `sessionStart`.
3. Isolate `MK_GOAL_STATE_DIR` and set a canary-marked goal via `bin/goal.cjs`.
4. Invoke the adapter directly with a synthetic `sessionStart` payload and capture its JSON response and the turn-counter delta.
5. Dispatch a real, isolated `cursor-agent -p` session and grep its transcript for the canary/marker.
6. Return a PASS/FAIL verdict naming both the hook-fired fact and the model-visibility fact separately.

|| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
||---|---|---|---|---|---|---|---|---|
|| CU-027 | Cross-runtime goal hook (sessionStart injection, recorded-evidence tier) | Verify the sessionStart adapter fires and forwards agent_message while confirming the goal stays absent from the model-visible transcript | `As a QA engineer verifying the cross-runtime session-goal tooling under Cursor, dispatch a real cursor-agent -p session against an isolated goal state, confirm the sessionStart hook fired (turn counter increments) and its JSON response carries agent_message with the active_goal block, then grep the real agent transcript to confirm the canary objective text is absent from what the model actually saw. Return a PASS/FAIL verdict that names both facts separately.` | 1. `bash: grep -n "goal-inject.mjs" .cursor/hooks.json` (confirm registration under `sessionStart`) -> 2. `bash: ISO=$(mktemp -d /tmp/cu-027.XXXXXX) && MK_GOAL_STATE_DIR="$ISO" node .opencode/hooks/goal/bin/goal.cjs set "GOALCANARY-CU-<random>: prove the Cursor sessionStart hook fires" --budget 400` -> 3. `bash: printf '%s' '{"hook_event_name":"sessionStart","workspace_roots":["'"$PWD"'"]}' \| MK_GOAL_STATE_DIR="$ISO" node .opencode/hooks/goal/cursor/goal-inject.mjs` -> 4. `bash: MK_GOAL_STATE_DIR="$ISO" node .opencode/hooks/goal/bin/goal.cjs show \| grep turns_used` -> 5. `MK_GOAL_STATE_DIR="$ISO" cursor-agent -p "Say a short hello and finish." --model composer-2.5 --output-format text --auto-review --sandbox enabled </dev/null` -> 6. `bash: grep -c "GOALCANARY-CU-" ~/.cursor/projects/*/agent-transcripts/*/*.jsonl; grep -c "\[active_goal" ~/.cursor/projects/*/agent-transcripts/*/*.jsonl` (expect `0` for both) | Step 1: registration line present under `sessionStart`; Step 3: adapter stdout is `{"permission":"allow","agent_message":"[active_goal:..."}`; Step 4: `turns_used` reads `1` (was `0` before Step 3); Step 6: both grep counts are `0` | `.cursor/hooks.json` excerpt, captured adapter JSON, `turns_used` before/after, transcript grep counts | PASS when the adapter forwards `agent_message` AND `turns_used` increments by exactly `1` AND both transcript grep counts are `0`; FAIL if the adapter does not fire, does not forward `agent_message`, `turns_used` does not increment, or either transcript grep count is non-zero | Inspect `.cursor/hooks.json` for the exact `sessionStart` matcher entry; re-run Step 3 alone to isolate an adapter-level failure from a dispatch-level one; if a transcript grep count is unexpectedly non-zero, treat it as a genuine CLI behavior change and escalate rather than silently updating this scenario's tier claim |

### Optional Supplemental Checks

#### Supplemental Check 1: No-active-goal no-op

```bash
MK_GOAL_STATE_DIR="$ISO" node .opencode/hooks/goal/bin/goal.cjs clear
printf '%s' '{"hook_event_name":"sessionStart","workspace_roots":["'"$PWD"'"]}' | MK_GOAL_STATE_DIR="$ISO" node .opencode/hooks/goal/cursor/goal-inject.mjs
```

Live-verified this packet: with no active goal, the adapter returns exactly `{"permission":"allow"}` -- no `agent_message` key at all, confirming the adapter never emits an empty or placeholder block, and never increments `turns_used` in this branch.

Verdict: PASS.

#### Supplemental Check 2: `preToolUse`/`stop` non-delivery, honestly documented rather than adapter-tested

Cursor ships exactly one goal adapter -- there is no `preToolUse` or `stop` goal hook to invoke, because packet `032-goal-hooks-cross-runtime`'s own phase-002 capability probes found `beforeSubmitPrompt`'s `agent_message` non-delivering (confirmed absent from the model-visible transcript, matching this scenario's own Step 6 finding) and `stop` never firing under the tested Cursor CLI build. `.opencode/hooks/goal/cursor/goal-inject.mjs`'s header comment states this explicitly: *"sessionStart is therefore the only adapter this runtime gets."* This supplemental check is a documentation-presence check, not a live probe:

```bash
grep -n "preToolUse's agent_message\|never fires\|sessionStart is therefore the only adapter" .opencode/hooks/goal/cursor/goal-inject.mjs
```

Expected: the grep returns the cited lines from the adapter's own header, confirming the gap is documented in the shipped code, not merely in a spec doc that could drift out of sync.

Verdict: PASS.

#### Supplemental Check 3: `MK_GOAL_STATE_DIR` isolation proof

```bash
REAL_STATE=.opencode/skills/.goal-state/active-goal.json
before=$([ -f "$REAL_STATE" ] && shasum "$REAL_STATE" || echo absent)
ISO=$(mktemp -d /tmp/cu-027-isolation.XXXXXX)
MK_GOAL_STATE_DIR="$ISO" node .opencode/hooks/goal/bin/goal.cjs set "Isolation canary CU-027-ISO-4471" --budget 10
after=$([ -f "$REAL_STATE" ] && shasum "$REAL_STATE" || echo absent)
[ "$before" = "$after" ] && echo UNCHANGED || echo CHANGED
grep -q "CU-027-ISO-4471" "$REAL_STATE" 2>/dev/null && echo LEAK || echo NO_LEAK
```

Live-verified: `$REAL_STATE` was `absent` both before and after, and the canary string never reaches the real state file -- `UNCHANGED` / `NO_LEAK`. Every command sequence in this file uses an isolated `MK_GOAL_STATE_DIR`; none of them ever runs against the real `.goal-state/` tree.

Verdict: PASS.

#### Supplemental Check 4: LIVE Cursor validation (this packet, recorded-evidence tier)

The packet's own live validation run against real `cursor-agent` confirms both halves of the recorded-evidence claim in one dispatch:

- Model: `composer-2.5` (paid tier). Canary: `GOALCANARY-CU-349522064`.
- Command shape: `MK_GOAL_STATE_DIR=<iso> MK_GOAL_RUNTIME_LABEL=Cursor cursor-agent -p "<prompt>" --output-format text --model composer-2.5 --auto-review --sandbox enabled </dev/null`.
- Part 1, hook fires: `turns_used` moved `0` -> `1` across the dispatch, proving `.cursor/hooks.json`'s `sessionStart` entry called `goal/cursor/goal-inject.mjs`, which called `recordTurn({runtime:'cursor'})`.
- Part 2, injection is model-invisible: grepping the real Cursor agent-transcript JSONL (`~/.cursor/projects/.../agent-transcripts/<sid>/<sid>.jsonl`) found `0` occurrences of `[active_goal` and `0` occurrences of the canary string. The model's own reply could not and did not cite the goal.
- Both facts are captured verbatim in `../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/cursor-recorded-evidence.txt`, which also notes this is a repeat confirmation: non-delivery was previously observed at `n=2` in the packet's phase-004 capability probes, and this run brings it to `n=3`.

This IS the documented PASS condition for Cursor -- not a failure, and not a lesser result than Devin's model-visible confirmation in the sibling `DV-022` scenario. The two runtimes have genuinely different adapter capability ceilings, and this scenario's job is to prove Cursor sits honestly at its own ceiling rather than silently inheriting Devin's stronger claim.

Verdict: PASS (live-confirmed at the recorded-evidence tier, not a projected result, and not equivalent to a model-visibility PASS).

---

## 4. SOURCE FILES

### Playbook Sources

|| File | Role |
||---|---|
|| `manual-testing-playbook.md` | Root directory page and scenario summary |
|| (none) | No feature-catalog entry yet -- `goal/` is documented via its own `README.md`, not a `feature-catalog/` package |

### Implementation And Test Anchors

|| File | Role |
||---|---|
|| `../../../../../hooks/goal/lib/goal-core.cjs` | Shared state I/O, `[active_goal]` render, `recordTurn`, prompt-injection hardening (exercised directly in the sibling `cli-devin` `DV-022` scenario; not re-tested here to keep this file scoped to Cursor's own adapter surface) |
|| `../../../../../hooks/goal/bin/goal.cjs` | The manage CLI this scenario's isolation and canary-setup steps use |
|| `../../../../../hooks/goal/cursor/goal-inject.mjs` | The single Cursor adapter this scenario validates, including its own header-documented non-delivery finding for `beforeSubmitPrompt`/`stop` |
|| `../../../../../hooks/goal/README.md` | The documented per-runtime parity tiers this scenario reproduces for Cursor specifically |
|| `.cursor/hooks.json` | Registers `goal-inject.mjs` under `sessionStart` |
|| `../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/cursor-recorded-evidence.txt` | Live recorded-evidence-tier confirmation (Supplemental Check 4) |

---

## 5. SOURCE METADATA

- Group: Goal Hook
- Playbook ID: CU-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `goal-hook/goal-hook.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
