---
title: "Calibration Risk Slices and Coverage Minimums"
description: "Destination-grounded risk taxonomy, structural branch coverage, and statistical certificate floors."
importance_tier: "critical"
contextType: "implementation"
---
# Calibration Risk Slices and Coverage Minimums

## 1. Slice identity

A record maps to one cell:

```text
(hubId, role, mutatesWorkspace, selectionKindFamily)
```

`role` and `mutatesWorkspace` come from the complete destination identity
context `(skillId, workflowMode, packetId, packetKind, backendKind,
runtimeDiscriminator?)`. `selectionKindFamily` is `single`, `composite`
(`orderedBundle|surfaceBundle`), or `none` for negative actions. A negative
record's context destination is conservative evidence metadata, never a route
target. The decision remains target-free (synthesis §2.2, §2.3).

The canonical identifier is
`role:(mutating|nonmutating):(single|composite|none)`. Bundles use the
highest-risk selected destination as their one cell while retaining every target
tuple in intent gold. This avoids double counting one request across cells.

## 2. Tolerance ordering

The representative records use reliability error / expected calibration error
(ECE) in integer basis points. One-bin per-cell ECE is:

```text
abs(mean(confidenceBps) - correctRateBps)
```

Tolerance is intentionally stricter as authority and mutation risk rise:

| Slice family | Maximum ECE | Rationale |
|---|---:|---|
| actor or judgment + mutating | 250 bps | A wrong automatic choice can reach an effect-bearing destination. |
| actor or judgment + non-mutating | 400 bps | Authority risk remains, but workspace mutation is absent. |
| transport + mutating | 400 bps | External effects need a narrower reliability budget. |
| transport + non-mutating | 600 bps | Transport is non-judgmental and locally read-only. |
| evidence + non-mutating | 800 bps | Evidence may inform a route but cannot commit or mutate. |
| evidence + mutating | prohibited | Evidence that mutates violates the destination contract. |

Composite selection takes the strictest participating destination tolerance.
The corpus/certificate remains evidence; passing ECE never grants COMMIT
(synthesis §2.3, §8.1, §10).

## 3. Two coverage floors

The checked-in corpora are immutable **representative shadow corpora**. Their
machine-checked structural floor is one record for every declared reachable
`(hub, riskSlice, branch)` cell, all four decision branches per multi-candidate
hub, and every positive selection kind from the synthesis complexity dial:

- `sk-code`: `single`, `surfaceBundle`;
- `system-deep-loop`: `single`;
- `mcp-tooling`: `single`, `orderedBundle` (synthesis §5.3).

The validator owns this hub topology as a frozen external table. Corpus-local
`coverageRequirements` may raise minimums but cannot erase a reachable branch:
dropping both a record and its self-declared requirement still fails the frozen
topology gate.

This floor proves contract coverage and catches missing cells; it is not enough
to estimate production calibration.

An operational certificate additionally requires at least 100 independently
labeled observations per actor/judgment mutating cell and 50 per other cell,
with every reachable branch represented. At worst-case Bernoulli variance,
`n=100` gives an approximate 95% normal half-width of 9.8 percentage points;
`n=50` gives 13.9 points. Those are screening floors, not invented safety
guarantees: a certificate may require more samples when Wilson intervals,
imbalance, drift, or rare branches make the estimate wider. Exact auto-route
thresholds remain an empirical downstream decision (synthesis §11 open-q 2).

## 4. Zero signal and N=1

Zero signal is always `defer(no-match)` with empty compatibility intents and
resources. A default resource union is not a route and may not appear in typed
negative gold (synthesis §5.2, §10).

The singleton record is data, not a code branch. It states `candidateCount=1`
and `noCalibrationSlice=true`; the generic coverage validator accepts any
explicit singleton record with that proof. The named `mcp-code-mode` fixture
therefore documents “no calibration slice — nothing to calibrate (one
candidate)” without hard-coding a skill check (synthesis §5.1).
