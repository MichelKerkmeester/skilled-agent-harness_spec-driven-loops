---
title: "Task Breakdown: Publishing A Branch Is A Decision, Not A Default"
description: "Check, record, delete, harden, prove."
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
# Task Breakdown: Publishing A Branch Is A Decision, Not A Default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P0] For each remote branch, count commits absent from the reserved branch and confirm a local ref exists. Evidence: nine branches, eight holding one or two unmerged commits, one fully merged, all nine present locally.
- [x] T-002 [P0] Record every branch with its exact commit id before deleting anything.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Delete the nine branches from origin, leaving the release and reserved branches.
- [x] T-102 [P0] Replace the release wildcard in the built-in allowlist with an allowlist file listing the approved release branch.
- [x] T-103 [P0] Refuse creating a remote branch unless it is allowlisted or named for that one push.
- [x] T-104 [P1] Accept the named form in the permission gate as well, so one approval covers both gates.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] Local work survived. Evidence: each deleted branch still resolves as a local ref.
- [x] T-202 [P0] Origin carries only the release and reserved branches.
- [x] T-203 [P0] The blanket switch cannot create. Evidence: driving the hook with a new-branch ref and the blanket value is refused; naming the branch is allowed.
- [x] T-204 [P1] No new suite failure. Evidence: 20 passing against a recorded baseline of 3 pre-existing failures, two of which remain and one of which this work fixed.
- [x] T-205 [P0] Record that the live hook is a symlink into the primary checkout, so the hardening takes effect there only once merged.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- Origin holds only approved branches, and no session can add one.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 … REQ-004
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
