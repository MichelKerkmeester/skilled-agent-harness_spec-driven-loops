---
title: "Implementation Summary: advisor_validate Alias-Aware Gold Matching (F1a) — Pending"
description: "Planned, not yet implemented. Specifies the alias-aware gold-matching fix for advisor_validate that recovers the reported corpus accuracy from 50.78% to ~74.09%."
trigger_phrases:
  - "F1a implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/001-advisor-validate-alias-matching"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced F1a; pending implementation"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-001"
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
| **Spec Folder** | 028-skill-advisor-playbook-run/005-finding-remediation/001-advisor-validate-alias-matching |
| **Completed** | Pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. This phase is specified and ready for `/speckit:implement`. When implemented, `advisor_validate` gold matching will canonicalize both the recommended `topSkill` and the corpus `expected` label through `lib/scorer/aliases.ts` before comparison, so the 53/193 rows labelled `sk-deep-research`/`sk-deep-review` count as hits against the live `deep-research`/`deep-review` IDs — restoring the reported metric from 50.78%/42.5% to a projected 74.09%/65.0% with no scorer change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Modify (planned) | Alias-aware comparison at both gold-match sites |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery path: `/speckit:implement` on this phase, then re-run `advisor_validate` + `skill_advisor_regression.py` to confirm the metric lift and no regression.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the metric layer (validate), not the corpus | Alias-aware matching keeps legacy labels working and avoids churning the corpus file; the scorer is correct |
| Keep separate from F1b (phase 002) | The genuine P0 routing failures are a scorer-layer concern, independent from this metric fix |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| advisor_validate full-corpus ≥0.72 / holdout ≥0.63 | Pending |
| No previously-passing row regresses | Pending |
| tsc + advisor-validate vitest | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Specification only; root cause verified in `../research/research.md` §3 F1a.
2. **~8 drifted rows may still fail** after alias normalization — triaged in phase 002 (scorer vs prompt-quality).
<!-- /ANCHOR:limitations -->
