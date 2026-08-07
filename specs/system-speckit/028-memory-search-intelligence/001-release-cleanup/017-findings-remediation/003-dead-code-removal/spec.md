---
title: "Feature Specification: Dead Code and Broken Reference Removal"
description: "Scripts, npm entries, dependencies, CLI subcommands and config references exist with no reachable caller or with targets that no longer exist. One test file has never run because its filename hides it from the test runner."
trigger_phrases:
  - "dead code removal"
  - "017 phase 003"
  - "findings remediation 003"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/003-dead-code-removal"
    last_updated_at: "2026-07-27T08:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase spec from the audit findings"
    next_safe_action: "Wait for phase 001 dispositions before acting"
    blockers: ["Gated on phase 001 triage dispositions"]
    key_files:
      - "spec.md"
      - "../../016-dead-code-and-architecture-audit/findings-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Dead Code and Broken Reference Removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 003 of 009 |
| **Findings in scope** | 14 |
| **Blast radius** | Low-Med |
| **Predecessor** | ../002-repo-hygiene-and-residue/spec.md |
| **Successor** | ../004-legacy-and-superseded-removal/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 003** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase acts only on findings that phase 001 dispositioned CONFIRMED.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Scripts, npm entries, dependencies, CLI subcommands and config references exist with no reachable caller or with targets that no longer exist. One test file has never run because its filename hides it from the test runner.

### Purpose

Remove what is genuinely unreachable and repair references whose targets moved, without touching anything that is reached dynamically.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The package.json dev script whose target directory does not exist, and dependencies with zero importers
- CLI subcommands with no external caller
- Orphan smoke and helper scripts with no reachable invocation
- The vitest file whose malformed extension hides it from every include glob
- Config and workflow references pointing at directories that no longer exist

### Out of Scope

- Any candidate phase 001 disposition marked REFUTED
- validate-doc-model-refs.js, already proven live via the installed pre-commit hook
- chokidar, which has real importers

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `package.json` | Modify | Remove the dead dev script and the dependencies with zero importers |
| `(dead scripts)` | Delete | Scripts confirmed unreachable by literal search |
| `(test file)` | Rename | Restore the vitest file to a name the include glob matches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every deletion is preceded by a string-literal reachability search | Each removal cites a literal search returning zero live callers |
| REQ-002 | The hidden test file is renamed and its cases actually execute | Test runner collects the file and reports its cases |
| REQ-003 | No file reached by a hook, registry or YAML name is deleted | Search covers .md, .yaml, .json and shell sources, not just imports |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Regressions surfaced by the renamed test are fixed or explicitly accepted | Either the suite passes or the failure is documented with a decision |
| REQ-005 | Broken config references are repaired rather than deleted where the intent is still valid | Each reference either points somewhere real or is removed with rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every removed item has a recorded zero-caller literal search.
- **SC-002**: The renamed test file is collected and its two cases run.
- **SC-003**: The full test suite result is recorded before and after.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dynamically-invoked script is deleted | High | Literal search across all text file types is mandatory; this is the exact failure that produced the audit's headline refutation |
| Risk | The renamed test surfaces a real regression that blocks the phase | Medium | Expected outcome, not a failure; fix or accept explicitly rather than reverting the rename |
| Dependency | Phase 001 dispositions | Blocks execution | Disposition table |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which findings in this phase does the operator approve for execution?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit findings**: `../../016-dead-code-and-architecture-audit/findings-report.md`
- **Phase parent**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
