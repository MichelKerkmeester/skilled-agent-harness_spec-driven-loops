---
title: "system-deep-loop runtime"
description: "Shared runtime library, CLI scripts and tests for durable deep-loop execution."
trigger_phrases:
  - "system-deep-loop runtime"
  - "deep-loop runtime library"
---

# system-deep-loop / runtime

---

## 1. OVERVIEW

The runtime is the shared execution surface for research, review, council and alignment modes. It provides durable event and state handling, graph-backed convergence, executor dispatch, council coordination, recovery boundaries and the CLI entry points that consume those capabilities. Improvement lanes use their host-specific runtime boundary.

The public runtime surface is split between typed or CommonJS modules under `lib/` and thin CLI adapters under `scripts/`. Tests under `tests/` exercise the same contracts without changing runtime behavior.

---

## 2. DIRECTORY TREE

```text
runtime/
├── database/
├── feature-catalog/
├── lib/
├── manual-testing-playbook/
├── references/
├── scripts/
└── tests/
```

Generated dependencies under `node_modules/` and repository metadata directories are not part of the runtime source surface.

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Domain modules | [`lib/README.md`](lib/README.md) |
| CLI commands | [`scripts/README.md`](scripts/README.md) |
| Runtime tests | [`tests/README.md`](tests/README.md) |
| TypeScript configuration | `tsconfig.json` |
| Vitest configuration | `vitest.config.ts` |

Consumers import domain behavior from `lib/` or invoke a documented script from `scripts/`. The mode workflows own user-facing orchestration and pass durable inputs into this runtime.

---

## 4. SPINE ROLE

The runtime is the implementation spine beneath the deep-loop mode workflows. Event envelopes enter the ledger schema, reducers derive projections, sealed artifacts and certificates bind durable evidence, resume adapters reconstruct continuity and parity or rollback gates protect transitions.

Database storage, lock ownership and append authorization remain infrastructure boundaries. Mode workflows decide when to call the runtime and how to present its results.

---

## 5. VALIDATION

Run the typecheck and the runtime Vitest configuration from the repository root.

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts
```

---

## 6. OPERATING RULES

- Treat durable records as append-only evidence and preserve their owning boundary.
- Use the public barrel or documented CLI entry point for a module.
- Acquire the runtime writer lock before state mutation.
- Keep recovery and rollback decisions fail-closed when required evidence is absent.
- Keep generated databases and local artifacts outside source changes.

---

## 7. RELATED

| Document | Purpose |
|---|---|
| [`references/script-interface-contract.md`](references/script-interface-contract.md) | CLI arguments, exit codes and stdout contracts |
| [`references/coverage-graph-schema.md`](references/coverage-graph-schema.md) | Graph storage schema and relation rules |
| [`feature-catalog/feature-catalog.md`](feature-catalog/feature-catalog.md) | Runtime feature inventory |
| [`manual-testing-playbook/manual-testing-playbook.md`](manual-testing-playbook/manual-testing-playbook.md) | Deterministic operator checks |
