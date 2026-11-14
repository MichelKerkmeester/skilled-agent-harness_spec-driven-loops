# Build evidence, 2026-11-14

## Worker report 010a

Implemented and verified. No production files changed; only the two permitted test files were touched.

## What changed

**`$C/tests/relocate-real-pipeline.vitest.ts` (new)**
- `guard` / `changedLines` — runs the required `git status --porcelain -- <guarded paths>` in the checkout the suite sits in and compares the before/after outputs, naming the differing lines.
- `beforeAll` / `afterAll` — capture the guard before the file’s test and fail after it if any guarded path changed; also assert the selected `relocate.mjs` exists.
- one integration test — builds the temp repo, applies the map twice, and reads the stores the true writers wrote.
- `RELOCATE_REAL_PIPELINE_SOURCE` — optional override used only for the mutation proof; unset by default, so the committed `relocate.mjs` is always used normally.

**`$C/tests/fixtures/subtrack-tree.mjs` (extended, not replaced)**
- `buildRealPipelineRepo` — public builder for a committed temp git repo containing copies of the true writers, package links, and the one-packet fixture.
- `copyToolTree` — copies writer trees (never symlinks them) and drops path-dependent build caches.
- `assertCompiledRuntimeFresh` — read-only freshness probe; fails with the canonical rebuild command when the checkout’s compiled runtime is stale, without writing a cache into the real checkout.
- `attestCopiedRuntime` — re-records `prepare-build`/`record-build` for the temp copy, because the dist-freshness cache filename is derived from the absolute dist path.
- `linkInstalledPackages` — symlinks `node_modules` as permitted, but remaps `@spec-kit/runtime`, `@spec-kit/shared` and `@spec-kit/cli` onto the temp copies.
- `writePipelinePacket` / `commitAll` — writes the Level 1 packet docs and creates a clean, committed fixture.

`subtrack-tree.mjs` was extendable additively, so no `real-pipeline-tree.mjs` was created. The existing `buildSubtrackTree` and `buildFlatTree` are unchanged.

## T002 writer input/output list

| Writer | Loads from outside its own folder | Writes | Run from |
|---|---|---|---|
| `repair-derived.cjs` | `spec/validate.sh`, `graph/backfill-graph-metadata.ts`, `.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs`, resolved from `process.cwd()` | Packet docs/metadata under `specs/`; atomic temp siblings beside each target | Temp copy |
| `migrate-generated-json.ts` | `@spec-kit/runtime/api`, `./backfill-graph-metadata.js`, `../lib/esm-entry.js`, `@spec-kit/runtime/hooks/...`; repo root is cwd when it has `specs/`, else module location | `description.json` and `graph-metadata.json` in each `--only` folder; optional prune report under the specs root | Temp copy |
| `validate.sh` | Own-location `runtime/cli/lib/validator-registry.json`, `runtime/dist/.../orchestrator.js`, `runtime/cli/lib/dist-freshness.cjs`, rules/templates, `.skilled/hooks/shared/hook-flags.sh` | Packet files only during Draft auto-repair; may write a dist-freshness cache beside the dist entry | Temp copy |
| `sweep-track-roots.mjs` | `../lib/track-roots.mjs`; specs root by walking up from cwd | Nothing (read-only) | Temp copy |
| `refresh-track-roots.mjs` | `../lib/track-roots.mjs`; specs root from cwd | Track/sub-track `graph-metadata.json`, sub-track `z_archive/.gitkeep`, under cwd’s specs | Temp copy |
| `cite-drift-scan.mjs` | `./classifier-cite-drift-scan.mjs`, which loads `../../../cli-classifier/shared/scripts/jev-*.mjs`; own-location `REPO_ROOT` and default redirects path | The explicit `--rebuild-redirects` path; runs `git -C <own-location repo root>` | Temp copy |
| `generate-trigger-index.mjs` | `./lib/*`, `../../hooks/lib/workspace/repo-root.mjs`, `../lib/esm-entry.mjs` | Default index at `<own skill>/runtime/data/trigger-index.json`; sidecars under `<own dir>/fixtures/` | Temp copy |

`generate-trigger-index` and `validate.sh` are the two that can write under their own location (index/sidecars and the freshness cache); both run from copies. `node_modules` is symlinked, with the `@spec-kit` entries pointed at the temp copies.

## Test added

`relocate with the true pipeline writers > applies a map into a new sub-track and reads every store the writers own`

The guard is implemented as `beforeAll`/`afterAll`, not as a separate named test.

## Failing runs before the fix

Test-first run, before the builder existed:

```text
TypeError: buildRealPipelineRepo is not a function
Test Files  1 failed (1)
Tests  1 failed (1)
exit=1
```

Mutation run with the `migrate-generated-json` call removed from a scratch `relocate.mjs`:

```text
AssertionError: the migrate step must record the new parent chain
: expected [ 'demo' ] to deeply equal [ 'demo', 'sub' ]

❯ tests/relocate-real-pipeline.vitest.ts:87:9
     85|         description.parentChain,
     86|         `the migrate step must record the new parent chain\n${first.st…
     87|       ).toEqual(['demo', 'sub']);

Test Files  1 failed (1)
Tests  1 failed (1)
exit=1
```

## Mutation proof, both runs

- Unchanged committed script: `Test Files  1 passed (1)`, `Tests  1 passed (1)`, exit `0`, 9.36 s.
- Scratch script with the migrate call removed: `Test Files  1 failed (1)`, `Tests  1 failed (1)`, exit `1`, 8.13 s, naming the `description.parentChain` assertion.

## Final run

Command: `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate-real-pipeline.vitest.ts`

```text
Test Files  1 passed (1)
Tests  1 passed (1)
Duration   9.16s
real       9.36
exit       0
```

Guard failure path verified in a scratch checkout (not the real `specs/` tree):

```text
AssertionError: the suite changed guarded paths in the checkout: ?? specs/: expected [ '?? specs/' ] to deeply equal []

Test Files  1 failed (1)
Tests  1 passed (1)
exit=1
```

Existing suites that share the fixture file still pass:

```text
Test Files  2 passed (2)
Tests  101 passed (101)
exit=0
```

Guard on the real checkout before and after all runs printed nothing; `git status` shows only the two permitted files.

## Defects / open questions

- No pipeline defect found on the happy path.
- The root track’s `children_ids` lists its sub-track (`demo/sub`), while the sub-track’s `children_ids` lists the moved packet. The test asserts both, because the task wording “the track’s `children_ids` list the new id” is ambiguous between the root track and the direct container. `refresh-track-roots` correctly lists immediate children only.
- The mandated `git status --porcelain` guard honours global git excludes. In the real checkout `specs/` is tracked and a new path there is not ignored, so the guard works; in a scratch repo whose `specs/` is untracked, the host global `/specs` ignore can hide the probe file. The manual scratch verification needed `core.excludesFile=/dev/null` to see it. This does not affect the real checkout.
- Dist-freshness cache names include absolute paths, so a copied checkout never finds the original build attestation. The fixture re-records the attestation in temp after first proving the source checkout is fresh; that is fixture plumbing, not a production change.

## Worker report 010b

All work is complete and verified. Here is the report.

## What changed

**`tests/fixtures/subtrack-tree.mjs`**
- `buildRealPipelineRepo` — now also returns `tools` with the temp copies' `relocate`, `archive`, `migrate`, `citeDrift` and `tsxLoader` paths, so the cases wire wrappers/restore against the temp repo instead of hardcoding paths.
- `failWriterFirstCall` — renames a copied writer and installs a marker-gated wrapper that exits 1 on its first direct call and runs the true writer afterwards; it re-exports the true module and only fails/spawns on direct execution, because `validate.sh` imports the same scanner module for its citation helpers.
- `archivePacketCopy` — copies the live packet into the track's `z_archive` and rewrites only its two generated records to the archived place, giving the restore case a realistic archived packet.

**`tests/relocate-real-pipeline.vitest.ts`**
- Added `PipelineRepo`, `runRelocate`, `combined` and `expectMovedStores` helpers to share the run wiring and the store assertions.
- Added the three cases; the existing happy-path test and the checkout guard are unchanged.

## Tests added
1. `resumes a map after the redirect table step fails once`
2. `resumes a map after the description identity step fails once`
3. `restores an archived packet onto the next free number`

## Failing run before the fix

The first wrapper replaced the scanner module without re-exporting its API, so the resume run's validation could not import it. Relevant lines (`exit=1`):

```text
× resumes a map after the redirect table step fails once 8351ms
step redirect table (cite-drift-scan --rebuild-redirects): ok
close sweep-track-roots: ok
    x SOURCE_TAGS: [SOURCE:] check skipped: the repository or the redirect table could not be read
close validate specs/demo/sub/001-alpha: RESULT: FAILED
: expected 3 to be +0 // Object.is equality
- 0
+ 3
Tests  1 failed | 3 passed (4)
```

After adding `export *` to the true writer plus the direct-run guard, the run is green.

## Each case's runs (final helpers)

**Redirect-table late step**
- run 1: exit 2, `step redirect table (cite-drift-scan --rebuild-redirects): FAILED exit 1:`
- run 2: exit 0, `step redirect table (cite-drift-scan --rebuild-redirects): ok`, `close validate ... RESULT: PASSED`
- run 3: exit 0, `relocate: nothing to do`
- stores: `specFolder=demo/sub/001-alpha`, `parentChain=["demo","sub"]`, `packet_id=demo/sub/001-alpha`, track children `["demo/sub/001-alpha"]`

**Description identity step**
- run 1: exit 2, `step description identity (migrate-generated-json --only): FAILED exit 1:`
- run 2: exit 0, `step description identity (migrate-generated-json --only): ok`, `close validate ... RESULT: PASSED`
- stores: `parentChain=["demo","sub"]`, `specFolder`/`packet_id` = `demo/sub/001-alpha`

**Renumbering restore**
- restore: exit 0, `restoring as specs/demo/002-archived-probe`, `close validate ... RESULT: PASSED`
- `archivedExists=false`, `restoredExists=true`
- `specFolder=demo/002-archived-probe`, `specId=002`, `parentChain=["demo"]`, `packet_id=demo/002-archived-probe`, `spec_folder=demo/002-archived-probe`

## Final run

Command from `$C`:

```text
../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate-real-pipeline.vitest.ts
```

```text
Test Files  1 passed (1)
     Tests  4 passed (4)
  Duration  33.20s
```

Exit status `0`. Verbose per-case durations: 7296ms, 6932ms, 5624ms, 5993ms (suite 28.51s). `RELOCATE_REAL_PIPELINE_SOURCE` pointed at a scratch copy also gives `Test Files 1 passed (1)`, `Tests 4 passed (4)`, exit `0` (28.83s). The guard output for `specs`, the sk-doc scripts, runtime data and retrieval fixtures is empty, and the only working-tree changes are the two permitted files.

## Defects / open questions
None in production. The only defect found was in the test harness's first wrapper (it dropped the scanner's exports); that is fixed in the fixture helper. The restore case stages the archived packet by copy and runs the restore through the temp `archive.sh`, which the task explicitly permits.

## Orchestrator reruns

- relocate-real-pipeline.vitest.ts: 1 passed after 010a, 4 passed after 010b (30.6 s), exit 0.
- mutation check by the orchestrator: line 1604 of a scratch relocate.mjs (the description identity childStep) replaced by a comment, RELOCATE_REAL_PIPELINE_SOURCE pointed at it: Tests 1 failed (1), AssertionError: the migrate step must record the new parent chain, exit 1. Unchanged script: exit 0.
- full CLI npm test after 010b: Test Files 212 passed | 3 skipped (215), Tests 2603 passed | 20 skipped (2623), legacy and validation Results all 0 failed, npm exit 0.
- comment check clean.
