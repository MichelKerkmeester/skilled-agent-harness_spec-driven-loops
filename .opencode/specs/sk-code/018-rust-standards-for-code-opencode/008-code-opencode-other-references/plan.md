---
title: "Implementation Plan: Phase 8 — Split code-opencode Other-Language & Shared References"
description: "Deterministic split of 9 code-opencode docs + tool-driven lockstep rewire of the language RESOURCE_MAPs, shared tier, parent union, vitest TS_TRIO, and playbook expected_resources."
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8 — Split code-opencode Other-Language & Shared References

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Nine oversized code-opencode docs across typescript/shell/javascript + the shared tier, all load-bearing router entries (the shared tier under DEFAULT_RESOURCE/IMPLEMENTATION).

### Overview
Reuse the deterministic slicer and the path-rewire + cross-link tools proven in 007; the shared tier requires replacing entries in multiple intents at once.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
Heading-aligned boundaries dry-run verified (20 parts, contiguous, ≤500/part).

### Definition of Done
21/21 router-guard tests; dangling grep clean; full-suite failures == baseline (11); `validate.sh --strict` on this child = 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
`split_ref.py` (lossless) → `rewire_paths.py` (RESOURCE_MAP path→parts, child + parent) → `rewire_xlinks.py` (expected_resources → all parts; nav → first part, code-webflow excluded) → manual TS_TRIO edit → gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Split
9 files → 20 parts; delete sources.

### Step 2: Rewire
Child SKILL.md (TYPESCRIPT/SHELL/JAVASCRIPT + DEFAULT_RESOURCE + IMPLEMENTATION), parent smart_routing.md union, surface-slice-sync TS_TRIO, 16 cross-link/playbook files.

### Step 3: Gate
3 vitests + dangling grep + full-suite baseline delta.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Deterministic vitests are the gate; live Mode-B re-baseline deferred to 012.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Builds on 007 (parent widened). Independent of code-webflow phases 009/010.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
One commit on `skilled/v4.0.0.0`; `git revert` restores the monolithic files.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `implementation-summary.md`; parent `../spec.md`
