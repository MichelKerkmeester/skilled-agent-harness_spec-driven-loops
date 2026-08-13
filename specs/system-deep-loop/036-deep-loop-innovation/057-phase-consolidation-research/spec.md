---
title: "Phase Consolidation Research"
description: "Research whether the 036 phase-parent children can be merged into fewer larger multi-phase groups."
---

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Phase Consolidation Research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | 057-phase-consolidation-research |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Research complete |
| **Purpose** | Determine whether the 036 child phases can be grouped into fewer, larger multi-phase parents |
| **Primary evidence** | `research/research.md` and its supporting lineage artifacts |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 036 phase parent had grown to 45 numbered directories on disk: 44 registered children plus this research host. The research asked whether those children could be reorganized into fewer thematic multi-phase groups without merging, deleting, flattening, or internally renumbering existing packet content.

The completed research found that consolidation is feasible and recommended. It selected eight new phase parents, with this research packet remaining a direct child, to reduce the direct-child inventory while preserving every existing child basename and nested structure. The detailed evidence, alternatives, migration surfaces, chronology design, and exact proposed mapping remain in `research/research.md`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Assess whether nested phase parents are supported and useful for the 036 phase tree.
- Inventory the existing direct children, nested phase parents, references, metadata, validation surfaces, and chronology concerns.
- Compare alternative grouping shapes and recommend one topology.
- Produce an exact old-child-to-new-parent mapping and an ordered migration proposal.
- Define how chronological lineage should survive structural moves.

### Out of Scope
- Moving, renaming, deleting, flattening, or otherwise restructuring phase folders during the research run.
- Rewriting historical research evidence or changing packet contents.
- Claiming that migration verification, reference cleanup, indexing, or commit work was completed by this packet.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Evaluate consolidation feasibility from repository evidence | The research identifies the current topology, relevant phase-parent behavior, and constraints that govern nested grouping |
| REQ-002 | Recommend a concrete grouping topology | The result names the selected group parents, assigns every existing child exactly once, and explains the grouping rationale |
| REQ-003 | Preserve existing packet identity and content | The recommendation keeps child basenames and nested packet contents unchanged and treats consolidation as structural grouping only |
| REQ-004 | Identify the complete migration surface | The result covers path-bearing metadata, references, validator manifests, generated descriptions, runtime consumers, and memory/index reconciliation |
| REQ-005 | Preserve chronological lineage | The result defines a timeline record that does not rely on current folder numbering as chronology |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The research gives a supported yes-or-no answer to the consolidation question.
- **SC-002**: Every one of the 44 registered children appears exactly once in the recommended mapping.
- **SC-003**: The selected topology is justified against the considered alternatives.
- **SC-004**: Migration hazards and required verification surfaces are documented without authorizing ungoverned changes.
- **SC-005**: The chronology design preserves stable lineage across path moves.

**Given** the 036 phase tree and its repository contracts, **When** the consolidation options are evaluated, **Then** the recommendation provides a feasible topology and explicit constraints rather than relying on folder-number assumptions.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The research depends on the live 036 phase tree, packet metadata, validation behavior, Git history, and the retained deep-research artifacts. Its main risk is turning a navigation improvement into a high-blast-radius path migration without accounting for generated metadata, hard-coded references, validation manifests, runtime consumers, and memory indexes.

The recommendation mitigates that risk by preserving basenames and nested contents, requiring an exact move map, separating historical evidence from live-path residue, and requiring chronology capture before structural moves. The research itself introduced no runtime or folder-layout change.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

The research report records remaining implementation questions about the final historical-path allowlist and the maintenance of generated current-path projections in the canonical timeline. Those questions do not change the completed feasibility verdict or the selected eight-group recommendation.
<!-- /ANCHOR:questions -->
