---
title: "Spec: Dark Flag Graduation Production Coverage Validation"
description: "Deep research investigating whether each 007 dark-flag-graduation winner benefits ALL relevant real-world scenarios beyond the labeled benchmark set. Triangulates implementation code, benchmark evidence, and retrieval/graph/routing theory to produce per-cluster confidence assessments and identify unresolved production gaps."
trigger_phrases:
  - "dark flag validation"
  - "dark-flag-graduation winner scenario coverage"
  - "benchmark coverage gaps"
  - "conditional graduation"
  - "production readiness of graduated flags"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-dark-flag-graduation/006-dark-flag-validation"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Validated 007 graduation winners against real-world scenarios"
    next_safe_action: "Review complete; see review/review-report.md"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "research/iterations/iteration-001.md"
      - "research/iterations/iteration-002.md"
      - "research/iterations/iteration-003.md"
      - "research/iterations/iteration-004.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-009-dark-flag-2026-06-24-0625"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which dark flags graduated? 4 clusters (9 flags): multihop tail-appends, CG staleness + bitemporal, advisor RRF + conflict, dedup + gauges. 1 REFINE (citation ledger)."
      - "Implementation code analysis complete for all 5 clusters."
      - "Scenario-class coverage matrices, help/hurt/no-op predictions, benchmark gaps mapped."
      - "Cross-cutting patterns: conditional graduations, synthetic-only benchmarks, metric headlines masking reality."
      - "Confidence beyond labeled set: RRF Medium-High, staleness Medium, multihop/dedup/bitemporal Low-Medium, citation Low."
      - "Retrieval/graph/routing theory triangulated: Cormack RRF, incremental index consistency, structured dedup, citation mining."
---

<!-- SPECKIT_TEMPLATE_SOURCE: review-record | v2.2 -->
<!-- SPECKIT_LEVEL: review -->

# Feature Specification: Dark Flag Graduation Production Coverage Validation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Research Complete |
| **Created** | 2026-06-24 |
| **Updated** | 2026-06-24 |
| **Parent Spec** | `../005-dark-flag-graduation/spec.md` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
| **Predecessor** | ../005-flag-name-cleanup/spec.md |
| **Successor** | ../007-graduation-follow-ups/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 007 Dark Flag Graduation Suite returned GRADUATE verdicts for 4 clusters (9 flags) across multihop tail-appends, code-graph staleness repair and bitemporal reads, advisor RRF fusion and conflict-rerank, and deep-loop finding dedup and gauges. The true-citation ledger received REFINE. The benchmarks tested each against the real corpus on the production path, but the question remains: do these winners benefit ALL relevant real-world scenarios, or only the labeled benchmark sets?

### Purpose

Validate each GRADUATE winner against the full range of plausible real-world scenarios by triangulating three evidence sources: the implementation code (what changes when the flag gates), the 007 benchmark evidence (what was tested and measured), and general retrieval/graph/routing principles (what theory predicts beyond the test set). Produce per-cluster confidence assessments and identify unresolved production gaps.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Per-cluster analysis of all 4 GRADUATE clusters and the REFINE true-citation ledger
- Scenario-class coverage matrices: tested, implicitly covered, excluded
- No-op zone identification for each graduate
- Hurt zone identification for each graduate
- Genuine-help zone identification beyond the benchmark
- Benchmark-to-reality gap analysis
- Cross-cutting pattern detection
- Per-cluster confidence assessment beyond labeled set
- Retrieval/graph/routing theory application

### Out of Scope

- Flipping production defaults (owned by separate decision)
- Re-running benchmarks (work with existing evidence)
- Implementing fixes or refinements
- Deep code-level auditing of flags already confirmed CUT

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Research packet specification |
| `research/research.md` | Create | Final synthesized research report |
| `research/iterations/iteration-001.md` through `004.md` | Create | Per-iteration research findings |
| `research/deep-research-config.json` | Create | Loop configuration |
| `research/deep-research-state.jsonl` | Create | Iteration state log |
| `research/deep-research-strategy.md` | Create | Research strategy and convergence |
| `research/deep-research-findings-registry.json` | Create | Findings registry |
| `research/deltas/` | Create | Per-iteration delta files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. KEY FINDINGS

### Cross-Cutting Pattern 1: Conditional Graduations Dressed as Unqualified Verdicts

Multiple flags graduate with caveats the verdict body acknowledges but the status label doesn't surface:
- Bitemporal reads: GRADUATE but writer NOT wired to reindex path
- Staleness degree cap: GRADUATE but defaults to 0 (uncapped), "sensible ceiling" undefined
- Heartbeat: GRADUATE but production cadence undefined
- Multihop: GRADUATE (deep-K) but K=12 recall only 0.625

### Cross-Cutting Pattern 2: Synthetic/Read-Only Benchmarks, Mutating Production

All five clusters' benchmarks ran against synthetic data, read-only corpus copies, or in-memory overlays — never against live, mutating production state.

### Per-Cluster Confidence Beyond Labeled Set

| Cluster | Confidence | Primary Limitation |
|---------|-----------|-------------------|
| 001 Multihop tail-appends | Low-Medium | Domain-specific heuristic (NNN-slug convention); K=12 only 0.625 |
| 006 CG staleness repair | Medium | Graph consistency principle general, 3-file synthetic test narrow |
| 006 CG bitemporal reads | Low-Medium | Proven isolated, consumer unwired |
| 007 Advisor RRF fusion | Medium-High | Theory-backed, but only 1/42 prompts moved |
| 008 Deep-loop dedup | Low-Medium | 17 synthetic records, scale unknown |
| 008 Deep-loop gauges | Medium | Principles sound, production defaults undefined |
| 003 True-citation ledger | Low | Zero live density, gated on traffic |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:review-summary -->
## REVIEW SUMMARY

The full deep-review findings live in `review/review-report.md`.

| Field | Value |
|-------|-------|
| **Verdict** | PASS (4 GRADUATE clusters, 1 REFINE) |
| **Findings** | Per-cluster confidence in section 4; recommendations in section 5 |
| **Report** | `review/review-report.md` |
<!-- /ANCHOR:review-summary -->

---

<!-- ANCHOR:recommendations -->
## 5. RECOMMENDATIONS

1. **Re-classify bitemporal reads as REFINE, not GRADUATE.** Consumer wiring is a pre-condition the benchmark acknowledges but verdict doesn't reflect.
2. **Add production-reader-distribution measurements to multihop benchmark.** Entire win depends on unmeasured deep-K consumer behavior.
3. **Set production defaults for all undefined tunables before graduation.** Degree cap (0), heartbeat cadence (0), lag ceiling (0) have no production defaults.
4. **Add synthetic-to-production scale tests for dedup.** Precision 1.0 on 17 records needs validation on 50+ real findings.
5. **Track RRF benefit on production prompt distribution.** 37/42 agreement may shift on actual advisor calls.
6. **Document implicit penalty replacing cut guard.** `auditRecsAdvisorPenalty` has no flag, benchmark, or contract.
<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:research-context -->
## 6. RESEARCH CONTEXT

Deep research active for this topic. The canonical research report lives at `research/research.md`. Four iterations triangulated implementation code (9 files), benchmark evidence (7 files across 5 clusters), and retrieval/graph/routing theory (Cormack et al. 2009 RRF, incremental index consistency, structured dedup theory, citation mining).

**Convergence:** Stopped at 4 iterations (max 10). All 6 key questions resolved. Average newInfoRatio 0.8375. Quality gates: source diversity ✓, focus alignment ✓, no single weak source ✓.
<!-- /ANCHOR:research-context -->

---

<!-- ANCHOR:references -->
## 7. REFERENCES

- Full research: `research/research.md`
- Iterations: `research/iterations/iteration-001.md` through `004.md`
- State log: `research/deep-research-state.jsonl`
- Parent spec: `../005-dark-flag-graduation/spec.md`
- `005-dark-flag-graduation/benchmark-and-test-status.md`
- Cormack, Clarke, Buettcher (2009). "Reciprocal rank fusion outperforms Condorcet and individual rank learning methods." SIGIR.
<!-- /ANCHOR:references -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None. All research questions resolved with evidence.
<!-- /ANCHOR:questions -->
