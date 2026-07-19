---
description: Compatibility alias for /interface:design.
argument-hint: "<target> [--mode] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /design:interface

## 1. PURPOSE

Compatibility alias for canonical `/interface:design` with stable `workflowMode=interface`.

## 2. INSTRUCTIONS

1. Read `.opencode/commands/interface/design.md` as the canonical command contract.
2. Preserve `$ARGUMENTS` exactly and execute that contract in the current command context.
3. Do not invoke another public command, restart intake, or reinterpret accepted decisions.
4. Return the canonical visible output and status contract unchanged.
