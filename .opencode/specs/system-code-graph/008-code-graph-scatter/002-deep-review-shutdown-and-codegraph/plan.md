---
title: "Implementation Plan: opus-4.8 deep review (011)"
description: "Execution plan for the 10-round opus-4.8 deep-review workflow + reduction into canonical deep-review state and a 9-section report."
trigger_phrases:
  - "opus deep review 011"
  - "deep review shutdown codegraph"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/002-deep-review-shutdown-and-codegraph"
    last_updated_at: "2026-05-29T14:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Review run + reduction complete (CONDITIONAL)"
    next_safe_action: "Open a remediation packet for the 9 P1 findings"
    blockers: []
    key_files:
      - "review/review-report.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: opus-4.8 Deep Review (011)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP servers (system-spec-kit + system-code-graph) |
| **Framework** | Workflow tool (opus-4.8 agents) reproducing the deep-review contract |
| **Storage** | review/ state packet (jsonl + iterations + registry + report) |
| **Testing** | read-only review (no test run) |

### Overview
Ten fresh-context opus-4.8 iterations across the four deep-review dimensions over the daemon-shutdown + code-graph surface; adversarial P0 replay per iteration; main agent reduces results into canonical state + a 9-section review-report.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope + dimensions defined; review packet + config initialized
- [x] Tension (skill-vs-workflow) resolved by reproducing the full contract

### Definition of Done
- [x] 10 iterations, 4 dimensions, per-iteration verdict lines
- [x] Findings carry [SOURCE:file:line]; P0s adversarially replayed (0 raised)
- [x] 9-section review-report.md + verdict + release-readiness state
- [x] validate.sh --strict exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow pipeline (review → adversarial verify) per iteration; main agent = single state-writer (mirrors reduce-state.cjs).

### Key Components
- **Workflow** `watmqyld2`: 10 opus-4.8 review agents + per-iteration P0 replay.
- **Reducer** (main agent): dedup by content_hash, compute verdict, emit canonical state + report.

### Data Flow
opus iteration (fresh ctx, scoped files) → structured findings → adversarial P0 replay → reduce → state.jsonl + iterations + registry + dashboard + review-report.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Review-only (no code changed). Reviewed surface:

| Surface | Role | Action | Verification |
|---------|------|--------|--------------|
| vector-index-store.ts / context-server.ts / shutdown-hooks.ts | spec-memory shutdown/WAL | reviewed | iterations 1,8,9 |
| ensure-ready.ts / code-graph-db.ts / owner-lease.ts / phase-runner.ts / structural-indexer.ts / index-scope-policy.ts | code-graph runtime | reviewed | iterations 2,3,7 |
| tool-schemas.ts / handlers/* | code-graph surface | reviewed | iterations 2,3 |
| 008/009/010/012 packets | spec-alignment | reviewed | iterations 4,5 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Resolve scope, tensions; init review packet + config + strategy

### Phase 2: Core Implementation
- [x] Run 10-round opus-4.8 workflow; adversarial P0 replay

### Phase 3: Verification
- [x] Reduce → canonical state + 9-section report; validate.sh --strict; index via MCP
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Review (read-only) | 4 dimensions × 10 iterations | opus-4.8 agents |
| Adversarial | per-iteration P0 refute-or-confirm | opus-4.8 agents |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Workflow tool + opus-4.8 | Internal | Green | executor for the review |
| On-disk source (moving tree) | Internal | Yellow | parallel session edits; findings cite current lines |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: review findings disputed.
- **Procedure**: review is read-only + reproducible; re-run the workflow. No code to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Review (10 iters) ──► Reduce/Synthesize
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Review |
| Review | Setup | Reduce |
| Reduce | Review | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 h |
| Review (workflow) | High | ~4.5 min wall / 780K tokens |
| Reduce/Synthesize | Med | 1 h |
| **Total** | | **~2 h + workflow** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Read-only review (no code mutated)
- [x] All findings cite file:line

### Rollback Procedure
1. Re-run workflow `watmqyld2` (reproducible).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
