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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-10T14:35:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped read-only audit and ownership lint"
    next_safe_action: "Monitor health and ownership drift surfaces"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: stale-audit-and-tool-ownership

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed |
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

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The stale-exclusion audit runs in the read-only health path and adds < 5 ms p95 to a `/doctor memory` / startup-health call (it reads the already-exposed exclusion predicates and the declared intended-exclusion policy in-memory; it issues no extra recall query and no extra DB round-trip on the hot search path).
- **NFR-P02**: The tool-ownership lint derives the map from `TOOL_DEFINITIONS` and diffs it at commit time only — it adds no per-request cost to any MCP call, and the pre-commit gate runs the derivation once against the committed map rather than per-tool.

### Security
- **NFR-S01**: The stale-exclusion audit is strictly observe-only — it reads exclusion predicates and the intended-exclusion policy but holds no write capability, so a defect in the audit cannot widen recall, mutate a row, or expose an excluded row through any normal search path.
- **NFR-S02**: The ownership map is server-derived from `TOOL_DEFINITIONS` and never trusts generated docs (`hook_system.md`) as input, so a tampered or stale doc cannot forge ownership/stability and pass the lint; the committed map and the live definitions are the only inputs.

### Reliability
- **NFR-R01**: The audit fails safe toward silence-of-the-diagnostic, never silence-of-recall — if the intended-exclusion policy is missing or an exclusion source is unrecognized, the audit emits a conservative "exclusion unclassified" diagnostic rather than suppressing the signal or altering the recall result set.
- **NFR-R02**: The tool-ownership lint is deterministic and idempotent — regenerating the map from an unchanged `TOOL_DEFINITIONS` yields a byte-identical map and a clean (no-drift) result, so a re-run never produces a spurious commit block.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Deprecated-but-relevant row**: a row carrying `importance_tier = 'deprecated'` that scores as genuinely relevant is hard-excluded by the FTS filter; the audit MUST classify this as a silent exclusion and flag it, while leaving the recall result set unchanged.
- **Archived row excluded by explicit `includeArchived=false`**: an archived row dropped by the forced `includeArchived=false` is an intended exclusion; the audit MUST classify it as intended and NOT flag it, so the diagnostic stays quiet for on-purpose drops.
- **Tool present in `TOOL_DEFINITIONS` but absent from the committed map** (or the reverse): the lint treats either direction as drift — a newly added or removed tool definition that the committed ownership map does not reflect is caught, not silently reconciled.

### Error Scenarios
- **Intended-exclusion policy is missing or malformed**: the audit emits an "exclusion unclassified / policy unavailable" diagnostic and continues; it never assumes every exclusion is intended (which would hide silent drops) and never blocks the health call.
- **`TOOL_DEFINITIONS` cannot be read or fails to parse at lint time**: the pre-commit gate fails closed (blocks the commit) with a clear "ownership source unreadable" message rather than passing on an empty or partial map that would mask drift.
- **An exclusion source appears that the audit does not recognize** (a new predicate added to the recall path): the audit reports it as unclassified rather than silently assuming intended, surfacing that the policy needs an update.

### State Transitions
- **A tool's owner or stability field changes in `TOOL_DEFINITIONS`**: the derived map changes, the lint detects drift against the committed map, and the commit is blocked until the committed map is regenerated to match — ownership cannot drift silently.
- **A row transitions `active` → `deprecated`**: once deprecated, default recall hard-excludes it; if it is still relevant the audit begins flagging it as a silent exclusion on the next health run, with no change to recall behavior at the transition.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 6 files: expose predicates in `hybrid-search.ts`, audit in `memory-crud-health.ts`, a `staleness_signals` entry in `doctor_memory.yaml`, a derived map over `TOOL_DEFINITIONS` in `tool-schemas.ts`, one pre-commit gate, and a docs update; read-only diagnostics plus a generated lint, ~120-200 LOC plus vitest. |
| Risk | 8/25 | No recall-path or stored-data changes — both pieces are observe-only/derived; the main risk is diagnostic noise (false silent-exclusion flags) or a lint that blocks commits incorrectly, neither of which can corrupt data or alter search results. |
| Research | 6/20 | Design is settled — reuses existing substrate (`doctor_memory.yaml` signals, the pre-commit gate chain, `TOOL_DEFINITIONS`); remaining unknowns are narrow (where the intended-exclusion policy lives, whether the lint also covers `/doctor` route manifests) and confirmable during Setup. |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

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
