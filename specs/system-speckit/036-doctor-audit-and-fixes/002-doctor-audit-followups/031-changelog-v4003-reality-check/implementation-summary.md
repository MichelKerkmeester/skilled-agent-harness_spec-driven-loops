---
title: "Implementation Summary"
description: "The v4.0.0.3 changelog now matches the code and covers the specs shipped since v4.0.0.2."
trigger_phrases:
  - "changelog v4003 reality check summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/031-changelog-v4003-reality-check"
    last_updated_at: "2026-10-05T19:30:00Z"
    last_updated_by: "changelog-v4003-reality-check"
    recent_action: "Corrected v4.0.0.3 claims and added coverage for shipped specs"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.3.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "changelog-v4003-reality-check"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-changelog-v4003-reality-check |
| **Completed** | 2026-10-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The release notes say what shipped, checked claim by claim.

### Phase 31: changelog-v4003-reality-check

- **Claim fixes.** The injection screen runs on Claude Code, Devin, OpenCode, Pi and Hermes. Citation drift already ran by default and the benchmark features apply under their scorers. Each Jev answer carries its route. Spec docs outside scratch folders fell from 31 contextType values to 12. The hooks usually run machine-wide through a global `core.hooksPath`. The removed projection was opt-in.
- **Coverage.** Advisor status truth, the stress suite in CI, the removed message-check bypass, contract lookup order, the linear-time regex fallback, the Dependabot exemption, Gate 6 and the Devin cut, rule concision and phrases, the description budget, the changelog style, the write-recipe fixes, deep-research bookkeeping, large ledger events, native Claude Code dispatch, the Layer 3 baseline, Code Mode's fresh-clone build, the Pi provider rename and the workflow security work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.3.md` | Modified | Claim fixes and coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two read-only audits proposed the findings. Each was confirmed against the code, a commit or a packet summary before it was written, and three audit wordings were corrected on the way, among them the cause of the advisor hash disagreement.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave out bookkeeping-only and research-only packets | They change nothing a user sees |
| Treat the removed bypass as breaking | The variable existed at v4.0.0.2 and now has no effect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| validate_document.py | VALID, 0 issues |
| hvr_scan.py | 0 hard blockers, ceiling 98 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The release is untagged, so the entry has no full-changelog link yet.
<!-- /ANCHOR:limitations -->

---
