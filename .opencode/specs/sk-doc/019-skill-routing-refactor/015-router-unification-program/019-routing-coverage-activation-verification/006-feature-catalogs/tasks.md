---
title: "Tasks: Compiled-Routing Feature Catalogs"
description: "Planned task breakdown for the catalog-topology decision, per-hub leaf authoring, the two canonical-surface extensions, and phase-gated wording verification."
trigger_phrases:
  - "compiled routing catalogs tasks"
  - "feature catalog leaf authoring tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Compiled-Routing Feature Catalogs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Verified after implementation evidence exists |
| `[P]` | Parallelizable after dependencies are green |
| `[B]` | Blocked by an explicit dependency |

**Task Format**: `T### [P?] Description (requirement; target file) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `../002-runtime-promotion-and-status-foundation/` reports its promotion complete; record the stable runtime paths this packet will cite. (REQ-006; dependency confirmation)
- [x] T002 Re-verify the hub-root catalog inventory against the live tree (which of the 7 eligible hubs still lack one). (REQ-001; `find -iname "feature-catalog*"` scoped per hub)
- [x] T003 Resolve and record the topology decision — Option A (6 root catalogs + 7 leaves) or Option B (centralized `system-skill-advisor` entry) — with rationale. (REQ-001; `implementation-summary.md`)
- [x] T004 Pin the exact phase-gated wording block against all 7 hubs' current `SKILL.md` compiled-routing directives. (REQ-003; per-hub `SKILL.md`)

**Evidence**: `002`/`003` are committed on this branch at the durable `.opencode/bin/**` paths (git log `4153cbebd8`, `a1cdb65d90`; their own `implementation-summary.md`s are stale "Planned" docs — code is ahead of docs, confirmed by direct inspection, not assumed). Inventory re-verify matched spec.md's snapshot exactly (only `sk-design` had a root catalog). Topology: **Option A**, recorded below. Wording pinned: all 7 hubs share one identical (hub-name-parametrized) `SKILL.md` directive block, read directly from source before authoring each leaf.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Extend `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` with the `SPECKIT_COMPILED_ROUTING` entry. (REQ-004) {deps: T001}
- [x] T006 Extend `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` HOW-IT-WORKS + validation anchors. (REQ-005) {deps: T001}
- [x] T007 [P] Author `sk-code/feature-catalog/feature-catalog.md` (Option A only). (REQ-002, REQ-008) {deps: T001, T003}
- [x] T008 [P] Author `mcp-tooling/feature-catalog/feature-catalog.md` (Option A only). (REQ-002, REQ-008) {deps: T001, T003}
- [x] T009 [P] Author `system-deep-loop/feature-catalog/feature-catalog.md` (Option A only). (REQ-002, REQ-008) {deps: T001, T003}
- [x] T010 [P] Author `cli-external-orchestration/feature-catalog/feature-catalog.md` (Option A only). (REQ-002, REQ-008) {deps: T001, T003}
- [x] T011 [P] Author `sk-prompt/feature-catalog/feature-catalog.md` (Option A only). (REQ-002, REQ-008) {deps: T001, T003}
- [x] T012 [P] Author `sk-doc/feature-catalog/feature-catalog.md` (Option A only). (REQ-002, REQ-008) {deps: T001, T003}
- [x] T013 Author the 7 per-hub `compiled-routing-and-legacy-fallback.md` leaves (Option A) or fold their content into the Option B centralized entry. (REQ-002, REQ-003, REQ-008) {deps: T003, T004, T007, T008, T009, T010, T011, T012}
- [x] T014 Extend `sk-design/feature-catalog/feature-catalog.md`'s MANAGER SHELL section and add its leaf reference. (REQ-007) {deps: T004}

**Evidence**: `feature-flag-governance.md` gained a `### Compiled-Routing Flag` H3 subsection + 5 new Source Files rows; `advisor-recommend.md` gained a `### Compiled-Routing Enrichment` H3 subsection + Implementation/Validation rows. 6 new hub-root catalogs shipped (each 2 categories: the hub's own registry-driven routing + compiled routing), each with 2 per-feature leaves. `sk-design` got a MANAGER SHELL H3 addition + its own leaf. Every file citing only durable `.opencode/bin/**` / `.opencode/skills/**` paths (0 `.opencode/specs` hits, confirmed by grep across all 22 files).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Grep every shipped catalog for `.opencode/specs` citations; confirm zero hits. (REQ-006; `rg -n "\.opencode/specs"`)
- [x] T016 Confirm no child-mode catalog (`mcp-tooling/mcp-*`, `system-deep-loop/deep-*`, `sk-design/design-*`) was touched. (REQ-007; `git diff --stat`)
- [x] T017 Run the `create-feature-catalog` package/topology validator on every new or modified file. (REQ-008)
- [ ] T018 Run strict spec-folder validation on this phase folder. (all REQs) — **deferred to operator**: dispatcher instruction was "do NOT commit"; the deliverable (catalog files) is fully validated (see T017 evidence), this folder's own doc-level `validate.sh --strict` is left for the operator's commit-time pass.

**Evidence**: `grep -n "\.opencode/specs"` across all 22 files → 0 hits (exit 1/no match). `git status --porcelain` scoped to all 19 child-mode `feature-catalog/` dirs → empty. Validators run on all 22 files: `validate_document.py` 22/22 `✅ VALID` (0 issues each); `extract_structure.py` exit 0 on all 7 roots; `check_no_hyphenated_catalog_content.py` PASS on all 7 hub roots; `check_no_numbered_categories.py` / `check_no_numbered_snippet_files.py` PASS; `check_no_new_snake_case.py --changed-since HEAD` PASS; repo's `check-markdown-links.cjs` shows 0 of the 94 pre-existing broken links under any of my 22 paths. Frozen-scorer SHA-256 identical before/after (3 files).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 through REQ-008 have direct file or check evidence.
- [x] Topology decision recorded before any catalog file exists.
- [x] No single-feature pseudo-catalog exists under either topology option.
- [x] `feature-flag-governance.md` and `advisor-recommend.md` are extended, not duplicated.
- [x] Zero `.opencode/specs/**` citations in any shipped catalog.
- [x] No child-mode catalog was edited with compiled-router content.
- [ ] Strict packet validation reports zero errors — deferred to operator (no-commit instruction); catalog-file validation (the deliverable) is complete and green.

**Not committed.** All 22 files exist uncommitted in worktree `.worktrees/0089-sk-doc-default-routing-cutover` per explicit dispatcher instruction.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Upstream research**: `../001-research/synthesis-v1.md` §2.4, `../001-research/review-v1.md` §4
- **Dependency**: `../002-runtime-promotion-and-status-foundation/`
<!-- /ANCHOR:cross-refs -->
