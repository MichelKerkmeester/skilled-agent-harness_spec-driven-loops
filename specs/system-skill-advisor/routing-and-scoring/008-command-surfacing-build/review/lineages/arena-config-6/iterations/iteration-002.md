# Review Iteration 002

## Dimension

Primary dimension: **traceability**. The pass read the packet's claims about both changed behaviours — phase 035's per-run temp folder, and phase 032's arena listing repair — and checked each against the code and against every suite entry point the repository runs.

Review focus addressed: the operator focus asks for the `arena-config` area of `review-scope-6.txt` under the pass-six brief. This iteration kept the same three scope files and added only the packet docs and the suite entry points that make claims about them, so every checked claim is either about a scope file or about the surface that runs it. The recorded limits were not restated, no prompt corpus was opened and `.skilled/hooks/hook-flags.env` was not read.

## Dispatcher

- Mode: review, detached fan-out lineage `arena-config-6`.
- Session: `fanout-arena-config-6-1794815529929-dybl7p`, generation 1, lineage mode new.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/arena-config-6`.
- Budget: 60 tool calls, 10 minutes.
- Doctrine: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` loaded before severity calls.
- Sources read for this pass: `035-suite-metrics-and-start-shape/{spec.md,acceptance-criteria.md,tasks.md,implementation-summary.md}`, `032-review-pass-five-remediation/{tasks.md,acceptance-criteria.md}`, both vitest configs, `runtime/package.json`, `.github/workflows/skill-advisor-stress.yml`, and the `.opencode` mirror of both configs.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:5-18`
- `.skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts:1-40` (integration surface: the second suite config)
- `.skilled/skills/system-skill-advisor/runtime/package.json:16-17` (the two npm scripts that pick a config)
- `.github/workflows/skill-advisor-stress.yml:90-107` (the CI steps that run each suite)
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:451-466` (the writer whose records the fix is meant to contain)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape/spec.md:64`, `:32`, `acceptance-criteria.md:48-56`, `tasks.md:50`, `implementation-summary.md:60-64`, `:96`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:116`, `:164`, `acceptance-criteria.md:57`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The isolation lever reaches one of the two suite configs** -- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:14-15` -- The per-run folder is created in `vitest.config.ts` only. The advisor has a second config, `vitest.stress.config.ts`, which CI runs with the 240-second timeouts the stress suite needs, and it has no `TMPDIR` block. The packet's summary states the result without that limit: "Every test and every process a test spawns inherits it, so the advisor's metrics root, which resolves under `tmpdir()`, lands there." A stress run through that config inherits the operator's `TMPDIR` instead.
   - Case: an operator runs the documented stress command from the CI workflow (`npm run test:stress -- --config vitest.stress.config.ts`). `os.tmpdir()` stays the system folder, so any durable record the suite writes lands in `speckit-skill-advisor-metrics` beside the real ones. Today no stress test writes one — `mcp-diagnostics-stress.vitest.ts:101` calls `handleAdvisorValidate` without `outcomeEvents`, so `advisor-validate.ts:653-663` persists nothing — which is why this is an unenforced invariant rather than a live leak.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts:1-40]` (no `TMPDIR` assignment anywhere in the file); `[SOURCE: .github/workflows/skill-advisor-stress.yml:95]` (`npm run test:stress -- --config vitest.stress.config.ts`); `[SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:17]` (`test:stress` sets `SPECKIT_RUN_STRESS=true`, which the default config also reads, so the two commands take different configs for the same suite); `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape/implementation-summary.md:64]` (the unqualified claim).
   - User impact: the invariant the phase bought is enforced on one entry point only, so the next stress test that persists a record re-introduces the exact pollution the phase removed — after the phase closed as Complete.
   - Finding class: class-of-bug
   - Scope proof: the two configs are the only suite entry points under the advisor runtime (`git ls-files | grep 'vitest.*config'` returns exactly these two for the skill); `rg -n "TMPDIR|mkdtemp" runtime/vitest*.config.ts` returns the block in `vitest.config.ts` and nothing in the stress config, so an omission in one place is the whole class.
   - Affected surface hints: ["vitest.config.ts: per-run TMPDIR", "vitest.stress.config.ts", "skill-advisor-stress workflow", "lib/metrics.ts durable root"]
   - Recommendation: apply the same block in `vitest.stress.config.ts` (the file already builds its own config object, so the eight lines copy unchanged), or move the block into a small helper both configs import.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Phase 035's REQ-001 and AC-001 name `vitest.config.ts` and a per-run temp folder, and the file does exactly that at `:14-15`; phase 032's T053 names a raised buffer in the builder's `git` helper, and `prepare-behaviour-arena.mjs:144-152` carries it. |
| `checklist_evidence` | core | pass | Phase 035's T002 names the failing-then-passing run and records "0 sav- folders left after" seven runs; AC-001 records `SUITE 2325 passed` with unchanged shared counts; AC-005 records the removed folder. Phase 032's T053 records the failing first run (`spawn_failed`, ENOBUFS) and a 52-test pass; T043 records the `ok:true` arena build at `0173020dfc2` with 22 copied trees and two tracked dotenv files. The one gap is a summary sentence, not a checklist row. |
| `playbook_capability` | overlay | notApplicable | The playbook's metrics-folder line (`hooks/skill-advisor-hook-validation.md:104`) tells an operator to inspect the folder after a manual hook run, which no suite config changes. |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts:1-40` — the stress config declares `defineConfig` from `vitest/config`, the stress include glob, the spec-kit setup file and 240-second timeouts, and no environment assignment of any kind.
- `.skilled/skills/system-skill-advisor/runtime/package.json:16-17` — `test` is `vitest run` and `test:stress` is `SPECKIT_RUN_STRESS=true vitest run`; the latter loads `vitest.config.ts` unless `--config` overrides it, so the documented CI command and the npm script are two different configurations of one suite.
- `.github/workflows/skill-advisor-stress.yml:95` and `:106` — the stress step passes `--config vitest.stress.config.ts`; the default step below it runs `npm test`.
- `.github/workflows/skill-advisor-stress.yml:38` — `concurrency.cancel-in-progress: true`, the cancellation path iteration 1 named.
- `.opencode/skills/system-skill-advisor/runtime/vitest.config.ts:14-17` and `vitest.stress.config.ts` — the runtime mirror carries the same block in the default config and the same absence in the stress config, so CI running from the mirror behaves exactly as the `.skilled` tree does.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape/spec.md:48-52` — the in-scope list names the config, the start judgment and the summary, so the stress config was outside the phase's declared scope; the finding is against the claim, not against a task that failed to run.

## Edge Cases

- The stress config was outside phase 035's declared scope (`spec.md:48-52` names `vitest.config.ts`, the scorer and its summary). The claim is still the finding's subject: `implementation-summary.md:64` and the phase description say "the advisor suite" without the default-suite limit, and a reader closing the phase would treat the invariant as covered.
- No stress test writes a durable record today: `persistAdvisorHookOutcomeRecord` has one caller (`handlers/advisor-validate.ts:663`), and the only stress caller of that handler passes no `outcomeEvents`. That is why the finding stays P2; `advisorHookHealthSection` reads the folder and never writes it.
- Phase 032's T053 verify clause accepts `"ok":true` **or** "a refusal that is not `spawn_failed`", which alone would not prove the listing reads at all. T043 supplies the stronger evidence, so no finding is raised here; the weaker clause is noted rather than reported.
- The mirror was read, not treated as source of truth: `.opencode` and `.skilled` agree on both configs and on the builder, so no packaging drift is introduced by this branch.

## Confirmed-Clean Surfaces

- Phase 035's spec-to-code match is exact: REQ-001/AC-001 name `vitest.config.ts` and a per-run folder, and the file creates one with `mkdtempSync`, assigns it to `TMPDIR`, and removes it in an exit listener.
- Phase 032's T053 claim is reproduced: the fixture it describes prints 1,116,018 bytes of `git ls-files -z`, exactly the size T053 records, and the default cap truncates it at 1,114,112 bytes with `ENOBUFS`.
- Phase 032's T043 evidence is consistent with the code path it names: `buildArena` writes the marker lines and returns `{ok:true, dest, head, copied, trackedDotenv}` at `prepare-behaviour-arena.mjs:543-549,590`.
- The `.opencode` mirror of the builder carries the raised cap at line 148 and of the config at line 14, so the runtime CI runs the same code this review read.
- No scope violation occurred: writes stayed inside the lineage directory.

## Ruled Out

- A spec-to-code mismatch in phase 035: the spec, the task row, the acceptance rows and the code all name one file and one mechanism.
- A spec-to-code mismatch in phase 032's listing fix: the task names `maxBuffer: 512 * 1024 * 1024`, the builder carries it, and the fixture size is reproducible.
- A stale acceptance count that hides a missing run: the `51 passed` figure in AC-002 is a snapshot from T007, and T053 records the later run at 52 passed, which is one test more rather than a different suite.
- A second advisor suite entry point beyond the two configs: `git ls-files | grep -E 'vitest.*config'` finds no third config under the advisor runtime.

## Next Focus

- Dimension: maintainability
- Focus area: the two remaining costs of the changes — a regression test whose premise is not asserted, and a buffer overflow that still reports as `spawn_failed` above the new cap.
- Reason: correctness and traceability are covered; the two advisories left are about how cheaply the next reader can trust or diagnose these paths.
- Rotation status: correctness and traceability complete; security and maintainability remain.
- Blocked/productive carry-forward: productive — the checklist rows gave the fix's history without a live run.
- Required evidence: the new test body, the `git()` failure shape, and the recorder's code.
- Recovery note: none; no failed iteration.

Review verdict: PASS
