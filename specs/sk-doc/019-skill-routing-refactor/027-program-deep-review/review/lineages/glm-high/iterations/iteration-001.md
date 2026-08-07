# Iteration 1: Correctness — Contract + Fleet Gate Logic

## Focus
Dimension: correctness. Surface 1 (spec.md §2.1): the H/S class contract, the command-metadata core schema, and the fleet gate's classification, freshness, and probe logic. Files: `create-skill/scripts/lib/skill-root-metadata-contract.cjs`, `lib/command-metadata-schema.cjs`, `lib/leaf-resource-contract.cjs`, `ci-skill-root-metadata.cjs`, `generate-leaf-manifest.cjs`, `ci-leaf-manifest-freshness.cjs`. Also re-read the watcher's ingestion logic for correctness of the addDir/unlinkDir/refresh seam.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.43

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F001**: Fleet gate top-level discovery swallows all readdir errors, `create-skill/scripts/ci-skill-root-metadata.cjs:81`. `findSkillRoots` wraps `fs.readdirSync(skillsDir, { withFileTypes: true })` in a bare `try { ... } catch { return []; }`. Only `ENOENT` (a race where the dir vanishes between the `existsSync` guard at line 374 and the read) is benign; any other failure (`EACCES`, `EMFILE`, `EIO`) returns an empty root list, so `run` reports `checked=0 passed=0 failed=0` and exits `0`. The gate's stated purpose (header comment lines 14-19 and doctrine `skill-root-metadata-contract.md` §5) is that "a scanner that begins at outputs can never report a missing output" and "an unadopted root is a finding rather than a silence" — a top-level readdir failure inverts that into a silent pass. Recommend narrowing the catch to re-throw non-`ENOENT` codes (or emit a `GATE_CANNOT_RUN` violation and exit `2`, matching the documented "cannot run" exit code).
- **F002**: Within-entry duplicate owned signals are silently allowed, `create-skill/scripts/lib/command-metadata-schema.cjs:143-151`. The cross-entry guard compares `seenSignals.get(key) !== entry.command` before emitting `DUPLICATE_OWNED_SIGNAL`; when the SAME command lists the same signal twice, `seenSignals.get(key) === entry.command` routes to the `else` branch and re-sets the key with no violation. Cross-entry duplicates (the ambiguous-routing case) are caught correctly; within-entry duplicates are redundant rather than ambiguous, but the schema's stated invariant (header lines 29-30: "owned signals unique across entries") is not enforced within a single entry, and the omission is untestable as a violation. Recommend either deduplicating within an entry first or documenting that within-entry repetition is legal.
- **F003**: Choreography resource probe resolves against repo-root OR skillDir, `create-skill/scripts/ci-skill-root-metadata.cjs:288-292`. `resourceExists: (rel) => fs.existsSync(path.join(repoRoot, rel)) || fs.existsSync(path.join(skillDir, rel))`. The schema doc (`command-metadata-schema.cjs:75-77`) describes the probe as "repo-root-relative". The `|| skillDir` fallback lets a resource that exists only skill-relative pass, masking a mis-scoped repo-root resource (e.g. a choreography `resource` that should be `.opencode/skills/<hub>/...` but is written as a bare skill-relative path). All seven committed `command-metadata.json` files use repo-root-relative paths today, so this is latent rather than active. Recommend documenting the dual resolution or dropping the skillDir fallback to match the stated contract.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | ci-skill-root-metadata.cjs:81, command-metadata-schema.cjs:143-151, ci-skill-root-metadata.cjs:291 | Gate output matches doctrine fleet roster (verified live: 11 roots, 7H/4S, 0 violations); three code-vs-intent soft spots recorded as P2. |

## Assessment
- New findings ratio: 0.43 (3 new P2 across 7 files; severity-weighted ratio = (3*1.0)/(7 files reviewed) ≈ 0.43)
- Dimensions addressed: correctness
- Novelty justification: First pass over the contract+gate; findings are defensive-hardening shapes (broad catches, permissive probes, within-entry dedup) rather than active breakage. The fleet is in a clean, conforming state (live gate run confirms 11/11 pass), so no P0/P1 correctness failure is present.

## Ruled Out
- "Classification depends on generated output": ruled out — `classifyPresence` (skill-root-metadata-contract.cjs:203-217) is deliberately blind to every non-discriminator file; a missing manifest still classifies. Verified.
- "Standalone alias projection could destroy hub alias data": ruled out — `checkDerivedAliases` (ci-skill-root-metadata.cjs:226-252) is only called when `isGenerated('leaf-aliases.json', skillClass)` is true, i.e. standalone only; hubs never reach it.

## Dead Ends
- Searched for a manifest byte-drift bug in `buildManifestBytes`/`canonicalManifestBytes`; the canonical sort + duplicate-composite guard (generate-leaf-manifest.cjs:196-214) is sound and the freshness gate confirms byte-identical regeneration across the fleet.

## Recommended Next Focus
D2 Security — trust boundaries and path containment in the watcher ingestion seam (`watcher.ts` `isWithin`, `parseDerivedKeyFiles`, `workspaceRelativeFilePath`) and the generator's alias/leaf path validation, plus the untrusted-content posture of ingested `graph-metadata.json`.

Review verdict: PASS
