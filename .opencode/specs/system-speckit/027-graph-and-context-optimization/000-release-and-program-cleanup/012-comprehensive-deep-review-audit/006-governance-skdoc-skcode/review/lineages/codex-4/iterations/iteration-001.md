# Iteration 001 - Correctness and Governance Enforcement

## Metadata

- Session: `fanout-codex-4-1780595350529-muaf3m`
- Generation: `001`
- Focus: correctness, governance enforcement
- Started: `2026-06-04T18:12:00Z`
- Completed: `2026-06-04T18:20:00Z`
- New findings: 2 P1

## Files Reviewed

- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`
- `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md`
- `.opencode/skills/sk-code/references/universal/code_style_guide.md`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/skills/sk-code/references/universal/code_quality_standards.md`
- `.opencode/hooks/README.md`
- `.opencode/hooks/install-hooks.sh`
- `.opencode/hooks/pre-commit`
- `.github/workflows/comment-hygiene.yml`

## Findings

### P1-001 - Comment-hygiene checker misses forbidden requirement/checklist IDs on mixed stable-reference lines

The standards forbid ephemeral tracking labels in code comments, including `REQ-005` and `CHK-160` examples in `.opencode/skills/sk-code/references/universal/code_style_guide.md:116` and `.opencode/skills/sk-code/references/universal/code_style_guide.md:120`. The same guide explicitly says a mixed comment such as a forbidden checklist marker plus a stable standard reference should keep the stable reference and remove the checklist marker at `.opencode/skills/sk-code/references/universal/code_style_guide.md:154`.

The checker does the opposite in one important path. It first treats standards references such as `CWE-79`, `RFC 2616`, and `POSIX` as allowed patterns in `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:70` through `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:81`, then skips the full violation scan when any allowed pattern matches at `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:112` through `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:114`. A line like `// CHK-160: sanitize input (CWE-79)` therefore passes because `CWE-79` short-circuits the forbidden `CHK-160` check.

There is a second miss: the checker only matches `REQ-\d+[-:]` and `CHK-\d+[-:]` at `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:88` and `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:89`. The guide forbids bare examples like `REQ-005` and `CHK-160`; comments followed by whitespace, punctuation other than `:`/`-`, or end-of-line are not caught.

Concrete fix: test forbidden labels independently of stable standards references. A safe implementation is to strip or ignore allowed-standard spans and still run the forbidden-label regex on the remaining line. Widen the `REQ`/`CHK` patterns to word-boundary forms such as `\bREQ-[0-9]+\b` and `\bCHK-[0-9]+\b`, then add regression fixtures for mixed `CHK-160 ... CWE-79` and bare `REQ-005` comments.

#### Claim Adjudication Packet

- Finding ID: `P1-001`
- Claim: comment-hygiene enforcement cannot reliably block the forbidden labels that the standards document calls hard violations.
- Evidence refs: `.opencode/skills/sk-code/references/universal/code_style_guide.md:116`, `.opencode/skills/sk-code/references/universal/code_style_guide.md:120`, `.opencode/skills/sk-code/references/universal/code_style_guide.md:154`, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:70`, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:88`, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:89`, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:112`.
- Counterevidence sought: whether another hook or CI step re-scans the same lines with stricter logic.
- Counterevidence result: the hook and CI invoke this checker; no independent stricter scanner was found in the scoped enforcement path.
- Alternative explanation: allowed standards references may have been intended to exempt whole lines. That conflicts with the guide's own mixed-reference example.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: add a second mandatory scanner that catches the mixed-line and bare-ID cases before commit/merge/push.

### P1-002 - Direct-main workflow bypasses the only CI comment-hygiene gate while local hooks remain opt-in and bypassable

The constitutional main-branch rule authorizes direct pushes to `main` and explicitly says PR bypass is expected at `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:20` through `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:24`.

The comment-hygiene CI workflow only runs on `pull_request` targeting `main` at `.github/workflows/comment-hygiene.yml:1` through `.github/workflows/comment-hygiene.yml:4`. That means the preferred direct-main path does not receive this CI gate. The local hook docs also say installation is opt-in at `.opencode/hooks/README.md:13`, and explicitly acknowledge bypass via `--no-verify` at `.opencode/hooks/README.md:70` through `.opencode/hooks/README.md:73`.

The installation script is also not worktree-aware: it writes to `$REPO_ROOT/.git/hooks` at `.opencode/hooks/install-hooks.sh:6` and `.opencode/hooks/install-hooks.sh:7`. In this worktree, `.git` is a gitdir file rather than a directory, so the correct hook path must come from `git rev-parse --git-path hooks/pre-commit`. The current script can therefore fail or install into the wrong location for the worktree topology used by this review.

Concrete fix: either make the direct-main path run an equivalent non-PR gate, for example a `push` workflow or protected server-side check, or soften the constitutional/sk-code wording so it no longer claims non-bypassable enforcement. For hook installation, resolve hooks with `git rev-parse --git-path hooks` instead of assuming `.git/hooks`.

#### Claim Adjudication Packet

- Finding ID: `P1-002`
- Claim: the governance guarantee that comment hygiene is automatically enforced does not hold for the authorized direct-main workflow.
- Evidence refs: `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:20`, `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:24`, `.github/workflows/comment-hygiene.yml:1`, `.github/workflows/comment-hygiene.yml:4`, `.opencode/hooks/README.md:13`, `.opencode/hooks/README.md:70`, `.opencode/hooks/README.md:73`, `.opencode/hooks/install-hooks.sh:6`, `.opencode/hooks/install-hooks.sh:7`.
- Counterevidence sought: whether a push workflow, required status check, or always-installed hook covers direct-main pushes.
- Counterevidence result: the tracked comment-hygiene workflow is PR-only, and the tracked hook docs describe local hooks as opt-in and bypassable.
- Alternative explanation: direct-main work may rely on agent discipline instead of automation. That is a policy choice, but it contradicts the current hard-enforcement wording.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: add mandatory direct-main enforcement or revise constitutional/sk-code claims to document the accepted bypass boundary.

## Dimension Result

Correctness coverage is complete. The main risk is not a runtime crash; it is governance drift where hard-rule documents promise stronger enforcement than the actual checker and workflow topology provide.

Review verdict: CONDITIONAL
