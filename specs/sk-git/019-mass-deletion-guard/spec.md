# Spec — Mass-Deletion Guard for Commits and Pushes

## Status
Complete

## Problem

A `git add -A && commit` taken against a working tree that is **behind** the branch
it sits on records every not-yet-present branch file as a **deletion**. On
2026-08-13 an external orchestrator's "sync accumulated cross-session WIP" commit
did exactly this and silently erased **902 tracked files** (an entire hooks hub,
a shipped packet, changelogs) off the release branch; it hit at least three
sessions. A separate 2026-05-04 incident had a dispatched agent with unrestricted
FS write delete 44 files across two phase folders. Both destructive events went
through the ordinary git CLI, so a hook-level ceiling on deletions-per-operation
is the cheapest place to stop the next one before it reaches history or origin.

## Goal

Refuse any single commit (primary) or push (backstop) that removes more than a
configurable number of tracked files, unless the operator explicitly authorizes
that one operation. Never disrupt normal work; never wedge git on a guard bug.

## Requirements

- **R1** — Block a commit whose staged index deletes more than the threshold of
  tracked files. Threshold default 100, overridable per-invocation.
- **R2** — `SPECKIT_ALLOW_MASS_DELETION=1` authorizes a single blocked operation;
  `SPECKIT_MASS_DELETION_THRESHOLD=<n>` sets the ceiling.
- **R3** — Additions and modifications are never blocked; only net tracked-file
  deletions count.
- **R4** — Fail-open: any error, missing lib, or non-numeric input allows the
  operation. A guard bug can never block a commit or push.
- **R5** — A push backstop exists in the pre-push source and applies to every
  branch (releases included, since the motivating clobber targeted a release
  branch that the other pre-push gates skip). It is dormant only where the
  machine's `core.hooksPath` omits `pre-push` — see Constraints.
- **R6** — Blocked operations print how to authorize/raise the ceiling and append
  an audit line to `<git-dir>/mass-deletion-guard.log`.

## Constraints

- This machine sets `core.hooksPath` to `~/.config/git/hooks`, which symlinks the
  repo's `pre-commit` (so the commit guard is live) but **not** `pre-push`. Wiring
  `pre-push` there would also activate the repo's dormant naming/permission gates
  and disrupt in-flight worktree pushes, so it is intentionally left unwired; the
  push code ships ready for when `pre-push` is wired.
- Fail-open is mandatory: the guard is defense-in-depth, not a correctness gate.

## Non-goals

- Server-side (GitHub) enforcement, or catching tools that push via a git library
  (libgit2/isomorphic-git) that never invokes local hooks.
- Removing the external orchestrator that caused the incident (done separately).

## Acceptance criteria

1. Commit deleting >threshold tracked files is blocked; with the override it
   succeeds. (proven: tracked test)
2. Commit adding any number of files, or deleting ≤threshold, is never blocked.
3. Empty/non-numeric counts and a missing lib fail open (allow).
4. The commit guard runs on the real repo via the effective hooks path.
