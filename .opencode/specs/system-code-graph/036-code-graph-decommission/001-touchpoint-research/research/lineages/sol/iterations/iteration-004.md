# Iteration 4: Hooks, lifecycle automation, and CI

## Focus

Inventoried every live hook and CI surface that refreshes, starts, routes to, validates, or cleans up the structural code graph.

## Actions Taken

1. Re-read config, state, and strategy.
2. Swept hook, workflow, installer, Git-hook, plugin, and lifecycle directories with `rg --hidden --no-ignore`.
3. Read runtime hook registration blocks for Claude, Codex, and Devin.
4. Read the Git post-commit implementation and the mixed isolation CI workflow.
5. Verified Cursor and Copilot indirection paths.

## Findings

1. Three runtime configs directly execute freshness hooks inside the retiring skill: Claude PostToolUse on `Write|Edit`, Codex PostToolUse on `apply_patch|edit`, and Devin PostToolUse on `edit`. These registrations must be removed before the skill tree. [SOURCE: .claude/settings.json:165] [SOURCE: .codex/hooks.json:101] [SOURCE: .devin/hooks.v1.json:109]
2. Cursor reaches the same freshness core indirectly through `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs`, whose constant points at the retiring Claude adapter. The Cursor hook proxy must remove that leg while preserving its other post-tool routes. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:39] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:126]
3. Copilot’s session-start wrapper invokes Spec Kit’s compiled session-prime hook, whose source emits code-graph state and scan guidance. The wrapper itself can remain, but the session-prime source/dist output and its “Code Graph: unavailable” fallback text require revision. [SOURCE: .github/hooks/scripts/session-start.sh:7] [SOURCE: .github/hooks/scripts/session-start.sh:15] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:245]
4. The OpenCode hook surface is the two plugin files already found: one graph-context injector and one edit-freshness adapter. Their plugin tests and README rows are part of the live removal unit. [SOURCE: .opencode/plugins/README.md:127] [SOURCE: .opencode/plugins/README.md:128] [SOURCE: .opencode/plugins/tests/mk-code-graph.test.cjs:18] [SOURCE: .opencode/plugins/tests/mk-code-graph-freshness.test.cjs:42]
5. The Git `post-commit` hook combines two responsibilities: memory-drift marking and graph invalidation. Remove only the graph threshold/invalidation branch and retain the memory drift and autosync logic; deleting the whole hook would regress unrelated behavior. Its graph-specific shell test and README row must change with it. [SOURCE: .opencode/scripts/git-hooks/post-commit:27] [SOURCE: .opencode/scripts/git-hooks/post-commit:50] [SOURCE: .opencode/scripts/git-hooks/post-commit:73] [SOURCE: .opencode/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh:20] [SOURCE: .opencode/scripts/git-hooks/README.md:105]
6. `install-git-hooks.sh` remains needed because it installs the shared commit-msg/post-commit hooks; only its graph description and graph-specific test expectations should change. [SOURCE: .opencode/scripts/install-git-hooks.sh:11]
7. `.github/workflows/isolation-check.yml` is a mixed CI job. Remove the graph paths and graph-specific audit steps while retaining Spec Kit↔Skill Advisor isolation. Deleting the workflow wholesale would drop unrelated architectural enforcement. [SOURCE: .github/workflows/isolation-check.yml:4] [SOURCE: .github/workflows/isolation-check.yml:19] [SOURCE: .github/workflows/isolation-check.yml:43] [SOURCE: .github/workflows/isolation-check.yml:110]
8. Codex hook documentation names the graph freshness hook, and `.opencode/bin/install-codex-hooks.mjs` installs the checked-in `.codex/hooks.json`; update the checked-in config and hook contract together, then re-run the installer check so the user-level copy cannot resurrect the hook. [SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:94] [SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:105]

## Questions Answered

- Identified direct and indirect freshness hooks across Claude, Codex, Devin, Cursor, OpenCode, Copilot, and Git.
- Identified the graph-specific CI steps and the unrelated portions that must survive.

## Questions Remaining

- Agent/tool grants and command workflow references.
- Live doctrine and archival classification.
- Removal order and rollback.

## Ruled Out

- Deleting shared Cursor, Copilot, Git-hook, installer, or CI files wholesale.
- Removing the skill before runtime hook registrations.
- Updating only repo-local Codex hook config without refreshing the installed user-level copy.

## Dead Ends

- Hook-directory grep included benchmark reports with captured transcripts; those are archival evidence, not hook mutation targets.

## Edge Cases

- Ambiguous input: shared hook files combine graph and non-graph responsibilities.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: installed user-level hook state is outside this repository and must be validated by the operator during implementation.

## Sources Consulted

- `.claude/settings.json:165`
- `.codex/hooks.json:101`
- `.devin/hooks.v1.json:109`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:39`
- `.github/hooks/scripts/session-start.sh:7`
- `.opencode/plugins/README.md:127`
- `.opencode/scripts/git-hooks/post-commit:50`
- `.opencode/scripts/install-git-hooks.sh:11`
- `.github/workflows/isolation-check.yml:19`
- `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:94`

## Assessment

- New information ratio: 0.88
- Novelty: seven findings were new; one linked a previously found plugin pair into the complete hook matrix.
- Questions addressed: hooks, lifecycle automation, CI.
- Questions answered: runtime hook and CI inventory.

## Reflection

- What worked and why: reading mixed-responsibility files prevented destructive whole-file recommendations.
- What did not work and why: a broad hook search pulled embedded benchmark transcripts.
- What I would do differently: exclude all benchmark-report directories from every remaining sweep, not only named behavior-benchmark trees.

## Recommended Next Focus

Enumerate all agent definitions, tool allowlists, MCP grants, routing matrices, command workflows, and generated runtime mirrors that expose graph tools.
