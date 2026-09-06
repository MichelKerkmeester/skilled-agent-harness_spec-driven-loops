# Iteration 12: Package identity and database ownership contracts

## Focus

Compare the system-spec-kit workspace manifests and package READMEs with the
actual source importers discovered in the prior dependency pass. The focus was
not to repeat the unused sqlite-vec dependency finding, but to identify live
package metadata and ownership statements that still encode the retired memory
surface. This was source-only research.

## Findings

1. **LUNA-046 — The scripts workspace still exposes “memory management” and `dist/memory` as its package identity and primary test contract. P2. CONFIRMED metadata drift.** `@spec-kit/scripts` describes itself as CLI tools for “spec-kit context generation and memory management” and sets its package `main` to `dist/memory/generate-context.js`. The parent workspace's `test:root` and `test:cli` scripts also invoke that `dist/memory` entry directly. The source writer is a surviving continuity mechanism, so the path is not proof that the old memory database is still required; the defect is that the package boundary does not state that this is a successor continuity writer and leaves the retired memory namespace looking canonical. Smallest fix: rename/re-home the public entrypoint if compatibility permits, or mark the `dist/memory` path as a successor-only compatibility alias and update the package description and root test labels. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:1-6,10-19] [SOURCE: .opencode/skills/system-spec-kit/package.json:14-24] [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950]

2. **LUNA-047 — The shared README claims the skill-advisor is the only database consumer while system-spec-kit production code still opens the shared `DB_PATH`. P2. CONFIRMED ownership-documentation contradiction.** The shared package documentation says `shared/` owns no store and that “the skill advisor, the one consumer today” writes the SQLite graph. In the same repository, the spec-folder detector imports `DB_PATH` and constructs a read-only `better-sqlite3` handle against it; the renamed runtime also re-exports database-path resolution to its storage layer. This is not merely a type-only dependency: the detector's constructor is a production importer. Smallest fix: either remove/re-home the detector's database fallback as part of decommission, or correct the shared/runtime ownership map to name the remaining detector/transaction consumers and their retirement boundary. [SOURCE: .opencode/skills/system-spec-kit/shared/README.md:339-344] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20,1341-1351] [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-10,364-389]

## Ruled Out

- `@spec-kit/runtime`, `@spec-kit/shared`, `better-sqlite3`, and `js-yaml` all have source importers in the bounded production or validation trees, so they were not labeled unused solely from manifest inspection. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-33] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:16-20] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-grep-convention-helper.mjs:15] [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-53]
- The `generate-context` writer is not classified as the retired database server: its current source invokes the workflow/continuity path and the root README describes it as the canonical continuity writer. The finding is limited to package naming and missing successor boundary. [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950] [SOURCE: .opencode/skills/system-spec-kit/README.md:374-378]

## Dead Ends

- Rechecking `sqlite-vec` yielded the same no-importer result already recorded as LUNA-017, so no duplicate finding was added.

## Edge Cases

- Renaming `dist/memory` may break scripts or external callers even if the namespace is semantically stale. A compatibility alias with an explicit retirement date may be the smallest safe fix.
- The detector's read-only open may be a deliberate transitional validator fallback. That changes the target fix, not the confirmed ownership contradiction in the README.

## Questions Remaining

- Q1 gains a production importer corroborating that the database path is not advisor-only.
- Q3 gains confirmed package identity/ownership drift; unused sqlite-vec remains the only confirmed importerless runtime dependency found so far.
- Q2 and Q4-Q7 remain open for registrations, test weakness, docs parity, successor coverage, and lying gates.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:1-6,10-19,21-33]
- [SOURCE: .opencode/skills/system-spec-kit/package.json:14-24]
- [SOURCE: .opencode/skills/system-spec-kit/shared/README.md:339-344]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:90-105,920-950]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:15-20,1341-1351]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-10,364-389]
- [SOURCE: .opencode/skills/system-spec-kit/README.md:374-378]

## Assessment

- New information ratio: 0.68
- Questions addressed: Q1, Q3
- Questions answered: Q1 = expanded (production DB importer and ownership contradiction); Q3 = partial (package identity residue, dependency balance still incomplete)
- Confidence: high for manifest/README/source contradictions; medium for the compatibility impact of renaming the public entrypoint

## Reflection

- What worked and why: comparing a package's declared `main` and root test commands with actual writer and detector imports separated a successor continuity path from a still-live database path.
- What did not work and why: manifest-only dependency analysis could not distinguish intentional compatibility packages from dead dependencies, so sqlite-vec was deliberately not duplicated.
- What I would do differently: next inspect test fixtures and runner exit accounting around these importer boundaries for suites that pass by skipping legacy surfaces.

## Recommended Next Focus

Angle 4: trace test runners, fixture setup, and exclusion lists for the database detector, legacy parity lane, and continuity successor; identify green results that do not execute the retired-surface checks.

