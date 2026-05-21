DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 18 of 20 (SEQUENCING)

## STATE

state_summary: Iter 18 of 20. Audit/adversarial passes 13-17 completed. Now: sequence the 12 follow-on packets into an optimal execution order with explicit dependency graph.

Iteration: 18 of 20

Focus Area: **SEQUENCING — Dependency graph for 12 follow-on packets.** Produce: (a) explicit dependency arrows between packets (e.g. 012-rq5-cross-cutting → 002-cli-devin-context-budget; 010-cli-opencode-permissions-matrix can run independently); (b) recommended execution order (linear waterfall vs parallel batches); (c) critical-path identification (which packet's delay blocks the most downstream work); (d) per-batch ordering rationale (why batch X runs before batch Y).

Also incorporate iter 14's HYBRID-with-Anchor verdict: does a NEW 013-sk-small-model-sentinel packet sit at the front of the dependency graph (everything else depends on it), or at the end (it's a thin wrapper that needs the distributed patterns to exist first)?

Also incorporate iter 16's implementability + iter 17's risk audit: any "spike packet" prerequisites? Any packets that should ship as a single atomic batch to avoid intermediate broken states?

Last 3 Iterations:
- iter 15: priority audit (0.18)
- iter 16: implementability (0.15)
- iter 17: risk audit

## STATE FILES

- Read: research.md §Follow-on Packets Index + per-RQ deltas, iter-014 (HYBRID-with-Anchor), iter-015 (priority audit), iter-016 (implementability table), iter-017 (risk audit)
- Write iteration narrative: `.../research/iterations/iteration-018.md`
- Write delta: `.../research/deltas/iter-018.jsonl`

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. 3-5 actions.
- Output should be actionable: a maintainer reading iter-018.md should know exactly which packet to ship first, second, etc.

## SOURCE BOUNDARIES

- Primary: research.md + iters 14-17 audit/adversarial outputs
- Cross-ref: spec.md §6 RISKS & DEPENDENCIES + Phase Documentation Map

## OUTPUT CONTRACT

1. **iteration-018.md** — Sequencing artifact:
   - Dependency graph (ASCII art OR table of {from, to, reason} edges)
   - Recommended execution order (waterfall list OR batched parallel groups)
   - Critical path identification (single longest dependency chain)
   - Per-batch ordering rationale

2. **state.jsonl APPEND**: `{"type":"iteration","iteration":18,"newInfoRatio":<0..1>,"status":"insight","focus":"Sequencing — dependency graph + execution order","graphEvents":[]}`. Ratio 0.10-0.20.

3. **deltas/iter-018.jsonl**: one iter record + one finding per material sequencing constraint.

## EXECUTION

1. Pre-plan (3 steps):
   a. Read research.md §Follow-on Packets Index + iters 14-17 audits.
   b. Identify dependency edges (X needs Y first) + parallelizable batches.
   c. Author dependency graph + execution order + critical path + rationale.
2. Execute. Stop after step c.
3. Append JSONL + delta.
