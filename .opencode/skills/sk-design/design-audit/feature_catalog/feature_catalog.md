---
title: "design-audit: Feature Catalog"
description: "Current-state inventory for design-audit's findings-first report contract, register-gated severity, the AI-tell catalog, and private procedure cards."
trigger_phrases:
  - "design-audit feature catalog"
  - "findings-first report contract"
  - "register-gated audit severity"
  - "audit procedure cards"
last_updated: "2026-07-06"
version: 1.0.0.0
---

# design-audit: Feature Catalog

This catalog inventories the live `design-audit` mode. The mode is the critic in the `sk-design` family: it walks a surface against accessibility, performance, responsive, theming, and anti-slop checks, files severity-ranked findings with evidence, and scores five dimensions out of 20 without touching the code.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for audit work: the findings-first report contract and five-dimension score, the register-gated severity dial, the model-specific AI-tell catalog, and mode-local procedure cards.

---

## 2. FINDINGS-FIRST REVIEW

### Findings-First Report And Scoring

#### Description

Produce a severity-ordered, evidence-backed report where concrete findings come before the five-dimension `/20` score, and the score summarizes findings rather than replacing them.

#### Current Reality

Findings use a fixed schema (Observation, Evidence, Category, Accessibility coverage, Problem, Fix, Owner) ordered P0 through P3 by the "would a real user fail, contact support, or abandon" test. The five-dimension score (Accessibility, Performance, Responsive Design, Theming, Anti-Patterns) is scored 0-4 each, and any accessibility, WCAG, or release-ready claim carries a coverage matrix across seven layers (keyboard, screen-reader, zoom-reflow, contrast, reduced-motion, assistive-tech, user-testing) with a `confirmed`/`inferred`/`blocked`/`not-assessed` state per layer.

#### Source Files

See [`findings-first-review/findings-first-report-and-scoring.md`](findings_first_review/findings_first_report_and_scoring.md) for the severity model, scoring bands, and findings schema.

---

### Register-Gated Severity

#### Description

Read the shared Brand-vs-Product register before scoring, since the same observation routes to opposite verdicts depending on the surface's posture.

#### Current Reality

On a Brand surface, generic-but-functional results score against Anti-Patterns as blandness; on a Product surface, expressive-but-unclear results score against Accessibility and consistency as theatrics. The register call is resolved before any dimension is scored.

#### Source Files

See [`findings-first-review/register-gated-severity.md`](findings_first_review/register_gated_severity.md) for the register-to-severity mapping and worked examples.

---

## 3. AI-TELL CATALOG

### AI Fingerprint Tell Catalog

#### Description

Convert "it feels AI-generated" into named, checkable findings across model-specific structural tells: OpenCode-lineage, Gemini, and 2026-general defaults.

#### Current Reality

Each tell names a concrete check (for example a border-plus-shadow combination, over-rounded cards, image-hover transforms, cream body backgrounds, uniform section fade-and-rise), a severity, and an owner. One isolated tell is usually P2 or P3 polish; three or more tells on one surface fails the Anti-Patterns dimension at P1 or higher, and a tell that breaks a real user task climbs to P0.

#### Source Files

See [`ai-tell-catalog/ai-fingerprint-tell-catalog.md`](ai_tell_catalog/ai_fingerprint_tell_catalog.md) for the full tell catalog, checks, and owner routing.

---

## 4. PROCEDURE CARDS

### Audit Procedure Card Inventory

#### Description

Two private cards support audit-specific evidence gathering after the public mode is selected: accessibility audit and AI-slop check.

#### Current Reality

The mode chooses at most one primary card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only.

#### Source Files

See [`procedure-cards/audit-procedure-card-inventory.md`](procedure_cards/audit_procedure_card_inventory.md) for the card list and boundaries.
