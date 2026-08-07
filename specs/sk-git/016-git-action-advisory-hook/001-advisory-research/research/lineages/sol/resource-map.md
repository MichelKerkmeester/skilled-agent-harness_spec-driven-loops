# Research Resource Map

## Documents
- `research/BRIEFING.md` - Research contract, observed incident floor, and required finding fields.
- `.opencode/skills/sk-git/SKILL.md` - Named ALWAYS/NEVER/ESCALATE rules.
- `.opencode/skills/sk-git/references/commit-workflows.md` - Scoped staging and commit analysis.
- `.opencode/skills/sk-git/references/finish-workflows.md` - Push and primary-checkout reconciliation.
- `.opencode/skills/sk-git/references/worktree-workflows.md` - Worktree state and cleanup.
- `.opencode/skills/sk-git/references/continuous-integration.md` - Wrapper autosync contract.
- `.opencode/skills/sk-git/references/remote-branch-policy.md` - Push permission enforcement.

## Scripts
- `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs` - Existing command-only evaluator.
- `.opencode/scripts/git-hooks/pre-commit` - Pre-commit enforcement boundary.
- `.opencode/scripts/git-hooks/commit-msg` - Commit-message and staged-path enforcement.
- `.opencode/scripts/git-hooks/pre-push` - Branch naming and permission enforcement.
- `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` - Autostash rescue behavior.
- `.opencode/bin/git-sync.sh` - Wrapper publication primitive.
- `.opencode/bin/worktree-reaper.sh` - Conservative worktree cleanup.

## Schema Example
- `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` - `hard_rules` frontmatter shape.

## Iteration Evidence
- `iterations/iteration-001.md` - Operation inventory and broad prevalence proxies.
- `iterations/iteration-002.md` - Destructive state probes and built-in protections.
- `iterations/iteration-003.md` - Staging/commit mismatch predicates and ownership boundary.
- `iterations/iteration-004.md` - Worktree/remote/account coordination and hook overlap.
- `iterations/iteration-005.md` - Ranked matrix, rejections, latency, coalescing, and noise targets.

## Structured Deltas
- `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl` - Canonical iteration records and structured findings.
