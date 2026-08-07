# Iteration 3: orchestrate.md Deep-Route Judgment-Dependence Confirmed

**Focus track:** foundation | **Status:** complete

## Focus
Confirm and bound the judgment-dependence in orchestrate.md: where must GPT self-derive the deep route, and what is the smallest table-lookup gap.

## Findings
- **orchestrate.md Agent Selection (Priority Order) lists @deep-research at priority 2 and @ai-council at priority 3, but does NOT list @deep-context or @deep-review as rows — so a deep-context/deep-review request has no matching row and GPT must infer the agent from prose/general routing.** [SOURCE: orchestrate.md:95-105]
- **The Deep Route field is template-filled ("for deep routes only") with mode/target_agent/execution chosen by the orchestrator after decomposition — it is not resolved from a table the way deep.md resolves from mode-registry.json.** [SOURCE: orchestrate.md:206-207]
- **orchestrate.md is mode:primary AND the default @orchestrate entry point for complex requests; deep.md is mode:primary but only the /deep:* entry. So a user typing "run a deep review" to @orchestrate exercises the judgment path, not the table path.** [SOURCE: orchestrate.md:1-4; deep.md:1-4]
- **Smallest table-lookup gap: orchestrate lacks a resolved deep-mode dispatch table mirroring mode-registry.json the way deep.md:34-46 does.** [SOURCE: orchestrate.md:95-105 vs deep.md:34-46]

## Sources Consulted
- orchestrate.md:1-4,95-105,206-207
- deep.md:1-4,34-46

## Assessment
- **newInfoRatio:** 0.55
- **Novelty justification:** Pinpoints the missing deep-context/deep-review rows as the concrete judgment gap; ties the symptom to a specific table defect.
- **Confidence:** 0.88
- **Key questions considered:** KQ2, KQ4
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Side-by-side table comparison isolates exactly what orchestrate lacks vs deep.md.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ1: read the cli-opencode self-invocation guard to specify the external smoke environment.
