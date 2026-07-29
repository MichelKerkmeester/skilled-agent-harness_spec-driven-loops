<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Deep-loop Executor / Provider / Model Matrix Audit

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: Complete — the support matrix and gap register are frozen in spec.md with a disposition for every gap. Completed via code inspection, live `--help` captures (devin/cursor/pi during 003-004), and the per-mode coverage cross-map; no runtime code changed.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Capture `EXECUTOR_KINDS`, flag-support tables, and model rosters from `executor-config.ts`.
- [x] Classify each `fanout-run.cjs` lineage builder as real / stub-throws / missing.
- [x] Capture each CLI's headless contract from its cli-X SKILL.md and live `--help`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Cross-map every provider and model per executor kind.
- [x] Record per-mode executor availability from the deep auto-YAMLs and mode contracts.
- [x] Assemble the full (cli × provider × model × mode) matrix with citations.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Assign a disposition (wire / enforce-scope-out / accept) to every gap.
- [x] Spot-check sample rows back to their cited source; confirm no runtime file changed.
- [x] Freeze the gap register; `validate.sh --strict` passes.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] The matrix covers all seven kinds × claimed providers/models × deep modes.
- [x] Every gap carries a disposition and the register is frozen.
- [x] `validate.sh --strict` passes; no runtime change.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/043-cli-executor-fanout-parity`
- Consumers: phases `002-cli-pi-fanout-wiring`, `003-devin-cursor-exec-hardening`, `004-per-mode-executor-parity`, `005-combo-test-matrix`
<!-- /ANCHOR:cross-refs -->
