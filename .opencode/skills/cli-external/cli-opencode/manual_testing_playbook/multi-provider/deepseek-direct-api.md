---
title: "CO-011 -- deepseek direct API (deepseek-v4-pro)"
description: "This scenario validates the deepseek direct API provider for `CO-011`. It focuses on confirming `--model deepseek/deepseek-v4-pro --variant high` runs successfully via the direct deepseek provider and produces a coherent response."
version: 1.3.0.11
---

# CO-011 -- deepseek direct API (deepseek-v4-pro)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-011`.

---

## 1. OVERVIEW

This scenario validates the deepseek direct API for `CO-011`. It focuses on confirming `--model deepseek/deepseek-v4-pro --variant high` runs successfully through the direct DeepSeek provider — the default cli-opencode provider for DeepSeek work — and produces a coherent response. The direct deepseek provider is the primary surface in the cli-opencode skill model selection table.

### Why This Matters

The cli-opencode skill defaults to `deepseek` (direct DeepSeek API) for DeepSeek work. This provider requires a valid `DEEPSEEK_API_KEY` and its own registered credentials. If `--model deepseek/deepseek-v4-pro` fails resolution, the documented default provider surface is broken and operators cannot dispatch DeepSeek work through cli-opencode.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--model deepseek/deepseek-v4-pro --variant high` resolves correctly via the direct deepseek provider and produces a coherent response, validating the provider is registered and reachable.
- Real user request: `Run opencode run with the direct DeepSeek API (deepseek/deepseek-v4-pro) and have it answer a small implementation-planning question. Confirm the model id in the JSON event stream is deepseek-v4-pro and the response is coherent.`
- Prompt: `Run deepseek/deepseek-v4-pro with --variant high on a small migration-planning prompt; verify model id, exit code, and coherent output.`
- Expected execution process: External-AI orchestrator dispatches with `--model deepseek/deepseek-v4-pro --variant high` plus a planning prompt, captures the JSON event stream, parses the session.completed event for the model identifier and inspects the response for coherence.
- Expected signals: Dispatch exits 0. Session.completed references `deepseek-v4-pro`. Response is non-empty and coherent. Runtime under 180 seconds.
- Desired user-visible outcome: Verdict naming the resolved model id and one quoted sentence from the response.
- Pass/fail: PASS if exit 0 AND model is `deepseek-v4-pro` AND response is non-empty and coherent. FAIL if model resolves differently, response is empty/an error, or dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `--model deepseek/deepseek-v4-pro --variant high` plus a planning prompt.
3. Parse the JSON event stream and extract the model identifier from session.completed.
4. Confirm the response is non-empty and coherent.
5. Return a verdict naming model id with a quoted excerpt.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-011 | deepseek direct API (deepseek-v4-pro) | Confirm `--model deepseek/deepseek-v4-pro --variant high` resolves via the direct deepseek provider and produces a coherent response | `Run deepseek/deepseek-v4-pro with --variant high on a small migration-planning prompt; verify model id, exit code, and coherent output.` | 1. `bash: opencode run --model deepseek/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" "Plan a three-step migration sequence for adding a NOT NULL column with a default value to a 1M-row PostgreSQL table without taking the table offline. Be concise but specific about each step." > /tmp/co-011-events.jsonl 2>&1` -> 2. `bash: echo "Exit: $?"` -> 3. `bash: jq -r 'select(.type == "session.completed") \| .payload' /tmp/co-011-events.jsonl \| grep -ciE 'deepseek-v4-pro'` -> 4. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-011-events.jsonl \| wc -c` | Step 1: events captured non-empty; Step 2: exit 0; Step 3: deepseek-v4-pro identified in session.completed (count >= 1); Step 4: response byte count > 400 (coherent paragraph, not empty / error) | `/tmp/co-011-events.jsonl`, terminal grep counts | PASS if exit 0 AND model id is deepseek-v4-pro AND response > 400 bytes; FAIL if any check fails | 1. If dispatch fails with `provider/model not found`, run `opencode providers` to confirm `deepseek` is registered and authenticated (`opencode providers login deepseek`); 2. If `DEEPSEEK_API_KEY` is missing, the direct provider fails at session start — set the env var and retry; 3. If model id is missing from JSON, fall back to `--print-logs --log-level DEBUG` and look for the resolution event to confirm the dispatch went through `deepseek/`; 4. If response is empty or an error, re-run with `--print-logs --log-level DEBUG` to capture the upstream error |

### Optional Supplemental Checks

For provider validation, dispatch the same prompt against `--model deepseek/deepseek-v4-pro` on a second run and confirm the resolved provider is consistently `deepseek` across runs. Also compare with a different model (e.g., `kimi-for-coding/k2p7`) to confirm providers are independent surfaces.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§5 MODEL SELECTION) | Provider table including deepseek direct API |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 user override table — deepseek direct API as default provider surface |
| `../../references/cli_reference.md` | §5 deepseek model ids (`deepseek-v4-pro`, `deepseek-v4-flash`) and reasoning-effort variant range |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `multi-provider/deepseek-direct-api.md`
