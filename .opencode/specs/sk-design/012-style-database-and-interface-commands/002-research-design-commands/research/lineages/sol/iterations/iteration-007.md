# Iteration 7: Shared Creation Template Contract

## Focus
Define one concrete shared template before specializing five commands.

## Actions Taken
1. Read the hub manager-intake and visible-plan contracts.
2. Read the context manifest and proof gates.
3. Read the shared `sk-code` handoff envelope.

## Findings
1. The command template must reuse, not restate, the hub's five intake groups: goal, surface, inputs, constraints, and proof expectations. Intake must visibly precede route selection. [SOURCE: .opencode/skills/sk-design/SKILL.md:44-57]
2. Every command should instantiate this nine-stage skeleton: `1 Creative Contract; 2 Resolve Brief; 3 Context Manifest; 4 Ground One Exemplar; 5 Route/Load Mode; 6 Show Plan; 7 Execute Mode/Optional Transport; 8 Critique + Proof; 9 Deliver + Handoff`. [INFERENCE: combines external patterns with local contracts]
3. The shared grounding record should contain `source identity`, `source type`, `why relevant`, `provenance/rights`, `preserve`, `transform`, `reject`, and `counterfactual default changed`. No match is a valid result; references never select the mode or prove quality. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:200-206]
4. The visible output contract should always include six blocks: `Design Read`, `Resolved Brief`, `Grounding Record`, `Creation Plan`, `Mode Artifact`, and `Proof + Handoff`. Audit relabels Design Read as Audit Read; design-reference relabels Mode Artifact as extraction output, but shape stays stable. [INFERENCE: consistency rule]
5. Proof is mode-owned and claim-gated. Context loaded, register/dials, contrast, preflight, interaction states, audit evidence, and decision rationale apply only when triggered; a generic command-level “verified” boolean is unsafe. [SOURCE: .opencode/skills/sk-design/shared/context-loading-contract.md:44-71] [SOURCE: .opencode/skills/sk-design/shared/context-loading-contract.md:266-279]
6. Handoff uses the existing exact envelope (`WHAT`, `LOCKED VALUES`, `SIGNATURE MOVES`, `REUSE LIST`, `STACK BOUNDARY`, `OPEN RISKS/VERIFICATION`, `NEVER-CHANGE`) and occurs only after acceptance. [SOURCE: .opencode/skills/sk-design/shared/sk-code-handoff.md:32-45] [SOURCE: .opencode/skills/sk-design/shared/sk-code-handoff.md:93-100]

## Questions Answered
- Shared stage, grounding, output, proof, and handoff contract.

## Questions Remaining
- Five command-specific field and stage specializations.

## Ruled Out
- Duplicating mode doctrine in a shared command template.
- A command-level universal `verified=true` result.
- Failing when exemplar retrieval returns no fit.

## Assessment
- New information ratio: 0.68
- Novelty justification: The nine-stage skeleton and six-block output contract are new synthesis, while proof/handoff reuse existing contracts.

## Reflection
- What worked: local contracts already provide most invariant fields.
- What failed: a single flat prompt body would blur conditional proof lanes.
- Next adjustment: specialize the interface-design command first as the broadest creation case.

## Recommended Next Focus
Write the concrete `/interface:design` prompt template, including thin-brief assumptions, exemplar grounding, design plan, mode delegation, optional build transport, preflight, and handoff.
