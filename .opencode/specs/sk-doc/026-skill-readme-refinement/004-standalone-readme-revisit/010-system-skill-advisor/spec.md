---
title: "Feature Specification: Phase 010 system-skill-advisor README revisit"
description: "Rewrite the system-skill-advisor README at .opencode/skills/system-skill-advisor/README.md against the refined template from phase 001 with the mcp-obsidian exemplar shape: one-line pitch, problem-first OVERVIEW, HVR clean prose, version bump and a changelog entry."
trigger_phrases:
  - "system skill advisor readme"
  - "advisor readme rewrite"
  - "gate 2 routing readme"
  - "readme revisit phase 010"
  - "skill advisor readme validation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor"
    last_updated_at: "2026-08-04T12:52:05Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 010 docs (spec, plan, tasks, checklist) inside 004-standalone-readme-revisit"
    next_safe_action: "Execute phase 010 work: rewrite the system-skill-advisor README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-system-skill-advisor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 010 system-skill-advisor README revisit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (004-standalone-readme-revisit) |
| **Parent Packet** | `sk-doc/026-skill-readme-refinement` |
| **Predecessor** | `009-system-deep-loop` |
| **Successor** | `011-system-spec-kit` |
| **Handoff Criteria** | The system-skill-advisor README reads purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the validator and the HVR grep with zero issues and carries a bumped version field with a matching changelog entry. This phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-obsidian pilot set the standard for standalone skill READMEs: narrative, purpose-first documents that state the outcome the skill delivers, written in the Human Voice Rules and validated by the sk-doc README validator. The system-skill-advisor README at `.opencode/skills/system-skill-advisor/README.md` still carries the older tabular reference-card style and predates the pilot standard and the refined template from phase 001. A reader meets an attribute inventory before any statement of the problem the skill solves. The version field in the README frontmatter also lags the skill changelog, so the metadata a reader sees does not match the shipped state.

### Purpose
Rewrite `.opencode/skills/system-skill-advisor/README.md` against the refined standalone template from phase 001, with the mcp-obsidian README as the exemplar shape. The rewrite leads with the reader: a one-line pitch, a problem-first OVERVIEW, the numbered ALL-CAPS H2 section model and HVR clean prose. The version field is bumped and a matching changelog entry lands in the skill changelog folder. The skill keeps its identity: the advisor daemon and MCP server that recommends skills from prompts with a calibrated score and an explicit trust state.

**End goal:** the system-skill-advisor README reads as one standard with the mcp-obsidian exemplar. The phase closes with the validator, the HVR grep and the link guard all clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README at `.opencode/skills/system-skill-advisor/README.md` and record the baseline: version field value, `validate_document.py --type readme` output and link state.
- Rewrite the README against the refined template with a one-line pitch and a problem-first OVERVIEW, preserving every factual claim.
- Bump the README version field and add the matching changelog entry.
- Run the validator, the HVR grep, the link guard and `git diff --check` on the rewritten README.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to SKILL.md, ARCHITECTURE.md, INSTALL-GUIDE.md, leaf manifests, hooks, the MCP server or any other file inside the skill root.
- Edits to the refined template (owned by phase 001) or the creation workflow (owned by phase 003).
- Rewrites of any other standalone skill README (owned by the sibling phases in 004).
- Edits to mode-child READMEs (owned by phase 005) and fleet-wide validation and closeout (owned by phase 006).
- Edits to vault files, plugin hooks, daemon state or runtime artifacts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/README.md` | Rewrite | Purpose-first rewrite against the refined template: one-line pitch, problem-first OVERVIEW, numbered ALL-CAPS H2 sections, HVR clean prose, bumped version field |
| `.opencode/skills/system-skill-advisor/changelog/<version>.md` | Add | Changelog entry documenting the README rewrite at the bumped version |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/010-system-skill-advisor/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar README at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` are evidence for the rewrite, never writable in this phase. The skill changelog folder records the version history the bump must follow.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refined template readiness gate | The refined standalone template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and is committed before the rewrite starts |
| REQ-002 | Inventory and baseline | The current README is read and the baseline records the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Purpose-first rewrite | The rewritten README opens with a one-line pitch blockquote and a problem-first OVERVIEW that states the reader's situation before any feature list |
| REQ-004 | Human Voice Rules clean | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version bump and changelog entry | The README frontmatter version field is bumped and a matching entry exists at `.opencode/skills/system-skill-advisor/changelog/<version>.md` |
| REQ-006 | Validator clean | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the pre-rewrite README shows no shipped behavior claim, path, command or capability dropped |
| REQ-008 | Out-of-scope guard | `git status` shows only the README, the changelog entry and the phase docs changed |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder returns zero errors and the phase metadata (description.json, graph-metadata.json) is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README opens with a one-line pitch and a problem-first OVERVIEW on the refined template model.
- **SC-002**: The README passes `validate_document.py --type readme`, the HVR grep and the link guard with zero issues.
- **SC-003**: The README carries a bumped version field and a matching changelog entry.
- **SC-004**: No file outside the README, the changelog entry and this phase's docs is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined standalone template (phase 001) | Rewrite against a moving template | REQ-001 gates the start on the committed template |
| Dependency | mcp-obsidian exemplar README | Shape drift between the exemplar and the rewrite | Read the exemplar before drafting |
| Dependency | sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
| Risk | HVR violations accumulate in a large rewrite | Voice check fails at closeout | Scripted grep per REQ-004 before closeout |
| Risk | Facts lost during the narrative rewrite | Shipped behavior claims disappear | Section-by-section diff per REQ-007 before the rewrite lands |
| Risk | Version field lags the changelog | Stale metadata reaches readers | REQ-005 couples the bump to the entry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
