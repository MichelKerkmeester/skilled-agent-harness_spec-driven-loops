# Iteration 9: Validate 003 Staging And Residual-Reference Exit Gates

## Focus

Check whether child 003's plan is broad and ordered enough to cover the reference migration risks found in prior iterations.

## Findings

- Child 003 requires grep-before/after bracketing, which is necessary for migration accountability [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:67].
- The plan updates hardcoded constants before generated fields, matching the advisor risk split found in iteration 6 [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:75].
- Generated projection and command-contract regeneration are treated as explicit steps rather than manual edits [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:84].
- The plan includes advisor corpus and routing-accuracy re-baseline work, which is necessary because scoring behavior can drift after renames [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:95].
- The 11-step exit gate is the right stop condition if it is treated as blocking, not advisory [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:106].

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md`

## Assessment

- `newInfoRatio`: 0.18.
- Novelty justification: low novelty; the external migration plan already contains the right staging and exit gates, but the gates are mandatory risk controls.
- Confidence: high, because prior risk categories map cleanly to plan phases.

## Reflection

Child 003 is sufficient as written. The main risk is execution discipline: generated artifacts, corpus re-baseline, and historical-reference allowlists must not be collapsed into a single residual grep.

## Recommended Next Focus

Perform the final convergence check and rank the recommendation across 002, 003, and optional 004.
