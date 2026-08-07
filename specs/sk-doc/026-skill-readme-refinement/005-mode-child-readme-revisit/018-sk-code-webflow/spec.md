---
title: "Feature Specification: Phase 018 sk-code-webflow README revisit (rewrite)"
description: "Rewrite the sk-code-webflow mode skill README at sk-code/sk-code-webflow/README.md against the refined README template from phase 001, using the mcp-obsidian exemplar as the voice model, with a version bump, a changelog entry and full validation."
trigger_phrases:
  - "sk code webflow readme rewrite"
  - "webflow readme revisit"
  - "sk-code-webflow readme"
  - "mode child readme rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow"
    last_updated_at: "2026-08-04T14:45:00Z"
    last_updated_by: "markdown-executor"
    recent_action: "Completed phase 018 README rewrite"
    next_safe_action: "Await review gate on phase 018 evidence"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-webflow/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-sk-code-webflow"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 018 sk-code-webflow README revisit (rewrite)

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
| **Predecessor** | `017-sk-code-review` |
| **Successor** | `019-sk-design-interface` |
| **Handoff Criteria** | The sk-code-webflow README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, the HVR grep is clean, the version field is bumped with a matching changelog entry, the validator reports zero issues and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code-webflow README still carries the older tabular reference-card style and predates the pilot standard that the mcp-obsidian README set. It opens with an AT A GLANCE lookup table and a structure-tree layout section, so a human reader gets a feature inventory before any statement of the problem the surface solves. The mcp-obsidian pilot proved the narrative, purpose-first standard for mode skill READMEs: a one-line pitch blockquote, a problem-first OVERVIEW and prose that carries the explanation. Phase 001 then refined the shared README template, adding Human Voice Rules enforcement, versioning conventions and a stricter validation checklist. The sk-code-webflow README has never been checked against that refined standard, so its conformance is unverified and its voice is stale.

### Purpose
Rewrite `.opencode/skills/sk-code/sk-code-webflow/README.md` purpose-first per the refined README template from phase 001, using the mcp-obsidian README as the exemplar for the narrative voice. The rewrite adds a one-line pitch blockquote, a problem-first OVERVIEW and the template section model, then bumps the version field, adds the changelog entry and validates the result. Every fact the current README carries survives the rewrite, verified by a section-by-section diff.

**End goal:** a purpose-first, validated README for the Webflow surface mode that matches the fleet standard and keeps parent packet success criterion SC-001 true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: the version field value, the `validate_document.py --type readme` output and the link state.
- Rewrite the README purpose-first per the refined template with a one-line pitch blockquote, a problem-first OVERVIEW and the numbered ALL-CAPS H2 section model.
- Bump the version field in the README frontmatter and add the matching changelog entry.
- Validate the rewritten README and this phase folder.

### Out of Scope
- SKILL.md content and any other file inside the sk-code-webflow skill folder.
- Other skills' READMEs (owned by their sibling phases in 005-mode-child-readme-revisit).
- The refined template and the standalone fleet (owned by phases 001 and 004).
- Vault files, plugin data and any runtime configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/sk-code-webflow/README.md` | Rewrite | Purpose-first narrative on the refined template with a one-line pitch and a problem-first OVERVIEW |
| `.opencode/skills/sk-code/sk-code-webflow/changelog/<version>.md` | Add | Per-release changelog entry matching the bumped version field |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/018-sk-code-webflow/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template, the mcp-obsidian exemplar README, the sk-code-webflow `SKILL.md`, the changelog folder and the parent spec are evidence for the rewrite, never writable in this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template readiness gate | The refined template exists at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, is read before the rewrite and its section model and required-section rule are recorded |
| REQ-002 | Baseline inventory | The current README is read and the baseline is recorded: the version field value, the `validate_document.py --type readme` output and the link state |
| REQ-003 | Purpose-first rewrite | The README is rewritten per the refined template with a one-line pitch blockquote right after the H1, a problem-first OVERVIEW and the numbered ALL-CAPS H2 section model with `---` dividers. Non-earning sections are dropped and the rest renumbered |
| REQ-004 | Human Voice Rules clean | The HVR grep returns zero em dashes, zero semicolons and zero Oxford commas in the README body |
| REQ-005 | Version bump and changelog | The README frontmatter carries a bumped version field and a matching entry exists at `changelog/<version>.md` |
| REQ-006 | Validator zero issues | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues on the README and every linked path resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved | A section-by-section diff against the prior README shows every fact preserved through the rewrite |
| REQ-008 | Out-of-scope guard | No SKILL.md, other skill README, template or vault file is modified |
| REQ-009 | Phase closeout | `validate.sh` on this phase folder reports zero errors and the phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README opens with a one-line pitch blockquote and a problem-first OVERVIEW on the refined template.
- **SC-002**: Every fact from the current README survives the rewrite, confirmed by a section-by-section diff.
- **SC-003**: The README carries a bumped version field with a matching changelog entry and passes the validator with zero issues.
- **SC-004**: The HVR grep is clean and this phase folder validates with zero errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined template from phase 001 | Rewrite measured against a moving standard | Gate the rewrite on the phase 001 output and read the template first (REQ-001) |
| Dependency | Phases 001 and 004 complete | Standard and fleet not settled | Parent spec gates child phases on both |
| Dependency | mcp-obsidian exemplar README | Narrative voice mismatch | Read the exemplar before drafting the rewrite |
| Risk | The current README mixes card style with partial narrative | The rewrite may drop or reorder facts | REQ-007 gates the section-by-section diff |
| Risk | Version field drifts from the changelog head | Version and changelog gates disagree | Record the baseline version and the changelog head and pick the bump target on evidence |
| Risk | Link rot inside the README | Link guard fails | Run the link guard and fix or record each dead link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the rewrite bump the version field from 1.0.0.0 to 1.1.0.0? The field reads 1.0.0.0 and the changelog head is v1.0.0.0, so the minor bump is the expected target. The changelog entry name follows that decision.
<!-- /ANCHOR:questions -->
