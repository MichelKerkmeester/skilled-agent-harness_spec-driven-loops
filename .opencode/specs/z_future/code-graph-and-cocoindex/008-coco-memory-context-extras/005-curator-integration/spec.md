---
title: "Feature Specification: 005 Curator Integration"
description: "Level 2 child packet for memory-search budget split and curator hook integration."
trigger_phrases:
  - "027 011 005 curator integration"
  - "memory curator integration"
  - "memory-search budget split"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/005-curator-integration"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Plan integration after child 004"
    blockers: ["004-curator-prompt"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 005 Curator Integration

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
| **Depends On** | `004-curator-prompt` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The memory search path uses a single presentation limit, so a curator cannot inspect a broader deterministic candidate set while preserving the caller-facing result cap.

### Purpose
Integrate the curator from child 004 into `memory-search.ts` with separate retrieval, presentation, and token budgets, returning `data.curatedContext` without mutating deterministic results.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `retrievalCandidateLimit`, `presentationLimit`, and `curationTokenBudget` behavior.
- Curator hook after deterministic retrieval and before response packaging.
- Shadow/active flag handling with deterministic fallback.
- Telemetry for cache hits, timeouts, parse failures, selected IDs, and omitted high-rank IDs.

### Out of Scope
- Prompt/parser implementation from child 004.
- Any Stage 4 score or ordering mutation.
- Active rollout without Phase 004 lift evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-search.ts` | Modify | Budget split and curator hook integration |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context_curator.ts` | Modify | Integration-facing API adjustments if needed |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/budget-split.vitest.ts` | Create | Budget split and fallback coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve deterministic result ordering and scores | Snapshot proves `data.results` unchanged by curator |
| REQ-002 | Split retrieval and presentation budgets | Tests cover overfetch candidates and caller result cap |
| REQ-003 | Fail open on curator timeout, parse failure, invalid IDs, or disabled provider | Response omits `data.curatedContext` and keeps results |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Attach validated plan as `data.curatedContext` only | Response schema test passes |
| REQ-005 | Emit telemetry for curator outcomes | Tests or logger assertions cover outcome events |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Flag-off and fallback paths return deterministic results only.
- **SC-002**: Active path can attach validated `data.curatedContext`.
- **SC-003**: Budget split tests prove overfetch does not change presentation limit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `004-curator-prompt` | No validated curator API | Keep Track B sequential |
| Risk | Curator mutates Stage 4 output | Retrieval trust regression | Immutable snapshot tests |
| Risk | Overfetch causes latency spike | Hot path slowdown | Bound candidate budget and timeout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Curator timeout is bounded at 1500-2500ms.
- **NFR-P02**: Retrieval candidate default starts in the 100-300 range.

### Security
- **NFR-S01**: Curated context IDs point only into deterministic candidates.
- **NFR-S02**: No invented file paths reach response data.

### Reliability
- **NFR-R01**: Disabled, unavailable, invalid, or timed-out curator fails open.
- **NFR-R02**: Stage 4 score and ordering fields remain immutable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `limit` smaller than candidate budget: presentation result cap is preserved.
- Empty candidate set: curator skipped.
- Valid curated IDs outside presented results but inside candidate set: allowed.

### Error Scenarios
- Curator timeout: omit `data.curatedContext`.
- Parser failure: omit `data.curatedContext`.
- Provider missing: omit `data.curatedContext`.

### State Transitions
- Shadow mode: log plan and telemetry without authoritative response behavior.
- Active mode: attach validated plan after Phase 004 gate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Search integration and tests |
| Risk | 17/25 | Hot-path latency and immutability |
| Research | 7/20 | Requires memory pipeline hook points |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for scaffolding. Implementation should confirm exact hook point against current `memory-search.ts` line structure.
<!-- /ANCHOR:questions -->
