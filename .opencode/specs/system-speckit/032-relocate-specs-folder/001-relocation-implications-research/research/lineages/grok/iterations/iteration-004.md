# Iteration 4: Spec Kit Memory MCP path resolution

## Focus

How Memory MCP discovers, indexes, aliases, and identity-resolves specs folders — and which paths break if `.opencode/specs` ceases to be the real tree.

## Findings

1. **Index discovery treats `.opencode/specs` as authoritative Gate D root.** `memory-index-discovery.ts` sets `canonicalSpecsRoot = workspace/.opencode/specs` and only falls back to `workspace/specs` when the canonical root is *absent*. With today's symlink, `existsSync(canonical)` is true, so discovery walks only the canonical path (realpath-deduped). If both a real top-level `specs/` and a leftover `.opencode/specs` exist, canonical wins and the new tree is ignored unless canonical is removed. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203]

2. **`index-scope` default exclude glob is only `**/.opencode/specs/**`.** Code-graph default excludes specs under that glob; a top-level `specs/` tree would not match this exclude pattern and could be mis-included or mis-excluded depending on include globs — scope policy must be updated with the move. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts:45]

3. **`resolveSpecFolderIdentity` prefers `.opencode`+`specs` segment pair, then bare `specs`.** `findSpecsAnchorIndex` scans for `segments[i]==='specs' && segments[i-1]==='.opencode'` first; else `lastIndexOf('specs')`. Top-level `specs/` identity resolution works via fallback, but any path still containing `.opencode/specs` remains preferred when both appear. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:282]

4. **Startup checks lock continuity to `.opencode/specs` only.** `startup-checks.ts` builds `specsRoot = path.join(workspace, '.opencode', 'specs')` and rejects paths outside that prefix — a hard blocker for an authoritative top-level tree until updated. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:264]

5. **SQL alias helpers partially dual-query, partially `.opencode`-only.** `memory-index-alias.ts` pushes both `%/.opencode/specs/${folder}/%` and `%/specs/${folder}/%` for some lookups, but other predicates still require `DOT_OPENCODE_SPECS_SEGMENT` / `.opencode/specs/` prefix — inconsistent dual-root support inside the same module family. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts:15] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts:95]

6. **Tool schemas already document both roots in prose** (`specs/**/ or .opencode/specs/**/`) while `includeSpecDocs` description still says "scan `.opencode/specs/` directories" — operator-facing contract drift inside the same tool surface. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:415] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:761]

7. **`findSpecsRoot` (graph parser) remains `.opencode`-parent-only** (iteration 1), compounding Memory graph metadata key-file lookup failures under a bare `specs/` root. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:847]

## Ruled Out

- "Memory MCP is already fully dual-root end-to-end" — discovery authority, startup-checks, index-scope, and findSpecsRoot contradict that.
- "Symlink inversion alone preserves Memory behavior" — discovery prefers canonical `.opencode/specs` whenever it exists; a leftover empty/stale canonical dir would shadow the real top-level tree.

## Assessment

- newInfoRatio: 0.93
- Novelty justification: Seven Memory-specific contracts; only findSpecsRoot overlaps iteration 1 as compounding evidence.
- Questions answered: Memory path resolution mapped; primary blockers are discovery authority + startup-checks + index-scope glob + partial alias SQL.

## Recommended Next Focus

Quantify in-repo `.opencode/specs` reference scale by file class and risk tier (runtime code vs docs vs packet content vs generated).
