---
title: "Implementation Summary: Skill Advisor P1 Routing & Abstention Tuning — Pending"
description: "Planned, not yet implemented. Scopes the residual non-alias P1 fixes into 5 root-cause classes with per-case evidence, approach, and a regression guard."
trigger_phrases:
  - "p1 routing tuning impl summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/006-p1-routing-tuning"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p1-tuning"
    recent_action: "Scoped; pending implementation"
    next_safe_action: "Implement class by class via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-006"
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
| **Spec Folder** | 028-skill-advisor-playbook-run/006-p1-routing-tuning |
| **Completed** | In Progress (Class E shipped 2026-05-27) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

In progress. This packet scopes the residual non-alias P1 regression failures into 5 root-cause classes (see spec §3) and implements them class by class.

**Class E (shipped):** "code audit" now routes to sk-code-review over the deep-review loop skill in the TS scorer (Python already routed it via an explicit booster), fixing P1-PHRASE-001. Verified: TS P0 12/12, full vitest 66/66, Python P0 12/12 unchanged, no regression.

**Class D (blocked):** routing `:review:auto` to deep-review conflicts with a documented decision (`skill_advisor.py` deliberately keeps "auto review" as sk-code-review). Needs the open question resolved first.

**Classes A, B, C (pending):** terse-phrase routing (needs TS confidence-floor work + Python booster calibration), CLI-vs-skill (Python), and greenfield abstention (highest risk; done last with adversarial guards).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../lib/scorer/fusion.ts` | Modify (planned) | Class A/C/D/E signals (TS) |
| `.../lib/scorer/scoring-constants.ts` | Modify (planned) | New calibration constants |
| `.../scripts/skill_advisor.py` | Modify (planned) | Class A/B/C/D/E signals (Python) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery: implement class by class, re-running both regression harnesses + parity tests after each class, reverting at the class granularity on any P0 regression or over-abstention.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Separate phase from 005 finding-remediation | These are scorer routing/abstention gaps, not the 5 playbook findings or alias drift |
| Implement class by class with verify-after-each | Bounds regression risk; each class is independently revertable |
| Class C (abstention) done last | Highest over-abstention risk; needs adversarial routable guards |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted P1 rows route/abstain as intended | Pending |
| P0 12/12 both scorers; no regression | Pending |
| Parity + full vitest green | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Per-case root cause captured in spec §3 from live probes of both scorers.
2. **Overfitting risk.** Fixes must prefer domain-meaningful signals and verify against the broader corpus, not just the fixture rows.
<!-- /ANCHOR:limitations -->
