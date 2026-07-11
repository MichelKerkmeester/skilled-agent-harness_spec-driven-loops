---
title: "Tasks: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sentinel sweep tasks"
  - "telemetry rotation tasks"
  - "state cleanup task list"
  - "sweepStaleSentinelState tasks"
  - "plugin state cleanup work items"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/008-plugin-state-cleanup"
    last_updated_at: "2026-07-11T13:12:24Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs scoping both state-cleanup gaps"
    next_safe_action: "Implement sweepStaleSentinelState + telemetry rotation per plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/plugins/mk-completion-sentinel.js"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs"
      - ".opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-plugin-state-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Confirm the telemetry cap default (1 MiB) and dedup retention default (30 days) match operator expectations for signal retention versus disk footprint."
      - "Confirm whether the singular .opencode/skill/ path was ever a real write target in any environment before reconciling telemetryFilePath to the plural .opencode/skills/ live dir."
    answered_questions: []
---
# Tasks: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm the exemplar sweep/rotate idiom and throttle wiring (spec-gate-core.mjs:162-323, mk-spec-gate.js:163,170-175)
- [ ] T002 Add retention + interval env constants to the sentinel core: MK_COMPLETION_SENTINEL_RETENTION_DAYS (default 30), MK_COMPLETION_SENTINEL_SWEEP_INTERVAL_MS (default 3600000) (.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs)
- [ ] T003 [P] Add SPECKIT_SMART_ROUTER_TELEMETRY_MAX_BYTES (default 1048576) to the telemetry script (.opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement sweepStaleSentinelState(stateDir, runtimeState): prune advisory-dedup.json entries past the retention window (atomic rewrite via writeDedupStoreAtomic), remove stray *.tmp files, age-prune <log>.1, throttle via runtimeState.lastSentinelSweepAtMs + interval; export it (.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs)
- [ ] T005 Invoke the sweep on session.created (throttled, try/catch best-effort): add a runtimeState closure and resolve stateDir via the core in the plugin event handler (.opencode/plugins/mk-completion-sentinel.js)
- [ ] T006 Invoke the sweep best-effort around Stop processing in the Claude adapter (.opencode/skills/system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs)
- [ ] T007 Add pre-append size cap + single-backup rotation to appendJsonl and reconcile the singular->plural write path in locateRepoRoot + telemetryFilePath (.opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts)
- [ ] T008 Ensure every new sweep/rotation step is fail-open (per-entry/per-step try/catch); a rotation failure still appends the record (.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs, .opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add sentinel sweep unit tests: stale+fresh store -> only fresh survives; stale *.tmp removed; stale <log>.1 removed; corrupt store no-op; throttle short-circuit (.opencode/skills/system-spec-kit/mcp_server/tests/completion-evidence-sentinel.vitest.ts)
- [ ] T010 Add adapter-invocation tests: session.created triggers the throttled sweep and fails open (new .opencode/plugins/tests/mk-completion-sentinel.test.cjs); Stop best-effort sweep fails open (.opencode/skills/system-spec-kit/mcp_server/tests/hook-completion-evidence-stop.vitest.ts)
- [ ] T011 Add telemetry rotation tests: over-cap rotates to .1 and continues appending; rotation failure still appends; cap env-tunable; path reconciled to plural (.opencode/skills/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts)
- [ ] T012 Run the changed vitest suites + the plugin test; run validate.sh --strict; confirm MK_COMPLETION_SENTINEL_DISABLED=1 full no-op and no stdout/stderr from the plugin or core
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
