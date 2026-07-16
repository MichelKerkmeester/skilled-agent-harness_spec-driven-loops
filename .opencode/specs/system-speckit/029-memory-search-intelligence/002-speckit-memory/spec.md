---
title: "Feature Specification: Spec-Kit Memory MCP Phase Parent"
description: "Phase parent for 42 current Spec-Kit Memory MCP child phases derived from packet 028 research and follow-on builds."
trigger_phrases:
  - "028 speckit memory implementation parent"
  - "memory mcp child phase map"
  - "memory search intelligence speckit memory"
  - "memory mcp implementation planning"
  - "028 memory mcp candidate tail"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory"
    last_updated_at: "2026-07-04T17:50:57.196Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Reconciled the Spec-Kit Memory MCP parent with its 42 canonical direct children"
    next_safe_action: "Use the canonical 42-child map for future follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "001-corpus-reindex-gate-zero/spec.md"
      - "029-residual-correctness/spec.md"
      - "039-substrate-sandbox-cleanup/spec.md"
      - "040-opencode-temp-worker-reaping/spec.md"
      - "042-embedder-relisten-and-reaper-hardening/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-speckit-memory-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Current graph authority routes this parent to 42 canonical direct children, ending with 042-embedder-relisten-and-reaper-hardening."
      - "Packet 030 (a separate top-level packet, the Wave-0 shipped evidence record) is unrelated to this parent's own 030-opencode-temp-worker-reaping child and remains out of scope for this parent."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Spec-Kit Memory MCP Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | complete|
| **Created** | 2026-06-16 |
| **Updated** | 2026-06-19 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/029-memory-search-intelligence` |
| **Predecessor** | `../001-release-cleanup/spec.md` |
| **Successor** | `../003-spec-data-quality/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Memory MCP research surfaced candidate work across recall retrieval, deterministic IDs, currentness, reliability and eval coverage. This parent needs to route those candidate groups to child folders so the research evidence and implementation planning stay addressable without placing task detail at the parent level.

### Purpose
Provide the subsystem root purpose and implementation phase map for the Memory MCP portion of packet 028. The child folders own the detailed specs, plans, tasks and validation evidence.

> **Phase-parent note:** This `spec.md` is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for the 42 current Memory MCP child folders.
- A phase-documentation map that names each implementation sub-phase and current planning status.
- A research-input pointer for the evidence packet that fed these child plans.

### Out of Scope
- Implementing the Memory MCP candidates.
- Editing packet 030.
- Rewriting the subsystem research artifacts.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify | parent | Parent purpose and child map |
| `description.json` | Refresh | parent | Search metadata for the parent |
| `graph-metadata.json` | Refresh | parent | Child identity and parent graph metadata |
| `[0-9][0-9][0-9]-*/**` | Maintain | child phases | Implementation planning owned by child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

Research input: `research/research.md` remains the subsystem source packet for candidate evidence and citations. Current navigation authority is the exact 42-entry `children_ids` array in `graph-metadata.json`.

| Phase | Canonical folder |
|---:|---|
| 001 | `001-corpus-reindex-gate-zero/` |
| 002 | `002-determinism-content-id-foundation/` |
| 003 | `003-retrieval-class-routing/` |
| 004 | `004-graceful-degradation/` |
| 005 | `005-recall-render-escaper/` |
| 006 | `006-redteam-probe-gate/` |
| 007 | `007-bitemporal-window/` |
| 008 | `008-search-index-integrity-sweep/` |
| 009 | `009-edge-presence-currentness/` |
| 010 | `010-derived-id-provenance/` |
| 011 | `011-consolidation-cursor-clock/` |
| 012 | `012-query-channel-calibration/` |
| 013 | `013-retention-forgetting/` |
| 014 | `014-automatic-drift-self-healing/` |
| 015 | `015-procedural-reliability-benchmark/` |
| 016 | `016-orphan-sweep-scoped-scan-safety/` |
| 017 | `017-enrichment-observability/` |
| 018 | `018-drift-marker-pipeline-resilience/` |
| 019 | `019-mem0-ranking-tweaks/` |
| 020 | `020-self-healing-internals-hardening/` |
| 021 | `021-summary-fusion-grounding/` |
| 022 | `022-iterative-agentic-recall/` |
| 023 | `023-semantic-edge-layer/` |
| 024 | `024-sleeptime-consolidation/` |
| 025 | `025-git-hooks-reinstall-and-guard/` |
| 026 | `026-eval-harness-extension/` |
| 027 | `027-eval-calibration-ab/` |
| 028 | `028-query-time-filter-benchmark/` |
| 029 | `029-residual-correctness/` |
| 030 | `030-kept-off-flag-resolution/` |
| 031 | `031-drift-marker-native-consolidation/` |
| 032 | `032-new-feature-research-build/` |
| 033 | `033-self-healing-model-consolidation/` |
| 034 | `034-reranker-research/` |
| 035 | `035-off-corpus-eval-fixture-gate/` |
| 036 | `036-lexical-grounding-floor/` |
| 037 | `037-envelope-fidelity-enforcement/` |
| 038 | `038-scoring-hardening/` |
| 039 | `039-substrate-sandbox-cleanup/` |
| 040 | `040-opencode-temp-worker-reaping/` |
| 041 | `041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/` |
| 042 | `042-embedder-relisten-and-reaper-hardening/` |

### Current Phase Transition Rules

- Each child folder owns its detailed spec and validation evidence.
- Parent status changes only after child evidence supports the change.
- Use `/speckit:resume system-speckit/029-memory-search-intelligence/002-speckit-memory/[NNN-phase]/` to resume a specific current child.

<!-- /ANCHOR:phase-map -->

---

## HISTORICAL PHASE DOCUMENTATION MAP (PRE-MIGRATION SNAPSHOT THROUGH 2026-07-04)

The table and transition notes below preserve the former 30-child narrative plus its later 31st-child addition as dated provenance. They are not current navigation; the exact 42-child canonical map above is authoritative.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-corpus-reindex-gate-zero/` | Corpus scan and gate-zero recovery | Done (reindex superseded) |
| 002 | `002-determinism-content-id-foundation/` | Stable content IDs and deterministic recall spine | In Progress |
| 003 | `003-retrieval-class-routing/` | Query class router and lane policy | Partial |
| 004 | `004-graceful-degradation/` | Degraded service paths and fallback envelopes | Complete |
| 005 | `005-recall-render-escaper/` | Source-kind gated render safety | Implemented (1 candidate gated) |
| 006 | `006-redteam-probe-gate/` | Adversarial probe harness and CI gate | Partial |
| 007 | `007-bitemporal-window/` | Temporal validity windows for memory facts | Done (schema foundation) |
| 008 | `008-edge-presence-currentness/` | Presence edges and currentness checks | Partial |
| 009 | `009-derived-id-provenance/` | Derived IDs and provenance links | Done |
| 010 | `010-consolidation-cursor-clock/` | Cursor clock and async write follow-on | Planned |
| 011 | `011-retention-forgetting/` | Retention and forgetting policy | Partial |
| 012 | `012-procedural-reliability-benchmark/` | Procedural reliability benchmark | Partial (plumbing only, benchmark-gated) |
| 013 | `013-enrichment-observability/` | Enrichment metrics and traceability | Complete |
| 014 | `014-mem0-ranking-tweaks/` | Mem0 ranking backport choices | Partial |
| 015 | `015-summary-fusion-grounding/` | Summary fusion and grounding safeguards | In Progress |
| 016 | `016-iterative-agentic-recall/` | Agentic recall loop planning | Partial (Phase 1) |
| 017 | `017-semantic-edge-layer/` | Semantic edge representation | Partial |
| 018 | `018-sleeptime-consolidation/` | Sleeptime background processing | Partial (safe core) |
| 019 | `019-eval-harness-extension/` | Evaluation harness extension | Partial |
| 020 | `020-eval-calibration-ab/` | Evaluation calibration A/B plan | Partial (observe-only) |
| 021 | `021-residual-correctness/` | Residual correctness from candidate 015 | Done |
| 022 | `022-kept-off-flag-resolution/` | Flag-resolution reckoning across every built keep-off flag | Milestone, after the phase builds |
| 023 | `023-new-feature-research-build/` | TRACK B new-feature research, eval-v2 and three held default-off builds | Milestone, after the reckoning |
| 024 | `024-reranker-research/` | Citation reranker research verdict | Research, no code |
| 025 | `025-off-corpus-eval-fixture-gate/` | Off-corpus eval fixture and false-confirm CI gate | Complete, enforcing |
| 026 | `026-lexical-grounding-floor/` | Lexical-grounding floor for off-corpus false-confirm reduction | Complete, graduated default-on |
| 027 | `027-envelope-fidelity-enforcement/` | Envelope render slot fidelity and checker | Complete, graduated default-on |
| 028 | `028-scoring-hardening/` | Verdict-path scoring hardening flags | Complete, three graduated and one deleted |
| 029 | `029-substrate-sandbox-cleanup/` | Substrate stress-harness sandbox cleanup | Complete |

| 030 | `030-opencode-temp-worker-reaping/` | OpenCode temp worker reaping and Vitest runaway prevention | Planned (scaffold only, not yet started) |
| 031 | `031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/` | 13-phase deep-dive P0-P2 remediation program (complete, 13/13 shipped) with its 13 children, re-nested from former top-level 016 on 2026-07-04 | Complete |
### Phase Transition Rules

- Each child folder owns its own `spec.md`, `plan.md`, `tasks.md` and level-required validation docs.
- Parent status changes only after child strict validation passes.
- Use `/speckit:resume system-speckit/029-memory-search-intelligence/001-speckit-memory/[NNN-phase]/` to resume a specific child.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Select the next PENDING candidate group | Child `spec.md` names gate, scope and evidence |
| child | parent | Child reaches strict validation green | `validate.sh <child> --strict` exits 0 |
| 029-substrate-sandbox-cleanup | 030-opencode-temp-worker-reaping | To be defined once child 030 is planned | Not applicable until planning begins |
---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for parent wiring. Candidate questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research input**: `research/research.md`
- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
