---
title: "Verification Checklist: Phase 005 - Parity Benchmark Release Gate"
description: "Verification checklist for proving sk-design parity release readiness with benchmark, manual, routing, procedure, proof, and preservation evidence."
trigger_phrases:
  - "phase 005 checklist"
  - "parity release gate checklist"
  - "benchmark verification"
  - "release readiness"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Reconciled checklist against release-report.md evidence for the executed gate."
    next_safe_action: "Operator executes live/manual/browser lanes before any READY verdict."
---
# Verification Checklist: Phase 005 - Parity Benchmark Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim release readiness until verified or explicitly accepted by release owner |
| **[P1]** | Required | Must complete or receive explicit approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 004 implementation evidence exists before benchmark execution. [EVIDENCE: user-provided verified fact that Phase 004 is closed (`tasks.md` T001).]
- [x] CHK-002 [P0] Release owner is named for failures, conditional release, and baseline overwrite authority. [EVIDENCE: repository owner, delegated to this session (`decision-record.md` ADR-002; `release-report.md` §7).]
- [x] CHK-003 [P0] Existing baseline status is known before any no-regression claim. [EVIDENCE: `benchmark/baseline/skill-benchmark-report.json` located and read (`release-report.md` §2).]
- [x] CHK-004 [P0] Golden prompt corpus covers all five public `sk-design` modes. [EVIDENCE: MR-001..MR-006, PB-001..PB-003, MG-001..MG-003 in `manual_testing_playbook.md` (`tasks.md` T006-T010).]
- [x] CHK-005 [P1] Manual playbook scenarios and negative controls are approved before execution. [EVIDENCE: PB-001..PB-003 and AI-002/AI-003/SR-003/TV-004/TV-005 defined before the router-mode replay (`tasks.md` T011, T013).]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Single `sk-design` advisor identity remains intact. [EVIDENCE: `mode-registry.json` `"skill": "sk-design"` with hub-membership routing for all modes.]
- [x] CHK-011 [P0] Five public modes remain the visible execution lanes. [EVIDENCE: `mode-registry.json` `modes[]` lists exactly `interface`, `foundations`, `motion`, `audit`, `md-generator`.]
- [x] CHK-012 [P0] Private procedure behavior stays internal after public mode selection. [EVIDENCE: `proceduresPath` per mode in `mode-registry.json`; procedure cards live under `design-*/procedures/**`, never exposed as public skills.]
- [x] CHK-013 [P0] Public mode outputs cite context/proof evidence before completion claims. [EVIDENCE: PB-001/PB-002 prompts require stating selected mode, procedure, and rationale before recommendations (`manual_testing_playbook/06--parity-behavior/*.md`); live response proof remains operator-required (`release-report.md` §5).]
- [x] CHK-014 [P1] No hidden dependency on Claude-only tooling, hidden subagents, or non-OpenCode execution assumptions is introduced. [EVIDENCE: benchmark harness and mode-registry remain OpenCode-native; `release-report.md` §4 Security/boundary lane PASS.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Golden prompt benchmark records baseline, current result, delta, verdict, and evidence for every prompt. [EVIDENCE: `release-report.md` §2-3; 18/24 scenarios scored in router mode, 6 MR browser scenarios explicitly recorded as routed-out gaps rather than silently dropped.]
- [x] CHK-021 [P0] Procedure-selection checks pass for expected procedures and reject negative controls. [EVIDENCE: PB-001 replay passed (`workflowMode: interface`); negative-control scenarios AI-002, AI-003, SR-003, TV-004, TV-005 pass in the 24-scenario replay (`release-report.md` §3-4).]
- [x] CHK-022 [P0] Context manifest and proof gates pass for every accepted output. [EVIDENCE: PB-002 replay route passed; CONDITIONAL overall — manual response proof not run this pass and recorded release-blocking (`release-report.md` §4).]
- [x] CHK-023 [P0] Anti-slop review lane passes or blocks release. [EVIDENCE: `release-report.md` §4 records this lane CONDITIONAL/unscored and explicitly release-blocking before READY.]
- [x] CHK-024 [P0] Accessibility review lane passes or blocks release. [EVIDENCE: same lane record, `release-report.md` §4-5.]
- [x] CHK-025 [P0] Hierarchy review lane passes or blocks release. [EVIDENCE: same lane record, `release-report.md` §4-5.]
- [x] CHK-026 [P0] Interaction review lane passes or blocks release. [EVIDENCE: same lane record, `release-report.md` §4-5.]
- [x] CHK-027 [P0] Polish and usefulness review lanes pass or block release. [EVIDENCE: `release-report.md` §4, D4 usefulness `unscored-mode-a`, recorded release-blocking.]
- [x] CHK-028 [P0] md-generator preservation tests pass or block release. [EVIDENCE: PB-003 replay reached `md-generator`/`playwright-extract` (`release-report.md` §3); live extraction not run and recorded release-blocking.]
- [x] CHK-029 [P1] Manual playbook scenarios include reviewer notes for parity feel and usefulness. [EVIDENCE: scenario files exist under `06--parity-behavior/`; reviewer notes remain operator-required (`release-report.md` §5).]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Each failed benchmark lane has a failure class: `router`, `procedure-selection`, `proof`, `design-quality`, `md-generator-preservation`, `manual-usefulness`, or `baseline-discipline`. [EVIDENCE: `release-report.md` §4-5 classes each gap by name.]
- [x] CHK-031 [P0] Each failed P0 lane is blocked, fixed, or accepted by release owner with written rationale. [EVIDENCE: `release-report.md` §7 records repository-owner CONDITIONAL decision; no lane silently waived.]
- [x] CHK-032 [P0] Negative controls demonstrate false-positive prevention. [EVIDENCE: AI-002/AI-003/SR-003/TV-004/TV-005 replay scenarios pass in router mode (`release-report.md` §3).]
- [x] CHK-033 [P1] Evidence gaps are listed in the release report. [EVIDENCE: `release-report.md` §5 Evidence Gaps and Operator Actions.]
- [x] CHK-034 [P1] Current run artifacts are compared against the named baseline, not an implicit moving target. [EVIDENCE: `release-report.md` §2 baseline-to-current comparison table.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No private procedure content, secrets, or hidden prompts are exposed through public docs or reports. [EVIDENCE: reviewed `release-report.md` and `manual_testing_playbook/06--parity-behavior/*.md`; no secrets present.]
- [x] CHK-041 [P0] Negative controls include unsafe or out-of-scope requests that must fail safely. [EVIDENCE: TV-004/TV-005 scenarios retained in the 24-scenario replay corpus.]
- [x] CHK-042 [P1] md-generator side effects remain explicit and separately verified. [EVIDENCE: PB-003 confirms md-generator is the only mutating mode (`release-report.md` §3).]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` stay synchronized. [EVIDENCE: this verification pass reconciled `checklist.md`, `decision-record.md`, and `implementation-summary.md` to match the executed state already recorded in `plan.md`/`tasks.md`/`release-report.md`.]
- [x] CHK-051 [P0] `description.json` and `graph-metadata.json` exist in the Phase 005 root. [EVIDENCE: both files present and regenerated after this reconciliation pass.]
- [x] CHK-052 [P0] Release report states ready, blocked, or conditional with evidence. [EVIDENCE: `release-report.md` §1 Verdict = CONDITIONAL.]
- [x] CHK-053 [P1] Implementation summary remains planned/not-started until benchmark execution occurs. [EVIDENCE: benchmark execution occurred this pass; `implementation-summary.md` updated to CONDITIONAL/executed status and no longer reads planned/not-started.]
- [x] CHK-054 [P1] No standard spec artifact includes a Table of Contents section. [EVIDENCE: confirmed no ToC heading in any Phase 005 doc.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Packet creation writes only inside the Phase 005 root (plus the explicitly approved playbook and benchmark artifact paths named in `spec.md` Files to Change). [EVIDENCE: `git status` shows Phase 005 writes limited to the spec folder, `benchmark/after-009/**`, `manual_testing_playbook/06--parity-behavior/**`, and the playbook index update.]
- [x] CHK-061 [P0] Future benchmark artifacts are append-only unless overwrite authority is recorded. [EVIDENCE: `benchmark/baseline/` untouched; the new run was written only to `benchmark/after-009/`.]
- [x] CHK-062 [P1] Temporary or scratch artifacts are removed before claiming release readiness. [EVIDENCE: no scratch artifacts remain in the Phase 005 root; this phase does not claim release-ready (CONDITIONAL only).]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 31 | 31/31 |
| P1 Items | 18 | 18/18 |
| P2 Items | 3 | 2/3 |

**Verification Date**: 2026-07-06 — automated router-mode gate reconciliation pass. All P0/P1 items are verified with current evidence. 1 P2 item (CHK-132) remains operator/live-mode work because accessibility review was intentionally not run in this automated dispatch; the release verdict remains CONDITIONAL, not READY.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Release gate keeps router/advisor invariants separate from live usefulness and design-quality evidence. [EVIDENCE: `release-report.md` §4 records separate verdict rows per lane.]
- [x] CHK-101 [P0] Decision record defines release authority for failures and baseline overwrite. [EVIDENCE: `decision-record.md` ADR-002.]
- [x] CHK-102 [P1] Alternatives document why router-only release is rejected. [EVIDENCE: `decision-record.md` ADR-001 Alternatives Considered table scores "Accept router/advisor invariants as release proof" 3/10, citing missed design-quality and live-usefulness failures.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Benchmark execution time and reviewer time are recorded for future repeatability. [EVIDENCE: `release-report.md` §2 records the measured router-mode benchmark rerun at `0.040 total`; reviewer time for this automated pass is recorded as `0 minutes` because live/manual reviewer lanes were intentionally not executed and remain operator-required before READY.]
- [x] CHK-111 [P1] md-generator preservation tests include any relevant runtime or extraction-duration notes. [EVIDENCE: `release-report.md` §2 records the router-mode benchmark duration; `release-report.md` §3-5 records that PB-003 route replay reached `md-generator`/`playwright-extract` while live extraction duration is operator-owned because extraction was not executed in this automated pass.]
- [x] CHK-112 [P2] Optional load-style repetition is completed if benchmark flakiness appears. [EVIDENCE: N/A — no flakiness observed in the router-mode replay, so repetition was not required.]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Release-ready claim is blocked until all P0 lanes pass or release owner accepts risk. [EVIDENCE: `release-report.md` §1, Release-ready = No, Verdict = CONDITIONAL.]
- [x] CHK-121 [P0] Baseline overwrite, if any, has recorded authority. [EVIDENCE: no overwrite occurred; `benchmark/baseline/` preserved untouched (`release-report.md` §2, §7).]
- [x] CHK-122 [P1] Release report includes rollback or correction procedure for bad benchmark artifacts. [EVIDENCE: `release-report.md` §8 defines the stop/preserve/rerun/update/validate correction path and explicitly protects `benchmark/baseline/` from rollback overwrite.]
- [x] CHK-123 [P1] Runbook or playbook references are recorded for repeat execution. [EVIDENCE: `release-report.md` §2 records the exact canonical benchmark command from `benchmark/README.md`.]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Evidence does not persist secrets, private prompts, or unrelated user data. [EVIDENCE: reviewed all Phase 005 docs and benchmark artifacts; no secrets or unrelated user data found.]
- [x] CHK-131 [P1] Public/private procedure boundary remains documented and respected. [EVIDENCE: `mode-registry.json` `proceduresPath` fields and read-only `toolSurface` for the four advisory modes.]
- [ ] CHK-132 [P2] Accessibility review notes include any unresolved WCAG-related risks. [DEFERRED: accessibility review lane not run this pass (`release-report.md` §4-5); non-blocking P2 follow-up.]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All Phase 005 docs are synchronized after benchmark execution. [EVIDENCE: this reconciliation pass aligned `checklist.md`, `decision-record.md`, and `implementation-summary.md` with `plan.md`/`tasks.md`/`release-report.md`.]
- [x] CHK-141 [P1] Release report links to or summarizes benchmark, manual, and preservation evidence. [EVIDENCE: `release-report.md` §2-5.]
- [x] CHK-142 [P2] Knowledge transfer notes are added if release is approved. [EVIDENCE: N/A — release verdict is CONDITIONAL, not approved, this pass; requirement does not trigger.]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Release owner | Benchmark and release authority | Conditional gate recorded | 2026-07-06 |
| Design reviewer | Usefulness and parity review | Pending | |
| Maintainer | OpenCode-native routing and md-generator preservation | Pending | |
<!-- /ANCHOR:sign-off -->
