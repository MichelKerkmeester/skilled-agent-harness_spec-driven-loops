---
id: MT-003
category: hub-routing
stage: routing
title: "Figma render/export request routes to the mcp-figma transport"
expected_intent: mcp-figma
expected_resources:
  - mcp-figma/SKILL.md
created: 2026-07-10
version: 1.0.0.0
---

# MT-003: Figma render/export request routes to the mcp-figma transport

Prompt: Render this component in Figma and export the design tokens.

## Expected Behavior

Strong `figma-aliases`/`design-transport` signal (Figma, render, export) resolves `workflowMode: mcp-figma`; the hub loads `mcp-figma/SKILL.md`. Because `mcp-figma` is a transport (`packetKind: "transport"`), it never makes the design decision itself — a design-affecting operation still requires the mandatory `sk-design` cross-hub pairing.

## Success Criteria

The router resolves `mcp-figma` as a single dominant mode; the transport does not silently substitute for `sk-design`'s judgment.
