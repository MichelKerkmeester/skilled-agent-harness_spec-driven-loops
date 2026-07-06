---
title: "AI Fingerprint Tell Catalog"
description: "Current-state reference for design-audit's model-specific AI-tell catalog: OpenCode-lineage, Gemini, and 2026-general structural tells."
trigger_phrases:
  - "AI fingerprint tell catalog"
  - "looks AI generated audit"
  - "opencode design tell"
  - "gemini image hover tell"
version: 1.0.0.0
---

# AI Fingerprint Tell Catalog

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-audit` converts "it feels AI-made" into named, checkable findings across model-specific design tells, so a reviewer can grep or eyeball a concrete rule instead of relying on a vague impression.

The audit reports these tells; it does not rewrite the element, which is `sk-code` work once the user accepts the fix.

---

## 2. HOW IT WORKS

The catalog groups tells by lineage. OpenCode-lineage tells include ghost-card border-plus-shadow combinations, over-rounded cards (`border-radius` 24px or more), sketchy SVG illustrations, diagonal `repeating-linear-gradient` stripe backgrounds, over-tight display letter-spacing (past -0.04em), and theater/meta-criticism copy. Gemini tells cover `:hover` transforms on images or image-parent hover patterns. 2026-general tells cover cream/sand body backgrounds, an eyebrow label repeated above three or more sections (including numbered `01/02/03` variants), and uniform scroll-triggered fade-and-rise applied to every section.

### Severity And Evidence

A single isolated tell with a clean rest-of-surface is P3 polish; a tell that defines the whole identity, or three or more tells together, is at least P1; a tell that also breaks a real user task (a clipped label, a contrast-tanking stripe) climbs to P0 on the task failure. Every hit cites the exact element, selector, file and line, or rendered observation, and is labeled confirmed (read from source) or inferred (suspected from a screenshot, source would confirm). A clean pass on this catalog means no model-specific tells were found; it does not by itself mean the design is distinctive, which is the separate critique-lens judgment.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` | Shared | Defines every model-specific tell, its check, owner, and severity. |
| `.opencode/skills/sk-design/design-audit/references/audit_contract.md` | Shared | Supplies the severity model and findings schema tells are filed against. |
| `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md` | Shared | Supplies the shared anti-slop vocabulary this catalog sits beneath. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json` | Automated test | Machine-checkable row per tell, verified against the catalog for parity. |
| `.opencode/skills/sk-design/design-audit/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises AI-tell detection scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: AI-Tell Catalog
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--ai-tell-catalog/ai-fingerprint-tell-catalog.md`

Related references:
- [../01--findings-first-review/findings-first-report-and-scoring.md](../01--findings-first-review/findings-first-report-and-scoring.md) - Findings schema and severity model tells are filed against.
- [../03--procedure-cards/audit-procedure-card-inventory.md](../03--procedure-cards/audit-procedure-card-inventory.md) - AI-slop-check card that applies this catalog during review.
