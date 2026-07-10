---
title: "Implementation Plan: Newer Text Embedders Survey"
description: "Research-only plan for surveying post-2026-05-01 Hugging Face text embedders against the mk-spec-memory jina-v3 + rescue baseline."
trigger_phrases:
  - "newer text embedders plan"
  - "post may embedder survey plan"
  - "mk-spec-memory candidate refresh plan"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey"
    last_updated_at: "2026-05-18T20:41:03Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Documented research-only execution plan."
    next_safe_action: "No implementation action; keep baseline unless a future MEASURE candidate appears."
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/004-newer-text-embedders-survey/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "004-newer-text-embedders-survey-plan-20260518"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No bench dispatch in this run."
---
# Implementation Plan: Newer Text Embedders Survey

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research packet |
| **Framework** | system-spec-kit Level 1 docs |
| **Storage** | Spec folder only |
| **Testing** | Strict spec validation |

### Overview
Survey Hugging Face model and organization pages for post-2026-05-01 text embedders from the named labs. Apply a conservative local-first filter against the existing `jina-embeddings-v3 + rescue layer` production default, then document whether any candidate deserves a follow-on bake-off.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder provided by operator.
- [x] Scope limited to research-only unless a MEASURE candidate appears.
- [x] Existing bake-off scaffold path identified.

### Definition of Done
- [x] `research.md` documents 3-8 candidates with SKIP / CONSIDER / MEASURE triage.
- [x] Missing Level 1 docs exist.
- [x] Implementation summary records verdict count, standing decision, and touched paths.
- [x] Strict validation passes after edits.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research packet only. No mk-spec-memory code, model weights, benchmark harness, or runtime configuration changes.

### Key Components
- **HF survey**: Web search plus HF model-card reads and HF API metadata checks.
- **Triage rubric**: SKIP / CONSIDER / MEASURE based on paper strength, local runtime fit, memory cap, text/paraphrase relevance, and Apple Silicon compatibility.
- **Decision output**: `research.md` plus completion docs in this spec folder.

### Data Flow
1. Search named labs for post-May-2026 embedding activity.
2. Read candidate model cards and HF API metadata.
3. Exclude stale, code-tuned, too-large, API-only, or multimodal-first models.
4. Compare remaining candidates against jina-v3 + rescue.
5. Record HOLD or MEASURE decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `spec.md`, metadata files, Level 1 template contract, and validation requirements.
- [x] Confirm existing bake-off scaffold path.

### Phase 2: Research
- [x] Search requested labs on HF and web.
- [x] Capture model IDs, dates, size, scores, training notes, license, paraphrase/hard-negative signal, and Apple compatibility.
- [x] Apply triage rubric.

### Phase 3: Documentation and Verification
- [x] Write `research.md`.
- [x] Author missing Level 1 docs.
- [x] Update implementation summary with verdict count and Commit Handoff.
- [x] Run strict validation and iterate until PASS.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source verification | Candidate metadata and release/update dates | HF model cards, HF API metadata, web search |
| Scope validation | No bench or code changes | Manual file-scope check |
| Spec validation | Required Level 1 docs and anchors | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hugging Face model pages | External source | Green | Candidate metadata unavailable |
| HF API metadata | External source | Green | Exact `createdAt` / `lastModified` weaker |
| Existing bake-off packet | Internal reference | Green | Follow-on bench plan would lack scaffold reference |
| system-spec-kit validator | Internal tool | Green | Completion cannot be claimed without PASS |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet is documentation-only. Rollback is removing or correcting the authored docs in this spec folder. No benchmark, model, code, or runtime state was changed.
<!-- /ANCHOR:rollback -->
