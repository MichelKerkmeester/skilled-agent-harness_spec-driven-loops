---
title: "Decision Record: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract [template:level_3/decision-record.md]"
description: "Decision record template for documenting architectural choices, alternatives, consequences, and implementation notes."
trigger_phrases:
  - "decision"
  - "record"
  - "name"
  - "template"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/009-evidence-contract"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-evidence-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Ship the evidence contract as advisory metadata, not a blocking gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

<!-- Voice guide: State the problem directly. "We needed to choose between X and Y because Z"
     not "A decision was required regarding the selection of an appropriate approach." -->

We needed every load-bearing claim at the dispatch boundary to carry its proof in a fixed, checkable shape, without breaking any older agent exchange that does not yet emit that proof. The choice was whether validation should reject (block) an exchange that lacks or malforms the evidence metadata, or only warn. The stakes: a blocking gate would force adoption but would instantly fail every legacy exchange and the deep-loop iterations that predate the contract.

### Constraints

- Backward compatibility is a hard acceptance criterion: a valid exchange without the optional metadata must still pass.
- The fable-5 research keeps behavioral and evidence advisories non-blocking until phase 003 establishes a baseline.
- The change must reuse the existing `PostDispatchAdvisory` warning channel rather than inventing a parallel mechanism.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Validate the five-field evidence schema at post-dispatch and emit advisory warnings only, adding no new blocking failure reason.

**How it works**: A standalone `evidence-contract.ts` module defines the fields and a `validateEvidenceContract` helper that classifies an input as present, absent, or malformed. The `post-dispatch-validate.ts` validator calls that helper and maps a malformed result to `PostDispatchAdvisory` warnings on the existing `warnings` array. Absent metadata is a silent no-op, so the exchange result stays `ok: true` in every case.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisory (chosen)** | Backward-compatible; reuses existing plumbing; matches the research's advisory-until-baselines stance | Will not force adoption; producers must be retrofitted later | 9/10 |
| Blocking gate | Forces adoption immediately | Breaks every legacy exchange; contradicts the research; no baseline exists | 3/10 |
| Separate validator service | Isolated | Over-engineered for an in-memory schema check; new failure surface | 2/10 |

**Why this one**: Advisory is the only option that satisfies the hard backward-compatibility criterion while still landing the schema; promotion to blocking can be a later, baseline-gated decision.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A grep for the five field names across `deep-loop-runtime` stops returning zero hits - the proof a claim should carry now has a fixed shape to land in.
- The doctrine that a finding is a hypothesis until verified gains a structural backstop instead of relying on prose discipline alone.

**What it costs**:
- Warnings alone will not force producers to fill the fields. Mitigation: document the contract in `agent-io-contract.md` so a later retrofit phase is cheap.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A new blocking failure reason slips in and breaks legacy exchanges | H | REQ-003 forbids it; a regression test asserts absence-stays-green. |
| The doc and the module disagree on allowed values | M | The module is the single source of truth; the doc cites it rather than restating values. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The contract is still open - grep returns zero hits for the five fields today. |
| 2 | **Beyond Local Maxima?** | PASS | Blocking gate and separate-service options were weighed and rejected with rationale above. |
| 3 | **Sufficient?** | PASS | A pure schema module plus the existing advisory channel is the simplest approach that lands the contract. |
| 4 | **Fits Goal?** | PASS | This is dedicated packet P1 in the fable-5 sequence and the structural backstop for the verification doctrine. |
| 5 | **Open Horizons?** | PASS | Advisory now leaves a clean path to baseline-gated promotion and a producer-retrofit phase later. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts` is created with the five fields and `validateEvidenceContract`.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` calls the validator and surfaces advisories.
- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` documents the `AGENT_IO_EVIDENCE v1` group.

**How to roll back**: Remove the `validateEvidenceContract` call from `post-dispatch-validate.ts` and re-run its vitest suite to confirm prior behavior. Optionally delete `evidence-contract.ts` and `evidence-contract.vitest.ts` for a clean revert; no data migration exists.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

