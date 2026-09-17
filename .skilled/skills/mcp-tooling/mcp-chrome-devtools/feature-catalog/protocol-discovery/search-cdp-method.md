---
title: "Search CDP Methods"
description: "bdg cdp --search <term> — find CDP methods by keyword."
trigger_phrases:
  - "bdg cdp --search"
  - "search cdp methods"
  - "find cdp method by keyword"
version: 1.0.0.0
---

# Search CDP Methods

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg cdp --search screenshot` returns matching methods (e.g. `Page.captureScreenshot`) from the live CDP catalog. Use-case driven discovery: search `cookie`, `performance`, `DOM`, or `intercept` to find the right method family.

---

## 2. HOW IT WORKS

Search is the shortcut when you know the capability but not the domain. Combine with `--describe` on the hit to confirm the signature before executing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Discovery command list |
| `references/cdp-patterns.md` §7 | Reference | Finding methods by use case |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/protocol-discovery/search-cdp-method.md` | Manual | BDG-007 scenario contract |

---

## 4. SOURCE METADATA

- Group: Protocol Discovery
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `protocol-discovery/search-cdp-method.md`
Related references:
- [describe-domain.md](../../feature-catalog/protocol-discovery/describe-domain.md) — Describe Domain or Method
- [list-cdp-domains.md](../../feature-catalog/protocol-discovery/list-cdp-domains.md) — List CDP Domains
