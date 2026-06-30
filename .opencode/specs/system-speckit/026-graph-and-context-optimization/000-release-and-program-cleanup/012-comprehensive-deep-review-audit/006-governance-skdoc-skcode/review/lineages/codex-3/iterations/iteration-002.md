# Iteration 002 - Security And Governance Enforcement

## Focus

This pass checked whether the constitutional comment-hygiene rule's claimed enforcement surfaces match the actual local hook, GitHub workflow, and authorized owner direct-push path.

## Evidence Reviewed

- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:30`
- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66-71`
- `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:24`
- `.github/workflows/comment-hygiene.yml:2-4`
- `.opencode/scripts/git-hooks/pre-commit:48`
- `.opencode/hooks/README.md:70-73`

## Findings

### F003 - P1 - Comment hygiene can be bypassed in the authorized main-push flow

The constitutional rule says two gates check every code comment write and that neither can be bypassed by `--no-verify` without explicit override and documentation. The repository also authorizes owner-commanded AIs to push directly to main. The GitHub workflow only runs on pull requests, the local hook is opt-in, and the installed pre-commit path documents `SPECKIT_SKIP_COMMENT_HYGIENE=1`.

Impact: the rule is stricter than the actual enforcement surface. A direct push can skip both the PR workflow and local hook path.

Fix: add push/main enforcement for comment hygiene, or narrow the constitutional claim to the actual PR/hook guarantees and require audit metadata for bypasses.

## Claim Adjudication

Accepted as P1 because the gap affects a constitutional governance control, not just documentation phrasing.

Review verdict: CONDITIONAL
