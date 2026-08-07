---
title: "Feature Specification: Skill Metadata JSON Templates"
description: "Close the template gap for the skill-root metadata contract: JSON scaffolds for command-metadata, hub leaf-aliases, standalone graph-metadata, and leaf-manifest.config under create-skill/assets, with a per-class template map in the canonical doc and pointers from the advisor and parent-hub doctrine."
trigger_phrases:
  - "skill metadata json templates"
  - "command metadata template"
  - "leaf manifest config template"
  - "where are the json scaffolds"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/023-skill-metadata-templates"
    last_updated_at: "2026-07-28T14:02:48Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the four missing templates and linked them"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-skill-metadata-templates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Nothing template-shaped lived in system-skill-advisor; the four hub templates already existed in create-skill and only the newer file types lacked scaffolds"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Skill Metadata JSON Templates

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The metadata contract required eight root JSON types, but only the four original hub files had scaffolds under `create-skill/assets/parent-skill/`. The newer types — `command-metadata.json`, the hub's authored `leaf-aliases.json`, and the standalone pair `graph-metadata.json` / `leaf-manifest.config.json` (which existed only as inline literals inside `init_skill.py`) — had no template a hand-author could start from, and nothing anywhere mapped file type to scaffold. The operator's hypothesis that templates lived in system-skill-advisor was checked and refuted: nothing template-shaped exists there, so nothing needed moving — only creating and linking.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

Four new template assets following the existing `_template`-note + `[bracketed]`-placeholder convention: `parent-skill/parent-skill-command-metadata-template.json`, `parent-skill/parent-skill-leaf-aliases-template.json`, `skill/skill-graph-metadata-template.json`, `skill/skill-leaf-manifest-config-template.json` (the standalone pair mirrors what `init_skill.py` emits). Linking: a per-class template map added to the canonical contract doc (§6, v1.1.1.0), template rows added to the parent-hub doctrine's related resources, and a pointer from system-skill-advisor's SKILL.md to the create-skill contract and scaffolds — which also surfaced and fixed one more stale "keep leaf-aliases.json in sync" sentence contradicting the derived-projection rule. The two generated files deliberately get no template; the map says so explicitly. Out of scope: refactoring `init_skill.py` to read the templates instead of its inline literals (the shapes are kept equivalent by hand).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every authored contract file type has a scaffold under `create-skill/assets/` | Template map in the canonical doc shows a template (or a deliberate "none — generated") for all eight types |
| REQ-002 | Standalone templates match the scaffolder's emitted shapes | Field-for-field mirror of the `init_skill.py` literals |
| REQ-003 | The advisor links to the contract and scaffolds instead of restating them | Pointer in system-skill-advisor SKILL.md §8 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All four templates parse as JSON; the canonical doc's template map covers all eight file types with class attribution; fleet gate 11/11 and freshness 11/11 after regenerating sk-doc's manifest (the new assets are leaves) and re-minting its compiled manifest; contract test suite passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Template shapes drift from `init_skill.py`'s inline literals | Both are documented as equivalent; unify them whenever the scaffolder next changes |
| Dependency | The canonical contract doc and fleet gate from the predecessor packets | Extended in place; all gates re-run green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The relocation hypothesis (templates in system-skill-advisor) was tested and closed: nothing exists there.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Canonical contract**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- **Predecessors**: `../021-skill-metadata-json-unification/spec.md`, `../022-command-metadata-generalization/spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `022-command-metadata-generalization` |
| **Successor** | none |
