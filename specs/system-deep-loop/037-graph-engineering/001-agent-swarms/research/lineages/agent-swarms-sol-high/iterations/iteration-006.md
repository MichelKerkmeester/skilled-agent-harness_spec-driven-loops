# Iteration 6: GateVerdict as a First-Class Control Edge

## Focus

AgentSwarms can evaluate output, but the author must manually wire evaluation through a condition before it controls flow. Orientation angle 3 asks to make that control relationship structural.

## Findings

1. AgentSwarms' evaluator types are useful primitives: deterministic `contains|exact|regex` and an `llm_judge` scorecard; it validates every configured metric and recomputes the weighted overall rather than trusting the judge's claimed pass or aggregate. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/evalScoring.ts:1-48] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/evalScoring.ts:101-191]
2. Yet the runtime evaluate node only emits scorecard data. The Support Copilot template needs a separate condition node to turn that score into pass-to-output versus fail-to-approval routing. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:1809-1893] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmTemplates.ts:491-509]
3. Decision: `GateVerdictV1` is an edge payload, not arbitrary node output. Fields: `gate_id`, `subject_digest`, `rubric/reference_digest`, `deterministic_checks[]`, `judge_evidence[]`, `verdict` (`pass|fail|revise|escalate|inconclusive`), `reasons[]`, `policy_version`, `evaluator_versions`, `trajectory_digest`, `blast_radius_class`, `authorized_actions[]`, and `certificate_ref`. [INFERENCE: directly operationalizes “a verdict that does not change the run is a report”]
4. Decision: deterministic checks run first and may hard-fail; model judges operate only on residual semantic questions. No weighted average may override a deterministic hard failure. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:32-37] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:41-62]
5. Decision: each verdict enum maps in the graph definition to explicit edge actions; an unrecognized, malformed, missing, or inconclusive verdict has no default success edge and fails closed to escalation/stop. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:155-193]
6. The gate evaluates trajectory and components as well as final output, because identical artifacts reached through thrashing, repeated tools, or missing evidence have different operational risk. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:64-88]

## Ruled Out

- Free-form scorecards as routing inputs.
- Judge-provided aggregate/pass flags as authoritative.
- Dashboards that do not control edges.

## Dead Ends

An evaluate node without declared verdict edges is telemetry, not a gate.

## Edge Cases

- Ambiguous input: `revise` is distinct from `fail`; it requires a bounded correction edge and retry budget.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: certificate semantics continue in iteration 7.

## Sources Consulted

- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/evalScoring.ts:1-191]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmTemplates.ts:491-509]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:32-88]

## Assessment

- New information ratio: 0.86
- Novelty: produces a typed verdict/control-edge schema and deterministic-first ordering.
- Questions addressed/answered: q-verdicts schema and structural routing.

## Reflection

- What worked and why: separating evaluator evidence from manager action prevents report-only gates.
- What did not work and why: a single overall score hides hard failures and uncertainty.
- What I would do differently: validate verdict-edge exhaustiveness at graph compile time.

## Recommended Next Focus

Bind GateVerdict to blinded panels, counterfactuals, blast radius, and exact artifact certificates.
