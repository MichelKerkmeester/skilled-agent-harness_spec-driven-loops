---
title: "deep-loop runtime library"
description: "Core executor, state, evidence and lifecycle helpers for deep-loop runtime execution."
trigger_phrases:
  - "deep-loop runtime library"
  - "deep-loop core helpers"
---

# Deep Loop Runtime Library

---

## 1. OVERVIEW

This folder contains the core helpers shared by deep-loop runtime modes. It owns executor configuration and audit, prompt rendering, atomic state and JSONL repair, loop locking, evidence validation, artifact roots, lifecycle values, permissions checks and pivot coordination.

The public surface is composed from the files listed below. The `continuity-identity/` child supplies the identity boundary used by continuity-aware runtime paths.

---

## 2. DIRECTORY TREE

```text
deep-loop/
└── continuity-identity/
```

---

## 3. FILES

| File | Responsibility |
|---|---|
| `artifact-root.cjs` | Resolves the canonical artifact topology root. |
| `atomic-state.ts` | Writes state atomically across the runtime state boundary. |
| `bayesian-scorer.ts` | Computes convergence scores from runtime signals. |
| `continuity-thread.cjs` | Reads and writes continuity-thread compatibility data. |
| `divergent-pivot.ts` | Coordinates divergent-pivot transaction and quorum behavior. |
| `evidence-contract.ts` | Validates dispatch-boundary evidence metadata. |
| `executor-audit.ts` | Records executor provenance and dispatch failure evidence. |
| `executor-config.ts` | Parses executor configuration, kinds and sandbox mappings. |
| `fallback-router.ts` | Routes execution to the configured fallback executor. |
| `jsonl-repair.ts` | Repairs recoverable trailing corruption in state logs. |
| `leaf-artifact-writer.ts` | Publishes leaf artifacts within the allowed artifact boundary. |
| `lifecycle-taxonomy.cjs` | Defines terminal lifecycle and session outcome values. |
| `lineage-timestamp-window.ts` | Checks timestamp windows for lineage records. |
| `loop-lock.ts` | Acquires, heartbeats, reclaims and releases the single-writer loop lock. |
| `observability-events.cjs` | Creates runtime observability event records. |
| `permissions-gate.ts` | Matches permission scopes at the runtime gate. |
| `pivot-candidates.ts` | Builds and evaluates divergent-pivot candidates. |
| `post-dispatch-validate.ts` | Validates iteration markdown, JSONL and delta outputs. |
| `prompt-pack.ts` | Renders prompts and checks required variables. |
| `receipt-crypto.ts` | Derives, signs and verifies receipt keys and signatures. |
| `runtime-capabilities.cjs` | Resolves the parameterized runtime capability matrix. |
| `sleep.ts` | Provides the synchronous sleep primitive used by runtime coordination. |
| `write-containment.ts` | Checks that runtime writes stay within the allowed boundary. |

---

## 4. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Core runtime helpers | The direct files listed in the FILES table |
| Continuity identity | [`continuity-identity/README.md`](continuity-identity/README.md) |
| Domain library map | [`../README.md`](../README.md) |

Consumers should import the helper that owns the contract they need. There is no single deep-loop barrel that hides lock, evidence, executor and artifact ownership.

---

## 5. SPINE ROLE

This module is the coordination core beneath the runtime event spine. It prepares execution, protects write and lock boundaries, records evidence, repairs recoverable state and supplies the lifecycle and continuity signals consumed by reducers, recovery adapters and mode workflows.

---

## 6. VALIDATION

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

---

## 7. RELATED

- [Runtime library map](../README.md)
- [Runtime overview](../../README.md)
- [Runtime unit tests](../../tests/unit/README.md)
- [Continuity identity](continuity-identity/README.md)
