# Iteration 10: Does the parallel group have headroom, and what do the cuts add up to

## Focus

Every recommendation now rests on one untested assumption: that the deep-loop parallel group has room for `fanout-run`'s 157 s without stretching. This final iteration tested that assumption against the group's own wall time and then consolidated the surviving cuts into one ranked set with a total.

## Actions Taken

1. Subtracted the serial group's 265 s from the suite's 504-511 s to size the parallel group.
2. Compared the moved block against that wall, both whole and split four ways.
3. Summed the surviving cuts into the two suites they affect.

## Findings

1. The parallel group's wall is about 239-246 s for 161 files, which is larger than the 157 s block that would join it, so moving `fanout-run` in does not extend the group's wall. The assumption behind Cut A holds. `[INFERENCE: 504-511 s suite minus 265 s serial group from the research topic]`
2. Split four ways, the moved block is about 40 s per worker, which is far inside the 239-246 s wall and leaves the group's critical path unchanged. `[INFERENCE: from finding 1 and iteration 8's four-way estimate]`
3. Cut A's saving is therefore the serial group's fall from about 265 s to about 108 s, roughly 150 s off the deep-loop suite, with the parallel group unchanged. `[INFERENCE: from findings 1-2 and iteration 2's 108 s estimate]`
4. Cut B's saving is the cli lane's fall from about 400 s to roughly 100-140 s at four shards, roughly 270 s off the spec-kit `npm test`, and it changes no assertion. `[INFERENCE: from iteration 6's estimate]`
5. Added together, the two cuts take the deep-loop suite from 504-511 s to roughly 350-360 s and the spec-kit `npm test` from 841-911 s to roughly 570-640 s. Neither touches the import sum or the ledger cache, which iterations 3 and 4 showed are not on either critical path. `[INFERENCE: from findings 3-4 and the packet's measured baselines]`
6. The residual risk is uniform and stated: every number in findings 1-5 is arithmetic over the packet's own measurements, and iteration 9's protocol — per-file baseline, repeat run, count guard, 10% floor, four-worker check — is the gate each cut must pass before any of it is claimed. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145]`

## Ruled Out

- **Adding a third cut to the set.** Import sums and ledger caching are both off the critical path, and no other candidate survived eight iterations of checks.
- **Presenting the totals as measured.** They are estimates built from measured baselines, and the protocol exists because that distinction matters.
- **Reordering the cuts.** Cut A is smaller but cheaper to prove; Cut B is larger but needs a harness extraction. Either order works; Cut A first costs less if the operator stops after one.

## Dead Ends

- No measurement can be taken inside this lineage's write surface, so the estimates cannot be upgraded to measurements here.

## Edge Cases

- Ambiguous input: "headroom" was read as the parallel group's wall exceeding the moved block's duration, which is the only condition that matters for a file-parallel suite.
- Contradictory evidence: none.
- Missing dependencies: the per-file baseline remains the one missing input.
- Partial success: none.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:59`
- the research topic's 504-511 s suite and 265 s serial-group figures
- `iterations/iteration-002.md`, `iterations/iteration-006.md`, `iterations/iteration-008.md`, `iterations/iteration-009.md`

## Assessment

- New information ratio: 0.25
- Questions addressed: the headroom assumption and the total
- Questions answered: none new; this closes the set

## Reflection

- What worked and why: one subtraction — suite minus serial group — turned the last assumption into a comparison of two numbers, and 157 against 239 is not close.
- What did not work and why: the totals remain estimates because the per-file baseline was never available inside this run's write surface.
- What I would do differently: nothing for the analysis; the next step is a run, not another pass.

## Recommended Next Focus

None. The five key questions are answered, the surviving cuts are ranked with estimates and a measurement gate, and no unexamined lever remains inside this packet's scope.

## Questions Answered

- None new; all five key questions were answered by iteration 6.

## Questions Remaining

- None of the five key questions remains open.
