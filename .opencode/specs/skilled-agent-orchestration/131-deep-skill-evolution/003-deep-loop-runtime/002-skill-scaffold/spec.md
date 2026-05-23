---
title: "Feature Specification: 118/001 — Runtime Skill Scaffold"
description: "Level 2 Phase 1 spec for scaffolding the new .opencode/skills/deep-loop-runtime/ peer skill skeleton (SKILL.md, README.md, lib/, scripts/, storage/, tests/) so subsequent 118 phases have a destination for file moves, script shims, DB relocation, and tests."
trigger_phrases:
  - "deep-loop-runtime scaffold"
  - "runtime skill skeleton"
  - "118 phase 001"
  - "deep-loop peer skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 2 spec docs for runtime skill skeleton phase."
    next_safe_action: "Implement scaffold per plan and run strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1180011180011180011180011180011180011180011180011180011180010001"
      session_id: "118-001-runtime-skill-scaffold-spec"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: 118/001 — Runtime Skill Scaffold

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Scaffolded |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 8 |
| **Predecessor** | None (first phase of 118 arc) |
| **Successor** | `../002-lib-runtime-migration/spec.md` |
| **Handoff Criteria** | `.opencode/skills/deep-loop-runtime/` exists with `SKILL.md`, `README.md`, and the five subfolders `lib/deep-loop/`, `lib/coverage-graph/`, `scripts/`, `storage/`, `tests/` each containing at least a `.gitkeep`. Strict spec validation passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 118 arc executes a FULL_ISOLATE_NO_MCP migration that relocates 13 runtime library files, 4 MCP handler files, the SQLite coverage-graph DB, and 4 MCP tool schema entries out of `.opencode/skills/system-spec-kit/mcp_server/` and into a new peer skill `.opencode/skills/deep-loop-runtime/`. Subsequent phases (002 lib migration, 003 script shim and DB relocation, 004 MCP surface removal, 005 YAML update, 006 collateral update, 007 test migration, 008 verification/changelog) require the destination skill folder structure to exist before any moves can land. Without a stable, validated scaffold, phase 002 file moves would land in an inconsistent state and downstream phases would have no anchor.

### Purpose
Create the empty `.opencode/skills/deep-loop-runtime/` peer skill skeleton: a `SKILL.md` declaring the new skill (name=deep-loop-runtime, version=0.1.0, allowed-tools=Read+Glob+Grep+Bash, references the 118 ADR-001 super-seding ruling), a human-facing `README.md`, and the five subfolders (`lib/deep-loop/`, `lib/coverage-graph/`, `scripts/`, `storage/`, `tests/`) each containing a `.gitkeep` so they survive git. No runtime files are moved in this phase. No MCP surface is touched. No DB is relocated. The scaffold is documentation- and folder-only and is the architectural prerequisite for every later phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skills/deep-loop-runtime/SKILL.md` with valid frontmatter, version 0.1.0, the documented allowed-tools list, a short purpose blurb, and a reference to the 118 ADR-001 user-directive override.
- Create `.opencode/skills/deep-loop-runtime/README.md` with a human-facing overview that explains the skill is the new home for deep-loop and coverage-graph runtime infrastructure as the 118 arc completes.
- Create `.opencode/skills/deep-loop-runtime/lib/deep-loop/.gitkeep` (phase 002 lands 10 files here).
- Create `.opencode/skills/deep-loop-runtime/lib/coverage-graph/.gitkeep` (phase 002 lands 3 files here).
- Create `.opencode/skills/deep-loop-runtime/scripts/.gitkeep` (phase 003 lands 4 `.cjs` scripts here).
- Create `.opencode/skills/deep-loop-runtime/storage/.gitkeep` (phase 003 relocates `deep-loop-graph.sqlite` here).
- Create `.opencode/skills/deep-loop-runtime/tests/.gitkeep` (phase 007 migrates runtime tests here).
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` and confirm exit 0 with zero warnings.

### Out of Scope
- Moving any `.ts` file out of `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/` (phase 002 owns lib moves).
- Moving any file out of `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/` (phase 002 owns coverage-graph moves).
- Creating, editing, or removing any `.cjs` shim under `.opencode/skills/deep-loop-runtime/scripts/` (phase 003 owns shim creation).
- Relocating `deep-loop-graph.sqlite` (phase 003 owns DB relocation).
- Deleting any MCP handler file or tool schema entry under `.opencode/skills/system-spec-kit/mcp_server/` (phase 004 owns MCP surface removal).
- Editing any workflow YAML (`spec_kit_deep-{review,research}_{auto,confirm}.yaml`) (phase 005 owns YAML updates).
- Editing `.opencode/commands/doctor/**` or `.opencode/skills/system-code-graph/**` collateral (phase 006).
- Splitting or removing any test under `tests/deep-loop/` (phase 007 owns test migration).
- Bumping deep-review `SKILL.md` version, authoring changelog, or updating resource-map (phase 008 owns closeout).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold/spec.md` | Create | This Level 2 spec packet doc. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold/plan.md` | Create | Level 2 implementation plan. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold/tasks.md` | Create | Level 2 task ledger. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold/checklist.md` | Create | Level 2 verification checklist. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold/implementation-summary.md` | Create | Placeholder implementation summary with anchors. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold/description.json` | Create | Memory/search metadata. |
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold/graph-metadata.json` | Create | Graph metadata. |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Create (phase implementation) | New skill metadata + purpose. |
| `.opencode/skills/deep-loop-runtime/README.md` | Create (phase implementation) | Human-facing overview. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/.gitkeep` | Create (phase implementation) | Placeholder for phase 002 deep-loop lib moves. |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/.gitkeep` | Create (phase implementation) | Placeholder for phase 002 coverage-graph lib moves. |
| `.opencode/skills/deep-loop-runtime/scripts/.gitkeep` | Create (phase implementation) | Placeholder for phase 003 `.cjs` shim entry points. |
| `.opencode/skills/deep-loop-runtime/storage/.gitkeep` | Create (phase implementation) | Placeholder for phase 003 SQLite DB relocation. |
| `.opencode/skills/deep-loop-runtime/tests/.gitkeep` | Create (phase implementation) | Placeholder for phase 007 test migration. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create `deep-loop-runtime` skill folder with `SKILL.md` and `README.md` | `ls .opencode/skills/deep-loop-runtime/` lists `SKILL.md` and `README.md`. |
| REQ-002 | `SKILL.md` frontmatter declares the contract | Frontmatter contains `name: deep-loop-runtime`, `version: 0.1.0`, and `allowed-tools` listing Read, Glob, Grep, Bash. |
| REQ-003 | Create the five subfolders each with a `.gitkeep` | `find .opencode/skills/deep-loop-runtime -name .gitkeep` returns 5 paths under `lib/deep-loop/`, `lib/coverage-graph/`, `scripts/`, `storage/`, and `tests/`. |
| REQ-004 | Strict spec validation passes for this packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0 with zero warnings. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `SKILL.md` cross-references the 118 ADR-001 | `grep -F "118" .opencode/skills/deep-loop-runtime/SKILL.md` returns a non-empty match referencing the FULL_ISOLATE_NO_MCP ruling. |
| REQ-006 | `README.md` documents the future destination role | `README.md` names `lib/deep-loop/`, `lib/coverage-graph/`, `scripts/`, `storage/`, and `tests/` as future destinations for phase 002, 003, and 007 work. |
| REQ-007 | No MCP files moved, deleted, or modified | `git status .opencode/skills/system-spec-kit/mcp_server/` shows zero in-scope changes for this phase. |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | `SKILL.md` lists the phase ownership map | The skill file documents which 118 phase populates each subfolder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/skills/deep-loop-runtime/` exists with `SKILL.md`, `README.md`, and five `.gitkeep`-tagged subfolders.
- **SC-002**: Strict validation of this packet passes with zero errors and zero warnings.
- **SC-003**: No file under `.opencode/skills/system-spec-kit/mcp_server/` has been added, modified, moved, or deleted by this phase.
- **SC-004**: Phase 002 can immediately begin moving the 13 lib files into the new `lib/deep-loop/` and `lib/coverage-graph/` destinations without further scaffolding.
- **SC-005**: The skill is discoverable by the runtime - `ls -la .opencode/skills/` shows `deep-loop-runtime/` alongside other peer skills.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Phase scope creep into file moves | Premature moves break the staged migration plan | Spec explicitly enumerates moves as Out of Scope and lists only `.gitkeep` placeholders for subfolders. |
| Risk | Skill name collision with existing skill folder | Runtime indexer fails | `ls .opencode/skills/` will be checked before write; `deep-loop-runtime` is a new name with no existing match. |
| Risk | `SKILL.md` frontmatter rejected by skill-graph compiler | Skill is not surfaced | Frontmatter follows the minimal contract of peer skills; compiler will be re-run in phase 008 after content is complete. |
| Dependency | Phase parent metadata existing | Validator cannot resolve parent | Parent `graph-metadata.json` already declares this packet as a child; no further dependency setup required. |
| Dependency | Strict validator availability | Cannot verify completion | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --help` confirms the tool is on disk and runnable. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `SKILL.md` and `README.md` must stay short (under 200 lines combined) so phase 008 can update version and content without large diffs.
- **NFR-M02**: Folder layout matches the pattern used by other peer skills (`deep-review`, `deep-research`) so future contributors recognize the structure.

### Reliability
- **NFR-R01**: All five `.gitkeep` placeholders must be committed so empty folders survive future git operations.
- **NFR-R02**: The scaffold must not break any existing skill or MCP tool: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution --strict` must continue to PASS at the phase parent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

| Case | Handling |
|------|----------|
| `.opencode/skills/deep-loop-runtime/` already exists with partial content | Read existing content first; only fill in missing files; never overwrite a non-empty `SKILL.md`. |
| `.gitkeep` files already exist in subfolders | Idempotent create; no-op if file is present. |
| Skill name collides with a vendored or external skill | Halt and emit `STATUS=FAIL ERROR=skill-name-collision`; the user must rename before implementation. |
| Frontmatter validator rejects v0.1.0 as too low | The skill-md template documents minimum version 0.1.0 explicitly; if blocked, escalate to phase parent rather than bump silently. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | Two markdown files plus five `.gitkeep` placeholders in a brand-new folder; no edits to existing surfaces. |
| Risk | 2/25 | No runtime behavior change; no MCP edits; no DB relocation; the scaffold can be deleted with `rm -rf` for a complete revert. |
| Research | 4/20 | Read parent spec, peer skill `SKILL.md` shape, and existing Level 2 reference packets; no new investigation needed. |
| **Total** | **9/70** | **Level 2 (low-complexity scaffold)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Successor Phase**: `../002-lib-runtime-migration/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
<!-- /ANCHOR:related-docs -->
</content>
</invoke>