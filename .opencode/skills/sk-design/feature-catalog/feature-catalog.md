---
title: "sk-design: Feature Catalog"
description: "Unified current-state inventory for the sk-design hub, covering manager-shell routing, proof gates, styles-library grounding, transport separation, and private procedure-card selection."
trigger_phrases:
  - "sk-design feature catalog"
  - "design family hub capabilities"
  - "procedure card system"
  - "design proof gates"
last_updated: "2026-07-18"
version: 1.1.0.0
---

# sk-design: Feature Catalog

This catalog inventories the live `sk-design` hub surface. The hub routes one public design-family identity to five mode packets, keeps mode logic in those packets, names proof expectations before ready claims, and separates design judgment from transport mechanics.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `sk-design` hub. The hub does not replace the child modes; it resolves the mode, gathers context, names proof, and keeps private procedure cards behind existing public routes.

---

## 2. MANAGER SHELL

### Context-First Intake And Visible Plan

#### Description

The hub gathers goal, surface, inputs, constraints, and proof expectations before routing when missing facts could change the selected design mode or acceptance bar.

#### Current Reality

The routing shell reads `mode-registry.json`, chooses the smallest useful design mode, and shows a concise plan before substantial design, build, or transport work. The plan names the selected mode, loaded or missing context, intended design/audit dimensions, proof requirements, and handoff target.

#### Source Files

See [`manager-shell/context-first-intake-and-visible-plan.md`](manager-shell/context-first-intake-and-visible-plan.md) for source anchors and routing details.

---

### Proof Gates And Verifier Cadence

#### Description

The hub requires taste, accessibility, responsive, and transport proof before ready claims, delegating detailed evidence rules to the selected mode.

#### Current Reality

The verifier cadence is intake before routing, visible plan before substantial output, proof review before ready claims, and `sk-code` verification after implementation handoff. Missing proof blocks the ready claim rather than being filled by transport output.

#### Source Files

See [`manager-shell/proof-gates-and-verifier-cadence.md`](manager-shell/proof-gates-and-verifier-cadence.md) for proof fields and verifier cadence.

---

### Transport Vs Taste Separation

#### Description

The hub treats Figma, Open Design, browser, and extraction transports as evidence sources or artifact movers, not design-judgment authorities.

#### Current Reality

`mcp-figma` and `design-mcp-open-design` (nested inside `sk-design`) are loaded after design mode selection when needed. Their output must return to the selected mode or audit mode for acceptance, and the hub keeps design proof in `sk-design`.

#### Source Files

See [`manager-shell/transport-vs-taste-separation.md`](manager-shell/transport-vs-taste-separation.md) for the boundary and integration points.

---

## 3. PROCEDURE CARD SYSTEM

### Procedure Card Schema And Selection

#### Description

Private procedure cards add repeatable process inside the already-selected public mode without creating new public skill identities or tool permissions.

#### Current Reality

Cards live under mode-local `procedures/` folders or `shared/procedures/` for cross-mode orchestration. The schema requires a fixed field table, selection rules, source adaptation rules, and read-only or mutating boundary statements.

#### Source Files

See [`procedure-card-system/procedure-card-schema-and-selection.md`](procedure-card-system/procedure-card-schema-and-selection.md) for schema and selection rules.

---

### Procedure Card Inventory

#### Description

The hub has a current inventory of 14 private procedure cards across the design family: one shared card, six interface cards, three foundations cards, one motion card, two audit cards, and one md-generator card.

#### Current Reality

The cards support narrower workflows after public mode routing: discovery, aesthetic direction, wireframes, variations, prototypes, decks, component/system review, hierarchy/rhythm, tweak controls, interaction states, accessibility audit, AI slop checks, measured extraction, and shared polish orchestration.

#### Source Files

See [`procedure-card-system/procedure-card-inventory.md`](procedure-card-system/procedure-card-inventory.md) for the complete card list and ownership boundaries.

---

## 4. STYLES-LIBRARY UTILIZATION

### Retrieval Engine

#### Description

The committed styles corpus has a deterministic retrieval surface that filters eligibility before ranking, returns compact candidate cards and hydrates selected records only under generation and path-containment guards.

#### Current Reality

The engine checks a byte-stable manifest over 1,290 bundles, uses an in-memory full-text accelerator with a bounded source-scan fallback and refuses stale or unprovenanced hydration. The corpus remains advisory evidence rather than a source of design authority.

#### Source Files

See [`styles-library-utilization/retrieval-engine.md`](styles-library-utilization/retrieval-engine.md) for implementation and validation anchors.

---

### Shared Corpus-Context Seam

#### Description

The shared `CORPUS_CONTEXT_PLAN v1` envelope carries capability and proof planning to mode-owned consumers without hydrating a style or choosing taste in the hub.

#### Current Reality

The seam enforces zero hydrated styles, a closed capability vocabulary, five fail-closed outcomes and the fixed authority order. Corpus evidence can explain relationships, expose counterexamples, sharpen critique and preserve provenance, but it cannot make a verdict or accept transport output.

#### Source Files

See [`styles-library-utilization/shared-corpus-context-seam.md`](styles-library-utilization/shared-corpus-context-seam.md) for the envelope and validator contract.

---

### Per-Mode Consumers

#### Description

Interface, audit, foundations, motion and Open Design transport each consume styles-library evidence through a mode-specific closed contract.

#### Current Reality

Interface emits a decision-only relational handoff, audit emits non-authoritative comparison rows, foundations emits typed relationships, motion runs restraint before retrieval and transport carries metadata-only grounding receipts. Each consumer fails closed and leaves acceptance with the selected mode.

#### Source Files

See [`styles-library-utilization/per-mode-consumers.md`](styles-library-utilization/per-mode-consumers.md) for the mode-specific boundaries and tests.

---

### md-Generator Schema And STUDY

#### Description

The generator has one v3 schema authority plus an optional, reversible STUDY phase that can learn structural shape from one bounded exemplar without importing source literals.

#### Current Reality

Formatter emission, prompt instructions and validation resolve from `V3_SCHEMA`. STUDY de-literalizes and injection-neutralizes one generation-bound exemplar, binds it to locked target facts and discards any leaking draft before a real retry without STUDY.

#### Source Files

See [`styles-library-utilization/md-generator-schema-and-study.md`](styles-library-utilization/md-generator-schema-and-study.md) for schema, STUDY and leak-gate anchors.
