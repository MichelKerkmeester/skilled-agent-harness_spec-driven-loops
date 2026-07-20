---
title: "Checklist: Compiled-Routing Feature Catalogs"
description: "Planned QA gate for the catalog-topology decision, per-hub leaf authoring, canonical-surface extensions, path-citation hygiene, and phase-gated wording."
trigger_phrases:
  - "compiled routing catalogs checklist"
  - "feature catalog QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: Compiled-Routing Feature Catalogs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|----------------------|
| **[P0]** | Hard blocker | Cannot claim catalog coverage complete while unchecked |
| **[P1]** | Required | Must verify or record an operator-approved deferral |
| **[P2]** | Optional | May defer with an explicit reason |

All checks are **Planned** and remain unchecked until implementation evidence exists.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `../002-runtime-promotion-and-status-foundation/` promotion is confirmed complete before any catalog file is created.
  - **Planned evidence**: Dependency-confirmation note naming the promoted paths.
- [ ] CHK-002 [P0] The catalog-topology decision (Option A or B) is recorded with rationale.
  - **Planned evidence**: `implementation-summary.md` decision record.
- [ ] CHK-003 [P1] The hub-root catalog inventory is re-verified against the live tree, not assumed from this spec's authoring-time snapshot.
  - **Planned evidence**: Fresh `find -iname "feature-catalog*"` scoped per hub.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every root catalog and leaf is generated from the `create-feature-catalog` templates, never hand-rolled.
  - **Planned evidence**: Structural diff against `assets/feature-catalog-template.md` / `assets/feature-catalog-snippet-template.md`.
- [ ] CHK-011 [P0] No shipped catalog is a single-feature pseudo-catalog.
  - **Planned evidence**: Each root catalog documents the hub's pre-existing feature set alongside the routing leaf reference.
- [ ] CHK-012 [P1] Catalog Markdown is well-formed (valid frontmatter, no broken internal links).
  - **Planned evidence**: `create-feature-catalog` package validator output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Zero `.opencode/specs/**` path citations exist in any shipped catalog.
  - **Planned evidence**: `rg -n "\.opencode/specs" <catalog-path>` returns zero hits, run on every shipped file.
- [ ] CHK-021 [P0] No child-mode catalog was edited with compiled-router content.
  - **Planned evidence**: `git diff --stat` scoped to `mcp-tooling/mcp-*`, `system-deep-loop/deep-*`, `sk-design/design-*` `feature-catalog/` paths is empty.
- [ ] CHK-022 [P0] Every catalog's wording matches its hub's live `SKILL.md` directive at ship time.
  - **Planned evidence**: Manual diff between catalog wording and the corresponding directive block.
- [ ] CHK-023 [P1] `feature-flag-governance.md` and `advisor-recommend.md` extensions match their existing entries' structural shape.
  - **Planned evidence**: Side-by-side diff against an existing flag/schema entry in each file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] All 7 eligible hubs are represented — either a root catalog + leaf each (Option A) or coverage in the centralized entry (Option B).
  - **Planned evidence**: Per-hub file/section inventory against the 7-hub `COMPILED_ROUTING_HUBS` set.
- [ ] CHK-031 [P0] `sk-design` receives a section extension, not a rewritten root catalog.
  - **Planned evidence**: Diff shows only the MANAGER SHELL section and leaf reference changed.
- [ ] CHK-032 [P1] The uppercase `FEATURE-CATALOG.md` inconsistency (`mcp-click-up`) is not replicated by any new file.
  - **Planned evidence**: All new filenames created by this packet are lowercase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No runtime, router, manifest, or scorer file is modified.
  - **Planned evidence**: `git diff --stat` for this packet touches only Markdown under `feature-catalog/` trees.
- [ ] CHK-041 [P1] No catalog embeds a credential, token, or environment secret.
  - **Planned evidence**: Fixture inspection of every new/modified file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Spec, plan, tasks, checklist, and summary all report Planned status and agree on the topology decision once made.
  - **Planned evidence**: Status audit across all 5 docs.
- [ ] CHK-051 [P1] Catalogs reference the authoritative flag/schema surfaces without duplicating their content.
  - **Planned evidence**: Cross-link review against `feature-flag-governance.md` and `advisor-recommend.md`.
- [ ] CHK-052 [P1] Strict packet validation reports zero errors.
  - **Planned evidence**: `validate.sh --strict` output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Root catalogs and leaves live under each hub's own `feature-catalog/` directory; nothing is authored outside a hub or the two canonical governance/advisor surfaces.
  - **Planned evidence**: Path inventory of every created/modified file.
- [ ] CHK-061 [P1] Child-mode `feature-catalog/` directories remain byte-unchanged.
  - **Planned evidence**: `git diff` scoped to child-mode paths is empty.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 11 | 0/11 | Planned |
| P1 Items | 7 | 0/7 | Planned |
| P2 Items | 0 | 0/0 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: Catalog-topology decision, per-hub root/leaf authoring or centralized alternative, `feature-flag-governance.md`/`advisor-recommend.md` extension, durable-path citation hygiene, phase-gated wording accuracy, and child-mode boundary enforcement.
<!-- /ANCHOR:summary -->
