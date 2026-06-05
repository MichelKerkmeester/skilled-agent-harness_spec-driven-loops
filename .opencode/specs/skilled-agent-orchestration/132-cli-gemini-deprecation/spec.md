---
title: "Feature Specification: Deprecate project .gemini runtime surface"
description: "Delete the checked-in project .gemini runtime surface and remove active non-spec references to that project surface while preserving all spec records as historical context."
trigger_phrases:
  - "gemini deprecation"
  - "project .gemini"
  - "runtime surface cleanup"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-cli-gemini-deprecation"
    last_updated_at: "2026-06-05T06:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed .gemini deletion"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".gemini/**"
      - "AGENTS.md"
      - "README.md"
      - ".opencode/commands/**"
      - ".opencode/skills/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gemini-deprecation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Delete the project .gemini directory."
      - "Treat all specs as historical and do not sweep them for reference removal."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deprecate project .gemini runtime surface

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The repository still ships a project-level `.gemini/` runtime mirror even though the current workflow is OpenCode-centered and the user has requested that surface be deleted. This packet removes the checked-in project `.gemini` directory and updates active, non-spec references so the repo no longer directs maintainers or tooling to project `.gemini` files.

**Key Decisions**: delete the project `.gemini` surface, preserve Gemini CLI user-home documentation such as `~/.gemini` and `.geminiignore`, and preserve all spec folders as historical records.

**Critical Dependencies**: active source, docs, and tests must agree that Gemini CLI remains an external executor without a checked-in project `.gemini` mirror.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-05 |
| **Branch** | current working tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The checked-in project `.gemini/` directory is still treated as an active runtime surface by docs, command scaffolds, tests, runtime capability manifests, and MCP setup guidance. Keeping it in the public repo causes future command and agent workflows to keep maintaining a runtime mirror that the user wants removed.

### Purpose

Remove the project `.gemini` surface and align active non-spec repo references so maintainers use the remaining supported project runtime surfaces instead.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the tracked project `.gemini/**` directory and its checked-in files or symlinks.
- Delete the checked-in `.opencode/skills/cli-gemini/**` skill directory completely.
- Update active non-spec references that point to project `.gemini/settings.json`, `.gemini/agents`, `.gemini/commands`, `.gemini/workflows`, `.gemini/scripts`, `.gemini/skills`, `.gemini/specs`, `.gemini/changelog`, `.gemini/GEMINI.md`, or `.gemini/.utcp_config.json`.
- Update runtime capability manifests, mirror/parity checks, command authoring guidance, doctor MCP config lists, skill-advisor routing, and top-level docs so they do not require the project `.gemini` surface or advertise a deleted `cli-gemini` skill.
- Keep only non-skill Gemini CLI references that describe external binary behavior, user-home state such as `~/.gemini`, or historical records.
- Preserve all `specs/**` and `.opencode/specs/**` historical records during the reference cleanup sweep.

### Out of Scope
- Removing user-home Gemini CLI documentation, including `~/.gemini` and `.geminiignore`, because those are not the project runtime directory being deleted.
- Removing every mention of Gemini as a provider, binary, or historical executor where it does not advertise the deleted skill.
- Editing historical specs outside this active packet.
- Reworking unrelated runtime surfaces such as `.claude`, `.codex`, `.devin`, `.vscode`, or `opencode.json` except where a line explicitly lists project `.gemini` as a peer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gemini/**` | Delete | Remove the checked-in Gemini project runtime surface. |
| `.opencode/skills/cli-gemini/**` | Delete | Remove the checked-in Gemini CLI skill completely. |
| `AGENTS.md` | Modify | Remove the project `.gemini/agents` runtime-directory entry. |
| `README.md` | Modify | Remove project `.gemini` setup and mirror instructions. |
| `scripts/setup-maintainer-filters.sh` | Modify | Drop project `.gemini` from maintainer filters if present. |
| `.opencode/commands/**` | Modify | Remove generated-command and doctor references to project `.gemini` paths. |
| `.opencode/skills/**` | Modify | Update active source, manifests, tests, and docs that require project `.gemini` paths. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/**` | Modify | Maintain this packet's SpecKit artifacts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Delete the project `.gemini` runtime surface. | `git ls-files ".gemini/**"` returns no tracked project `.gemini` files after deletion is staged in the working tree. |
| REQ-002 | Remove active non-spec project `.gemini` references. | Targeted search for project `.gemini` paths outside `specs/**`, `.opencode/specs/**`, and allowed user-home docs returns no actionable references. |
| REQ-003 | Preserve historical specs. | No reference-removal edits are made under `specs/**` or `.opencode/specs/**` except this active packet. |
| REQ-004 | Delete the `cli-gemini` skill and active registrations. | `.opencode/skills/cli-gemini/**` is absent, skill catalogs and advisor fallback routing no longer advertise it, and the skill graph no longer has a live `cli-gemini` node. |
| REQ-005 | Update tests and manifests that encode mirror parity. | Runtime capability and parity tests no longer require `.gemini/agents` or `.gemini/settings.json`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Update public docs and install guides. | README, AGENTS, doctor docs, and relevant skill docs no longer tell users to edit project `.gemini` files. |
| REQ-007 | Preserve verification coverage. | Existing targeted tests are updated or replaced so removed project `.gemini` assumptions do not create false failures. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The working tree deletes all tracked files under project `.gemini/**`.
- **SC-002**: Active non-spec repo docs, tests, scripts, and manifests no longer reference project `.gemini` runtime paths or advertise `cli-gemini` as an installed skill.
- **SC-003**: Specs remain untouched as historical records, except for this packet's own SpecKit files.
- **SC-004**: Targeted verification passes for changed scripts/tests/docs, plus strict SpecKit validation for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing `.gemini` can break tests that expect mirror parity | High | Update parity expectations and run targeted tests. |
| Risk | Over-broad search could remove `~/.gemini` or `.geminiignore` docs | Medium | Treat user-home docs as out of scope and verify with targeted patterns. |
| Risk | Stale skill-advisor metadata could still route to the deleted skill | High | Rescan the skill graph and rebuild advisor metadata after deletion. |
| Risk | Historical records under specs still contain `.gemini` paths | Low | User explicitly classified all specs as historical. Exclude specs from cleanup searches. |
| Dependency | Checked-in generated dist files may mirror source runtime detection | Medium | Update source and tracked generated artifacts when present. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance change is expected; this is repository-surface cleanup.

### Security
- **NFR-S01**: No secrets are introduced or exposed while deleting configuration files.

### Reliability
- **NFR-R01**: Runtime detection must fail closed or report unavailable when Gemini project config is absent, rather than requiring deleted files.

---

## 8. EDGE CASES

### Data Boundaries
- User-home Gemini state: keep `~/.gemini` references when they describe operator-local authentication and memory, not the project directory or deleted skill.
- Gemini ignore file: keep `.geminiignore` references because it is a Gemini CLI ignore file, not the deleted project `.gemini` directory.

### Error Scenarios
- If a test fixture intentionally creates a temporary `.gemini` folder, keep or update it only when the fixture models user-home or temp runtime behavior.
- If a historical changelog mentions `.gemini`, decide case-by-case whether it is active guidance or historical release narrative.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Runtime directory deletion plus docs, commands, skills, tests, and manifests. |
| Risk | 18/25 | Breaking mirror parity and runtime detection assumptions is possible. |
| Research | 14/20 | Requires repository-wide exact search and targeted file review. |
| Multi-Agent | 0/15 | User constrained this run to no autonomous agent dispatch. |
| Coordination | 10/15 | Cross-surface docs and test expectations must stay synchronized. |
| **Total** | **62/100** | **Level 3 selected for runtime-surface decision record despite Level 2 numeric recommendation.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Build or tests reference deleted `.gemini` files. | H | H | Update tests and manifests before verification. |
| R-002 | Docs still direct maintainers to project `.gemini`. | M | H | Run targeted active-doc search after edits. |
| R-003 | Cleanup removes Gemini CLI user-home instructions. | M | M | Keep `~/.gemini` and `.geminiignore` references unless they claim project mirror support. |
| R-004 | Generated dist remains stale after source edit. | M | M | Run build or patch tracked dist when build pipeline requires checked-in output. |

---

## 11. USER STORIES

### US-001: Project runtime surface removed (Priority: P0)

**As a** maintainer, **I want** the project `.gemini` directory deleted, **so that** the repo no longer carries a deprecated Gemini project runtime mirror.

**Acceptance Criteria**:
1. Given the repository working tree, When tracked files are listed, Then no tracked file remains under `.gemini/**`.

---

### US-002: Active references aligned (Priority: P0)

**As a** maintainer, **I want** active docs, scripts, tests, and manifests to stop pointing at project `.gemini`, **so that** future work does not recreate or depend on the deleted surface.

**Acceptance Criteria**:
1. Given active non-spec files, When targeted project `.gemini` path search runs, Then no actionable active reference remains.

---

### US-003: Deleted skill no longer routes (Priority: P1)

**As a** maintainer, **I want** the deleted `cli-gemini` skill removed from catalogs and advisor routing, **so that** no future assistant tries to load a missing skill.

**Acceptance Criteria**:
1. Given active skill catalogs and advisor metadata, When routing is refreshed, Then `cli-gemini` is not returned as an available skill.

---

## 12. OPEN QUESTIONS

- None. The user clarified deletion semantics and historical spec scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
