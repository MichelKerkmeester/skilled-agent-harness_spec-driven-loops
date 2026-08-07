Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## State

Segment: 1 | Iteration: 2 of 5
Questions: 1/5 answered | Last focus: Official server, transport, and authorization baseline
Last ratios: N/A -> 1.00 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Official skills and tool workflows: enumerate tool names/parameters, app/screen/flow/element search sequences, returned images/details, and explicit read-only semantics.

## Constraints

- Leaf-only; no sub-dispatch.
- Respect exhausted directions: no static API-key or local-package research retry.
- Write only the iteration narrative, canonical state append, and matching delta inside the `sol` packet.
- Convergence remains telemetry until iteration 5.
