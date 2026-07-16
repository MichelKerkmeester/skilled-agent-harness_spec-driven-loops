---
description: Resolve and execute a repository agent through one inline procedure.
argument-hint: "<task>"
allowed-tools: Read, Grep, Glob
---

# Agent Router

This monolithic command owns its complete procedure inline and declares no
external workflow asset.

## 1. PROCEDURE

1. Read the runtime agent directory.
2. Match the task to one agent definition.
3. Load the selected definition.
4. Execute the requested read-only task.
5. Return the result with the selected agent identity.
