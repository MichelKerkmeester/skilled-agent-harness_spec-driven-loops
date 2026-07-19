---
title: "Dead Session Recovery"
description: "bdg stop then restart — recover after a crashed or killed browser process."
trigger_phrases:
  - "no active session error"
  - "session recovery bdg"
  - "browser crashed restart"
version: 1.0.0.0
---

# Dead Session Recovery

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

When the browser process dies, subsequent commands fail with a clear session error (`Error: No active session`). Recovery: `bdg stop 2>&1` to clear state, then a fresh `bdg <url>` — the session_management reference wraps this in a retry loop with a health check.

---

## 2. HOW IT WORKS

Zombie debugging processes can block restart; find them with `ps aux | grep -i chrome | grep -i debug` and clear with `pkill -f "chrome.*remote-debugging"`. Escalate when sessions still fail after 3 retries (SKILL.md ESCALATE IF 2).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `references/session-management.md` §8 | Reference | Session error recovery function |
| `references/troubleshooting.md` | Reference | Session won't start diagnostics |
| `INSTALL-GUIDE.md` §9 | Guide | Error/cause/fix row for no-active-session |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/recovery-and-failure/dead-session.md` | Manual | BDG-021 scenario contract (destructive, throwaway sessions only) |

---

## 4. SOURCE METADATA

- Group: Recovery and Troubleshooting
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `recovery-and-troubleshooting/dead-session.md`
Related references:
- [session-status.md](../../feature-catalog/cli-bdg-lifecycle/session-status.md) — Session Status
- [cleanup-leak.md](../../feature-catalog/recovery-and-troubleshooting/cleanup-leak.md) — Cleanup Leak Detection
