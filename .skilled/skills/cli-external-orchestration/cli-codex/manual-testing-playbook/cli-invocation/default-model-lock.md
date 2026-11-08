---
title: "CX-002 -- gpt-6-luna default model + alternate roster"
description: "This scenario validates the gpt-6-luna default pin for `CX-002` and confirms the documented alternate model roster is callable via --model."
version: 1.9.3.0
---

# CX-002 -- gpt-6-luna default model + alternate roster

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-002`.

---

## 1. OVERVIEW

This scenario validates that `gpt-6-luna` is the documented default and that an explicit `--model gpt-6-luna` pin produces a successful response, then confirms the wider roster — `gpt-5.5`, `gpt-5.6-terra`, `gpt-6.1-terra`, `gpt-6-sol` — is callable via `--model` on the `fast` tier. It leaves a paper trail that the documented roster matches what the CLI actually accepts.

### Why This Matters

SKILL.md §3 and `references/cli-reference.md` §5 name `gpt-6-luna` at `medium` as the skill default and list GPT-5.5, Terra and Sol as selectable, each with its own reasoning-effort ceiling. If the docs drift from the models the installed Codex actually accepts, every model-selection recommendation loses its footing. This scenario keeps the roster contract honest in both directions: the default still works, and the documented alternates are real. A ChatGPT-account login accepts only the models its plan lists, so an alternate the plan omits is a plan limit rather than doc drift, and the operator passes `-m` for one the plan lists. The deep-loop fan-out shares the same `gpt-6-luna` fallback (`CODEX_DEFAULT_MODEL` in `fanout-run.cjs`), which this scenario does not test.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify the `gpt-6-luna` default pin succeeds end-to-end and that each documented alternate model (`gpt-5.5`, `gpt-5.6-terra`, `gpt-6.1-terra`, `gpt-6-sol`) responds via `--model`.
- Real user request: `Confirm gpt-6-luna is still the default and that the GPT-5.5, Terra and Sol models we document actually respond.`
- Prompt: `Confirm the cli-codex gpt-6-luna default pin works and the documented alternate roster is callable.`
- Expected execution process: Operator confirms `references/providers-and-models.md` §2 lists `gpt-6-luna` (default) plus `gpt-5.5` / `gpt-5.6-terra` / `gpt-6.1-terra` / `gpt-6-sol` -> dispatches a small doc-style task with `--model gpt-6-luna` explicit -> smoke-dispatches each alternate model with a trivial prompt -> captures the dispatched command lines and stdout -> records the roster confirmation in evidence.
- Expected signals: The `gpt-6-luna` dispatch exits 0 with `--model gpt-6-luna` explicitly passed and returns coherent prose. Each alternate smoke dispatch exits 0 and returns a reply. The skill reference (`references/providers-and-models.md` §2) lists all five models with per-model reasoning-effort ceilings.
- Desired user-visible outcome: Confirmation that the documented default works and every documented roster model is genuinely callable — no phantom model IDs in the docs.
- Pass/fail: PASS if the `gpt-6-luna` dispatch exits 0 with the explicit pin, each alternate smoke dispatch exits 0, AND `references/providers-and-models.md` §2 lists all five models. FAIL if the default fails to dispatch or the doc lists a model the CLI catalog rejects; a model the account's plan omits is a plan limit, not doc drift.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `references/providers-and-models.md` §2 and confirm the five-model roster (`gpt-6-luna` default + `gpt-5.5` / `gpt-5.6-terra` / `gpt-6.1-terra` / `gpt-6-sol`).
2. Dispatch a small documentation prompt with the explicit `gpt-6-luna` pin.
3. Smoke-dispatch each alternate model with a trivial prompt (`"Reply with exactly: OK"`).
4. Capture the dispatched command lines and stdout.
5. Verify exit code 0 for every dispatch and coherent output.
6. Return a one-line PASS/FAIL.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-002 | gpt-6-luna default model + alternate roster | Verify the gpt-6-luna default pin succeeds and the documented alternate roster is callable | `Confirm the cli-codex gpt-6-luna default pin works and the documented alternate roster is callable.` | 1. `bash: grep -A 8 "### OpenAI" .skilled/skills/cli-external-orchestration/cli-codex/references/providers-and-models.md` -> 2. `codex exec --model gpt-6-luna -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox read-only "Explain in two sentences what 'idempotent' means in a REST API context." > /tmp/cli-codex-cx002.txt 2>&1` -> 3. `bash: for m in gpt-5.5 gpt-5.6-terra gpt-6.1-terra gpt-6-sol; do codex exec --model "$m" -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "Reply with exactly: OK" > "/tmp/cli-codex-cx002-$m.txt" 2>&1; echo "$m rc=$?"; done` -> 4. `bash: cat /tmp/cli-codex-cx002.txt /tmp/cli-codex-cx002-gpt-*.txt` | Step 1: all five models listed in the OpenAI roster table with per-model ceilings; Step 2: exit 0, coherent two-sentence definition; Step 3: each model prints `rc=0` and its stdout contains a reply | Captured stdout files (`/tmp/cli-codex-cx002*.txt`), dispatched command lines, exit codes, grep output from Step 1 | PASS if the `gpt-6-luna` dispatch exits 0 with the explicit pin, each alternate dispatch exits 0, AND providers-and-models.md §2 lists all five models; FAIL if the default fails to dispatch OR the doc lists a model the CLI catalog rejects | (1) Re-read `providers-and-models.md` §2 to confirm the roster matches the installed CLI; (2) re-run any failed dispatch with `2>&1 \| tee` for stderr inline; (3) check ChatGPT OAuth validity (`codex login status`) and the plan's model list if exit non-zero |

### Optional Supplemental Checks

- Confirm SKILL.md §3 Model Selection lists the same five models and per-model reasoning-effort ceilings (consistency check across the skill's own docs).
- Confirm the `luna-impl` (`gpt-6-luna` / `max`) and `sol-verify` (`gpt-6-sol` / `xhigh`) profiles, `~/.codex/luna-impl.config.toml` and `~/.codex/sol-verify.config.toml`, still resolve if the operator relies on them.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Default Invocation, §3 Model Selection) | Documents the default pin, the roster, and selection strategy |
| `../../references/cli-reference.md` (§5 Model Selection) | Authoritative model roster |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/providers-and-models.md` | §2 OpenAI roster table, the authoritative roster |
| `../../SKILL.md` | §3 Default Invocation - documents the `gpt-6-luna` pin and roster |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CX-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/default-model-lock.md`
