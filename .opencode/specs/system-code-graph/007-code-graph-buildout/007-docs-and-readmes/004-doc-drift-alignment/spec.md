---
title: "system-code-graph doc-drift alignment (tool count, topology, version, continuity)"
description: "Reconcile four doc-drift issues across system-code-graph: tool count (10/11/12 → 11), graph-metadata topology (co-resident → standalone), SKILL.md _memory.continuity staleness, and version string drift (1.0.0.0 → 1.0.3.1)."
trigger_phrases:
  - "028 spec"
  - "system-code-graph doc drift"
  - "mk-code-index tool count drift"
  - "graph-metadata topology"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/007-docs-and-readmes/004-doc-drift-alignment"
    last_updated_at: "2026-05-16T09:01:20Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded 028 packet for system-code-graph doc-drift alignment"
    next_safe_action: "Execute tasks.md Phase 2"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-code-graph/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000028"
      session_id: "028-scaffold"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Tool count source-of-truth? tool-schemas.ts (currently 11)"
      - "Version strategy? doc-only bump 1.0.0.0 → 1.0.3.1 to track with newest changelog v1.0.3.0"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# system-code-graph Doc-Drift Alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/005-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Authored docs under `.opencode/skills/system-code-graph/` disagree with the live runtime on four points: (1) tool count is claimed as `10` in 6 places and `12` in `graph-metadata.json`, but `mcp_server/tool-schemas.ts` registers 11; (2) `graph-metadata.json` still declares `mcp_server_topology: "co-resident"` with host `mk-spec-memory`, but `mcp_server/index.ts:28` runs the standalone `mk-code-index` server (per ADR-001 / packet 014 extraction and v1.0.3.0 three-way isolation finalize); (3) `SKILL.md._memory.continuity` was last updated 2026-05-14 and predates v1.0.3.0 work; (4) `version: 1.0.0.0` in SKILL.md frontmatter and README key-stats no longer matches the newest changelog `v1.0.3.0.md`.

### Purpose
Land a single doc-only packet that aligns all four surfaces with the runtime source-of-truth and refreshes the continuity pointer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update tool count from `10`/`12` to `11` in all authored docs, citing `tool-schemas.ts` as source-of-truth.
- Update `graph-metadata.json` topology to `standalone`; remove or update `mcp_server_host`; rewrite `derived.causal_summary` to drop "12 MCP tools" + "co-resident".
- Refresh `SKILL.md._memory.continuity` block to point at packet 020.
- Bump SKILL.md frontmatter `version` and README "Skill version" row from `1.0.0.0` to `1.0.3.1`.

### Out of Scope
- Any source-code changes under `mcp_server/`. This is doc-only.
- INSTALL_GUIDE.md `_NOTE_2_TOOLS` content beyond the literal `10 tools` → `11 tools` reconciliation and adding `code_graph_classify_query_intent` to the tool enumeration.
- Renaming `mcp_server_topology` schema or migrating other packets' `graph-metadata.json` files.
- Bumping `package.json` version (runtime package version stays at `1.0.0` — only skill doc-version is touched).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modify | Frontmatter `version` 1.0.0.0 → 1.0.3.1; `_memory.continuity` refresh |
| `.opencode/skills/system-code-graph/README.md` | Modify | Key-stats `Active MCP tools` 10 → 11; `Skill version` 1.0.0.0 → 1.0.3.1 |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modify | §3 "Tool surface (10 tools)" → 11; §3 add classify row; §8 "All 10 tools" → 11; §9 "10 tools" → 11 |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modify | Lines 111 + 133 `_NOTE_2_TOOLS` "Registers 10 tools" → 11; add `classify_query_intent` to enumeration |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modify | Line 38 "17 features map to 10 MCP tools" → 11 MCP tools |
| `.opencode/skills/system-code-graph/graph-metadata.json` | Modify | `mcp_server_topology: standalone`; `mcp_server_host` removed; `derived.causal_summary` rewritten; `derived.last_updated_at` bumped |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tool count reconciled to 11 across all authored docs | `grep -nE "10 (tools\|MCP tools)\|12 MCP tools" .opencode/skills/system-code-graph/**/*.md graph-metadata.json` returns no hits in scope files |
| REQ-002 | `graph-metadata.json` reflects standalone topology | `mcp_server_topology == "standalone"`; `mcp_server_host` absent or `null`; `causal_summary` no longer says "12 MCP tools" or "co-resident" |
| REQ-003 | `SKILL.md._memory.continuity` refreshed | `packet_pointer == "system-spec-kit/026-graph-and-context-optimization/005-code-graph/020-doc-drift-alignment"`; `last_updated_at` ≥ 2026-05-16 |
| REQ-004 | Version aligned to 1.0.3.1 | SKILL.md frontmatter `version: 1.0.3.1`; README "Skill version" row shows `1.0.3.1` |
| REQ-005 | Packet strict-validate passes | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/020-doc-drift-alignment --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Tool count claims across SKILL.md/README/ARCHITECTURE/INSTALL_GUIDE/feature_catalog/graph-metadata.json agree on `11` and match `tool-schemas.ts` enumeration.
- **SC-002**: `graph-metadata.json` no longer asserts the pre-extraction co-resident topology.
- **SC-003**: Continuity pointer reflects this packet on next `/spec_kit:resume` invocation.
- **SC-004**: Strict validate exits 0 for the packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hidden tool-count hits outside grepped surfaces (e.g. comments inside `.ts`) | Low | Doc-only scope; runtime authoritative source is `tool-schemas.ts`, which is already correct |
| Risk | `mcp_server_topology` schema enum doesn't accept `standalone` | Low | Field is free-form in current graph-metadata.json files (no schema enforcement seen); verify by inspecting other recent packets |
| Dependency | `tool-schemas.ts` enumeration remains source-of-truth | Met | Schema file lists 11 tools verbatim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Tool-count, topology, continuity, and version strategy all resolved at scaffold time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Prior skill doc-alignment packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/025-skill-docs-sk-doc-alignment/`
- **Three-way isolation finalize (v1.0.3.0)**: `.opencode/skills/system-code-graph/changelog/v1.0.3.0.md`
- **Source-of-truth tool schema**: `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts`
<!-- /ANCHOR:related-docs -->
