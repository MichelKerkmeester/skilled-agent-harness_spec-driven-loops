---
title: "Feature Specification: Async Sleep-Time Consolidation (LT-bg-sleeptime-agent + LT-llm-transcript-chunking, governed)"
description: "Add a background, cadence-gated memory-reorganization pass to the Spec-Kit Memory MCP, a sleep-time agent that fires AFTER the foreground turn, reorganizes recent transcripts into archival memory through a bounded tool-chain and lets the LLM choose which transcript ranges to preserve. Distinct from the existing synchronous on-save reconsolidation. Mutates archival off-turn, so strictly shadow-gated and default-off. Rides the C-G1 clock host + C4-C cursor landed by sibling 010."
trigger_phrases:
  - "async sleep-time consolidation"
  - "background sleeptime agent memory"
  - "llm transcript chunking archival"
  - "tool-rule memory chain governor"
  - "off-turn memory reorganization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/024-sleeptime-consolidation"
    last_updated_at: "2026-07-04T17:51:07.543Z"
    last_updated_by: "codex"
    recent_action: "Implemented default-off sleeptime governor and shadow agent scaffold"
    next_safe_action: "Wire cadence/dispatch only after sibling 010 lands the clock/cursor gate"
    blockers:
      - "needs-design-prototype: greenfield off-turn background agent + LLM-in-the-loop governor"
      - "needs-benchmark: no measured benefit number, intelligence-class so promote on live evidence only"
      - "depends-on-010: C-G1 clock host + C4-C cursor land in sibling 010 first"
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
      - "Does the off-turn agent reorganize into the existing causal/archival store, or does it require a new archival-passage substrate (no episode model exists internally)?"
      - "Does LT-turn-cadence-trigger get built here or consumed from sibling 010 (which also lists it)?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Async Sleep-Time Consolidation (LT-bg-sleeptime-agent + LT-llm-transcript-chunking, governed)

## EXECUTIVE SUMMARY

The Spec-Kit Memory MCP reorganizes memory **synchronously, on-save**, `handlers/save/reconsolidation-bridge.ts` runs inline on the hot write path, and there is **no background reorganization agent** anywhere. This sub-phase lands packet 028's Wave-2 "async sleep-time consolidation" initiative (research child 007, iteration 20, MiMo lineage): a background **sleep-time agent** that fires AFTER the foreground turn, reorganizes recent transcripts into archival memory through a bounded tool-chain and lets the LLM choose which transcript ranges are worth preserving, modeled on Letta's `voice_sleeptime_agent` / `sleeptime_multi_agent_v4`. Because the pass **mutates archival memory off-turn**, it is the highest-tail-risk intelligence-class candidate in the Memory subsystem: it is built strictly **shadow-gated, default-off**, governed by a tool-rule DAG and rides the C-G1 clock host + C4-C cursor that sibling **010** lands first.

**Key Decisions**: All candidates are PENDING, async-sleeptime-consolidation is **absent** from the Wave-0 shipped record (`030 §14`), so nothing is pre-checked. The initiative is intelligence-class (027 doctrine): it is built behind a flag with shadow telemetry from day one and earns activation only on live evidence, never as a "Wave-1 follow-on that just turns on."

**Critical Dependencies**: The tool-rule-DAG **governor** (`LT-tool-rule-memory-chain`) is gate-zero, it bounds the off-turn agent and also de-risks the sibling agentic-recall packet (016). The **C-G1 clock host + C4-C cursor** land in sibling **010**. This packet consumes them rather than rebuilding them. `LT-turn-cadence-trigger` is a shared gate (also listed in 010). It is consumed here, not re-built (boundary decision in §3).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | in_progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/003-xce-research-based-refinement` |
| **Parent Packet** | system-speckit/004-memory-search-intelligence/002-speckit-memory |
| **Wave** | Wave-2 (prove-first, intelligence-class shadow-gated) |
| **Candidate** | async-sleeptime-consolidation (`LT-bg-sleeptime-agent` + `LT-turn-cadence-trigger` + `LT-llm-transcript-chunking`, `LT-tool-rule-memory-chain` governor) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../023-semantic-edge-layer/spec.md |
| **Successor** | ../025-git-hooks-reinstall-and-guard/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The internal Memory MCP has **no off-turn memory reorganization**. `reconsolidation-bridge.ts` is synchronous on-save [CONFIRMED: file exists at `handlers/save/reconsolidation-bridge.ts`. 028/007 iter-20 maps it as the synchronous baseline], so all consolidation cost is paid on the foreground write path and the model never gets a quiet pass to reorganize recent transcripts into durable archival memory. Letta runs exactly this shape: a dedicated background agent fires after the foreground step and reorganizes message transcripts via a tool-chain (`store_memories → rethink_user_memory → finish_rethinking_memory`), spawned per-main-agent, async [CONFIRMED: `letta voice_sleeptime_agent.py:32-46,87-91`, `sleeptime_multi_agent_v4.py:139-165`, 028/007 deltas/iter-020.jsonl]. Internal chunking is markdown-structure-driven (`handlers/chunking-orchestrator.ts`), not LLM-selected transcript ranges [CONFIRMED: file exists. 028/007 iter-20 contrasts it with `store_memory(start_index,end_index,context)` at `voice_sleeptime_agent.py:137-175`]. And there is no bounded tool-call DAG to keep such a loop from running away [CONFIRMED-by-absence: 028/007 iter-22 found `CG-agentic-tool-loop` had "no agent-loop step/cost governor anywhere. All greenfield"].

### Purpose
Add a background, cadence-gated reorganization pass that amortizes consolidation cost off the hot path and lets the LLM preserve the right transcript ranges as archival memory, built as a **governed, default-off, shadow-gated** capability so that, because it mutates archival memory off-turn, it can never silently degrade recall or duplicate the archive until live evidence justifies promotion. The tool-rule-DAG governor built here is also the reusable bounding template for sibling 016's agentic-recall loop.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **`LT-tool-rule-memory-chain` (governor, gate-zero)**, a strict tool-call DAG (`Init → Child → Continue → Terminal`) that forces a full reorganization cycle with no early bail, bounding the off-turn agent's tool calls and cost [ref `voice_sleeptime_agent.py:87-91,132-148`].
- **`LT-bg-sleeptime-agent` (headline)**, a background agent that fires AFTER the foreground turn and reorganizes recent transcripts into archival memory through the governed tool-chain, off the synchronous on-save path, behind a default-off flag with shadow telemetry.
- **`LT-llm-transcript-chunking`**, an LLM-selected-range archival path (`store_memory(start_index, end_index, context)` analogue) so the model chooses which transcript segments are worth preserving as discrete memories, distinct from the existing markdown-structure chunker.
- **Cadence gating (consumed)**, the pass is gated by a turn-count cadence (`turns % N == 0`, default 5). The `LT-turn-cadence-trigger` gate itself is owned by sibling 010 (see Out of Scope) and consumed here.
- **Shadow harness**, telemetry that records what the off-turn pass *would* reorganize (dry-run / shadow-write) so the candidate is promoted on measured live evidence, not optimism.

### Out of Scope
- **`LT-turn-cadence-trigger` construction**, the persistent `turns_counter` cadence gate (`turns_counter % frequency == 0`, default 5) is **owned by sibling 010** (`010-consolidation-cursor-clock`, REQ-008, `lib/cognitive/pressure-monitor.ts`). This packet **consumes** that gate. It does not re-implement it. Boundary decision: building the same gate in two places would race on the same counter.
- **The C-G1 clock host + C4-C consolidation cursor**, landed in sibling 010. This packet rides them. It does not build them.
- **`LT-block-undo-redo`** and **`LT-tag-junction-dual-write`**, surfaced in the same iter-20 but explicitly NOT part of the async-sleeptime initiative (block-undo-redo is L/M lower-priority, snapshots already suffice. Tag-junction is a clean EXTENDS) [028/007 iter-20 §Net effect].
- **The sibling agentic-recall packet (016, `CG-agentic-tool-loop`)**, a *synchronous* recall strategy. This packet only **supplies** it the tool-rule-DAG governor template. It does not build that recall loop.
- **Adopting a per-turn episode/immutable-transcript substrate**, internal Memory is doc/chunk-granular with no episode model. The off-turn agent reorganizes over already-stored rows. Whether a new archival-passage substrate is required is an OPEN QUESTION (§12), gating the headline candidate.
- **Any measured before/after benefit numbers**, research banked zero benchmarks. Every leverage/effort tag is structural inference.
- **Modifying the external reference systems under `028/external/`.**

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/cognitive/sleeptime-governor.ts` | Created | `LT-tool-rule-memory-chain`: the bounded tool-call DAG (`Init→Child→Continue→Terminal`). Step/cost ceilings. Typed terminal result (ref `voice_sleeptime_agent.py:87-91,132-148`) |
| `mcp_server/lib/cognitive/sleeptime-agent.ts` | Created | `LT-bg-sleeptime-agent` shadow scaffold: recent transcript ranges are selected through the governor and remain dry-run unless the separate live-write flag and writer injection are present |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Pending | Wire the off-turn dispatch point distinct from the existing synchronous on-save reconsolidation after sibling 010 lands the cadence/cursor gate |
| `mcp_server/handlers/chunking-orchestrator.ts` | Pending | `LT-llm-transcript-chunking`: add the LLM-selected-range archival path alongside the existing markdown-structure chunking after shadow telemetry proves promotion value |
| `mcp_server/lib/search/search-flags.ts` | Modified | Added default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` and separate `SPECKIT_SLEEPTIME_LIVE_WRITE` opt-in flags |
| `mcp_server/lib/cognitive/pressure-monitor.ts` | Reference | Consume sibling 010's `LT-turn-cadence-trigger` gate (no re-implementation here) |
| `mcp_server/__tests__/` | Create | Governor-bound tests, off-turn-isolation test (on-save path byte-identical with flag off), shadow-telemetry test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `LT-tool-rule-memory-chain`: a bounded tool-call DAG governor | The governor enforces `Init → Child → Continue → Terminal` with a hard step-cap and cost-ceiling and no early bail before a terminal step. Unit tests prove the reorganization cycle always terminates and never runs unbounded (ref `voice_sleeptime_agent.py:87-91,132-148`) |
| REQ-002 | Off-turn isolation: flag-off leaves the synchronous path untouched | With `SPECKIT_SLEEPTIME_CONSOLIDATION` off, `reconsolidation-bridge.ts` synchronous on-save behavior is byte-identical to baseline and no off-turn agent code executes. An isolation test proves zero archival mutation off-turn |
| REQ-003 | Shadow-gated by default (mutates archival off-turn) | The off-turn pass defaults to shadow/dry-run: it records what it *would* reorganize without writing to archival memory. A live archival write requires an explicit opt-in beyond the default flag (027 intelligence-class doctrine: mutates-off-turn = highest tail-risk) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `LT-bg-sleeptime-agent`: off-turn reorganization through the governor | A background agent fires after the foreground turn (not on the synchronous save path) and reorganizes recent transcripts via the governed tool-chain. It is idempotent against the C-G1 clock host + C4-C cursor (no double-apply on a clock replay) |
| REQ-005 | `LT-llm-transcript-chunking`: LLM-selected archival ranges | An LLM-selected-range archival path (`start_index/end_index/context` analogue) stores chosen transcript segments as discrete memories, distinct from and additive to the existing markdown-structure chunker. The markdown chunker stays the default |
| REQ-006 | Cadence gating consumed from sibling 010 | The off-turn pass is gated by 010's `turns_counter % frequency == 0` (default 5) cadence trigger. This packet references that gate and does not re-implement the counter (boundary: no duplicate counter) |
| REQ-007 | Shadow telemetry for the promotion decision | A shadow harness records off-turn reorganization candidates (what would be archived, by which range, at what cadence) so promotion is decided on live evidence, not an unmeasured delta |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Governor reuse documented for sibling 016 | The DAG governor is documented as the reusable bounding template for `CG-agentic-tool-loop` (016). The cross-reference is recorded but no 016 code is built here |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `SPECKIT_SLEEPTIME_CONSOLIDATION` off, the synchronous on-save reconsolidation path produces byte-identical behavior to baseline and no off-turn agent code executes (isolation proven). Archival memory is never mutated off-turn in the default state.
- **SC-002**: The tool-rule-DAG governor provably bounds the off-turn reorganization cycle (step-cap ∨ cost-ceiling ∨ terminal stop), always terminating. The off-turn agent rides 010's clock host + cursor without double-applying on a replay.
- **SC-003**: Every candidate's STATUS is explicit (PENDING + gate) with research citations. The headline (archival-mutating) candidate is shadow-gated with telemetry, never shipped live on an unmeasured delta.
- **SC-004**: node --check + tsc + focused tests + `validate.sh --strict` on this folder pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Off-turn agent mutates archival memory wrongly (silent recall degradation / archive duplication) | High, highest tail-risk in the Memory subsystem | Shadow/dry-run default (REQ-003). Live write opt-in beyond the flag. Promote only on shadow telemetry (REQ-007) |
| Risk | Unbounded off-turn reorganization loop (LLM + tool-chain) | High | Tool-rule-DAG governor with hard step-cap + cost-ceiling + no early bail (REQ-001) |
| Risk | No episode/immutable-transcript substrate internally | Med-High | Reorganize over already-stored rows. If a new archival-passage substrate is required, that is gated as an open question (§12) before the headline candidate ships |
| Risk | Cadence-counter race with sibling 010 | Med | Consume 010's `turns_counter`. Do NOT build a second counter (REQ-006 boundary) |
| Risk | No measured benefit number | Med | Ship for shadow evidence, not a promised delta. All leverage/effort are structural inference (028 GO-evidence caveat) |
| Dependency | Tool-rule-DAG governor (gate-zero) | High | Build the bounded governor before any off-turn agent wiring. Reuse Letta DAG shape |
| Dependency | Sibling 010, C-G1 clock host + C4-C cursor | High | 010 lands the clock + cursor. This packet rides them. Sequence after 010's chain head |
| Dependency | Sibling 010, `LT-turn-cadence-trigger` gate | Med | Consume the gate. Cross-packet reference, not built here |
| Dependency | Sibling 016, governor reuse (outbound) | Low | This packet *supplies* the governor template to 016. Not a blocker on this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The off-turn pass runs after the foreground turn and is cadence-gated (default frequency 5 turns), so reorganization cost is amortized off the hot path and never paid synchronously on a save.
- **NFR-P02**: The governed loop's cost is bounded by `step-cap × per-step tool cost`. The shadow harness reports the observed bound (no fixed SLA asserted pre-prototype, UNKNOWN until measured).

### Security
- **NFR-S01**: Off-turn tool dispatch is ACL-gated to the existing memory-tool surface. No new external capability is exposed. The reorganization reads already-stored rows. The recall-trust/escaper work is a separate sibling sub-phase.

### Reliability
- **NFR-R01**: A crash or abort mid-reorganization leaves no partial archival mutation in the default shadow mode. A live-mode abort returns a typed partial result and the C4-C cursor (010) advances only over the contiguous completed prefix, never double-applying on a clock replay.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a cadence tick with no new transcript ranges is a no-op. An empty/no-new-work pass is valid convergence, not a failure.
- Maximum length: the governor's step-cap and cost-ceiling bound the reorganization regardless of transcript size. A large backlog is processed across cadence ticks, not in one runaway pass.

### Error Scenarios
- LLM/tool failure mid-reorganization: the governor aborts at a terminal step with a typed partial result. In shadow mode nothing is written. In live mode the cursor does not advance past the failed item.
- Cadence fires during a still-running pass: the second tick is skipped (no overlapping off-turn agents on the same counter), mirroring 010's missed-tick Skip behavior.
- Clock replay after a crash: the off-turn agent is idempotent against the C-G1 clock host + C4-C cursor, a replay re-derives the same archival reorganization, never duplicating it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~6 (2 new cognitive modules, 2 handler edits, 1 flag, tests). Systems: consolidation + chunking + clock/cursor cross-packet |
| Risk | 23/25 | Mutates archival off-turn (highest tail-risk). LLM in an off-turn loop. Greenfield governor. No episode substrate. Cross-packet cadence race |
| Research | 14/20 | Seam CONFIRMED (Letta side + internal contrast). Governor/agent design greenfield. No benchmark |
| Multi-Agent | 6/15 | Workstreams: governor + off-turn agent + LLM-chunking. An LLM agent loop is the feature |
| Coordination | 11/15 | Depends on 010 (clock+cursor+cadence) and supplies a template to 016. Strict sequencing |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Off-turn archival mutation degrades recall or duplicates the archive | H | M | Shadow/dry-run default. Live-write opt-in. Shadow telemetry before promotion |
| R-002 | Unbounded off-turn LLM+tool loop (cost/latency explosion) | H | M | Tool-rule-DAG governor: step-cap + cost-ceiling + no early bail |
| R-003 | Headline candidate needs an absent episode/archival-passage substrate | M | H | Reorganize over stored rows. Gate the substrate question before the headline ships |
| R-004 | Clock replay double-applies the reorganization | H | L | Ride 010's idempotent cursor. Sequence strictly after 010's chain head |
| R-005 | Duplicate turn-counter race with 010 | M | M | Consume 010's gate. Never build a second counter |

---

## 11. USER STORIES

### US-001: Off-turn reorganization never touches the synchronous path (Priority: P0)

**As a** maintainer of the synchronous on-save reconsolidation, **I want** the sleep-time agent fully isolated behind a default-off, shadow-gated flag, **so that** existing saves keep their byte-identical, hot-path behavior and archival memory is never mutated off-turn by default.

**Acceptance Criteria**:
1. Given the flag is off, When a save runs, Then `reconsolidation-bridge.ts` behaves byte-identically to baseline and no off-turn agent executes and no archival row is mutated off-turn.

### US-002: Bounded off-turn reorganization (Priority: P0)

**As an** operator, **I want** the off-turn reorganization cycle bounded by a tool-rule DAG, **so that** a background LLM+tool loop always terminates and never runs away on cost or latency.

**Acceptance Criteria**:
1. Given the off-turn agent runs, When the governor drives the cycle, Then it follows `Init→Child→Continue→Terminal`, hits a hard step-cap and cost-ceiling and always reaches a terminal stop.

### US-003: LLM preserves the right transcript ranges (Priority: P1)

**As a** caller, **I want** the model to choose which transcript ranges become archival memory, **so that** meaningful segments are preserved as discrete memories instead of only markdown-structure chunks.

**Acceptance Criteria**:
1. Given the LLM-transcript-chunking path and a transcript, When the off-turn pass runs, Then it stores LLM-selected `start_index/end_index` ranges as discrete archival memories while the markdown-structure chunker remains the default path.

---

## 12. OPEN QUESTIONS

- Does the off-turn agent reorganize into the existing causal/archival store, or does the headline candidate require a new archival-passage substrate (internal Memory has no episode/immutable-transcript model)? This gates `LT-bg-sleeptime-agent`.
- Is `LT-turn-cadence-trigger` built here or strictly consumed from sibling 010 (which also lists it as REQ-008)? Decision in §3 is "consume from 010". Confirm 010 ships the gate first.
- What step-cap / cost-ceiling / cadence-frequency defaults keep the off-turn pass cheap enough to default-shadow safely? (UNKNOWN until the shadow harness runs.)
- Does the live-write opt-in stay a separate flag from the shadow default, or graduate the single flag once telemetry justifies it?
<!-- /ANCHOR:questions -->

---

## 13. IMPLEMENTATION STATUS

| Candidate / Gate | Status | Evidence |
|------------------|--------|----------|
| `LT-tool-rule-memory-chain` governor | DONE | `mcp_server/lib/cognitive/sleeptime-governor.ts` enforces bounded phases, step cap, cost ceiling, ACL allowlist, typed aborts and deterministic terminal handling. Covered by `tests/sleeptime-governor.vitest.ts`. |
| `LT-bg-sleeptime-agent` shadow scaffold | DONE (shadow scaffold only) | `mcp_server/lib/cognitive/sleeptime-agent.ts` drives range selection through the governor and records shadow results without archival writes by default. |
| Default-off flags | DONE | `SPECKIT_SLEEPTIME_CONSOLIDATION` and `SPECKIT_SLEEPTIME_LIVE_WRITE` are registered in `lib/search/search-flags.ts` and the flag-ceiling known list. |
| Off-turn dispatch + cadence/cursor consumption | PENDING | Sibling 010 remains the owner of the clock host, cursor and cadence gate. This phase must not build a duplicate counter. |
| LLM-selected archival chunking | PENDING | Live archival mutation needs shadow telemetry and a benchmark-backed promotion decision. The markdown chunker remains unchanged. |
| Shadow telemetry benchmark/live promotion | PENDING | Deterministic unit tests prove bounds and default-off behavior, but no measured recall/cost delta exists yet. |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Source research**: `../../research/roadmap.md` (MEMORY-SYSTEMS ADDENDUM §"New initiative B, async sleep-time consolidation"), `../../research/synthesis/06-memory-systems-findings.md` (§"New initiative B" + #14 governor note), `../research/external-memory-systems/research.md` (+ `iterations/iteration-020.md`, `deltas/iter-020.jsonl`)
- **Sibling (depends-on)**: `../010-consolidation-cursor-clock/`, C-G1 clock host + C4-C cursor + `LT-turn-cadence-trigger` gate
- **Sibling (supplies governor template to)**: `../016-iterative-agentic-recall/`, `CG-agentic-tool-loop` reuses this packet's tool-rule DAG
- **Shipped record (Wave-0)**: Wave-0 record, async-sleeptime-consolidation is **absent** from the status table (never shipped), confirming PENDING

---

<!--
LEVEL 3 SPEC (~210 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
