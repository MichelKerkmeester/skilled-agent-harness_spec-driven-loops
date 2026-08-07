---
title: "Feature Specification: Deep Alignment Multi-Executor [template:level-2/spec.md]"
description: "Extend the autonomous deep-alignment command with a contained cli-opencode leaf and an option that disables early convergence."
trigger_phrases:
  - "deep alignment multi executor"
  - "alignment cli opencode"
  - "alignment convergence mode off"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-deep-loop/038-deep-alignment-multi-executor"
    last_updated_at: "2026-07-23T04:55:05Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Implemented executor and convergence routing"
    next_safe_action: "Restore missing verification inputs"
    blockers:
      - "Runtime package.json is absent"
      - "Broad alignment fixtures are incomplete"
    key_files:
      - ".opencode/commands/deep/alignment.md"
      - ".opencode/commands/deep/assets/deep-alignment-auto.yaml"
      - ".opencode/commands/deep/assets/deep-alignment-presentation.txt"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs"
    session_dedup:
      fingerprint: "sha256:ca72e5a65953f4522089a02676704735026bbd3ad1d44519f814b512e8adfc60"
      session_id: "038-deep-alignment-multi-executor"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep Alignment Multi-Executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Review |
| **Created** | 2026-07-23 |
| **Branch** | `sk-code/0101-system-deep-loop-deep-alignment-multi-executor` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`/deep:alignment` has a working cli-codex leaf but no cli-opencode branch, even though the shared executor runtime already supports cli-opencode. Its presentation contract also claims that alignment never resolves an external executor, which can discard valid cli-codex setup. The convergence evaluator has no way to require the full configured iteration budget.

### Purpose

Allow autonomous alignment runs to select a contained cli-opencode leaf and to disable early convergence without changing shared fanout or executor primitives.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a single-executor cli-opencode branch to autonomous deep alignment.
- Add `--convergence-mode=default|off` from command setup through convergence evaluation.
- Reconcile the presentation contract with native, cli-codex, and cli-opencode behavior.
- Add focused regression coverage and Level 2 packet documentation.

### Out of Scope

- Shared fanout and executor runtime changes - existing primitives already support cli-opencode.
- `deep-alignment-confirm.yaml` changes - interactive alignment remains native-only.
- Deep-review and deep-research changes - they are reference and sibling workflows only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/alignment.md` | Modify | Document executor and convergence flags |
| `.opencode/commands/deep/assets/deep-alignment-auto.yaml` | Modify | Add cli-opencode dispatch and convergence-mode threading |
| `.opencode/commands/deep/assets/deep-alignment-presentation.txt` | Modify | Bind executor and convergence setup |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | Modify | Disable early convergence when requested |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` | Modify | Prove forced-iteration behavior |
| `.opencode/specs/system-deep-loop/038-deep-alignment-multi-executor/*.md` | Create | Record scope, plan, tasks, checks, and outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Autonomous alignment resolves `cli-opencode` as a single leaf | YAML contains an audited branch with route proof, worktree isolation, prompt containment, `--pure`, and `--dangerously-skip-permissions` |
| REQ-002 | Convergence mode `off` prevents early `CONVERGED` decisions | Stable full-coverage fixture returns `CONTINUE` before N and `STOP_MAX_ITERATIONS` at N |
| REQ-003 | Setup binds executor and convergence fields | Presentation schema, default table, parsing tree, and YAML placeholders agree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | cli-codex setup no longer falls back through contradictory presentation text | No remaining claim says alignment never accepts external executors |
| REQ-005 | Interactive mode stays native-only | Presentation and command reference reject external executors outside `:auto` |
| REQ-006 | Service tier stays cli-codex-only | cli-opencode docs and dispatch omit service-tier |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The focused state-machine regression passes with forced-iteration assertions.
- **SC-002**: The cli-opencode branch mirrors deep-review containment and audited dispatch behavior.
- **SC-003**: Strict packet validation reports only orchestrator-owned generated metadata integrity.
- **SC-004**: Requested runtime gates are reported with real output, including baseline blockers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared executor audit runtime | External leaf needs audited receipts and environment guards | Reuse `runAuditedExecutorCommand` without modifying it |
| Risk | Unrestricted OpenCode execution | A leaf could write outside alignment state | Require isolated worktree, clean primary, artifact-confined dirt, and prompt markers |
| Risk | Setup contract drift | Flags could silently fall back to native | Keep schema, defaults, parser, docs, and YAML branch aligned |
| Risk | Incomplete repository baseline | Broad verification cannot turn green in this scope | Report baseline and retain focused passing evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `convergence-mode=off` adds no extra subprocess per iteration.
- **NFR-P02**: Executor timeout remains bounded by the existing per-leaf timeout.

### Security

- **NFR-S01**: cli-opencode dispatch fails closed unless worktree and prompt-containment checks pass.
- **NFR-S02**: No new secret or environment forwarding path is introduced.

### Reliability

- **NFR-R01**: Default convergence behavior remains unchanged.
- **NFR-R02**: External executor selection never silently falls back to native.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty model: cli-opencode fails before dispatch.
- Invalid convergence mode: the evaluator returns an input-validation error.
- Zero applicable lanes: the existing `NOTHING_TO_CONVERGE` exit remains available.

### Error Scenarios

- Missing OpenCode binary: audited dispatch exits non-zero.
- Dirty primary worktree: cli-opencode dispatch fails closed.
- Changes outside the alignment artifact directory: cli-opencode dispatch fails closed.

### State Transitions

- Stable before max under `off`: continue.
- Iteration count reaches max under `off`: stop with `STOP_MAX_ITERATIONS`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five framework files plus packet docs |
| Risk | 13/25 | External unrestricted executor guarded by worktree checks |
| Research | 10/20 | Mirror existing deep-review branch and trace setup ownership |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
- None.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
