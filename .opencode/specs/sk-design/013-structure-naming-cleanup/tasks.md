---
title: "Tasks: sk-design Structure & Naming Cleanup"
description: "Phased task breakdown for the sk-design structure/naming cleanup."
importance_tier: "standard"
contextType: "general"
---
# Tasks: sk-design Structure & Naming Cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done. Each task names its target + acceptance signal.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1.1 Confirm scope of all four issues in the fresh worktree.
- [x] T1.2 Map reference blast-radius (styles/docs refs, dunder-folder refs, create-command contract).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T2.1 Delete `sk-design/styles/docs/`.
- [x] T2.2 Rename the 6 dunder folders (`__tests__`→`tests`, `__fixtures__`→`fixtures`); fix the cross-mode import + all live doc/run-command references.
- [x] T2.3 Conform `interface-design` auto+confirm to the create-command scaffolding (gold pattern).
- [x] T2.4 Apply the same scaffolding to the other 4 actions (8 files), preserving each workflow value-identical.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T3.1 Corpus node:test suites + transport-grounding test green post-rename.
- [x] T3.2 All 10 interface YAMLs parse + carry the scaffolding + preserve original workflow/pipeline (value check).
- [ ] T3.3 `validate.sh --strict` on this packet → Errors:0.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

All four fixes committed, tests green, the interface YAMLs value-preserving, per-mode playbooks untouched, and `validate.sh --strict` Errors:0.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements: `spec.md` §4. Outcome + evidence: `implementation-summary.md`.

<!-- /ANCHOR:cross-refs -->
