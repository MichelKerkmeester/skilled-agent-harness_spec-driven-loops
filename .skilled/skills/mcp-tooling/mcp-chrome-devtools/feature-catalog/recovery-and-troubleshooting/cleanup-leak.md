---
title: "Cleanup Leak Detection"
description: "pgrep -fl chrome before/after bdg stop — detect and clear leaked browser processes."
trigger_phrases:
  - "leaked chrome process"
  - "orphaned browser process"
  - "session leak detection"
version: 1.0.0.0
---

# Cleanup Leak Detection

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Omitting `bdg stop` leaks a Chrome process. Detection: baseline `pgrep -fl chrome` count, start a session (count rises), run `bdg stop` (count returns to baseline or below). The playbook treats a persistent post-stop increase as a FAIL.

---

## 2. HOW IT WORKS

Prevention is trap-based cleanup (`trap cleanup EXIT INT TERM` around `bdg stop`), which guarantees release even on errors and interrupts. Destructive playbook runs must verify no leaked processes after each wave.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `references/session-management.md` §9 | Reference | Trap-based cleanup before/after pattern |
| `SKILL.md` §4 | CLI | NEVER leave sessions running |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/recovery-and-failure/cleanup-leak.md` | Manual | BDG-022 scenario contract (destructive) |

---

## 4. SOURCE METADATA

- Group: Recovery and Troubleshooting
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `recovery-and-troubleshooting/cleanup-leak.md`
Related references:
- [session-stop.md](../../feature-catalog/cli-bdg-lifecycle/session-stop.md) — Session Stop
- [session-cleanup.md](../../feature-catalog/mcp-parallel-instances/session-cleanup.md) — Session Cleanup (MCP)
