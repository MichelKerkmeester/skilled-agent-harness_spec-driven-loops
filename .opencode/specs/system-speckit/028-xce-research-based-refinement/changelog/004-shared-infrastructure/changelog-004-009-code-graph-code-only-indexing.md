---
title: "Code Graph Indexes Code Only: Markdown Dropped, Maintainer Mode Made Selectable"
description: "The code graph's default include globs pulled in markdown, walking prose docs into language='doc' nodes no consumer queries. **/*.md was removed from defaultIncludeGlobs (code and structured config still index), and SPECKIT_CODE_GRAPH_MAINTAINER_MODE became selectable via a pure resolver so the maintainer indexes only skills and plugins while external users index only their own code. A combined 5-iteration deep review of this change and 008 returned CONDITIONAL: 4 P1 + 4 P2, all verified real and remediated."
trigger_phrases:
  - "004/009 code only indexing changelog"
  - "code graph excludes markdown"
  - "selectable maintainer mode"
  - "deep review 008 009 remediation"
  - "027 004/009 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-14

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/009-code-graph-code-only-indexing` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The code graph's default include globs pulled in markdown, so prose docs were walked and stored as `language='doc'` nodes that no consumer queries. `**/*.md` was removed from `defaultIncludeGlobs`, so the graph now indexes code (ts, tsx, js, py, sh and friends) and structured config (json, yaml, toml, which still register as `language='doc'`) and skips prose, including the framework's own `SKILL.md`, agent, command and spec markdown and external users' READMEs. Maintainer-only indexing of the framework's skills and plugins was made selectable. `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` is the only `.env.local` knob that beats the committed `INDEX_*=false`, because the launcher force-assigns it while config otherwise wins over file. A pure exported `resolveMaintainerModeCategories` maps `true` to all five categories for back-compat and a comma subset such as `skills,plugins` to exactly that subset, with anything else resolving to none, and the launcher then force-sets only the resolved categories. The gitignored `.env.local` carries the maintainer's `skills,plugins` choice, so external repo users index only their own code while the maintainer also indexes the framework's skills and plugins. A combined five-iteration deep review of this change and `008` (executor `cli-opencode openai/gpt-5.5-fast --variant xhigh`) returned a CONDITIONAL verdict and surfaced eight findings, all verified real against source and all remediated. The cross-consumer risk was cleared directly: nothing queries the code graph's `language='doc'` rows, and the skill-advisor doc-triggers harvest reads `.md` files directly rather than through the graph.

### Added

- Selectable maintainer mode: `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` now accepts a comma subset such as `skills,plugins` in addition to the all-or-nothing `true`/`false`, resolved by a pure exported `resolveMaintainerModeCategories` in the launcher.
- `tests/launcher-maintainer-mode.vitest.ts` — new resolver unit tests (`true` → all five, subset → that subset, unknown / empty → none).

### Changed

- `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` — `**/*.md` removed from `defaultIncludeGlobs`; code and structured config kept, with `language='doc'` retained for config
- `.opencode/bin/mk-code-index-launcher.cjs` — maintainer-mode resolved through the pure function; the launcher force-sets only the resolved categories' `INDEX_*`
- `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` — expectations updated to assert markdown is excluded even in opted-in folders while config is kept
- `ENV_REFERENCE.md` and `lib/README.md` — updated to document code-only indexing and the selectable subset
- `.env.local` (gitignored, local maintainer config) — set to `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=skills,plugins`

### Fixed

Post-review remediation of the combined `008` + `009` deep review (commit `3dc7148f04`; 4 P1 + 4 P2, all verified real against current source):

- F1 (P1) `lib/structural-indexer.ts` — `collectSpecificFiles`, the incremental and stale-file reindex path, now enforces the same `includeGlobs` file-type allowlist as the full walk, so a changed `.md` can no longer re-enter the graph as a `'doc'` node. A new indexer test proves a `.md` passed via `specificFiles` is not persisted while `.ts` and `.json` are.
- F2 (P1) `bin/mk-code-index-launcher.cjs` — `resolveMaintainerModeCategories` uses `Object.hasOwn` instead of the prototype-chain `in`, so prototype names like `constructor` and `toString` no longer set junk `INDEX_*` env keys.
- F3 (P1) `handlers/advisor-recommend.ts` plus the launcher allowlist and the plugin bridge — `MK_SKILL_ADVISOR_HOOK_DISABLED` is honored end-to-end on the daemon path, with the legacy `SPECKIT_` name kept as fallback.
- F4 (P1) skill-advisor tests — daemon-path `MK_` coverage added, and a pre-existing stale legacy-name assertion in `rename-invariants.vitest.ts` was corrected.
- F5 (P2) `bin/mk-spec-memory-launcher.cjs` — the stale "(default off)" reelection comment corrected to "(on by default)".
- F6 (P2) `tests/code-graph-indexer.vitest.ts` — the doc-matrix fixture uses real plural `agents`/`commands` paths, genuinely exercising the opt-in scope.
- F7 (P2) `opencode.json`, `.claude/mcp.json`, `.codex/config.toml` — `_NOTE_INDEX_DEFAULTS` documents the selectable subset, byte-identical across files.
- F8 (P2) assessed as a non-issue: `.vscode/mcp.json` is a legitimate VS Code MCP config target wired into `.gitattributes` and the setup script, absent here only because this maintainer does not run the VS Code runtime. No change.

### Verification

| Check | Result |
|-------|--------|
| Markdown excluded / config kept | PASS: `code-graph-indexer.vitest.ts` (md dropped, json kept, explicit `.md` exclusion asserted) |
| Incremental path allowlist (F1) | PASS: new indexer test (a `.md` via `specificFiles` not persisted, `.ts` / `.json` are) |
| Maintainer resolver | PASS: `launcher-maintainer-mode.vitest.ts` (true / subset / unknown / empty, plus `constructor`/`toString` → none) |
| Parser regression | PASS: `tree-sitter-parser.vitest.ts` (`'doc'` language intact for config) |
| Builds | PASS: code-graph and skill-advisor `tsc --build` clean; both dists rebuilt |
| Suites | PASS: code-graph 84 pass / 1 skip; skill-advisor 104 pass |
| Comment hygiene | PASS: `node --check` and hygiene clean on all edited code |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modified |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` | Modified |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-maintainer-mode.vitest.ts` | Added |
| `.opencode/skills/system-code-graph/mcp_server/lib/README.md` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts` | Modified |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/rename-invariants.vitest.ts` | Modified |
| `.claude/mcp.json` | Modified |
| `opencode.json` | Modified |
| `.codex/config.toml` | Modified |

### Follow-Ups

- The change activates when the code-index daemon next loads the new launcher and dist (next session). A one-time full `code_graph_scan` then drops the existing `.md` `'doc'` rows from the live graph.
- The default-scope change affects external users too: their own `.md` files stop being graphed. This is intended (the graph models code, not docs), and a caller can still re-add markdown for a specific scan via `includeGlobs`.
