# Iteration 026 — NEW: reduce-state.cjs Ownership Fragmentation (4 Separate Reducers)

**Focus:** How many reduce-state.cjs instances exist, and do they share registry-disposition logic?
**Angle:** Subsystem audit of the reducer layer.

## Findings

There are **4 SEPARATE reduce-state.cjs files**, one per mode:
- `deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
- `deep-loop-workflows/deep-review/scripts/reduce-state.cjs`
- `deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs`
- `deep-loop-workflows/deep-context/scripts/reduce-state.cjs`

Each mode has its OWN reducer. This means the "strategy machine-owned sections, findings registry, dashboard" refresh logic is **implemented 4 times** with inevitable drift between them.

**Implication for the disposition gap (iter 025):** since each reducer owns its mode's registry, a cross-cutting "disposition findings fixed by a later phase" step would need to be added to ALL 4 reducers (or factored into a shared library). The 009/006 remediation child plans a one-shot backfill, but without a shared reducer hook, the gap will recur for every new mode or every divergence.

**Shared-runtime claim vs reality:** deep-loop-runtime SKILL.md claims a "shared executor + state + coverage-graph runtime." The executor and state-JSONL format ARE shared (via deep-loop-runtime/lib), but the REDUCERS are per-mode-copied, not shared. This is a DRY violation that explains why convergence math, registry schema, and disposition logic can diverge across siblings (the threshold-parity research noted in deep-research SKILL.md:37 exists precisely because each sibling reinvents convergence).

**Recommendation:** factor the registry-disposition + dashboard-refresh + convergence-shared-invariants into `deep-loop-runtime/lib/deep-loop/reducer-shared.ts`, invoked by all 4 mode reducers. This is structural design work but is the durable fix for cross-mode drift.

## Evidence
[SOURCE: find deep-loop-workflows -name "reduce-state.cjs" → 4 files]
[SOURCE: deep-research/SKILL.md:37 — cross-sibling threshold-parity research exists due to divergence]

## newInfoRatio: 0.85 (4-reducer fragmentation; explains cross-mode drift; shared-lib recommendation)
