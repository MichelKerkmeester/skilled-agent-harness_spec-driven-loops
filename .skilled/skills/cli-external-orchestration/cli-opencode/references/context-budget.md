---
title: "cli-opencode Context Budget Mirror"
description: "cli-opencode context-budget reference: model windows and truncation marker for composing bounded dispatch prompts."
trigger_phrases:
  - "opencode context budget"
  - "cli-opencode budget mirror"
  - "opencode model context windows"
  - "opencode truncation marker"
importance_tier: normal
contextType: general
version: 1.4.6.0
---

# cli-opencode Context Budget Mirror

Sentinel-style pointer that applies the canonical small-model context-budget semantics to cli-opencode dispatches without duplicating the pattern.

---

## 1. OVERVIEW

### Purpose

cli-opencode applies context-budget semantics to its dispatches. This file records the cli-opencode-specific model windows (§4) and truncation marker syntax (§5), so callers can compose bounded prompts without a second implementation or a drift-prone ruleset.

### When to Use

Consult this reference when composing a bounded cli-opencode prompt and you need the cli-opencode-specific model windows (§4) and truncation marker syntax (§5).

### Core Principle

Keep prompts within the selected model window. Apply the truncation marker and eviction discipline below so callers compose bounded prompts without a drift-prone ruleset.

**Verified versions.** Verified against OpenCode 1.19.3 and 2.0.32 on 2026-10-19. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified. The delta is in [`install-and-versions.md`](./install-and-versions.md).

---

## 2. WHY CLI-OPENCODE RECORDS BUDGET SEMANTICS

Prompt packs hit the same failure mode when tool output, conversation history, and working memory exceed the selected model window. cli-opencode records the semantics here so callers can compose bounded prompts without adding a second implementation or drift-prone ruleset.

This reference is documentation-only. It does not add runtime budget logic or mutate memory state.

---

## 3. BUDGET DISCIPLINES

Apply these disciplines when composing a bounded cli-opencode prompt:

- budget percentage and working-memory defaults.
- file summary thresholds.
- fit-to-budget truncation behavior.
- priority eviction order.
- marker interpretation.

The cli-opencode-specific model windows are in §4. The truncation marker syntax is in §5.

---

## 4. CLI-OPENCODE-SPECIFIC NOTES

The active cli-opencode small-model set is registry-driven, not duplicated here. The relevant windows are:

| Model | Context window | cli-opencode note |
| --- | ---: | --- |
| `llmgateway/deepseek-v4.1-flash` (both versions) | Not verified | Default cli-opencode model on both OpenCode versions. The window is not re-verified on this install. Confirm via `opencode models llmgateway` on OpenCode 1, or `opencode2 models --standalone` filtered for `llmgateway/` on OpenCode 2, before budget-sensitive dispatches. |
| `kimi-k2.7-code` | 262,144 | Largest active window (256k via `kimi-for-coding/k2p7`, supersedes the retired `kimi-k2.6`). It is useful for long-file inspection and still follows the budget discipline. At `--variant high` (OpenCode 1 only) cap reads + budget 1200s+ (over-explores broad scopes, observed 2026-06-17). On OpenCode 2 the equivalent is `-m provider/model#high`. The over-exploration behavior is unverified on OpenCode 2.0.32. |
| `qwen3.6` | 32,000 | Smallest active cli-opencode window. It needs the strictest scope and file anchors. |

Larger windows change what can be retained, not the rule shape. The caller may include more evidence for Kimi-k2.7-code, but should still apply the summary threshold, truncation marker, and eviction priority discipline.

---

## 5. TRUNCATION MARKER SYNTAX

The marker syntax is:

```text
[... truncated N tokens]
```

`N` is the estimated token deficit. cli-opencode prompts should treat this as an intentional budget boundary and must not infer hidden evidence. Keep the retained span before the marker.
