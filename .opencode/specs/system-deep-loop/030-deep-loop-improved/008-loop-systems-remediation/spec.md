---
title: "Loop Systems Remediation"
description: "Phase parent tracking remediation of deep-review deferred findings and MiMo-campaign recommendations across the deep-loop runtime, workflows, and command surfaces."
trigger_phrases:
  - "loop systems remediation"
  - "008 remediation"
  - "deep-review deferred findings"
  - "mimo campaign recommendations"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation"
    last_updated_at: "2026-07-04T18:45:00Z"
    last_updated_by: "glm-fanout-review"
    recent_action: "Finalized 009 parent spec from completed children; closed placeholder scaffolding"
    next_safe_action: "Plan fan-out-hardening follow-up from GLM review findings (P1-001..005, P1-011-001, P2-009-001)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-fanout-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Loop Systems Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (children 001-007 shipped) |
| **Created** | 2026-06-29 |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 11 |
| **Predecessor** | 007-testing |
| **Successor** | 009-research-backlog-remediation |
| **Handoff Criteria** | Each child phase validates independently under `validate.sh` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the 030-deep-loop-improved packet: remediate deep-review deferred findings and MiMo-campaign recommendations.

**Scope Boundary**: targeted resilience, safety, observability, and test-adequacy fixes in the deep-loop runtime, deep-loop workflows, and deep/speckit command surfaces. All implementation lives in the child phases below.

**Dependencies**: Phases 002-007 must be shipped (loop-system improvements that preceded remediation).

**Deliverables**: seven independently-shipped remediation children (rollback hash-guard, promotion safety, benchmark reducer ledger, adversarial playbook scenarios, tightened pass-criteria, P2 test-adequacy/source-only audit, detached CLI fan-out hardening).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deferred deep-review findings and MiMo-campaign recommendations identified gaps in rollback hash-guard integrity, promotion safety, benchmark ledger accuracy, adversarial playbook coverage, playbook pass-criteria rigor, and P2 test-adequacy/source-only auditing across the loop-system surfaces.

### Purpose
Close each deferred finding as an independently-shipped, independently-validated child phase so the loop system ships with regression-guarded fixes rather than open advisories.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rollback hash-guard remediation (001).
- Deep-improvement promotion safety (002).
- Model-benchmark reducer ledger (003).
- Adversarial playbook scenarios (004).
- Tightened playbook pass-criteria (005).
- P2 test-adequacy and source-only audit (006).

### Out of Scope
- Net-new loop features (tracked in earlier phases 002-007).
- Fan-out-hardening follow-ups surfaced by the GLM fan-out review (see Open Questions) — tracked as a separate workstream.

### Files to Change

Audit-trail summary only; per-child detail lives in each child's plan/tasks.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/deep-loop-runtime/**` | Modify | 001-006 | Resilience, promotion, benchmark, audit fixes |
| `.opencode/skills/deep-loop-workflows/**` | Modify | 004-005 | Adversarial playbook and pass-criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven child phases pass `validate.sh` independently.
- **SC-002**: Each remediation names a runnable regression guard that fails when the fixed bug returns (per adversarial-playbook contract).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Fan-out-hardening follow-up: the GLM fan-out review surfaced 7 active P1s and 1 P2 in the detached CLI fan-out path (prompt bindings, salvage/retry, sandbox, merge of leaf-only lineages, observability). Code fixes were applied directly (fanout-run.cjs, fanout-merge.cjs, cli-guards.cjs, executor-config.ts); a dedicated child phase should formalize and regression-guard them. See `review/lineages/glm/review-report.md`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-improvement-rollback-hash-guard/ | Rollback hash-guard integrity | Complete |
| 2 | 002-deep-improvement-promotion-safety/ | Deep-improvement promotion safety | Complete |
| 3 | 003-model-benchmark-reducer-ledger/ | Model-benchmark reducer ledger | Complete |
| 4 | 004-adversarial-playbook-scenarios/ | Adversarial playbook scenarios | Complete |
| 5 | 005-tighten-playbook-pass-criteria/ | Tightened playbook pass-criteria | Complete |
| 6 | 006-p2-test-adequacy-and-source-only-audit/ | P2 test-adequacy and source-only audit | Complete |
| 7 | 007-fan-out-hardening/ | Detached CLI fan-out hardening (GLM review) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Rollback hash-guard regression green | child `validate.sh` exit 0 |
| 002 | 003 | Promotion safety regression green | child `validate.sh` exit 0 |
| 003 | 004 | Benchmark reducer ledger regression green | child `validate.sh` exit 0 |
| 004 | 005 | Adversarial playbook scenarios green | child `validate.sh` exit 0 |
| 005 | 006 | Tightened pass-criteria green | child `validate.sh` exit 0 |
<!-- /ANCHOR:phase-map -->
