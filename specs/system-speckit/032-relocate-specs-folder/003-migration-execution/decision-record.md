---
title: "Decision Record: Specs-Root Migration Execution"
description: "One decision: this phase executes phase 002's already-accepted ADRs rather than re-deciding anything, and adds a double-gate so scoping the runbook never implies permission to run it."
trigger_phrases:
  - "migration execution decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/003-migration-execution"
    last_updated_at: "2026-08-06T19:31:37Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the double-gate decision"
    next_safe_action: "Operator separately approves an actual run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Specs-Root Migration Execution

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scope the runbook without running it — a separate approval gates execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-06 |
| **Deciders** | Operator, Claude Code |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator confirmed "scope phase 003 now" — set up the execution plan, not run it — after an earlier ambiguous one-word message arrived alongside an unrelated `/remote-control` toggle. Given the blast radius (flipping a live symlink and editing 7-12 shared framework files every spec packet depends on), scoping and executing needed to be treated as genuinely separate decisions, not one action.

### Constraints

- Phase 002 already accepted the technical design (ADR-001, ADR-002 in `../002-migration-plan/decision-record.md`) — this phase does not re-decide those.
- The runbook, once written down, is itself persuasive — a reader could reasonably assume a fully-specified plan is ready to run. That assumption needed to be explicitly blocked, not left implicit.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Write the complete, literal runbook (`plan.md` §4, 11 steps) but leave every execution task in `tasks.md` unchecked, and set `spec.md` Status to "Draft — runbook scoped, not yet run." Running the runbook requires a separate, explicit, future operator approval — not inferred from accepting this scope.

**How it works**: `spec.md` REQ-007 makes the unchecked-tasks requirement a formal acceptance criterion, not just a convention. The `AI EXECUTION PROTOCOL` in `plan.md` repeats the same gate as its first Pre-Task Checklist item.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope only, double-gate before execution (chosen)** | Matches what was actually approved; the highest-blast-radius phase in this packet gets the most explicit safety discipline | Requires a follow-up conversation to actually run it | 9/10 |
| Scope and immediately execute in the same turn | Fewer round-trips | Treats "scope phase 003" and "run the migration" as the same approval, when the triggering message was genuinely ambiguous | 2/10 |
| Decline to scope until execution is separately pre-approved | Maximally cautious | The operator explicitly asked for scoping now; refusing to do the requested, lower-risk work would be overcautious given a clear answer was already given |  4/10 |

**Why this one**: It does exactly what was asked (scope now) without smuggling in permission for the higher-stakes action (run now) that wasn't actually confirmed.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: A future "run it" request has a ready, literal runbook to execute — no re-deriving design. The double-gate makes the current state (nothing has run) impossible to misread from the documents alone.

**What it costs**: One more round-trip before the actual migration can happen. Given the blast radius, that cost is worth paying.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future session reads this runbook and runs it without asking again | High | `spec.md` Status field and `tasks.md` unchecked tasks are both direct, load-bearing signals — not just prose commentary |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The blast radius (live symlink flip, shared framework files) genuinely warrants a distinct execution gate |
| 2 | **Beyond Local Maxima?** | PASS | Considered scope+execute together and refuse-to-scope; both rejected with reasons above |
| 3 | **Sufficient?** | PASS | The gate is enforced in two places (spec.md Status, tasks.md checkboxes), not just narrated once |
| 4 | **Fits Goal?** | PASS | Directly answers what the operator confirmed — scope now, run later |
| 5 | **Open Horizons?** | PASS | The runbook itself doesn't need rework when the operator does approve running it — only the gate needs lifting |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: Nothing in the live repository. `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this file — planning documents only.

**How to roll back**: Delete `003-migration-execution/`. Phases 001 and 002 are unaffected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
