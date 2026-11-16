---
title: "Implementation Summary"
description: "The Codex hook check now runs in a linked worktree, Pi and DSH show it only when it fails, and the spec-kit Vitest configs no longer carry the alias for the removed Pi fallbacks."
trigger_phrases:
  - "codex check and advisory fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/006-codex-check-and-advisory-fixes"
    last_updated_at: "2026-11-16T11:04:21Z"
    last_updated_by: "generate-context"
    recent_action: "Deep review: FAIL, six P2 doc findings"
    next_safe_action: "Fix R3-P2-002 first, then rerun the review"
    packet_purpose: "Purpose: A session warns about Codex hook drift only when the check finds drift."
    blockers: []
    key_files:
      - "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:1029ad33875b055c1460751143f6b1ca1610da572a2ee49414f0a4976500ca6e"
      session_id: "scaffold-006-codex-check-and-advisory-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a4c37e98-2c3a-4c20-a7bf-acbc32e31f29"
      workspace: "/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup"
      savedAt: "2026-11-16T11:04:21Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-codex-check-and-advisory-fixes |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A session that starts in a linked worktree no longer reports Codex hook drift when the user-global file is clean. Pi and DSH no longer show the check's `OK` line as a warning on every start.

### Phase 6: codex-check-and-advisory-fixes

The installer's worktree guard now lets `--check` through, because a check writes nothing. A reconcile or a dry run still refuses a linked worktree unless `--allow-worktree` is passed. Pi and DSH mark the Codex check `quietOnSuccess`, so its output reaches the session only on a non-zero exit. Every other advisory check keeps showing what it prints. The installer's `OK` line stays, since tests and playbooks rely on it.

Both spec-kit suites gave the same counts with and without the alias, so the alias is gone from both configs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/install-codex-hooks.mjs` | Modified | `--check` passes the worktree guard |
| `.skilled/bin/tests/install-codex-hooks-source-root.test.cjs` | Modified | Linked-worktree test: a check reports drift and OK, a reconcile refuses and leaves the target unchanged |
| `system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs`, `system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | Modified | `quietOnSuccess` on the Codex check |
| `.skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs` | Modified | One test through the real check runner with a stand-in installer |
| `.skilled/hooks/session-lifecycle/tests/pi-session-start-advisories.test.ts` | Created | Three Pi tests: quiet on pass, warn on fail, other checks unchanged |
| `system-spec-kit/vitest.config.ts`, `system-spec-kit/runtime/vitest.config.ts` | Modified | Alias block removed |
| `codex-global-hooks-check/README.md`, `session-lifecycle/README.md`, `session-lifecycle/tests/README.md`, `.opencode/plugins/codex-hooks-watchdog.js` | Modified | Docs and one comment describe the new behavior |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

A probe ran the real Pi and DSH adapters against the primary checkout with only the Codex check on, and both showed the `OK` line. Each test was written first and seen to fail against the old code. Then the fix went in and the probes were rerun in the primary checkout and the worktree. The spec-kit suites ran four times, with and without the alias, through temporary alias-free config copies beside the originals. After the copies were deleted and the real configs edited, both suites ran again.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Fix the OK-line warning in the Pi and DSH adapters, not the installer | The installer's `OK` line is pinned by its tests, two playbooks and three changelogs, and Claude and Devin already drop stdout |
| A per-check `quietOnSuccess` flag, not an exit-code rule for every check | The other advisory scripts exit 0 by contract and print real warnings on stdout |
| `--check` only, not `--dry-run` | The operator approved the change for the check |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| New worktree test before the fix | Fails: the check was refused instead of reporting `DRIFT` |
| `node --test .skilled/bin/tests/install-codex-hooks-*.test.cjs` | 20 of 20 pass |
| `node .skilled/bin/install-codex-hooks.mjs --check` in this worktree | `install-codex-hooks: OK ...`, exit 0. `--dry-run` still prints the refusal |
| DSH suite, old adapter and new | New test 0 of 1 on the old adapter, suite 13 of 13 on the new one |
| Pi advisory test, old adapter and new | 1 failed and 2 passed on the old adapter, 3 of 3 on the new one |
| Advisory probes after the fix, primary checkout and worktree | `DSH injected: []` and `Pi notified: []` in both |
| Hook `node --test` files, 93 of them | 1892 pass, 0 fail |
| Hook Vitest | 506 of 506 in 10 files |
| `sync-runtime-mirrors --check`, `sync-hook-registrations --check` | PASS, 257 mirrors and 22 Pi extensions |
| spec-kit runtime Vitest 4.1.12, with alias and without | 1484 passed, 13 skipped both ways. The one failure in both was the drift guard reading the temporary config copy |
| spec-kit root Vitest 4.1.12, with alias and without | 4074 passed, 33 skipped both ways, same one failure |
| Both suites on the final configs | Runtime 1485 passed, 13 skipped, 0 failed. Root 4075 passed, 33 skipped, 0 failed |
| Three READMEs: `validate_document.py`, `hvr_scan.py`, both README checkers | `VALID`, `hard blockers: 0`, pass on all three |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A worktree judges orphans against its own tree.** A worktree on an older branch can report an orphan that the primary checkout would not. The check only reports, so run it in the primary checkout to confirm.
2. **Cursor still gets the `OK` line on stdout.** Cursor's `sessionStart` command does not redirect the installer's stdout, so a clean check prints the `OK` line there. That was not part of the reported finding and is unchanged.
3. **`--dry-run` still needs `--allow-worktree` in a worktree.** It writes nothing either, but the operator approved the change for `--check` only.
<!-- /ANCHOR:limitations -->

---
