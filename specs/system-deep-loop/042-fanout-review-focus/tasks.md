---
title: "Tasks: Fan-out review focus input for deep-review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fanout review focus tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Fan-out review focus input for deep-review

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

`R` is `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Trace the review setup bindings in `fanout-run.cjs`, the flag surface in `review.md`, the presentation schema and the prompt-pack render step in both workflows. Verify: `rg -n "review_dimensions: all" $R/scripts/fanout-run.cjs` prints the two hard-coded bindings.
- [x] T002 Confirm the compiled review contract is fresh before editing. Verify: the compiler output matches `compiled/deep-review.contract.markdown`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `normalizeReviewFocus` and carry the focus into lineage prompts and native command input (`$R/scripts/fanout-run.cjs`). Verify: `node --check` prints nothing and exits 0.
- [x] T004 Add `{review_focus_block}` to the review prompt pack (`deep-review/assets/prompt-pack-iteration.md.tmpl`). Verify: the production render test binds it and passes.
- [x] T005 Add the input, fan-out flag, normalize step, config field, prompt binding and report line to both workflows (`deep-review-auto.yaml`, `deep-review-confirm.yaml`). Verify: both files parse with js-yaml.
- [x] T006 Add `reviewFocus: null` to the config template (`deep-review/assets/deep-review-config.json`).
- [x] T007 [P] Document the flag in `review.md`, the presentation contract and the fan-out dispatch catalog entry.
- [x] T008 Regenerate the compiled review contract. Verify: `check-contract-drift.cjs --command deep/review` prints `OK`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the new vitest. Verify: 9 of 9 cells pass.
- [x] T010 Run the touched deep-loop suites. Verify: 30 files, 581 tests pass.
- [x] T011 Run the three runtime mirror syncs and their `--check` forms. Verify: each exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
