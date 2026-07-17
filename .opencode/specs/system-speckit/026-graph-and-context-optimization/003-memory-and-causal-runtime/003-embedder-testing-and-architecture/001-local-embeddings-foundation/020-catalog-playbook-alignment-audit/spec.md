---
title: "Feature Specification: Catalog/playbook alignment audit for local embeddings default set"
description: "Documents audit findings for feature catalog and manual testing playbook alignment after local embedding provider defaults changed."
trigger_phrases:
  - "catalog playbook alignment audit"
  - "local embeddings defaults"
  - "llama-cpp hf-local"
  - "embeddinggemma docs audit"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/020-catalog-playbook-alignment-audit"
    last_updated_at: "2026-05-13T15:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Applied code graph scan remediation follow-up"
    next_safe_action: "Restart MCP server if needed, then rerun code_graph_scan"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-catalog-playbook-alignment-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which catalog and playbook entries need update/delete/edit/create actions after local embedding defaults changed?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Catalog/playbook alignment audit for local embeddings default set

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This phase records the audit result for feature catalog and manual testing playbook content affected by the local embedding/default-provider changes and applies the approved follow-up documentation edits. It updates stale default/recommended wording while preserving surface boundaries between Spec Kit Memory, CocoIndex, rerankers, Code Graph, and Skill Advisor. A follow-up code graph remediation was added after the stored-scope refresh kept timing out and stale failed-scan metadata hid the structural failure cause.

**Key Decisions**: update stale embedding-default docs; keep reranker and code-graph docs out of scope unless they state embedding-provider defaults.

**Critical Dependencies**: source-of-truth default cascade and model IDs supplied in the phase dispatch.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `020-catalog-playbook-alignment-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Local embedding defaults changed, but catalog/playbook documentation can still imply API-first, Voyage-only, or stale `all-MiniLM-L6-v2` expectations. Without a precise audit packet, follow-on doc edits risk missing stale entries or conflating memory embeddings, CocoIndex embeddings, rerankers, Code Graph, and Skill Advisor internals.

### Purpose

Capture and apply an evidence-backed update map for feature catalog and manual testing playbook files so impacted docs align with current defaults while non-impacted surfaces stay unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Record the required memory embedding provider cascade: explicit env -> Voyage -> OpenAI -> `llama-cpp` -> `hf-local`.
- Record the active memory local default: `llama-cpp` with `unsloth/embeddinggemma-300m-GGUF`.
- Record the memory fallback: `hf-local` with `onnx-community/embeddinggemma-300m-ONNX`, q8.
- Record CocoIndex defaults: `sbert/google/embeddinggemma-300m`, `InstructionRetrieval`, and code-only include with specs/docs excluded.
- Classify Code Graph as non-impact because it does not define embedding defaults.
- List exact catalog/playbook files that need P0/P1 updates or P2/P3 review/caveats, then apply the approved follow-up edits.
- Fix the code graph scan refresh loop discovered during verification: honor incremental scans across Git HEAD drift, refresh candidate manifests after successful incremental scans, and surface structural persistence errors before parse-error noise.

### Out of Scope

- Embedding runtime code changes, model installation code, or provider behavior changes.
- Code graph changes beyond the targeted scan-refresh remediation.
- Deleting catalog/playbook entries; no evidence supported deletion.
- Changing embedding code, model installation code, or runtime configuration.
- Redefining reranker defaults as embedding defaults - reranker docs remain reranker-specific.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/spec.md` | Create/update | Scope and requirements for the audit packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/plan.md` | Create/update | Execution plan and impact matrix. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/tasks.md` | Create/update | Completed audit-documentation task ledger. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/checklist.md` | Create/update | Verification evidence for the packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/decision-record.md` | Create/update | ADRs for classification boundaries. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/implementation-summary.md` | Create/update | Concise summary of audit findings. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/description.json` | Create/update | Spec metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit/graph-metadata.json` | Create/update | Phase graph metadata. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature-flag-reference/05-5-embedding-and-api.md` | Update | Add current provider cascade and local/fallback models. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/032-5-embedding-and-api.md` | Update | Validate provider cascade and local/fallback models. |
| `.opencode/skills/system-spec-kit/feature_catalog/pipeline-architecture/23-embeddings-and-retry-api.md` | Update | Include current provider profile/model IDs. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline-architecture/219-embeddings-and-retry-api.md` | Update | Validate provider profile/model IDs. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Update | Mirror corrected embedding/API flag summary. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Update | Mirror corrected EX-032 summary. |
| `.opencode/skills/mcp-coco-index/**` | Update | Correct stale default/recommended model wording across catalog, playbook, README, install guide, settings reference, tool reference, config templates, and SKILL.md. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Update | Honor incremental scans on Git HEAD drift, refresh candidate manifests after successful incremental scans, and prioritize structural failed-scan errors. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Update | Cover incremental HEAD drift behavior and structural failed-scan metadata ordering. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Record memory provider cascade exactly. | Spec and summary state explicit env -> Voyage -> OpenAI -> `llama-cpp` -> `hf-local`. |
| REQ-002 | Record memory local and fallback model defaults. | Packet states `llama-cpp` + `unsloth/embeddinggemma-300m-GGUF`, then `hf-local` + `onnx-community/embeddinggemma-300m-ONNX`, q8. |
| REQ-003 | Record CocoIndex defaults separately from memory defaults. | Packet states `sbert/google/embeddinggemma-300m`, `InstructionRetrieval`, and code-only default excludes specs/docs. |
| REQ-004 | Preserve write boundary. | Only the approved documentation follow-up files and this spec packet are modified; no runtime code is changed. |
| REQ-005 | Capture P0/P1 update targets. | All files listed in the dispatch P0/P1 findings appear with update guidance. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Capture P2/P3 review and caveat candidates. | Review/caveat/no-impact candidates are listed with rationale. |
| REQ-007 | Separate reranker, Code Graph, and Skill Advisor concerns. | Packet says reranker docs remain reranker-specific, Code Graph has no embedding-default update, and Skill Advisor `local/native` is scorer implementation language. |
| REQ-008 | Provide follow-on execution plan. | Plan and tasks identify update order, validation, and no-delete default. |
| REQ-009 | Apply approved documentation follow-ups. | Stale model/default wording is updated in system-spec-kit and mcp-coco-index docs; review/caveat candidates are either caveated or left unchanged with rationale. |
| REQ-010 | Remediate code graph scan refresh loop found during verification. | `code_graph_scan` honors incremental scans across Git HEAD drift, successful incremental scans refresh the manifest, and failed-scan metadata surfaces structural persistence errors first. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Required source-of-truth defaults are recorded verbatim in packet docs.
- **SC-002**: Every listed P0/P1 and P2/P3 file from the dispatch appears in the audit matrix.
- **SC-003**: Packet classifies Code Graph as non-impact and avoids conflating reranker `llama-cpp` with embedding `llama-cpp`.
- **SC-004**: Strict spec validation exits 0 after placeholders are removed.
- **SC-005**: Target feature catalog, manual testing playbook, and related mcp-coco-index reference docs are updated without runtime code changes.
- **SC-006**: Follow-up state is documented so reviewers can distinguish applied updates from no-op/non-impact surfaces.
- **SC-007**: Focused code graph scan tests and TypeScript typecheck pass after the scan remediation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Dispatch-supplied default matrix | Audit quality depends on exact source-of-truth strings. | Copy defaults verbatim and keep memory/CocoIndex/Code Graph separated. |
| Risk | Accidental embedding runtime mutation | Would exceed documentation follow-up scope. | Limit embedding-default edits to markdown/json spec metadata and documented skill docs. |
| Risk | Code graph remains stale in the running MCP process | Source changes may require MCP server restart before live tools use the fix. | Record restart/rerun as next safe action and verify with focused tests/typecheck now. |
| Risk | Conflating provider surfaces | Follow-on docs could claim Code Graph or reranker embedding defaults that do not exist. | Classify each surface explicitly by owner and non-impact status. |
| Risk | Stale tests keep checking old models | Manual playbooks may continue accepting `all-MiniLM-L6-v2` or Voyage-only expectations. | Mark stale CocoIndex playbooks/catalog entries as P0/P1 updates. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The code graph remediation reduces unnecessary full-scan work by honoring incremental content-hash reindexing across Git HEAD drift.
- **NFR-P02**: Follow-on manual tests should verify defaults without requiring network egress when local defaults are active.

### Security
- **NFR-S01**: Do not introduce secrets, API keys, or credential examples in the spec packet.
- **NFR-S02**: Preserve provider cascade clarity so egress-sensitive deployments can verify local fallback behavior.

### Reliability
- **NFR-R01**: The audit must be deterministic and path-specific enough for reviewers to verify applied updates without guessing.
- **NFR-R02**: Non-impact docs must be protected from unnecessary edits.

---

## 8. EDGE CASES

### Data Boundaries
- Memory local default and CocoIndex default both use EmbeddingGemma naming, but they are different provider stacks and model identifiers.
- `llama-cpp` appears in reranker contexts and embedding contexts; docs must not merge those meanings.
- Docs/spec classification in CocoIndex path taxonomy is not the same claim as default inclusion.

### Error Scenarios
- If a later review finds an additional stale default string, it should add it to the same update class rather than opening a new classification system.
- If a target doc already contains corrected defaults, the follow-up action becomes verify/no-op with evidence.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multiple skill documentation packages and exact path matrix. |
| Risk | 17/25 | Provider defaults affect egress, local model behavior, and test expectations. |
| Research | 18/20 | Requires separating memory, CocoIndex, reranker, Code Graph, and Skill Advisor semantics. |
| Multi-Agent | 4/15 | No nested sub-agent use in this phase; follow-up edits were applied directly. |
| Coordination | 12/15 | Phase child under a larger local embeddings setup parent. |
| **Total** | **69/100** | **Level 3 selected for cross-surface ADR and audit handoff clarity.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Follow-on editor updates only feature catalog but not paired playbook. | H | M | Pair system-spec-kit and mcp-coco-index catalog/playbook targets in plan. |
| R-002 | `all-MiniLM-L6-v2` remains in root summary files. | M | M | Include root catalog and playbook index files in P0/P1 target list. |
| R-003 | Code Graph docs are edited despite no embedding defaults. | M | L | Mark Code Graph as non-impact in requirements and ADR. |
| R-004 | Skill Advisor `local/native` is mistaken for embedding provider. | M | L | Caveat wording says scorer implementation, not embedding cascade. |

---

## 11. USER STORIES

### US-001: Follow-on Documentation Editor (Priority: P0)

**As a** follow-on documentation editor, **I want** a path-specific update matrix, **so that** I can update stale catalog/playbook entries without changing unrelated docs.

**Acceptance Criteria**:
1. **Given** I open this packet, **When** I inspect P0/P1 findings, **Then** I can identify every required target path and see that the approved follow-up edits were applied.
2. **Given** I inspect P2/P3 findings, **When** a file mentions docs/spec classification or reranker `llama-cpp`, **Then** I can decide whether to caveat or leave it unchanged.
3. **Given** I verify write scope, **When** I check target catalog/playbook docs, **Then** only approved documentation files changed and runtime code stayed untouched.

### US-002: Local Embeddings Operator (Priority: P1)

**As a** local embeddings operator, **I want** docs and playbooks to reflect the current default cascade, **so that** validation no longer expects stale Voyage-only or `all-MiniLM-L6-v2` behavior.

**Acceptance Criteria**:
1. **Given** memory embeddings run with no explicit provider env, **When** docs describe defaults, **Then** they name `llama-cpp` GGUF first and `hf-local` ONNX q8 fallback after Voyage/OpenAI cascade positions.
2. **Given** CocoIndex settings are inspected, **When** docs describe the default model, **Then** they name `sbert/google/embeddinggemma-300m` and `InstructionRetrieval` separately from memory defaults.
3. **Given** Code Graph docs are reviewed, **When** no embedding defaults are defined there, **Then** no Code Graph embedding-default update is required.

---

## 12. OPEN QUESTIONS

None. The dispatch supplied the source-of-truth defaults and exact finding set for this audit packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
