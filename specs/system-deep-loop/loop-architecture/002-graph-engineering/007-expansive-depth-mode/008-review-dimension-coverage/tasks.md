---
title: "Tasks: Support custom review dimensions end to end (D10)"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review dimension coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Support custom review dimensions end to end (D10)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-deep-loop/runtime`. `DR` is `.skilled/skills/system-deep-loop/deep-review`. `Y` is `.skilled/commands/deep/assets/deep-review.yaml`. Every test command runs as `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/...` from the repository root. ADR-001 chose support; the enforce tasks were removed and the ids renumbered.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Get the operator's choice between enforce and support and record it as ADR-001 `Accepted` (`decision-record.md`). Verify: `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line. Done 2026-11-17: support.
- [x] T002 Capture the baseline of the REQ-004 and contract suites (`R/tests/`). Verify: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts tests/unit/prompt-pack.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0 and the pass count is written in `goal.md` section 4. Done 2026-11-17 on base `20dda00e4b9`: the six suites plus `divergent-pivot` and `stop-decision-yaml-contract` printed 8 files, 93 passed, exit 0; the four REQ-004 suites alone held 42.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the dimension universe: `REQUIRED_DIMENSIONS` then the configured custom names, lowercased, trimmed and deduped; pass the configured list into `buildDimensionCoverage` (new parameter, call at :1937, config at :2522-2537) and match `deriveDimension` (:1213-1220) against the universe (`R/scripts/reduce-state.cjs`). Verify: `npx vitest run tests/unit/deep-review-state-reducer.vitest.ts` passes with a `performance` coverage case, a `deriveDimension` case and a canonical-subset case whose registry keys are unchanged. Done in `45462106508`: `buildDimensionUniverse(config)` plus a `universe` parameter on `deriveDimension`, `buildDimensionCoverage` and `buildFindingRegistry`. The reducer suite passes 23 (3 new); both custom cases failed against the pre-change reducer, and the canonical-subset case passes either way.
- [x] T004 Route the strategy lists (:2173, :2178), both Next Focus fallbacks (:2185, :2272) and the dashboard rows (:2301) through the universe (`R/scripts/reduce-state.cjs`). Verify: `rg -n "REQUIRED_DIMENSIONS" R/scripts/reduce-state.cjs` shows it only in the universe builder, the constant and the export. Done in `45462106508`: the strategy lists, `pickReviewBaseFocus` (both Next Focus callers) and the dashboard rows read `Object.keys(registry.dimensionCoverage)`, built in universe order. `REQUIRED_DIMENSIONS` remains in the constant, the export, the universe builder and three default parameters.
- [x] T005 Accept custom names in the workflow: input text (:54, keeping the four canonical names listed), risk order (:628-641, custom names after the four), normalize rule (:644-654), registry seed (:782, four keys plus custom keys) and dimension table (:2324-2330, custom rubric row) (`Y`). Verify: `rg -n 'canonical dimension' Y` shows the new wording and `npx vitest run tests/unit/stop-decision-yaml-contract.vitest.ts` still passes. Done in `3d1dd2db673` and `8b44a506edb`: input text, risk order, normalize rule (`"correctness,performance"` example, trim/lowercase/dedupe, empty name fails), registry seed (the four literal keys then `{dimension_coverage_custom_seed}`) and a `<custom>` rubric row. `rg -n "canonical dimension"` prints the new wording; `stop-decision-yaml-contract` and `stop-policy-yaml-parity` pass 15.
- [x] T006 Replace the literal list at line 38 with `{review_dimensions_list}` and add `review_dimensions_list` to `render_prompt_pack.variables` (:1455-1470), rendered as the universe joined by `, ` (`DR/assets/prompt-pack-iteration.md.tmpl`, `Y`). Verify: `npx vitest run tests/unit/prompt-pack.vitest.ts` passes with a byte-identity golden for the default pack and a custom-list render case. Done in `0885897320a`: the pack line is `{review_dimensions_list}` and the workflow binds it. `prompt-pack.vitest.ts` adds the default-line and custom-list cases; the default template with the placeholder replaced equals the old template byte for byte (Node comparison, `true`).
- [x] T007 State the custom rubric rule in the agent definition at :170, :189 and :338 (`.skilled/agents/deep-review.md`). Verify: `rg -n 'custom' .skilled/agents/deep-review.md` prints the new lines. Done in `8b44a506edb`: three lines in `.skilled/agents/deep-review.md` (dimension choice, finding tag, `Custom (configured)` table row); `rg -n custom` prints them.
- [x] T008 Sync the agent mirrors (`.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.pi/agents/deep-review.md`, `.vibe/agents/deep-review.toml`, `.dsh/agents/deep-review.patch.yml`) with `/doctor:runtime-mirrors`. Verify: the command reports every deep-review mirror in sync. Done in `8b44a506edb`: the hand-kept `.claude/agents` twin edited, then `codex/sync-agents.cjs`, `pi/sync-agents-pi.cjs`, `dsh/sync-agents-dsh.cjs`, `vibe/sync-agents-vibe.cjs`; each `--check` exits 0 and `check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync`.
- [x] T009 [P] Name custom names as allowed in the setup presentation at :35 and :183 (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n 'custom' .skilled/commands/deep/assets/deep-review-presentation.txt` prints both lines. Done in `8b44a506edb`: the `review_dimensions` comment and the Q_dims prompt name custom names; `rg -n custom` prints both.
- [x] T010 [P] Add the custom-dimension rule after :62-82 and regenerate the snapshot (`DR/assets/review-mode-contract.yaml`, `DR/assets/review-mode-contract-snapshot.md`). Verify: `node DR/scripts/render-contract-snapshot.cjs --check` exits 0. Done in `8b44a506edb`: a `customDimensionRule` key beside the four-entry `dimensions` list (priority after-canonical, configured order, `requiredForSeverityCoverage: false`); `render-contract-snapshot.cjs --check` prints OK.
- [x] T011 [P] Add the custom-dimension note to the strategy and dashboard example lists (`DR/assets/deep-review-strategy.md`, `DR/assets/deep-review-dashboard.md`). Verify: `rg -n 'custom' DR/assets/deep-review-strategy.md DR/assets/deep-review-dashboard.md` prints the notes. Done in `8b44a506edb`: a note after the strategy D1-D4 list and the dashboard coverage line; `rg -n custom` prints both.
- [x] T012 [P] Replace "all 4 dimensions" with "every configured dimension (the four by default)" (`DR/references/convergence/convergence.md` :171, :201; `DR/references/protocol/loop-protocol.md` :206; `DR/references/protocol/quick-reference.md` :137, :158; `DR/README.md` :16, :45). Verify: `rg -n -i 'all (4|four) dimensions|four review dimensions' DR/references DR/README.md` prints nothing (seven lines match today). Done in `8b44a506edb`: seven lines reworded; the REQ-006 grep prints nothing (rg exit 1).
- [x] T013 Regenerate the review compiled contract, last of the implementation tasks (`.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`). Verify: `node R/scripts/compile-command-contracts.cjs --command deep/review --write` prints the contract path, and `npx vitest run tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0. Regenerate again after each merge instead of resolving digest lines by hand. Done: both contracts regenerated after the last digest-source edit, `check-contract-drift.cjs` prints `OK commands=2`, and `check-contract-drift` plus `compile-command-contracts` pass 26.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Add the custom dimension stop-path case (`R/tests/integration/review-depth-convergence.vitest.ts`). Verify: the case asserts `missingDimensions` excludes `performance` once covered and the run reaches `all_dimensions_clean`, and passes. Done in `8b44a506edb`: the reducer-built registry covers `performance`, the stop decision does not list it missing, and `reasonDetail` is `all_dimensions_clean`; the case fails against the pre-change reducer.
- [x] T015 Add a review-pivot case with a covered custom dimension (`R/tests/integration/divergent-pivot.vitest.ts`). Verify: the case accepts `all_dimensions_clean` and seeds no `unswept-dimension` for `performance`. Done in `a762572c909`: the pivot accepts `all_dimensions_clean` and returns no unswept-dimension candidate for `performance`; the case fails against the pre-change reducer. `divergent-pivot` passes 15.
- [x] T016 Run the spec-kit parity suites. Verify: `cd .skilled/skills/system-spec-kit && npx vitest run --project cli deep-review-contract-parity deep-review-reducer-schema` exits 0. Done: `deep-review-contract-parity`, `deep-review-reducer-schema` and `deep-review-auto-restart-contract` pass 18 (run with `--config ../../vitest.config.ts --project cli` from `system-spec-kit/runtime/cli`).
- [x] T017 Write the changelog entry stating custom review dimensions are supported, how they are ordered and that canonical-only runs are unchanged (`DR/changelog/`). Verify: `rg -l 'custom' DR/changelog` lists the new entry. Done 2026-11-17: `deep-review/changelog/v1.12.0.0.md` in compact format, minor bump for a feature change. `validate_document.py` reports 0 issues, DQI 89, and `check_changelog_shape.py` passes. The `rg` prints that entry.
- [x] T018 Write the manual testing playbook scenario for a review run with `review_dimensions: correctness,performance` through `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` (`DR/manual-testing-playbook/`). Verify: `rg -l 'performance' DR/manual-testing-playbook` lists the new scenario. Done 2026-11-17: DRV-074 in `initialization-and-state-setup/` and DRV-075 in `review-depth-v2-rollout/`, one scenario per category because a scenario file lives in one category folder. The update workflow was followed directly, not through a command dispatch. `validate-playbook-package.cjs` passes with 62 scenarios and no violations.
- [x] T019 Rerun the T002 suites and compare with the baseline (`R/tests/`). Verify: the same command exits 0 and the pass count rose only by the new cases. Done: the eight T002 suites pass 100 = 93 + 7 new cases, exit 0; the four REQ-004 suites pass 48 = 42 + 6 with no fixture file changed. Six related readers pass 272.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The T019 rerun matches the baseline plus the new cases (100 = 93 + 7)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (section 3 holds the dimension universe rules)
- **Decision record**: See `decision-record.md` (ADR-001 gates every implementation task)
<!-- /ANCHOR:cross-refs -->

---
