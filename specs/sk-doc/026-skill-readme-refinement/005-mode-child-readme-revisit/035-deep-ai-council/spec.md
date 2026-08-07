---
title: "Feature Specification: Phase 035 deep-ai-council README revisit"
description: "Rewrite the deep-ai-council skill README purpose-first against the refined README template from phase 001 with mcp-obsidian as the exemplar, bump the version field, add a changelog entry and validate."
trigger_phrases:
  - "phase 035 spec"
  - "deep ai council readme"
  - "council readme rewrite"
  - "mode readme revisit deep ai council"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 035 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 035 work: rewrite the deep-ai-council README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-ai-council/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/035-deep-ai-council"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 035 deep-ai-council README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase child) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (005-mode-child-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `034-sk-prompt-models` |
| **Successor** | `036-deep-alignment` |
| **Handoff Criteria** | The deep-ai-council README is purpose-first on the refined template, HVR clean, versioned with a changelog entry, validated with zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-ai-council README at `.opencode/skills/system-deep-loop/deep-ai-council/README.md` predates the full pilot standard. It passes the validator floor today, but the measured baseline shows HVR drift (2 semicolons and 2 Oxford comma patterns) and a reference-card tone in the long FAQ, troubleshooting and integration tables. The mcp-obsidian pilot proved the standard a mode README should meet: a one-line pitch, a problem-first OVERVIEW and prose that carries the explanation. The council README needs the same treatment so a human reader meets the skill the way the pilot teaches.

### Purpose
Rewrite the deep-ai-council README purpose-first against the refined README template from phase 001 (`.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`) using the mcp-obsidian README as the exemplar. The rewrite keeps every real fact (council round flow, six strategy lenses, three critique roles, two-of-three rule, artifact tree, commands) and presents it in the narrative voice. The version field bumps and a changelog entry records the release.

**End goal:** a deep-ai-council README that pitches the council in one line, opens with the reader's problem, passes the validator with zero issues, passes the HVR grep and carries a versioned changelog entry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/system-deep-loop/deep-ai-council/README.md` and record the baseline (version field, validator output, link state).
- Rewrite the README purpose-first per the refined template: one-line pitch, AT A GLANCE, problem-first OVERVIEW, then the earned sections in the template order.
- Bump the `version:` field in the README frontmatter and add a changelog entry under `changelog/v2.4.1.0.md`.
- Validate the rewrite with the readme validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to `SKILL.md` content in the deep-ai-council skill.
- Rewrites of any other skill README (owned by sibling phases 001-034 and 036-039).
- Edits to the refined README template (owned by phase 001) or the mcp-obsidian exemplar (verify-only).
- Edits to vault, plugin or runtime files.
- Fleet-wide validation and changelog entries (owned by phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-ai-council/README.md` | Rewrite | Purpose-first README per the refined template with a one-line pitch, a problem-first OVERVIEW and a version bump |
| `.opencode/skills/system-deep-loop/deep-ai-council/changelog/v2.4.1.0.md` | Add | Changelog entry for the rewritten README release |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/035-deep-ai-council/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined README template, the mcp-obsidian README exemplar and the deep-ai-council `SKILL.md` plus its `references/` files are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined README template and the mcp-obsidian exemplar are readable before the rewrite starts |
| REQ-002 | Inventory the current README | The current README is read and its baseline is recorded: `version:` value, `validate_document.py` output and link state |
| REQ-003 | Purpose-first rewrite | The README opens with a one-line blockquote pitch after the H1 and a problem-first OVERVIEW before any feature list, following the refined template |
| REQ-004 | HVR clean | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The `version:` field is bumped and `changelog/v2.4.1.0.md` exists with an entry for the new version |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff shows every capability, command, reference and boundary carried over without loss or distortion |
| REQ-008 | Out-of-scope guard | No `SKILL.md`, sibling skill README, template, exemplar or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The README reads purpose-first with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The README passes the validator with zero issues and the HVR grep with zero hits.
- **SC-003**: The version field and the changelog entry align on the new release.
- **SC-004**: The section-by-section diff confirms every fact carried over from the old README.
- **SC-005**: This phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite style drifts from the standard | Follow the template section model and the validator floor |
| Dependency | mcp-obsidian exemplar | Exemplar tone copies over council facts wrongly | Cross-check every claim against the current README and `SKILL.md` |
| Dependency | Changelog convention | Entry naming drifts from the folder pattern | Follow the `v<version>.md` naming used by the existing entries |
| Risk | Large rewrite drops facts | Capabilities vanish silently | REQ-007 gates a section-by-section diff |
| Risk | HVR violations accumulate | Voice check fails late | Scripted grep gates in the verification phase |
| Risk | Link rot | Navigation breaks after the rewrite | Link guard check on every link in the README |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
