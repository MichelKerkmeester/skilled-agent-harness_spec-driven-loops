---
title: "Feature Specification: 401 FSRS Paraphrase Recall"
description: "Validates memory retrieval when query vocabulary differs from stored content phrasing using FSRS spaced repetition terminology."
trigger_phrases:
  - "fsrs"
  - "spaced repetition"
  - "memory scheduler"
  - "forgetting curve"
  - "paraphrase recall"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "_sandbox/24--local-llm-query-intelligence/401"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Created FSRS test memory for paraphrase recall validation"
    next_safe_action: "Run memory_search with paraphrased query"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0401paraphraserecallfrsstest20260514"
      session_id: "sandbox-401"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 401 FSRS Paraphrase Recall

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-14 |
| **Branch** | `sandbox/24--local-llm-query-intelligence/401` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Use FSRS Free Spaced Repetition Scheduler algorithm for spaced repetition scheduling. FSRS predicts memory stability and difficulty per item then schedules reviews at optimal intervals to minimize forgetting. When users query with paraphrased vocabulary such as forgetting curve scheduling at optimal intervals the system must bridge the lexical gap using semantic embeddings.

### Purpose
Confirm that memory index retrieves stored FSRS content when queried with semantically equivalent paraphrases ranking in top three with cosine similarity above zero point five despite low lexical overlap between stored phrasing and query language.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Store FSRS algorithm memory with specific vocabulary about spaced repetition scheduling
- Query with lexical paraphrase using forgetting curve terminology
- Verify retrieval rank and similarity score in top results

### Out of Scope
- Full FSRS implementation validation - this is a retrieval test only
- Multilingual paraphrase testing - English only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/_sandbox/24--local-llm-query-intelligence/401/spec.md` | Create | FSRS test memory file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Paraphrase recall returns stored FSRS memory in top three results | Memory appears at rank one to three with similarity score greater than zero point five |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Lexical-only queries should not produce false positives | Unrelated content scores below FSRS memory for target query |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: FSRS memory surfaces at rank one through three when queried with paraphrase forgetting curve scheduling
- **SC-002**: Semantic similarity score exceeds zero point five confirming embedding captures meaning beyond surface words
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llama-cpp embedding provider circuit breaker open | Vector channel unavailable lexical-only fallback | Record FAIL with diagnostic |
| Risk | Template contract rejection prevents memory index population | Cannot execute search phase | Debug template compliance iteratively |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will the llama-cpp embedding provider recover or does the circuit breaker prevent any semantic comparison
- Can the FTS lexical fallback bridge the paraphrase gap without vector embeddings
- Does the template contract validator accept this exact file format
<!-- /ANCHOR:questions -->
