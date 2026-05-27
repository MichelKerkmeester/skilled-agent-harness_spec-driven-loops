---
title: "Implementation Plan: OpenCode Runtime Scenarios (Code Graph Playbook 001)"
description: "Batch-dispatch 15 live-runtime code-graph scenarios to cli-opencode DeepSeek, capturing JSON evidence per scenario."
trigger_phrases:
  - "opencode runtime scenarios plan"
  - "code graph live mcp plan"
  - "029 phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-code-graph-playbook-validation/001-opencode-runtime-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 001 plan"
    next_safe_action: "Render dispatch prompt for group 01-02 batch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-26-code-graph-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: OpenCode Runtime Scenarios (Code Graph Playbook 001)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode CLI dispatch (deepseek/deepseek-v4-pro) |
| **Framework** | mk-code-index MCP runtime + deep-loop coverage graph |
| **Storage** | Disposable workspace copies (no live DB mutation) |
| **Testing** | Manual playbook scenarios, evidence-captured |

### Overview
Dispatch the 15 live-runtime scenarios to `cli-opencode` in playbook-group batches. Each batch dispatch loads the full project MCP runtime once and runs several related scenarios, returning a structured evidence block the orchestrator parses into `evidence.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Playbook scenarios read and classified by surface
- [x] opencode DeepSeek provider confirmed configured
- [ ] Operator green-light on sequential vs parallel dispatch

### Definition of Done
- [ ] 15/15 verdicts recorded with JSON evidence
- [ ] No live-DB mutation (disposable workspace proof)
- [ ] checklist.md P0 items verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator (Claude Code) → cli-opencode dispatch (DeepSeek) → mk-code-index MCP runtime → JSON evidence → orchestrator aggregation.

### Key Components
- **Dispatch prompt renderer**: builds per-batch prompt with scenario contract + evidence requirements (CLEAR-checked).
- **Evidence parser**: extracts `status`, readiness fields, verdict from returned JSON.

### Data Flow
Scenario contract → rendered prompt file → `opencode run --format json` → captured stream → `evidence.md` row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm opencode DeepSeek provider + self-invocation guard clear
- [ ] Render dispatch prompts per group (prompt_quality_card CLEAR check)

### Phase 2: Dispatch & Capture
- [ ] Group 01-02 batch (001-006): scan/query/verify/status/readiness
- [ ] Group 03-04 batch (007, 024, 008): detect_changes + context
- [ ] Group 05 batch (009, 010): coverage graph yaml fire + upsert
- [ ] Group 06 batch (011, 022): tool shape + blast_radius
- [ ] Group 08 batch (015, 023): doctor apply policy + sub-operations

### Phase 3: Verification
- [ ] Parse each dispatch's JSON into evidence.md rows
- [ ] Mark verdicts PASS/FAIL/SKIP with reason
- [ ] Reconcile with feature_catalog cross-reference
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 15 playbook scenarios | cli-opencode + mk-code-index MCP |
| Integration | readiness/self-heal/error shapes | JSON field assertions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode DeepSeek provider | External | Green | All dispatch blocked |
| mk-code-index built dist | Internal | Green | Handler scenarios fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Live-DB mutation detected, or dispatch corrupts state.
- **Procedure**: Discard disposable workspace; no live changes to revert (read-mostly run).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Dispatch & Capture (group batches, sequential) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verification |
| Verification | Dispatch | Parent phase 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 min |
| Dispatch & Capture | High | 2-4 hours (DeepSeek latency) |
| Verification | Med | 30-60 min |
| **Total** | | **~3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Live graph DB path noted; disposable copy used for mutating scenarios
- [ ] No `--dangerously-skip-permissions` in any dispatch

### Rollback Procedure
1. SIGKILL any live `opencode run` dispatch
2. `rm -rf` disposable workspace
3. Confirm live DB untouched (mtime check)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (read-mostly)
<!-- /ANCHOR:enhanced-rollback -->
