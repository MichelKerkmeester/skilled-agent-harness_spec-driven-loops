---
title: "cli-opencode Context Budget Mirror"
description: "Sentinel-style pointer for applying context-budget semantics to cli-opencode dispatches without duplicating the canonical cli-devin pattern."
---

# cli-opencode Context Budget Mirror

Sentinel-style pointer that applies the canonical cli-devin context-budget semantics to cli-opencode dispatches without duplicating the pattern.

---

## 1. OVERVIEW

### Purpose

cli-opencode uses the same budget semantics documented in the canonical source, `../../cli-devin/references/context-budget.md`; this file only records the cli-opencode-specific routing surface and model-window differences. Model context windows and quota metadata are owned by `../../sk-prompt-small-model/assets/model-profiles.json`.

### When to Use

Consult this mirror when composing a bounded cli-opencode prompt and you need the cli-opencode-specific model windows; for budget allocation, summary thresholds, truncation markers, and eviction order, read `../../cli-devin/references/context-budget.md` and the shared defaults in `../../cli-devin/assets/per-model-budgets.json`.

### Core Principle

The budget pattern stays canonical in cli-devin; cli-opencode mirrors the semantics so callers compose bounded prompts without a second implementation or a drift-prone ruleset.

---

## 2. WHY CLI-OPENCODE MIRRORS CLI-DEVIN

cli-devin and cli-opencode dispatch through different agent surfaces, but prompt packs hit the same failure mode when tool output, conversation history, and working memory exceed the selected model window. The pattern remains canonical in `../../cli-devin/references/context-budget.md`; cli-opencode mirrors the semantics so callers can compose bounded prompts without adding a second implementation or drift-prone ruleset.

This mirror is documentation-only. It does not add runtime budget logic, mutate memory state, or port the dropped 2-stage tool-routing idea.

---

## 3. POINTER TO CANONICAL SOURCE

Use `../../cli-devin/references/context-budget.md` as the source of truth for:

- budget percentage and working-memory defaults.
- file summary thresholds.
- fit-to-budget truncation behavior.
- priority eviction order.
- marker interpretation.

Use `../../cli-devin/assets/per-model-budgets.json` for budget defaults and `../../sk-prompt-small-model/assets/model-profiles.json` for model profiles, context windows, quota pools, and fallback metadata.

---

## 4. CLI-OPENCODE-SPECIFIC NOTES

The active cli-opencode small-model set is registry-driven, not duplicated here. As of `../../sk-prompt-small-model/assets/model-profiles.json`, the relevant windows are:

| Model | Context window | cli-opencode note |
| --- | ---: | --- |
| `deepseek-v4-pro` | 64,000 | Default cli-opencode model; keep prompts tighter than SWE-1.6. |
| `kimi-k2.6` | 200,000 | Largest active window; useful for long-file inspection, still follows the canonical budget pattern. |
| `qwen3.6` | 32,000 | Smallest active cli-opencode window; needs the strictest scope and file anchors. |

Do not assume every cli-opencode model has a larger window than SWE-1.6. The registry currently shows Kimi-k2.6 above SWE-1.6, while DeepSeek-v4-pro and Qwen3.6 are below it; the budget semantics still come from `../../cli-devin/references/context-budget.md`.

Larger windows change what can be retained, not the rule shape. The caller may include more evidence for Kimi-k2.6, but should still apply the canonical summary threshold, truncation marker, and eviction priority from `../../cli-devin/references/context-budget.md`.

---

## 5. TRUNCATION MARKER SYNTAX

The marker syntax is canonical in `../../cli-devin/references/context-budget.md`:

```text
[... truncated N tokens]
```

`N` is the estimated token deficit. cli-opencode prompts should treat this as an intentional budget boundary and must not infer hidden evidence. Keep the retained span before the marker, and use `../../cli-devin/references/context-budget.md` for the full marker contract.
