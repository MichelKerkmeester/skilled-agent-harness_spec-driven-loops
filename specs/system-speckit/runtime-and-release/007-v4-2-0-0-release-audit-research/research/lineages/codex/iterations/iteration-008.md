# Iteration 8: Skills and Worktrees

## Focus
Audit Skills and Worktrees notes against linked-worktree behavior, worktree provisioning, and the supplied recent packet summaries. The focus came from the strategy's Next Focus.

## Findings
1. **MISSING — P2: New worktree provisioning builds the advisor skill-graph database, but the Skilled release notes only describe dependency installation.** Commit `957f47570f381cfc42c2d90d151771dfe695647e` added a post-install/build scan when the gitignored database is missing; provisioning now fails if the scan fails or leaves no database, and it does not rescan an existing database. Current behavior is at `.skilled/skills/sk-git/scripts/worktree-naming.sh:796-818`; the sk-git skill and v1.11.15.0 entry describe the behavior at `.skilled/skills/sk-git/SKILL.md:157` and `.skilled/skills/sk-git/changelog/v1.11.15.0.md:15-24`. The recent packet confirms it and explicitly leaves a changelog entry for a release pass at `specs/sk-git/worktree-lifecycle/008-provision-skill-graph-database/implementation-summary.md:59-72,109-114`. Skilled's section instead describes only the nearest-lockfile dependency fix at `.skilled/changelog/skilled/v4.2.0.0.md:742-748`.

## Ruled Out
- The existing note's claim that Skilled ships 14 skills still matches the 14 top-level skill manifests.
- The nearest-lockfile dependency walk described at release-note lines 744-748 matches the current provisioning code; no separate DRIFT was confirmed.
- No current BUG was confirmed in the added graph-scan path during this read-only pass.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: none; the strategy named Skills and Worktrees.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `.skilled/changelog/skilled/v4.2.0.0.md:727-750`
- `.skilled/skills/sk-git/scripts/worktree-naming.sh:796-818`
- `.skilled/skills/sk-git/SKILL.md:155-160`
- `.skilled/skills/sk-git/changelog/v1.11.15.0.md:13-37`
- `specs/sk-git/worktree-lifecycle/007-provision-dev-dependencies/implementation-summary.md:56-70`
- `specs/sk-git/worktree-lifecycle/008-provision-skill-graph-database/implementation-summary.md:59-72,109-114`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt`
- Commit `957f47570f381cfc42c2d90d151771dfe695647e`
- State, config and strategy read before this iteration; `steer.md` checked and absent.

## Assessment
- New information ratio: 1.0 (one new finding).
- Questions addressed: Skills and Worktrees portions of the missing-behavior and recent-packet questions; the 14-skill and dependency-walk claims.
- Questions answered: No full audit question is closed yet. One omitted behavior is confirmed; the reviewed skill-count and dependency-walk claims align.

## Reflection
- What worked and why: Comparing the recent packet's implementation summary with the current provisioning script separated the new skill-graph step from the dependency install behavior already named in the global notes.
- What did not work and why: None.
- What I would do differently: Compare the remaining verification and upgrade claims against their named current scripts, packet evidence, and changelog entries.

## Recommended Next Focus
Audit How It Was Checked and Upgrade Notes, including exact test totals, post-draft work, and current upgrade instructions.
