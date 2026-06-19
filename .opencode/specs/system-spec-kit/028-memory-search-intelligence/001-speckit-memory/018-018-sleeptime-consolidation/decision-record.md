---
title: "Decision Record: Async Sleep-Time Consolidation (governed off-turn reorganization)"
description: "Architecture decision for the background, cadence-gated memory-reorganization pass: build the tool-rule-DAG governor first, gate the off-turn agent default-off with a shadow/dry-run default, and promote a live archival write only on shadow telemetry. Rides sibling 010's clock host + cursor; reuses Letta's tool-rule DAG as the bounding template."
trigger_phrases:
  - "async sleep-time consolidation decision record"
  - "sleeptime agent ADR"
  - "off-turn reorganization decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/018-018-sleeptime-consolidation"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored ADR-001: governor-first, default-off, shadow-gated, prove-first"
    next_safe_action: "Resolve whether the off-turn agent needs a new archival-passage substrate"
    blockers:
      - "needs-design-prototype: greenfield governor + off-turn agent"
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-018-sleeptime-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the off-turn agent need a new archival-passage substrate (no episode model exists)?"
    answered_questions: []
---
# Decision Record: Async Sleep-Time Consolidation (governed off-turn reorganization)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Governor-first, default-off, shadow-gated, prove-first

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-19 |
| **Deciders** | Operator, 028 research (007 iter-20, synthesis/06 Initiative B) |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed an off-turn way to reorganize recent transcripts into durable archival memory, because the Memory MCP only reconsolidates synchronously on-save (`handlers/save/reconsolidation-bridge.ts`) and has no background reorganization agent at all. Letta runs exactly this shape: a sleep-time agent fires after the foreground turn and reorganizes message transcripts through a bounded tool-chain, cadence-gated by a turn counter, with the LLM choosing which transcript ranges to preserve (`voice_sleeptime_agent.py:32-46,87-91,137-175`; `sleeptime_multi_agent_v4.py:139-165`). The opportunity is real, but the stakes are the highest in the Memory subsystem: this pass **mutates archival memory off-turn**, which the 028/007 caveats name the highest-tail-risk intelligence-class item — a wrong off-turn write can silently degrade recall or duplicate the archive for every later reader. And iter-22 found there is no loop or cost governor anywhere internally, so an ungoverned LLM-plus-tool loop could also run away on cost and latency.

### Constraints

- The synchronous on-save reconsolidation path must not change in the flag-off state.
- No off-turn reorganization agent and no tool-call governor exist; both must be built before the pass can be safe.
- The internal store has no episode/immutable-transcript model; the agent reorganizes over already-stored rows.
- The clock host + consolidation cursor + turn-cadence gate are owned by sibling 010; this packet must consume, not duplicate, them.
- The change must be reversible with a no-op rollback (flag default-off, shadow default = no archival writes).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: build the bounded tool-rule-DAG governor first, gate the off-turn agent default-off with a shadow/dry-run default, and promote a live archival write only on shadow telemetry.

**How it works**: a new `sleeptime-governor.ts` owns the `Init→Child→Continue→Terminal` phases, a hard step-cap, a cost-ceiling, and a deterministic terminal stop with no early bail (Letta tool-rule DAG, `voice_sleeptime_agent.py:87-91,132-148`). A new `sleeptime-agent.ts` runs the off-turn reorganization through that governor, dispatching ACL-gated memory tools, reachable only when `SPECKIT_SLEEPTIME_CONSOLIDATION` is set and defaulting to shadow/dry-run so a live archival write is a second explicit opt-in. The pass is dispatched off the synchronous path, gated by sibling 010's `turns_counter % frequency == 0` cadence, and rides 010's C-G1 clock host + C4-C cursor so a clock replay re-derives rather than duplicates. An LLM-selected-range chunking path is added additively to the markdown chunker. A shadow harness records what the pass would archive for the promotion decision.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Governor-first, default-off, shadow-gated, prove-first (chosen)** | Sync path + archival memory provably protected; no-op rollback; reuses a documented bounding template; governor reused by 016 | Upfront cost building the governor + shadow harness before any feature value | 9/10 |
| Slot the off-turn agent in directly, live-writing archival on cadence | Fast to wire | Mutates archival off-turn (highest tail-risk) with no governor and no shadow evidence; the iter-22 unbounded-loop trap | 1/10 |
| Build a second clock/turn-counter here | Self-contained | Races with sibling 010 on the same counter/cursor; duplicate state | 2/10 |
| Adopt an episode/immutable-transcript substrate up front | A clean archival model | Large schema build; not required to reorganize over stored rows; premature | 3/10 |

**Why this one**: the governor is the only thing that makes an off-turn, archival-mutating LLM loop safe to add at all, and the shadow default turns the highest-tail-risk write into an observable, reversible bet. Reusing Letta's DAG shape and 010's clock/cursor turns two greenfield builds into composing existing patterns.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Consolidation cost moves off the synchronous hot path and amortizes across cadence ticks.
- The LLM can preserve the right transcript ranges as archival memory instead of only markdown-structure chunks.
- The bounded governor is reusable by sibling 016's agentic-recall loop.

**What it costs**:
- Extra upfront work building and bound-testing the governor and the shadow harness before any feature value lands. Mitigation: reuse the documented Letta tool-rule DAG shape and sibling 010's clock host + cursor rather than inventing them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Off-turn archival mutation degrades recall / duplicates the archive | H | Shadow/dry-run default; live write a separate opt-in; promote only on shadow telemetry |
| Unbounded off-turn LLM+tool loop | H | Tool-rule-DAG governor: step-cap + cost-ceiling + no early bail, unit-proven before wiring |
| Headline candidate needs an absent episode substrate | M | Reorganize over stored rows; gate the substrate question before the headline ships |
| Clock replay double-applies | H | Ride 010's idempotent cursor; sequence strictly after 010's chain head |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No off-turn reorganization exists; reconsolidation is synchronous on-save (iter-20) |
| 2 | **Beyond Local Maxima?** | PASS | Direct slot-in, a second clock, and an up-front episode substrate were all weighed and rejected |
| 3 | **Sufficient?** | PASS | Governor + off-turn agent + shadow gate + LLM-chunking is the minimal safe shape; sync path untouched |
| 4 | **Fits Goal?** | PASS | Serves the Memory MCP retrieval-intelligence goal; Wave-2 prove-first, intelligence-class slot |
| 5 | **Open Horizons?** | PASS | The governor is the reusable bounding template for sibling 016's agentic-recall loop |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp_server/lib/cognitive/sleeptime-governor.ts` (new): the bounded tool-rule DAG.
- `mcp_server/lib/cognitive/sleeptime-agent.ts` (new): the off-turn reorganization agent (shadow default).
- `mcp_server/handlers/save/reconsolidation-bridge.ts`: an additive off-turn dispatch point, distinct from the sync path.
- `mcp_server/handlers/chunking-orchestrator.ts`: an additive LLM-selected-range archival path.
- `mcp_server/lib/search/search-flags.ts`: a default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` flag + shadow sub-flag.

**How to roll back**: the flag is default-off and the default is shadow/dry-run, so deployed callers are unaffected and no archival rows are written — no live rollback is needed. To fully revert, delete the off-turn dispatch hook, the two cognitive modules, and the LLM-range chunking path on the branch; the synchronous on-save path was never altered, so there is nothing to restore.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
