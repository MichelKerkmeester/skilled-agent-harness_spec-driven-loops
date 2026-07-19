---
title: "CO-012 -- Variant levels (minimal/low/medium/high)"
description: "This scenario validates the `--variant` flag levels for `CO-012`. It focuses on confirming the `deepseek/deepseek-v4-pro` variant range (minimal through the skill-verified `high` default) maps to reasoning effort and produces materially different response depth between extremes."
version: 1.3.0.12
---

# CO-012 -- Variant levels (minimal/low/medium/high)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-012`.

---

## 1. OVERVIEW

This scenario validates Variant levels for `CO-012`. It focuses on confirming the `--variant` flag accepts the documented per-provider range and that the response depth materially differs between extremes when the same prompt is dispatched. Underlying-model conventions apply: `deepseek` (reasoner) accepts reasoning-effort variants on its reasoning models.

### Why This Matters

The cli-opencode skill defaults to `--variant high` because routine dispatches benefit from elevated reasoning effort (per SKILL.md §3 and `references/cli-reference.md` §5). If the variant flag is silently ignored or the levels do not actually shift reasoning depth, the skill default loses its value and operators have no real way to dial cost vs depth. This test proves the variant flag is functional by comparing `minimal` vs `high` (the skill's own verified default for `deepseek/deepseek-v4-pro` — not an unverified `max` value, which is not enumerated for this provider anywhere in the current skill) for the same prompt and confirming the response byte count and depth differ materially.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--variant minimal` and `--variant high` produce materially different response depth for the same prompt on `deepseek/deepseek-v4-pro`, proving the variant flag actually drives provider reasoning effort. `high` is used as the upper comparison point because it is the one variant value this skill's own docs (SKILL.md §3 default invocation, `references/cli-reference.md` §5) actually vouch for on this provider; `max` is not enumerated for deepseek anywhere in the current skill and its acceptance is unverified.
- Real user request: `Run the same prompt twice — once with --variant minimal and once with --variant high — and show me how much longer and more detailed the high-effort response is.`
- Prompt: `Run the same architecture prompt with --variant minimal and high; compare response byte counts and trade-off dimension coverage.`
- Expected execution process: External-AI orchestrator dispatches the same prompt twice, captures both event streams, computes the response byte count for each, counts trade-off dimensions in each and validates the high-effort variant produces materially deeper output.
- Expected signals: Both dispatches exit 0. High-variant response byte count is at least 2x the minimal-variant byte count. High response weighs at least 2 more distinct trade-off dimensions than minimal. Both runs identify the same model.
- Desired user-visible outcome: Verdict naming both byte counts, both dimension counts and the variant ratio.
- Pass/fail: PASS if both exit 0 AND high byte count >= 2x minimal AND high dimensions >= minimal + 2. FAIL if variant flag has no effect (counts are roughly equal) or either dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `--variant minimal` and capture the response.
3. Dispatch with `--variant high` and capture the response.
4. Compute byte counts and count trade-off dimensions for each.
5. Compare and return a verdict naming both metrics.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-012 | Variant levels (minimal/low/medium/high) | Confirm `--variant minimal` and `--variant high` produce materially different response depth for the same prompt on `deepseek/deepseek-v4-pro` | `Run the same architecture prompt with --variant minimal and high; compare response byte counts and trade-off dimension coverage.` | 1. `bash: opencode run --model deepseek/deepseek-v4-pro --variant minimal --format json --dir "$(pwd)" "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-minimal.jsonl 2>&1 && echo "MINIMAL: $?"` -> 2. `bash: opencode run --model deepseek/deepseek-v4-pro --variant high --format json --dir "$(pwd)" "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-high.jsonl 2>&1 && echo "HIGH: $?"` -> 3. `bash: MIN=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-minimal.jsonl \| wc -c); HIGH=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-high.jsonl \| wc -c); echo "MIN_BYTES=$MIN HIGH_BYTES=$HIGH RATIO=$(echo "scale=2; $HIGH/$MIN" \| bc)"` -> 4. `bash: MIN_DIMS=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-minimal.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); HIGH_DIMS=$(jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-012-high.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); echo "MIN_DIMS=$MIN_DIMS HIGH_DIMS=$HIGH_DIMS"` | Step 1: MINIMAL exit 0; Step 2: HIGH exit 0; Step 3: HIGH_BYTES is at least 2x MIN_BYTES (RATIO >= 2.0); Step 4: HIGH_DIMS is at least MIN_DIMS + 2 (or both at the cap of 5, whichever indicates the depth lever moved) | `/tmp/co-012-minimal.jsonl`, `/tmp/co-012-high.jsonl`, terminal byte and dimension counts | PASS if both exit 0 AND HIGH_BYTES >= 2x MIN_BYTES AND HIGH response covers more dimensions; FAIL if variant has no effect or either dispatch fails | 1. If RATIO is close to 1.0, the variant flag may be silently ignored — re-run with `--print-logs --log-level DEBUG` and look for a variant resolution log line; 2. If the model id resolution differs between runs, the variant may be coercing model selection — verify both runs use the same model id; 3. For direct deepseek reasoning models, use the reasoning-effort variant accepted on that provider; 4. Confirm version v1.3.17 — older versions may use a different flag name (`--reasoning`) per `references/cli-reference.md` §9 |

### Optional Supplemental Checks

For full-spectrum validation on a provider whose full range is verified, run the low/medium/high/xhigh sweep against `openai/gpt-5.6-sol` and confirm byte counts increase monotonically. This catches regressions where two adjacent variants produce identical responses (effectively halving the operator's tuning surface). Per-provider variant ranges to exercise (sourced from `references/cli-reference.md` §5, current as of this skill's v1.3.17 baseline — re-verify against a live `opencode run --help` before relying on an unlisted value):

| Model | Variant range to sweep |
|---|---|
| `deepseek/deepseek-v4-pro` | reasoning effort accepted; only `high` is verified as this skill's operative default — treat any other value as unverified until smoke-tested |
| `deepseek/deepseek-v4-flash` | non-reasoning — `--variant` is ignored |
| `xiaomi-token-plan-ams/mimo-v2.5-pro` | `--variant` maps to MiMo reasoning effort (`low`/`medium`/`high`); always use `high` per the skill default |
| `openai/gpt-5.6-sol` | `--variant` maps to OpenAI reasoning effort: `none`/`low`/`medium`/`high`/`xhigh` |


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
| `../../SKILL.md` | §3 default invocation `--variant high` and user override table |
| `../../references/cli-reference.md` | §5 variant flag mapping per provider, §9 version drift handling for `--variant` rename history |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `multi-provider/variant-levels-comparison.md`
