---
title: "Plan: Phase 2: runtime-code-and-executor-removal"
description: "Technical plan for cli-devin deprecation phase 2"
trigger_phrases:
  - "phase 2 plan"
  - "runtime-code-and-executor-removal plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-cli-devin-deprecation/002-runtime-code-and-executor-removal"
    last_updated_at: "2026-06-08T17:36:07.655Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 2 plan executed"
    next_safe_action: "Proceed to phase 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 2: runtime-code-and-executor-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Remove cli-devin as an executor kind from deep-loop + deep-improvement runtime code and the deep-loop command workflows. Verified line-resolved edit list: ../context/context-report.md §2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every edit applied READ-first, scope-locked to named files.
- No dangling references, no broken syntax, no half-removed blocks.
- Verification command (below) passes before phase is marked complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Surgical reference/edit removal across the cli-devin active-wiring surface; no new abstractions. Canonical content that other skills depend on is re-homed rather than deleted (phase 1). Runtime executor union shrinks from 5 to 4 kinds; remaining executors unaffected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. executor-config.ts: drop cli-devin from EXECUTOR_KINDS + DEVIN_* consts/types/guards
2. executor-audit.ts: drop 5 cli-devin lookup-map entries
3. fanout-run.cjs: drop cli-devin dispatch branch + permission triad
4. dispatch-model.cjs + profile-validator.cjs: drop cli-devin from KNOWN_EXECUTORS
5. Remove if_cli_devin blocks from 3 YAMLs + executor enums from 6 command docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification command:

```bash
npx vitest run tests/unit/executor-config.vitest.ts tests/unit/executor-audit.vitest.ts (56 passed); node -c dispatch-model.cjs
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Predecessor phase complete (see ../spec.md phase map).
- Context Report (../context/context-report.md) as the authoritative edit list.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing is committed during execution; `git restore`/`git checkout` reverts the working-tree changes. Re-homed assets and the deleted skill directory are recoverable from git history until the operator commits.
<!-- /ANCHOR:rollback -->
