---
title: "Implementation Plan: Support custom review dimensions end to end (D10)"
description: "Carry custom review dimensions from the workflow input through ordering, the leaf rubric, the prompt pack and the reducer, as the operator decided on 2026-11-17. Runs whose names are all canonical stay unchanged."
trigger_phrases:
  - "review dimension coverage plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Support custom review dimensions end to end (D10)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS Node scripts (`convergence.cjs`, `reduce-state.cjs`), the review workflow YAML, the review prompt-pack template, the agent definition and the review mode contract |
| **Framework** | system-deep-loop review loop: setup presentation, workflow init, leaf agent, reducer, convergence script, divergent review pivot |
| **Storage** | `deep-review-config.json` and the review findings registry (JSON) |
| **Testing** | Vitest: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/...` |

### Overview
The operator chose to support custom dimensions (`decision-record.md` ADR-001, 2026-11-17). The plan defines one dimension universe and routes every surface through it: the setup text and workflow input accept a custom name, init orders it and seeds it, the pack and agent give the leaf a rubric for it, and the reducer tracks and covers it. A custom dimension case proves it; the existing suites and a pack golden prove canonical-only runs did not move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `decision-record.md` ADR-001 is `Accepted` with support named
- [x] `rg -n "REQUIRED_DIMENSIONS" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` still lists the sites at :24, :1215, :1225, :1246, :2173, :2178, :2185, :2272, :2301 and :2763. Checked before the build; the briefs anchored on function names because 004 had already shifted the line numbers
- [x] The REQ-004 suites and the contract suites pass on the unchanged tree (baseline captured). T002: the 8-suite baseline is 93 passed, 42 in the four REQ-004 suites
- [x] `../004-focus-hijack-fix/` has landed, or the overlap on `reduce-state.cjs:2173-2187` and `:2271-2274` is planned. 004's integration merge `227d594603e` is an ancestor of the 008 branch tip `7f0995f4e37`

### Definition of Done
- [x] Every P0 requirement in `spec.md` is met. All tasks are ticked, and integration gate `4d0b12723eb` passed with 186 files, 3192 tests and 0 failures
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts tests/unit/prompt-pack.vitest.ts tests/integration/divergent-pivot.vitest.ts` passes with the new cases
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` passes after the contract regeneration
- [x] The workflow line at `deep-review.yaml:654` and the reference docs match the code (REQ-006)
- [x] The agent mirrors are in sync, and the changelog entry and playbook scenario exist
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-driven coverage keys behind one dimension universe.

### Dimension universe (plan defaults)

| Rule | Value |
|------|-------|
| Universe | `REQUIRED_DIMENSIONS` in risk order, then each configured name not already in it, in configured order |
| Normalization | Lowercase, trim, dedupe; an empty name is rejected at the normalize step. `all` still expands to the four canonical names |
| Order | `dimension_queue` keeps correctness, security, traceability, maintainability first (filtered by the config as today), then the custom names in configured order |
| Leaf rubric | A custom name is reviewed against its own name as the check, under the shared P0-P2 doctrine (`sk-code-review/references/review-core.md`); findings are tagged with that name |
| Mode contract | A custom name has priority after the four and `requiredForSeverityCoverage: false` |
| Coverage | A custom name counts toward `all_dimensions_clean` like a canonical one; convergence already iterates the configured list (`convergence.cjs:1541-1556`) |

Why the universe always starts with the four: today a canonical subset such as `["correctness"]` still gets four registry keys, four dashboard rows and a four-name pack line. Starting the universe with the four keeps those runs byte-identical, and convergence ignores the unconfigured keys because it reads only the configured list.

### Key Components
- **Setup and input** (`deep-review-presentation.txt:35`, `:183`; `deep-review.yaml:54`): name custom names as allowed.
- **Workflow init** (`deep-review.yaml:628-641` order, `:644-654` normalize, `:782` registry seed, `:2324-2330` dimension table): apply the universe rules above.
- **Leaf contract** (`.skilled/agents/deep-review.md:170`, `:189`, `:338`; `review-mode-contract.yaml:62-82`): state the custom rubric rule.
- **Prompt pack** (`prompt-pack-iteration.md.tmpl:38`): the literal list becomes `{review_dimensions_list}`. `renderPromptPack` (`runtime/lib/deep-loop/prompt-pack.ts`) throws on a missing variable, so the variable is added to `render_prompt_pack.variables` in `deep-review.yaml` (:1455-1470) and rendered as the universe joined by `, `, which equals today's line for any canonical-only config.
- **Convergence reader** (`convergence.cjs:1541`): unchanged.
- **Review reducer** (`reduce-state.cjs`): `buildDimensionCoverage` gains a configured-list parameter (signature change; call at :1937, config loaded at :2522-2537); `deriveDimension` (:1213-1220) matches against the universe; the strategy lists (:2173, :2178), both Next Focus fallbacks (:2185, :2272) and the dashboard rows (:2301) iterate the universe.

### Data Flow
Setup accepts the names, init normalizes, orders and writes `reviewDimensions` into the config and the seeded registry. Each rendered pack lists the universe, and the leaf tags findings and records the dimensions it addressed. The reducer projects `dimensionCoverage` over the universe, convergence reads the configured list and the coverage map to compute `missingDimensions`, and the review pivot reads both to seed unswept dimensions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the operator's decision and captures the baseline. Implementation edits the reducer, the workflow YAML, the prompt pack, the agent and its mirrors, the presentation, the mode contract and its snapshot, the strategy and dashboard assets and the reference docs, then regenerates the review compiled contract as the last implementation task. Verification runs the new cases, the REQ-004 suites, the contract suites, and adds the changelog entry and the playbook scenario. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Proving tests from parent `research.md` §20 Slice H: the review reducer suite (`deep-review-state-reducer.vitest.ts`) and `review-depth-convergence.vitest.ts`, plus one custom dimension case. `review-stop-path-replay.vitest.ts` guards default runs. `prompt-pack.vitest.ts` gets a byte-identity golden for the default pack and a custom-list render. A review-pivot case is added to `divergent-pivot.vitest.ts`, because no review-pivot suite exists today. `check-contract-drift.vitest.ts` and `compile-command-contracts.vitest.ts` guard the generated contract. Every deep-loop command runs as `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/...`. The spec-kit parity suites live in another package: `cd .skilled/skills/system-spec-kit && npx vitest run --project cli deep-review-contract-parity deep-review-reducer-schema` (2 files, 15 tests passed on 2026-11-17). The parity suite still expects the four canonical names to be listed in the workflow input (`deep-review-contract-parity.vitest.ts:181`), so the input text keeps them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator decision on parent §12 item 7 is recorded (ADR-001 Accepted, support). `../004-focus-hijack-fix/` should land first because both phases edit the review focus block. Slice K (`../011-review-frontier-mode/`) depends on this slice.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a run whose configured names are all canonical produces a registry, dashboard or prompt pack that differs from the baseline, or a custom-dimension run still cannot reach `all_dimensions_clean`. Revert the slice's commit and regenerate the review compiled contract; the change does not alter a stored format that older code cannot read.
<!-- /ANCHOR:rollback -->

---
