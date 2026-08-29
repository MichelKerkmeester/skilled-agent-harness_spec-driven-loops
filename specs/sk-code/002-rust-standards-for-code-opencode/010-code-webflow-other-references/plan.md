---
title: "Implementation Plan: Phase 10 — Split code-webflow Other References"
description: "Deterministic split of 8 code-webflow docs + tool-driven lockstep rewire of the code-webflow RESOURCE_MAP, parent union, and playbook expected_resources."
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10 — Split code-webflow Other References

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Eight oversized code-webflow non-implementation references, all routed and mirrored to the parent union.

### Overview
Reuse the deterministic slicer + surface-parametric rewire tools (surface=code-webflow).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
Heading-aligned boundaries dry-run verified (31 parts, contiguous, ≤500/part).

### Definition of Done
21/21 router guards; dangling grep clean; full-suite failures == baseline (11); `validate.sh --strict` = 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
split_ref.py → rewire_paths.py (child + parent) → rewire_xlinks.py (surface=code-webflow) → gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Split
8 files → 31 parts; delete sources.

### Step 2: Rewire
code-webflow/SKILL.md, parent smart_routing.md union, 16 cross-link/playbook files.

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
Builds on 007/008/009. Precedes 011/012.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
One commit on `skilled/v4.0.0.0`; `git revert` restores the monolithic files.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `implementation-summary.md`; parent `../spec.md`
