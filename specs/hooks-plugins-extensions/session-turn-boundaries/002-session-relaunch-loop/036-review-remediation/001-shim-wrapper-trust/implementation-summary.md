---
title: "Implementation Summary: The shell shim runs only a wrapper it can trust"
description: "The shell shim now runs a skilled-loop wrapper only when its real path is inside the checkout the shim was sourced from, a registered linked worktree of it or a checkout the operator named, so a cloned repository can no longer get its own script run by typing a runtime name."
trigger_phrases:
  - "shim wrapper trust implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/001-shim-wrapper-trust"
    last_updated_at: "2026-11-12T10:01:30Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the phase after two fix rounds and an SWE review"
    next_safe_action: "Verify nothing; phase closed"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs"
      - ".skilled/bin/README.md"
      - ".skilled/hooks/session-relaunch/README.md"
    session_dedup:
      fingerprint: "sha256:126e047a2812711bb5a4c8e9fbe22be69b014725922325089bf84695731a1960"
      session_id: "scaffold-001-shim-wrapper-trust"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 001-shim-wrapper-trust |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Typing `claude` inside a cloned repository no longer runs that repository's own `.skilled/bin/skilled-loop`. The shim runs a wrapper only when its real path is inside the checkout the shim was sourced from, inside a linked worktree that checkout registers, or inside a checkout named in `SKILLED_LOOP_TRUSTED_CHECKOUTS`. In every other directory the plain runtime binary runs.

### Phase 1: shim-wrapper-trust

Before this phase the shim walked up from the current directory and ran the first `.skilled/bin/skilled-loop` it found. Any repository you entered could therefore supply the script your shell ran. The shim now stores its own checkout when it is sourced and compares real paths before it prints a wrapper.

You keep the loop in every place you had it on purpose. A repository whose `.skilled` is a symlink to your checkout still qualifies, and so does every worktree your checkout registers, because git is asked from the sourced checkout and never from the directory being judged. A checkout that is neither needs one entry in `SKILLED_LOOP_TRUSTED_CHECKOUTS`, a colon-separated list of absolute paths. When the shim cannot name its own checkout it trusts nothing by itself.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop-shell.sh` | Modified | Stores the sourced checkout, resolves real paths, guards `skilled_loop_find_wrapper` with the three trust rules, removes the git environment from the worktree query and prints the real path it checked |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modified | Adds the outside-wrapper, linked-worktree, `.git`-file, trusted-checkout, symlinked-shim, lost-checkout and inherited-`GIT_DIR` cases for bash and zsh |
| `.skilled/bin/README.md` | Modified | The shell shim row names the trust rule and the variable |
| `.skilled/hooks/session-relaunch/README.md` | Modified | The shim section names the trust rule and the variable |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna built the change through `codex exec` in three passes, each test first, and the orchestrator reran every command outside the builder's sandbox, which blocks `ps`. The outside-wrapper run failed before the fix: `scratch/red.txt` records 24 tests, 18 pass and 6 fail (restored from the builder's recorded run after a later pass overwrote the file), the six being the outside-wrapper, `.git`-file and trusted-checkout cases under bash and zsh. The orchestrator's read of the first diff found three defects, fixed in the second pass with `scratch/red-2.txt` (28 tests, 3 fail). SWE then reviewed the diff read-only through Devin and returned CONDITIONAL with one P1 and four P2. The P1 and two P2 were confirmed and fixed in the third pass with `scratch/red-3.txt` (30 tests, 6 fail). The final runs are `scratch/green.txt` for the shim file and `scratch/green-full.txt` for the whole relaunch suite. The evidence is pinned to the diff range `5dafa313e8..working tree` on branch `worktrees/351-session-relaunch-review-remediation`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Linked worktrees of the sourced checkout are trusted without configuration | Every session in an sk-git worktree would otherwise lose the loop, and the list comes from `git -C <sourced checkout>`, so a directory cannot vouch for itself |
| Extra checkouts live in `SKILLED_LOOP_TRUSTED_CHECKOUTS` | An environment variable needs no new file and an unset value trusts nothing extra |
| An untrusted wrapper ends the walk-up | Climbing past it would run a parent's wrapper for a repository the operator did not choose |
| A shim that cannot name its checkout trusts nothing by itself | The first pass fell back to the directory the shell started in, and `git -C ""` answers for the current directory |
| The worktree query runs without the git environment | An inherited `GIT_DIR` made `git -C` list another repository, confirmed by a probe with two fresh repositories |
| The resolver prints the real path it checked | The file the check read is then the file `bash` runs, and the wrapper already resolves its own location through symlinks |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | PASS: 30 tests, 30 pass, 0 fail, exit 0, in `scratch/green.txt` |
| The same file before the fix | FAIL as required: 24 tests, 18 pass, 6 fail in `scratch/red.txt` |
| `/bin/bash -n` and `/bin/zsh -n` on the shim | PASS: both exit 0 |
| `rg -n 'setopt\|set -[a-z]' .skilled/bin/skilled-loop-shell.sh` | PASS: one line, `set -uo pipefail` inside the `skilled_loop_resolve` subshell |
| `rg -l 'sourced checkout'` on both README files | PASS: both paths print |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | PASS: 827 tests, 827 pass, 0 fail, exit 0, in `scratch/green-full.txt` (baseline 813) |
| SWE review through Devin, read-only | CONDITIONAL, then the P1 and two P2 fixed. Two P2 stay open as limitations 1 and 2 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A worktree path that git has to quote is not trusted.** A registered worktree whose path holds a double quote or a line break is printed quoted by `git worktree list --porcelain`, so the shim does not match it and the plain binary runs. Name that checkout in `SKILLED_LOOP_TRUSTED_CHECKOUTS`.
2. **No test launches a runtime beside a planted wrapper.** The outside-wrapper case stops at the resolver printing nothing. The launch fallback for an empty answer is covered by the existing direct-launch cases.
3. **A shell copy that keeps only the functions loses the loop.** The stored checkout is a shell variable. A tool shell rebuilt from a function snapshot has none, so it trusts only `SKILLED_LOOP_TRUSTED_CHECKOUTS`. Such shells have no terminal and never started the wrapper before.
<!-- /ANCHOR:limitations -->

---


