---
title: "Code Mode Invocation"
description: "chrome_devtools_N.chrome_devtools_N_<tool> inside call_tool_chain() — the manual-namespace contract."
trigger_phrases:
  - "chrome devtools code mode"
  - "call_tool_chain chrome"
  - "mcp tool naming chrome_devtools_1"
version: 1.0.0.0
---

# Code Mode Invocation

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

All MCP browser operations run inside Code Mode's `call_tool_chain()` with the naming `{instance}.{instance}_{tool_name}`, e.g. `chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "..." })`. Tool names use underscores and must be confirmed with Code Mode discovery — never guessed.

---

## 2. HOW IT WORKS

The AI client sees only the 4 Code Mode tools rather than the 26 Chrome DevTools tools (~78k tokens natively, ~98% context reduction). Common tools include navigation, screenshots, console messages, viewport resize, clicks, form fill, waits, and page creation/selection/close. Prerequisite: Code Mode configured and the chrome_devtools manuals registered in `.utcp_config.json`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 | MCP | Invocation pattern and available tools |
| `INSTALL-GUIDE.md` §4, §10 | Guide | Code Mode provider model and tools reference |
| `assets/utcp_chrome_devtools_manuals.md` | Asset | Registered-state snapshot of both manuals |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/mcp_parallel_instances/chrome_devtools_1_navigate.md` | Manual | BDG-014 scenario contract |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `mcp_parallel_instances/code_mode_invocation.md`
Related references:
- [dual_instance_parallel.md](../mcp_parallel_instances/dual_instance_parallel.md) — Dual-Instance Parallel
- [session_cleanup.md](../mcp_parallel_instances/session_cleanup.md) — Session Cleanup
