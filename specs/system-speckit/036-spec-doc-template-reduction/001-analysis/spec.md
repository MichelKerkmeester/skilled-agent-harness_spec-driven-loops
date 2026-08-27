---
title: "Feature Specification: Phase 1: analysis"
description: "Research-backed specification for reducing spec-kit template duplication, instructional comment leakage, redundant continuity metadata, and repeated acceptance-criteria guidance while preserving renderer and validator contracts."
trigger_phrases:
  - "spec-kit template reduction"
  - "template optimization"
  - "tasks checklist merge"
  - "continuity single source"
  - "small-model legibility"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "036-spec-doc-template-reduction/001-analysis"
    last_updated_at: "2026-08-26T05:33:56Z"
    last_updated_by: "design-author"
    recent_action: "Authored the analysis specification from research recommendations R1 through R6"
    next_safe_action: "Implement the sequenced child phases with their required contract updates"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/manifest/"
      - ".opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-036-001-analysis"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a full context save rewrite continuity blocks in multiple documents or only implementation-summary?"
      - "What exact byte totals does the real renderer produce after comment extraction?"
    answered_questions:
      - "Which template waste classes are actionable? Duplication, instructional comments, redundant continuity blocks, and repeated acceptance-criteria guidance."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: analysis

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-tasks-checklist-merge |
| **Handoff Criteria** | R1 through R6 have implementation-ready child scopes, named contract surfaces, and objective verification gates. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Reduce and optimize spec-kit document templates work. It converts the Workstream A research into an implementation contract for six sequenced recommendations. Workstream B, constitutional memory deprecation, remains outside this phase.

**Scope Boundary**: Template duplication, instructional comment leakage, continuity metadata duplication, acceptance-criteria restatement, research-template taxonomy, and measured byte budgets. This phase defines the work and its gates; child phases perform implementation.

**Dependencies**:
- The renderer supports inline level gates only and does not support cross-file includes.
- Anchors, frontmatter, required documents, content-router mappings, and golden snapshots are versioned contracts.
- Existing L2 and later packets need a legacy read path when documents merge or continuity blocks move.

**Deliverables**:
- A research-backed scope covering recommendations R1 through R6.
- Sequential requirements with acceptance criteria tied to the measured findings.
- An implementation sequence that orders low-risk byte-preserving changes before validator and document-shape changes.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 13 spec-kit manifest templates contain measured duplication and context waste. The checklist level bodies repeat about 505 lines, instructional HTML comments account for about 8,299 rendered bytes or 15.5% of an L2 packet, and continuity metadata repeats across five documents even though the resume ladder reads implementation-summary.md. The decision-record body is already shared across L3 and L3+; its remaining issue is duplicated frontmatter and a malformed L3+ description. The tasks and checklist merge also crosses five validator surfaces and must preserve legacy reads.

### Purpose
Define an implementation-ready, research-backed reduction plan that removes avoidable template and rendered-byte waste while preserving anchors, frontmatter contracts, content routing, status derivation, validation behavior, and existing packet compatibility.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Deduplicate checklist source structure and correct decision-record frontmatter without changing the shared ADR body.
- R2: Move instructional HTML comments into authoring sidecars and preserve load-bearing markers.
- R3: Merge tasks and checklist content while retaining legacy checklist reads, level gates, anchors, priority tags, and acceptance-criteria coverage.
- R4: Make implementation-summary.md the canonical continuity source after validator expectations are relaxed.
- R5: Decide whether to neutralize the research template taxonomy while preserving content-router anchors, or record a justified deferral.
- R6: Add percentage-based byte-budget assertions derived from measured example baselines.

### Out of Scope
- Workstream B constitutional memory deprecation, which has a separate owner and lineage.
- Changes to the inline-gate renderer or removal of SPECKIT_LEVEL and SPECKIT_TEMPLATE_SOURCE markers.
- Removing or renaming content-router anchors without a separately versioned contract decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl | Modify | Remove measured duplicate checklist body lines while preserving rendered output. |
| .opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl | Modify | Correct duplicated frontmatter and the malformed L3+ description while preserving the shared ADR body. |
| .opencode/skills/system-spec-kit/templates/manifest/guidance/ | Create | Store instructional authoring guidance outside scaffolded documents. |
| .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json | Modify | Define the merged tasks and checklist document contract. |
| .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts | Modify | Preserve legacy checklist status reads during the merge. |
| .opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts | Modify | Relax continuity validation before template consolidation. |
| .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts | Modify | Verify byte-preserving changes and percentage-based budgets. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | R1: Remove measured template duplication safely | Given the checklist and decision-record templates, checklist duplication is reduced with byte-identical renders, the ADR body remains one shared block, and only the intended decision-record frontmatter correction and L3+ description fix change output. |
| REQ-002 | R2: Remove instructional comment leakage | Given fresh scaffold renders and the guidance sidecars, SELF-CHECK, failure-mode, voice-guide, and footer comments no longer appear in rendered documents, while load-bearing markers remain and the reviewed snapshot diff contains only intended removals. |
| REQ-003 | R3: Merge tasks and checklist without breaking consumers | Given new and shipped L2+ packets, the merged document retains notation, phase, completion, verification, and CHK anchors at the required levels, priority tags and acceptance-criteria coverage still resolve, and legacy standalone checklist files still support status derivation. |
| REQ-004 | R4: Consolidate continuity on implementation-summary.md | Given validators, the resume ladder, status derivation, freshness checks, and representative shipped packets, validator expectations are relaxed first, implementation-summary remains canonical, and no fleet-wide regression appears. |
| REQ-005 | R5: Handle research-template taxonomy without breaking routing | Given the research template and content-router mappings, the phase either preserves the required research_finding anchor set while neutralizing domain-specific taxonomy or records an explicit deferral with its coupling rationale. |
| REQ-006 | R6: Use achievable byte budgets | Given the measured example baselines of 4,280 B for the Level 1 spec, 3,365 B for the Level 1 implementation summary, and 6,627 B for the Level 2 spec, the real rendered outputs target no more than 90% of each baseline, with integer upper limits of 3,852 B, 3,028 B, and 5,964 B. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recommendations R1 through R6 map to REQ-001 through REQ-006 with no placeholder or phantom requirement IDs.
- **SC-002**: The implementation sequence is R1, R6, R2, R3, R4, then R5, with each versioned contract update identified before implementation.
- **SC-003**: The reduction preserves renderer markers, content-router anchors, legacy packet reads, and validator behavior at the boundaries named by the requirements.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Merge omits a legacy checklist read path | High, shipped L2+ status can change | Keep the legacy checklist branch in status derivation and verify representative packets. |
| Risk | Continuity templates change before validators | High, strict validation can fail across the fleet | Relax validator expectations and run the fleet sweep before removing copies. |
| Risk | Research anchor changes break content routing | Medium-High, research findings can route incorrectly | Preserve the anchor set or defer taxonomy neutralization behind a dedicated decision. |
| Risk | Budget targets use simulated rather than real output | Medium, assertions can reject valid documents or miss regressions | Recompute rendered bytes with the committed renderer and compare them with the measured baselines. |
| Dependency | Golden snapshots and both distribution trees | Blocks verification | Update versioned surfaces together and inspect the full snapshot delta. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does a full context save rewrite continuity blocks across multiple documents or only implementation-summary.md?
- What exact rendered-byte totals does the committed renderer produce after instructional comments move to sidecars?
- Can research taxonomy neutralization preserve all content-router behavior without changing the anchor contract?
<!-- /ANCHOR:questions -->

---
