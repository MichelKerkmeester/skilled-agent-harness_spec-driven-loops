---
title: "Test Utils: Workspace-Root Resolver Coverage"
description: "Test-only folder for the skill-advisor mcp-server test suite, not shared utility code."
---

# Test Utils: Workspace-Root Resolver Coverage

---

## 1. OVERVIEW

`tests/utils/` is a test-only folder in the skill-advisor `mcp-server/tests/` suite. Despite the `utils` name it holds a regression test, not shared helper code: it exercises `findAdvisorWorkspaceRoot` from `../../lib/utils/workspace-root.js`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `workspace-root.vitest.ts` | Verifies the sentinel walk-up happy path and guards the no-sentinel fallback, asserting it never resolves to a directory inside a `specs/` packet tree. |

## 3. RELATED

- [`../README.md`](../README.md)
