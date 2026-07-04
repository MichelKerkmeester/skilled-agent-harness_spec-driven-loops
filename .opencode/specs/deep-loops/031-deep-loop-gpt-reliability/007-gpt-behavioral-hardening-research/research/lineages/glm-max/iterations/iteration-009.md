# Iteration 9: ai-council Subagent-Only: Direct-Invocation Breakage Analysis (KQ3)

**Focus track:** council | **Status:** complete

## Focus
Enumerate the direct-invocation use cases that ai-council's mode:all currently supports and what breaks if it converts to subagent-only.

## Findings
- **ai-council mode:all means it is directly invocable by the user at depth 0 AND dispatchable as a LEAF at depth 1. The file documents adaptive dispatch: depth 0 uses parallel Task seats; depth 1 uses sequential_thinking inline.** [SOURCE: ai-council.md:4,53-60]
- **Breakage under subagent-only conversion: (1) /deep:ai-council direct command loses its depth-0 parallel-seat path and degrades to inline sequential only; (2) operator-invoked council for quick planning must route through @orchestrate or @deep, adding a hop and the role-resolution latency from KQ2; (3) the council's depth-aware behavior (the thing that makes it useful at depth 0) is lost.** [SOURCE: ai-council.md:36-60; deep.md:45 (council referenced, not converted)]
- **The mis-invocation signal subagent-only would narrow: a GPT that wrongly self-dispatches ai-council (mode B) could no longer do so. But ai-council was NOT named in the operator symptom set, so this is preventive, not curative.** [SOURCE: research-prompt.md:21; deep.md:51-59]
- **deep.md explicitly preserves council dual-reachability: "ai-council remains directly invocable... this router references it as a deep target without converting it to subagent-only."** [SOURCE: deep.md:45]

## Sources Consulted
- ai-council.md:4,36-60
- deep.md:45,51-59
- research-prompt.md:21

## Assessment
- **newInfoRatio:** 0.62
- **Novelty justification:** Quantifies three concrete breakages (command path, latency hop, depth-awareness loss) and notes the conversion is preventive-not-curative relative to reported symptoms.
- **Confidence:** 0.85
- **Key questions considered:** KQ3
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Reading the file's own adaptive-dispatch section enumerates real breakage.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ3: design the safest migration path and the deep.md/orchestrate.md co-dependencies.
