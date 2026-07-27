# Iteration 1: Physical topology and raw occurrence baseline

## Focus

Established the repository-wide occurrence baseline, ignored control-file coverage, symlink identity, and the archive/live split before category-specific analysis.

## Actions Taken

1. Read config, JSONL state, and strategy before searching.
2. Inspected the declared symlink aliases with `stat` and `readlink`.
3. Ran broad repository sweeps with `rg --hidden --no-ignore`, excluding only Git internals, worktrees, dependency trees, test scratch space, logs, and this lineage.
4. Compared exact control-file reads against the broad path-family distribution.

## Findings

1. `rg --no-ignore` alone does not traverse hidden directories; `--hidden --no-ignore` is required for the actual exhaustive sweep. The corrected sweep found 9,775 matching files versus four visible-only matches. This is a search-method constraint for every later pass. [SOURCE: opencode.json:69] [SOURCE: .codex/config.toml:31] [SOURCE: .claude/mcp.json:58]
2. The MCP registration exists in three physical runtime configs: `opencode.json`, `.codex/config.toml`, and `.claude/mcp.json`. `.mcp.json` resolves to `.claude/mcp.json`, while `.cursor/mcp.json` resolves through `.mcp.json` to the same physical file; those aliases are one edit target, not three. [SOURCE: opencode.json:69] [SOURCE: .codex/config.toml:31] [SOURCE: .claude/mcp.json:58]
3. `CLAUDE.md` is a symlink to `AGENTS.md`, so doctrine matches in both names represent one physical document. [SOURCE: AGENTS.md:316] [SOURCE: AGENTS.md:354]
4. The broad occurrence population is dominated by archival specs: 4,156 files under `system-speckit` specs, 2,274 under `system-code-graph` specs, and 879 under `system-deep-loop` specs. Those are historical inventory, not edit candidates. [SOURCE: .opencode/specs/system-code-graph/036-code-graph-decommission/001-touchpoint-research/spec.md:1]
5. Live candidates span configurations, root doctrine, eight mirrored agent definitions per runtime, hooks, plugins, launchers, doctor routes, deep-loop workflows, Spec Kit integration code, Git hooks, CI, install guides, and the complete `system-code-graph` skill tree. This proves decommissioning is cross-cutting and cannot be implemented as a directory deletion first. [SOURCE: .codex/hooks.json:101] [SOURCE: .opencode/plugins/mk-code-graph.js:1] [SOURCE: .github/workflows/isolation-check.yml:1]

## Questions Answered

- Established the physical runtime registration set and deduplicated the declared aliases.
- Established the raw search universe and the mandatory hidden/no-ignore sweep form.

## Questions Remaining

- Exact live registration and startup semantics.
- External executable imports and shell-outs.
- Hook, plugin, CI, agent-grant, and doctrine inventories.
- Removal order and rollback gates.

## Ruled Out

- Visible-only `rg --no-ignore`: it silently omitted hidden runtime configuration and most implementation paths.
- Counting symlink aliases as independent edits: it inflates scope and risks duplicate/conflicting changes.
- Treating all 9,775 matches as live mutations: most are archival or self-contained implementation files.

## Dead Ends

- Generic case-insensitive `code graph` counts are useful for universe sizing but too noisy for an actionable edit list without path and role classification.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: code graph runtime is empty/unavailable, so direct filesystem evidence is the authority.
- Partial success: none.

## Sources Consulted

- `opencode.json:69`
- `.codex/config.toml:31`
- `.claude/mcp.json:58`
- `.codex/hooks.json:101`
- `AGENTS.md:316`
- `.github/workflows/isolation-check.yml:1`

## Assessment

- New information ratio: 1.0
- Novelty: all five baseline findings were new to the lineage.
- Questions addressed: runtime registrations, physical aliases, archive/live split.
- Questions answered: physical registration identity and sweep method.

## Reflection

- What worked and why: combining `--hidden --no-ignore` with explicit heavy-tree exclusions recovered ignored configs without traversing Git objects, worktrees, or dependencies.
- What did not work and why: the first `--no-ignore` pass omitted hidden directories because that flag disables ignore rules but does not imply `--hidden`.
- What I would do differently: use the corrected flag pair from the first command in every subsequent pass.

## Recommended Next Focus

Enumerate and inspect all live MCP registrations, environment keys, plugin registrations, launchers, and installation surfaces.
