---
title: "Dual-Instance Parallel"
description: "chrome_devtools_1 + chrome_devtools_2 via Promise.all — two isolated browsers running simultaneously."
trigger_phrases:
  - "parallel browser testing"
  - "chrome_devtools_2"
  - "compare production staging browsers"
version: 1.0.0.0
---

# Dual-Instance Parallel

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Two registered manuals (`chrome_devtools_1`, `chrome_devtools_2`) each run their own browser process, so a single `call_tool_chain()` can navigate both and capture both screenshots via `Promise.all` — e.g. production vs staging side by side. This is the capability the sequential-only `bdg` CLI cannot provide.

---

## 2. HOW IT WORKS

Each instance is launched with `--isolated=true` so there are no session conflicts. `bdg` exposes one global `status`/`stop` lifecycle with no session selector, so genuine parallel browser control routes through the MCP instances (references/cdp_patterns.md §8 makes this explicit).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 | MCP | Isolated instances and parallel benefit |
| `INSTALL-GUIDE.md` §6, §8 | Guide | Parallel instance patterns (Pattern 6, Example 5) |
| `references/cdp_patterns.md` §8 | Reference | Sequential-only CLI boundary, MCP for parallelism |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/mcp_parallel_instances/dual_instance_parallel.md` | Manual | BDG-015 scenario contract |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `mcp_parallel_instances/dual_instance_parallel.md`
Related references:
- [context_isolation.md](../mcp_parallel_instances/context_isolation.md) — Context Isolation
- [code_mode_invocation.md](../mcp_parallel_instances/code_mode_invocation.md) — Code Mode Invocation
