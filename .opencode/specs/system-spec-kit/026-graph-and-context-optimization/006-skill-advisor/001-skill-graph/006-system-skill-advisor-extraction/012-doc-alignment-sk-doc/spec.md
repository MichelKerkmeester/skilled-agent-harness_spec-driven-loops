---
title: "Feature Specification: Advisor doc alignment with sk-doc"
description: "Level 2 packet for aligning system-skill-advisor docs, feature catalog, playbook, references, READMEs, architecture, and root README with sk-doc."
trigger_phrases:
  - "013/009/012"
  - "doc alignment sk-doc"
  - "system-skill-advisor docs"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/012-doc-alignment-sk-doc"
    last_updated_at: "2026-05-14T18:45:00Z"
    last_updated_by: "codex"
    recent_action: "Advisor docs aligned with sk-doc"
    next_safe_action: "Commit scoped documentation changes only"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: Advisor doc alignment with sk-doc

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

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
| **Spec Folder** | `012-doc-alignment-sk-doc` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `system-skill-advisor` package had grown through extraction packets. Its docs still mixed early extraction language, stale root README paths, old four-tool advisor claims, old scorer weight values, and inconsistent regression-count wording.

### Purpose

Bring the advisor documentation tree to `sk-doc` quality while keeping the pass documentation-only. The package should now describe the standalone `system_skill_advisor` server, eight public advisor/skill-graph tools, package-local database ownership, and the pending packet-011 `lib/skill-graph/` library boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Skill-root docs: `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `SET-UP_GUIDE.md`, and `ARCHITECTURE.md`.
- Advisor `feature_catalog/**/*.md`.
- Advisor `manual_testing_playbook/**/*.md`.
- Advisor `references/**/*.md`.
- Advisor tree `README.md` files that existed in the 012-owned docs set.
- Repository root `README.md` advisor section and related FAQ entry.
- Packet 012 Level 2 docs and metadata.

### Out of Scope

- Source code changes.
- Runtime config changes such as `opencode.json`.
- Packet siblings `001` through `011`.
- Parallel staged packet-011 `mcp_server/lib/skill-graph/` source additions.
- Renaming tool ids, server ids, skill ids, or package paths.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/**/*.md` | Modify | Apply role-specific sk-doc alignment across existing docs. |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Rewrite | Align with current-reality architecture flow. |
| `README.md` | Modify | Update public advisor section to standalone server and eight-tool state. |
| `012-doc-alignment-sk-doc/*` | Create | Level 2 packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Packet 012 has Level 2 docs and metadata. | Strict spec validation exits 0. |
| REQ-002 | Advisor docs are aligned with sk-doc role templates. | Template traces and anchors are present across the scoped docs. |
| REQ-003 | Root README reflects post-013/009 advisor state. | README names `system_skill_advisor`, eight tools, and pending packet-011 library boundary. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `ARCHITECTURE.md` follows current-reality structure. | Sections cover overview, boundaries, components, data flow, DB, MCP surface, extension points, testing, and future work. |
| REQ-005 | Stale doc claims are corrected or flagged. | Old advisor path/tool count, old lane weights, and fixed regression-pass counts are removed from scoped docs. |
| REQ-006 | Scope stays doc-only. | Commit pathspec excludes `.ts`, `.js`, `.py`, database launcher JSON, and packet-011 source additions. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 120 advisor Markdown docs and the public root README are aligned.
- **SC-002**: `ARCHITECTURE.md` is rewritten around the current eight-tool standalone MCP surface.
- **SC-003**: Anchor balance and frontmatter/template trace checks pass for the scoped docs.
- **SC-004**: Strict packet validation passes.
- **SC-005**: Commit contains only scoped docs and packet files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parallel packet-011 files in advisor tree | Could accidentally commit source changes. | Use explicit commit pathspec excluding `mcp_server/lib/skill-graph/` and source extensions. |
| Risk | Template pass could add noisy structure | Docs become harder to scan. | Use reduced sk-doc subsets and spot-check representative files. |
| Dependency | Current source truth for tool count and lane weights | Docs could remain stale. | Verify against `mcp_server/tools/index.ts`, `skill-graph-tools.ts`, and `lane-registry.ts`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Docs should state current behavior, not extraction history.
- **NFR-M02**: Template markers and anchors should support future automated doc checks.

### Reliability

- **NFR-R01**: Public docs should not claim fixed pass totals for a regression harness whose current output is data-dependent.
- **NFR-R02**: Architecture docs must identify the transitional `lib/skill-graph/` boundary until packet 011 completes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Parallel Worktree State

- Pre-staged packet-011 source files under `mcp_server/lib/skill-graph/` are visible in the tree but are not owned by packet 012.
- `opencode.json` contains a stale tool-count note but runtime config edits are outside this packet.

### Template Fit

- Very small README files use reduced `skill_readme` subsets.
- Feature catalog entries use a reduced `skill_asset` shape rather than full template expansion.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 120 advisor docs plus root README and packet docs. |
| Risk | 10/25 | Doc-only, but parallel staged source files require careful commit scoping. |
| Research | 10/20 | Required sk-doc templates, source truth, and sibling metadata reads. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None for packet 012. Packet 011 owns the final `lib/skill-graph/` library-location cleanup.
<!-- /ANCHOR:questions -->
