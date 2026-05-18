---
title: "Decision Record: Real-World Usefulness Test"
description: "Methodology decisions for measuring whether code graph, hooks, and plugin/runtime integrations help in day-to-day engineering."
trigger_phrases:
  - "real-world usefulness decisions"
  - "usefulness methodology"
  - "scenario battery representative"
  - "execution comes later"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test"
    last_updated_at: "2026-05-05T00:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Captured methodology ADRs for the usefulness campaign"
    next_safe_action: "Use these ADRs as guardrails during 012-EXEC"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:5555555555555555555555555555555555555555555555555555555555555555"
      session_id: "026-007-012-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
# Decision Record: Real-World Usefulness Test

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Qualitative and Quantitative Measurement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | User, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The campaign needs to answer whether the systems help an engineer in normal work, not only whether they return plausible data. Objective metrics such as time and tokens capture cost, but they miss whether a result changed the engineer's decision. Subjective scoring captures usefulness, but it can drift without objective anchors.

### Constraints

- Every scenario must compare assisted and control workflows.
- Missing metrics must be recorded as `UNKNOWN`.
- Subjective scores need fixed 0-3 anchors to reduce post-hoc reinterpretation.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use both subjective scores and objective metrics for every scenario.

**How it works**: Each trial captures time-to-result, token usage where available, context accuracy, hit rate, adoption, and rework count. Each trial also receives 0-3 relevance and 0-3 usefulness scores with a short rationale. The synthesis step can only call a system useful when objective or qualitative evidence shows an improvement over control.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Dual-track measurement | Captures cost and human usefulness. | More logging effort. | 9/10 |
| Quantitative metrics only | Easier to aggregate. | Misses whether the answer actually helped. | 5/10 |
| Qualitative scores only | Captures felt usefulness. | Too vulnerable to bias without timing and token evidence. | 4/10 |

**Why this one**: Day-to-day usefulness is both measurable and experiential. The dual track prevents token or timing numbers from hiding bad context, and prevents subjective impressions from hiding high overhead.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Synthesis can separate fast-but-wrong from slower-but-useful outcomes.
- Overhead can be named with evidence instead of vibes.
- Runtime comparisons remain fairer when one CLI lacks a metric.

**What it costs**:
- Execution takes longer because every trial needs structured logging. Mitigation: use a fixed trial row schema and pilot it before the full matrix.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator scores drift over time | M | Use anchored rubric and paired controls. |
| Token metrics unavailable in some CLIs | M | Record `UNKNOWN` and compare other metrics. |
| Logging burden changes natural workflow | L | Pilot before full execution and keep notes compact. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase question asks whether systems save time and improve decisions. |
| 2 | **Beyond Local Maxima?** | PASS | Three measurement approaches were compared. |
| 3 | **Sufficient?** | PASS | The chosen metrics cover speed, cost, relevance, usefulness, and control delta. |
| 4 | **Fits Goal?** | PASS | The rubric directly maps to real coding workflow usefulness. |
| 5 | **Open Horizons?** | PASS | Future scenarios can reuse the same scoring schema. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `plan.md` defines quantitative metrics and 0-3 qualitative rubric.
- `tasks.md` requires analysis and synthesis tasks after matrix execution.
- `checklist.md` keeps execution evidence pending until 012-EXEC.

**How to roll back**: Replace the rubric and trial schema in `plan.md`, then update dependent tasks and checklist rows before running any execution trials.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use a Twelve-Scenario Battery Across Three System Axes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | User, Codex |

---

<!-- ANCHOR:adr-002-context -->
### Context

The earlier phases improved code graph, hook, and runtime integration capabilities separately. A useful campaign needs scenarios that exercise normal friction points, not synthetic unit-level checks. The chosen battery must be broad enough to catch overhead but small enough to run with repeated trials.

### Constraints

- Cover all three axes: code graph, hooks, and plugin/runtime integration.
- Include day-to-day engineering actions such as finding callers, orienting in a module, retrieving prior decisions, and routing to the right skill.
- Keep scenario ids stable for trial logs and synthesis.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Use 12 scenarios, four per axis.

**How it works**: The code graph scenarios test discovery, orientation, refactor confidence, and structural invariant checks. The hook scenarios test startup relevance, routing accuracy, Gate 3 precision, and compaction recovery. The plugin/runtime scenarios test startup context, memory retrieval, external dispatch consistency, and sk-code routing under supported runtimes.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Twelve scenarios across three axes | Balanced coverage and manageable execution. | Still a multi-day matrix. | 9/10 |
| Fewer smoke-test scenarios | Faster. | Too shallow to distinguish real value from demo value. | 5/10 |
| Exhaustive every-surface matrix | Maximum coverage. | Too expensive and likely to delay action. | 4/10 |

**Why this one**: Twelve scenarios cover the daily friction points that the systems claim to solve while keeping the follow-up execution bounded.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The campaign tests concrete engineering tasks rather than abstract capability.
- Each system axis gets equal representation.
- Synthesis can identify whether value is localized to one axis or consistent across the stack.

**What it costs**:
- Some edge surfaces remain outside the first campaign. Mitigation: backlog additional scenarios only after the first synthesis shows gaps.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scenario set misses a high-value workflow | M | Add follow-up scenarios after first synthesis, not during the run. |
| Matrix becomes too large | M | Use scenario-specific CLI subsets. |
| Scenario wording biases outcomes | L | Preserve paired controls and operator notes. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A usefulness claim needs realistic scenario coverage. |
| 2 | **Beyond Local Maxima?** | PASS | Smoke, balanced, and exhaustive batteries were compared. |
| 3 | **Sufficient?** | PASS | The battery covers all requested axes and daily workflows. |
| 4 | **Fits Goal?** | PASS | The scenarios directly answer whether the systems help coding work. |
| 5 | **Open Horizons?** | PASS | Scenario ids can be extended with later campaign waves. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `spec.md` defines 12 scenario ids and the measurement dimension table.
- `plan.md` maps scenarios to CLI variants.
- `tasks.md` creates one major task per scenario and one matrix task per included cell.

**How to roll back**: Remove or replace scenario rows in `spec.md`, then regenerate the affected CLI matrix rows and task ids before any execution data is collected.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep Execution in a Later Pass

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-05 |
| **Deciders** | User, Codex |

---

<!-- ANCHOR:adr-003-context -->
### Context

The requested packet is a scaffold. Real execution requires starting and comparing multiple CLI runtimes, running repeated trials, capturing logs, and synthesizing results. Bundling that into the scaffold would blur plan approval with empirical execution.

### Constraints

- No external CLI invocation in this packet.
- No generated trial data in this packet.
- Execution needs explicit follow-up approval.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Phase 012 creates the scaffold only; 012-EXEC runs the campaign later.

**How it works**: This packet defines the scenario battery, plan, tasks, checklist, and ADRs. After user approval, a separate execution pass will run real trials, capture data, update the checklist and implementation summary, and produce the synthesis report.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Scaffold now, execute later | Clean approval boundary and no accidental runtime mutation. | Requires a second dispatch. | 10/10 |
| Execute immediately after scaffold | Faster feedback. | Violates the user's planning-only constraint. | 0/10 |
| Create a very small pilot now | Could validate the rubric. | Still executes scenarios and creates data in the scaffold packet. | 2/10 |

**Why this one**: The user explicitly scoped this packet as planning-only. The execution pass is a separate multi-runtime effort and needs its own approval.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Reviewers can approve or edit the methodology before costly trials start.
- The scaffold remains validator-focused and easy to audit.
- The later execution pass has a stable instruction packet.

**What it costs**:
- No empirical answers are produced in this pass. Mitigation: the task list is execution-ready once approved.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Execution pass drifts from scaffold | M | Treat this packet as the source of truth for scenario ids, CLI ids, and metrics. |
| User expects data from this phase | L | Metadata, checklist, and summary state that execution is deferred. |
| Runtime landscape changes before execution | M | Execution preflight records versions and blocked cells. |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The prompt explicitly forbids scenario execution in this packet. |
| 2 | **Beyond Local Maxima?** | PASS | Immediate execution and pilot-now alternatives were rejected. |
| 3 | **Sufficient?** | PASS | The scaffold gives the later executor enough detail to start. |
| 4 | **Fits Goal?** | PASS | Planning first preserves user approval and method clarity. |
| 5 | **Open Horizons?** | PASS | Execution, synthesis, and follow-up remediation can run as separate packets. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `implementation-summary.md` is a planning-only placeholder.
- `checklist.md` keeps execution gates pending by design.
- `tasks.md` separates scaffold tasks from execution tasks.

**How to roll back**: If the user chooses to execute immediately in a new instruction, create a separate execution packet or explicitly revise this packet before running CLI trials.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
