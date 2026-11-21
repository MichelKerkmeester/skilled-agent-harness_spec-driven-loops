---
title: "mcp-browser-use shared tier"
description: "Reserved folder for workflow-layer helpers that more than one mcp-browser-use mode packet needs; not a packet and never in mode-registry.json."
trigger_phrases:
  - "mcp-browser-use shared tier"
  - "browser hub shared helpers"
version: 1.0.0.0
---

# mcp-browser-use shared tier

## 1. OVERVIEW

This folder holds helpers that more than one mode packet can use. It is not discoverable as a skill, so it carries no `graph-metadata.json` and no `description.json`.

No shared helper exists yet. Add one here only when two or more mode packets need the same workflow-layer material. Never place per-mode logic in this folder.
