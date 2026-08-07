---
title: "Feature Specification: Phase 005 sk-design README rewrite"
description: "Rewrite the sk-design skill README at .opencode/skills/sk-design/README.md against the refined README template from phase 001, purpose-first with a one-line pitch and a problem-first overview, HVR clean, version bumped and a changelog entry added."
trigger_phrases:
  - "sk design readme rewrite"
  - "sk design readme revisit"
  - "design readme template"
  - "design readme hvr"
  - "sk design readme validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 005 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 005 work: rewrite the sk-design README per the refined template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/README.md"
      - ".opencode/skills/sk-design/changelog/v1.7.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-sk-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 005 sk-design README rewrite

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
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `003-creation-workflow-update` (parent's predecessor, this is the first child of 004) |
| **Successor** | `006-sk-doc` (next sibling in the parent's sub-phase order) |
| **Handoff Criteria** | The sk-design README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, the HVR grep returns zero matches, the version field is bumped with a changelog entry added, the validator reports zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design README at `.opencode/skills/sk-design/README.md` still carries the older tabular reference-card style. It predates the mcp-obsidian pilot and the refined README template from phase 001. Its frontmatter version field reads `1.4.0.0` while the changelog head is `v1.6.0.0`, so the field lags the release history. The body leans on dense lookup tables and internals narration, including mode-registry mechanics, style-retrieval adapters, procedure-card policy and retired command history, instead of leading with the problem the skill solves for a human. It has no verification close.

### Purpose
Rewrite the README so a human gets a fast, honest orientation: a one-line pitch, an at-a-glance table, a problem-first overview, quick start, navigation and a verification close, with the mcp-obsidian README as the reference shape. The facts stay (two design modes, the two canonical `/interface:*` creation commands, the style-retrieval adapters, the transport boundaries). The presentation changes from reference card to narrative front door.

**End goal:** a purpose-first sk-design README that matches the mcp-obsidian standard, passes the README validator with zero issues and reads clean under the HVR grep, with the version field bumped and a changelog entry in place.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README in full and record the baseline: version field, validator output and link state.
- Rewrite `.opencode/skills/sk-design/README.md` purpose-first per the refined template from phase 001.
- Bump the frontmatter version field to `1.7.0.0`.
- Add a changelog entry at `.opencode/skills/sk-design/changelog/v1.7.0.0.md` in the changelog voice.
- Validate the rewrite with the sk-doc README validator, the HVR grep and the link guard.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Content changes to `SKILL.md` (runtime instructions stay untouched).
- Rewrites of any other skill README (owned by the sibling phases under 004).
- Edits to the refined template or the mcp-obsidian exemplar.
- Edits to mode registries, shared references, style libraries or vault files.
- Fleet-wide validation and changelog aggregation (owned by the packet closeout).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/README.md` | Rewrite | Purpose-first narrative README per the refined template, version field bumped to `1.7.0.0` |
| `.opencode/skills/sk-design/changelog/v1.7.0.0.md` | Add | Changelog entry documenting the README rewrite |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/005-sk-design/checklist.md` | Create | Phase verification checklist |

Read-only references: the current README, `SKILL.md`, `mode-registry.json`, the refined template, the mcp-obsidian README and `hvr-rules.md` are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are read and recorded in the checklist before the rewrite starts |
| REQ-002 | Inventory baseline | The current README is read in full and its version field (currently `1.4.0.0`), validator output and link state are recorded before any edit |
| REQ-003 | Purpose-first rewrite | The README is rewritten per the refined template with a one-line pitch in a blockquote after the H1 and an OVERVIEW that states the problem before any feature list, prose-led with tables only for lookup grids |
| REQ-004 | HVR clean | `rg -n "—|;|, and|, or"` on the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump plus changelog entry | The frontmatter version field reads `1.7.0.0` and `changelog/v1.7.0.0.md` exists with a body in the changelog voice |
| REQ-006 | Validator zero issues | `validate_document.py --type readme` reports zero issues on the rewritten README and every link in the README resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section `git diff` review against the old README confirms no shipped behavior claim is lost (modes, commands, adapters, transports) |
| REQ-008 | Out-of-scope guard | `git status` shows changes only in the README, the changelog entry and this phase folder. `SKILL.md`, other skill READMEs, templates and vault files stay untouched |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated for `description.json` and `graph-metadata.json` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A human can learn what sk-design does and when to reach for it within one screen of the rewritten README.
- **SC-002**: The README matches the mcp-obsidian exemplar shape: pitch, AT A GLANCE, problem-first OVERVIEW, QUICK START, navigation and verification close.
- **SC-003**: The rewrite passes the README validator with zero issues, the HVR grep with zero matches and the link guard clean.
- **SC-004**: The version field reads `1.7.0.0` and `changelog/v1.7.0.0.md` exists.
- **SC-005**: `git status` shows no change outside the README, the changelog entry and this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite targets a moving template | Gate the rewrite start on the template being committed and read (REQ-001) |
| Dependency | mcp-obsidian exemplar | Exemplar shape may not fit a hub skill with modes | Adapt the section model, keep the pitch and the problem-first OVERVIEW |
| Dependency | sk-doc README validator | Validation gate unavailable or stale | Run the validator early and record the output in the checklist |
| Risk | Facts lost in the narrative rewrite | Shipped behavior claims disappear | Section-by-section `git diff` review per REQ-007 |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails at closeout | Scripted `rg -n` grep per REQ-004 before completion |
| Risk | Scope drift into `SKILL.md` or mode docs | Phase touches runtime surfaces | REQ-008 guards the diff with `git status` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
