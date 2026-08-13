---
title: "Decision Record: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries"
description: "Decision record for 027-mode-gate-and-contract-binding: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "mode gate contract binding"
  - "readiness gate sealed digest binding"
  - "rollback switch certificate binding"
  - "conformance event unbound reducer"
  - "deep loop 027 gates"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/027-mode-gate-and-contract-binding"
    last_updated_at: "2026-08-07T07:33:38Z"
    last_updated_by: "codex"
    recent_action: "Accepted ADR-001 and ADR-002 after implementation and direct verification"
    next_safe_action: "No further packet-local action; orchestrator lands runtime and batch-reconciles packet docs"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One shared strict gate validator replaces legacy clone drift

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

---

<!-- ANCHOR:adr-001-context -->
### Context

Research and review are legacy clones of the newer mode gates and have drifted: they accept unknown top-level keys and filter malformed rollback-window rows where the newer modes reject both, they reject the promise on `null` input instead of returning a blocked disposition, and their rollback switches build certificates from returned fields without comparing them to the prepared request. Four local patches would fix today's drift and leave the mechanism that produced it.

### Constraints

- These are the gates `014` reads to decide a flip, so a destabilising refactor is expensive.
- The model and skill gates already implement the target behavior and can serve as the reference.
- `032` will adopt the same validator for its P2 riders, so the interface must be stable before `032` starts.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One shared strict validator, adopted by the research, review, common and agent gate families, with the model and skill gates as the behavioral reference.

**How it works**: The validator performs prepared-request comparison, artifact-claim binding and version-binding comparison, and returns a blocked disposition with a stable reason code rather than throwing. Each family adopts it in its own commit so a regression is revertible per family.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One shared validator, per-family adoption** | Drift cannot recur; `032` inherits it; adoption is revertible per family | A wide refactor under `014` | 9/10 |
| Four local patches | Smallest per-gate change; no shared interface to design | The drift mechanism survives; the next clone drifts again | 3/10 |
| Delete the legacy clones and route research and review through the newer gates | Cleanest end state | Much wider behavioral change than this child can verify; the clones may encode real per-mode differences | 5/10 |

**Why this one**: A shared validator makes the four families converge by construction, and per-family adoption keeps the refactor revertible while `014` is pending.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Gate behavior becomes uniform, so a flip decision means the same thing in every mode.
- `032` adopts the validator instead of patching the same file again.
- Clone drift cannot recur, because there is one implementation.

**What it costs**:
- A wide refactor across four families under `014`. Mitigation: one family per commit, with the reference behavior as the target.
- The validator interface must be stable before `032` starts. Mitigation: this child hands it over explicitly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Adoption destabilises a gate under `014` | H | One family per commit; revert per family |
| The validator encodes a research-shaped assumption that breaks another mode | M | Parity tests against the model and skill reference behavior |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nine findings across four families describe the same permissive gate |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including deleting the clones |
| 3 | **Sufficient?** | PASS | One validator plus per-family adoption closes all nine |
| 4 | **Fits Goal?** | PASS | These gates authorize every `014` flip |
| 5 | **Open Horizons?** | PASS | A new mode gate imports the validator instead of cloning a neighbour |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- A shared strict validator module.
- Four `*-rollback-gate` families plus the council and alignment rollback switches.

**How to roll back**: Revert the adoption commit for the affected family; the validator stays in place for the others.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Gate outcomes are values, never rejected promises

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-013-06` records that deep-research and deep-review gates reject the promise on `null` input instead of returning a blocked disposition. A workflow that branches on a gate result then has two failure channels: a blocked value and an exception, and the exception path is easy to swallow.

### Constraints

- Existing callers may currently catch the rejection and treat it as a block, so the change must not silently alter their behavior.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Every gate returns a value. Malformed and `null` input produce a blocked disposition with a stable reason code.

**How it works**: Input validation happens before any work and produces a blocked result rather than throwing. Reason codes are shared across families with a per-family detail field.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Always return a value** | One failure channel; workflows branch instead of catching; reasons are inspectable | Callers that relied on the throw must be checked | 9/10 |
| Keep throwing but document it | No caller change | The swallow-the-exception failure mode stays available | 2/10 |
| Throw a typed error subclass | Callers can discriminate | Still two channels; a caller that forgets the catch still loses the block | 5/10 |

**Why this one**: A single outcome channel is the difference between a workflow that can branch on a block and one that can lose it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A blocked gate is always observable in the result rather than sometimes in an exception.
- Reason codes make the block diagnosable.

**What it costs**:
- Callers that relied on the throw must be checked. Mitigation: enumerate them during the clone-drift diff.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller treats a blocked value as success because it only checked for throws | M | Enumerate callers during Phase 1; update them in the same change |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `F-013-06` describes a gate that throws where its siblings return |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | Returning a value with a reason code is the whole fix |
| 4 | **Fits Goal?** | PASS | A flip decision must be a value the workflow can act on |
| 5 | **Open Horizons?** | PASS | New reason codes extend the enumeration |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Input validation in all four gate families.
- The shared reason-code enumeration.

**How to roll back**: Revert the input-validation commit per family; the throw returns for that family only.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
