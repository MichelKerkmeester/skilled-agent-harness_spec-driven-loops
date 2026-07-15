---
title: "Tasks: Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "daemon probe before adopt tasks"
  - "stale reclaim reap tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/009-daemon-supervisor-probe-before-adopt"
    last_updated_at: "2026-06-14T17:45:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored task breakdown"
    next_safe_action: "T004 — apply the adopt-gate edit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-daemon-supervisor-probe-before-adopt"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Probe before adopt so the daemon supervisor reaps a live-but-wedged daemon instead of bridging clients into it

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm root cause against source + live incident (gpt-5.5 council, direct read, DB corroboration)
- [x] T002 Locate the probe primitive + tuning defaults (`launcher-ipc-bridge.cjs`, `RESPAWN_REAP_GRACE_MS`)
- [x] T003 Scaffold the Level 3 spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the deep-probe gate to the stale-reclaim adopt branch (`.opencode/bin/mk-spec-memory-launcher.cjs:1580-1588`)
- [x] T005 On a non-alive probe, log and fall through to the existing reap+respawn block — do NOT clear the lease or bridge (`mk-spec-memory-launcher.cjs`)
- [x] T006 Add the SIGSTOP'd-daemon regression case (`.../stress_test/durability/daemon-reelection-adoption-live.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the `daemon-reelection-adoption-live` vitest — baseline 3/3 → 4/4 (new hung-daemon case passes)
- [x] T008 Reconcile completion metadata; run `validate.sh --strict` (RESULT: PASSED, 0/0)
- [ ] T009 Post-implementation deep-review (architectural daemon-lifecycle change)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] vitest passing incl. the new hung-daemon case
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
