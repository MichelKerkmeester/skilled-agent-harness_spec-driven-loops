---
title: "Implementation Plan: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Prove-first plan to add a governed ReAct agentic memory_context strategy: build the bounded loop governor first, wire a default-off agentic case into executeStrategy, then benchmark latency/cost/determinism before any promotion."
trigger_phrases:
  - "028 agentic tool loop plan"
  - "react memory_context strategy plan"
  - "agentic retrieval governor plan"
  - "CG-agentic-tool-loop plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 plan: governor-first, default-off, benchmark-before-promote sequencing"
    next_safe_action: "Prototype the loop governor module and its bound tests before touching executeStrategy"
    blockers:
      - "needs-design-prototype: greenfield controller/step-cap/cost-ceiling"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-016-agentic-tool-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Step-cap / cost-ceiling defaults pending the prototype benchmark"
    answered_questions: []
---
# Implementation Plan: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Memory MCP, `mcp_server/`) |
| **Framework** | Node MCP server, better-sqlite3 deterministic search core |
| **Storage** | SQLite (`memory_index`, vector index) - UNCHANGED by this packet |
| **Testing** | Vitest (`mcp_server/__tests__/`) + a new determinism benchmark harness |

### Overview
Add an opt-in `agentic` strategy to `memory_context` that runs an LLM reason-act-observe loop over the existing memory tools. The technical approach is **governor-first, prove-first**: build a bounded loop controller (step-cap, cost-ceiling, deterministic stop-condition) modeled on Letta's `Init→Child→Continue→Terminal` tool-rule DAG, wire it as one additive `case 'agentic'` in `executeStrategy` (`handlers/memory-context.ts:1292-1311`) behind a default-off `SPECKIT_AGENTIC_RECALL` flag, then benchmark latency/cost/determinism before any promotion. The deterministic search core (`hybrid-search.ts:1365-1366`) is never touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Seam confirmed: `executeStrategy` switch is a static mode router with no tool-calling (`memory-context.ts:1292-1311`) - CONFIRMED in research (iter-17)
- [ ] Governor template identified: Letta tool-rule DAG (`voice_sleeptime_agent.py:87-91,132-148`) - CONFIRMED in research (iter-20)
- [ ] Flag name reserved and default-off semantics agreed

### Definition of Done
- [ ] Governor terminates under step-cap, cost-ceiling and stop-condition (unit-proven)
- [ ] Flag-off output byte-identical to baseline, isolation test green
- [ ] Deterministic core (`hybrid-search.ts`, Stage-2 fusion) unmodified (grep + diff)
- [ ] Benchmark reports latency/cost/determinism numbers for the promotion decision
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
ReAct agentic loop (Cognee `_run_tool_loop` shape) bounded by a tool-rule-DAG governor (Letta shape), surfaced as one additive strategy in an existing mode router. Deterministic core stays untouched, the agentic path is a side branch reachable only behind a flag.

### Key Components
- **`agentic-loop-governor.ts`** (new): the bounded controller - owns `max_iter` (step-cap), `cost_ceiling` (token/cost budget) and the deterministic stop-condition (`Init→Child→Continue→Terminal`, no early bail before a terminal step). Returns a typed result (final | forced-final | aborted-partial).
- **`executeStrategy` `case 'agentic'`** (handler change): builds the loop, dispatches existing memory tools (ACL-gated to the memory surface), appends observations, hands control to the governor.
- **`SPECKIT_AGENTIC_RECALL` flag** (search-flags change): default-off gate, absent the flag, the case is unreachable and zero agentic code executes.
- **Benchmark harness** (test): seeded N-run determinism + latency/cost measurement.

### Data Flow
Caller → `memory_context(mode: agentic)` → flag check → governor.run(loop) → [LLM reason → tool_call → execute memory tool → observe → repeat until step-cap/cost-ceiling/terminal] → forced/typed final answer → envelope. The deterministic strategies (`quick/deep/focused/resume`) flow exactly as today and never enter this branch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a new-feature build with a hard isolation requirement (a leak regresses every deterministic caller), so the affected-surface inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/memory-context.ts` `executeStrategy` switch | Static mode router (`quick/deep/focused/resume`) | Add one `case 'agentic'`, default branch unchanged | `rg -n "case '" handlers/memory-context.ts`, diff shows only an added case |
| `lib/search/search-flags.ts` | Feature-flag registry | Add default-off `SPECKIT_AGENTIC_RECALL` | grep flag default, flag-off test |
| `lib/search/hybrid-search.ts` (deterministic core) | Pure better-sqlite3 search (`:1365-1366`) | Not a consumer - UNCHANGED | `git diff` shows zero changes |
| Stage-2 13-step fusion (`stage2-fusion.ts`) | Deterministic ranking brain | Not a consumer - UNCHANGED | diff shows zero changes |
| Non-agentic callers of `memory_context` | Observe deterministic recall | UNCHANGED (isolation) | byte-identical output test |

Required inventories:
- Same-class producers: `rg -n "executeStrategy|case '" mcp_server/handlers/memory-context.ts`.
- Consumers of changed symbols: `rg -n "SPECKIT_AGENTIC_RECALL|executeStrategy|effectiveMode" mcp_server --glob '*.ts'`.
- Algorithm invariant: the loop MUST terminate (step-cap ∨ cost-ceiling ∨ terminal stop-condition), adversarial cases = unbounded reasoning, tool failure mid-loop, cost-ceiling before first result.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Governor prototype (greenfield, no router wiring)
- [ ] Create `agentic-loop-governor.ts` with step-cap, cost-ceiling, deterministic stop-condition (Letta DAG shape)
- [ ] Unit tests prove termination at step-cap, abort at cost-ceiling, forced-final at terminal
- [ ] No change to `executeStrategy` yet

### Phase 2: Strategy wiring (default-off)
- [ ] Add `SPECKIT_AGENTIC_RECALL` default-off flag
- [ ] Add `case 'agentic'` to `executeStrategy`, dispatching through the governor (ACL-gated tools)
- [ ] Isolation test: flag-off output byte-identical to baseline for all four existing strategies

### Phase 3: Benchmark + promotion decision
- [ ] Build the seeded N-run benchmark (latency p50/p95, cost/call, determinism variance)
- [ ] Run it, record numbers, decide promote-to-opt-in / keep-flag-off / drop on evidence
- [ ] `validate.sh --strict` green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Governor bounds (step-cap, cost-ceiling, stop-condition, forced-final) | Vitest |
| Unit | Strategy isolation (flag-off byte-identical, agentic code unreachable) | Vitest |
| Integration | `case 'agentic'` end-to-end loop over real memory tools (flag-on) | Vitest |
| Benchmark | Latency p50/p95 delta, cost/call, determinism variance over N seeded runs | Custom harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Loop governor (greenfield) | Internal | Green (built default-off) | Gate-zero delivered in 16ee739b08 (`agentic-loop-governor.ts`, 18 tests), packet unblocked, promotion pending |
| Letta tool-rule DAG template | External (research) | Green (documented) | Lose the bounding template, would need a fresh governor design |
| Benchmark harness | Internal | Yellow (to build in Phase 3) | Cannot make an evidence-based promotion decision |
| LLM availability in MCP runtime | Internal | Yellow | Agentic path can't run, deterministic path unaffected (flag-off) |
| `CG-iterative-context-extension` (003 routing) | Sibling | Independent | None - explicitly separate, not a blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark shows unacceptable latency/cost/non-determinism, or any flag-off regression detected.
- **Procedure**: The flag is default-off, so rollback is a no-op for deployed callers, to fully revert, drop the `case 'agentic'` and the governor module (branch-only, nothing deployed). The deterministic core was never touched, so there is nothing to restore.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Governor) ──► Phase 2 (Wiring, default-off) ──► Phase 3 (Benchmark + decision)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Governor prototype | None | Wiring |
| Strategy wiring | Governor | Benchmark |
| Benchmark + decision | Wiring | Promotion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Governor prototype | High | greenfield controller + bound tests |
| Strategy wiring | Med | one additive case + flag + isolation test |
| Benchmark + decision | Med | harness + N seeded runs + analysis |
| **Total** | | **L effort overall (per iter-22 correction), risk-heavy, prove-first** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Flag confirmed default-off
- [ ] Isolation test green (flag-off byte-identical)
- [ ] Deterministic core diff = zero

### Rollback Procedure
1. Confirm flag is off (no-op for callers).
2. Revert the `case 'agentic'` and governor module (branch-only).
3. Re-run the existing suite to confirm baseline restored.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - no schema or data changes.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  Governor    │────►│  Strategy wiring │────►│  Benchmark + decision │
│  (greenfield)│     │  (default-off)   │     │  (promote/keep/drop)  │
└──────────────┘     └──────────────────┘     └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Governor | None | Bounded loop controller | Wiring |
| Flag + `case 'agentic'` | Governor | Opt-in agentic strategy | Benchmark |
| Benchmark | Wiring | Latency/cost/determinism numbers | Promotion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Governor prototype** - greenfield - CRITICAL (gate-zero, nothing wires without it)
2. **Strategy wiring (default-off)** - additive case + flag - CRITICAL
3. **Benchmark + decision** - evidence harness - CRITICAL (promotion gate)

**Total Critical Path**: serial - each phase gates the next.

**Parallel Opportunities**:
- The benchmark harness skeleton can be drafted while the governor is built (data plumbing only).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Governor bounded | Step-cap/cost-ceiling/stop unit-proven | Phase 1 |
| M2 | Strategy isolated | Flag-off byte-identical, core untouched | Phase 2 |
| M3 | Evidence in hand | Benchmark numbers recorded, promotion decided | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Governor-first, default-off, prove-first

**Status**: Accepted

**Context**: Research (iter-22) corrected this candidate from H/L to L: the clean strategy seam hides an LLM injected into a synchronous, deterministic, pure better-sqlite3 retrieval hot path, with no loop/cost governor anywhere. The trap is an unbounded loop with cost/latency explosion and non-determinism regressing every caller if routing leaks.

**Decision**: Build the bounded governor before any router wiring, gate the agentic strategy default-off, promote only on benchmark evidence. Reuse Letta's `Init→Child→Continue→Terminal` tool-rule DAG (`voice_sleeptime_agent.py:87-91,132-148`) as the bounding template rather than inventing a controller.

**Consequences**:
- Positive: the deterministic path is provably protected, rollback is a no-op (flag-off).
- Negative + mitigation: extra upfront cost building the governor first - mitigated by reusing the documented Letta DAG shape.

**Alternatives Rejected**:
- Slot the agentic strategy in directly (the original H/L read): rejected - iter-22 proved it needs its own design packet, not a slot-in.
- Use `CG-iterative-context-extension` instead: that is the smaller-blast-radius sibling and lands in 003 routing, it does not put an LLM in the loop, so it does not satisfy this candidate.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
