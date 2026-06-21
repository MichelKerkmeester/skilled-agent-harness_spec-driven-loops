---
title: "Feature Specification: Skill And Repo README Cleanup"
description: "Defines the pending release-cleanup sweep for skill-level and repo-level README files."
trigger_phrases:
  - "028 release cleanup skill readmes"
  - "repo README cleanup phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/000-release-cleanup/002-skill-and-repo-readmes"
    last_updated_at: "2026-06-19T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed cleanup: aligned skill READMEs and repo README"
    next_safe_action: "Phase complete, successor is ../003-skill-references-assets-and-skillmd"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-005-002-skill-and-repo-readmes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cleanup executed against the skill READMEs and root README (commit 6754d3a133)."
      - "Edits only, house structure preserved, paths resolve, strict validation 0/0."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill And Repo README Cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | COMPLETE |
| **Created** | 2026-06-19 |
| **Completed** | 2026-06-19 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/000-release-cleanup` |
| **Phase** | 002 of 009 |
| **Predecessor** | ../001-code-readmes/spec.md |
| **Successor** | ../003-skill-references-assets-and-skillmd/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The every skill-level README plus repository and runtime top-level README surfaces needs a release-readiness cleanup contract before any document edits begin. Without a bounded phase, stale claims and path fixes can spread across unrelated documentation surfaces.

### Purpose
Narrative README files use the house voice, describe current capability and avoid stale version or feature claims. This phase only defines the pending cleanup scope, objective and verification steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- skill-level README files under .opencode/skills
- repo root README files
- runtime top-level README mirrors when present

### Out of Scope
- Executing the cleanup during scaffold creation.
- Editing packet 030.
- Marking any candidate complete before the cleanup phase runs.

### Discovery
- Glob: `.opencode/skills/*/README.md, README.md, .opencode/README.md, .claude/README.md and .codex/README.md`
- Command: `rg --files .opencode/skills | rg '^\.opencode/skills/[^/]+/README\.md$' && printf '%s\n' README.md .opencode/README.md .claude/README.md .codex/README.md`

### Candidate Status

| Candidate Surface | Status | Note |
|-------------------|--------|------|
| skill-level README files under .opencode/skills | PENDING | Defined for cleanup execution only |
| repo root README files | PENDING | Defined for cleanup execution only |
| runtime top-level README mirrors when present | PENDING | Defined for cleanup execution only |

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
- Capability descriptions match current skill behavior
- Version, release and feature claims are backed by current source files
- Narrative tone follows HVR voice
- No stale pointers remain to removed docs, commands or assets
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup/002-skill-and-repo-readmes --strict` exits 0 after cleanup.
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
