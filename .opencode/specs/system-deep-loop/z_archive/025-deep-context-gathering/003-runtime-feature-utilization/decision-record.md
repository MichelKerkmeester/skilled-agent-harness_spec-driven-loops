---
title: "Decision Record: deep-loop-runtime utilization hardening"
description: "Three fix decisions and five deliberate non-fix decisions from the cross-skill runtime-feature audit: deep-improvement atomic state, deep-review loop-lock, deep-context executor-audit site choice, deep-ai-council graph-replay, deep-context pid lock advisory, deep-research prose hardening, and the triage rationale."
trigger_phrases:
  - "deep-loop-runtime utilization decisions"
  - "runtime hardening ADR"
  - "deep-improvement state safety decision"
  - "deep-review loop-lock decision"
  - "fanout-run vs multi-seat-dispatch"
  - "deep-ai-council graph-replay prose"
  - "non-fix rationale"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/003-runtime-feature-utilization"
    last_updated_at: "2026-06-06T23:59:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added ADR-007 (deep-improvement loop-lock) and ADR-008 (readJournal corruption surfacing)"
    next_safe_action: "Memory save; packet status Complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs"
      - ".opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs"
      - ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:21f084a2955d99a9dfb62e715e4564513164ec612ad6122518ce1ba3ac9e1663"
      session_id: "dlr-135-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "multi-seat-dispatch.cjs confirmed no-spawn; fanout-run.cjs is the right spawn-env site"
      - "deep-ai-council graph-replay single-process in-memory; prose-only is acceptable"
      - "deep-context pid loop-lock advisory not hard-mutex; host-driven discrete-call loop"
      - "deep-research already strongest skill; prose-only prose hardening not worth the diff"
      - "deep-improvement loop-lock asymmetry closed: all four improvement/benchmark YAMLs now have step_acquire_lock"
      - "model-benchmark shares agent-improvement-state.jsonl; state not isolated; locked alongside agent-improvement"
      - "readJournal corruption surfacing: non-enumerable property pattern is backward-compatible"
---
# Decision Record: deep-loop-runtime utilization hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: deep-ai-council graph-replay remains prose-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | cross-skill auditor, cli-opencode architect (deepseek-v4-pro), 2x parallel opus confidence-gate |

---

<!-- ANCHOR:adr-001-context -->
### Context

The audit identified that deep-ai-council's graph-replay functionality is prose-only: it is described in SKILL.md and referenced in the command YAMLs, but there is no code-enforced call to a runtime graph-replay primitive at the spawn site. The question was whether to add code enforcement matching what deep-improvement now gets for atomic-state.

### Constraints

- deep-ai-council operates in a single process with in-memory state: each council run is a fresh session; there is no cross-session graph that needs replay.
- The `deep-loop-runtime`'s graph-replay primitive is designed for multi-session JSONL recovery, not single-process in-memory council deliberation.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Leave deep-ai-council graph-replay prose-only. Code enforcement of a runtime primitive designed for cross-session JSONL recovery has no benefit in a single-process in-memory context.

**How it works**: The council's deliberation state lives in memory for the duration of one run. If the process exits mid-deliberation, there is no durable state to recover. Code-enforcing a JSONL recovery call at the spawn site would be a no-op at best and misleading at worst.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Prose-only (chosen)** | Correct for single-process in-memory model; no misleading recovery call | Slightly asymmetric with deep-improvement | 9/10 |
| Code-enforce graph-replay at spawn | Symmetric with other skills | No-op on the actual runtime primitive; adds code that never fires meaningfully | 2/10 |
| Add a separate council state persistence layer | Enables crash recovery for long councils | Out of scope; new abstraction; over-engineering for the current use pattern | 3/10 |

**Why this one**: The constraint is architectural: the primitive does not fit the use case. Adding it would be cargo-culting a pattern that makes no sense for an in-memory run.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No misleading code in the council skill that implies JSONL recovery is happening when it is not.

**What it costs**:
- Asymmetry with the other skills at the code level, but the asymmetry reflects a real architectural difference.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future sessions assume graph-replay is code-enforced | L | This ADR documents the prose-only boundary explicitly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The decision is necessary to document so future audits do not re-open it |
| 2 | **Beyond Local Maxima?** | PASS | Persistence layer and code-enforce options evaluated |
| 3 | **Sufficient?** | PASS | Prose-only is correct given the single-process architecture |
| 4 | **Fits Goal?** | PASS | Avoids adding a no-op call that misrepresents runtime behavior |
| 5 | **Open Horizons?** | PASS | If council gains multi-session persistence, code enforcement can be added then |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: Nothing — this is a deliberate non-fix.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: deep-context pid loop-lock remains advisory (not hard-mutex)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | cross-skill auditor, cli-opencode architect (deepseek-v4-pro), 2x parallel opus confidence-gate |

---

<!-- ANCHOR:adr-002-context -->
### Context

The audit noted that deep-context's loop-lock uses a pid advisory mechanism rather than the hard-mutex pattern deep-research and (now) deep-review use. The question was whether to harden deep-context's loop-lock to a hard-mutex.

### Constraints

- deep-context runs as a host-driven discrete-call loop: the host drives each iteration synchronously; it is not a long-running daemon that could fork undetected while another session runs.
- A hard-mutex adds file-lock overhead and a lock-timeout recovery path for a scenario that does not arise in discrete-call driving.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Keep deep-context's loop-lock as an advisory pid mechanism. The hard-mutex pattern is for skills (deep-research, deep-review) that can be invoked concurrently from multiple terminals. deep-context's host-driven discrete-call model does not produce that concurrent-access pattern.

**How it works**: Each deep-context run checks for an advisory pid lock file; if found, it warns and exits rather than proceeding. Because the host drives each iteration and does not run in the background, two concurrent deep-context invocations on the same spec folder are immediately visible to the operator.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisory pid lock (chosen)** | Correct for host-driven discrete-call model | Weaker than hard-mutex | 8/10 |
| Hard-mutex YAML lock fields (as deep-research/review) | Consistent across all skills | Adds overhead and recovery path for a non-scenario; premature hardening | 5/10 |
| No lock at all | Simplest | No protection for concurrent invocations | 1/10 |

**Why this one**: The threat model for deep-context differs from deep-research/review. Adding hard-mutex for a scenario the architecture does not produce is over-engineering.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No unnecessary lock-timeout recovery code for a non-scenario.

**What it costs**:
- Asymmetry with deep-research/review, but grounded in a real architectural difference.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| deep-context gains a background-daemon invocation mode later | M | If that happens, upgrade to hard-mutex then; this ADR documents the current boundary |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Documents why deep-context diverges from deep-research/review |
| 2 | **Beyond Local Maxima?** | PASS | Hard-mutex and no-lock options evaluated |
| 3 | **Sufficient?** | PASS | Advisory lock provides appropriate protection for discrete-call driving |
| 4 | **Fits Goal?** | PASS | Avoids over-engineering a non-scenario |
| 5 | **Open Horizons?** | PASS | Hard-mutex can be added if deep-context gains daemon mode |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: Nothing — this is a deliberate non-fix. The advisory pid lock in deep-context's command YAML is retained as-is.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: deep-research atomic-state and fallback-router prose-only accepted as-is

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | cross-skill auditor, cli-opencode architect (deepseek-v4-pro), 2x parallel opus confidence-gate |

---

<!-- ANCHOR:adr-003-context -->
### Context

The audit noted that deep-research's atomic-state and fallback-router wiring is prose-only in several places: the SKILL.md references both features, but the command YAMLs rely on prose `cli_contract` annotations rather than code-enforced calls. deep-research is the oldest and most mature of the deep skills. The question was whether to add code enforcement to match the level of rigor applied to deep-improvement.

### Constraints

- deep-research already has the strongest overall runtime-feature adoption of any skill in the family (loop-lock, Bayesian scorer, and several other primitives are code-enforced).
- The atomic-state and fallback-router gaps in deep-research are marginal relative to the already-high baseline.
- The diff cost of adding code enforcement to a working, production-proven skill is non-trivial.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Accept deep-research's atomic-state and fallback-router prose-only wiring as-is. The marginal gain from code enforcement on the strongest skill in the family is not worth the diff cost and regression risk.

**How it works**: The prose annotations in deep-research's command YAMLs function adequately because deep-research is the reference implementation that runtime authors actively maintain. Code-enforcing at the YAML level here adds a layer that the runtime's own test suite already covers at a lower level.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept prose-only (chosen)** | No regression risk; avoids over-engineering the strongest skill | Minor asymmetry with new reduce-state wiring | 8/10 |
| Add code enforcement to deep-research now | Full parity across all skills | Non-trivial diff on a production-proven skill; marginal gain | 5/10 |
| Defer as a tracked follow-up | Documents intent | Creates a future debt item for a marginal gap | 4/10 |

**Why this one**: The architect consult and both confidence-gate audits converged: deep-research is already the strongest skill; the marginal gain does not justify the diff cost.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- No regression risk on the most-used skill in the family.

**What it costs**:
- The atomic-state and fallback-router remain prose-only in deep-research.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future runtime changes make the prose annotations stale | L | deep-research is actively maintained by the runtime author; staleness would be caught in the next audit |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Documents why deep-research is not touched in this packet |
| 2 | **Beyond Local Maxima?** | PASS | Full-code-enforcement and deferred-tracking options evaluated |
| 3 | **Sufficient?** | PASS | Prose-only is adequate given the baseline and active maintenance |
| 4 | **Fits Goal?** | PASS | Avoids adding diff cost for marginal gain |
| 5 | **Open Horizons?** | PASS | Can be revisited in a future audit if the prose gap grows |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: Nothing — this is a deliberate non-fix.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: fanout-run.cjs is the correct executor-audit call site (not multi-seat-dispatch.cjs)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | cross-skill auditor, cli-opencode architect (deepseek-v4-pro) |

---

<!-- ANCHOR:adr-004-context -->
### Context

The executor-audit env fix required identifying the right call site for `buildExecutorDispatchEnv`. Two candidates existed: `fanout-run.cjs` and `multi-seat-dispatch.cjs`. The architect consult was asked to adjudicate which script is the real CLI-seat spawn site where the env should be set.

### Constraints

- The recursion-guard env var must be set before the child CLI process is spawned; setting it after spawn is too late.
- `multi-seat-dispatch.cjs` is a model-agnostic primitive that routes dispatch config — it does not actually call `spawnSync` or any process-launch function.
- `fanout-run.cjs` is the orchestrator that calls `spawnSync` (or equivalent) to actually launch the CLI seats.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Wire `buildExecutorDispatchEnv` in `fanout-run.cjs`, not in `multi-seat-dispatch.cjs`.

**How it works**: `fanout-run.cjs` is the script that calls `spawnSync` to launch CLI seats; it is the only script where the child process env can be set before spawn. `multi-seat-dispatch.cjs` never spawns a process; adding env logic there would have no effect on the actual child process.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **fanout-run.cjs (chosen)** | Real spawn site; env actually reaches the child process | — | 10/10 |
| multi-seat-dispatch.cjs | More "central" dispatch logic | No-spawn primitive; env would never reach the child process | 1/10 |
| Both files | Belt-and-suspenders | multi-seat-dispatch wiring would be dead code | 3/10 |

**Why this one**: Code at a no-spawn primitive does not affect child process env. This is the site-choice ADR that the architect consult resolved.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The recursion-guard env is set at the only site where it can reach the child CLI process.

**What it costs**:
- Nothing — `fanout-run.cjs` was always the right site.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future refactor moves spawn logic to multi-seat-dispatch.cjs | M | The `buildExecutorDispatchEnv` call would need to move with it; the 4 vitest tests catch regressions |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Site-choice must be documented to prevent future confusion |
| 2 | **Beyond Local Maxima?** | PASS | multi-seat-dispatch.cjs and both-files alternatives evaluated |
| 3 | **Sufficient?** | PASS | fanout-run.cjs wiring fully covers all CLI-seat spawns |
| 4 | **Fits Goal?** | PASS | Env reaches the child process; guard is code-enforced |
| 5 | **Open Horizons?** | PASS | If spawn moves, the call moves with it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: `buildExecutorDispatchEnv` is called in `fanout-run.cjs` at the `spawnSync` call site, with its output merged into the child process env. The +4 vitest tests gate the behavior.

**How to roll back**: Remove the `buildExecutorDispatchEnv` call and env merge from `fanout-run.cjs`; remove the 4 tests. Recursion guard reverts to prose-only.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Council-seat per-iteration path remains prose-only for recursion guard

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | cross-skill auditor, cli-opencode architect (deepseek-v4-pro) |

---

<!-- ANCHOR:adr-005-context -->
### Context

After wiring `buildExecutorDispatchEnv` in `fanout-run.cjs`, a boundary was identified: the code enforcement applies to the lineage/`buildLineageCommand` spawn path. The pure-prose per-iteration council-seat path — where the host directly dispatches council seats using the `cli_contract` YAML annotation — still does not have code-enforced env setting.

### Constraints

- The council-seat path in the deep-loop-runtime command executor reads the `cli_contract` annotation to understand dispatch constraints, including the recursion guard. This is a YAML-driven dispatch, not a direct `spawnSync` call.
- Making the council-seat path code-enforced would require a different intervention point in the command executor.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Accept the prose-only boundary on the council-seat path for the current packet. Code enforcement on the lineage/fanout spawn path already covers the highest-volume CLI-seat dispatch. Council-seat code enforcement is a future-hardening option.

**How it works**: The council-seat dispatch path reads `cli_contract` at runtime. If the YAML annotation is correct (which the deep-context SKILL.md and command YAMLs maintain), the guard is applied. The consequence of a missing annotation is a guard-free council seat, not a crash.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Prose-only on council-seat path (chosen)** | Scopes Fix 3 to the real spawn site; no command-executor change needed | Asymmetric with fanout-run wiring | 8/10 |
| Add code enforcement to command executor council-seat path | Full code enforcement | Touches the runtime command executor; wider blast radius | 4/10 |

**Why this one**: Fix 3's goal was to close the fanout-run gap. The council-seat path requires a different intervention and was not in scope.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The scope of Fix 3 is clear and bounded.

**What it costs**:
- Council-seat recursion guard remains prose-dependent.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A council-seat dispatch omits the `cli_contract` annotation | L | SKILL.md and YAMLs maintain the annotation; future audits catch drift |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Documents the boundary of Fix 3 |
| 2 | **Beyond Local Maxima?** | PASS | Full command-executor enforcement option evaluated |
| 3 | **Sufficient?** | PASS | fanout-run coverage is the higher-volume path |
| 4 | **Fits Goal?** | PASS | Keeps Fix 3 bounded and reviewable |
| 5 | **Open Horizons?** | PASS | Command-executor code enforcement is a future option |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**: Nothing additional — this documents the accepted prose-only boundary for the council-seat path.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Triage methodology — architect consult + parallel confidence-gate audits before implementation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | cross-skill auditor |

---

<!-- ANCHOR:adr-006-context -->
### Context

A cross-skill audit produced a list of five potential fixes. The risk of implementing all five is over-engineering; the risk of implementing none is leaving the gaps open. We needed a triage process that is more rigorous than a single-agent judgment but less costly than a full council session.

### Constraints

- Triage must produce a prioritized, defensible list before any code changes.
- The non-fix decisions must be documented with rationale so future sessions do not re-open them.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: A three-stage triage: (1) structured cross-skill sweep, (2) cli-opencode architect consult (deepseek-v4-pro) for prioritization, (3) two fresh parallel opus confidence-gate audits to independently validate the non-fix decisions before any code is written.

**How it works**: The architect consult receives the full gap list and returns a prioritized recommendation with rationale. Two independent opus instances then review the non-fix decisions cold (no shared context) and return their verdicts. Agreement across all three validates the decisions with high confidence.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Architect + 2x parallel audits (chosen)** | High confidence; independent validation; fast | More sessions than a single-agent judgment | 9/10 |
| Single-agent triage | Fastest | Low confidence; no independent check | 4/10 |
| Full deep-ai-council session | Maximum rigor | Over-scoped for a triage decision | 5/10 |

**Why this one**: Two independent cold audits plus an architect consult gives the confidence level of a council session at a fraction of the cost.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Non-fix decisions are validated by three independent reasoning paths before code is written.
- The triage methodology is a reusable pattern for future cross-skill optimization work.

**What it costs**:
- Three dispatch sessions instead of one. The cost is justified by the ADR permanence and the regression avoidance.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two audits disagree | M | Disagreement would escalate to a full council session; in this case both agreed |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Single-agent judgment is insufficient for cross-skill non-fix decisions |
| 2 | **Beyond Local Maxima?** | PASS | Single-agent and full-council options evaluated |
| 3 | **Sufficient?** | PASS | 3-way independent agreement is a strong confidence signal |
| 4 | **Fits Goal?** | PASS | ADRs with validated rationale prevent future re-opening |
| 5 | **Open Horizons?** | PASS | Methodology is reusable for future audits |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**: Nothing in code — this documents the triage methodology used.

**How to roll back**: Not applicable.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Lock deep-improvement loop to match deep-review (cross-session race safety)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | audit gap analysis |

---

<!-- ANCHOR:adr-007-context -->
### Context

An audit found that deep-review received `step_acquire_lock` / `step_release_lock` / `lock_file` in this packet, but the deep-improvement agent-improvement loop and model-benchmark loop did not. Both modes write to the same shared `{spec_folder}/improvement/agent-improvement-state.jsonl`, which means two concurrent invocations from separate terminals on the same spec folder can race on that file in exactly the same way that deep-review could before its lock was added.

The question was whether to lock deep-improvement (and the model-benchmark loop that shares its state), or to treat it as an advisory-only or host-driven scenario as deep-context was.

### Constraints

- deep-improvement is invoked from the command line, not driven by a host orchestrator; it can be invoked concurrently from separate terminals.
- Both agent-improvement and model-benchmark modes write to `agent-improvement-state.jsonl`; their state is not isolated per run.
- The session boundary gate only prevents resuming an old session — it does not block a second fresh session from starting in parallel and racing on the shared JSONL.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Lock deep-improvement (agent-improvement loop and model-benchmark loop, auto and confirm variants) using the same advisory lock pattern as deep-review. Lock file: `{spec_folder}/improvement/.deep-improvement.lock`. Auto variants fail closed on contention; confirm variants present recovery choices. The orchestrator-within-session serialization note applies: a single session running multiple iterations is already serial; the lock guards against separate terminal invocations.

**How it works**: `step_acquire_lock` is placed immediately after the session boundary gate in `phase_init`. `step_release_lock` is the final step of `phase_synthesis`. The auto variants include `on_halt`, `on_cancel`, and `on_workflow_exit` cleanup clauses so the lock is released on every exit path. The confirm variants rely on interactive acknowledgment, matching deep-review's confirm pattern.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lock deep-improvement (chosen)** | Consistent with deep-review; eliminates the race; symmetric for all CLI-invoked loops | Adds YAML fields; advisory only on macOS/BSD | 9/10 |
| Advisory-only (like deep-context) | No YAML changes | deep-improvement is CLI-invoked, not host-driven; concurrent terminals are a real scenario | 3/10 |
| Skip lock (prose only) | No changes | Same risk as deep-review before Fix 2; leaves a documented gap open | 1/10 |

**Why this one**: The threat model matches deep-review, not deep-context. deep-context is host-driven and discrete-call; deep-improvement is CLI-invoked and long-running. The same argument that justified locking deep-review applies here.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Two concurrent improvement or benchmark runs on the same spec folder no longer race on the shared JSONL.
- The loop-lock pattern is now symmetric across all CLI-invoked deep loops (research, review, improvement, model-benchmark).

**What it costs**:
- Four YAML files gain `lock_file`, `step_acquire_lock`, and `step_release_lock` fields.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stale lock from a crashed session blocks a new run | M | Auto variant notes stale-lock recovery is confirm-only; confirm variant presents choices |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Concurrent invocations on the same spec folder are a real scenario for CLI-invoked deep loops |
| 2 | **Beyond Local Maxima?** | PASS | Advisory-only and prose-only alternatives evaluated |
| 3 | **Sufficient?** | PASS | Advisory lock eliminates the race; matches the deep-review pattern that is already in production |
| 4 | **Fits Goal?** | PASS | Closes the asymmetry between deep-review (locked) and deep-improvement (unlocked) |
| 5 | **Open Horizons?** | PASS | If deep-improvement gains a resume mode, the lock already covers multi-session entry |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**: `lock_file`, `step_acquire_lock`, and `step_release_lock` added to all four deep-improvement YAML files (agent-improvement auto+confirm, model-benchmark auto+confirm).

**How to roll back**: Remove `lock_file` from `state_paths`, remove `step_acquire_lock` from `phase_init`, and remove `step_release_lock` from `phase_synthesis` in all four YAML files.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Surface readJournal corruption warnings instead of silently swallowing them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | audit gap analysis |

---

<!-- ANCHOR:adr-008-context -->
### Context

`improvement-journal.cjs` `readJournal` used `catch { return []; }` inside the per-line `flatMap`, silently dropping lines that could not be JSON-parsed. This is the same anti-pattern the earlier Fix 1 eliminated in `reduce-state.cjs` via `parseJsonlDetailed` and `corruptionWarnings`. The question was how to surface the warnings without breaking existing callers that receive a plain `object[]`.

### Constraints

- All existing callers (`getLastIteration`, `getSessionResult`, the CLI `--read` path) iterate the returned array; none check for a `.corruptionWarnings` property.
- The fix must not change the type of the return value from `readJournal` (must remain a plain array).
- The fix should match the reporting shape that `parseJsonlDetailed` in `reduce-state.cjs` already uses, so the family is consistent.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: Attach `corruptionWarnings` as a non-enumerable property on the returned array (backward-compatible), write each warning to `stderr` for immediate operator visibility, and add a `readJournalDetailed` export that returns `{ records, corruptionWarnings }` as a plain object for new callers that need the full picture. `node --check` passes after the change.

**How it works**: `Object.defineProperty(validRecords, 'corruptionWarnings', { enumerable: false, ... })` means `JSON.stringify`, `spread`, and iteration over the array are unaffected. `process.stderr.write` fires immediately so the operator sees the warning in the terminal even if the caller does not inspect `corruptionWarnings`.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Non-enumerable property + stderr (chosen)** | Backward-compatible; immediate operator visibility; matches reducer shape | Non-enumerable property is unusual; callers must know to access it | 8/10 |
| Change return type to `{ records, corruptionWarnings }` | Explicit | Breaks all existing callers | 2/10 |
| Log to stderr only (no property) | Simple | Callers cannot programmatically inspect warnings | 5/10 |
| Keep silent swallow | No changes | Same anti-pattern eliminated in Fix 1; leaves corruption invisible | 1/10 |

**Why this one**: The non-enumerable property is the only approach that is simultaneously backward-compatible and inspectable by new callers. `readJournalDetailed` provides the structured path for callers that want to be explicit.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Corrupt journal lines are no longer silently swallowed; operators see warnings on stderr.
- New callers can call `readJournalDetailed` for the full `{ records, corruptionWarnings }` shape, consistent with `parseJsonlDetailed`.

**What it costs**:
- `improvement-journal.cjs` is slightly more complex; the non-enumerable property pattern is unfamiliar to callers who have not read this ADR.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller spreads the returned array and inadvertently loses warnings | L | `corruptionWarnings` is non-enumerable; spread does not copy it. This is intentional — use `readJournalDetailed` if you need the warnings in a spread context |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Silent swallow is a documented anti-pattern; Fix 1 already eliminated it in reduce-state.cjs |
| 2 | **Beyond Local Maxima?** | PASS | Structured return, stderr-only, and keep-silent alternatives evaluated |
| 3 | **Sufficient?** | PASS | stderr + non-enumerable property + readJournalDetailed covers all operator and caller use cases |
| 4 | **Fits Goal?** | PASS | Brings readJournal into alignment with parseJsonlDetailed's corruption-surfacing pattern |
| 5 | **Open Horizons?** | PASS | readJournalDetailed can be extended with additional fields as the journal schema evolves |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**: `readJournal` in `improvement-journal.cjs` now collects corrupt-line warnings, writes them to stderr, and attaches them as a non-enumerable `corruptionWarnings` property on the returned array. `readJournalDetailed` is added and exported. `node --check` passes.

**How to roll back**: Revert the `readJournal` body to the original `flatMap` with `catch { return []; }`, remove `readJournalDetailed`, and remove it from `module.exports`.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!--
Level 3 Decision Record.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
