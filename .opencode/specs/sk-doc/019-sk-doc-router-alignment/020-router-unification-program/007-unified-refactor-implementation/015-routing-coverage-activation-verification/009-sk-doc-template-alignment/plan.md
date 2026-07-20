---
title: "Implementation Plan: sk-doc Template Alignment"
description: "How the trigger_phrases routing-claim fix, the topology quote-tolerance fix, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest land as doc-truth and validator corrections, behind the still-off SPECKIT_COMPILED_ROUTING flag."
trigger_phrases:
  - "sk-doc template alignment plan"
  - "strict package validator plan"
  - "lockstep directive manifest plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: sk-doc Template Alignment

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
| **Language/Stack** | Markdown templates (`feature-catalog-snippet-template.md`, `feature-catalog-template.md`), Node/CommonJS (`validate-playbook-topology.cjs`), Python (`validate_document.py`, new `validate_catalog_package.py`), TypeScript (`doc-frontmatter.ts`), Vitest/JSON (lockstep manifest + parity test) |
| **Taxonomy authority (post-child)** | `validate_document.py`'s `allowed` set + `feature-catalog-snippet-template.md`'s Type-column line — one 12-value canonical list |
| **Lockstep authority (post-child)** | `compiled-routing-lockstep-surfaces.json` — the single manifest 011 consumes for the P4 atomic rewrite |
| **Frozen inputs** | Three pinned scorer digests — read-only evidence only; nothing in this child invokes or edits them |
| **Dependency** | `002-runtime-promotion-and-status-foundation` (sequencing baseline; no hard technical blocker identified for this child's own REQs) |

### Overview

Five corrections, each independently shippable. First, remove the false trigger_phrases routing-effect claim from the catalog templates (a doc-truth fix, zero code change). Second, make the topology validator's frontmatter parsing quote-tolerant and document one canonical serialization. Third, replace the stale 2-value test-type taxonomy with a 12-value canonical set derived from a fresh corpus census, updating both the validator and the template. Fourth, ship a new strict package validator proving catalog-set bijection, source-path existence, and taxonomy conformance. Fifth, extend the documented P4 lockstep directive-surface set to explicitly include both create-skill parent templates, backed by a normalized-parity fixture test. None of these touch a routing decision or the frozen scorer.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `feature-catalog-snippet-template.md:41` and `doc-frontmatter.ts`'s `HARVEST_SUBDIRS` are re-read and confirmed at their current locations (cited lines re-anchored on the symbol).
- [ ] `validate_document.py`'s `allowed` set and its `off_taxonomy_validation_type` comment are re-read to confirm the current 2-value baseline before widening it.
- [ ] The three frozen scorer digests are confirmed unchanged immediately before work starts.

### Definition of Done
- [ ] `feature-catalog-snippet-template.md` and `feature-catalog-template.md` no longer claim trigger_phrases drives routing (unless REQ-006 has shipped and made it true).
- [ ] `validate-playbook-topology.cjs` accepts quoted and unquoted typed-gold fixtures identically; one canonical serialization is documented.
- [ ] The strict package validator reports zero bijection/path/taxonomy violations on a clean corpus and correctly fails each seeded violation class.
- [ ] `compiled-routing-lockstep-surfaces.json` names all 9 lockstep surfaces; the normalized-parity fixture test passes clean and fails on a seeded drift.
- [ ] (P1) The 12-value taxonomy accounts for 100% of the live corpus's observed values; `validate_document.py` and the snippet template both reflect it.
- [ ] (P1) The harvester extension (if shipped in this child) passes its invariance test.
- [ ] Frozen-scorer SHA-256 unchanged pre/post; `validate.sh --strict` on this child folder reports Errors: 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Doc-truth-first, then quote-tolerance, then taxonomy-and-validator, then lockstep-manifest — four independent correction tracks that converge on "sk-doc's templates and validators say only what the live code actually does." Nothing here edits a routing decision, a manifest's `selectedPolicy`, or the frozen scorer.

### Key Components
- **`feature-catalog-snippet-template.md` / `feature-catalog-template.md`**: the corrected trigger_phrases claim and the updated Type-column line.
- **`validate-playbook-topology.cjs`**: quote-tolerant frontmatter/typed-gold parsing.
- **`validate_document.py`**: the 12-value canonical `allowed` taxonomy set.
- **`validate_catalog_package.py`** (new): the strict package-level validator.
- **`compiled-routing-lockstep-surfaces.json`** (new): the authoritative P4 lockstep directive-surface manifest.

### Data Flow

Live corpus (catalog files + SOURCE FILES rows) → `validate_catalog_package.py` checks bijection (router/advisor-central + 7 hub catalogs) + path existence + taxonomy membership → non-zero exit names the specific violation. Separately: the 7 hub `SKILL.md` directives + the 2 create-skill parent templates → `compiled-routing-lockstep-surfaces.json` (the registered set) → `compiled-routing-lockstep-parity.test.cjs` asserts normalized-identical wording across all 9 → `011-activation-cutover-p4` later reads this same manifest during its atomic rewrite.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child corrects documentation claims and validator scope over an unmodified live corpus and unmodified routing logic — the surface inventory below is required before any edit.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `feature-catalog-snippet-template.md` (~L41, ~L157) | Claims trigger_phrases drives routing; caps Type column at 2 values | Remove/correct the routing claim; widen Type-column line to 12 values | `grep -n "drives skill-advisor routing" feature-catalog-snippet-template.md` returns no hit (or an accurate, harvester-scoped claim if REQ-006 ships first) |
| `feature-catalog-template.md` | May repeat the same trigger_phrases wording | Sweep and align with the snippet template | Same grep sweep across both files returns consistent wording |
| `validate-playbook-topology.cjs` (~L95) | Quote-intolerant frontmatter/typed-gold regex | Accept quoted and unquoted scalars | Quoted + unquoted fixtures both parse to identical structured output |
| `validate_document.py` (~L715-745) | 2-value `allowed` taxonomy, warning-only off-taxonomy check | Widen to 12-value canonical taxonomy | Zero unmapped stragglers against a fresh corpus census |
| `validate_catalog_package.py` (new) | Does not exist | Create: bijection + path-existence + taxonomy validator | Passes clean corpus; fails each seeded violation class by name |
| `compiled-routing-lockstep-surfaces.json` (new) | No authoritative lockstep list exists; only "7 SKILL.md directives" is documented prose | Create the 9-surface manifest (7 hub SKILL.md + 2 parent templates) | `011` can read this file as its rewrite-target list; parity test consumes the same file |
| `doc-frontmatter.ts` `HARVEST_SUBDIRS` (~L146) | `['references', 'assets']` only | Add a capped feature-catalog leaf path (P1) | Invariance test: no score/rank change for any currently-harvested doc |
| Frozen scorer trio | Read-only; not invoked by any script in this child | **Unchanged — not a consumer** | Pre/post SHA-256 identical |

Required inventories before implementation:
- Re-anchor every cited `file:line` on the SYMBOL (not the number) per `review-v1.md` §2's ±2–10-line drift note.
- Run a fresh census of the live corpus's SOURCE FILES Type-column values before finalizing the 12-value taxonomy (do not assume the ~35-value figure cited in `spec.md` is current or exhaustive).
- Confirm `.opencode/skills/sk-doc/scripts/validate_document.py` remains a symlink to `shared/scripts/validate_document.py` before editing (only the shared copy needs the change).

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

**Focus**: Doc-truth fixes + quote-tolerance.

- [ ] Remove/correct the trigger_phrases routing claim in `feature-catalog-snippet-template.md` and `feature-catalog-template.md`.
- [ ] Make `validate-playbook-topology.cjs`'s frontmatter/typed-gold parsing quote-tolerant; document the canonical serialization.
- [ ] Add quoted + unquoted fixtures for the topology validator.

### Phase 2: Implementation

**Focus**: Taxonomy, strict package validator, lockstep manifest.

- [ ] Run a fresh census of the live corpus's Type-column values; define the 12-value canonical taxonomy.
- [ ] Update `validate_document.py`'s `allowed` set and the snippet template's Type-column line.
- [ ] Author `validate_catalog_package.py` (bijection + path-existence + taxonomy).
- [ ] Author `compiled-routing-lockstep-surfaces.json` naming all 9 lockstep surfaces.
- [ ] Author `compiled-routing-lockstep-parity.test.cjs`.

### Phase 3: Verification

**Focus**: Stretch harvester extension (P1), then final verification.

- [ ] (P1) Extend `doc-frontmatter.ts`'s `HARVEST_SUBDIRS` to a capped feature-catalog leaf path; add the invariance test.
- [ ] Re-hash the three frozen scorer files before and after this child's full diff; confirm unchanged.
- [ ] Run `validate.sh --strict` on this child folder.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture | Quoted vs. unquoted typed-gold parsing | `validate-playbook-topology.cjs` fixtures |
| Census | Live corpus Type-column value coverage | Manual/scripted grep census feeding the 12-value taxonomy design |
| Package | Catalog-set bijection, path existence, taxonomy | `validate_catalog_package.py` against the live corpus + seeded violation fixtures |
| Parity | 9 lockstep surfaces (7 hub SKILL.md + 2 templates) | `compiled-routing-lockstep-parity.test.cjs` |
| Invariance (P1) | Harvester extension does not alter existing scores | `doc-frontmatter.ts` before/after diff on `references/`/`assets/` docs |
| Regression | Default behavior of every touched validator is unchanged for already-passing inputs | Before/after diff on the current corpus |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `002-runtime-promotion-and-status-foundation` | Internal | Planned (not started) | Sequencing baseline only; no REQ in this child has a confirmed hard technical dependency on 002's promoted path |
| `011-activation-cutover-p4` (Planned) | Internal | Planned (not started) | REQ-004's lockstep manifest has no consumer until 011 ships; the manifest and parity test still validate independently |
| `013-create-skill-alignment` (Planned) | Internal | Planned (not started) | REQ-004's parity test compares whatever wording exists at run time; 013 shipping first would make the comparison meaningful sooner, but is not a hard block |
| Live sk-doc corpus (catalogs, playbooks) | Internal | Present, uncensused | REQ-003/REQ-005 need a fresh census before the taxonomy/validator can be finalized |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any phase fails its own verification, or the fresh corpus census reveals the 12-value taxonomy target is wrong and needs redesign.
- **Procedure**: Every change in this child is additive or a doc-truth correction — a corrected claim, a widened taxonomy, a new validator, a new manifest, a new test. Rollback is a plain `git revert` of this child's diff; no manifest, fence, or serving-authority state exists for this child to disturb, so there is no CAS or hash-restore drill beyond the file revert itself.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Doc-truth + quote-tolerance) ──► Phase 2 (Taxonomy + package validator + lockstep manifest) ──► Phase 3 (Stretch: harvester + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (doc-truth + quote-tolerance) | — | Phase 2 |
| Implementation (taxonomy + validator + manifest) | Setup | Phase 3 |
| Verification (stretch + final checks) | Implementation | Completion |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|--------------------|
| Setup (doc-truth + quote-tolerance) | Low | Targeted template + regex edits |
| Implementation (taxonomy + validator + manifest) | Med-High | New census, new script, new manifest, new test |
| Verification (stretch + final) | Low-Med | Harvester extension is small; final checks are automated |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [ ] Frozen-scorer digests re-verified before any change.
- [ ] Fresh corpus census completed before finalizing the 12-value taxonomy.
- [ ] Cited `file:line` locations re-anchored on the symbol.

### Rollback procedure
1. `git revert` this child's diff (template corrections, taxonomy widening, new validator, new manifest, new tests).
2. Confirm the frozen scorer digests are still unchanged after the revert.
3. Confirm no manifest, fence, or `selectedPolicy` state exists for this child to restore (none was ever touched).

### Data reversal
- **Has runtime effect?** No — every artifact here is a doc, a validator, a manifest, or a test; nothing serves traffic and no routing decision changes.
- **Reversal procedure**: Plain file revert; no external committed effect exists to undo.

<!-- /ANCHOR:enhanced-rollback -->
