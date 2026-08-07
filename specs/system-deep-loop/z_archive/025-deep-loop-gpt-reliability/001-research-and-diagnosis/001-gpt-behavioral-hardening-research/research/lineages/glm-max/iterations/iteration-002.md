# Iteration 2: deep.md Literal-Safe Pattern Deep Read (KQ7 seed)

**Focus track:** foundation | **Status:** complete

## Focus
Extract precisely WHY deep.md is more literal-model-safe than orchestrate: enumerate the determinism properties so the pattern can be generalized (KQ7) and contrasted against orchestrate (KQ4).

## Findings
- **deep.md determinism rests on four properties: (1) registry is the single source of truth and the route table is explicitly marked non-authoritative review aid; (2) classification order is fixed (explicit command -> explicit workflowMode= -> unambiguous advisor -> else ONE clarification question); (3) every dispatch carries a structured Deep Route header with pre-resolved fields; (4) five hard boundaries forbid leaf absorption, injected-prose redispatch, state advance without canonical artifact, multi-hop, and false identity claims.** [SOURCE: deep.md:26,34-46,51-59,63-79,83-98]
- **The single judgment call in deep.md is bounded: "If still ambiguous, ask one concise clarification question" — a closed-form escape hatch, not open inference.** [SOURCE: deep.md:66]
- **Contrast: orchestrate.md Deep Route is a fill-in field "[for deep routes only: mode=<workflowMode>; target_agent=@<agent>; execution=<...>]" that the orchestrator must construct from decomposition reasoning, with no bounded escape hatch for deep-mode ambiguity.** [SOURCE: orchestrate.md:207]
- **Generalizable literal-safe pattern = deterministic table lookup + single bounded clarification gate + structured pre-resolved dispatch header + hard boundaries that forbid the mis-invocation signals.** [SOURCE: deep.md:34-98 (synthesis)]

## Sources Consulted
- deep.md
- orchestrate.md:95-105,207
- ../001-deep-agent-router-and-orchestration/research/research.md §1,§2

## Assessment
- **newInfoRatio:** 0.62
- **Novelty justification:** Extracts the generalizable determinism pattern as a reusable unit, not just a per-file observation; new contrast with orchestrate escape-hatch absence.
- **Confidence:** 0.90
- **Key questions considered:** KQ4, KQ7
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Decomposing deep.md into four determinism properties makes the pattern transferable.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Confirm the orchestrate Deep Route judgment-dependence by reading its full routing/decomposition section and the Agent Selection gaps.
