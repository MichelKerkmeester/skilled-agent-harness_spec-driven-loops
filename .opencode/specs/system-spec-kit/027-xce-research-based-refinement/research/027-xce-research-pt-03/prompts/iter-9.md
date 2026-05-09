Deep-research iter 9/10 SCOPE-EXPANSION pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: Iter 1-8 covered RQ-A1..A5 + RQ-B1..B3. This iter covers RQ-B4.

ITER 9 FOCUS: RQ-B4 — Feedback-ledger-driven learned retention/decay.

READ FIRST:
- .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts (full file — schema, event types, retention)
- .opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts (related — adaptive ranking precedent)
- .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts (current retention sweep — TTL, deleteAfter)
- .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts (current decay: −0.1 strength per 30 days if last_accessed > 90 days)
- .opencode/skills/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts (HOT/WARM/COLD/DORMANT tiers)
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/ (continuity)

QUESTION: Can lib/feedback/feedback-ledger.ts signals drive learned retention/decay decisions?
- Today: rule-based decay (−0.1/30days for unused edges; deleteAfter ISO TTL for memory records).
- Proposed: hit-rate-weighted retention — records cited frequently in feedback events get longer TTL extension; constitutional-tier records have priority basement (never decay below floor).
- Concrete weighting design: TTL bonus = base_TTL × (1 + log10(hit_count)) capped at 2× base.
- Constitutional/critical tier basement: strength floor at 0.7 even after 90+ days unused.
- Implementation: extend memory-retention-sweep.ts to consume feedback-ledger; bounded by tier rules.
- vs RQ-B3: B3 creates new edges from feedback; B4 modulates existing record/edge lifetimes. Both consume feedback-ledger; could share the reducer.
- LOC estimate: retention-decision reducer + sweep integration.
- Risk: feedback-driven retention could keep alive low-quality records that happen to be queried often; mitigation = combine with tier signal (only boost retention if tier ∈ {important, critical, constitutional}).
- Verdict: ADAPT (with tier guard), DEFER (need eval), SKIP (rule-based is fine), ADOPT (unambiguous win)?

DELIVERABLES (same shapes):
1. iterations/iteration-009.md
2. state.jsonl append: `{"type":"iteration","iteration":9,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ-B4"}`
3. deltas/iter-009.jsonl

CONSTRAINTS: same as iter 1.

NEXT iter focus hint: RQ-B5 — Cross-cutting coco+memory shared infra. FINAL iter — also responsible for synthesis-readiness summary.
