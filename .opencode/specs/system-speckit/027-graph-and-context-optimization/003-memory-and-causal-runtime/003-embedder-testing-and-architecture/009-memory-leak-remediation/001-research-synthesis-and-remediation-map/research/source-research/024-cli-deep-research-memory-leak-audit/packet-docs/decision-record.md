---
title: "Decision Record: 024 CLI Deep Research Memory Leak Audit"
description: "Architectural decisions for the extended two-lane deep-research memory-leak audit and Apple Silicon memory-pressure interpretation."
trigger_phrases:
  - "024 CLI memory leak ADR"
  - "two lane deep research decision"
  - "Apple Silicon swap wired memory decision"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/packet-docs"
    last_updated_at: "2026-05-22T07:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Reviewed ADR statuses after final research synthesis."
    next_safe_action: "Use accepted ADRs to open follow-up remediation packets."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0240240240240240240240240240240240240240240240240240240240240240"
      session_id: "024-cli-memory-leak-audit-intake"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: 024 CLI Deep Research Memory Leak Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Run Two Sequential Executor Lanes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Operator, OpenCode |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator initially wanted ten deep-research iterations and corrected the executor plan to use five Claude Code iterations and five Codex iterations. The operator later requested five additional Codex recommendation-validation iterations, bringing the final run to fifteen iterations. Prior sessions showed process buildup and high memory pressure when AI sessions used CLI skills to orchestrate other CLIs, so the research run must not create the same failure mode it investigates.

### Constraints

- `/deep:start-research-loop` owns state and dispatch; custom shell loops are forbidden.
- CLI skills require single-dispatch discipline by default.
- The machine is an Apple Silicon laptop with 64 GB RAM, where swap and wired-memory pressure can outlive user-process cleanup.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Run lane A with `cli-claude-code` Opus 4.7 / Opus profile for five iterations, then run lane B with `cli-codex` `gpt-5.5` xhigh fast for ten iterations, including five continuation validation passes.

**How it works**: Each lane runs through `/deep:start-research-loop:auto` with pre-bound setup answers. The workflow runs one iteration at a time, validates required artifacts, kills and verifies executor/helper processes, captures memory telemetry, and only then starts the next iteration or lane.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sequential two-lane execution** | Clear attribution, lower memory risk, matches corrected operator request. | Slower wall-clock time. | 9/10 |
| Parallel Claude and Codex lanes | Faster if everything works. | Recreates process-spam risk and obscures which executor leaked. | 3/10 |
| Single native deep-research executor | Simplest setup. | Does not satisfy the requested cross-CLI coverage. | 4/10 |
| Superseded cli-devin / DeepSeek plan | Could provide another model perspective. | Operator corrected away from this plan. | 1/10 |

**Why this one**: Sequential two-lane execution gives the requested model diversity without multiplying process pressure or hiding cleanup failures.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The audit can attribute findings to Claude Code, Codex, or both.
- Cleanup gates are easier to verify because only one CLI executor is active at a time.
- The research aligns with existing cli-skill safety rules.

**What it costs**:
- The fifteen iterations take longer than parallel execution. Mitigation: accept wall-clock cost because recommendation confidence and memory-safety evidence are the primary objectives.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| CLI auth missing for one lane | Medium | Preflight and record blocker instead of substituting silently. |
| Model ID mismatch for Opus 4.7 | Medium | Record actual local CLI model ID in executor metadata. |
| Memory pressure accumulates anyway | High | Halt when swap/free-page thresholds are unsafe. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator reported prior memory overloads from CLI orchestration. |
| 2 | **Beyond Local Maxima?** | PASS | Uses two independent executor perspectives. |
| 3 | **Sufficient?** | PASS | Fifteen iterations plus synthesis are broad enough for discovery and recommendation validation without immediate implementation. |
| 4 | **Fits Goal?** | PASS | Directly targets memory leaks and process buildup in the named skills. |
| 5 | **Open Horizons?** | PASS | Produces remediation packets rather than one oversized fix. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Research execution plan uses two sequential lanes under `/deep:start-research-loop`.
- Tasks and checklist require memory/process cleanup evidence between iterations.

**How to roll back**: Stop the active deep-research run, preserve existing artifacts, kill the active executor process group and known helper processes, and resume only after memory telemetry is safe.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Treat Swap and Wired Memory as First-Class Evidence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Operator, OpenCode |

---

<!-- ANCHOR:adr-002-context -->
### Context

The observed failure mode may not be a simple orphan-process leak. On Apple Silicon, user-process RSS can drop while swap or wired memory remains high due to kernel zones, VM compressor state, Metal/MPS allocations, or IOSurface-like accounting.

### Constraints

- User-space kill commands cannot guarantee release of kernel-side wired pressure.
- Running more CLI iterations on a swap-saturated machine can make diagnosis worse.
- The research needs enough telemetry to distinguish process leaks from system pressure.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Require `sysctl vm.swapusage` and `vm_stat` snapshots before the first iteration and between iterations, and treat unsafe swap/free-page thresholds as halt conditions.

**How it works**: Each iteration records process cleanup evidence and memory telemetry. If no user process remains but swap or wired pressure stays unsafe, the final report classifies the issue as system pressure and recommends reboot instead of pretending orphan cleanup is sufficient.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Track process cleanup plus swap/free-page telemetry** | Distinguishes orphan leaks from system pressure. | Requires more evidence collection. | 10/10 |
| Track only process RSS | Simple and familiar. | Misses swap/wired pressure, the known Apple Silicon risk. | 3/10 |
| Always reboot between iterations | Cleanest baseline. | Too disruptive and hides reproducible cleanup gaps. | 5/10 |

**Why this one**: The audit needs to explain the actual workstation overload mechanism, not only list orphan processes.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Findings can separate fixable process leaks from OS-level recovery limits.
- The workflow can stop before compounding swap pressure.

**What it costs**:
- Research prompts and artifacts must include local telemetry snapshots. Mitigation: avoid secrets and record only memory/process diagnostics.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Telemetry is misread | Medium | Record raw command output and interpretation separately. |
| Reboot recommendation interrupts work | Medium | Recommend reboot only when thresholds are unsafe after cleanup. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prior failures involved whole-machine memory pressure. |
| 2 | **Beyond Local Maxima?** | PASS | Avoids reducing the problem to process RSS only. |
| 3 | **Sufficient?** | PASS | Adds minimal telemetry needed for correct diagnosis. |
| 4 | **Fits Goal?** | PASS | Directly informs whether cleanup or reboot is the right response. |
| 5 | **Open Horizons?** | PASS | Can become operator runbook checks after remediation. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Tasks and checklist require memory telemetry around every iteration.
- Final synthesis must classify findings as process leak, retained cache, daemon lifecycle, stale lock, or system pressure.

**How to roll back**: If telemetry collection is too noisy, keep raw process cleanup evidence and explicitly mark system-pressure conclusions as inconclusive.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
