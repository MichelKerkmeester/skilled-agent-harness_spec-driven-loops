---
title: "Feature Specification: Phase 010 mcp-figma README rewrite"
description: "Rewrite the mcp-figma skill README against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump and a changelog entry."
trigger_phrases:
  - "mcp figma readme"
  - "figma readme rewrite"
  - "mode readme rewrite"
  - "readme pilot standard"
  - "mode readme validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/010-mcp-figma"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 10 docs (spec, plan, tasks, checklist) inside 026-skill-readme-refinement"
    next_safe_action: "Execute phase 10 work: rewrite the mcp-figma README against the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-figma/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-mcp-figma"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 010 mcp-figma README rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `009-mcp-click-up` |
| **Successor** | `011-mcp-magnific` |
| **Handoff Criteria** | The mcp-figma README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW. It passes the HVR grep and the readme validator with zero issues. It carries a bumped version field with a matching changelog entry. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian README pilot proved the standard for mode skill READMEs: narrative, purpose-first documents written in the Human Voice Rules and validated by the sk-doc README validator. The mcp-figma README still carries the older tabular reference-card style and predates the pilot learnings. It inventories features and commands but does not lead with the reader. It carries no version discipline or changelog entry that reflects the README standard.

### Purpose
Rewrite `.opencode/skills/mcp-tooling/mcp-figma/README.md` against the refined README template from phase 001 and the mcp-obsidian exemplar. The rewrite delivers a one-line human pitch, an AT A GLANCE table, a problem-first OVERVIEW and the supporting sections in the exemplar order, then bumps the version field and adds a changelog entry under `changelog/`. The skill is the Figma design transport mode inside the mcp-tooling hub, and the README must say what the mode is for before it lists what it has.

**End goal:** the mcp-figma README matches the fleet standard proven by the mcp-obsidian pilot, validates with zero issues and passes the HVR grep.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record its baseline: version field value, validator output and link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field in the README frontmatter.
- Add a changelog entry under `changelog/` for the rewrite release.
- Validate the README with the sk-doc readme validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to SKILL.md or any other file in the mcp-figma folder.
- Edits to the refined README template (owned by phase 001).
- Rewrites of any other mode or hub README (owned by sibling phases in 005).
- Edits to templates, vault files, mode registries or manifests.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-figma/README.md` | Rewrite | Purpose-first README on the refined template: pitch, AT A GLANCE, problem-first OVERVIEW, quick start, navigation, verification |
| `.opencode/skills/mcp-tooling/mcp-figma/changelog/<version>.md` | Add | Changelog entry for the README rewrite release |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/010-mcp-figma/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/010-mcp-figma/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/010-mcp-figma/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/010-mcp-figma/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar README (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refined README template readiness gate | `ls` shows `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` with a non-empty template body before the rewrite starts |
| REQ-002 | Current README inventory and baseline | The version field value, the `validate_document.py` output and the link state of the current README are recorded before any edit |
| REQ-003 | Purpose-first rewrite on the refined template | The README opens with a one-line pitch in a blockquote after the H1 and an OVERVIEW that states the problem before any feature list |
| REQ-004 | HVR grep clean | A grep of the rewritten README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The frontmatter version is higher than `1.0.0.2` and `changelog/<version>.md` exists with the rewrite noted |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` on the README reports zero issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the previous README shows no capability, command, path or relationship lost |
| REQ-008 | Out-of-scope guard | A scope diff shows only the README, the changelog entry and the phase docs changed, with SKILL.md, sibling READMEs, templates and vault files untouched |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README is purpose-first with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The README passes the readme validator with zero issues and the HVR grep with zero hits.
- **SC-003**: The README frontmatter carries a bumped version and `changelog/` holds a matching entry.
- **SC-004**: No SKILL.md, sibling README, template or vault file changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may lag the standard | Gate the start on REQ-001 and follow the numbered ALL-CAPS H2 section model |
| Dependency | mcp-obsidian exemplar | Exemplar and target shapes may differ | Read the exemplar before drafting and match its pitch and overview pattern |
| Dependency | README validator | Validation gate unavailable | Run the validator and record the output in checklist.md |
| Risk | HVR violations in a long rewrite | Voice check fails | Scripted grep gates on em dashes, semicolons and Oxford commas |
| Risk | Fact drift in the rewrite | Capability or command loss | Section-by-section diff against the previous README |
| Risk | Changelog drift | Version and entry mismatch | REQ-005 ties the version bump to the changelog entry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
