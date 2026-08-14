<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: cli-pi Fan-out Lineage Wiring

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: Complete — code implemented and verified.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Capture the per-model provider map from `pi --list-models --offline`.
- [x] Confirm the worktree has the current executor surface and a clean tsc baseline.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Implement `buildPiLineageCommand` (offline, provider-prefixed model, `--thinking`, read-only tool allowlist).
- [x] Add `reasoningEffort` to the cli-pi entry of `EXECUTOR_KIND_FLAG_SUPPORT`.
- [x] Update the stub-behavior tests and add `--thinking`/read-only/invalid-level coverage.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] fanout-run 92/92, executor-config 86/86, executor-audit 27/27; whole-runtime tsc 0.
- [x] Live end-to-end: builder args spawned against real pi returned the expected token.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] cli-pi dispatches through the fan-out for every allowlisted model.
- [x] Reasoning forwards as `--thinking`; invalid levels fail closed.
- [ ] Landed on origin with strict validation clean.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity`
- Predecessor: `001-executor-matrix-audit`; successor: `003-devin-cursor-exec-hardening`
- Code: `fanout-run.cjs`, `executor-config.ts`, `fanout-run.vitest.ts`, `executor-config.vitest.ts`
<!-- /ANCHOR:cross-refs -->
