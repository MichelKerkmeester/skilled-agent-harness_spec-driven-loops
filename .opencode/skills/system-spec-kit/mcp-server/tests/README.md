---
title: "MCP Server Tests: Vitest Coverage"
description: "Vitest unit, integration, validation, hook, and regression coverage for the spec-kit engine."
trigger_phrases:
  - "test suite"
  - "vitest"
  - "regression tests"
---

# MCP Server Tests: Vitest Coverage

---

## 1. OVERVIEW

`tests/` is the default Vitest coverage surface for this package. It covers spec folder validation, generated metadata, description generation, continuity and resume behavior, the runtime hook adapters, and the package's own build and documentation parity guards.

Current responsibilities:

- Verify validation rules, level contracts and the generated-metadata integrity and drift gates.
- Verify description generation, folder discovery and continuity records.
- Verify the hook adapters and the shared spec-gate and completion-evidence policy.
- Keep load and contention checks in the sibling `../stress-test/`, which the default config excludes.

This README names directories rather than individual suites. The file set moves; use the inventory command in Section 3 for the live list.

---

## 2. PACKAGE TOPOLOGY

```text
tests/
+-- *.vitest.ts    # Unit, integration and regression suites
+-- _support/      # Vitest setup shared by both configs
+-- __helpers__/   # Shared env helpers for flag-driven tests
+-- fixtures/      # Sample documents and data
`-- README.md
```

Allowed dependency direction:

```text
tests ───▶ package source modules
tests ───▶ fixtures and helpers
```

Disallowed dependency direction:

```text
package source modules ───▶ tests
tests ───▶ shared temp state without explicit setup and cleanup
```

---

## 3. DIRECTORY TREE

```text
tests/
├── _support/            # Vitest setup file loaded by both vitest configs
├── __helpers__/         # setEnv / restoreEnv / withFeatureFlag for env-driven suites
├── adversarial/         # Adversarial input handling
├── advisor-fixtures/    # Fixture inputs for advisor-facing suites
├── archive/             # Retained suites kept out of the active areas
├── deep-loop/           # Deep-loop integration coverage
├── description/         # description.json generation and repair suites
├── embedders/           # Embedder-facing suites
├── fixtures/            # Shared document and data fixtures
├── graph/               # graph-metadata.json suites
├── local-llm-features/  # Local model feature suites
├── security/            # Security and sanitization suites
├── validation/          # Spec folder validation rule suites
└── README.md
```

Use `rg --files tests -g '*.vitest.ts'` for the full live inventory.

---

## 4. KEY AREAS

| Area | Where | Responsibility |
|---|---|---|
| Validation rules | `validation/`, top-level suites | Level contracts, per-document structure rules, and the folder report shape. |
| Generated metadata | `graph/`, `description/` | Schema conformance, derivation, merge behavior, and the integrity and drift gates. |
| Discovery and continuity | Top-level suites | Spec-document discovery, folder discovery, index scope, continuity records and the resume ladder. |
| Hook adapters | Top-level suites | Per-runtime lifecycle adapters, the shared spec-gate core, and the completion-evidence sentinel. |
| Package guards | Top-level suites | Build freshness, architecture seam boundaries, and documentation parity against the environment reference. |
| Security | `security/`, `adversarial/` | Sanitization, prompt-safety and adversarial input handling. |

`tool-ownership-lint-runner.mjs` sits beside the suites as a lint runner rather than a Vitest file.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Test ownership | `tests/` verifies package behavior. It does not own production code paths. |
| Fixtures | Fixture data belongs in `fixtures/` or suite-local setup. |
| Environment | A suite that changes paths, temp folders or feature flags isolates and restores that state. Use `__helpers__/test-env.ts` rather than mutating `process.env` directly. |
| Stress runs | Load and contention checks belong in `../stress-test/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Developer or CI command                  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Bounded runner or a focused vitest call  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Suite setup creates isolated state       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Source module or adapter is exercised    │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Pass, fail, or focused regression signal │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `npm test` | npm script | Bounded default runner (`../scripts/run-tests.mjs`). |
| `npm run test:core` | npm script | Plain `vitest run` over this folder. |
| `npm run test:sharded` | npm script | Full suite split into serial shards. |
| `npx vitest run tests/<file>.vitest.ts` | CLI | Runs one focused suite. |
| `rg --files tests -g '*.vitest.ts'` | CLI | Lists the current Vitest inventory. |

Prefer `npm test` over a bare `vitest run`: the bounded runner applies a process-group timeout, so a hung suite is terminated with its children instead of leaking them.

---

## 7. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp-server`.

```bash
npm test
npm run typecheck:tests
```

Focused examples:

```bash
npx vitest run tests/validation
npx vitest run tests/graph tests/description
```

Expected result: selected suites pass with isolated database and temp state.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../api/README.md`](../api/README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../stress-test/README.md`](../stress-test/README.md)
