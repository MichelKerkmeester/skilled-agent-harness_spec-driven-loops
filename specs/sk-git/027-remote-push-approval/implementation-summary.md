---
title: "Implementation Summary: Publishing A Branch Is A Decision, Not A Default"
description: "Nine unapproved branches removed, and the two holes that let them appear are closed."
trigger_phrases:
  - "remote push approval"
  - "branch creation gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/027-remote-push-approval"
    last_updated_at: "2026-08-29T21:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Cleared unapproved remote branches and closed the branch-creation hole"
    next_safe_action: "None outstanding"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/pre-push"
      - ".opencode/skills/sk-git/scripts/remote-branch-allowlist.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-skgit-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Publishing A Branch Is A Decision, Not A Default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-remote-push-approval |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Origin now carries the release branch and the reserved branch, and nothing else.
Nine others were removed: six dedicated branches and three worktree branches.
Every one still exists locally, so the work is where it was made rather than
gone.

Two holes let them accumulate. The built-in allowlist matched the release line
by wildcard, so anything shaped like a release branch published without anyone
being asked, including a name a typo could produce. That wildcard is gone; the
approved release branch is a line in an allowlist file, which is a thing a
person edits and a reviewer can read.

The larger hole was that the environment bypass authorised creation. A session
that set it could publish a branch that had never existed. Creation is now
refused unless the branch is allowlisted or named in the variable for that one
push. A blanket value still authorises updating a branch someone already
published; it can no longer conjure a new one.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Deletion came last, not first. Each branch was checked for commits absent from
the reserved branch and for a local ref, and the exact commit ids were written
down before anything was removed, so any branch can be restored to the commit it
pointed at.

The gate was then driven directly with a synthetic ref for each case, which is
what caught the fact that the live hook is a symlink into the primary checkout.
A real push through it was still using that checkout's copy and behaved as
though nothing had changed. The logic was right; the file being executed was a
different one.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Separate creation from update | An update can be reset; a branch nobody meant to publish stays until someone notices |
| Keep a one-off path by naming the branch | Otherwise the only way to publish once is a permanent approval, which is a worse outcome than the problem |
| Move the release line into a file | A wildcard approves branches nobody has seen; a file approves the ones someone wrote down |
| Check every branch before deleting any | Deletion from a remote is not undoable from the remote, only from a local copy that has to actually exist |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Nothing lost | PASS | All nine branches resolve as local refs after deletion |
| Origin is clean | PASS | Only the release and reserved branches remain |
| Blanket switch cannot create | PASS | A new-branch ref with the blanket value is refused by the creation gate |
| Named approval works | PASS | The same ref with the branch named passes both gates |
| Approved release still publishes | PASS | A dry-run push to the release branch is accepted with no environment variable |
| Suite | PASS | 20 passing; the 2 failures match a recorded pre-existing baseline, and one baseline failure was fixed |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hardening is not live in the primary checkout until this merges.** The
   installed hook is a symlink to that checkout's copy of the file, so the
   change takes effect there when it arrives, not when it was written here.
2. **A local hook is a speed bump, not a wall.** Anyone can bypass it with the
   flag git provides for that purpose. This makes publishing a deliberate act,
   not an impossible one.
3. **Two suite failures predate this work.** Both concern owner discovery and
   were failing before the change; they are recorded rather than fixed.

<!-- /ANCHOR:limitations -->
