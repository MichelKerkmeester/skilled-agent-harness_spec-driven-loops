# Iteration 001 — Correctness

**Dimension:** correctness
**Iteration:** 1 of 5
**Target:** `git diff 4b9bf840b0..HEAD` on `worktrees/127-surface-messages` (commits 36cef9db0a, ed10d1f294, f9eb84c4fe)
**In scope:** R3 (3c pointer, compiled_routes repair string, guard authored-drift line) and R7 (missing authored closure in sync and the guard), plus tests T1–T4
**Read-only:** the reviewed files were not modified; writes were limited to the review run directory.

## Files Reviewed

- `.skilled/bin/compiled-route-guard.cjs` — full file, including the new `authoredDrift` and the new `main` print blocks
- `.skilled/bin/compiled-route-sync.cjs` — SPECS_ROOT fallback, `requireAuthoredRoot`, `main`, `check`, `build`, `finalize`/`reconcileActivation`/`revert` call graph
- `.skilled/bin/tests/compiled-route-manifest.test.cjs` — harness, pre-existing build tests (482–558), new T2–T4 (558–616)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` — `fail` and the 3c check
- `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` — helpers (`buildHub`, `runChecker`, `assertLine`) and T1
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` — `compiled_routes` repair
- Cross-reads: `README.md:1445`, `.skilled/bin/lib/compiled-route-layout.cjs`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/bin/check-no-spec-imports.cjs`

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R1-P2-001 [P2] The CLI build path's authored-root guard is not covered

- **Case:** a future edit drops or reorders `requireAuthoredRoot()` on the no-args build path [SOURCE: .skilled/bin/compiled-route-sync.cjs:1110] and the suite stays green. The new T2 spawns the CLI with `--check` only [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:572], and the existing build tests call `sync.build({ runtimeRoot })` directly with injected roots [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:491], which bypasses the CLI guard entirely.
- **Evidence:** sync main guards `--check` at line 1085 and the build path at line 1110, with the one-line catch at line 1115 [SOURCE: .skilled/bin/compiled-route-sync.cjs:1085] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1115]. Read of the test regions shows the only CLI spawn against a missing authored tree is the `--check` case at line 572; `--verify`, `--finalize` and `--revert` never read the authored root, so the build path is the only other guarded entry point.
- **Counterevidence sought:** searched the reviewed test file for a no-args spawn of the CLI in a pruned tree; none found. T2's sandbox is the natural place for one, and it does not use it.
- **Alternative explanation:** the guard is one shared function with two call sites, so a single CLI test may be judged representative; the spec asks for one test per behavior change, not per call site.
- **Final severity:** P2. **Confidence:** high.
- **Downgrade trigger:** an existing or added test that spawns the CLI with no mode against a missing `specs/` tree and asserts the one-line failure.
- **Finding class:** matrix/evidence.
- **Scope proof:** the reviewed test file is the only suite that spawns this CLI; the call-site pair is exhaustively listed in main.
- **Recommendation:** extend T2 to also spawn with no mode in its sandbox. The guard throws before any build write, so the assertion is the same single `SYNC FAILED:` line.

#### R1-P2-002 [P2] The authored twin is derived from the runtime layout, so diverging generations yield a wrong `authored-missing` path

- **Case:** a runtime root coherent under the legacy layout while the authored program has moved to the current layout (for example a `--revert` installs an older-generation runtime after the authored closure moved). `authoredDrift` derives the twin as `authoredRoot + path.relative(runtimeRoot, runtimeManifest)` [SOURCE: .skilled/bin/compiled-route-guard.cjs:70], which points at the retired legacy path under the authored root. The file is absent, so the hub is reported `authored-missing` with `restore <retired path>` [SOURCE: .skilled/bin/compiled-route-guard.cjs:76] even though an authored twin exists at the authored tree's own layout.
- **Evidence:** the layout module carries current `013-live-activation` [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:33] and legacy `010-live-activation` [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:40] activation roots, and layout selection reads the runtime root's code paths only. Before this change the authored side was resolved independently through `manifestPathIn(AUTHORED_ROOT, hubId)`; the change replaced that with the mirror-relative derivation.
- **Counterevidence sought:** in the live tree the runtime root carries the current layout and the authored `013-live-activation/activation` tree carries all seven hubs, so the steady state does not hit this. The pre-commit route-remint gate uses the same mirror-relative assumption for its authored copy target [SOURCE: .skilled/scripts/git-hooks/pre-commit:642], so the assumption is systemic rather than new.
- **Alternative explanation:** mirror-relative derivation may be the project's single documented model for the pair, which would make generation divergence an unsupported state rather than a bug.
- **Final severity:** P2. **Confidence:** medium-low (the case is constructible, not observed).
- **Downgrade trigger:** a migration runbook or test showing the runtime and authored layouts always advance together before the guard can observe them.
- **Finding class:** instance-only.
- **Scope proof:** the derivation is the only place the authored path is computed in the guard; the hook's parallel derivation shows the assumption is repository-wide.
- **Recommendation:** when the authored root exists and resolves a coherent layout, resolve the twin through the authored tree (or fall back to `manifestPathIn(authoredRoot, hubId)` alongside the derived path) before concluding `authored-missing`; keep the derived path only to name the missing file when the authored tree is gone.

## Verified Claims (no finding)

1. **R3, 3c pointer.** The message now carries the README block name [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:496], and the block exists at `README.md:1445` (`#### What Adapting \`sk-code\` Looks Like`). T1 pins the substring [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:660].
2. **R3, repair string.** It names the runtime activation manifest and its authored twin at the current layout, direction runtime → authored [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:160]. The claimed hook copy-back exists: the pre-commit route-remint gate copies the re-minted manifest to its authored twin and stages both [SOURCE: .skilled/scripts/git-hooks/pre-commit:676].
3. **R3, guard drift line.** Per drifted hub it names the runtime path and the authored twin and says to copy runtime over authored [SOURCE: .skilled/bin/compiled-route-guard.cjs:81], printed per hub [SOURCE: .skilled/bin/compiled-route-guard.cjs:174].
4. **R7, sync.** The `realpath` stack is gone: `specs/` is realpath'd only when present [SOURCE: .skilled/bin/compiled-route-sync.cjs:42]; `requireAuthoredRoot()` names the folder to restore [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061]; the catch prints one `SYNC FAILED:` line and exits 1 [SOURCE: .skilled/bin/compiled-route-sync.cjs:1115]. `--verify`, `--finalize` and `--revert` never reference `IMPL_ROOT`/`AUTHORED_RESOLVER`, so build and `--check` are the complete set of authored readers.
5. **R7, guard.** A missing authored manifest is `authored-missing` naming the path [SOURCE: .skilled/bin/compiled-route-guard.cjs:76] and feeds `failures`, so the guard exits non-zero instead of passing [SOURCE: .skilled/bin/compiled-route-guard.cjs:179].
6. **Tests T1–T4 exist and assert their behaviors** (checked statically; the suite was not executed because this worker may not write outside the run directory): T1 [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:660], T2 [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:572], T3 [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:586], T4 [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:604].
7. **Exclusions held.** The guard gained no `--fix` or automatic copy (X12), and the authored closure stayed under `specs/` (X16), observed in guard main and the layout constants.

## Traceability Checks

- **spec_code (core):** R3 and R7 map to the cited implementation lines in all six scope files. PASS on the CLI surfaces; the build-path test gap is R1-P2-001.
- **checklist_evidence (core):** the goal.md grep battery is satisfied on both sub-assertions (the checker carries `What Adapting`; the YAML carries `015-router-unification-program/013-live-activation`) — observed by grep, not by executing the composite command. Full checklist reconciliation is deferred; `tasks.md` was not re-read this iteration.
- **overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability):** pending, assigned to a later iteration.

## Scope Violations

None. No action outside the allowed write paths was needed; the reviewed files were not modified.

## Next Dimension

Iteration 2 → security.

Review verdict: PASS
