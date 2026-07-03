---
title: "Decision Record: Manual Testing Playbook Execution Sweep"
description: "ADRs for wave-batched fan-out concurrency and in-place evidence writes for the 485-scenario sweep."
trigger_phrases:
  - "manual playbook execution sweep decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/014-manual-playbook-execution-sweep"
    last_updated_at: "2026-07-02T06:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Drafted ADR-001 and ADR-002"
    next_safe_action: "Build manifest.tsv, run provider pre-flight, launch wave 1"
    blockers: []
    key_files: ["decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-02-031-manual-playbook-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Manual Testing Playbook Execution Sweep

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Wave-batched fan-out at exactly 10 concurrent dispatches

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Operator, Claude Sonnet 5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

485 scenarios run sequentially, one `opencode run` dispatch at a time, would take an impractically long time (many hours to a full day). `cli-opencode`'s single-dispatch discipline defaults to one dispatch at a time but documents an explicit exception: when the operator explicitly authorizes N parallel dispatches, run N concurrently.

### Constraints

- Must not exceed operator-authorized concurrency (10).
- Each dispatch must be independently monitorable (liveness-checkable) so an orphaned dispatch doesn't silently stall its wave.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: launch dispatches in waves of exactly 10 concurrent `opencode run` background processes, wait for the full wave to drain (all 10 complete or confirmed orphaned) before launching the next wave.

**How it works**: A manifest (`manifest.tsv`) tracks per-scenario status. Each wave pulls the next 10 `pending` rows, launches them via `nohup`+`disown`, monitors via the established `ps`-liveness-check pattern, marks each `done` with its verdict when its dispatch completes and evidence is confirmed written, then launches the next wave.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **10-concurrent wave batching (chosen)** | Matches operator's explicit authorization exactly; bounded, predictable resource usage per wave. | ~49 waves still totals multiple hours. | 9/10 |
| Sequential, one at a time | Matches the tool's own default discipline with zero deviation. | Rejected by operator as too slow (many hours to a day) for 485 scenarios. | 3/10 |
| Full unbounded parallelism (all 485 at once) | Fastest possible wall-clock. | Operator explicitly capped at 10; unbounded parallelism also risks overwhelming shared DB/workspace state and API rate limits. | 2/10 |

**Why this one**: It is the exact concurrency the operator authorized, and wave-boundary checkpointing gives natural resumability points if the sweep is interrupted.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: ~485 sequential dispatch slots collapse to ~49 wave slots, a roughly 10x wall-clock reduction versus fully sequential execution.

**What it costs**: Wave-boundary synchronization means a single slow/hung dispatch in a wave delays the whole wave's completion, not just that one scenario.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A hung dispatch stalls its wave indefinitely | M | Per-dispatch orphan detection via `ps` liveness check, matching this session's established monitoring pattern; a stalled dispatch is killed and marked BLOCKED rather than waited on forever |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 485 sequential dispatches were operator-rejected as too slow. |
| 2 | **Beyond Local Maxima?** | PASS | Considered sequential and fully-unbounded; both rejected with reasons above. |
| 3 | **Sufficient?** | PASS | 10x wall-clock reduction with bounded resource usage per wave. |
| 4 | **Fits Goal?** | PASS | Matches the operator's exact stated authorization (10 at a time). |
| 5 | **Open Horizons?** | PASS | Manifest-based tracking composes with any future concurrency change if needed. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: A new `manifest.tsv` in this folder tracks per-scenario dispatch state; wave-runner logic launches/monitors/records in batches of 10.

**How to roll back**: Stop launching new waves; already-completed scenario evidence writes are independently useful and don't need reverting unless spot-check finds them unreliable (see ADR-002 mitigation).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Write real evidence directly into each scenario's own file, not a separate report

**Status**: Accepted

**Context**: The manual testing playbook template already has a designated Evidence section per scenario, intended to be filled in as scenarios are run. A separate summary-only report was considered as a lower-blast-radius alternative.

**Decision**: Each dispatch directly edits its assigned scenario file's own Evidence/Pass-Fail sections with real execution output, per operator directive. A separate consolidated report is still produced in `implementation-summary.md`, aggregating verdicts, but it references rather than duplicates the per-scenario evidence.

**Consequences**:
- The playbook catalog itself becomes the source of truth for "was this ever verified, and when."
- 485 individual file writes is a large diff; each is independently revertible via `git checkout --` if any prove unreliable.

**Alternatives Rejected**:
- Report-only (no in-place writes): lower blast radius but leaves the playbook catalog itself still showing template placeholders, which was explicitly rejected by the operator as not matching the template's intended use.

**Mitigation for self-reported verdicts**: A sample of PASS verdicts per subsystem is independently spot-checked (re-run manually) before the sweep is accepted as complete, per plan.md Phase 3 -- GPT-5.5's own PASS claim is treated as a hypothesis, not accepted at face value, consistent with this session's established verification discipline.
