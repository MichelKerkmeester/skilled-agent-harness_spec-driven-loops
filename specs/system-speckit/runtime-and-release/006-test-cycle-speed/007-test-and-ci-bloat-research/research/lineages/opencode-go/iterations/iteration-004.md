# Iteration 4: The advisor and deep-loop suites — config cost versus test cost

## Focus

Key questions 2 and 5 applied to the two remaining large runtime trees: `system-skill-advisor/runtime` (185 files, 35,199 lines, 457s workflow) and `system-deep-loop/runtime` (174 files, 86,618 lines, 472s workflow). Iteration 3 found that the spec-kit tree's cost sat in setup and dead runners; this iteration asks whether these two trees have the same shape or a different one, and whether any suite runs twice.

## Actions Taken

1. Recounted both trees with `node_modules` pruned, because an unpruned `find` had inflated the advisor tree to 381 files.
2. Read both packages' `package.json` scripts and both `vitest.config.ts` files, including the stress config.
3. Counted the files the deep-loop `SERIAL_FILES` patterns select against the whole suite.
4. Compared the advisor's default include set against the suites `routing-registry-drift.yml` runs explicitly.
5. Read the two workflows' step lists to see what runs before the first test.

## Findings

1. Corrected census: the advisor tree is 185 test files and 35,199 lines, the deep-loop tree 174 files and 86,618 lines. A `find` that descends `node_modules` reports 381 and 370, so any inventory that skips the prune overstates these trees by roughly 2x. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:28][SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:45]
2. The advisor's default suite disables file parallelism across its whole default set while the stress config carries the same setting for a documented reason (daemon, socket and lease churn); the default config carries no such rationale beside the setting. That makes serial execution of the ordinary suite the largest config-level cost multiplier in this tree. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:40][SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:10]
3. The two advisor configs partition rather than stack: stress opt-in replaces the default set, and the stress files live in `stress-test/` (21 files) while the default set is `tests/**`. Running both in one CI job is therefore complete coverage, not a duplicate run. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:28][SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts:14]
4. Three advisor suites do run twice per push: `routing-registry-drift.yml` runs `tests/routing-golden-prompts.vitest.ts`, `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` and `tests/parity/local-native-divergence-ratchet.vitest.ts` explicitly, and the stress workflow's default run collects the same three through `tests/**`. Each copy needs its own install and build first. [SOURCE: .github/workflows/routing-registry-drift.yml:277][SOURCE: .github/workflows/skill-advisor-stress.yml:94]
5. The deep-loop serial list is not the cost driver: its patterns select 12 of 173 test files, so 93% of the suite already runs in the parallel project and only 7% is serialized. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:16]
6. `deep-loop-runtime.yml` re-runs the compiled-contract drift check that the commit hook already runs before every commit that stages a deep-loop source, which is a duplicate guard but a cheap one at a measured 0.09s. [SOURCE: .github/workflows/deep-loop-runtime.yml:72][SOURCE: .skilled/scripts/git-hooks/pre-commit:859]
7. Both slow workflows install and build before the first test: the advisor job builds the shared package its stress suite loads, and the deep-loop job installs both the runtime and the shared package it links. In both, the suite is the payload and the install is the toll. [SOURCE: .github/workflows/skill-advisor-stress.yml:72][SOURCE: .github/workflows/deep-loop-runtime.yml:61]

## Ruled Out

- Deleting the deep-loop serial list as overengineering: it serializes 12 of 173 files for a documented reason (tests that measure elapsed time, kill child processes or race the graph lock), so it buys determinism for 7% of the suite.
- Treating the advisor's two suites as a duplicate run: the include patterns are disjoint by design, and the config comment records that running them together fails on shared daemon state.
- Reporting the tree sizes from an unpruned `find`: 381 files would have overstated the advisor tree by 106%, so the inflated count is rejected.

## Dead Ends

- No measurement separated advisor install time from test time. The workflow mean of 457s bounds the total and includes queue time, so the split between install and suite remains estimated rather than measured.

## Edge Cases

- Ambiguous input: none this iteration; the focus was explicit.
- Contradictory evidence: the spec's own directory census (186 advisor files) disagreed with an unpruned `find` (381). The spec was right and the measurement was wrong; the prune corrected it, which is recorded as finding 1 so the method is not repeated.
- Missing dependencies: `npx vitest --reporter=json` would give per-file durations but would run the suite; out of budget and out of scope for a research lineage.
- Partial success: none.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/package.json:1`
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:10`, `:28`, `:40`
- `.skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts:14`
- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:16`, `:45`
- `.github/workflows/skill-advisor-stress.yml:72`, `:94`
- `.github/workflows/deep-loop-runtime.yml:61`, `:72`
- `.github/workflows/routing-registry-drift.yml:277`
- `.skilled/scripts/git-hooks/pre-commit:859`
- Measured: 185 files / 35,199 lines (advisor), 174 files / 86,618 lines (deep-loop), 12 serial of 173 deep-loop files, 21 stress-test files.

## Assessment

- New information ratio: 1.0
- Questions addressed: Which tests under .skilled/skills/*/runtime are redundant, mirror the implementation, or re-assert the framework, and what does each suite cost on the commit and push path? Which test infrastructure costs run time or maintenance without proportional coverage?
- Questions answered: none newly answered; both questions were answered in iteration 3 for the spec-kit tree and this iteration adds the advisor and deep-loop trees without closing a new question.

## Reflection

- What worked and why: reading the vitest configs before the tests found the cost multiplier (serial execution of the whole default set) and falsified the serial-list hypothesis in two reads.
- What did not work and why: the first census included `node_modules` and overstated file counts by 2x; pruning and cross-checking against the spec's own numbers caught it before it became a finding.
- What I would do differently: prune `node_modules` in every `find` from the first call; the spec's census is the reference number to test any new count against.

## Recommended Next Focus

Test files under `specs/` — about 110 of them, mostly in one closed packet. Determine which guard shipping behavior, which guard retired code, and what each would stop catching if the packet is closed.
