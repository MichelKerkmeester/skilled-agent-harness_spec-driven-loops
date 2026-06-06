Deep-research iter 8/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-7 covered RQ-A1..A5 + RQ-B1..B2. This iter covers RQ-B3.

ITER 8 FOCUS: RQ-B3 — Session-trace bounded causal-edge inference.

READ FIRST:
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts (existing relation types, NFR-R01 caps, insertEdge, weight-history table — find the auto-inference paths)
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts (search "createSpecDocumentChain" — existing auto-inference precedent)
- .opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts (how edges feed into retrieval — sparse-first policy, intent-aware traversal)
- .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts (search_shown / result_cited events — would be the inference signal source)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/README.md (XCE's causal-graph or trace claims, if any)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/ (continuity)

QUESTION: Can causal edges be auto-inferred from session traces — e.g. "queried record A → cited record B" → weak ENABLED edge — within existing NFR-R01 caps (max strength 0.5, ≤20 edges/node, 100/relation/window)?
- Existing auto-inference: createSpecDocumentChain produces auto edges for spec→plan→tasks→impl-summary CAUSED + checklist→spec SUPPORTS edges. Find caps + behavior.
- Proposed: a session-trace reducer reads feedback-ledger events (search_shown, result_cited) → if the same session shows record A search-shown then result_cited(B), emit weak ENABLED(A→B, strength=0.3).
- Bounded: respect NFR-R01 caps (≤20/node, 100/window); auto-edge strength ≤0.5; no override of manual edges.
- When to fire: end-of-session reducer (deferred), or live (per-event)?
- De-dup: existing session keeps re-emitting → upsert with strength bump (clamped) or rate-limit.
- Decay: existing −0.1/30days policy applies to auto-inferred edges.
- LOC estimate: session-trace reducer + integration with causal-edges.insertEdge.
- Risk: noisy auto-edges pollute boost layer; mitigation = lower strength + isolation by created_by='auto-session'.
- Dependency: weakly depends on RQ-B4 (feedback-ledger driving more decisions); independent otherwise.
- Verdict shape: ADOPT bounded inference (clear win, design fits existing caps), ADAPT with explicit reducer + tests, DEFER (need eval first), or SKIP?

DELIVERABLES (same shapes):
1. iterations/iteration-008.md
2. state.jsonl append: `{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-B3"}`
3. deltas/iter-008.jsonl

CONSTRAINTS: same as iter 1.

NEXT iter focus hint: RQ-B4 — Feedback-ledger-driven learned retention/decay.
