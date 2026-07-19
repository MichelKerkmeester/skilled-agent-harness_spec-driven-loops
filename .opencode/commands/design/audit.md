---
description: Compatibility alias for /interface:audit.
argument-hint: "<target> [--scope] [--score] [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Glob, Grep
---

# /design:audit

## 1. PURPOSE

Compatibility alias for canonical `/interface:audit` with stable `workflowMode=audit`.

## 2. INSTRUCTIONS

1. Read `.opencode/commands/interface/audit.md` as the canonical command contract.
2. Preserve `$ARGUMENTS` exactly and execute that contract in the current command context.
3. Do not invoke another public command, restart intake, mutate findings, or reinterpret accepted decisions.
4. Return the canonical visible output and status contract unchanged.
