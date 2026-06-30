---
title: "Feature Specification: Changelogs Constitutional And Templates Cleanup"
description: "Defines the pending release-cleanup sweep for changelogs, constitutional docs and spec-kit templates."
trigger_phrases:
  - "028 release cleanup changelogs"
  - "constitutional templates cleanup phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/000-release-cleanup/009-changelogs-constitutional-and-templates"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed cleanup: fixed 4 factual drifts, changelogs left historical"
    next_safe_action: "Phase complete, strict validation passed, no further action"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-005-009-changelogs-constitutional-and-templates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cleanup executed: factual-drift fixes only."
      - "Changelog entries left historical as immutable archive records."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Changelogs Constitutional And Templates Cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | COMPLETE |
| **Completed** | 2026-06-19 |
| **Created** | 2026-06-19 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/000-release-cleanup` |
| **Phase** | 009 of 012 |
| **Predecessor** | ../008-agents-md/spec.md |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog directories, constitutional docs and the system-spec-kit templates package needs a release-readiness cleanup contract before any document edits begin. Without a bounded phase, stale claims and path fixes can spread across unrelated documentation surfaces.

### Purpose
Changelogs are complete and consistently formatted, constitutional rules are current and templates match the validator contract. This phase only defines the pending cleanup scope, objective and verification steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- component changelog directories
- constitutional rule documents
- system-spec-kit template markdown and template files

### Out of Scope
- Executing the cleanup during scaffold creation.
- Editing packet 030.
- Marking any candidate complete before the cleanup phase runs.

### Discovery
- Glob: `.opencode/changelog/**/*.md, .opencode/skills/**/constitutional/**/*.md and .opencode/skills/system-spec-kit/templates/**/*.md`
- Command: `rg --files .opencode | rg '(/changelog/.+\.md$|/constitutional/.+\.md$|/system-spec-kit/templates/.+\.md$|/system-spec-kit/templates/.+\.tmpl$)'`

### Candidate Status

| Candidate Surface | Status | Note |
|-------------------|--------|------|
| component changelog directories | DONE | Reviewed, all entries are version-stamped historical archive, left unchanged |
| constitutional rule documents | DONE | README rule-file count 13 to 18, cli-dispatch Kimi k2.6 to k2.7 |
| system-spec-kit template markdown and template files | DONE | templates README tree adds phase-parent.spec.md.tmpl, glob level- to level_ |

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
- Changelog entries are complete and consistently formatted
- Constitutional rules match current workflow gates
- Templates match validator section contracts
- Template examples do not carry stale placeholders
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup/009-changelogs-constitutional-and-templates --strict` exits 0 after cleanup.
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
