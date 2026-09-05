# Iteration 4: Dependency and importer balance

## Focus

Compare the three workspace manifests with bounded source importers. The strongest signal is whether the decommission left native/vector dependencies declared after their production importer disappeared; type-only database references were separated from value imports.

## Findings

1. **LUNA-017 — The scripts workspace declares the retired vector extension with no current non-test source importer. P1. CONFIRMED.** `@spec-kit/scripts` declares both `sqlite-vec` and the Darwin-specific `sqlite-vec-darwin-arm64` optional package. The active parity harness imports the legacy lane and `better-sqlite3`, while its database code opens the existing index directly; a bounded search of scripts production directories found no `sqlite-vec`, `sqlite_vec`, `vec0`, or `loadExtension` importer outside manifests and excluded tests/fixtures. This leaves a native package install path with no production consumer and preserves the vector-era dependency contract after the successor is the committed trigger-index/ripgrep path. Smallest fix: remove both declarations after the parity harness is explicitly confirmed database-only, or move them to a separately owned compatibility package with an executable importer and test. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-30] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:44-62] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:950-965] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:195-207] [INFERENCE: bounded non-test/non-fixture source search returned no vector-extension importer]

2. **LUNA-018 — Runtime retains a native SQLite dependency although its bounded production imports are type-only. P1. CONFIRMED with reachability caveat.** `@spec-kit/runtime` declares `better-sqlite3`, but the production files found in the runtime database subsystem use `import type` in `entity-extractor.ts` and `transaction-manager.ts`; `runtime/core/config.ts` resolves a path and marker rather than constructing a database. The transaction manager still calls that resolver for a legacy pending-file recovery branch, so this is not merely an unused manifest row: the package ships a database-shaped subsystem whose native runtime dependency is not value-imported by the bounded source graph. Smallest fix: remove the legacy subsystem and dependency together, or give it a documented successor owner with a value importer and an end-to-end recovery test; do not drop only the package row while leaving deep-importable code. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-44] [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:5-9] [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:61-113] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:6-15] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:6-10] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:364-389] [INFERENCE: no value import or public runtime caller was found in the bounded production search; type-only references and recovery code remain]

3. **LUNA-019 — Dependency ownership is deliberately split for Pi hooks, but the split is undocumented at the system-spec-kit package boundary. P2. INFERRED.** The runtime Pi hook sources import the Pi host API as a type and are explicitly excluded from the runtime TypeScript build; `.pi/extensions/README.md` says those same files are symlinked and loaded as Pi extensions, while the checked Pi extension packages declare the host API as a peer dependency. This is probably a valid host-owned dependency, not a missing runtime dependency, but the system-spec-kit workspace has no manifest at the `.pi/extensions` aggregate root to state that boundary. Smallest fix: document the host-provided peer contract at the symlink owner or add a package-local typecheck boundary; do not add the Pi host package to `@spec-kit/runtime` merely to silence the import. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:1-6] [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:34-53] [SOURCE: .pi/extensions/README.md:18-29] [SOURCE: .pi/extensions/deep-pi/package.json:28-50] [INFERENCE: the runtime build excludes hooks/pi and Pi package manifests own the host peer, so importer ownership is environmental rather than a runtime-package omission]

## Ruled Out

- `@modelcontextprotocol/sdk` in shared is not orphaned: `shared/ipc/socket-server.ts` imports `StdioServerTransport`, and its README assigns the bridge to the code-index and skill-advisor daemon owners. [SOURCE: .opencode/skills/system-spec-kit/shared/package.json:24-27] [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:14-15] [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/README.md:12-28]
- `js-yaml` in scripts and `zod` in runtime each have bounded production importers; no claim of global dependency failure is made from the two database/vector findings. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-26] [SOURCE: .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:6-10] [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-44] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts:1-6]

## Dead Ends

- Searching only for `sqlite-vec` missed the optional Darwin package and the older `vec0` naming; the manifest plus all three spellings were checked. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-30]

## Edge Cases

- The runtime `better-sqlite3` dependency may be justified by tests or consumers outside the bounded production graph; this iteration establishes a package/source mismatch, not a proof that installation can be removed without a test-owner decision.
- The Pi hook import is type-only and its build exclusion is explicit. It remains a boundary/documentation concern rather than a confirmed missing dependency.

## Questions Remaining

- Q3 is partially answered: vector dependency residue is confirmed; runtime SQLite ownership and the Pi host boundary need an explicit decision.
- Q1-Q2 and Q4-Q7 remain open. Next focus: tests and fixtures that may pass over retired or weakened surfaces.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/package.json:1-25]
- [SOURCE: .opencode/skills/system-spec-kit/shared/package.json:1-27]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:1-34]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:1-53]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts:1-113]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:1-15]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/storage/transaction-manager.ts:1-10,364-389]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:18-23,195-207]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:44-62,950-965]
- [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:14-15]
- [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/README.md:12-28]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts:1-6]
- [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:34-53]
- [SOURCE: .pi/extensions/README.md:18-29]
- [SOURCE: .pi/extensions/deep-pi/package.json:28-50]

## Assessment

- New information ratio: 0.86
- Questions addressed: Q3 dependency/importer balance
- Questions answered: Q3 = partial; orphaned vector declarations are confirmed, while runtime SQLite and Pi ownership require boundary decisions.
- Confidence: high for manifest declarations and bounded importer absence; medium for removal impact because tests and external consumers were intentionally not used as production reachability proof.

## Reflection

- What worked and why: manifest-first inspection followed by exact import searches distinguished a dead dependency from a preserved shared IPC owner.
- What did not work and why: broad package-root searches pulled generated index and fixture text into the result set; source directories must be bounded explicitly.
- What I would do differently: map each dependency to an owning public entrypoint before evaluating tests in the next angle.

## Recommended Next Focus

Angle 4: inspect tests, fixtures, skips, and parity harnesses for coverage that still validates a retired surface or passes because the relevant branch is skipped.
