---
title: "Implementation Plan: Async Sleep-Time Consolidation (governed off-turn reorganization)"
description: "Prove-first plan to add a background, cadence-gated memory-reorganization pass to the Memory MCP: build the tool-rule-DAG governor first, then the off-turn sleep-time agent behind a default-off shadow-gated flag, add the LLM-selected transcript-chunking path and gate everything on shadow telemetry before any live archival write. Rides sibling 010's C-G1 clock host + C4-C cursor."
trigger_phrases:
  - "async sleep-time consolidation plan"
  - "sleeptime agent governor plan"
  - "off-turn reorganization plan"
  - "llm transcript chunking plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/024-sleeptime-consolidation"
    last_updated_at: "2026-07-04T17:51:07.543Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 plan: governor-first, shadow-gated, prove-first"
    next_safe_action: "Prototype the tool-rule-DAG governor and its bound tests first"
    blockers:
      - "needs-design-prototype: greenfield governor + off-turn agent"
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
      - "Archival-passage substrate need is unresolved, gates the headline candidate"
    answered_questions: []
---
# Implementation Plan: Async Sleep-Time Consolidation (governed off-turn reorganization)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Memory MCP, `mcp_server/`) |
| **Framework** | Node MCP server, `lib/runtime/timer-registry.ts` (`registerInterval`) clock primitive, `lib/session/session-manager.ts` |
| **Storage** | SQLite (`memory_index`, causal/archival store), read-mostly off-turn, archival writes shadow-gated |
| **Testing** | Vitest (`mcp_server/__tests__/`) + a shadow-telemetry harness |

### Overview
Add a background, cadence-gated reorganization pass to the Memory MCP. The technical approach is **governor-first, shadow-gated, prove-first**: build the bounded tool-rule-DAG governor (`Init→Child→Continue→Terminal`, ref `voice_sleeptime_agent.py:87-91,132-148`) before any agent wiring. Wire the off-turn `LT-bg-sleeptime-agent` through the governor behind a default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` flag with a shadow/dry-run default. Add the `LT-llm-transcript-chunking` LLM-selected-range path additively alongside the existing markdown chunker (`handlers/chunking-orchestrator.ts`). Gate every live archival write on shadow telemetry. The pass rides sibling **010**'s C-G1 clock host + C4-C cursor and consumes 010's `LT-turn-cadence-trigger` gate, it never rebuilds them. The synchronous on-save path (`handlers/save/reconsolidation-bridge.ts`) is never altered in the flag-off state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Seam confirmed: `reconsolidation-bridge.ts` is synchronous on-save. No background reorganization agent exists, CONFIRMED in research (028/007 iter-20)
- [ ] Governor template identified: Letta tool-rule DAG (`voice_sleeptime_agent.py:87-91,132-148`), CONFIRMED in research (iter-20)
- [ ] Sibling 010 lands the C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate (this packet consumes them)
- [ ] Flag name reserved. Default-off + shadow-default semantics agreed

### Definition of Done
- [ ] Governor terminates under step-cap, cost-ceiling, terminal stop (unit-proven)
- [ ] Flag-off: synchronous on-save path byte-identical to baseline, isolation test green, zero off-turn archival mutation
- [ ] Off-turn agent idempotent against 010's clock host + cursor (no double-apply on replay)
- [ ] Shadow telemetry records off-turn reorganization candidates for the promotion decision
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A Letta-shaped **sleep-time compute** pass: a background agent fires after the foreground turn, gated by a turn-count cadence, and reorganizes recent transcripts into archival memory through a bounded tool-rule DAG. The default-off, shadow-default flag keeps it a side branch reachable only when explicitly enabled. The synchronous on-save reconsolidation stays the unchanged default path.

### Key Components
- **`sleeptime-governor.ts`** (new): the bounded tool-call DAG controller, owns the `Init→Child→Continue→Terminal` phases, a hard step-cap, a cost-ceiling and the deterministic terminal stop-condition (no early bail). Returns a typed result (terminal | forced-terminal | aborted-partial). This module is also the reusable governor template for sibling 016.
- **`sleeptime-agent.ts`** (new): the off-turn reorganization agent, driven by the governor, dispatches ACL-gated memory tools (`store_memories → rethink → finish` analogue), reads recent transcripts and (in live mode) writes archival memory. Defaults to shadow/dry-run.
- **`chunking-orchestrator.ts` `llm-range` path** (handler change): an additive LLM-selected-range archival path (`start_index/end_index/context` analogue) beside the existing markdown-structure chunker. Markdown stays the default.
- **`SPECKIT_SLEEPTIME_CONSOLIDATION` flag + shadow sub-flag** (search-flags change): default-off gate. The shadow sub-flag keeps the live archival write opt-in even when the agent is enabled.
- **Cadence consumption** (reference only): the off-turn pass reads sibling 010's `turns_counter % frequency == 0` gate in `pressure-monitor.ts`. No second counter is created.
- **Shadow harness** (test): records what each off-turn pass *would* reorganize for the promotion decision.

### Data Flow
Foreground turn completes → 010 clock host / cadence tick (`turns % N == 0`) → off-turn dispatch (distinct from the synchronous `reconsolidation-bridge.ts` path) → governor.run(reorg cycle) → [LLM reason → tool_call (read transcripts / select ranges) → execute ACL-gated memory tool → observe → repeat until step-cap/cost-ceiling/terminal] → shadow-record (default) OR archival write (live opt-in) → C4-C cursor (010) advances over the contiguous completed prefix. The synchronous on-save reconsolidation flows exactly as today and never enters this branch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a new-capability build that mutates archival memory off-turn (highest tail-risk) with a hard isolation requirement, so the affected-surface inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/save/reconsolidation-bridge.ts` | Synchronous on-save reconsolidation | Add an off-turn dispatch point distinct from the sync path. Sync path unchanged | `git diff` shows only an additive off-turn hook. Sync behavior byte-identical |
| `lib/cognitive/sleeptime-governor.ts` | (new) | Bounded tool-rule DAG | Governor bound tests (step-cap/cost-ceiling/terminal) |
| `lib/cognitive/sleeptime-agent.ts` | (new) | Off-turn reorganization agent | Off-turn isolation + shadow-mode tests |
| `handlers/chunking-orchestrator.ts` | Markdown-structure chunker | Add an LLM-selected-range path. Markdown stays default | diff shows an additive path. Markdown default unchanged |
| `lib/search/search-flags.ts` | Feature-flag registry | Add default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` + shadow sub-flag | grep flag defaults. Flag-off test |
| `lib/cognitive/pressure-monitor.ts` (010-owned) | Cadence gate (`turns_counter`) | CONSUME only, no re-implementation | grep confirms no new counter added here |
| Synchronous-save callers | Observe on-save reconsolidation | UNCHANGED (isolation) | byte-identical behavior test |

Required inventories:
- Same-class producers: `rg -n "reconsolidat|consolidat" mcp_server/handlers mcp_server/lib --glob '*.ts'` (confirm the off-turn agent is the only off-turn producer).
- Consumers of changed symbols: `rg -n "SPECKIT_SLEEPTIME_CONSOLIDATION|sleeptime|turns_counter" mcp_server --glob '*.ts'`.
- Algorithm invariant: the off-turn reorg cycle MUST terminate (step-cap ∨ cost-ceiling ∨ terminal) AND must not mutate archival memory in the default shadow mode. Adversarial cases = unbounded reasoning, tool failure mid-cycle, overlapping cadence ticks, clock replay after crash.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Governor prototype (greenfield, no agent wiring)
- [ ] Create `sleeptime-governor.ts` with `Init→Child→Continue→Terminal`, step-cap, cost-ceiling, terminal stop (Letta DAG shape)
- [ ] Unit tests prove termination at step-cap, abort at cost-ceiling, forced-terminal at the end, never unbounded
- [ ] No off-turn agent and no handler change yet

### Phase 2: Off-turn agent (default-off, shadow-default)
- [ ] Add `SPECKIT_SLEEPTIME_CONSOLIDATION` default-off flag + shadow sub-flag
- [ ] Create `sleeptime-agent.ts` driven through the governor. Shadow/dry-run default (records, never writes archival)
- [ ] Add the off-turn dispatch point in `reconsolidation-bridge.ts`, distinct from the synchronous path. Consume 010's cadence gate
- [ ] Isolation test: flag-off synchronous on-save path byte-identical, zero off-turn archival mutation in shadow mode

### Phase 3: LLM transcript-chunking + shadow telemetry + decision
- [ ] Add the LLM-selected-range archival path to `chunking-orchestrator.ts` (additive, markdown default unchanged)
- [ ] Build the shadow harness: record off-turn reorganization candidates (ranges, cadence, would-archive)
- [ ] Run it. Record numbers. Decide promote-to-live-opt-in / keep-shadow / drop on evidence
- [ ] Confirm idempotency against 010's clock host + cursor (replay re-derives, never duplicates)
- [ ] `validate.sh --strict` green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Governor bounds (step-cap, cost-ceiling, terminal, no early bail) | Vitest |
| Unit | Off-turn isolation (flag-off sync path byte-identical, zero off-turn archival mutation in shadow) | Vitest |
| Unit | Idempotency against 010 clock host + cursor (replay re-derives, no double-apply) | Vitest |
| Integration | Off-turn reorganization cycle end-to-end over real memory tools (flag-on, shadow mode) | Vitest |
| Shadow/benchmark | Off-turn reorganization candidates, cadence, would-archive ranges over N runs | Custom harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Tool-rule-DAG governor (greenfield) | Internal | Red (not built) | Whole packet blocked, governor is gate-zero |
| Sibling 010, C-G1 clock host + C4-C cursor | Sibling | Yellow (lands in 010) | Off-turn agent has no clock/cursor to ride. Sequence after 010 |
| Sibling 010, `LT-turn-cadence-trigger` gate | Sibling | Yellow (010-owned) | Consume. If absent, the off-turn pass has no cadence gate |
| Letta tool-rule DAG template | External (research) | Green (documented) | Lose the bounding template. Need a fresh governor design |
| Archival-passage substrate (episode model) | Internal | Red (absent) | Headline candidate may need a new substrate. Gated open question |
| Shadow telemetry harness | Internal | Yellow (to build in Phase 3) | Cannot make an evidence-based promotion decision |
| LLM availability in MCP runtime | Internal | Yellow | Off-turn path can't run. Sync path unaffected (flag-off) |
| Sibling 016, governor reuse (outbound) | Sibling | Green | This packet supplies the governor. Not a blocker here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Shadow telemetry shows unacceptable cost/latency, archival-mutation risk or any flag-off regression detected.
- **Procedure**: The flag is default-off and the default is shadow/dry-run, so rollback is a no-op for deployed callers. To fully revert, drop the off-turn dispatch hook, the `sleeptime-agent.ts` / `sleeptime-governor.ts` modules and the LLM-range chunking path (branch-only, nothing deployed, no archival writes in the default state). The synchronous on-save path was never altered, so there is nothing to restore.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Governor) ──► Phase 2 (Off-turn agent, default-off/shadow) ──► Phase 3 (LLM-chunking + telemetry + decision)
                              ▲
            sibling 010 (clock host + cursor + cadence gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Governor prototype | None | Off-turn agent |
| Off-turn agent | Governor + 010 clock/cursor/cadence | LLM-chunking + telemetry |
| LLM-chunking + telemetry + decision | Off-turn agent | Promotion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Governor prototype | Med-High | greenfield DAG controller + bound tests (M, per iter-20 `LT-tool-rule-memory-chain` M/M) |
| Off-turn agent | High | greenfield background agent + shadow mode + isolation (H, per `LT-bg-sleeptime-agent` H/M headline) |
| LLM-chunking + telemetry | Med | additive chunking path (M) + shadow harness |
| **Total** | | **H effort overall. Risk-heavy (mutates archival off-turn), prove-first, shadow-gated** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Flag confirmed default-off. Shadow sub-flag confirms live archival write is opt-in
- [ ] Isolation test green (flag-off sync path byte-identical, zero off-turn archival mutation)
- [ ] Off-turn dispatch is additive (sync `reconsolidation-bridge.ts` diff = sync behavior unchanged)

### Rollback Procedure
1. Confirm flag is off (no-op for callers, no off-turn writes).
2. Revert the off-turn dispatch hook, the two new cognitive modules and the LLM-range chunking path (branch-only).
3. Re-run the existing suite to confirm the synchronous baseline restored.

### Data Reversal
- **Has data migrations?** No schema change. Archival writes occur only in the live opt-in mode.
- **Reversal procedure**: In the default shadow mode there are no archival writes to reverse. If live mode wrote archival rows, they carry the off-turn provenance and the C4-C cursor (010) bounds what was applied, reverse via the existing tombstone/sweep path for those rows.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────────────────┐
│  Governor    │────►│  Off-turn agent      │────►│  LLM-chunking + telemetry │
│  (greenfield)│     │  (default-off/shadow) │     │  + promotion decision     │
└──────────────┘     └──────────┬───────────┘     └──────────────────────────┘
                                 ▲
                   ┌─────────────┴─────────────┐
                   │  sibling 010: clock host  │
                   │  + C4-C cursor + cadence  │
                   └───────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Governor | None | Bounded tool-rule DAG | Off-turn agent (+ supplies 016) |
| Off-turn agent | Governor + 010 clock/cursor/cadence | Shadow reorganization pass | LLM-chunking + telemetry |
| LLM-chunking + telemetry | Off-turn agent | Would-archive candidates + numbers | Promotion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Governor prototype** - greenfield DAG - CRITICAL (gate-zero, nothing wires without it)
2. **Sibling 010 clock host + cursor + cadence** - cross-packet - CRITICAL (the off-turn agent rides them)
3. **Off-turn agent (default-off/shadow)** - greenfield agent + isolation - CRITICAL
4. **LLM-chunking + shadow telemetry + decision** - evidence - CRITICAL (promotion gate)

**Total Critical Path**: serial, with a cross-packet dependency on 010 between phases 1 and 2.

**Parallel Opportunities**:
- The LLM-range chunking path (additive to the markdown chunker) can be drafted while the governor is built.
- The shadow harness skeleton can be drafted in parallel (data plumbing only).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Governor bounded | Step-cap/cost-ceiling/terminal unit-proven. Reusable by 016 | Phase 1 |
| M2 | Off-turn isolated | Flag-off sync path byte-identical, zero off-turn archival mutation in shadow, rides 010 cursor | Phase 2 |
| M3 | Evidence in hand | Shadow telemetry recorded. Promotion decided | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Governor-first, default-off, shadow-gated, prove-first

**Status**: Accepted

**Context**: Research (028/007 iter-20/22) surfaced async-sleeptime-consolidation as a Wave-2 architectural direction and flagged that no loop/cost governor exists internally. The 027 intelligence-class doctrine (synthesis/06 §"Honest caveats") rules that any new results-affecting intelligence, especially one that **mutates archival memory off-turn** (named the highest tail-risk item), must be built behind a flag with shadow telemetry from day one and earn activation on live evidence, never as a "Wave-1 follow-on that just turns on."

**Decision**: Build the bounded tool-rule-DAG governor before any agent wiring. Gate the off-turn agent default-off with a shadow/dry-run default so a live archival write is a separate opt-in. Promote only on shadow telemetry. Reuse Letta's `Init→Child→Continue→Terminal` tool-rule DAG (`voice_sleeptime_agent.py:87-91,132-148`) as the bounding template. Ride sibling 010's C-G1 clock host + C4-C cursor and consume its `LT-turn-cadence-trigger` gate rather than rebuilding clock/cursor/counter.

**Consequences**:
- Positive: the synchronous on-save path and archival memory are provably protected. Rollback is a no-op (flag-off, shadow default). The governor is reused by sibling 016.
- Negative + mitigation: extra upfront cost building the governor and shadow harness first, mitigated by reusing the documented Letta DAG shape and 010's clock/cursor.

**Alternatives Rejected**:
- Slot the off-turn agent in directly, live-writing archival on cadence: rejected, it mutates archival off-turn (highest tail-risk) with no governor and no shadow evidence.
- Build a second turn-counter / clock here: rejected, races with sibling 010. Consume 010's gate instead.
- Adopt an episode/immutable-transcript substrate up front: deferred, reorganize over stored rows. Gate the substrate question (spec §12) before the headline candidate ships.

---

<!--
LEVEL 3 PLAN (~230 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
