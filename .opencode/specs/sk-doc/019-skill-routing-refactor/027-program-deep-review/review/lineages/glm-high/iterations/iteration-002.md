# Iteration 2: Security — Trust Boundaries, Path Containment, Untrusted Ingestion

## Focus
Dimension: security. The advisor watcher ingestion seam (`watcher.ts`) and the generator's path validation. Trust boundary: `graph-metadata.json` is authored skill content read by the daemon and treated as untrusted input (the loop-protocol explicitly equates review targets with untrusted fetched content). Key questions: are `derived.key_files` paths contained to the workspace? Are alias/leaf resource ids path-traversal-safe? Is the `isWithin` containment primitive sound across platforms? Are atomic writes safe?

## Scorecard
- Dimensions covered: security
- Files reviewed: 4 (watcher.ts, provenance.ts, generate-leaf-manifest.cjs, leaf-resource-contract.cjs)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.25

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F004**: `isWithin` containment primitive is unsound for cross-drive Windows paths, `system-skill-advisor/mcp-server/lib/daemon/watcher.ts:166-169` (identical copy at `lib/derived/provenance.ts:44-48`). `relative(parent, child)` for paths on different Windows drives returns an absolute drive path (e.g. `D:\...`); the guard `!relativePath.startsWith('/')` is posix-only, so a cross-drive `child` is reported as "within" `parent`. `isWithin` is the primitive that attributes a changed file to a skill slug (`skillSlugForPath`, watcher.ts:264-275) and that contains ingested `key_files` (`workspaceRelativeFilePath`, provenance.ts:50-63). The codebase is cross-platform-aware (`sep`, `toPosix`, drive-letter regex in `leaf-resource-contract.cjs:109`), so Windows is at least contemplated. Realistic likelihood is low (the advisor daemon is a mac/linux dev tool), but the primitive is security-relevant and the drive-letter case is the one gap `assertContainment` does handle (`/^[A-Za-z]:\//`). Recommend unifying on the `assertContainment`-style drive-letter check or documenting posix-only support.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | provenance.ts:50-63, leaf-resource-contract.cjs:104-120, generate-leaf-manifest.cjs:61-66 | Ingestion containment claims hold against shipped behavior (see Ruled Out). |

## Assessment
- New findings ratio: 0.25 (1 new P2 across 4 files)
- Dimensions addressed: security
- Novelty justification: The ingestion seam's path containment is genuinely strong — `workspaceRelativeFilePath` rejects absolute paths, checks `isWithin` after resolve, AND re-checks against the realpath-resolved root to defeat symlink escapes. The single finding is a narrow cross-platform edge in a shared primitive, not an active exploit path.

## Ruled Out
- "Malicious `derived.key_files` with `..` escapes the workspace": ruled out — `workspaceRelativeFilePath` (provenance.ts:50-63) rejects `isAbsolute`, checks `isWithin(root, absolutePath)`, then re-resolves both root and target through `realpathSync` and re-checks `isWithin(realRoot, realPath)`. A `key_files` entry of `../../etc/passwd` resolves outside the root → `isWithin` false → returns `null` → filtered at watcher.ts:214. Symlink escapes are caught by the realpath re-check. Confirmed secure.
- "Alias diskPath traversal": ruled out — `readAliasEntries` (generate-leaf-manifest.cjs:61-66) rejects `diskPath` that is absolute or contains `..` segments; `leafResourceId` from the disk walk is built from `path.relative(packetRoot, full)` and later validated by `assertContainment` (leaf-resource-contract.cjs:104-120), which rejects absolute, `..`, empty/`.` segments, and out-of-root prefixes.
- "Atomic write leaves a stale tmp file": ruled out — `writeFileAtomic` (watcher.ts:344-359) writes a pid+timestamp tmp, fsyncs, renames, fsyncs the dir, and on `ENOENT` (concurrent cleanup) best-effort removes the tmp; non-ENOENT errors re-throw after cleanup. Sound.

## Dead Ends
- Searched for secret/credential exposure in the watcher and generators; no secrets are read or logged (hashes are sha256 of file bytes, diagnostics carry paths and error messages only). No finding.

## Recommended Next Focus
D3 Traceability — spec_code: doctrine (`skill-root-metadata-contract.md`) vs shipped behavior (file matrix, fleet roster, generated-vs-authored, exit codes), plus dead links and restated-vs-linked content across the program's edited docs.

Review verdict: PASS
