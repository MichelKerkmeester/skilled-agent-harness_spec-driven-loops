---
title: "Decision Record: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)"
description: "Architecture decision for the governed ReAct agentic memory_context strategy: build the bounded loop governor first, gate the strategy default-off and promote only on benchmark evidence. Reuses Letta's tool-rule DAG as the bounding template."
trigger_phrases:
  - "028 agentic tool loop decision record"
  - "CG-agentic-tool-loop ADR"
  - "agentic recall governor decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall"
    last_updated_at: "2026-07-04T17:51:08.473Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored ADR-001: governor-first, default-off, prove-first"
    next_safe_action: "Resolve whether the governor shares code with deep-loop convergence or stays self-contained"
    blockers:
      - "needs-design-prototype: greenfield governor bounds"
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-016-agentic-tool-loop"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Share governor code with deep-loop convergence, or keep self-contained?"
    answered_questions: []
---
# Decision Record: Agentic Tool-Loop Recall Strategy (CG-agentic-tool-loop)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> DELETED, superseded by measurement. The `SPECKIT_AGENTIC_RECALL` flag and its code were removed in the flag-resolution reckoning. The oracle ceiling reached +0.344 but the live reasoner netted zero with regressions at 51s per query, and the loop had no production consumer. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The ADRs below are retained as the design-of-record.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Governor-first, default-off, prove-first

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted - gate-zero governor implemented default-off (16ee739b08), promotion pending |
| **Date** | 2026-06-19 |
| **Deciders** | Operator, 028 research (iters 11/17/20/22) |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a way to give complex `memory_context` asks an iterative, multi-tool retrieval path, because the current router is static. Research confirmed the seam is clean: `executeStrategy` (`handlers/memory-context.ts:1292-1311`) dispatches `quick/deep/focused/resume`, each a single straight-line retrieval call with no tool-calling, so a new agentic strategy is additive. The finders first read this as the campaign's best lever-to-effort win (H/L). Blast-radius scoping at iter-22 corrected that: the loop injects an LLM into a synchronous, deterministic, pure better-sqlite3 retrieval hot path (`lib/search/hybrid-search.ts:1365-1366`), and there is no loop or cost governor anywhere - controller, step-cap, cost-ceiling and stop-condition are all greenfield. The real stakes are an unbounded loop with runaway cost and latency, plus non-determinism that would regress every deterministic caller if routing ever leaked.

### Constraints

- The deterministic search core (`hybrid-search.ts`, Stage-2 13-step fusion) must not change.
- No agent-loop governor exists, one must be built before the strategy can be safe.
- The change must be reversible with a no-op rollback (flag default-off).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: build the bounded loop governor first, gate the new agentic strategy default-off and promote it only on benchmark evidence.

**How it works**: a new `agentic-loop-governor.ts` owns a hard step-cap, a hard cost-ceiling and a deterministic stop-condition modeled on Letta's `Init→Child→Continue→Terminal` tool-rule DAG (`voice_sleeptime_agent.py:87-91,132-148`). One additive `case 'agentic'` in `executeStrategy` runs the reason-act-observe loop through that governor, reachable only when `SPECKIT_AGENTIC_RECALL` is set. A seeded benchmark then measures latency, cost and determinism to decide whether to promote, keep flag-off or drop.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Governor-first, default-off, prove-first (chosen)** | Deterministic path provably protected, no-op rollback, reuses a documented bounding template | Upfront cost building the governor before any feature value | 9/10 |
| Slot the agentic strategy in directly (original H/L read) | Fast to wire, the seam already exists | iter-22 proved it injects an ungoverned LLM into the hot path, unbounded-loop and non-determinism traps | 2/10 |
| Use CG-iterative-context-extension instead | Smaller blast radius, convergence-stop already built | Does not put an LLM in the loop, so it does not satisfy this candidate, lands separately in 003 routing | n/a (different candidate) |

**Why this one**: the governor is the only thing that makes an LLM-in-the-loop strategy safe to add, and reusing Letta's DAG shape turns a greenfield controller into composing an existing pattern.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Complex asks gain an opt-in agentic retrieval path without risk to existing callers.
- The loop is guaranteed to terminate (step-cap, cost-ceiling or terminal stop).

**What it costs**:
- Extra upfront work building and bound-testing the governor before any feature value lands. Mitigation: reuse the documented Letta tool-rule DAG shape rather than inventing a controller.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Unbounded loop / runaway cost+latency | H | Hard step-cap + cost-ceiling + forced-final stop-condition, unit-proven before wiring |
| Non-determinism leaks into deterministic callers | H | Default-off flag + byte-identical flag-off isolation test |
| Benchmark shows it is not worth the cost | M | Prove-first: keep flag-off or drop on the numbers |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Static router has zero tool-calling, the agentic-strategy gap is real and confirmed (iter-17) |
| 2 | **Beyond Local Maxima?** | PASS | Slot-in and the iterative-context-extension sibling were both weighed and rejected for this candidate |
| 3 | **Sufficient?** | PASS | Governor + one additive case + flag is the minimal safe shape, the deterministic core is untouched |
| 4 | **Fits Goal?** | PASS | Directly serves the Memory MCP retrieval-intelligence goal, Wave-2 prove-first slot |
| 5 | **Open Horizons?** | PASS | The governor is reusable for the async sleep-time consolidation initiative's bounded chains |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp_server/lib/search/agentic-loop-governor.ts` (new): the bounded controller.
- `mcp_server/handlers/memory-context.ts` (`executeStrategy:1292-1311`): one additive `case 'agentic'`.
- `mcp_server/lib/search/search-flags.ts`: a default-off `SPECKIT_AGENTIC_RECALL` flag.

**How to roll back**: the flag is default-off, so deployed callers are unaffected - no live rollback is needed. To fully revert, delete the `case 'agentic'` and the governor module on the branch, the deterministic core was never touched, so there is nothing to restore.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
