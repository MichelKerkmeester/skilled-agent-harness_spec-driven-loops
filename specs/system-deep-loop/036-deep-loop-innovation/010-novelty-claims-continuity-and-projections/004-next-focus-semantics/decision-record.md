---
title: "Decision Record: next-focus semantics"
description: "Architecture decision for a pivot-compatible, deterministic, additive-dark next-focus sidecar."
trigger_phrases:
  - "next-focus architecture"
  - "next-focus selector decision"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
    last_updated_at: "2026-07-21T08:25:48Z"
    last_updated_by: "codex"
    recent_action: "Accepted the pivot-compatible additive-dark selector architecture"
    next_safe_action: "Keep recommendations non-authoritative until a later cutover phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/next-focus/index.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Next-Focus Semantics

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a pivot-gated deterministic shadow selector

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Codex implementation agent |

<!-- ANCHOR:adr-001-context -->
### Context

The shipped divergent-pivot transaction owns authoritative focus changes after Council endorsement. Routine focus suggestions
need a broader candidate vocabulary and deterministic scoring, but duplicating the generic pivot validator would create a
weaker safety boundary, while calling the authoritative transaction would move authority before shadow evidence exists.

### Constraints

- The shipped pivot candidate validator, fingerprint normalization, similarity calculation, and `0.85` threshold remain canonical.
- All candidates in one decision come from one immutable projection watermark, version, evidence set, and source fingerprint.
- Scoring and ordering use integer basis points and code-unit candidate IDs only.
- Typed events must pass the shipped transition authorization and append-only ledger boundaries.
- Replay may validate recorded evidence but cannot consult a live projection or select a new winner.
- No module in this leaf can write `currentFocus`.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a dependency-closed `runtime/lib/next-focus/` sidecar that layers region-specific validation on the shipped
`PivotCandidate` gate, sorts candidates before invoking the shipped set deduplicator, scores accepted candidates under a
versioned integer policy, and records selected or unavailable shadow decisions through the existing event registry,
authorization gateway, and append-only ledger.

Decision identity binds run lineage, source iteration, projection watermark, and policy version. Its deterministic event ID
makes same-semantics retries idempotent and makes different semantics under the same identity conflict at both the semantic
recorder and ledger event-ID boundary. Replay restores the stored recommendation and verifies the source, score, comparator,
policy, and frontier fingerprints without calling the selector.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pivot-gated shadow sidecar** | Reuses safety and ledger contracts; removable; replayable | Consumers must opt into shadow comparison | 10/10 |
| Extend divergent-pivot directly | One focus mechanism | Risks changing Council authority and transaction behavior | 1/10 |
| Fork candidate validation | Local implementation freedom | Creates semantic drift and a weaker parallel gate | 0/10 |
| Rank with runtime floating point | Familiar score representation | Weakens byte-stable replay and cross-platform confidence | 2/10 |

**Why this one**: it adds routine typed recommendations while preserving the sole authoritative focus transaction.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Coverage gaps, open contradictions, and under-covered communities share one evidence-linked candidate contract.
- The complete ranked frontier, comparator trace, policy, and source identity are durable and independently auditable.
- Empty frontiers and signal gaps have typed outcomes instead of prompt-derived fallback directions.
- Replay conflict detection is independent of later projection state.

**What it costs**:

- Candidate-kind adapters must provide normalized basis-point observations and evidence IDs.
- The novelty-decay comparator tier is retained for contract completeness even though valid equal-score tuples with equal
  contradiction and coverage components necessarily have equal novelty decay.
- Shadow consumers must compare the recommendation explicitly; there is intentionally no authority bridge in this leaf.

| Risk | Impact | Mitigation |
|------|--------|------------|
| Weaker duplicate rejection | Critical | Direct calls to the shipped validator and set deduplicator with its exported threshold |
| Mixed projection evidence | High | One canonical source fingerprint plus candidate-by-candidate equality checks |
| Replay changes historical focus | Critical | Stored-event replay with score, ordering, policy, and frontier-fingerprint checks |
| Premature authority movement | Critical | Observation-only comparison type and no import of the divergent-pivot state writer |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing pivot activation does not routinely rank projection regions |
| 2 | **Beyond Local Maxima?** | PASS | Direct extension, validator fork, float scoring, and sidecar options were compared |
| 3 | **Sufficient?** | PASS | Derivation, selection, typed recording, idempotency, replay, and dark comparison are covered |
| 4 | **Fits Goal?** | PASS | The Council transaction remains the only authoritative focus writer |
| 5 | **Open Horizons?** | PASS | Versioned policies and typed events allow later calibrated cutover without rewriting history |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

The implementation lives under `runtime/lib/next-focus/`; its leaf suite is
`runtime/tests/unit/next-focus.vitest.ts`.

**How to roll back**: stop importing the public API and remove the new module and test paths. Existing pivot events, Council
endorsement, `currentFocus`, and substrate ledgers require no reversal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
