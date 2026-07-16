---
title: "Spec: Research Synthesis and Remediation Map"
description: "The two source packets identify overlapping process, sidecar, daemon, lock, and host-memory hazards. Without one normalized backlog, implementation packets can duplicate work or fix symptoms before ownership and telemetry are clear."
trigger_phrases:
  - "research-synthesis-and-remediation-map"
  - "memory leak 1"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map"
    last_updated_at: "2026-05-22T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed the consolidated remediation map and source evidence index."
    next_safe_action: "Start 002-telemetry-and-process-verification-harness."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "checklist.md"
      - "decision-record.md"
      - "resource-map.md"
      - "research/remediation-map.md"
      - "research/source-evidence-index.md"
    session_dedup:
      fingerprint: "sha256:0101010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from relocated 020 and 024 source research under the parent arc."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Spec: Research Synthesis and Remediation Map

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 001 is the Level 3 evidence-control packet for the memory leak remediation arc. It preserves the full original packet 020 and 024 research archives under `research/source-research/`, records the consolidated remediation map, and prepares phase 002 to build the telemetry and process verification harness before any runtime cleanup fixes begin.

**Key Decisions**: keep one canonical phase-local source archive, delete old source packet folders only after validation, and require harness evidence before memory or cleanup claims.

**Critical Dependencies**: recovered research artifacts, packet root docs under `packet-docs/`, strict Spec Kit validation, and phase 002 telemetry harness.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-05-22 |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 10 |
| **Predecessor** | None |
| **Successor** | 002-telemetry-and-process-verification-harness |
| **Handoff Criteria** | Strict spec validation plus manual evidence-link spot checks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is phase 1 of the memory leak remediation arc. It is scoped from source evidence in `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research` and `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`.

**Scope Boundary**: Produce one authoritative remediation map from the system-spec-kit and code-index memory-leak research packets.

**Dependencies**:
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research`
- `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`

**Deliverables**:
- Normalize findings from packets 020 and 024 into one matrix
- Deduplicate overlapping recommendations and set severity/order
- Record source evidence links and unresolved verification gaps

**Changelog**:
- When this phase closes, refresh the parent arc status and note validation evidence in the phase implementation summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two source packets identify overlapping process, sidecar, daemon, lock, and host-memory hazards. Without one normalized backlog, implementation packets can duplicate work or fix symptoms before ownership and telemetry are clear.

### Purpose
Produce one authoritative remediation map from the system-spec-kit and code-index memory-leak research packets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Normalize findings from packets 020 and 024 into one matrix
- Deduplicate overlapping recommendations and set severity/order
- Record source evidence links and unresolved verification gaps

### Out of Scope
- Runtime code changes
- Process termination or cleanup commands

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/remediation-map.md` | Created | Consolidated remediation matrix, dependencies, and verification gates. |
| `research/source-evidence-index.md` | Created | Relocated source research inventory and citation rules. |
| `research/source-research/020-cli-process-memory-leak-deep-research/` | Created | Full original 020 research archive plus packet docs. |
| `research/source-research/024-cli-deep-research-memory-leak-audit/` | Created | Full original 024 research archive plus packet docs. |
| `checklist.md` | Created | Level 3 verification checklist for the archive and synthesis. |
| `decision-record.md` | Created | ADRs covering consolidation, deletion, and next-phase sequencing. |
| `resource-map.md` | Created | File ledger for phase 001 and recovered source archives. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create a normalized finding matrix covering both source packets | `research/remediation-map.md` maps 020 and 024 findings to normalized work items, dependencies, target phases, and verification gates. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Name the first implementation packet and its blocking dependencies | The map identifies phase 002 as the next enabling harness phase and names `remove-project-cancel-safety` as the first CocoIndex code fix after harness readiness. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation plus manual evidence-link spot checks passed.
- **SC-002**: This phase updates the parent remediation map and implementation summary with evidence and next-phase handoff notes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Source research packets | Missing evidence can cause duplicate or misordered fixes. | Keep source links in every phase summary. |
| Risk | Cleanup work kills an expected warm daemon | Can interrupt unrelated user workflows. | Require inventory, exact identity, and dry-run proof before destructive cleanup. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NFR-001 | Preserve source provenance | Original packet slugs, research trees, and packet root docs remain available under `research/source-research/`. |
| NFR-002 | Avoid false memory claims | Phase 001 makes no resident-memory relief claim and defers telemetry to phase 002. |
| NFR-003 | Keep deletion reversible | Old packet root docs are preserved under each archive's `packet-docs/`. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

| Edge Case | Expected Handling |
|-----------|-------------------|
| Old packet path is requested after deletion | Use the archive under `research/source-research/<packet-slug>/`. |
| Later phase needs original packet metadata | Read `packet-docs/` for the corresponding source packet. |
| Internal research citation still names the old runtime path | Treat it as historical artifact text; cite the phase-local archive path in new docs. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:risk-matrix -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Two source research packets, source archive recovery, and 10 downstream phases. |
| Risk | 20/25 | Deleting historical packet folders requires complete evidence preservation. |
| Research | 20/20 | The phase consolidates 25 total deep-research iterations. |
| Multi-Agent | 10/15 | Original research used multiple CLI executor families. |
| Coordination | 12/15 | Parent graph metadata, archive paths, and phase handoff must stay aligned. |
| **Total** | **82/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing research artifact after deletion | Low | High | Validate iteration/delta counts and preserve packet docs before deletion. |
| Duplicate evidence source causes drift | Medium | Medium | Use phase 001 archive as canonical and remove old packet directories. |
| Runtime cleanup begins before telemetry | Medium | High | Keep phase 002 as required next phase. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

| ID | As a... | I want... | So that... |
|----|---------|-----------|------------|
| US-001 | Operator | all original memory-leak research in one phase-local archive | I can delete obsolete source packets without losing evidence. |
| US-002 | Implementer | a single remediation map with dependencies | I can start fixes in a safe order. |
| US-003 | Reviewer | Level 3 docs and validation evidence | I can verify deletion and handoff safety. |
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None at scaffold time; phase-specific questions must be recorded in this section before implementation begins.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `research/remediation-map.md`
- `research/source-evidence-index.md`
- `checklist.md`
- `decision-record.md`
- `resource-map.md`
- `research/source-research/020-cli-process-memory-leak-deep-research/`
- `research/source-research/024-cli-deep-research-memory-leak-audit/`
<!-- /ANCHOR:related-docs -->
