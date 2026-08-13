# CLI Communication Projection

## 1. OVERVIEW

`@portable-cli/communication-projection` turns runtime events into bounded display projections while preserving the exact original as the fail-closed result. The package owns versioned contracts, deterministic assembly, privacy-aware provider routing, fidelity checks, rendering decisions and release evidence.

Use the files in [`docs/`](./docs/) for installation, configuration, privacy policy, release operation and rollback guidance.

---

## 2. DIRECTORY TREE

```text
cli-communication-projection/
├── src/                 # Runtime code and public barrels
├── test/                # Contract, pipeline and release coverage
├── docs/                # Operator reference documents
├── package.json         # Public exports and validation scripts
├── tsconfig.json        # Type-check configuration
├── tsconfig.build.json  # Declaration and JavaScript build
└── vitest.config.ts     # Serial test configuration
```

---

## 3. SOURCE SUBSYSTEMS

| Folder | Ownership |
|---|---|
| `src/clients/` | Applies projection, append and sidecar results to client-owned display surfaces |
| `src/context/` | Selects bounded, fresh and privacy-approved transcript context |
| `src/contracts/` | Defines versioned records and validates package inputs and evidence |
| `src/core/` | Normalizes runtime events and assembles complete generations |
| `src/doctor/` | Checks route compatibility before activation |
| `src/evaluation/` | Builds blinded non-inferiority evidence and release reports |
| `src/fidelity/` | Protects immutable Markdown spans and rejects unsafe rewrites |
| `src/observability/` | Emits, aggregates and exports content-free telemetry |
| `src/privacy/` | Selects an eligible provider route under explicit privacy policy |
| `src/providers/` | Compiles controls, prepares provider requests and executes bounded routes |
| `src/release/` | Evaluates release evidence, publishes support claims and plans rollback |
| `src/render/` | Converts fidelity outcomes into display decisions and evidence |
| `src/runtimes/` | Maps six runtime event dialects into shared contracts and presentation tiers |
| `src/versioning/` | Applies schema compatibility policy |

---

## 4. PIPELINE

```text
runtime events
      │
      ▼
assemble complete message
      │
      ▼
protect exact Markdown spans
      │
      ▼
select privacy route
      │
      ▼
rewrite through provider adapter
      │
      ▼
validate fidelity
      │
      ▼
render projection or exact original
```

Every rejection, timeout, incompatible capability or failed fidelity check returns the exact original path.

---

## 5. PUBLIC ENTRYPOINTS

| Import | Main surface |
|---|---|
| `@portable-cli/communication-projection` | Contracts, context, core, fidelity, observability, render and versioning exports |
| `@portable-cli/communication-projection/contracts` | Contract constants, validators and record types |
| `@portable-cli/communication-projection/doctor` | `runCompatibilityDoctor` and individual checks |
| `@portable-cli/communication-projection/evaluation` | Blinding, power, gate and report APIs |
| `@portable-cli/communication-projection/observability` | Content-free telemetry APIs |
| `@portable-cli/communication-projection/privacy` | `selectPrivacyRoute` and route types |
| `@portable-cli/communication-projection/providers` | Provider adapters, registry, presets and executor |
| `@portable-cli/communication-projection/release` | Support matrix, release gate and rollback APIs |
| `@portable-cli/communication-projection/runtimes` | Runtime adapters and capability matrix |
| `@portable-cli/communication-projection/versioning` | Schema compatibility APIs |

---

## 6. VALIDATION

Run from this package directory.

```bash
npm run check
```

Expected result: type checking, build, all Vitest suites and the public import smoke test pass.

---

## 7. RELATED

- [Install](./docs/install.md)
- [Configuration](./docs/configuration.md)
- [Privacy modes](./docs/privacy.md)
- [Release runbook](./docs/runbook.md)
- [Support matrix](./docs/support-matrix.md)
- [Rollback](./docs/rollback.md)
