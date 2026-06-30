---
title: "Decision Record: Reliability-Weighted Convergence"
description: "Architectural decisions for the deep-loop reliability cluster: benchmark-first, one f64 Beta primitive, read-only D2, default-off policy and deterministic non-destructive contradiction quarantine."
trigger_phrases:
  - "reliability convergence decision record"
  - "deep loop beta primitive ADR"
  - "contradiction quarantine ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/004-reliability-weighted-convergence"
    last_updated_at: "2026-06-19T10:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Added the Level 3 decision record for the reliability cluster"
    next_safe_action: "Hold implementation until the benchmark gate and shared primitive plan are confirmed"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-004-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Reliability-Weighted Convergence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Benchmark-first reliability cluster with one shared f64 primitive

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Michel Kerkmeester, codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The deep-loop STOP score is count-floodable today because source diversity and evidence depth saturate on raw counts. The 028 research found a structural reliability slot, but no writer populates it, so every current input is the prior value `0.5`. That means the reliability cluster cannot claim value from structure alone.

### Constraints

- No candidate ships on inference only.
- The integer scorer stays unchanged because it rejects fractional inputs.
- Reliability consumers share one f64 Beta primitive with Skill Advisor and the sibling deep-loop work.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Gate the cluster on a benefit micro-benchmark, then add one shared f64 Beta export before D2 consumes it.

**How it works**: The benchmark decides GO or HOLD. If it goes, D-orderhelper and D1 land first, D2 derives `reliabilityPosterior` read-only, then D3, D4, Q2, Q2-seat and Q7 consume that one signal.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Benchmark-first plus shared f64 primitive** | Honest GO/HOLD gate, one math module | Requires sequencing and calibration | 9/10 |
| Ship D3 on structural inference | Faster | No measured benefit, threshold risk | 2/10 |
| Reuse the integer scorer | Existing code | Throws on fractional inputs | 1/10 |
| Fork a second Beta helper | Local speed | Diverges from advisor and D2 consumers | 3/10 |

**Why this one**: It avoids two failure modes at once: an unmeasured STOP change and a duplicated reliability primitive.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The cluster has a measured GO/HOLD gate before touching STOP behavior.
- Every reliability consumer can share one posterior contract.

**What it costs**:
- D3 cannot move until the benchmark, D1 and D2 are ready. Mitigation: keep D-orderhelper and D1 as leaf work.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Benchmark shows no value | M | Hold the cluster and keep the docs as planning record |
| Shared primitive location unclear | M | Decide the module location before D2 work starts |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Raw count saturation is confirmed in spec.md section 2 |
| 2 | **Beyond Local Maxima?** | PASS | Ship-now, integer reuse and fork alternatives rejected |
| 3 | **Sufficient?** | PASS | Benchmark plus one primitive addresses the main blast radius |
| 4 | **Fits Goal?** | PASS | The 028 roadmap names the reliability cluster as a keystone follow-on |
| 5 | **Open Horizons?** | PASS | One posterior contract can serve D2, Q2, Q7 and advisor consumers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add a new f64 Beta export beside the integer scorer.
- Derive D2 read-only from metadata and consume it in default-off downstream policy.

**How to roll back**: Disable the reliability policy, revert the candidate commit and rerun the policy-OFF parity tests.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Read-only D2, default-off D3/D4 and non-destructive Q2

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Michel Kerkmeester, codex |

---

<!-- ANCHOR:adr-002-context -->
### Context

D2 is the keystone signal for D3, Q2, Q7 and the council-side multiplier. The metadata slot exists, but there is no reliability writer. Contradictions also need trust-keyed victim selection without deleting either finding.

### Constraints

- D2 reads reliability and never writes it.
- D3 is default-off until threshold recalibration is captured.
- Q2 keeps both contradiction nodes and excludes only by read-path edge presence.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep D2 read-only, gate D3/D4 behind an off-by-default policy and make Q2 deterministic but non-destructive.

**How it works**: Missing reliability defaults to `0.5`. D3 caps existing volume terms only when the policy is enabled. Q2 selects the lower-trust side with a content-derived tie-break, then excludes it from stability and contradiction scoring without deleting the node.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **[Chosen] Read-only, default-off and non-destructive** | Reversible, benchmarkable, no data loss | More gates before value | 9/10 |
| Add a reliability writer now | More complete signal | New write-path outside scope | 3/10 |
| Turn D3 on by default | Faster adoption | Breaks STOP calibration risk | 2/10 |
| Delete the lower-trust contradiction side | Simple graph state | Data loss and asymmetric recall | 1/10 |

**Why this one**: The existing data is weak, so the safe path is to read, gate and exclude by policy instead of writing, flipping or deleting.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Policy OFF keeps current behavior byte-identical.
- Contradiction handling becomes deterministic without losing source evidence.

**What it costs**:
- The reliability write-path remains a follow-on. Mitigation: D2 tests the all-0.5 regime honestly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| D3 scale breaks STOP threshold | H | Default-off policy and recalibration run |
| Q2 victim choice is unstable | M | D-orderhelper total comparator and property test |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | D2 feeds every reliability consumer |
| 2 | **Beyond Local Maxima?** | PASS | Writer-now, default-on and delete-node alternatives rejected |
| 3 | **Sufficient?** | PASS | Read-only D2 and default-off policy isolate blast radius |
| 4 | **Fits Goal?** | PASS | Matches the 028 requirement for benchmark-gated convergence hardening |
| 5 | **Open Horizons?** | PASS | A later writer can populate the same reliability slot |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- D2 emits `reliabilityPosterior` and `distinctReliableSourceCount` read-only.
- D3/D4 add a default-off policy and validation.
- Q2 adds deterministic lower-trust victim selection and read-path exclusion.

**How to roll back**: Turn the policy off, revert Q2 and D2 consumer commits, then rerun the policy-OFF parity tests.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

