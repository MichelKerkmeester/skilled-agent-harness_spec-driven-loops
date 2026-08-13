---
title: "Six-runtime adapter matrix"
description: "Maps Claude, Codex, Pi, OpenCode, Devin, and Cursor events into shared contracts and enforces version-pinned full-projection or safe-native presentation tiers."
trigger_phrases:
  - "Six-runtime adapter matrix"
  - "communication projection runtime adapters"
  - "RuntimeCapabilityMatrix"
  - "full-projection safe-native tiers"
version: 1.0.0.0
---

# Six-runtime adapter matrix (RuntimeCapabilityMatrix)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Maps Claude, Codex, Pi, OpenCode, Devin, and Cursor events into shared contracts and enforces version-pinned full-projection or safe-native presentation tiers.

The package publishes one adapter contract and version-pinned capability records for every supported path. Consumers can resolve the matrix before presentation and receive original-only behavior whenever runtime or protocol compatibility cannot be proven.

---

## 2. HOW IT WORKS

Every adapter maps the runtime envelope to a shared generation key, validates event identity and lifecycle, points the portable event at the immutable original payload, and preserves unknown vendor metadata only under an extension namespace. The reusable conformance harness proves shared contract validity, cancellation fallback, extension retention, and zero canonical writes.

Capability records derive presentation tier from dated evidence. A path is `full-projection` only when it has a confirmed safe boundary, a complete message, and an atomic render decision; otherwise it is `safe-native` and may only use confirmed append, sidecar, or original-only degradation. Major-version mismatch always resolves to safe-native original-only. The published full-projection paths are Claude headless, Codex App Server, Pi JSON-RPC, OpenCode server/SSE stable client, Devin ACP, and Cursor ACP; Claude interactive and Pi synchronous display transformer are safe-native.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `packages/cli-communication-projection/src/runtimes/adapter.ts` | Shared | Defines mapping, presentation, and reusable conformance contracts. |
| `packages/cli-communication-projection/src/runtimes/capability.ts` | Shared | Derives tiers and applies fail-closed major-version compatibility. |
| `packages/cli-communication-projection/src/runtimes/matrix.ts` | Handler | Publishes and resolves the consolidated path capability matrix. |
| `packages/cli-communication-projection/src/runtimes/claude.ts` | Handler | Maps Claude headless and interactive paths. |
| `packages/cli-communication-projection/src/runtimes/codex.ts` | Handler | Maps the Codex App Server client path. |
| `packages/cli-communication-projection/src/runtimes/pi.ts` | Handler | Maps Pi JSON-RPC and synchronous display paths. |
| `packages/cli-communication-projection/src/runtimes/opencode.ts` | Handler | Maps the OpenCode server and SSE stable-client path. |
| `packages/cli-communication-projection/src/runtimes/devin.ts` | Handler | Maps the Devin ACP client path. |
| `packages/cli-communication-projection/src/runtimes/cursor.ts` | Handler | Maps the Cursor ACP client path. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `packages/cli-communication-projection/test/runtimes/conformance.test.ts` | Integration | Runs shared invariants across every runtime adapter. |
| `packages/cli-communication-projection/test/runtimes/matrix.test.ts` | Unit | Verifies capability tiers and compatibility resolution. |
| `packages/cli-communication-projection/test/runtimes/smoke.test.ts` | Integration | Exercises the supported runtime paths end to end with fixtures. |
| `packages/cli-communication-projection/test/contracts/runtime-fixtures.test.ts` | Fixture | Validates runtime fixture metadata and portable event mappings. |

---

## 4. SOURCE METADATA

- Group: Runtime Adapters
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runtime-adapters/six-runtime-adapter-matrix.md`

Related references:
- [../fidelity-and-render/capability-aware-presentation.md](../fidelity-and-render/capability-aware-presentation.md) — Client presentation modes selected from runtime capability
- [../packaging-and-release/compatibility-doctor.md](../packaging-and-release/compatibility-doctor.md) — Operator checks for proposed runtime paths
