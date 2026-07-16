---
id: MT-007
category: hub_routing
stage: routing
title: "Agentic Aside browser task routes to mcp-aside-devtools"
expected_intent: mcp-aside-devtools
expected_resources:
  - mcp-aside-devtools/SKILL.md
created: 2026-07-16
version: 1.0.0.0
---

# MT-007: Agentic Aside browser task routes to mcp-aside-devtools

Prompt: Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.

## Expected Behavior

Strong `aside-devtools-aliases`/`agentic-browser` signal (Aside browser, REPL evidence) resolves `workflowMode: mcp-aside-devtools`; the hub loads `mcp-aside-devtools/SKILL.md`, not the hub's own thin `SKILL.md` and not `mcp-chrome-devtools` (which owns Chrome/`bdg`/CDP debugging, a distinct vocabulary class).

## Success Criteria

The router resolves `mcp-aside-devtools` as a single dominant mode. Generic browser-debug phrasing WITHOUT Aside vocabulary must still prefer `mcp-chrome-devtools` (its aliases plus the tie-break order protect the incumbent), so this scenario passes only when Aside-specific vocabulary is present.
