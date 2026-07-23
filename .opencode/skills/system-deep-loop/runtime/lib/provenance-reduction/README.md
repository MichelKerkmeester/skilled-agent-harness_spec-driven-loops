---
title: "Provenance Reduction: Source-Balanced Fan-In Merge"
description: "Reduces multiple fan-out candidate results into one source-balanced, replay-verifiable outcome."
---

# Provenance Reduction

---

## 1. OVERVIEW

Runtime primitives that merge multiple fan-out candidate results in `system-deep-loop` without letting one model family or source bucket dominate the merge. Identities are normalized into stable digests. The reducer combines blinded-adjudication verdicts, conditional-fanin candidates and partial-failure results into one fairly weighted outcome. A replay path re-derives that outcome from the ledger to verify it deterministically.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `identity.ts` | Normalizes repository URLs and source-bucket ids into canonical identity keys and stable digests |
| `reducer.ts` | `reduceProvenance`: combines adjudication verdicts, fan-in candidates and partial-failure results into a source-balanced outcome |
| `replay.ts` | Replays the provenance reduction ledger to verify the result deterministically |
| `types.ts` | Fleet-bucket status and reduction, identity, scheduler and ledger version and candidate contracts |
| `index.ts` | Public API barrel |

## 3. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/provenance-reduction.vitest.ts`
