---
title: "Implementation Plan: Phase 9 — Split code-webflow Implementation References"
description: "Deterministic split of 11 code-webflow implementation docs + tool-driven lockstep rewire of the code-webflow RESOURCE_MAP, parent union, and playbook expected_resources."
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9 — Split code-webflow Implementation References

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Eleven oversized code-webflow implementation references, all routed in the code-webflow RESOURCE_MAP and mirrored to the parent union.

### Overview
Reuse the deterministic slicer + path/xlink rewire tools (now surface-parametric for code-webflow).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
Heading-aligned boundaries dry-run verified (29 parts, contiguous, ≤500/part).

### Definition of Done
21/21 router guards; dangling grep clean; full-suite failures == baseline (11); `validate.sh --strict` = 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
split_ref.py → rewire_paths.py (child + parent RESOURCE_MAP) → rewire_xlinks.py (surface=code-webflow; expected_resources→all parts, nav→first part) → gate. No vitest constant edit (webflow slice tests are prompt-based).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Split
11 files → 29 parts; delete sources.

### Step 2: Rewire
code-webflow/SKILL.md RESOURCE_MAP, parent smart_routing.md union, 18 cross-link/playbook files (code-webflow scoped).

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
Builds on 007/008. Independent of 010.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
One commit on `skilled/v4.0.0.0`; `git revert` restores the monolithic files.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `implementation-summary.md`; parent `../spec.md`
