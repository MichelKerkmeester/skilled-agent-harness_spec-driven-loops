---
title: "Implementation Plan: 101 - cli-opencode executor support"
description: "Plan for adding cli-opencode executor support."
trigger_phrases:
  - "101 plan"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/006-cli-opencode-executor"
    last_updated_at: "2026-05-07T21:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 101 - cli-opencode executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript + YAML + Bash |
| **Executor** | Direct (orchestrator) |
| **Storage** | Git working tree |

### Overview
Append cli-opencode to EXECUTOR_KINDS, add allowed-fields entry, insert if_cli_opencode YAML branch in 4 workflow files, rebuild dist.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] cli-opencode skill SKILL.md provides invocation shape

### Definition of Done
- [x] EXECUTOR_KINDS extended
- [x] 4 YAMLs have if_cli_opencode branch
- [x] 33 executor tests pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema extension + YAML branch insertion. No new code paths beyond the 4 YAMLs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

See implementation-summary.md §Files Changed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] T001 Read cli-opencode SKILL.md for invocation shape
- [x] T002 Read executor-config.ts to find extension points

### Phase 2: Implementation
- [x] T010 Append cli-opencode to EXECUTOR_KINDS
- [x] T011 Add EXECUTOR_KIND_FLAG_SUPPORT entry
- [x] T012 Insert if_cli_opencode in 4 deep-loop YAMLs
- [x] T013 Rebuild mcp_server/dist

### Phase 3: Verification
- [x] T020 Run 33 executor-config + executor-audit tests
- [x] T021 Verify 4 YAMLs have if_cli_opencode branch
- [x] T022 Author implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | executor-config schema | vitest |
| Integration | YAML branch presence | grep |
| Runtime | deep-review re-run dispatch | claude -p |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| cli-opencode skill v1.3.0.0 | Internal | Available |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tests fail OR dispatch unusable
- **Procedure**: `git reset --hard <pre-101 SHA>`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Implementation -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | cli-opencode SKILL.md | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase complete |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Setup | 5 min |
| Implementation | 10 min |
| Verification | 5 min |
| **Total** | **~20 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] On main; no conflicting in-flight edits

### Rollback Procedure
1. `git reset --hard <pre-101 SHA>`
2. Confirm executor-config.ts back to 4 EXECUTOR_KINDS
<!-- /ANCHOR:enhanced-rollback -->
