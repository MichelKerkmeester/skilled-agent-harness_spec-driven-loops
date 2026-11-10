Review verdicts for the four commits are below. `PASS` means no P0/P1 findings; any P2 follow-ups are listed.

- **b7a43d9cd5 — FAIL**
  - P1 b7a43d9cd5 `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:821` — When a lock is older than the stale window, the sweep unlinks it even if its recorded PID is alive. A long-running owner can therefore lose its lock while updating state, allowing a second writer to lose an increment -> for readable owners, remove only when the owner is confirmed dead; use age only for unreadable locks.
  - P1 b7a43d9cd5 `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:471` — A contender with a stale snapshot can rename a live replacement lock, then try to restore it. Another contender can create a lock in the gap; the original owner and new owner may then update state concurrently. The “only one contender’s rename” comment is not true for this sequence -> use a recovery protocol that does not vacate a nonmatching live lock, or prevents acquisition until restoration completes.
  - P2 b7a43d9cd5 `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:388` — PID reuse makes a dead owner appear alive, so acquisition can time out and return `persisted: false` until a later sweep -> track and verify process-incarnation identity, not only the numeric PID.
  - P2 b7a43d9cd5 `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:623` — The fixed 50/300 ms delays do not guarantee which child reaches the rename first; the count assertion can pass without exercising the loser’s restore path -> coordinate that interleaving with an explicit barrier.

- **1df4dddee0 — PASS**
  - P2 1df4dddee0 `.opencode/plugins/system-skill-advisor.js:1019` — If the slot-release callback runs after the enqueue deadline but before its timer callback, `grant()` can clear the timer and start a fresh bridge timeout. The tests deliberately avoid this boundary -> store the absolute deadline, reject an overdue waiter before granting, and cover the boundary ordering.

- **e2ada51448 — PASS**
  - P2 e2ada51448 `.opencode/plugins/session-relaunch.js:36` — The comment says ctime moves on every write, but Node documents `ctimeMs` precision as platform-specific. On a filesystem that coalesces timestamps, a same-size in-place rewrite can retain the same mtime, ctime and inode, reusing stale flags -> qualify the guarantee and use a content fingerprint when stat identity can collide. [Node.js fs documentation](https://nodejs.org/api/fs.html#stats-ctimems)

- **410696410c — PASS**

The changes use no spec paths or phase identifiers in comments or test names. The cleanup comment gives the actual timeout plus grace bound, and its new test asserts the output cap and both signals.

**Verification:** the five focused advisor and cleanup tests passed; `node --check` on all eight changed source/test files and `git diff --check` on all four commits exited 0. The full four-file test run exited 1 because the read-only sandbox rejected fixture `mkdtemp` with `EPERM`, even with `TMPDIR` inside the worktree, so tests requiring filesystem fixtures remain unverified.

During review, HEAD advanced to `039fa4d2f2`, which touches only unrelated post-edit-quality files. I did not make that commit or modify any reviewed file.

VERDICT: FAIL