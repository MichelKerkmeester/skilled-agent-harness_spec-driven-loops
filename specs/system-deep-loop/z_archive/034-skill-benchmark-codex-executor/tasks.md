---
title: "Tasks: Runtime-hosted cli-codex dispatch helper + thin skill-benchmark codex executor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "codex transport tasks"
  - "codex executor tasks"
  - "runtime codex dispatch tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-skill-benchmark-codex-executor"
    last_updated_at: "2026-07-15T15:15:00Z"
    last_updated_by: "claude"
    recent_action: "All in-scope tasks complete through the Tier-1 synthesis"
    next_safe_action: "Commit packet 068"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/034-skill-benchmark-codex-executor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Runtime-hosted cli-codex dispatch helper + thin skill-benchmark codex executor

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read the cli-codex contract; confirm the single-adapter hard rule and the runtime as codex authority [Evidence: cli-codex/SKILL.md frontmatter `hard_rules.deep-loop-runtime-required` severity=error]
- [x] T002 Read fanout-run's codex branch for flag/kill parity [Evidence: fanout-run.cjs:1385-1400 `buildLineageCommand` cli-codex arm]
- [x] T003 [P] Confirm the scorer treats `activation: null` as unmeasured, not a miss [Evidence: score-skill-benchmark.cjs:1078 `obs.activation ? obs.activation.activated : undefined`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build the runtime single-shot codex dispatch helper (`runtime/scripts/codex-dispatch.cjs`) [Evidence: `node --check` PASS; manual CLI dispatch returns JSON result]
- [x] T005 Build the thin codex executor reusing the opencode prompt + parsers (`skill-benchmark/codex-executor.cjs`) [Evidence: `parseCodexResult` unit emits the scorer shape with `transport: codex`]
- [x] T006 Export `hasRouteGold` to single-source the route-gold predicate (`skill-benchmark/live-executor.cjs`) [Evidence: `require(live-executor).hasRouteGold` typeof === function]
- [x] T007 Wire the `executor==='codex'` branch into the live dispatch path (`skill-benchmark/executor-dispatch.cjs`) [Evidence: loop-host `SKILL_BENCHMARK_RUN_OPTIONS` includes `executor`; DI-R03 routed to codex-executor]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Syntax + import-chain + `parseCodexResult` shape checks [Evidence: `node --check` PASS on 5 files; import chain resolves `../../../runtime/scripts/codex-dispatch.cjs`]
- [x] T009 Mode-A regression baseline [Evidence: `npx vitest run skill-benchmark` = 19 failed / 131 passed identical with vs without edits (HEAD round-trip), delta 0]
- [x] T010 Live smoke both transports on one scenario [Evidence: DI-R03 opencode PASS/100 `eventCount:6`; codex PASS/100 `eventCount:0`; both `statedRoutingParsed:true`]
- [x] T011 Live Tier-1 benchmark batch + synthesis [Evidence: opencode 86, codex 85, 9/9 parsed, 0 errors; `transport-comparison.md` + `artifacts/tier1-*.report.json`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All in-scope tasks marked `[x]` (T011 done; Tier-2 is a separate deferred operator decision)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (both transports dispatch + parse + score)
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
