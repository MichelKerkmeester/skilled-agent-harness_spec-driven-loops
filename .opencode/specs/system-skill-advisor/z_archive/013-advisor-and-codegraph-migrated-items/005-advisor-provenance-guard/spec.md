---
title: "Feature Specification: Advisor source-provenance guard for auto-written skill-graph edges"
description: "The advisor's auto edge-patch path writes auto_added_at/reason but has no durable source_kind or manual-overwrite guard. Adopt 027's automated-writers-never-overwrite-manual rule so propagate_enhances cannot clobber manually-authored provenance."
trigger_phrases:
  - "advisor provenance guard"
  - "source_kind manual overwrite protection"
  - "skill_graph_propagate_enhances guard"
  - "automated writers never overwrite manual"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/005-advisor-provenance-guard"
    last_updated_at: "2026-06-10T23:03:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented advisor source_kind provenance guard and verification"
    next_safe_action: "Use targeted guard tests when changing edge write behavior"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-advisor-provenance-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use source_kind values automated/manual/trusted; the server maps trusted-maintainer write intent to trusted."
      - "MCP propagation always derives automated provenance and does not accept source_kind from client payloads."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: advisor-provenance-guard

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | None (independent) |
| **Successor** | None (independent) |
| **Source transfers** | Analysis #3 (source_kind / manual-overwrite protection) |
| **Handoff Criteria** | Phase validates `--strict`; guard never blocks legitimate trusted-maintainer writes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the spec-027 feature adoption into the advisor and code-graph daemons. It hardens the advisor's auto edge-write path against clobbering manually-authored provenance.

**Scope Boundary**: The auto-patch apply path for `skill_graph_propagate_enhances` only. Add a durable `source_kind` field and a manual-overwrite guard. No changes to query paths, scoring, or unrelated edge writers.

**Dependencies**:
- None. Independent of all other phases; ships standalone.

**Deliverables**:
- Server-derived `source_kind` on graph-metadata edges (automated vs manual/trusted).
- A guard in the apply path that skips automated overwrites of protected (manually-authored) fields while still allowing legitimate trusted-maintainer writes.

**Changelog**:
- Parent changelog refresh was not performed because it is outside the approved write paths for this phase execution.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor's auto edge-patch path adds `auto_added_at` / `auto_added_reason` and is idempotent by target, but it carries no durable `source_kind` and no manual-protection guard (`lib/cross-skill-edges/apply-graph-metadata-patch.ts:25-29` and `:63-80`). An automated `skill_graph_propagate_enhances` run can therefore overwrite provenance a human authored. Memory's 027 guard derives `source_kind` server-side and skips automated overwrites of protected fields (`027 before-vs-after.md:47-50`; constitutional rule `automated-writers-never-overwrite-manual.md`).

### Purpose
Adopt 027's automated-writers-never-overwrite-manual rule for the advisor's auto edge writes: stamp `source_kind` server-side and refuse automated overwrites of manually-authored provenance, without blocking trusted-maintainer writes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Server-derived `source_kind` (e.g. `automated` vs `manual`/`trusted`) on skill-graph metadata edges.
- A manual-overwrite guard in the apply path: automated writers skip protected fields they did not originate.
- A trusted-write escape so legitimate maintainer edits still apply.

### Out of Scope
- Reworking the propagation algorithm or the enhances semantics - only the write/merge discipline changes.
- Retroactive backfill of `source_kind` onto every existing edge (handle missing values as legacy/unknown, do not block).
- Provenance for non-edge metadata or other writers outside `propagate_enhances`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts` (~:25-29, :63-80) | Modify | Add `source_kind` + manual-overwrite guard to the apply path |
| `system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts` | Modify | Pass automated source intent through to the guarded apply |
| skill `graph-metadata.json` edge shape | Modify | Additive `source_kind` field on edges (legacy edges tolerated) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An automated `propagate_enhances` run MUST NOT overwrite manually-authored protected fields | Test: seed a manual edge field, run propagation, assert the manual value survives and `source_kind` stays `manual` |
| REQ-002 | The guard MUST NOT block legitimate trusted-maintainer writes | Test: a trusted write to the same field applies and updates `source_kind` accordingly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `source_kind` is derived server-side, not client-supplied | Patches cannot self-declare `manual` to dodge the guard; server sets it from the write path |
| REQ-004 | Legacy edges without `source_kind` are tolerated, not rejected | Existing edges still load and patch; missing `source_kind` treated as unknown/legacy |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A manually-authored edge field survives any number of automated propagation runs unchanged.
- **SC-002**: Trusted-maintainer writes still apply, so the guard adds protection without adding friction to legitimate edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Guard over-blocks legitimate maintainer writes | Med - friction / lost edits | REQ-002 trusted-write escape + test |
| Risk | Metadata schema discipline drift across writers | Med | Single server-side derivation point for `source_kind` |
| Risk | Legacy edges lack `source_kind` | Low | REQ-004: treat missing as unknown, never reject |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved: graph edge `source_kind` uses `automated`, `manual`, and `trusted`. Automated propagation derives `automated`; trusted-maintainer writes derive `trusted` through the server write intent.
- Resolved: the MCP propagation handler always passes automated intent. Trusted-maintainer writes stay internal to the server apply API and are not accepted from MCP client payloads.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
