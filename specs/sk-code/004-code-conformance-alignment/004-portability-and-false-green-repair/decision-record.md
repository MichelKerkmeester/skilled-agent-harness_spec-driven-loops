---
title: "Decision Record: Portability and False-Green Repair"
description: "Architecture decisions for this phase, carried over from the ADR section of plan.md."
trigger_phrases:
  - "decision record"
  - "portability and false-green repair decisions"
  - "five checks evaluation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/004-code-conformance-alignment/004-portability-and-false-green-repair"
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
# Decision Record: Portability and False-Green Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

The decisions below are carried over verbatim from the ADR section of `plan.md`; their status there is the status here.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Errexit is adopted command by command, never as a flag flip

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-001-context -->
### Context

Three `.opencode/bin` git-coordination scripts run `set -uo pipefail` deliberately because they tolerate expected non-zero exits from probe commands. The verifier reports this as 3 `SH-STRICT-MODE` errors, and the naive fix — adding `-e` — will abort a rebase mid-flight.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Build a per-command tolerance inventory first; convert each tolerated non-zero exit into an explicit guarded conditional; only then add `-e`. Verify with nine failure-injection cases asserting **unchanged** exit semantics.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- *Blanket `set -e`*: not behaviour-preserving; the archetype of a conformance fix that breaks production.
- *Document the omission as an accepted exception*: leaves a real hard-blocker unaddressed and keeps the verifier permanently red on this root.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- The scripts become conformant without a behaviour change, and the tolerance that was implicit becomes documented in the code.
- The lane is slow relative to its line count, and it is the highest-risk work in the whole program.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A skip is a failure for this child

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-29 (first recorded in `plan.md`) |
| **Deciders** | Not recorded |

---

<!-- ANCHOR:adr-002-context -->
### Context

Two MCP suites skip when a hardcoded absolute packet path is absent, reporting green for coverage that never ran. Repairing them will surface work that was always missing.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

For the duration of this child, a skipped case counts as a failure. Coverage either runs or fails loudly with a message naming the expected path.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

- *Keep the skip but log it*: a logged skip is still green on a dashboard, which is the defect.
- *Delete the suites*: removes the false green by removing the coverage, which is worse.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- Green becomes meaningful on these suites.
- The repair may surface a body of genuinely failing coverage that must be triaged rather than re-muted, and that triage may exceed this child's scope — in which case it is escalated, not silenced.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->
