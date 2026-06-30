Deep-research iter 7/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-6 covered RQ-A1..A5 + RQ-B1. This iter covers RQ-B2.

ITER 7 FOCUS: RQ-B2 — Memory backend LLM-curated context assembly.

READ FIRST:
- .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts (current memory_context entrypoint)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/ (4-stage retrieval: vector → BM25 → causal-boost → rerank; find the assembly step)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts (intent-aware traversal — already produces grouped output)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/README.md (XCE context-package shape — what does xce_get_context return?)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/ (continuity)

QUESTION: Can memory_context assembly become LLM-curated (XCE-style dynamic packaging) instead of rule-based templates?
- Today: 4-stage hybrid retrieval returns ranked list; assembly is rule-based grouping (intent-aware routing already exists).
- Proposed: optional LLM-curation stage — pass top-2K of candidates + user intent to a small LLM → returns ordered package ("first N from causal chain, then 1 exemplar per tier").
- Latency / cost tradeoff: each memory_context call adds an LLM round-trip (~1-3s, ~$0.001-0.01).
- Caching: same-intent same-candidate-set → cache the curation decision; bounded TTL.
- Default-off / opt-in flag because of latency.
- Quality bar: must beat rule-based packaging on a held-out task set (Phase 005 eval harness candidate).
- LOC estimate for curator wrapper + cache.
- Dependencies: requires existing 4-stage pipeline (already shipped); optional dependency on RQ-B1 (semantic triggers improve candidate set).
- Risk: LLM curation introduces non-determinism into retrieval; gate behind feature flag; deterministic fallback path required.
- Verdict shape: ADAPT (opt-in, behind flag), DEFER (until eval harness measures actual lift), SKIP (rule-based assembly is not the bottleneck)?

DELIVERABLES (same shapes):
1. iterations/iteration-007.md
2. state.jsonl append: `{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-B2"}`
3. deltas/iter-007.jsonl

CONSTRAINTS: same as iter 1.

NEXT iter focus hint: RQ-B3 — Session-trace bounded causal-edge inference.
