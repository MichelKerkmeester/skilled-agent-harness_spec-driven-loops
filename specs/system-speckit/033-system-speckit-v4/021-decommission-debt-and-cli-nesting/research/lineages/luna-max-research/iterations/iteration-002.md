# Iteration 2: Live retired-surface residue

## Focus

Trace the current executable path, package metadata, and runtime source for retired database and memory identity. The key distinction is between the preserved skill-advisor/shared embedding owner and the system-spec-kit runtime/scripts packages that D8 says no longer contain the memory engine.

## Findings

1. **LUNA-007 — The live spec-folder detector still opens the retired database. P0. CONFIRMED.** `scripts/spec-folder/folder-detector.ts` imports `DB_PATH` and constructs a readonly SQLite connection to query the `session_learning` table. `spec-folder/index.ts` exports that detector, and the main workflow calls `detectSpecFolder()` during its normal save path. `@spec-kit/shared/paths` derives the default DB path from the runtime database location and still honors `MEMORY_DB_PATH`. This is a real producer-consumer path, not a historical fixture. Smallest fix: remove the database fallback and its dependency if filesystem/continuity signals are authoritative, or explicitly re-home the lookup under a documented successor owner and amend D8/D7 evidence. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:1341-1351] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/index.ts:9-35] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:21-23] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:783-787] [SOURCE: .opencode/skills/system-spec-kit/shared/paths.ts:143-171]

2. **LUNA-008 — The renamed runtime package still ships a database configuration and recovery subsystem. P1. CONFIRMED.** `runtime/core/config.ts` resolves `SPEC_KIT_DB_DIR`, `SPECKIT_DB_DIR`, and `MEMORY_DB_PATH`, computes a database filename, and initializes those paths at module load. `runtime/lib/storage/transaction-manager.ts` imports that resolver and uses it to decide whether pending files have committed database rows. The runtime `tsconfig.json` includes both `core/**/*.ts` and `lib/**/*.ts`, so these files are part of the package source/build surface even though the bounded non-test search found no public runtime caller for the storage module. Smallest fix: delete the orphaned legacy DB/recovery modules from the runtime package or document and test a specific surviving owner; do not leave a compiled retired surface reachable by deep import. [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-9] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:364-389] [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:34-45] [INFERENCE: absence of a non-test importer lowers confidence that this path is exercised in normal operation, but compilation keeps it shipped]

3. **LUNA-009 — The public scripts package and hook path still present the successor as a memory workflow. P1. CONFIRMED.** `scripts/package.json` describes “memory management” and names `dist/memory/generate-context.js` as its main entry. The source CLI says it runs the “memory workflow”, exposes `--session-id` for “saved memory metadata”, and is the target of the live Claude session-stop hook. The implementation may now write packet-local continuity, but its public package identity and launcher path still describe the retired surface. Smallest fix: rename the package/entry terminology only after tracing every hook and install consumer, then update the mirrors and package metadata in one bounded change; preserve the actual continuity behavior. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:1-6] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:1-8] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:68-98] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:69-78]

4. **LUNA-010 — The live workflow still owns memory-named predecessor and quality paths. P1. CONFIRMED.** `scripts/core/workflow.ts` imports memory metadata, memory quality gates, and the memory backfill module; during JSON saves it dynamically imports `find-predecessor-memory` and uses `memoryTitle`/`memoryDescription` to link a prior record. The workflow is the caller behind the public `generate-context` CLI. This is stronger than a label-only hit: the retired memory model still affects save behavior. Smallest fix: map predecessor and quality behavior to explicit packet-continuity concepts or formally retain it as an owned successor feature with docs/tests that prove no retired DB/MCP dependency. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:80-101] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1288-1302] [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1390-1409] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:26-31]

5. **LUNA-011 — Runtime documentation contradicts itself about the database owner. P1. CONFIRMED.** The runtime ENV reference says the memory engine and database are gone, then says the package still reads the `MEMORY_DB_PATH` family through `core/config.ts` and documents `MEMORY_DB_PATH` as a live database override. It also points operators to a removed spec-memory launcher while describing the advisor as the only spawner. Smallest fix: make the document's ownership table match the actual importer graph; if the runtime DB consumer is removed, delete these rows and the stale launcher narrative, otherwise state the surviving owner and its supported boundary explicitly. [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:14-18] [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:114-130] [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:246-252] [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:360-374]

6. **LUNA-012 — A production API path is still named `memory-index-discovery`. P2. CONFIRMED.** `runtime/api/graph-refresh.ts` imports the handler by its memory-prefixed filename, and the handler emits `[memory-index-discovery]` warnings while its README and module map advertise the same name. The implementation discovers spec documents rather than querying a memory index, so the behavioral risk is low, but the live runtime identity violates the programme's no-memory framing and can cause operators to infer a retired index. Smallest fix: rename the module, warning prefix, READMEs, and import seam together, with a compatibility alias only if a real consumer is proven. [SOURCE: .opencode/skills/system-spec-kit/runtime/api/graph-refresh.ts:9-17] [SOURCE: .opencode/skills/system-spec-kit/runtime/handlers/memory-index-discovery.ts:41-52] [SOURCE: .opencode/skills/system-spec-kit/runtime/handlers/memory-index-discovery.ts:133-143] [SOURCE: .opencode/skills/system-spec-kit/runtime/handlers/README.md:18-23]

## Ruled Out

- Treating every `MEMORY_DB_PATH` occurrence in the preserved skill-advisor/shared embedding code as system-spec-kit runtime residue was ruled out; the live caller comments explicitly assign that variable to the advisor-owned database. The scripts detector and runtime config have separate callers and remain in scope.

## Dead Ends

- Exact old package path searches alone were insufficient: no old `system-spec-kit/mcp-server` path was needed to expose the database and memory workflow that still exists under the renamed runtime/scripts paths.

## Edge Cases

- Ambiguous input: “retired memory surface” was split into (a) retired system-spec-kit DB/MCP/launcher ownership and (b) preserved advisor/shared embedding ownership; only (a) is a defect candidate.
- Contradictory evidence: the runtime ENV reference says the DB is gone but names a live DB resolver and importer; both claims remain cited.
- Missing dependencies: no external source was required.
- Partial success: executable and documentation residue was confirmed; the absence of a public importer for runtime storage leaves its operational reachability inferred rather than proven.

## Questions Remaining

- Q1 remains open at the package-wide level; live residue is confirmed, but preserved-owner boundaries need a complete registration sweep.
- Q2-Q7 remain open. Next focus: registrations, symlinks, hooks, CI, doctor assets, and runtime mirrors.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20,1341-1402]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/index.ts:9-35]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:21-32,80-101,783-810,1288-1302,1390-1409]
- [SOURCE: .opencode/skills/system-spec-kit/shared/paths.ts:143-171]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-9,364-430]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:34-45]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:1-27]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:1-8,68-98]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:69-78]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:14-18,114-130,246-252,360-374]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/api/graph-refresh.ts:9-17]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/handlers/memory-index-discovery.ts:41-52,133-143]

## Assessment

- New information ratio: 0.95
- Questions addressed: Q1 live database, launcher, memory workflow, and runtime identity residue
- Questions answered: Q1 = confirmed live residue, with ownership split still unresolved for the runtime storage module
- Confidence: high for the detector call chain, package metadata, live hook target, and runtime documentation contradiction; medium for runtime storage operational reachability because no non-test importer was found.

## Reflection

- What worked and why: tracing names from package metadata and public entrypoints into callers exposed live paths that an old-path grep would miss.
- What did not work and why: a single broad lexical sweep over all historical and fixture text produced too many preserved-owner false positives; explicit producer-consumer reads were required.
- What I would do differently: inventory registrations and symlink targets next, then compare every executable hook against the runtime paths it claims to launch.

## Recommended Next Focus

Angle 2: inspect session-lifecycle registrations, hook configs, symlinks, CI workflows, doctor assets, and the five runtime mirrors for dropped, dangling, or identity-mismatched entries. Use exact paths and target existence checks.
