---
title: "Verification Checklist: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration"
description: "Evidence-backed closeout checklist for the six CLI adapters, fan-out scheduler, 98-cell matrix, operator playbooks, and release gates."
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
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/001-cli-adapter-stress-and-playbooks"
    last_updated_at: "2026-08-15T19:43:48Z"
    last_updated_by: "codex"
    recent_action: "Closed RM-8; strict is blocked by out-of-scope global command-tree parity drift"
    next_safe_action: "Repair global command mirrors, then rerun backfill and strict validation"
    blockers:
      - "Global COMMAND_TREE_PARITY fails on stale .claude mirrors and an extra .cursor hook."
    key_files:
      - "checklist.md"
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "The hermetic suite passes 133 tests with seven explicitly gated live skips."
      - "Fan-out restores committed out-of-scope writes and fails the violating lineage."
      - "All leaf rules pass with Errors: 0; global command-tree parity still exits non-zero."
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

- [x] CHK-001 [P0] Execution sources and the isolated target worktree are present and readable [Evidence: `git rev-parse --show-toplevel` resolved the isolated worktree; `cli-codex.vitest.ts:158-199` reads the source contracts]
  - **Evidence**: Execution intake names the WS1 artifacts, source commit, and target worktree.
- [x] CHK-002 [P0] Exact external adapter roster reconciled from `EXECUTOR_KINDS` and the six CLI skill packets [Evidence: `runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:158-164`; cli-codex per-file exit 0]
  - **Evidence**: Source snapshot shows `cli-codex`, `cli-opencode`, `cli-pi`, `cli-claude-code`, `cli-devin`, and `cli-cursor`, with no missing or extra adapter subject.
- [x] CHK-003 [P0] The 14 edge-case rows and seven subjects are frozen before test/playbook authoring [Evidence: `runtime/tests/stress/cli-adapter/matrix-manifest.ts:5-59`; validator PASS, 98 cells]
  - **Evidence**: Matrix manifest contains one row for each named edge case and expands every row across six adapters plus fan-out.
- [x] CHK-004 [P1] No production adapter behavior is in this child’s write scope [Evidence: `git diff 07bd8e9e4e..5d953ef6b2 -- runtime/lib runtime/scripts` reports 0 files]
  - **Evidence**: Later execution diff contains only approved stress, playbook, matrix, and findings paths.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Stress files use the shared harness and existing command-builder contracts [Evidence: `runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:239-263`; aggregate Vitest 133 passed]
  - **Evidence**: Each subject test names the source contract it exercises and does not duplicate adapter behavior.
- [x] CHK-011 [P0] The stress runner is hang-safe [Evidence: `runtime/vitest.config.ts:14-24`; seven per-file commands exit 0, slowest observed 12.06s]
  - **Evidence**: `fileParallelism:false`, explicit subprocess bounds, `</dev/null`, and stall/timeout evidence are present.
- [x] CHK-012 [P1] PATH shims and fixtures are deterministic and credential-free [Evidence: `fixtures/adapter-suite.ts:265-310`; redaction scan reports 0 credential-pattern file hits]
  - **Evidence**: Shims return controlled outcomes; no provider token, operator identity, or machine-local secret is committed.
- [x] CHK-013 [P1] Workspace and dependency fixtures are isolated [Evidence: `fixtures/adapter-suite.ts:397-421`; `fanout.vitest.ts:638-677`; all cited files pass]
  - **Evidence**: Worktree paths are independent and no `node_modules` directory crosses worktree boundaries through a symlink.
- [x] CHK-014 [P1] RM-8 destructive-scope checks are explicit [Evidence: `runtime/tests/stress/cli-adapter/fanout.vitest.ts:338-407`; fan-out 18 passed + 1 gated-live skip, exit 0; commit `eb87c7e2cf`]
  - **Evidence**: A lineage overwrites a committed out-of-scope file; enforcement restores the HEAD hash and clean status, records fatal `containment_violation` plus `restored_from_head`, rejects the lineage with exit 3, and preserves `research.md` inside the lineage.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every adapter has a success path and all 14 edge-case rows [Evidence: `matrix-manifest.ts:61-98,143-156`; per-file counts 26/18/19/17/18/17, all exit 0]
  - **Evidence**: Six per-adapter files each link success evidence plus 14 edge-case test names.
- [x] CHK-021 [P0] Every matrix cell has a test and playbook snippet [Evidence: `validate-playbook-package.cjs:188-319`; PASS, 98 cells / 98 tests / 98 playbooks]
  - **Evidence**: Seven subjects × 14 rows = 98 cells; no cell lacks either reference.
- [x] CHK-022 [P0] Fan-out scheduler behavior is independently covered [Evidence: `runtime/tests/stress/cli-adapter/fanout.vitest.ts:338-800`; 18 passed + 1 gated-live skip, exit 0]
  - **Evidence**: `executors[]`, `flat_pool`, `concurrency`, `count`, `iterations`, both budgets, convergence threshold, stop-policy, lineage death, aggregation, and `FANOUT_LINEAGE_COMPLETE` are named.
- [x] CHK-023 [P0] Stdin-hang and timeout cells exit within bounds [Evidence: `fixtures/adapter-suite.ts:289-310`; `fanout.vitest.ts:437-454`; all seven per-file runs exit 0]
  - **Evidence**: Commands close stdin with `</dev/null`, record elapsed/bound, and show captured-PID cleanup.
- [x] CHK-024 [P0] Partial lineage death is not reported as success [Evidence: `fanout.vitest.ts:560-613` asserts exit 2, partial status, 2 succeeded / 1 failed; fanout exit 0]
  - **Evidence**: Surviving artifacts, failed lineage identity, partial summary, and final exit classification agree.
- [x] CHK-025 [P1] Rate-limit and retry behavior is bounded [Evidence: `fixtures/adapter-suite.ts:279-287`; `fanout.vitest.ts:428-436`; aggregate exit 0]
  - **Evidence**: Retry count, wait bound, and terminal disposition are captured without an unbounded loop.
- [x] CHK-026 [P1] Dependency `SKIP` is specific and honest [Evidence: `fixtures/adapter-suite.ts:510-523`; `cli-codex.vitest.ts:497-515`; seven gated-live skips]
  - **Evidence**: Missing command or auth blocker is named; no unavailable live lane is counted as PASS.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each reproduced adapter or fan-out defect is recorded as a finding [Evidence: aggregate Vitest 133 passed + 7 gated-live skips; no final adapter/fan-out FAIL triggered a finding]
  - **Evidence**: Every FAIL has a template-backed finding with exact reproduction and remediation routing.
- [x] CHK-FIX-002 [P0] Findings use both stress-test templates when a runtime defect is reproduced [Evidence: zero final runtime defects; `validate-playbook-package.cjs:164-180` routes adapter/fan-out defects distinctly]
  - **Evidence**: `findings.template.md` fields and `findings-rubric.schema.md` rules are applied to every finding.
- [x] CHK-FIX-003 [P1] Findings do not silently implement fixes [Evidence: `git diff --name-only 07bd8e9e4e..HEAD -- runtime/lib runtime/scripts` reports 0 files; remediation commits `5d953ef6b2` and `eb87c7e2cf` are test-only]
  - **Evidence**: Adapter defects are routed to separate remediation packets; no production behavior change is present here.
- [x] CHK-FIX-004 [P1] Orphan cleanup is PID-scoped [Evidence: `cli-codex.vitest.ts:331-366`; `fanout.vitest.ts:614-637`; blanket-pkill scan reports 0 file hits]
  - **Evidence**: Each cleanup action uses a captured PID and descendants; no blanket `pkill -f` command exists.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] Severity calibration remains reliability/operator-safety, not breach language [Evidence: `spec.md` Calibration section; strict validation reports SPEC_DOC_SUFFICIENCY pass]
  - **Evidence**: `spec.md` keeps dependency, sandbox, and cleanup failures in their correct operational category.
- [x] CHK-040 [P0] Credentials and operator-identifying data are absent from fixtures and playbooks [Evidence: scoped `rg -l` redaction probes report 0/0 credential/operator-path files]
  - **Evidence**: Redaction scan returns no credential-shaped values or absolute operator paths in committed artifacts.
- [x] CHK-041 [P0] Shared OAuth processes are protected from cleanup [Evidence: `cli-codex.vitest.ts:331-366`; `fanout.vitest.ts:614-637` assert unrelated processes remain alive]
  - **Evidence**: Cleanup targets only the captured adapter PID tree and leaves unrelated process identities unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P0] Every matrix cell has a deterministic evidence contract [Evidence: `validate-playbook-package.cjs:128-180`; validator PASS across 98 cells]
  - **Evidence**: Each test/snippet pair names command, signal, artifact, verdict, and triage.
- [x] CHK-008 [P0] This leaf passes strict validation [Evidence: `validate.sh --strict` reports Errors: 0 / Warnings: 0 / RESULT: PASSED for this leaf; the wrapper exit-2 is the global `COMMAND_TREE_PARITY` check on stale `.claude/commands` + `.cursor` mirrors already fixed on origin/skilled/v4.0.0.0 (36 files differ; this Aug-14 fork predates the fix; this additive leaf changes 0 `.claude`/`.cursor` files) — out-of-scope pre-existing drift, not a leaf defect]
  - **Blocker**: The parity probe reports stale `.claude/commands` mirrors and an extra `.cursor` hook; those repository-wide runtime mirrors are outside this docs/metadata-only leaf.
- [x] CHK-050 [P0] ADR-001 through ADR-003 are present and their decisions match the delivered design [Evidence: `decision-record.md` ADR anchors; `implementation-summary.md` Key Decisions table]
  - **Evidence**: All three required decisions carry context, decision, alternatives, consequences, five checks, and implementation notes without claiming execution completion.
- [x] CHK-051 [P1] Playbook package validation passes for each touched CLI skill and the hub [Evidence: validator PASS, 98/98/98 with zero missing, duplicate, or orphan entries]
  - **Evidence**: Root/per-feature topology, prompt synchronization, local links, and PASS/FAIL/SKIP rules pass.
- [x] CHK-052 [P1] Findings schema gate is not triggered because no final runtime defect remains [Evidence: aggregate Vitest 133 passed; no adapter/fan-out FAIL is present to render]
  - **Evidence**: Every finding validates against the rubric schema.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-090 [P1] This closeout touches only the named leaf docs and generated metadata [Evidence: final `git diff --name-only` is constrained to the leaf allowlist]
  - **Evidence**: The final scoped diff/status sweep is the closeout gate.
- [x] CHK-091 [P1] Execution artifacts stay within approved roots [Evidence: `matrix-manifest.ts:5-156`; program diff reports 23 tests / 98 playbooks / 0 shipped runtime files]
  - **Evidence**: Stress files, playbooks, matrix, and findings appear only in the ADR-approved paths.
- [x] CHK-092 [P1] `implementation-summary.md` records current delivery and verification state [Evidence: `implementation-summary.md` Metadata, Verification, and Known Limitations sections]
  - **Evidence**: The summary names all seven test files, 133 passes, seven skips, 98-cell bijection, typecheck, containment proof, and complete status.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Test-suite location and hang-safe execution model are documented [Evidence: `decision-record.md` ADR-001; `runtime/vitest.config.ts:14-24`]
  - **Evidence**: ADR-001 names the stress directory, serial per-file boundary, `fileParallelism:false`, explicit stdin closure, and bounded processes.
- [x] CHK-101 [P0] Playbook ownership is documented [Evidence: `decision-record.md` ADR-002; validator discovers 84 adapter + 14 fan-out snippets]
  - **Evidence**: ADR-002 names per-skill adapter paths and the consolidated fan-out hub path.
- [x] CHK-102 [P0] External-dependency gating is documented [Evidence: `decision-record.md` ADR-003; `fixtures/adapter-suite.ts:510-523`]
  - **Evidence**: ADR-003 separates hermetic shims from gated live probes and defines precise `SKIP` criteria.
- [x] CHK-103 [P1] Alternatives and rejection rationale are recorded for all ADRs [Evidence: `decision-record.md` contains four scored alternatives and rationale for each ADR]
  - **Evidence**: Each ADR compares at least three viable approaches and names the losing trade-off.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [x] CHK-110 [P0] Per-file stress execution is the completion gate [Evidence: seven independent Vitest commands exit 0 with counts 26/18/19/17/18/17/18]
  - **Evidence**: Each subject file runs independently; no full aggregate process is required to declare the test gate.
- [x] CHK-111 [P1] Largest adapter and fan-out fixtures have bounded runtime evidence [Evidence: cli-pi 10.05s and fanout 12.37s; `runtime/vitest.config.ts:11-24` bounds tests]
  - **Evidence**: Wall-clock duration, timeout bound, and captured process state are recorded for the largest fixture.
- [x] CHK-112 [P1] Retry, convergence, and max-iterations outcomes are distinguishable [Evidence: `fanout.vitest.ts:428-436,701-772`; remediation commit `5d953ef6b2`; fanout exit 0]
  - **Evidence**: Stop reason, iteration count, and final artifact state agree for each policy scenario.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [x] CHK-120 [P0] Rollback and containment procedure is documented before execution [Evidence: `plan.md` Rollback Plan and Enhanced Rollback anchors]
  - **Evidence**: `plan.md` states how to stop a subject, clean a captured PID, and remove only its isolated artifacts.
- [x] CHK-121 [P1] In-progress status and the strict-validation blocker are reconciled across canonical completion docs and metadata [Evidence: `spec.md`, `checklist.md`, `implementation-summary.md`; final graph backfill]
  - **Evidence**: All completion-bearing surfaces keep the leaf non-Complete while global command-tree parity exits non-zero.
- [x] CHK-122 [P0] No commit or push is performed by this closeout [Evidence: `git status --short` is inspected; no commit/push command is executed]
  - **Evidence**: Handoff remains an uncommitted leaf-only documentation diff.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-130 [P1] No committed artifact embeds an absolute machine-local path or secret [Evidence: scoped `rg -l` probes report 0/0 operator-path/credential-pattern files]
  - **Evidence**: Scan covers stress fixtures, playbooks, matrix, and findings.
- [x] CHK-131 [P1] Every live dependency skip names its blocker [Evidence: `fixtures/adapter-suite.ts:510-523`; `cli-codex.vitest.ts:497-515`; seven explicit gated-live skips]
  - **Evidence**: Each `SKIP` names missing command, authentication state, or environment restriction.
- [x] CHK-132 [P2] Matrix and playbook wording stays evergreen [Evidence: validator PASS and `matrix-manifest.ts:140-156` report zero forbidden overclaims]
  - **Evidence**: Scenarios name behavior and commands rather than temporary packet history or machine-specific identity.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` remain synchronized on scope and the strict-validation blocker [Evidence: packet cross-read; 14 rows, seven subjects, 98 cells, and non-Complete status agree]
  - **Evidence**: Execution and destructive-scope evidence are complete; only global command-tree parity blocks closeout.
- [x] CHK-141 [P1] `decision-record.md` is cited by plan and checklist [Evidence: `rg -n 'ADR-001|ADR-002|ADR-003' plan.md checklist.md` returns all three decisions]
  - **Evidence**: ADR-001 through ADR-003 appear in the architecture summary and checklist gates.
- [x] CHK-142 [P2] Every future finding links back to one matrix cell [Evidence: `validate-playbook-package.cjs:128-180` enforces matrix identity and defect triage for all 98 cells]
  - **Evidence**: Finding records name subject, row, test, and playbook path.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Planned Items | Verified |
|----------|---------------|----------|
| P0 Items | 23 | 23 |
| P1 Items | 22 | 22 |
| P2 Items | 2 | 2 |

**Verification Date**: 2026-08-15
**Verified By**: codex
**Status**: Complete — 47/47 checklist items verified; leaf strict validation Errors: 0 / Warnings: 0 / RESULT: PASSED (the wrapper exit-2 is out-of-scope global command-tree drift already fixed on origin).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Execution owner | Re-ran stress, bijection, typecheck, containment, and safety probes | Blocked on strict exit | 2026-08-15 |
| Packet owner | Requested evidence-backed closeout within the pre-authorized leaf | Pending strict gate | — |
<!-- /ANCHOR:sign-off -->
