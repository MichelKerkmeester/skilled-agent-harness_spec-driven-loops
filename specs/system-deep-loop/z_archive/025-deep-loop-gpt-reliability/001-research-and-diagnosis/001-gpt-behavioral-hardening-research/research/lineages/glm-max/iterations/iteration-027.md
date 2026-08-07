# Iteration 27: Recommendation Dependency & Ordering Analysis

**Focus track:** synthesis | **Status:** thought

## Focus
Analyze dependencies and a safe implementation ordering across all KQ recommendations to feed the phase breakdown (analytical-only, no new evidence).

## Findings
- **Dependency graph: KQ1 (external smoke) is a prerequisite for KQ6 (benchmark) and the KQ9 gate. KQ4 (orchestrate delegation) + KQ5 (plugin) are independent of each other and of KQ1. KQ3 (council header) and KQ7/KQ8 (pattern propagation) depend on KQ4's canonical header template (deep.md).** [SOURCE: iter 5,12,14,16,18,20,23]
- **Safe ordering: (1) KQ4 orchestrate delegation + KQ7/KQ8 header propagation (prompt-layer, low blast radius) -> (2) KQ5 plugin (detection-layer) -> (3) KQ1 external smoke as baseline -> (4) KQ6 benchmark as regression gate -> (5) KQ9 gate decision. This front-loads reversible/low-blast work and defers the irreversible (FIX-5) decision to last.** [SOURCE: iter 12,14,16,23,24]
- **KQ3 (council route-proof header) folds into step 1 as one of the header propagations (KQ8 path), not a separate phase — it is additive and low-risk.** [SOURCE: iter 10,11,20]
- **Critical path to the FIX-5 decision = steps 1-4; all are PR-sized except possibly the plugin. So the decision can be reached in a small number of phases, consistent with the phase breakdown (numbering from 007).** [SOURCE: this iteration; ../001/research.md §8b (only FIX-5 is non-PR-sized)]

## Sources Consulted
- iter 5,10,11,12,14,16,18,20,23,24
- ../001-deep-agent-router-and-orchestration/research/research.md §8b

## Assessment
- **newInfoRatio:** 0.25
- **Novelty justification:** Produces a 5-step dependency-ordered critical path with the irreversible decision correctly last; analytical consolidation, no new sources.
- **Confidence:** 0.82
- **Key questions considered:** KQ1, KQ3, KQ4, KQ5, KQ6, KQ7, KQ8, KQ9
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Dependency analysis converts 9 KQ answers into a buildable sequence.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Broaden angle: cross-runtime mirror parity (Claude/Codex) impact on the recommendations.
