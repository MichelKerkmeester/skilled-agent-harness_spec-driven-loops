---
title: "Generation-keyed message assembly"
description: "Builds one bounded, ordered complete-message candidate per runtime generation while retaining an exact-original fallback for every terminal failure."
trigger_phrases:
  - "Generation-keyed message assembly"
  - "complete message assembly"
  - "MessageAssembler"
  - "exact-original assembly fallback"
version: 1.0.0.0
---

# Generation-keyed message assembly (MessageAssembler)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Builds one bounded, ordered complete-message candidate per runtime generation while retaining an exact-original fallback for every terminal failure.

Callers open a generation with immutable original bytes, ingest normalized runtime events, and receive either an accepted intermediate result or a terminal assembly. The state machine never uses one attempt's buffer for another attempt and retains only bounded content-free tombstones to ignore late events.

---

## 2. HOW IT WORKS

`startGeneration` validates the generation key and exact original, refuses duplicate or already-terminal generations, and terminates immediately when the configured retry limit is exceeded. `ingestEvent` verifies that event identity and canonical payload references match the active generation, normalizes ordering data, treats byte-identical duplicate events as idempotent, and rejects conflicting event or source-sequence duplicates.

The assembler enforces finite event, byte, active-attempt, idle-time, and terminal-history bounds. A completed terminal event yields a complete ordered assembly; cancellation, source failure, timeout, malformed input, conflicting duplicates, or exhausted bounds produce an exact-original assembly with a typed reason code. Idle expiry is caller-driven and allocates no live timers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `packages/cli-communication-projection/src/core/assembler.ts` | Handler | Runs the generation-keyed bounded assembly state machine. |
| `packages/cli-communication-projection/src/core/normalizer.ts` | Shared | Normalizes events and derives deterministic sequence digests. |
| `packages/cli-communication-projection/src/core/assembly-output.ts` | Shared | Builds completed and exact-original terminal results. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `packages/cli-communication-projection/test/core/assembler.test.ts` | Unit | Covers lifecycle, ordering, idempotence, bounds, and fallback behavior. |
| `packages/cli-communication-projection/test/core/normalizer.test.ts` | Unit | Verifies normalization and deterministic ordering digests. |
| `packages/cli-communication-projection/test/core/performance.test.ts` | Benchmark | Exercises bounded assembly latency and throughput behavior. |

---

## 4. SOURCE METADATA

- Group: Assembly And Context
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `assembly-and-context/generation-keyed-message-assembly.md`

Related references:
- [bounded-context-selection.md](bounded-context-selection.md) — Request-scoped context selection for assembled messages
