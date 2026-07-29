<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Deep-loop Executor / Provider / Model Matrix Audit

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: In Progress — the initial config/builder findings are seeded in spec.md; the matrix is not yet frozen.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Capture `EXECUTOR_KINDS`, flag-support tables, and model rosters from `executor-config.ts`.
- [x] Classify each `fanout-run.cjs` lineage builder as real / stub-throws / missing.
- [ ] Capture each CLI's headless contract from its cli-X SKILL.md and live `--help`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Cross-map every provider and model per executor kind.
- [ ] Record per-mode executor availability from the deep auto-YAMLs and mode contracts.
- [ ] Assemble the full (cli × provider × model × mode) matrix with citations.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Assign a disposition (wire / enforce-scope-out / accept) to every gap.
- [ ] Spot-check sample rows back to their cited source; confirm no runtime file changed.
- [ ] Freeze the gap register; `validate.sh --strict` passes.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] The matrix covers all seven kinds × claimed providers/models × deep modes.
- [ ] Every gap carries a disposition and the register is frozen.
- [ ] `validate.sh --strict` passes; no runtime change.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/043-cli-executor-fanout-parity`
- Consumers: phases `002-cli-pi-fanout-wiring`, `003-devin-cursor-exec-hardening`, `004-per-mode-executor-parity`, `005-combo-test-matrix`
<!-- /ANCHOR:cross-refs -->
