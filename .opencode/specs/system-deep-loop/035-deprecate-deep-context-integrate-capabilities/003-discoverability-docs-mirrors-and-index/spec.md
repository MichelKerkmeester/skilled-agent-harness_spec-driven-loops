---
title: "Feature Specification: Discoverability Docs Mirrors And Index Cleanup"
description: "Phase 003 removes standalone deep-context discoverability after the public route is safely closed, synchronizing registry, advisor, docs, mirrors, and generated indexes."
trigger_phrases:
  - "deep-context discoverability cleanup"
  - "deep-context registry cleanup"
  - "deep-context advisor cleanup"
  - "deep-context mirror cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-deprecate-deep-context-integrate-capabilities/003-discoverability-docs-mirrors-and-index"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Implemented phase 003 registry, advisor, docs, mirror, and index cleanup"
    next_safe_action: "Use phase 004 outputs for runtime cleanup evidence."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../002-public-redirect-and-replacement-contracts/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-003-contract-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Historical specs remain unchanged unless active fixture or index input status is proven."
      - "Standalone `/deep:context` is retained only as a no-write redirect."
      - "Active `.opencode` and `.claude` deep-context agent mirrors are disabled deprecation stubs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Discoverability Docs Mirrors And Index Cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 003 cleans up places that advertise standalone `deep-context` after phase 002 closes the public route. The work updates active registry, advisor, documentation, mirror, and generated-index surfaces so users see `@context`, `deep-research`, and `deep-review` replacement paths instead of a standalone context loop.

**Key Decisions**: no discoverability cleanup before phase 002 passes; generated indexes are regenerated or refreshed through their owners; missing mirror references are reconciled from actual files, not assumed.

**Critical Dependencies**: verified phase 002 redirect, mode-registry drift guard, skill-advisor projection generation, active docs grep, and metadata/index refresh tooling.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Validated |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 4 |
| **Predecessor** | `../002-public-redirect-and-replacement-contracts/spec.md` |
| **Successor** | `../004-fixtures-benchmarks-and-runtime-cleanup/spec.md` |
| **Handoff Criteria** | Registry, advisor, active docs, mirrors, and generated indexes no longer advertise standalone `deep-context` as an active mode. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Even after `/deep:context` is redirected, active discoverability surfaces can continue to tell users and routers that standalone `deep-context` is a supported deep-loop mode. Current evidence includes `mode-registry.json`, parent deep-loop skill docs, advisor projection/index files, root README/AGENTS guidance, orchestrator routing tables, and runtime agent mirrors.

Fresh inventory found active `.opencode/agents/deep-context.md` and `.claude/agents/deep-context.md` mirrors that still described the legacy analyzer-seat host contract. It did not find a Codex deep-context mirror. Phase 003 reconciles actual mirror state instead of syncing nonexistent files.

### Purpose

Remove active standalone `deep-context` discoverability after public behavior is safe, while preserving historical records and replacement guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `mode-registry.json` so standalone `context` is no longer advertised as an active public deep-loop mode, or explicitly marks it deprecated according to the registry contract chosen during implementation.
- Regenerate or update skill-advisor routing projections and skill graph indexes that surface `deep-context`.
- Update active root and command-facing docs that tell users to run `/deep:context` or treat `deep-context` as one of the live top-level modes.
- Update OpenCode and Claude orchestrator routing docs to remove or redirect `@deep-context` routing entries after actual mirror file state is confirmed.
- Refresh generated spec memory/index metadata that is supposed to reflect active packet docs.
- Preserve `@context` as the active read-only exploration agent.

### Out of Scope

- Closing the public command path; phase 002 owns that.
- Fixture, benchmark, nested packet archive, or runtime branch cleanup; phase 004 owns that.
- Editing archived/historical specs only for cosmetic removal.
- Creating a replacement `deep-context` mode under a new name.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Modify | Remove or deprecate active standalone `context` mode entry after phase 002 passes. |
| `.opencode/skills/deep-loop-workflows/SKILL.md` | Modify | Update parent mode roster and replacement guidance. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Regenerate or modify through advisor projection workflow | Keep TypeScript advisor projections aligned with registry. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Regenerate or modify through advisor projection workflow | Keep Python advisor projections aligned with registry. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` | Regenerate or refresh | Remove active deep-context skill graph discoverability if generated. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Verify or update if contract changes | Ensure registry and advisor projections stay synchronized. |
| `AGENTS.md` | Modify | Update quick reference and workflow routing text after redirect is proven. |
| `README.md` | Modify | Replace standalone deep-context user-facing guidance. |
| `.opencode/agents/orchestrate.md` | Modify | Remove or redirect `@deep-context` route and missing file references. |
| `.claude/agents/orchestrate.md` | Modify | Mirror orchestrator routing change if Claude mirror remains active. |
| `.opencode/agents/deep-context.md` | Modify | Disable the OpenCode deep-context mirror as a deprecation stub. |
| `.claude/agents/deep-context.md` | Modify | Disable the Claude deep-context mirror as a deprecation stub. |
| `.opencode/specs/descriptions.json` | Regenerate/index refresh only | Avoid hand-editing generated index data unless tooling requires it. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Wait for phase 002 behavior safety. | Phase 002 proves `/deep:context` no longer starts the legacy loop before discoverability is removed. |
| REQ-002 | Synchronize registry and advisor projections. | Registry mode state and Python/TypeScript advisor projections pass the routing drift guard. |
| REQ-003 | Remove active standalone user guidance. | Active README/AGENTS/orchestrator docs no longer tell users to run standalone `/deep:context` for new work. |
| REQ-004 | Reconcile mirror file references. | Docs do not point to missing `.opencode`, `.claude`, or `.codex` deep-context agent files as active routes. |
| REQ-005 | Preserve replacement routes. | `@context`, `/deep:research`, `/deep:review`, and `/speckit:plan` remain discoverable with correct boundaries. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Refresh generated indexes. | Generated descriptions/skill graph/index files are refreshed through their owner tooling or explicitly documented as generated-pending. |
| REQ-007 | Keep historical records intact. | Archived specs and changelog records are not edited unless proven to feed active indexes or fixtures. |
| REQ-008 | Refresh phase metadata. | `description.json` and `graph-metadata.json` reflect phase 003 status after edits. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Active registry and advisor surfaces no longer route standalone `deep-context` as a live mode.
- **SC-002**: Active docs route exploration to `@context` and iterative work to `deep-research` or `deep-review` as appropriate.
- **SC-003**: Orchestrator routing tables stop referencing missing deep-context mirror files as active dispatch targets.
- **SC-004**: Generated indexes and metadata are refreshed or explicitly blocked with evidence.
- **SC-005**: Phase 003 validates strictly and parent recursive validation still passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 redirect | Discoverability cleanup could hide a still-executable route. | Require phase 002 verification first. |
| Dependency | Advisor projection workflow | Manual projection drift can break routing. | Use projection generation or run drift guard tests. |
| Risk | Missing mirror files treated as active | Docs keep pointing at dead paths. | Verify mirror files with Glob before editing docs. |
| Risk | Generated indexes hand-edited | Index refresh becomes non-repeatable. | Prefer owner tooling and record commands/results. |
| Risk | Historical records rewritten | Scope expands into archives. | Only edit active docs or proven index inputs. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Cleanup verification should use targeted grep and owner tests, not broad unbounded scans after every edit.

### Security
- **NFR-S01**: Advisor/index refresh must not write secrets or environment values into generated metadata.

### Reliability
- **NFR-R01**: Registry, advisor, docs, and mirrors must agree on the same replacement contract before phase 004 begins.

---

## 8. EDGE CASES

### Historical Specs And Archives
- Historical packets may continue to mention `deep-context`. Phase 003 only edits active docs and generated indexes that present current behavior.

### Mirror Files
- If a routing table references a deep-context mirror file that does not exist, the cleanup should remove or redirect that route rather than creating a new mirror solely to deprecate it.
- If an active deep-context mirror exists, the cleanup should make it an explicit disabled deprecation stub instead of preserving legacy dispatch instructions.

### Advisor Metadata Versus Runtime Behavior
- Advisor cleanup must not happen before the public command redirect works. Otherwise users could lose discovery while the legacy route remains callable.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Registry, advisor, docs, mirrors, generated indexes. |
| Risk | 15/25 | Routing/discoverability drift across runtime profiles. |
| Research | 10/20 | Inventory evidence exists; fresh grep still needed. |
| Multi-Agent | 4/15 | No parallel agents required. |
| Coordination | 13/15 | Depends on phase 002 and blocks phase 004. |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Advisor still recommends deep-context after registry cleanup. | High | Medium | Run routing projection and drift guard checks. |
| R-002 | Root docs still advertise `/deep:context`. | Medium | Medium | Grep active docs after edits. |
| R-003 | Missing mirror references remain in orchestrator docs. | Medium | Medium | Glob mirror paths and update routing tables. |
| R-004 | Generated descriptions retain active deep-context metadata. | Medium | Medium | Refresh indexes through owner tooling. |

---

## 11. USER STORIES

### US-001: Consistent Active Guidance (Priority: P0)

**As a** user reading active docs, **I want** one consistent replacement path, **so that** I do not start or ask for a deprecated standalone context loop.

**Acceptance Criteria**:
1. Given the README or AGENTS quick reference is read, When the user searches for `deep-context`, Then the current guidance points to replacements or historical context, not an active standalone workflow.
2. Given orchestrator routing is read, When the user asks for exploration, Then `@context` remains the active retrieval agent.

---

### US-002: Synchronized Routing Metadata (Priority: P1)

**As a** maintainer updating deep-loop routing, **I want** registry, advisor, and generated indexes to agree, **so that** skill selection and docs do not contradict each other.

**Acceptance Criteria**:
1. Given registry cleanup is complete, When drift guard tests run, Then advisor projections match the registry decision.
2. Given generated indexes are refreshed, When active metadata is searched, Then standalone `deep-context` is not presented as a current mode.

---

## 12. OPEN QUESTIONS

- None remaining for phase 003. Active current-state docs remove live standalone guidance, while registry and mirror surfaces retain explicit deprecation notes. Generated metadata refresh uses owner tooling and records non-blocking owner warnings in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Phase 002**: `../002-public-redirect-and-replacement-contracts/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
