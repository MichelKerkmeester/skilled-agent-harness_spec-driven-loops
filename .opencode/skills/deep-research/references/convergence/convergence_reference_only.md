---
title: Convergence Reference-Only Models
description: Future or non-executable convergence concepts retained outside the live deep-research stop contract.
trigger_phrases:
  - "convergence reference only models"
  - "research segment model"
  - "research dead-end coverage"
  - "semantic convergence signals"
  - "optimizer managed convergence fields"
importance_tier: normal
contextType: planning
---

# Convergence Reference-Only Models

This file keeps design material that is useful for future work but not part of the live `/deep:start-research-loop` executable contract.

---

## 1. OVERVIEW

### Purpose

Preserve useful convergence concepts that are not part of the live `/deep:start-research-loop` executable contract.

### When to Use

Load this file only for design archaeology, future optimization work, or explaining why a drafted signal is not currently executable.

### Core Principle

Reference-only models cannot affect runtime STOP decisions unless the YAML workflow, reducer, and live convergence references are updated in the same packet.

Live stop behavior belongs in `convergence.md`, `convergence_signals.md`, `convergence_recovery.md`, and `convergence_graph.md`.

---

## 2. SEGMENT MODEL

The live workflow uses a single segment by default. Earlier designs allowed `state.iterations` to be filtered by an active segment before convergence. That remains reference-only.

Reference shape:

```json
{"type":"iteration","run":3,"segment":1,"status":"complete","newInfoRatio":0.4}
```

If segment support is revived, convergence must define how segment-local stops interact with whole-packet legal-stop gates.

---

## 3. DEAD-END COVERAGE

Dead-end coverage tracks validated and eliminated approaches:

```text
deadEndCoverage = (validated + eliminated) / totalIdentifiedApproaches
```

This can help future loops distinguish "we are stuck" from "we have systematically eliminated the plausible space." It is not a live STOP signal today.

---

## 4. SEMANTIC CONVERGENCE SIGNALS

Semantic convergence signals were drafted as legal-stop supplements:

| Signal | Reference Rule |
|--------|----------------|
| `semanticNovelty` | Lower values suggest fewer new concepts |
| `contradictionDensity` | Values above `0.25` should block STOP |
| `citationOverlap` | High repeated-source overlap may support exhaustion |

These are not active workflow signals. Do not route implementation decisions through them unless the YAML workflow and reducer are updated in the same packet.

---

## 5. OPTIMIZER-MANAGED FIELDS

The offline loop optimizer may propose advisory changes to:

| Field | Default | Range |
|-------|---------|-------|
| `convergenceThreshold` | `0.05` | `0.01-0.20` |
| `stuckThreshold` | `3` | `1-5` |
| `maxIterations` | `10` | `3-20` |

Locked fields are not optimizer-tunable:

- `stopReason` enum values and semantics;
- `legalStop` structure;
- lineage fields such as `sessionId`, `lineageMode`, and `generation`;
- reducer ownership and file protection policies.

The canonical optimizer manifest is `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json`.

---

## 6. SIBLING MODE NOTE

Review convergence belongs to `deep-review`, not this reference set. Keep sibling review algorithms, dimensions, gates, and report schemas in the `deep-review` skill.
