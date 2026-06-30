---
title: "Feature Specification: sk-design-interface doc alignment, catalog, playbook"
description: "Bring sk-design-interface to 100% sk-doc template alignment: add a feature catalog and a manual testing playbook, align all references to the reference template, and verify assets plus graph-metadata conform. Authored via fresh markdown agents using the /create command workflows."
trigger_phrases:
  - "sk-design-interface doc alignment"
  - "feature catalog and playbook"
  - "sk-doc template alignment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/004-doc-alignment-catalog-playbook"
    last_updated_at: "2026-06-13T19:15:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Catalog, playbook, references, and graph-metadata aligned"
    next_safe_action: "Operator commits the skill doc changes; optional advisor graph rescan"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-004-doc-alignment-catalog-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: sk-design-interface doc alignment, catalog, playbook

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Method** | Fresh markdown agents via the `/create:feature-catalog` and `/create:testing-playbook` workflows + sk-doc reference template |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the ui-ux-pro-max merge, `sk-design-interface` has new references, data assets, and scripts, but it lacks a feature catalog and a manual testing playbook, and its references and assets are not yet fully aligned to the sk-doc templates. Its graph-metadata must also reflect the new structure.

### Purpose
Bring `sk-design-interface` to full sk-doc template alignment: a feature catalog, a manual testing playbook, template-aligned references, conforming assets, and accurate graph-metadata.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `feature_catalog/` for the skill (index + numbered sections) per `/create:feature-catalog` and the sk-doc feature_catalog template.
- A `manual_testing_playbook/` for the skill (index + numbered scenario sections) per `/create:testing-playbook` and the sk-doc testing_playbook template.
- Aligning `references/design_principles.md`, `references/ux_quality_reference.md`, `references/design_inventory.md` to the sk-doc reference structure (preserve substance; apply structure and house-voice rules).
- Verifying `assets/` and `graph-metadata.json` conform to sk-doc and the skill-advisor schema, reflecting the new files.

### Out of Scope
- Changing the skill's behavior or the design data content.
- Any other skill.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: `feature_catalog/` exists with an index and numbered sections covering the skill's real features; passes the sk-doc feature_catalog standard.
- R2: `manual_testing_playbook/` exists with an index and numbered scenario sections; passes the sk-doc testing_playbook standard.
- R3: All three references conform to the sk-doc reference template (title + intro + sections, house-voice rules) with substance preserved.
- R4: `assets/` layout conforms to sk-doc conventions; `graph-metadata.json` is present, valid, and reflects the new key_files and routing.
- R5: `package_skill.py` reports the skill valid; the work is authored by fresh markdown agents using the /create workflows.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The skill ships a feature catalog and a manual testing playbook that pass sk-doc validation.
- Every reference and asset aligns with its sk-doc template.
- `graph-metadata.json` is present and accurate (key_files include the new docs; routing intact).
- `package_skill.py` valid; `design_principles.md` substance preserved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| Feature catalogs are uncommon in the sk-* family (siblings are playbook-only) | Build it per the operator's explicit request; keep it scoped to the skill's real features |
| Concurrent agent writes to shared files (SKILL.md, graph-metadata) | Agents write only their own dirs; the orchestrator reconciles SKILL.md and graph-metadata centrally |
| Restructuring vendored `design_principles.md` (Apache-2.0) | Keep-depth restyle: apply structure without altering substance |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether a feature catalog is idiomatic for a sk-* family skill (siblings omit it); built here per explicit request.

<!-- /ANCHOR:questions -->
