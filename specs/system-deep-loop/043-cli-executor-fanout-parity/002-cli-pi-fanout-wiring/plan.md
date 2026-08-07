<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: cli-pi Fan-out Lineage Wiring

<!-- ANCHOR:summary -->
## 1. SUMMARY
Replace the throwing `buildPiLineageCommand` stub with a real headless pi command builder, map each allowlisted pi model to its
provider, and add `reasoningEffort` to the cli-pi flag table. Verify by command-construction unit tests plus a live end-to-end dispatch.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- fanout-run, executor-config, and executor-audit vitest suites pass (full output, never through `tail`).
- Whole-runtime tsc is 0.
- The builder's own output dispatches successfully against real pi.
- `validate.sh --strict` passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`fanout-run.cjs` maps each executor kind to a lineage builder. The pi builder mirrors the opencode builder shape, calling
`finalizeLineageCommand`, but emits `pi -p --offline --model <provider>/<id>` because pi has no `--dir` or service-tier surface and
its exit code is not an auth signal. The provider map is a hand-duplicated literal (kept in sync with `pi --list-models`) so command
construction stays synchronous and unit-testable, matching the file's per-kind convention. `EXECUTOR_KIND_FLAG_SUPPORT` gains
`reasoningEffort` for cli-pi so the runtime forwards `--thinking`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Capture the per-model provider map from `pi --list-models`.
2. Implement `buildPiLineageCommand` (offline, provider-prefixed model, `--thinking`, read-only tool allowlist) and add the cli-pi `reasoningEffort` flag.
3. Update the stub-behavior tests to command-construction tests, add `--thinking`/read-only/invalid-level coverage, and run a live end-to-end dispatch.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Unit tests over the constructed command for all seven models, the `--thinking` mapping, the read-only tool allowlist, and the
invalid-level rejection; plus a live dispatch that spawns pi with the builder's own args and asserts real model output.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `pi` on PATH (0.82.1) and a reachable openai-codex provider for the live check.
- The audit phase's gap register (`001-executor-matrix-audit`).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
The change is additive to a single builder plus one flag entry and its tests; rollback is reverting those hunks. The full fanout
vitest suite is the tripwire for any regression.
<!-- /ANCHOR:rollback -->
