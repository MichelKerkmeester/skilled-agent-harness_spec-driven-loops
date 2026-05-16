# Iteration 011 - Q1 Deep Dive: Additional Bugs, Drift, and Weak Prose Beyond Iter-010 Findings

## Focus

Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

## Actions Taken

1. Read all core authored docs: SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md
2. Read all references/: code-graph-readiness-check.md, database-path-policy.md, ownership-boundary.md
3. Read all mcp_server/ per-folder READMEs: core/, database/, handlers/, lib/, tools/, tests/, plugin_bridges/, lib/utils/, stress_test/code-graph/
4. Cross-referenced against iter-010 findings to identify NEW issues not previously documented
5. Analyzed for factual bugs, drift (outdated vs current implementation), and weak prose

## Findings

### NEW Bugs and Drift (Beyond Iter-010's 6 Findings)

**SKILL.md:8** - Packet pointer drift: `packet_pointer: "system-spec-kit/028-system-code-graph-doc-alignment"` references packet 028, but the current packet is 029. This is stale continuity metadata that should point to the active uplift packet.

**SKILL.md:12** - Next safe action drift: `next_safe_action: "Run strict-validate on packet 028, then commit on main"` references packet 028. Should reference packet 029 for the current uplift work.

**README.md:54** - Database path drift: "Database path override | `SPECKIT_CODE_GRAPH_DB_DIR` env var (default: `.opencode/skills/system-code-graph/mcp_server/database/`)" - This conflicts with INSTALL_GUIDE.md:43 which states the new default is `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`. The README should reflect the migrated default location, not the legacy skill-local path.

**ARCHITECTURE.md:108** - Package name drift: "Deep-loop coverage graph tools — `deep_loop_graph_*` lives in `mk-spec-memory` (not in `mk-code-index`)" - References `mk-spec-memory` as the package name, but the actual package is `@spec-kit/system-spec-kit`. The MCP server name is `mk-spec-memory`, but the package reference should use the npm package name for consistency with other package references (e.g., `@spec-kit/system-code-graph` at line 28).

**ownership-boundary.md:33** - File count drift: "The migration moved 108 code-graph files." - This is a historical count from the original extraction. Should verify if this count is still accurate or if it should be removed/marked as historical context.

### Weak Prose Issues (Beyond Iter-010's 3 Findings)

**references/code-graph-readiness-check.md:20** - Dense line-number citations: "The function lives in `mcp_server/lib/ensure-ready.ts:585-743`. It is the pre-dispatch contract that query, context, verify and detect-changes handlers depend on." - The line-number range `585-743` is precise but makes the prose harder to read. Could be split into separate sentences or moved to a code block.

**references/code-graph-readiness-check.md:22** - Dense citation pattern: "A 10-second timeout guard ensures auto-indexing never blocks queries forever (`mcp_server/lib/ensure-ready.ts:74, 582`). Handler coverage spans the query, context, verify and detect-changes handlers (`mcp_server/handlers/query.ts:7, 1103`, `mcp_server/handlers/context.ts:8, 185`, `mcp_server/handlers/verify.ts:17, 205`, `mcp_server/handlers/detect-changes.ts:15, 249`)." - The inline line-number pairs (e.g., `7, 1103`) are dense and hard to parse. Could be restructured as a table or bulleted list.

**mcp_server/README.md:40** - Passive voice: "Compiled output lives in `dist/` and is used by MCP client configurations." - Could be more direct: "The build outputs compiled artifacts to `dist/` for MCP client configurations."

**mcp_server/lib/README.md:43** - Unclear scope: "Markdown, JSON, JSONC, YAML, YML and TOML files can be registered as `language='doc'` rows when `.opencode/` folders are explicitly opted in." - The "explicitly opted in" phrasing is vague. Should specify the opt-in mechanism (environment variable, per-call flag, or configuration).

**mcp_server/lib/README.md:93** - Missing file in directory tree: The directory tree (lines 139-171) lists `auto-rescan-policy.ts`, `exclude-rule-classifier.ts`, and `runtime-detection.ts` in the tree, but these files are NOT listed in the key files section (lines 177-203). This creates an inconsistency between the tree view and the documented key files.

### Cross-Document Inconsistencies (Beyond Iter-010's Findings)

**Database path conflict between README.md and INSTALL_GUIDE.md**:
- README.md:54 states default: `.opencode/skills/system-code-graph/mcp_server/database/`
- INSTALL_GUIDE.md:43 states default: `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`
- This is a critical drift that needs resolution. The INSTALL_GUIDE appears to be the source of truth for the post-migration location.

**Package naming inconsistency in ARCHITECTURE.md**:
- Line 28 correctly uses `@spec-kit/system-code-graph` for the code-graph package
- Line 108 uses `mk-spec-memory` (MCP server name) instead of `@spec-kit/system-spec-kit` (package name)
- Should standardize on npm package names for package references

## Questions Answered

Q1 substantively answered: Identified 5 NEW bugs/drift beyond the 6 found in iter-010, plus 5 additional weak prose issues and 2 cross-document inconsistency patterns. Combined with iter-010 findings, the total known bugs/drift is now 11 (3 known INSTALL_GUIDE + 6 from iter-010 + 5 new from iter-011), with 9 weak prose items total (3 from iter-010 + 5 new from iter-011 + 1 additional).

## Questions Remaining

- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from?
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q2: Determine sk-doc `--type` for each authored doc and validate mandatory anchors / H2 cases / TOC requirements per type contract. This will establish the baseline for Q3 (HVR violations) and inform Q5 (content gaps). Priority order per progressive focus guide: Q2 is next in sequence after Q1 completion.
