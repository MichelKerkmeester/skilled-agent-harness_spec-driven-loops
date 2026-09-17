---
title: "deep-research-sealed-artifacts: Sealed Artifacts"
description: "Deep Research sealed-artifacts layer for the durable runtime event spine."
trigger_phrases:
  - "deep-research-sealed-artifacts"
  - "deep research sealed-artifacts"
---

# Deep Research Sealed Artifacts

---

## 1. OVERVIEW

This folder materializes canonical, sealed artifacts from lane evidence for the Deep Research runtime lane. It keeps lane-specific contracts beside the shared ledger, event-envelope and replay primitives, then publishes the supported surface through the public barrel.

Callers should use the exported API in `index.ts`. Filesystem, ledger and workflow policy remain owned by the shared runtime services.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `deep-research-artifact-set.ts` | Canonical lifecycle ordering, shared evidence binding and replay verification. |
| `deep-research-artifact-material.ts` | Canonical materialization of lane artifact content. |
| `deep-research-sealed-artifact-types.ts` | Sealed artifact kinds, envelopes and storage contract types. |
| `deep-research-sealed-artifacts.ts` | Sealing, parsing, storage and verification helpers. |
| `index.ts` | Public barrel for artifact construction, sealing and parsing. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Public API | `index.ts` |
| Primary implementation | `deep-research-sealed-artifacts.ts` |

The barrel re-exports the lane's supported types, constants, parsers and runtime helpers. Complete run sets retain the shared reference-set digest as their only content identity, reject missing or reordered lifecycle kinds, and re-resolve every artifact plus its authorized creation evidence before replay. Direct imports from implementation files bypass the lane contract and should remain limited to internal composition and focused tests.

---

## 4. SPINE ROLE

This module creates the immutable artifact boundary consumed by certificates and recovery. The shared authorized ledger owns append authorization, event-envelope owns common event shape, replay-fingerprint binds deterministic replay and sealed-reference-artifacts owns the cross-lane artifact boundary.

The durable flow is:

```text
event envelope -> lane ledger schema -> lane reducer -> sealed artifact -> certificate -> resume evidence -> parity or rollback decision
```

This folder owns the sealed artifacts step for Deep Research. It does not replace the shared substrate or decide consumer-facing workflow policy.

---

## 5. VALIDATION

Run the runtime typecheck from the repository root. The lane-specific unit suite, when present, uses the same runtime Vitest configuration.

```bash
.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json
```

Expected result: exit code 0 with no TypeScript diagnostics.

---

## 6. RELATED

- [Runtime library map](../README.md)
- [Runtime unit tests](../../tests/unit/README.md)
- [Shared event envelope](../event-envelope/README.md)
- [Shared replay fingerprint](../replay-fingerprint/README.md)
