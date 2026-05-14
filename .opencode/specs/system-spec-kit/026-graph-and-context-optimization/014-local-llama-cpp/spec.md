---
title: "Feature Specification: Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory"
description: "Phase parent for Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory"
trigger_phrases:
  - "014-local-embeddings-setup-a"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/014-local-embeddings-setup-a"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/014-local-embeddings-setup-a |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All Setup A child packets strict-validate; q8 default, launcher parity, and v3 remediation are documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phased decomposition tracks Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory across independently executable child phase folders.

### Purpose
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.

Closing summary: Setup A began as a Voyage-to-local embeddings migration and concludes with `EMBEDDINGS_PROVIDER=auto` cascading Voyage -> OpenAI -> llama-cpp (when GGUF runtime is installed) -> hf-local, plus CocoIndex on local EmbeddingGemma. The final llama-cpp line ships the faster GGUF backend as an availability-probed automatic selection, with explicit override via `EMBEDDINGS_PROVIDER=<provider>` still available. The evidence chain is now explicit: 014/014 ONNX was too slow for CocoIndex, 015 showed llama-cpp speed and RSS wins with vector parity miss, 016 showed a smaller retrieval-equivalent result, and 017's larger rerun returned MILD_DIVERGENCE but the operator accepted the flip with hf-local retained as the health-checked fallback.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-prefix-registry-architecture/ | Prefix registry architecture | Complete |
| 2 | 002-model-installation-and-compat/ | Model installation and runtime compatibility | Complete |
| 3 | 003-mcp-config-rollout/ | MCP config rollout | Complete |
| 4 | 004-vec-store-rebuild/ | Vec-store rebuild | Complete |
| 5 | 005-q4-quantization/ | Quantized hf-local dtype plumbing | Complete |
| 6 | 006-bge-m3-hybrid-evaluation/ | bge-m3 hybrid evaluation plan | Complete |
| 7 | 007-voyage-cleanup-and-egress-monitoring/ | Voyage cleanup and egress monitoring | Complete |
| 8 | 008-finalize-and-commit/ | Finalize and commit bundle | Complete |
| 9 | 009-cocoindex-ipc-fix/ | CocoIndex IPC/search fix | Complete |
| 10 | 010-cocoindex-code-only-patterns/ | CocoIndex code-only pattern cleanup | Complete |
| 11 | 011-embeddinggemma-unification/ | EmbeddingGemma default unification | Complete |
| 12 | 012-v3-remediation/ | v3 deep-review remediation and q8 system default | Complete |

| 37 | 037-llama-cpp-embedding-worker-deep-dive/ | Confirm contextSize:512 hypothesis + minimal worker fix | Pending |
| 38 | 038-embedding-error-propagation/ | Propagate real embedding provider errors instead of catching as null | Complete |
| 39 | 039-token-aware-chunking/ | Token-aware llama-cpp truncation bounded by model trainContextSize | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-prefix-registry-architecture | 002-model-installation-and-compat | [Criteria TBD] | [Verification TBD] |
| 002-model-installation-and-compat | 003-mcp-config-rollout | [Criteria TBD] | [Verification TBD] |
| 003-mcp-config-rollout | 004-vec-store-rebuild | [Criteria TBD] | [Verification TBD] |
| 004-vec-store-rebuild | 005-q4-quantization | [Criteria TBD] | [Verification TBD] |
| 005-q4-quantization | 006-bge-m3-hybrid-evaluation | [Criteria TBD] | [Verification TBD] |
| 006-bge-m3-hybrid-evaluation | 007-voyage-cleanup-and-egress-monitoring | [Criteria TBD] | [Verification TBD] |
| 007-voyage-cleanup-and-egress-monitoring | 008-finalize-and-commit | Egress script and cleanup docs land | strict validate |
| 008-finalize-and-commit | 009-cocoindex-ipc-fix | Post-merge review exposes IPC search failure | search-path validation |
| 009-cocoindex-ipc-fix | 010-cocoindex-code-only-patterns | Search works and code-only index quality issue is visible | sqlite row counts |
| 010-cocoindex-code-only-patterns | 011-embeddinggemma-unification | Code-only baseline stabilized | default config sweep |
| 011-embeddinggemma-unification | 012-v3-remediation | v3 deep-review findings remain valid | strict validate |
| 032-substrate-repair-followups | 037-llama-cpp-embedding-worker-deep-dive | 032 left 2/5 children blocked on embedding worker health | Phase 3 falsify/confirm + Phase 5 live round-trip |
| 037-llama-cpp-embedding-worker-deep-dive | 038-embedding-error-propagation | Embedding-worker fix shipped; propagation gap surfaces | Vitest T029-error-propagation 4/4 PASS |
| 038-embedding-error-propagation | 039-token-aware-chunking | Errors propagate cleanly; token-budget truncation closes the worker bug | Vitest T030-XX 4/4 PASS incl. real-model smoke |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
