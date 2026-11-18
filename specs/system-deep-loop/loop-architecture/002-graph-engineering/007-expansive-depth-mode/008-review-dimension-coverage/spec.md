---
title: "Feature Specification: Support custom review dimensions end to end (D10)"
description: "A reviewDimensions entry outside the four canonical names can never be marked covered, so the clean review stop and the review pivot become unreachable, and every input, ordering and rubric surface still names only four. This phase supports custom dimensions from the input through the reducer, the option the operator chose."
trigger_phrases:
  - "review dimension coverage"
  - "custom review dimensions"
  - "slice h d10"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Support custom review dimensions end to end (D10)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-focus-hijack-fix/` on the shared review reducer focus block (`reduce-state.cjs:2173-2187`, dashboard twin `:2271-2274`). Land 004 first, or rebase onto it; no other slice must land first. |
| **Successor** | `../011-review-frontier-mode/spec.md`, which depends on this slice because the operator chose to support custom dimensions |
| **Source** | Parent `research/research.md` §6, §12 item 7, §13 row D10, §18 items 1 and 4, §20 Slice H; plan review `../scratch/fable-5-2-plan-review.md` F008-1 to F008-3, X-1, X-2, X-6, X-7, F014-2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review reducer's `buildDimensionCoverage` (`runtime/scripts/reduce-state.cjs:1223-1250`) seeds and marks only the four `REQUIRED_DIMENSIONS` keys, while `convergence.cjs:1541-1556` counts every configured `reviewDimensions` entry as missing until covered. A config with any other name therefore never reaches `all_dimensions_clean`, the review pivot (which fires only on that reason, `divergent-review-pivot.ts:338-340`) is dead, and the pivot seeds a permanent `unswept-dimension` that can never close. The workflow forbids such names only through a prose line the orchestrating model executes (`deep-review.yaml:654`); no code checks it.

Fixing the reducer alone is not support. Every surface between the operator and the reducer also hard-codes the four names: the workflow input (`deep-review.yaml:54`), the risk order (`:628-641`), the normalize rule (`:644-654`), the registry seed (`:782`) and the dimension table (`:2324-2330`); the agent definition (`.skilled/agents/deep-review.md:170`, `:189`, `:338`); the review prompt pack (`deep-review/assets/prompt-pack-iteration.md.tmpl:38`); the setup presentation (`deep-review-presentation.txt:35`, `:183`); and the mode contract (`deep-review/assets/review-mode-contract.yaml:62-82`). A custom name has no way in, no place in the order and no rubric for the leaf.

### Purpose
A configured custom dimension is accepted at setup, ordered, given to the leaf with a rubric, and covered like any canonical one, so no review run can silently lose its clean stop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from `.skilled/skills/system-deep-loop` (the YAML, agent and presentation paths from the repository root).
```text
$ rg -n "^const REQUIRED_DIMENSIONS" runtime/scripts/reduce-state.cjs
24:const REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
$ rg -n "missingDimensions:" runtime/scripts/convergence.cjs
1556:    missingDimensions: dimensions.filter((dimension) => coverage[dimension] !== true),
$ rg -n "Every element MUST be one of the four" .skilled/commands/deep/assets/deep-review.yaml
654:          Every element MUST be one of the four canonical dimension names.
$ sed -n 38p deep-review/assets/prompt-pack-iteration.md.tmpl
correctness, security, traceability, maintainability
$ sed -n 35p .skilled/commands/deep/assets/deep-review-presentation.txt
  review_dimensions: all  # or comma-separated subset: correctness, security, traceability, maintainability
```
The reducer knows four names; convergence checks every configured name against that four-key map; the only guard is a prose line; the leaf, the pack and the setup text all name the same four.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the operator's choice, support custom dimensions, in `decision-record.md`.
- Define one dimension universe: the four canonical names in risk order, then each configured custom name in configured order (lowercased, trimmed, deduped; an empty name is rejected). Every surface below reads that universe.
- Build `dimensionCoverage` from the universe, and make `deriveDimension`, the strategy lists, both Next Focus fallbacks and the dashboard rows iterate it.
- Accept custom names at the workflow input, normalize step, risk order, registry seed and dimension table, and in the setup presentation.
- Give the leaf a rubric for a custom name: the agent definition, the review prompt pack (through a render variable) and the mode contract.
- Update the reference docs that say "all 4 dimensions", regenerate the review compiled contract and the contract snapshot, sync the agent mirrors, add a changelog entry and a manual testing playbook scenario.

### Out of Scope
- The review frontier (`../011-review-frontier-mode/`). It consumes this slice's dimension universe.
- Changing the four canonical names, their risk order or their coverage threshold.
- The D5 Next Focus hijack in the same review chain. That is Slice D (`../004-focus-hijack-fix/`).
- Feature catalog entries per custom dimension. `../014-docs-playbooks-alignment/` owns the catalog.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | `deriveDimension` (:1213-1220, today falls back to `'correctness'`); `buildDimensionCoverage(iterationRecords, strategyDimensions)` (:1223-1250) gains the configured list as a parameter, passed at the call (:1937) from the config loaded at :2522-2537; the consumers at :2173, :2178, :2185, :2272 and :2301 iterate the universe. `REQUIRED_DIMENSIONS` stays as the canonical prefix and the export (:2763) |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Input text (:54), risk order (:628-641, custom names after the canonical four), normalize rule (:644-654), registry seed (:782, four keys plus custom keys), dimension table (:2324-2330, custom rubric row), and a new `review_dimensions_list` entry in `render_prompt_pack.variables` (:1455-1470) |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | Line 38 becomes `{review_dimensions_list}`; the default render stays byte-identical |
| `.skilled/agents/deep-review.md` | Modify | :170, :189 and :338 allow a configured custom dimension, with the custom rubric rule |
| `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.pi/agents/deep-review.md`, `.vibe/agents/deep-review.toml`, `.dsh/agents/deep-review.patch.yml` | Sync | Runtime mirrors of the agent definition, through `/doctor:runtime-mirrors` |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modify | :35 and :183 name custom names as allowed |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Modify | After :62-82, a custom-dimension rule: priority after the canonical four, `requiredForSeverityCoverage: false`, rubric = name plus the shared P0-P2 doctrine |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | Regenerate | `node .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md`, `deep-review-dashboard.md` | Modify | The four-name example lists (strategy :41-44, :65; dashboard :69) gain a note that configured custom dimensions follow the canonical four |
| `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md` (:171, :201), `references/protocol/loop-protocol.md` (:206), `references/protocol/quick-reference.md` (:137, :158), `deep-review/README.md` (:16, :45) | Modify | "All 4 dimensions" becomes "every configured dimension (the four by default)" |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write`; the YAML, presentation, agent, prompt pack, mode contract, config, convergence and loop-protocol docs are all digest sources |
| `.skilled/skills/system-deep-loop/deep-review/changelog/` | Create | A changelog entry stating custom dimensions are now supported |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/` | Modify | A custom-dimension scenario through `/create:manual-testing-playbook system-deep-loop update` |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-depth-convergence.vitest.ts` | Modify | Add the custom dimension stop-path case |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | Add the custom dimension reducer, `deriveDimension` and subset-config cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modify | Byte-identity golden for the default pack and a custom-list render case |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts` | Modify | The review-pivot custom dimension case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The operator's choice is recorded before any code changes. | `decision-record.md` ADR-001 shows `Accepted` and names support; OD-001 carries the decision. |
| REQ-002 | A custom name reaches the leaf with an order and a rubric. | With `review_dimensions: correctness,performance`, the normalize step keeps `performance`, `dimension_queue` places it after `correctness`, the rendered pack lists it under `## REVIEW DIMENSIONS`, and the agent definition and mode contract state the custom rubric rule. A `prompt-pack.vitest.ts` case renders the custom list. |
| REQ-003 | A configured custom dimension can be covered. | After an iteration record with `dimensions: ["performance"]`, `registry.dimensionCoverage.performance` is `true`, `missingDimensions` excludes it, and a stop-path fixture reaches `all_dimensions_clean`. `deriveDimension` returns `performance` for a finding whose iteration addressed only `performance`. |
| REQ-004 | Runs whose configured names are all canonical do not change. | This covers the four-name default and any canonical subset, because the universe always starts with the four canonical keys. `review-depth-convergence`, `review-stop-path-replay` and `deep-review-state-reducer` pass unchanged on their existing fixtures, and the `prompt-pack.vitest.ts` golden shows the default pack is byte-identical. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The review pivot can fire on a custom-dimension run. | A new case in `runtime/tests/integration/divergent-pivot.vitest.ts` (no review-pivot suite exists today) with a covered custom dimension accepts the `all_dimensions_clean` trigger and seeds no `unswept-dimension` for it. |
| REQ-006 | The workflow text and the docs match the code. | `rg -n 'canonical dimension' .skilled/commands/deep/assets/deep-review.yaml` shows the new wording; `rg -n -i 'all (4|four) dimensions|four review dimensions' .skilled/skills/system-deep-loop/deep-review/references .skilled/skills/system-deep-loop/deep-review/README.md` prints nothing (seven lines match today). |
| REQ-007 | Generated and mirrored surfaces stay in step. | `check-contract-drift.vitest.ts`, `compile-command-contracts.vitest.ts`, `render-contract-snapshot.cjs --check` and `/doctor:runtime-mirrors` all pass after the change. |
| REQ-008 | The user-visible change is documented. | A changelog entry under `deep-review/changelog/` and a custom-dimension manual testing playbook scenario exist. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The custom dimension case passes in `review-depth-convergence.vitest.ts`.
- **SC-002**: The REQ-004 suites pass with no fixture edits, and the default pack golden is byte-identical.
- **SC-003**: The review compiled contract, the contract snapshot and the five agent mirrors are current.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Slice K (`../011-review-frontier-mode/`) | K depends on this slice landing first | ADR-001 records the dependency so 011's plan can cite it |
| Dependency | `../004-focus-hijack-fix/` edits the same focus block (`reduce-state.cjs:2173-2187`, `:2271-2274`) | Merge conflict on the same lines | Land 004 first, then 008, then 011 on the review reducer |
| Risk | The reducer's four-name lists are used in eight places (:1215, :1225, :1246, :2173, :2178, :2185, :2272, :2301), and one missed site keeps a custom dimension invisible | Low-Med | Grep every `REQUIRED_DIMENSIONS` use before and after; the stop-path fixture fails if one is missed |
| Risk | Changing the prompt pack line changes every default review pack if the variable renders differently | Med | The variable renders the canonical four first, joined as today; a byte-identity golden guards it |
| Risk | A subset config would shrink the registry keys if the universe were only the configured list | Med | The universe always starts with the four canonical keys, so canonical-only configs keep identical registries (REQ-004) |
| Risk | Every edited YAML, agent, template and reference file is a compiled-contract digest source; a parallel phase regenerating the same contract conflicts | Med | Regenerate the review contract as the last implementation task, and again after each merge, instead of resolving digest lines by hand |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered 2026-11-17: the operator chose support. See `decision-record.md` ADR-001.
- The order, rubric and normalization rules for a custom name are plan defaults set in `plan.md` §3, not open questions.
<!-- /ANCHOR:questions -->

---
