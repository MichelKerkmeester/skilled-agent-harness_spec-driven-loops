---
id: MT-004
category: hub_routing
stage: routing
title: "Genuinely ambiguous tool request defers rather than silently defaulting"
expected_intent: defer
expected_resources: []
created: 2026-07-10
version: 1.0.0.0
---

# MT-004: Genuinely ambiguous tool request defers rather than silently defaulting

Prompt: Use the MCP tool bridge for this.

## Expected Behavior

No specific tool named (no browser, ClickUp, or Figma signal), so the router does not have a strong per-mode signal. `routerPolicy.defaultMode` (`mcp-chrome-devtools`) is a WEAK default per ADR-006 — the router should `defer`/disambiguate on genuinely ambiguous, non-matching intent rather than silently resolving to `mcp-chrome-devtools` on hub-identity vocabulary alone.

## Success Criteria

The router does not silently resolve to `mcp-chrome-devtools` on bare hub-identity vocabulary with no per-mode signal.
