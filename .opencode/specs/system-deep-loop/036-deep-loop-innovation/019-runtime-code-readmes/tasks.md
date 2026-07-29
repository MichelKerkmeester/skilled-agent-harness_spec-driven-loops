<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Code README Coverage for the system-deep-loop Runtime

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: Planned — no task is started; this is a captured backlog phase.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Enumerate every source-bearing folder under `runtime/` and its current README state.
- [ ] Decide the tests/scripts scope open question (module folders only, or include tests/scripts).
- [ ] Pull the sk-doc create-readme code-README standard as the authoring contract.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Author READMEs for the shared substrate modules.
- [ ] Author READMEs per clone column (schema, reducers, sealed, certificates, resume, shadow, rollback) across the eight lanes.
- [ ] Author READMEs for any remaining runtime code folders in scope.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Coverage sweep: zero in-scope folders without a README.
- [ ] Whole-runtime vitest + tsc unchanged (no-regression guard).
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Every in-scope runtime folder carries a conforming README.
- [ ] No runtime code or test file changed.
- [ ] `validate.sh --strict` passes.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/036-deep-loop-innovation`
- Standard: sk-doc create-readme (code-README format)
- Successor: `020-sk-code-opencode-alignment`
<!-- /ANCHOR:cross-refs -->
