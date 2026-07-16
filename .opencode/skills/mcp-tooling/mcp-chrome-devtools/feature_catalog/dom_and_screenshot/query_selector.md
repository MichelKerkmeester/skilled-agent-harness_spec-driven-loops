---
title: "Query Selector"
description: "bdg dom query \"<selector>\" — return matching DOM elements with text content."
trigger_phrases:
  - "bdg dom query"
  - "query dom selector"
  - "find element in page"
version: 1.0.0.0
---

# Query Selector

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg dom query ".my-class" 2>&1` returns matching elements with their text content. Supports class, id, and attribute selectors (`"[data-testid='login']"`). Simpler than the raw `DOM.querySelector` CDP path, which needs a `nodeId` from `DOM.getDocument` first.

---

## 2. HOW IT WORKS

Requires an active session. For node-level operations (outer HTML, attributes) drop down to the DOM domain CDP methods; for a quick existence/content check the helper is the right tool.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Helper command list (`bdg dom query`) |
| `references/cdp_patterns.md` §4 | Reference | DOM domain patterns and helper alternative |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/dom_and_screenshot/query_selector.md` | Manual | BDG-008 scenario contract |

---

## 4. SOURCE METADATA

- Group: DOM and Screenshot
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `dom_and_screenshot/query_selector.md`
Related references:
- [eval_javascript.md](../dom_and_screenshot/eval_javascript.md) — Eval JavaScript
- [raw_cdp_command.md](../protocol_discovery/raw_cdp_command.md) — Raw CDP Execution
