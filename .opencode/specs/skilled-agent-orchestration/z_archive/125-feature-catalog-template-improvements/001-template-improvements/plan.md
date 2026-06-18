---
title: "Implementation Plan: Feature Catalog Template Improvements"
description: "Targeted edits to two template files: snippet template gets 5-section restructure; master template gets scaffold updates and prose improvements."
trigger_phrases:
  - "feature catalog template plan"
  - "catalog snippet template plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-feature-catalog-template-improvements/001-template-improvements"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Restructured to phase child; moved from parent"
    next_safe_action: "Verify validation passes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
---
# Implementation Plan: Feature Catalog Template Improvements

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Files changed** | 2 template files in sk-doc/assets/feature_catalog/ |
| **Approach** | Surgical edits — no new files, no changes to catalog instances |
| **Risk** | Low — template-only changes, no runtime impact |

Two template files are updated to close drift between their prescribed contract and 365+ real-world feature catalog instantiations across three skill catalogs.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope limited to two template files
- [x] All 14 changes identified via cross-analysis
- [x] Real-world patterns confirmed by reading 365+ instance files

### Definition of Done
- [ ] Snippet template has 5 numbered H2 sections
- [ ] All three scaffold frontmatter blocks include trigger_phrases
- [ ] Template marker present in both per-feature scaffolds
- [ ] filename case consistent (feature_catalog.md lowercase)
- [ ] No existing catalog instance files touched

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two-file edit. No structural dependencies between changes — edits to the snippet template are independent of edits to the master template.

### Snippet template changes (primary, higher impact)
1. Rewrite §1 OVERVIEW — condense, add decision table
2. Insert new §2 FRONTMATTER CONTRACT
3. Rename old §2 → §3 TEMPLATE SCAFFOLD; update scaffold inside code fence
4. Promote `### Authoring Notes` → `## 4. AUTHORING NOTES`; expand from 4 bullets to 7-8 bullets
5. Add new `## 5. CHECKLIST`
6. Fix `FEATURE_CATALOG.md` → `feature_catalog.md` in scaffold

### Master template changes (secondary, lower impact)
1. Add quick-jump callout after H1
2. Update §2 prose → decision table
3. Update §4 root catalog scaffold: add trigger_phrases to frontmatter
4. Update §5 per-feature scaffold: add trigger_phrases, importance_tier, template marker, H1 with tool name, Related references in SOURCE METADATA
5. Expand §6 AUTHORING NOTES with two new bullets

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Snippet Template Rewrite
- [ ] Rewrite feature_catalog_snippet_template.md in full (complete structural overhaul)

### Phase 2: Master Template Targeted Edits
- [ ] Add quick-jump callout to master template §1
- [ ] Convert §2 to decision table
- [ ] Update §4 scaffold frontmatter
- [ ] Update §5 scaffold (add all missing fields)
- [ ] Expand §6 authoring notes

### Phase 3: Verification
- [ ] Read both files back and verify all 14 changes present
- [ ] Confirm snippet has 5 H2 sections
- [ ] Confirm lowercase consistency
- [ ] git diff --stat confirms only 2 files changed

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Manual read | Both template files | Read file back after edit, verify each change |
| git diff | File scope | `git diff --stat` confirms only 2 files |
| grep checks | trigger_phrases, template marker, lowercase filename | Spot grep for key strings |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc templates | Internal | Green | Cannot apply changes |
| Existing catalog instances | Reference | Green | Cannot validate patterns |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Template changes break existing catalog parsing scripts
- **Procedure**:
  1. Revert git changes to the two template files
  2. Verify catalog scripts still function
  3. Re-analyze root cause before re-attempting

<!-- /ANCHOR:rollback -->
