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
    last_updated_at: "2026-10-07T15:05:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Wired the push token into checkout"
    next_safe_action: "Operator sets TRIGGER_INDEX_PUSH_TOKEN"
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

`.github/workflows/trigger-index-rebuild.yml` runs on pushes to `main` and `skilled/**` and on manual dispatch. It has `contents: write`, a concurrency group per ref, and a skip when the head commit's subject is the rebuild subject, so its own commit cannot loop. It checks out with the `TRIGGER_INDEX_PUSH_TOKEN` secret, falling back to the default token, runs the generator, commits only `runtime/data/trigger-index.json` when `git diff` shows a change, and prints an error line that names the secret when the push fails. The commit carries a body because the commit-message check requires one. The drift message in `.github/workflows/advisory-checks.yml` now points at this job.

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
| Push with a fine-grained token owned by the admin | The `main` ruleset requires a commit-message check that never runs on a default-token push, and GitHub returned 422 when the Actions app was added as a bypass actor, because the repository belongs to a personal account. The admin role bypasses the ruleset. The operator chose this over a GitHub App and a local hook |
| Skip the job when the head commit's subject is the rebuild subject | A token push runs under the owner's name, so an actor check would not stop the rebuild commit from retriggering the workflow |
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
| `bash -n` over the commit step's shell block | PASS, exit 0 |
| `validate-message.mjs --commit` on the rebuild commit message | PASS, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The job has not run live.** Until a push reaches it, REQ-001 and SC-001 stay unverified.
2. **No schema check ran.** `actionlint` is not installed in this environment, so only a YAML parse checked the new file.
3. **The push needs the operator's token.** Until the `TRIGGER_INDEX_PUSH_TOKEN` secret is set, the ruleset rejects the push and the job fails with an error line that names the secret. The token acts as the admin and expires on the date the operator picks.
<!-- /ANCHOR:limitations -->

---
