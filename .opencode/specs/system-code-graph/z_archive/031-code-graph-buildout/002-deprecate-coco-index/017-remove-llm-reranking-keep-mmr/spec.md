---
title: "Feature Specification: Delete the inactive LLM-model reranking (cross-encoder + local GGUF reranker + reranker interface + conditional-rerank gate + 7 tests; remove stage3 Step 1) while preserving the active algorithmic MMR diversity reranker; behavior-neutral, triple-verified via tsc + full memory-search vitest [template:level_2/spec.md]"
description: "Document the completed removal of residual inactive LLM-model reranking confidence, explainability, audit, documentation, and test vestiges while preserving the active MMR diversity reranker."
trigger_phrases:
  - "remove llm reranking"
  - "keep mmr"
  - "cross-encoder removal"
  - "reranker sidecar removal"
  - "confidence reranker weight"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/002-deprecate-coco-index/017-remove-llm-reranking-keep-mmr"
    last_updated_at: "2026-05-25T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored Level 2 packet docs for the completed residual LLM-reranker cleanup layer."
    next_safe_action: "commit 017 changeset"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md"
    session_dedup:
      fingerprint: "sha256:6587d9dbefe05b61a2b6749dfc08d87f9e0321641eb442f35ef528a02dd0cb0b"
      session_id: "017-remove-llm-reranking-keep-mmr-doc-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "MMR stays because it is algorithmic vector diversity, not an LLM model reranker."
      - "The removed 0.20 confidence factor is not redistributed because it was already inert."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Delete the inactive LLM-model reranking (cross-encoder + local GGUF reranker + reranker interface + conditional-rerank gate + 7 tests; remove stage3 Step 1) while preserving the active algorithmic MMR diversity reranker; behavior-neutral, triple-verified via tsc + full memory-search vitest

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-25 |
| **Branch** | `scaffold/017-remove-llm-reranking-keep-mmr` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 014/003 already removed the core inactive LLM-model reranking path: cross-encoder modules, local GGUF reranker sidecar coupling, the conditional rerank gate, Stage 3 Step 1 cross-encoder reranking, and related tests. Residual confidence, explainability, audit, documentation, and test references still described or exercised dead reranker plumbing even though the live pipeline no longer assigned `rerankerScore`.

The work needed a narrow distinction: delete only reranking that used a different LLM model, while keeping the active MMR diversity reranker because it is algorithmic vector math in Stage 3.

### Purpose
Permanently align live code, tests, and operator docs to the MMR-only Stage 3 reality, with no inactive LLM-model reranker confidence, explainability, audit, flag, or test vestiges left in active surfaces.

### Operator Directive
> "only delete rerank stuff that utilizes a different llm model. If mmr diversity is different from the more recently added reranker sidecar lom stuff than keep it. And double triple verify that works as expected."
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove residual inactive LLM-model reranker confidence scoring vestiges from `confidence-scoring.ts`.
- Remove dead `reranker_support` explainability behavior from `result-explainability.ts`.
- Remove the stale `rerankTriggerRate` decision-audit SLA metric.
- Remove stale comments, docs, flags, playbook rows, and catalog sections that still described cross-encoder, local GGUF, or sidecar reranking as live behavior.
- Remove reranker-specific assertions, fixtures, and cases from affected tests while strengthening confidence fixtures so high confidence is reached without the removed boost.
- Preserve MMR diversity reranking, MPAB chunk collapse, `effectiveScore`, and `floorScore`.

### Out of Scope
- Historical benchmark records under `mcp_server/benchmarks/**`, because they are frozen historical records.
- `feature_catalog/tooling-and-scripts/04-dead-code-removal.md`, because it is a historical cleanup record.
- `references/memory/embedder_pluggability.md:156` Path A rejection rationale, because it records decision history.
- Already-correct "REMOVED in 014" notices in `SKILL.md` and `references/memory/embedder_architecture.md`.
- Session-health `QualityScore`, because it is a different four-factor score: recency, recovery, graphFreshness, and continuity.
- Generic `scoringMethod`, because it is not specific to the removed LLM reranker.
- `PipelineRow.rerankerScore`, because it remains a harmless unused optional field.
- The already-committed core removal in packet 014/003, commit `b564013c0e`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modify | Remove inert reranker confidence factor and related fields/drivers. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts` | Modify | Remove dead `reranker_support` signal and summary case. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts` | Modify | Remove `rerankTriggerRate` SLA metric. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify | Remove stale canonical reranker output comment. |
| Active docs, feature catalog, playbooks, and README files listed in `implementation-summary.md` | Modify/Delete stale references | Align live documentation to MMR-only Stage 3 behavior and removed flags. |
| Affected search/scoring/pipeline/retrieval tests listed in `implementation-summary.md` | Modify | Remove reranker-specific fixtures and assertions; preserve confidence coverage without reranker boost. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve MMR diversity reranking. | `applyMMR` remains in `stage3-rerank.ts`, gated by `SPECKIT_MMR`; MMR has no cross-encoder imports; Stage 3 MMR-only regression passes. |
| REQ-002 | Remove inactive LLM-model reranker confidence vestiges. | `WEIGHT_RERANKER`, `isRerankerExpected`, `reranker_boost`, `rerankerScore`, `rerankerApplied`, `hasRerankerSignal()`, and the driver push are removed from confidence scoring. |
| REQ-003 | Keep confidence behavior neutral. | The removed 0.20 factor is not redistributed; raw confidence remains capped at 0.80 because the term was already always 0 with the cross-encoder gate hard-OFF. |
| REQ-004 | Remove dead explainability and audit signals. | `reranker_support`, its summary case, and `rerankTriggerRate` count/computation are removed from live surfaces. |
| REQ-005 | Align live docs and tests to MMR-only reality. | Stage 3 docs describe MMR diversity reranking plus MPAB chunk collapse, retired reranker flags are removed, and affected tests no longer depend on reranker boost/gate fixtures. |
| REQ-006 | Verify the change rigorously. | `tsc --noEmit` returns 0 errors; affected set passes 14 files / 493 tests; broad subsystem subset passes 107 files / 2371 tests; full 528-file suite limitation is documented honestly. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Preserve historical records. | Frozen benchmarks, historical cleanup records, retained decision rationale, and already-correct removal notices are left intact. |
| REQ-008 | Correct post-deprecation embedder documentation drift. | Root README and `references/memory/embedder_pluggability.md` reflect mk-spec-memory's current `nomic-ai/nomic-embed-text-v1.5` default and do not revive deleted cocoindex code-search embedder claims. |
| REQ-009 | Keep completion docs accurate. | Packet docs distinguish predecessor commit `b564013c0e` from this packet's residual cleanup layer. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Live code no longer contains inactive LLM-model reranker confidence, explainability, or audit plumbing.
- **SC-002**: MMR diversity reranking remains live, independent of cross-encoder imports, and verified by the Stage 3 regression.
- **SC-003**: Active docs describe Stage 3 as MMR diversity reranking plus MPAB chunk collapse, not cross-encoder or local GGUF sidecar reranking.
- **SC-004**: Retired reranker flags and stale cloud reranker rows are removed from active references.
- **SC-005**: TypeScript compilation and affected/broad subsystem vitest evidence pass with no failures attributable to this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Confusing MMR with LLM reranking | Could remove the active algorithmic diversity step by mistake. | D-017-1 preserves MMR and verifies no shared cross-encoder imports. |
| Risk | Confidence-score behavior drift | Redistributing the removed 0.20 could change calibrated confidence. | D-017-2 leaves the 0.20 unredistributed; rawValue stays capped at 0.80. |
| Risk | Dead docs continue to imply live reranker sidecars | Operators may configure retired flags or expect deleted modules. | Active docs and feature catalog entries are aligned to MMR-only behavior. |
| Dependency | Predecessor 014/003 core removal | This packet depends on the earlier module and gate removal. | Document the split: core landed in `b564013c0e`; 017 is the residual cleanup layer. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Do not add a new model call, sidecar call, or external reranking dependency.
- **NFR-P02**: Preserve the existing algorithmic Stage 3 path: MMR diversity reranking plus MPAB chunk collapse.

### Security
- **NFR-S01**: Remove active configuration references to retired reranker-sidecar and cloud reranker credentials.
- **NFR-S02**: Do not introduce new secrets, env vars, network calls, or model dependencies.

### Reliability
- **NFR-R01**: Keep TypeScript import graph clean after deleting reranker vestiges.
- **NFR-R02**: Keep confidence fixtures valid without depending on removed reranker boost behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Results without reranker fields: confidence scoring must still compute from margin, channel agreement, and anchor density.
- Results with vector and FTS sources plus anchors: high confidence must be reachable through legitimate remaining factors.
- Historical documents mentioning removed rerankers: preserved only when they are explicitly historical records.

### Error Scenarios
- Deleted reranker imports: `tsc --noEmit` must catch any remaining broken imports across all compiled mcp_server files.
- Stale operator docs: active docs must not instruct operators to configure retired reranker flags.
- Test fixture drift: affected tests must pass without `RerankGateDecision`, `rerankTriggerRate`, or reranker-gap cases.

### State Transitions
- Post-014/003 core state: this packet documents the residual cleanup after `b564013c0e`, not the predecessor commit itself.
- MMR-only Stage 3: Stage 3 continues to use the `SPECKIT_MMR`-gated algorithmic step.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Broad cleanup across code, docs, and tests in a 35-file packet layer. |
| Risk | 14/25 | Main risk was accidentally removing MMR or changing confidence calibration. |
| Research | 12/20 | Required separating live LLM-reranker vestiges from MMR and historical records. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## 11. DECISIONS

| ID | Decision | Rationale |
|----|----------|-----------|
| D-017-1 | Keep MMR. | MMR is algorithmic diversity vector math, distinct from the LLM cross-encoder and sidecar. This follows the operator directive. |
| D-017-2 | Remove the 0.20 confidence reranker weight without redistributing it. | The term was already inert because the cross-encoder gate was hard-OFF; leaving the 0.20 unredistributed keeps rawValue capped at 0.80 and preserves behavior. |
| D-017-3 | Remove `reranker_boost`, `rerankerScore`/`rerankerApplied`, `hasRerankerSignal()`, and `reranker_support`. | These were vestigial LLM-reranker plumbing; zero live assignments of `rerankerScore` were verified in `mcp_server/lib` plus handlers, so they never fired post-removal. |
| D-017-4 | Preserve historical records. | Delete-not-archive governs live code and docs, not changelog, benchmark, or decision history. |

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
