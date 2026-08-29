---
title: "Implementation Plan: Publishing A Branch Is A Decision, Not A Default"
description: "Prove nothing is lost, delete, then close the hole that let them appear."
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
# Implementation Plan: Publishing A Branch Is A Decision, Not A Default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Clean up, then fix the cause. The cleanup is irreversible from the remote, so it
runs only after every branch is shown to exist elsewhere, and only with the
restore recipe written down first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every branch deleted has a local ref, checked individually.
- Origin lists only the approved release branch and the reserved branch.
- The hook's own suite gains no failure.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two gates already existed for naming and permission. A third runs before them
for the case they both treated as ordinary: a push whose remote side does not
exist yet. Creation is separated from update because their consequences differ.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Prove nothing is lost

For each branch: how many commits it holds that are not in the reserved branch,
and whether a local ref still points at them.

### Phase 2: Record the undo, then delete

Branch names with their exact commit ids, written down before anything is
removed.

### Phase 3: Close the hole

The release wildcard becomes an allowlist file. Branch creation stops being
something the environment can authorise.

### Phase 4: Prove the gate

The hook's suite, then the hook driven directly with a synthetic ref for each
case.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The suite covers the contract. Driving the hook directly covers the three cases
that matter: a plain push is refused, a blanket bypass cannot create, and naming
the branch can.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The naming library that decides whether a branch is allowlisted.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The hook change reverts with the commit. Any deleted branch is restored from its
recorded commit id, which the local refs still hold.
<!-- /ANCHOR:rollback -->
