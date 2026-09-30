---
title: "Feature Specification: Require a commit body on every authored commit"
description: "sk-git required a commit body only when four or more paths were staged, so small commits went in with a subject alone and lost their reason. This packet makes the body mandatory for every authored commit and has the commit-msg hook refuse a commit without one."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
  - "commit body always required"
  - "commit-msg body gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Require a commit body on every authored commit

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-28 |
| **Branch** | `main` (no branch created) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`SKILL.md` section 6 asked for a commit body only when a commit staged four or more paths, and the `commit-msg` hook enforced exactly that by counting staged files. A one-path commit went in with a subject alone, so a search through history found what changed but never why. The operator's rule is that a description is always needed, and the skill and the hook both contradicted it.

### Purpose
Every authored commit carries a prose body that says why, and the `commit-msg` hook refuses any authored commit without one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `commit-msg` hook drops the staged-path count and requires a prose body on every authored commit.
- The hook tests cover the new rule, and the prepare-commit-msg test fixture that commits through both hooks passes a body.
- `SKILL.md`, its references, the commit message template, the feature catalog page and manual testing scenarios GIT-004 and GIT-044 state the same rule.
- Every doc example and every script that commits under the global hooks passes a body.
- A release entry, `changelog/v1.7.0.0.md`, and the `1.7.0.0` version in `SKILL.md` and `README.md`.
- The Sync Loop expiry proof in the AI Systems repo, whose throwaway commit needs a body.

### Out of Scope
- Rewriting existing history. The hook checks each message as it is written, so old commits stay as they are.
- The `Spec:` and `Commit-Id:` trailer rules. They are unchanged.
- Per-document `version:` values across sk-git. They were stale before this change and the reference says not to reconcile them to quiet `verify`.
- Safety-refusal scenarios GIT-008 and GIT-009, whose subject-only commands are documented and never executed.
- Peer work in the shared tree.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/commit-msg` | Modify | Remove the staged-file count and require a body unconditionally |
| `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` | Modify | Add cases 18 to 20 and reword the case 4 header |
| `.skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh` | Modify | Give the both-hooks fixture commit a body |
| `.skilled/scripts/git-hooks/tests/README.md` | Modify | Describe the every-commit body gate |
| `.skilled/skills/sk-git/SKILL.md`, `README.md` | Modify | Body contract and version `1.7.0.0` |
| `.skilled/skills/sk-git/changelog/v1.7.0.0.md` | Create | Release entry |
| `.skilled/skills/sk-git/references/*.md`, `assets/*.md` | Modify | State the rule and add a body to every example |
| `.skilled/skills/sk-git/feature-catalog/`, `manual-testing-playbook/` | Modify | Catalog page, GIT-004 and GIT-044 |
| `.skilled/commands/deep/assets/*.yaml`, `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modify | Checkpoint commits pass a body |
| `.skilled/scripts/install-git-hooks.sh`, `.skilled/hooks/git/README.md` | Modify | Test commit and example pass a body |
| `.skilled/skills/system-spec-kit/runtime/cli/references/spec-root-alias-retirement-runbook.md`, `.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md` | Modify | Runbook commands pass a body |
| `AI Systems/z — Claude Project Sync Loop/prove_review_expiry.py` | Modify | Fixture commit passes a body (AI Systems repo) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The `commit-msg` hook refuses an authored commit that has no prose line below the subject, whatever the number of staged paths |
| REQ-002 | A message whose only lines below the subject are trailers such as `Spec:` or `Commit-Id:` counts as having no body |
| REQ-003 | `Merge`, `Revert "`, `fixup!`, `squash!` and `amend!` subjects stay exempt |
| REQ-004 | The hook keeps its bypass, `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`, and refuses attribution keys as before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `SKILL.md`, the references, the template, the catalog page and the playbook scenarios state one rule with no four-path threshold |
| REQ-006 | Every example and script that commits under the global hooks passes a body, so following them does not run into the hook |
| REQ-007 | The hook and sk-git tests pass, and a negative control shows the one-path subject-only commit flipping from accepted to refused on real commits |
| REQ-008 | A `v1.7.0.0` changelog entry exists and the skill version reads `1.7.0.0` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A one-path commit with only a subject, and one with only a `Spec:` trailer, are refused by the hook that runs for every commit on the machine.
- **SC-002**: The hook suite, the pre-commit, pre-push, prepare-commit-msg, source-root, autostash, mass-deletion, commit-id, stamp-branch and worktree-naming suites, and the sk-git JavaScript tests all pass against their recorded baselines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The global `core.hooksPath` points at the shared tree, so the edit runs for every commit on the machine as soon as it is saved | High | Find and fix every caller that commits subject-only under the global hooks, and keep the documented bypass |
| Risk | A script or doc example that commits subject-only now fails | Medium | Repo-wide scan for subject-only commit commands, each one given a body |
| Dependency | The Sync Loop expiry proof lives in the AI Systems repo | Low | Fix it in a separate commit in that repo |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The hook stays a single pass over the message with no extra git calls.

### Security
- **NFR-S01**: The change does not widen what the bypass allows and does not weaken the attribution-key refusal.

### Reliability
- **NFR-R01**: A rejected commit prints one error that names the rule and the bypass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty message: refused, as before.
- Body of blank lines only: counts as no body.
- Invalid format: the existing subject checks still run.

### Error Scenarios
- Git-generated subject with no body: passes, because Git wrote it.
- Message with a body and a `Spec:` trailer: passes.

### State Transitions
- Amend of an old subject-only commit: refused until a body is added, the same as any authored message.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One hook, one skill, about 25 doc and script surfaces |
| Risk | 14/25 | Machine-wide hook, live on save |
| Research | 4/20 | The caller sweep and the version contract |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose a new packet, docs plus the hook, and the current branch.
<!-- /ANCHOR:questions -->

---
