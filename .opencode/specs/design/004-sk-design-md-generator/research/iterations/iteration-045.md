# Iteration 045 — Synthesis (research.md)

## Focus
Consolidate 44 iterations into the canonical `research/research.md` deliverable.

## Findings
1. **[P0] research.md drafted + host-verified** — 294-line publication-grade synthesis: exec summary, problem & root causes (2 hallucination classes + validator prose-blindness + empirical confirmation), prioritized recommendations (TIER-1 9 items / TIER-2 12 / TIER-3 7), external-tool borrow list (ADOPT-NOW 5 / SCOPED 7 / DEFER 4), doc-as-view target architecture (3-class section partition + deterministic formatters + DTCG spine), phased implementation plan (~550 LOC corrected, ship order, regression guards), open questions/accept-open, verification summary.
2. **[P0] Citations spot-verified against real code** — a11y-extract.ts:101-103 (`focusStyles.length===0 → consistent:true`), extract.ts:81 (`noInteraction=true`), cluster.ts:708 (`deltaE < 3`) all confirmed EXACT. The synthesis did not fabricate its own line citations.
3. **[P1] Verdicts applied** — DTCG migration DEFERred (doesn't fix prose fabrication), named-principle = evidence-gate not abolition, LOC corrected 335→~550, banned-adjectives WARNING-tier only, self-review unreliable (prefer structural citation-counting).

## Questions Answered
- Is the research complete enough to synthesize? Yes — synthesized into research.md.
- Highest-leverage change? Demote 5 data-poor sections to data-driven-conditional (~40 LOC) + the focus/interaction extraction fix.

## Questions Remaining
- RESERVED: emergent angles/risks (permanently open)
- Red-team research.md itself; pre-mortem the Phase-1 ship; deltaE<3-vs-<10 empirical (deferred).

## Next Focus
Final close-out: red-team the synthesis, pre-mortem Phase 1, run the deferred deltaE empirical, finalize.

## Summary
The 50-iteration loop's findings are consolidated into research.md (294 lines), host-verified for citation fidelity. The deliverable gives a phased ~550-LOC minimal-viable hardening that kills both hallucination classes plus an optional doc-as-view architecture, all evidence-bound and adversarially verified 3×.
