---
title: "Session Start"
description: "bdg <url> — open a URL and start the CDP browser session."
trigger_phrases:
  - "bdg start session"
  - "open url in browser cli"
  - "start browser debugging session"
version: 1.0.0.0
---

# Session Start

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg <url> 2>&1` launches Chrome/Chromium and opens a CDP session against the given URL. Exactly one session is active at a time: `bdg` has no session-id, name, or selector option, so a second `bdg <url>` replaces the first.

---

## 2. HOW IT WORKS

The canonical lifecycle is Start, Verify, Execute, Stop. Always capture stderr with `2>&1`, verify with `bdg status` before CDP commands, and never execute CDP commands without an active session (SKILL.md NEVER rule 1). Production scripts add retry logic and timeouts around the start.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §7 | CLI | Essential command list (`bdg <url>`) |
| `references/session-management.md` §4 | Reference | Start patterns, retry logic, timeout |
| `INSTALL-GUIDE.md` §6 | Guide | Session command reference |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/cli-bdg-lifecycle/session-start.md` | Manual | BDG-002 scenario contract |

---

## 4. SOURCE METADATA

- Group: CLI bdg Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-bdg-lifecycle/session-start.md`
Related references:
- [session-status.md](../cli-bdg-lifecycle/session-status.md) — Session Status
- [session-stop.md](../cli-bdg-lifecycle/session-stop.md) — Session Stop
