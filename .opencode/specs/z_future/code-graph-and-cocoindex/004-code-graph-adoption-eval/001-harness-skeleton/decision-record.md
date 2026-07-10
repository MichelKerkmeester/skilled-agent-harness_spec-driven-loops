---
title: "Decision Record: 027/006 Code Graph Adoption Evaluation Harness"
description: "Architecture decisions for keeping subprocess/auth/result-schema hardening in the Level 3 eval harness packet."
trigger_phrases:
  - "027 phase 006 decision record"
  - "code graph adoption eval adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/004-code-graph-adoption-eval/001-harness-skeleton"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Converted Phase 004 decision record to Level 3 ADR structure"
    next_safe_action: "Use ADR-001 as implementation guardrail for dispatcher hardening"
---
# Decision Record: 027/006 Code Graph Adoption Evaluation Harness

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bump Phase 004 from Level 2 to Level 3

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-08 |
| **Deciders** | Spec-kit research refinement owner |
| **Driver** | pt-02 cross-validation amendments for Phase 004 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The pt-02 cross-validation cycle flagged Phase 004 as `NEEDS_AMENDMENT` with five blocking operational findings:

- **B-iter005-001**: Subprocess lifecycle is underspecified.
- **B-iter005-002**: Provider auth preflight is missing.
- **B-iter005-003**: A subprocess can survive timeout and keep shared OpenCode state locked.
- **B-iter005-004**: Result row schema is loose enough to corrupt paired statistics.
- **B-iter005-005**: A 1 by 2 smoke test is not enough reliability proof for a 12 to 20 task by 2 condition harness.

### Constraints

- The eval harness is the only current consumer of this dispatcher hardening.
- The harness is last in the phase sequence and depends on Phases 001 through 004.
- Live runs are slow and quota-consuming, so failure contracts need mocked coverage first.
- The phase must preserve complete-pair statistical integrity under mixed success, timeout, retry, and metrics-missing outcomes.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep subprocess/auth/result-schema hardening inside Phase 004 and bump the phase from Level 2 to Level 3.

**How it works**: Phase 004 owns provider preflight, hardened subprocess lifecycle, discriminated JSONL result rows, stale-process retry behavior, incomplete-pair reporting, and a mocked 12 by 2 dispatcher stress test before any live full harness run.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Level 3 integrated hardening** | Keeps risk controls with the only consumer; no new phase dependency; aligns with pt-02 blockers | Larger single packet, roughly 680 to 800 LOC | 8/10 |
| Separate subprocess-hardening packet | Smaller eval packet; reusable if a second consumer appears | Adds a sixth sibling phase and dependency edge before reuse is earned | 5/10 |
| Stay Level 2 and reject blockers | Lower upfront work | Leaves timeout, auth, schema, and stress-test gaps that pt-02 explicitly found | 2/10 |

**Why this one**: The hardening is necessary for the harness to produce trustworthy results, and extracting it before another consumer exists would add coordination cost without clear reuse.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The eval harness has explicit failure semantics before live runs.
- Paired statistics exclude incomplete pairs by construction.
- Provider and subprocess failures fail fast or record structured rows instead of silently corrupting output.

**What it costs**:
- The phase grows from the original Level 2 estimate to a Level 3 packet.
- Implementation sequencing becomes stricter: preflight, dispatcher helper, schema, mocked stress, report, smoke, then live run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Single packet becomes too large | Medium | Keep implementation order narrow and defer shared extraction until a second consumer appears |
| Mocked stress diverges from live subprocess behavior | Medium | Keep one-task-per-condition smoke after mocked stress |
| Result schema becomes too rigid | Low | Use explicit versioning if later metrics need additional fields |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | pt-02 found five blocking operational gaps in the original Level 2 shape |
| 2 | **Beyond Local Maxima?** | PASS | Split-packet and reject-blocker alternatives were evaluated |
| 3 | **Sufficient?** | PASS | REQ-011 through REQ-015 cover auth, lifecycle, schema, stress, and stale-process behavior |
| 4 | **Fits Goal?** | PASS | The goal is a trustworthy local adoption eval, not a generic process library |
| 5 | **Open Horizons?** | PASS | The dispatcher helper can still be extracted later if another consumer appears |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 004 remains Level 3.
- `spec.md` includes REQ-011 through REQ-017 and Level 3 risk/user-story sections.
- `tasks.md` sequences mocked dispatcher stress before live full harness execution.
- `checklist.md` records the mocked stress gate, subprocess hardening, and complete-pair reporting checks.

**How to roll back**: Split REQ-011 through REQ-015 into a new prerequisite phase, downgrade Phase 004 to Level 2, and update parent phase dependencies. Do not downgrade without preserving the pt-02 blocker coverage somewhere else.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Mocked Stress Test Before Live Harness Run

### Status

Accepted.

### Context

The original 1 by 2 smoke test proves only that the harness can start one baseline and one after run. It does not prove dispatcher behavior under mixed success, retry, timeout, metrics-missing, DB/readiness retry, and final-failed outcomes.

### Decision

REQ-014 mocked dispatcher stress is a hard prerequisite before any manual full-harness invocation. The smoke test remains valuable, but only as an integration sanity check after mocked stress passes.

### Consequences

The implementation must expose enough dispatcher seams to mock subprocess outcomes. That adds test scaffolding, but prevents slow live runs from becoming the first reliability test.

---

## ADR-003: Keep the Smoke Test but Downgrade Its Role

### Status

Accepted.

### Context

The smoke test is cheap and still validates env passing, output paths, session-id capture, and report wiring. Removing it would lose a useful end-to-end sanity check.

### Decision

Keep the 1 by 2 smoke test, but document it as insufficient on its own. The reliability proof is the mocked 12 by 2 dispatcher stress test.

### Consequences

The verification order is explicit: mocked stress first, smoke second, live full harness last.
