---
title: "Plan: CP copilot → opencode Executor Swap (007 Phase 009)"
description: "Fix plan for swapping 18 copilot CP scenarios to opencode deepseek-direct, restoring the pruned fixture, and re-running."
trigger_phrases:
  - "cp copilot opencode swap plan"
  - "007 phase 009 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/009-cp-copilot-to-opencode-swap"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "18 CP re-run via opencode/deepseek - 13 PASS 5 PARTIAL 0 FAIL"
    next_safe_action: "Validate --strict all touched packets + parent reconcile"
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
# Plan: CP copilot → opencode Executor Swap (007 Phase 009)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbook scenarios + shell command blocks |
| **Surface** | deep-review / deep-research / deep-agent-improvement manual_testing_playbook |
| **Scope** | 18 scenario files (30 invocations) + 1 fixture restore + 007 ledger/matrix reconcile |

### Overview
Swap the copilot executor for `opencode run` (deepseek-v4-pro via direct DeepSeek API) in the 18 copilot-driven CP stress scenarios, restore the pruned `060-stress-test` fixture from git, re-run all 18, orchestrator-verify, and flip the 007 SKIPs + matrix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] opencode prototype proves `/deep:*` expansion + artifact creation (CP-046)
- [x] DeepSeek API provider configured; opencode v1.15.11 installed

### Definition of Done
- [x] Zero `copilot -p` remain in the 3 CP categories
- [x] All 18 re-run via opencode with orchestrator-verified verdicts
- [x] 007 ledgers + matrix reconciled; validate --strict green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Executor-host swap only. `copilot -p "<P>" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir <S> [--add-dir <SP>]` → `opencode run "<P>" --model deepseek/deepseek-v4-pro --dangerously-skip-permissions --dir <S> </dev/null`. Prompt, capture (`2>&1 | tee`), exit echo, and all grep-checkable verification stay byte-identical. NO `--pure` (it disables the `.opencode/` command runtime). `--dir` pins blast radius to the `/tmp` sandbox.

### Key Components
- **18 scenario `.md` files**: the swap transform (idempotent).
- **`060-stress-test` fixture**: git-recovered (4 runtime forms) to the current plural path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Prototype CP-046 Call B via opencode; confirm `/deep:*` expands + artifacts
- [x] Restore `060-stress-test` fixture from git; deep-agent-improvement setup runs clean

### Phase 2: Implementation
- [x] Apply copilot→opencode transform to all 18 files (30 invocations)
- [x] Assert zero `copilot -p` remain

### Phase 3: Verification
- [x] Re-run all 18 via opencode; orchestrator-verify artifacts + tripwire
- [x] Flip 007 child ledger SKIPs; re-tally matrix; validate --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Per-scenario | grep-checkable field counts (scenario's own block) | opencode run + grep + diff |
| Anti-fabrication | orchestrator re-inspects produced /tmp artifacts + diffs | Read/Bash at repo root |
| Boundary | per-scenario git tripwire (no repo mutation) | git status --porcelain |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode v1.15.11 + DeepSeek API provider | External | Ready | Cannot dispatch |
| `060-stress-test` fixture (git) | Internal | Restored | CP-040..045 cannot run |
| deep-review/deep-research setup scripts | Internal | Runnable | CP-046..057 cannot seed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The swap breaks a scenario or the deepseek driver proves unusable.
- **Procedure**: `git checkout -- <scenario files>` reverts the swap (git-tracked); the fixture restore is additive under test-fixtures. No runtime/skill-logic changes to roll back.
<!-- /ANCHOR:rollback -->
