---
title: "XCE-Derived Memory System Refinement"
description: "Phase-parent packet for Spec Kit Memory refinements: feedback correctness, incremental indexing, causal graph lifecycle, frontmatter edge promotion, statediff reconciliation, semantic trigger matching, and learning feedback reducers."
trigger_phrases:
  - "027 xce memory refinement"
  - "memory semantic triggers"
  - "feedback P0 correctness"
  - "feedback reducers"
  - "memoization dependency dag"
  - "causal graph tombstones"
  - "frontmatter causal edge promoter"
  - "statediff reconciliation layer"
  - "incremental memory index"
  - "memory feedback reducers"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "system-agent"
    recent_action: "Merged research iterations 030-039; updated phase specs with synthesis findings."
    next_safe_action: "Implement phase 002 or 003 per iteration-038 sequencing."
    blockers: []
    key_files:
      - "spec.md"
      - "research/027-xce-research-pt-04/research.md"
      - "002-memory-write-safety/spec.md"
      - "003-incremental-index-foundation/spec.md"
      - "004-causal-edge-tombstones/spec.md"
      - "005-metadata-edge-promoter/spec.md"
      - "006-write-path-reconciliation/spec.md"
      - "007-semantic-trigger-fallback/spec.md"
      - "008-learning-feedback-reducers/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-28-027-memory-root-rewrite"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "027 remains the memory refinement packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: XCE-Derived Memory System Refinement (Phase Parent)

<!-- SPECKIT_LEVEL: 2 -->

> **Phase Parent**: This packet coordinates the remaining memory-system phases from the XCE-derived refinement stream. Implementation details live inside the child phase folders.

## PHASES

| Phase | Title | Level | Depends on |
|-------|-------|------:|-----------|
| **[001-release-cleanup](./001-release-cleanup/)** | Release Cleanup Placeholder | n/a | none |
| **[002-memory-write-safety](./002-memory-write-safety/spec.md)** | Memory Write Safety | 2 | none |
| **[003-incremental-index-foundation](./003-incremental-index-foundation/spec.md)** | Incremental Index Foundation | 1 | none |
| **[004-causal-edge-tombstones](./004-causal-edge-tombstones/spec.md)** | Causal Edge Tombstones | 1 | 003 |
| **[005-metadata-edge-promoter](./005-metadata-edge-promoter/spec.md)** | Metadata Edge Promoter | 1 | 004 |
| **[006-write-path-reconciliation](./006-write-path-reconciliation/spec.md)** | Write-Path Reconciliation | 1 | 003, 005 |
| **[007-semantic-trigger-fallback](./007-semantic-trigger-fallback/spec.md)** | Semantic Trigger Fallback | 3 | none |
| **[008-learning-feedback-reducers](./008-learning-feedback-reducers/spec.md)** | Learning Feedback Reducers | phase-parent | 002 |

## Cross-packet dependencies -> 028

- `027/007-semantic-trigger-fallback` soft-needs shadow-eval evidence from `028/004-code-graph-adoption-eval` before live-mode semantic trigger promotion.
- `027/008-learning-feedback-reducers` soft-depends on `028/004-code-graph-adoption-eval` and consumes telemetry from `028/007-retrieval-rerank-clients`.

---

## EXECUTIVE SUMMARY

This packet owns Spec Kit Memory refinement work: P0 feedback correctness, incremental indexing, causal graph lifecycle safety, deterministic frontmatter edge promotion, statediff reconciliation, semantic trigger matching, and learning feedback reducers.

The originating research remains useful as provenance, but this root spec coordinates only the memory-system phases listed below.

**Key Decisions in this Spec**:
- Keep 027 focused on memory-system implementation and memory feedback loops.
- Keep research provenance in `research/`, with implementation ownership expressed through the eight remaining child folders.
- Treat 028 dependencies as cross-packet evidence or telemetry inputs, not internal 027 phase edges.

**Critical Constraints**:
- Child phase docs remain the source of truth for implementation detail.
- The root `PHASES` table uses real folder numbers, not stale research ordinals.
- Non-memory implementation content belongs outside this root spec.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-05-08 |
| **Updated** | 2026-05-28 |
| **Branch** | `main` |
| **Executor** | local spec authoring |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec Kit Memory has several correctness and maintainability gaps that limit reliable retrieval, causal graph hygiene, and learning feedback loops:

1. Feedback correctness fixes need to land before learned reducers can safely mutate causal or retention behavior.
2. The indexer needs memoization, dependency edges, and chunk fingerprints so unchanged derived work can be skipped.
3. Causal graph deletion paths need lifecycle tombstones before generated edges increase write volume.
4. Structured packet metadata should promote deterministic causal edges without manual maintenance.
5. Storage reconciliation should move from scattered post-mutation hooks to typed statediff planning.
6. Trigger matching needs a semantic fallback while preserving lexical command precision.
7. Feedback reducers need a safe aggregation foundation and default-off consumers.

### Purpose

Coordinate the remaining memory-system phases so they can ship independently while preserving a clear dependency order. Success means each child phase can be resumed or validated from this parent without stale non-memory numbering leaking into the memory workstream.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `002-memory-write-safety`: auto-provenance cap, manual-edge overwrite guard, retention tier basement.
- `003-incremental-index-foundation`: canonical fingerprints, memo records, dependency edges, chunk fingerprints.
- `004-causal-edge-tombstones`: tombstone audit rows and unified causal-edge sweep behavior.
- `005-metadata-edge-promoter`: deterministic causal edges from `description.json` and `graph-metadata.json`.
- `006-write-path-reconciliation`: desired/prior diff model and storage target sinks.
- `007-semantic-trigger-fallback`: hybrid lexical plus semantic trigger matching.
- `008-learning-feedback-reducers`: learning reducer phase parent after P0 feedback correctness.
- `001-release-cleanup`: placeholder folder retained on disk.

### Out of Scope

- Non-memory implementation streams.
- Moving or renumbering child phase folders.

### Files Read

| Path | Purpose |
|------|---------|
| `research/027-xce-research-pt-04/research.md` | Research provenance and audit boundary |
| `002-memory-write-safety/spec.md` | P0 feedback correctness scope |
| `003-incremental-index-foundation/spec.md` | Memoization/indexing phase scope |
| `004-causal-edge-tombstones/spec.md` | Causal lifecycle phase scope |
| `005-metadata-edge-promoter/spec.md` | Metadata edge promotion phase scope |
| `006-write-path-reconciliation/spec.md` | Statediff phase scope |
| `007-semantic-trigger-fallback/spec.md` | Semantic trigger phase scope |
| `008-learning-feedback-reducers/spec.md` | Feedback reducer phase-parent scope |

### Files Created or Updated

| Path | Purpose |
|------|---------|
| `spec.md` | Root phase-parent control doc |
| `context-index.md` | Migration bridge for the 027 -> 028 split |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root phase table matches the real remaining 027 child folders. | `PHASES` lists exactly `001`, `002`, `003`, `004`, `005`, `006`, `011`, and `012`. |
| REQ-002 | Non-memory implementation phases are excluded from 027 scope. | No moved child folder appears in the 027 `PHASES` table, trigger phrases, scope, or phase map. |
| REQ-003 | Internal dependency references use remaining 027 folder numbers only. | Dependencies resolve to existing 027 child folders or `none`. |
| REQ-004 | Cross-packet links to 028 are explicit. | The root spec lists the `011` shadow-eval evidence link and `012` eval/telemetry links to 028. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Research questions describe memory-system axes only. | Non-memory implementation axes are absent from `RESEARCH QUESTIONS`. |
| REQ-006 | Phase documentation map matches disk folders. | Bottom phase map has no stale ordinals or moved folder names. |
| REQ-007 | Continuity metadata points at 027 and references only in-packet key files. | `_memory.continuity.packet_pointer` remains this packet; `key_files` contains no moved 028 child folder. |

### P2 - Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Root spec remains compact enough to serve as a control doc. | Detailed implementation requirements stay in child specs. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:research-questions -->
## 5. RESEARCH QUESTIONS

- **RQ-M1 - Feedback Safety**: Which correctness fixes must ship before reducers can learn from feedback without overwriting curated causal or retention state?
- **RQ-M2 - Incremental Indexing**: Which memoization and chunk-fingerprint primitives are needed to avoid reprocessing unchanged memory documents?
- **RQ-M3 - Causal Lifecycle**: How should active causal edges be deleted while preserving tombstone auditability and repair context?
- **RQ-M4 - Structured Edge Promotion**: Which packet metadata fields can be deterministically promoted into causal edges without LLM extraction?
- **RQ-M5 - Reconciliation Model**: Where should desired/prior statediff planning replace scattered handler branches and post-mutation hooks?
- **RQ-M6 - Trigger Recall**: How can semantic trigger fallback improve paraphrase recall without weakening lexical command precision?
- **RQ-M7 - Learning Feedback Reducers**: Which reducer consumers should be enabled only after aggregation, P0 correctness, and external eval evidence are available?
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: The 027 root spec strict-validates as a phase-parent control document.
- **SC-002**: A reader can identify all remaining memory phases and their dependencies from the root `PHASES` table.
- **SC-003**: Cross-packet dependencies to 028 are visible without treating 028 children as internal 027 phases.
- **SC-004**: No stale non-memory phase appears in 027 root scope, triggers, research questions, or phase map.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Child specs still contain historical references from before the split. | Medium. Readers may see old numbering inside child docs. | Root table resolves by current disk folder; child refresh is explicitly out of scope for this edit. |
| Risk | 028 evidence or telemetry is unavailable when 011/012 need it. | Medium. Live promotion or reducer tuning may block. | Keep 028 links soft and document standalone phase scope in child specs. |
| Dependency | `002-memory-write-safety` | Hard prerequisite for `008-learning-feedback-reducers`. | Ship P0 correctness before reducer consumers. |
| Dependency | `003-incremental-index-foundation` | Foundation for chunk identity and statediff keys. | Keep 006 dependent on 003. |
| Dependency | `004-causal-edge-tombstones` | Foundation for generated edge cleanup. | Keep 005 dependent on 004. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Root spec stays a control document; implementation detail remains in children.
- **NFR-M02**: Phase references use folder slugs and current disk numbers.

### Auditability
- **NFR-A01**: Migration history is documented in `context-index.md`, not narrated in this root spec.
- **NFR-A02**: Cross-packet dependencies name both packet and child slug.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `001-release-cleanup` is a placeholder with `.gitkeep` only. It remains listed as `n/a`.
- `011` and `012` retain non-contiguous folder numbers because they are real disk folders and should not be renumbered in this packet.
- Cross-packet 028 dependencies are not blockers for root validation.

### State Transitions
- `draft` -> `phase-parent` when root docs match disk and child packets can be resumed independently.
- Individual child status transitions remain owned by child phase docs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Root control doc for eight remaining memory folders. |
| Risk | 8/25 | Numbering drift and stale child prose are the main risks. |
| Research | 6/20 | Research is already present; this doc only routes memory work. |
| **Total** | **22/70** | **Level 2** phase-parent control. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `001-release-cleanup` remain a placeholder indefinitely, or should a future cleanup packet remove it?
- Should child phase specs be refreshed to remove stale historical numbering after this root split lands?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given** 027 owns only memory-system phase folders
**Given** 028 owns non-memory implementation phase folders
**Given** child specs may still contain historical numbering
**Given** cross-packet dependencies are documented explicitly
**Given** migration history lives in context-index.md
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-release-cleanup/` | Placeholder release cleanup shell | Placeholder |
| 002 | `002-memory-write-safety/` | P0 feedback correctness fixes | Spec-scaffolded |
| 003 | `003-incremental-index-foundation/` | Memoization, dependency DAG, chunk fingerprints | Draft |
| 004 | `004-causal-edge-tombstones/` | Causal edge tombstone lifecycle | Draft |
| 005 | `005-metadata-edge-promoter/` | Deterministic frontmatter causal edges | Draft |
| 006 | `006-write-path-reconciliation/` | Desired/prior statediff reconciliation | Draft |
| 011 | `007-semantic-trigger-fallback/` | Hybrid lexical plus semantic trigger matching | Spec-scaffolded |
| 012 | `008-learning-feedback-reducers/` | Learning feedback reducers phase parent | Phase-parent |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 002-memory-write-safety | 008-learning-feedback-reducers | P0 feedback safety fixes landed before reducers learn from feedback. | 002 validation evidence and tests. |
| 003-incremental-index-foundation | 004-causal-edge-tombstones | Incremental indexing foundation available before lifecycle expansion. | 003 implementation summary. |
| 004-causal-edge-tombstones | 005-metadata-edge-promoter | Generated edge cleanup has tombstone support. | 004 validation evidence. |
| 005-metadata-edge-promoter | 006-write-path-reconciliation | Generated edge sets are available as statediff target candidates. | 005 implementation summary. |
<!-- /ANCHOR:phase-map -->
