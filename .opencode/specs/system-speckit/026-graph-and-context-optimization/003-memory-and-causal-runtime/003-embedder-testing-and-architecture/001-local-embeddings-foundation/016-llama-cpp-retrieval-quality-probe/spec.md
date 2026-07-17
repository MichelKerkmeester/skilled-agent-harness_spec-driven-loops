---
title: "Feature Specification: 016 llama-cpp retrieval quality probe"
description: "Measures whether the llama-cpp vector parity miss changes real Memory MCP retrieval rankings compared with hf-local."
trigger_phrases:
  - "016 llama cpp retrieval quality probe"
  - "llama-cpp retrieval overlap"
  - "hf-local llama-cpp search quality"
  - "EmbeddingGemma retrieval parity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/016-llama-cpp-retrieval-quality-probe"
    last_updated_at: "2026-05-13T10:23:12Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed llama-cpp retrieval quality probe with equivalent verdict"
    next_safe_action: "Use results to inform default-flip decision; require one-time re-index if flipping"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "scratch/probe-results.json"
      - "scratch/probe-results.md"
    session_dedup:
      fingerprint: "sha256:0160160160160160160160160160160160160160160160160160160160160160"
      session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
      parent_session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does vector parity miss matter for real retrieval? -> No material divergence in this probe."
---
# Feature Specification: 016 llama-cpp retrieval quality probe

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 16 |
| **Predecessor** | `015-node-llama-cpp-evaluation` |
| **Outcome** | **Equivalent retrieval**: rank metrics clear the default-flip quality bar |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 015 showed `llama-cpp` is much faster than `hf-local`, but vector-to-vector parity failed with mean cosine `0.9677582325103543` against a `0.995` target. That parity test compared corresponding vectors, not retrieval behavior. The open question is whether the cosine miss changes actual search ranking enough to block a future default flip.

### Purpose
Probe real Memory MCP retrieval quality by sampling 200 existing indexed memories, deriving 50 query/target pairs, embedding the same corpus and queries with both providers, and comparing backend-internal top-k rankings. This packet determines whether the parity miss is quality-relevant or only a migration/re-index concern.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only sampling from the existing `hf-local` Memory MCP sqlite store.
- Packet-local probe script and scratch artifacts.
- `hf-local` and `llama-cpp` embeddings through the existing provider factory.
- Recall@5 overlap, Spearman top-10 rank correlation, and MRR@200 metrics.
- Human-readable side-by-side top-5 examples.
- Packet documentation, metadata, and parent graph registration.

### Out of Scope
- Mutating the existing Memory MCP sqlite store.
- Editing provider code, factory code, tests, or dependency manifests.
- Rebuilding indexes or changing the default provider.
- Adding new Memory MCP test files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/probe-retrieval-quality.ts` | Create | One-shot probe harness |
| `scratch/probe-corpus.json` | Generate | Sampled corpus rows |
| `scratch/probe-queries.json` | Generate | 50 derived query/target pairs |
| `scratch/probe-embeddings.json` | Generate | Base64-encoded Float32Array embeddings |
| `scratch/probe-results.json` | Generate | Machine-readable metrics and verdict |
| `scratch/probe-results.md` | Generate | Human-readable metrics and examples |
| Packet docs and metadata | Create | Level 1 documentation |
| Parent `graph-metadata.json` | Modify | Register phase 16 and verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sample real Memory MCP documents read-only | 200 rows from `memory_index.content_text`, empty/short rows skipped |
| REQ-002 | Generate real query/target pairs | 50 Approach A queries from first sentences / starts of sampled docs |
| REQ-003 | Embed corpus and queries with both providers | Existing factory creates `hf-local` and `llama-cpp`; no provider code edits |
| REQ-004 | Compute retrieval metrics without vector mixing | Each backend scores queries only against its own corpus vectors |
| REQ-005 | Emit JSON and Markdown results | `scratch/probe-results.json` and `scratch/probe-results.md` contain real numbers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Include human eyeball examples | 3-5 top-5 side-by-side examples in Markdown |
| REQ-007 | Record methodology deviations | Context-length adjustment documented in implementation summary |
| REQ-008 | Validate packet docs | Strict validation exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Corpus size is exactly 200 and query count is exactly 50.
- **SC-002**: Recall@5 overlap mean is measured against the `0.80` equivalent threshold.
- **SC-003**: Spearman top-10 mean is measured against the `0.85` equivalent threshold.
- **SC-004**: MRR relative delta is measured against the `<5%` equivalent threshold.
- **SC-005**: Verdict is one of `EQUIVALENT`, `MILD_DIVERGENCE`, or `REAL_DIVERGENCE` based on the contract thresholds.
- **SC-006**: Strict validation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing sqlite store schema | Probe cannot sample docs if columns differ | Inspected schema and used `content_text` plus optional `memory_summaries.summary_text` |
| Dependency | GGUF model path | llama-cpp cannot run without Q8_0 file | Used packet 015 model path under Hugging Face cache |
| Risk | llama-cpp context length | Long docs can exceed embedding context even after 2,048-char chunking | Used the same 700-char `maxTextLength` for both providers |
| Risk | Aggregate metrics hide bad examples | Default flip could look safe while surfacing worse docs | Added side-by-side top-5 examples and human observation |
| Risk | Derived queries are easy self-match cases | MRR may be inflated | Treat overlap and rank correlation as primary quality signals |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No packet-blocking questions remain.

Follow-on question: if the default flips, should the migration packet force a one-time re-index and then run a larger query panel against production-like user prompts?
<!-- /ANCHOR:questions -->
