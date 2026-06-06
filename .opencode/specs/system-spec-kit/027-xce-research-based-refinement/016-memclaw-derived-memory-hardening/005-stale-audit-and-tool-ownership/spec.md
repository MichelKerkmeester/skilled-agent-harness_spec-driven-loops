---
title: "Feature Specification: Phase 5: stale-audit-and-tool-ownership [template:level_1/spec.md]"
description: "Default memory_search may silently hard-exclude deprecated-but-relevant rows, and the 37-tool MCP surface has no derived ownership map, so tool/command ownership can drift. This phase adds a read-only exclusion-risk audit and a derived tool-ownership lint."
trigger_phrases:
  - "stale exclusion audit memory_search"
  - "deprecated row hard exclusion diagnostic"
  - "derived tool ownership lint TOOL_DEFINITIONS"
  - "mcp tool ownership drift pre-commit"
  - "includeArchived importance_tier recall audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-06T10:10:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 5 planning docs (plan only)"
    next_safe_action: "Implement T001 intended-exclusion policy"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: stale-audit-and-tool-ownership

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `scaffold/005-stale-audit-and-tool-ownership` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-tombstones-and-edge-promotion |
| **Successor** | None |
| **Handoff Criteria** | Audit detects a synthetic silent-exclusion case; lint detects a synthetic ownership drift; default recall behavior unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Memclaw-derived memory hardening: provenance, idempotency, feedback reframe, tombstones, edges, stale audit, tool ownership specification. It is the polish phase — diagnostics and governance only — and is independent of the other four phases.

**Scope Boundary**: Read-only diagnostics and a derived governance lint. This phase MUST NOT change default recall behavior, add new search flags, consolidate the op-dispatch tool surface, or introduce SemVer/release-please governance. It only surfaces what is already happening (silent exclusions) and what already exists (tool ownership), never altering either.

**Dependencies**:
- None. This phase is independent and can land anytime, before or after siblings 001-004.
- Reuses existing substrate only: `doctor_memory.yaml` staleness signals, the pre-commit advisory+blocking gate chain, and `TOOL_DEFINITIONS` in `tool-schemas.ts`.

**Deliverables**:
- A read-only stale/status hard-exclusion audit that distinguishes intended status exclusion from silent hard-exclusion of relevant rows, surfaced via startup health and `/doctor memory`.
- A derived MCP tool-ownership map generated from `TOOL_DEFINITIONS` (not hand-maintained) plus a lint that detects ownership/stability drift.
- Wiring of both diagnostics into startup health, `/doctor` (memory + skill-budget), and pre-commit, where ownership drift hard-blocks at commit.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Default `memory_search` hard-excludes some rows: it forces `includeArchived=false` and the FTS path filters `importance_tier != 'deprecated'`, so a deprecated-but-still-relevant memory can be silently dropped from recall with no signal to the caller. Separately, the 37-tool MCP surface has no derived ownership or stability map, so which tool/command owns which behavior is tracked only by hand and can drift out of sync with `TOOL_DEFINITIONS`.

### Purpose
Silent recall exclusions become detectable as a diagnostic (without changing recall policy), and the 37-tool ownership map stays derived from `TOOL_DEFINITIONS` and in sync, both wired to fire automatically from health, `/doctor`, and pre-commit with zero manual checklist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only stale/status hard-exclusion audit that compares live query predicates against the intended-exclusion policy, surfaced via startup health and `/doctor memory`.
- Derived MCP tool-ownership lint generated from `TOOL_DEFINITIONS`, wired into pre-commit (blocking on drift) and `/doctor skill-budget`.
- Diagnostics surfaced through the existing MCP response hints and health output only — never via new search flags or recall-policy changes.

### Out of Scope
- Changing default recall behavior - the audit reports exclusion risk; any policy change requires a separate decision.
- Op-dispatch tool consolidation - explicitly rejected; collapsing tools harms LLM tool discoverability.
- SemVer / release-please governance - explicitly rejected; this is a single-user local system, not a public-versioned package.
- Any write or mutation - this phase is read-only diagnostics plus a generated lint; it changes no stored data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/hybrid-search.ts` | Modify | Expose intended-vs-actual exclusion predicates for the audit (no behavior change to recall) |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | Run the read-only stale-exclusion audit and emit results in health output |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Modify | Extend existing `staleness_signals` to register the hard-exclusion-risk diagnostic |
| `mcp_server/tool-schemas.ts` | Modify | Derive the tool-ownership/stability map from `TOOL_DEFINITIONS` |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Add a blocking tool-ownership drift gate to the existing gate chain |
| `mcp_server/references/config/hook_system.md` | Modify | Document the audit + ownership-lint surfaces and where they fire |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read-only stale/status hard-exclusion audit that distinguishes intended status exclusion from silent hard-exclusion of relevant rows | Audit reports exclusion risk as a diagnostic; default search behavior is unchanged (no new flags, no predicate edits to the recall path) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Derived MCP tool-ownership/stability map generated from `TOOL_DEFINITIONS` | Ownership map is generated (not hand-maintained); drift between map and `TOOL_DEFINITIONS` is detected |
| REQ-003 | Wire both diagnostics into startup health, `/doctor`, and pre-commit | Audit diagnostics appear passively in health + `/doctor memory`; ownership drift hard-blocks at commit and is visible in `/doctor skill-budget` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Silent recall exclusions are detectable — the audit flags a synthetic deprecated-but-relevant row that default search would have dropped.
- **SC-002**: The 37-tool ownership map stays derived from `TOOL_DEFINITIONS` and in sync; a synthetic ownership drift is caught by the lint.
- **SC-003**: Zero manual checklist — both diagnostics fire automatically from health, `/doctor`, and pre-commit.
- **SC-004**: No recall behavior change ships without a separate policy decision; default `memory_search` results are byte-identical before and after this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None (independent phase) | Can land anytime; no blocking sibling | N/A — reuses only existing substrate |
| Risk | False alarms because some rows are excluded on purpose | Med — noisy diagnostics erode trust | Distinguish intended status exclusion from silent hard-exclusion; only flag the latter |
| Risk | Tool-ownership lint reading generated docs as truth | Med — drift hidden if docs are the source | Derive the map from `TOOL_DEFINITIONS`; treat docs as generated outputs, never inputs |
| Risk | Pre-commit becoming a runtime-safety substitute | Low — commit gate is not a runtime guarantee | Keep runtime exclusion checks in health/`/doctor`; pre-commit only gates ownership drift |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where should the canonical intended-exclusion policy live — inline in `doctor_memory.yaml`, or a small dedicated policy constant the audit reads?
- Should the ownership lint also cover `/doctor` route manifests, or stay scoped to `TOOL_DEFINITIONS` for the MVP?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
