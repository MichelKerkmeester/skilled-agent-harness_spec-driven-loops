# Iteration 1 - Code correctness and setup diagnostics

## Dimension

Correctness, security, and traceability, focused on the setup battery, its GitHub gate-input check, and their regression tests.

## Files Reviewed

- `.skilled/commands/doctor/scripts/git-setup-check.cjs:314`
- `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:68`
- `.github/workflows/gate-inputs.yml:16`
- `.github/scripts/check-gate-inputs.sh:126`
- `.github/scripts/tests/check-gate-inputs.test.sh:14`

## Findings by Severity

### P0 Findings

None identified.

### P1 Findings

None identified.

### P2 Findings

1. **The hook check accepts an installed target without confirming it is executable** -- `.skilled/commands/doctor/scripts/git-setup-check.cjs:351` -- An existing target that resolves to an accepted hook source passes the checks even when its execute permission is absent; `checkHooks()` returns PASS without checking mode or access.

   - Evidence: target presence and resolved-path checks are at [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:351] and [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:355]; the success path is [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:361]. The installer sets `+x` at [SOURCE: .skilled/scripts/install-git-hooks.sh:180], which is a readiness condition the diagnostic does not verify.
   - Finding class: false-healthy setup diagnostic.
   - Scope proof: `git-setup-check.cjs` is in the bound 25-file manifest.
   - Affected surfaces: `hooks` result and the overall `/doctor:git setup` status.
   - Concrete case: a valid symlink resolves to a regular hook file with mode `0644`; `existsSync()` and `realpathSync()` succeed, the source path is accepted, and the check reports PASS.
   - Recommendation: verify the installed target is a regular executable hook and add a fixture for a correct target with execute permission removed. The current fixture explicitly chmods its hook to `0755` at [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:351], so it does not exercise this case.
   - Counterevidence sought: the normal installer does set `+x`, and the current safe CLI run reports all 11 checks PASS. Those establish the normal path, but do not show that this diagnostic detects a later permission loss.

2. **OpenCode and Pi hook checks can mistake matching text for a registered handler** -- `.skilled/commands/doctor/scripts/git-setup-check.cjs:891` -- The check searches source text for an event token and `git-rule-checks.mjs` anywhere in the file; a comment or dead string can satisfy both without registering a handler.

   - Evidence: the two textual predicates and the resulting `registered` status are at [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:891]. The tests reject an empty stub and accept the real adapter at [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:913], but do not cover a non-registering file containing both tokens.
   - Finding class: false-healthy adapter diagnostic.
   - Scope proof: both the check and its test are in the bound manifest.
   - Affected surfaces: the OpenCode/Pi `ai-tool-hooks` result and advisory visibility for those runtimes.
   - Concrete case: a plugin file contains `// 'tool.execute.before'` and `// git-rule-checks.mjs` but has no exported hook object; the current OpenCode predicate still matches and reports it registered. Pi has the same co-occurrence problem for `.on('tool_call'`.
   - Recommendation: validate the handler registration structurally or through a focused runtime/fixture contract, and add comment-only/dead-string negative cases.
   - Counterevidence sought: the current OpenCode and Pi adapters do register their handlers. This finding concerns the detector's false-positive case, which the current empty-stub test does not model.

## Traceability Checks

| Protocol | Status | Evidence | Notes |
|---|---|---|---|
| `spec_code` | partial | The code and test assertions above; bound scope in `steer.md` | The code paths were traced to their test and installer context. Acceptance-criteria mapping is outside this code-first iteration's file slice. |
| `checklist_evidence` | partial | Safe syntax, runtime, and gate-check commands below | Fixture suites were inspected but not run because they create and remove temporary repositories and mutate Git state outside the lineage boundary. |

Safe checks run:

- `node --check .skilled/commands/doctor/scripts/git-setup-check.cjs` — passed.
- `bash -n .github/scripts/check-gate-inputs.sh` — passed.
- `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool codex --json` — exited 0; all 11 checks reported PASS and overall status was `OK`.
- `bash .github/scripts/check-gate-inputs.sh` — exited 0; `files=39 inputs_resolved=218 dynamic_inputs=9 twin_pairs=243 failures=0`; `RESULT: PASSED`.

## SCOPE VIOLATIONS

No out-of-lineage writes were attempted. The two fixture suites were not run: the Node suite uses `os.tmpdir()`, creates a temporary Git repository, and removes it [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:68]; the shell suite uses `mktemp -d` and `rm -rf` [SOURCE: .github/scripts/tests/check-gate-inputs.test.sh:14]. Those writes fall outside the bound lineage surface. This resolves the steer's “tests if safe” instruction in favor of the dispatcher's stricter lineage-only write limit.

The dispatcher also bound this process as the executor for every iteration, so this review is being run inline even though the workflow YAML's normal fan-out branch skips the inline loop. The coverage-graph seed step is omitted because it persists outside the lineage directory; no nested executor or graph write was invoked.

## Next Dimension

Review the `/doctor:git setup` command surface: routing, presentation, YAML behavior, references, and user-visible status semantics.

## Verdict
Review verdict: PASS
