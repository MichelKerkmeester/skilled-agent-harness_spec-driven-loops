---
title: Communication Projection Package Map
description: Maps a communication-projection request to the correct subsystem of the cli-communication-projection package, with the public entry points and the load-bearing invariants each subsystem upholds.
trigger_phrases:
  - "communication projection package map"
  - "projection subsystem routing"
  - "which module rewrites cli output"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Communication Projection Package Map

Deep-dive routing for `packages/cli-communication-projection/`. Read `src/<subsystem>/index.ts` for the exact public surface before integrating.

---

## 1. OVERVIEW

This reference maps a communication-projection request to the correct subsystem of the `cli-communication-projection` package, names the public entry points, and states the invariant each subsystem upholds. Use it after the `SKILL.md` routing table when you need the exact module and path.

---

## 2. SUBSYSTEM MAP

| Request | Subsystem | Public entry points |
|---------|-----------|---------------------|
| Assemble a whole message, bound context, versioned prompt profile | `src/core/`, `src/context/`, `src/contracts/` | `MessageAssembler`, `selectBoundedContext`, `validateContract` |
| Preserve protected spans, validate meaning, decide how to display | `src/fidelity/`, `src/render/` | `protectMarkdown`, `restoreProtectedSpans`, `validateProjectionCandidate`, `decideRender` |
| Pick a local vs hosted model under privacy rules | `src/privacy/`, `src/providers/` | `selectPrivacyRoute`, `executeProviderRoute` |
| Wire a CLI adapter or its display | `src/runtimes/`, `src/clients/` | the runtime adapters' `adapt` / `present`; client display and sidecar |
| Score quality or aggregate private telemetry | `src/evaluation/`, `src/observability/` | `evaluateReleaseGate`, `createReleaseReport`, content-free aggregation |
| Check compatibility, gate a release, or roll back | `src/doctor/`, `src/release/` | `runCompatibilityDoctor`, `evaluateReleaseReadiness`, `planRollback` |

---

## 3. THE PIPELINE

```text
canonical event/transcript ──> unchanged persistence + model context
                          └──> assemble ──> protect spans ──> privacy route
                               ──> provider rewrite ──> fidelity validate
                               ──> render: atomic replace | append | sidecar | original-only
```

---

## 4. INVARIANTS EACH SUBSYSTEM UPHOLDS

- **core / fidelity / render**: the canonical original is never mutated; a rejected candidate returns exact-original bytes.
- **privacy / providers**: classification and consent run before ranking; no silent local-to-hosted egress; credentials are references, never values.
- **runtimes / clients**: every path declares full-projection or safe-native; safe-native never suppresses the original before a validated replacement exists.
- **evaluation / observability**: telemetry is content-free with rotating keyed digests; a release needs a human-certified non-inferiority result, never a provisional one.
- **doctor / release**: unknown or stale facts fail closed to original-only; the release gate blocks until every evidence lane passes.

---

## 5. VERIFICATION

Run the package gate from `packages/cli-communication-projection/`: `npm run check` (typecheck, build, tests, import smoke). Test files run serially so latency benchmarks measure without contention.
