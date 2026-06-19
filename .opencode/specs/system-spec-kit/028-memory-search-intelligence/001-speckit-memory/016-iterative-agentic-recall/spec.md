---
title: "Feature Specification: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Add a ReAct-style agentic memory_context strategy that injects an LLM reason-act loop into the synchronous deterministic retrieval hot path, governed by a greenfield step-cap/cost-ceiling controller modeled on Letta's tool-rule DAG. Prove-first design packet; nothing here is a slot-in."
trigger_phrases:
  - "028 agentic tool loop recall"
  - "react memory_context strategy"
  - "agentic retrieval governor"
  - "CG-agentic-tool-loop"
  - "memory context strategy loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built default-off agentic loop governor + SPECKIT_AGENTIC_RECALL flag, 18 tests pass"
    next_safe_action: "Wire case agentic (needs mode-enum change + live LLM), then benchmark — PENDING"
    blockers:
      - "needs-benchmark: promotion gated on live latency/cost/determinism numbers"
      - "needs-schema-and-llm: case 'agentic' needs a public mode-enum change (Zod + JSON, not byte-identical-when-off) and a live LLM in the MCP runtime"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-016-agentic-tool-loop"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "What loop step-cap and cost-ceiling defaults keep p95 latency and per-call cost inside an acceptable budget?"
      - "Can the agentic strategy be made deterministic enough (seeded, temperature 0, fixed tool order) to not regress prompt-cache reuse for non-agentic callers?"
    answered_questions:
      - "Governor bounding shape and termination guarantee: Letta Init→Child→Continue→Terminal DAG with step-cap + cost-ceiling + deterministic stop, built default-off and unit-proven (REQ-001, REQ-006, NFR-R01)"
---

# Feature Specification: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Add a ReAct-style agentic strategy to the Memory MCP's `memory_context` mode router so that complex asks get an LLM-driven reason-act-observe retrieval loop over the existing memory tools, instead of a single straight-line search call. Research (028/007, iterations 11/17/22) confirmed the strategy seam is clean and additive, but blast-radius scoping corrected the original H/L "best lev/eff" rating down to **L effort**: the loop injects an LLM into a synchronous, deterministic, pure better-sqlite3 retrieval hot path, and **no loop/cost governor exists anywhere today** — controller, step-cap, cost-ceiling, and stop-condition are all greenfield. This is its own design packet, prove-first, gated default-off.

**Key Decisions**: Build the loop governor first (modeled on Letta's `Init→Child→Continue→Terminal` tool-rule DAG) before any router wiring; keep the agentic strategy behind a default-off flag so it never leaks into the deterministic path of existing callers.

**Critical Dependencies**: A working step/cost governor (greenfield); a benchmark harness to measure latency/cost/non-determinism before promotion; the sibling `CG-iterative-context-extension` strategy (lands in 003 routing) is the smaller-blast-radius answer-as-next-query build and is explicitly NOT this packet.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Phase 1 implemented (governor + flag, default-off, unit-proven); Phase 2 wiring + Phase 3 benchmark PENDING |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory |
| **Wave** | Wave-2 (prove-first) |
| **Candidate** | CG-agentic-tool-loop |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP's `memory_context` is a **static mode router with zero tool-calling**: its `executeStrategy` switch dispatches `quick|deep|focused|resume`, and each branch is one straight-line retrieval call (quick→triggers, deep/focused→single `handleMemorySearch`, resume→ladder) [CONFIRMED: `handlers/memory-context.ts:1292-1311` (`executeStrategy` switch); deltas/iter-017.jsonl]. There is no agent loop, no tool dispatch, and no observe→re-query, so a complex ask cannot iteratively refine retrieval the way Cognee's agentic retriever does (`agentic_retriever.py:419-478 _run_tool_loop`: LLM emits a structured `AgentStep` of `tool_call | final_answer`, tools execute, results append to context, iterate to `max_iter`, then force a best-effort final answer) [CONFIRMED: research/research.md §per-system; deltas/iter-011.jsonl].

### Purpose
Give complex asks an agentic, multi-tool `memory_context` retrieval path — added as a new strategy — **without** regressing the existing deterministic, low-latency retrieval the other strategies and every non-agentic caller depend on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A greenfield **loop governor**: a bounded controller with a step-cap, a cost-ceiling, and a deterministic stop-condition, modeled on Letta's tool-rule DAG (`Init→Child→Continue→Terminal`, `voice_sleeptime_agent.py:87-91,132-148`).
- A new **`agentic` strategy** branch in `executeStrategy` that runs the reason-act-observe loop over existing memory tools, gated by the governor.
- A **default-off feature flag** so the agentic strategy is never the default and never reaches the deterministic path of existing callers unless explicitly requested.
- A **benchmark harness** that measures added latency, per-call cost, and recall-determinism so the candidate can be promoted on evidence, not optimism.

### Out of Scope
- `CG-iterative-context-extension` (answer-as-next-query recall with convergence stop) — the smallest-safe sibling build; it lands in **003 routing** (Wave-1), not here. They share the "iterate retrieval" theme but this packet is the LLM-in-the-loop variant with a greenfield governor.
- Making the agentic strategy the default for any existing mode.
- Building the `LT-tool-rule-memory-chain` async sleep-time consolidation initiative (Wave-2, separate packet); only its DAG shape is reused here as the governor template.
- Any change to the deterministic search core (`hybrid-search.ts`) or to the 13-step Stage-2 fusion order.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Add an `agentic` case to the `executeStrategy` switch (`:1292-1311`); dispatch through the governor |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/agentic-loop-governor.ts` | Create | Greenfield bounded controller: step-cap, cost-ceiling, deterministic stop-condition (tool-rule DAG shape) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Add a default-off `SPECKIT_AGENTIC_RECALL` flag gating the new strategy |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/` | Create | Governor bound tests (step-cap, cost-ceiling, stop), strategy-isolation test, determinism benchmark |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A bounded loop governor exists with a hard step-cap, a hard cost-ceiling, and a deterministic stop-condition | Unit tests prove the loop terminates at the step-cap, aborts at the cost-ceiling, and reaches a forced final answer — never unbounded (per iter-22 trap: "unbounded loop + cost/latency explosion") |
| REQ-002 | The agentic strategy is gated default-off and isolated from the deterministic path | With the flag off, `quick/deep/focused/resume` outputs are byte-identical to baseline; an isolation test proves no agentic code executes for non-agentic callers (per iter-22: "non-determinism regressing every caller if routing leaks") |
| REQ-003 | The deterministic search core is untouched | `hybrid-search.ts` and the Stage-2 13-step fusion order are unmodified; grep + diff confirm zero changes to the pure better-sqlite3 path (`hybrid-search.ts:1365-1366`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The `agentic` strategy is a clean new `case` in `executeStrategy`, additive only | `executeStrategy` switch (`:1292-1311`) gains one `case 'agentic'`; existing cases unchanged; node --check + tsc green |
| REQ-005 | A benchmark measures added latency, per-call cost, and recall-determinism | A repeatable harness reports p50/p95 latency delta, mean tokens/cost per agentic call, and a determinism score (variance across N seeded runs); promotion decision cites real numbers |
| REQ-006 | The governor reuses Letta's tool-rule DAG shape as documented | Controller phases map to `Init→Child→Continue→Terminal` (no early bail before a terminal step); design references `voice_sleeptime_agent.py:87-91,132-148` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `SPECKIT_AGENTIC_RECALL` off, the existing four strategies produce byte-identical recall output to the pre-change baseline (isolation proven), and the deterministic search core is unmodified.
- **SC-002**: With the flag on, a complex ask runs a bounded reason-act-observe loop that always terminates inside the step-cap and cost-ceiling, ending in a forced final answer; the benchmark reports concrete latency/cost/determinism numbers used for the promotion decision.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Unbounded loop / cost-latency explosion | High | Hard step-cap + cost-ceiling + forced-final-answer stop-condition before any router wiring (REQ-001) |
| Risk | Non-determinism leaking into deterministic callers if routing leaks | High | Default-off flag + strategy-isolation test (REQ-002); never make agentic a default |
| Risk | Finder optimism (H/L) overstating ease | Med | iter-22 already corrected to L; treat as a design packet, prove-first, benchmark before promotion |
| Dependency | Greenfield governor | High | Reuse Letta tool-rule DAG shape (`Init→Child→Continue→Terminal`) as the bounding template (REQ-006) |
| Dependency | LLM in the synchronous hot path | High | Keep it off the deterministic path; benchmark latency/cost (REQ-005) before any default |
| Dependency | Benchmark harness availability | Med | Build the harness in this packet (Phase 3); promotion is gated on its numbers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Flag-off path adds zero measurable latency vs baseline (byte-identical output, no agentic code executed).
- **NFR-P02**: Flag-on agentic call latency is bounded by the step-cap × per-step retrieval cost; p95 delta is reported by the benchmark (no fixed SLA asserted pre-prototype — UNKNOWN until measured).

### Security
- **NFR-S01**: Tool dispatch inside the loop is ACL-gated to the existing memory tool surface (mirroring Cognee's per-tool ACL gating); no new external capability is exposed.

### Reliability
- **NFR-R01**: The loop is guaranteed to terminate (step-cap OR cost-ceiling OR stop-condition), and on abort returns a typed partial/forced-final result, never a hang.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: agentic strategy short-circuits to the focused strategy (no loop spun up).
- Maximum length / step-cap reached: loop forces a best-effort final answer at `max_iter` (Cognee `_run_tool_loop` behavior).

### Error Scenarios
- LLM/tool call failure mid-loop: governor aborts with a typed error and returns the best partial context gathered so far; no exception propagates to non-agentic callers.
- Cost-ceiling hit before any tool result: return the deterministic focused-strategy result as a fallback (graceful degrade).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: ~4 (1 new governor module, 1 handler case, 1 flag, tests); Systems: Memory MCP only |
| Risk | 22/25 | LLM in synchronous hot path: Y; non-determinism risk: Y; greenfield governance: Y; breaking change if routing leaks: Y |
| Research | 14/20 | Seam CONFIRMED; governor design + bounds are empirical/greenfield (prove-first) |
| Multi-Agent | 4/15 | Single workstream; an LLM agent loop is the feature, not the build process |
| Coordination | 6/15 | Depends on benchmark harness + governor; sibling iterative-context-extension lands separately in 003 |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Unbounded loop / runaway cost+latency | H | M | Hard step-cap + cost-ceiling + stop-condition (REQ-001) |
| R-002 | Non-determinism regresses deterministic callers | H | M | Default-off flag + isolation test (REQ-002) |
| R-003 | Governor under-specified, ships unbounded | H | L | Letta tool-rule DAG template (REQ-006); governor built and tested before wiring |
| R-004 | Benchmark shows cost/latency not worth it | M | M | Prove-first: candidate stays flag-off / dropped if numbers fail |

---

## 11. USER STORIES

### US-001: Complex ask gets an agentic retrieval path (Priority: P2)

**As a** caller issuing a complex, multi-faceted `memory_context` request, **I want** an opt-in agentic strategy that reasons, acts (calls memory tools), observes, and re-queries, **so that** retrieval can iteratively refine on hard asks instead of one static search.

**Acceptance Criteria**:
1. Given the flag is on and a complex input, When the agentic strategy runs, Then it executes a bounded reason-act-observe loop and returns a final answer within the step-cap and cost-ceiling.

### US-002: Existing callers are protected from the LLM hot path (Priority: P0)

**As a** maintainer of the deterministic retrieval path, **I want** the agentic strategy fully isolated behind a default-off flag, **so that** existing `quick/deep/focused/resume` callers keep their byte-identical, low-latency, deterministic recall.

**Acceptance Criteria**:
1. Given the flag is off, When any existing strategy runs, Then output is byte-identical to baseline and no agentic code path executes.

---

## 12. OPEN QUESTIONS

- What step-cap and cost-ceiling defaults keep p95 latency and per-call cost inside an acceptable budget? (UNKNOWN until the prototype benchmark runs.)
- Can the agentic loop be made deterministic enough (seeded, temperature 0, fixed tool order) that it does not regress prompt-cache reuse, or must it always stay opt-in? (UNKNOWN — empirical.)
- Should the governor share code with the deep-loop convergence machinery, or stay a self-contained Memory MCP module? (To resolve in plan/ADR.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Source research**: `../../research/roadmap.md` (MEMORY-SYSTEMS ADDENDUM, top-7 #7), `../../research/synthesis/06-memory-systems-findings.md` (#14), `../research/from-007-memory-systems/research.md` (+ `iterations/iteration-0{11,17,20,22}.md`, `deltas/iter-0{11,17,20,22}.jsonl`)
- **Sibling (distinct)**: `CG-iterative-context-extension` (top-7 #2) lands in `../../003-skill-advisor`/routing context, not here
- **Shipped record (Wave-0)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 — CG-agentic-tool-loop is **absent** from the status table (never shipped), confirming PENDING

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
