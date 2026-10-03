---
title: "Decision Record: Header, Directive and Structure Sweep"
description: "Architecture decisions for this phase, carried over from the ADR section of plan.md."
trigger_phrases:
  - "decision record"
  - "header directive and structure sweep decisions"
  - "five checks evaluation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/004-code-conformance-alignment/003-header-directive-and-structure-sweep"
    last_updated_at: "2026-09-07T18:33:41+02:00"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Recorded the plan.md ADRs as decision entries"
    next_safe_action: "Update entries when an ADR status changes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Header, Directive and Structure Sweep

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

The decisions below are carried over verbatim from the ADR section of `plan.md`; their status there is the status here.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Two gates per root, not one

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-001-context -->
### Context

The drift verifier does not check header shape. On four lane A roots it returns `PASS` today while header-less files sit in the scanned set. Gating this phase on the verifier alone would reproduce the exact blindness that created the population.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Every root carries a header census as the closure gate and a verifier delta as the no-regression gate. A completion claim must report both.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- *Verifier only*: cannot see the defect being fixed.
- *Census only*: cannot see a regression the transform introduces.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- The claim becomes falsifiable in both directions: the class is closed, and nothing else broke.
- Two numbers must be captured and reported per root, which is more bookkeeping than a single `PASS`.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Three lanes ordered by blast radius, one commit per root

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-002-context -->
### Context

The population spans live hooks that run on every edit, authoring tooling, and benchmark rigs. A single sweeping commit would make a bad transform unrevertible without losing good work.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

Three lanes, gated independently; within a lane, one commit per root.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

- *One commit for the whole sweep*: unrevertible at useful granularity.
- *Per-file commits*: review noise without additional safety, since the gates are per root.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- Any root reverts alone, and lane A's live surfaces are gated by actually executing them.
- The phase takes longer and produces more commits than a single sweep.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Fixture subjects are permanently exempt, enforced twice

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed — ruling inherited from child 001 |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-003-context -->
### Context

Benchmark fixture subjects violate the standard by design; they are the inputs a grader is scored against. Editing them silently invalidates every historical result.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

Exempt `**/benchmarks/**/fixtures/**` and seeded subject corpora, enforced both as a codemod filter and as a post-hoc diff assertion.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

- *Filter only*: a filter bug would silently corrupt the corpus.
- *Sweep fixtures too*: destroys the comparability of every historical benchmark result.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- Benchmark history stays comparable, and an accidental edit is caught even if the filter is wrong.
- The standard carries a permanent documented exception, which must be discoverable so a future author does not "fix" the fixtures.
<!-- /ANCHOR:adr-003-consequences -->
<!-- /ANCHOR:adr-003 -->
