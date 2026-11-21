# Iteration 015 - Frontier node F-1-005: maintainability

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-005 (depth 1), dimension maintainability
- Sources read before work: lineage steer.md (absent), frontier block for F-1-005 maintainability, convergence decision for iteration 14 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1892-1920 (buildBlockedStopRow), 1972-1995 (reviewBlockedStopGateResults)
- .skilled/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:239

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The research blocked-stop row hard-codes `hotspotSaturation: {pass: true}` while the review side now reports an unevaluated gate as unknown** -- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1912 -- The same range taught the review event to say `unknown` for a gate that did not run, because "a gate that did not apply never ran, so its row says unknown rather than claim a pass" (convergence.cjs:1976-1978). The research builder added in the same file writes `hotspotSaturation: { pass: true }` as a constant on every blocked research stop. It derives `keyQuestionCoverage.pass` and `evidenceDensity.pass` only from blocker names (:1902-1911). So a research row asserts a hotspot-saturation pass that nothing computed. The reference documents the constant as if it were a result (deep-research/references/state/state-jsonl.md:239). The two modes now follow opposite rules for an unevaluated gate in one script.
   Finding class: instance-only
   Scope proof: buildBlockedStopRow is the only script producer of the research blocked_stop row (convergence.cjs recordBlockedStopDecision research branch)
   Affected surface hints: convergence.cjs buildBlockedStopRow; deep-research state-jsonl.md blocked_stop example
   Case: a research run blocks on uncovered_questions with no hotspot evaluation at all, and its blocked_stop row reports hotspotSaturation pass:true.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- The research row keeps the legacy shape on purpose ("the legacy row shape the research workflow has always sent", convergence.cjs:1890), so it upcasts on the existing path. A third gate status would need that upcast to accept it. That is the cost of aligning the two rules, and it is why this is P2.

## Edge Cases
- `ledgerCodeSlug` turns a camelCase gate name into the kebab code the ledger accepts and falls back to `blocked-stop` for an empty result (convergence.cjs ledgerCodeSlug). It is small and correct.

## Confirmed-Clean Surfaces
- `REVIEW_LEGAL_STOP_GATES` replaced an inline gate list, so the gate order and the blocked-stop rows share one constant (convergence.cjs:62-72, 1036).

## Ruled Out
- Gate-order drift between evaluation and recording: one constant.

## Next Focus
- Dimension: maintainability
- Focus area: F-2-006 maintainability, the last open node-dimension
- Reason: frontier round-robin
- Rotation status: F-1-005 complete on all four dimensions
- Required evidence: file:line

Review verdict: PASS
