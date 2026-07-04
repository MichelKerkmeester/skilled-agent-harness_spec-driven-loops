# Iteration 7: Mode D (GPT-vs-State-Machine Literalism) Deepened (KQ2)

**Focus track:** mechanism | **Status:** complete

## Focus
Characterize the new mode D: what about command-owned deep-loop flows makes GPT stick that Claude handles, and is it the soft-advisory-as-hard-gate hypothesis.

## Findings
- **Mode D mechanism hypothesis CONFIRMED at the contract surface: deep-loop commands are YAML state machines with convergence/anti-convergence guards and quality gates (e.g., blocked_stop, stuck_recovery). GPT literalism reads soft "advisory" / "optional" / "if helpful" language as mandatory and halts where Claude proceeds.** [SOURCE: deep-research/SKILL.md §4 RULES ALWAYS/NEVER; loop_protocol.md:166-180 (quality guards); AGENTS.md Gate discipline]
- **Evidence the agent-layer fix (002-004) does NOT address mode D: those phases only hardened routing/identity; no phase hardened the advisory-vs-mandatory distinction in command prose.** [SOURCE: research-prompt.md:14-19 (002-004 scope); goal-prompt.md WHAT 031 ALREADY ESTABLISHED]
- **Mode D is separable from FIX-5/host-identity: hard identity would prevent wrong-agent dispatch but would NOT fix GPT halting on an advisory step it reads as a gate.** [SOURCE: ../001/research.md §8b (hard identity scope); mode D is a prompt-prose problem]
- **Implication: KQ4/KQ7 hardening (deterministic tables) partially addresses mode D by removing the inference that triggers the stall, but a residual advisory-clarity pass on command prose is its own work item.** [SOURCE: orchestrate.md:34-37 (advisory AGENT_IO treated optional)]

## Sources Consulted
- deep-research/SKILL.md §4
- loop_protocol.md:166-180
- orchestrate.md:34-37
- ../001-deep-agent-router-and-orchestration/research/research.md §8b
- research-prompt.md:14-19

## Assessment
- **newInfoRatio:** 0.50
- **Novelty justification:** Confirms mode D as prompt-prose-driven and separable from identity/FIX-5; adds the advisory-clarity work item not present in any prior phase.
- **Confidence:** 0.80
- **Key questions considered:** KQ2
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Separating mode D from A/B/C routing clarifies the fix surface.

**What failed:**
- (none this iteration)

**Ruled out:**
- **Treating all operator symptoms as one mis-routing class**: conflates latency, routing, and state-machine literalism; fixes differ [SOURCE: this iteration]

## Recommended Next Focus
Adversarial re-check: is mode D real or an artifact of unmeasured latency? Test the hypothesis against available evidence.
