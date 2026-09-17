---
title: "Describe Domain or Method"
description: "bdg cdp --describe <domain|method> — method signatures for a domain or one method's parameters."
trigger_phrases:
  - "bdg cdp --describe"
  - "describe cdp domain"
  - "cdp method signature"
version: 1.0.0.0
---

# Describe Domain or Method

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg cdp --describe Page` lists the Page domain's methods (navigate, reload, captureScreenshot, ...); `bdg cdp --describe Page.captureScreenshot` shows one method's parameters and return type.

---

## 2. HOW IT WORKS

Step two and three of progressive disclosure: after `--list` finds the domain, `--describe` confirms the exact method name and signature before execution. This eliminates trial-and-error and keeps documentation current with the live browser.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Discovery command list |
| `references/cdp-patterns.md` §7 | Reference | Discovery pattern with validation checkpoints |
| `INSTALL-GUIDE.md` §6 | Guide | Discovery command reference |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/protocol-discovery/describe-page-domain.md` | Manual | BDG-006 scenario contract |

---

## 4. SOURCE METADATA

- Group: Protocol Discovery
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `protocol-discovery/describe-domain.md`
Related references:
- [list-cdp-domains.md](../protocol-discovery/list-cdp-domains.md) — List CDP Domains
- [raw-cdp-command.md](../protocol-discovery/raw-cdp-command.md) — Raw CDP Execution
