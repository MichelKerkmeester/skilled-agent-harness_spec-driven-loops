# Iteration 008 - Frontier node F-1-002: traceability

## Dispatcher

- Lineage: opus (fan-out), iteration 8 of 24, dimension traceability, frontier node F-1-002 (depth 1 of 3)
- Stop check before dispatch: CONTINUE (noStopCandidate)
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Traceability of the admission engine: its behavior against the research-frontier and review-frontier requirements (read as reference), against `deep-review/references/protocol/loop-protocol.md`, and against the two unit-test files that pin it.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:56-121,339-375,403-427,656-714,817-869`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts` and `frontier-admit-review.vitest.ts` (coverage map by symbol and command)
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464-474`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:23,2001` and `deep-research/scripts/reduce-state.cjs:29,2532` (band budget callers)
- Reference only: `010-research-frontier-mode/spec.md:138-158` (REQ-002, REQ-008, REQ-014), `011-review-frontier-mode/spec.md:135,139` (REQ-002, REQ-011)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` (core): pass. REQ-002 (both children): `checkProposal` runs relevance, dedupe, depth, fan-out, budget, cycle in that order and returns the first failing name (`frontier-admit.cjs:656-714`); a review admission writes no inbox row (`:788-798`). REQ-008: shares 0.5/0.35/0.15 (`:93`), roll-down only (`:361-373`), a spent band projects its open nodes as `exhausted` with reason `budget` (`:363-368`), node cap tied to half the budget (`:413-417`). REQ-014/REQ-011: seed, admit, prune and close each append one row (`:766,786,857,908`). The root-children floor of 8 for review (`:65`) matches loop-protocol and review.md.
- `checklist_evidence` (core): pass. The loop-protocol paragraph on admission (`loop-protocol.md:470`) and the seed paragraph (`:466`) match the code; the six-check order, the review no-inbox rule and the fan-out store writer are each backed by a line above.

## Integration Evidence

- `applyBandBudget` has two callers, the review reducer (`reduce-state.cjs:2001`) and the research reducer (`deep-research/scripts/reduce-state.cjs:2532`); its behavior is pinned through the reducer test suites rather than the frontier-admit files, which reference it zero times.

## Edge Cases

- Test coverage map: the frontier-admit suites cover the `budget`, `block`, `close`, `graph`, cycle and CLI error paths by name; `writeSeedBudget` is covered only through the `budget` CLI command. No test covers a non-ASCII question (OPUS-F002-P2-001), a path-shaped-scope check (OPUS-F002-P2-003) or a negative budget (OPUS-F002-P2-004); those gaps belong to the open findings rather than new ones.

## Confirmed-Clean Surfaces

- Header contract (`:7-28`): append-only store, last row wins, one other writer (`fanout-run.cjs`), leaves never call the module, all match the code.
- `readCaps` comment (`:407-412`) about the budget step writing the derived budget before any admission matches the YAML order (`deep-review.yaml:953-973` before the loop).

## Ruled Out

- Six-check order drift between code, catalog and loop-protocol: identical order in all three.
- Band roll-up: no path carries budget to a shallower band.

## Operator Focus Coverage

- Overengineering: `applyBandBudget` lives in frontier-admit but is called only by the reducers; one shared function used by both loops is the right altitude.
- Operator UX: no new issue.
- Cross-CLI and OS parity: no executor-specific branch in the engine.

## Next Focus

- Dimension: traceability
- Focus area: F-1-006 traceability (playbooks and catalogs against code), then maintainability visits
- Reason: registry.frontier rotation
- Rotation status: F-1-002 has correctness, security and traceability covered
- Required evidence: file:line

Review verdict: CONDITIONAL
