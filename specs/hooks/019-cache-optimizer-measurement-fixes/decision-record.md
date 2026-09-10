---
title: "Decision record: withdrawing the cross-turn prefix gate"
description: "Why the stability gate was built, measured, and then withdrawn, and what evidence would justify revisiting it."
trigger_phrases:
  - "prefix gate withdrawal decision"
  - "cross-turn stability decision record"
  - "withdrawn acceptance criterion"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/019-cache-optimizer-measurement-fixes"
    last_updated_at: "2026-09-09T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the withdrawal of the prefix-lifting gate"
    next_safe_action: "None; packet closed"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-019-decision-record"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate prevented no churn and introduced a per-session prefix break, so it was withdrawn rather than deferred"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision record

<!-- ANCHOR:adr-001 -->
## ADR-001: withdraw the cross-turn prefix-lifting gate

**Status:** Accepted · 2026-09-09

### Context

Research recommended gating prefix lifting on having observed a candidate unchanged across two
turns, on the theory that lifting a candidate which later changes destroys the cache prefix. It was
built, shipped, and its acceptance criterion written before anything measured the premise.

### Decision

Withdraw it. The requirement and its criterion are retired rather than deferred.

### Evidence

A two-arm experiment ran four turns per model in a single process on two gateway models, with a run
nonce so neither arm inherited the other's warm provider cache, and a probe recording the hash and
length of the stable prefix actually shipped on every provider request.

| Arm | Turn 1 | Turns 2-4 |
|-----|--------|-----------|
| Without the gate | `c0748d` (59,187 chars) | `c0748d` (59,187) |
| With the gate | `e3b0c4` (0) | `c0748d` (59,187) |

Identical on both models. `e3b0c4` is the hash of the empty string. The prefix is already
byte-identical from the first turn, so there is no churn for a stability gate to prevent, and the
gate itself is what moves the prefix — once per session, between turns one and two.

The optimizer reported a change on all eight turns of the ungated arm, so lifting genuinely
happened; the result is not an artifact of nothing being lifted.

### Consequences

The acceptance criterion for this requirement is `Waived` against this record. It is not `Met`,
because the work no longer exists, and not `Unmet`, because nothing is outstanding.

An earlier measurement appeared to favour the gate and was wrong: `before_agent_start` fires once
per user prompt and the promotion state is process-scoped, so one-shot invocations lifted nothing in
either arm and the comparison was between two identical conditions.

### What would reopen this

An observed case of stable content changing mid-session — a file in the allowlist edited between
turns, for instance. That case is unobserved rather than disproven. If it appears, the fix should
target it directly rather than delaying every lift.
<!-- /ANCHOR:adr-001 -->
