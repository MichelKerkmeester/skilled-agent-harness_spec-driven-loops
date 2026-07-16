# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 18
Questions: 0/10 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: Establish the internal baseline — locate the Memory MCP modules implementing (a) 5-channel RRF fusion, (b) save/index path, (c) recall rendering/serialization, (d) causal graph + decay; anchor Q1/Q2 against aionforge docs/retrieval.md.

Research Topic: Mine aionforge + galadriel for Spec-Kit Memory MCP improvements (query-class routing, edge-based bi-temporal currentness, idempotent async consolidation, rank-time decay, cache-friendly recall serialization).
Iteration: 1 of 18
Focus Area: Internal baseline map + first candidate hypotheses (Q1, Q2).
Remaining Key Questions: Q1–Q10 (see strategy.md §3).
Last 3 Iterations Summary: none yet.

## STATE FILES (paths relative to repo root)

- Config: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/research/deep-research-config.json
- State Log: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/research/deep-research-strategy.md
- Registry: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/029-memory-search-intelligence/001-speckit-memory/research/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard.
- Report findings only; implementation is a separate follow-up step.
- Include an optional `graphEvents` array in the JSONL record (coverage nodes/edges discovered).

## OUTPUT CONTRACT (3 artifacts — all mandatory)

1. Iteration narrative at `research/iterations/iteration-001.md` with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.
2. Append exactly ONE canonical record to the state log: `{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|thought>","focus":"<...>","graphEvents":[...]}` (single line, `type` MUST be `iteration`).
3. Per-iteration delta file `research/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record plus per-event records (finding/observation/edge/ruled_out).
