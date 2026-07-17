---
title: "003 — Hybrid Handler Integration"
description: "Wire the semantic matcher into memory_match_triggers as a feature-flagged Stage 2 UNION fallback: lexical-first precision preserved, strong-command short-circuit, source-tagging, and reduced cognitive activation for semantic-only hits."
trigger_phrases:
  - "027 phase 004 hybrid handler"
  - "memory_match_triggers stage 2"
  - "hybrid trigger union"
  - "semantic activation guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler"
    last_updated_at: "2026-06-10T10:25:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented hybrid handler union fallback"
    next_safe_action: "Hand off env docs to phase 004"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 003 — Hybrid Handler Integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-semantic-matcher |
| **Successor** | 004-tests-goldens-shadow-eval |
| **Handoff Criteria** | Flag-off output is bit-identical to current behavior; semantic-only hits are source-tagged and activate at reduced attention. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the semantic trigger fallback decomposition (parent `004-semantic-trigger-fallback`).

**Scope Boundary**: Handler wiring in `memory_match_triggers` only — Stage 2 gate, UNION, short-circuit, source-tagging, activation guards. The matcher (`002`) and goldens/shadow eval (`004`) are out of scope.

**Dependencies**:
- `002-semantic-matcher` (the gated cosine matcher this handler calls).

**Deliverables**:
- Stage 2 semantic gate after the existing lexical stage (feature-flagged).
- Strong-command short-circuit (no embed/lookup when an explicit command matches).
- UNION semantics with lexical precedence; per-match source-tagging.
- Cognitive activation guards: lexical `1.0`, semantic `min(0.85, score)`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The semantic matcher must be merged into `memory_match_triggers` without weakening the lexical control surface. Trigger matches feed cognitive activation (`memory-triggers.ts:360-380`); a careless merge would let semantic false positives masquerade as exact triggers and mis-prioritize tiers.

### Purpose
Add a feature-flagged Stage 2 that runs only when lexical is empty/weak, unions results with lexical precedence, tags match source, and caps semantic activation — keeping flag-off behavior bit-identical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stage 2 semantic gate added after the lexical stage in `mcp_server/handlers/memory-triggers.ts` (insertion after `.slice(0, limit)` per parent iter-035): fires only when `SPECKIT_SEMANTIC_TRIGGERS=true` AND lexical empty/weak.
- Strong-command short-circuit: explicit command match → no embed/lookup call.
- UNION semantics: lexical hits first, then semantic hits not already present (dedup).
- Activation guards (`memory-triggers.ts:360-380`): lexical `attention=1.0`; semantic `attention=min(0.85, semanticScore)`.
- Source-tagging: `matchSource: 'lexical'|'semantic'`, optional `semanticScore`.
- Integration tests + a flag-off lexical-parity diff test.

### Out of Scope
- The matcher internals - owned by `002-semantic-matcher`.
- ENV flag documentation, goldens, shadow telemetry analysis - owned by `004` (this phase only reads the master flag + mode).
- Embedding generation - owned by `001` (runtime cache-read-only).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-triggers.ts` | Modify | Stage 2 gate, short-circuit, UNION, source-tag, activation guards |
| `mcp_server/tests/hybrid-trigger-handler.vitest.ts` | Create | 2-stage handler integration tests |
| `mcp_server/tests/lexical-parity.vitest.ts` | Create | Flag-off and shadow-default parity tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lexical matching remains PRIMARY; zero behavior change for explicit triggers when flag off | Diff test: flag-off output bit-identical on `/memory:save`, `save context`, `resume iteration`, CJK fixtures |
| REQ-002 | Semantic fires ONLY when lexical empty/weak; UNION (not replacement) | Lexical-strong → only lexical; lexical-empty + paraphrase → semantic returned with `matchSource:"semantic"` |
| REQ-003 | Strong lexical command matches short-circuit Stage 2 (no embed/lookup) | Trace assertion: explicit command match → matcher/lookup NOT called |
| REQ-008 | Activation guards: semantic-only `attention=min(0.85, score)`; lexical `1.0` | Unit test on the `memory-triggers.ts:360-380` activation block |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Semantic-only hits source-tagged with `semanticScore` + matched phrase in the result envelope | Snapshot test on result envelope |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Flag-off output is bit-identical to current behavior (diff test green).
- **SC-002**: Lexical-empty paraphrase returns a source-tagged semantic hit at reduced activation; strong command short-circuits with no matcher call.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lexical regression from handler refactor | High | Flag-off bit-identical diff test in CI; existing suite unchanged |
| Risk | Semantic false positives mis-prioritize cognitive tiers | High | Short-circuit + reduced-activation guard + source-tag; default-off / shadow-first (mode owned by `004`) |
| Dependency | `002-semantic-matcher` | High | Handler calls the matcher; cold-start / cache-miss → Stage 2 skipped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should semantic-only trigger hits activate working memory at reduced score, or only retrieve content without activation until proven? (inherited from parent 007)
- What exactly classifies a lexical hit as "weak" enough to trigger Stage 2 (no `passes_threshold`)?

Resolved during implementation: weak lexical means no lexical hits or fewer lexical hits than the requested limit, excluding exact strong lexical matches.

Doc drift noted: the scaffolded test paths used `mcp_server/__tests__/triggers/`, but this repository uses `mcp_server/tests/*.vitest.ts`.
<!-- /ANCHOR:questions -->
