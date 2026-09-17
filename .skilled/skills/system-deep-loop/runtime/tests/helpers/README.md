---
title: "runtime test helpers"
description: "Shared child-process helpers for runtime CLI and integration tests."
trigger_phrases:
  - "runtime test helpers"
  - "spawn cjs helper"
---

# Test Helpers

---

## 1. OVERVIEW

This folder contains the shared process helper used by tests that invoke CommonJS runtime scripts. It centralizes child-process setup and result capture so integration suites can assert command behavior without duplicating spawn handling.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `spawn-cjs.ts` | Spawns a CommonJS runtime entry point and captures its process result for assertions. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Process helper | `spawn-cjs.ts` |

The helper is test-only and is imported by integration or unit suites that cross the CLI boundary.

---

## 4. SPINE ROLE

The helper is the test harness seam between runtime scripts and process-level assertions. It verifies the command boundary without becoming part of the production runtime spine.

---

## 5. VALIDATION

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Integration tests](../integration/README.md)
- [Runtime scripts](../../scripts/README.md)
