---
title: "Implementation Summary"
description: "Containment git calls wait out a neighbour's index.lock with bounded backoff, and a loss that outlasts the budget is a ledger warning instead of an invisible empty snapshot."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/004-index-lock-retry"
    last_updated_at: "2026-09-14T09:09:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Added the index.lock retry and ledger warning and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-index-lock-retry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-index-lock-retry |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A neighbour's `index.lock` can no longer make the containment guard read an empty tree as a clean one. `spawnGit` in `runtime/lib/deep-loop/write-containment.ts` retries a git call whose stderr names the lock with 250, 500, 1000 and 2000 ms backoff, returns on the first attempt for every other failure, and records a call that spends its whole budget. `drainGitContentionWarnings()` hands those records to the runner, which drains after each containment snapshot and the enforce call in `runtime/scripts/fanout-run.cjs` and appends a `containment_git_contention` warning naming the command. The lane's verdict is untouched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi. The delegate found that Apple Git 2.50 makes the status refresh optional under a held lock, confirmed it in git's source, and built the fixtures with a real held lock plus a shim that makes only `git status` emit the fatal; `git checkout` reproduces it for real. The orchestrator reviewed the diff and ran the whole deep-loop suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retry only on the lock file name | Every other non-zero exit is permanent and must keep failing open on the first attempt |
| Record losses in a drainable list | The module's return types stay unchanged; the runner reports at the sites it already writes the ledger |
| Budget of 3.75 s across four sleeps | Outlasts a neighbour's multi-second write while staying far below any run timeout |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Two-second-lock test against unmodified wrapper | FAIL as expected: snapshot empty during the lock |
| Both touched test files plus typecheck | PASS, exit 0, 204 tests |
| Full deep-loop suite | `npm test` in the runtime: 156 files, 2666 passed, 7 skipped, exit 0, 1263 s |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Real git status under a lock.** Apple Git 2.50 skips the index refresh when the lock is held and exits 0, so on this machine the status fatal is reproduced through a shim; the checkout path reproduces it for real and goes through the same wrapper.
<!-- /ANCHOR:limitations -->

---


