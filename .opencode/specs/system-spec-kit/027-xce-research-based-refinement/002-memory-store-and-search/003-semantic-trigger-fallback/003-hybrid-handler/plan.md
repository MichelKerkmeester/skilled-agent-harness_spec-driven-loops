---
title: "Implementation Plan: 003 — Hybrid Handler Integration"
description: "Wire Stage 2 semantic fallback into memory_match_triggers behind the master flag: short-circuit on strong lexical, UNION with lexical precedence, source-tag, and reduced-activation guards. Flag-off stays bit-identical."
trigger_phrases:
  - "027 phase 004 hybrid handler plan"
  - "memory_match_triggers stage 2 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler"
    last_updated_at: "2026-06-10T10:25:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified hybrid handler implementation"
    next_safe_action: "Hand off mode flag docs to phase 004"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 003 — Hybrid Handler Integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | Reads cached embeddings via `002` matcher |
| **Testing** | Vitest |

### Overview
Add a feature-flagged Stage 2 to `memory_match_triggers` after the lexical stage, calling the `002` matcher only when lexical is empty/weak, unioning with lexical precedence, source-tagging, and capping semantic activation. Flag-off remains bit-identical.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `002-semantic-matcher` available.
- [x] Insertion point confirmed after lexical stage.
- [x] Activation block confirmed and guarded by source.

### Definition of Done
- [x] Flag-off parity test stable for slash, plain, resume, and CJK prompts.
- [x] Short-circuit trace assertion green; matcher not called.
- [x] UNION + activation-guard tests green.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-flagged staged pipeline; fail-closed to lexical-only.

### Key Components
- **Stage 2 gate**: master flag + lexical empty/weak + not strong-command + below top_k.
- **UNION merge**: lexical first, semantic dedup.
- **Activation guard**: `attention = matchSource === 'semantic' ? min(0.85, score) : 1.0`.

### Data Flow
prompt → Stage 1 lexical (unchanged) → short-circuit gate → Stage 2 semantic (via `002`) → UNION → activation guards → activation pipeline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm matcher interface from `002` and the handler insertion point.
- [x] Confirm result-envelope type additions (`matchSource`, `semanticScore?`).

### Phase 2: Core Implementation
- [x] Add Stage 2 gate + strong-command short-circuit.
- [x] Implement UNION semantics with lexical precedence.
- [x] Add activation guards + source-tagging.

### Phase 3: Verification
- [x] Flag-off lexical-parity diff test.
- [x] Hybrid-handler integration tests (UNION, short-circuit, activation).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | 2-stage handler scenarios | Vitest |
| Diff | Flag-off bit-identical to current | Vitest snapshot |
| Trace | No matcher call on strong command | Vitest spy |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-semantic-matcher` | Internal | Pending | No Stage 2 source; lexical-only |
| `001-schema-backfill` | Internal | Pending | No cached embeddings; cold-start skip |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Lexical regression or unacceptable semantic false-positives.
- **Procedure**: Set `SPECKIT_SEMANTIC_TRIGGERS=false` → immediate revert to lexical-only (bit-identical). No schema change here.
<!-- /ANCHOR:rollback -->
