---
title: "Implementation Plan: Refero full-set extraction"
description: "Run the harness over the full sitemap to completion, shape-validate all folders, and rebuild the styles index."
trigger_phrases:
  - "refero full set plan"
  - "all styles extraction plan"
  - "complete library plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/010-sk-design-styles-from-refero/003-full-set"
    last_updated_at: "2026-07-18T10:25:46Z"
    last_updated_by: "claude"
    recent_action: "Extracted all 1,290 styles with 0 errors and re-indexed"
    next_safe_action: "Commit the library and sync to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-refero-010-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Refero full-set extraction

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runner** | The child-001 harness (`extract-refero.mjs`), no --limit |
| **Throttle** | one page at a time, `--delay-ms 2500`, real Chrome UA |
| **Output** | ~1,240 new `styles/<slug>/` folders + full index |
| **Testing** | shape sweep over all 1,290 folders |

### Overview
Run the harness with no limit to capture every remaining sitemap row, then shape-validate all folders and rebuild `styles/README.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Pilot recorded GO

### Definition of Done
- [x] 1,290 captured, 0 errors
- [x] Shape sweep clean
- [x] Index rebuilt
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single resumable full-sitemap run over the manifest; validation is external shape-checking.

### Key Components
- The harness (capture + manifest).
- The shape sweep + index generator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `styles/<slug>/**` | partial (pilot) | complete to 1,290 | shape sweep 1,290/1,290 |
| `styles/README.md` | pilot index | full index | lists 1,290 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Run
- [x] Harness full run over all pending rows

### Phase 2: Validate
- [x] Shape sweep all folders; reconcile the cursor slug row

### Phase 3: Index
- [x] Rebuild `styles/README.md` (1,290 entries)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Manifest status Counter = 1,290 captured, 0 errors.
- Per-folder 6-file + JSON-parse sweep.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The child-001 harness and a reachable styles.refero.design.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the captured `styles/<slug>/` folders and reset the manifest rows to `pending`. No code change to revert.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Predecessor**: `../002-pilot-batch/`
