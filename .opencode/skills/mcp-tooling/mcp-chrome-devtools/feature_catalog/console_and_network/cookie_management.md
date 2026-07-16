---
title: "Cookie Management"
description: "bdg network getCookies and bdg cdp Network.setCookie — read and inject browser cookies."
trigger_phrases:
  - "bdg network cookies"
  - "get browser cookies cli"
  - "set cookie cdp"
version: 1.0.0.0
---

# Cookie Management

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg network getCookies 2>&1` returns the cookie array (empty is valid); `bdg cdp Network.setCookie '{"name":"auth_token","value":"...","domain":"example.com","secure":true,"httpOnly":true}' 2>&1` injects one. Delete via `Network.deleteCookies`, clear all via `Network.clearBrowserCookies`.

---

## 2. HOW IT WORKS

Enable the Network domain first (`bdg cdp Network.enable`). The cookie-session workflow exports current cookies to JSON, injects an auth token, reloads, and screenshots the authenticated state — the standard way to test authenticated flows from the terminal.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `references/cdp_patterns.md` §4-5 | Reference | Network domain patterns and cookie workflow |
| `INSTALL_GUIDE.md` §6, §8 | Guide | Cookie manipulation and session management examples |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/console_and_network/cookies_retrieval.md` | Manual | BDG-012 scenario contract |

---

## 4. SOURCE METADATA

- Group: Console and Network
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `console_and_network/cookie_management.md`
Related references:
- [har_export.md](../console_and_network/har_export.md) — HAR Export
- [context_isolation.md](../mcp_parallel_instances/context_isolation.md) — Context Isolation
