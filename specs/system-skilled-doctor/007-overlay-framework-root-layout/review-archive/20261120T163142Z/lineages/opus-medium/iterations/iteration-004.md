# Iteration 004 - Frontier node F-1-008: correctness

## Dispatcher
- Lineage opus-medium, iteration 4 (3 prior iteration records). steer.md absent. Node F-1-008 marked active; dimension correctness.
- Review focus addressed: whether the packet's completion claims (five child specs, tasks, acceptance criteria, implementation summaries, scratch evidence; Skilled 1653734af7d and 10c36989450; ai-speckit close-out ad3246feba2) are backed by code state and recorded runs.

## Files Reviewed
- specs/system-skilled-doctor/007-overlay-framework-root-layout/{001..005}/spec.md (status and level rows)
- 005-barter-move-overlays-out-of-tree/acceptance-criteria.md:57-77
- 005-barter-move-overlays-out-of-tree/implementation-summary.md:82,102-118
- 004-barter-repin-and-relayout/implementation-summary.md (verification table), tasks.md:35,53,74,99
- barter/ai-speckit/overlays/overlay-manifest.json (pin.commit, 133 overlays, every source under framework/ or root/)
- git rev-parse 063daaee2c1

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Two acceptance rows are marked Met while their own cells record a deviation from the Then clause** -- specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/acceptance-criteria.md:66 -- AC-008's Then clause is "all pass", and its verification cell records `node --test` exit 1 with 11 failures (the same 11 as the baseline). AC-009 (:67) allows only listed lines, and its cell records 4 lines outside that list. Both rows read `Met` with no waiver, while the legend at :74-77 defines Met as verified and requires an ADR for a criterion pursued differently (Waived or Superseded). The deviations are honestly written in the cells, so nothing is hidden, but the closure gate reads Met on two criteria that were judged against a different bar than the one stated.
   Finding class: completion-claim drift
   Scope proof: the other eight 005 rows have no deviation note; 004 (Level 1, no acceptance file) states the same baseline-equal judgment in its verification table rather than as a Met criterion.
   Affected surface hints: 005 acceptance-criteria.md AC-008 and AC-009 Then clauses or status
   Case: a reader trusting the AC Status column concludes every overlay test passes after the move, while `node --test` over overlays/ exits 1 with 11 failures.

## Traceability Checks
- spec_code (pass): 004 claims (pin 063daaee2c19..., 133 overlays, every source under framework/ or root/) hold in barter/ai-speckit/overlays/overlay-manifest.json now; `git rev-parse 063daaee2c1` matches the pin.
- checklist_evidence (partial): 005 acceptance AC-008 and AC-009 rows marked Met against a deviated bar (finding above); 001 implementation-summary.md:90 negative control confirmed in iteration 1; 003 scenario quoting fix confirmed in iteration 2.

## Integration Evidence
- None beyond the nested ai-speckit manifest read.

## Edge Cases
- 004 and 005 keep no scratch/evidence files in Skilled; their evidence lives as Observed text in tasks.md and acceptance-criteria.md. That is weaker than phases 001-003's captured run output, but the spec-kit Level 1/2 contract does not require captured files. Recorded, not raised.
- 005 AC-009 lists the compiled-routing-byte-parity fixture name as an allowed leftover; iteration 3 raised it as a P2 leftover regardless, since the review focus asks for any reference to the old path.

## Confirmed-Clean Surfaces
- Level rows: 001 and 005 are Level 2 and carry acceptance-criteria.md; 002-004 are Level 1 and need none.

## Ruled Out
- Pin mismatch between the packet and the Barter manifest: ruled out by rev-parse.
- Sources left on the old layout: ruled out, zero sources outside framework/ and root/.

## Next Focus
- Dimension: security
- Focus area: F-1-002 engine path safety (setting file, stage folders, rollback, adopt)
- Reason: all four nodes have correctness; frontier rotates to the next dimension

Review verdict: PASS
