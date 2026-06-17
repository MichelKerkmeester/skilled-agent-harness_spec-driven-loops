---
title: "Implementation Plan: validation and docs"
description: "Plan record for the spec-150 live verification and 10-seat deep review: live-test the Open Design run direction, generate a real design via the corrected flow, run 5 claude2-opus plus 5 gpt-5.5-fast review seats, and remediate all P0/P1 and the P2 backlog. Already carried out, with evidence in research/ and review/review-report.md."
trigger_phrases:
  - "open design validation plan"
  - "spec-150 deep review plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/004-validation-and-docs"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the executed live test and 10-seat review approach"
    next_safe_action: "Operator runs the optional formal od mcp install opencode live-wire"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:7a1065353b13e8f92b53d31d7ace35f42db21ee8d9aa1a82d8c29087cb58eea3"
      session_id: "session-150-004-validation-and-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: validation and docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Live app verification plus an adversarial read-only review fleet over the shipped skills |
| **Framework** | Spec Kit deep-review fan-out, narrow-slice seats, at-location round-2 verification |
| **Storage** | Packet-local `../review/` (report, seats) and `../001-.../research/` (ground-truth) |
| **Testing** | `package_skill.py --check`, `validate.sh --strict --recursive`, document validation |

### Overview
Close the two open gaps in the spec-150 work. First, exercise the Open Design run direction against the running app to learn what `od artifacts create` does and the real generation-flow shape, and generate one real design as proof. Second, run a 10-seat adversarial deep review (5 `claude2-opus` judgment seats plus 5 `gpt-5.5-fast` mechanical seats, narrow slices to dodge the gpt-5.5 timeout) over both skills and the research packet, then remediate every finding. This plan records the approach that was carried out, and the live findings drove the phase 007 correction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The shipped skills (phases 002, 003) exist to verify and review
- [x] The phase 001 research ground-truth is available to hold the review against
- [x] The running Open Design app is available for the live test

### Definition of Done
- [x] The live test established the real generation flow and what `od artifacts create` does
- [x] A real design rendered via the corrected flow
- [x] All P0/P1 and the P2 backlog are remediated and re-validated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Live verification plus adversarial review. The live test grounds the run direction in observed reality, and the review fleet is narrow-slice and read-only, with each finding re-checked at-location before remediation.

### Key Components
- **The live test**: a real generation run against the app that exercised `od run start`, the discovery question-form, `od ui respond`, and the build, plus an `od artifacts create` call to confirm it only adds a file.
- **The review fleet**: 10 seats, 2 executors, three concurrency-capped waves. Seats 01-05 `claude2-opus` (judgment-heavy slices) and seats 06-10 `gpt-5.5-fast` (mechanical slices).
- **The remediation**: all P0/P1 fixed and re-validated, the P2 backlog fixed, three by-convention items WONTFIX with rationale.

### Data Flow
Running app to the live findings. The shipped skills plus the research ground-truth to the seat verdicts to the remediation to re-validation, recorded in `../review/review-report.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The live test exercised the running Open Design app read and run verbs only (no diff to the app). The remediation wrote to the two skills and the review artifacts. This packet only adds its own control docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/Applications/Open Design.app` | Live verification target | unchanged (read and run only) | one design generated, no destructive verb |
| `.opencode/skills/mcp-open-design/` | Reviewed skill | P0/P1 reference, catalog, playbook, link fixes | package check PASS, paths resolve |
| `.opencode/skills/sk-interface-design/` | Reviewed skill | P0/P1 path, licensing-wording, graph-edge fixes | package check PASS, grep clean |
| `../review/review-report.md` | Review record | Authored with verdicts, fixes, backlog | present |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the shipped skills and the research ground-truth are in place
- [x] Confirm the running Open Design app is available for the live test
- [x] Scope the 10 narrow review slices across the two skills and the packet

### Phase 2: Core Implementation
- [x] Run the live generation test: `od run start`, the discovery form, `od ui respond`, build, plus an `od artifacts create` check
- [x] Run the three concurrency-capped review waves (5 claude2-opus plus 5 gpt-5.5-fast seats)
- [x] Remediate all P0/P1 at-location and fix the P2 backlog, recording WONTFIX rationale

### Phase 3: Verification
- [x] `package_skill.py --check` PASS for both skills
- [x] `validate.sh --strict --recursive` on 150 green and document validation clean
- [x] Confirm every fixed path resolves against its target on disk
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live generation | The real run direction against the app | `od run start`, `od ui respond`, `od artifacts create` |
| Adversarial review | 10 narrow slices over the skills and packet | claude2-opus and gpt-5.5-fast read-only seats |
| Round-2 verification | Each finding re-checked before fixing | at-location re-read against the cited file |
| Re-validation | The skills and the packet after remediation | `package_skill.py --check`, `validate.sh --strict --recursive`, document validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The running Open Design app | External | Green | No live verification of the run direction |
| The shipped skills (phases 002, 003) | Internal | Green | Nothing to verify or review |
| The phase 001 research ground-truth | Internal | Green | No baseline to hold the review against |
| cli-claude-code and cli-opencode seats | External | Green | Lose the two review executors |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The live findings or the review remediation are found wrong.
- **Procedure**: The live test had one side effect, a generated design in the local app, which is discardable in-app and touches no repo state. The remediation edits are revertable per skill. The review artifacts can be discarded, and nothing outside the skills and the review folder was changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 002, 003 shipped | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm inputs and scope the slices |
| Implementation | Medium | One live test plus three review waves plus remediation |
| Verification | Low | Package checks, recursive validate, path resolution |
| **Total** | Medium | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations, so no backup needed (verified) live test plus doc remediation
- [x] No feature flag involved (verified) skill markdown has no runtime gate
- [x] The live test ran read and run verbs only (verified) no destructive verb invoked

### Rollback Procedure
1. Discard the generated design in the local app if desired.
2. Revert the per-skill remediation edits.
3. Discard the review artifacts under `../review/`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the only side effect is one in-app generated design
<!-- /ANCHOR:enhanced-rollback -->
