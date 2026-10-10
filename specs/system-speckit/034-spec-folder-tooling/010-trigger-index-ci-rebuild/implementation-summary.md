---
title: "Implementation Summary: Rebuild the trigger index in CI"
description: "CI now repairs trigger index drift instead of only reporting it, through a rebuild workflow that commits the index when a push leaves it stale, guards against loops and races, and reports a rejected push by naming branch protection."
trigger_phrases:
  - "trigger index ci rebuild implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/010-trigger-index-ci-rebuild"
    last_updated_at: "2026-10-10T05:59:39Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Closed phase 010 with CI and actionlint evidence"
    next_safe_action: "Operator confirms the push token expiry date"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-trigger-index-ci-rebuild-close"
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
| **Spec Folder** | 010-trigger-index-ci-rebuild |
| **Completed** | 2026-10-10. Implementation landed 2026-10-07, and the live runs on `main` ran from 2026-10-07 to 2026-10-09 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A push that leaves the committed trigger index stale is now repaired by CI instead of merged with a warning. The new job regenerates the index and commits it when it changed, so agents stop searching an index that misses the newest packets.

### Phase 10: trigger-index-ci-rebuild

`.github/workflows/trigger-index-rebuild.yml` runs on pushes to `main` and `skilled/**` and on manual dispatch. It has `contents: write`, a concurrency group per ref, and a skip when the head commit's subject is the rebuild subject, so its own commit cannot loop. It checks out with the `TRIGGER_INDEX_PUSH_TOKEN` secret, falling back to the default token, runs the generator, commits only `runtime/data/trigger-index.json` when `git diff` shows a change, and prints an error line that names the secret when the push fails. The commit carries a body because the commit-message check requires one. The drift message in `.github/workflows/advisory-checks.yml` now points at this job.

### Changes on main after the first live runs

This section records two later changes without rewriting the phase's original scope above. `abb53ecc69` installed the spec-kit workspace before the generator runs, after the first live run failed with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared`. `f0ea65aeef` hardened the job in three ways. The loop guard matches a `Trigger-Index-Rebuild: ci` trailer at the end of the commit message. The job stages the index and three fixture sidecars (`corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`), checks that all four exist, and runs the generator's `--check` before it pushes. A non-fast-forward rejection resets to the new tip, regenerates, and retries once.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/trigger-index-rebuild.yml` | Created | Rebuild the index on the integration branches and commit it when it changed |
| `.github/workflows/advisory-checks.yml` | Modified | Point the drift message at the rebuild workflow |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The workflow and the advisory pointer were applied directly in the worktree, and the job then ran live on `main`. On 2026-10-10 the verification was completed from CI and git. `actionlint` exits 0 on the committed workflow, the run blocks pass `bash -n`, and the live runs committed and pushed the index. The working tree holds further uncommitted edits to the same workflow. `actionlint` passes that copy too, but CI has not run it. The receipts are in `scratch/evidence/actionlint-trigger-index-rebuild.txt` and `scratch/evidence/ci-bot-commit-proof.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repair in CI after merge instead of blocking pull requests | The operator chose repair over a gate, so drift is fixed without adding a merge blocker |
| Push with a fine-grained token owned by the admin | The `main` ruleset requires a commit-message check that never runs on a default-token push, and GitHub returned 422 when the Actions app was added as a bypass actor, because the repository belongs to a personal account. The admin role bypasses the ruleset. The operator chose this over a GitHub App and a local hook |
| Skip the job when the head commit's subject is the rebuild subject | A token push runs under the owner's name, so an actor check would not stop the rebuild commit from retriggering the workflow. Superseded by `f0ea65aeef`, which matches a `Trigger-Index-Rebuild: ci` trailer at the end of the message, because a hand-made commit that quotes the subject would skip its own rebuild (see Known Limitations) |
| One concurrency group per ref | Two near-simultaneous pushes would otherwise race on the same file |
| Commit only the index file | Any other path the job touched would be an unreviewed bot change. Superseded by `f0ea65aeef`, which stages the index and its three fixture sidecars so the sidecars cannot go stale (see Known Limitations) |
| Report a failed push with an error that names branch protection | The repository setting belongs to the operator, and the message says what to change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| YAML parse of `.github/workflows/trigger-index-rebuild.yml` | PASS |
| `actionlint` on the committed workflow and on the working tree | PASS, exit 0 with no output (`scratch/evidence/actionlint-trigger-index-rebuild.txt` sections 1 and 2) |
| `bash -n` over each run block of the committed workflow | PASS, exit 0 for all three blocks, and the commit block is now 114 lines (section 3) |
| Live run commits and pushes the index | PASS, run 37704306595 pushed `2d2c8fcd55`, run 37986342243 pushed `4669db6522` (`scratch/evidence/ci-bot-commit-proof.txt` sections 4 and 5) |
| `--check` on the current head | PASS, "trigger index matches the corpus" with 0 stale documents (section 4) |
| Loop guard | PASS, 17 of 17 bot commits had their own rebuild run skipped (section 2) |
| Push that leaves the index current | PASS, 3 successful runs found the index current and pushed no commit (section 7) |
| Non-fast-forward race | PASS, run 37761007246 rejected its first commit, retried, and pushed `08af7d089` (section 6) |
| `validate-message.mjs --commit` on the rebuild commit message | PASS, exit 0 |
| `validate.sh --strict` on this packet | PASS, `RESULT: PASSED`, Errors 0, Warnings 0 (`scratch/evidence/validate-010-closure.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The token expiry is not verified here.** The secret `TRIGGER_INDEX_PUSH_TOKEN` exists and was last updated 2026-10-07T17:35:14Z, per `gh secret list`. Its expiry date is set in GitHub and cannot be read from this environment. The token acts as the admin, so the operator confirms the expiry date.
2. **Commit scope: resolved by supersession.** The spec scope and T006 describe a job that commits `runtime/data/trigger-index.json` only, and this phase shipped that index-only commit. Phase 016/004 superseded it on purpose. The job now stages the index and its three fixture sidecars, and that phase's spec records the four files at lines 71 and 197 (`../016-research-recommendations/004-trigger-index-rebuild-hardening/spec.md`). The workflow matches that later phase, so no open question remains.
3. **Loop guard: resolved by supersession.** The spec, T004 and the Key Decisions describe a skip that matches the rebuild subject, and this phase shipped that subject match. Phase 016/004 superseded it on purpose with a `Trigger-Index-Rebuild: ci` trailer, matched at the end of the head commit message (`../016-research-recommendations/004-trigger-index-rebuild-hardening/spec.md`, lines 72, 109 and 195). The workflow matches that later phase, so no open question remains.
4. **The first committing run had no `--check`.** Run 37704306595 pushed `2d2c8fcd55` before `f0ea65aeef` added the in-job `--check`. The `--check` result for the current head is in run 37986342243 (`scratch/evidence/ci-bot-commit-proof.txt` section 4).
5. **The working tree holds uncommitted workflow edits.** At recording time the working copy of `trigger-index-rebuild.yml` differed from HEAD by 116 changed lines. CI has not run those edits. This phase's live evidence covers the committed version.
6. **The changelog entry is written.** The Phase Context asked for a refresh of this phase's changelog file. The entry is `../changelog/changelog-034-010-trigger-index-ci-rebuild.md` in the parent's changelog folder, and the nested changelog generator wrote it from this packet.
<!-- /ANCHOR:limitations -->

---
