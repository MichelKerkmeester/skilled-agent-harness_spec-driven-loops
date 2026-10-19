---
title: "CO-012 -- Variant levels (minimal/low/medium/high)"
description: "This scenario validates the `--variant` flag levels for `CO-012`. It focuses on confirming the `opencode-go/deepseek-v4-flash` variant range (minimal through the skill-verified `high` default) maps to reasoning effort and produces materially different response depth between extremes."
version: 1.4.1.0
---

# CO-012 -- Variant levels (minimal/low/medium/high)

**Version note.** The commands in this scenario target OpenCode 1 (1.19.3). Each has its OpenCode 2 (2.0.32) twin beside it. On OpenCode 2, check `opencode2 models` first, because `llmgateway/deepseek-v4.1-flash` is the route a 2.0.32 run used. The side-by-side layout and the version-specific flag surfaces live in the [install reference](../../references/install-and-versions.md).

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-012`.

---

## 1. OVERVIEW

On OpenCode 1, this scenario validates Variant levels for `CO-012`. It focuses on confirming the `--variant` flag accepts the documented per-provider range and that the response depth materially differs between extremes when the same prompt is dispatched. On OpenCode 2 the effort rides on the model selector (`-m provider/model#<level>`). The v2 reader confirms the provider in `opencode2 models` first. Underlying-model conventions apply: the DeepSeek-family reasoning models (via the opencode-go and Cline routes) accept reasoning-effort variants.

### Why This Matters

On OpenCode 1, the cli-opencode skill defaults to `--variant high` because routine dispatches benefit from elevated reasoning effort (per SKILL.md §3 and `references/cli-reference.md` §5). On OpenCode 2 the same effort rides on the model id (`-m opencode-go/deepseek-v4.1-flash#high`). If the variant flag is silently ignored or the levels leave reasoning depth unchanged, the skill default loses its value and operators have no real way to dial cost vs depth. This test proves the variant flag is functional by comparing `minimal` vs `high` (the skill's own verified default for `opencode-go/deepseek-v4-flash`, not an unverified `max` value, which is not enumerated for this provider anywhere in the current skill) for the same prompt and confirming the response byte count and depth differ materially.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-012` and confirm the expected signals without contradictory evidence.

- Objective: On OpenCode 1, confirm `--variant minimal` and `--variant high` produce materially different response depth for the same prompt on `opencode-go/deepseek-v4-flash`, proving the variant flag drives provider reasoning effort. On OpenCode 2 the same comparison rides on the model selector (`-m opencode-go/deepseek-v4.1-flash#minimal` versus `-m opencode-go/deepseek-v4.1-flash#high`). `high` is used as the upper comparison point because it is the one variant value this skill's own docs (SKILL.md §3 default invocation, `references/cli-reference.md` §5) vouch for on this provider, while `max` is not enumerated for deepseek anywhere in the current skill and its acceptance is unverified.
- Real user request: On OpenCode 1, `Run the same prompt twice — once with --variant minimal and once with --variant high — and show me how much longer and more detailed the high-effort response is.` On OpenCode 2 the same request is dispatched with the level on the model id (`-m provider/model#<level>`).
- Prompt: `Run the same architecture prompt with --variant minimal and high; compare response byte counts and trade-off dimension coverage.` On OpenCode 1, the levels ride on `--variant`. On OpenCode 2 the level rides on the model id (`-m provider/model#<level>`).
- Expected execution process: External-AI orchestrator dispatches the same prompt twice, captures both event streams, computes the response byte count for each, counts trade-off dimensions in each and validates the high-effort variant produces materially deeper output.
- Expected signals: Both dispatches exit 0. High-variant response byte count is at least 2x the minimal-variant byte count. High response weighs at least 2 more distinct trade-off dimensions than minimal. Both runs identify the same model.
- Desired user-visible outcome: Verdict naming both byte counts, both dimension counts and the variant ratio.
- Pass/fail: PASS if both exit 0 AND high byte count >= 2x minimal AND high dimensions >= minimal + 2. FAIL if variant flag has no effect (counts are roughly equal) or either dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. On OpenCode 1, dispatch with `--variant minimal` and capture the response. On OpenCode 2, the twin is `cd "$(pwd)" && opencode2 run --standalone -m opencode-go/deepseek-v4.1-flash#minimal --format json "<prompt>"`.
3. On OpenCode 1, dispatch with `--variant high` and capture the response. On OpenCode 2, the twin is `cd "$(pwd)" && opencode2 run --standalone -m opencode-go/deepseek-v4.1-flash#high --format json "<prompt>"`.
4. Compute byte counts and count trade-off dimensions for each.
5. Compare and return a verdict naming both metrics.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-012 | Variant levels (minimal/low/medium/high) | Confirm `--variant minimal` and `--variant high` produce materially different response depth for the same prompt on `opencode-go/deepseek-v4-flash` | `Run the same architecture prompt with --variant minimal and high; compare response byte counts and trade-off dimension coverage.` | On OpenCode 1: 1. `bash: opencode run --model opencode-go/deepseek-v4-flash --variant minimal --format json --dir "$(pwd)" "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-minimal.jsonl 2>&1 && echo "MINIMAL: $?"` -> 1b. (OpenCode 2) `bash: cd "$(pwd)" && opencode2 run --standalone -m opencode-go/deepseek-v4.1-flash#minimal --format json "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-minimal.jsonl 2>&1 && echo "MINIMAL: $?"` -> 2. `bash: opencode run --model opencode-go/deepseek-v4-flash --variant max --format json --dir "$(pwd)" "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-high.jsonl 2>&1 && echo "HIGH: $?"` -> 2b. (OpenCode 2) `bash: cd "$(pwd)" && opencode2 run --standalone -m opencode-go/deepseek-v4.1-flash#max --format json "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-high.jsonl 2>&1 && echo "HIGH: $?"` -> 3. `bash: MIN=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-minimal.jsonl \| wc -c); HIGH=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-high.jsonl \| wc -c); echo "MIN_BYTES=$MIN HIGH_BYTES=$HIGH RATIO=$(echo "scale=2; $HIGH/$MIN" \| bc)"` -> 4. `bash: MIN_DIMS=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-minimal.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); HIGH_DIMS=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-high.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); echo "MIN_DIMS=$MIN_DIMS HIGH_DIMS=$HIGH_DIMS"` On OpenCode 2, the step 3 and step 4 checks read the response text from the `text` events (`jq -r 'select(.type == "text") \| .part.text'`). A v2 reader confirms the provider in `opencode2 models` first, because this machine's v2 list has no `opencode-go` provider. | Step 1: MINIMAL exit 0. Step 2: HIGH exit 0. Step 3: HIGH_BYTES is at least 2x MIN_BYTES (RATIO >= 2.0). Step 4: HIGH_DIMS is at least MIN_DIMS + 2 (or both at the cap of 5, whichever indicates the depth lever moved) | `/tmp/co-012-minimal.jsonl`, `/tmp/co-012-high.jsonl`, terminal byte and dimension counts | PASS if both exit 0 AND HIGH_BYTES >= 2x MIN_BYTES AND HIGH response covers more dimensions. FAIL if variant has no effect or either dispatch fails | 1. If RATIO is close to 1.0, the variant flag may be silently ignored. Re-run with `--print-logs --log-level DEBUG` and look for a variant resolution log line. On OpenCode 2, `--print-logs` is kept on `run`, while `--log-level` is unverified on OpenCode 2.0.32. 2. If the model id resolution differs between runs, the variant may be coercing model selection. Verify both runs use the same model id. 3. For direct deepseek reasoning models, use the reasoning-effort variant accepted on that provider. 4. On OpenCode 1, confirm version v1.3.17. Older versions may use a different flag name (`--reasoning`) per `references/cli-reference.md` §9. On OpenCode 2 the effort rides on the model id (`-m provider/model#<level>`), since `run` has no `--variant` |

### Optional Supplemental Checks

On OpenCode 1, for full-spectrum validation on a provider whose full range is verified, run the low/medium/high/xhigh sweep against `openai/gpt-6-sol` and confirm byte counts increase monotonically. This catches regressions where two adjacent variants produce identical responses (effectively halving the operator's tuning surface). On OpenCode 2 the level rides on the model id as `-m provider/model#<level>`. Whether a given provider accepts one is unverified on OpenCode 2.0.32 ([install reference](../../references/install-and-versions.md)). Per-provider variant ranges to exercise (sourced from `references/cli-reference.md` §5, current as of this skill's v1.3.17 baseline, so re-verify against a live `opencode run --help` before relying on an unlisted value):

| Model | Variant range to sweep |
|---|---|
| `opencode-go/deepseek-v4-flash` | On OpenCode 1, reasoning model pinned to `--variant max` (its top thinking tier) by policy, now the skill's operative default. Treat any other value as unverified until smoke-tested. On OpenCode 2 the effort rides on the model id (`-m opencode-go/deepseek-v4.1-flash#max`). The v2 reader confirms the provider in `opencode2 models` first |
| `llmgateway/mimo-v2.6-pro` | On OpenCode 1, `--variant` maps to MiMo reasoning effort (`none`/`low`/`medium`/`high`), so always use `high` per the MiMo effort map. On OpenCode 2 the level rides on the model id (`-m llmgateway/mimo-v2.6-pro#high`). Whether the gateway accepts it is unverified on OpenCode 2.0.32 |
| `openai/gpt-6-sol` | On OpenCode 1, `--variant` maps to OpenAI reasoning effort (`none`/`low`/`medium`/`high`/`xhigh`). On OpenCode 2 the level rides on the model id (`-m openai/gpt-6-sol#<level>`). Whether the provider accepts it is unverified on OpenCode 2.0.32 |


---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§5 MODEL SELECTION + variant table) | Documents the variant range per provider |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 default invocation `--variant high` (OpenCode 1 only, since the OpenCode 2 form is `-m provider/model#<level>`) and user override table |
| `../../references/cli-reference.md` | §5 variant flag mapping per provider (OpenCode 1 only, with the OpenCode 2 form `-m provider/model#<level>`) and §9 version drift handling for `--variant` rename history |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `multi-provider/variant-levels-comparison.md`
