# Iteration 3: Maintainability of the Switch Tests and the Module Map

## Dispatcher

- Run: `fanout-kill-switch-cli-5-1794760565927-i99t40`
- Lineage: `kill-switch-cli-5`; pass-five area `kill-switch-cli`
- Operator review focus: pass-five code review of command surfacing; read `review-brief-5.txt` first; review the `kill-switch-cli` files plus docs that describe them; every finding carries `file:line` and a concrete input.
- Dimension this iteration: D4 maintainability. Iterations 1 and 2 close behavior and docs; this pass asks whether the tests would catch a future regression across the full switch set and whether the module map stays usable for the next change.
- Sources read this iteration: `review-brief-5.txt`, `review-scope-5.txt`, `review-focus-5.txt`, `deep-review-strategy.md`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:100-180`, `runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:140-345`, `runtime/tests/advisor-disabled.vitest.ts:1-115`, `runtime/tests/handlers/advisor-recommend.vitest.ts:100-130,380-420`, `runtime/tests/skill-advisor-cli-test-utils.ts:51-96`, `runtime/lib/README.md:95-145`, and the actual `runtime/lib` directory listing.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:100-180`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:140-345`
- `.skilled/skills/system-skill-advisor/runtime/tests/advisor-disabled.vitest.ts:1-115`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts:100-130,380-420`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:51-96`
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:95-145`
- `.skilled/skills/system-skill-advisor/runtime/lib/` directory listing (read-only `ls`)
- `.skilled/hooks/shared/hook-flags.cjs:331-350` (exported name set)
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81` (caller-side name set)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The launcher test that keeps the switch out of the daemon env covers two of the ten names the resolver honors** -- `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:124` -- The test sets only `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` in its parent env and asserts they are filtered `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:127-145]`. The caller-side set is `ADVISOR_DISABLED_FLAGS`, built from the master flag, its alias and the skill-advisor canonical plus every legacy alias `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-41,70-78]`. The filter is exact-set membership `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:312-315]`.
   Case: A future change adds `SYSTEM_SKILL_ADVISOR_DISABLED` (the canonical name) or `SYSTEM_HOOKS_DISABLED` (the master) to `CHILD_ENV_ALLOWLIST`. This test still passes because it never sets those names, and every later caller on that checkout is silenced by the daemon's inherited environment. The test's name promises the whole switch set; its fixture pins two names.
   Finding class: class-of-bug
   Scope proof: `rg -n "SYSTEM_SKILL_ADVISOR|SYSTEM_HOOKS_DISABLED|SPECKIT_SKILL_ADVISOR" runtime/tests/launcher-bootstrap.vitest.ts` returns only the two names in the fixture; `ADVISOR_DISABLED_FLAGS` has ten. The CLI test covers the other names at the client boundary, but only this test covers the launcher boundary.
   Affected surface hints: ["launcher-bootstrap.vitest.ts switch fixture", "CHILD_ENV_ALLOWLIST", "ADVISOR_DISABLED_FLAGS"]

2. **The CLI disable loop filters out every `MK_` name, so the direct-call path never exercises those aliases** -- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:221` -- The loop maps `ADVISOR_DISABLED_FLAGS.filter((flag) => !flag.startsWith('MK_'))` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:219-221]`. The comment's reason is that the resolver copies an `MK_` value onto its new name, so the *reason string* names the canonical name, not the `MK_` name. That reason explains a string mismatch, not a skipped abstain: the assertion that matters is `recommendations: []` and `daemon.calls.length === 0`, which holds for every alias. `ADVISOR_DISABLED_FLAGS` includes `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED` and `MK_SKILL_ADVISOR_PLUGIN_DISABLED` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81]`; the unit test covers only two `SYSTEM_`/`SPECKIT_` names `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/advisor-disabled.vitest.ts:23-28]`.
   Case: A change to `env-aliases.cjs` or to the legacy alias list drops the `MK_` bridge for the direct call. Every test still passes because the three `MK_` names are filtered out of the only test that drives the CLI under each alias, and the direct call stops abstaining for an operator who kept an `MK_` switch.
   Finding class: class-of-bug
   Scope proof: `rg -n "MK_SKILL_ADVISOR" runtime/tests` finds the names in `ADVISOR_DISABLED_FLAGS` consumers and the filter that excludes them; no test sets an `MK_` name and asserts the CLI abstains. The env-bridge test covers the bridge itself, not the CLI path.
   Affected surface hints: ["skill-advisor-cli-stale-daemon-retry.vitest.ts disable loop", "advisor-disabled.vitest.ts alias cases", "env-aliases.cjs MK_ bridge"]

3. **The lib module map omits five modules that exist on disk, and two of them are absent from the key-files table too** -- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:100` -- The DIRECTORY TREE lists `advisor-runtime-values.ts`, `affordance-normalizer.ts`, `command-attach.ts`, `error-diagnostics.ts`, `freshness.ts`, `generation.ts`, `metrics.ts`, `normalize-adapter-output.ts`, `policy-plan.ts`, `prompt-cache.ts`, `prompt-policy.ts`, `render.ts`, `skill-advisor-brief.ts`, `source-cache.ts`, `subprocess.ts` and five folders `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:100-122]`. The directory also holds `caller-context.ts`, `compiled-routing-flag.ts`, `df-idf.ts`, `private-skill-target.ts` and `route-exclusions.ts`. Three of the five are named in the KEY FILES table (`df-idf.ts`, `route-exclusions.ts`, `caller-context.ts`) `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:138-140]`, so the two sections disagree with each other as well as with the directory; `compiled-routing-flag.ts` and `private-skill-target.ts` appear in neither.
   Case: A maintainer uses the tree to decide where a new helper belongs and to see what already exists, and misses `compiled-routing-flag.ts` and `private-skill-target.ts`; the same reader trusts the key-files table for `df-idf.ts` and sees no tree entry, then checks the tree for the folder layout and concludes the table is the newer list. The map no longer answers either question reliably.
   Finding class: instance-only
   Scope proof: `ls runtime/lib/*.ts` returns the five missing names; the README tree lists none of them and the key-files table lists three. The same section's own package topology and directory tree disagree, which proves the drift is in the file, not in a renamed module.
   Affected surface hints: ["runtime/lib/README.md directory tree", "runtime/lib/README.md key files table", "runtime/lib"]

## Traceability Checks

- `spec_code`: pass for D4. The launcher fixture was read against `ADVISOR_DISABLED_FLAGS`, the CLI loop against the same set, and the README tree against the actual `ls` output. Each finding names the file, the line and the missing case.
- `checklist_evidence`: partial. The pass-five brief asks for test-quality and docs-vs-code checks; this iteration covers the switch tests and the module map, and the holdout rule stays counts-only.
- `feature_catalog_code`: notApplicable this iteration; the feature rows were checked in iteration 2.
- `playbook_capability`: pass; CP-003 was checked in iteration 2 and no test or map claim changes it.

## Integration Evidence

- The launcher fixture is the only test that exercises `createChildEnv` against the switch set `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:124-145]`; the CLI test's no-daemon case is the client-side counterpart `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:303-317]`.
- The CLI disable loop is the only test that drives the real `runSkillAdvisorCli` under each alias and asserts the daemon received no call `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:221-232]`; the unit test checks the resolver in isolation `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/advisor-disabled.vitest.ts:18-61]`.
- The lib README is the module map referenced by the runtime README and the handlers README `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:195-203]`, so its drift is read by the next area owner.

## Edge Cases

- The README's package topology lists folders such as `auth/`, `daemon/`, `derived/` and `lifecycle/` that are not in the directory tree `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:56-76]`. The tree is a flat-module list with only a subset of folders; the finding is scoped to the five flat modules that exist but are absent, not to every folder-level omission, because the topology is explicitly a package map rather than a file listing.
- The launcher test gap and the CLI `MK_` gap are different boundaries: one is the daemon child env, the other the caller-side abstain. They are reported separately rather than merged, because a fix at one boundary would not cover the other.
- The `advisor-recommend.vitest.ts` disabled tests clear every `ADVISOR_DISABLED_FLAGS` name before each case `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts:109,119]`, so the handler path does not share the two test gaps; no finding there.

## Confirmed-Clean Surfaces

- The unit resolver test pins the canonical, the hook alias, the truthy values, the master switch and the file precedence `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/advisor-disabled.vitest.ts:18-105]`.
- The CLI test's "still asks a warm daemon when no switch is set" control case proves the disable loop is not passing because every call abstains `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:286-300]`.
- The isolated CLI scope names a nonexistent flags file and deletes every `ADVISOR_DISABLED_FLAGS` name, so a developer's shell switch cannot make the suite pass vacuously `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts:65-83]`.
- The launcher test's exact-set assertion would catch any *extra* key the filter adds, including an unrelated one; the gap is only the missing switch names in the fixture `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:133-145]`.

## Ruled Out

- **The launcher filter itself still forwards a switch**: the allowlist contains no switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`; the finding is the test fixture, not the filter. Ruled out as a code finding.
- **The README's folder list is a file list and must name every folder**: the package topology is explicitly a folder map `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:54-76]`, and the flat-module tree is the file map. Ruled out for folders; the five flat modules are the finding.
- **The `MK_` filter is needed because the alias cannot work**: the resolver bridges `MK_` onto `SYSTEM_` at load `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:20-49]` and the CLI probe under `MK_SKILL_ADVISOR_DISABLED=1` abstains with the canonical reason; the filter is a string-reason convenience, not a behavior exclusion. Ruled out as a behavior finding.
- **A new test is needed for every alias in both files**: the CLI loop already parameterizes every non-`MK_` name; the fix is to stop excluding the three `MK_` names and assert the abstain, not to duplicate the loop. Ruled out as over-testing.

## Next Focus

- Dimension: all four (stabilization)
- Focus area: a final read over the active P2 set and the surfaces not re-read since iteration 1, plus the holdout rule. No new direction is opened; the iteration asks whether the three P2s are correctly scoped and whether any switch path was missed.
- Reason: D4 closes the last configured dimension; the run is at `maxIterations=4` after this iteration, so the loop needs one stabilization read before synthesis.
- Rotation status: D1, D2, D3 and D4 are covered; no new dimension remains.
- Required evidence: the registry's six active findings, the four iteration files, and a re-read of the two launcher and CLI test fixtures for counterevidence.
- Recovery note: none; the P2s are advisory and do not block a PASS under the mapping.

Review verdict: PASS
