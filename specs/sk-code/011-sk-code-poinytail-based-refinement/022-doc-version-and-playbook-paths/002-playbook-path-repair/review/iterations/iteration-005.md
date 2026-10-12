# Iteration 005 -- Maintainability (version surfaces, changelog fidelity, piped-report test)

Run 1, iteration 5 of 5. Dimension: maintainability. Target: commits `41302e72be..HEAD` on `worktrees/118-playbook-paths` -- the validator change (`pathPresent` symlink rule, `INSTALLED_RELEASE_STATE_RE` skip, tests) and the backticked path corrections across 223 manual-testing-playbook files. The iteration asks: (1) is the version consistent across all five sk-doc surfaces, the changelog and the Hermes mirror; (2) does the changelog describe the validator change accurately; (3) are the two new code comments durable (no packet ids); (4) is the piped-report test still meaningful; (5) does any leftover out-of-scope stale text now contradict the playbooks.

## Dimension

Maintainability: version-surface consistency, changelog fidelity, comment durability, regression-test meaningfulness (review-core.md: P2 covers maintainability follow-ups; the evidence rule is applied to the one new finding). Core protocols: `spec_code`, `checklist_evidence`. Overlay: `playbook_capability`, plus `skill_agent` exercised on the version surfaces. `agent_cross_runtime` and `feature_catalog_code` were covered in iteration 3 and are not re-entered.

## Files Reviewed

- `.skilled/skills/sk-doc/SKILL.md:5`
- `.skilled/skills/sk-doc/ROUTER.md:11`
- `.skilled/skills/sk-doc/description.json:4`
- `.skilled/skills/sk-doc/hub-router.json:3`
- `.skilled/skills/sk-doc/mode-registry.json:3`
- `.skilled/skills/sk-doc/changelog/v2.3.7.0.md:1-31`
- `.hermes/skills/sk-doc/SKILL.md:5`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json:1`
- `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json:1`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:378-397` (two new comments, `INSTALLED_RELEASE_STATE_RE` at `:381`, `pathPresent` at `:394-397`), `:416` (call site)
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:157-163` (new rule tests), `:289-297` (piped-report rewrite); helpers `:40-49`
- Added lines of `git diff 41302e72be..HEAD` (stale-text sweep over all 234 scope files)

## Findings by Severity

### P0

None.

### P1

None new. R1-P1-001 (carried, active) remains the only P1: at HEAD the fleet validator prints exactly one `BACKTICK_PATH_UNRESOLVED` warning (`.cursor/worktrees.json` at `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:14`) while no Remaining row documents it. Not re-raised here; no new P1 this iteration.

### P2

#### R5-P2-001 -- Piped-report regression retains the `fleet` naming after switching to a seeded single-package run

The regression now copies the fixture, seeds 1,500 unresolved paths and runs one package through `runCli(packageRoot, ['--strict'])`, but the local binding is still `fleet` and both assertion messages still say `fleet report` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:293]). A future failure of the seeded run will be reported as a fleet failure and point a maintainer at the corpus instead of the fixture. The regression itself is sound (answer 4 below); only the naming lags the change. Recommendation: rename the binding and reword the two messages to seeded-report wording; test behavior unchanged. Confidence 0.9; downgrade trigger: naming updated in any follow-up.

## Answers to the Iteration Questions

1. **Version consistency -- consistent.** `2.3.7.0` appears in `SKILL.md:5`, `ROUTER.md:11`, `description.json:4`, `hub-router.json:3`, `mode-registry.json:3`, the changelog title and `.hermes/skills/sk-doc/SKILL.md:5`. The only `2.3.6.0` left under sk-doc is its own historical changelog. The sequence `v2.3.6.0` to `v2.3.7.0` is dense (no gaps). The compiled manifests carry no version field; both re-mint `effectivePolicyHash` `609a6134...` to `a17f1261...` at the same `generation: 5` ([SOURCE: .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json:1]), and all three installed checks exit 0.
2. **Changelog accuracy -- accurate.** All three claims map to the diff: symlink resolution to `pathPresent` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:394]) plus the `backtick-dangling-symlink` test; release-state skip to `INSTALLED_RELEASE_STATE_RE` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:381]) plus the `backtick-installed-release-state` test, which keeps the `.skilled/releases/base.json` negative control ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:157]); the pipe-test claim (1,500 unresolved paths) matches `length: 1500` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:292]) and the corpus backlog at HEAD (one warning). The changelog line `Both now resolve, and the warning stays report-only` matches the unchanged warning-severity path.
3. **Comment durability -- durable.** The two new validator comments state the durable WHY: `/doctor:update` writes its release state into an installed tree the source repository never holds ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:378-380]), and a symlink is a repository path while its build target may be unbuilt ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:392-393]). The rewritten test comment explains why a seeded package replaced the corpus-dependent run ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:289-290]). No packet ids, spec paths or REQ/ADR/task ids appear in any comment.
4. **Piped-report test -- still meaningful.** `runCli` captures stdout through `spawnSync` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:40-49]), so the pipe path is exercised; the fixture deterministically seeds enough unresolved paths that the report must exceed one 64 KiB pipe buffer, and the two assertions pin complete delivery (`stdout.length > 65536`) and trailer integrity ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:294-295]). The suite exits 0 with `piped report regression: PASS (2 assertions)`. The rewrite hardens the test: the old form depended on the whole-corpus warning backlog, which shrank to one warning and would eventually have stopped exercising the buffer path. Residue: the `fleet` naming (R5-P2-001).
5. **Leftover stale text -- none introduced.** An added-line sweep over the full 234-file diff found no warning-count or validator-behavior claim beyond the changelog description itself; `BACKTICK_PATH_UNRESOLVED`, `isExpectedUnresolved` and `pathPresent` appear nowhere outside the validator and its test. `.hermes/skills/sk-doc/` holds only the mirrored SKILL.md, so nothing else needed the version. Carried P2s R1-P2-001, R2-P2-001 and R3-P2-001 remain the tracked residue for packet-level text; none is newly contradicted.

## Traceability Checks

- **spec_code (partial)**: the changelog and version surfaces map to the change they describe; spec-side REQ rows were verified in iteration 3 (SL-016) and are not re-entered.
- **checklist_evidence (not applicable)**: no acceptance-criteria row is scoped to maintainability.
- **skill_agent (pass)**: `2.3.7.0` consistent across the five surfaces plus the Hermes mirror; `compiled-route-sync --check` (55/55 served copies match), `compiled-route-guard` (sk-doc fresh) and `sync-skills-hermes --check` (68 copies) all exit 0.
- **playbook_capability (pass)**: added-line sweep; no playbook claim contradicts the new rules.
- **agent_cross_runtime / feature_catalog_code**: not re-entered (covered in iteration 3).

## Proof Runs

- `node .skilled/bin/compiled-route-sync.cjs --check` -> exit 0; 7 hubs resolve; 55/55 served copies match their authored files.
- `node .skilled/bin/compiled-route-guard.cjs` -> exit 0; all seven hubs fresh.
- `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` -> exit 0; PASS 68 Hermes skill copies in sync.
- `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` -> exit 0; piped report regression PASS (2 assertions); fixture suite PASS.
- Version grep across the six surfaces -> `2.3.7.0` only.
- Added-line sweep over `git diff 41302e72be..HEAD` with case-insensitive filters for BACKTICK, unresolved and warning-count wording -> changelog and test lines only.

## Next Dimension

None -- iteration 5 of 5 is the terminal iteration; synthesis follows. Maintainability coverage is complete.

## Verdict

No new P0 or P1 findings; one new P2 (R5-P2-001). The carried active P1 R1-P1-001 keeps the run at CONDITIONAL under the mapping rule.

Review verdict: CONDITIONAL
