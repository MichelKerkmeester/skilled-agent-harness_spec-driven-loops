---
title: "cli-opencode Context Budget Mirror"
description: "Sentinel-style pointer for applying context-budget semantics to cli-opencode dispatches without duplicating the canonical small-model pattern."
trigger_phrases:
  - "opencode context budget"
  - "cli-opencode budget mirror"
  - "opencode model context windows"
  - "opencode truncation marker"
importance_tier: normal
contextType: general
---

# cli-opencode Context Budget Mirror

Sentinel-style pointer that applies the canonical small-model context-budget semantics to cli-opencode dispatches without duplicating the pattern.

---

## 1. OVERVIEW

### Purpose

cli-opencode uses the same budget semantics documented in the canonical source, `../../sk-prompt-small-model/references/context_budget.md`; this file only records the cli-opencode-specific routing surface and model-window differences. Model context windows and quota metadata are owned by `../../sk-prompt-small-model/assets/model_profiles.json`.

### When to Use

Consult this mirror when composing a bounded cli-opencode prompt and you need the cli-opencode-specific model windows; for budget allocation, summary thresholds, truncation markers, and eviction order, read `../../sk-prompt-small-model/references/context_budget.md` and the shared defaults in `../../sk-prompt-small-model/assets/per_model_budgets.json`.

### Core Principle

The budget pattern stays canonical in sk-prompt-small-model; cli-opencode mirrors the semantics so callers compose bounded prompts without a second implementation or a drift-prone ruleset.

---

## 2. WHY CLI-OPENCODE MIRRORS THE CANONICAL PATTERN

Prompt packs hit the same failure mode when tool output, conversation history, and working memory exceed the selected model window. The pattern remains canonical in `../../sk-prompt-small-model/references/context_budget.md`; cli-opencode mirrors the semantics so callers can compose bounded prompts without adding a second implementation or drift-prone ruleset.

This mirror is documentation-only. It does not add runtime budget logic or mutate memory state.

---

## 3. POINTER TO CANONICAL SOURCE

Use `../../sk-prompt-small-model/references/context_budget.md` as the source of truth for:

- budget percentage and working-memory defaults.
- file summary thresholds.
- fit-to-budget truncation behavior.
- priority eviction order.
- marker interpretation.

Use `../../sk-prompt-small-model/assets/per_model_budgets.json` for budget defaults and `../../sk-prompt-small-model/assets/model_profiles.json` for model profiles, context windows, quota pools, and fallback metadata.

---

## 4. CLI-OPENCODE-SPECIFIC NOTES

The active cli-opencode small-model set is registry-driven, not duplicated here. As of `../../sk-prompt-small-model/assets/model_profiles.json`, the relevant windows are:

| Model | Context window | cli-opencode note |
| --- | ---: | --- |
| `deepseek-v4-pro` | 64,000 | Default cli-opencode model; keep prompts tight. |
| `kimi-k2.7-code` | 262,144 | Largest active window (256k via `kimi-for-coding/k2p7`; supersedes the retired `kimi-k2.6`); useful for long-file inspection, still follows the canonical budget pattern. At `--variant high` cap reads + budget 1200s+ (over-explores broad scopes — observed 2026-06-17). |
| `qwen3.6` | 32,000 | Smallest active cli-opencode window; needs the strictest scope and file anchors. |

Larger windows change what can be retained, not the rule shape. The caller may include more evidence for Kimi-k2.7-code, but should still apply the canonical summary threshold, truncation marker, and eviction priority from `../../sk-prompt-small-model/references/context_budget.md`.

---

## 5. TRUNCATION MARKER SYNTAX

The marker syntax is canonical in `../../sk-prompt-small-model/references/context_budget.md`:

```text
[... truncated N tokens]
```

`N` is the estimated token deficit. cli-opencode prompts should treat this as an intentional budget boundary and must not infer hidden evidence. Keep the retained span before the marker, and use `../../sk-prompt-small-model/references/context_budget.md` for the full marker contract.
