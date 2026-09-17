---
title: "runtime test fixtures"
description: "Shared event, ledger and council graph fixtures for runtime tests."
trigger_phrases:
  - "runtime test fixtures"
  - "authorized ledger fixtures"
---

# Test Fixtures

---

## 1. OVERVIEW

This folder contains reusable inputs and child-process workers for runtime tests. The fixtures build validated event envelopes, authorized-ledger requests and council graph value scenarios without changing production state.

The fixture surface is test-only. Each consumer suite owns the assertion that gives a fixture meaning.

---

## 2. DIRECTORY TREE

```text
fixtures/
└── council-value/
    └── data/
```

---

## 3. FILES

| File | Responsibility |
|---|---|
| `authorized-ledger-fenced-worker.ts` | Child-process worker fixture for fenced authorized-ledger writes. |
| `authorized-ledger-fixtures.ts` | Builds fixture event registries, policy registries and authorized-ledger requests. |
| `authorized-ledger-test-helper.ts` | Shared test helper for authorized-ledger setup and assertions. |
| `authorized-ledger-worker.ts` | Child-process worker that appends a fixture event and prints its receipt. |
| `event-envelope-producers.ts` | Provides representative payloads for real event-producer families. |

---

## 4. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Ledger fixtures | `authorized-ledger-fixtures.ts` |
| Worker fixtures | `authorized-ledger-worker.ts`, `authorized-ledger-fenced-worker.ts` |
| Event fixtures | `event-envelope-producers.ts` |
| Scenario fixtures | [`council-value/README.md`](council-value/README.md) |

These files are imported by tests and are not runtime production entry points.

---

## 5. SPINE ROLE

Fixtures provide deterministic inputs at the test edge of the runtime spine. They let suites exercise event envelopes, authorization, subprocess ownership and graph queries while keeping test data separate from durable runtime storage.

---

## 6. VALIDATION

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

---

## 7. RELATED

- [Runtime test index](../README.md)
- [Council value fixtures](council-value/README.md)
- [Runtime library](../../lib/README.md)
