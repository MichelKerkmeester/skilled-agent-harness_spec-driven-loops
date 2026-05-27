---
title: "Implementation Summary: Regression-Harness Alias-Awareness & Stale Test Path — Pending"
description: "Planned, not yet implemented. Specifies alias-aware gold matching for both regression harnesses and a stable workspace-root anchor for the lane-weight-sweep test."
trigger_phrases:
  - "harness alias impl summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/007-harness-alias-and-stale-path"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "Filed; pending implementation"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-skill-advisor-playbook-run/005-finding-remediation/007-harness-alias-and-stale-path |
| **Completed** | Pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. Filed during phase 002 to track two out-of-scope P1 defects. When implemented it makes the regression/parity harnesses resolve gold and top skill IDs through the published alias groups before comparison (so `deep-research` satisfies an `sk-deep-research` label, matching the phase-001 approach applied to `advisor_validate`), and re-anchors `lane-weight-sweep.vitest.ts` on a stable marker instead of a renamed 026 packet path so the suite runs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../scripts/skill_advisor_regression.py` | Modify (planned) | Alias-aware gold matching |
| `.../handlers/advisor-validate.ts` | Modify (planned) | Alias-aware harness/corpus matching |
| `.../tests/scorer/lane-weight-sweep.vitest.ts` | Modify (planned) | Stable workspace-root anchor |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery: implement, then confirm the named alias P1 rows pass in both harnesses, P0 stays 12/12, and the full TS + Python suites are green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Alias-resolve in the harness layer, not relabel fixtures | Keeps ground-truth labels intact and matches the phase-001 (F1a) approach |
| Separate phase from 002 | These are test/harness defects, not scorer behavior; deferred to keep the P0 fix focused |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| deep-* alias P1 rows pass (both harnesses) | Pending |
| P0 stays 12/12 both scorers | Pending |
| Full TS suite + Python unit suite green | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Root cause confirmed during phase 002 verification; this packet only files the work.
<!-- /ANCHOR:limitations -->
