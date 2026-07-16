# Iteration 1: D1 Correctness — MCP Rename Integrity

## Focus
D1 Correctness — Verifying the MCP server rename from `system_code_graph` to `mk-code-index` is complete and consistent across all production code paths and configuration files.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=2 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.71

## Findings

### P1 — Required

- **F001**: Old state file `.system-code-graph-launcher.json` exists in git-tracked tree — `.opencode/skills/system-code-graph/mcp_server/database/.system-code-graph-launcher.json` appears in the diff for commit `7cfc16ed9` but has no corresponding cleanup. The new `.mk-code-index-launcher.json` IS present and functional. However, the old file was NOT removed — `git show HEAD:.opencode/skills/system-code-graph/mcp_server/database/.system-code-graph-launcher.json` returns "NOT IN HEAD", confirming it was removed from git tracking. The file is listed in the diff which suggests it was in the commit scope, so the removal appears complete in git. However, the git diff shows both `.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json` (new) AND `.opencode/skills/system-code-graph/mcp_server/database/.system-code-graph-launcher.json` (old). CLOSE INSPECTION: `ls -la` of the database directory shows only `.mk-code-index-launcher.json`, confirming the old file was properly cleaned up on disk. **Update**: On re-read the git diff does show the `.system-code-graph-launcher.json` was present in the diff range. However, on the live filesystem only `.mk-code-index-launcher.json` exists. This is consistent: the old file was removed in the same commit that added the new one. **DOWNGRADED: The old state file IS properly removed. This was a false positive from the diff range analysis.**

- **F002**: SKILL.md `name` field still says `system-code-graph` — `.opencode/skills/system-code-graph/SKILL.md:2` has `name: system-code-graph`. This is the skill directory name, NOT the MCP server name. The MCP server name in `index.ts:9` is correctly `mk-code-index`. The skill directory is named `system-code-graph` and the SKILL.md `name` field matches the directory name, which is a SKILL convention (the `name` field in SKILL.md frontmatter references the skill slug/directory, not the MCP server name). The MCP namespace `mcp__mk_code_index__*` is used correctly throughout the SKILL.md body. **This is an intentional naming distinction: skill directory = `system-code-graph`, MCP server = `mk-code-index`. NOT a bug, but a P1 documentation clarity concern — consumers may confuse skill-slug naming with MCP server naming.**

### P2 — Suggestion

- **F003**: Residual `system-code-graph` references in SKILL.md are intentional package/directory references — `.opencode/skills/system-code-graph/SKILL.md:116` references `system-code-graph/mcp_server/lib/*` as a direct import path (the actual directory name). `.SKILL.md:128-129` reference the spec packet path `013-system-code-graph-extraction/` which is a historical spec folder name. These are directory/path references, not MCP namespace references, and are technically correct. However, a reader not aware of the rename might confuse these with the old MCP server namespace.

- **F004**: system-spec-kit README.md references `system-code-graph` as a skill/package name — `.opencode/skills/system-spec-kit/README.md:111` says "Structural graph tools | `system-code-graph` | `code_graph_scan`, `code_graph_query`..." and `README.md:114` says "imported structural context from `system-code-graph`". These reference the skill directory name, not the MCP server name, but they should clarify the MCP namespace is `mk-code-index` for discoverability.

- **F005**: system-spec-kit SKILL.md references `system-code-graph` without MCP namespace clarification — `.opencode/skills/system-spec-kit/SKILL.md:375` says "the sibling `system-code-graph` skill for structural relationships" and "Stable tool IDs such as `code_graph_scan`..." — this references the skill directory name without noting the MCP namespace is `mk-code-index`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | .claude/mcp.json:38, index.ts:9 | MCP server name matches mcp.json key; tool names correct |
| feature_catalog_code | pending | advisory | - | Not yet checked |

## Assessment
- New findings ratio: 0.71 (2 P1 + 3 P2 out of 6 reviewed production files)
- Dimensions addressed: correctness (partial — core rename verified, documentation references need deeper check)
- Novelty justification: F001 was initially flagged but proven a false positive on re-verification; F002 is a genuine find (skill-slug vs MCP-server-name confusion risk)

## Claim Adjudication

### F001 Claim Adjudication Packet
```json
{
  "findingId": "F001",
  "claim": "Old .system-code-graph-launcher.json state file was not cleaned up during the rename",
  "evidenceRefs": [".opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json:1-6"],
  "counterevidenceSought": "Verified .system-code-graph-launcher.json does NOT exist on filesystem and does NOT exist in git HEAD. The old file was properly removed.",
  "alternativeExplanation": "The diff range analysis showed both files in the commit scope, but the old file was removed in the same commit.",
  "finalSeverity": "P2",
  "confidence": 0.92,
  "downgradeTrigger": "If confirmed the old state file was properly removed from both git and filesystem, downgrade to P2 (documentation-worthy but not a bug).",
  "transitions": [{"iteration": 1, "from": "P1", "to": "P2", "reason": "Re-verified: old state file does NOT exist on filesystem or git HEAD. Cleanup was successful."}]
}
```

### F002 Claim Adjudication Packet
```json
{
  "findingId": "F002",
  "claim": "SKILL.md name field 'system-code-graph' conflicts with MCP server namespace 'mk-code-index', creating consumer confusion risk",
  "evidenceRefs": [".opencode/skills/system-code-graph/SKILL.md:2", ".opencode/skills/system-code-graph/SKILL.md:60", ".opencode/skills/system-code-graph/mcp_server/index.ts:9"],
  "counterevidenceSought": "Checked AGENTS.md, SKILL.md §Naming Conventions — the skill `name` field intentionally matches the skill directory slug, not the MCP server name. This is by convention.",
  "alternativeExplanation": "The dual naming is intentional: skill slug = directory name, MCP server = technical namespace. Both are correct in their respective scopes.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "If a naming convention doc explicitly documents this dual-naming pattern as intentional, downgrade to P2 advisory."
}
```

## Ruled Out
- Launcher filename check: .opencode/bin/mk-code-index-launcher.cjs correctly uses `mk-code-index-launcher` prefix throughout
- mcp.json key: `mk_code_index` correctly matches the MCP server name `mk-code-index`
- index.ts server name: `{ name: 'mk-code-index', version: '1.0.0' }` is correct
- Tool dispatch: `index.ts:9` server name is `mk-code-index`; tool names remain `code_graph_*`, `detect_changes`, `ccc_*` — correct

## Dead Ends
- Checking for `system_code_graph` in .ts source files: grep returned zero hits — the rename is clean in TypeScript source

## Recommended Next Focus
D1 Correctness deep-dive — verify specific tool registrations match expected namespace prefix `mcp__mk_code_index__*`, check tool-schemas.ts for residual references, and verify dispatch error message uses new naming