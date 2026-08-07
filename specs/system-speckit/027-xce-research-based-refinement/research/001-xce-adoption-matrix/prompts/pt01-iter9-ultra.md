Deep-research iter 9/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (RQ9), prior iters 001-008.md.

ITER 9 FOCUS: RQ9 Non-Adoption Boundary. EXPLICIT SKIP LIST — what XCE patterns we MUST NOT adopt, with rationale. This is the anti-bias guard required by the spec (verdict_diversity_floor: min_skip:1).

Categories to explicitly SKIP:
1. Closed-source PRAT internals (we have no access; reverse-engineering only)
2. SaaS hosting model (xanther.ai is a hosted service; we run local MCP)
3. Centralized hosting / external dependency on xanther.ai
4. Pricing model coupling
5. Anything else surfaced during prior iters as not-applicable

For each SKIP item: 1-sentence rationale citing external/README.md or our existing scope.

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-009.md (sections: Focus, Actions, Findings — explicit SKIP list with cites, Q-Answered, Q-Remaining, Next-Focus = synthesis)
2. APPEND state.jsonl: {"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ9"}
3. <packet>/research/deltas/iter-009.jsonl

CONSTRAINTS: LEAF, max 12 tool calls, read-only, file:line cites for every SKIP rationale.

DELIVERABLES:
- ≥4 explicit SKIP items in a "Will NOT adopt" section
- Each SKIP has: item / rationale / cite
- Verdict for the OVERALL adoption matrix verdict diversity (should we have at least 1 SKIP — yes, this iter delivers them)
- Estimated total adoption-matrix verdict counts so far across all 9 RQs (ADOPT vs ADAPT vs DEFER vs SKIP)

NEXT iter focus: RQ-cross-cut SYNTHESIS (iter 10). Build adoption matrix table consolidating all 9 RQs, propose 1-4 sub-packets, write resource-map.md.
