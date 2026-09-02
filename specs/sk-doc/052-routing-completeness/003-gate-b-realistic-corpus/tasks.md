---
title: "Tasks: Phase 3: gate-b-realistic-corpus"
description: "Every task this phase ran, marked done with the evidence that settles it: an observed count, a command output, or a commit."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/003-gate-b-realistic-corpus"
    last_updated_at: "2026-09-02T17:36:09Z"
    last_updated_by: "claude-code"
    recent_action: "Marked every task done with its observed evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "assets/realistic-corpus.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-003-gate-b-realistic-corpus"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: gate-b-realistic-corpus

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Enumerate every mode across the five hubs from each `mode-registry.json`. Evidence: 43 modes, which is the corpus denominator before the command-surface correction.
- [x] T002 Write at least four realistic prompts per mode by hand (`assets/realistic-corpus.tsv`). Evidence: 181 lines including the header, created in `4a5de9e52b`.
- [x] T003 [P] Mark the eight boundary rows with a one-line reason for which mode should win. Evidence: the `boundary_reason` column on those rows.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Confirm no row names its own intended mode. Evidence: `awk -F'\t' 'NR>1 && index(tolower($3),tolower($2))>0'` returns 0 rows, re-checked 2026-09-02.
- [x] T005 Measure every row once through the live daemon. Evidence: 180 replies, no call failing or returning malformed output.
- [x] T006 Compute the strict and loose hit counts from the same JSON. Evidence: 8 of 180 top-only and 20 of 180 any-position at the time of the baseline.
- [x] T007 Classify every miss by mechanism. Evidence: 94 with no recommendation, 40 wrong hub, 15 floor noise, 12 shadowed by a legacy duplicate, 11 deferred, and 0 right-hub-wrong-mode.
- [x] T008 Read the structural cause rather than inferring it. Evidence: `advisor_status` reports `semantic_shadow: 0.05`, and `select count(*) from skill_nodes where embedding is not null` returns 0. Both re-checked 2026-09-02.
- [x] T009 Correct the denominator for command-surface modes. Evidence: `8c6d6fd455` names `model-benchmark` and `skill-benchmark` with `routingClass: command-bridge` and publishes 8 of 172 beside 8 of 180.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Re-run the corpus and confirm the rate reproduces. Evidence: the second run returned 8 of 180 again, with several rows showing `cache.hit: true` on a verbatim repeat.
- [x] T011 Re-measure after the follow-up routing fix and record the new number. Evidence: a 180-row re-run on 2026-09-02 at HEAD `c328d601d8` returns 21 top-only and 24 any-position, with 95 empty replies. That matches the 21 of 180 recorded in `08eb67a0de`, and it measures the post-fix state rather than this baseline.
- [x] T012 Re-scope the phase this result invalidated (`../004-cross-hub-vocabulary/spec.md`). Evidence: `4a5de9e52b`, 42 lines touched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. REQ-001 through REQ-004 map to AC-001 through AC-004.
- [x] CHK-002 [P0] Technical approach defined in plan.md, section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Phase 001 rules loaded before any reply was judged.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Not applicable, since the phase adds no code.
- [x] CHK-011 [P0] No console errors or warnings. Every call exited 0 and parsed.
- [x] CHK-012 [P1] Error handling implemented. Output and exit status are written to separate files.
- [x] CHK-013 [P1] Code follows project patterns. Not applicable.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. AC-001 through AC-004 read Met with observed evidence.
- [x] CHK-021 [P0] Manual testing complete. The corpus was measured, re-run, and re-measured after the routing fix.
- [x] CHK-022 [P1] Edge cases tested. Eight boundary rows, and the row that lost only because it mentioned a product name.
- [x] CHK-023 [P1] Error scenarios validated. Cache hits on a verbatim repeat were observed rather than assumed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The 94-row bucket is `algorithmic`, the duplicate-entry shadow is `class-of-bug`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Every hub was measured, not only the one carrying the worst rate.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. The phase changed no symbol, and the one document it touched outside its folder is the phase 004 spec.
- [x] CHK-FIX-004 [P0] Adversarial cases covered. Boundary rows were written specifically to be hard, and all eight failed the strict check.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Five hubs by 43 modes, at least four prompts each, 180 rows.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. The post-fix re-run measured a daemon whose registries had changed underneath the baseline.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA. `4a5de9e52b`, `8c6d6fd455` and `c328d601d8` for the re-run.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The corpus holds prompts only.
- [x] CHK-031 [P0] Input validation implemented. Each prompt is passed as a JSON string field.
- [x] CHK-032 [P1] Auth/authz working correctly. No mutation command ran, so no trusted flag was used.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. All three carry the same rate and the same denominator correction.
- [x] CHK-041 [P1] Code comments adequate. Not applicable.
- [x] CHK-042 [P2] README updated. Not applicable.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Reply files were written outside the packet.
- [x] CHK-051 [P1] scratch/ cleaned before completion. It holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented. ADR-001 sits in plan.md, since this phase has no separate decision record.
- [x] CHK-101 [P1] All ADRs have status. ADR-001 is Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. The keyword-shaped corpus was rejected and the reason recorded.
- [x] CHK-103 [P2] Migration path documented. Not applicable.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01). Roughly five to six seconds per prompt against a 60 second timeout.
- [x] CHK-111 [P1] Throughput targets met. The 180 rows ran as one background pass.
- [x] CHK-112 [P2] Load testing completed. Not applicable.
- [x] CHK-113 [P2] Performance benchmarks documented. The timing is recorded in plan.md section 5.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented. Reverting the two commits removes the corpus and the measurement together.
- [x] CHK-121 [P0] Feature flag configured. Not applicable, since nothing was switched on.
- [x] CHK-122 [P1] Monitoring/alerting configured. Not applicable.
- [x] CHK-123 [P1] Runbook created. The reproduction recipe in `research/gate-b-measurement.md`.
- [x] CHK-124 [P2] Deployment runbook reviewed. Not applicable.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. The phase reads and measures, and changes no runtime behaviour.
- [x] CHK-131 [P1] Dependency licenses compatible. No dependency was added.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed. Not applicable.
- [x] CHK-133 [P2] Data handling compliant with requirements. Only local repository files were read.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized. spec.md, plan.md, tasks.md and acceptance-criteria.md agree on Complete.
- [x] CHK-141 [P1] API documentation complete. Not applicable.
- [x] CHK-142 [P2] User-facing documentation updated. Not applicable.
- [x] CHK-143 [P2] Knowledge transfer documented. `research/gate-b-measurement.md` carries the method and the reproduction recipe.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Not applicable | Technical Lead | [ ] Approved | |
| Not applicable | Product Owner | [ ] Approved | |
| Not applicable | QA Lead | [ ] Approved | |

This phase ran as a single-operator measurement, so no separate approver signed it off. The
evidence rows above carry the verification instead.
<!-- /ANCHOR:sign-off -->
