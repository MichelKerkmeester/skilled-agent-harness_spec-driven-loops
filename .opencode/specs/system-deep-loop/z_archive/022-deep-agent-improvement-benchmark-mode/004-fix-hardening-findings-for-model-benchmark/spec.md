---
title: "Feature Specification: fix hardening-review findings for model-benchmark mode"
description: "Fix the hardening-review findings for model-benchmark mode, including cwd propagation, path boundary checks, criteria-exec gating, grader clamping, and regression tests."
trigger_phrases:
  - "benchmark mode remediation"
  - "122 review findings fix"
  - "deep-agent-improvement P1 fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/004-fix-hardening-findings-for-model-benchmark"
    last_updated_at: "2026-05-28T19:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 3 P1 fixed + tested; P2s fixed or reconciled; suite green"
    next_safe_action: "None — remediation complete; re-review optional"
    blockers: []
    key_files:
      - "../007-review-model-benchmark-mode-hardening/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-20260528"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: fix hardening-review findings for model-benchmark mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 19 |
| **Predecessor** | 003-build-model-benchmark-mode-runtime |
| **Successor** | 005-add-opt-in-5dim-scorer-and-skill-docs |
| **Handoff Criteria** | All 3 unique P1 defects fixed + regression-tested; actionable P2s resolved or reconciled; vitest + alignment-drift green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of packet 121 — remediation of the findings from the tri-model deep review (`007-review-model-benchmark-mode-hardening`, gpt-5.5 + MiniMax M2.7 + Opus 4.8 arbiter; verdict CONDITIONAL). Source of truth for findings: `../007-review-model-benchmark-mode-hardening/review/review-report.md`.

**Scope Boundary**: Fix the 3 unique confirmed P1 defects + the actionable P2 advisories inside `.opencode/skills/deep-agent-improvement/scripts/`. Reconcile one spec-wording P2 in 003. Document the two non-defects (intended deferral / dedup artifact).

**Dependencies**: 122 review-report.md (findings + recommended fixes); the 121/003 build code.

**Deliverables**: code fixes + regression tests + green verification; reconciled REQ-004 wording.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 122 deep review confirmed (post Opus-4.8 arbitration) 3 unique P1 correctness/security defects in the shipped model-benchmark mode — the dispatcher drops the requested working directory for 4 of 5 executors, the D3 path guard misclassifies sibling-prefix paths, acceptance criteria run un-gated shell commands, and the D4 grader accepts unbounded model scores — plus 11 P2 advisories. None is P0, but the P1s warrant fix-before-promote.

### Purpose
Ship every confirmed P1 fixed and regression-tested, the actionable P2s resolved, and the non-defects documented, so the model-benchmark mode is correctness/security-clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 3 unique P1 fixes: dispatcher cwd propagation, cwd-check prefix boundary, criteria-exec gate + grader score clamp
- Actionable P2s: async backoff, delta-units doc, grader-cache raw gate, deterministic scoring test, opt-in 5-dim scorer wiring, reduce-state mode display, dispute.cjs DI, REQ-004 wording reconcile
- Regression tests proving each P1 fix

### Out of Scope
- The two intended-deferral P2s as *forced defaults* — wired as opt-in instead (changing the default pattern-matcher path would regress run-benchmark) - design intent upheld by the arbiter
- Re-architecting the scorer/dispatcher seams - the seam contracts are sound per the review

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/dispatch-model.cjs` | Modify | F-P1-1 cwd to spawnSync; F-P2-9 Atomics sleep |
| `scripts/scorer/deterministic/cwd-check.cjs` | Modify | F-P1-2 separator-bounded prefix guard |
| `scripts/scorer/score-model-variant.cjs` | Modify | F-P1-3 criteria-exec gate |
| `scripts/scorer/grader/harness.cjs` | Modify | F-P1-4 score clamp; F-P2-6 cache raw gate |
| `scripts/scorer/grader/dispute.cjs` | Modify | F-P2-7 DI for fs (remove global monkey-patch) |
| `scripts/run-benchmark.cjs` | Modify | F-P2-10 delta units doc; F-P2-2 opt-in 5-dim scorer |
| `scripts/reduce-state.cjs` | Modify | F-P2-5 surface mode in dashboard |
| `scripts/tests/*.vitest.ts` | Modify/Create | regression tests for each P1 + deterministic scoring |
| `../003-build-model-benchmark-mode-runtime/spec.md` | Modify | F-P2-3 reconcile REQ-004 `--cwd` wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 3 unique P1 defects fixed | cwd reaches all 5 executors; sibling-prefix path classified as traversal; criteria exec gated; grader score clamped [0,1] — each with a passing regression test |
| REQ-002 | No regression | full vitest suite green; alignment-drift PASS (0 findings); TST-1 identity gate still holds |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Actionable P2s resolved | busy-wait removed, delta documented, cache gate added, deterministic scoring test added, 5-dim scorer opt-in wired, mode surfaced, dispute.cjs DI, REQ-004 wording reconciled |
| REQ-004 | Non-defects documented | F-P2-4 (promote-candidate) + F-P2-11 (dedup) recorded as no-change with rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running the 122 P1 checks shows all 3 unique defects resolved with regression coverage.
- **SC-002**: vitest + alignment-drift green; no regression to the agent-improvement path (TST-1).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing ported scorer files diverges from 120/003 source | Low | Files are now dai-owned; changes are additive guards + clamps, covered by tests |
| Risk | Opt-in 5-dim scorer wiring regresses run-benchmark default | Med | Gate behind an explicit flag; default path unchanged; smoke-test both paths |
| Risk | criteria-exec gate breaks legitimate benchmark profiles | Med | Default ON (backward-compat); only a hardened opt-out disables it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the criteria-exec gate default to ON (backward-compat, chosen) or OFF (secure-by-default, breaks existing profiles)? Chosen: ON + documented opt-out.
- Is the opt-in 5-dim scorer wiring worth the surface, or is the documented deferral sufficient? Implementing minimal opt-in to close the finding.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
