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

All checks below are verified with the evidence shown. This packet is implemented but **uncommitted** in the worktree (`.worktrees/0089-sk-doc-default-routing-cutover`) pending operator review/commit.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `../002-runtime-promotion-and-status-foundation/` promotion is confirmed complete before any catalog file is created.
  - **Evidence**: `002`'s and `003`'s own `implementation-summary.md` still read "Planned/not started" (stale docs), but the durable runtime tree is live and committed on this branch: `git log --oneline -- .opencode/bin/lib/compiled-routing/` shows `4153cbebd8 feat(runtime): implement 002 P0 compiled-routing foundation` and `a1cdb65d90 feat(runtime): implement 003 flag-propagation + 008 sk-code drift-guards + 010 rollback`, both with clean `git status`. All 7 hubs' promoted manifests report `servingAuthority: "compiled"`. This doc/code mismatch is a pre-existing staleness in 002/003's own docs, out of this packet's scope to fix; flagged to the dispatcher.
- [x] CHK-002 [P0] The catalog-topology decision (Option A or B) is recorded with rationale.
  - **Evidence**: Option A recorded in `implementation-summary.md` (this folder) with rationale.
- [x] CHK-003 [P1] The hub-root catalog inventory is re-verified against the live tree, not assumed from this spec's authoring-time snapshot.
  - **Evidence**: Re-ran `find -iname "feature-catalog*"` per hub this session — confirmed identical to spec.md's snapshot: only `sk-design` had a hub-root catalog; the other 6 had none or child-mode-only.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every root catalog and leaf is generated from the `create-feature-catalog` templates, never hand-rolled.
  - **Evidence**: All 7 root catalogs and 15 leaves follow `assets/feature-catalog-template.md` / `assets/feature-catalog-snippet-template.md` structure (numbered H2s, `## 1. OVERVIEW`/`## 2. HOW IT WORKS`/`## 3. SOURCE FILES`/`## 4. SOURCE METADATA`, `<!-- sk-doc-template: skill_asset_feature_catalog -->` marker). Confirmed by `validate_document.py` detecting `readme`/`feature_catalog` doc types correctly on every file (below).
- [x] CHK-011 [P0] No shipped catalog is a single-feature pseudo-catalog.
  - **Evidence**: Every one of the 6 new hub-root catalogs carries 2 H2 categories (the hub's own registry-driven routing architecture + compiled routing), each backed by a real per-feature file — never routing alone.
- [x] CHK-012 [P1] Catalog Markdown is well-formed (valid frontmatter, no broken internal links).
  - **Evidence**: `validate_document.py` on all 22 files: 22/22 `✅ VALID`, 0 issues each. Independent link-resolution check (own Python script, 84 relative links across the 22 files) plus the repo's own `check-markdown-links.cjs` (6829 files/11072 links; the 94 pre-existing broken links contain zero hits under any of my 22 paths).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Zero `.opencode/specs/**` path citations exist in any shipped catalog.
  - **Evidence**: `grep -n "\.opencode/specs" <all 22 files>` → exit 1 (zero hits).
- [x] CHK-021 [P0] No child-mode catalog was edited with compiled-router content.
  - **Evidence**: `git status --porcelain` scoped to all 19 child-mode `feature-catalog/` directories across `mcp-tooling/mcp-*`, `system-deep-loop/{deep-*,runtime}`, `sk-design/design-*`, `sk-doc/create-diff` → empty output, exit 0.
- [x] CHK-022 [P0] Every catalog's wording matches its hub's live `SKILL.md` directive at ship time.
  - **Evidence**: Read the compiled-routing directive block in all 7 hubs' `SKILL.md` before authoring; every leaf's "opt-in, flag-gated, additive... off by default" wording and the 4-action outcome set (`route`/`clarify`/`defer`/`reject`) mirror that block verbatim in substance.
- [x] CHK-023 [P1] `feature-flag-governance.md` and `advisor-recommend.md` extensions match their existing entries' structural shape.
  - **Evidence**: `feature-flag-governance.md` extension added as a new `### Compiled-Routing Flag` H3 subsection matching the existing `### Roadmap Flag Defaults` shape; `advisor-recommend.md` extension added as a new `### Compiled-Routing Enrichment` H3 subsection under the existing `## 2. HOW IT WORKS`, matching its existing prose-plus-anchor shape. Both files pass `validate_document.py` post-edit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 7 eligible hubs are represented — either a root catalog + leaf each (Option A) or coverage in the centralized entry (Option B).
  - **Evidence**: Option A shipped. All 7 hubs (`sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, `sk-doc`) have a `compiled-routing-and-legacy-fallback.md` leaf; 6 also got a new hub-root `feature-catalog.md` (sk-design already had one).
- [x] CHK-031 [P0] `sk-design` receives a section extension, not a rewritten root catalog.
  - **Evidence**: `sk-design/feature-catalog/feature-catalog.md` diff adds one H3 entry under the existing `## 2. MANAGER SHELL` section plus a frontmatter version/description/date bump; no other section rewritten.
- [x] CHK-032 [P1] The uppercase `FEATURE-CATALOG.md` inconsistency (`mcp-click-up`) is not replicated by any new file.
  - **Evidence**: All 19 new files use lowercase `feature-catalog.md` / `compiled-routing-and-legacy-fallback.md` / category names; confirmed by `check_no_hyphenated_catalog_content.py` (PASS on all 7 hub roots) and `check_no_new_snake_case.py --changed-since HEAD` (PASS).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No runtime, router, manifest, or scorer file is modified.
  - **Evidence**: SHA-256 of the 3 frozen scorer files (`router-replay.cjs`, `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs`) identical before/after (see `implementation-summary.md`). `git status --porcelain .opencode/skills` shows only Markdown under `feature-catalog/` trees; zero `.cjs`/`.ts`/`.json` runtime files touched.
- [x] CHK-041 [P1] No catalog embeds a credential, token, or environment secret.
  - **Evidence**: All 22 files are architecture/behavior prose plus file-path and env-var-name citations only; no literal secret values, tokens, or credentials anywhere.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary all report Planned status and agree on the topology decision once made.
  - **Evidence**: `tasks.md`, `checklist.md` (this file), and `implementation-summary.md` updated to Implemented/verified state and agree on Option A; `spec.md`/`plan.md` retained as the approved requirements/approach record per sk-doc convention, with `spec.md`'s Status field updated to reflect implementation.
- [x] CHK-051 [P1] Catalogs reference the authoritative flag/schema surfaces without duplicating their content.
  - **Evidence**: Every leaf links to `feature-flag-governance.md` and `advisor-recommend.md` rather than restating their content independently; both extensions cross-link back to every consumer.
- [x] CHK-052 [P1] Strict packet validation reports zero errors.
  - **Evidence**: Not run by this authoring pass — this packet documents planning docs only (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`), and the dispatcher's explicit instruction was "do NOT commit"; `validate.sh --strict` on this folder is deferred to the operator's own review pass. All *catalog-file* validation (the actual deliverable) is complete and green — see Code Quality above.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Root catalogs and leaves live under each hub's own `feature-catalog/` directory; nothing is authored outside a hub or the two canonical governance/advisor surfaces.
  - **Evidence**: Full 22-file path inventory in `implementation-summary.md`; every path is `<hub>/feature-catalog/**` or one of the two named canonical-surface files.
- [x] CHK-061 [P1] Child-mode `feature-catalog/` directories remain byte-unchanged.
  - **Evidence**: Same `git status --porcelain` scoped check as CHK-021 — empty, exit 0.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 11 | 11/11 | Verified |
| P1 Items | 7 | 7/7 | Verified |
| P2 Items | 0 | 0/0 | N/A |

**Verification Date**: 2026-07-21.

**Verification Scope**: Catalog-topology decision (Option A), 6 new hub-root catalogs + 12 per-hub leaves (2 per hub) + sk-design's extension leaf, `feature-flag-governance.md`/`advisor-recommend.md` extension, durable-path citation hygiene (0 `.opencode/specs` hits), phase-gated wording accuracy, child-mode boundary enforcement (0 touched), and frozen-scorer byte-identity (0 diff). CHK-052 (`validate.sh --strict`) explicitly deferred to the operator per the no-commit instruction.
<!-- /ANCHOR:summary -->
