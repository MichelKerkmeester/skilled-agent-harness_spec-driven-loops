# Source: Public Runtime Surface

## 1. OVERVIEW

`src/` contains the package implementation. `index.ts` is the main public barrel and re-exports the contracts, context, core, fidelity, observability, render and versioning surfaces.

The remaining subsystem barrels are published through explicit package subpaths or consumed by the release and operator layers.

---

## 2. DIRECTORY TREE

```text
src/
├── clients/        # Client-owned presentation commits
├── context/        # Bounded context selection
├── contracts/      # Shared records and validators
├── core/           # Normalization and assembly
├── doctor/         # Compatibility checks
├── evaluation/     # Blinded release evaluation
├── fidelity/       # Protected spans and validation
├── observability/  # Content-free telemetry
├── privacy/        # Privacy route selection
├── providers/      # Provider execution boundary
├── release/        # Release evidence and rollback
├── render/         # Render decisions
├── runtimes/       # Runtime event adapters
├── versioning/     # Schema compatibility
└── index.ts        # Main package barrel
```

---

## 3. ENTRYPOINT

| File | Public exports |
|---|---|
| `index.ts` | All exports from `contracts/index.ts`, `context/index.ts`, `core/index.ts`, `fidelity/index.ts`, `observability/index.ts`, `render/index.ts` and `versioning/index.ts` |

Dependency direction follows the pipeline. Runtime and contract layers feed assembly, privacy and provider execution. Fidelity and render consume the candidate without mutating canonical input.

---

## 4. VALIDATION

Run from the package directory.

```bash
npm run check
```

Expected result: the type check, build, test suite and public import smoke test pass.

---

## 5. RELATED

- [Package README](../README.md)
