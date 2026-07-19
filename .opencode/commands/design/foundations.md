---
description: Compatibility alias for /interface:foundations.
argument-hint: "<axis> <target> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /design:foundations

## 1. PURPOSE

Compatibility alias for canonical `/interface:foundations` with stable `workflowMode=foundations`.

## 2. INSTRUCTIONS

1. Read `.opencode/commands/interface/foundations.md` as the canonical command contract.
2. Preserve `$ARGUMENTS` exactly and execute that contract in the current command context.
3. Do not invoke another public command, restart intake, or reinterpret accepted decisions.
4. Return the canonical visible output and status contract unchanged.
