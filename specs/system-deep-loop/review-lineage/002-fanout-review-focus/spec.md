---
title: "Feature Specification: Fan-out review focus input for deep-review"
description: "A deep-review fan-out hard-codes review_dimensions all for every lineage and has no field for an operator's review focus, so a focus the operator asks for never reaches the lineage iterations."
trigger_phrases:
  - "fanout review focus"
  - "fan out review focus input for deep review"
  - "review focus flag"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Fan-out review focus input for deep-review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`fanout-run.cjs` starts every `/deep:review` lineage with setup bindings that hard-code `review_dimensions: all`, and neither the command nor the workflow has a field for an operator's review focus. An operator asked for a fan-out review focused on drift, bad integration, code alignment with sk-code-skilled, docs aligned with sk-doc modes and command alignment with sk-create-command. None of that reached the 30 lineage iterations, which ran only the generic dimensions, so fresh synthesis reviewers had to cover the focus by hand.

### Purpose
One optional `--review-focus "TEXT"` flag, or a pre-bound `review_focus` answer, reaches every iteration prompt in single-executor and fan-out runs, beside the dimensions, and the review report shows it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `reviewFocus` option to `fanout-run.cjs` that is normalized once and carried into each CLI lineage prompt's setup bindings and per-iteration contract, and into each native lineage's command flag and pre-bound answers.
- Add a `review_focus` input to the auto and confirm review workflows: normalized at init, stored as `reviewFocus` in the config, rendered into every iteration prompt and listed in the review report's Executive Summary.
- Add a `{review_focus_block}` token to the review iteration prompt pack that renders empty when no focus is given.
- Document the flag in the command's Workflow Flag Surface, the presentation contract's setup schema and the fan-out dispatch catalog entry.
- Prove the behavior with a vitest under `system-deep-loop/runtime/tests/`.

### Out of Scope
- Research and council loops. They scope by topic, and `fanout-run.cjs` rejects a focus for any loop type other than review.
- Changing how dimensions are chosen or ordered. The focus is additive and never replaces a dimension.
- A new manual testing playbook scenario. The existing fan-out scenarios do not describe setup inputs, so none needed an edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `normalizeReviewFocus`, focus in lineage prompt and native command input |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modify | `{review_focus_block}` under the dimensions |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | Modify | `reviewFocus: null` default |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Input, fan-out flag, normalize step, config field, prompt binding, report line |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | Same edits as the auto workflow |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Regenerated from the changed sources |
| `.skilled/commands/deep/review.md` | Modify | `--review-focus` row in the Workflow Flag Surface |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modify | Pre-bound schema, resolution table, flag parse and outputs |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/fanout-dispatch.md` | Modify | How the focus travels through fan-out |
| `.skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | Create | Focus present and absent cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modify | Bind the new template token |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A given focus reaches every fan-out lineage | Each review lineage prompt's setup bindings hold `review_focus: <text>` beside `review_dimensions: all`, and a native lineage's command input holds `--review-focus=` and a `review_focus:` pre-bound answer |
| REQ-002 | A given focus reaches every iteration prompt | The rendered review prompt pack shows the focus line under the dimensions, and the CLI per-iteration contract names it |
| REQ-003 | No focus means no change | Without a focus, each lineage prompt and native command input is byte-identical to the prompt with the focus lines removed |
| REQ-004 | The focus is sanitized | Control characters and whitespace runs collapse to one space, a blank focus is absent, and more than 1000 characters fails as an input error |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The focus is recorded for the report | Both workflows write `reviewFocus` to `deep-review-config.json` and list it in the review report's Executive Summary |
| REQ-006 | The flag is documented | `review.md` has a `--review-focus` row and the presentation contract resolves `review_focus` from flag, marker or default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run --no-coverage tests/fanout-review-focus.vitest.ts` passes from the runtime root. Evidence: 9 of 9 cells passed.
- **SC-002**: The touched deep-loop suites pass. Evidence: 30 files, 581 tests passed across the fan-out, deep-review, contract and prompt-pack suites.
- **SC-003**: `check-contract-drift.cjs --command deep/review` prints `OK` after the compiled contract is regenerated. Evidence: `[CONTRACT DRIFT] OK commands=1`, exit 0.
- **SC-004**: The three runtime mirror checks exit 0. Evidence: 194 mirrors, 38 Codex prompts and 38 Hermes prompts reported in sync.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The prompt-pack renderer fails on any unbound token | High | Both workflows bind `review_focus_block`, and the production render test binds it too |
| Risk | Free text in the fan-out shell command can break quoting | Med | The workflow tells the orchestrator to escape quotes, backslashes, dollar signs and backticks, and `fanout-run.cjs` collapses control characters so the text stays one binding line |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
