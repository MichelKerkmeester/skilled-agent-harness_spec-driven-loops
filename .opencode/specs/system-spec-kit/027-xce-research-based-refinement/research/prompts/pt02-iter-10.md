Deep-research iter 10/10 cross-validation pass for packet 027.

ITER 10 FOCUS: IRQ10 — Phasing-order optimization (final IRQ before synthesis).

READ FIRST:
- 027/spec.md (PHASES table — recommended order)
- 027/research/sub-packet-proposals.md "Implementation Dependency Graph" section (says: 028 → {029,030} parallel; 031 standalone; 032 last)
- 027/{001-005}/description.json `manual.depends_on` arrays (the ground-truth dependency declarations)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-001.md to 009.md — synthesize ALL prior findings to detect hidden coupling

QUESTION: Pass-1 recommended phasing order: **004 → 001 → {002, 003} parallel → 005**. Cross-validate this order using the 9 prior IRQ findings:
- iter-2 BLOCKING: Phase 002's CONTAINS chain is broken — Phase 002 needs `CodeNode.filePath` for module rung. Does this raise a NEW dependency on 001 (which generates HLD per file)? Or is filePath already independent?
- iter-6 finding: Phase 003 has OPTIONAL dep on Phase 001 for `layer` info. Cross-validation: does iter-3's risk-formula validation surface that `layer` is actually required for the formula to be defensible? If yes, Phase 003's `manual.depends_on` should be updated.
- iter-7 finding: Phase 003's TESTED_BY direction is wrong. Fixing this requires re-reading TESTED_BY emission in structural-indexer.ts. Does the FIX scope add a hidden dep on understanding 001's classifyFileRole signature first?
- iter-4 finding: Phase 004's "MUST invoke" needs scorer invariant tests. Are those tests in scorer/ — which is OUT OF SCOPE? If so, Phase 004 might need to ship with weaker mandate text + tests deferred.
- iter-5 finding: Phase 005's subprocess reliability needs explicit lifecycle/auth-cache work. Does that bump Phase 005 to L3 (currently L2)?
- iter-8 finding: code_packages stays P1; module rung from CodeNode.filePath is P0 in Phase 002. Same Phase 002 — internal change only.
- iter-9 finding: Phase 003's enrichWithLLM should be Option D (explicit opt-in, no default). Does this affect Phase 005 (eval harness) which evaluates with-vs-without enrichment?
- Risk: should Phase 004 still ship FIRST given its scorer invariant blocker? If 004 needs tests in out-of-scope scorer/ first, swap order: Phase 001 first (independent), then 002/003, then 004 with stronger guardrails, then 005.
- Cross-cutting question: are there ANY phase pairs where shipping order matters more than the deps suggest? E.g., 003 inherits a `layer` from 001 — without 001, 003's formula is incomplete.
- Final order recommendation: list 5 phases in optimal order with rationale per phase based on cross-validation findings.

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-010.md` (Focus, Actions with file:line, Findings with verdicts, Q-Answered = ALL 10 IRQs ANSWERED, Q-Remaining = none, Next Focus = SYNTHESIS)
2. APPEND `>>` ONE LINE to `pt-02/deep-research-state.jsonl`:
{"type":"iteration","iteration":10,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ10"}
AND append a SECOND line: {"type":"event","event":"converged","stopReason":"max_iterations_complete","run":10,"timestamp":"<now ISO 8601>"}
3. WRITE `pt-02/deltas/iter-010.jsonl` (1 iter record + ≥3 finding records)

CONSTRAINTS: LEAF, ≤14 tools (last iter has slightly higher cap), READ-ONLY 027/* + mcp_server/, WRITE pt-02/ ONLY, file:line cites required.

NEXT: SYNTHESIS phase (separate task) — author research.md, findings.md, sub-packet-amendments.md, resource-map.md in pt-02/.
