---
title: "Feature Specification: Phase 027 sk-create-feature-catalog README revisit"
description: "Rewrite the create-feature-catalog skill README at sk-create-feature-catalog/README.md purpose-first against the refined template from phase 001, using the mcp-obsidian README as the exemplar, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "feature catalog readme"
  - "create-feature-catalog readme rewrite"
  - "sk-doc packet readme revisit"
  - "mode child readme phase 027"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/027-sk-create-feature-catalog"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 027 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 027 work: rewrite the create-feature-catalog README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-feature-catalog/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/027-sk-create-feature-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 027 sk-create-feature-catalog README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `026-sk-create-diff` |
| **Successor** | `028-sk-create-flowchart` |
| **Handoff Criteria** | The create-feature-catalog README is purpose-first on the refined template, HVR clean, versioned with a changelog entry, validated with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill README at `.opencode/skills/sk-doc/sk-create-feature-catalog/README.md` still carries the older tabular reference-card style and predates the pilot standard that the mcp-obsidian README established. It was written before phase 001 refined the shared README template and before the Human Voice Rules became the gate for skill documentation. A reader landing on it gets a reference card first and the reason the skill exists second.

### Purpose
Rewrite the create-feature-catalog README purpose-first against the refined template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite adds a one-line pitch and a problem-first OVERVIEW, bumps the version field, adds a changelog entry and validates with zero issues.

**End goal:** a README that pitches the skill, explains the problem it solves, preserves every fact from the current version and passes the sk-doc validation and voice gates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field value, `validate_document.py --type readme` output and link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch and a problem-first OVERVIEW.
- Bump the version field and add the matching changelog entry.
- Run the readme validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` content in the sk-create-feature-catalog packet.
- Rewrites of any other skill README (owned by the sibling phases of 005).
- Edits to templates, references or scripts in the sk-create-feature-catalog packet.
- Edits to vault, plugin or runtime files.
- Fleet-wide validation and changelog entries (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-feature-catalog/README.md` | Rewrite | Purpose-first rewrite per the refined template with a one-line pitch, a problem-first OVERVIEW and a version bump |
| `.opencode/skills/sk-doc/sk-create-feature-catalog/changelog/<version>.md` | Add | Changelog entry for the new release per the recorded entry format |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/027-sk-create-feature-catalog/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/027-sk-create-feature-catalog/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/027-sk-create-feature-catalog/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/027-sk-create-feature-catalog/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`), the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and the current create-feature-catalog README are evidence for the rewrite, never writable except the target README itself.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refined template readiness gate | `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` exists and the mcp-obsidian exemplar README is readable before any rewrite starts |
| REQ-002 | Current README inventoried | Baseline recorded: version field value, `validate_document.py --type readme` output and link state |
| REQ-003 | Purpose-first rewrite | README rewritten per the refined template with a one-line pitch and a problem-first OVERVIEW |
| REQ-004 | HVR clean | A grep over the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | `version:` field bumped and `changelog/<version>.md` added per the recorded entry format |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old and new README shows no fact, link or capability lost |
| REQ-008 | Out-of-scope guard | `git diff` shows only README.md, the changelog entry and phase docs changed, with no SKILL.md, template or vault file touched |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep is clean.
- **SC-003**: The README carries a bumped version field with a matching changelog entry.
- **SC-004**: The rewrite preserves every fact, link and capability from the old README.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may diverge from the template sections | Follow the template section map and the OVERVIEW required rule |
| Dependency | mcp-obsidian exemplar README | Exemplar shape may not fit the target packet | Read the exemplar before drafting |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails | Scripted grep gates in the verification phase |
| Risk | Facts drift during the rewrite | Capabilities or links get lost | Section-by-section diff gate (REQ-007) |
| Risk | Version and changelog entry drift apart | Release record becomes inconsistent | Version bump and changelog entry checked as one pair |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
