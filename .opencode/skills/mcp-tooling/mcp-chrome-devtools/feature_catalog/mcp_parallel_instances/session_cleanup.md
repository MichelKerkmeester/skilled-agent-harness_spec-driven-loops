---
title: "Session Cleanup (MCP)"
description: "try/finally around Code Mode browser operations — close pages even on errors."
trigger_phrases:
  - "mcp session cleanup"
  - "close browser pages finally"
  - "chrome mcp cleanup"
version: 1.0.0.0
---

# Session Cleanup (MCP)

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Always close browser instances when done: wrap Code Mode browser operations in `try/finally` so `close_page` runs even when a step throws. This is the MCP counterpart of the CLI's `trap "bdg stop" EXIT` pattern.

---

## 2. HOW IT WORKS

SKILL.md §3 "MCP Session Cleanup" makes the finally-block mandatory; §3 "Invocation Pattern" repeats it as part of the invocation contract. Unclosed pages hold browser processes open, the same leak class the CLI playbook detects with `pgrep -fl chrome`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 | MCP | Session cleanup rule and finally-block contract |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/mcp_parallel_instances/close_and_select_page.md` | Manual | close_page behavior (BDG-016) |
| `manual_testing_playbook/recovery_and_failure/cleanup_leak.md` | Manual | Leak detection counterpart (BDG-022) |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `mcp_parallel_instances/session_cleanup.md`
Related references:
- [session_stop.md](../cli_bdg_lifecycle/session_stop.md) — Session Stop (CLI)
- [cleanup_leak.md](../recovery_and_troubleshooting/cleanup_leak.md) — Cleanup Leak Detection
