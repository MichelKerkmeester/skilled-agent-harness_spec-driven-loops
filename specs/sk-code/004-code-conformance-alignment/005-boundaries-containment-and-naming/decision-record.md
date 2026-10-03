---
title: "Decision Record: Boundaries, Containment and Naming"
description: "Architecture decisions for this phase, carried over from the ADR section of plan.md."
trigger_phrases:
  - "decision record"
  - "boundaries containment and naming decisions"
  - "five checks evaluation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/004-code-conformance-alignment/005-boundaries-containment-and-naming"
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
# Decision Record: Boundaries, Containment and Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

The decisions below are carried over verbatim from the ADR section of `plan.md`; their status there is the status here.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Consume the shared containment helper; never author a second one

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed — **[OPERATOR-DECISION: Q3 — containment helper ownership]** |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-001-context -->
### Context

Five sites here and four in the security register share one defect class: lexical path comparison where the standard mandates canonical resolution. The security register has the higher-severity instances and is the security-owning program.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Import the shared helper at all five sites. If it is not available in time, author it in a shared location explicitly designed for the other program to adopt — never a private copy.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- *Five local fixes*: five implementations of a security primitive, guaranteeing divergence.
- *Wait indefinitely*: leaves five confirmed containment defects open on an unbounded timeline.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- One implementation of a security-critical primitive, with one place to fix a future bug in it.
- A hard dependency edge on another program's schedule, mitigated by the shared-location fallback.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Extract in smallest-safe increments, and accept an intermediate state

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-002-context -->
### Context

The MCP entrypoint is 2,288 lines against a 400-line guideline. It is the startup path for a runtime-facing server, so an ordering change is a live outage.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

Extract cohesive lifecycle domains behind contracts that already exist, one extraction per commit, each verified by a startup-order smoke and MCP runtime verification against a rebuilt `dist`. Stop when the next extraction is no longer safe, and record the resulting line count honestly rather than forcing it to a number.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

- *One restructuring commit*: unrevertible at useful granularity on a live startup path.
- *Leave it entirely*: the finding is confirmed and the guideline is explicit about extracting modules.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- Every extraction is independently revertible and independently verified.
- The file will likely still exceed the guideline when this child completes; that intermediate state is recorded as accepted rather than quietly claimed as closed.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Rebuild before every runtime verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-003-context -->
### Context

Runtime-facing MCP servers and hooks execute built `dist` output. A TypeScript source change that is not rebuilt is verified against the previous build.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

Every TypeScript unit in this child rebuilds its owning package before any runtime verification, and the rollback procedure rebuilds too.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

- *Verify against the existing `dist`*: tests the old code and produces a false green — the exact failure mode child 004 exists to eliminate elsewhere.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- Runtime verification means something.
- Each unit costs a build, which is why units are grouped per package rather than per file.
<!-- /ANCHOR:adr-003-consequences -->
<!-- /ANCHOR:adr-003 -->
