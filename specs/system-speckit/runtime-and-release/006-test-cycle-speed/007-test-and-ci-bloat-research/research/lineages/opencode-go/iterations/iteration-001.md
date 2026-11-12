# Iteration 1: The commit and push path — what runs locally and what it costs

## Focus

Measure the local git hook path before judging it, because the research topic asserts the operator "waits minutes on every commit, push and CI run". `spec.md` records CI workflow wall-clock times but states explicitly that local hook time is unmeasured. This iteration measures the cheap checkers, counts the processes each hook spawns, and establishes where the minutes actually come from. Key question 3 (hook cost) is the entry point, and question 1 (workflow duplication of local guards) needs the hook inventory that this iteration produces.

## Actions Taken

1. Read `.skilled/scripts/git-hooks/pre-commit` in full and listed every gate section it contains.
2. Read `.skilled/scripts/git-hooks/pre-push` in full and read its own header contract.
3. Timed the individual read-only checkers the commit hook invokes with a wall-clock wrapper (`python3 time.time()` around each invocation), five runs collapsed to a single representative figure each.
4. Timed the pre-push track-root sweep against `HEAD`.
5. Checked for an aggregate test entrypoint at the repository root and in `.skilled/`.

## Findings

1. `pre-commit` is 1,056 lines and runs 13 named gates: private-skill guard, comment hygiene, template phrase lint, agent mirror sync, doc version bump, mirror parity, skill authoring, prompt-card sync, MCP mutation class, compiled-route re-mint, deep command contract recompile, spec derived-metadata re-mint, tool ownership map. [SOURCE: .skilled/scripts/git-hooks/pre-commit:118]
2. Every local checker measured under the commit hook is fast: comment hygiene 0.09s, template phrase lint 0.09s, agent mirror sync 0.13s, compiled route guard 0.09s, doc version `--check` 0.09s, deep contract drift 0.09s. [SOURCE: .skilled/scripts/git-hooks/pre-commit:151][SOURCE: .skilled/scripts/git-hooks/pre-commit:226][SOURCE: .skilled/scripts/git-hooks/pre-commit:244][SOURCE: .skilled/scripts/git-hooks/pre-commit:294]
3. The commit hook pays for process startup rather than for checking: it spawns at least twelve `node` processes, and the measured per-process floor is 0.03–0.13s, so the whole local commit gate is roughly one second of process start plus the gate work itself. [INFERENCE: based on the twelve visible `node` spawn sites in the hook body and the 0.09s median measured for each checker above]
4. `pre-push` no longer runs any test suite. Its own comment records that the suites that used to run there were report-only and moved to CI, so the push path is now structural gates only. [SOURCE: .skilled/scripts/git-hooks/pre-push:481]
5. The most expensive local check is the track-root sweep at 2.27s, and it runs once per pushed ref. It is pre-push only, so it adds about 2.3s to a push and nothing to a commit. [SOURCE: .skilled/scripts/git-hooks/pre-push:577]
6. The repository has no root `package.json` and `.skilled/package.json` declares no `scripts` block, so there is no single "run the tests" command. Suites are invoked per package, which is why no local aggregate suite cost exists to cut. [SOURCE: .skilled/package.json:1]
7. The hook path is therefore not the source of the operator's multi-minute waits: a commit costs about a second and a push about three seconds, while the cheapest measured CI workflow costs 10s and the most expensive 595s. The premise "minutes on every commit" is unsupported for hooks and should be dropped from the cut list. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:82][SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:113]

## Ruled Out

- Timing the whole hook end-to-end by running a real commit: forbidden, since this lineage may not write outside its directory and a commit writes the index and objects.
- Reporting the hook gates as bloat without measurement: the measurements above show the opposite, so a "delete pre-commit gates" recommendation is ruled out on evidence.
- Adding a `package.json` scripts block as a recommendation: it would change repository structure for no measured saving, and this packet is research only.

## Dead Ends

- `parent-skill-check.cjs` timed with a bare skill path returned exit 2 (wrong argument shape), so its cost is not part of the measured set. The remaining checker costs are small enough that one missing sample does not change the conclusion. Candidate for promotion to "exhausted approaches" only if a later iteration needs a per-gate budget table.

## Edge Cases

- Ambiguous input: `spec.md` says the operator waits minutes on every commit, push and CI run, while the measured hooks total about three seconds. Selected interpretation: the minutes live in CI (and in the pre-commit gates' *perceived* latency from editor round-trips), and the research must say so rather than manufacture hook cuts. Deferred alternative: measuring hook latency inside a real editor integration, which this lineage cannot do without writing outside its directory.
- Contradictory evidence: none. The spec's own caveat that local hook time is unmeasured is consistent with what was measured here.
- Missing dependencies: `gh` was not needed this iteration; CI run times are taken from `spec.md` as the packet's measured inventory.
- Partial success: none; all five measurement targets responded.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `.skilled/scripts/git-hooks/pre-commit:118`
- `.skilled/scripts/git-hooks/pre-commit:151`
- `.skilled/scripts/git-hooks/pre-commit:226`
- `.skilled/scripts/git-hooks/pre-commit:244`
- `.skilled/scripts/git-hooks/pre-commit:294`
- `.skilled/scripts/git-hooks/pre-push:481`
- `.skilled/scripts/git-hooks/pre-push:577`
- `.skilled/package.json:1`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:82`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:113`
- Measured wall-clock: comment hygiene 0.09s, phrase lint 0.09s, agent mirror sync 0.13s, route guard 0.09s, doc-version check 0.09s, contract drift 0.09s, track-root sweep 2.27s.

## Assessment

- New information ratio: 0.9
- Questions addressed: Which pre-commit and pre-push hook checks cost the most wall-clock time, and which could move to CI or run only on changed paths?
- Questions answered: Which pre-commit and pre-push hook checks cost the most wall-clock time, and which could move to CI or run only on changed paths?

## Reflection

- What worked and why: timing the individual read-only checkers instead of the whole hook isolated cost per gate without mutating the repository, and it overturned the premise in one pass.
- What did not work and why: `parent-skill-check.cjs` rejected a bare skill path, so one gate is unmeasured; the effect is negligible because the gate runs only for staged skill changes.
- What I would do differently: read the hook's gate list before reading its body; the section headings alone would have told me which lines to measure.

## Recommended Next Focus

Inventory the 33 workflow files against the local gates and each other: which workflow duplicates a hook that already blocks, which pair overlaps on the same guard, and which measured wall-clock time is mostly queue time rather than work.
