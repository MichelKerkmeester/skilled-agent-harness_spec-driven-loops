---
title: "Implementation Plan: 001 Harness Skeleton"
description: "Level 2 plan for the code graph adoption eval CLI skeleton and loader contracts."
trigger_phrases:
  - "027 006 001 plan"
  - "harness skeleton plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-code-graph-adoption-eval/001-harness-skeleton"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 plan.md"
    next_safe_action: "Implement Harness Skeleton work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-001-harness-skeleton"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 001 Harness Skeleton

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CLI / TypeScript-adjacent dist script |
| **Framework** | system-spec-kit eval tooling |
| **Storage** | JSONL run output |
| **Testing** | Vitest via child 005 |

### Overview
Build the first sequential piece of the eval harness: a CLI skeleton that can parse configuration, load pluggable modules, define run matrix semantics, and create the output contract that downstream children consume.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Parent phase dependencies are recorded.
- [ ] CLI path and output convention are confirmed.

### Definition of Done
- [ ] CLI dry-run produces baseline/after matrix.
- [ ] Loader seams exist for token measurement, fixtures, and reporting.
- [ ] Strict validation passes for this child packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin CLI orchestrator with injected helpers.

### Key Components
- **Argument parser**: validates task count, run count, conditions, and paths.
- **Module loader**: resolves helpers for metrics, fixtures, and report generation.
- **Run matrix builder**: expands tasks across baseline and after conditions.
- **Output writer seam**: writes incremental JSONL rows in a later implementation step.

### Data Flow
Arguments become normalized config, config loads task definitions, tasks expand into condition runs, and each run emits result rows for later report generation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Locate existing eval script conventions.
- [ ] Define CLI args and config defaults.

### Phase 2: Core Implementation
- [ ] Add CLI skeleton.
- [ ] Add module-loader functions.
- [ ] Add dry-run matrix output.

### Phase 3: Verification
- [ ] Run targeted syntax check.
- [ ] Validate child spec packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | CLI loads without parse/runtime errors | Node |
| Unit/Integration | Dry-run matrix and injectable seams | Vitest in child 005 |
| Validation | Spec folder structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent 006 phase parent | Internal | Planned | Child should not start without parent metadata |
| Downstream children | Internal | Pending | Skeleton must avoid depending on unimplemented modules at dry-run time |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: CLI skeleton blocks downstream children or violates existing eval layout.
- **Procedure**: Remove the skeleton file and keep child docs as pending until a narrower contract is authored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent scaffold | Core implementation |
| Core implementation | Setup | Children 002, 003, 004 |
| Verification | Core implementation | Child 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium | 1.5-2 hours |
| Verification | Low | 20 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Dry-run path does not call providers.
- [ ] Output directory stays under the configured run path.

### Rollback Procedure
1. Remove the CLI skeleton.
2. Re-run strict validation for this child.
3. Keep parent child dependency map intact unless the child is intentionally cancelled.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete generated eval run files if any dry-run output was written.
<!-- /ANCHOR:enhanced-rollback -->

