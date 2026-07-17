---
title: "Port Conflict"
description: "lsof -i :9222 and kill — free the CDP debugging port when EADDRINUSE blocks startup."
trigger_phrases:
  - "port 9222 in use"
  - "EADDRINUSE 9222"
  - "cdp port conflict"
version: 1.0.0.0
---

# Port Conflict

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

The Chrome DevTools Protocol runs on localhost port 9222. `EADDRINUSE: address already in use :::9222` means another process holds it: find it with `lsof -i :9222`, free it with `kill -9 $(lsof -t -i :9222)`, and confirm `lsof -i :9222` returns nothing.

---

## 2. HOW IT WORKS

Port 9222 grants full browser control, so it must stay localhost-bound (`--remote-debugging-address=127.0.0.1`; verify with `lsof -i :9222` showing `127.0.0.1:9222`, not `*:9222`) and firewalled from external access. The same conflict also blocks the MCP server startup.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `INSTALL-GUIDE.md` §4, §9 | Guide | Security considerations and port-conflict fixes |
| `references/troubleshooting.md` | Reference | Diagnostic sequence for startup failures |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/recovery_and_failure/dead_session.md` | Manual | Restart path exercised in BDG-021 |

---

## 4. SOURCE METADATA

- Group: Recovery and Troubleshooting
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `recovery_and_troubleshooting/port_conflict.md`
Related references:
- [dead_session.md](../recovery_and_troubleshooting/dead_session.md) — Dead Session Recovery
- [code_mode_invocation.md](../mcp_parallel_instances/code_mode_invocation.md) — Code Mode Invocation
