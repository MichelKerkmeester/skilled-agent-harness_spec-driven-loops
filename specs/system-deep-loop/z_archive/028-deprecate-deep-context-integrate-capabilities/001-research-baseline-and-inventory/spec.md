---
title: "Feature Specification: Research Baseline And Inventory"
description: "Phase 001 owns the completed deep-research evidence, the active-reference inventory, and the baseline checks required before standalone deep-context runtime changes begin."
trigger_phrases:
  - "deep-context research baseline"
  - "deep-context active inventory"
  - "context deprecation evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/028-deprecate-deep-context-integrate-capabilities/001-research-baseline-and-inventory"
    last_updated_at: "2026-07-04T18:32:06Z"
    last_updated_by: "opencode"
    recent_action: "Validated phase 001 research baseline and inventory"
    next_safe_action: "Use phase 001 research evidence as historical baseline"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-001-research-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Research completed 10 iterations and converged on staged deprecation."
      - "Completed research evidence belongs in this phase child."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Research Baseline And Inventory

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 001 turns the completed standalone `deep-context` research into durable phase-local evidence and records the live-surface inventory needed before runtime changes. The phase does not deprecate `/deep:context`; it defines the evidence boundary and handoff conditions for later phases.

**Key Decisions**: research evidence lives in phase 001; runtime changes wait for phase 002; historical references stay unchanged unless they are active fixtures or index inputs.

**Critical Dependencies**: direct grep/glob inventory, completed `research/research.md`, append-only `research/deep-research-state.jsonl`, and parent phase-map consistency.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Validated |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | `../002-public-redirect-and-replacement-contracts/spec.md` |
| **Handoff Criteria** | Research evidence is anchored, active-reference classes are recorded, and validation passes for this child. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Standalone `deep-context` has many active and historical references. Without a phase-local research baseline, later removal work risks treating historical specs as live surfaces or deleting unique context-report capabilities before `deep-research` and `deep-review` replacement paths exist.

### Purpose

Preserve the 10-iteration research synthesis, classify active surface types, and establish the baseline evidence that later phases must satisfy before changing commands, agents, registry, advisor, docs, fixtures, or runtime branches.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Preserve completed research artifacts under `research/` in this child phase.
- Keep the final synthesis at `research/research.md` as the evidence source for phases 002-004.
- Classify active references by surface class: command/router, YAML assets, compiled contracts, registry, advisor, agents, docs, fixtures, benchmarks, nested skill packet, runtime branch, historical archive, and false positive.
- Capture baseline probes for advisor routing, grep inventories, and command/runtime tests before implementation edits begin.
- Confirm `.codex/agents/deep-context*` is absent in this workspace unless a later inventory proves otherwise.

### Out of Scope

- Editing `/deep:context`, `deep-research`, `deep-review`, registry, advisor, README, agents, fixtures, or runtime code.
- Deleting the nested `deep-context` packet.
- Rewriting historical specs for cosmetic cleanup.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Move/preserve | Completed deep-research artifacts now live under phase 001. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` | Modify | Phase 001 owns the research and inventory contract. |
| `../spec.md` | Reference only | Parent phase map points to this phase. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve completed research evidence. | `research/research.md`, iterations 001-010, state log, dashboard, and registries exist under this phase folder. |
| REQ-002 | Keep runtime changes out of this phase. | No command, agent, registry, advisor, or runtime file is modified by phase 001. |
| REQ-003 | Classify active standalone surfaces. | Phase docs name the active surface classes and distinguish historical/archive records from live inputs. |
| REQ-004 | Establish handoff evidence for phase 002. | Baseline inventory/probe status is recorded as passed, pending, or unavailable before phase 002 implementation starts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Confirm mirror boundary. | OpenCode and Claude mirrors are active; `.codex/agents/deep-context*` is absent unless later inventory changes this. |
| REQ-006 | Keep research claims citable. | Final synthesis references iteration files and states memory/graph limitations honestly. |
| REQ-007 | Refresh phase metadata. | `description.json` and `graph-metadata.json` describe this phase after conversion. |
| REQ-008 | Preserve packet-local lineage. | Continuity frontmatter validates without stale external parent-session references. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Completed research artifacts are phase-local and referenced by this phase's docs.
- **SC-002**: Parent `spec.md` maps phase 001 as active and points later phases to this evidence base.
- **SC-003**: Phase 001 docs contain no placeholders and validate under strict SpecKit checks.
- **SC-004**: Later phases can start from a known inventory without rerunning the research loop.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `research/deep-research-state.jsonl` | Lost state would weaken research provenance. | Preserve the moved file and cite it from the synthesis. |
| Dependency | Grep/glob inventory | Stale inventory can miss newly added references. | Re-run inventory before phase 002 edits. |
| Risk | Historical references treated as live work | Scope expands into archived specs. | Keep historical specs out of scope unless active fixture/index input status is proven. |
| Risk | Code graph staleness | Structural graph claims may be stale. | Trust direct file reads and grep until code graph is refreshed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Inventory checks should use targeted grep/glob scans and avoid broad graph claims while code graph freshness is stale.

### Security
- **NFR-S01**: Research artifacts and metadata must not introduce secrets or environment values.

### Reliability
- **NFR-R01**: Phase 001 must not claim runtime deprecation; it only preserves evidence and baseline state.

---

## 8. EDGE CASES

### Historical Mentions
- Historical specs, archived changelog notes, and retired skill references may still mention `deep-context`; phase 001 records them as history unless they drive active tests or generated indexes.

### Missing Memory Daemon
- The research run recorded Spec Memory warm retrieval as unavailable at initialization. The final synthesis is therefore grounded in repository evidence and packet-local artifacts.

### Generated Metadata
- Metadata files can be stale after moving research. Refresh them after documentation changes and before validation closure.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Research artifacts, inventory classes, parent/child metadata. |
| Risk | 10/25 | Documentation-only but gates later public deprecation. |
| Research | 18/20 | Completed 10-iteration synthesis. |
| Multi-Agent | 6/15 | Research iterations were multi-pass but implementation is sequential. |
| Coordination | 10/15 | Handoff into phases 002-004. |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Research evidence remains at parent and violates phase-parent discipline. | Medium | Low | Move research into this child phase. |
| R-002 | Later phases skip inventory refresh and act on stale counts. | High | Medium | Keep phase 002 start gate tied to fresh grep inventory. |
| R-003 | Runtime work starts before evidence is stable. | High | Low | Keep phase 001 scope documentation-only. |

---

## 11. USER STORIES

### US-001: Evidence-Preserving Maintainer Handoff (Priority: P0)

**As a** maintainer resuming this packet, **I want** the research synthesis and iteration evidence in one phase folder, **so that** I can start implementation without reconstructing prior findings.

**Acceptance Criteria**:
1. Given phase 001 is opened, When the maintainer reads `research/research.md`, Then the synthesis names active surfaces, implementation order, verification matrix, and residual gaps.
2. Given the parent phase map is read, When phase 001 is selected, Then it points to the child folder that owns the research evidence.

---

### US-002: Safe Implementation Start (Priority: P1)

**As an** implementer starting phase 002, **I want** active versus historical references separated, **so that** public redirect work does not rewrite old records or delete needed fixtures blindly.

**Acceptance Criteria**:
1. Given implementation begins, When inventory is rerun, Then each hit can be classified against the phase 001 surface classes.
2. Given a historical spec mentions `deep-context`, When it is not an active fixture or index input, Then it remains unchanged.

---

## 12. OPEN QUESTIONS

- None blocking. Baseline probe outputs still need to be captured immediately before phase 002 edits.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research synthesis**: `research/research.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
