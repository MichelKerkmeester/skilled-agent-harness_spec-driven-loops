---
title: Audit Corpus Map
description: Source-to-guidance map for QA, critique, hardening, and production-readiness material distilled into audit.
trigger_phrases:
  - "audit corpus"
  - "critique source map"
  - "design QA sources"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Audit Corpus Map

This skill distills QA and critique sources into one cross-cutting mode child.

---

## 1. OVERVIEW

### Purpose

Maps the external QA, critique, polish, hardening, optimization, accessibility, motion performance, UX writing, pseudo-element, and View Transition sources into the audit references that now carry their practical guidance.

### When to Use

- Tracing audit guidance back to the corpus file it was distilled from.
- Checking which reference owns a QA, critique, hardening, performance, accessibility, or production-readiness topic.
- Preserving distillation boundaries when updating audit guidance.

### Core Principle

Use the corpus map as provenance: modernized audit guidance lives in the distilled references, while stale source details stay behind.

---

## 2. Source Files

| Corpus file | Distilled into | Practical guidance kept |
| --- | --- | --- |
| `external/audit.md` | `audit-contract.md` | 5-dimension `/20` score, P0-P3 severities, findings schema |
| `external/critique.md` | `critique-hardening.md` | independent assessment, anti-pattern verdict, heuristics, cognitive load, personas |
| `external/polish.md` | `critique-hardening.md`, `anti-patterns-production.md` | design-system discovery, drift root cause, polish checklist, real evidence |
| `external/harden.md` | `critique-hardening.md` | edge cases, errors, i18n, empty/loading states, resilience |
| `external/optimize.md` | `accessibility-performance.md` | Core Web Vitals, loading, rendering, runtime and network performance (CWV modernized FID->INP on distillation) |
| `external/fixing-accessibility.md` | `accessibility-performance.md` | accessible names, keyboard, focus, semantics, forms, announcements, contrast |
| `external/fixing-motion-performance.md` | `accessibility-performance.md` | animation performance, scroll, paint, layers, blur, tool boundaries |
| `external/clarify.md` | `anti-patterns-production.md` | UX writing, error copy, CTAs, empty states, terminology, localization |
| `external/pseudo-elements.md` | `anti-patterns-production.md` | pseudo-element and View Transitions review rules |

## 3. Distillation Notes

- Core Web Vitals were modernized during distillation: `external/optimize.md` still lists the deprecated First Input Delay (FID < 100ms), but `accessibility-performance.md` intentionally uses Interaction to Next Paint (INP < 200ms). Do not revert to FID from the stale corpus source.

## 4. Distillation Boundary

This child reports and scores issues. Sibling skills own creation and repair guidance; implementation belongs to `sk-code` after the user accepts fixes.
