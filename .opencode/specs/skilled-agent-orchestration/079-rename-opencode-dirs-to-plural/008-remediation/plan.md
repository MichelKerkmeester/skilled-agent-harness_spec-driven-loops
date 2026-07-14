---
title: "Implementation Plan: 103 - 101 cli-opencode regression remediation"
description: "Plan for resolving 2 P1 regressions + 3 P2 advisories from packet 102 deep-review."
trigger_phrases:
  - "103 plan"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/008-remediation"
    last_updated_at: "2026-05-08T01:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 103 - 101 cli-opencode regression remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript + YAML + Bash + vitest |
| **Executor** | Direct (orchestrator) |
| **Storage** | Git working tree |

### Overview
P1 regressions (--pure missing, sandboxMode silent no-op) + P2 advisories (advisor lane, unit tests) for packet 101's cli-opencode executor wiring. Surface-level fixes; no architecture change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 102 review-report.md provides finding details

### Definition of Done
- [x] 2 P1s + 3 P2s closed with file:line evidence
- [x] All tests pass (25 executor-config + 33 combined)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surface fixes in 5 files; rebuild dist; run regression tests.
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
- [x] T001 Read packet 102 review-report finding details
- [x] T002 Identify cosmetic deferral (P2-032)

### Phase 2: Implementation
- [x] T010 P1-027 — Add --pure to 4 if_cli_opencode branches
- [x] T011 P1-028 — Remove sandboxMode from cli-opencode allowed fields + rebuild dist
- [x] T012 P2-027/P2-027r — Add cli-opencode disambiguation regex to explicit.ts
- [x] T013 P2-028 — Add 4 cli-opencode unit-test cases

### Phase 3: Verification
- [x] T020 Run 25-test vitest suite
- [x] T021 Run 33-test combined executor-config + executor-audit suite
- [x] T022 Smoke-test cli-opencode advisor routing
- [x] T023 Smoke-test sandboxMode rejection
- [x] T024 Author implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | executor-config schema | vitest (25 tests) |
| Unit | combined executor suite | vitest (33 tests) |
| Smoke | advisor routing | python3 skill_advisor.py |
| Smoke | sandboxMode rejection | node parser probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Packet 102 review-report.md | Internal | Available |
| Packet 101 (cli-opencode) | Internal | Shipped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tests fail OR new regressions
- **Procedure**: `git reset --hard <pre-103 SHA>`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Implementation -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 102 review available | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase complete |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Setup | 5 min |
| Implementation | 15 min |
| Verification | 10 min |
| **Total** | **~30 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] On main; no conflicting in-flight edits

### Rollback Procedure
1. `git reset --hard <pre-103 SHA>`
2. Confirm executor-config.ts back to 4 supported fields for cli-opencode
<!-- /ANCHOR:enhanced-rollback -->
