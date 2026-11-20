# Iteration 022 - Recovery: sizing the 20 MB stdout cap against a real run

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Mode: recovery (convergence for iteration 21 returned BLOCKED on dimensionCoverageGate; a `deep_review.recovery_started` event was recorded before this iteration)
- Strategy: settle the inferred part of OPUS-F006-P2-002 (how close a real lineage comes to the cap) with a measurement
- Sources read before work: lineage steer.md (absent)

## Files Reviewed
- This lineage's own Claude Code session transcript under the runtime's projects directory, measured for size and line count only (no content copied, since it carries account identifiers)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2686, 4791 (cap and its setting, from iteration 8)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None new.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- Measurement: after 21 iterations of an expansive review over this commit range, which read several large files including the 5,348-line fanout-run.cjs in anchored slices, this lineage's session transcript is about 4.0 MB in 942 lines, 167 of them user (tool-result) events. The stream-json stdout the runner caps carries the same assistant and tool-result content, so this run sits near one fifth of the 20 MB cap (fanout-run.cjs:4791) at iteration 21 of 24.
- Effect on OPUS-F006-P2-002: the defect is unchanged, because the cap counts every tool result and trips SIGTERM at :2686. The likelihood is now measured rather than inferred, at roughly 5x headroom for a slice-reading workload like this one. A lineage that reads whole large files, or runs the 24-iteration cap with broad reads, is the case that can reach it. The finding stays P2, and its "real transcript sizes are inferred" caveat is replaced by this measurement.

## Edge Cases
- The transcript is not byte-identical to stream-json stdout, since it adds bookkeeping rows and stream-json adds per-event envelopes. The two are the same order of magnitude, and that is all the margin claim needs.

## Confirmed-Clean Surfaces
- None new.

## Ruled Out
- Escalating OPUS-F006-P2-002: about 5x measured headroom on a representative run.

## Next Focus
- Dimension: traceability (recovery)
- Focus area: checklist_evidence replay across the child phase folders' acceptance criteria for any row that names the range's features
- Reason: core protocol replay before the cap
- Rotation status: recovery passes until maxIterations (24)
- Required evidence: file:line

Review verdict: CONDITIONAL
