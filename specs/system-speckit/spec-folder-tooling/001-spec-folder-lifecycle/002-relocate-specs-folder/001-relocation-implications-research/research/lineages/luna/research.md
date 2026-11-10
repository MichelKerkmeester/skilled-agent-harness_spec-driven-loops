---
title: "Feature Research: Relocating the Spec Kit Specs Root"
description: "Lineage-local research on moving the repository specs root from .opencode/specs to top-level specs."
trigger_phrases:
  - "relocate specs folder"
  - "top-level specs migration"
  - "Spec Kit root resolution"
importance_tier: "normal"
contextType: "general"
---

# Feature Research: Relocating the Spec Kit Specs Root

This detached lineage investigates the implications of moving the real specs directory from `.opencode/specs` to a top-level `specs/` directory. It is research only: no source files, symlinks, ignore rules, runtime mirrors, or parent-packet documents were changed.

## 1. METADATA

- Research ID: `fanout-luna-1786019208170-r5nald`
- Related spec: `.opencode/specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research/spec.md`
- Status: Complete
- Date started: 2026-08-06
- Date completed: 2026-08-06
- Executor: `cli-codex model=gpt-5.6-luna`
- Lineage: `luna`
- Artifact boundary: this lineage directory only

## 2. INVESTIGATION REPORT

### Request Summary

Determine which Spec Kit tools, runtime mirrors, Git rules, global ignore rules, and Memory MCP consumers assume `.opencode/specs`; measure the reference surface; and recommend the lowest-risk migration shape.

### Current Behavior

The repository currently has a tracked mode-120000 `specs` symlink pointing to `.opencode/specs`. The implementation already recognizes both root spellings in several helpers, but precedence is inconsistent: some consumers are direct-path-first or dual-root, some are canonical-first, and graph/startup repair paths remain canonical-only. [SOURCE: `git ls-files --stage -- specs`; `readlink specs`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`]

### Key Findings

1. **Tooling is unevenly tolerant.** `create.sh` and graph backfill retain old defaults; `validate.sh` is argument-driven but has a canonical-only child-manifest exception; description generation is comparatively path-agnostic when given the right base. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:412-415,712-727,811-815`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:20-33,121-139,212-221`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:39-77,99-103`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:238-260,278-298,319-367`]
2. **Runtime mirrors do not own a specs tree.** The Claude sync manifest is stale relative to the filesystem, and current mirror checks already have unrelated failures. [SOURCE: `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:27-38,100-151`] [SOURCE: `.claude/SYNC.md:14-30`]
3. **Git topology and ignores are a separate risk.** The tracked symlink becomes a real directory, while downstream clones are governed by global `/.opencode/` and `/specs` ignores unless they add local negations. [SOURCE: `.gitignore:5-11,260-279`] [SOURCE: `/Users/michelkerkmeester/.gitignore_global:10-16`]
4. **Memory MCP is mixed rather than uniformly dual-root-aware.** Identity, explicit paths, resume, pending recovery, aliases, and generic base discovery support both roots; document discovery, startup drift repair, graph repair defaults, and one context-server caller remain canonical-first or canonical-only. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221,308-379`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:261-292`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1293-1321,1978-1984`]
5. **The measured source surface is broad but classifiable.** A production-shaped search measured 100 literal `.opencode/specs` matches across 96 lines and 42 Spec Kit source files; a maintained resolver inventory contains 21 entries. [MEASUREMENT: iteration-005 count receipts] [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`]

### Recommendations

Use a top-level-authoritative migration with a temporary `.opencode/specs -> ../specs` compatibility symlink. Centralize root precedence, update canonical-only/default-root consumers before removing the bridge, and validate source and downstream Git contexts separately. This is an inference from the canonical-first discovery, realpath aliasing, recovery, and global-ignore evidence. [INFERENCE: iterations 2, 4, and 5]

Alternative approaches have clear costs:

- Literal replacement is fast to script but changes behavior in callers with different root contracts.
- Removing the old path immediately produces a smaller final topology but exposes startup, graph, description-refresh, and downstream-ignore gaps at once.
- Keeping two independent real roots avoids a symlink but allows canonical-first discovery to silently index the wrong tree.

## 3. EXECUTIVE OVERVIEW

### Executive Summary

The relocation is a medium-to-high-risk contract migration. The highest-risk surface is not `.claude`, `.codex`, `.cursor`, `.devin`, or `.pi`: their active generators do not reference a specs tree. The risk sits in root selection, graph and startup repair, Memory MCP discovery precedence, tracked symlink topology, and global ignore behavior in downstream repositories.

The codebase is not starting from zero. Shared identity and artifact-routing helpers already understand both `.opencode/specs` and `specs`, and canonical-path utilities collapse symlink aliases. That supports a compatibility window. It does not remove the need to update canonical-only callers or make two divergent real roots safe.

### Architecture Diagram

```
                    declared authority
                         top-level
                         specs/
                           │
       temporary bridge   │   direct/dual-root readers
 .opencode/specs ─────────┘   ───────────────┐
      symlink to ../specs                    │
                                            ▼
                tooling / Memory MCP / graph repair
                                            │
              Git index + local/global ignore policy
```

### Quick Reference

Use the bridge during migration when:

- old and new callers must coexist;
- the repository is symlinked into downstream projects;
- Memory indexing and graph metadata need a controlled re-scan.

Do not remove the bridge until:

- canonical-only startup and graph paths are updated;
- source and downstream ignore matrices pass;
- both-root and divergent-root tests have explicit outcomes;
- the existing mirror drift baseline is recorded.

### Research Sources

| Domain | Primary local sources |
|---|---|
| Tooling | `create.sh`, `validate.sh`, `generate-description.ts`, `backfill-graph-metadata.ts` |
| Shared routing | `review-research-paths.cjs`, `spec-doc-paths.ts`, `spec-root-registry.ts` |
| Git | `.gitignore`, `/Users/michelkerkmeester/.gitignore_global`, Git index/readlink checks |
| Mirrors | `.claude/.codex/.cursor/.devin/.pi/SYNC.md`, runtime mirror generators |
| Memory MCP | discovery, indexing, resume, recovery, alias, canonical-path, startup, and repair modules |
| Measurement | iteration-local `rg` counts and five iteration artifacts |

## 4. CORE ARCHITECTURE

### Root resolution layers

1. **Topology**: the filesystem and Git index decide whether `specs` is a symlink or real directory.
2. **Root selection**: callers choose canonical, legacy, direct, or all existing roots.
3. **Containment**: validators and writers decide whether a target lies under an approved root.
4. **Identity**: spec-folder identity is derived relative to a recognized root.
5. **Discovery/recovery**: index, graph, startup, resume, and pending-file paths independently apply precedence.
6. **Alias normalization**: realpath and path-alias code collapses compatibility spellings.

The migration is safe only when these layers agree on top-level authority and explicit compatibility semantics.

### Data flow

```
filesystem topology
  -> root resolver / caller-provided path
  -> containment + identity
  -> document/index/graph/recovery consumer
  -> canonical path and alias reconciliation
  -> Git/ignore and downstream verification
```

## 5. TECHNICAL SPECIFICATIONS

### Tooling

- `create.sh` accepts both parent shapes in validation, but defaults `SPECS_DIR` to `.opencode/specs`; its graph-relative fallback strips only the old prefix. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:412-415,712-727,811-815`]
- `validate.sh` resolves rules relative to itself and accepts an existing folder argument, but a child-manifest fallback recognizes only `*/.opencode/specs/...`. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:20-33,121-139,212-221`]
- `generate-description.ts` checks real-path containment and delegates identity to the shared resolver. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:39-77,99-103`]
- `backfill-graph-metadata.ts` discovers the repository through `.opencode/specs`, defaults its scan root there, and supports `--root` as an override. [SOURCE: `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:238-260,319-367`]
- Shared artifact routing already normalizes both root spellings and approves both artifact roots. [SOURCE: `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:58-88,256-281,335-365`]

### Memory MCP

- `resolveSpecFolderIdentity` recognizes both roots and prefers the `.opencode/specs` pair when both appear. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:275-334`]
- Document and graph-metadata discovery scan `.opencode/specs` if present and use `specs` only as fallback. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221,308-379`]
- Explicit indexing, generic base discovery, and resume preserve direct or dual-root paths. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/api/indexing.ts:66-92`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1364-1379`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:863-925`]
- Pending recovery scans both roots; startup drift-marker resolution accepts only `.opencode/specs`. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1293-1321`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:261-292`]
- Alias conflict and canonical-path code are compatible with a bridge, but not with two divergent roots. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts:114-134,220-270`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts:18-75`]

### Resolver inventory

The maintained inventory has 21 entries spanning legacy-first, canonical-first, direct-path-first, membership-only, and canonical-only consumers. The existence of this inventory is evidence of a distributed contract, not proof that one edit will update all callers. [SOURCE: `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts:29-169`]

## 6. CONSTRAINTS & LIMITATIONS

- All outputs from this run are lineage-local; parent synthesis, metadata reconciliation, and memory save were intentionally deferred.
- The nested `cli-codex` dispatch was blocked by the recursion guard, so the five leaf iterations used the documented bounded direct-mode fallback and recorded route provenance.
- Every graph-convergence probe failed before producing graph signals because the installed `better-sqlite3` binary is Node ABI 127 while the active Node requires ABI 141.
- The live Spec Kit Memory daemon IPC endpoint was unavailable; Memory findings are source-level, not a live database scan.
- Existing mirror checks are not a clean baseline: shared mirror, Codex agent, and Pi agent checks report unrelated drift, while prompt and roster checks pass.
- The `rg` measurement is deliberately scoped. It excludes tests, fixtures, benchmarks, eval data, generated output, archives, docs-oriented trees, and node_modules; it is not a count of every historical mention in the repository.

## 7. INTEGRATION PATTERNS

### Compatibility bridge

Use `specs/` as the declared authority and keep `.opencode/specs -> ../specs` as a relative symlink during the migration window. Realpath canonicalization then gives both spellings one identity. [INFERENCE: derived from `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts:18-75`]

### Explicit root resolution

Callers should accept a direct absolute path first, then resolve against the declared authority, then use the compatibility fallback. When both roots exist as real directories, the code must reject ambiguity or emit an explicit authority decision; it must not silently choose an old canonical directory. [INFERENCE: derived from `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203-221`]

### Downstream Git policy

The source repository needs local negations for the new real directory and any compatibility link. Downstream symlinked repositories need their own explicit policy because `/specs` and `/.opencode/` are anchored global ignores. [SOURCE: `.gitignore:5-11`] [SOURCE: `/Users/michelkerkmeester/.gitignore_global:10-16`]

## 8. IMPLEMENTATION GUIDE

This is a research recommendation, not an implementation performed by this lineage.

1. **Declare topology and authority**: create the real top-level `specs/` root and retain `.opencode/specs -> ../specs` as a temporary compatibility alias.
2. **Centralize precedence**: make top-level `specs` authoritative, preserve direct-path handling, and retain legacy fallback only for the bridge window.
3. **Repair canonical-only callers**: update create defaults, graph backfill/repair defaults, startup drift-marker containment, and the context-server description-refresh base.
4. **Harden special cases**: update validate child-manifest matching, graph-relative path stripping, provider-specific ignore entries, and operator-facing path examples.
5. **Reindex and reconcile**: run Memory document/graph discovery, alias-conflict checks, graph metadata repair, and resume/recovery checks against both spellings.
6. **Prove downstream behavior**: run the six-case matrix below in source and downstream clone contexts.
7. **Remove the bridge last**: only after no consumer depends on the old path and the downstream ignore policy is shipped.

## 9. CODE EXAMPLES & SNIPPETS

The intended compatibility seam is conceptually:

```
resolveSpecRoot(input):
  if input is an existing approved absolute path:
    return input
  if top-level specs exists:
    return top-level specs
  if legacy .opencode/specs exists:
    return legacy root
  fail with an ambiguity/error diagnostic when both real roots diverge
```

This is pseudocode only. The research did not change the resolver implementation.

## 10. TESTING & DEBUGGING

The cutover matrix must include:

| Case | Expected proof |
|---|---|
| Only `specs/` exists | create, validate, description, graph, Memory discovery, resume |
| Only `.opencode/specs/` exists | compatibility fallback remains functional |
| `.opencode/specs -> ../specs` | one canonical identity; no duplicate Memory rows |
| Both roots are divergent real directories | explicit failure or declared top-level authority |
| Source checkout | local negations track the real directory and bridge |
| Downstream checkout | global ignores do not hide the intended tracked paths |

Also capture the pre-existing mirror check failures before comparing post-migration output.

## 11. PERFORMANCE OPTIMIZATION

No performance claim was made. The recommended bridge avoids an unnecessary duplicate scan by allowing realpath deduplication, but the actual indexing cost must be measured after migration with the local Memory database available.

## 12. SECURITY CONSIDERATIONS

Containment checks must remain real-path based and must not accept a path merely because its string begins with `specs`. Symlink bridges need the same approved-root and traversal checks as real directories. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts:59-77`] [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts:44-75`]

## 13. FUTURE-PROOFING & MAINTENANCE

Keep the 21-entry resolver inventory synchronized with actual call sites. Add fixtures for top-level-only, bridge, and divergent-root cases. Treat root precedence as an explicit contract, not an incidental order in arrays. Remove old-root examples and static contract-census paths only when the referenced artifacts have moved or the historical path is intentionally retained.

## Eliminated Alternatives

- **Blind literal replacement**: rejected because the 100 references have different semantics.
- **Immediate bridge removal**: rejected because canonical-only startup/graph/description paths and downstream ignores would fail simultaneously.
- **Two divergent roots**: rejected because canonical-first discovery can silently ignore the top-level tree.
- **Regenerate all runtime mirrors**: rejected as a relocation requirement; the active mirror code has no specs reference. Existing drift remains a separate baseline.

## Divergence Map

| Direction | Evidence | Status |
|---|---|---|
| Tooling defaults and special cases | `create.sh`, `validate.sh`, description, graph backfill | Audited; distinct fixes required |
| Git/symlink/global ignore behavior | tracked `specs` symlink, `.gitignore`, global excludes | Audited; downstream gate required |
| Runtime mirrors | five manifests, generators, filesystem checks | Audited; no relocation-driven generator path |
| Memory MCP | discovery, resume, recovery, aliases, startup, repair | Audited; canonical-only gaps remain |
| Broad reference surface | 100 literals / 42 source files / 21 resolver entries | Measured |

The graph coverage path remained unavailable, so this map reflects direct source and command evidence, not graph-derived convergence.

## Open Questions

All five research questions are answered. Exact patch ownership, downstream operator communication, and implementation sequencing details belong to a follow-up implementation packet.

## 14. API REFERENCE

Relevant contracts include `resolveSpecFolderIdentity`, `findSpecDocuments`, `findGraphMetadataFiles`, `resolveSpecFolderPath`, `getSpecsBasePaths`, `resolveSpecFolder` in the resume ladder, `resolveWorkspaceSpecPath`, and `repair-graph-metadata.mjs --root`. Their current locations and precedence are listed in the cited source files and resolver inventory.

## 15. TROUBLESHOOTING GUIDE

- If Memory finds no moved documents, check whether `.opencode/specs` still exists as a separate real directory; canonical-first discovery may be masking `specs/`.
- If description refresh returns null, check whether the old base path was removed before the caller was updated.
- If graph repair scans nothing, pass the new root explicitly and update the default.
- If Git hides the new directory, inspect both local negations and the downstream `core.excludesfile`.
- If mirror checks fail, compare with the recorded pre-existing drift before assigning causality to relocation.

## 16. ACKNOWLEDGEMENTS

This synthesis is derived from five lineage-local evidence iterations, the repository source tree, read-only Git/path checks, and the deep-research reducer. No external web sources were used.

## APPENDIX

### Measurement receipt

- Spec Kit source filter: 100 `.opencode/specs` occurrences, 96 matching lines, 42 files.
- Root-selector search: 171 selector-related lines.
- Maintained resolver inventory: 21 entries.
- Deep command YAML: 12 old-root mentions across 10 files.
- Deep-loop shipped census: 6 old-root literals across 2 files.
- Active runtime mirror source: 0 matching source lines.
- Root `.gitignore`: 18 specs-related matches.

### Iteration ratios

`1.00 -> 0.85 -> 0.75 -> 0.65 -> 0.45`

### Artifact references

- `deep-research-state.jsonl`
- `deep-research-strategy.md`
- `findings-registry.json`
- `deep-research-dashboard.md`
- `resource-map.md`
- `iterations/iteration-001.md` through `iteration-005.md`
- `deltas/iter-001.jsonl` through `iter-005.jsonl`

## CHANGELOG & UPDATES

- 2026-08-06: Completed five bounded evidence iterations and lineage-local synthesis.
- 2026-08-06: Recorded graph-convergence ABI limitation and pre-existing mirror drift as explicit constraints.
