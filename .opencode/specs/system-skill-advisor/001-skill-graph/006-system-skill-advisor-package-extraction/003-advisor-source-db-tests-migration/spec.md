---
title: "Feature Specification: Finalize advisor move recalibration"
description: "Finalize the partially completed advisor extraction by rewriting moved packet references, recalibrating bridge imports, adding package configs, updating the DB resolver, and validating the bridge."
trigger_phrases:
  - "advisor move recalibration"
  - "013/009/003 finalize move"
  - "system skill advisor extraction fixup"
  - "advisor bridge imports"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration"
    last_updated_at: "2026-05-14T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Continue 004"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0130090030000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-003-recalibrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Finalize Advisor Move Recalibration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor source tree and this spec packet were moved outside git tracking before this run. The physical source move was already complete, but references still pointed at the old packet lineage and parts of the bridge still imported advisor modules from the deleted source location. The standalone advisor package also needed local TypeScript/Vitest/package metadata and its DB resolver still defaulted to the old Spec Kit database directory.

### Purpose
Finish the partial move safely: rewrite old spec lineage references to the new `006-skill-advisor/002-semantic-routing-lane` nesting, recalibrate bridge imports to the landed `system-skill-advisor/mcp_server` tree, route advisor SQLite ownership to the new package with `SYSTEM_SKILL_ADVISOR_DB_DIR` override support, and leave validation evidence in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite moved spec references from the old `015-skill-advisor-semantic-lane` lineage to the new `006-skill-advisor/002-semantic-routing-lane` lineage.
- Refresh `graph-metadata.json` and `description.json` for the moved `013` tree and add `013` to the `006-skill-advisor` parent graph.
- Repoint bridge imports in `system-spec-kit/mcp_server` to the landed `system-skill-advisor/mcp_server` modules.
- Update package-local advisor DB defaults and add `SYSTEM_SKILL_ADVISOR_DB_DIR`.
- Triage the 16 required TypeScript string-literal old-path references in the moved tree.
- Author `tsconfig.json`, `vitest.config.ts`, and `package.json` under `system-skill-advisor/mcp_server`.
- Replace the package README scaffold with a real tree description.
- Investigate the old DB stub and remove only if present and redundant.

### Out of Scope
- Renaming any public `advisor_*` tool id.
- Runtime config wiring for Codex, Claude, Gemini, or OpenCode.
- Hook wrapper, plugin bridge, Python shim, or doctor:update consumer cutover.
- Recreating the deleted old source directory.
- New git branch, commit, push, checkout, or `git mv`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../006-skill-advisor/002-semantic-routing-lane/**` | Modify | Packet path and metadata recalibration |
| `.opencode/specs/.../006-skill-advisor/graph-metadata.json` | Modify | Add moved `013` child |
| `.opencode/specs/.../005-code-graph/.../graph-metadata.json` | Modify | Rewrite cross references to moved packet |
| `.opencode/skills/system-spec-kit/mcp_server/**` | Modify | Bridge imports, schemas/tool descriptors, config paths |
| `.opencode/skills/system-skill-advisor/**` | Modify | Package docs, DB resolver, moved-tree literals, configs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Old moved spec path rewritten | Required rename sweep returns zero hits for the retired `015` lineage |
| REQ-002 | Moved packet metadata is canonical | `013` graph ids point under `006-skill-advisor/002-semantic-routing-lane`; parent `008` lists the child |
| REQ-003 | Bridge imports resolve | `npm run typecheck` from `system-spec-kit/mcp_server` exits 0 |
| REQ-004 | Advisor DB defaults to the new package | Projection/status use `system-skill-advisor/mcp_server/database/skill-graph.sqlite` absent env override |
| REQ-005 | DB env override exists | `SYSTEM_SKILL_ADVISOR_DB_DIR` routes to `<override>/skill-graph.sqlite` |
| REQ-006 | Required 16 moved-tree literals triaged | 16 rewritten, 0 kept |
| REQ-007 | Local package configs authored | `tsconfig.json`, `vitest.config.ts`, and `package.json` exist |
| REQ-008 | Old DB stub handled | Old stub absent or deleted only after row-count check |
| REQ-009 | Package README reflects landed tree | README describes handlers/lib/tools/schemas/scripts/compat/tests/bench/data/database |
| REQ-010 | Public tool ids stay stable | No `advisor_*` id rename |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Rename sweep for the old moved spec path returns zero hits.
- `npm run typecheck` from `.opencode/skills/system-spec-kit/mcp_server` passes.
- Requested Vitest command is run and failure count is recorded.
- Strict validation is run for `003`, `009`, `013`, and `008`.
- Implementation summary records counts, DB stub finding, and any residual caveat.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Partial outside-git move left stale import paths | Typecheck/runtime failures | Repoint bridge imports and run typecheck |
| Risk | Package-local typecheck now crosses package boundaries | New package script can be stricter than bridge gate | Keep required bridge typecheck as completion gate; document package-local caveat if it remains |
| Risk | Old DB stub may contain unique data | Data loss if deleted blindly | Compare row counts before deletion; block if unique |
| Dependency | ADR-001 | Keeps `advisor_*` ids stable | No id rename in this packet |
| Dependency | Child 004/005 | Launcher and consumer cutover happen later | Do not modify runtime configs or hooks here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Reliability**: Bridge imports must resolve without recreating the deleted old source directory.
- **Maintainability**: Metadata should use canonical path-relative `specFolder`, `packet_id`, and `parentChain` values.
- **Safety**: DB deletion is allowed only for the old redundant stub; no other packet deletion is permitted.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Old source directory is absent: do not recreate it; repair import consumers instead.
- Old DB stub is absent: record the finding and skip deletion.
- Requested Vitest filter finds no files after the move: record command output and do not create an old-path alias.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Metadata, bridge code, configs, package docs |
| Risk | 15/25 | Import and validation fallout from out-of-git moves |
| Research | 5/20 | Existing ADR and dispatch constrain the work |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should child 004 change the standalone package `rootDir` contract, or should shared Spec Kit imports be replaced by a dedicated shared package dependency?
<!-- /ANCHOR:questions -->
