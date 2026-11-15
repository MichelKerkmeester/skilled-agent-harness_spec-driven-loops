# Iteration 4 - Maintainability: the part's injection contract and the test it feeds

## Dispatcher

- Mode: review, single iteration, dimension `maintainability`.
- Lineage: `vibe-hooks-doctor-5`.
- Reviewed the Vibe part's dependency object and the doctor contract test whose title and coverage now disagree.
- Operator review focus: the pass-five brief's docs-against-code clause and the "Vibe journal scoring" boundary. This iteration read the part's injectable dependencies against the receipt paths, the doctor contract test's names against the checks it runs, and recorded that the journal scorer belongs to `accuracy-runner-5` and is not read here. Holdout hygiene stayed name-only.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:56-109,150-236`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts:1-210`
- `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:40-90,199-209`
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:1-371` (context)
- `.skilled/commands/doctor/scripts/README.markdown:240-262` (context)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The dependency object's `env` does not reach the receipt path, so a caller that injects only `env` still writes to and reads from the real temporary folder** -- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:68` -- `buildAdvisorPart` documents one injectable object "for deterministic tests" and accepts `env`, but `headReceiptDir` reads `process.env[SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR]` and `tmpdir()` directly, and the default `read`/`write` close over those process values. `env` therefore only changes the child-session test; the receipt location does not follow it.
   Finding class: partial_injection
   Scope proof: The part and its suite are declared scope files; the receipt directory is part of the module's public dependency surface because `read`/`write` and `env` are all accepted in the same object.
   Affected surface hints: Vibe head receipt, test isolation, `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`.
   Case: A test or scratch caller that passes `{ env: {}, isEnabled: () => true, run: async () => ({ hookSpecificOutput: { additionalContext: brief } }) }` and relies on the default read and write will write `<real tmp>/speckit-advisor/vibe-turn-start/<hash>.head`; a second call with the same session id then reads the first run's receipt and returns `''` instead of the brief, so the case depends on what earlier runs left in the real temporary folder.
   Evidence: `prompt-advisor.mjs:68-71` (process env and `tmpdir()`), `:79-109` (default read and write), `:203-209` (the injected object), and the suite's avoidance of the default path by injecting `read`/`write` at `vibe-prompt-advisor.vitest.ts:189-198`.

2. **The doctor contract test's name says it checks DSH only while it now asserts the Vibe rows too** -- `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:203` -- `MIRROR_CHECKS` is `[...DSH_CHECKS, ...VIBE_CHECKS]` and `routeGaps` iterates all six, but the test is still named for the three DSH checks. The workflow test beside it was left generic, so the route half of the Vibe contract is the one a reader cannot find by name.
   Finding class: test_naming_gap
   Scope proof: The contract test is a declared scope file and the changed line added the Vibe rows to the same array the test name describes.
   Affected surface hints: doctor contract test, CI failure attribution, Vibe mirror coverage.
   Case: Removing one Vibe `script_invocations` row makes this test fail with the name "the route declares all DSH checks in their check-only form", so the CI report says DSH while the missing row is Vibe, and a coverage reader grepping test names for Vibe finds no route case.
   Evidence: `doctor-runtime-mirrors-contract.test.cjs:68-88` (the two lists and the union), `:118-137` (the route gap walk over `MIRROR_CHECKS`), `:203-205` (the DSH-only name), `:207-209` (the generic workflow name).

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | The four dimensions are covered; the active P2s are behavior-boundary and test-naming gaps rather than requirement contradictions. Phase 030 `REQ-007`'s real-advisor cases hold. |
| `checklist_evidence` | core | partial | Phase 030 `AC-004`, `AC-005`, `AC-006`, `AC-007` and `AC-010` are Met with observable evidence; none covers the receipt injection or the route test name. |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | pass | The Vibe part is runtime-neutral, calls one shared handler, and labels the observation `vibe`; the hook contract's per-runtime table lists the same delivery channel. |
| `feature_catalog_code` | overlay | notApplicable | The feature-catalog pages are outside this lineage; the hook contract was checked in iteration 3. |
| `playbook_capability` | overlay | partial | The Vibe command-document scenario pins the parent and child arms; it does not pin the receipt path or the route test name. |

## Integration Evidence

- The turn-start composer passes the payload and no dependency override, so production uses the real temporary receipt path intentionally (`turn-start.mjs:97`).
- The doctor contract test reads the route manifest and the runtime-mirrors workflow through env overrides, so its fixture copy exercises the same `routeGaps` and `workflowGaps` walk the shipped pair uses (`doctor-runtime-mirrors-contract.test.cjs:36-38,269-305`).

## Edge Cases

- `reduceRepeatedHead` returns the context unchanged when the session id is missing (`prompt-advisor.mjs:167`), so the receipt path is never touched for such a payload; the injection gap needs a session id to appear.
- A receipt write failure is swallowed by design (`:106-108`), so a read-only temporary folder costs a repeated head, not an error.
- The dead `ERROR_POLICY` export at `prompt-advisor.mjs:51` has no consumer in the repository. Recorded as an observation; no finding, because the constant documents the part's fail-open policy and the DSH adapters export the same value.

## Confirmed-Clean Surfaces

- The Vibe suite runs the real advisor in an isolated scope, injects both receipts, deletes `AI_SESSION_CHILD` for the parent arm and pins the document line for all three prompts (`vibe-prompt-advisor.vitest.ts:68-129`).
- The hook suite's new label cases cover `claude`, `pi`, `dsh`, `vibe` and the `SPECKIT_RUNTIME=codex` path and restore the environment in `afterEach` (`claude-user-prompt-submit-hook.vitest.ts:27-29,95-101,212-243`).
- The doctor runner globs `*.test.cjs`, so the Vibe wiring suite and the contract suite both run in the `doctor-scripts` CI job (`tests/run-all.sh:90-96`).
- Holdout hygiene: no scoped file names a corpus file; the journal scorer was not opened, and the accuracy lineage owns it.

## Ruled Out

- **The Vibe suite writes receipts into the real temporary folder.** Ruled out: both `read` and `write` are injected with a `Map`, and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` and `TMPDIR` are pointed into the isolated scope (`vibe-prompt-advisor.vitest.ts:69-77,189-198`).
- **The contract test covers only the workflow half for Vibe.** Ruled out: `MIRROR_CHECKS` includes the three Vibe rows and both `routeGaps` and `workflowGaps` iterate it; only the name is stale.
- **The new label case leaks `SPECKIT_RUNTIME` into later cases.** Ruled out: `afterEach` restores all three environment names (`claude-user-prompt-submit-hook.vitest.ts:95-101`).
- **A Vibe-only doctor test is missing from CI.** Ruled out: `run-all.sh` globs every `*.test.cjs`, and the `doctor-scripts` job runs it.

## Next Focus

- Dimension: none remaining; synthesis
- Focus area: the lineage report, the release-readiness state and the convergence record.
- Reason: all four dimensions are covered and the loop has reached its four-iteration cap.
- Rotation status: correctness, security, traceability and maintainability complete (PASS with advisories).
- Blocked/productive carry-forward: no blocked approach; the receipt-injection and route-name gaps are the last two advisories.
- Required evidence: the registry's active counts, the four iteration final lines, the synthesis close-out record and the report.

Review verdict: PASS
