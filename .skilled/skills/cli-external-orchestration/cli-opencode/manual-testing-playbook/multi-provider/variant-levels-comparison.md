---
title: "CO-012 -- Effort levels (minimal/low/medium/high)"
description: "This scenario validates the `#<level>` effort suffix for `CO-012`. It focuses on confirming the `llmgateway/deepseek-v4.1-flash-1017` effort range (minimal through the skill-verified `high` default) maps to reasoning effort and produces materially different response depth between extremes."
version: 1.4.13.0
---

# CO-012 -- Effort levels (minimal/low/medium/high)

**Version note.** The commands in this scenario target OpenCode 2 (2.3.2). The effort level rides on the model selector as a `#<level>` suffix, and this scenario holds the model fixed on `llmgateway/deepseek-v4.1-flash-1017`, so it resolves that one provider route. Check that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-012`.

---

## 1. OVERVIEW

This scenario validates effort levels for `CO-012`. It focuses on confirming the `#<level>` suffix accepts the documented per-provider range and that the response depth materially differs between extremes when the same prompt is dispatched. The reader confirms that `opencode models --standalone` lists the `<provider>/` prefix of the model you pass to `-m` first. Underlying-model conventions apply: the DeepSeek-family reasoning models (via the opencode-go and LLM Gateway routes) accept reasoning-effort levels.

### Why This Matters

The cli-opencode skill defaults to `#high` because routine dispatches benefit from elevated reasoning effort (per SKILL.md §3 and `references/cli-reference.md` §5). This comparison keeps the model fixed on that default on purpose, so both runs compare the same provider route. If the level is silently ignored or the levels leave reasoning depth unchanged, the skill default loses its value and operators have no real way to dial cost vs depth. This test proves the level is functional by comparing `minimal` against `high` for the same prompt and confirming the response byte count and depth differ materially. The shipped default is `#max` (SKILL.md §3), and this comparison does not test it. `high` is used because it is a documented level on this provider's ladder.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `-m llmgateway/deepseek-v4.1-flash-1017#minimal` and `-m llmgateway/deepseek-v4.1-flash-1017#high` produce materially different response depth for the same prompt, proving the level drives provider reasoning effort. `high` is used as the upper comparison point because it is a documented level on this provider's ladder (`references/providers-and-models.md`), while the shipped default `#max` (SKILL.md §3) is outside this comparison.
- Real user request: `Run the same prompt twice, once with #minimal and once with #high on the model id, and show me how much longer and more detailed the high-effort response is.`
- Prompt: `Run the same architecture prompt with #minimal and #high; compare response byte counts and trade-off dimension coverage.`
- Expected execution process: External-AI orchestrator dispatches the same prompt twice, captures both event streams, computes the response byte count for each, counts trade-off dimensions in each and validates the high-effort level produces materially deeper output.
- Expected signals: Both dispatches exit 0. High-effort response byte count is at least 2x the minimal-effort byte count. High response weighs at least 2 more distinct trade-off dimensions than minimal. Both runs identify the same model.
- Desired user-visible outcome: Verdict naming both byte counts, both dimension counts and the effort ratio.
- Pass/fail: PASS if both exit 0 AND high byte count >= 2x minimal AND high dimensions >= minimal + 2. FAIL if the level has no effect (counts are roughly equal) or either dispatch fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch with `-m llmgateway/deepseek-v4.1-flash-1017#minimal` and capture the response.
3. Dispatch with `-m llmgateway/deepseek-v4.1-flash-1017#high` and capture the response.
4. Compute byte counts and count trade-off dimensions for each.
5. Compare and return a verdict naming both metrics.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-012 | Effort levels (minimal/low/medium/high) | Confirm `#minimal` and `#high` produce materially different response depth for the same prompt on `llmgateway/deepseek-v4.1-flash-1017` | `Run the same architecture prompt with #minimal and #high; compare response byte counts and trade-off dimension coverage.` | 1. `bash: opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#minimal --format json "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-minimal.jsonl 2>&1 </dev/null && echo "MINIMAL: $?"` -> 2. `bash: opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#high --format json "Compare event sourcing vs traditional CRUD for an order management system across consistency, query performance, learning curve, scalability, and ops cost. Recommend one with confidence." > /tmp/co-012-high.jsonl 2>&1 </dev/null && echo "HIGH: $?"` -> 3. `bash: MIN=$(jq -r 'select(.type == "text") \| .part.text' /tmp/co-012-minimal.jsonl \| wc -c); HIGH=$(jq -r 'select(.type == "text") \| .part.text' /tmp/co-012-high.jsonl \| wc -c); echo "MIN_BYTES=$MIN HIGH_BYTES=$HIGH RATIO=$(echo "scale=2; $HIGH/$MIN" \| bc)"` -> 4. `bash: MIN_DIMS=$(jq -r 'select(.type == "text") \| .part.text' /tmp/co-012-minimal.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); HIGH_DIMS=$(jq -r 'select(.type == "text") \| .part.text' /tmp/co-012-high.jsonl \| grep -ciE '(consistency\|query performance\|learning curve\|scalability\|ops cost)'); echo "MIN_DIMS=$MIN_DIMS HIGH_DIMS=$HIGH_DIMS"` Steps 3 and 4 read the response text from the `text` events (`jq -r 'select(.type == "text") \| .part.text'`). The reader confirms that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first. | Step 1: MINIMAL exit 0. Step 2: HIGH exit 0. Step 3: HIGH_BYTES is at least 2x MIN_BYTES (RATIO >= 2.0). Step 4: HIGH_DIMS is at least MIN_DIMS + 2 (or both at the cap of 5, whichever indicates the depth lever moved) | `/tmp/co-012-minimal.jsonl`, `/tmp/co-012-high.jsonl`, terminal byte and dimension counts | PASS if both exit 0 AND HIGH_BYTES >= 2x MIN_BYTES AND HIGH response covers more dimensions. FAIL if the level has no effect or either dispatch fails | 1. If RATIO is close to 1.0, the level may be silently ignored. Re-run with `--print-logs --log-level debug` and look for an effort resolution log line. 2. If the model id resolution differs between runs, the level may be coercing model selection. Verify both runs use the same model id. 3. For direct deepseek reasoning models, use the reasoning-effort level accepted on that provider. 4. `run` takes no separate variant flag, so the level must ride on `-m` as `#<level>` |

### Optional Supplemental Checks

For full-spectrum validation on a provider whose full range was observed on OpenCode 1, run the low/medium/high/xhigh sweep against `openai/gpt-6-sol` and confirm byte counts increase monotonically. This catches regressions where two adjacent levels produce identical responses (effectively halving the operator's tuning surface). No range in the table below has been re-verified on OpenCode 2.3.2, so whether a given provider accepts a level there is unverified. Per-provider ranges to exercise (sourced from `references/cli-reference.md` §5, so re-verify against a live `opencode run -m llmgateway/deepseek-v4.1-flash-1017 --help </dev/null` before relying on an unlisted value):

| Model | Effort range to sweep |
|---|---|
| `llmgateway/deepseek-v4.1-flash-1017` | Reasoning model pinned to `#max` (its top thinking tier) by policy, and the default. Treat any other value as unverified until smoke-tested. The reader confirms that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first. The `opencode-go/` route stays selectable but needs its own login first (`opencode auth login opencode-go`) |
| `openai/gpt-6-sol` | The level rides on the model id (`-m openai/gpt-6-sol#<level>`), mapping to OpenAI reasoning effort (`none`/`low`/`medium`/`high`/`xhigh`). That range was observed on OpenCode 1 and is unverified on 2.3.2 |


---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§5 MODEL SELECTION + effort table) | Documents the effort range per provider |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 default invocation `#high` and user override table |
| `../../references/cli-reference.md` | §5 effort mapping per provider and §9 version drift handling |

---

## 5. SOURCE METADATA

- Group: Multi-Provider
- Playbook ID: CO-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `multi-provider/variant-levels-comparison.md`
