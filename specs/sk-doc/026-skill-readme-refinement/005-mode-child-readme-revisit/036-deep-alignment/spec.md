---
title: "Feature Specification: Phase 036 deep-alignment mode README revisit"
description: "Rewrite the deep-alignment mode skill README at .opencode/skills/system-deep-loop/deep-alignment/README.md against the refined README template from phase 001 and the mcp-obsidian exemplar, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "deep alignment readme revisit"
  - "deep alignment readme rewrite"
  - "mode readme deep-alignment"
  - "system-deep-loop readme"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/036-deep-alignment"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 036 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 036 work: rewrite the deep-alignment README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/036-deep-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 036 deep-alignment mode README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `035-deep-ai-council` |
| **Successor** | `037-deep-improvement` |
| **Handoff Criteria** | The deep-alignment README is purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, HVR clean, version bumped with a changelog entry, validator zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-alignment README at `.opencode/skills/system-deep-loop/deep-alignment/README.md` still carries the older tabular reference-card style and predates the pilot standard. The mcp-obsidian README pilot proved the fleet standard for mode skills: a one-line human pitch in a blockquote, an AT A GLANCE table first, a problem-first OVERVIEW and prose that carries the explanation. The deep-alignment README predates that pilot, so a reader lands on reference-card tables before any statement of the problem the skill solves. Its version field has no changelog counterpart for content revisions either.

### Purpose
Rewrite `.opencode/skills/system-deep-loop/deep-alignment/README.md` against the refined README template from phase 001, using the mcp-obsidian README as the exemplar. Preserve the factual content: the adapter contract, the four invariants, the convergence model, the lane model and the verification surface with its feature catalog and manual testing playbook counts. Bump the version field, add a changelog entry under `changelog/` and validate the result.

**End goal:** a purpose-first deep-alignment README on the fleet standard, versioned with a changelog entry and clean on every gate this phase defines.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field value, `validate_document.py` output and link state.
- Rewrite the README purpose-first per the refined template: blockquote pitch after the H1, AT A GLANCE first, problem-first OVERVIEW, prose sections, verification close.
- Bump the frontmatter version field and add the changelog entry at `changelog/<version>.md`.
- Validate the rewrite with the readme validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` content in the deep-alignment skill folder.
- Rewrites of other skills' READMEs (each sibling phase owns its own).
- Edits to the refined template and any other sk-doc asset.
- Edits to the system-deep-loop hub README, `mode-registry.json` or `leaf-manifest.json`.
- Vault files and any runtime data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/README.md` | Rewrite | Purpose-first narrative on the refined template with a version bump |
| `.opencode/skills/system-deep-loop/deep-alignment/changelog/<version>.md` | Add | Changelog entry for the README revision |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/036-deep-alignment/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/036-deep-alignment/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/036-deep-alignment/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/036-deep-alignment/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, the mcp-obsidian exemplar `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` and the current deep-alignment README are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template and the mcp-obsidian exemplar are read and their patterns recorded before any rewrite starts, with evidence in checklist.md |
| REQ-002 | Baseline inventory of the current README | The version field value, the `validate_document.py` output and the link state of the current README are recorded before the rewrite |
| REQ-003 | Purpose-first rewrite | The rewritten README opens with a one-line blockquote pitch after the H1 and a numbered OVERVIEW whose Why This Skill Exists states the problem before any feature list |
| REQ-004 | HVR clean rewrite | A grep of the rewritten README returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The frontmatter version field is bumped from the recorded baseline and `changelog/<version>.md` exists with the per-release entry convention |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff of the old and new README shows the adapter contract, the four invariants, the convergence model, the lane model and the verification counts intact |
| REQ-008 | Out-of-scope guard | `git status` shows no SKILL.md, template, sibling README or hub asset modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader sees the one-line pitch and the problem-first OVERVIEW within one screen.
- **SC-002**: The rewrite preserves every factual claim from the old README, verified by a section-by-section diff.
- **SC-003**: The README passes `validate_document.py --type readme` with zero issues and carries a bumped version field.
- **SC-004**: The changelog entry exists at `changelog/<version>.md` and the HVR grep is clean.
- **SC-005**: This phase folder validates with zero errors and only the README, the changelog entry and the phase docs changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite diverges from the fleet standard | Read the template and mirror its section model and writing rules |
| Dependency | mcp-obsidian exemplar README | Rewrite misses the proven narrative pattern | Read the exemplar and record its pitch and overview structure |
| Risk | Facts lost in the rewrite | The rewrite drops adapter or invariant detail | Section-by-section diff against the old README (REQ-007) |
| Risk | HVR violations in the new prose | Voice gate fails | HVR grep after the rewrite, fix before closeout |
| Risk | Scope drift into sibling skills | Other phases' files change | Out-of-scope guard on `git status` and `git diff` (REQ-008) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
