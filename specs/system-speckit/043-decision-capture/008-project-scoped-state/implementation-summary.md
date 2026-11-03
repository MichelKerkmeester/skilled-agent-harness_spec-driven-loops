---
title: "Implementation Summary"
description: "Each project that links `.skilled` now keeps its decision-capture queue and consumed log in its own hashed subfolder, so a save in one project no longer lists or hides another project's answers. Pre-fix root files stay readable. One playbook still quotes its new glob and fails, so the phase is not closed."
trigger_phrases:
  - "project scoped state implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/008-project-scoped-state"
    last_updated_at: "2026-11-03T10:30:00Z"
    last_updated_by: "orchestrator-closeout"
    recent_action: "Built and verified the project-scoped state; recorded the open save-writer playbook glob"
    next_safe_action: "Fix the quoted glob in the save-writer playbook, then mark AC-010"
    blockers:
      - "AC-010: decision-capture-save-writer.md quotes its subfolder glob, so the consumed-log checks fail"
    key_files:
      - ".skilled/hooks/decision-capture/lib/capture-core.mjs"
      - ".skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts"
      - ".skilled/skills/.state/decision-capture/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 90
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-project-scoped-state |
| **Completed** | Not closed: code built and verified 2026-11-03; AC-010 open |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A save in one linked project no longer lists another project's sessions as orphans or hides answers another project consumed. In the two-project rerun, a save in `app-b` printed `no session queues with pending records` where it used to print `1 session-a` from `app-a`.

### Phase 8: project-scoped-state

Every project that links `.skilled` used to write into one shared `.skilled/skills/.state/decision-capture/` folder. Each project now writes into a subfolder named by its project token: the first 12 hex characters of the SHA-256 of its canonical root. The root is the git top-level, found with `git rev-parse --show-toplevel` with `GIT_DIR` and `GIT_WORK_TREE` removed from the environment, passed through `realpath`; outside git it is the `realpath` of the folder, and a folder that does not exist falls back to its absolute path. The lookup is memoized per input. The ESM hook core and the TypeScript writer compute the same path, and the matcher no longer keeps its own copy. Every reader also reads the old root files, deduplicated by key, and only the subfolder is written, so no answer captured before the change goes missing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Modified | `canonicalRoot`, `projectToken`, scoped `queueDir`, `legacyDir`; `readQueue` and `readConsumedKeys` read both locations; `appendRecords` skips a key held in either queue or either consumed log |
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Modified | Token value across root, subfolder, symlink and exported `GIT_DIR`; outside git; legacy migration; two-project isolation |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Modified | Exports `stateDirPath` and `legacyConsumedLogPath`; `consumedLogPath` uses `stateDirPath`; `readConsumedRows` reads both logs deduplicated; `recordConsumedKeys` writes only the project log |
| `.skilled/skills/system-spec-kit/runtime/api/index.ts` | Modified | Re-exports `stateDirPath` and `legacyConsumedLogPath` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts` | Modified | ESM and TypeScript path parity for four directory shapes; legacy consumed rows read, never rewritten |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` | Modified | `STATE_DIR_SEGMENTS` and `stateDir` deleted; `readQueueRecords` unions the legacy root file; `--scan-orphans` lists only the project subfolder; `--release` rewrites both logs |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/match-decision-table.vitest.ts` | Modified | Legacy queue read, legacy release, legacy root queue not listed, second linked project not listed |
| `.skilled/skills/.state/decision-capture/README.md` | Modified | `<project-token>/` row, the legacy root files, the sanctioned `.skilled` link exception |
| `.skilled/hooks/README.md` | Modified | The tree line says answers are queued per project |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | Modified | Names the hashed subfolder |
| Six `decision-capture-*.md` playbooks under `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/` | Modified | Conversation checks resolve the folder through `queueDir(".")`; shell checks glob `decision-capture/*/`; the real-repo hash walks files recursively; the kill-switch check drops `-maxdepth 1` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three code changes, core, writer and matcher, went to `gpt-6-luna` at xhigh on the fast tier through cli-codex, one change per brief. Luna hit its usage limit only after finishing the matcher brief; that code and its tests were read and rerun. After each return the orchestrator read the diff and reran the suite. The orchestrator edited the docs and the six playbooks, parsed the three conversation JSON blocks and ran `bash -n` on every edited check. The two-project run was repeated in the session scratchpad and deleted after.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hashed subfolder under `.skilled` | A project-local folder outside `.skilled` would add an untracked folder and an ignore rule to every linked project; see `plan.md` §3 |
| The helper resolves the root itself | Every producer agrees whatever folder it passes, a subfolder or a symlinked path included |
| Dual-read, single-write | The old root cannot say which project wrote a file, so moving it would guess; reading it keeps every pre-fix answer visible |
| `--scan-orphans` lists only the subfolder | A shared root queue would again name another project's session; the README tells the operator how to clear the root files |
| `symlinked_queue_path_escape` stays open | A containment check would reject every linked project, because the sanctioned `.skilled` link resolves outside the project root |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hooks `node --test` over `lib`, `bin`, `claude`, `devin` | PASS: 111 tests, 111 pass, 0 fail, exit 0 (baseline 99 plus 8). A later rerun printed 109 of 111: both failures are chat-question tests reading `chat-questions.mjs`, which another phase was editing at that moment and this phase never touched; `capture-core.test.mjs` alone 25 of 25 |
| Writer, matcher and `hook-session-stop.vitest.ts` | PASS: 52 of 52 (baseline 27 plus 19), rerun the same |
| Pi vitest | PASS: 10 of 10 |
| OpenCode plugin test | PASS: 6 pass, 0 fail |
| Runtime typecheck, eslint on the five changed TS files, runtime and `cli` build | PASS: each exit 0; `cli/dist/continuity/match-decision-table.js` holds 4 `stateDirPath` hits |
| sk-code quality gate over the seven changed code files, changed lines | PASS: `gate=NO_BLOCKER_FOUND exit=0`, findings 0 |
| Two linked projects in the scratchpad | PASS: `{"appended":1,"skipped":0}`; `queueDir(app-a) === queueDir(app-b) after realpath: false`; `readConsumedKeys(app-b) holds app-a key: false`; matcher `1 session-a` for `app-a`, `no session queues with pending records` for `app-b` |
| Path probe with `GIT_DIR` and `GIT_WORK_TREE` on another repository | PASS: trailing slash, subfolder, relative `.` and the hostile env give one folder from both runtimes; a missing folder falls back without throwing |
| `--release` of a key in both consumed logs | PASS: the row printed once per log, exit 0, both logs left at 0 bytes |
| `rg -c "projectToken\|stateDirPath"` over the three files | PASS: matcher 4, writer 5, core 2 |
| `rg -n "STATE_DIR_SEGMENTS ="` | PASS: only `decision-record-writer.ts:125`; the matcher count prints nothing, exit 1 |
| Playbook `rg` from T011 | FAIL as written: eight lines, all subfolder globs. The flat-root form prints nothing, exit 1. `decision-capture-save-writer.md` steps 3 to 5 quote the glob, which never expands |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The save-writer playbook check fails.** Steps 3, 4 and 5 of `decision-capture-save-writer.md` write `"$F/.skilled/skills/.state/decision-capture/*/consumed.jsonl"` inside double quotes, so the shell never expands the `*` and `wc -l` reports no such file. Move the `*` outside the quotes, or resolve the folder through `queueDir`, then amend the T011 verify pattern to the flat-root form.
2. **The six playbooks have not run live.** Their checks were parsed and passed `bash -n`, but no live conversation reran them; the runner belongs to another packet.
3. **A `.skilled` below the git top-level stays open.** The root rule takes the git top-level first, so such a project would keep its state under the top-level. No linked project has that shape today.
4. **One `git` call per project per process.** Each git-repo project now spawns one `git rev-parse --show-toplevel` per process to find its root; the result is memoized per input, so later calls cost nothing.
5. **The state folder still resolves outside the project.** The token scopes data but does not contain it, so `symlinked_queue_path_escape` stays open as a sanctioned-link exception.
6. **Pre-fix root files stay shared.** A legacy root consumed row still hides the same key in every linked project until the root file is cleared; keys carry the session id, so a collision needs the same session.
<!-- /ANCHOR:limitations -->

---
