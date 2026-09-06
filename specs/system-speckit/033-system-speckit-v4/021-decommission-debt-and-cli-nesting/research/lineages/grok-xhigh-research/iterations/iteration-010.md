# Iteration 10: Leftover system-spec-kit/mcp-server tree

## Focus
Angle 1 and 2. The path that broke workspace greps in iteration 9: leftover `.opencode/skills/system-spec-kit/mcp-server/` after D8 renamed that package to `runtime/`, plus skill-tree mirrors and the spec-memory plugin slot.

## Findings

### F-I10-001 — An untracked leftover `system-spec-kit/mcp-server/` tree still sits on disk. CONFIRMED. P1
`test -e .opencode/skills/system-spec-kit/mcp-server` is true. `git ls-files` returns no tracked path under that name (`pathspec did not match any file(s) known to git`). D8 moved the authored package to `runtime/` as `@spec-kit/runtime`. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:122] [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:205]
The leftover tree still holds compiled `dist/` (handlers, hooks, lib, freshness stamps named `system-spec-kit-mcp-server`). Dist contents were not read (reading budget). The retired MCP identity is therefore still a local directory, not only a historical name.
This is the same class as the 052 LOG's "eleven deleted runtime hook mirrors … operator pending deletion" [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:116], except this leftover **does** reproduce here.
Smallest fix: delete the leftover directory after naming the rollback (it is untracked compiled state). Do not revive it as a package.

### F-I10-002 — `mcp-server/node_modules` is a broken symlink and fails fleet greps. CONFIRMED. P1
The leftover `node_modules` entry is a symlink. Its target is missing (`test -e …/mcp-server/node_modules` → missing). Workspace `rg` under `system-spec-kit` dies with `mcp-server/node_modules: No such file or directory` (iteration 9 dead end). `.gitignore` ignores `node_modules/` and `**/node_modules` [SOURCE: .gitignore:43-44], so the broken link is invisible to `git status` of tracked files.
Smallest fix: remove the leftover `mcp-server/` tree (same as F-I10-001). Until then, every search under the skill must exclude that path.

### F-I10-003 — Claude and Pi skill trees are symlinks, not drifted copies. CONFIRMED. P2 (negative)
`.claude/skills` and `.pi/skills` are symlinks to `../.opencode/skills`. `.codex/skills/system-spec-kit`, `.cursor/skills`, and `.devin/skills/system-spec-kit` are absent. There is no second authored copy of system-spec-kit skill docs to drift in those mirrors.
Smallest fix: none. Do not treat missing Codex/Cursor/Devin skill trees as dropped registrations.

### F-I10-004 — No `system-spec-memory` plugin remains in `.opencode/plugins/`. CONFIRMED. P2 (negative)
`test -e .opencode/plugins/system-spec-memory.js` is false. `mcp-route-guard.js` is a warn-only Code Mode adapter and does not mention spec-memory or the retired server. [SOURCE: .opencode/plugins/mcp-route-guard.js:1-11]
052 DONE WHEN already required `plugins/system-spec-memory.js` absent. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:184]
Smallest fix: none.

## Sources Consulted
- specs/system-speckit/052-memory-decommission-landing/goal.md:116,122,184,205
- .gitignore:43-44
- .opencode/plugins/mcp-route-guard.js:1-11
- Existence checks on leftover `system-spec-kit/mcp-server`, hook skill mirrors, plugin slot (no directory wildcard expand; no dist reads)

## Assessment
- newInfoRatio: 0.80
- Novelty justification: leftover ignored MCP identity on disk plus the broken symlink that breaks tooling. Mirror and plugin negatives close angle 2 for those slots.
- Confidence: high. Dist file contents inferred as compiled leftovers from names only.

## Reflection
- Worked: existence and git-tracking checks without listing the leftover tree.
- Failed: `git check-ignore` on a path beyond a symlink is noisy; tracking emptiness is the better proof.
- Ruled out: treating missing Codex/Cursor/Devin skill copies as dropped registrations.

## Dead Ends
- Broad `rg` under `system-spec-kit` without excluding leftover `mcp-server/node_modules`.

## Recommended Next Focus
Live `entity-extractor` still writes `memory_index` / `memory_entities` even though the only production importer uses `extractEntities` only.
