---
title: "Plan: Resolve all 007 PARTIALs + DR-032 SKIP (Phase 010)"
description: "Five-category fix plan (grep-tolerance, stale-expectation, live opencode re-run, fixture, scorer) to push 007 toward READY."
trigger_phrases:
  - "resolve all partials plan"
  - "007 phase 010 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/008-deep-stack-playbook-validation/010-resolve-all-partials-and-skip"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All 31 PARTIAL + 1 SKIP resolved - 177/177 PASS, matrix READY"
    next_safe_action: "validate --strict all touched + parent reconcile + report"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Resolve all 007 PARTIALs + DR-032 SKIP (Phase 010)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook scenarios + shell + Node (.cjs) + opencode dispatch |
| **Surface** | deep-ai-council / deep-review / deep-research / deep-agent-improvement playbooks + scripts |
| **Scope** | 31 PARTIAL + 1 SKIP across 5 fix-classes |

### Overview
Resolve every 007 PARTIAL + the DR-032 SKIP by fix-class A–E, re-verify each, flip the 002/003/004/005 ledgers, and re-tally the matrix toward READY — keeping honest residuals where PASS is not achievable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Full PARTIAL/SKIP inventory + per-scenario fix-class assigned
- [x] opencode live-run capability proven (009)

### Definition of Done
- [x] Each PARTIAL/SKIP flipped PASS with evidence, OR kept PARTIAL with a documented reason
- [x] Ledgers + matrix re-tallied; verdict recomputed
- [x] validate --strict green (010 + touched children + parent)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per fix-class: **A** broaden field-greps (case-insensitive / phrasing-tolerant) and re-verify against existing 009 artifacts; **B** confirm implementation correct then correct the stale literal expectation; **C** drive each scenario's command live via opencode (deepseek-direct, `--dir`-bounded `/tmp`) to observe what print-mode codex/devin could not; **D** author a blocked_stop fixture; **E** decide/guard the scorer's empty-dimension output + vitest.

### Key Components
- 002/003/004/005 verdict ledgers; the per-scenario playbook field-greps; `mutation-coverage`/scorer scripts (5D-010); a DR-032 fixture.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory 31 PARTIAL + 1 SKIP; assign fix-classes A–E

### Phase 2: Implementation
- [x] A: grep-tolerance for CP-042/043/046/055/056 + re-verify
- [x] B: investigate + fix DAC-026 + DAC-029..032 stale expectations
- [x] C: live opencode re-runs (DAC-005/006/025, DRV-023/033/034, DR-016/020-024/033, E2E-020..024)
- [x] D: DR-032 blocked_stop fixture + run
- [x] E: 5D-010 scorer decision

### Phase 3: Verification
- [x] Flip 002/003/004/005 ledgers + summary lines (PASS where verified, PARTIAL+reason for residuals)
- [x] Re-tally matrix + recompute verdict; validate --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Re-verify (A) | tolerant grep over existing 009 combined artifacts | grep -i / broadened patterns |
| Live re-run (C) | scenario command via opencode + orchestrator artifact check | opencode run + Read/Bash |
| Regression (E) | deep-agent-improvement suite | vitest (8 files / 99 tests) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode v1.15.11 + DeepSeek API | External | Ready (009) | Cannot live-re-run (C) |
| 009 CP artifacts in /tmp | Internal | Present | A re-verify falls back to full re-run |
| deep-agent-improvement vitest | Internal | Green | Cannot confirm 5D-010 no-regression |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A flip is later found unjustified, or a 5D-010 code change regresses.
- **Procedure**: ledger/scenario edits are git-tracked (`git checkout --`); the 5D-010 change is an isolated guarded block; fixtures are additive.
<!-- /ANCHOR:rollback -->
