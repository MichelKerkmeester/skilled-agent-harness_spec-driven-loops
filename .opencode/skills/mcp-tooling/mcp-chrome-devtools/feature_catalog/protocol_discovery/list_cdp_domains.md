---
title: "List CDP Domains"
description: "bdg cdp --list — enumerate all CDP domains (Page, Network, Runtime, DOM, ...)."
trigger_phrases:
  - "list cdp domains"
  - "bdg cdp --list"
  - "what cdp domains exist"
version: 1.0.0.0
---

# List CDP Domains

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg cdp --list` enumerates the 53 CDP domains available in the live browser (Page, Network, Runtime, DOM, and more). This is step one of progressive disclosure: discover before executing, never hardcode method lists.

---

## 2. HOW IT WORKS

Because the list comes from the live protocol catalog, it is always current — the anti-pattern is guessing method names and getting `Error: Method not found`. Follow with `--describe` on the discovered domain.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Discovery command list |
| `references/cdp_patterns.md` §7 | Reference | Progressive-disclosure before/after pattern |
| `INSTALL-GUIDE.md` §6 | Guide | Discovery command reference |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/protocol_discovery/list_cdp_domains.md` | Manual | BDG-005 scenario contract |

---

## 4. SOURCE METADATA

- Group: Protocol Discovery
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `protocol_discovery/list_cdp_domains.md`
Related references:
- [describe_domain.md](../protocol_discovery/describe_domain.md) — Describe Domain or Method
- [search_cdp_method.md](../protocol_discovery/search_cdp_method.md) — Search CDP Methods
