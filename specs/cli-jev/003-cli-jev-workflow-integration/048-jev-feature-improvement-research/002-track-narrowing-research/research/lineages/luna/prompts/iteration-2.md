# Iteration 2: Improve accuracy, cost, and measurement trust

## Focus
Follow the reducer-proposed gap about missing prompt capture. Reconcile the scorer and recorded calls to identify concrete accuracy, evaluation, cost, latency, and privacy controls for a later iteration.

## Questions
- What would make the gold labels and query distribution representative of real Gate 1 requests?
- Which parts of the current lookup, ripgrep, and Jev choice design suggest a safe accuracy or cost improvement?
- What exactly do the recorded latency and token figures include, and what can be computed from the existing call log without rerunning?

## Boundaries
Read existing sources and the recorded calls only. Do not rerun the scorer, make Jev calls, or claim measured benefits for proposed changes. Separate direct evidence from recommendations. Cite each finding with [SOURCE: file:path:line]. Convergence before iteration 3 is telemetry only.

## Route proof for the delta
mode=research; target_agent=deep-research; agent_definition_loaded=true; resolved_route=Resolved route: mode=research target_agent=deep-research
