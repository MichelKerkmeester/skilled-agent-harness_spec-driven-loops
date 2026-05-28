---
title: "Feature Specification: 004 Curator Prompt"
description: "Level 2 child packet for memory context curator prompt, parser, schema validation, and cache extension."
trigger_phrases:
  - "027 011 004 curator prompt"
  - "memory curator prompt"
  - "context_curator.ts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/004-curator-prompt"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Plan implementation for context_curator.ts"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 004 Curator Prompt

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras` |
| **Track** | B: Memory Curator |
| **Depends On** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The memory pipeline can return deterministic ranked results, but it has no governed packaging plan that groups candidate IDs into causal chains, direct evidence, supporting context, and omitted-but-available items.

### Purpose
Create the prompt, parser, strict schema validation, and cache extension for a context curator in `mcp_server/lib/search/context_curator.ts`, while keeping output plan-only and non-authoritative.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Curator prompt template and package policy.
- Strict JSON parser and schema validation.
- Candidate ID validation against the deterministic candidate set.
- `curator_cache` or LLM cache extension for `context_curation`.

### Out of Scope
- Hooking curator into `memory-search.ts`.
- Changing deterministic result order or scores.
- New LLM provider integration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context_curator.ts` | Create | Prompt, parser, schema validation, cache key support |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-cache.ts` | Modify | Add `context_curation` mode or compatible cache extension |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/context-curator.vitest.ts` | Create | Parser, validation, and cache tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Curator schema validates selected IDs against candidates | Invalid or invented IDs are rejected |
| REQ-002 | Curator returns package plan only | No scores or canonical ordering are mutated |
| REQ-003 | Cache key includes candidate-set hash, intent, profile, version, and package policy | Cache key shape test passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Timeout and parse failures return deterministic fallback signal | Tests cover timeout and invalid JSON |
| REQ-005 | Prompt bans invented paths and facts | Prompt snapshot includes candidate-bound instruction |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Curator parser rejects invented IDs and malformed JSON.
- **SC-002**: Cache key is stable for the same ordered candidate set.
- **SC-003**: Curator output is a validated plan, not a rank mutation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | LLM invents IDs or paths | Bad context package | Strict schema and candidate validation |
| Risk | Cache key collision | Wrong package reused | Ordered candidate hash plus versioned policy |
| Risk | Parser blocks deterministic response | Availability regression | Fail open to deterministic results |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Schema validation should be small enough for hot retrieval paths.
- **NFR-P02**: Cache hit avoids LLM call.

### Security
- **NFR-S01**: Output IDs must exist in the candidate set.
- **NFR-S02**: Prompt and parser reject invented file paths.

### Reliability
- **NFR-R01**: Timeout, parse failure, or invalid schema fails open.
- **NFR-R02**: Cache hits are revalidated before use.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty candidate set: curator skips.
- Candidate omitted from presented results: allowed if candidate exists in overfetch set.
- Duplicate ID in output: parser deduplicates or rejects deterministically.

### Error Scenarios
- Invalid JSON: fallback.
- Invented ID: fallback.
- Cache entry fails validation: fallback and miss telemetry.

### State Transitions
- Shadow mode: validate and log plan without caller-visible authority.
- Active mode: attach validated plan only after Phase 004 lift gate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Prompt, parser, schema, cache extension |
| Risk | 16/25 | LLM output safety and hot-path fallback |
| Research | 8/20 | Requires LLM cache and reformulation precedent |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for scaffolding. Implementation should choose the exact schema validation library or local validator based on existing dependency policy.
<!-- /ANCHOR:questions -->
