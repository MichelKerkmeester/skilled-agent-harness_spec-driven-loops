---
title: "Implementation Plan: Devin Static Scenarios (Code Graph Playbook 002)"
description: "Dispatch 7 static/build/infra + Devin-hook scenarios to cli-devin SWE-1.6 with the prompt-quality contract; capture command evidence."
trigger_phrases:
  - "devin static scenarios plan"
  - "code graph post-rename infra plan"
  - "029 phase 002 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/010-playbook-validation-and-hardening/002-devin-static-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 002 plan"
    next_safe_action: "Render SWE-1.6 RCAF prompt + agent-config recipe"
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
# Implementation Plan: Devin Static Scenarios (Code Graph Playbook 002)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Devin CLI dispatch (swe-1.6) |
| **Framework** | Static source/build inspection + Devin hook registration |
| **Storage** | None (read-only inspection) |
| **Testing** | Manual playbook scenarios, command-evidence captured |

### Overview
Dispatch the 7 static scenarios to `cli-devin` SWE-1.6 with a single RCAF-framed prompt containing a medium-density pre-planning block (3-4 ordered steps + per-step acceptance + verification). Enforce sequential_thinking via the 2-layer pattern and scope writes with an agent-config recipe.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Playbook scenarios read and classified
- [x] devin auth confirmed (Devin Pro; SWE-1.6 free tier)
- [ ] RCAF prompt + agent-config recipe authored and CLEAR-checked

### Definition of Done
- [ ] 7/7 verdicts recorded with command evidence
- [ ] checklist.md P0 items verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator (Claude Code) → cli-devin SWE-1.6 dispatch (RCAF prompt + agent-config) → static inspection/build → command evidence → orchestrator aggregation.

### Key Components
- **RCAF prompt renderer**: Role/Context/Action/Format with embedded pre-planning + per-scenario acceptance.
- **agent-config recipe**: scoped Read/Exec allowlist + system_instructions mandating sequential_thinking ≥5 thoughts.

### Data Flow
Scenario contract → RCAF prompt-file → `devin --model swe-1.6 -p` → captured output → `evidence.md` row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Validation-only phase; no production surfaces are changed. Inspected surfaces:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| launcher / mcp.json / db path | mk-code-index naming + path | inspect (no edit) | grep/read evidence per scenario 017-019 |
| tsconfig + dist entry point | build correctness | inspect (no edit) | tsc build + entry resolution per scenario 020 |
| `.devin/hooks.v1.json` | SessionStart hook registration | inspect (no edit) | read evidence per scenario 025 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] devin self-invocation guard + auth pre-flight
- [ ] One-time `devin mcp add sequential_thinking` (if not present) for the 2-layer pattern
- [ ] Author RCAF prompt-file + agent-config recipe (CLEAR-checked)

### Phase 2: Dispatch & Capture
- [ ] Dispatch 016-021 batch (manifest + post-rename infra) → capture output
- [ ] Dispatch 025 (Devin SessionStart hook) → capture output
- [ ] SIGKILL each dispatch before next

### Phase 3: Verification
- [ ] Parse output into evidence.md rows (7 rows)
- [ ] Mark verdicts PASS/FAIL/SKIP with reason
- [ ] Cross-reference to feature_catalog
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 7 static/infra/hook scenarios | cli-devin SWE-1.6 |
| Build | tsc compile + entry point (020) | typescript |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| devin auth + SWE-1.6 | External | Green | All dispatch blocked |
| mk-code-index source tree | Internal | Green | Inspection scenarios fail |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: SWE-1.6 attempts an unexpected write (permission-mode auto prompts).
- **Procedure**: Deny write; re-dispatch read-only. No live changes expected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Dispatch & Capture (016-021, then 025) ──► Verification
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
| Setup | Low | 20-30 min |
| Dispatch & Capture | Med | 30-60 min (SWE-1.6 fast) |
| Verification | Low | 20-30 min |
| **Total** | | **~1.5-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `--permission-mode auto` (never dangerous)
- [ ] agent-config scopes writes; no live source edit

### Rollback Procedure
1. SIGKILL any live `devin --print` dispatch
2. Confirm no source files modified (git status clean)
3. Record SKIP with reason if dispatch failed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (read-only)
<!-- /ANCHOR:enhanced-rollback -->
