---
title: "Session Stop"
description: "bdg stop — cleanly terminate the session and release the browser."
trigger_phrases:
  - "bdg stop"
  - "stop browser session"
  - "session cleanup trap"
version: 1.0.0.0
---

# Session Stop

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`bdg stop 2>&1` cleanly terminates the active session and releases the browser process. Leaving sessions running is a NEVER rule; a leaked session leaves an orphaned Chrome process and can make the next script fail.

---

## 2. HOW IT WORKS

In shell scripts, register cleanup with `trap "bdg stop 2>&1" EXIT INT TERM` so the session stops even on errors or interrupts. Verify shutdown with `bdg status` reporting no active session and `pgrep -fl chrome` showing no leaked processes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §4, §7 | CLI | Stop rule and trap pattern |
| `references/session-management.md` §9 | Reference | Trap-based cleanup and stop verification |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/cli-bdg-lifecycle/session-stop.md` | Manual | BDG-004 scenario contract |

---

## 4. SOURCE METADATA

- Group: CLI bdg Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-bdg-lifecycle/session-stop.md`
Related references:
- [cleanup-leak.md](../../feature-catalog/recovery-and-troubleshooting/cleanup-leak.md) — Cleanup Leak Detection
- [session-start.md](../../feature-catalog/cli-bdg-lifecycle/session-start.md) — Session Start
