---
title: "Feature Specification: Install Guide Alignment [005-install-guide-alignment/spec]"
description: "Four INSTALL_GUIDE.md files across the OpenCode skill system are outdated after specs 136 (Working Memory + Hybrid RAG), 138 (Hybrid RAG Fusion + Skill Graph + Unified Graph Int..."
trigger_phrases:
  - "feature"
  - "specification"
  - "install"
  - "guide"
  - "alignment"
  - "spec"
  - "005"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Install Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-20 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `004-command-alignment` |
| **Successor** | `006-skill-graph-utilization` |
| **Parent Plan** | `../plan.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four INSTALL_GUIDE.md files across the OpenCode skill system are outdated after specs 136 (Working Memory + Hybrid RAG), 138 (Hybrid RAG Fusion + Skill Graph + Unified Graph Intelligence), and 139 (Phase System). None of the guides mention HVR compliance, skill graph awareness, or the new feature flags. Format inconsistencies exist across all four guides (missing version numbers, inconsistent TOC placement, broken cross-references).

### Purpose
All four install guides are rewritten to match the latest `install_guide_template.md` structure, comply with HVR rules, document new features from specs 136/138/139, and maintain cross-guide consistency.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite Spec Kit Memory MCP INSTALL_GUIDE.md with new feature flags, skill graph system, graph enrichment
- Rewrite Chrome DevTools INSTALL_GUIDE.md with HVR compliance, fix broken cross-reference
- Rewrite Code Mode INSTALL_GUIDE.md with HVR compliance, add version number
- Rewrite Figma MCP INSTALL_GUIDE.md with HVR compliance, fix outdated cross-references
- Cross-guide consistency: uniform TOC placement, version numbering, validation checkpoint naming, Quick Reference sections

### Out of Scope
- Creating new install guides for other tools
- Modifying any MCP server code or configs
- Phase 4 deferred items (PageRank wiring, structure-aware chunker wiring)
- Functional testing of install procedures

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modify | Major update: new feature flags, skill graph, graph enrichment, HVR rewrite |
| `.opencode/skill/mcp-chrome-devtools/INSTALL_GUIDE.md` | Modify | HVR rewrite, fix broken Code Mode cross-reference link |
| `.opencode/skill/mcp-code-mode/INSTALL_GUIDE.md` | Modify | HVR rewrite, add version number, template alignment |
| `.opencode/skill/mcp-figma/INSTALL_GUIDE.md` | Modify | HVR rewrite, fix outdated cross-references, template alignment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 install guides rewritten with HVR compliance | Zero HVR hard-blocker words, no em dashes, no semicolons, active voice throughout |
| REQ-002 | Template structure alignment (11 sections, 0-10) | Each guide has sections 0-10 per install_guide_template.md |
| REQ-003 | Spec Kit Memory guide includes new feature flags | `SPECKIT_GRAPH_UNIFIED`, `SPECKIT_GRAPH_MMR`, `SPECKIT_GRAPH_AUTHORITY` documented |
| REQ-004 | Cross-references valid | No broken links between guides |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Phase validation checkpoints consistent | All guides use `phase_N_complete` naming pattern |
| REQ-006 | Version numbers on all guides | Each guide has a version number in metadata |
| REQ-007 | Skill graph awareness documented | Spec Kit Memory guide covers 72-node skill graph integration |
| REQ-008 | Quick Reference section in all guides | Bottom-of-file quick reference card |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 INSTALL_GUIDE.md files pass HVR scoring (no hard-blocker words, score > 80)
- **SC-002**: All guides follow the 11-section template structure (sections 0 through 10)
- **SC-003**: Cross-guide format consistency verified (TOC, checkpoints, version numbers)
- **SC-004**: Spec Kit Memory guide documents all new features from specs 136/138/139
<!-- /ANCHOR:success-criteria -->

---

---

## Acceptance Scenarios

1. All install guides follow the shared section template.
2. HVR compliance checks pass across rewritten guide content.
3. Cross-guide links and version blocks are valid.
4. Feature-flag and graph-related install instructions are synchronized.

## Risks and Dependencies

- Dependency: guide template and HVR rules remain stable during edits.
- Risk: cross-guide drift if one guide updates without synchronized changes.
- Mitigation: enforce checklist-based consistency validation.

## Non-Functional Requirements

- Keep guide structure readable and consistent across all skill install docs.
- Preserve command examples and validation checkpoints in each guide.

## Acceptance Scenario Details

- **Given** install guides, **When** section checks run, **Then** template numbering is consistent.
- **Given** HVR constraints, **When** language checks run, **Then** banned phrasing is absent.
- **Given** version blocks, **When** guide consistency is reviewed, **Then** each guide has current metadata.
- **Given** cross-links, **When** validation runs, **Then** links resolve correctly.
