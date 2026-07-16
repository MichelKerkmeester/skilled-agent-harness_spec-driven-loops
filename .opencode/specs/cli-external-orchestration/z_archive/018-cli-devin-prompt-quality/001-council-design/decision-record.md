---
title: "Decision Record: Council Design"
description: "ADR slots for council-design dispatch architecture decisions. Council itself ratifies downstream design contract in council-report.md, not in this file."
trigger_phrases:
  - "113/001 decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/018-cli-devin-prompt-quality/001-council-design"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded decision-record.md with ADR-001"
    next_safe_action: "Add ADRs as council surfaces additional architecture decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114014"
      session_id: "114-001-decisions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Council Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Sequential vs parallel seat dispatch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-16 |
| **Deciders** | Main agent (operator-confirmed) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 3 seats dispatch via 3 different CLI executors (cli-codex, cli-claude-code, cli-gemini). Each executor has its own auth, rate limits, and concurrency caps. Parallel dispatch could reduce wall-clock by ~3x. Sequential dispatch is more predictable, easier to debug, and avoids triggering concurrent-auth issues per memory `feedback_cli_dispatch_unreliability` (parallel dispatches risk silent partial failure).

### Constraints

- 3 distinct CLI executors with independent rate-limit pools
- No coordination layer between executors
- Operator wants reproducibility for the first run
- Memory: parallel cli-* dispatches above 3-4 concurrent are unreliable
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Sequential dispatch by default, with parallel as an opt-in flag (`COUNCIL_PARALLEL=true`) once operator confirms all 3 executor caches are warm and rate-limit pools are independent.

**How it works**: Phase 2 of plan.md runs T011 → T014 → T017 sequentially. State JSONL records each seat's start/end. Parallel mode (when opted in) dispatches all 3 simultaneously and merges their state rows after all complete.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sequential default + parallel opt-in (chosen)** | Reproducible, easy debug, parallel available when safe | 3x wall-clock by default | 8/10 |
| Always parallel | 3x faster | Brittle under rate-limit variance, harder to attribute failures | 5/10 |
| Single executor all 3 seats | Trivial to debug | Defeats the multi-vantage purpose; one model's biases dominate | 2/10 |

**Why this one**: Sequential gives a clean first-run baseline. Parallel mode is added behind a flag so the operator can opt in when the workflow is stable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- First-run debugging is trivial: state JSONL has clean sequential rows
- Failure attribution is unambiguous (only one executor active at a time)

**What it costs**:
- 30 min wall-clock instead of ~10 min. Mitigation: parallel opt-in for repeat runs

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sequential becomes prohibitively slow if executors take longer than estimated | L | Add per-seat 10 min timeout; escalate to operator on timeout |
| Operator forgets to enable parallel for stable runs | L | Document opt-in in council-report.md "Optimization notes" |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | First-run reproducibility is a real need; debug ambiguity in parallel runs has bitten us before (memory: cli_dispatch_unreliability) |
| 2 | **Beyond Local Maxima?** | PASS | Considered always-parallel and single-executor; rejected with rationale |
| 3 | **Sufficient?** | PASS | One flag controls the trade-off; no further complexity needed |
| 4 | **Fits Goal?** | PASS | Goal is council-ratified contract; sequential vs parallel doesn't affect the contract content, only wall-clock |
| 5 | **Open Horizons?** | PASS | Pattern (sequential-default-with-parallel-opt-in) reusable for any multi-executor dispatch |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- plan.md Phase 2 tasks T011/T014/T017 sequentially ordered
- Add `COUNCIL_PARALLEL` env var documented in tasks.md
- State JSONL schema accommodates both modes (each row has `dispatch_mode: sequential|parallel`)

**How to roll back**: Default is sequential; removing the parallel opt-in flag reverts to baseline.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
