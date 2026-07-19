---
description: Compatibility alias for /interface:design-reference.
argument-hint: "<live-url> --output <dir> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:md-generator

## 1. PURPOSE

Compatibility alias for canonical `/interface:design-reference` with stable `workflowMode=md-generator`.

## 2. INSTRUCTIONS

1. Read `.opencode/commands/interface/design-reference.md` as the canonical command contract.
2. Preserve `$ARGUMENTS` exactly and execute that contract in the current command context.
3. Do not invoke another public command, restart intake, bypass the owned extraction pipeline, or reinterpret accepted decisions.
4. Return the canonical visible output and status contract unchanged.
