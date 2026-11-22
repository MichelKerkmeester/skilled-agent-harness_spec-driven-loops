---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "request pipeline implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/005-request-pipeline"
    last_updated_at: "2026-11-22T10:48:31Z"
    last_updated_by: "template-author"
    recent_action: "Planned the phase, nothing built"
    next_safe_action: "Wait for phases 1 and 3, then start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-request-pipeline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-request-pipeline |
| **Status** | Planned |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Nothing is built yet. This phase is planned and waits on phases 1 and 3.

### Phase 5: request-pipeline

When built, this phase lets any producer write one run request that ends in exactly one run or in quarantine with a reason. It adds `bots enqueue`, a hand-run `bots drain` and an opt-in post-commit leg. See `spec.md` for scope and `decision-record.md` for the four open decisions.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Not started | The planned files are listed in `spec.md` section 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Not delivered. The planned proof is the task order in `tasks.md`, starting with the two hook test baselines.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The git-hook trigger fires in every trusted checkout (ADR-001, Accepted) | The operator chose it. The linked-worktree test belongs to the publish leg, and a primary-checkout bot would never fire under it |
| Answers come back as requests of kind `resume`, keyed on the needs-you item id, and `bots answer` lives here (operator decision D12) | The operator chose a decision queue and moved the answer verb here. Keying on the item id makes a second answer a duplicate |
| A held bot's requests go to quarantine with reason `held-needs-you` (operator decision D9) | The same rule as paused requests, so the watched folder always empties |
| Enqueue refuses while identity is unknown | The operator chose an explicit `identity` in `bots/config.json`, so two remote-less repositories never share a state folder |
| ADR-002 to ADR-004 | Accepted by operator decision D11: retry bound 3, sibling folders, paused requests to quarantine |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Implementation checks | Not run. Nothing is built |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The hook leg's CLI lookup in a consumer repository is open.** A repository that trusts its hooks through `skilled.trustRepoHooks=true` and carries a vendored tree needs a settled path to the `bots` CLI. Phases 1 and 8 must answer it before the leg ships there.
<!-- /ANCHOR:limitations -->

---


