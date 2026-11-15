# Iteration 2: Security and Maintainability of the Switch Set and Its Map

## Dispatcher

- Run: `fanout-kill-switch-cli-confirm-5b-1794780590351-ezt1v0`
- Mode: review; target agent: `@deep-review`; execution: single review iteration
- Lineage: `kill-switch-cli-confirm-5b`; confirming-round-`5b` area `kill-switch-cli`
- Operator review focus: confirming round `5b`; the round's `kill-switch-cli` half is "the kill-switch names agree in code and docs, and docs agree with code". Iteration 1 read the agreement; this iteration reads what the agreement costs and whether the fix widened a trust boundary.
- Dimension this iteration: D2 security and D4 maintainability. The switch is a safety control and the launcher child env is its trust boundary, so the security half re-reads the allowlist and the test isolation. The maintainability half counts the hand-maintained copies of the ten-name list and the two module-map sections.
- Sources read this iteration: `review-brief-5b.txt`, `review-scope-5b.txt`, `review-focus-5b.txt`, `verify-5/report.md`, `deep-review-strategy.md`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, `.skilled/bin/system-skill-advisor-launcher.cjs:125-180,305-340`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:45-100`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:126-145`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:150-160,218-240`, `.skilled/hooks/shared/hook-flags.cjs:38-106,240-285`, and the pass-five `kill-switch-cli-5` iteration 1 and 4 records as prior context.
- Steer channel: `steer.md` still does not exist in the lineage directory; no lead ruling was available for this iteration.

## Files Reviewed

- `.skilled/bin/system-skill-advisor-launcher.cjs:125-180,305-340` (context: the trust boundary the fixture pins)
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:45-100` (context: the per-case scope and flags-file isolation)
- `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:126-145`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:150-160,218-240`
- `.skilled/hooks/shared/hook-flags.cjs:38-106,240-285`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:39-60`
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:54-140`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:70-80`
- `.skilled/hooks/README.md:30-50`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None this iteration. The two iteration-1 findings stand as advisories and their root cause is the same one this iteration priced: four hand-maintained copies of one alias list. No separate finding is raised for the duplication, because that would count one defect twice; the recommendation on `c5b-iter1-P2-hooks-index-aliases` covers it.

## Traceability Checks

- `spec_code`: pass. The security claim the docs make is the one the code keeps: the disable switch is read by each caller in its own process and is absent from the daemon child env. `CHILD_ENV_ALLOWLIST` is an exact-set membership check with no `*_DISABLED` key in it `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-180,312-315]`, and the fixture now sets all ten names and asserts they are dropped `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:129-143]`.
- `checklist_evidence`: partial, unchanged from iteration 1. The confirming brief's kill-switch items are covered; no packet checklist row names this area.
- `feature_catalog_code` and `playbook_capability`: pass, carried from iteration 1 and re-read against the security half below.

## Integration Evidence

- `daemon-launcher`: the child env keeps three derived keys and the allowlisted operator keys, and a name outside the set cannot ride along `SYSTEM_`-prefix similarity because membership is exact `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:312-315]`. A flagged parent call therefore cannot make the shared daemon abstain for later callers, which is the property the fixture now exercises with all ten names rather than two.
- `cli-surface`: the CLI test scope names a `HOOK_FLAGS_CONFIG` that does not exist, so a developer's flags file cannot make a "no switch set" case abstain and cannot make a switched case abstain for the wrong reason `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:65-70]`. Each parameterized case gets its own `mkdtempSync('/tmp/sa-')` root `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:51-63]`, so the three added `MK_` cases cannot share a socket with a neighbour.
- `manual scenario`: CP-003's control call is the only place the ten names are written as a shell list; it unsets them and points the flags file at `/dev/null` `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`.
- `holdout hygiene`: the three prompt files were counted and not opened: `command-prompts.jsonl` 224 rows, `holdout-prompts.jsonl` 63 rows, `behaviour-fresh-prompts.jsonl` 36 rows. No reviewed file reads them and no prompt text was printed.

## Edge Cases

- The switch names are now correct in `ENV-REFERENCE.md:74-75` and complete in CP-003, but two hand-maintained lists remain: `hooks/README.md:44` (reported) and the ten `-u` options in `global-disable-flag.md:49` (correct today). The duplication is the maintenance cost this iteration measured; it is recorded once, on the finding that names the incomplete copy.
- `CHILD_ENV_ALLOWLIST` carries an explanatory comment about the absent disable switch immediately before the `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL` entry `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:159-161]`. Read as a statement about the allowlist's composition it is accurate; read as an annotation of the next key it is not. The file is not in the `5b` scope and the fixture pins the behavior, so this is recorded as a reading hazard, not a finding.
- The CLI test's `MK_` branch asserts one reason with the fixed prefix rather than the exact name. That is the load-time rename, not an unset fixture: `switchEnv` deletes every name in `ADVISOR_DISABLED_FLAGS` before setting the one under test `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:151-156]`. Ruled out as a test that cannot fail; see Ruled Out.
- `maxToolCallsPerIteration` is 12 and this iteration used more while reading the trust boundary and the test utilities. The overrun is recorded rather than hidden; no analysis action was skipped that the dimension needed, and the strategy carries the honest count.

## Confirmed-Clean Surfaces

- **The launcher child env cannot carry a switch.** Exact-set membership, no `*_DISABLED` name in the set, and the fixture asserts the full ten-name case `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-180,312-315]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:129-143]`.
- **A developer's flags file cannot bend the CLI disable loop.** Each scope points `HOOK_FLAGS_CONFIG` at a missing file and each case gets a unique temp root `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:51-70]`.
- **The resolver's decision order is master, canonical, legacy.** A `MK_` name that the bridge rewrites is therefore still caught, and no alias can shadow the master switch `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-271]`.
- **The docs do not leak prompt text.** The only strings the switch docs quote are switch names and CLI options `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:39-60]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74-75]`.
- **The alias list the tests read is the resolver's own.** Both tests import `ADVISOR_DISABLED_FLAGS`, so a resolver-side name addition reaches them without a second edit `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81]`.

## Ruled Out

- **The CLI `MK_` assertion can pass with the wrong switch set.** `switchEnv` deletes all ten names before setting one, the scope isolates the flags file, and the loop still asserts one reason, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls. Ruled out.
- **The three added `MK_` cases share state with each other.** Each case creates its own `mkdtempSync` root and socket directory. Ruled out.
- **Documenting the `MK_` aliases widens the attack surface.** The names were already honored by the resolver and bridged by `env-aliases.cjs`; the fix changes the doc, not the reader `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:31-49]`. Ruled out.
- **The launcher allowlist comment is a behavior defect.** The fixture pins the behavior the comment describes, and the file is outside the `5b` scope. Recorded as a reading hazard in Edge Cases. Ruled out as a finding.
- **A second master alias exists beyond `MK_HOOKS_DISABLED`.** `MASTER_ALIASES` holds one entry and `hook-flags.env.example` names no other `MK_` master. Ruled out.
- **The duplication of the alias list should be its own finding.** It is the root cause of `c5b-iter1-P2-hooks-index-aliases`, already recommended there; a second finding would count one defect twice. Ruled out.
- **`ADVISOR_DISABLED_FLAGS` order matters to either test.** One test iterates it, the other builds an object and counts keys; neither depends on order. Ruled out.

## Next Focus

- Dimension: none new; D1, D2, D3 and D4 are covered. The remaining work is the closeout record.
- Focus area: replay the two active P2 advisories against the files as they are now, confirm the registry counts, and write the synthesis for a `maxIterationsReached` stop.
- Reason: iterations 1 and 2 add no P1 or P0; the active set is two documentation advisories, so the verdict is PASS with `hasAdvisories: true` and the run cannot claim a graph-backed convergence.
- Rotation status: all four dimensions covered.
- Required evidence: the two finding rows, the two deltas, the two iteration files and the reducer's registry.
- Recovery note: if a third iteration finds a new class, the run still stops at `maxIterations=3`; a P1 would have to be re-raised as a task by the dispatcher, not fixed here.

Review verdict: PASS
