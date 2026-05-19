---
title: "Decision Record: 023B Fixture Calibration"
description: "ADRs for expanded fixture design, repeated-run discipline, and ROBUST verdict gates."
trigger_phrases:
  - "023B ADR"
  - "fixture calibration decisions"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023b-fixture-calibration"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded 023B ADRs"
    next_safe_action: "Run full sweep later"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:023b000000000000000000000000000000000000000000000000000000000005"
      session_id: "023b-fixture-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: 023B Fixture Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: ADR-B-001 Expanded Fixture v2 Design and Categories

**Status**: Accepted

<!-- ANCHOR:adr-001-context -->
### Context

The corrected 18-probe fixture is a regression floor. It is too small and too name-dependent to support production coverage claims.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Create `code-retrieval-fixture-expanded-v2.json` with the original 18 probes plus architecture-invariant, multilingual/code-switched, short-query, long-query, and path-class-stratified probes. Every probe records difficulty, category, truth set, truth path classes, and predicted failure mode.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Keep only the corrected fixture | It remains regression-grade, not production-coverage-grade. |
| Add only architecture-invariant probes | Path-class and multilingual gaps would stay unmeasured. |
| Treat vendor/generated misses as failures | Some are expected exclusion behavior, so they need taxonomy labels. |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Positive: future calibration can distinguish implementation, tests, docs, generated, vendor, and spec-research behavior.
- Positive: architecture-invariant misses become measurable instead of anecdotal.
- Negative: the fixture now includes intentionally hard vendor/generated targets that should not be treated as simple pass/fail product regressions.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result |
|-------|--------|
| Correctness | Fixture validation enforces schema and truth sets. |
| Coverage | Required probe profiles and path classes are present. |
| Operability | Passive JSON fixture can run through existing `ccc search`. |
| Performance | Fixture is larger, so runner documents long runtime. |
| Rollback | Removing the fixture has no production runtime effect. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Implemented as `benchmark-2026-05-19-expanded/code-retrieval-fixture-expanded-v2.json`, with schema validation in `calibration_perturbation.py`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-B-002: n>=3 Repeated-Run Discipline

**Status**: Accepted

### Context

A single run over 18 probes cannot support a stats-grade calibration verdict. Reranker behavior and daemon state can vary enough that mean and spread matter.

### Decision

The runner defaults to `--runs 3`, writes one JSON artifact per lane/run, and the aggregator reports mean, sample stddev, and CI95. RRF flat-line confirmation uses hit-rate spread below `0.05` across K sweep lanes.

### Consequences

- Positive: calibration recommendations can cite repeatability.
- Positive: failed or partial runs remain inspectable as JSON.
- Negative: full verification is expensive, roughly 60 minutes on this repo.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-B-003: Verdict Gates Definition for ROBUST Flip

**Status**: Accepted

### Context

The pass-2 review asked for measurable release gates before calling the retrieval stack ROBUST.

### Decision

Define five gates: repeated benchmark stability, expanded fixture hit threshold, bounded p95 latency, model/license/index metadata visibility, and retrieval counter observability.

### Consequences

- Positive: ROBUST becomes a measurable release state.
- Positive: 023C/023D prerequisites become explicit gate inputs.
- Negative: 023B can ship the harness without satisfying the release verdict until the full long run is executed.
<!-- /ANCHOR:adr-003 -->

---

### Cross-References

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Verification**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
