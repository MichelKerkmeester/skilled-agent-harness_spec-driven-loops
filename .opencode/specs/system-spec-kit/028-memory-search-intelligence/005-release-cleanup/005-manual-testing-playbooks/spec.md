---
title: "Feature Specification: Manual Testing Playbook Cleanup"
description: "Defines the pending release-cleanup sweep for manual testing playbook documentation."
trigger_phrases:
  - "028 release cleanup manual testing"
  - "manual testing playbook cleanup phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-release-cleanup/005-manual-testing-playbooks"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created PENDING cleanup phase scaffold"
    next_safe_action: "Execute discovery before changing any target documentation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-005-005-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase defines cleanup scope only."
      - "All cleanup candidates remain PENDING."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Manual Testing Playbook Cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | PENDING |
| **Created** | 2026-06-19 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/005-release-cleanup` |
| **Phase** | 005 of 009 |
| **Predecessor** | ../004-feature-catalogs/spec.md |
| **Successor** | ../006-commands/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The every manual testing playbook document across skills and repo-level packages needs a release-readiness cleanup contract before any document edits begin. Without a bounded phase, stale claims and path fixes can spread across unrelated documentation surfaces.

### Purpose
Scenarios match current behavior, source-file anchors are valid, file-count self-checks are correct and IDs are sequential. This phase only defines the pending cleanup scope, objective and verification steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- skill-local manual testing playbook roots
- numbered scenario files under playbook folders
- repo-level manual testing playbooks when present

### Out of Scope
- Executing the cleanup during scaffold creation.
- Editing packet 030.
- Marking any candidate complete before the cleanup phase runs.

### Discovery
- Glob: `.opencode/skills/**/manual_testing_playbook/**/*.md, .opencode/skills/**/manual_testing_playbook.md and **/manual_testing_playbook*.md`
- Command: `rg --files | rg '(^|/)(manual_testing_playbook\.md|manual_testing_playbook/.+\.md|manual_testing_playbook[^/]*\.md)$'`

### Candidate Status

| Candidate Surface | Status | Note |
|-------------------|--------|------|
| skill-local manual testing playbook roots | PENDING | Defined for cleanup execution only |
| numbered scenario files under playbook folders | PENDING | Defined for cleanup execution only |
| repo-level manual testing playbooks when present | PENDING | Defined for cleanup execution only |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Discovered documents from this phase | Modify later | Cleanup execution target, not touched by this scaffold |
| `spec.md` | Create | Defines cleanup scope and acceptance criteria |
| `plan.md` | Create | Defines cleanup approach and verification route |
| `tasks.md` | Create | Keeps all cleanup work PENDING |
| `checklist.md` | Create | Keeps all verification items PENDING |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Enumerate every in-scope document before edits | Discovery output is saved in the phase evidence when cleanup runs |
| REQ-002 | Keep cleanup limited to this phase surface | Only discovered documents for this phase are changed |
| REQ-003 | Remove stale file references | Stale-reference scan returns no actionable hit after cleanup |
| REQ-004 | Enforce HVR voice | Em dash, semicolon character and Oxford comma scans return no actionable hit |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verify path claims against the repository | Each source-file path is grep-traceable |
| REQ-006 | Preserve current behavior claims only | Capability and workflow claims match source docs or code |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All candidate surfaces in this phase are discovered and reviewed.
- Scenarios describe current behavior only
- Source-file anchors resolve
- File-count self-checks match discovery output
- Scenario identifiers are sequential
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/005-release-cleanup/005-manual-testing-playbooks --strict` exits 0 after cleanup.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Discovery misses a nested doc | Cleanup leaves stale release text behind | Re-run `rg --files` and compare with the phase glob |
| Risk | Mirror files drift | Runtime guidance contradicts the source surface | Add mirror comparison to checklist evidence |
| Dependency | Current source tree | Path checks depend on live files | Use grep evidence during execution |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- HVR house voice applies to every edited document.
- No em dash character is allowed in edited prose.
- No semicolon character is allowed in edited prose.
- No Oxford comma is allowed in edited prose.
- Source-file and mirror checks must be reproducible with shell commands.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Generated or vendored docs are listed but excluded unless they are a maintained repo surface.
- Archived docs may stay historical if they clearly state archive status.
- Mirror files must preserve runtime-specific frontmatter while keeping body text aligned.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Medium | Discovery can span many docs |
| Risk | Medium | Stale release claims can mislead future execution |
| Verification | Medium | Voice, path and stale-reference checks must all pass |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for the scaffold. Any cleanup ambiguity becomes a phase-local blocker during execution.
<!-- /ANCHOR:questions -->
