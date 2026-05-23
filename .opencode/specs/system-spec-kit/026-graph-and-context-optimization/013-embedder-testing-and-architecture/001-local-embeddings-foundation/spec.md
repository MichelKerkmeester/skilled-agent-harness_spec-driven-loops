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
| **Status** | In Progress |
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

Closing summary: Setup A is now a historical foundation arc. The live `auto` cascade is Ollama -> hf-local Nomic, with llama-cpp superseded by the Ollama cascade. Several later child packets remain in progress or planned, so the parent aggregate status is in progress.
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

| Phase | Focus | Status |
|---|---|---|
| `001-prefix-registry-architecture/` | Phase 1 — Prefix Registry Architecture | Complete |
| `002-model-installation-and-compat/` | Phase 2 — Model Installation & Compatibility | Complete |
| `003-mcp-config-rollout/` | Phase 3 — MCP Config Rollout | Complete |
| `004-vec-store-rebuild/` | Phase 4 — Vec-Store Rebuild | In Progress (memory ✓ complete; cocoindex schema ✓; cocoindex search blocked by upstream msgspec truncation — follow-on packet) |
| `005-q4-quantization/` | Phase 5 — Q4 Quantization | In Progress (code shipped; benchmark deferred pending ground-truth queries) |
| `006-bge-m3-hybrid-evaluation/` | Phase 6 — bge-m3 Hybrid Evaluation | Planned (execution gated on 009) |
| `007-voyage-cleanup-and-egress-monitoring/` | Phase 7 — Voyage Cleanup + Egress Monitoring | In Progress (deletes shipped; egress guard pending) |
| `008-finalize-and-commit/` | Phase 8 — Finalize + Commit | Planned |
| `009-cocoindex-ipc-fix/` | Phase 9 — Cocoindex IPC Fix | Root cause documented |
| `010-cocoindex-code-only-patterns/` | Phase 10 — Cocoindex Code-Only Patterns | In Progress (settings shipped; clean rebuild in flight) |
| `011-embeddinggemma-unification/` | Phase 11 - EmbeddingGemma Unification | Complete (shipped 2026-05-13 in commit d76f3b795) |
| `012-v3-remediation/` | Phase 12 - v3 Remediation | Complete (shipped 2026-05-13 in 42aa114e3) |
| `013-v4-cleanup/` | Phase 13 - v4 Cleanup | Complete |
| `014-onnx-cross-platform-backend/` | 014/014 ONNX Runtime cross-platform embedding backend | Complete |
| `015-node-llama-cpp-evaluation/` | 015 node-llama-cpp Memory MCP embedding evaluation | Complete |
| `016-llama-cpp-retrieval-quality-probe/` | 016 llama-cpp retrieval quality probe | Complete |
| `017-llama-cpp-default-flip/` | 017 llama-cpp default flip | Complete |
| `018-llama-cpp-auto-migration/` | 018 llama-cpp auto-migration | Complete |
| `019-readme-resource-map/` | 019 README Resource Map and Post-014 Doc Cleanup | In progress |
| `020-catalog-playbook-alignment-audit/` | Catalog/playbook alignment audit for local embeddings default set | Complete |
| `021-local-llm-legacy-review/` | Local-LLM legacy and outdated-docs/config-drift review (post-014) | In Progress |
| `022-local-llm-legacy-remediation/` | Local-LLM legacy remediation (post-021 review) | Draft |
| `023-post-remediation-re-review/` | Post-remediation confirmatory re-review: 10-iter /spec_kit:deep-review:auto against the same scope as 021 to confirm FAIL -> PASS transition after 022's 5-batch remediation lands. Same executor: cli-codex gpt-5.5 reasoning=high service_tier=fast. | [Draft/In Progress/Review/Complete] |
| `024-post-remediation-v2-re-review/` | 024-post-remediation-v2-re-review | Unknown |
| `025-llm-model-runtime-inventory/` | LLM and embedding-model runtime inventory per subsystem | Complete |
| `026-post-batch-11-re-review/` | 026-post-batch-11-re-review | Unknown |
| `027-post-batch-12-final-re-review/` | 027-post-batch-12-final-re-review | Unknown |
| `028-local-llm-feature-test-suite/` | Local-LLM feature test suite (post-014) | In Progress |
| `029-local-llm-feature-test-suite-completion/` | Complete the 10 functional groups + 4 perf benches promised by 028 | Planned |
| `029-post-027-findings-remediation/` | Fix all 21 P1 + 16 P2 findings from 027 deep-review. 6 workstreams: profile identity & dtype contract, provider fallback correctness, profile-keyed DB naming cleanup, operator docs & catalog drift, fixture refresh, legacy dependency/comment residue. cli-codex gpt-5.5 reasoning=high service_tier=standard (NOT fast). | [Draft/In Progress/Review/Complete] |
| `030-post-029-final-re-review/` | 030-post-029-final-re-review | Unknown |
| `031-post-batch-15-final-re-review/` | 031-post-batch-15-final-re-review | Unknown |
| `032-substrate-repair-followups/` | 032 — Substrate-repair Follow-ups (Phase Parent) |  |
| `033-system-code-graph-import-path-cleanup/` | System Code Graph Import Path Cleanup | Complete |
| `034-query-expansion-context-size/` | 034 Query Expansion Context Size | Complete |
| `035-cocoindex-mcp-reliability/` | 035 CocoIndex MCP Reliability | Complete |
| `036-failed-embedding-cleanup-retry/` | 036 Failed Embedding Cleanup Retry | Complete |
| `037-llama-cpp-embedding-worker-deep-dive/` | 037 llama-cpp embedding worker deep-dive | In Progress |
| `038-embedding-error-propagation/` | Embedding Provider Error Propagation | Complete |
| `039-token-aware-chunking/` | Token-Aware Chunking for LlamaCppProvider | Complete |
| `040-reset-stuck-embedding-rows/` | Reset Stuck Embedding Rows | Complete |
| `041-v-rule-cross-spec-overreach/` | 040 V-rule cross-spec overreach fix | In Progress |
| `042-cocoindex-ipc-observability/` | 041 CocoIndex IPC Observability | Complete |
| `043-cocoindex-refresh-split/` | 042 CocoIndex Refresh/Search Split | Complete |
| `044-suite-revalidation/` | 043 Suite Revalidation | Fail: runner blocked before scenario logic |
| `045-template-contract-divergence/` | 044 Template contract divergence | Complete |
| `046-shared-daemon-suite-runner/` | 045 Shared Daemon Suite Runner | Shipped |
| `047-handover-anchor-naming/` | Handover Anchor Naming Alignment | Complete |
| `048-v8-dominates-relaxation/` | 047 V8 Dominates Relaxation | Complete |
| `049-substrate-stress-coverage/` | 049 Substrate Stress Coverage | Shipped |
| `050-all-skills-alignment-sweep/` | All Skills Alignment Sweep | Completed |
| `051-runtime-config-mk-code-index-parity-plus-findings/` | Runtime config mk-code-index parity plus findings | Complete |
| `052-mk-spec-memory-rename/` | Rename MCP namespace to mk-spec-memory | Shipped |
| `053-mk-spec-memory-rename-remediation/` | Remediate 052 Deep-Review Findings | Complete |
| `054-root-readme-deep-research/` | 056: Root README deep-research realignment | Planned |
| `055-cli-devin-deep-loop-alignment/` | 059: cli-devin deep-loop alignment across 6 surfaces | Planned |
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
