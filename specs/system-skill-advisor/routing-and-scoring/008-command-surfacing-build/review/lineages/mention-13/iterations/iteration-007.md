# Review Iteration 007 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13`.
- Iteration: 7 of 8. Dimension: security (recovery pass, line-level granularity). The stop decision at iteration 6 was `STUCK_RECOVERY` / `stuckThresholdReached` after two no-progress passes, so this pass changes granularity rather than repeating the dimension sweep: every mark in the fold and in the typed start boundary is probed on its own, and the two readers are compared mark by mark.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks for a request that now reads as a mention and for a refusal still read as a request. At mark-level granularity the two failure directions become "the typed reader accepts a mark the mention scan does not see" and "a refusal wrapped in a mark still offers the command". Both were probed for thirteen wrapper pairs and nine single marks; neither fails.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:208` (typed start boundary)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:440-441` (fold)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:449-476` (occurrence scan and the tail rules)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:175-189,518-525` (the matrix and typed rows)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 and F002 remain active.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | F005 stands. The fold's mark set at 440-441 matches `spec.md:86` mark for mark. |
| `checklist_evidence` | partial | F006 stands. The matrix's twelve pairs at `command-attach-guards.vitest.ts:175-178` are the same twelve probed here, plus the ninth pair added by the row for prime and single-guillemet forms. |
| `skill_agent` | notApplicable | No agent definition in scope. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched. |
| `feature_catalog_code` | notApplicable | No feature catalog update in this pass. |
| `playbook_capability` | notApplicable | No playbook scenario covers the mention guard. |

## Integration Evidence

`typedCommandIn` at line 221 and `commandOnlyMentioned` at line 437 agree on every mark probed, so a wrapper cannot make a refusal reach `typedCommandForTop` as a typed command while the guard reads it as something else.

## Edge Cases

- Recovery activation: the stop decision at iteration 6 named `stuckThresholdReached`, and the recovery row records `change-granularity-line-level` with `security` as the target dimension. This iteration is that pass; it is not a repeat of iteration 3's whole-file scan.
- Ambiguity: whether a mark accepted by neither reader is a defect. It is not: an unrecognized mark leaves the command plainly typed or plainly refused, which is the pre-existing behaviour for every character outside the set.
- Partial success: the coverage gate stays blocked by the two partial core protocols, as in iterations 5 and 6.
- Contradiction: none.

## Confirmed-Clean Surfaces

- Thirteen wrapper pairs (`backtick`, straight single, straight double, curly double, curly single, bold, brackets, parentheses, strikethrough, `<code>`, guillemets, prime, single guillemets) all satisfy three conditions at once: `typedCommandIn` finds `/deep:review`, the same wrapped form in a refusal reads as a mention, and the same wrapped form in a request reads as a request. 0 mismatches.
- Nine single marks (`]`, `)`, `>`, `*`, `~`, `[`, `(`, `«`, `′`) appended to a typed command still leave it a typed command, and the same form in a refusal still reads as a mention.
- The occurrence scan's prefix class `(?:^|[^a-z0-9_/])` at line 451 is wider than the typed start boundary at line 208, so any typed hit is also an occurrence and the guard cannot miss a naming the typed reader found.

## Ruled Out

- A divergence between the two readers' mark sets: the occurrence prefix is wider than the typed boundary, and all thirteen pairs agree in both directions.
- A mark that hides a refusal from the typed path: `typedCommandForTop` calls the mention guard first, so a refusal still wins for the same wrapped form.
- A regression introduced by the recovery pass's narrower probes: no code was modified, and every probe reads current bytes.

## Next Focus

- Dimension: cross-reference final pass. All four dimensions are covered; the next pass verifies that the artifact set agrees with itself before the cap stop.
- Focus area: iteration files, deltas, state log rows and the registry.
- Reason: the iteration cap is reached next, so the last pass should leave the lineage internally consistent rather than open a new direction.
- Rotation status: re-verification pass 3 of 4 under the cap; the cap stop is expected at iteration 8.
- Blocked/productive carry-forward: productive `probe both readers on the same input` for any future wrapper change.
- Required evidence: file existence, record counts and registry counts.
- Recovery note: the stuck recovery is spent; the cap stop is the terminal path.

Review verdict: CONDITIONAL
