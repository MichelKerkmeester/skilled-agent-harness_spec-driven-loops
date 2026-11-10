# Iteration 016 — Verification of two executor-only findings

## Focus

Verify, with exact `path:line` and a command for each, the two findings that so far rested only on executor evidence:

1. The ai-council `external-cli` mode has no dispatch runtime.
2. A fan-out with `stopPolicy=max-iterations` and no per-lineage cap fails every lineage only *after* it has run.

## Actions Taken

1. `rg` for `if_cli_`, `runAuditedExecutorCommand`, `buildLineageCommand`, `dispatchSeat`, `dispatchCouncilSeats` across `.skilled/commands/deep/assets` and `.skilled/skills/system-deep-loop/runtime`.
2. Read `runDivergentPivot` and `dispatchCouncilSeats` to find production callers and whether a `dispatchSeat` is supplied.
3. Widened the ai-council search to its own scripts directory (`.skilled/skills/system-deep-loop/deep-ai-council/scripts`), which sits outside `runtime/` and was therefore missed by the runtime-scoped search.
4. Read `orchestrate-session.cjs` `dispatchSeat` body and its injection into `runtimeExecutorConfig`.
5. Read `findMaxIterationsPolicyViolation`, its sole production call site, and the prompt/argv builder around `hasIterationCap`.
6. Ran the covering unit test read-only: `npx vitest run tests/unit/fanout-run.vitest.ts -t "max-iterations" --no-coverage` → `Test Files 1 passed (1)`, `Tests 19 passed | 154 skipped (173)`, exit 0.

## Findings

### f-iter016-001 — The "ai-council external-cli has no dispatch runtime" finding is FALSIFIED (P2, correction)

There *is* a council dispatch runtime and it is wired:

- `dispatchSeat` is defined and spawns a seat subprocess with the resolved executor kind and model [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:359].
- The session injects it into the executor config before topic orchestration: `runtimeExecutorConfig.dispatchSeat = options.dispatchSeat || ((seatInput, dispatchContext) => dispatchSeat(...))` [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:791].
- `dispatchCouncilSeats` itself refuses to run without such a function [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:140].

The production callers of `dispatchCouncilSeats` outside tests are exactly one: `runDivergentPivot` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1524], and it **does** supply `dispatchSeat`, taken from its own validated options (it throws `dispatchSeat must be a function` otherwise). So the answer to the focus question is: one caller, and yes it supplies the function.

Verify: `rg -n "dispatchSeat" .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts`.

### f-iter016-002 — NARROWED replacement: `executor.mode` is inert, and `in-cli` is the unimplemented side (P2, drift)

The real defect is the inverse of the original claim. No non-test script reads `executor.mode` or the string `external-cli`. Every hit for `external-cli` outside tests is documentation: the YAML schema description, the compiled contract, the presentation asset and `ai-council.md`. The only source-level `executor.mode` hit is the contract compiler's field list [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:110], which names the field but does not branch on it.

Consequence: the default dispatch path calls `runSeatSubprocess` unconditionally [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:389]. So `--executor-mode=external-cli` changes nothing a script can observe, and `in-cli` — the documented default — is honoured only if a model-authored step supplies its own `dispatchSeat`; the runtime default is an external spawn either way. This is the release-line's "documented switch with no implementation" class, not a missing runtime.

Verify: `rg -n "external-cli|executor\.mode" .skilled/skills/system-deep-loop --glob '!**/tests/**' --glob '*.cjs' --glob '*.ts'` → documentation and the compiler field list only.

### f-iter016-003 — CONFIRMED: a missing per-lineage cap is rejected only after the lineage has run (P1, bug)

`findMaxIterationsPolicyViolation` returns `stopPolicy=max-iterations requires a positive lineage iteration cap` when `lineage.iterations` is absent or non-positive [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1133].

The only production call site is inside the per-lineage post-result handler, after the subprocess has returned and after `savedStdout`, `exitCode`, `salvage` and `stateRead` are computed [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4036]; the violation then throws and marks the lineage failed [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4101]. There is no pre-dispatch call site — the remaining references are the export and tests.

The cost is a full wasted run, not an immediate config error: the argv builder still dispatches with the default cap, `const maxIterations = lineage.iterations || 12` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1759], and the prompt only carries the forced-depth stop clause when a cap exists [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1658]. So the lineage runs twelve iterations, then is rejected for having no cap. "Every lineage" holds when `stopPolicy` is set globally and no lineage carries `iterations`; this run's own config has an empty `fanout.lineages` list, which is that shape.

Verify: `rg -n "findMaxIterationsPolicyViolation" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` → definition `1125`, sole call `4036`, export `4302`.

### f-iter016-004 — Coverage exists but is unit-only; ordering is untested (P2, test gap)

The behaviour is covered at unit level [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:613], and the filtered run passes (19 passed, 154 skipped, exit 0). A second call exists in an integration test [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts:538]. Neither asserts *when* the check runs relative to dispatch, so the ordering defect in f-iter016-003 can regress while all tests stay green.

## Questions Answered

None of the strategy's three remaining key questions were answered this iteration; both focus items were finding-verification tasks. `answeredQuestions` is therefore empty.

## Questions Remaining

- Hub canon (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its modes — still unproven.
- UX: the three `*-presentation.txt` assets, two of them still unread.
- Executor failure handling (v4.0.0.3, v4.0.0.16): what a single-executor run records for a devin `resource_exhausted` or a builder throw — twelfth carry.
- New: is any model-executed step contractually required to supply an in-cli `dispatchSeat`, or does `in-cli` silently become an external spawn? f-iter016-002 leaves this open.

## Next Focus

Close the in-cli dispatch question by reading the ai-council auto YAML's `step_build_session_state` contract for a required `dispatchSeat` output, and check whether `orchestrate-session.cjs` validates `options.dispatchSeat` at all. Then the hub-canon `package_skill.py --strict` sweep.

## SCOPE VIOLATIONS

None. All reads were read-only; the vitest run used the existing install with no build or install step. Writes were confined to this iteration's narrative, delta and gateway record.
