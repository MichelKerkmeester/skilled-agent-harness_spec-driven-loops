<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: sk-code / code-opencode Alignment for the system-deep-loop Runtime

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: Planned — no task is started; this is a captured backlog phase.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Resolve the code-opencode surface via the sk-code smart router.
- [ ] Capture the baseline whole-runtime vitest + tsc state.
- [ ] Decide scope: 036 clone-column output only, or the whole runtime including pre-036 modules.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Run the code-opencode audit; enumerate divergences with source citations.
- [ ] Align divergences in behavior-preserving units, re-verifying after each.
- [ ] Record accepted exceptions where alignment is not warranted.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Whole-runtime vitest + tsc green and unchanged vs the baseline (delta comparison).
- [ ] Every enumerated divergence aligned or documented.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Every enumerated divergence aligned or documented as an accepted exception.
- [ ] Whole-runtime vitest + tsc green and unchanged vs baseline.
- [ ] `validate.sh --strict` passes.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/036-deep-loop-innovation`
- Standard: sk-code smart router → code-opencode surface
- Predecessor: `019-runtime-code-readmes`
<!-- /ANCHOR:cross-refs -->
