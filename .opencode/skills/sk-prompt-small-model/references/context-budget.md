---
title: Small-Model Context Budget Engine
description: Smallcode-derived token budget defaults, truncation marker syntax, and eviction rules for small-model dispatches (cli-opencode and any future executor).
trigger_phrases:
  - "small model context budget"
  - "token budget defaults"
  - "truncation marker syntax"
  - "context eviction order"
importance_tier: normal
contextType: implementation
---

# Small-Model Context Budget Engine

> Canonical home for the small-model context-budget pattern. (Originally authored under cli-devin; re-homed here when cli-devin was deprecated so the pattern survives executor changes. The pattern is executor-agnostic.)

---

## Overview

This reference documents the small-model budget pattern for bounded CLI dispatches.

The pattern is adapted from SmallCode's context budget engine and scoped to the slim model set: DeepSeek-v4-pro is the required budgeted model; Claude Haiku is an optional unverified stub.

The purpose is not to add a new runtime dispatcher. It gives prompt composers and future automation one shared asset for model windows, budget percentages, line thresholds, truncation markers, and eviction order.

The key imported defaults are:

- `max_budget_pct`: 70.
- `working_memory_tokens`: 500.
- `summary_threshold_lines`: 200.
- `truncation_marker_template`: `[... truncated %d tokens]`.

The source pattern counts tokens approximately with 4 characters per token. That is deliberately conservative and cheap. It is not a tokenizer replacement.

---

## Smallcode-Derived Patterns

### Budget Allocation

SmallCode defines a `BudgetConfig` with `max_budget_pct`, `working_memory_tokens`, and `summary_threshold`.

Its `totalBudget()` calculation is:

```text
total_budget = model_context_length * max_budget_pct / 100
```

The calculator remains data-first. The canonical values live in `../assets/per-model-budgets.json`, not in code.

Budget allocation separates four conceptual categories:

| Category | Purpose | Eviction posture |
| --- | --- | --- |
| `system_prompt` | Runtime and skill instructions | Protected |
| `working_memory` | Current task state and plan | Last-resort trim |
| `conversation` | Recent turns and relevant history | Partial trim |
| `tool_results` | Read/search/command output | First trim |

The 70% maximum applies to dynamic prompt content. The remaining 30% is reserved for system framing, output tokens, tool-call overhead, and safety margin.

### Fit-To-Budget Truncation

SmallCode's `fitToolResult()` applies both a total-budget ceiling and a per-tool cap.

The marker is compact:

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

The prompt contract tells the dispatched model to treat this as an intentional budget boundary. The model must not infer the missing content.

### Priority Eviction

The ladder:

1. Evict old `tool_results` first.
2. Evict old `conversation` at a 50% rate.
3. Trim `working_memory` only as a last resort.
4. Never evict `system_prompt`.

This is a prompt-pack composition policy. It does not mutate memory databases or source files.

### Working Memory

`working_memory_tokens` defaults to 500 for all models. Conservative shared defaults are preferred over per-model scaling.

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

`summary_threshold_lines` stays at 200 for all required models. Larger model windows can still carry more context, but the threshold encourages summarization before prompt bloat appears.

Recommended behavior:

- If a file is under 200 lines, include exact line ranges when relevant.
- If a file is over 200 lines, summarize first and preserve line anchors.
- If the exact span matters, include only that span plus neighboring context.
- If the tool result is still too large, truncate with the marker.

---

## Per-Model Defaults

The canonical asset is `../assets/per-model-budgets.json`.

| Model | Provider | Context length | 70% budget | Status |
| --- | --- | ---: | ---: | --- |
| `deepseek-v4-pro` | DeepSeek | 64,000 | 44,800 | required |
| `claude-haiku` | Anthropic | unverified | unverified | optional stub |

---

## Truncation-Marker Syntax

The canonical marker template is:

```text
[... truncated %d tokens]
```

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

---

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

---

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

---

## Operational Notes

Budgeting is advisory until a runtime prompt-pack builder consumes `per-model-budgets.json`.

Verification command:

```bash
jq empty .opencode/skills/sk-prompt-small-model/assets/per-model-budgets.json
```

Expected DeepSeek-v4-pro budget:

```text
64000 * 0.70 = 44800 tokens
```

If a simulated tool result exceeds that budget, the output must include `[... truncated N tokens]`.

---

## Limits

This reference does not implement tokenizer-accurate counting. It does not enable Haiku routing. It does not include gpt-5.5, Opus, or Sonnet in the budget lookup (registry profiles, not budget defaults, govern those).

---

## Worked Examples

### DeepSeek-v4-pro

```text
context_length = 64000
max_budget_pct = 70
token_budget = 44800
working_memory_tokens = 500
remaining_after_working_memory = 44300
```

For DeepSeek-v4-pro, large file reads should summarize before inclusion because a few long logs can consume the dynamic budget quickly. At 64k it is the tightest required window — prefer summaries and exact line ranges.

---

## Failure Modes

### Silent Drop

Silent context loss is the primary failure this pattern prevents. Mitigation: always mark truncation; keep the deficit visible; preserve source path and line anchors where possible.

### Over-Summarization

Summaries can hide decisive details. Mitigation: summarize broad context; include exact spans for evidence; ask for narrower evidence when needed.

### Wrong Model Window

Unverified model windows create false budget confidence. Mitigation: keep optional stubs null; require verification before routing; do not infer future model specs from brand names.

### Budget Prose Bloat

Budget guidance can consume the budget it tries to protect. Mitigation: keep template wording short; link this reference instead of pasting it; use the marker as the main runtime signal.
