---
title: "Feature Specification: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration"
description: "The six external CLI adapters and the fan-out scheduler have already exposed authentication, transport, timeout, stdin, sandbox, budget, process-cleanup, worktree, dependency, and recursion failures. This planned child defines a deterministic stress-test and manual-testing program so those regressions are caught before a live deep-loop run."
trigger_phrases:
  - "cli adapter stress tests"
  - "deep-loop executor adapter coverage"
  - "fan-out stress testing"
  - "external CLI manual testing playbook"
  - "stdin hang adapter regression"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/035-cli-adapter-stress-and-playbooks"
    last_updated_at: "2026-08-07T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined adapter matrix, fan-out coverage, and execution artifacts"
    next_safe_action: "Build stress tests after WS1 approval"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "Which live CLI and auth lanes are available during execution?"
      - "Which WS1 artifacts are ready for the execution handoff?"
    answered_questions:
      - "Operator approved a new child under 036 for scaffold-only planning."
      - "Tests and playbooks are deferred to a separate execution pass."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration

> This child is the Planned scaffold for a later execution pass. It authors no stress-test, adapter, or manual-playbook implementation now.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The live executor contract contains six external CLI kinds: `cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, and `cli-cursor`. Their shared fan-out path also owns concurrency, lineage expansion, budget caps, convergence and stop-policy handling, process cleanup, artifact validation, and self-invocation protection. This phase plans a reproducible stress matrix for each adapter and for fan-out, plus operator-facing playbook snippets that preserve the exact command, evidence, and verdict needed to diagnose a regression.

**Key Decisions**: Place stress tests under `runtime/tests/stress/cli-adapter/` with serial per-file execution and `fileParallelism:false` (ADR-001); keep adapter scenarios in each CLI skill's playbook and fan-out scenarios in the hub playbook (ADR-002); use hermetic command shims for deterministic failures and gate live probes on binary/auth availability (ADR-003)

**Critical Dependencies**: WS1 handoff, the live `executor-config.ts` enum, the six `cli-external-orchestration` skill packets, and a later execution pass with a clean test/playbook scope
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-07 |
| **Branch** | Current worktree; no branch created |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | Planned execution follow-up after WS1 |
| **Adapters in scope** | `cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, `cli-cursor` |
| **Fan-out subject** | `runtime/scripts/fanout-run.cjs` multi-lineage orchestration |
| **Status boundary** | Planning only; implementation is a later phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The adapter family has a wide failure surface that is not safely covered by one green unit suite. The live enum and skill roster agree on six CLI adapters, while the fan-out runtime adds another orchestration surface with concurrency, retries, budgets, timeout enforcement, artifact salvage, and process teardown. A failure in any one surface can hang at 0% CPU, silently no-op under the wrong permission mode, kill an unrelated shared OAuth session, or report a partial run as successful.

The phase brief records these as real failures already hit by this program: 401/not-authenticated responses, missing models or insufficient balance, throttling, timeout expiry, stdin-starved hangs, spec-gate blocking, silent read-only no-ops, missing transports, budget rejection, partial lineage death, unsafe blanket process cleanup, worktree collisions, cross-worktree `node_modules` symlinks, and recursive self-dispatch. The scaffold turns those incidents into a testable contract rather than an informal list.

### Motivating Evidence

| Evidence source | Confirmed live behavior | Failure it motivates |
|-----------------|-------------------------|----------------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11,58-99` | The Zod-backed executor contract enumerates `native` plus the six CLI kinds and restricts flags per kind | Every adapter needs its own success, unsupported-config, transport, and permission coverage |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1310-1385` | Lineages are spawned asynchronously behind a concurrency cap and may be terminated by timeout or watchdog | A per-file, hang-safe stress runner is required; the full aggregate is not a safe default |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2090-2205,2225-2338` | Aggregate budgets fail before spawn; per-lineage budgets fail in the worker; child env carries spec-gate and recursion markers | Budget, gate, partial-run, and self-invocation cells must inspect both ledger and process outcomes |
| `.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs:80-91,119-145` | Codex cleanup is scoped to a captured PID and prompts are delivered through stdin | All adapters need PID-scoped cleanup and an explicit stdin-hang regression check |
| `.opencode/skills/cli-external-orchestration/{cli-*/SKILL.md,mode-registry.json}` | Each CLI packet owns native auth, transport, sandbox, and failure behavior | Adapter-specific snippets belong with the owning CLI skill; shared fan-out guidance belongs at the hub |

### Purpose

Define the later execution pass that will stress every external CLI adapter and the fan-out orchestrator against the same 14 edge-case rows, produce a test plus a reusable playbook snippet for every adapter/edge-case cell, and record findings with the stress-test templates. This child remains Planned until that execution pass is separately authorized and run.

### Calibration

> These failures are cutover-readiness, reliability, and operator-safety risks. They are not evidence of remote compromise. Authentication, balance, and transport failures must be reported as bounded dependency outcomes, not disguised as adapter defects.

### Non-Goals

- Implementing any stress-test suite, shim, fixture, playbook snippet, or findings artifact in this scaffold pass.
- Fixing adapter defects discovered by execution; each defect routes to its own remediation packet.
- The `014` cutover or changing authority, convergence, retry, permission, transport, or adapter behavior.
- Testing non-CLI executors, provider internals, or unrelated deep-loop workflows.
- Touching the concurrently built `027` runtime work or any folder outside this 035 packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reconcile the exact live adapter set from `runtime/lib/deep-loop/executor-config.ts` and the `cli-external-orchestration` roster before execution: `cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, and `cli-cursor`.
- Stress the fan-out path in `runtime/scripts/fanout-run.cjs`: `executors[]`, `assignment_model: flat_pool`, `concurrency`, per-lineage `iterations` and `count`, `maxCostUnitsPerLineage`, `max_aggregate_cost_units`, convergence threshold, `max-iterations` stop-policy, partial-lineage aggregation, and `FANOUT_LINEAGE_COMPLETE`.
- Enumerate the 14 edge-case rows below. Each row expands across seven subjects: the six adapters plus fan-out orchestration. Every resulting cell must have one automated stress test and one manual-testing-playbook snippet in the later execution pass.
- Produce a success path and documented failure path for every adapter, with transport and live-dependency gating kept distinct from adapter assertions.
- Enforce the hang-safe execution model: `fileParallelism:false`, one file at a time, explicit per-file commands, bounded subprocess timeouts, and no full aggregate run when it can trigger the shared-process hang.
- Decide and implement the future test location, playbook locations, and external-dependency gating described in ADR-001 through ADR-003.
- Author findings with `.opencode/skills/system-spec-kit/templates/stress-test/findings.template.md` and `.opencode/skills/system-spec-kit/templates/stress-test/findings-rubric.schema.md` during execution.

### Edge-Case Coverage Matrix

Subjects for every row: `cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, `cli-cursor`, and `fanout-run`.

| Row | Edge case | Adapter test required for each subject | Fan-out-specific assertion | Playbook snippet required for each subject |
|-----|-----------|----------------------------------------|----------------------------|--------------------------------------------|
| EC-001 | Auth failure (`401` / not-authenticated) | Inject or capture the CLI's auth-denied response; assert bounded failure classification and redacted evidence | One auth-dead lineage becomes a recorded failed/partial result without killing unrelated lineages | Record preflight, exact redacted diagnostic, exit/verdict, and operator recovery |
| EC-002 | Model-not-found / insufficient-balance | Return the provider's model or balance diagnostic; assert it is not misclassified as a timeout or success | Reject only the affected lineage when the failure occurs after fan-out submission; preserve aggregate accounting | Capture model, provider diagnostic, budget context, and PASS/FAIL/SKIP reason |
| EC-003 | Rate-limit / throttle | Exercise 429/throttle output and retry/backoff bounds; assert no unbounded retry or hang | Verify retry counts, slot release, and final summary when one lineage is throttled | Capture retry evidence, wait bound, final disposition, and next action |
| EC-004 | Timeout (`timeoutSeconds`) | Use a bounded non-returning shim; assert timeout signal, failure classification, and cleanup | A timed-out lineage is partial/failure while surviving lineages still aggregate correctly | Record timeout flag, captured PID, cleanup proof, and summary |
| EC-005 | Stdin-hang (`0% CPU` without `</dev/null>`) | Run the headless command with explicit stdin closure and a wall-clock bound; assert it cannot wait for input | Verify one stdin-starved lineage cannot hold the pool or leave a pending slot forever | Include the exact `</dev/null` command, bound, observed CPU/exit behavior, and triage |
| EC-006 | Spec-gate enforcement blocking the child | Run the child with `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`; assert no interactive Gate-3 block; compare fan-out's `MK_SPEC_GATE_DISABLED=1` injection | Verify child env reaches the spawned process and no lineage answers a gate prompt instead of doing work | Capture env preflight, gate output, and whether the lane ran or was correctly blocked |
| EC-007 | Sandbox / permission mode | Compare `read-only` silent no-op against `workspace-write`; exercise RM-8 destructive-scope refusal and prove no out-of-scope mutation | Verify lineage artifact writes survive while prohibited repository writes are rejected/contained | Capture sandbox flags, before/after file state, RM-8 evidence, and rollback path |
| EC-008 | Transport not installed (`command -v` fails) | Remove the binary from `PATH`; assert dispatch is refused before command construction | A missing adapter transport yields a dependency result without consuming a live slot indefinitely | Capture `command -v` result, refusal text, and precise SKIP blocker |
| EC-009 | Budget-cap rejection | Set `maxCostUnitsPerLineage` below the computed upper bound; assert rejection before subprocess work | Separately exceed `max_aggregate_cost_units`; assert ledger event, no spawn, and non-success exit | Capture config, computed upper bound, ledger event, and operator action |
| EC-010 | Partial-lineage death mid-run | Kill one captured child during an otherwise valid run; assert the adapter reports failure rather than false success | Preserve surviving lineage results, `partial` status, failure count, and aggregation receipt | Capture the captured PID kill, surviving artifacts, summary, and orphan check |
| EC-011 | Orphan cleanup | Create a child process tree and terminate only the captured adapter PID and its descendants | Prove cleanup is lineage-scoped; never use blanket `pkill` that can kill shared OAuth sessions | Capture PID tree before/after and the command proving no blanket kill was used |
| EC-012 | Concurrent-worktree collision | Run two isolated worktree fixtures against colliding ownership/state paths; assert collision is surfaced or contained | Verify concurrent lineages cannot overwrite another lineage's artifacts or dirty paths | Capture worktree identities, lock/collision output, and clean rollback |
| EC-013 | `node_modules` integrity | Resolve package paths independently in each worktree; reject symlinked cross-worktree dependency trees | Verify fan-out setup does not share or mutate another worktree's dependency installation | Capture `realpath`, symlink checks, package resolution, and repair guidance |
| EC-014 | Self-invocation guard | Seed the dispatch stack with the same CLI kind; assert recursive dispatch is rejected before spawn | Verify a lineage cannot fan out its own executor kind again and the rejection is aggregated | Capture stack env, guard message, no-child proof, and verdict |

### Deliverables for the Later Execution Pass

1. A stress-test suite under the ADR-001 location covering success and documented failure modes for all six adapters.
2. Fan-out stress tests covering concurrency, budgets, lineage death, convergence, stop-policy, artifact aggregation, and completion markers.
3. Adapter-specific playbook snippets under each owning CLI skill plus shared fan-out snippets under the hub location in ADR-002.
4. An adapter-by-edge-case coverage matrix proving every cell has a test and a playbook snippet.
5. Findings authored with the two `system-spec-kit/templates/stress-test/` templates.

### Out of Scope

- Any adapter implementation or behavior change.
- Remediation of defects found by the stress suite.
- The `014` cutover and non-CLI executors.
- Broad process cleanup, shared OAuth state mutation, cross-worktree dependency symlinking, or destructive-scope changes.

### Files to Read or Create Later

| File Path | Phase Role | Scaffold Action |
|-----------|------------|-----------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Live enum, flag support, sandbox and model policy | Read-only roster confirmation |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Fan-out command builders, scheduler, budgets, cleanup, aggregation | Read-only behavior contract |
| `.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs` | Single-shot Codex transport and PID cleanup reference | Read-only behavior contract |
| `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/` | Future stress suite | Create only in later execution |
| `.opencode/skills/cli-external-orchestration/cli-*/manual-testing-playbook/stress/` | Future adapter snippets | Create only in later execution |
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/fanout-stress/` | Future shared fan-out snippets | Create only in later execution |
| `.opencode/skills/system-spec-kit/templates/stress-test/` | Findings templates | Read and use in later execution |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The live adapter set is reconciled from both source-of-truth rosters before tests are authored. | The execution record names exactly the six CLI kinds in `EXECUTOR_KINDS` and the six skill packets; `native` is not treated as an external CLI adapter. |
| REQ-002 | Each adapter has a success path and documented failure coverage. | Each of the six adapter subjects has a stress file or named test group covering all 14 edge-case rows and its playbook destinations. |
| REQ-003 | Fan-out behavior is covered as a first-class subject. | Tests exercise `executors[]`, `flat_pool`, `concurrency`, `count`, `iterations`, both budget caps, convergence threshold, `max-iterations`, partial aggregation, and `FANOUT_LINEAGE_COMPLETE`. |
| REQ-004 | Every edge-case matrix cell has two artifacts. | For each subject × edge-case row, the matrix links one automated test and one reusable playbook snippet with a deterministic evidence contract. |
| REQ-005 | Hang-prone execution is bounded and reproducible. | Stress files run serially with `fileParallelism:false`; per-file commands have explicit timeouts; no full aggregate command is required for the gate. |
| REQ-006 | External dependencies do not make the suite nondeterministic. | Hermetic shims/fixtures cover unavailable-live cases; live probes preflight command and auth availability and use `SKIP` only with a specific blocker. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Adapter-specific and fan-out playbook ownership is explicit. | ADR-002's paths exist in the later execution plan and every matrix cell links to its owning snippet. |
| REQ-008 | Findings use the stress-test templates. | Every discovered defect has a rendered finding using `findings.template.md` and validates against `findings-rubric.schema.md`. |
| REQ-009 | Process and workspace safety are proven. | PID-scoped cleanup, RM-8 destructive-scope checks, collision handling, and no cross-worktree `node_modules` symlink are evidenced. |
| REQ-010 | Status distinctions remain honest. | Success, failure, and dependency-blocked `SKIP` have separate verdict rules; unavailable live CLIs are never reported as passing adapter behavior. |

### Planning Invariants

| ID | Invariant | Planned Control |
|----|-----------|-----------------|
| INV-001 | No adapter code changes belong in this child. | Execution tasks create tests, fixtures, playbooks, and findings only; defects route elsewhere. |
| INV-002 | No blanket process kill is acceptable. | Test and playbook contracts require a captured PID and descendant-scoped cleanup. |
| INV-003 | A child cannot silently re-enter the same executor kind. | The self-invocation cell seeds and checks `SPECKIT_CLI_DISPATCH_STACK`. |
| INV-004 | A live dependency absence is not a product failure. | ADR-003 defines hermetic coverage plus precise live-lane skip evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The exact six external CLI adapter kinds are reconciled against both live rosters before execution.
- **SC-002**: Every one of the 14 edge-case rows is expanded across all six adapters and fan-out, with one test and one playbook snippet per cell.
- **SC-003**: Fan-out stress coverage proves concurrency, expansion, budgets, convergence, max-iterations, lineage death, aggregation, and completion-marker behavior.
- **SC-004**: The stress runner cannot hang indefinitely on stdin, a stalled child, or the full aggregate suite; per-file evidence remains available.
- **SC-005**: Live dependency gating distinguishes a real adapter result from a specific `SKIP` blocker.
- **SC-006**: Every finding is authored with the stress-test templates and routed to a separate remediation scope; this child does not fix it.
- **SC-007**: The 035 scaffold itself remains Planned, contains no implementation-summary, and passes strict packet validation with zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Live credentials or binaries are absent | A live smoke test cannot prove provider behavior | Use deterministic shims for the matrix; record a precise `SKIP` for live-only confirmation under ADR-003 |
| Risk | A stdin-starved child consumes a worker slot without CPU | The gate hangs and hides later cells | Close stdin explicitly, bound every subprocess, enable stall watchdogs, and run files serially |
| Risk | Cleanup kills another operator's shared OAuth session | External state is disrupted | Capture the child PID and kill only that process tree; prohibit blanket `pkill -f` patterns |
| Risk | Worktree or dependency state is shared accidentally | Results become nondeterministic and destructive | Use isolated fixtures, assert real paths, and reject cross-worktree `node_modules` symlinks |
| Risk | A failure is reported as a fix | The phase hides a regression instead of routing it | Findings are hypotheses until reproduced; adapter behavior is not changed by this child |
| Dependency | WS1 handoff | Test/playbook execution starts before the required substrate is ready | Gate execution on the WS1 artifacts named in the handoff |
| Dependency | Six CLI skill packets and live enum | Roster drift can leave a cell uncovered | Re-run the exact roster check at execution start and fail closed on drift |
| Dependency | Findings templates | Defect records need a stable schema | Validate template presence and schema use before recording findings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Hermetic adapter shims must produce stable exit, stdout, stderr, artifact, and timing signals without provider credentials.
- **NFR-D02**: Each test file must be runnable independently with an explicit time bound.

### Safety
- **NFR-S01**: Cleanup is scoped to captured PIDs and descendants; shared OAuth processes remain untouched.
- **NFR-S02**: Sandbox and RM-8 checks must detect silent no-op and out-of-scope mutation before a verdict is issued.
- **NFR-S03**: Worktree fixtures must not share `node_modules` through symlinks.

### Evidence
- **NFR-E01**: Every matrix cell records command, environment, expected signal, captured evidence, and `PASS` / `FAIL` / `SKIP` criteria.
- **NFR-E02**: Credential-shaped values and operator identity are redacted from committed fixtures and playbook examples.

### Maintainability
- **NFR-M01**: Adapter-specific instructions stay in the owning CLI skill; shared fan-out policy is not duplicated six times.
- **NFR-M02**: Findings remain separate from remediation code so a later fix can cite the reproduced failure.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data and Dependency Boundaries
- Empty adapter output: classify as a missing artifact, not a passing no-op.
- Missing transport: fail preflight or `SKIP` the live lane with the exact `command -v` blocker.
- Auth or balance denial: preserve the provider diagnostic while redacting credentials.
- A model that is valid for one adapter but unsupported by another: reject through the per-kind flag/model contract.

### Process and Timing
- Child waiting on stdin: explicit `</dev/null` and timeout evidence are mandatory.
- Child killed by timeout, stall watchdog, or external signal: classify as failure and prove PID-scoped cleanup.
- One lineage dies while others finish: retain surviving artifacts and aggregate a partial summary.
- All lineages fail: report the all-failed exit path rather than an empty success.

### Workspace and Recursion
- Read-only mode silently leaves the requested file unchanged: record no-op and do not call it success.
- Workspace-write mode writes outside lineage scope: RM-8 containment evidence is required.
- Concurrent worktree or lock collision: surface the collision without reverting another worker's files.
- Cross-worktree `node_modules` symlink: fail integrity check and repair the fixture, never normalize by symlinking.
- Same-kind recursive dispatch: reject before spawn using the dispatch-stack marker.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Six adapters, fan-out orchestration, 14 edge-case rows, two playbook ownership surfaces, and findings templates |
| Risk | 21/25 | External credentials, process cleanup, sandbox scope, shared OAuth, worktrees, and zero-CPU hangs |
| Research | 15/20 | Live enum, executor flag matrix, scheduler behavior, skill roster, and real failure receipts must be reconciled |
| Multi-Agent | 7/15 | Seven execution subjects can run independently after the shared harness and matrix contract are fixed |
| Coordination | 13/15 | WS1 dependency, per-skill playbook ownership, and separate remediation routing require explicit handoffs |
| **Total** | **76/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A missing live CLI is mistaken for a passing adapter | H | M | Hermetic shim coverage plus explicit live-lane `SKIP` criteria in ADR-003 |
| R-002 | A stdin-hang or stalled child blocks the entire stress run | H | H | `</dev/null`, per-file execution, timeout and watchdog assertions |
| R-003 | Cleanup kills unrelated shared OAuth processes | H | M | Captured PID tree only; command lint rejects blanket kill patterns |
| R-004 | Worktree or `node_modules` sharing contaminates results | H | M | Isolated fixtures, realpath checks, and symlink rejection |
| R-005 | Fan-out partial failure is aggregated as success | H | M | Lineage death, artifact, ledger, and summary assertions with explicit exit classification |
| R-006 | Adapter fixes leak into a test-only phase | M | M | Scope gate allows only test/playbook/findings paths; defects route to separate packets |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: An adapter regression is caught before a live run (Priority: P0)

**As an** operator preparing a deep-loop run, **I want** every CLI adapter's success and failure behavior exercised against the same matrix, **so that** a transport or permission regression is visible before it consumes provider time.

**Acceptance Criteria**:
1. Given any of the six live adapter kinds, When its stress file runs, Then the success path and all 14 edge-case rows have deterministic verdict criteria.

### US-002: A hang cannot hide later cells (Priority: P0)

**As a** test maintainer, **I want** stdin, timeout, and stall behavior bounded per file, **so that** one zero-CPU child does not block the entire evidence run.

**Acceptance Criteria**:
1. Given a child that waits for stdin or stops emitting output, When the per-file stress command runs, Then it exits within the configured bound and records the captured PID cleanup.

### US-003: Fan-out reports partial failure honestly (Priority: P0)

**As an** orchestrator maintainer, **I want** lineage death, budget rejection, and convergence/stop-policy outcomes represented in the final summary, **so that** surviving lineages are not erased and failures are not presented as success.

**Acceptance Criteria**:
1. Given one failed lineage and one successful lineage, When aggregation completes, Then the summary is partial, surviving artifacts remain, and the failing lineage is named.

### US-004: Operators can reproduce the failure (Priority: P1)

**As a** future operator, **I want** a playbook snippet for every matrix cell, **so that** I can rerun the exact command, collect evidence, and distinguish PASS, FAIL, and dependency-blocked SKIP.

**Acceptance Criteria**:
1. Given a matrix cell, When its playbook snippet runs, Then it specifies the prompt/command, preconditions, expected signals, evidence, verdict, and triage path.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- Which WS1 artifacts and run fixtures are available when the execution pass starts?
- Which live CLI/auth lanes can be run in the operator environment, and which require a documented `SKIP`?
- Does the runtime's current test harness expose enough seam points for all shims without modifying adapter behavior? If not, the execution plan must route the missing seam as a separate implementation decision.
- Do the existing CLI skill playbooks have a preferred stress category name, or should `stress/` be adopted consistently across all six packets?
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Live executor contract**: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- **Fan-out runtime**: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- **CLI skill roster**: `.opencode/skills/cli-external-orchestration/mode-registry.json`
<!-- /ANCHOR:related-docs -->
