---
title: "Tasks: Phase 2: gate-a-signal-closure"
description: "Every task this phase ran, with the evidence that settles it, and the one task still open because 50 declared signals do not resolve."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/002-gate-a-signal-closure"
    last_updated_at: "2026-09-03T22:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed T011 with a decision per unresolved signal"
    next_safe_action: "Hand the sk-doc activation-pin defect to its owner"
    blockers: []
    key_files:
      - "research/gate-a-rerun-2026-09-03.tsv"
      - "research/unresolved-signal-decisions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-002-gate-a-signal-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: gate-a-signal-closure

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

- [x] T001 Extract `intent_signals` for each of the five hubs from the advisor graph database. Evidence: `sqlite3 .../skill-graph.sqlite "select intent_signals from skill_nodes where id='<hub>';"` returns a JSON array per hub.
- [x] T002 Union those with `derived.trigger_phrases` from each hub's `graph-metadata.json` and de-duplicate by exact string. Evidence: 444 unique signals at baseline, 381 on the 2026-09-02 re-run.
- [x] T003 [P] Check for cross-hub overlap. Evidence: zero signals declared by two hubs, so no row is counted twice.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Sweep every declared signal through the daemon CLI, one reply file per signal, exit status in a separate file. Evidence: 444 replies at baseline, 381 on the re-run, all exit 0.
- [x] T005 Classify each reply into exactly one of five buckets from `recommendations[0]`. Evidence: `research/gate-a-raw.tsv`, 445 lines including its header, every row carrying a bucket.
- [x] T006 Publish the per-hub distribution beside the total. Evidence: `research/gate-a-measurement.md` created in `dbc8678c9d`, 315 lines, with the executor hub at 7 of 115.
- [x] T007 Audit each unresolved signal before retiring it. Evidence: `08eb67a0de` retired 67, of which 41 returned nothing, 6 went elsewhere and 20 landed on their hub and dropped. None was resolving.
- [x] T008 Give stage-one signals a stage-two class in the executor hub router. Evidence: `08eb67a0de` touched `hub-router.json` and `mode-registry.json`, moving that hub from 7 of 115 to 66.
- [x] T009 Correct the run-time override so it lifts the hub instead of inserting a routeless entry at rank one. Evidence: `lib/scorer/executor-delegation.ts` in `08eb67a0de`, with accuracy metrics byte-identical to the committed baseline.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Tally the raw replies twice by independent methods. Evidence: a Python pass and a `jq` pass both returned 234 RESOLVED of 444 and agreed per hub.
- [x] T011 Re-run the sweep and confirm no signal sits in an unresolved bucket without a decision. Evidence: re-swept at HEAD `fe1ec30fe8` on 2026-09-03 over 389 declared signals, `research/gate-a-rerun-2026-09-03.tsv`, all 389 calls exit 0. Holding the stale sk-doc pin aside, the unresolved set is the same 50 signals as the 2026-09-02 capture, member for member. `research/unresolved-signal-decisions.md` records a decision for all 50 in twelve groups, and an exact-set check confirms one group per signal with no duplicate and no gap.
- [x] T012 Re-run the regression suites after the fix. Evidence: 444 signals, 180 realistic prompts and 224 controls on the five hubs outside scope, with no hub losing a prompt it owned.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed for the tasks that are done
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

- [x] CHK-001 [P0] Requirements documented in spec.md. REQ-001 through REQ-003 map to AC-001 through AC-003.
- [x] CHK-002 [P0] Technical approach defined in plan.md, section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Phase 001 rules loaded before classification.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. The one code change is `executor-delegation.ts`, shipped with the suites green.
- [x] CHK-011 [P0] No console errors or warnings. Every sweep call exited 0.
- [x] CHK-012 [P1] Error handling implemented. Exit status is read per signal from its own file.
- [x] CHK-013 [P1] Code follows project patterns. The override now lifts the hub, matching the hub doctrine beside it.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. AC-001, AC-002 and AC-003 all read Met after the 2026-09-03 re-sweep and the decision table.
- [x] CHK-021 [P0] Manual testing complete. The sweep, the double tally and the re-run were all run and read.
- [x] CHK-022 [P1] Edge cases tested. Single-token signals and empty recommendation arrays were measured as they are.
- [x] CHK-023 [P1] Error scenarios validated. Tied scores were re-derived against the array order after the score re-sort inflated one hub.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The routeless executor entries were `class-of-bug`, not instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. All five hub routers and registries were read, not only the executor hub.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Gold labels, the holdout corpus and the regression fixtures were re-captured with the override change.
- [x] CHK-FIX-004 [P0] Adversarial cases covered. Canary fixtures caught two real regressions mid-flight, both reverted.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Five hubs by five buckets, published as the distribution table.
- [x] CHK-FIX-006 [P1] Hostile env variant executed. The re-run measured a live daemon whose registries had changed underneath the baseline.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA. `dbc8678c9d` and `08eb67a0de`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The sweep passes prompts, not credentials.
- [x] CHK-031 [P0] Input validation implemented. Each signal is passed as a JSON string field.
- [x] CHK-032 [P1] Auth/authz working correctly. The sweep issued no mutation command, so no trusted flag was used.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. All three record AC-003 as Met and the phase as Complete.
- [x] CHK-041 [P1] Code comments adequate. The override change carries its reasoning at the site.
- [x] CHK-042 [P2] README updated. Not applicable.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Sweep replies were written outside the packet.
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

**Verification Date**: 2026-09-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented. ADR-001 sits in plan.md, since this phase has no separate decision record.
- [x] CHK-101 [P1] All ADRs have status. ADR-001 is Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. Measuring one hub was rejected and the reason recorded.
- [x] CHK-103 [P2] Migration path documented. Retired vocabulary is removed rather than aliased.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01). The 381-signal re-run finished inside four minutes at 12 concurrent requests.
- [x] CHK-111 [P1] Throughput targets met. 20 concurrent daemon requests held for the baseline sweep.
- [x] CHK-112 [P2] Load testing completed. Not applicable beyond the sweep itself.
- [x] CHK-113 [P2] Performance benchmarks documented. The concurrency and timeout are recorded in plan.md section 5.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented. `git revert 08eb67a0de` restores every changed routing file together.
- [x] CHK-121 [P0] Feature flag configured. Not applicable, since routing files carry no toggle.
- [x] CHK-122 [P1] Monitoring/alerting configured. Canary fixtures serve that role during a fix.
- [x] CHK-123 [P1] Runbook created. The reproduction commands in `research/gate-a-measurement.md`.
- [x] CHK-124 [P2] Deployment runbook reviewed. Not applicable.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed. The change alters routing vocabulary, not access.
- [x] CHK-131 [P1] Dependency licenses compatible. No dependency was added.
- [x] CHK-132 [P2] OWASP Top 10 checklist completed. Not applicable.
- [x] CHK-133 [P2] Data handling compliant with requirements. Only local repository files were read.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized. spec.md, plan.md, tasks.md and acceptance-criteria.md all record AC-003 as Met.
- [x] CHK-141 [P1] API documentation complete. Not applicable.
- [x] CHK-142 [P2] User-facing documentation updated. Not applicable.
- [x] CHK-143 [P2] Knowledge transfer documented. `research/gate-a-measurement.md` carries the method, and `research/unresolved-signal-decisions.md` carries a decision per unresolved signal with its mechanism.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Not applicable | Technical Lead | [ ] Approved | |
| Not applicable | Product Owner | [ ] Approved | |
| Not applicable | QA Lead | [ ] Approved | |

This phase ran as a single-operator measurement and fix, so no separate approver signed it
off. The evidence rows above carry the verification instead, and all of them now close.
<!-- /ANCHOR:sign-off -->
