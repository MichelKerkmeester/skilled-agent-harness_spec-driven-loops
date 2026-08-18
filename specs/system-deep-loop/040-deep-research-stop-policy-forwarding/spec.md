---
title: "Feature Specification: Forward --stop-policy on the deep-research fan-out path"
description: "Wire stop_policy through the deep-research command so forced-depth (max-iterations) reaches the fan-out runtime, and validate it for research loops."
trigger_phrases:
  - "deep-research stop-policy forwarding"
  - "forced iterations deep research"
  - "max-iterations research fanout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/040-deep-research-stop-policy-forwarding"
    last_updated_at: "2026-08-17T19:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired stop_policy through both YAMLs; validator now covers research forced-depth."
    next_safe_action: "Run validation and the runtime tests."
    blockers: []
    key_files:
      - "specs/system-deep-loop/040-deep-research-stop-policy-forwarding/spec.md"
      - ".opencode/commands/deep/assets/deep-research-auto.yaml"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-040-stop-policy-forwarding"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Forward --stop-policy on the deep-research fan-out path

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/system-deep-loop` |
| **Predecessor** | `039-node-suite-remediation` |
| **Successor** | N/A |
| **Handoff Criteria** | `/deep:research` forwards `--stop-policy` into `fanout-run.cjs`; `stop_policy` is a resolved+required setup binding; the max-iterations completeness validator applies to research loops; runtime tests green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/deep:research` documents a `--stop-policy=max-iterations` flag for forced-depth runs, but the flag never reached the runtime. The auto and confirm YAMLs invoked `fanout-run.cjs` without `--stop-policy`, and the presentation layer never resolved `stop_policy` into a bound variable, so a cli-pi fan-out research run could not be guaranteed to run all N iterations — convergence could stop it early. Separately, the runtime's forced-depth completeness validator (`findMaxIterationsPolicyViolation`) was gated to `loopType === 'review'`, so even a forwarded policy would not be fail-closed validated for research.

### Purpose
Thread `stop_policy` end to end — presentation resolution → YAML required binding → the `fanout-run.cjs` invocation — and generalize the completeness validator to research, so `--stop-policy=max-iterations` produces a real forced-depth guarantee on the research fan-out path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `stop_policy` resolution row to `deep-research-presentation.txt` (flag `--stop-policy`, default `convergence`).
- Declare `stop_policy` in both YAMLs' `user_inputs`, require it in `required_values_present`, and forward `--stop-policy {stop_policy}` in the `fanout-run.cjs` invocation.
- Generalize `findMaxIterationsPolicyViolation` in `fanout-run.cjs` from review-only to research + review, with loop-type-aware state-file naming.
- Add runtime test cases for the research forced-depth validation.

### Out of Scope
- `--convergence-mode` forwarding — `fanout-run.cjs` does not consume it (the flag would be dead); the forced-depth guarantee comes from `--stop-policy` alone.
- The deep-review path (already worked); the single-executor path (cli-pi is fan-out-only).
- Any change to convergence math or the lineage prompt's existing stop clause.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep-research-presentation.txt` | Update | `stop_policy` resolution row |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Update | declare + require + forward `stop_policy` |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | Update | declare + require + forward `stop_policy` |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Update | generalize `findMaxIterationsPolicyViolation` to research |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Update | research forced-depth validator cases |

### Verification evidence
- `git show HEAD` confirms the fail-first state: the fanout gate was `loopType !== 'review'` and the auto YAML had zero `stop-policy` occurrences.
- After the fix: both YAMLs forward `--stop-policy {stop_policy}`; the gate is `loopType !== 'review' && loopType !== 'research'`.
- `node --check fanout-run.cjs` OK; `fanout-run.vitest.ts` green (109 tests) including 3 new research cases.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Command forwards the policy | Both YAMLs pass `--stop-policy {stop_policy}` to `fanout-run.cjs` |
| REQ-002 | stop_policy is resolved + required | Present in the presentation table and both `required_values_present` lists |
| REQ-003 | Research forced-depth validated | `findMaxIterationsPolicyViolation` flags an incomplete/converged research loop under `max-iterations` |
| REQ-004 | No regression | `fanout-run.vitest.ts` green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Error strings are loop-type-aware | Validator names `deep-research-state.jsonl` for research, `deep-review-state.jsonl` for review |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Both YAMLs forward the policy. Evidence: `deep-research-auto.yaml` + `deep-research-confirm.yaml` each grep `stop-policy {stop_policy}` = 1.
- [x] stop_policy resolved + required. Evidence: `deep-research-presentation.txt` row; both `required_values_present` include `stop_policy`.
- [x] Validator generalized to research. Evidence: `fanout-run.cjs` gate `loopType !== 'review' && loopType !== 'research'`.
- [x] Research forced-depth tests pass. Evidence: `fanout-run.vitest.ts` 9/9 in the max-iterations block.
- [x] No regression. Evidence: `fanout-run.vitest.ts` 109 tests pass.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Requiring `stop_policy` could fail preflight | Existing runs break | Added a default (`convergence`) in the presentation table, so it always resolves |
| Risk | Validator now fails research runs that stop early | A convergent research run under max-iterations is flagged | Intended: max-iterations means forced depth; convergence policy leaves it unvalidated |
| Dependency | `lineageStateLogName` resolves research state | Validator reads wrong file | Confirmed maps `research → deep-research-state.jsonl` |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Forward `--convergence-mode` too? **A**: No — `fanout-run.cjs` does not parse it; forwarding a dead flag would mislead. `--stop-policy` alone is the forced-depth lever.
- **Q**: Does the caller already load research state? **A**: Yes — `readLineageStateRecords(loopType, …)` resolves the state file per loop type, so only the validator gate and error strings needed changing.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
