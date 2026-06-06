---
title: "Implementation Plan: Phase 3: feedback-log-and-008-reframe [template:level_1/plan.md]"
description: "Keep the feedback ledger shadow-only, reserve system feedback artifact types at the write boundary, and document symmetric-damping / rare-but-correct / constitutional-immunity invariants for any future reducer. Mostly validation + scoping, little new code."
trigger_phrases:
  - "feedback ledger shadow only plan"
  - "reserve feedback type write boundary"
  - "defer active reducers ledger quality"
  - "symmetric damping invariant future reducer"
  - "008 reframe diagnostics first plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/007-memclaw-derived-memory-hardening/003-feedback-log-and-005-reframe"
    last_updated_at: "2026-06-06T10:10:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populated implementation plan for the 008 feedback reframe"
    next_safe_action: "Begin T001 audit of feedback-ledger shadow-only guarantees"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-feedback-log-and-005-reframe"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: feedback-log-and-008-reframe

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js (Spec Kit Memory MCP server) |
| **Framework** | Local single-user MCP server (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite index + vector store |
| **Testing** | vitest |

### Overview
This phase ratifies the existing shadow-first feedback posture rather than building new behavior. The feedback ledger stays shadow-only (event-capture + diagnostics, no ranking/retention/FSRS effects), the system-generated feedback artifact types are reserved at the write boundary so callers cannot forge learning signals, and the symmetric-damping / rare-but-correct / constitutional-immunity invariants are documented for any future reducer. Active reducers remain deferred until measured ledger quality justifies one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shadow-first event-capture layer in front of an unchanged ranking/retention/FSRS core. Feedback is observed and logged for diagnostics; it is structurally prevented from mutating retrieval state. Reserved feedback artifact types are validated at the write ingress (schema boundary), and the future-reducer invariants are documented but not implemented.

### Key Components
- **Feedback ledger (`lib/feedback/feedback-ledger.ts`)**: shadow-only capture of implicit feedback events (the existing fixed event types: `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, `follow_on_tool_use`); confirmed to have NO ranking side-effects.
- **Query-flow tracker (`lib/feedback/query-flow-tracker.ts`)**: derives follow-on / requery signals; confirmed diagnostic-only.
- **Batch learning (`lib/feedback/batch-learning.ts`)**: shadow-gated aggregation writing to a shadow log (`batch_learning_log`); confirmed to mutate no live ranking columns, active effects stay deferred.
- **Reserved-type validation (`schemas/tool-input-schemas.ts`)**: the write boundary that reserves system feedback artifact types and rejects forged feedback writes; no public feedback-write tool is exposed.
- **Context server (`context-server.ts`)**: logs follow-on tool use; confirmed to emit system-stamped events only.

### Data Flow
Search/usage activity emits implicit feedback events; the ledger records them (shadow-only) with server-stamped types; the query-flow tracker and batch-learning derive aggregate diagnostics into shadow logs; nothing on this path writes retrieval score, retention, or FSRS state. A user/agent write that tries to supply a reserved feedback type is rejected at the schema boundary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `schemas/tool-input-schemas.ts` (write-ingress schema) | Validates tool input; the place a forged feedback type would have to pass | update (reserve system feedback types; reject forged writes) | vitest: forged-feedback-rejected; `rg -n 'feedback' schemas/tool-input-schemas.ts` |
| `lib/feedback/feedback-ledger.ts` (producer) | Shadow-only event capture, fixed event types, no ranking side-effects | unchanged (confirm + assert in tests) | vitest: no-ranking-side-effect; `rg -n 'weight\|rank\|fsrs\|retention' lib/feedback/feedback-ledger.ts` |
| `lib/feedback/batch-learning.ts` (consumer) | Shadow-gated aggregation into `batch_learning_log` | unchanged (confirm shadow-gating; active effects deferred) | `rg -n 'shadow\|SPECKIT_BATCH_LEARNED_FEEDBACK\|batch_learning_log' lib/feedback/batch-learning.ts` |
| `context-server.ts` (producer) | Logs follow-on tool use as implicit feedback | unchanged (confirm system-stamped types only) | `rg -n 'feedback\|recordFeedback\|follow_on' context-server.ts` |
| `005-learning-feedback-reducers/**` (downstream specs/docs) | Active-reducer child specs | not a consumer here (coordination note only; no edits) | doc: coordination note in spec/tasks naming the deferred children |

Required inventories:
- Same-class producers: `rg -n 'recordFeedback|FeedbackEvent|feedback_event' .opencode/skills/system-spec-kit/mcp_server/lib/feedback .opencode/skills/system-spec-kit/mcp_server/context-server.ts`.
- Consumers of changed symbols: `rg -n 'FeedbackEventType|reserved.*feedback|feedback.*type' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'`.
- Matrix axes: feedback-type source (system-stamped vs user/agent-supplied) x write path (ledger record vs public tool input) — required rows: system-stamped accepted, user/agent forged rejected.
- Algorithm invariant: feedback may never demote or archive a constitutional/protected memory, and damping (if any future reducer is built) must be symmetric/soft with a rare-but-correct guard; adversarial case = a single mis-attributed failure on a sparse, high-tier memory must not change its retrieval state.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the feedback ledger is shadow-only (no retrieval-score / retention / FSRS side-effects)
- [ ] Audit the current reserved/stamped feedback event/artifact types and how callers reach them
- [ ] Confirm batch-learning + query-flow-tracker stay shadow-gated / diagnostic-only

### Phase 2: Core Implementation
- [ ] Reserve the system-generated feedback artifact types server-side; reject forged feedback writes at the schema boundary (no public feedback-write tool)
- [ ] Document the symmetric-damping + rare-but-correct + constitutional-immunity invariants for any future reducer
- [ ] Add the coordination note rescoping the `005-learning-feedback-reducers/` active-reducer children to diagnostics-first / deferred (no edits to those specs)

### Phase 3: Verification
- [ ] vitest: forged feedback writes are rejected (reserved-type rejection)
- [ ] vitest: the ledger path produces no ranking / retention / FSRS side-effects (shadow-only assertion)
- [ ] Documentation updated (spec/plan/tasks); manual verification of the invariants + coordination note
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reserved-type rejection: a write supplying a reserved/system feedback type is refused; system-stamped record path succeeds | vitest |
| Unit | Shadow-only assertion: recording feedback events mutates no live ranking / retention / FSRS columns | vitest |
| Manual | Confirm no public feedback-write tool is exposed; confirm invariant docs + 008 coordination note are present and accurate | Read / grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001-provenance-and-audit (`source_kind`) | Internal | Yellow (planned, not implemented) | A future reducer cannot distinguish system-stamped feedback from forged writes; reserve the `feedback` artifact types on top of 001's provenance |
| Existing shadow-only feedback substrate (`lib/feedback/**`) | Internal | Green (already shadow-only) | If substrate were not shadow-only, the reframe would require new gating rather than confirmation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reserved-type validation rejects legitimate system-stamped events, or a confirmation test reveals an unexpected live side-effect on the ledger path.
- **Procedure**: Low risk - this phase is mostly validation + documentation. Revert the schema-boundary reservation commit (restore prior `tool-input-schemas.ts`); the ledger/tracker/batch-learning remain unchanged shadow-only code, and the invariant docs + coordination note are inert text that can be removed without affecting runtime behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: confirm shadow-only) ──► Phase 2 (Core: reserve types + invariant docs) ──► Phase 3 (Verify: vitest + manual)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 provenance (`source_kind`) landed | Core |
| Core | Setup (shadow-only confirmed) | Verify |
| Verify | Core (reserved-type guard + invariant docs in place) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours (audit ledger/tracker/batch-learning for shadow-only guarantees) |
| Core Implementation | Med | 2-4 hours (reserve system feedback types at the schema boundary, write invariant docs, add the 008 coordination note) |
| Verification | Med | 2-3 hours (vitest: forged-type rejection, shadow-only assertion, rare-but-correct guard) |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Active reducers confirmed default-off (ledger + batch-learning shadow-only) before the reserved-type guard merges
- [ ] No public feedback-write tool is exposed by the change
- [ ] vitest reserved-type and shadow-only suites green

### Rollback Procedure
1. Revert the `schemas/tool-input-schemas.ts` reserved-type commit (the only runtime-affecting change)
2. Confirm the ledger/tracker/batch-learning are untouched (no rollback needed; they were unchanged shadow-only code)
3. Re-run the shadow-only vitest assertion to confirm the recall path has no live side-effect
4. Remove the invariant docs + 008 coordination note if reverting fully (inert text, no runtime effect)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no schema migration or backfill; the feedback ledger remains a shadow log with no live ranking/retention/FSRS column writes.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
