---
title: "runtime lifecycle tests"
description: "Vitest coverage for database open, close and writer-lock lifecycle behavior."
trigger_phrases:
  - "runtime lifecycle tests"
  - "database open close tests"
---

# Lifecycle Tests

---

## 1. OVERVIEW

This folder verifies that the coverage graph database opens and closes cleanly and that the database writer lock acquires and releases through the expected lifecycle.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `db-open-close.vitest.ts` | Checks database open and close behavior together with writer-lock acquisition and release. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Test command | `db-open-close.vitest.ts` |
| Covered boundary | Coverage graph database and writer-lock lifecycle |

The file is executable verification, not a production module.

---

## 4. SPINE ROLE

Lifecycle tests protect the storage boundary beneath graph queries and reducers. They catch resource ownership failures before durable state is handed back to the runtime spine.

---

## 5. VALIDATION

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts tests/lifecycle
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime database](../../database/README.md)
- [Runtime library](../../lib/README.md)
