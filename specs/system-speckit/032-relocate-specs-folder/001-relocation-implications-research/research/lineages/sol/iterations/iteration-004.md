# Iteration 4: Memory MCP path resolution and index identity

## Focus

Trace how Spec Kit Memory discovers spec documents, normalizes folder identity, resolves explicit scan requests, repairs moved folders, resumes continuity, and locates its database.

## Actions Taken

1. Read the shared spec-directory utilities and Memory MCP discovery functions.
2. Compared discovery, resume, authored-continuity, startup-recovery, and explicit-indexing root precedence.
3. Read shared spec-folder identity extraction and memory parser normalization.
4. Separated database storage configuration from indexed document path and `spec_folder` identity.
5. Traced moved-folder recovery and generated-description refresh paths.

## Findings

1. Memory MCP does not have one root policy. Spec-document and graph-metadata discovery prefer `.opencode/specs` and fall back to `specs`, while search folder discovery prefers `specs`, startup pending-file recovery scans both, and resume/authored-continuity resolution prefer `.opencode/specs`. Relocation therefore requires coordinated precedence inversion, not one constant change. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:203] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts:316] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1369] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1303] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:863] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/continuity/authored-continuity-snapshot.ts:58]
2. The generic script configuration is old-root-first and realpath-deduplicates aliases. A reverse `.opencode/specs -> ../specs` link can suppress duplicate scans during transition, but it can also mask consumers whose precedence was never migrated. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:321] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/config.ts:338] [INFERENCE: realpath deduplication plus mixed consumer precedence]
3. Explicit indexing is comparatively resilient: absolute existing paths and direct workspace-relative paths win, then discovered documents, then `.opencode/specs`, then `specs`. It still encodes the old canonical label and fallback order, so callers supplying only a packet-relative identity can resolve through the wrong alias during a split-root state. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/api/indexing.ts:68]
4. Stored `spec_folder` values are root-relative rather than rooted paths. `resolveSpecFolderIdentity` recognizes both `.opencode/specs` and bare `specs`, and memory parsing extracts the suffix below a `specs/` segment after canonicalizing symlinks. The logical packet identity can remain stable across relocation if all writers use these shared normalizers. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:278] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:308] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/parsing/memory-parser.ts:457]
5. Physical file identity still changes. The index stores `file_path` and `canonical_file_path`, delete/rename handling queries those values, and symlink canonicalization can make alias and real paths collapse differently before and after inversion. A controlled reindex with duplicate checks is required even if `spec_folder` strings remain unchanged. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1611] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/parsing/memory-parser.ts:457] [INFERENCE: physical root inversion changes canonical file paths]
6. The SQLite database location is independent of the specs root. It derives from `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, `MEMORY_DB_PATH`, or the shared default DB path; the database file itself need not move. The migration concerns rows and indexes referencing source files, not database placement. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/core/config.ts:51] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/core/config.ts:107]
7. Startup repair contains old-root-only write paths: drift-marker rename resolution is confined to `.opencode/specs`, and the moved-folder refresh generates descriptions relative to `.opencode/specs`. A reverse alias could keep these code paths operational temporarily, but removing it before updating them would break rename repair or produce incorrect relative descriptions. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/startup-checks.ts:261] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1974]

## Questions Answered

- Answered: Memory MCP discovery, identity, persistence, startup-repair, and continuity consequences.

## Questions Remaining

- Executable/documentary reference classification and final migration verification gates.
- Ownership decision for downstream project-local specs.

## Ruled Out

- Moving the Memory MCP database as part of the specs-tree relocation.
- Assuming stable `spec_folder` values eliminate the need to reindex physical file paths.
- Removing the compatibility alias before startup-repair and continuity consumers migrate.
- Treating one resolver as the sole Memory MCP root authority.

## Dead Ends

- A live reindex was not run because it would mutate the shared Memory MCP database outside the lineage boundary.

## Edge Cases

- Ambiguous input: callers may pass absolute folders, workspace-relative paths, or packet-relative identities; each follows a different branch.
- Contradictory evidence: some Memory MCP readers already prefer top-level `specs`, while others explicitly call `.opencode/specs` canonical.
- Missing dependencies: no isolated database fixture exists inside this lineage.
- Partial success: logical identity stability is confirmed from code; physical-row behavior needs an implementation fixture.

## Sources Consulted

- `.opencode/skills/system-spec-kit/scripts/core/config.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp-server/api/indexing.ts`
- `.opencode/skills/system-spec-kit/mcp-server/startup-checks.ts`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/continuity/authored-continuity-snapshot.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/parsing/memory-parser.ts`
- `.opencode/skills/system-spec-kit/mcp-server/core/config.ts`

## Assessment

- New information ratio: 0.78
- Novelty justification: five findings were new and two converted known mixed-root behavior into concrete index and cutover risks.
- Confidence: high for path-resolution code; medium for live index migration behavior because shared database mutation was intentionally excluded.

## Reflection

- What worked and why: tracing each consumer independently exposed incompatible precedence and separated logical packet identity from physical file identity.
- What did not work and why: live index/recovery verification would violate the detached lineage boundary.
- What I would do differently: build a temporary-workspace plus temporary-database fixture during implementation and assert row identity before and after alias inversion.

## Recommended Next Focus

Classify remaining references by execution risk, inspect existing migration infrastructure, and synthesize a staged migration and verification plan.
