---
title: "Decision Record: Conformance Rulings and Gate Repair"
description: "Architecture decisions for this phase, carried over from the ADR section of plan.md."
trigger_phrases:
  - "decision record"
  - "conformance rulings and gate repair decisions"
  - "five checks evaluation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/004-code-conformance-alignment/001-conformance-rulings-and-gate-repair"
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
# Decision Record: Conformance Rulings and Gate Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

The decisions below are carried over verbatim from the ADR section of `plan.md`; their status there is the status here.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Repair the gate before sweeping the population

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-001-context -->
### Context

79 nonconformance findings exist because three enforcement mechanisms were blind. Sweeping first would produce a large diff whose conformance claim rests on the same broken gate that let the drift in.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

No code batch runs until the gate parses, the completion wrapper's scan root is a recorded decision, and a per-root baseline is captured.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- *Sweep first, repair later*: the sweep would be unverifiable and would re-drift behind the same blind gate.
- *Repair only the parse failure*: leaves the scan-root and manual-header blindness intact, which are the structural causes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Later children can claim "N warnings closed, zero new" against a real number instead of a bare `PASS`.
- The program's start is delayed by the length of this phase, and two operator decisions sit on the critical path.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Amend the standard rather than migrate 1,228 files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-002-context -->
### Context

The documented test vocabulary names `*.test.js` (0 files at HEAD) and omits `*.vitest.ts` (1,228 files). The Vitest configs and the alignment verifier already recognise the real convention.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

Amend the documented table to the repository's real vocabulary with explicit discovery contracts. No filename migration.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

- *Rename 1,228 files*: enormous blast radius to satisfy a document that describes 43 files, argued against independently by four research iterations.
- *Leave both*: keeps a false-green contract in which the documented convention and the discovered convention disagree.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- The standard becomes checkable: no listed pattern may glob to zero.
- One documented rule changes, which means anything that quoted the old table needs a consumer sweep.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Widen the completion gate with warnings non-blocking

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed — **[OPERATOR-DECISION: Q5 — three-guard scan scope]** |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-003-context -->
### Context

The wrapper scans one skill tree, so the mandated completion gate has been near-vacuous. Widening it immediately surfaces the entire backlog on every completion claim until children 003 and 004 land.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

Widen the scan root now, run without `--fail-on-warn` until the sweep completes, then promote warnings to blocking.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

- *Widen and accept blocking noise*: disruptive to every unrelated completion claim for the duration of the program.
- *Keep narrow, add a separate CI job*: leaves the mandated gate itself misleading, which is the defect.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- The gate starts telling the truth immediately, without blocking unrelated work.
- There is a window in which the gate reports a large known backlog, which reviewers must be told to expect.
<!-- /ANCHOR:adr-003-consequences -->
<!-- /ANCHOR:adr-003 -->
