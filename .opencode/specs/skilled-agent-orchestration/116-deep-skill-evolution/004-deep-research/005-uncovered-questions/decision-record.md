---
title: "Decision Record: Deep Research Uncovered Questions Tracking"
description: "ADR-001 documents the packet 121 convergence-transparency contract."
trigger_phrases:
  - "ADR"
  - "DR-003"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/004-deep-research/005-uncovered-questions"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted ADR-001"
    next_safe_action: "Use commit handoff in implementation-summary.md"
    completion_pct: 100
---
# Decision Record: Deep Research Uncovered Questions Tracking

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Computed Uncovered-Question Contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

DR-003 identified a convergence transparency gap. Deep-research already records strategy questions and per-iteration `answeredQuestions`, but the dashboard did not expose which questions remained uncovered.

### Constraints

- Preserve existing reducer function signatures.
- Avoid new state files or migration steps.
- Keep generated registry output additive.
- Preserve idempotent reducer output.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: compute `uncoveredQuestions` as `strategy_open_questions - answered_questions_union`.

**How it works**: The reducer parses strategy questions, builds a normalized union from completed iteration `answeredQuestions`, and emits unresolved question text as `registry.uncoveredQuestions`. The dashboard renders that exact field.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Computed contract** | Additive, deterministic, uses existing state | Mirrors openQuestions text at first | 9/10 |
| Require explicit marked-uncovered records | More expressive for edge cases | Requires schema changes and agent behavior changes | 5/10 |
| Dashboard derives directly from openQuestions only | Minimal code | Does not document answered-union contract clearly | 6/10 |

**Why this one**: The computed contract solves the operator need without increasing iteration schema burden.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Operators can see the exact uncovered questions in the dashboard.
- Registry consumers get a string-only coverage field without parsing question objects.
- The convergence surface now matches the 119 roadmap intent.

**What it costs**:
- The registry has both `openQuestions` objects and `uncoveredQuestions` strings. Mitigation: keep them intentionally different surfaces.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Consumers confuse open and uncovered fields | L | Names and types differ |
| Failed iterations accidentally count | M | Exclude non-evidence statuses |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | DR-003 is a P1 operator observability gap |
| 2 | **Beyond Local Maxima?** | PASS | Explicit-marking alternative considered |
| 3 | **Sufficient?** | PASS | Registry plus dashboard cover operator need |
| 4 | **Fits Goal?** | PASS | Directly exposes stuck convergence question gaps |
| 5 | **Open Horizons?** | PASS | Does not block richer coverage metadata later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `reduce-state.cjs` adds `uncoveredQuestions` to the registry.
- Dashboard rendering adds `## Uncovered Questions`.
- Reducer tests cover partial and complete question coverage.

**Migration outline**: None. The registry change is pure additive and generated files refresh on the next reducer run.

**How to roll back**: Revert packet 121 reducer and test changes, then regenerate packet state with the previous reducer.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
