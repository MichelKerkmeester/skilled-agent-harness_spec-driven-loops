# Iteration 004 — Spec Kit Memory MCP path resolution

## Focus

Trace Memory MCP's indexing, context recovery, resume, alias, canonical-path, startup-drift, and graph-metadata root resolution behavior when the real specs root moves from `.opencode/specs` to `specs`.

## Actions Taken

- Read the shared spec-document identity resolver and the maintained spec-root resolver inventory.
- Read Memory MCP document and graph-metadata discovery, explicit-folder indexing, generic base-path, resume, startup-drift, pending-recovery, alias-conflict, canonical-path, and graph-repair implementations.
- Compared the precedence and containment rules rather than treating every `specs` reference as equivalent.
- Used source inspection and targeted path-reference searches only; the live memory daemon was not available through its IPC socket, so no database-backed scan was claimed.

## Findings

- **F4.1 — Spec identity and broad path classification accept both roots, with canonical-pair preference when both appear.** [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:78-81,275-334`]
- **F4.2 — Memory document and graph-metadata discovery scans `.opencode/specs` when it exists and falls back to `specs` only when the canonical root is absent; realpath deduplication collapses a compatibility symlink.** [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221,308-379`]
- **F4.3 — Explicit indexing, generic base discovery, resume, and the maintained resolver inventory support both roots or direct paths, but precedence varies across resolver call sites.** [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/api/indexing.ts:66-92`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1364-1379`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`]
- **F4.4 — Pending recovery scans both roots while startup drift-marker and moved-folder recovery accept only `.opencode/specs`, creating a canonical-only blind spot after relocation.** [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1293-1321`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:261-292`]
- **F4.5 — Alias conflict analysis and canonical-path realpath handling support a transition bridge but do not make two independent roots discoverable simultaneously.** [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts:114-134,220-270`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts:18-75`]
- **F4.6 — Graph repair defaults to `.opencode/specs`, and the context-server description refresh supplies that old root as the generator base; both require a migration decision when the bridge is removed.** [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:14-22`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1978-1984`]

### F4.1 — Spec identity and broad path classification already recognize both roots.

`isSpecsScopedPath` accepts either a path containing `/specs/` or one beginning with `specs/`. `resolveSpecFolderIdentity` prefers the `.opencode/specs` pair when both shapes occur in an absolute path, then falls back to the last bare `specs` segment and derives the spec-folder identity from the segments below it. This makes identity generation comparatively tolerant of a top-level root, provided the caller supplies or discovers the moved path. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:78-81`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:275-334`]

### F4.2 — Memory document discovery is canonical-first, not dual-root enumeration.

Both `findSpecDocuments` and `findGraphMetadataFiles` construct `.opencode/specs` and `specs`, but scan only the canonical root when it exists; the bare root is a fallback only when the canonical root is absent. Canonical-path deduplication then collapses symlink aliases. Therefore a migration that leaves an old `.opencode/specs` directory in place can hide a separate real `specs` tree, while a compatibility symlink can preserve discovery by resolving both names to the same content. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:308-379`]

### F4.3 — Explicit indexing and several higher-level consumers are more tolerant.

The indexing API accepts an existing absolute path, a cwd-relative path, a discovered document, then canonical and legacy fallbacks. Generic MCP base discovery returns every existing `specs` and `.opencode/specs` candidate, while the resume ladder constrains and resolves both roots, preserving direct absolute input. The maintained resolver inventory records mixed precedence across roughly twenty call sites, so “Memory MCP supports both roots” is true for some consumers but not a uniform contract. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/api/indexing.ts:66-92`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1364-1379`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:863-925`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`]

### F4.4 — Recovery paths have a real canonical-only blind spot.

Pending-file recovery scans both `root/specs` and `root/.opencode/specs`, but startup drift-marker resolution and moved-folder recovery accept only paths beneath `.opencode/specs`. A moved folder represented in a top-level `specs` path can therefore be indexed by pending recovery yet ignored by rename-marker repair. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1293-1321`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:261-292`]

### F4.5 — Alias handling is prepared for a compatibility window.

Alias-conflict analysis treats `.opencode/specs` and `specs` as variants of the same path, and canonical-path utilities use `realpath` so symlinked paths collapse to one identity before extraction. This reduces duplicate-index risk during a symlink bridge, but it does not make canonical-first discovery enumerate two independent trees. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts:114-134`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts:220-270`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts:18-75`]

### F4.6 — Old-root defaults remain in graph repair and a context-server caller.

The standalone graph-repair script defaults to `.opencode/specs`, with `--root` as the escape hatch. The resolver inventory also classifies graph migration, graph backfill, and startup drift as canonical-only. Separately, the context server calls `generatePerFolderDescription` with a canonical `.opencode/specs` base; because that generator enforces real-path containment, a moved folder fails description generation when the old root is absent, but a temporary symlink bridge can keep the containment check true. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs:14-22`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:105-120`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1978-1984`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1050-1061`]

## Questions Answered

- How does Spec Kit Memory resolve spec paths, and what boundary changes would it require? It uses a mixed contract: identity, explicit paths, generic base discovery, resume, alias normalization, and pending recovery support both roots, while document discovery, graph repair, startup drift recovery, and one description-refresh caller remain canonical-first or canonical-only.

## Questions Remaining

- What is the measured reference count and the safest migration shape under these constraints?

## Ruled Out

- Treating Memory MCP as uniformly dual-root-aware is ruled out by the different discovery, recovery, and repair implementations.
- A live database/index scan was not confirmed because the memory daemon IPC endpoint was unavailable; source-level behavior is the evidence for this iteration.

## Edge Cases

- Keeping `.opencode/specs` as a symlink to `specs` preserves real-path containment and canonical discovery, but a separate old directory can mask the new root.
- Removing the bridge before updating startup drift and graph-repair defaults creates a different failure class from ordinary document indexing.
- Alias conflict code is useful during transition, but it cannot reconcile two divergent trees without an explicit migration policy.

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp-server/api/indexing.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts`
- `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts`
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts`
- `.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs`

## Assessment

The Memory MCP boundary is not one switch. The migration must preserve or deliberately replace canonical-first discovery, startup drift repair, graph repair defaults, and the context-server description-refresh base, while retaining alias and real-path behavior for any compatibility period.

## Reflection

This iteration narrowed the risk from “MCP path support” to precedence asymmetry: the most dangerous cases are callers that silently choose `.opencode/specs` when both roots exist or reject a top-level path outright. The final pass should measure how many production references fall into those categories and turn that classification into a staged migration shape.

## Recommended Next Focus

Measure the remaining production reference surface and derive the safest migration sequence under the Git, mirror, and Memory MCP constraints.
