---
title: "Implementation Summary"
description: "Five approved decisions freeze the commit grammar: a repository-wide ordinal, the packet path in Spec:, a hook whitelist that lands first, a stamper that re-mints on cherry-pick, and no new repo rule."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/002-format-decision"
    last_updated_at: "2026-09-11T07:16:26Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the decision phase with operator approval"
    next_safe_action: "Open phase 003 with the hook whitelist and its tests"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 002-format-decision |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The grammar phases 003 to 006 will build is now a contract, not a draft. It survived an adversarial review from a second model family, and the operator approved all five decisions on 2026-09-11.

### Phase 2: format-decision

[What this feature does and why it exists. 1-2 paragraphs. Use direct address.
Explain what the user gains, not what files you touched.]

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `decision-record.md` | Created | Five decisions, alternatives, consequences, five checks, operator approval |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus reviewer was briefed with the proposal and told to break it, read-only. It returned ten objections, two of them design-blocking. The conductor accepted eight, wrote five decisions, and asked the operator only the two preference forks, bundling the rest. Every reversed recommendation was reproduced with a command before it entered the record.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repository-wide ordinal instead of a packet-derived key | 15 track-number prefixes already name two packets each, and one third of commits touch no packet |
| Hook whitelist lands before the stamper | A body of machine keys satisfies the four-path gate today; the stamper would kill that gate everywhere |
| Re-mint on cherry-pick | 210 repeated patch ids in 2,000 commits; git's own cherry-pick state detects the copy for free |
| No new repo rule | REPO RULES.md keeps mechanics in skills; the one posture gap fits the delegation rule |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five decisions with status Accepted and an approval row | PASS |
| validate.sh 002-format-decision --strict | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The allocator's cold start scans history.** About 0.15 seconds per mint without the cache. Phase 003 caches the high-water mark under the common Git directory.
2. **A cherry-pick loses its source id.** `git cherry-pick -x` keeps the source hash, and the phase 005 remap keeps that hash valid.
<!-- /ANCHOR:limitations -->

---


