---
title: "Verify Before Completion Claims"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-05-31"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - done
  - committed
  - complete
  - finished
  - it works
  - passed
  - green
  - claim completion
  - verify before claiming
---

# Verify Before Completion Claims

## Rule

Never claim an outcome ("done", "committed", "validate passed", "green", "it works") from the **absence** of an error. Gate every completion on a positive check whose result you actually read.

## Why

Across long sessions, status was repeatedly stated BEFORE it was true — a commit silently blocked by the comment-hygiene pre-commit gate, a strict-validate that was actually FAILED, a doc Edit that silently failed ("string not found") yet was credited in the commit message, a Step-0 boot marked PASS when the daemon had exited with EINVAL, and a fabricated commit hash written into a memory for a commit that never landed. Each was caught only by a later re-check. A false "done" is worse than a slow "done" because downstream steps build on a state that isn't real. (Owner: "Report outcomes faithfully"; "never claim an unverified commit/file.")

## How to apply

- **Commit** → re-read `git log -1` (correct subject) + `git show --stat HEAD` (expected file count) + `git status` shows the files clean; confirm `local HEAD == origin/main` after push. Never quote a commit SHA you have not just read back.
- **Validate** → parse the `RESULT:` line / exit code; do not assume PASS from no error.
- **Edit** → confirm the new text is on disk; the Edit tool errors if `old_string` didn't match — treat that error as "the change did NOT happen."
- **Tests** → read the actual `passed/failed` summary, not just exit behavior.
- Make commits **validate-gated and scope-guarded** (explicit pathspecs, assert 0 out-of-scope staged) so a wrong claim cannot reach `main`. Related: bash-output-truncation (the hazard that masks several of these) and parallel-session file reverts.
