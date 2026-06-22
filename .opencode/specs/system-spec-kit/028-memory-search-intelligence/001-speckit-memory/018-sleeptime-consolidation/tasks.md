---
title: "Tasks: Async Sleep-Time Consolidation (governed off-turn reorganization)"
description: "Task Format: T### [P?] Description (file path). Governor-first, default-off, shadow-gated, prove-first. All PENDING, async-sleeptime-consolidation never shipped in Wave-0 (030 §14)."
trigger_phrases:
  - "async sleep-time consolidation tasks"
  - "sleeptime agent tasks"
  - "off-turn reorganization tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/018-sleeptime-consolidation"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented default-off governor, shadow scaffold, flags and deterministic tests"
    next_safe_action: "Consume sibling 010 cadence/cursor before wiring off-turn dispatch or live archival writes"
    blockers:
      - "needs-design-prototype: greenfield governor is gate-zero"
      - "depends-on-010: clock host + cursor + cadence gate"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-018-sleeptime-consolidation"
      parent_session_id: null
    completion_pct: 35
    open_questions:
      - "Archival-passage substrate need is unresolved, gates the headline candidate"
    answered_questions: []
---
# Tasks: Async Sleep-Time Consolidation (governed off-turn reorganization)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **STATUS: SAFE CORE PARTIAL.** The default-off governor, shadow scaffold, flags and deterministic unit tests are implemented. Off-turn dispatch, cursor/cadence consumption, live archival writes and benchmark-backed promotion remain PENDING because sibling 010 owns the clock/cursor gate and no measured shadow delta exists yet.

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

- [x] T001 Confirm the synchronous-only seam from research: `reconsolidation-bridge.ts` runs on-save inline. No background reorganization agent existed before this phase (`mcp_server/handlers/save/reconsolidation-bridge.ts`, 028/007 iter-20)
- [ ] T002 Confirm sibling 010 lands the C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate this packet will ride/consume (`../010-consolidation-cursor-clock/`), PENDING: sibling 010 docs still list the cadence/cursor chain as pending, so this packet must not wire dispatch yet
- [x] T003 Reserve and document the default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` flag + separate live-write opt-in in the flag registry plan (`mcp_server/lib/search/search-flags.ts`, `tests/flag-ceiling.vitest.ts`)
- [ ] T004 [P] Capture the flag-off synchronous on-save reconsolidation baseline (golden behavior) for the later byte-identical isolation test, PENDING: dispatch hook is intentionally not wired until sibling 010 lands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create the bounded tool-rule-DAG governor with `Init→Child→Continue→Terminal`, a hard step-cap, a cost-ceiling and a deterministic terminal stop (no early bail) (`mcp_server/lib/cognitive/sleeptime-governor.ts`, ref `voice_sleeptime_agent.py:87-91,132-148`)
- [x] T006 Add the default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` flag + live archival write opt-in (live archival write stays opt-in even when the agent is enabled) (`mcp_server/lib/search/search-flags.ts`)
- [x] T007 Create the off-turn `LT-bg-sleeptime-agent` shadow scaffold: selects recent transcript ranges via the governed tool-chain. Shadow/dry-run default records without archival writes (`mcp_server/lib/cognitive/sleeptime-agent.ts`, ref `voice_sleeptime_agent.py:32-46`, `sleeptime_multi_agent_v4.py:139-165`)
- [ ] T008 Add the off-turn dispatch point in `reconsolidation-bridge.ts`, distinct from the synchronous path. Consume sibling 010's `turns_counter % frequency == 0` cadence gate (no second counter) (`mcp_server/handlers/save/reconsolidation-bridge.ts`), PENDING: waits on sibling 010 clock/cursor gate
- [ ] T009 Add the `LT-llm-transcript-chunking` LLM-selected-range archival path (`start_index/end_index/context` analogue) alongside the existing markdown-structure chunker, which stays the default (`mcp_server/handlers/chunking-orchestrator.ts`, ref `voice_sleeptime_agent.py:137-175`), PENDING: live archival mutation needs shadow telemetry and benchmark-backed promotion
- [x] T010 Add governor abort/error handling: typed partial/forced-terminal result on tool failure or cost-ceiling. In shadow mode no archival write occurs on abort (`mcp_server/lib/cognitive/sleeptime-agent.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Unit-test the governor bounds: terminates at step-cap, aborts at cost-ceiling, forces a terminal at the end, never unbounded (`mcp_server/tests/sleeptime-governor.vitest.ts`)
- [ ] T012 Off-turn isolation test: with the flag off, the synchronous on-save reconsolidation path is byte-identical vs the T004 baseline and zero off-turn archival mutation occurs in shadow mode (`mcp_server/__tests__/`), PENDING: sync dispatch hook intentionally not wired before sibling 010
- [ ] T013 Idempotency test: an off-turn pass re-driven over 010's clock host + C4-C cursor re-derives the same archival reorganization and never double-applies on a replay (`mcp_server/__tests__/`), PENDING: depends on sibling 010 cursor implementation
- [ ] T014 Confirm the synchronous path stays unaltered: `git diff` shows only an additive off-turn dispatch hook in `reconsolidation-bridge.ts`. Sync behavior unchanged, PENDING: no dispatch hook has been added yet
- [ ] T015 Build and run the shadow telemetry harness: record off-turn reorganization candidates (would-archive ranges, cadence). Record numbers and the promote-to-live-opt-in / keep-shadow / drop decision (`mcp_server/__tests__/`), PENDING: benchmark/live telemetry required before promotion
- [ ] T016 node --check + tsc + existing suite green. `validate.sh --strict` passes on this packet, PENDING until final cross-phase verification
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, PENDING: benchmark/cadence/cursor-dependent tasks remain open by design
- [x] No `[B]` blocked tasks remaining
- [ ] Governor bounds proven. Flag-off off-turn isolation proven (sync byte-identical, zero off-turn archival mutation). Idempotency against 010 cursor proven. Shadow telemetry numbers recorded. The live-write promotion decision is evidence-based, PENDING: governor/flag defaults proven, sync byte-identical dispatch, 010 idempotency and telemetry benchmark still pending
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Depends-on sibling**: `../010-consolidation-cursor-clock/` (C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate)
- **Supplies governor to sibling**: `../016-iterative-agentic-recall/` (`CG-agentic-tool-loop` reuses the tool-rule DAG)
- **Shipped record (Wave-0)**: Wave-0 record (async-sleeptime-consolidation absent → all PENDING)
<!-- /ANCHOR:cross-refs -->
