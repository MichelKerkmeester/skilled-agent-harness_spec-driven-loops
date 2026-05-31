Deep-research iter 8/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (RQ8), prior iters 001-007.md.

ITER 8 FOCUS: RQ8 Token Reduction Validation. XCE claims ~20% token reduction with steering active (external/README.md). Is this measurable in OUR system via prompt-cache (mcp_server/lib/prompt-cache.ts if exists) + budget-allocator.ts (mcp_server/code_graph/lib/budget-allocator.ts) instrumentation?

Baseline-vs-after protocol:
- Baseline: dispatch a task WITHOUT first-action mandate (or whatever steering changes RQ6 introduces)
- After: same task WITH steering changes
- Measure: tokens consumed pre-LLM-output, file-reads triggered, total turn count

Question: what instrumentation hooks already exist? What needs adding? Token counting where?

Examine:
- mcp_server/lib/prompt-cache.ts (or wherever)
- budget-allocator.ts existing token accounting
- handlers/context.ts response shape — do we already log token counts?
- skill_advisor brief render — already counts tokens?

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-008.md
2. APPEND state.jsonl: {"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ8"}
3. <packet>/research/deltas/iter-008.jsonl

CONSTRAINTS: LEAF, max 12 tool calls, read-only, file:line cites for every claim.

DELIVERABLES:
- ≥1 file:line cite from external/README.md on the 20% claim
- ≥2 file:line cites on existing token-accounting (budget-allocator, prompt-cache, render layer)
- Measurement protocol (instrumentation hook, where to add it, baseline vs after)
- Verdict: ADOPT / ADAPT / DEFER / SKIP for token-reduction harness
- Estimated LOC

NEXT iter focus: RQ9 Non-Adoption Boundary — explicit SKIP list (closed-source PRAT internals, SaaS hosting, xanther.ai dependency).
