---
title: "Verification Checklist: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route [template:level_3/checklist.md]"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "verification"
  - "checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/003-measurement-baseline"
    last_updated_at: "2026-06-15T14:05:58Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-measurement-baseline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

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

- [ ] CHK-001 [P0] Five metric definitions and the C1/C2/C3 scope documented in spec.md
- [ ] CHK-002 [P0] Runtime-agnostic approach and read-only delivery defined in plan.md
- [ ] CHK-003 [P1] 002 lineage state files confirmed present as the baseline corpus
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `fable-metrics.cjs` contains no `~/.claude` or hard-coded `projects/` path (grep clean); takes a path argument
- [ ] CHK-011 [P0] `fable-metrics.cjs` runs on the 002 corpus without an unhandled crash on malformed or partial state
- [ ] CHK-012 [P1] Defensive parsing: malformed JSONL lines are skipped and counted, not fatal
- [ ] CHK-013 [P1] `fable-mode-check.cjs` follows the existing `doctor/scripts/*.cjs` read-only diagnostic pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `fable-metrics.cjs` reports all five metrics (tool:text ratio, median words/msg, self-opener %, unsolicited-caveat %, evidence-backed-completion ratio) over the 002 corpus
- [ ] CHK-021 [P0] Baseline snapshot captured and records the contributing lineages
- [ ] CHK-022 [P0] `vitest` fixture confirms the post-dispatch advisory stays non-blocking on a tripping input
- [ ] CHK-023 [P1] `/doctor fable-mode` run writes no files (pre/post directory diff is empty)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The `post-dispatch-validate.ts` change is classed `cross-consumer` (a shared validation path with downstream consumers).
- [ ] CHK-FIX-002 [P0] Same-class inventory: confirm the advisory output is additive and no existing verdict producer in the file changes behavior.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `post-dispatch-validate` callers: `rg -n 'post-dispatch-validate|postDispatchValidate' .opencode/skills/deep-loop-runtime` and confirm none rely on the advisory text as a blocking signal.
- [ ] CHK-FIX-004 [P0] Parser robustness: `fable-metrics.cjs` is exercised against malformed JSONL, missing-field records, and an empty lineage folder.
- [ ] CHK-FIX-005 [P1] Matrix axes listed: lineage source (codex/opus/opus-r4/deepseek/mimo/kimi), record completeness (full/partial/malformed), metric type (ratio/median/percentage).
- [ ] CHK-FIX-006 [P1] The `/doctor fable-mode` run reads only the path argument and the baseline snapshot; no process-wide or global state is mutated.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the implementation diff range when this phase is built, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or absolute home-directory paths in any new script
- [ ] CHK-031 [P0] Path inputs to `fable-metrics.cjs` and `fable-mode-check.cjs` are validated to resolve inside the provided spec/state root
- [ ] CHK-032 [P1] The `/doctor fable-mode` route makes no network calls
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized and free of placeholders
- [ ] CHK-041 [P1] `fable-metrics.cjs` header documents the metric definitions and the durable WHY (no spec paths or artifact ids in code comments)
- [ ] CHK-042 [P2] `model-benchmark.md` note added if the secondary delivery option is taken
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
| P0 Items | 13 | 0/13 |
| P1 Items | 15 | 0/15 |
| P2 Items | 7 | 0/7 |

**Verification Date**: Pending implementation (this phase is PLANNED)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] The build-vs-port and delivery-surface decisions are documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have a status (Proposed for this PLANNED phase)
- [ ] CHK-102 [P1] The `leak_test.py` port and the benchmark-only delivery are recorded as rejected alternatives with rationale
- [ ] CHK-103 [P2] No migration path needed (no schema or stored-data change); recorded as N/A
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] `fable-metrics.cjs` completes a 002-corpus run in seconds on a developer machine (NFR-P01)
- [ ] CHK-111 [P1] A partial or malformed lineage does not abort the run; coverage is reported (NFR-R01)
- [ ] CHK-112 [P2] Load testing not applicable (one-shot read); recorded as N/A
- [ ] CHK-113 [P2] Baseline run time noted alongside the snapshot
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in plan.md (revert advisory edit, remove route, leave inert script)
- [ ] CHK-121 [P0] No feature flag needed; advisories ship advisory-by-default and the route is read-only
- [ ] CHK-122 [P1] No new monitoring; the metric script is a manual diagnostic, recorded as N/A
- [ ] CHK-123 [P1] `/doctor fable-mode` usage documented in the route asset
- [ ] CHK-124 [P2] Deployment runbook not applicable (no deploy step); recorded as N/A
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Path-handling review: both scripts resolve inputs inside the provided root and write nothing during a `/doctor` run
- [ ] CHK-131 [P1] No new third-party dependencies introduced (Node stdlib only)
- [ ] CHK-132 [P2] No web surface; OWASP review not applicable, recorded as N/A
- [ ] CHK-133 [P2] Reads only committed spec-folder artifacts; no sensitive data handling
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] spec.md, plan.md, tasks.md, checklist.md, and decision-record.md are synchronized
- [ ] CHK-141 [P1] The `doctor_fable-mode.yaml` asset documents inputs and read-only behavior
- [ ] CHK-142 [P2] The `model-benchmark.md` note records `/doctor fable-mode` as primary (if the secondary option is taken)
- [ ] CHK-143 [P2] The captured baseline is referenced from implementation-summary.md when this phase is built
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | Technical Lead | Pending (phase PLANNED) | |
| Packet owner | Product Owner | Pending (phase PLANNED) | |
| Packet owner | QA Lead | Pending (phase PLANNED) | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

