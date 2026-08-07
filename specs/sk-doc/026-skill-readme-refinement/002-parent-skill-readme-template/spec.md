---
title: "Feature Specification: Phase 2 parent-skill (hub) README template"
description: "Create the parent-skill README template at sk-create-skill/assets/parent-skill/, covering hub pitch, nested modes and packets, mode-registry and leaf-manifest navigation, changelog conventions, hub scripts and commands, and hub README validation."
trigger_phrases:
  - "parent skill readme template"
  - "hub readme template"
  - "parent hub readme"
  - "mode registry readme navigation"
  - "hub readme validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 2 docs (spec, plan, tasks, checklist) inside 026-skill-readme-refinement"
    next_safe_action: "Execute phase 2 work: create parent-skill-readme-template.md in the parent-skill assets folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-parent-skill-readme-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 2 parent-skill (hub) README template

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc/026-skill-readme-refinement) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `001-readme-template-refinement` |
| **Successor** | `003-creation-workflow-update` |
| **Handoff Criteria** | The parent-skill README template exists at the mandated path, covers the six mandated hub surfaces, references the structural examples, validates as a readme document, and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fleet has parent hubs with READMEs of inconsistent shape. The mcp-tooling hub and the system-deep-loop hub each carry a README, a mode registry, a leaf manifest, a changelog folder, and nested mode packets, but no shared template tells a hub author what to write. A hub README must pitch the hub, list its nested modes and packets with per-mode pointers, navigate the mode registry and leaf manifest, document changelog conventions, list hub scripts and commands, and show how the hub README is validated. None of that guidance exists in the parent-skill asset family today.

### Purpose
Create `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` so any parent-hub author can emit a complete hub README on one standard. The template covers the hub pitch and a purpose-first overview, the nested packet and mode list with per-mode pointers, mode-registry and leaf-manifest navigation, changelog conventions, hub scripts and commands, and hub README validation. It uses mcp-tooling and system-deep-loop as the structural examples its guidance points to.

**End goal:** a parent-skill README template that sits beside the refined standalone template in the parent-skill assets folder and that phase 003 can wire into the creation workflow.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the new template file `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md`.
- Author template guidance for the six mandated hub surfaces: pitch and purpose-first overview, nested packet and mode list with per-mode pointers, mode-registry and leaf-manifest navigation, changelog conventions, hub scripts and commands, and validation.
- Reference `.opencode/skills/mcp-tooling/` and `.opencode/skills/system-deep-loop/` as structural examples inside the template guidance.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to the refined standalone README template (owned by phase 001).
- Edits to the creation workflow (owned by phase 003).
- Rewrites of any hub or mode README in the fleet (owned by phases 004 and 005).
- Edits to mode registries, leaf manifests, skill content, or any JSON asset in the parent-skill folder.
- Fleet-wide validation and changelog entries (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` | Create | Hub-level README template: pitch, purpose-first overview, nested modes and packets, registry and manifest navigation, changelog, scripts and commands, validation |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template/checklist.md` | Create | Phase verification checklist |

Read-only references: the mcp-tooling hub (`README.md`, `mode-registry.json`, `leaf-manifest.json`, `changelog/`) and the system-deep-loop hub (same surface set) are evidence for the template guidance, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template file exists at the mandated parent-skill path | `ls` shows `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` with a non-empty template body |
| REQ-002 | Template opens with a hub pitch and a purpose-first overview | The template starts with a blockquote pitch pattern and a WHY THIS HUB EXISTS section that states the reader's situation before any feature list |
| REQ-003 | Template covers the nested packet and mode list with per-mode pointers | The template defines a MODES AND PACKETS section with a table row per child packet or mode, each row carrying a relative pointer to the child README or folder |
| REQ-004 | Template covers mode-registry and leaf-manifest navigation | The template defines a NAVIGATION section that tells the hub author how to link `mode-registry.json` and `leaf-manifest.json` with stable relative paths |
| REQ-005 | Template covers changelog conventions and hub scripts and commands | The template defines a CHANGELOG section with the per-release entry convention and a SCRIPTS AND COMMANDS section with one-line usage per owned script |
| REQ-006 | Template covers hub README validation | The template ends with a VERIFICATION section listing the sk-doc readme validator and the HVR checks for the finished hub README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Template guidance references the structural examples | The template text names `.opencode/skills/mcp-tooling/` and `.opencode/skills/system-deep-loop/` as example hubs for nested modes, registries, and manifests |
| REQ-008 | Template follows the standalone template family conventions | The template uses numbered ALL-CAPS H2 sections with `---` dividers and marks OVERVIEW as the only required section |
| REQ-009 | Template prose obeys the Human Voice Rules | A grep of the template body returns zero em dashes and zero semicolons |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A hub author can produce a complete hub README from the template without inventing sections.
- **SC-002**: The template covers all six mandated hub surfaces: pitch, modes and packets, registry and manifest navigation, changelog, scripts and commands, validation.
- **SC-003**: The finished template validates as a readme document and passes the HVR grep.
- **SC-004**: Phase 003 can reference the template path without modification.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone README template (phase 001) | Hub template may diverge in style | Follow the numbered ALL-CAPS H2 section model and the OVERVIEW-only required section rule |
| Dependency | Parent-skill asset family | Naming and marker mismatch with sibling templates | Inventory the parent-skill assets folder before authoring |
| Dependency | mcp-tooling and system-deep-loop hubs | Guidance may describe a shape the hubs do not have | Read both hub READMEs and registries before drafting |
| Risk | Template drifts from the standalone family | Two incompatible template styles in one asset folder | REQ-008 gates section model and dividers |
| Risk | Registry and manifest paths drift | Navigation guidance breaks later | Guidance uses stable relative links and notes regeneration in phase 006 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
