---
title: "Implementation Summary: PC-005 Bench Doc + Gate Calibration (F2) — Pending"
description: "Planned, not yet implemented. Specifies the PC-005 --dataset doc fix and warm/cold p95 gate recalibration."
trigger_phrases:
  - "F2 implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/003-pc005-bench-doc-and-gates"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced F2; pending implementation"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-skill-advisor-playbook-run/005-finding-remediation/003-pc005-bench-doc-and-gates |
| **Completed** | Pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. Specified and ready for `/speckit:implement`. When implemented it corrects the PC-005 scenario doc to include the required `--dataset` flag and recalibrates the bench gates so warm p95 uses the documented 50 ms envelope and cold p95 is advisory/subprocess-scoped (keeping `throughput_multiplier` as the real regression gate), with the stress vitest aligned. The native scorer is unchanged (it already passes at 3.69/6.71 ms).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../manual_testing_playbook/10--python-compat/005-bench-runner.md` | Modify (planned) | Add `--dataset` + smoke note |
| `.../mcp_server/scripts/skill_advisor_bench.py` | Modify (planned) | Recalibrate warm/cold p95 gates |
| `.../mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` | Modify (planned) | Align contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery: `/speckit:implement`, then run the corrected documented command + the stress vitest.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recalibrate gates rather than "fix" latency | The native scorer is not regressing; the gates were mis-scoped (warm too tight, cold = subprocess cold-start) |
| Keep throughput_multiplier strict | It is the meaningful Python-surface regression signal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Documented command runs (with --dataset) | Pending |
| Gates report pass/advisory on nominal host | Pending |
| Stress vitest aligned | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Root cause verified in `../research/research.md` §3 F2.
2. **Cold p95 budget needs host calibration** — kept advisory until measured on the intended bench host.
<!-- /ANCHOR:limitations -->
