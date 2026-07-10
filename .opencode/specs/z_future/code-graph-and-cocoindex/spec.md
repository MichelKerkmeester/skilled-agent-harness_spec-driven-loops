---
title: "Code Graph + CocoIndex Implementation (XCE-derived)"
description: "Phase-parent packet for Code Graph subsystem enhancements and CocoIndex MCP wrapper integration derived from the XCE research stream. Owns HLD/LLD narrative generation, trace, impact analysis, adoption evaluation, the CocoIndex wrapper fork, intent steering, rerank clients, context extras, and memory-port research."
trigger_phrases:
  - "028 code graph cocoindex"
  - "code_graph HLD LLD generation"
  - "code_graph trace tool"
  - "code_graph impact analysis"
  - "code_graph adoption eval"
  - "cocoindex complete fork"
  - "cocoindex-code v0.2.33"
  - "coco intent steering"
  - "shared rerank embedding client"
  - "coco memory context extras"
  - "cocoindex-main memory port research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created 028 root for split Code Graph+CocoIndex phases."
    next_safe_action: "Select a Code Graph or CocoIndex child phase to resume."
    blockers: []
    key_files:
      - "spec.md"
      - "context-index.md"
      - "001-code-graph-hld-lld/spec.md"
      - "002-code-graph-trace/spec.md"
      - "003-code-graph-impact-analysis/spec.md"
      - "004-code-graph-adoption-eval/spec.md"
      - "005-cocoindex-complete-fork/spec.md"
      - "006-coco-intent-steering/spec.md"
      - "007-retrieval-rerank-clients/spec.md"
      - "008-coco-memory-context-extras/spec.md"
      - "009-cocoindex-memory-port-research/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-28-028-root-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "028 owns the Code Graph and CocoIndex implementation phases split from 027."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code Graph + CocoIndex Implementation (XCE-derived)

<!-- SPECKIT_LEVEL: 2 -->

> **Phase Parent**: This packet coordinates the Code Graph and CocoIndex implementation phases derived from the XCE research stream. Implementation details live inside the child phase folders.

## PHASES

| Phase | Title | Level | Depends on |
|-------|-------|------:|-----------|
| **[001-code-graph-hld-lld](./001-code-graph-hld-lld/spec.md)** | 001 — Code Graph HLD/LLD Narrative Generation | 2 (phase-parent) | none |
| **[002-code-graph-trace](./002-code-graph-trace/spec.md)** | 002 — Code Graph Trace Tool | 2 (phase-parent) | 001 |
| **[003-code-graph-impact-analysis](./003-code-graph-impact-analysis/spec.md)** | 003 — Code Graph Impact Analysis | phase-parent | optional 001, 002 enrichment |
| **[004-code-graph-adoption-eval](./004-code-graph-adoption-eval/spec.md)** | 004 — Code Graph Adoption Evaluation Harness | phase-parent | 001, 002, 003 |
| **[005-cocoindex-complete-fork](./005-cocoindex-complete-fork/spec.md)** | 005 — Complete CocoIndex MCP Wrapper Fork | 2 (phase-parent) | none |
| **[006-coco-intent-steering](./006-coco-intent-steering/spec.md)** | 006 — CocoIndex Intent Steering and Bounded Query Expansion | 3 | 005 |
| **[007-retrieval-rerank-clients](./007-retrieval-rerank-clients/spec.md)** | 007 — Retrieval Rerank Clients | 3 | 005 |
| **[008-coco-memory-context-extras](./008-coco-memory-context-extras/spec.md)** | 008 — Coco Memory Context Extras | 2 (phase-parent) | 005; soft 004 |
| **[009-cocoindex-memory-port-research](./009-cocoindex-memory-port-research/spec.md)** | 009 — CocoIndex Memory Port Research | 1 | none |

## Cross-packet dependencies -> 027

- `028/008-coco-memory-context-extras` soft-depends on `027/007-memory-semantic-triggers` and `027/008-feedback-reducers`.
- `028/009-cocoindex-memory-port-research` references `027/006-statediff-reconciliation-layer` as inspiration and uses the Spec Kit Memory backend as the target system.
- `028/006-coco-intent-steering` had a soft dependency on a cancelled advisor phase now owned by `skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment`; it retains a standalone fallback.

---

## EXECUTIVE SUMMARY

This packet owns two related implementation streams:

- **Code Graph subsystem enhancements**: HLD/LLD narrative generation, symbol-to-architecture trace, risk-scored impact analysis, and an adoption-evaluation harness.
- **CocoIndex MCP wrapper and integration work**: complete wrapper fork baseline, intent steering, shared rerank and embedding clients, context extras, and memory-port research.

The work is derived from the XCE research in packet 027. Research provenance and the `external/xce-mcp` source material remain in 027; this packet is the implementation-control root for Code Graph and CocoIndex phases.

**Key Decisions in this Spec**:
- Resolve phase identities by current 028 folder slug and number.
- Treat old `027/00X` labels inside child specs as stale until those child docs are refreshed.
- Keep cross-packet memory-system dependencies explicit rather than folding them into the internal 028 dependency graph.

**Critical Constraints**:
- Do not infer dependencies from stale numeric labels in child prose.
- Root phase ordering must use the 028 child numbers.
- Child docs remain the source of truth for implementation detail.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Executor** | local spec authoring |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The XCE research surfaced implementation opportunities that do not belong in the memory-refinement control packet. Code Graph needs richer architectural context surfaces, and the CocoIndex wrapper needs a complete fork baseline plus integration phases before intent steering, rerank clients, and memory context extras can be safely layered on top.

Keeping these phases in a memory-focused packet creates confused numbering, mixed dependencies, and unclear ownership. This packet provides the root control surface for the Code Graph and CocoIndex workstream.

### Purpose

Coordinate the Code Graph and CocoIndex implementation phases under one sibling packet. Success means a reader can resume any child phase by its 028 number and understand internal dependencies without reading stale 027 labels.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Code Graph HLD/LLD narrative generation.
- Code Graph trace tooling.
- Code Graph impact analysis.
- Code Graph adoption evaluation.
- Complete CocoIndex MCP wrapper fork based on `cocoindex-code` v0.2.33.
- CocoIndex intent steering and bounded query expansion.
- Shared rerank and embedding client interfaces.
- Coco memory context extras.
- CocoIndex memory-port research.

### Out of Scope

- Memory semantic trigger implementation.
- Feedback P0 correctness.
- Feedback reducer implementation.
- Memory memoization, causal graph lifecycle, frontmatter edge promotion, or statediff implementation.
- Moving, renumbering, or rewriting child phase docs.
- Rewriting research provenance in packet 027.

### Files Read

| Path | Purpose |
|------|---------|
| `001-code-graph-hld-lld/spec.md` | HLD/LLD child scope |
| `002-code-graph-trace/spec.md` | Trace child scope |
| `003-code-graph-impact-analysis/spec.md` | Impact-analysis child scope |
| `004-code-graph-adoption-eval/spec.md` | Adoption-eval child scope |
| `005-cocoindex-complete-fork/spec.md` | CocoIndex wrapper fork scope |
| `006-coco-intent-steering/spec.md` | Intent steering scope |
| `007-retrieval-rerank-clients/spec.md` | Rerank client scope |
| `008-coco-memory-context-extras/spec.md` | Context extras scope |
| `009-cocoindex-memory-port-research/spec.md` | Memory-port research scope |

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
| REQ-001 | Root phase table uses current 028 folder numbers. | `PHASES` lists exactly `001` through `009` with current 028 slugs. |
| REQ-002 | Internal dependencies resolve by slug/topic to new 028 numbers. | Trace depends on 001; adoption eval depends on 001, 002, 003; Coco phases depend on 005 as specified. |
| REQ-003 | Cross-packet dependencies are not treated as internal 028 edges. | 027 and skilled-agent-orchestration links appear only in the cross-packet section. |
| REQ-004 | Stale child titles are cleaned at the root. | Root titles do not include old `Phase NNN` or `027/00X` labels. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Scope clearly covers Code Graph and CocoIndex implementation only. | Memory-system phases remain out of scope. |
| REQ-006 | Context bridge preserves old-to-new mapping. | `context-index.md` contains the full old 027 folder to new 028 folder table. |
| REQ-007 | Continuity metadata points at 028. | `_memory.continuity.packet_pointer` is `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex`. |

### P2 - Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Root spec can guide child refresh later. | Open questions identify stale child numbering as follow-up work. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:research-questions -->
## 5. RESEARCH QUESTIONS

- **RQ-CG1 - HLD/LLD Narrative**: What deterministic and generated context should Code Graph emit for file, symbol, and module roles?
- **RQ-CG2 - Trace Payload**: How should `code_graph_trace` walk symbol, class, module, and architectural-role levels?
- **RQ-CG3 - Impact Risk**: Which graph-derived and optional narrative signals should inform impact analysis?
- **RQ-CG4 - Adoption Evidence**: Which held-out tasks and telemetry prove that Code Graph context reduces file reads or improves correctness?
- **RQ-CO1 - Fork Baseline**: What must be preserved from the `cocoindex-code` v0.2.33 wrapper before integration work begins?
- **RQ-CO2 - Intent Steering**: How should bounded query expansion steer CocoIndex retrieval without over-broadening task context?
- **RQ-CO3 - Shared Clients**: Which rerank and embedding client abstractions should be shared between CocoIndex and memory retrieval paths?
- **RQ-CO4 - Context Extras**: Which exemplars and curated context extras should be added after the wrapper foundation is stable?
- **RQ-CO5 - Memory Port**: Which upstream `cocoindex-main` patterns should inspire future Spec Kit Memory work without being implemented in this packet?
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: The 028 root spec strict-validates as a phase-parent control document.
- **SC-002**: A reader can map each Code Graph and CocoIndex child to its current 028 number.
- **SC-003**: Internal dependencies use new 028 numbers and cross-packet dependencies are listed separately.
- **SC-004**: No moved phase has to be inferred from stale child titles.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Child specs still contain stale 027 labels. | Medium. Readers may follow old numbers. | Root table is authoritative for current 028 identities. |
| Risk | Coco context extras depend on memory evidence not yet available. | Medium. Context extras may need deferral. | Keep 027 links soft and explicit. |
| Dependency | `001-code-graph-hld-lld` | Foundation for trace enrichment and adoption eval. | Run before 002 and 004. |
| Dependency | `005-cocoindex-complete-fork` | Foundation for Coco intent, rerank, and context extras. | Run before 006, 007, and 008. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Root phase references use current folder slugs and numbers.
- **NFR-M02**: Root doc stays compact; implementation details remain in child specs.

### Auditability
- **NFR-A01**: Old-to-new mapping lives in `context-index.md`.
- **NFR-A02**: Cross-packet dependencies name packet, current child number, and slug.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Child phase docs may still show old 027 labels; root control uses 028 mapping.
- `009-cocoindex-memory-port-research` is a research stream, not an implementation dependency for the wrapper phases.
- The advisor render dependency for `006-coco-intent-steering` is external and has a standalone fallback.

### State Transitions
- `draft` -> `phase-parent` when root docs and context bridge exist.
- Child phase status transitions remain owned by child phase docs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Nine child phases across two related implementation streams. |
| Risk | 9/25 | Main risk is stale numbering inside child docs. |
| Research | 8/20 | Research provenance exists in 027; this root controls implementation routing. |
| **Total** | **27/70** | **Level 2** phase-parent control. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should each 028 child spec be refreshed to replace stale 027 titles and dependency labels?
- Should `009-cocoindex-memory-port-research` later spin off memory implementation phases back under 027 or into a new memory packet?
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
**Given** 028 owns Code Graph and CocoIndex implementation phases
**Given** old child titles may contain stale 027 labels
**Given** internal dependencies are resolved by slug and translated to 028 numbers
**Given** cross-packet dependencies remain explicitly external
**Given** migration history lives in context-index.md
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-code-graph-hld-lld/` | HLD/LLD narrative generation | Phase-parent |
| 002 | `002-code-graph-trace/` | Symbol-to-architecture trace | Phase-parent |
| 003 | `003-code-graph-impact-analysis/` | Risk-scored impact analysis | Phase-parent |
| 004 | `004-code-graph-adoption-eval/` | Adoption evaluation harness | Phase-parent |
| 005 | `005-cocoindex-complete-fork/` | Complete CocoIndex MCP wrapper fork | Phase-parent |
| 006 | `006-coco-intent-steering/` | Intent steering and bounded query expansion | Spec-scaffolded |
| 007 | `007-retrieval-rerank-clients/` | Shared rerank and embedding client interfaces | Spec-scaffolded |
| 008 | `008-coco-memory-context-extras/` | Coco exemplars and memory context extras | Phase-parent |
| 009 | `009-cocoindex-memory-port-research/` | CocoIndex memory-port research | Research |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 001-code-graph-hld-lld | 002-code-graph-trace | HLD/LLD narrative payload exists for trace enrichment. | 001 validation evidence. |
| 001-code-graph-hld-lld | 003-code-graph-impact-analysis | Optional narrative enrichment available. | 001 implementation summary when used. |
| 002-code-graph-trace | 003-code-graph-impact-analysis | Optional trace enrichment available. | 002 implementation summary when used. |
| 001/002/003 | 004-code-graph-adoption-eval | Code Graph context surfaces exist before adoption measurement. | Child validation evidence. |
| 005-cocoindex-complete-fork | 006-coco-intent-steering | Wrapper baseline exists before steering changes. | 005 validation evidence. |
| 005-cocoindex-complete-fork | 007-retrieval-rerank-clients | Wrapper baseline exists before adapter integration. | 005 validation evidence. |
| 005-cocoindex-complete-fork | 008-coco-memory-context-extras | Wrapper baseline exists before context extras. | 005 validation evidence. |
<!-- /ANCHOR:phase-map -->
