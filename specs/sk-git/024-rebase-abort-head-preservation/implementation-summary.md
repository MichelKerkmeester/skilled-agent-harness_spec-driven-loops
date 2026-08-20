---
title: "Implementation Summary: Rebase-Abort HEAD Preservation"
description: "Shipped a pre-existing-rebase refusal and a pre-rebase-HEAD restore in both live-sync reconcilers so a stale/foreign rebase can no longer silently rewind a branch. Proven by a hermetic fail-first regression test."
trigger_phrases:
  - "rebase abort head preservation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/024-rebase-abort-head-preservation"
    last_updated_at: "2026-08-20T08:35:00Z"
    last_updated_by: "sk-git"
    recent_action: "Shipped foreign-rebase refusal + HEAD restore across reconcile + git-sync; test green"
    next_safe_action: "Land on main and v4; watch the reconcile log for a refused pre-existing rebase"
    blockers: []
    key_files:
      - ".opencode/bin/git-primary-reconcile.sh"
      - ".opencode/bin/git-sync.sh"
      - ".opencode/bin/tests/git-rebase-abort-head-preservation.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-implementation-summary"
      parent_session_id: null
---
# Implementation Summary: Rebase-Abort HEAD Preservation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-rebase-abort-head-preservation |
| **Completed** | 2026-08-20 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Two protective guards, symmetric across both live-sync reconcilers, so a stale or foreign rebase state directory can no longer cause a silent branch rewind. Before rebasing, each script now detects a pre-existing `rebase-merge` / `rebase-apply` directory and refuses to touch it. After any own-rebase abort, each script compares HEAD to the pre-rebase commit and force-restores it if it moved, so a rewind can neither be left in place nor mislabeled `aborted cleanly`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/git-primary-reconcile.sh` | Modified | Refuse a pre-existing rebase; restore `ORIGINAL_HEAD` after any abort |
| `.opencode/bin/git-sync.sh` | Modified | Same refusal; add HEAD-identity restore around the abort using `HEAD_SHA` |
| `.opencode/bin/tests/git-rebase-abort-head-preservation.test.sh` | Created | Hermetic fail-first regression test (5 cases, 14 assertions) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered test-first: a hermetic regression test that plants an authentic stale `rebase-merge` was written and shown to fail on the unmodified scripts (both reconcilers rewound HEAD), then the two guards were added and the suite went green (`PASS=14 FAIL=0`). The change ships in this packet's own commit on `skilled/v4.0.0.0` and `main`, and activates passively at the next SessionStart reconcile / post-commit sync.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Refuse a pre-existing rebase rather than abort it | Aborting a rebase this script did not start rewinds the branch to a foreign orig-head; refusing is the only safe option |
| Actively restore HEAD, not just detect | The scripts already captured the pre-rebase commit; putting HEAD back is the point of capturing it |
| Leave `git-live-follow.sh` unchanged | It is fast-forward-only; it was the collateral advance, not the destructive actor |
| Do not chase the stale directory's provenance | Refusing to touch a foreign rebase is correct regardless of how it appeared |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Fail-first | Reproduced | Unmodified scripts: both stale cases FAILED — HEAD rewound to the stale orig-head, `FAIL=2`; matches the incident's reconcile-log signature `rebase abort assertion failed; original=<new> current=<stale>` |
| Regression | Pass | Fixed scripts: `PASS=14 FAIL=0`, exit 0 — HEAD preserved on both stale cases (SC-001); genuine conflict aborts cleanly with the commit preserved and no false failure (SC-002); clean divergence rebases and publishes to the remote (SC-003) |
| Static | Pass | `bash -n` clean on both scripts |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Passive activation** — the fix takes effect at the next SessionStart reconcile / post-commit sync; it does not retroactively repair a branch already rewound in a prior run.
2. **Refusal surfaces, does not resolve** — when a pre-existing rebase is detected the script blocks and points the operator at `git status`; it deliberately does not auto-continue or auto-abort someone else's rebase.
3. **Provenance not chased** — the packet does not diagnose why a stale rebase directory appears; that is a separate hygiene question.

<!-- /ANCHOR:limitations -->
