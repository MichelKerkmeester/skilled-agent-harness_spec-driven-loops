# Iteration 9: The measurement protocol each surviving cut must pass

## Focus

Eight iterations produced four candidate cuts and four eliminations, and every surviving saving is arithmetic. This iteration turns them into a protocol: the exact command per cut, the signal that proves it, the guard that proves no coverage was lost, and the reading that would falsify it. The packet's own rule is "measure before claiming", so the deliverable is a run, not another estimate.

## Actions Taken

1. Collected the commands the packet already used to prove cuts 1, 2 and 5, so the new protocol speaks the same language.
2. Checked which Vitest flags the installed version exposes for a per-file report and for a worker cap.
3. Mapped each surviving cut to the guard that would catch its specific failure mode.

## Findings

1. Every cut needs the same three-part proof: a per-file baseline from `--reporter=json`, the same run repeated after the change, and a file-and-test count from `vitest list` to show nothing left the suite. The packet already used the count guard for cut 1, where the config went from 302 collected files to 129. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md:93]`
2. Cut A — move `fanout-run` and `postflip-fanout` into the parallel project and split `fanout-run` four ways — is proven by the deep-loop suite's wall time falling while `vitest list` still reports the same file set. Its falsifier is a timing test failing under load, and the response is to raise the poll cap or return that one test to the serial project, never to loosen an elapsed assertion. `[SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:13]`
3. Cut B — split `upgrade-legacy` into four shards with a shared harness — is proven by the cli lane's wall time falling while the `cli` project still reports 203 files and 2518 tests. Its falsifier is the shard running twice, which happens if the `--exclude` line is not updated, so the proof must include a file count from each of the two processes. `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:9]`
4. Both cuts need the same small-runner check: repeat the measurement with `--maxWorkers=4`, because a saving that only exists at eighteen workers does not help the machine that gates merges. `[SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:26]`
5. The protocol's rejection rule is the important part: a cut is rejected if the wall does not fall by at least 10%, if any file or test count changes, or if a timing-sensitive test fails once under load. A 10% floor is above the run-to-run spread the packet already recorded — the deep-loop suite varied by 7 s across three runs, about 1.4%. `[INFERENCE: from the 504, 511 and 504 s deep-loop runs recorded in implementation-summary.md:145]`

## Ruled Out

- **Claiming a saving from a summed metric.** Iterations 1 and 3 showed import is a sum over files, so the wall is the only number that proves a cut.
- **Measuring under load.** The packet already recorded a false failure from a run under load; the baseline has to be quiet.
- **One run as proof.** The packet's own three-run spread is 1.4%, so a single before/after pair cannot separate a real saving from noise without the 10% floor.

## Dead Ends

- No CI wall-clock history exists, so the four-worker check is a proxy for `ubuntu-latest` rather than the real thing; a follow-up could record the first CI run's timing as the real baseline.

## Edge Cases

- Ambiguous input: "measure" was read as wall time on a quiet machine with the coverage guards, not as a CPU profile.
- Contradictory evidence: none.
- Missing dependencies: the per-file baseline does not exist yet; it is the first step of the protocol.
- Partial success: none.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md:93`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145`
- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:13`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:9`
- `.skilled/skills/system-spec-kit/runtime/vitest.config.ts:26`

## Assessment

- New information ratio: 0.35
- Questions addressed: how each surviving cut is proven
- Questions answered: none new; this converts prior findings into a procedure

## Reflection

- What worked and why: reusing the packet's own proof shape — a file count plus a wall time — keeps the protocol compatible with the evidence the operator already trusts, and it caught that cut B needs two counts rather than one.
- What did not work and why: the protocol cannot supply the missing per-file baseline; it only says how to take one.
- What I would do differently: run the baseline before proposing cuts, because every estimate in this lineage would then be a delta rather than an inference.

## Recommended Next Focus

One gap remains: the protocol assumes the deep-loop parallel group has headroom for `fanout-run`'s 157 s, and that assumption has not been checked against the parallel group's own critical path. The final iteration should test it and then consolidate.

## Questions Answered

- None new; all five key questions were answered by iteration 6.

## Questions Remaining

- None of the five key questions remains open.
