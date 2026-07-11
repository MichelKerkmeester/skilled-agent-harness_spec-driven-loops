---
title: "CO-035 -- DeepSeek-v4-pro via the direct DeepSeek API through sk-prompt/prompt-models + sk-prompt (triple-skill flow)"
description: "Verifies the canonical three-skill happy-path for direct DeepSeek API work: sk-prompt/prompt-models surfaces via the advisor, sk-prompt composes a CLEAR-passing prompt with --variant high, and cli-opencode dispatches via deepseek/deepseek-v4-pro."
version: 1.3.0.9
---

# CO-035 -- DeepSeek-v4-pro via the direct DeepSeek API through sk-prompt/prompt-models + sk-prompt (triple-skill flow)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-035`.

---

## 1. OVERVIEW

DeepSeek-v4-pro is dispatched via the direct DeepSeek API (`deepseek/deepseek-v4-pro`) — the default provider declared in `sk-prompt/prompt-models/assets/model_profiles.json` and in `cli-opencode` SKILL.md §3. This scenario validates that path through the full three-skill flow: `sk-prompt/prompt-models` surfaces in the advisor, `sk-prompt` composes the prompt with `--variant high`, and `cli-opencode` dispatches the result.

### Why This Matters

The direct DeepSeek API is the default cli-opencode provider for DeepSeek work. The sk-prompt/prompt-models dispatch matrix encodes that knowledge and surfaces the correct executor. This scenario proves the wiring works end-to-end — from advisor recommendation through prompt composition to successful dispatch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-035` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the three-skill flow on a DeepSeek-v4-pro dispatch via the direct DeepSeek API.
- Real user request: `Run DeepSeek-v4-pro on this — use the direct DeepSeek API.`
- Prompt: `Consult sk-prompt/prompt-models for the DeepSeek-v4-pro dispatch matrix and pick the cli-opencode direct DeepSeek API path. Compose the prompt through sk-prompt with the right framework and --variant high recommendation. Dispatch with --model deepseek/deepseek-v4-pro --variant high.`
- Expected execution process: Advisor surfaces sk-prompt/prompt-models + cli-opencode -> read model_profiles.json deepseek-v4-pro entry to confirm direct DeepSeek API path -> compose through sk-prompt -> opencode dispatches.
- Expected signals: Advisor confidence ≥ 0.85 for sk-prompt/prompt-models AND ≥ 0.80 for cli-opencode. Composed prompt declares `--variant high`. `opencode run --model deepseek/deepseek-v4-pro --variant high --dir <repo-root>` exits 0. Output addresses pre-plan acceptance criteria.
- Desired user-visible outcome: A working implementation + matrix-consultation evidence showing the direct DeepSeek API path was consciously picked.
- Pass/fail: PASS if advisor surfaces both skills AND prompt declares `--variant high` AND `opencode` exits 0 AND output meets pre-plan criteria. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the advisor smoke test: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "DeepSeek-v4-pro direct API dispatch"` and confirm `sk-prompt/prompt-models` + `cli-opencode` both surface above 0.8.
2. Read `.opencode/skills/sk-prompt/prompt-models/assets/model_profiles.json` deepseek-v4-pro entry. Confirm the direct DeepSeek API executor path and document why it is chosen (e.g., `DEEPSEEK_API_KEY` available, direct API is the default).
3. Run the cli-opencode provider auth pre-flight: `opencode providers list | grep deepseek` to confirm the provider is configured.
4. Pick a task: "refactor a 2-file class hierarchy to inject a dependency, preserve the public API + all tests passing."
5. Compose `/tmp/co-035-prompt.md` via sk-prompt with RCAF / STAR + medium-density pre-plan + standard bundle-gate.
6. Dispatch `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-035-prompt.md)" </dev/null`.
7. Verify the output addresses the pre-plan acceptance criteria.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-035 | DeepSeek-v4-pro via the direct DeepSeek API through sk-prompt/prompt-models + sk-prompt | Verify three-skill flow on DeepSeek-v4-pro dispatch via the direct DeepSeek API | `Consult sk-prompt/prompt-models for the DeepSeek-v4-pro dispatch matrix and pick the cli-opencode direct DeepSeek API path. Compose the prompt through sk-prompt with the right framework and --variant high recommendation. Dispatch with --model deepseek/deepseek-v4-pro --variant high.` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "DeepSeek-v4-pro direct API dispatch" \| jq -r '.[:3][] \| "\(.skill) \(.confidence)"'` -> 2. `bash: jq '.models[] \| select(.id == "deepseek-v4-pro") \| .executors[]' .opencode/skills/sk-prompt/prompt-models/assets/model_profiles.json` -> 3. `bash: opencode providers list \| grep deepseek` -> 4. compose `/tmp/co-035-prompt.md` with RCAF + medium pre-plan + standard bundle-gate -> 5. `bash: opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-035-prompt.md)" > /tmp/co-035-output.json 2>&1 </dev/null; echo "Exit: $?"` -> 6. inspect output | Step 1: sk-prompt/prompt-models ≥ 0.85, cli-opencode ≥ 0.80; Step 2: direct DeepSeek API executor visible; Step 3: deepseek listed as a provider; Step 4: prompt has `--variant high` directive; Step 5: exit 0; Step 6: output addresses pre-plan criteria | Advisor output, model-profiles entry, providers list output, prompt file, dispatch JSON | PASS if all 6 conditions met; FAIL otherwise | (1) If advisor confidence low: rebuild graph via skill_graph_compiler.py; (2) if deepseek provider missing: `opencode providers login deepseek`; (3) if `DEEPSEEK_API_KEY` is unset: set the env var and retry; (4) if dispatch hangs >15min: kill via `pkill -f 'opencode run'` and retry with smaller scope |

### Optional Supplemental Checks

- Compare prompt quality with variant levels (low / medium / high / max) — confirm `--variant high` produces the most coherent output for this task class.
- Run the dispatch a second time to confirm result consistency across runs.
- Compare the direct DeepSeek API dispatch against other models in the sk-prompt/prompt-models matrix (e.g., Kimi) to validate the matrix routing logic.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../../sk-prompt/prompt-models/SKILL.md` | Dispatch matrix table |
| `../../../../sk-prompt/prompt-models/references/pattern_index.md` | Pattern-to-canonical-location map |
| `../../../../sk-prompt/prompt-models/assets/model_profiles.json` | deepseek-v4-pro entry: executor paths |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Provider Auth Pre-Flight + default provider (deepseek/deepseek-v4-pro) |
| `../../../../system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Advisor scorer entry point |
| `../../references/permissions-matrix.md` | Structured permissions schema for dispatches with `--permissions-matrix` flag |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-035
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `prompt-templates/deepseek-v4-direct-with-sk-prompt-models.md`
