---
title: "Feature Specification: Phase 002 cli-codex README revisit"
description: "Rewrite the cli-codex skill README at .opencode/skills/cli-external-orchestration/cli-codex/README.md purpose-first on the refined template from phase 001, using the mcp-obsidian exemplar as the standard."
trigger_phrases:
  - "cli codex readme"
  - "codex readme revisit"
  - "mode readme cli-codex"
  - "codex readme rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex"
    last_updated_at: "2026-08-04T13:50:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 002 docs (spec, plan, tasks, checklist) inside 005-mode-child-readme-revisit"
    next_safe_action: "Execute phase 002 work: rewrite the cli-codex README per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-cli-codex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 002 cli-codex README revisit

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
| **Parent Packet** | `sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit` |
| **Predecessor** | `001-cli-claude-code` |
| **Successor** | `003-cli-cursor` |
| **Handoff Criteria** | The cli-codex README is rewritten purpose-first on the refined template with a one-line pitch and a problem-first OVERVIEW, passes the HVR grep and the README validator with zero issues, carries a bumped version field and a changelog entry, and this phase folder validates with zero errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The cli-codex README at `.opencode/skills/cli-external-orchestration/cli-codex/README.md` still carries the older tabular reference-card style and predates the mcp-obsidian pilot standard. Its body leans on AT A GLANCE tables, a TROUBLESHOOTING table and an FAQ, and it opens with a feature list before it states the reader's problem. The frontmatter version field reads 1.5.0.0 while the changelog folder already holds entries through v1.8.0.0, so the version field has drifted from the changelog head. The mcp-obsidian pilot proved the standard: narrative, purpose-first documents in the Human Voice Rules, validated by the sk-doc README validator. The cli-codex README has not yet been brought to that standard.

### Purpose

Rewrite the cli-codex README purpose-first per the refined template from phase 001, using the mcp-obsidian README as the exemplar. The rewrite keeps every fact the current document carries, reorganizes it around the reader's problem, bumps the version field, adds a changelog entry and validates the result with zero issues.

**End goal:** a cli-codex README that matches the fleet standard set by the mcp-obsidian pilot and that passes every phase 006 fleet gate without rework.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the current README and record the baseline: version field value, validator output and link state.
- Rewrite the README purpose-first per the refined template, with a one-line pitch and a problem-first OVERVIEW, or verify-only if the README already conforms.
- Bump the version field in the README frontmatter and add a changelog entry under `changelog/`.
- Validate the rewritten README: README validator zero issues, HVR grep clean, link guard clean.
- Write this phase's own documentation set (spec, plan, tasks, checklist).

### Out of Scope
- Edits to the cli-codex SKILL.md or any references, assets or playbook content inside the skill.
- Edits to the refined README template (owned by phase 001) or any sk-create-skill asset.
- Rewrites of any other skill README in the fleet (owned by the sibling child phases).
- Edits to the mcp-obsidian exemplar README (verify-only, unchanged).
- Edits to vault files, mode registries, leaf manifests or any JSON asset.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-codex/README.md` | Modify | Purpose-first rewrite per the refined template: one-line pitch, problem-first OVERVIEW, capability sections, version bump |
| `.opencode/skills/cli-external-orchestration/cli-codex/changelog/v<version>.md` | Add | Changelog entry for the bumped version, following the existing `vX.Y.Z.W.md` convention |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex/spec.md` | Create | Phase specification (this file) |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex/plan.md` | Create | Phase implementation plan |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex/tasks.md` | Create | Phase task list |
| `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex/checklist.md` | Create | Phase verification checklist |

Read-only references: the refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md`, the mcp-obsidian exemplar README at `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` and the current cli-codex README are evidence for the rewrite, never writable outside the table above.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refined template readiness gate passes before the rewrite | The refined template at `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` and the mcp-obsidian exemplar README are read and their section models recorded before any edit |
| REQ-002 | Current README inventory recorded as the baseline | The current README's version field value, validator output and link state are recorded before the rewrite |
| REQ-003 | README rewritten purpose-first per the refined template | The README opens with a one-line pitch and a problem-first OVERVIEW and follows the refined template section model |
| REQ-004 | HVR grep passes | A grep of the README body returns zero em dashes, zero semicolons and zero Oxford commas |
| REQ-005 | Version field bumped and changelog entry added | The frontmatter version field increments and a changelog entry exists at `changelog/v<version>.md` per the `vX.Y.Z.W.md` convention |
| REQ-006 | README validator passes | `validate_document.py --type readme` reports zero issues on the rewritten README |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Facts preserved across the rewrite | A section-by-section diff of old versus new README shows no dropped capability, trap, boundary or integration fact |
| REQ-008 | Out-of-scope guard holds | No SKILL.md, template, other skill README, registry, manifest or vault file is modified |
| REQ-009 | Phase closeout completes | `validate.sh` on this phase folder reports zero errors and phase metadata is regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cli-codex README opens with a one-line pitch and a problem-first OVERVIEW per the refined template.
- **SC-002**: The rewrite preserves every capability, trap, boundary and integration fact of the current README.
- **SC-003**: The README passes `validate_document.py --type readme` with zero issues and the HVR grep with zero em dashes, semicolons and Oxford commas.
- **SC-004**: The version field is bumped and the changelog entry exists, so the version field matches the changelog head.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refined README template (phase 001) | Rewrite may follow the stale section model | Read the refined template and record its model before editing |
| Dependency | mcp-obsidian exemplar README | Rewrite may miss the pilot standard | Read the exemplar and mirror its narrative order |
| Risk | Fact loss during the rewrite | Capability or trap guidance disappears | Section-by-section diff against the baseline in REQ-007 |
| Risk | HVR violations in a large rewrite | Voice gate fails | Scripted grep gates in verification |
| Risk | Link breakage after restructuring | Navigation degrades | Link guard check in verification |
| Risk | Version field drifts from the changelog | Stale release state persists | REQ-005 gates the bump and the entry together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
