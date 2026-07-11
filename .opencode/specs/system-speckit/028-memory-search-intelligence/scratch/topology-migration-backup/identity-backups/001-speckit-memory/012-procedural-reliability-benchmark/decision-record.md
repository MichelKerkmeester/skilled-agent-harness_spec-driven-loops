---
title: "Decision Record: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)"
description: "Architecture decisions for the Memory MCP procedural-reliability cluster: why the whole unit is benchmark-first and PENDING, why it grafts onto reconsolidation-on-save rather than adopting an episode model and how bad-pattern's HAS_FAILURE host is decided. All decisions are frozen from the 028 deep-research record (iterations 015/018/021)."
trigger_phrases:
  - "procedural reliability decision record"
  - "proxy only benchmark gate adr"
  - "graft not episode model adr"
  - "has_failure schema migration adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/012-procedural-reliability-benchmark"
    last_updated_at: "2026-07-04T17:51:04.560Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Record 3 ADRs: benchmark-first PENDING, graft-not-episode, bad-pattern host"
    next_safe_action: "Revisit ADR-003 host choice at build-time after the emitter ships"
    blockers:
      - "No execution-success emitter exists (only recommendation-acceptance captured)"
    key_files:
      - "spec.md"
      - "decision-record.md"
---
# Decision Record: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> DELETED, superseded by measurement. The `SPECKIT_PROCEDURAL_RELIABILITY_RECALL` flag and its `SPECKIT_PROCEDURAL_OUTCOME_EMITTER` companion and their code were removed in the flag-resolution reckoning. The de-rate correctness fix was real but the outcome ledger stayed empty and the bounded multiplier moved only synthetic near-ties with an eval rankDelta of 0. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The ADRs below are retained as the design-of-record.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The whole procedural-reliability cluster is benchmark-first and PENDING

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028 deep-research loop (38 iterations), planning author |

---

<!-- ANCHOR:adr-001-context -->
### Context

aionforge's `procedural-memory.md` encodes a mature reliability-weighted recall model that assumes a `record_outcome(skill_id, success)` signal. The internal Memory MCP substrate **does not emit** that signal: the reliability host exists (`adaptive_signal_events` with `signal_type IN ('access','outcome','correction')` + `recordAdaptiveSignal()` + `ADAPTIVE_SIGNAL_WEIGHTS` + FSRS columns), but only a read-hit `'access'` flows broadly. The recall→task-success `'outcome'` usefulness signal has ~2 call sites [CONFIRMED: `research/iterations/iteration-018.md:17`, delta `iter-018.jsonl:4`]. There is no execution-success emitter anywhere, only recommendation-acceptance is captured. With every Beta prior at `r=0.5`, a reliability fold is a cold-start no-op.

### Constraints
- No candidate has a measured before/after benefit number. Every leverage/effort rating is structural inference [`03-corrections-caveats-and-residuals.md:33`].
- Round-D adversarial verification refuted all three [INFERRED] procedural candidates as "reuse", the strongest refutation cluster of the campaign [`iter-021.md:14`].
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Treat the four procedural candidates as ONE benchmark-first unit that is **PENDING / NO-GO** until (a) an outcome/usefulness emitter ships and (b) a single benefit micro-benchmark proves reliability-weighting out-earns the existing `access`/confirmation signals.

**Details**: The promotion gate is sequenced emitter → f64 Beta primitive + adapter → micro-benchmark → reliability fold. A non-result on the benchmark keeps M-procedural-reliability-recall PENDING. No candidate is billed as a free byproduct of a present signal.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Benchmark-first, PENDING** | Honest to the research, no fabricated benefit, no cold-start no-op shipped | Defers all value until an emitter exists | 9/10 |
| Ship reliability fold now | Fast | Fold is a no-op at `r=0.5`, ships dead code, violates the regression-baseline rule | 2/10 |
| Drop the cluster entirely | Zero risk | Loses a genuinely under-covered Memory capability the research confirmed | 4/10 |

**Why Chosen**: The benchmark-first framing is the only option faithful to the banked verdicts, it preserves the capability as a sequenced build without shipping a no-op or a fabricated number.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- The unit cannot be mistaken for low-effort wins (it is explicitly NOT in 030's Wave-0 record).
- The outcome emitter + f64 Beta primitive are reusable shared infra (the Beta primitive is shared with Advisor C4, build once and wire twice).

**Negative**:
- No value lands until a future implementation packet builds the emitter. Mitigation: the prerequisite chain is sequenced and small (emitter is M-effort).

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Reliability-weighting fails to out-earn existing signals | M | The micro-benchmark gate refuses promotion on a non-result |
| Emitter never accrues data | M | Confirm `feedback-ledger.ts` is the canonical `'outcome'` source at >2 sites |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Procedural is a decay-only label today, the capability is genuinely under-covered [`iter-015.md:18`] |
| 2 | **Beyond Local Maxima?** | PASS | "Ship the no-op fold now" rejected, the emitter + benchmark are the real prerequisites |
| 3 | **Sufficient?** | PASS | Each candidate stays candidate-local + gated, nothing claims free reuse |
| 4 | **Fits Goal?** | PASS | Goal is a research-faithful gated plan, not an unbenchmarked retrieval change |
| 5 | **Open Horizons?** | PASS | The shared Beta primitive + emitter unblock Advisor C4 and version-reset later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: `lib/feedback/feedback-ledger.ts` (emitter), `lib/scoring/bayesian-scorer.ts` (f64 Beta), `lib/ranking/adaptive-ranking.ts:346` (fold).

**Rollback**: Planning-only, nothing shipped. A future fold is default-OFF + scoped-revert.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: GRAFT onto reconsolidation-on-save, do NOT adopt an episode model

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028 deep-research loop (iteration 018) |

---

### Context

aionforge separates immutable-episode capture from consolidation. The internal Memory MCP is doc/chunk-granular: `memory_index` rows carry `chunk_index`/`parent_id`, `reconsolidate()` fires per-save by similarity and the `'episodic'` TYPE is a DECAY class, not a capture boundary [CONFIRMED: `research/iterations/iteration-018.md:16`].

### Constraints
- Adopting an episode model would be an invasive rewrite of `handlers/memory-save.ts` with no payoff against this substrate.
- All four candidates need a write-side hook. The only natural one is the existing reconsolidation-on-save path + `adaptive_signal_events`.

---

### Decision

**Summary**: Attach all four candidates at the existing reconsolidation-on-save hook + `adaptive_signal_events`. Do NOT introduce an immutable-episode capture↔consolidation split.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Graft onto reconsolidation-on-save** | Reuses live atomicity + provenance + adaptive channels, no rewrite | Constrained to chunk granularity | 9/10 |
| Adopt aionforge's episode model | Faithful to the external source | Invasive `memory-save.ts` rewrite, no substrate, no payoff | 2/10 |

**Why Chosen**: The graft preserves every primitive the candidates need (merge/conflict atomicity, the "automated writers never overwrite manual" invariant, provenance, the `'correction'` adaptive channel) without an episode-model rewrite.

---

### Consequences

**Positive**: Minimal blast radius on the save path, reuses tested atomicity.
**Negative**: Skill-induction must ride chunk-granular recurrence rather than episode boundaries. Mitigation: the induction-precision gate (recurrence ≥3, lexical floor).

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Chunk granularity mis-captures a procedure | M | Verbatim body + content-addressed id keep induction transparent |

---

### Implementation

**Affected Systems**: `lib/reconsolidation.ts` (hook), `adaptive_signal_events` (signal channel).

**Rollback**: Planning-only, no episode-model code introduced.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Bad-pattern host is a net-new schema-migration BUILD (or a precedent path with a filter-site audit)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (decision deferred to build-time within the recorded bounds) |
| **Date** | 2026-06-19 |
| **Deciders** | 028 deep-research loop (iterations 018/021) |

---

### Context

The pass-1 claim was that a `HAS_FAILURE` negative-memory edge could REUSE the causal-edge infra. Round-D verification refuted this: a `HAS_FAILURE` edge is hard-rejected at TWO layers (the frozen 6-value `RELATION_TYPES` (`causal-edges.ts:21-28`) and the SQLite `CHECK(relation IN (...6...))` (`vector-index-schema.ts:1113-1115,1781-1783`)), so it requires a table-rebuild migration. It is net-new schema work, NOT reuse [CONFIRMED: delta `iter-021.jsonl:2`].

### Constraints
- A negative-memory tier must be honored at ALL retrieval-filter sites or anti-patterns resurface as positive guidance.
- The `'deprecated'` importance_tier + the causal `contradicts` 0.8 dampener are an existing negative-signal precedent [delta `iter-018.jsonl:5`].

---

### Decision

**Summary**: Record bad-pattern as a net-new BUILD with two acceptable host paths, the choice deferred to a future build-time with these bounds. **Path A** is a `HAS_FAILURE` table-rebuild schema migration. **Path B** reuses the `'deprecated'` tier + `contradicts` 0.8 dampener precedent, gated on a PREREQ audit of ALL retrieval-filter sites.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Path A: `HAS_FAILURE` migration** | Cleanest semantic (dedicated failure edge) | Table-rebuild migration + `SCHEMA_VERSION` bump | 7/10 |
| **Path B: `'deprecated'`/`contradicts` precedent + audit** | No schema migration | Must audit every retrieval-filter site or anti-patterns leak | 7/10 |
| Claim "reuse, no work" (pass-1) | n/a | REFUTED, `HAS_FAILURE` rejected at 2 layers | 0/10 |

**Why Chosen**: Both surviving paths are legitimate net-new builds, the binary is a build-time call. The pass-1 "free reuse" framing is explicitly rejected.

---

### Consequences

**Positive**: The unit records the true cost (schema or audit), not a fictional reuse.
**Negative**: Bad-pattern cannot ship cheaply. Mitigation: it is a P1 gated candidate, not a Wave-0 pick.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Path B misses a filter site → anti-pattern surfaces as guidance | H | The audit is a hard prerequisite (REQ-005) |
| Path A migration corrupts the edge table | M | Table-rebuild tested in isolation |

---

### Implementation

**Affected Systems**: `lib/storage/causal-edges.ts`, `lib/search/vector-index-schema.ts`, `lib/reconsolidation.ts:527-533`.

**Rollback**: Planning-only, no migration run. A future Path A migration is reversible via down-migration, and Path B is a default-OFF tier.

<!-- /ANCHOR:adr-003 -->
