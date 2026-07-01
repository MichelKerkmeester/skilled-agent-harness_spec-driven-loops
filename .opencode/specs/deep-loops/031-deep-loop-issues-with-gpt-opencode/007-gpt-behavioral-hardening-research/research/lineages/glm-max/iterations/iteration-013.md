# Iteration 13: Adversarial: Delegation vs Orchestrate Authority (KQ4)

**Focus track:** orchestrate | **Status:** complete

## Focus
Adversarially test the delegation: does handing deep-dispatch to deep.md strip orchestrate of authority it needs, or create a routing seam.

## Findings
- **Orchestrate's authority that must survive: task decomposition (orchestrate.md:194-225), output evaluation/quality scoring (orchestrate.md:502-577), conflict resolution, and unified synthesis. None of these are deep-MODE resolution — delegating mode resolution to deep.md does not touch them.** [SOURCE: orchestrate.md:194-225,502-577]
- **The delegation is a mode-resolution handoff, not a control handoff: orchestrate still receives the leaf result and synthesizes (orchestrate.md:79 equivalent). deep.md returns router-level synthesis only (deep.md:79) — it does not own the orchestrator's delivery.** [SOURCE: deep.md:79; orchestrate.md:637-660]
- **Potential seam: two mode:primary agents (orchestrate + deep) could both claim a deep request. Mitigation: orchestrate's rule explicitly says "dispatch @deep and STOP" for deep modes, so only one acts. This mirrors the existing single-hop invariant (orchestrate.md:42, deep.md:56).** [SOURCE: orchestrate.md:42; deep.md:56]
- **No loss of authority confirmed; the delegation is scoped to mode resolution. Residual risk: prompt ambiguity where a request is BOTH a deep mode and general orchestration — the bounded clarification gate (deep.md:66) handles the deep side; orchestrate keeps a general clarification path.** [SOURCE: deep.md:66; orchestrate.md §1]

## Sources Consulted
- orchestrate.md:42,194-225,502-577,637-660
- deep.md:56,66,79

## Assessment
- **newInfoRatio:** 0.42
- **Novelty justification:** Confirms delegation is mode-resolution-only (not control), resolves the two-primary seam via the STOP rule, and names the dual-nature ambiguity residual.
- **Confidence:** 0.84
- **Key questions considered:** KQ4
- **Questions closed this iteration:** KQ4

## Reflection
**What worked:**
- Distinguishing mode-resolution from control handoff defends the design.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ5: sub-agent-enforcement plugin feasibility — hook-based structural enforcement.
