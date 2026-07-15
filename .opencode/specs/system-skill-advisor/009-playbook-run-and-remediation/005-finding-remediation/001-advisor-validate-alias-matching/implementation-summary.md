---
title: "Implementation Summary: advisor_validate Alias-Aware Gold Matching (F1a) — Complete"
description: "Shipped: advisor_validate gold matching is alias-aware, recovering the reported corpus accuracy from 50.78%/42.5% to 74.09%/65.0% with no scorer change."
trigger_phrases:
  - "F1a implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Shipped alias-aware gold matching in advisor_validate"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-001"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 009-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching |
| **Completed** | 2026-05-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`advisor_validate` gold matching now canonicalizes both the recommended `topSkill` and the corpus `expected` label through `lib/scorer/aliases.ts` (`skillMatchesAlias`) before comparison, so the 53/193 rows labelled `sk-deep-research`/`sk-deep-review` count as hits against the live `deep-research`/`deep-review` IDs. This restores the reported metric from 50.78%/42.5% to 74.09%/65.0% with no scorer change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Modify | Alias-aware comparison at both gold-match sites (`skillMatchesAlias`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Shipped in the remediation commit; verified by re-running `advisor_validate` (full-corpus 50.78%→74.09%, holdout 42.5%→65.0%) and the parity tests, with no previously-passing row regressing.
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
| advisor_validate full-corpus / holdout | 74.09% / 65.0% (from 50.78% / 42.5%) |
| No previously-passing row regresses | confirmed (parity tests green) |
| tsc + advisor-validate vitest | clean / pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **~8 drifted rows still fail** after alias normalization — a prompt-quality vs scorer triage item, not an alias defect.
2. **The regression harnesses were a separate gap** — alias-awareness in `skill_advisor_regression.py` / `evaluateRegressionCases` shipped later in phase 007.
<!-- /ANCHOR:limitations -->
