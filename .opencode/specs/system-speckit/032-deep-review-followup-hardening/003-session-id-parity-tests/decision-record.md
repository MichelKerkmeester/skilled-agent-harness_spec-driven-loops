---
title: "Decision Record: Session-Id Parity Tests"
description: "Architecture decision for pinning cross-mode workflow parity with structural contract tests instead of end-to-end dispatch tests."
trigger_phrases:
  - "parity tests decisions"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-deep-review-followup-hardening/003-session-id-parity-tests"
    last_updated_at: "2026-07-02T15:20:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored ADR"
    next_safe_action: "Implementer confirms decision holds during build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-003-parity-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Session-Id Parity Tests

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Structural Contract Tests Over End-To-End Dispatch Tests

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 032 orchestrator (Claude) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The regression class is "one mode's YAML drifts from the shared contract". Catching it end-to-end would mean dispatching real lineages per mode per test run — minutes of wall-clock, real model spend, and hermeticity loss. The contract itself is small and structural: a named step, a bind, a fallback, a consumption site, plus one runtime emission line.

### Constraints
- Tests must be hermetic (repo files + pure functions only) and fast enough for the standard suite.
- The runtime half (prompt emission) must not be left untested, or the tests give false confidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Pin the contract structurally — parse the three YAMLs and assert the contract nodes; cover the runtime half by asserting the prompt builder's session_id emission per loop type. No dispatch tests.

**Details**: Structural parsing over raw-text matching wherever possible; literal token assertions only where the contract IS a literal token (`{session_id}`, `{session_id_init}`).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Structural contract tests (chosen)** | Hermetic, fast, precise failure messages | Cannot catch semantic YAML-interpreter changes | 9/10 |
| End-to-end lineage dispatch per mode | Tests the whole chain | Slow, costly, non-hermetic, flaky across CLI versions | 3/10 |
| Raw-text grep assertions | Trivial to write | Brittle against cosmetic edits; noisy failures erode trust | 5/10 |

**Why Chosen**: The failure history is structural drift, not interpreter semantics; the cheap test targets the actual regression class.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Parity failures are named, fast, and land in the standard suite.
- Zero production surface touched.

**Negative**:
- A YAML-interpreter behavior change could honor different semantics while structure passes. Mitigation: out of scope; interpreter changes have their own test surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cosmetic refactors of the YAMLs break tests | L | Structural parsing; failures name exactly what moved |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The same contract drifted once already (GPT-F004) with zero detection |
| 2 | **Beyond Local Maxima?** | PASS | End-to-end and grep alternatives scored |
| 3 | **Sufficient?** | PASS | Covers both halves of the contract (YAML + prompt emission) |
| 4 | **Fits Goal?** | PASS | Closes the review's explicit parity-test recommendation |
| 5 | **Open Horizons?** | PASS | The file is the natural home for future cross-mode contract assertions |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: deep-loop-runtime test suite only.

**Rollback**: Delete the test file.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
