---
title: "Implementation Summary"
description: "This phase is planned. It will compare failing rule sets instead of verdicts in two CI gates, and pass the previous sweep artifact as a baseline."
trigger_phrases:
  - "ci rule set comparison implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "planning-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-ci-rule-set-comparison |
| **Status** | Planned |
| **Level** | 2 |
| **Created** | 2026-10-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Will Be Built

This phase is planned and not yet built. When completed, it will fix two CI gates to compare actual changes instead of just pass/fail verdicts.

### Phase 7: ci-rule-set-comparison

The changed-packet gate in `.github/workflows/changed-packet-validation.yml` will be updated to extract rule names from validator output and compare the sets, not just the verdicts. A packet that fails different rules at base and head will now be reported as a regression. The weekly sweep in `.github/workflows/strict-pass-freshness-report.yml` will receive the previous artifact as a baseline so it can report actual regressions instead of all failures. When no baseline exists, the job proceeds without error and reports all failures as the baseline for the next run.

### Files That Will Change

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/changed-packet-validation.yml` | Modified | Extract and compare rule sets instead of verdicts (lines 131-147) |
| `.github/workflows/strict-pass-freshness-report.yml` | Modified | Download and pass previous artifact as baseline (line 56) |
| `.github/workflows/README.md` | Modified | Document the rule-set comparison approach and baseline handling |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare rule sets instead of verdicts | Catches real regressions (new rules failing) even when the verdict is the same |
| Graceful handling of missing baseline | First run of the weekly sweep has no previous artifact to compare against, so it reports all failures and serves as the baseline |
| Extract rule names from validator output | Rules are already named in the validator output; no changes to the validator itself are needed |
<!-- /ANCHOR:decisions -->

---
