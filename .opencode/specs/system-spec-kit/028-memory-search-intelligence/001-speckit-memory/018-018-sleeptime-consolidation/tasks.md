---
title: "Tasks: Async Sleep-Time Consolidation (governed off-turn reorganization)"
description: "Task Format: T### [P?] Description (file path). Governor-first, default-off, shadow-gated, prove-first. All PENDING — async-sleeptime-consolidation never shipped in Wave-0 (030 §14)."
trigger_phrases:
  - "async sleep-time consolidation tasks"
  - "sleeptime agent tasks"
  - "off-turn reorganization tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/018-018-sleeptime-consolidation"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown; all tasks PENDING (candidate not yet implemented)"
    next_safe_action: "Start T004 — build the tool-rule-DAG governor module"
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
    completion_pct: 0
    open_questions:
      - "Archival-passage substrate need is unresolved; gates the headline candidate"
    answered_questions: []
---
# Tasks: Async Sleep-Time Consolidation (governed off-turn reorganization)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **STATUS: PENDING (Wave-2, prove-first, intelligence-class shadow-gated).** async-sleeptime-consolidation is **absent** from the Wave-0 shipped record (`../../../030-memory-search-intelligence-impl/spec.md` §14 status table), so no task is pre-checked. Gates: needs-design-prototype (greenfield governor + off-turn agent), depends-on-010 (C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate), needs-benchmark (shadow telemetry before any live archival write).

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

- [ ] T001 Confirm the synchronous-only seam from research: `reconsolidation-bridge.ts` runs on-save inline; no background reorganization agent exists (`mcp_server/handlers/save/reconsolidation-bridge.ts`; 028/007 iter-20)
- [ ] T002 Confirm sibling 010 lands the C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate this packet will ride/consume (`../010-010-consolidation-cursor-clock/`)
- [ ] T003 Reserve and document the default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` flag + shadow sub-flag in the flag registry plan (`mcp_server/lib/search/search-flags.ts`)
- [ ] T004 [P] Capture the flag-off synchronous on-save reconsolidation baseline (golden behavior) for the later byte-identical isolation test
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Create the bounded tool-rule-DAG governor with `Init→Child→Continue→Terminal`, a hard step-cap, a cost-ceiling, and a deterministic terminal stop (no early bail) (`mcp_server/lib/cognitive/sleeptime-governor.ts`; ref `voice_sleeptime_agent.py:87-91,132-148`)
- [ ] T006 Add the default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` flag + shadow sub-flag (live archival write stays opt-in even when the agent is enabled) (`mcp_server/lib/search/search-flags.ts`)
- [ ] T007 Create the off-turn `LT-bg-sleeptime-agent`: reorganizes recent transcripts via the governed tool-chain (`store_memories → rethink → finish` analogue); shadow/dry-run default (records, never writes archival) (`mcp_server/lib/cognitive/sleeptime-agent.ts`; ref `voice_sleeptime_agent.py:32-46`, `sleeptime_multi_agent_v4.py:139-165`)
- [ ] T008 Add the off-turn dispatch point in `reconsolidation-bridge.ts`, distinct from the synchronous path; consume sibling 010's `turns_counter % frequency == 0` cadence gate (no second counter) (`mcp_server/handlers/save/reconsolidation-bridge.ts`)
- [ ] T009 Add the `LT-llm-transcript-chunking` LLM-selected-range archival path (`start_index/end_index/context` analogue) alongside the existing markdown-structure chunker, which stays the default (`mcp_server/handlers/chunking-orchestrator.ts`; ref `voice_sleeptime_agent.py:137-175`)
- [ ] T010 Add governor abort/error handling: typed partial/forced-terminal result on tool failure or cost-ceiling; in shadow mode no archival write occurs on abort (`mcp_server/lib/cognitive/sleeptime-agent.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Unit-test the governor bounds: terminates at step-cap, aborts at cost-ceiling, forces a terminal at the end — never unbounded (`mcp_server/__tests__/`)
- [ ] T012 Off-turn isolation test: with the flag off, the synchronous on-save reconsolidation path is byte-identical vs the T004 baseline and zero off-turn archival mutation occurs in shadow mode (`mcp_server/__tests__/`)
- [ ] T013 Idempotency test: an off-turn pass re-driven over 010's clock host + C4-C cursor re-derives the same archival reorganization and never double-applies on a replay (`mcp_server/__tests__/`)
- [ ] T014 Confirm the synchronous path stays unaltered: `git diff` shows only an additive off-turn dispatch hook in `reconsolidation-bridge.ts`; sync behavior unchanged
- [ ] T015 Build and run the shadow telemetry harness: record off-turn reorganization candidates (would-archive ranges, cadence); record numbers and the promote-to-live-opt-in / keep-shadow / drop decision (`mcp_server/__tests__/`)
- [ ] T016 node --check + tsc + existing suite green; `validate.sh --strict` passes on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Governor bounds proven; flag-off off-turn isolation proven (sync byte-identical, zero off-turn archival mutation); idempotency against 010 cursor proven; shadow telemetry numbers recorded; the live-write promotion decision is evidence-based
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Depends-on sibling**: `../010-010-consolidation-cursor-clock/` (C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate)
- **Supplies governor to sibling**: `../016-016-iterative-agentic-recall/` (`CG-agentic-tool-loop` reuses the tool-rule DAG)
- **Shipped record (Wave-0)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (async-sleeptime-consolidation absent → all PENDING)
<!-- /ANCHOR:cross-refs -->
