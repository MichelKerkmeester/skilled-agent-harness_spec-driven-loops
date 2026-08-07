---
title: "Feature Specification: Phase 9 system-deep-loop README rewrite"
description: "Rewrite the system-deep-loop skill README at .opencode/skills/system-deep-loop/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar, purpose-first with HVR enforcement, a version bump and a changelog entry."
trigger_phrases:
  - "system deep loop readme"
  - "deep loop readme rewrite"
  - "system-deep-loop readme"
  - "deep loop hub readme"
  - "phase 9 spec"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/009-system-deep-loop"
    last_updated_at: "2026-08-04T13:37:24Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 9 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 9 work: rewrite the system-deep-loop skill README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/README.md"
      - ".opencode/skills/system-deep-loop/changelog/v2.1.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-system-deep-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 9 system-deep-loop README rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit` |
| **Predecessor** | `008-sk-prompt` |
| **Successor** | `010-system-skill-advisor` |
| **Handoff Criteria** | The rewritten system-deep-loop README is purpose-first on the refined template with HVR clean prose and a changelog entry at version 2.1.0.0. The phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-deep-loop skill README still carries the older tabular reference-card style. Its AT A GLANCE table lists aspects in rows and the document reads like a capability sheet, so it predates the mcp-obsidian pilot and the refined template from phase 001. The skill is the hub for the iterative deep workflows (research, review, alignment, improvement and ai-council), which makes its README one of the most visible standalone documents in the fleet. The old shape keeps the fleet from reading as one standard.

### Purpose
Rewrite `.opencode/skills/system-deep-loop/README.md` so it leads with a one-line human pitch and a problem-first OVERVIEW that states the reader's situation before any feature list. The rewrite follows the refined template from phase 001, uses the mcp-obsidian README as the reference shape, bumps the version field from 2.0.0.0 to 2.1.0.0 and adds a changelog entry.

**End goal:** a purpose-first hub README for system-deep-loop that matches the mcp-obsidian exemplar, passes the readme validator with zero issues and reads as the front door for the deep-loop family.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/system-deep-loop/README.md` and record its baseline: the version field, the readme validator output and the link state.
- Rewrite the README purpose-first per the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) and the mcp-obsidian exemplar.
- Bump the README version field from 2.0.0.0 to 2.1.0.0.
- Add a changelog entry at `.opencode/skills/system-deep-loop/changelog/v2.1.0.0.md`.
- Validate the rewrite with the readme validator, the HVR grep and a link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `.opencode/skills/system-deep-loop/SKILL.md` content.
- Rewrites of any other skill README in the fleet (owned by the sibling phases in 004-standalone-readme-revisit).
- Edits to the refined README template (owned by phase 001).
- Edits to `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json` or `graph-metadata.json` in the hub.
- Edits to vault files or any runtime file under `.opencode/skills/system-deep-loop/runtime/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/README.md` | Rewrite | Purpose-first rewrite on the refined template: one-line pitch, problem-first OVERVIEW, quick start, navigation and verification close, with the version field bumped to 2.1.0.0 |
| `.opencode/skills/system-deep-loop/changelog/v2.1.0.0.md` | Add | Changelog entry for the README rewrite with the hub changelog frontmatter shape |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/009-system-deep-loop/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/009-system-deep-loop/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/009-system-deep-loop/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/009-system-deep-loop/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`), the mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) and the current system-deep-loop README are evidence for the rewrite, never writable beyond the README and changelog entry named above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 001 template readiness gate | The refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` exists and is committed before the rewrite starts |
| REQ-002 | Current README inventoried | The baseline of `.opencode/skills/system-deep-loop/README.md` records the version field, the readme validator output and the link state before any rewrite |
| REQ-003 | Purpose-first rewrite on the refined template | The rewritten README leads with a one-line human pitch and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | HVR clean prose | A grep of the rewritten README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The README version field reads 2.1.0.0 and `.opencode/skills/system-deep-loop/changelog/v2.1.0.0.md` exists with a description of the rewrite |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old and the new README confirms every durable fact (invoke routes, mode names, artifact locations, version) survived the rewrite |
| REQ-008 | Out-of-scope guard | No file outside the README, the changelog entry and this phase folder changed. The scope diff lists exactly those paths |
| REQ-009 | Phase closeout clean | `validate.sh` on this phase folder returns zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README reads purpose-first with a one-line pitch and a problem-first OVERVIEW on the refined template.
- **SC-002**: The README passes `validate_document.py --type readme` with zero issues, carries version 2.1.0.0 and has a changelog entry.
- **SC-003**: Every durable fact from the old README survives the rewrite.
- **SC-004**: The README reads as one standard with the mcp-obsidian exemplar.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite against a moving template | Gate the rewrite on the template being committed (REQ-001) |
| Dependency | mcp-obsidian exemplar | Shape mismatch between the exemplar and a hub README | Read the exemplar README before drafting |
| Risk | HVR violations in a long narrative rewrite | Voice check fails at closeout | Scripted grep per REQ-004 and HVR items in the checklist |
| Risk | Facts lost during the rewrite | Shipped behavior claims disappear | Section-by-section diff per REQ-007 before the rewrite lands |
| Risk | Version and changelog mismatch | Changelog entry and version field disagree | REQ-005 gates both together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
