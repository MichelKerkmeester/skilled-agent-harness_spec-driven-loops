---
title: "runtime test fixtures"
description: "Shared event and ledger fixtures for runtime tests."
trigger_phrases:
  - "runtime test fixtures"
  - "authorized ledger fixtures"
---

# Test Fixtures

---

## 1. OVERVIEW

This folder contains reusable inputs and child-process workers for runtime tests. The fixtures build validated event envelopes and authorized-ledger requests without changing production state.

The fixture surface is test-only. Each consumer suite owns the assertion that gives a fixture meaning.

---

## 2. DIRECTORY TREE

```text
fixtures/
├── authorized-ledger-fixtures.ts
├── authorized-ledger-test-helper.ts
├── authorized-ledger-worker.ts
└── event-envelope-producers.ts
```

---

## 3. FILES

| File | Responsibility |
|---|---|
| `authorized-ledger-fixtures.ts` | Builds fixture event registries, policy registries and authorized-ledger requests. |
| `authorized-ledger-test-helper.ts` | Shared test helper for authorized-ledger setup and assertions. |
| `authorized-ledger-worker.ts` | Child-process worker that appends a fixture event and prints its receipt. |
| `event-envelope-producers.ts` | Provides representative payloads for real event-producer families. |

---

## 4. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Ledger fixtures | `authorized-ledger-fixtures.ts` |
| Worker fixtures | `authorized-ledger-worker.ts` |
| Event fixtures | `event-envelope-producers.ts` |

These files are imported by tests and are not runtime production entry points.

---

## 5. SPINE ROLE

Fixtures provide deterministic inputs at the test edge of the runtime spine. They let suites exercise event envelopes, authorization, subprocess ownership and graph queries while keeping test data separate from durable runtime storage.

---

## 6. VALIDATION

```bash
.skilled/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .skilled/skills/system-deep-loop/runtime/tsconfig.json
```

---

## 7. RELATED

- [Runtime test index](../README.md)
- [Runtime library](../../lib/README.md)
