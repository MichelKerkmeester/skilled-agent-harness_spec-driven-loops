# Iteration 002: Security Review

## Dimension

Security.

## Files Reviewed

- `.skilled/scripts/git-hooks/pre-commit:14-61`
- `.skilled/bin/compiled-route.cjs:26-68`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:45-85`
- `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:76-141`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:664-722`
- `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:56-135`

## Findings by Severity

### P0

None.

### P1

#### R2-P1-001: Shared Git common-directory trust admits branch-controlled hook code

- Case: A maintainer checks out an untrusted contributor branch in a linked worktree of a trusted clone and commits. The trust check sees the same Git common directory, leaves `SOURCE_ROOT` pointed at the checked-out tree, then sources that tree’s `hook-flags.sh` during the commit.
- File: `.skilled/scripts/git-hooks/pre-commit:43`
- Evidence: The check marks a repository untrusted when the hook and current repository have different common Git directories, or when the local opt-in is absent. A linked worktree shares the common directory, so it passes. The hook then sources `hook-flags.sh` from the repository-selected `SOURCE_ROOT` at lines 57-61. Branch-controlled shell code can therefore run as the committing user.
- User impact: A contributor-controlled branch can run arbitrary commands with the maintainer’s local permissions when the maintainer commits from a linked worktree.
- Finding class: instance-only
- Scope proof: This claim is limited to the scoped pre-commit trust gate and its immediate source operation at lines 43-61. No cross-consumer claim is made.
- Affected surfaces: pre-commit hook, linked Git worktree, hook trust gate.
- Recommendation: Bind trust to an immutable hook source or revision, or require an explicit local opt-in for branch-controlled worktree hook code. Add a scoped case for an untrusted linked-worktree branch.
- Claim: The common-directory equality check does not establish that hook scripts in the checked-out worktree are trusted.
- Evidence references: `.skilled/scripts/git-hooks/pre-commit:29-46`, `.skilled/scripts/git-hooks/pre-commit:57-61`.
- Counterevidence sought: The gate rejects a separate clone unless its local `skilled.trustRepoHooks` setting is true. In the selected hook code, I looked for a revision or branch-origin check and an immutable source for `hook-flags.sh`; neither appears in the trust-to-source path.
- Alternative explanation: The intended trust model may treat every branch and linked worktree under a trusted Git common directory as trusted by the operator. Under that policy, the code is consistent with repository-level trust, though the security boundary is broader than branch-level trust.
- Final severity: P1.
- Confidence: 0.78.
- Downgrade trigger: Downgrade if the security contract explicitly accepts all branches and linked worktrees sharing a trusted common directory, and maintainers cannot be induced to commit from contributor-controlled branches without ordinary code review.

### P2

None.

## Traceability Checks

- Core `spec_code`: partial. The selected trust behavior was compared with the security claim, but the full normative claim set remains for the traceability dimension.
- Core `checklist_evidence`: partial. Checked completion evidence across the packet was not audited in this security pass.
- Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: partial. Only the selected executable boundaries were inspected; full cross-surface reconciliation remains for traceability.

## Search Depth

The review scope is complex and spans hundreds of changed files. This pass selected executable trust, route-selection, process-argument, and native-bridge boundaries. A coverage graph and semantic search were unavailable, so the search used a graphless fallback. The Commit-Id helper and Pi Fast Mode implementation were deferred because their source paths are outside the declared scope.

- Covered: hook trust boundary, compiled-route hub path, doctor probe argument passing, native bridge input and environment handling.
- Ruled out: arbitrary hub path loading, shell injection through the doctor prompt, and native bridge payload or environment injection in the inspected paths.
- Deferred: end-to-end Commit-Id policy validation and Pi Fast Mode context boundaries.

## Verdict

CONDITIONAL. One P1 finding remains. No P0 or P2 findings were identified in this pass.

## Next Dimension

Traceability.

Review verdict: CONDITIONAL
