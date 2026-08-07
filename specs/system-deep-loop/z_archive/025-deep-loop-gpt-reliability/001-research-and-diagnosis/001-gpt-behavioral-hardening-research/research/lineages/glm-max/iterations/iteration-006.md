# Iteration 6: Operator Symptom -> Mechanism Mapping (KQ2)

**Focus track:** mechanism | **Status:** complete

## Focus
Map each operator symptom (slow orchestrate, wrong sub-agent, stuck flows, overthinking) to a concrete mechanism, distinguishing mis-routing from latency/UX.

## Findings
- **Symptom "wrong sub-agent invoked" -> mis-routing (modes A/B/C class): orchestrate lacks deep-context/deep-review rows (orchestrate.md:95-105), so GPT infers; with soft identity (subagent_type:general) a wrong inference is not corrected at runtime.** [SOURCE: orchestrate.md:95-105,162; ../001/research.md §1]
- **Symptom "stuck on pre-defined flows" -> likely the command-owned YAML state machine (e.g., deep-loop convergence/anti-convergence guards) interacting with GPT literalism: GPT treats soft advisory steps as hard gates and halts.** [SOURCE: research-prompt.md:21; orchestrate.md:42 (single-hop hard block), AGENTS.md Gate discipline]
- **Symptom "overthinks / needs literal deterministic instructions" -> the judgment-dependent Deep Route field (orchestrate.md:207) plus free-text Priority table that omits 2 of 4 deep modes forces GPT into inference it handles poorly.** [SOURCE: orchestrate.md:95-105,207; goal-prompt.md OBSERVED SYMPTOMS]
- **Symptom "slow as @orchestrate" -> primarily role-resolution overhead (native dispatch names agent but backs it with subagent_type:general; CLI OpenCode has no agent flag, passes positional message), NOT prompt size.** [SOURCE: ../001/research.md §3.1 (latency root-cause confirmed); orchestrate.md:162]
- **Classification: the symptom set is a MIX — 2 symptoms are mis-routing (A/B/C class, unchanged by 002-004 because orchestrate rows are still incomplete), 1 is GPT-vs-command-state-machine interaction (a NEW mode, call it D), and 1 is latency distinct from mis-routing.** [SOURCE: synthesis of orchestrate.md:95-105 + ../001/research.md §3.1]

## Sources Consulted
- orchestrate.md:95-105,162,207
- ../001-deep-agent-router-and-orchestration/research/research.md §1,§3.1
- research-prompt.md:21
- goal-prompt.md OBSERVED SYMPTOMS

## Assessment
- **newInfoRatio:** 0.58
- **Novelty justification:** Introduces a NEW mis-behavior class (mode D: GPT-vs-state-machine literalism) distinct from the A/B/C mis-route taxonomy, and cleanly separates latency from routing.
- **Confidence:** 0.82
- **Key questions considered:** KQ2
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Per-symptom mechanism mapping avoids conflating latency with routing.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Deepen KQ2 mode-D: what specifically about command-owned flows makes GPT stick that Claude handles?
