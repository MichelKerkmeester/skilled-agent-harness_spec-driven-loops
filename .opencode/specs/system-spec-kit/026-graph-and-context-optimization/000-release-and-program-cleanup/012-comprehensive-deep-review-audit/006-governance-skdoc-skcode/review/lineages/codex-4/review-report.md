# Deep Review Report

## Verdict

`CONDITIONAL`

No P0 findings were found. Two P1 governance/enforcement findings remain active, so this lineage should not be treated as clean until the parent review either remediates them or explicitly accepts the enforcement gap.

## Findings

### P1-001 - Comment-hygiene checker misses forbidden requirement/checklist IDs on mixed stable-reference lines

The standards forbid ephemeral labels such as `REQ-005` and `CHK-160` in code comments, and the style guide explicitly says mixed forbidden-plus-stable-reference comments should keep only the stable reference. Evidence: `.opencode/skills/sk-code/references/universal/code_style_guide.md:116`, `.opencode/skills/sk-code/references/universal/code_style_guide.md:120`, and `.opencode/skills/sk-code/references/universal/code_style_guide.md:154`.

The checker skips the violation scan when an allowed stable standard reference appears, because allowed patterns are declared in `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:70` through `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:81`, then the script continues before checking violations at `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:112` through `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:114`. It also only matches `REQ` and `CHK` labels followed by `:` or `-` at `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:88` and `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:89`, so bare forbidden examples can slip through.

Fix: scan forbidden labels even when stable standards references are present, and widen the forbidden ID patterns to word-boundary matches. Add regression fixtures for `CHK-160 ... CWE-79` and bare `REQ-005`.

### P1-002 - Direct-main workflow bypasses the only CI comment-hygiene gate while local hooks remain opt-in and bypassable

The main-branch constitutional rule authorizes direct pushes to `main` and says PR bypass is expected at `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:20` through `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:24`.

The comment-hygiene workflow runs only for pull requests to `main` at `.github/workflows/comment-hygiene.yml:1` through `.github/workflows/comment-hygiene.yml:4`. Local hook documentation says hooks are opt-in at `.opencode/hooks/README.md:13` and bypassable with `--no-verify` at `.opencode/hooks/README.md:70` through `.opencode/hooks/README.md:73`. The installer assumes a literal `.git/hooks` directory at `.opencode/hooks/install-hooks.sh:6` and `.opencode/hooks/install-hooks.sh:7`, which is not safe for the worktree topology used here.

Fix: add direct-main push-side enforcement or revise the hard-enforcement claim. Make hook installation resolve the hook directory with `git rev-parse --git-path hooks`.

### P2-001 - Constitutional deep-review executor rule is stale relative to the command/runtime executor model

The constitutional deep-review rule mandates `cli-devin` SWE-1.6 at `.opencode/skills/system-spec-kit/constitutional/post-implementation-deep-review.md:24` and says `cli-codex` is not used at `.opencode/skills/system-spec-kit/constitutional/post-implementation-deep-review.md:50` through `.opencode/skills/system-spec-kit/constitutional/post-implementation-deep-review.md:57`.

The command and runtime now support executor selection, including `cli-codex`, at `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:741` through `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:790` and `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:7` through `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:8`. The changelog describes executor selection as first-class at `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md:245` through `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md:251`.

Fix: make the constitutional rule point at the executor config as source of truth. If SWE-1.6 remains preferred, state it as a default profile rather than a universal hard rule.

### P2-002 - sk-doc and sk-code version metadata drift across SKILL, README, and changelog surfaces

`sk-doc` reports `1.5.0.0` in `.opencode/skills/sk-doc/SKILL.md:5`, `1.6.0.0` in `.opencode/skills/sk-doc/README.md:35`, and has `.opencode/skills/sk-doc/changelog/v1.7.0.0.md:1`.

`sk-code` reports `3.3.1.0` in `.opencode/skills/sk-code/SKILL.md:5`, while `.opencode/skills/sk-code/README.md:92` says `3.3.0.0`; `.opencode/skills/sk-code/changelog/v3.3.1.0.md:1` matches the SKILL file.

Fix: keep version in one authoritative place and update visible surfaces in one release step, or generate README version claims.

## Coverage

The review covered correctness, security, traceability, maintainability, and a stabilization pass. The stabilization pass re-read all P1/P2 evidence paths and found no new P0/P1 findings.

## Traceability

The reviewed files match the target spec scope at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:49` through `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:60`.

No target `checklist.md` exists, so checklist evidence was not applicable for this lineage. A lineage-local `resource-map.md` was generated because no input resource map was present at phase init.

## Verification

During review, both scoped skill docs passed sk-doc validation:

- `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type skill .opencode/skills/sk-doc/SKILL.md`
- `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type skill .opencode/skills/sk-code/SKILL.md`

Structure extraction also succeeded for both files using the filepath-only invocation.

## Counterevidence

The strongest counterevidence for P1-002 is the repository-level hook integration that delegates into `.opencode/hooks/pre-commit`. It does not close the finding because the tracked governance docs still describe hooks as opt-in/bypassable, the CI workflow remains PR-only, and the constitutional workflow authorizes direct-main pushes.

The strongest counterevidence for P1-001 would be an independent stricter scanner. No such mandatory scanner was found in the reviewed hook/CI path.

## Remediation Priority

1. Fix comment-hygiene scanning and add regression fixtures for the bypass cases.
2. Decide whether direct-main pushes need push-side enforcement or whether the governance text should explicitly accept the bypass.
3. Update the constitutional deep-review executor rule to match first-class executor configuration.
4. Normalize sk-doc/sk-code version surfaces.

## Convergence

The loop converged after five iterations. Last two new-finding ratios were `0.0` and `0.0`; all required dimensions were covered; the stabilization pass found no new P0/P1 issues. Final verdict remains `CONDITIONAL` because active P1 findings are present.
