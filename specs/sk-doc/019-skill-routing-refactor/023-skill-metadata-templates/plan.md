---
title: "Implementation Plan: Skill Metadata JSON Templates"
description: "Survey existing scaffolds, create the four missing JSON templates in create-skill/assets, add the per-class template map to the canonical doc, and link from the advisor and parent-hub doctrine."
trigger_phrases:
  - "skill metadata templates plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/023-skill-metadata-templates"
    last_updated_at: "2026-07-28T14:02:48Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the executed plan"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-skill-metadata-templates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Skill Metadata JSON Templates

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Survey first (found the four hub templates already present and nothing in system-skill-advisor), then fill only the real gaps using the existing template conventions, keep the standalone templates faithful to what init_skill.py emits, and make the canonical doc the single map from file type to scaffold.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

All four templates parse as JSON; fleet gate and freshness 11/11 after regenerating sk-doc's leaf manifest and compiled manifest; contract suite passes; packet validate --strict clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Templates live beside their consumers: hub scaffolds in `assets/parent-skill/`, standalone scaffolds in `assets/skill/`, each self-describing via a `_template` note so the file teaches its own class rules. The canonical contract doc owns the only file-to-template map.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Survey

Enumerate existing template assets and check system-skill-advisor for anything template-shaped to move (there was nothing).

### Phase 2: Author

Write the four missing templates with the `_template` note + bracketed-placeholder convention, mirroring init_skill.py's standalone shapes.

### Phase 3: Link and regenerate

Template map into the canonical doc (v1.1.1.0), rows into parent-hub doctrine, pointer plus stale-sentence fix in the advisor SKILL.md; regenerate sk-doc's leaf manifest (new assets are leaves) and re-mint its compiled manifest.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

JSON-parse every template; re-run the fleet gate, freshness gate, doctor on sk-doc, and the contract suite after regeneration; packet validate --strict.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The predecessor packets' contract doc, fleet gate, and template conventions; `init_skill.py` as the shape authority for the standalone pair.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit: templates and doc links disappear together; the regenerated manifests revert with them.
<!-- /ANCHOR:rollback -->
