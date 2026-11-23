---
title: "Dual-Instance Parallel"
description: "chrome_devtools_1 and chrome_devtools_2: two isolated browsers driven one call after another from one call_tool_chain."
trigger_phrases:
  - "parallel browser testing"
  - "chrome_devtools_2"
  - "compare production staging browsers"
version: 1.0.2.0
---

# Dual-Instance Parallel

---

## 1. OVERVIEW

Two isolated manuals (`chrome_devtools_1`, `chrome_devtools_2`) each run their own browser process, so a single `call_tool_chain()` can navigate both and capture both screenshots, for example production and staging side by side. Write the calls as plain synchronous JavaScript. Code Mode runs the code in a plain function, so a top-level `await` fails. Each tool call blocks until it returns, so the calls run one after another and `Promise.all` adds no concurrency. Two live browsers in one run is what the single-session `bdg` CLI cannot provide. The third manual, `chrome_devtools_live`, attaches to the user's own Chrome instead and is not part of this pattern (see `live-instance.md`).

---

## 2. HOW IT WORKS

Each instance is launched with `--isolated=true` so there are no session conflicts. `bdg` exposes one global `status`/`stop` lifecycle with no session selector, so work that needs two separate browsers routes through the MCP instances (references/cdp-patterns.md §8 makes this explicit).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `SKILL.md` §3 | MCP | Isolated instances and parallel benefit |
| `INSTALL-GUIDE.md` §6, §8 | Guide | Parallel instance patterns (Pattern 6, Example 5) |
| `references/cdp-patterns.md` §8 | Reference | Sequential-only CLI boundary, MCP for parallelism |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-parallel-instances/dual-instance-parallel.md` | Manual playbook | BDG-015 scenario contract |

---

## 4. SOURCE METADATA

- Group: MCP Parallel Instances
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-parallel-instances/dual-instance-parallel.md`
Related references:
- [context-isolation.md](../mcp-parallel-instances/context-isolation.md) — Context Isolation
- [code-mode-invocation.md](../mcp-parallel-instances/code-mode-invocation.md) — Code Mode Invocation
