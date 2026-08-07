Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## State

Segment: 1 | Iteration: 4 of 5
Questions: 3/5 answered | Last focus: Plan gating, MCP/API separation, and rate limits
Last ratios: 1.00 -> 0.93 -> 0.88 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Local integration architecture. Derive the exact `.utcp_config.json` manual, the OAuth bridge/runtime prerequisites, Code Mode discovery and invocation rules, read-only packet boundaries, and mandatory `sk-design` judgment pairing from local contracts plus authoritative transport sources.

## Constraints

- Leaf-only; no sub-dispatch.
- State-first load completed; previous prompt marker scan found no incompatible mode switch.
- Do not edit `.utcp_config.json`, hub files, or future-phase packets.
- Do not authenticate to Mobbin or expose locally stored OAuth material.
- Write only the iteration narrative, canonical state append, matching delta, and reducer-owned lineage artifacts inside the `sol` packet.
- Treat convergence as telemetry and continue through iteration 5.
