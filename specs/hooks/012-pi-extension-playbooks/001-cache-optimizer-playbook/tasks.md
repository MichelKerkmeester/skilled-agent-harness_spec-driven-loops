---
title: "Tasks: Phase 1 cache-optimizer playbook"
description: "Task ledger for the pi-cache-optimizer playbook, harness, and benchmark run."
trigger_phrases:
  - "cache-optimizer playbook tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/012-pi-extension-playbooks/001-cache-optimizer-playbook"
    last_updated_at: "2026-08-17T16:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete: 7/7 scenarios PASS, benchmark recorded"
    next_safe_action: "Continue to 002-deep-pi-playbook"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-17-pi-extension-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 1 cache-optimizer playbook

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T101 Read the `/cache-optimizer` command handler and the `before_provider_request` hook. — command replies and injection gates confirmed in `index.ts`.
- [x] T102 Author 7 scenarios across 3 categories. — `command-surface`, `cache-key-optimization`, `opt-out`.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T103 Build the `node --test` harness driving the real extension via `FakePi`. — asserts command notifications and the `prompt_cache_key` payload mutation.
- [x] T104 Fix the enable-gate isolation so `CACHE-005` injects. — the injection is gated on `runtimeOptimizerEnabled`.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T105 Run the canonical wrapper into `benchmark/reports/`. — folder `2026-08-17--manual-testing-playbook--cache-behavior`.
- [x] T106 Confirm the extension's own `check` stays green. — `53` tests plus typecheck pass.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. — `6` of `6` tasks complete.
- [x] No blocked tasks remain. — `0` blocked tasks.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.

<!-- /ANCHOR:cross-refs -->
