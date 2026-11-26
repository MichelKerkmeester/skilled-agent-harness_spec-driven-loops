# Iteration 9: Verification and Upgrade Notes

## Focus
Audit How It Was Checked and Upgrade Notes, including exact test totals, post-draft work, and current upgrade instructions. The focus came from the strategy's Next Focus.

## Findings
1. **DRIFT — P2: The Bladebro upgrade command bypasses the current verified install procedure.** Release-note line 906 directs users to run `npm install -g bladebro@4.8.2` (introduced by commit `c7f38f295d282f34efc292a7bc611c2019fb489e`). The current Bladebro install guide instead specifies `npm install -g --ignore-scripts bladebro@4.8.2` and a digest check before the installed binary first runs at `.skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/bladebro-cli/README.md:24-27,50-58`; its wrapper enforces lifecycle scripts off and checks the launcher and native binary digests at `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:147-173`. Commit `ec3ed74ad01edad7311aadfe7a117d4010b10919` added this installer posture. The release-note command omits both script suppression and verification, so it contradicts the current install contract. This confirms a lower-assurance command is published; it does not establish that the pinned package contains a malicious payload.
2. **BUG — P2: The worktree naming script lost its executable bit.** Commit `957f47570f381cfc42c2d90d151771dfe695647e` changed its Git mode from 100755 to 100644; `git ls-files -s` shows 100644 and `test -x` is false. The script has a Bash shebang at `.skilled/skills/sk-git/scripts/worktree-naming.sh:1`, while the scripts README calls this the executable core at `.skilled/skills/sk-git/scripts/README.md:17` and the skill directs allocation through that script path at `.skilled/skills/sk-git/SKILL.md:146`. A direct execution of the script path now fails; the explicit `bash .../worktree-naming.sh` examples remain usable. The related upgrade instruction is `.skilled/changelog/skilled/v4.2.0.0.md:915`. I could not confirm how often users execute the shorthand directly, so the impact is limited to direct invocation.

## Ruled Out
- The package-lockfile counts still match the notes: 111 advisor dependencies and 313 system-spec-kit dependencies, excluding each lockfile's root package.
- The upgraded script paths for residue cleanup, OpenCode setup, Bladebro installation, and native-module rebuild exist at their current documented owners.
- The documented 14 top-level skill count and the worktree dependency-walk behavior match current files. The suite totals in How It Was Checked are recorded as historical run results; this read-only pass did not establish a contradiction with those past runs.

## Dead Ends
None.

## Edge Cases
- Ambiguous input: direct execution of the worktree script is described as an executable core, while most concrete examples invoke it through Bash; the finding is bounded to direct invocation.
- Contradictory evidence: the Bladebro release-note install command conflicts with the current package guide and digest-checking wrapper. The current installer contract and wrapper identify the inconsistency; `steer.md` was reread before resolving it and was absent.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- `.skilled/changelog/skilled/v4.2.0.0.md:752-926`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/bladebro-cli/README.md:24-58`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:147-173`
- `.skilled/skills/sk-git/scripts/worktree-naming.sh:1` and Git mode 100644 (`test -x` false)
- `.skilled/skills/sk-git/scripts/README.md:17,73-78`
- `.skilled/skills/sk-git/SKILL.md:146,155-160`
- `.skilled/skills/sk-git/changelog/v1.11.15.0.md:15-24`
- `.skilled/skills/system-spec-kit/runtime/cli/setup/rebuild-native-modules.sh:6`
- Commits `c7f38f295d282f34efc292a7bc611c2019fb489e`, `ec3ed74ad01edad7311aadfe7a117d4010b10919`, and `957f47570f381cfc42c2d90d151771dfe695647e`
- State, config and strategy read before this iteration; `steer.md` checked before iteration and again before resolving the install-command contradiction; absent.

## Assessment
- New information ratio: 1.0 (two new findings).
- Questions addressed: How It Was Checked and Upgrade Notes portions of the drift and bug questions; current package counts and upgrade paths.
- Questions answered: No full audit question is closed yet. One install-command contradiction and one direct-execution defect are confirmed.

## Reflection
- What worked and why: Comparing the top-level install command with the package-specific verified installer revealed a concrete instruction mismatch; checking the committed file mode exposed a direct-execution regression that a shell-syntax read would miss.
- What did not work and why: Test-suite totals could not be revalidated without executing tests; they remain attributed to their recorded historical runs.
- What I would do differently: Use iteration 10 to reconcile all findings, check remaining recent-packet scope and cross-links, and synthesize unresolved verification limits.

## Recommended Next Focus
Perform the final global commit-window and cross-link pass, deduplicate the per-section findings, and state which recent-packet and post-draft changes remain unconfirmed.
