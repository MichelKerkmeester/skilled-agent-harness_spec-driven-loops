---
title: "CX-002 -- gpt-5.5 default model + GPT-5.6 roster"
description: "This scenario validates the gpt-5.5 default pin for `CX-002` and confirms the documented GPT-5.6 model roster (luna / terra / sol) is callable via --model."
version: 1.4.0.9
---

# CX-002 -- gpt-5.5 default model + GPT-5.6 roster

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-002`.

---

## 1. OVERVIEW

This scenario validates that `gpt-5.5` is the documented default and that an explicit `--model gpt-5.5` pin produces a successful response, then confirms the wider roster — `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol` — is callable via `--model` on the `fast` tier. It leaves a paper trail that the documented roster matches what the CLI actually accepts.

### Why This Matters

SKILL.md §3 and `references/cli_reference.md` §5 name `gpt-5.5` at `medium` as the skill default and list three GPT-5.6 models as selectable, each with its own reasoning-effort ceiling. If the docs drift from the models the installed Codex actually accepts, every model-selection recommendation loses its footing. This scenario keeps the roster contract honest in both directions: the default still works, and the documented alternates are real.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify the `gpt-5.5` default pin succeeds end-to-end and that each documented roster model (`gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol`) responds via `--model`.
- Real user request: `Confirm gpt-5.5 is still the default and that the gpt-5.6 models we document actually respond.`
- Prompt: `Confirm the cli-codex gpt-5.5 default pin works and the documented gpt-5.6 roster is callable.`
- Expected execution process: Operator confirms `references/cli_reference.md` §5 lists `gpt-5.5` (default) plus `gpt-5.6-luna` / `gpt-5.6-terra` / `gpt-5.6-sol` -> dispatches a small doc-style task with `--model gpt-5.5` explicit -> smoke-dispatches each GPT-5.6 model with a trivial prompt -> captures the dispatched command lines and stdout -> records the roster confirmation in evidence.
- Expected signals: The `gpt-5.5` dispatch exits 0 with `--model gpt-5.5` explicitly passed and returns coherent prose. Each GPT-5.6 smoke dispatch exits 0 and returns a reply. The skill reference (`references/cli_reference.md` §5) lists all four models with per-model reasoning-effort ceilings.
- Desired user-visible outcome: Confirmation that the documented default works and every documented roster model is genuinely callable — no phantom model IDs in the docs.
- Pass/fail: PASS if the `gpt-5.5` dispatch exits 0 with the explicit pin, each roster smoke dispatch exits 0, AND `references/cli_reference.md` §5 lists all four models. FAIL if any documented model fails to dispatch or the doc lists a model the CLI rejects.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `references/cli_reference.md` §5 and confirm the four-model roster (`gpt-5.5` default + `gpt-5.6-luna` / `gpt-5.6-terra` / `gpt-5.6-sol`).
2. Dispatch a small documentation prompt with the explicit `gpt-5.5` pin.
3. Smoke-dispatch each GPT-5.6 model with a trivial prompt (`"Reply with exactly: OK"`).
4. Capture the dispatched command lines and stdout.
5. Verify exit code 0 for every dispatch and coherent output.
6. Return a one-line PASS/FAIL.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-002 | gpt-5.5 default model + GPT-5.6 roster | Verify the gpt-5.5 default pin succeeds and the documented gpt-5.6 roster is callable | `Confirm the cli-codex gpt-5.5 default pin works and the documented gpt-5.6 roster is callable.` | 1. `bash: grep -A 6 "Supported Models" .opencode/skills/cli-external-orchestration/cli-codex/references/cli_reference.md` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only "Explain in two sentences what 'idempotent' means in a REST API context." > /tmp/cli-codex-cx002.txt 2>&1` -> 3. `bash: for m in gpt-5.6-luna gpt-5.6-terra gpt-5.6-sol; do codex exec --model "$m" -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "Reply with exactly: OK" > "/tmp/cli-codex-cx002-$m.txt" 2>&1; echo "$m rc=$?"; done` -> 4. `bash: cat /tmp/cli-codex-cx002.txt /tmp/cli-codex-cx002-gpt-5.6-*.txt` | Step 1: all four models listed under Supported Models with per-model ceilings; Step 2: exit 0, coherent two-sentence definition; Step 3: each model prints `rc=0` and its stdout contains a reply | Captured stdout files (`/tmp/cli-codex-cx002*.txt`), dispatched command lines, exit codes, grep output from Step 1 | PASS if the `gpt-5.5` dispatch exits 0 with the explicit pin, each gpt-5.6 dispatch exits 0, AND cli_reference.md §5 lists all four models; FAIL if any documented model fails to dispatch OR the doc lists a model the CLI rejects | (1) Re-read `cli_reference.md` §5 to confirm the roster matches the installed CLI; (2) re-run any failed dispatch with `2>&1 \| tee` for stderr inline; (3) check ChatGPT OAuth validity (`codex login status`) if exit non-zero |

### Optional Supplemental Checks

- Confirm SKILL.md §3 Model Selection lists the same four models and per-model reasoning-effort ceilings (consistency check across the skill's own docs).
- Confirm `~/.codex/config.toml` profiles `luna-impl` (`gpt-5.6-luna` / `max`) and `sol-verify` (`gpt-5.6-sol` / `xhigh`) still resolve if the operator relies on them.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation, §3 Model Selection) | Documents the default pin, the roster, and selection strategy |
| `../../references/cli_reference.md` (§5 Model Selection) | Authoritative model roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli_reference.md` | §5 Supported Models table - the authoritative roster |
| `../../SKILL.md` | §3 Default Invocation - documents the `gpt-5.5` pin and roster |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CX-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `cli_invocation/gpt_5_5_model_lock.md`
