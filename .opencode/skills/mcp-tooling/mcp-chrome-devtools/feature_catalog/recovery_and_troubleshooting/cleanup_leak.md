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
| `references/session_management.md` §9 | Reference | Trap-based cleanup before/after pattern |
| `SKILL.md` §4 | CLI | NEVER leave sessions running |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/recovery_and_failure/cleanup_leak.md` | Manual | BDG-022 scenario contract (destructive) |

---

## 4. SOURCE METADATA

- Group: Recovery and Troubleshooting
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `recovery_and_troubleshooting/cleanup_leak.md`
Related references:
- [session_stop.md](../cli_bdg_lifecycle/session_stop.md) — Session Stop
- [session_cleanup.md](../mcp_parallel_instances/session_cleanup.md) — Session Cleanup (MCP)
