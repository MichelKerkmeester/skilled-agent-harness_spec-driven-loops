# Iteration 17: P6 Cross-Layer and Organization Audit

## Focus
Check whether graph topology is being asked to solve harness, loop, governance, or truth defects.

## Actions Taken
Triangulated the roadmap, organization, harness/loop/graph, evaluator, and self-correction posts.

## Findings
1. **[TEXT-CLAIMED][CONFIRM]** Harness, loop, and graph own different failures; a graph cannot repair broken state, misleading tools, permissions, or unbounded retries. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:90-116]
2. **[TEXT-CLAIMED][CONFIRM]** Organizational graphs are stable policy/role topology, while per-task work graphs may split and merge dynamically; GEM's compact task chapter does not replace this distinction. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:112-183]
3. **[TEXT-CLAIMED][EXTEND tests]** Evaluators require versioned schemas, permanent regression cases from failures, and gates that control edges rather than post-hoc dashboards. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:46-54] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:91-130]
4. **[TEXT-CLAIMED][CONFIRM]** Self-correcting loops need structured handoffs, explicit failure routes, hard stop/escalation, and deliberate failure tests before unattended use. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:35-35] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:77-123]
5. **[INFERENCE: studies 1–3 already own these mechanisms]** Study 4 contributes doctrine, operator tests, and rollout evidence—not replacement IR, gate, effect, budget, replay, or authority contracts.

## Questions Answered
- P6 completeness is satisfied once operational mutant families are added; no architectural contradiction remains.

## Questions Remaining
- P7 integrated staged rollout.

## Ruled Out
- Graphs as universal reliability abstraction; generated work graphs as organization policy.

## Edge Cases
- A graph may expose a harness defect without owning its repair.

## Sources Consulted
- Five task/loop/eval corpus posts cited above.

## Assessment
- New information ratio: 0.19
- Status: complete

## Reflection
The cross-layer diagnosis sharply limits graph-engineering scope and prevents architecture theater.

## Recommended Next Focus
P7 curriculum and staged rollout.
