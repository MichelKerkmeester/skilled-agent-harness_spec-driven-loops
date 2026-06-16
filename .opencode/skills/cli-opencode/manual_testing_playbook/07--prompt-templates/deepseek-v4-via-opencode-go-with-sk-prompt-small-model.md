---
title: "CO-035 -- DeepSeek-v4-pro via opencode-go through sk-prompt-small-model + sk-prompt (triple-skill flow)"
description: "Verifies the canonical three-skill happy-path for opencode-go-pool DeepSeek work: sk-prompt-small-model surfaces via the advisor, sk-prompt composes a CLEAR-passing prompt with --variant high, and cli-opencode dispatches via opencode-go/deepseek-v4-pro."
---

# CO-035 -- DeepSeek-v4-pro via opencode-go through sk-prompt-small-model + sk-prompt (triple-skill flow)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-035`.

---

## 1. OVERVIEW

DeepSeek-v4-pro has two dispatch paths declared in `sk-prompt-small-model/assets/model_profiles.json`: cli-opencode via DeepSeek API direct, and cli-opencode via opencode-go. This scenario validates the opencode-go provider route — through the full three-skill flow: `sk-prompt-small-model` surfaces in the advisor, `sk-prompt` composes the prompt with `--variant high`, and `cli-opencode` dispatches the result.

### Why This Matters

The opencode-go pool is the default cli-opencode provider (per cli-opencode SKILL.md §3). Its credits exhaust workspace-wide and produce a `401 Insufficient balance` error — operators need a path-aware mental model to swap to DeepSeek API direct when this happens. The sk-prompt-small-model dispatch matrix encodes that knowledge. This scenario proves the wiring works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-035` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the three-skill flow on a DeepSeek-v4-pro dispatch via the opencode-go provider path.
- Real user request: `Run DeepSeek-v4-pro on this — use opencode-go.`
- Prompt: `Consult sk-prompt-small-model for the DeepSeek-v4-pro dispatch matrix and pick the cli-opencode opencode-go path (vs DeepSeek API direct). Compose the prompt through sk-prompt with the right framework and --variant high recommendation. Dispatch with --model opencode-go/deepseek-v4-pro --variant high.`
- Expected execution process: Advisor surfaces sk-prompt-small-model + cli-opencode -> read model_profiles.json deepseek-v4-pro entry to confirm opencode-go path exists -> compose through sk-prompt -> opencode dispatches.
- Expected signals: Advisor confidence ≥ 0.85 for sk-prompt-small-model AND ≥ 0.80 for cli-opencode. Composed prompt declares `--variant high`. `opencode run --model opencode-go/deepseek-v4-pro --variant high --dir <repo-root>` exits 0. Output addresses pre-plan acceptance criteria.
- Desired user-visible outcome: A working implementation + matrix-consultation evidence showing the opencode-go path was consciously picked.
- Pass/fail: PASS if advisor surfaces both skills AND prompt declares `--variant high` AND `opencode` exits 0 AND output meets pre-plan criteria. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the advisor smoke test: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "DeepSeek-v4-pro via opencode-go"` and confirm `sk-prompt-small-model` + `cli-opencode` both surface above 0.8.
2. Read `.opencode/skills/sk-prompt-small-model/assets/model_profiles.json` deepseek-v4-pro entry. Confirm 2 executor paths and document why opencode-go is chosen (e.g., no DeepSeek API key, opencode-go credits available).
3. Run the cli-opencode provider auth pre-flight: `opencode providers list | grep opencode-go` to confirm the provider is configured.
4. Pick a task: "refactor a 2-file class hierarchy to inject a dependency, preserve the public API + all tests passing."
5. Compose `/tmp/co-035-prompt.md` via sk-prompt with RCAF / STAR + medium-density pre-plan + standard bundle-gate.
6. Dispatch `opencode run --model opencode-go/deepseek-v4-pro --variant high --agent general --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-035-prompt.md)" </dev/null`.
7. Verify the output addresses the pre-plan acceptance criteria.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-035 | DeepSeek-v4-pro via opencode-go through sk-prompt-small-model + sk-prompt | Verify three-skill flow on DeepSeek-v4-pro dispatch via opencode-go provider | `Consult sk-prompt-small-model for the DeepSeek-v4-pro dispatch matrix and pick the cli-opencode opencode-go path. Compose the prompt through sk-prompt with the right framework and --variant high recommendation. Dispatch with --model opencode-go/deepseek-v4-pro --variant high.` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "DeepSeek-v4-pro via opencode-go" \| jq -r '.[:3][] \| "\(.skill) \(.confidence)"'` -> 2. `bash: jq '.models[] \| select(.id == "deepseek-v4-pro") \| .executors[]' .opencode/skills/sk-prompt-small-model/assets/model_profiles.json` -> 3. `bash: opencode providers list \| grep opencode-go` -> 4. compose `/tmp/co-035-prompt.md` with RCAF + medium pre-plan + standard bundle-gate -> 5. `bash: opencode run --model opencode-go/deepseek-v4-pro --variant high --agent general --format json --dir "$(git rev-parse --show-toplevel)" --pure --dangerously-skip-permissions "$(cat /tmp/co-035-prompt.md)" > /tmp/co-035-output.json 2>&1 </dev/null; echo "Exit: $?"` -> 6. inspect output | Step 1: sk-prompt-small-model ≥ 0.85, cli-opencode ≥ 0.80; Step 2: 2 executors visible; Step 3: opencode-go listed; Step 4: prompt has `--variant high` directive; Step 5: exit 0; Step 6: output addresses pre-plan criteria | Advisor output, model-profiles entry, providers list output, prompt file, dispatch JSON | PASS if all 6 conditions met; FAIL otherwise | (1) If advisor confidence low: rebuild graph via skill_graph_compiler.py; (2) if opencode-go missing: `opencode providers login opencode-go`; (3) if 401 Insufficient balance: switch to DeepSeek API direct per the dispatch matrix; (4) if dispatch hangs >15min: kill via `pkill -f 'opencode run'` and retry with smaller scope |

### Optional Supplemental Checks

- Repeat the dispatch with `--model deepseek/deepseek-v4-pro` (DeepSeek API direct) to compare both paths.
- Test the quota_pool fallback path: dispatch when opencode-go is exhausted and verify the operator can swap to DeepSeek API direct using the matrix.
- Compare prompt quality with variant levels (low / medium / high / max) — confirm `--variant high` produces the most coherent output for this task class.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../sk-prompt-small-model/SKILL.md` | Dispatch matrix table |
| `../../../sk-prompt-small-model/references/pattern_index.md` | Pattern-to-canonical-location map |
| `../../../sk-prompt-small-model/assets/model_profiles.json` | deepseek-v4-pro entry: 2 executor paths |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Provider Auth Pre-Flight + opencode-go default |
| `../../../system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Advisor scorer entry point |
| `../../references/permissions-matrix.md` | Structured permissions schema for dispatches with `--permissions-matrix` flag |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-035
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/deepseek-v4-via-opencode-go-with-sk-prompt-small-model.md`
