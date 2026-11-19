---
title: "runtime test fixtures"
description: "Shared event, ledger and default-run golden fixtures for runtime tests."
trigger_phrases:
  - "runtime test fixtures"
  - "authorized ledger fixtures"
---

# Test Fixtures

---

## 1. OVERVIEW

This folder contains reusable inputs and child-process workers for runtime tests. The fixtures build validated event envelopes and authorized-ledger requests without changing production state. Two golden folders hold the byte-for-byte default-run output that the depth-mode golden suites compare against.

The fixture surface is test-only. Each consumer suite owns the assertion that gives a fixture meaning.

---

## 2. DIRECTORY TREE

```text
fixtures/
├── authorized-ledger-fixtures.ts
├── authorized-ledger-test-helper.ts
├── authorized-ledger-worker.ts
├── event-envelope-producers.ts
├── golden-research-default/
│   ├── dashboard.md
│   ├── lineage-prompt.txt
│   ├── next-focus.txt
│   ├── prompt-pack.md
│   ├── registry.json
│   └── stop-decision-config.json
└── golden-review-default/
    ├── dashboard.md
    ├── lineage-prompt.txt
    ├── next-focus.txt
    ├── pivot-seeds.json
    ├── prompt-pack.md
    ├── registry.json
    └── stop-decision-config.json
```

---

## 3. FILES

| File | Responsibility |
|---|---|
| `authorized-ledger-fixtures.ts` | Builds fixture event registries, policy registries and authorized-ledger requests. |
| `authorized-ledger-test-helper.ts` | Shared test helper for authorized-ledger setup and assertions. |
| `authorized-ledger-worker.ts` | Child-process worker that appends a fixture event and prints its receipt. |
| `event-envelope-producers.ts` | Provides representative payloads for real event-producer families. |
| `golden-research-default/` | Holds the six baseline artifacts a default research run renders, compared by `research-depth-mode-golden.vitest.ts`. |
| `golden-review-default/` | Holds the seven baseline artifacts a default review run renders, compared by `review-depth-mode-golden.vitest.ts`. |

---

## 4. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Ledger fixtures | `authorized-ledger-fixtures.ts` |
| Worker fixtures | `authorized-ledger-worker.ts` |
| Event fixtures | `event-envelope-producers.ts` |
| Golden default-run baselines | `golden-research-default/`, `golden-review-default/` |

These files are imported by tests and are not runtime production entry points.

---

## 5. SPINE ROLE

Fixtures provide deterministic inputs at the test edge of the runtime spine. They let suites exercise event envelopes, authorization, subprocess ownership and graph queries while keeping test data separate from durable runtime storage. The golden folders pin a default run's rendered output, so an opt-in change cannot alter it unnoticed.

---

## 6. VALIDATION

```bash
.skilled/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .skilled/skills/system-deep-loop/runtime/tsconfig.json
```

---

## 7. RELATED

- [Runtime test index](../README.md)
- [Runtime library](../../lib/README.md)
