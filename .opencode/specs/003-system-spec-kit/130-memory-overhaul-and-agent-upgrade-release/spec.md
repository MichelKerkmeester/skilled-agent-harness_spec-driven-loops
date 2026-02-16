<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Memory Overhaul & Agent Upgrade Release

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Umbrella specification coordinating documentation alignment across 11 source specs (014–016 agent system, 122–129 spec-kit system) that have been implemented but whose documentation artifacts — READMEs, SKILL.md files, command configs, agent configs, changelogs — have not been audited for cross-referential consistency. This spec produces 7 subtask specifications; future agents execute the actual alignment work.

**Key Decisions**: Specification-only output (no code changes), 7-subtask decomposition with dependency ordering, multi-track changelog consolidation

**Critical Dependencies**: All 11 source specs must be implemented before audit begins
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec** | 130 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
| **Branch** | `130-memory-overhaul-and-agent-upgrade-release` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Specs 014–016 (agent system) and 122–129 (spec-kit system) have been implemented across 200+ files, but their documentation artifacts contain stale counts (e.g., "4 sources" instead of 5), wrong version numbers, missing feature descriptions (upgrade-level, auto-populate, anchor tags), and outdated architecture references. No systematic audit has been performed to ensure cross-referential consistency.

### Purpose
Produce a complete set of specification documents (7 subtask specs with checklists) that enable future agents to systematically audit and align all documentation artifacts to reflect the current post-implementation state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 7 subtask specification folders (spec.md + checklist.md + changes.md each)
- Consolidated changelog reference covering all 11 source specs
- Root umbrella spec and README
- Dependency ordering and self-contained task specifications

### Out of Scope
- Actual file edits to READMEs, SKILL.md, commands, agents — deferred to implementation phase
- Code changes to MCP server, scripts, or shared utilities
- Test creation or modification
- Git tagging or GitHub release execution

### Files to Create

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `130-*/README.md` | Create | Executive overview with dependency graph |
| `130-*/spec.md` | Create | Level 3+ umbrella specification |
| `130-*/changelog-reference.md` | Create | Consolidated changelog from 11 source specs |
| `130-*/task-01-*/spec.md` | Create | README audit specification |
| `130-*/task-01-*/checklist.md` | Create | README audit checklist |
| `130-*/task-01-*/changes.md` | Create | Empty template for implementer |
| `130-*/task-02-*/spec.md` | Create | SKILL.md + references audit spec |
| `130-*/task-02-*/checklist.md` | Create | SKILL.md audit checklist |
| `130-*/task-02-*/changes.md` | Create | Empty template for implementer |
| `130-*/task-03-*/spec.md` | Create | Command configs audit spec |
| `130-*/task-03-*/checklist.md` | Create | Command configs audit checklist |
| `130-*/task-03-*/changes.md` | Create | Empty template for implementer |
| `130-*/task-04-*/spec.md` | Create | Agent configs audit spec |
| `130-*/task-04-*/checklist.md` | Create | Agent configs audit checklist |
| `130-*/task-04-*/changes.md` | Create | Empty template for implementer |
| `130-*/task-05-*/spec.md` | Create | Changelog creation spec |
| `130-*/task-05-*/checklist.md` | Create | Changelog creation checklist |
| `130-*/task-05-*/changes.md` | Create | Empty template for implementer |
| `130-*/task-06-*/spec.md` | Create | Root README update spec |
| `130-*/task-06-*/checklist.md` | Create | Root README update checklist |
| `130-*/task-06-*/changes.md` | Create | Empty template for implementer |
| `130-*/task-07-*/spec.md` | Create | Tagged release spec |
| `130-*/task-07-*/checklist.md` | Create | Tagged release checklist |
| `130-*/task-07-*/changes.md` | Create | Empty template for implementer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 task folders created with spec.md, checklist.md, and changes.md | 21 task files exist in correct directory structure |
| REQ-002 | changelog-reference.md covers all 11 source specs | Every spec 014–016 and 122–129 referenced with version number, date, and file count |
| REQ-003 | Each task spec is self-contained | Agent can execute task without reading other specs or external context |
| REQ-004 | Root spec.md follows Level 3+ template | All ANCHOR tags, frontmatter, and sections present |
| REQ-005 | Dependency ordering consistent | README, spec.md, and task specs all show same dependency graph |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each task spec lists explicit file paths | No wildcards — every audit target file listed by full path |
| REQ-007 | Each checklist has P0/P1/P2 items | Priority tiers used consistently across all 7 checklists |
| REQ-008 | Cross-references between sibling documents correct | README links to spec.md and changelog-reference.md resolve |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 24 files exist in the correct directory tree with no empty placeholder content
- **SC-002**: Every spec.md has appropriate SPECKIT_LEVEL frontmatter
- **SC-003**: Each task spec lists enough detail for an agent to execute independently
- **SC-004**: changelog-reference.md has zero gaps across the 11 source specs
- **SC-005**: Dependency ordering is consistent across all documents
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All 11 source specs implemented | Cannot audit unimplemented features | Verify implementation status before audit |
| Risk | Scope creep into implementation | Spec-only umbrella becomes implementation | Strict scope enforcement: no file edits outside 130/ |
| Risk | Incomplete source audit | Missing features in task specs | Cross-reference every changelog entry against task specs |
| Risk | Version conflicts across tracks | Inconsistent version references | changelog-reference.md as single source of truth |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality
- **NFR-D01**: All spec documents follow SpecKit template conventions
- **NFR-D02**: No placeholder text (`[placeholder]`, `[TODO]`) in any delivered file

### Self-Containment
- **NFR-S01**: Each task spec provides enough context for an agent to execute without reading other task specs
- **NFR-S02**: File paths are absolute relative to project root (no wildcards)

### Consistency
- **NFR-C01**: Dependency graph identical across README, spec.md, and all task spec blocked-by fields
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Spec 129 (Pending)
- Spec 129 (anchor tags) may not be fully implemented at audit time
- Task specs should note spec 129 status and include conditional audit criteria

### Cross-Track Version Overlap
- Spec 016 appears in both agent-orchestration (v2.0.3.0) and opencode-environment (v2.0.4.0) changelogs
- changelog-reference.md must clearly attribute both entries
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 24, Tracks: 3, Systems: 4 (README, SKILL, commands, agents) |
| Risk | 15/25 | Cross-referential consistency, version conflicts, scope creep |
| Research | 15/20 | Deep audit of 11 source specs and 200+ documentation files |
| Multi-Agent | 12/15 | 7 subtasks, 4 parallel + 3 sequential workstreams |
| Coordination | 12/15 | 3-track changelog consolidation, dependency ordering |
| **Total** | **74/100** | **Level 3+** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Scope creep into implementation edits | H | M | Strict 130/ folder boundary enforcement |
| R-002 | Incomplete source spec audit | H | L | Systematic changelog cross-reference |
| R-003 | Version number conflicts across tracks | M | M | changelog-reference.md as SSOT |
| R-004 | Spec 129 incomplete at audit time | L | M | Conditional audit criteria in task specs |
| R-005 | Task specs not self-contained | M | L | Review pass checking agent executability |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Documentation Consistency Audit (Priority: P0)

**As a** maintainer, **I want** spec documents that define exactly what to audit in each documentation artifact, **so that** agents can execute alignment work systematically without ad-hoc decisions.

**Acceptance Criteria**:
1. Given a task spec, When an agent reads it, Then the agent can identify every file to audit and every criterion to check
2. Given all 7 task specs, When executed in dependency order, Then all documentation artifacts are aligned to post-implementation state

### US-002: Changelog Consolidation (Priority: P1)

**As a** maintainer, **I want** a single consolidated changelog reference, **so that** I can verify version numbers and feature coverage across all 3 tracks without opening 11 individual changelogs.

**Acceptance Criteria**:
1. Given changelog-reference.md, When I look up any source spec, Then I find its version number, date, file count, and key changes
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | |
| Task Specs Review | User | Pending | |
| Release Approval | User | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Documentation Compliance
- [ ] All spec.md files have SPECKIT_LEVEL frontmatter
- [ ] All sections have ANCHOR tags
- [ ] No placeholder text in delivered files

### Process Compliance
- [ ] Dependency ordering consistent across all documents
- [ ] Each task spec self-contained for agent execution
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User (Michel) | Maintainer | High | Review spec before execution |
| Agent System | Executor | High | Self-contained task specs |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-16)
**Initial specification** — 7-subtask umbrella for 11 source specs across 3 tracks
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None — all source specs implemented and changelogs available
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **README**: See [README.md](README.md)
- **Changelog Reference**: See [changelog-reference.md](changelog-reference.md)
- **Task 01**: See [task-01-readme-alignment/spec.md](task-01-readme-alignment/spec.md)
- **Task 02**: See [task-02-skill-speckit-alignment/spec.md](task-02-skill-speckit-alignment/spec.md)
- **Task 03**: See [task-03-command-alignment/spec.md](task-03-command-alignment/spec.md)
- **Task 04**: See [task-04-agent-alignment/spec.md](task-04-agent-alignment/spec.md)
- **Task 05**: See [task-05-changelog-updates/spec.md](task-05-changelog-updates/spec.md)
- **Task 06**: See [task-06-global-readme-update/spec.md](task-06-global-readme-update/spec.md)
- **Task 07**: See [task-07-github-release/spec.md](task-07-github-release/spec.md)
