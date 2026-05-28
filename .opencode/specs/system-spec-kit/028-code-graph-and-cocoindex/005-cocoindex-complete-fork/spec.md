---
title: "005 — Complete CocoIndex MCP Fork"
description: "Phase-parent control file for decomposing the complete CocoIndex MCP fork into bootstrap, scripts, tests, docs, attribution, and integration smoke children."
trigger_phrases:
  - "027 phase 001"
  - "cocoindex complete fork"
  - "phase parent"
  - "cocoindex-code v0.2.33 adoption"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Refactored populated Level 3 packet into a six-child phase parent scaffold"
    next_safe_action: "Resume 001-import-upstream"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
      - "001-import-upstream/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-001-phase-parent-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Baseline decision: use the 2026-05-10 v0.2.33 snapshot at external/cocoindex-code-main/; no upstream refresh in this packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 005 — Complete CocoIndex MCP Fork

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | phase-parent |
| **Created** | 2026-05-10 |
| **Updated** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex` |
| **Source Baseline** | `external/cocoindex-code-main/` v0.2.33 snapshot |
| **Downstream Packets** | 007 intent steering, 010 rerank clients, 011 memory context extras |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mcp-coco-index` needs to move from a partial soft fork to a complete, locally controlled fork of the `cocoindex-code` MCP wrapper. The work is too broad for one accurate packet because the import, scripts, tests, docs, attribution, and final smoke validation have distinct file boundaries and handoff points.

### Purpose
This parent tracks the six child packets that together establish the complete fork baseline for later CocoIndex retrieval work.

### Baseline Decision
The baseline is fixed to the 2026-05-10 downloaded upstream v0.2.33 snapshot at `external/cocoindex-code-main/`. This packet does not refresh from upstream; commits after that snapshot belong in a separate sync follow-on packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the six topical children listed in the Phase Documentation Map.
- Keep the fork boundary to the `cocoindex-code` MCP wrapper.
- Preserve the existing spec-kit patch goals: mirror exclusions, canonical resources, chunk identity, path class, dedup, and ranking telemetry.
- Make `001-import-upstream` the foundation for 027 packets 007, 010, and 011.

### Out of Scope
- Editing implementation files in this scaffolding pass.
- Vendoring the transitive `cocoindex` engine dependency.
- Refreshing the upstream snapshot beyond v0.2.33.
- Combining child-level plans or checklists back into this parent.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/**` | Replace/Create | 001 | Complete wrapper fork import and patch overlay |
| `.opencode/skills/mcp-coco-index/scripts/{install,update,doctor}.sh` | Modify | 002 | Local fork lifecycle scripts |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/**` | Create/Modify | 003 | Upstream and spec-kit regression tests |
| `.opencode/skills/mcp-coco-index/{SKILL.md,README.md,INSTALL_GUIDE.md,references/*.md}` | Modify/Create | 004 | Complete-fork user and agent docs |
| `.opencode/skills/mcp-coco-index/{NOTICE,CHANGELOG.md}` and package metadata | Modify | 005 | Attribution and fork identity |
| `opencode.json` and smoke evidence | Modify/Verify | 006 | Final wiring and end-to-end validation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-import-upstream/` | Bootstrap import of the downloaded upstream cocoindex-code v0.2.33 snapshot into the local mcp-coco-index fork root with an import manifest. | draft |
| 2 | `002-scripts/` | Adapt install, update, and doctor scripts for the spec-kit-owned complete fork lifecycle. | draft |
| 3 | `003-tests-port/` | Port upstream tests into the fork test tree and adapt them to spec-kit verification conventions. | draft |
| 4 | `004-docs/` | Author skill, README, install guide, and reference docs for the complete local fork. | draft |
| 5 | `005-attribution/` | Update NOTICE, CHANGELOG, and package metadata for Apache-2.0 upstream plus spec-kit modifications. | draft |
| 6 | `006-integration-smoke/` | Wire the fork into opencode configuration and run final install, CLI, MCP, and recursive validation smoke checks. | draft |

### Parallelization
After `001-import-upstream/` lands, `002-scripts/`, `003-tests-port/`, `004-docs/`, and `005-attribution/` can run in parallel because their write scopes are disjoint. `006-integration-smoke/` closes the work after all five prerequisites validate.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| start | `001-import-upstream/` | Begin from downloaded v0.2.33 snapshot | Import manifest cites `external/cocoindex-code-main/` |
| `001-import-upstream/` | `002-scripts/` | Fork root and import manifest exist | `001-import-upstream` validation exits 0 |
| `001-import-upstream/` | `003-tests-port/` | Source and package layout are present | `001-import-upstream` validation exits 0 |
| `001-import-upstream/` | `004-docs/` | Import manifest and source boundary are known | `001-import-upstream` validation exits 0 |
| `001-import-upstream/` | `005-attribution/` | Upstream license and modification list are available | `001-import-upstream` validation exits 0 |
| `002`-`005` | `006-integration-smoke/` | Scripts, tests, docs, and attribution children validate | All prerequisite child validations exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-PARENT-001 | Maintain a lean phase-parent control folder | Parent contains only `spec.md`, `description.json`, and `graph-metadata.json` plus child folders |
| REQ-PARENT-002 | Preserve the v0.2.33 baseline decision | Parent and `001-import-upstream` docs cite the fixed downloaded snapshot and no-refresh rule |
| REQ-PARENT-003 | Encode dependency topology | Metadata lists child dependencies and `derived.last_active_child_id` is null |
| REQ-PARENT-004 | Support independent validation | Parent and all six child folders pass strict validation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The parent validates as a phase parent.
- **SC-002**: All six child folders exist with scoped packet docs and metadata.
- **SC-003**: Child dependency metadata matches the requested bootstrap, parallel, close pattern.
- **SC-004**: The moved research, resource map, and decision record are preserved under `001-import-upstream/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-import-upstream/` | All implementation children need the imported fork baseline | Make it the only foundation dependency |
| Risk | Parent docs become stale if they duplicate child details | Medium | Keep detailed work inside child packets only |
| Risk | Downstream 007/010/011 start before the fork baseline lands | High | Keep parent metadata related_to links and child handoff criteria explicit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for scaffolding. Child packets may record implementation questions in their own docs.
<!-- /ANCHOR:questions -->
