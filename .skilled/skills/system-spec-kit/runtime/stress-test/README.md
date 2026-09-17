---
title: "Runtime Stress Tests"
description: "Vitest suites held outside the default test run, for load, contention, and capacity checks operators run by choice."
trigger_phrases:
  - "stress test"
  - "runtime/stress-test"
  - "dedicated stress folder"
---

# Runtime Stress Tests

---

## 1. OVERVIEW

`stress-test/` holds checks that are deliberately outside the default `tests/` suite: load and flood behavior, contention, degraded-state sweeps, and capacity validation an operator runs on purpose rather than on every commit.

Current state:

- `../vitest.stress.config.ts`, at the package root, includes only `runtime/stress-test/**/*.{vitest,test}.ts` and excludes `runtime/tests/**` and `scripts/tests/**`.
- The default lanes use `../vitest.config.ts` and do not load anything here.
- `fileParallelism` is off and the per-test timeout is 240 seconds, because these suites contend for the same temporary directories when run together.
- Suites use temp directories or in-memory databases. None mutates a live file outside its own sandbox.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                       RUNTIME STRESS TESTS                       │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌──────────────────┐
│ Operator       │ ───▶ │ vitest run --config│ ───▶ │ stress-only      │
│                │      │ vitest.stress...   │      │ discovery        │
└────────────────┘      └─────────┬──────────┘      └────────┬─────────┘
                                  │                          │
                                  ▼                          ▼
                       ┌────────────────────┐       ┌──────────────────┐
                       │ domain suites      │ ───▶  │ temp fixtures    │
                       │ under stress-test/ │       │ isolated state   │
                       └────────────────────┘       └──────────────────┘

Execution boundary: the default test lanes do not import or run stress suites.
```

---

## 3. DIRECTORY TREE

```text
runtime/stress-test/
├── substrate/        # Pure-logic substrate stress gate
└── README.md
```

The stress Vitest config lives at the package root as `../vitest.stress.config.ts`, not in this folder.

---

## 4. KEY FILES

| File or directory | Responsibility |
|---|---|
| `../vitest.stress.config.ts` | Limits Vitest discovery to this folder, disables file parallelism, and raises the per-test timeout to 240 seconds. |
| `substrate/v-rule-save-flood-stress.vitest.ts` | Cross-spec contamination rules under a 50-save canonical-doc flood, run against pure validation logic in `../cli/lib/validate-memory-quality`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Default verification | Small deterministic regressions belong in `../tests/`, not here. |
| Data safety | Use temp directories, in-memory databases, or generated fixtures. A stress suite must not touch state outside its own sandbox. |
| Runtime cost | Note the expected cost near the top of a long-running suite. |
| Ownership | Add a suite here only for capacity, concurrency, degraded-state, or benchmark coverage. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Operator chooses an explicit stress run  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Vitest loads ../vitest.stress.config.ts  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Matching suites run serially, isolated   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Operator reviews the stress-only result  │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `../vitest.stress.config.ts` | Vitest config | Defines the stress-only discovery boundary. |
| `npx vitest run --config vitest.stress.config.ts` | Command | Runs every discovered stress suite. |
| `npx vitest run --config vitest.stress.config.ts stress-test/substrate` | Command | Runs one domain slice. |

`package.json` defines no `stress` script. These suites are invoked through Vitest directly.

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run --config vitest.stress.config.ts
npx vitest run --config vitest.stress.config.ts stress-test/substrate/v-rule-save-flood-stress.vitest.ts
```

Expected result: the selected stress slice exits with Vitest success or a clear benchmark failure.

---

## 8. RELATED

- [`substrate/README.md`](./substrate/README.md)
- [`../tests/README.md`](../tests/README.md)
- [`../README.md`](../README.md)
