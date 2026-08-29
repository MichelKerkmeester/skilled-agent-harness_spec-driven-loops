---
title: "Feature Specification: Publishing A Branch Is A Decision, Not A Default"
description: "Only approved branches reach origin, and no session can create a remote branch on its own."
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
# Feature Specification: Publishing A Branch Is A Decision, Not A Default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Origin carried nine branches nobody had decided to publish — six dedicated
branches and three worktree branches, each holding one or two commits that also
existed locally. They accumulated because publishing was the easy path.

Two holes let that happen. The built-in allowlist matched the release line by
wildcard, so anything shaped like a release branch reached origin ungated,
including a name produced by a typo. And the environment bypass was a blanket
switch: setting it authorised any push in that command, including creating a
branch that had never existed. A session could publish a branch by deciding to,
which is the opposite of asking.

Creating a remote branch is the act that outlives the session. An update can be
reset; a branch nobody meant to publish stays until someone notices it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- Removing the nine unapproved branches from origin.
- Replacing the release wildcard with a reviewable allowlist file.
- Refusing remote branch creation unless the branch is allowlisted or named
  explicitly for that one push.

**Out of scope**

- Deleting local branches. The work stays on the machine that made it.
- The naming and mass-deletion gates, which are unchanged.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Origin carries only branches someone approved | P0 |
| REQ-002 | No branch is deleted from origin whose commits exist nowhere else | P0 |
| REQ-003 | A blanket bypass cannot create a remote branch | P0 |
| REQ-004 | A one-off publish remains possible without a permanent approval | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Origin lists only the release branch and the reserved branch.
- Creating a branch with the blanket switch is refused; naming it succeeds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| A deleted branch held the only copy of some work | Unrecoverable loss | Every branch was checked for a local ref and for unmerged commits before deletion; all nine had one, and their exact commit ids were recorded so any can be restored |
| The gate blocks a legitimate publish | Work cannot be shared | Naming the branch in the environment variable approves that one creation without granting anything else |
| The hook is shared by symlink from the primary checkout | The hardening is not live until that checkout has it | Stated plainly rather than assumed; the change takes effect there once merged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 8. RELATED DOCUMENTS

- `.opencode/skills/sk-git/references/remote-branch-policy.md` — the policy this enforces
<!-- /ANCHOR:related-docs -->
