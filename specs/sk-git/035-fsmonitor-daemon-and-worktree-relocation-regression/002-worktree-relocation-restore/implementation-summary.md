---
title: "Implementation Summary"
description: "A launch without an explicit worktree base no longer pins the in-checkout default into config, and the doctor now warns when worktrees pile up inside the main checkout."
trigger_phrases:
  - "worktree relocation restore implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/002-worktree-relocation-restore"
    last_updated_at: "2026-10-27T22:15:15Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Moved 145 and 218 out; 217 stays until the reaper removes it after it merges"
    next_safe_action: "Mark AC-006 Met once the numbered reaper has removed worktree 217 and the count prints 0"
    blockers:
      - "Worktree 217 is still inside the checkout, live and unmerged, AC-006"
    key_files:
      - ".skilled/bin/worktree-session.sh"
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 83
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
| **Spec Folder** | 002-worktree-relocation-restore |
| **Completed** | In progress, code shipped 2026-10-27 |
| **Level** | 2 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session launch can no longer quietly move every future worktree back inside the main checkout. The doctor also now says so when that has already happened.

### Phase 2: worktree-relocation-restore

`worktree-session.sh` used to write whatever base it resolved into `speckit.worktreeBase` whenever the key was unset. One launch without `SPECKIT_WORKTREE_BASE` therefore pinned the in-checkout default for good. That is how the relocation from sk-git/026 came undone. The wrapper now records where the base came from. It writes the key only when the base came from `SPECKIT_WORKTREE_BASE`. When it falls back to the default, it writes nothing and logs that the in-checkout default is in effect and how to move it.

The doctor's `worktrees` row now compares the base with the main checkout as real paths. It reports DEGRADED when the base is inside the checkout and more than three linked worktrees exist, because the main checkout's fsmonitor then sees every file in them. Run against this checkout, it reports exactly that, for 4 worktrees.

Moving the existing worktrees out (T015 to T020) is the operator's step. 145 and 218 moved on 2026-10-27. 217 stays, because its session is live and its branch is unmerged, until the numbered reaper removes it after it merges.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/worktree-session.sh` | Modified | Base source recorded, write-back limited to an explicit `SPECKIT_WORKTREE_BASE`, log line for the default |
| `.skilled/bin/tests/worktree-session.test.sh` | Modified | Default, empty-variable and config-source cases beside the unchanged env-base case |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | In-checkout check with a three-worktree limit |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | Five cases: four inside, three inside, outside, sibling prefix, symlink |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash 1017 at `max` built two units through `cli-opencode`, one at a time, with fsmonitor disabled for its git calls and with any `git config` write on this repository banned. The orchestrator read each diff, confirmed that `speckit.worktreeBase` was still unset in this repository after each unit, and ran the wrapper, reaper, naming and doctor suites. It then ran the doctor read-only against this checkout and searched CI for anything that fails on the doctor's exit code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Persist only a base from `SPECKIT_WORKTREE_BASE` | The launch environment is the one explicit choice no later process can see, while a recorded default silently pins worktrees inside the checkout |
| Degrade above three linked worktrees, confirmed by the operator | A few short-lived worktrees inside the checkout are tolerable, and the outage happened with eleven or more |
| Compare real paths with a separator boundary | A symlink into the checkout must count as inside, and a sibling folder sharing the checkout's name prefix must not |
| Leave the worktree move to the operator | Moving a worktree another session is using breaks that session |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/bin/tests/worktree-session.test.sh` | PASS, `PASS=63 FAIL=0`, up from 54 |
| `bash .skilled/bin/tests/worktree-reaper.test.sh` | PASS, `PASS=24 FAIL=0` |
| `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | PASS, `PASS=171 FAIL=0`, unchanged |
| `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | PASS, `# pass 71`, up from 66 |
| Doctor on this checkout | DEGRADED on `worktrees` only, 4 linked worktrees, exit 3 |
| Doctor after the 145 move | `worktrees` PASS, two linked worktrees left, `fsmonitor daemons: 1 main, 1 worktree, 0 stray` |
| `git config --get speckit.worktreeBase` after both units | exit 1, still unset |
| CI reference to `git-setup-check` | None |
| Fix commit | `dc79b967df` (fix(sk-git): persist only an explicitly chosen worktree base), found with `git log -S'WT_BASE_SOURCE' -- .skilled/bin/worktree-session.sh` |
| Rerun 2026-10-27 | `worktree-session.test.sh` `PASS=76 FAIL=0`, exit 0; `git-setup-check.test.cjs` `# pass 77`, `# fail 0` with `SPECKIT_WORKTREE_BASE=''` and with `'../escape'` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One worktree is still inside the checkout.** 145 and 218 moved out on 2026-10-27, and 231 was removed by its own session. 217 stays because its session is live and its branch is unmerged. The numbered reaper's session-start sweep removes it once it is merged, clean and idle for 48 hours, and AC-006 closes then. With `core.fsmonitor=false` kept in this checkout (`../005-reaper-hardening/spec.md` section 10), no main daemon watches it meanwhile.
2. **Resolved: new sessions land outside the checkout.** The default base is still `.worktrees`, but T018 set `speckit.worktreeBase` to `~/worktrees/public`, and `git config --get speckit.worktreeBase` still prints that on 2026-10-27.
3. **Closed as UNKNOWN: what unset the key earlier.** It cannot be recovered from disk: no shell history line or `.git/config` backup names it. The guard stops the default from being written again, whatever caused it.
<!-- /ANCHOR:limitations -->

---
