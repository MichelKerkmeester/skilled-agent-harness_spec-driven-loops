# Iteration 5: F-2-007 stress-suite gating and pending cells

## Focus

Frontier node F-2-007 (depth 2, scope runtime/tests/stress/cli-adapter, package.json, CI workflow files): Is the cli-adapter stress suite part of any default test or CI gate, and which matrix cells remain pending at HEAD?

The node was read as: prove the gate wiring from the config and workflow, then run the matrix's own bijection validator so "pending" is a measured state rather than a table reading.

## Actions Taken

1. Read the runtime `package.json` and `vitest.config.ts` project definitions.
2. Read `.github/workflows/deep-loop-runtime.yml`, including its path filters and the `npm test` step.
3. Read `matrix-manifest.ts`'s raw matrix, phase-two overlay and audit object.
4. Ran `validate-playbook-package.cjs`, then ran the underlying `vitest list` command to find why it reported zero discovered tests.

## Findings

1. **The stress suite is in the default test run and in CI, so the adapter contracts are gated.** `vitest.config.ts` puts `tests/stress/**/*.{vitest,test}.ts` in the serial project, which `npm test` (`vitest run --no-coverage`) collects. `.github/workflows/deep-loop-runtime.yml` runs that same command on pull requests and pushes touching `.skilled/skills/system-deep-loop/**` or `.skilled/commands/deep/**`. A change to an adapter or to the matrix therefore runs the hermetic adapter suites. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:16] [SOURCE: .skilled/skills/system-deep-loop/runtime/package.json:1] [SOURCE: .github/workflows/deep-loop-runtime.yml:90]

2. **Zero cells are pending in the matrix the audit reads.** `CLI_ADAPTER_STRESS_MATRIX` is the seed table with `testStatus: pending` for every non-codex cell, but `CLI_ADAPTER_CURRENT_MATRIX` overlays `CLI_ADAPTER_PHASE_TWO_ROWS` and `CLI_ADAPTER_FANOUT_ROWS` on it, and the audit tests that overlay. `fanout.vitest.ts` asserts `allAdapterBound: true`, `allSubjectBound: true` and no forbidden overclaims, and that assertion is part of the gated suite. Reading the seed table alone would wrongly report 112 pending cells. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:131] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:147] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:359]

3. **The matrix's bijection validator fails at HEAD with 126 of 126 tests "missing", because its parser cannot read the current `vitest list` output.** The validator spawns `npx --no-install vitest list tests/stress/cli-adapter --configLoader runner` and keeps only lines that start with `tests/stress/cli-adapter`, but the current output prefixes every line with the project name, for example `[serial] tests/stress/cli-adapter/cli-pi.vitest.ts > ...`. It discovers 0 tests and reports 126 missing, exit 1. The test bodies and the phase-two names exist; the parser is stale. Stripping an optional `[...] ` prefix would restore the bijection. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:100] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:116]

4. **No workflow runs that validator, so its FAIL is invisible.** A search of `.github/workflows` finds the sk-doc `validate-playbook-package.cjs` in `playbook-operator-contract.yml`, but no invocation of the cli-adapter validator; the deep-loop workflow runs only the vitest suite. The manifest-integrity test checks the audit object, not the test-name bijection, so the two halves of the claim are separately gated and one half is not gated at all. [SOURCE: .github/workflows/playbook-operator-contract.yml:67] [SOURCE: .github/workflows/deep-loop-runtime.yml:86]

## Questions Answered

- Is the cli-adapter stress suite part of a default test or CI gate? Yes: default `npm test` via the serial project, and the deep-loop CI workflow on the relevant paths. Finding 1.
- Which matrix cells remain pending at HEAD? None in `CLI_ADAPTER_CURRENT_MATRIX`; the seed table's pending cells are overlaid by implemented phase-two and fanout rows. Finding 2.
- Why does the matrix validator disagree? Finding 3: a stale parser, not missing tests. Finding 4: the validator is not wired into CI.

## Questions Remaining

- Whether the validator should be a vitest test in the gated suite or a workflow step; the test placement is cheaper to keep honest.

## Recommended Next Focus

Frontier node F-2-008: whether any runner path reads `EXECUTOR_SESSION_ENV_BY_KIND` and persists a provider session id for a `--only-lineage` rerun.

## Ruled Out

- **Treating `CLI_ADAPTER_STRESS_MATRIX` as the live matrix.** The overlay is the live object and the audit proves it; the seed table is documentation of the phase-one state.
- **Adding another CI workflow for the validator.** The existing deep-loop workflow already installs and runs the suite; one added step is enough.
- **Rewriting the validator to import the tests instead of listing them.** `vitest list` is the supported discovery surface; the parser, not the mechanism, is wrong.

## Dead Ends

- Grepping workflows for `cli-adapter` or `validate-playbook-package`: only the sk-doc validator appears, which is a different path and a different package.

## Edge Cases

- Ambiguous input: "pending at HEAD" could mean the seed table or the audit view. Both are reported; the audit view is the one that gates.
- Contradictory evidence: the README says the validator "proves that each row resolves to exactly one running test"; the run shows 126 missing. The README describes the intent, the parser is stale. Recorded, not collapsed.
- Missing dependencies: none. `npx --no-install vitest` resolved locally.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:16`
- `.skilled/skills/system-deep-loop/runtime/package.json:1`
- `.github/workflows/deep-loop-runtime.yml:90`
- `.github/workflows/deep-loop-runtime.yml:86`
- `.github/workflows/playbook-operator-contract.yml:67`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:131`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts:147`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:359`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:100`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/validate-playbook-package.cjs:116`

## Assessment

- New information ratio: 0.75
- Questions addressed: gate wiring and pending-cell state.
- Questions answered: both.
- Finding mix: 2 fully new (the stale parser, the unwired validator) and 2 partially new confirmations (the serial-project gate, the overlay).

## Reflection

- What worked and why: running the validator and then its underlying command separated "the tests are missing" from "the parser is stale" in two calls; the exit code alone would have been misleading.
- What did not work and why: reading the seed matrix first suggested 112 pending cells; only the overlay and the audit made the live state clear.
- What I would do differently: start from `CLI_ADAPTER_CURRENT_MATRIX` and the audit, then explain the seed table as history, rather than the reverse.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was written.
