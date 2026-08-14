---
title: "Verification Checklist: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration"
description: "Planned verification checklist for the later execution pass: exact roster reconciliation, 98 matrix cells, hang-safe per-file evidence, fan-out aggregation, reusable playbooks, and template-backed findings."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/001-cli-adapter-stress-and-playbooks"
    last_updated_at: "2026-08-07T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined planned evidence gates for adapters and fan-out"
    next_safe_action: "Run checklist during separate execution pass"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Which live dependency checks will be available at execution time?"
    answered_questions:
      - "The scaffold does not claim any test or playbook result."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Verification Checklist: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim execution complete until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Every evidence string must name the subject, edge-case row, exact command, captured signal/artifact, and verdict. A live dependency `SKIP` must state the specific missing binary, auth state, or environment capability.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] WS1 handoff and all cited source files are present and readable [Evidence: execution intake record]
  - **Evidence**: Execution intake names the WS1 artifacts, source commit, and target worktree.
- [ ] CHK-002 [P0] Exact external adapter roster reconciled from `EXECUTOR_KINDS` and the six CLI skill packets [Evidence: roster snapshot]
  - **Evidence**: Source snapshot shows `cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, and `cli-cursor`, with no missing or extra adapter subject.
- [ ] CHK-003 [P0] The 14 edge-case rows and seven subjects are frozen before test/playbook authoring [Evidence: matrix manifest]
  - **Evidence**: Matrix manifest contains one row for each named edge case and expands every row across six adapters plus fan-out.
- [ ] CHK-004 [P1] No production adapter behavior is in this child’s write scope [Evidence: scoped diff]
  - **Evidence**: Later execution diff contains only approved stress, playbook, matrix, and findings paths.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Stress files use the shared harness and existing command-builder contracts [Evidence: stress suite review]
  - **Evidence**: Each subject test names the source contract it exercises and does not duplicate adapter behavior.
- [ ] CHK-011 [P0] The stress runner is hang-safe [Evidence: runner config and per-file output]
  - **Evidence**: `fileParallelism:false`, explicit subprocess bounds, `</dev/null`, and stall/timeout evidence are present.
- [ ] CHK-012 [P1] PATH shims and fixtures are deterministic and credential-free [Evidence: fixture review]
  - **Evidence**: Shims return controlled outcomes; no provider token, operator identity, or machine-local secret is committed.
- [ ] CHK-013 [P1] Workspace and dependency fixtures are isolated [Evidence: realpath/symlink report]
  - **Evidence**: Worktree paths are independent and no `node_modules` directory crosses worktree boundaries through a symlink.
- [ ] CHK-014 [P1] RM-8 destructive-scope checks are explicit [Evidence: sandbox scenarios]
  - **Evidence**: Read-only no-op, workspace-write, and destructive-scope refusal each have before/after file-state evidence.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every adapter has a success path and all 14 edge-case rows [Evidence: six adapter stress files]
  - **Evidence**: Six per-adapter files each link success evidence plus 14 edge-case test names.
- [ ] CHK-021 [P0] Every matrix cell has a test and playbook snippet [Evidence: coverage matrix]
  - **Evidence**: Seven subjects × 14 rows = 98 cells; no cell lacks either reference.
- [ ] CHK-022 [P0] Fan-out scheduler behavior is independently covered [Evidence: fanout stress file]
  - **Evidence**: `executors[]`, `flat_pool`, `concurrency`, `count`, `iterations`, both budgets, convergence threshold, stop-policy, lineage death, aggregation, and `FANOUT_LINEAGE_COMPLETE` are named.
- [ ] CHK-023 [P0] Stdin-hang and timeout cells exit within bounds [Evidence: per-file process output]
  - **Evidence**: Commands close stdin with `</dev/null`, record elapsed/bound, and show captured-PID cleanup.
- [ ] CHK-024 [P0] Partial lineage death is not reported as success [Evidence: fan-out summary and ledger]
  - **Evidence**: Surviving artifacts, failed lineage identity, partial summary, and final exit classification agree.
- [ ] CHK-025 [P1] Rate-limit and retry behavior is bounded [Evidence: throttle test output]
  - **Evidence**: Retry count, wait bound, and terminal disposition are captured without an unbounded loop.
- [ ] CHK-026 [P1] Dependency `SKIP` is specific and honest [Evidence: live preflight output]
  - **Evidence**: Missing command or auth blocker is named; no unavailable live lane is counted as PASS.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each reproduced adapter or fan-out defect is recorded as a finding [Evidence: findings records]
  - **Evidence**: Every FAIL has a template-backed finding with exact reproduction and remediation routing.
- [ ] CHK-FIX-002 [P0] Findings use both stress-test templates [Evidence: template validation]
  - **Evidence**: `findings.template.md` fields and `findings-rubric.schema.md` rules are applied to every finding.
- [ ] CHK-FIX-003 [P1] Findings do not silently implement fixes [Evidence: scoped diff]
  - **Evidence**: Adapter defects are routed to separate remediation packets; no production behavior change is present here.
- [ ] CHK-FIX-004 [P1] Orphan cleanup is PID-scoped [Evidence: cleanup command review]
  - **Evidence**: Each cleanup action uses a captured PID and descendants; no blanket `pkill -f` command exists.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration remains reliability/operator-safety, not breach language [Evidence: spec.md]
  - **Evidence**: `spec.md` keeps dependency, sandbox, and cleanup failures in their correct operational category.
- [ ] CHK-040 [P0] Credentials and operator-identifying data are absent from fixtures and playbooks [Evidence: redaction scan]
  - **Evidence**: Redaction scan returns no credential-shaped values or absolute operator paths in committed artifacts.
- [ ] CHK-041 [P0] Shared OAuth processes are protected from cleanup [Evidence: orphan scenario]
  - **Evidence**: Cleanup targets only the captured adapter PID tree and leaves unrelated process identities unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] Every matrix cell has a deterministic evidence contract [Evidence: coverage matrix]
  - **Evidence**: Each test/snippet pair names command, signal, artifact, verdict, and triage.
- [ ] CHK-008 [P0] The 035 packet passes strict validation [Evidence: validate.sh]
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <035-folder> --strict` exits 0 with zero errors and zero warnings.
- [ ] CHK-050 [P0] ADR-001 through ADR-003 are present and Planned [Evidence: decision-record.md]
  - **Evidence**: All three required decisions carry context, decision, alternatives, consequences, five checks, and implementation notes without claiming execution completion.
- [ ] CHK-051 [P1] Playbook package validation passes for each touched CLI skill and the hub [Evidence: playbook validator output]
  - **Evidence**: Root/per-feature topology, prompt synchronization, local links, and PASS/FAIL/SKIP rules pass.
- [ ] CHK-052 [P1] Findings schema validation passes [Evidence: findings validator output]
  - **Evidence**: Every finding validates against the rubric schema.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] This scaffold touches only the 035 folder [Evidence: no-stray-files sweep]
  - **Evidence**: `git status --short` and an explicit path allowlist show no file outside 035 changed by this authoring pass.
- [ ] CHK-091 [P1] Execution artifacts stay within approved roots [Evidence: scoped diff]
  - **Evidence**: Stress files, playbooks, matrix, and findings appear only in the ADR-approved paths.
- [ ] CHK-092 [P1] `implementation-summary.md` is absent while status is Planned [Evidence: packet file list]
  - **Evidence**: The 035 file list contains the five authored docs and metadata, with no implementation summary.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Test-suite location and hang-safe execution model are documented [Evidence: decision-record.md]
  - **Evidence**: ADR-001 names the stress directory, serial per-file boundary, `fileParallelism:false`, explicit stdin closure, and bounded processes.
- [ ] CHK-101 [P0] Playbook ownership is documented [Evidence: decision-record.md]
  - **Evidence**: ADR-002 names per-skill adapter paths and the consolidated fan-out hub path.
- [ ] CHK-102 [P0] External-dependency gating is documented [Evidence: decision-record.md]
  - **Evidence**: ADR-003 separates hermetic shims from gated live probes and defines precise `SKIP` criteria.
- [ ] CHK-103 [P1] Alternatives and rejection rationale are recorded for all ADRs [Evidence: decision-record.md]
  - **Evidence**: Each ADR compares at least three viable approaches and names the losing trade-off.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Per-file stress execution is the completion gate [Evidence: command log]
  - **Evidence**: Each subject file runs independently; no full aggregate process is required to declare the test gate.
- [ ] CHK-111 [P1] Largest adapter and fan-out fixtures have bounded runtime evidence [Evidence: timing report]
  - **Evidence**: Wall-clock duration, timeout bound, and captured process state are recorded for the largest fixture.
- [ ] CHK-112 [P1] Retry, convergence, and max-iterations outcomes are distinguishable [Evidence: ledger/summary report]
  - **Evidence**: Stop reason, iteration count, and final artifact state agree for each policy scenario.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback and containment procedure is documented before execution [Evidence: plan.md]
  - **Evidence**: `plan.md` states how to stop a subject, clean a captured PID, and remove only its isolated artifacts.
- [ ] CHK-121 [P1] Planned status is reconciled across all five docs and metadata [Evidence: packet cross-read]
  - **Evidence**: No doc or graph record claims implementation completion.
- [ ] CHK-122 [P0] No commit or push is performed by this scaffold phase [Evidence: git status and command log]
  - **Evidence**: The orchestrator receives an uncommitted 035-only diff.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No committed artifact embeds an absolute machine-local path or secret [Evidence: redaction scan]
  - **Evidence**: Scan covers stress fixtures, playbooks, matrix, and findings.
- [ ] CHK-131 [P1] Every live dependency skip names its blocker [Evidence: live-run report]
  - **Evidence**: Each `SKIP` names missing command, authentication state, or environment restriction.
- [ ] CHK-132 [P2] Matrix and playbook wording stays evergreen [Evidence: documentation review]
  - **Evidence**: Scenarios name behavior and commands rather than temporary packet history or machine-specific identity.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` remain synchronized [Evidence: packet cross-read]
  - **Evidence**: Scope, 14 rows, seven subjects, Planned status, and no-implementation boundary agree.
- [ ] CHK-141 [P1] `decision-record.md` is cited by plan and checklist [Evidence: cross-reference scan]
  - **Evidence**: ADR-001 through ADR-003 appear in the architecture summary and checklist gates.
- [ ] CHK-142 [P2] Every future finding links back to one matrix cell [Evidence: findings cross-reference]
  - **Evidence**: Finding records name subject, row, test, and playbook path.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Planned Items | Verified |
|----------|---------------|----------|
| P0 Items | 26 | 0 |
| P1 Items | 25 | 0 |
| P2 Items | 2 | 0 |

**Verification Date**: Planned for the separate execution pass
**Verified By**: Pending execution owner
**Status**: Planned — no test, playbook, or findings result is claimed in this scaffold.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Execution owner | Runs the later stress and playbook pass | Pending | — |
| Packet owner | Confirms scope, ADRs, and handoff boundary | Pending | — |
<!-- /ANCHOR:sign-off -->
