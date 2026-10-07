---
title: "Implementation Summary"
description: "In progress: the second-pass subject plan builder and its tests exist; push, remap and hooks are not yet done."
trigger_phrases:
  - "second pass subjects and attribution implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/008-second-pass-subjects-and-attribution"
    last_updated_at: "2026-09-12T11:47:31+02:00"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Built the subject plan builder and its tests"
    next_safe_action: "Run the residual swarm, then the callback and hooks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-second-pass-subjects-and-attribution"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-second-pass-subjects-and-attribution |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The first tool of the second rewrite pass, not the pass itself. This phase is In Progress: the subject plan builder and its tests exist, and the push, the citation remap and the hook changes are not yet recorded as done.

### Phase 8: second-pass-subjects-and-attribution

`scripts/build-subject-plan.py` reads subject, body and changed paths for a pinned tip in one `git log` pass, joins each commit with the first pass's packet plan, applies subject rules R1 to R7, and writes one JSON object per commit plus a before-and-after review table. A commit the rules cannot resolve becomes a residual row carrying the reason and the context a later judge needs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/build-subject-plan.py` | Created | Rules R1 to R7, residual marking, review table |
| `scripts/tests/test_build_subject_plan.py` | Created | Tests for the plan builder |
| `scratch/briefs/008a-subject-plan.md`, `008b-swarm-shard.md`, `008c-callback-and-hooks.md` | Created | Dispatch briefs for the plan, the residual swarm and the callback and hook changes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The briefs split the pass into the subject plan, a swarm that judges residuals, and the callback and hook changes; only the first has an artifact on disk.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rules first, judgment only for residuals | A human rewrite of 9,000 subjects is not deterministic (spec out-of-scope) |
| Prose that mentions Anthropic is listed, not stripped | The spec leaves that call to the operator |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Second-pass criterion in `../goal.md` | Open: not yet met on origin |
| Plan builder tests | Not recorded in this packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase docs are mostly scaffold.** `tasks.md` and `acceptance-criteria.md` still hold template rows, so this summary records only what exists on disk.
<!-- /ANCHOR:limitations -->

---


