---
title: "Tasks: Acceptance Criteria Template as Packet Closure Gate"
description: "Task breakdown for the acceptance-criteria template, contract wiring, closure rule and reference sweep."
trigger_phrases:
  - "acceptance criteria tasks"
  - "ac closure task list"
  - "closure gate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built the acceptance-criteria template, contract entry and closure gate"
    next_safe_action: "Execute the reference sweep and close the remaining criteria"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh"
    session_dedup:
      fingerprint: "sha256:d232952f27c37a1c5375f5aa3d0134e4273b44057b3df1fbdec675aeaf28cc6e"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Tasks: Acceptance Criteria Template as Packet Closure Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the Level contract and confirm how required documents resolve (`.opencode/skills/system-spec-kit/scripts/utils/template-structure.js:227`)
- [x] T002 Confirm the existing grandfathering pattern to reuse (`.opencode/skills/system-spec-kit/scripts/rules/check-canonical-save-helper.cjs:12`)
- [x] T003 [P] Confirm the gate syntax the renderer accepts (`.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:33`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the gated template (`.opencode/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:1`)
- [x] T005 Wire the document into the Level contract for 2/3/3+ (`.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`)
- [x] T006 Build the closure gate with cutoff and waiver verification (`.opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh:108`)
- [x] T007 Register the rule and repoint the coverage advisory (`.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`, `scripts/rules/check-ac-coverage.sh:96`)
- [x] T008 Gate the acceptance-criteria column out of spec.md above Level 1 (`.opencode/skills/system-spec-kit/templates/core/spec.md.tmpl:134`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Render the template at every level and confirm Level 1 emits nothing - L1 = 0 lines, L2/L3/L3+ = 53 lines (`templates/addons/acceptance-criteria.md.tmpl:1`)
- [x] T010 Run the eight-case closure fixture, including both negative controls - all eight behave as specified (`scripts/rules/check-ac-closure.sh:108`)
- [x] T011 Confirm the rule reaches the report end to end (`validate.sh --json` shows `AC_CLOSURE` with 5/8 settled)
- [x] T012 Update the reference surfaces, both READMEs included (`README.md:169`, `.opencode/skills/system-spec-kit/README.md:222`)
- [ ] T013 Re-run the recursive strict validation over the 033 tree and record the result
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (no task entered the blocked state)
- [x] Manual verification passed (eight-case fixture plus per-level renders)
<!-- /ANCHOR:completion -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the target file before editing it; never edit unread files.
- [ ] Confirm the task is in scope for this phase; `spec.md` section 3 is frozen.
- [ ] Name the verification that will prove the task before changing anything.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Work the tasks in listed order; T004 through T008 depend on T001 through T003 having established the contract shape. |
| TASK-SCOPE | Touch only the files listed in `spec.md` section 3. Packet 036 and adjacent packets are out of bounds. |
| TASK-PROOF | A task is complete only when its evidence cites a command, file:line or artifact that was actually observed. |
| TASK-GATE | No completion claim without `validate.sh <folder> --strict` reaching exit 0. |

### Status Reporting

Report each task as `T### <state> - <evidence>` where state is one of `done`, `open` or `blocked`. A `done` state without evidence is not a valid report.

### Blocked Task Protocol

Mark a task `[B]` and stop when the target file is missing, an edit does not match, a check fails twice with no new evidence, or the task would require editing outside the frozen scope. State the blocker and the decision needed rather than working around it.

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Decisions**: See `decision-record.md`
- **Operator goal**: See `../goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 5/11 |
| P1 Items | 12 | 6/12 |
| P2 Items | 6 | 0/6 |

**Verification Date**: 2026-08-29
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


