---
title: "Verification Checklist: risk-first repair of inaccurate playbook scenarios"
description: "Nineteen shipped scenarios are indexed, counted, and in several cases recorded PASS while their exact command sequence would fail today or would instruct the operator to violate a hard repository rule — an unpermissioned remote push, a worktree created outside the clone-wide allocator, a dispatch flag the target CLI rejects. This phase repairs them in four risk tiers, executing each repaired scenario once for real, and escalates the one finding that is a live safety-gate defect rather than a document error."
trigger_phrases:
  - "scenario accuracy repair risk first verification checklist"
  - "playbook scenario coverage verification checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/002-scenario-accuracy-repair-risk-first"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Risk-First Repair of Inaccurate Playbook Scenarios

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Planned phase — all items open. In this phase specifically, an `[x]` requires a **run artifact**, not a reading.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Disposable clone and disposable remote provisioned; `git remote -v` verified as **not** the
      real origin, and the verification recorded.
- [ ] CHK-002 [P0] Every Tier-1 and Tier-2 scenario reproduced at HEAD with its actual failure captured.
- [ ] CHK-003 [P0] The Gate-3 parser reproduced against a bare `D` answer, with the actual parse result captured.
- [ ] CHK-004 [P0] Child `001` closed: verdict enum migrated, contract checker and cited-path resolver available.
- [ ] CHK-005 [P0] Any finding whose symptom did NOT reproduce is recorded as refuted and NOT repaired.
- [ ] CHK-006 [P1] The remote-branch policy and owner-first naming contract were re-read at HEAD, not recalled.
- [ ] CHK-007 [P1] The absent runtime advisory hook re-confirmed absent at HEAD.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every repaired command sequence is the sequence that actually works — proven by execution.
- [ ] CHK-011 [P0] No repaired scenario instructs an action the repository forbids.
- [ ] CHK-012 [P1] Tier-4 repairs cite the live source read at repair time; no remembered values re-encoded.
- [ ] CHK-013 [P1] Command snippets inside scenarios carry the durable WHY only — no packet numbers or finding ids.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every one of the 19 repaired scenarios has a real run artifact under
      `<skill>/benchmark/reports/<dated-run>/`.
- [ ] CHK-021 [P0] The push scenario asserts an unapproved retry is refused, with the observable signal named.
- [ ] CHK-022 [P0] The worktree scenario asserts a direct `git branch` / `git checkout -b` is refused.
- [ ] CHK-023 [P0] The codex hook `--check` path is exercised and asserted to mutate nothing.
- [ ] CHK-024 [P0] The context-save default case is asserted to write nothing; the explicit-apply case is separate.
- [ ] CHK-025 [P1] Any scenario that could not execute carries `SKIP` with a concrete named blocker — never
      `PARTIAL`, never `UNAUTOMATABLE`.
- [ ] CHK-026 [P1] Post-run state of the disposable clone matches pre-run for every Tier-1/2 scenario.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 19 findings has a finding class recorded (instance-only, class-of-bug,
      cross-consumer, algorithmic, matrix/evidence, or test-isolation).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed before any Tier-1/2 repair is called instance-only:
      `rg -n 'git push|worktree add|checkout -b|update-ref' .opencode/skills/*/manual-testing-playbook`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for every cited path changed by a repair.
- [ ] CHK-FIX-004 [P0] The Gate-3 finding's algorithmic invariant is stated — displayed and parsed semantics agree
      for every letter A-E — with the adversarial cases enumerated in the escalation.
- [ ] CHK-FIX-005 [P1] The {4 tiers} × {reproduced, repaired, executed, filed} matrix is complete: every scenario
      has all four rows.
- [ ] CHK-FIX-006 [P1] At least one Tier-1/2 scenario was run from a non-default working directory to prove the
      scenario states its cwd requirements.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a SHA, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:amendment-gate -->
## AMENDMENT-DECISION GATE — `RD-003-02`

This gate blocks completion of the phase independently of every other item.

- [ ] CHK-AMD-001 [P0] The parser reproduction exists and is attached to the escalation. The contradiction is
      **confirmed in source**; the runtime behavior must be **reproduced**, not inferred.
- [ ] CHK-AMD-002 [P0] The amendment decision was filed under `system-spec-kit` — the runtime's own packet — not
      resolved inside this documentation packet.
- [ ] CHK-AMD-003 [P0] The escalation proposed **no parser fix**. This packet does not draft one.
- [ ] CHK-AMD-004 [P0] An operator ruling exists and is recorded with an id in `decision-record.md`.
- [ ] CHK-AMD-005 [P0] The Gate-3 scenario rewrite happened **after** CHK-AMD-004 and cites the ruling id.
- [ ] CHK-AMD-006 [P0] The rewritten scenario exercises all five options end to end — displayed label, parsed
      result, bound write boundary, skip behavior, child-session exemption — on every supported hook adapter.
<!-- /ANCHOR:amendment-gate -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No Tier-1/2 execution touched the real `origin` or any credentialed production surface.
- [ ] CHK-031 [P0] No run artifact contains credentials, tokens, or developer-absolute paths.
- [ ] CHK-032 [P0] The push scenario demonstrates the permission requirement and never a way around it.
- [ ] CHK-033 [P1] Every mutating scenario declares what it mutates before its first command.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Every repaired file passes `validate-playbook-package.cjs --strict`.
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are
      reconciled — no document claims a completion state another contradicts.
- [ ] CHK-042 [P1] `decision-record.md` records the destructive-isolation contract and the amendment ruling.
- [ ] CHK-043 [P2] Retired scenarios (feature removed, not moved) carry a recorded retirement reason.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Run artifacts live under `<skill>/benchmark/reports/<dated-run>/`, never baked into scenario truth.
- [ ] CHK-051 [P1] The disposable clone and disposable packet are torn down at close.
- [ ] CHK-052 [P1] Failed run artifacts are kept as evidence, not deleted.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (execution is the acceptance criterion) and ADR-002 (escalate, do not patch) recorded
      with status.
- [ ] CHK-101 [P1] Rejected alternatives documented with rationale, including both wrong ways to "fix" the Gate-3
      scenario without a ruling.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] Wall-clock for the full 19-scenario execution pass measured and recorded.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented: revert the scenario edit, re-provision the clone, keep the evidence.
- [ ] CHK-121 [P1] Cleanup evidence present for every Tier-1/2 scenario.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] No repaired scenario instructs the operator to violate a hard repository rule.
- [ ] CHK-131 [P1] Every disposable clone/remote used for execution evidence is torn down after the run.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All 19 repaired scenarios cite their execution-run artifact path in the scenario document.
- [ ] CHK-141 [P2] The escalated Gate-3 finding links to the `system-spec-kit` amendment request, not a local fix.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 31 | 0/31 |
| P1 Items | 19 | 0/19 |
| P2 Items | 4 | 0/4 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | **AMENDMENT-DECISION** on the Gate-3 option-letter contradiction (Q4) | [ ] Approved | |
| Operator | Absent runtime advisory hook: relocation or gap (Q4b) | [ ] Approved | |
| Operator | Disposable-remote target for Tier-1 execution | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
