# Iteration 009 - Frontier node F-1-006: traceability

## Dispatcher

- Lineage: opus (fan-out), iteration 9 of 24, dimension traceability, frontier node F-1-006 (depth 1 of 3)
- Stop check before dispatch: CONTINUE (noStopCandidate)
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Traceability of the skill docs and catalogs against the code: the review expansive-depth catalog entry, the skill-level depth-mode catalog entry, and a sweep of every live surface that states the review node universe or the budget's dimension count.

## Files Reviewed

- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16-60`
- `.skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464`
- `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:105`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:48`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:457-463` (budget comment)
- Code of record: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1222-1237`, `convergence.cjs:1507-1510`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The traceability-narrowed node universe reached only review.md, the YAML and the reducer comment; nine other live surfaces still say "the four canonical dimensions plus any custom name"** -- .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:30 -- `buildDimensionUniverse` drops traceability when the configured list leaves it out (`reduce-state.cjs:1225-1227`), and the budget counts that same set (`frontier-admit.cjs:460-463`). These live surfaces still state the un-narrowed rule: the review expansive-depth catalog (`expansive-depth-mode.md:30`), the skill-level depth-mode catalog (`feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16`), loop-protocol (`deep-review/references/protocol/loop-protocol.md:464`), convergence reference (`deep-review/references/convergence/convergence.md:105`), quick reference (`deep-review/references/protocol/quick-reference.md:48`), the budget comment in the engine itself (`frontier-admit.cjs:458`), and, already raised, the presentation (`:83,:444`), state-format (`:305`) and the current changelog (`v1.13.0.0.md:122,141`). The compiled contract (`commands/deep/assets/compiled/deep-review.contract.markdown:220`) inherits the presentation text on the next compile. This consolidates OPUS-F004-P2-001 and OPUS-F006-P2-001 into one doc-alignment task with the full site list.
   - Finding class: cross-consumer
   - Scope proof: `grep -rn -i "four canonical dimensions plus|canonical four plus|four plus any custom|those four plus"` over `.skilled/skills/system-deep-loop`, `.skilled/commands/deep` and `.skilled/agents`, minus lines that already say "less traceability" or "leaves it out", returns exactly the sites listed (plus one test comment, `frontier-admit-review.vitest.ts:668`).
   - Affected surface hints: the nine doc and comment sites above; the presentation fix regenerates the compiled contract.
   - Case: an operator sizes `--dimensions correctness,performance --depth-mode=expansive` from loop-protocol or the catalog, expects D=5 and a traceability pass per node, and gets D=4 with none.

## Traceability Checks

- `feature_catalog_code` (overlay): partial. `expansive-depth-mode.md` matches the code on seeding, admission order, stop behavior, the dashboard section, the pivot gate and fan-out, but its Dimension Coverage paragraph (`:30`) states the un-narrowed universe.
- `skill_agent` (overlay): pass. The deep-review agent's frontier proposal paragraph names the same six checks in the same order as `frontier-admit.cjs:656-714`, and its custom-dimension sentence matches `buildDimensionUniverse`'s ordering (canonical first, custom after).

## Integration Evidence

- The narrowing commits in range (`edf0ed89`, `de32abbb`) edited review.md, the YAML and the custom-dimension catalog/playbook; the remaining sites are the surfaces those commits did not touch.

## Edge Cases

- `quick-reference.md:48` matched the drift pattern in the broad grep; its wording is in a table cell, so the extracted context window did not print, but the line is in the result set.
- The test comment at `frontier-admit-review.vitest.ts:668` carries the old wording; the test assertion itself is not judged here.

## Confirmed-Clean Surfaces

- `expansive-depth-mode.md` sections Seeding And Admission, Stop Behavior, Dashboard, Pivot and Fan-Out.
- The 24 ceiling, 12-iteration depth-1 band and "three nodes at four dimensions" arithmetic (`:26`).

## Ruled Out

- A second code-side universe definition: only `buildDimensionUniverse` builds it, and the budget calls it.

## Operator Focus Coverage

- Overengineering: one rule (the node universe and its budget count) is restated in at least twelve places; the drift above is the direct cost. The fix that removes the class is to state it once (review.md flag row or loop-protocol) and link, not to re-edit nine copies.
- Operator UX: the sizing guidance an operator reads first (quick reference, catalog) is the stale copy.
- Cross-CLI parity: docs are runtime-neutral; the compiled contract feeds every runtime the same stale presentation text.

## Next Focus

- Dimension: maintainability
- Focus area: next node per registry rotation (F-1-002, F-1-004, F-1-006 maintainability), with the overengineering angle as the main lens
- Reason: maintainability is the last uncovered dimension on all three depth-1 nodes
- Rotation status: all three depth-1 nodes have correctness, security and traceability covered
- Required evidence: file:line and a named delete-or-collapse target

Review verdict: CONDITIONAL
