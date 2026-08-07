---
title: "Feature Specification: Docs and Playbooks"
description: "Two code READMEs and seven manual-testing playbook features covering the git preflight advisory across sk-git and the six cli runtimes."
trigger_phrases:
  - "git advisory docs and playbooks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/008-docs-and-playbooks"
    last_updated_at: "2026-07-28T08:30:00Z"
    last_updated_by: "glm-5-2"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Docs and Playbooks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

|| Field | Value |
||-------|-------|
|| **Level** | 1 |
|| **Priority** | P1 |
|| **Status** | Complete |
|| **Created** | 2026-07-28 |
|| **Branch** | `sk-git/0113-016-advisory-hook-build` |
|| **Parent Spec** | ../spec.md |
|| **Phase** | 8 of 8 |
|| **Predecessor** | 007-runtime-coverage |
|| **Successor** | None |
|| **Handoff Criteria** | READMEs and seven playbook features parse and cite paths that exist |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 007 landed four runtime adapters and style-aligned scripts, but the `scripts/lib/` and `scripts/hooks/` directories had no READMEs, and no manual-testing playbook feature exercised the advisory's trap shape (a directory-scoped commit silently dropping an untracked file) on any runtime.

### Purpose

Document the shared cores and the runtime matrix, and give operators one deterministic scenario per runtime that proves the advisory fires on the trap, stays silent on an ordinary commit, and is suppressible.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scripts/lib/README.md` and `scripts/hooks/README.md` (the two code READMEs)
- One sk-git playbook feature (`GIT-042`) covering the trap scenario end-to-end
- Six cli playbook features (CC-028, CX-029, CU-026, DV-021, CO-038, PI-020), one per runtime, each covering registration, delivery, the trap scenario, suppression, and fail-open

### Out of Scope
- Modifying the shared hook, checks, or any adapter behavior.
- Touching the six cli playbook root index files where no feature-folder index table exists.

### Files to Change

|| File Path | Change Type | Description |
||-----------|-------------|-------------|
|| See implementation-summary.md | Create | Recorded there with evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

|| ID | Requirement | Acceptance Criteria |
||----|-------------|---------------------|
|| REQ-001 | Two code READMEs patterned on the cli-opencode lib README | YAML frontmatter, OVERVIEW, ARCHITECTURE box diagram, key-files table, VALIDATION commands |
|| REQ-002 | Seven playbook feature files, each following its own playbook's local format | Frontmatter and section shape match a sibling feature file in the same playbook |
|| REQ-003 | Every cited path exists and every scenario id is free of collisions | `ls` and `grep` confirm before citing |

### P1 - Required (complete OR user-approved deferral)

|| ID | Requirement | Acceptance Criteria |
||----|-------------|---------------------|
|| REQ-004 | Each cli feature states the runtime's registration and delivery facts grounded in the actual config files | Cited facts match `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, the OpenCode plugin, and the Pi extension |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every file parses as markdown with intact frontmatter; every cited path exists; every scenario id is unique within its playbook.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

|| Type | Item | Impact | Mitigation |
||------|------|--------|------------|
|| Dependency | Phase 007 | Adapters and READMEs must exist | Complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
