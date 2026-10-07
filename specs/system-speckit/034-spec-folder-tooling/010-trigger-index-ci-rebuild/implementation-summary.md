---
title: "Implementation Summary: Rebuild the trigger index in CI"
description: "CI now repairs trigger index drift instead of only reporting it, through a rebuild workflow that commits the index when a push leaves it stale, guards against loops and races, and reports a rejected push by naming branch protection."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild"
    last_updated_at: "2026-10-07T11:03:21Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Wrote the implementation summary for the trigger index CI rebuild and refreshed the continuity block"
    next_safe_action: "Push to an integration branch and confirm the first live run commits the index and makes --check pass"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-trigger-index-ci-rebuild-close"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 010-trigger-index-ci-rebuild |
| **Completed** | 2026-10-07, implementation only, the live workflow run is pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A push that leaves the committed trigger index stale is now repaired by CI instead of merged with a warning. The new job regenerates the index and commits it when it changed, so agents stop searching an index that misses the newest packets.

### Phase 10: trigger-index-ci-rebuild

`.github/workflows/trigger-index-rebuild.yml` runs on pushes to `main` and `skilled/**` and on manual dispatch. It has `contents: write`, a concurrency group per ref, and a skip when the actor is `github-actions[bot]` so its own commit cannot loop. It runs the generator, commits only `runtime/data/trigger-index.json` when `git diff` shows a change, and prints an error line that names branch protection when the push fails. The drift message in `.github/workflows/advisory-checks.yml` now points at this job.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/trigger-index-rebuild.yml` | Created | Rebuild the index on the integration branches and commit it when it changed |
| `.github/workflows/advisory-checks.yml` | Modified | Point the drift message at the rebuild workflow |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The workflow and the advisory pointer were applied directly in the worktree. Verification is local so far. The new file parses as YAML, `actionlint` is not installed so no schema check ran, and no push has exercised the job. A live run needs a push, which has not happened.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repair in CI after merge instead of blocking pull requests | The operator chose repair over a gate, so drift is fixed without adding a merge blocker |
| Skip the job when the actor is the bot | The rebuild commit would otherwise retrigger the workflow on its own push and loop |
| One concurrency group per ref | Two near-simultaneous pushes would otherwise race on the same file |
| Commit only the index file | Any other path the job touched would be an unreviewed bot change |
| Report a failed push with an error that names branch protection | The repository setting belongs to the operator, and the message says what to change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| YAML parse of `.github/workflows/trigger-index-rebuild.yml` | PASS |
| `actionlint` schema check | Not run, `actionlint` is not installed |
| Live workflow run | Not run, a live run needs a push, which has not happened |
| `bash -n` over the commit step's shell block | Not recorded |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The job has not run live.** Until a push reaches it, REQ-001 and SC-001 stay unverified.
2. **No schema check ran.** `actionlint` is not installed in this environment, so only a YAML parse checked the new file.
3. **Branch protection may reject the bot's push.** The job then fails and prints an error line that names branch protection. Only the operator can grant `contents: write` or a bypass.
<!-- /ANCHOR:limitations -->

---
