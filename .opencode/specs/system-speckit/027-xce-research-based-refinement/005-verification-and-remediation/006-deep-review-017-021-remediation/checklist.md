---
title: "Verification Checklist: Deep-Review 017-021 Remediation [027/002/005/006]"
description: "Quality gates for the 017-021 remediation. Items are pending at authoring time; each names the evidence the later implementation step must capture. The P1 and the per-finding coverage are the load-bearing gates."
trigger_phrases:
  - "017-021 remediation checklist"
  - "deep review remediation checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "deep-review-remediation-author"
    recent_action: "Authored verification gates incl. fix-completeness for 017-021 remediation"
    next_safe_action: "verify c006 renderer then begin per-file remediation"
    blockers: []
    completion_pct: 0
---
# Verification Checklist: Deep-Review 017-021 Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Items below are PENDING — this is the authoring step; no fixes applied. Each item names the evidence the later implementation step must capture before marking `[x]`.
<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All confirmed findings extracted into tasks.md
  - **Evidence (target)**: every CONFIRMED row across the five syntheses maps to exactly one task; no orphan, no fabrication
- [ ] CHK-002 [P0] Rejected/refuted/already-resolved findings excluded
  - **Evidence (target)**: §3 Out of Scope + tasks.md T034 enumerate the excluded items (018 mimo-1; 019/020 D6/D7/D8; 021 B8/A3)
- [ ] CHK-003 [P1] Each task names a target file + concrete change + synthesis trace + confidence tag
  - **Evidence (target)**: tasks.md notation block + per-task `<trace:…>` and `{confirmed-by-code|needs-in-task-verification}`
<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each code fix is scoped to its synthesis-described change (no scope creep)
  - **Evidence (target)**: diff per fix matches the cited remediation; reviewed deliverables stay behaviorally intact (NFR-C01)
- [ ] CHK-011 [P1] c006 §0 hardening (if raw) handles glob/cmd-sub/metachar, not just word-splitting
  - **Evidence (target)**: `set -f`/restructure applied; the shipped `"$*"` + `"`-escape is superseded, not duplicated
- [ ] CHK-012 [P1] `cancelledJobIds` cleared on EVERY terminal `setJobState` incl. `'failed'` (T012)
  - **Evidence (target)**: job-store.ts delete on terminal transition; the `:69-75` "cannot grow without bound" comment is now literally true
- [ ] CHK-013 [P1] Cited line numbers re-confirmed against live files before edit (esp. 021 :785-790/:802)
  - **Evidence (target)**: each code task re-reads its cite (finding-is-a-hypothesis discipline)
<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Baseline captured before changes; whole gate re-run after; delta reported
  - **Evidence (target)**: `baseline N failing {…} → now M: {…}` per touched suite (T032)
- [ ] CHK-021 [P1] New unit coverage for `processBatches` shouldAbort + `isCancelRequestedFast` Set lifecycle (T014-T015)
  - **Evidence (target)**: batch-processor.vitest.ts + job-store.vitest.ts assert the new behavior
- [ ] CHK-022 [P1] c006 metacharacter verification cases pass (if raw renderer)
  - **Evidence (target)**: queries with `*`, `$(…)`, backticks, `;`, `\|`, `&`, `>` resolve to the verbatim typed string; arg-echo matches
- [ ] CHK-023 [P2] 019/020 test fixtures use the real `labels[]` shape; tests still pass (T022)
  - **Evidence (target)**: launcher-maintenance-guard + daemon-reelection-adoption-live fixtures updated; suites green
<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P1] The single confirmed P1 (c006) is closed at its verified severity
  - **Evidence (target)**: T001 establishes raw-vs-quoted; T002 quote-hardens (raw) or records a downgraded P2 doc-note (quoted), with renderer evidence cited
- [ ] CHK-031 [P1] 017 systemic doc drift reconciled across all 7 children (T003)
  - **Evidence (target)**: each child's spec/plan/tasks reflect shipped scope (or marked superseded); graph-metadata Status/Key Files match impl-summary
- [ ] CHK-032 [P1] 019 doc cluster reconciled (paths, schema, TTL, limitation, module, fixtures) (T017-T022)
  - **Evidence (target)**: `.opencode/bin/...` paths; `labels[]` schema; 180s TTL; per-tick embedding-queue protection; extracted module tracked
- [ ] CHK-033 [P2] 018/021 cancellation + instrumentation P2s closed or accepted-with-reason
  - **Evidence (target)**: T013/T027/T029/T030 done or each deferral documented against its synthesis
- [ ] CHK-034 [P2] 017 c004 maintainability cluster + minor nits resolved or accepted-with-reason (T004-T011, T024-T026)
  - **Evidence (target)**: each item fixed or carries a documented acceptance rationale
<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] No new input surface or injection sink introduced by any fix
  - **Evidence (target)**: c006 fix neutralizes the outer-shell expansion of user input; no other task adds an input surface
- [ ] CHK-041 [P2] c006 self→self trust boundary documented in the fix note
  - **Evidence (target)**: the §0 note records the operator-types-own-query boundary that justified P1-not-P0
<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Each reconciled phase doc passes `validate.sh --strict` (T033)
  - **Evidence (target)**: exit 0 per touched 017-021 spec folder
- [ ] CHK-051 [P1] No reconciliation overwrote a real `implementation-summary.md` (ADR-004)
  - **Evidence (target)**: scaffold docs reconciled TO the impl-summary; impl-summary content untouched except 019/021 explicit wording fixes
- [ ] CHK-052 [P2] This packet's own docs validate.sh --strict clean
  - **Evidence (target)**: `validate.sh <this-packet> --strict` exit 0
<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] This packet writes only its own folder; no reviewed code or 017-021 phase doc touched at authoring time
  - **Evidence (target)**: `git status` shows changes confined to `006-deep-review-017-021-remediation/`
- [ ] CHK-061 [P1] Temp/scratch files in scratch/ only; cleaned before completion
  - **Evidence (target)**: no temp files outside `scratch/`
<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
  - **Evidence (target)**: ADR-001 (severity-lock), ADR-002 (honor verdicts), ADR-003 (workstream split), ADR-004 (reconcile-to-impl-summary)
- [ ] CHK-101 [P1] All ADRs have status (Accepted)
  - **Evidence (target)**: each ADR metadata status: Accepted
<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] No carried fix degrades scan/search responsiveness (the reviewed deliverable's purpose)
  - **Evidence (target)**: 021 fixes preserve cooperative-yield; the live max-event-loop-lag readout stays within the established bound (≤634ms baseline)
- [ ] CHK-111 [P2] The c006 fix adds no measurable command-resolution latency
  - **Evidence (target)**: `set -f`/restructure is O(1); arg-echo timing unchanged
<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P1] Rollback path documented per change class (code commit / doc git-revert / ephemeral marker)
  - **Evidence (target)**: plan.md L2 Enhanced Rollback + ADR-001 rollback notes
- [ ] CHK-121 [P2] Daemon recycle plan noted if a shipped lib/ change must go live
  - **Evidence (target)**: dist rebuild + recycle is the implementation step's concern, recorded in its handover
<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] No reviewed code or 017-021 phase doc touched at authoring time (scope-lock)
  - **Evidence (target)**: `git status` confined to `006-…/`
- [ ] CHK-131 [P1] Comment hygiene respected in any later code fix (no spec/packet ids in code comments)
  - **Evidence (target)**: pre-commit gate passes; durable WHY only
<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] This packet's six docs pass validate.sh --strict (exit 0)
  - **Evidence (target)**: validation run recorded in implementation-summary verification table
- [ ] CHK-141 [P1] Every task carries a synthesis trace + confidence tag
  - **Evidence (target)**: tasks.md `<trace:…>` + `{confirmed-by-code|needs-in-task-verification}` on each task
<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] CHK-150 [P1] Authoring step complete: 6 docs + 2 metadata files present, validate.sh --strict exit 0
  - **Evidence (target)**: this checklist + the validation run
- [ ] CHK-151 [P1] Handoff to implementation step is unambiguous (T001 severity-lock is the first action)
  - **Evidence (target)**: spec next_safe_action = "verify c006 renderer then begin per-file remediation"
<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 (pending — authoring step) |
| P1 Items | 13 | 0/13 (pending) |
| P2 Items | 7 | 0/7 (pending) |

**Authoring date**: 2026-06-17
**Authored By**: deep-review-remediation-author
**Status**: not-started — findings carried as tasks; no fixes applied
**ADRs**: 4 documented, 4 accepted
<!-- /ANCHOR:summary -->
