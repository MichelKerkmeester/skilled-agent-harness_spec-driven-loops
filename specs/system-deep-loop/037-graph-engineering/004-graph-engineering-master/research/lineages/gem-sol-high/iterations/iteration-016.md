# Iteration 16: P6 Task-Graph Failure-Mode Audit

## Focus
Identify genuinely missing operational doctrine after studies 1–3.

## Actions Taken
Compared GEM task rules and corpus failure warnings with settled scheduler/gate/effect contracts.

## Findings
1. **[TEXT-CLAIMED][CONFIRM]** Fake-edge deletion, genuinely independent fan-out, separate verifiers, one owned merge, consequence-local human gates, bounded rounds, one writer per file, written routing, and spawn caps all support the existing design. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/task-graphs.md:23-75]
2. **[TEXT-CLAIMED][EXTEND operational tests]** False independence includes shared files, workspaces, rate limits, credentials, budgets, or mutable services even when data dependencies look disjoint. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:165-179]
3. **[TEXT-CLAIMED][EXTEND operational tests]** Hierarchical fan-in prevents context collapse; merge nodes must compare received inputs with expected branch cardinality so silent leaf loss cannot masquerade as completeness. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:213-235]
4. **[TEXT-CLAIMED][REFINE scheduling]** Use a barrier only when a stage needs the complete prior set; otherwise per-item pipelines avoid slowest-node idle time. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:196-212]
5. **[INFERENCE: these are failure-test families, not new authority mechanisms]** Add shared-resource independence checks, expected-fan-in closure, hierarchical reduction budgets, and barrier-necessity evidence to parity/mutant coverage; 036 ownership remains unchanged.

## Questions Answered
- P6 reveals four practical completeness extensions but no new authority-plane primitive.

## Questions Remaining
- Cross-check against corpus claims about loops, harnesses, and organizational graphs.

## Ruled Out
- Treating prompt independence as resource independence; partial fan-in as success.

## Edge Cases
- Partial success may be valid only when the join contract explicitly declares a quorum or optional branch.

## Sources Consulted
- GEM task graphs and task-graph failure blogs.

## Assessment
- New information ratio: 0.23
- Status: complete

## Reflection
Study 4 adds high-value negative tests rather than reopening scheduler architecture.

## Recommended Next Focus
P6 cross-layer and organization-graph audit.
