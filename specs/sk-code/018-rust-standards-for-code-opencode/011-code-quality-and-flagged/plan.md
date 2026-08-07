---
title: "Implementation Plan: Phase 11 — Split code-quality Checklist + Flagged-File Exemptions"
description: "Deterministic split of the code-quality checklist + rewire of its SKILL.md routes and cross-surface enforcement links; document the two code-review exemptions."
contextType: "implementation"
importance_tier: "normal"
trigger_phrases:
  - "018 phase 011 plan code-quality checklist split"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/011-code-quality-and-flagged"
    last_updated_at: "2026-07-11T15:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "code-quality checklist split (3 parts) + rewired; code-review exemptions documented"
    next_safe_action: "Commit phase 011, then phase 012 rollup"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11 — Split code-quality Checklist + Flagged-File Exemptions

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Last oversized reference/asset in scope; self-contained in code-quality mode plus 3 cross-surface enforcement links. Two code-review files exempted.

### Overview
Split with the fixed (blank-line-preserving) slicer; rewire routes; record exemptions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
Boundaries dry-run verified (3 parts, contiguous, ≤231/part).

### Definition of Done
Dangling grep clean; all part links resolve; 21/21 hub guards; full-suite == baseline; `validate.sh --strict` = 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
split_ref.py → rewire_paths.py (RESOURCE_MAP) + prose replace + enforcement cross-link fix → xlink_rewrite.py (part internal links) → gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Split
1 file → 3 parts; delete source.

### Step 2: Rewire
code-quality/SKILL.md (RESOURCE_MAP + 10 prose/link mentions), 3 enforcement.md cross-links, part internal links.

### Step 3: Gate + document exemptions
3 hub vitests + dangling grep + record code-review exemptions in spec.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Hub vitests confirm no regression; code-quality is not in the hub union so its split is contained.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Builds on 007-010. Precedes 012 rollup.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
One commit on `skilled/v4.0.0.0`; `git revert` restores the monolithic checklist.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `implementation-summary.md`; parent `../spec.md`
