---
title: "Cookie Management"
description: "bdg network getCookies and bdg cdp Network.setCookie — read and inject browser cookies."
trigger_phrases:
  - "bdg network cookies"
  - "get browser cookies cli"
  - "set cookie cdp"
version: 1.0.1.0
---

# Cookie Management

---

## 1. OVERVIEW

`bdg network getCookies 2>&1` returns the cookie array (empty is valid); `bdg cdp Network.setCookie '{"name":"auth_token","value":"...","domain":"example.com","secure":true,"httpOnly":true}' 2>&1` injects one. Delete via `Network.deleteCookies`, clear all via `Network.clearBrowserCookies`.

Cookie values are live session secrets (SKILL.md ALWAYS rule 7). Print names and domains, not values, with `jq 'map({name, domain})'`. Inject a throwaway value, never a real session token. Redact cookie values before quoting any output in a reply, report or file.

---

## 2. HOW IT WORKS

Enable the Network domain first (`bdg cdp Network.enable`). The cookie-session workflow exports current cookies to JSON in a scratch folder outside the repository, injects a throwaway auth token, reloads, and screenshots the authenticated state. This is the standard way to test authenticated flows from the terminal. Delete the dump when the test is done and never commit it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `references/cdp-patterns.md` §4-5 | Reference | Network domain patterns and cookie workflow |
| `INSTALL-GUIDE.md` §6, §8 | Guide | Cookie manipulation and session management examples |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/console-and-network/cookies-retrieval.md` | Manual playbook | BDG-012 scenario contract |

---

## 4. SOURCE METADATA

- Group: Console and Network
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `console-and-network/cookie-management.md`
Related references:
- [har-export.md](../console-and-network/har-export.md) — HAR Export
- [context-isolation.md](../mcp-parallel-instances/context-isolation.md) — Context Isolation
