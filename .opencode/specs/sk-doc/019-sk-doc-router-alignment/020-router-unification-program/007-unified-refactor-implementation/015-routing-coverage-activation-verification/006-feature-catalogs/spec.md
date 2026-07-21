---
title: "Feature Specification: Compiled-Routing Feature Catalogs"
description: "Plan seven hub-root feature catalogs (or a centralized system-skill-advisor alternative) carrying one compiled-routing leaf each, the extension of the existing system-spec-kit feature-flag-governance catalog and the system-skill-advisor advisor-recommend entry, phase-gated wording (opt-in/additive pre-cutover, default-on + kill-switch atomically at P4), and strict sequencing after the 002 resolver-promotion foundation lands."
trigger_phrases:
  - "compiled routing feature catalogs"
  - "seven hub root catalog coverage"
  - "feature flag governance compiled routing entry"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Compiled-Routing Feature Catalogs

## EXECUTIVE SUMMARY

The compiled skill-router is built, shadow-proven, and bound across all seven eligible parent hubs, but its documentation footprint is nearly invisible: a direct check of every hub's `feature-catalog/` tree confirms only `sk-design` owns a hub-root `feature-catalog.md` (`sk-design/feature-catalog/feature-catalog.md`); the other six eligible hubs — `sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-prompt`, `sk-doc` — have either no `feature-catalog/` directory at all or only per-child-mode catalogs beneath them (e.g. `mcp-tooling/mcp-figma/feature-catalog/`, `system-deep-loop/deep-research/feature-catalog/`). Six of seven eligible hubs lacking a canonical root catalog is exactly `CF-CAT-1` (`synthesis-v1.md` §2.4); this packet also confirms the count directly rather than trusting the synthesis figure.

This phase delivered (committed in `8532c4b64b`) the catalog coverage via Option A: complete canonical root catalogs for the six missing hubs plus one compiled-routing leaf on all seven (`CF-CAT-1`). Either path extends the existing `system-spec-kit` feature-flag-governance catalog and the `system-skill-advisor` `advisor-recommend.md` entry rather than inventing a new documentation home (`CF-CAT-2`, `CF-CAT-3`), uses phase-gated wording so no catalog claims default-on before its own hub's `SKILL.md` directive does (`CF-CAT-2`), and is sequenced strictly after `../002-runtime-promotion-and-status-foundation/` promotes the resolver/engine/activation closure out of the mutable spec tree, so no catalog ever cites a `.opencode/specs/**` path (`CF-CAT-4`). Child-mode catalogs (per-transport under `mcp-tooling`, per-mode under `system-deep-loop` and `sk-design`) are explicitly out of bounds for compiled-router content — compiled routing resolves the hub mode *before* the packet loads, so a child-mode catalog never observes it (`CF-CAT-5`).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 |
| **Status** | Implemented — committed in `8532c4b64b` (see `implementation-summary.md`; topology resolved as Option A) |
| **Created** | 2026-07-20 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |
| **Phase** | 006-feature-catalogs (015 child; contributes to the P3 coverage-closure join gate ahead of P4) |
| **Depends on** | `../002-runtime-promotion-and-status-foundation/` — durable resolver/engine/activation paths this packet must cite |
| **Consumed research** | `../001-research/synthesis-v1.md` §2.4 (`CF-CAT-1..5`), `../001-research/review-v1.md` §4 row `006-feature-catalogs` |
| **Blast radius** | Documentation-only — new/extended feature-catalog Markdown; no runtime, router, manifest, or scorer file touched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Confirmed Current State

A direct `find -iname "feature-catalog*"` scoped to each of the seven compiled-routing-eligible hubs (`advisor-recommend.ts:41-49` `COMPILED_ROUTING_HUBS`) shows: `sk-design/feature-catalog/feature-catalog.md` exists at hub root; `sk-code`, `cli-external-orchestration`, and `sk-prompt` have no `feature-catalog/` directory anywhere beneath them; `mcp-tooling`, `system-deep-loop`, and `sk-doc` have `feature-catalog/` directories only under child-mode subpackets (`mcp-tooling/mcp-chrome-devtools/feature-catalog/`, `system-deep-loop/deep-alignment/feature-catalog/`, `sk-doc/create-diff/feature-catalog/`, etc.), never at the hub root. A separate `find -iname "FEATURE-CATALOG.md"` (case-sensitive) confirms `mcp-tooling/mcp-click-up/feature-catalog/FEATURE-CATALOG.md` is uppercase while every other catalog in the repository is lowercase — an off-by-case gap that undercounts the true catalog population by exactly one under case-sensitive discovery (`F-1-6`, CONFIRMED in `verification-v1.md` §2: "`find -iname` returns 25 files total; exactly one is uppercase").

`system-spec-kit/feature-catalog/governance/feature-flag-governance.md` and `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` both already exist and are the correct extension points: `compiledRoute` is an optional field on the `advisor_recommend` schema (`advisor-tool-schemas.ts:221`), and the flag directly gates its enrichment (`advisor-recommend.ts:362`) — CONFIRMED, `synthesis-v1.md` Appendix A.

### Problem Statement

Compiled routing has no discoverable documentation surface across six of seven eligible hubs. Adding a routing leaf to a hub with no root catalog would create a misleading single-feature pseudo-catalog — a "catalog" whose only content is the one feature nobody asked to browse for (`CF-CAT-1`). Wording that claims default-on before a hub's own `SKILL.md` directive flips would misrepresent current runtime behavior, since the seven hubs already carry the opt-in, flag-gated directive and the flag defaults off (`CF-CAT-2`, `advisor-recommend.ts:362` still gates on `=== '1'`, CONFIRMED). Documenting the routing concept from scratch per hub would duplicate the feature-flag-governance and advisor-recommend surfaces that already own it (`CF-CAT-3`). And citing today's resolver location would go stale the moment `002` promotes the closure out of the spec tree (`CF-CAT-4`, `resolve.cjs:19` currently resolves into `010-live-activation/activation`, CONFIRMED).

### Purpose

Plan — and record the topology decision for — complete, durable, phase-honest compiled-routing documentation across the seven eligible hubs, extending the two existing canonical surfaces rather than duplicating them, sequenced so that every citation in every catalog is already durable at the moment the catalog is authored.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Resolve and record the catalog-topology decision — **Option A**: author canonical hub-root `feature-catalog.md` for the six hubs currently missing one, then add one compiled-routing leaf to all seven hub-root catalogs; or **Option B**: centralize all compiled-routing documentation on the `system-skill-advisor` surface instead of seven per-hub leaves — before any catalog file is authored. Never author a single-feature pseudo-catalog under either option (`CF-CAT-1`).
- Author one compiled-routing leaf per eligible hub (if Option A) through the `sk-doc:create-feature-catalog` snippet template, citing only durable runtime paths.
- Extend (never replace) `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` with the `SPECKIT_COMPILED_ROUTING` entry: phased defaults, eligibility, serving status, drift, explicit `=0` (`CF-CAT-3`).
- Extend `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` HOW-IT-WORKS and validation anchors documenting when `compiledRoute` is attached vs. intentionally absent (`CF-CAT-3`).
- Phase-gated wording discipline: opt-in/additive pre-cutover; atomic rewrite to default-on + explicit `=0` kill-switch wording at the same P4 stage as that hub's own directive flip, gated on the hub passing parity/serving-status/fallback/rollback checks (`CF-CAT-2`).
- The `sk-design` exception: extend its existing hub-root catalog's MANAGER SHELL section and add its own compiled-routing leaf, since it is the one hub that already owns a root catalog (`CF-CAT-5`).

### Out of Scope

- Any runtime, router, engine, manifest, or scorer file change — [why] this packet is documentation-only; catalogs describe behavior, they never implement it.
- Authoring any catalog before `../002-runtime-promotion-and-status-foundation/` lands — [why] every catalog would cite the ephemeral spec-tree resolver path and go stale on promotion (`CF-CAT-4`).
- Editing any child-mode catalog (`mcp-tooling`'s per-transport catalogs, `system-deep-loop`'s per-mode catalogs, `sk-design`'s per-mode catalogs) with compiled-router content — [why] compiled routing resolves the hub mode before the packet loads, so a child-mode catalog never observes the decision (`CF-CAT-5`).
- The P4 hub-by-hub default-on rewrite itself — [why] owned by `../011-activation-cutover-p4/`; this packet defines the wording obligation and stages the pre-cutover opt-in text only.
- Redefining eligibility, serving-status semantics, or the flag's tri-state behavior — [why] owned by `../002-runtime-promotion-and-status-foundation/`; catalogs consume and cite that authority, never restate it independently.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `sk-code/feature-catalog/feature-catalog.md` | Create — Option A only | Canonical hub-root catalog (currently absent) |
| `mcp-tooling/feature-catalog/feature-catalog.md` | Create — Option A only | Canonical hub-root catalog (currently only child-mode catalogs exist) |
| `system-deep-loop/feature-catalog/feature-catalog.md` | Create — Option A only | Canonical hub-root catalog (currently only child-mode catalogs exist) |
| `cli-external-orchestration/feature-catalog/feature-catalog.md` | Create — Option A only | Canonical hub-root catalog (currently absent) |
| `sk-prompt/feature-catalog/feature-catalog.md` | Create — Option A only | Canonical hub-root catalog (currently absent) |
| `sk-doc/feature-catalog/feature-catalog.md` | Create — Option A only | Canonical hub-root catalog (currently only `create-diff`'s child-mode catalog exists) |
| `<hub>/feature-catalog/compiled-routing-and-legacy-fallback.md` (all 7 hubs) | Create — Option A only | Per-hub compiled-routing leaf, opt-in wording pre-cutover |
| `system-skill-advisor/feature-catalog/mcp-surface/compiled-routing-and-legacy-fallback.md` (or equivalent) | Create — Option B only | Single centralized compiled-routing entry, replacing the 7 per-hub leaves |
| `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | Modify | Add the `SPECKIT_COMPILED_ROUTING` flag entry |
| `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` | Modify | Add HOW-IT-WORKS + validation anchors for the optional `compiledRoute` field |
| `sk-design/feature-catalog/feature-catalog.md` | Modify | Extend the existing MANAGER SHELL section; add the compiled-routing leaf reference |

> No file in this table is modified by this planning-only phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resolve and record the catalog-topology decision before authoring any catalog file. | This packet (or its `implementation-summary.md` at build time) states explicitly whether Option A (6 new root catalogs + 7 leaves) or Option B (centralized `system-skill-advisor` entry) was chosen, with a one-paragraph rationale; no catalog file exists under either option with compiled routing as its sole content (no single-feature pseudo-catalog). |
| REQ-002 | Author one compiled-routing leaf per eligible hub (Option A) or one centralized entry (Option B), citing only durable runtime paths. | Every leaf/entry is generated via the `sk-doc:create-feature-catalog` snippet template; a `grep -rn "\.opencode/specs" <catalog-path>` on every shipped catalog file returns zero hits. |
| REQ-003 | Phase-gate the wording: opt-in/additive pre-cutover; atomic rewrite to default-on + kill-switch at that hub's own P4 stage. | Every catalog authored before a hub's P4 flip uses only opt-in, flag-gated, additive language matching the hub's live `SKILL.md` directive; no catalog claims default-on ahead of its hub's own cutover; the P4 rewrite condition (parity + serving-status + fallback + rollback all green) is stated as an explicit gate, not a target date. |
| REQ-004 | Extend the existing `system-spec-kit` feature-flag-governance catalog rather than creating a new root feature. | `feature-flag-governance.md` gains a `SPECKIT_COMPILED_ROUTING` entry covering phased defaults, eligibility, serving status, drift, and the explicit `=0` override, in the same structural shape as its existing flag entries. |
| REQ-005 | Extend the existing `system-skill-advisor` `advisor-recommend.md` entry rather than creating a new root feature. | `advisor-recommend.md` HOW-IT-WORKS section documents when `compiledRoute` is attached (flag on, hub eligible, serving compiled) vs. intentionally absent (flag off, hub ineligible, or legacy sentinel), with a validation anchor citing `advisor-tool-schemas.ts:221` and `advisor-recommend.ts:362`. |
| REQ-006 | Sequence all catalog authoring strictly after `../002-runtime-promotion-and-status-foundation/` lands. | No catalog file is created or shipped before 002's promotion is verified complete; every path cited in a shipped catalog resolves under the promoted, stable runtime location, never `.opencode/specs/**`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Enforce the child-mode catalog boundary. | No compiled-router content is added to any per-transport (`mcp-tooling/mcp-*`) or per-mode (`system-deep-loop/deep-*`, `sk-design/design-*`) catalog; `sk-design`'s hub-root catalog is the one exception, receiving an extended MANAGER SHELL section plus its own leaf. |
| REQ-008 | Author every catalog/leaf exclusively through the `sk-doc:create-feature-catalog` mode templates. | Root catalogs use `assets/feature-catalog-template.md`; leaves/entries use `assets/feature-catalog-snippet-template.md`; no bespoke catalog shape is hand-rolled. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The topology decision (Option A or B) is recorded with rationale before the first catalog file is authored.
- **SC-002**: No shipped catalog is a single-feature pseudo-catalog; every hub-root catalog (Option A) documents the hub's existing feature set, not only routing.
- **SC-003**: Every shipped catalog uses phase-gated wording matching its hub's live cutover state at the moment of authoring.
- **SC-004**: `feature-flag-governance.md` and `advisor-recommend.md` are extended, not duplicated, by a second independent routing-documentation surface.
- **SC-005**: Zero `.opencode/specs/**` path citations exist in any shipped catalog file.
- **SC-006**: Compiled-router content never appears in a child-mode catalog; `sk-design`'s treatment is the sole, explicitly documented exception.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../002-runtime-promotion-and-status-foundation/` (durable resolver/engine/activation paths) | Catalogs cannot cite a stable path before promotion lands | Hard-gate REQ-006; no catalog file created before 002 verified complete |
| Risk | Topology decision reversed mid-build | Six freshly-authored root catalogs would need retiring, or a centralized entry would need splitting | Resolve and record the decision (REQ-001) before any file is authored; treat it as a one-time, documented choice |
| Risk | Catalog wording drifts ahead of its hub's actual P4 state | A catalog could claim default-on while the hub is still flag-gated, misleading an operator | REQ-003 ties every wording claim to the hub's live `SKILL.md` directive; the P4 rewrite is a gate, not a schedule |
| Risk | `FEATURE-CATALOG.md` case inconsistency spreads to new files | New catalogs could repeat the uppercase drift and further muddy case-sensitive discovery | Every new file created by this packet uses lowercase `feature-catalog.md`/`feature-catalog-*.md`; the existing uppercase file is noted, not replicated (out of scope to rename it here) |
| Risk | A child-mode catalog is accidentally edited for "consistency" | Would violate the resolves-before-load boundary and duplicate routing documentation at the wrong layer | REQ-007 states the boundary explicitly as a hard scope exclusion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Durability
- **NFR-D01**: Every path cited in a shipped catalog resolves under a promoted, stable runtime location; none resolves under `.opencode/specs/**`.
- **NFR-D02**: Catalog content is generated from the same source of truth as the hub's live `SKILL.md` directive — no independent, hand-maintained claim about routing state.

### Consistency
- **NFR-C01**: All seven per-hub leaves (Option A) or the single centralized entry (Option B) share one normalized structure, produced from the same `create-feature-catalog` snippet template.
- **NFR-C02**: Phase-gated wording is identical in shape across all seven hubs pre-cutover; only the hub name and cited paths vary.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Topology boundary
- A hub with an existing catalog (`sk-design`) receives only a section extension + leaf, never a rewritten root.
- An attempted single-feature pseudo-catalog (all content = compiled routing, no other feature documented) is rejected under either topology option.

### Sequencing
- Catalog authoring attempted before `002` ships: blocked: REQ-006 is a hard precondition, not a soft ordering preference.
- `002` ships a partial promotion (e.g., resolver moved but engine loader not yet): catalogs wait for the full closure, not a partial one — a catalog citing a half-promoted path is as stale as one citing the original spec-tree path.

### Phase-gate drift
- One hub reaches P4 while five others are still pre-cutover: only that hub's catalog rewrites to default-on wording; the other six remain opt-in until their own P4 stage.
- A hub's P4 gate check regresses after its catalog was rewritten to default-on wording: the catalog wording must revert alongside any P4 rollback — this packet documents the obligation; `../011-activation-cutover-p4/` owns the actual rewrite/rollback mechanics.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Up to 8 new/modified catalog files across 7 hubs plus 2 existing-surface extensions; one topology decision to record |
| Risk | 9/25 | Documentation-only, additive, fully reversible; the real risk is premature/stale citation, mitigated by the hard 002 sequencing gate |
| Research | 11/20 | Topology decision and phase-gated wording design are specified in `synthesis-v1.md` §2.4; residual work is per-hub content authoring |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which topology — Option A (6 new root catalogs + 7 leaves) or Option B (centralized `system-skill-advisor` entry) — should this program commit to? `synthesis-v1.md` §2.4 leaves both open; this packet's `implementation-summary.md` must record the resolved choice at build time.
- Should the per-hub leaf filename be `compiled-routing-and-legacy-fallback.md` fleet-wide? That exact name is directly evidenced only for `sk-design` (`CF-CAT-5`); adopting it for the other six hubs is a consistency choice this packet proposes, not an independently-evidenced requirement.
- If Option B is chosen, does the centralized `system-skill-advisor` entry need its own new hub-root catalog file, or does it extend `advisor-recommend.md` directly? Both are consistent with "extend, don't duplicate" (REQ-005); the build-time author should pick the shape that keeps `advisor-recommend.md` from becoming the single point of documentation for an unrelated concern.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Upstream research**: `../001-research/synthesis-v1.md` §2.4 (`CF-CAT-1..5`), `../001-research/review-v1.md` §4 (row `006-feature-catalogs`)
- **Dependency**: `../002-runtime-promotion-and-status-foundation/`
- **Master plan (phase map + shared gate model)**: `../spec.md`
- **Catalog authoring workflow**: `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md`
