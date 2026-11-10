# Iteration 3: worktree provisioning and Commit-Id policy

## Focus

Trace repository-level worktree base and provisioning inputs, then the Commit-Id opt-in and allocator path, including the failure a read-only setup check should surface.

## Actions Taken

- Read the worktree allocator's base resolution, create/provision flow, and provision-path list.
- Read the shared Commit-Id policy helper, the `prepare-commit-msg` stamper, the `commit-msg` enforcement gate, and allocator contract.
- Rechecked `steer.md`; it is absent in this lineage.

## Findings

1. A repository can relocate numbered worktrees with environment variable `SPECKIT_WORKTREE_BASE` or Git config `speckit.worktreeBase`; the environment wins, then local or inherited Git config, then `<main-worktree>/.worktrees`, and relative paths resolve against the main checkout, so a setup check should report the effective resolved base and compare it with existing worktree paths. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:11-17,58-77]
2. The repository-owned `scripts/worktree-provision-paths.txt` lists package directories and optional build outputs; `create` makes a numbered branch and worktree and provisions by default, while `--no-provision` opts out, so a read-only check can prove the list exists, its package paths resolve, and declared outputs are present, but it cannot prove that a future install or build will succeed without running them. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:398-425,508-559; .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:1-28]
3. Local `git config skilled.commitId true|false` overrides Commit-Id autodetection; without it, the shared policy opts repositories in when their checkout ships the allocator/toolchain sentinel or recent history has a valid trailer, so changing it to `false` stops stamping and the required-trailer check even when the toolchain is present, while the shipped author template still describes Commit-Id as mandatory. [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:103-119,286-313; .skilled/scripts/git-hooks/commit-msg:69-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47]
4. Commit-Id ordinals are seven digits, shared across linked worktrees through a lock and high-water mark in the common Git directory, never back-filled; the stamper leaves a message unstamped if its policy helper or allocator is missing or allocation fails, and `commit-msg` blocks a required ID that is absent, so setup should distinguish allocator presence, policy result, and actual hook installation rather than equate a configured opt-in with working enforcement. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:5-18,30-48,190-231; .skilled/scripts/git-hooks/prepare-commit-msg:97-119,303-313; .skilled/scripts/git-hooks/commit-msg:60-76]

## Questions Answered

- None yet; this iteration covers the worktree and Commit-Id portions of Q3, which also asks about hook trust, global hooks, and preflight advice.

## Questions Remaining

- How do hook trust, global hooks, and preflight advice interact with worktree and Commit-Id setup?
- What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

## Dead Ends

- No alternate user-facing Commit-Id format or allocator setting appeared in the inspected allocator and policy interfaces; changing the format would cross the history scanner, shared hook policy, stamper, enforcement gate, and shipped template rather than adjust one repository setting. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:41-48; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:101-119,286-313; .skilled/scripts/git-hooks/commit-msg:63-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47]

## Workflow Conflicts

The reducer marks Q1 and Q2 answered in the key-question list, but its generated `NEXT FOCUS` still names the already-answered Q2. The lineage has no steer file to resolve the stale pointer; I am following the next unanswered question, Q3, and will keep the reducer-owned section unchanged. [SOURCE: specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-strategy.md:63-67,161-165]

## Assessment

- newInfoRatio: 1.0
- Novelty: worktree location, provisioning inputs, Commit-Id opt-in, and allocator/gate failure behavior are newly mapped in this lineage; convergence remains telemetry only.
- Confidence: high for the documented code paths; the proposed read-only checks follow directly from their resolvers and guards.

## Reflection

The worktree base and provision list are concrete repository adaptation inputs. Commit-Id policy is separate from the naming allocator: a local config override changes whether hooks expect IDs, while the allocator and message format remain shared code. A doctor-style check should report those layers separately. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:11-17,58-77; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/skills/sk-git/scripts/commit-id-naming.sh:5-18,41-48]

## Recommended Next Focus

Trace hook trust, global installed-hook resolution, gate configuration, and the preflight advisory; establish which settings belong to `/doctor:git` versus another owner.
