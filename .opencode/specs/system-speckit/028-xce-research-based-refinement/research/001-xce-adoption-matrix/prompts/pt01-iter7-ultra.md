Deep-research iter 7/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (RQ7), prior iters 001-006.md.

ITER 7 FOCUS: RQ7 Benchmark Methodology Transfer. XCE claims +7.4pp on SWE-bench Verified for Sonnet 4.0 (external/README.md). What's the LIGHTEST viable local benchmark we could run to measure code_graph adoption impact?

Examine:
- external/README.md benchmark methodology section + chart references
- Existing test infrastructure: mcp_server/scripts/, vitest.stress.config.ts, mcp_server/tests/
- Can we measure: file-reads-avoided / context-accuracy / answer-completeness on a held-out task set?

Goal: P2 (nice-to-have) — propose evaluation harness sub-packet WITHOUT building it. Just describe shape: held-out task set size, metrics, baseline vs after, dispatcher.

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-007.md
2. APPEND state.jsonl: {"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ7"}
3. <packet>/research/deltas/iter-007.jsonl

CONSTRAINTS: LEAF, max 12 tool calls, read-only external/+mcp_server/, write only research/, file:line cites, no harness building.

DELIVERABLES:
- ≥1 file:line cite from external/README.md on XCE benchmark methodology
- ≥2 file:line cites from existing test infra (mcp_server/scripts/ or stress configs)
- Proposed eval harness shape: task-set size, metric, baseline-vs-after protocol, dispatcher
- Verdict: DEFER (P2 sub-packet) — full design without implementation
- Estimated LOC for harness sub-packet (separate from any other adoption)

NEXT iter focus: RQ8 Token Reduction Validation (~20% claim measurability via prompt-cache + budget-allocator instrumentation).
