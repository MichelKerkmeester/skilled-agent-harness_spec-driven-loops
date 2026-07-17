---
title: "Eval JavaScript"
description: "bdg dom eval \"<expression>\" — execute JavaScript in the page context and return the result."
trigger_phrases:
  - "bdg dom eval"
  - "bdg js"
  - "run javascript in browser cli"
version: 1.0.0.0
---

# Eval JavaScript

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg dom eval "document.title" 2>&1` executes an expression in the page context and returns the result. Works for reads (`localStorage.getItem('token')`), counts (`document.querySelectorAll('a').length`), and interactions (`document.querySelector('#submit-btn').click()`).

---

## 2. HOW IT WORKS

The helper wraps the Runtime domain (`Runtime.evaluate` with `returnByValue`). Pipe results through `jq` for structured extraction, and chain eval with screenshot/console capture to verify interaction effects.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Helper command list (`bdg dom eval`) |
| `references/cdp_patterns.md` §4 | Reference | Runtime domain patterns and helper alternative |
| `INSTALL-GUIDE.md` §8 | Guide | JavaScript execution examples |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/dom_and_screenshot/eval_javascript.md` | Manual | BDG-009 scenario contract |

---

## 4. SOURCE METADATA

- Group: DOM and Screenshot
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `dom_and_screenshot/eval_javascript.md`
Related references:
- [query_selector.md](../dom_and_screenshot/query_selector.md) — Query Selector
- [console_logs.md](../console_and_network/console_logs.md) — Console Logs
