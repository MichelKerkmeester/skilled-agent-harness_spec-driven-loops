---
title: "cli-devin Context Budget Engine"
description: "Smallcode-derived token budget defaults, truncation marker syntax, and eviction rules for small-model cli-devin dispatches."
---

# cli-devin Context Budget Engine

## Overview

This reference documents the Phase 004 budget pattern for cli-devin small-model dispatches.

The pattern is adapted from SmallCode's context budget engine and scoped to the slim model set chosen on 2026-05-18: SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, and Qwen3.6 are required; Claude Haiku and Gemini Flash are optional unverified stubs.

The purpose is not to add a new runtime dispatcher. It gives prompt composers and future automation one shared asset for model windows, budget percentages, line thresholds, truncation markers, and eviction order.

Source evidence:

| Source | Evidence |
| --- | --- |
| Research RQ1 | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/research.md:27-110` |
| Deepening iter | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-006.md:18-149` |
| Context card | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/preflight/context-card.md:9-102` |
| Smallcode source | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/external/smallcode-master/src/context/budget.ms:9-193` |

The key imported defaults are:

- `max_budget_pct`: 70.
- `working_memory_tokens`: 500.
- `summary_threshold_lines`: 200.
- `truncation_marker_template`: `[... truncated %d tokens]`.

The source pattern counts tokens approximately with 4 characters per token. That is deliberately conservative and cheap. It is not a tokenizer replacement.

## Smallcode-Derived Patterns

### Budget Allocation

SmallCode defines a `BudgetConfig` with `max_budget_pct`, `working_memory_tokens`, and `summary_threshold` at `budget.ms:9-13`.

Its `totalBudget()` calculation is:

```text
total_budget = model_context_length * max_budget_pct / 100
```

The source implementation is at `budget.ms:55-58`; RQ1 records the same primitive at `research.md:31-45`.

For Phase 004, the calculator remains data-first. The canonical values live in `../assets/per-model-budgets.json`, not in code.

Budget allocation separates four conceptual categories:

| Category | Purpose | Eviction posture |
| --- | --- | --- |
| `system_prompt` | Runtime and skill instructions | Protected |
| `working_memory` | Current task state and plan | Last-resort trim |
| `conversation` | Recent turns and relevant history | Partial trim |
| `tool_results` | Read/search/command output | First trim |

The 70% maximum applies to dynamic prompt content. The remaining 30% is reserved for system framing, output tokens, tool-call overhead, and safety margin.

### Fit-To-Budget Truncation

SmallCode's `fitToolResult()` applies both a total-budget ceiling and a per-tool cap. The source is at `budget.ms:109-126`; RQ1 captures the same pattern at `research.md:51-68`.

The Phase 004 marker is compact:

```text
[... truncated N tokens]
```

`N` is the estimated token deficit, not the number of characters removed.

Example:

```text
--- tool output begins ---
<first budget-fitting span>

[... truncated 1840 tokens]
```

The prompt contract in `../assets/prompt_templates.md` tells SWE-1.6 to treat this as an intentional budget boundary. The model must not infer the missing content.

### Priority Eviction

SmallCode's eviction ladder is at `budget.ms:140-163`; RQ1 records it at `research.md:72-89`, and iter-006 expands it at `iteration-006.md:72-118`.

The Phase 004 ladder:

1. Evict old `tool_results` first.
2. Evict old `conversation` at a 50% rate.
3. Trim `working_memory` only as a last resort.
4. Never evict `system_prompt`.

This is a prompt-pack composition policy. It does not mutate memory databases or source files.

### Working Memory

`working_memory_tokens` defaults to 500 for all Phase 004 models. Iter-006 proposed scaling this by model size, but the 2026-05-18 slim scope chose conservative shared defaults.

Use working memory for:

- active acceptance criteria.
- current task status.
- blocker notes.
- highest-value local conventions.
- selected file paths and line anchors.

Do not use working memory for:

- full command logs.
- duplicate file contents.
- broad historical context.
- raw search dumps.

### Summary Threshold

SmallCode's `shouldSummarize()` checks whether a file exceeds `summary_threshold` lines at `budget.ms:128-131`. Its `maxAffordableLines()` uses available tokens, 4 chars per token, and an average 60 chars per line at `budget.ms:133-138`.

Phase 004 keeps `summary_threshold_lines` at 200 for all required models. Larger model windows can still carry more context, but the threshold encourages summarization before prompt bloat appears.

Recommended behavior:

- If a file is under 200 lines, include exact line ranges when relevant.
- If a file is over 200 lines, summarize first and preserve line anchors.
- If the exact span matters, include only that span plus neighboring context.
- If the tool result is still too large, truncate with the marker.

## Per-Model Defaults

The canonical asset is `../assets/per-model-budgets.json`.

| Model | Provider | Context length | 70% budget | Status |
| --- | --- | ---: | ---: | --- |
| `swe-1.6` | Cognition | 128,000 | 89,600 | required |
| `deepseek-v4-pro` | DeepSeek | 64,000 | 44,800 | required |
| `kimi-k2.6` | Moonshot | 200,000 | 140,000 | required |
| `qwen3.6` | Alibaba | 32,000 | 22,400 | required |
| `claude-haiku` | Anthropic | unverified | unverified | optional stub |
| `gemini-flash` | Google | unverified | unverified | optional stub |

Dropped from Phase 004 scope:

- GLM-5.1.
- gpt-5.5.
- Claude Opus.
- Claude Sonnet.

The dropped models are intentionally absent from `per-model-budgets.json`.

## Truncation-Marker Syntax

The canonical marker template is:

```text
[... truncated %d tokens]
```

The source SmallCode marker is longer:

```text
[... truncated ${tokens - available} tokens to fit context budget]
```

The compact template preserves the essential signal while spending fewer prompt tokens. The source primitive is documented in `budget.ms:120-125`, `research.md:51-63`, and `iteration-006.md:43-68`.

Rules:

- Use square brackets.
- Use three leading dots.
- Use the word `truncated`.
- Include the numeric token deficit.
- Use `tokens`, not `chars`, in the visible marker.
- Do not hide the marker in HTML comments.
- Do not place the marker before the retained content.

Good:

```text
function example() {
  return "kept";
}

[... truncated 620 tokens]
```

Bad:

```text
function example() {
  return "kept";
}
<!-- more omitted -->
```

## Eviction Priority Ladder

The ladder is intentionally simple because small models benefit from predictable policies.

| Tier | Category | Rate | Rationale |
| ---: | --- | ---: | --- |
| 1 | `tool_results` | 1.00 | Can usually be re-read or re-run |
| 2 | `conversation` | 0.50 | Preserve recent turns while shedding older context |
| 3 | `working_memory` | 0.25 | Keep active state unless no alternative remains |
| protected | `system_prompt` | 0.00 | Skill and safety contract must remain intact |

When a prompt pack exceeds budget:

1. Sort tool results by age, oldest first.
2. Drop or summarize old tool results until the budget fits.
3. If still over budget, summarize older conversation turns.
4. If still over budget, compress working memory to current state only.
5. If still over budget, halt composition and ask for narrower scope.

Do not silently drop required acceptance criteria.

## Integration With Prompt-Pack Templates

Prompt composers should apply this order:

1. Resolve the model id.
2. Load `per-model-budgets.json`.
3. Compute `budget = context_length * max_budget_pct / 100`.
4. Reserve `working_memory_tokens`.
5. Estimate remaining prompt content using 4 chars per token.
6. Summarize files above `summary_threshold_lines`.
7. Fit tool results under the remaining budget.
8. Add truncation markers when cutting content.
9. Preserve the final acceptance criteria and verification commands.

The SWE-1.6 template in `../assets/prompt_templates.md` now tells the dispatched model how to interpret truncation markers.

Future implementation can promote the following type shape:

```typescript
type BudgetConfig = {
  id: string;
  provider: string;
  context_length: number;
  max_budget_pct: number;
  working_memory_tokens: number;
  summary_threshold_lines: number;
  truncation_marker_template: string;
  notes?: string;
};
```

Keep the runtime tolerant of optional stubs. If `context_length` is `null`, do not route budgeted dispatch for that model.

## sk-prompt Insertion-Point Hint

Phase 006 can update `sk-prompt/assets/cli_prompt_quality_card.md` after the existing anti-hallucination wording and before the CLEAR checklist.

The insert should point back here and tell prompt composers to:

- estimate prompt size before dispatch.
- prefer summaries for files over 200 lines.
- preserve exact line spans for decisive evidence.
- use `[... truncated N tokens]` markers.
- avoid adding more prose to compensate for missing evidence.

This is deliberately a hint, not a Phase 004 write. Phase 004 does not modify `sk-prompt`.

## Operational Notes

Budgeting is advisory until a runtime prompt-pack builder consumes `per-model-budgets.json`.

Verification commands for Phase 004:

```bash
jq empty .opencode/skills/cli-devin/assets/per-model-budgets.json
```

Empirical smoke:

```bash
node /tmp/budget-smoke-004.js
```

Expected SWE-1.6 budget:

```text
128000 * 0.70 = 89600 tokens
```

If a simulated tool result exceeds that budget, the output must include `[... truncated N tokens]`.

## Limits

This reference does not implement tokenizer-accurate counting.

This reference does not add cli-opencode budget propagation.

This reference does not enable Haiku or Gemini Flash routing.

This reference does not alter Devin's model-selection table beyond cross-references.

This reference does not include GLM-5.1, gpt-5.5, Opus, or Sonnet because Phase 004 explicitly dropped them.

## Reference Checklist

Use this checklist when wiring the data asset into a future prompt-pack builder.

### Model Resolution

- [ ] Normalize the requested model id before lookup.
- [ ] Accept `swe-1.6` as the cli-devin default.
- [ ] Accept `deepseek-v4-pro` for the slim-scope DeepSeek profile.
- [ ] Accept `kimi-k2.6` for large-context fallback work.
- [ ] Accept `qwen3.6` only where the executor actually supports it.
- [ ] Treat `claude-haiku` as a stub until context length is verified.
- [ ] Treat `gemini-flash` as a stub until context length is verified.
- [ ] Reject GLM-5.1, gpt-5.5, Opus, and Sonnet in Phase 004 budget lookup.

### Budget Computation

- [ ] Read `context_length` from `per-model-budgets.json`.
- [ ] Read `max_budget_pct` from the same model entry.
- [ ] Compute `token_budget` with integer math.
- [ ] Keep 30% of the model context outside dynamic prompt content.
- [ ] Reserve `working_memory_tokens` before adding large evidence.
- [ ] Apply `summary_threshold_lines` before full file inclusion.
- [ ] Track estimated tokens per category.
- [ ] Record the final budget in dispatch logs when available.

### Tool Result Fit

- [ ] Estimate tool-result tokens as `Math.ceil(chars / 4)`.
- [ ] Prefer line-range reads over whole-file reads.
- [ ] Apply per-tool caps before total-budget caps.
- [ ] Keep the beginning of the result unless the caller requested a specific tail.
- [ ] Append a visible marker when truncating.
- [ ] Include the token deficit in the marker.
- [ ] Do not append a marker when content fits.
- [ ] Do not use a marker to hide missing required evidence.

### Eviction

- [ ] Drop old tool results first.
- [ ] Summarize old tool results if they may be useful later.
- [ ] Trim conversation only after tool results are exhausted.
- [ ] Trim old conversation before recent conversation.
- [ ] Preserve active acceptance criteria.
- [ ] Preserve current blocker state.
- [ ] Avoid trimming working memory unless the prompt still exceeds budget.
- [ ] Halt if only protected content remains and the prompt still does not fit.

### Prompt Contract

- [ ] Mention truncation markers in `<context>`.
- [ ] Tell the model not to invent truncated content.
- [ ] Tell the model to ask for narrower evidence if the truncated span matters.
- [ ] Keep the marker format stable across recipes.
- [ ] Avoid multiple competing marker syntaxes in one prompt.
- [ ] Keep budget prose short for SWE-1.6.

## Worked Examples

### SWE-1.6

```text
context_length = 128000
max_budget_pct = 70
token_budget = 89600
working_memory_tokens = 500
remaining_after_working_memory = 89100
```

If a tool result is estimated at 92,000 tokens and the remaining budget is 89,100, the deficit is 2,900 tokens.

Marker:

```text
[... truncated 2900 tokens]
```

### DeepSeek-v4-pro

```text
context_length = 64000
max_budget_pct = 70
token_budget = 44800
working_memory_tokens = 500
remaining_after_working_memory = 44300
```

For DeepSeek-v4-pro, large file reads should summarize before inclusion because a few long logs can consume the dynamic budget quickly.

### Kimi-k2.6

```text
context_length = 200000
max_budget_pct = 70
token_budget = 140000
working_memory_tokens = 500
remaining_after_working_memory = 139500
```

Kimi can carry broader context, but the same marker and eviction rules still apply. Large context is not a license to include stale evidence.

### Qwen3.6

```text
context_length = 32000
max_budget_pct = 70
token_budget = 22400
working_memory_tokens = 500
remaining_after_working_memory = 21900
```

Qwen is the tightest required window. Prefer summaries and exact line ranges.

## Failure Modes

### Silent Drop

Silent context loss is the primary failure this pattern prevents.

Mitigation:

- always mark truncation.
- keep the deficit visible.
- preserve source path and line anchors where possible.

### Over-Summarization

Summaries can hide decisive details.

Mitigation:

- summarize broad context.
- include exact spans for evidence.
- ask for narrower evidence when needed.

### Wrong Model Window

Unverified model windows create false budget confidence.

Mitigation:

- keep optional stubs null.
- require verification before routing.
- do not infer future model specs from brand names.

### Budget Prose Bloat

Budget guidance can consume the budget it tries to protect.

Mitigation:

- keep template wording short.
- link this reference instead of pasting it.
- use the marker as the main runtime signal.
