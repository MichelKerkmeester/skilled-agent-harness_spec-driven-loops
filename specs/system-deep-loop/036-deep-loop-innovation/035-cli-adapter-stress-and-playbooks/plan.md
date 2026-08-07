---
title: "Implementation Plan: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration"
description: "Reconcile the live adapter roster, build a hermetic per-file stress harness, cover the shared fan-out scheduler, and author deterministic playbook snippets for the 14 edge-case rows. This plan is for a later execution pass; the current phase only authors planning documents."
trigger_phrases:
  - "cli adapter stress tests"
  - "deep-loop executor adapter coverage"
  - "fan-out stress testing"
  - "external CLI manual testing playbook"
  - "stdin hang adapter regression"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/035-cli-adapter-stress-and-playbooks"
    last_updated_at: "2026-08-07T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "Mapped the future harness, fan-out phases, and verification gates"
    next_safe_action: "Review ADRs before execution handoff"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions:
      - "Which WS1 artifacts are ready for the execution handoff?"
    answered_questions:
      - "This phase is scaffold-only and remains Planned."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime contracts, CommonJS orchestration scripts, Node child-process fixtures |
| **Framework** | Vitest through `runtime/vitest.config.ts`; shell/PATH shims for transport and dependency faults |
| **Storage** | Per-test temporary worktrees and lineage artifacts: JSONL ledgers, iteration Markdown, stdout, and orchestration summaries |
| **Testing** | Serial stress files under `runtime/tests/stress/cli-adapter/`; explicit per-file commands with `fileParallelism:false` |
### Overview

Execution begins with a roster and source-contract check, then freezes the 14-row matrix and the seven subjects. A hermetic harness supplies deterministic provider, transport, stdin, timeout, permission, process, and workspace faults; gated live probes add real CLI/auth evidence only when the dependency preflight passes. The fan-out path gets a separate stress file because its concurrency, budgets, lineage aggregation, and completion semantics are distinct from any one adapter.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] WS1 handoff and its required artifacts are present and readable.
- [ ] `EXECUTOR_KINDS` and the six `cli-external-orchestration` skill packets reconcile exactly.
- [ ] The 14 edge-case rows and seven subjects are frozen in the matrix manifest.
- [ ] ADR-001 through ADR-003 are reviewed by the execution owner.
- [ ] The test harness can create isolated temporary worktrees without cross-linking `node_modules`.

### Definition of Done

- [ ] Each adapter has success coverage and all 14 edge-case cells with named test evidence.
- [ ] Fan-out covers `executors[]`, `flat_pool`, concurrency, expansion, budgets, convergence, stop-policy, partial aggregation, and `FANOUT_LINEAGE_COMPLETE`.
- [ ] Every matrix cell has one playbook snippet with exact commands, evidence, verdict, and triage.
- [ ] Findings use both stress-test templates and route defects to separate remediation scopes.
- [ ] Per-file stress commands pass or produce a specific dependency `SKIP`; no full aggregate hang is used as the gate.
- [ ] The 035 packet remains Planned and strict validation exits 0 with zero warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Hermetic adapter stress plus gated live probes, executed serially per file and recorded through a matrix manifest.

### Key Components

- **Roster reconciler**: Reads `executor-config.ts`'s Zod kind enum and `cli-external-orchestration/mode-registry.json`; fails closed on drift.
- **Adapter stress files**: One file per adapter subject under `runtime/tests/stress/cli-adapter/`, with common fixtures and per-kind command expectations.
- **Fan-out stress file**: Exercises the scheduler separately, including the worker pool, budget rejection, lineage death, artifact checks, ledger events, and final summary.
- **Transport shims**: Temporary executables placed first in `PATH` to return deterministic auth, model, throttle, timeout, stdin, and artifact outcomes without credentials.
- **Workspace fixtures**: Independently installed worktrees with realpath/symlink assertions and RM-8 containment checks.
- **Coverage manifest**: Adapter/edge-case cells map to a test name and a playbook path; missing either is a validation failure.
- **Finding records**: The stress-test findings template and rubric schema capture observed failure, evidence, severity calibration, and remediation routing.

### Data Flow

`roster check -> matrix manifest -> hermetic shim or gated live preflight -> one adapter/fan-out stress file -> captured stdout/stderr/ledger/artifacts -> PASS / FAIL / SKIP -> playbook snippet -> finding if reproduced`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans a verification program, not a production fix. The source runtime is read as the behavior contract; later execution creates only the dedicated stress, playbook, matrix, and finding artifacts.

| Surface | Current Role | Action in Later Execution | Verification |
|---------|--------------|---------------------------|--------------|
| `runtime/lib/deep-loop/executor-config.ts` | Canonical kind enum, flag support, model lists, sandbox mappings | read-only contract source | Roster and per-kind capability snapshot |
| `runtime/scripts/fanout-run.cjs` | Fan-out parser, pool, command builders, budgets, timeout, cleanup, aggregation | read-only contract source | Fan-out stress file and ledger/summary assertions |
| `runtime/scripts/codex-dispatch.cjs` | Single-shot Codex transport and PID-scoped cleanup reference | read-only contract source | Codex stdin, timeout, transport, and orphan checks |
| `cli-external-orchestration/mode-registry.json` | Six adapter packet roster | read-only contract source | Exact set equality check |
| `runtime/tests/stress/cli-adapter/` | Future adapter/fan-out stress suite | create later | Serial per-file Vitest runs; no full aggregate gate |
| `cli-*/manual-testing-playbook/stress/` | Future adapter-specific operator snippets | create later | Package validator and matrix bijection |
| `manual-testing-playbook/fanout-stress/` | Future shared orchestration snippets | create later | Root playbook link and scenario contract |
| `templates/stress-test/` | Future findings contract | read/use later | Template and rubric checks |

Required source inventories before execution:

- `EXECUTOR_KINDS` and `EXECUTOR_KIND_FLAG_SUPPORT` from `executor-config.ts`.
- The six `workflowMode` entries in `cli-external-orchestration/mode-registry.json`.
- Fan-out schema and exported helpers for `count`, `iterations`, `assignment_model`, `concurrency`, budgets, and stop policy.
- Command builder availability probes and self-invocation checks for each adapter.
- Existing manual-playbook structure and validators in each CLI skill.

**Algorithm invariant.** A matrix cell is not complete until it has a deterministic test, a captured evidence contract, a playbook snippet, and a binary verdict rule. A live dependency absence may produce only a specifically reasoned `SKIP`; it cannot silently convert an unexecuted check into `PASS`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Roster, evidence, and matrix freeze

- [ ] Confirm the six CLI kinds against `executor-config.ts` and the skill roster.
- [ ] Read the live fan-out and Codex dispatch behavior, including the stdin and PID cleanup contracts.
- [ ] Freeze the 14 edge-case rows and seven subjects; assign a stable test and playbook naming scheme.
- [ ] Record the motivating incidents as evidence, without turning them into unverified fixes.

### Phase 2: Harness and dependency gates

- [ ] Create `runtime/tests/stress/cli-adapter/` and shared fixture helpers.
- [ ] Set `fileParallelism:false` and document serial per-file commands; add a bounded subprocess helper.
- [ ] Build PATH shims for provider errors, rate limiting, timeout, stdin wait, missing transport, and artifact outcomes.
- [ ] Add live binary/auth preflight and precise `SKIP` output without logging secrets.
- [ ] Add isolated worktree and dependency-integrity fixtures; never share `node_modules` by symlink.

### Phase 3: Adapter stress coverage

- [ ] `cli-codex`: success, auth/model/rate-limit/timeout/stdin/gate/sandbox/transport/budget/death/orphan/worktree/node_modules/self-invocation cells.
- [ ] `cli-opencode`: the same 14-row contract, including full-runtime spec-gate and detached-process behavior.
- [ ] `cli-pi`: the same 14-row contract, treating artifact validation as the success signal when exit codes are unreliable.
- [ ] `cli-claude-code`: the same 14-row contract, including `configDir`, permission-mode, and auth behavior.
- [ ] `cli-devin`: the same 14-row contract, including `command -v devin` and account OAuth gating.
- [ ] `cli-cursor`: the same 14-row contract, including `--mode plan`, `--force`, and stdin-starved approval behavior.

### Phase 4: Fan-out orchestration coverage

- [ ] Exercise multiple `executors[]` entries with `assignment_model: flat_pool` and a bounded `concurrency`.
- [ ] Exercise per-lineage `count` expansion and `iterations` overrides, including label collision rejection.
- [ ] Exercise per-lineage and aggregate budget rejection before spawn, plus ledger evidence.
- [ ] Exercise convergence threshold and `max-iterations` stop-policy, including `FANOUT_LINEAGE_COMPLETE` and artifact validation.
- [ ] Kill one captured lineage mid-run and verify partial aggregation, surviving artifacts, and final exit classification.
- [ ] Exercise orphan cleanup, concurrent worktree collision, node_modules integrity, spec-gate env, and self-invocation guard.

### Phase 5: Playbooks, matrix, and findings

- [ ] Write one deterministic snippet per adapter/edge-case cell in the ADR-002 locations.
- [ ] Write the shared fan-out snippets and link them from the hub playbook.
- [ ] Produce the adapter × edge-case coverage matrix with test names and playbook paths.
- [ ] Author findings with the two stress-test templates for every reproduced defect; route remediation separately.

### Phase 6: Verification and handoff

- [ ] Run every stress file independently with the per-file command and capture full output.
- [ ] Do not use a full aggregate run as the gate; record any observed hang as a finding with PID evidence.
- [ ] Run playbook package validators and link checks for every touched skill.
- [ ] Reconcile the matrix, findings, and checklist; keep external dependency skips explicit.
- [ ] Run strict validation on the 035 packet and hand the execution artifacts to the orchestrator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adapter success | One valid invocation per CLI kind with expected artifact/output contract | Vitest, bounded child process, adapter-specific fixture |
| Adapter failure matrix | 14 edge-case rows per CLI kind, including transport and dependency gating | Vitest, PATH shims, temporary env, captured evidence |
| Fan-out | `executors[]`, flat pool, concurrency, count/iterations, budgets, convergence, stop policy, partial death, cleanup | Vitest, fanout-run exports, child-process fixtures |
| Workspace safety | RM-8 scope, collision isolation, realpath and `node_modules` integrity | Temporary git worktrees, `git status`, `realpath`, symlink checks |
| Manual playbook | Reproducible commands and evidence per adapter and edge case | `validate-playbook-package.cjs`, link checks, operator run records |
| Findings | Reproduced defects and severity/routing decisions | `findings.template.md`, `findings-rubric.schema.md` |

### Named verification commands for the execution pass

- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/stress/cli-adapter/ --config vitest.config.ts --fileParallelism=false`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/stress/cli-adapter/cli-codex.vitest.ts --config vitest.config.ts --fileParallelism=false`
- Repeat the per-file command for `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, `cli-cursor`, and `fanout.vitest.ts`; each output is retained independently.
- `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package <owning-playbook-package>`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/035-cli-adapter-stress-and-playbooks --strict`

The directory-level Vitest command is an inventory command only when the runner is known not to hang; the gate is the serial per-file set. The execution owner must not replace that contract with an unbounded full aggregate run. The exact test filenames may be finalized during Phase 2, but the one-file-per-subject boundary is fixed by ADR-001.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| WS1 handoff | Internal | Planned | Execution cannot start until its required artifacts and scope are readable |
| `executor-config.ts` enum | Internal | Confirmed at scaffold time | Roster drift invalidates the matrix and must stop execution |
| Six CLI skill packets | Internal | Confirmed at scaffold time | Adapter-specific auth/sandbox/playbook contracts are incomplete without them |
| Provider binaries and credentials | External | Environment-dependent | Hermetic shims cover deterministic cells; live-only rows become precise `SKIP`s |
| Vitest and Node process APIs | Internal | Expected | No bounded stress execution without the configured runner |
| Isolated worktree setup | Internal | Planned | Workspace collision and dependency-integrity cells cannot run safely |
| Stress-test templates | Internal | Expected | Findings cannot be authored to the required contract until present |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Current scaffold trigger**: A strict validator or scope check shows that this packet claims implementation, writes an out-of-scope file, or loses the Planned status.
- **Current scaffold procedure**: Restore only the five authored documents and regenerate metadata inside 035; do not touch runtime, CLI skill, parent, or concurrent phase folders. The generated `implementation-summary.md` is intentionally absent.
- **Execution trigger**: A stress helper or playbook writes outside its dedicated path, a cleanup test targets an unowned PID, or a live probe cannot distinguish dependency absence from adapter behavior.
- **Execution procedure**: Stop the affected subject, retain the captured evidence and PID/fixture identifiers, remove only the newly created test/playbook artifacts in that subject's scope, and route any adapter fix to a separate remediation packet.
- **Data reversal**: No production data or adapter state is migrated by this child. Provider credentials, shared OAuth state, and operator worktrees are never cleanup targets.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
WS1 handoff ──► roster + evidence freeze ──► harness + gates ──► adapter cells x6
                                                               │
                                                               ▼
                                                         fan-out cells
                                                               │
                                                               ▼
                                                   playbooks + findings
                                                               │
                                                               ▼
                                                    serial verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Roster/evidence freeze | WS1 handoff and live source read | 2 |
| 2 Harness/dependency gates | Phase 1 | 3 and 4 |
| 3 Adapter cells | Phase 2 | 5 |
| 4 Fan-out cells | Phase 2 | 5 |
| 5 Playbooks/findings/matrix | Phases 3 and 4 | 6 |
| 6 Serial verification | Phase 5 | Execution handoff |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Roster, evidence, and matrix freeze | Medium | 2-4 hours |
| Harness and dependency gates | High | 8-14 hours |
| Six adapter stress subjects | High | 18-30 hours |
| Fan-out orchestration subject | High | 10-16 hours |
| Playbooks, matrix, and findings | High | 12-20 hours |
| Serial verification and handoff | Medium | 4-8 hours |
| **Total** |  | **54-92 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist

- [ ] Capture the current clean/dirty state of only the 035 worktree and the dedicated execution roots.
- [ ] Confirm no test or playbook command uses a blanket process kill.
- [ ] Confirm fixture worktrees have independent `node_modules` paths.
- [ ] Confirm external dependency preflight and `SKIP` wording before live probes.

### Rollback Procedure

1. Stop the affected per-file subject and capture its stdout, stderr, ledger, and PID evidence.
2. Kill only the captured process tree if it is still alive; do not search-and-kill by command name.
3. Remove or restore only the affected stress/playbook/finding artifacts in their dedicated scope.
4. Re-run the unaffected subject files and retain the failure as a routed finding.

### Data Reversal

- **Has production data migrations?** No.
- **Has shared credential state?** Yes, but it is outside this packet's cleanup authority and must remain untouched.
- **Reversal procedure**: Restore the subject's isolated fixture and rerun its serial file; never repair a failed test by symlinking another worktree's dependencies.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│ WS1 + rosters│──►│ Harness + gates  │──►│ Adapter cells x6     │
└──────────────┘   └──────────────────┘   └──────────┬──────────┘
                                                     │
                                                     ▼
                                           ┌─────────────────────┐
                                           │ Fan-out cells        │
                                           └──────────┬──────────┘
                                                      │
                                                      ▼
                                           ┌─────────────────────┐
                                           │ Playbooks + findings │
                                           └──────────┬──────────┘
                                                      │
                                                      ▼
                                           ┌─────────────────────┐
                                           │ Serial gate + handoff│
                                           └─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Roster/evidence freeze | Live source and WS1 | Frozen subjects and edge rows | Harness |
| Harness | Roster, Node, Vitest | Shims, fixtures, bounded runner | Adapter/fan-out cells |
| Adapter cells | Harness and owning skill contract | Six subject results | Matrix and playbooks |
| Fan-out cells | Harness and scheduler contract | Concurrency/budget/aggregation results | Matrix and shared playbook |
| Playbooks | Subject results and package validators | Operator snippets with evidence rules | Release-readiness review |
| Findings | Reproduced failure and rubric | Routed defect records | Remediation ownership |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Roster and failure-evidence freeze** - 2-4 hours - CRITICAL
2. **Hang-safe harness and dependency gates** - 8-14 hours - CRITICAL
3. **Six adapter stress subjects** - 18-30 hours - CRITICAL
4. **Fan-out scheduler stress subject** - 10-16 hours - CRITICAL
5. **Coverage matrix, playbooks, findings, and serial gate** - 16-28 hours - CRITICAL

**Parallel Opportunities**:

- The six adapter files can run in separate workstreams after the shared harness and matrix contract are stable.
- Playbook snippets can be authored alongside their adapter results, while shared fan-out snippets wait for scheduler evidence.
- Findings can be authored per reproduced defect without changing adapter code.

**Serialization Constraints**:

- Do not parallelize the same worktree or share `node_modules` across worktrees.
- Keep each file's process run bounded and do not replace the per-file gate with a full aggregate run.
- Cleanup must happen by captured PID before the next dispatch on a shared OAuth surface.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Roster and matrix frozen | Six adapters plus fan-out and all 14 rows are named | End of Phase 1 |
| M2 | Harness is deterministic | Shims, bounds, per-file config, and live dependency gates produce stable evidence | End of Phase 2 |
| M3 | Adapter cells executed | Six adapter subjects have success and failure evidence | End of Phase 3 |
| M4 | Fan-out executed | Budgets, concurrency, death, convergence, stop-policy, and aggregation are evidenced | End of Phase 4 |
| M5 | Playbook/findings coverage complete | Every matrix cell maps to a test and snippet; findings use both templates | End of Phase 5 |
| M6 | Handoff verified | Serial gate output and strict validation are captured; packet status remains Planned until execution closes separately | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Use `runtime/tests/stress/cli-adapter/` with serial per-file, `fileParallelism:false`, bounded execution | Planned |
| ADR-002 | Keep adapter snippets per CLI skill and fan-out snippets in the hub playbook | Planned |
| ADR-003 | Use hermetic shims for deterministic failures and gate live probes on binary/auth preflight | Planned |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->

---

<!-- ANCHOR:ai-execution-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the current source files and the six CLI skill contracts at the execution commit.
- Reconcile the live enum and mode registry before creating any test or playbook file.
- Confirm the target worktree and dependency paths; refuse cross-worktree `node_modules` symlinks.
- Confirm the captured-PID cleanup implementation and the `</dev/null` rule before launching a CLI.
- Confirm `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` for direct child gate tests and the fan-out equivalent env injection.

### Execution Rules

| Rule | Description |
|------|-------------|
| EXEC-SEQ | Freeze roster and matrix, build harness, run adapter cells, run fan-out, write playbooks/findings, then verify. |
| EXEC-SCOPE | This child may add only dedicated stress, playbook, matrix, and finding artifacts in the approved execution paths. |
| EXEC-HANG | Use `fileParallelism:false`, explicit per-file commands, `</dev/null`, timeout, and stall evidence. |
| EXEC-KILL | Capture the PID at launch and clean only its process tree; blanket `pkill` is prohibited. |
| EXEC-GATE | Live dependency absence becomes a precise `SKIP`; it never becomes a silent pass. |

### Status Reporting Format

Record subject, edge-case row, exact command, environment (redacted), exit/signal, artifact and ledger evidence, verdict, and finding path. Separate hermetic evidence, live evidence, and dependency skips.

### Blocked Task Protocol

If WS1 artifacts are missing, a source contract drifts, a target path collides, a child hangs, or a test harness requires adapter behavior changes, stop that workstream, preserve the evidence, and route the blocker or remediation separately. Do not broaden this Planned scaffold.
<!-- /ANCHOR:ai-execution-protocol -->
