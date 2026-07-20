---
title: "Implementation Summary: Compiled-Routing Feature Catalogs"
description: "Planned-state record for the seven-hub compiled-routing catalog coverage decision. No catalog file has been authored yet; the topology choice remains open pending the 002 promotion and an explicit Option A/B decision."
trigger_phrases:
  - "compiled routing catalogs planned summary"
  - "feature catalog topology current status"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Compiled-Routing Feature Catalogs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Implementation** | Not started |
| **Current catalog coverage** | 1 of 7 eligible hubs (`sk-design`) owns a hub-root `feature-catalog.md`; the other 6 have none or child-mode-only catalogs (confirmed by direct `find` this session) |
| **Strict validation** | Planned after the full Markdown set is authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet plans closing the compiled-routing documentation gap across the seven eligible hubs: either six new hub-root catalogs plus one compiled-routing leaf on all seven, or a single centralized entry on `system-skill-advisor` — the choice is recorded here once made, before any file is authored. Either path extends the existing `feature-flag-governance.md` and `advisor-recommend.md` surfaces and applies wording gated to each hub's actual cutover state.

### Planned Implementation Surfaces

| Area | Planned Files | Purpose |
|------|-----------------|---------|
| Hub-root catalogs (Option A) | `feature-catalog/feature-catalog.md` under 6 hubs | Canonical, discoverable per-hub feature inventory |
| Compiled-routing leaves (Option A) or centralized entry (Option B) | `.../compiled-routing-and-legacy-fallback.md` × 7, or one `system-skill-advisor` entry | The actual routing-documentation content |
| Governance extension | `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | `SPECKIT_COMPILED_ROUTING` flag entry |
| Advisor-schema extension | `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` | `compiledRoute` field documentation |
| `sk-design` extension | `sk-design/feature-catalog/feature-catalog.md` | MANAGER SHELL section extension + leaf reference |

No catalog, runtime, router, manifest, or scorer file was modified by this planning phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation waits on `../002-runtime-promotion-and-status-foundation/` naming the stable, promoted runtime paths this packet must cite. Once that lands, the topology decision (Option A vs. Option B) is resolved and recorded, the two canonical surfaces are extended first, and the per-hub (or centralized) content is authored last, each hub's wording checked against its own live `SKILL.md` directive before shipping.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Sequence all authoring strictly after `002` | A catalog citing today's spec-tree resolver path would go stale the moment `002` promotes it; sequencing avoids a rewrite. |
| Resolve topology (Option A/B) before authoring any file | Prevents partially-built coverage under one option that then needs unwinding if the other is chosen. |
| Extend `feature-flag-governance.md` and `advisor-recommend.md` instead of a new root feature | Both already exist and already own the exact concepts (`compiledRoute` field, flag governance); a third documentation home would fragment the routing story. |
| Phase-gate wording to each hub's own live directive | The seven hubs already carry opt-in, flag-gated wording with the flag off by default; a catalog claiming default-on prematurely would misrepresent runtime behavior. |
| Exclude every child-mode catalog | Compiled routing resolves the hub mode before a packet loads, so a child-mode catalog never observes the decision — editing one would be both unnecessary and misleading. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Current-state catalog inventory | Confirmed this session: only `sk-design` has a hub-root `feature-catalog.md`; 6 of 7 eligible hubs lack one (`CF-CAT-1`) |
| Uppercase `FEATURE-CATALOG.md` off-by-case gap | Confirmed this session: `mcp-tooling/mcp-click-up/feature-catalog/FEATURE-CATALOG.md` is the sole uppercase file among 25 |
| Topology decision | Planned — not yet resolved |
| Path-citation hygiene (zero `.opencode/specs/**`) | Planned |
| Wording-phase-gate accuracy | Planned |
| Child-mode boundary (no edits) | Planned |
| Strict skill-package and spec-folder validation | Planned spec command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/006-feature-catalogs --strict` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The topology decision is open.** `synthesis-v1.md` §2.4 (`CF-CAT-1`) presents both options without picking one; this packet cannot truthfully claim coverage until an operator or build-time author resolves it.
2. **This packet is hard-blocked on `002`.** No catalog can cite a durable path before the resolver/engine/activation closure is promoted out of the spec tree.
3. **The per-hub leaf filename is a proposed convention, not a fully-evidenced requirement.** `compiled-routing-and-legacy-fallback.md` is directly evidenced only for `sk-design` (`CF-CAT-5`); using it fleet-wide is this packet's consistency choice.
4. **The P4 wording rewrite is owned elsewhere.** This packet defines the obligation (atomic rewrite at each hub's own P4 stage); `../011-activation-cutover-p4/` executes it.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Confirm `../002-runtime-promotion-and-status-foundation/` completion and record the promoted paths.
- [ ] Resolve and record the Option A vs. Option B topology decision.
- [ ] Author the catalog/leaf/extension files listed in `spec.md`.
- [ ] Run the path-citation grep, child-mode boundary diff, package validator, and strict spec-folder validation.
- [ ] Let the parent workflow generate `description.json` and `graph-metadata.json` for this spec folder; this leaf authoring pass does not create them.
<!-- /ANCHOR:follow-up -->
