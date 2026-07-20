---
title: "Implementation Plan: Compiled-Routing Feature Catalogs"
description: "Planned sequence for resolving the catalog-topology decision, authoring per-hub compiled-routing leaves (or a centralized alternative), extending the two existing routing-documentation surfaces, and phase-gating the wording — all sequenced after the 002 resolver-promotion foundation."
trigger_phrases:
  - "compiled routing catalogs plan"
  - "feature catalog topology decision plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Compiled-Routing Feature Catalogs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, authored via `sk-doc:create-feature-catalog` templates |
| **Documentation homes** | `<hub>/feature-catalog/feature-catalog.md` (root) + `.../compiled-routing-and-legacy-fallback.md` (leaf); `system-spec-kit/feature-catalog/governance/feature-flag-governance.md`; `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` |
| **Hard dependency** | `../002-runtime-promotion-and-status-foundation/` — durable resolver/engine/activation paths |
| **Wording posture** | Phase-gated: opt-in/additive pre-cutover, atomic rewrite at each hub's own P4 stage |

### Overview

The plan resolves one decision before writing a single file — complete the six missing hub-root catalogs and add a routing leaf to all seven, or centralize on `system-skill-advisor` instead — then extends the two existing canonical surfaces (`feature-flag-governance.md`, `advisor-recommend.md`) rather than inventing new ones, and finally authors the per-hub (or centralized) routing content with wording gated to each hub's actual cutover state. Every step waits on `002`'s promotion so no catalog cites a path that moves out from under it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `../002-runtime-promotion-and-status-foundation/` reports its promotion complete and names the stable runtime paths to cite.
- [ ] The topology decision (Option A: 6 root catalogs + 7 leaves, or Option B: centralized `system-skill-advisor` entry) is made and recorded.
- [ ] The exact phase-gated wording block (opt-in pre-cutover / default-on+kill-switch at P4) is approved against the seven hubs' current `SKILL.md` directives.

### Definition of Done

- [ ] Every eligible hub has either a canonical root catalog + leaf (Option A) or is represented in the centralized entry (Option B); no single-feature pseudo-catalog exists.
- [ ] `feature-flag-governance.md` and `advisor-recommend.md` are extended with the `SPECKIT_COMPILED_ROUTING` / `compiledRoute` documentation.
- [ ] Zero `.opencode/specs/**` citations exist in any shipped catalog.
- [ ] Every catalog's wording matches its hub's live cutover state at ship time.
- [ ] No child-mode catalog was edited with compiled-router content.
- [ ] Strict Level-2 packet validation passes on this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Extend-don't-duplicate. Two canonical surfaces already own the routing-flag and advisor-schema concepts; this packet extends both and adds only the hub-local discoverability layer (root catalogs + leaves, or one centralized entry) that does not yet exist anywhere.

### Key Components

- **Topology decision record**: which of Option A / Option B this packet ships, with rationale (recorded in `implementation-summary.md` at build time).
- **Per-hub compiled-routing leaf** (Option A) or **centralized entry** (Option B): the actual discoverability content, generated from the `create-feature-catalog` snippet template.
- **`feature-flag-governance.md` extension**: the `SPECKIT_COMPILED_ROUTING` entry (phased defaults, eligibility, serving status, drift, explicit `=0`).
- **`advisor-recommend.md` extension**: HOW-IT-WORKS + validation anchors for the optional `compiledRoute` field.
- **`sk-design` MANAGER SHELL extension**: the one hub that already has a root catalog gets a section extension instead of a new file.

### Data Flow

```text
002 promotion complete (durable paths named)
              |
              v
   resolve topology decision (A or B)
              |
        +-----+-----+
        v           v
  Option A:    Option B:
  6 root       1 centralized
  catalogs +   entry on
  7 leaves     system-skill-advisor
        |           |
        +-----+-----+
              v
  extend feature-flag-governance.md + advisor-recommend.md
              |
              v
  apply phase-gated wording per hub's live SKILL.md directive
              |
              v
  strict packet validation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|-----------------|---------------|
| `<hub>/feature-catalog/feature-catalog.md` (6 missing hubs) | Absent or child-mode-only | Create canonical root catalog (Option A) | `create-feature-catalog` package validator on the new file |
| `<hub>/feature-catalog/compiled-routing-and-legacy-fallback.md` (7 hubs) | Absent | Create per-hub leaf (Option A) | Path-citation grep (`rg -n "\.opencode/specs" <file>` returns zero) |
| `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | Existing governance catalog | Extend with `SPECKIT_COMPILED_ROUTING` entry | Diff review; structural parity with existing flag entries |
| `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` | Existing advisor-schema catalog | Extend HOW-IT-WORKS + validation anchors | Diff review; citation check against `advisor-tool-schemas.ts:221`, `advisor-recommend.ts:362` |
| `sk-design/feature-catalog/feature-catalog.md` | Existing hub-root catalog (the one exception) | Extend MANAGER SHELL section; add leaf reference | Diff review — confirm no unrelated section was rewritten |
| `mcp-tooling/*/feature-catalog/`, `system-deep-loop/*/feature-catalog/`, `sk-design/*/feature-catalog/` (child-mode) | Existing per-mode catalogs | **Unchanged — not a consumer** | `git diff` on these paths stays empty for this packet |
| `../002-runtime-promotion-and-status-foundation/` | P0 foundation this packet depends on | Read-only dependency | Confirm promotion complete before any catalog file is created |

Required inventories before authoring:
- Re-run the hub-root `feature-catalog/` existence check against the live tree (the count may have changed since this spec was authored).
- Confirm `002`'s promoted path names before citing any of them.
- Confirm each hub's live `SKILL.md` directive wording before drafting that hub's catalog text, so pre-cutover wording matches exactly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm `002`'s promotion is complete and record the stable runtime paths to cite.
- [ ] Resolve and record the topology decision (Option A vs. Option B) with rationale.
- [ ] Re-verify the hub-root catalog inventory (which hubs still lack one) against the live tree.
- [ ] Pin the exact phase-gated wording block against all seven hubs' current `SKILL.md` directives.

### Phase 2: Core Implementation

- [ ] Extend `feature-flag-governance.md` with the `SPECKIT_COMPILED_ROUTING` entry.
- [ ] Extend `advisor-recommend.md` HOW-IT-WORKS + validation anchors.
- [ ] Author the six missing hub-root catalogs (Option A) or the single centralized entry (Option B) via the `create-feature-catalog` template.
- [ ] Author the seven per-hub compiled-routing leaves (Option A) or fold their content into the centralized entry (Option B).
- [ ] Extend `sk-design`'s MANAGER SHELL section and add its leaf reference.

### Phase 3: Verification

- [ ] Grep every shipped catalog for `.opencode/specs` path citations; confirm zero hits.
- [ ] Confirm no child-mode catalog was touched (`git diff` empty on those paths).
- [ ] Run the `create-feature-catalog` package validator on every new/modified file.
- [ ] Run strict spec-folder validation on this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools |
|-----------|-------|----------------|
| Path-citation | Every shipped catalog cites only durable paths | `rg -n "\.opencode/specs" <file>` |
| Boundary | No child-mode catalog was edited | `git diff --stat` scoped to child-mode `feature-catalog/` paths |
| Structural | Root catalogs and leaves match the template shape | `create-feature-catalog` package/topology validator |
| Wording | Pre-cutover text matches each hub's live directive | Manual diff against the seven `SKILL.md` compiled-routing blocks |
| Package | Full spec-folder conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|---------------------|
| `../002-runtime-promotion-and-status-foundation/` | Internal | Planned | No durable path exists to cite; every catalog would go stale on promotion |
| `sk-doc:create-feature-catalog` templates | Internal | Available | Provides the structural shape for both roots and leaves |
| `feature-flag-governance.md`, `advisor-recommend.md` | Internal | Available | Both already exist and are the correct extension points |
| Seven hubs' live `SKILL.md` compiled-routing directives | Internal | Available | Source of truth for phase-gated wording |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped catalog cites a path that moves under a later promotion; the topology decision is reversed after files exist; a child-mode catalog was edited in error; wording drifts ahead of a hub's actual cutover state.
- **Procedure**: Revert the offending catalog file(s) via normal version control; documentation changes carry no runtime effect, so reverting is a plain file revert with no external state to unwind. Re-derive the citation or wording from the current source of truth (`002`'s promoted paths, the hub's live `SKILL.md` directive) before re-shipping.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup / topology + wording pin) ──► Phase 2 (Core / author catalogs + extend surfaces) ──► Phase 3 (Verify / citation + boundary + package)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `002` promotion complete, topology decision | Core |
| Core | Setup | Verify |
| Verify | Core | The P3 coverage-closure join gate (`../011-activation-cutover-p4/`) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|---------------------|
| Setup (topology + wording pin) | Low | One decision, one wording block, verified against 7 directives |
| Core (author up to 8 files + 2 extensions) | Med | Templated authoring, repeated per hub |
| Verification (citation + boundary + package) | Low | Scripted checks + one strict validation run |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [ ] `002` promotion confirmed complete; stable paths named.
- [ ] Topology decision recorded with rationale.
- [ ] No existing hub-root or child-mode catalog is targeted for an unplanned rewrite.

### Rollback Procedure

1. Revert the specific catalog file(s) via version control.
2. Re-confirm the current durable path or live directive wording.
3. Re-author and re-ship only the corrected file(s).

### Data Reversal

- **Has runtime effect?** No — this packet is documentation-only.
- **Reversal procedure**: Plain file revert; no external state, cache, or runtime consumer to unwind.
<!-- /ANCHOR:enhanced-rollback -->
