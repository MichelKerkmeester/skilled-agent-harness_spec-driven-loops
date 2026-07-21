# Iteration 4: Dependency-Ordered Migration and Git Move Plan

## Focus

Produce an implementation-ready migration order, exact shell-safe move commands, compatibility policy, verification ladder, and rollback boundary. Preserve runnable mixed states and correct unproven iteration-3 assumptions.

## Findings

1. Use two explicit mixed-state boundaries. First add `lib/paths.mjs` while its defaults still point to the root corpus/manifests and `_db`; refactor callers to accept independent bundle, crawl-manifest, retrieval-manifest, and database paths. Move code/tests only after that is green. Move bundles/manifests and flip defaults last. This is necessary because manifest and indexer code currently derive `_manifest.json` from `corpusRoot`, while the target separates `library/bundles/` and `library/manifests/`. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:34-36,80-98] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-601,640-652] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:623-650]
2. Preserve module names and behavior one-for-one. `style-library.mjs` and `operator.mjs` already export callable APIs and implement guarded direct execution. Move them to `lib/engine/style-library.mjs` and `lib/database/operator.mjs`; do not invent `scripts/style-library.mjs` or `scripts/style-database.mjs` wrappers. The proven standalone script is `_harness/extract-refero.mjs`. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:180-261] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:207-268] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:22-28,445-449]
3. The oracle contradiction resolves to test ownership. Exact search found oracle modules imported only by `_db/__tests__`; oracle modules consume production database modules. Move the complete `_db/oracle/` subtree to `tests/oracle/`; do not create `lib/database/oracle.mjs`. [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/oracle.test.mjs:22-29] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/fixtures.test.mjs:10-19] [SOURCE: .opencode/skills/sk-design/styles/_db/oracle/differential-oracle.mjs:12-23]
4. The committed retrieval manifest is the authoritative bundle inventory. Read-only validation found `recordCount=1290`, 1,290 unique slugs, no missing source directories, and no unsafe slash/NUL/dot names. The command below validates each source against Git and invokes `git mv` with an argument array plus `--`; shell metacharacters are never expanded. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:295-308]
5. Engine/database source moves form one group because imports are bidirectional: the persistent adapter imports database retrieval/schema, while database retrieval imports engine cards. Update all imports and checked-in mode consumers before the group gate. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9-14] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:5] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:28] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:28]
6. Preserve explicit fixture roots and fixture-local legacy filenames. Tests create `_manifest.json` and `_retrieval-manifest.json` under temporary roots and pass explicit paths; renaming those files does not improve production ownership. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:76-83,120-127] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/fixtures.mjs:109] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/invalidation.test.mjs:65,98,118-128]
7. The generator is a hard cutover consumer: `study-prepare.ts` positionally derives both executable and manifest. Update it and its baseline test in the same group. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-91] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/corpus-baseline-v3.test.ts:19]
8. Mutable database artifacts are outside the source move. Change the module-relative default from `_db/style-library.sqlite` to `database/style-library.sqlite`, but do not move, create, or publish a database. Existing state remains rebuildable and opt-in. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:7-14,31] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1048-1122] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-110]

## Dependency Order

```text
G0 scoped-clean baseline + green tests
  -> G1 path API, defaults still old
       [MIXED A: old tree + new explicit path API; runnable]
  -> G2 source/tests/script moves + import/CLI consumer updates
       [MIXED B: new code tree + old root corpus/manifests; runnable]
  -> G3 manifest-authoritative bundle move + manifest rename + default flip
       [TARGET: new code and data ownership; runnable]
  -> G4 database ignore/default checks + docs/spec updates + stale-path sweep
  -> G5 full verification + targeted staging + one migration commit
```

G1 must separate `bundleRoot`, `crawlManifestPath`, and `retrievalManifestPath` rather than deriving both manifests from `corpusRoot`. Existing explicit fixture overrides remain.

## Exact Future Commands

These commands were not executed during research. Run from repository root with Bash.

### G0: Safety and Baseline

```bash
set -euo pipefail
ROOT='.opencode/skills/sk-design/styles'
git status --porcelain=v1 -- \
  "$ROOT" \
  '.opencode/skills/sk-design/design-foundations/corpus' \
  '.opencode/skills/sk-design/design-interface/corpus' \
  '.opencode/skills/sk-design/design-motion/corpus' \
  '.opencode/skills/sk-design/design-audit/corpus' \
  '.opencode/skills/sk-design/design-md-generator/backend'
node "$ROOT/_engine/style-library.mjs" build --check
node "$ROOT/_engine/__tests__/index.mjs"
node "$ROOT/_db/__tests__/index.mjs"
node --test \
  .opencode/skills/sk-design/design-foundations/corpus/__tests__/*.test.mjs \
  .opencode/skills/sk-design/design-interface/corpus/__tests__/*.test.mjs \
  .opencode/skills/sk-design/design-motion/corpus/__tests__/*.test.mjs \
  .opencode/skills/sk-design/design-audit/corpus/__tests__/*.test.mjs
```

Scoped status must be empty. Unrelated dirty research artifacts may remain but must never be broadly staged.

### G1: Compatibility-Neutral Path API

Create `lib/paths.mjs`, refactor production callers and overrides, keep defaults on old paths, and rerun G0. No move occurs here.

### G2: Code, Tests, and Script

```bash
mkdir -p "$ROOT/lib/engine" "$ROOT/lib/database" "$ROOT/scripts" \
  "$ROOT/tests" "$ROOT/docs" "$ROOT/database"
git mv -- \
  "$ROOT/_engine/style-library.mjs" "$ROOT/_engine/manifest.mjs" \
  "$ROOT/_engine/hydrate.mjs" "$ROOT/_engine/rank-fts.mjs" \
  "$ROOT/_engine/corpus-use-proof.mjs" "$ROOT/_engine/persistent-adapter.mjs" \
  "$ROOT/_engine/eligibility.mjs" "$ROOT/_engine/ordering.mjs" \
  "$ROOT/_engine/cards.mjs" "$ROOT/lib/engine/"
git mv -- \
  "$ROOT/_db/canonical.mjs" "$ROOT/_db/retrieval.mjs" \
  "$ROOT/_db/vectors.mjs" "$ROOT/_db/generation-manifest.mjs" \
  "$ROOT/_db/schema.mjs" "$ROOT/_db/indexer.mjs" \
  "$ROOT/_db/operator.mjs" "$ROOT/_db/stage-telemetry.mjs" \
  "$ROOT/lib/database/"
git mv -- "$ROOT/_engine/__tests__" "$ROOT/tests/engine"
git mv -- "$ROOT/_db/__tests__" "$ROOT/tests/database"
git mv -- "$ROOT/_db/oracle" "$ROOT/tests/oracle"
git mv -- "$ROOT/_harness/extract-refero.mjs" "$ROOT/scripts/extract-refero.mjs"
git mv -- "$ROOT/_harness/README.md" "$ROOT/docs/extract-refero.md"
git mv -- "$ROOT/_db/README.md" "$ROOT/database/README.md"
git mv -- "$ROOT/manual-testing-playbook.md" "$ROOT/docs/manual-testing-playbook.md"
```

Update all relative imports, four mode consumers, test fixtures, generator executable path, and test entrypoints before checking. Keep old data defaults until G3. Do not move `_db` wholesale because ignored mutable files could travel with the directory.

### G3: The 1,290 Bundles and Manifests

```bash
mkdir -p "$ROOT/library/bundles" "$ROOT/library/manifests"
node --input-type=module <<'NODE'
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
const root = '.opencode/skills/sk-design/styles';
const manifestPath = path.join(root, '_retrieval-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const slugs = manifest.styles.map(({ slug }) => slug);
if (manifest.recordCount !== 1290 || slugs.length !== 1290 || new Set(slugs).size !== 1290) {
  throw new Error('Refusing move: expected exactly 1,290 unique manifest records.');
}
const tracked = execFileSync('git', ['ls-files', '-z', '--', root], { encoding: 'utf8' })
  .split('\0').filter(Boolean);
for (const slug of slugs) {
  if (slug === '.' || slug === '..' || slug.includes('/') || slug.includes('\0')) {
    throw new Error(`Refusing unsafe slug: ${JSON.stringify(slug)}`);
  }
  const source = path.join(root, slug);
  if (!fs.statSync(source, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`Missing bundle: ${source}`);
  }
  if (!tracked.some((file) => file.startsWith(`${source}/`))) {
    throw new Error(`Bundle has no tracked files: ${source}`);
  }
}
const result = spawnSync(
  'git',
  ['mv', '--', ...slugs.map((slug) => path.join(root, slug)), path.join(root, 'library/bundles')],
  { stdio: 'inherit' },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
NODE
git mv -- "$ROOT/_manifest.json" "$ROOT/library/manifests/crawl-manifest.json"
git mv -- "$ROOT/_retrieval-manifest.json" "$ROOT/library/manifests/retrieval-manifest.json"
```

Then flip centralized defaults; update extractor output roots, generator paths, and manifest/indexer calls. Verify 1,290 direct bundle directories, no manifest slug remaining at root, `build --check`, legacy query/hydrate, and all tests.

### G4-G5: Mutable State, Sweep, and Final Gate

```bash
git check-ignore -v \
  "$ROOT/database/style-library.sqlite" \
  "$ROOT/database/style-library.sqlite-wal" \
  "$ROOT/database/style-library.current.json"
rg -n 'styles/(?:_engine|_db|_harness)|_retrieval-manifest\.json|_manifest\.json' \
  .opencode/skills/sk-design --glob '!styles/tests/fixtures/**'
git diff --check
```

Update ignore rules before the probes. Fixture-local names may remain; current code, README/SKILL, commands, feature catalog, playbooks, and active specs must use target paths. Historical changelog statements may remain only when clearly historical. Run all relocated tests, generator tests, a legacy query/hydrate smoke test, and persistent `status` without building. Stage only enumerated paths; inspect `git diff --cached --stat` and `git diff --cached --find-renames`; never use `git add -A`.

## Compatibility Policy

- No old-path filesystem aliases: checked-in consumers can update atomically and no concrete external consumer was found. [SOURCE: iterations/iteration-001.md:19-23]
- Preserve exports, callable APIs, CLI commands, `legacy|shadow|persistent`, environment variable, request/response shapes, and fixture path overrides. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-110] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:180-208]
- Keep fixture-local old manifest names; production defaults alone adopt committed target names.
- Update direct old CLI paths in current docs instead of adding wrappers.
- Do not fallback-search old SQLite state. It is rebuildable and opt-in; operators may retain a backup until explicit rebuild validation.

## Verification Ladder

1. Baseline: scoped-clean status, manifest check, engine/database tests, four mode suites, generator tests.
2. G1: same tests with no moves, proving path decoupling.
3. G2: `node --check` on moved modules, relocated suites, four consumers, generator; old corpus remains active.
4. G3: 1,290 inventory assertions, no root bundles, manifest check, legacy query/hydrate, all prior suites.
5. G4: ignore probes, classified stale-path sweep, persistent `status` without publication, docs/spec checks.
6. Final: all gates, `git diff --check`, staged rename review, and later implementation workflow strict packet validation.

## Rollback

The rollback boundary is one migration commit. Before commit, repair a failing group forward using the preceding green mixed state as reference; never publish or move mutable database state. After commit, use `git revert <migration-commit>` and rerun the old-path baseline. Because unrelated research changes are already present, never use `git reset --hard`, `git clean`, broad restore, broad staging, or stash as rollback. Abandoning before commit requires operator-confirmed restoration of only the enumerated migration paths.

## Ruled Out

- Root wildcards or negative exclusions for bundles: not inventory-authoritative and can capture backend/docs.
- Whole `_db` move: can carry ignored mutable artifacts.
- CLI wrappers during relocation: duplicate an existing dual-purpose contract without need.
- Production oracle under `lib/database`: no production importer exists.
- Old-path aliases or database fallback: hide incomplete migration without a concrete consumer.
- Database creation during verification: persistent state is opt-in and separate from source rollback.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_engine/style-library.mjs`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs`
- `.opencode/skills/sk-design/styles/_db/operator.mjs`
- `.opencode/skills/sk-design/styles/_db/oracle/**`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs`
- `.opencode/skills/sk-design/design-{foundations,interface,motion,audit}/corpus/**`
- `.opencode/skills/sk-design/design-md-generator/backend/**`
- Exact scoped `Grep`, `Glob`, `git ls-files`, `git status`, `git check-ignore`, and manifest validation outputs.

## Assessment

- New information ratio: 0.86
- Novelty justification: Seven findings are new implementation constraints or resolved contradictions; one consolidates the prior no-shim inference into an executable boundary.
- Questions answered: both remaining key questions.
- Confidence: High for ordering, inventory, imports, and compatibility; medium-high for final test aggregation because styles has no local package runner.
- Status: complete

## Reflection

- Worked: committed-manifest validation and exact imports converted architecture into safe moves and resolved oracle ownership.
- Failed direction: whole backend-directory moves can relocate ignored mutable files, so tracked source lists are required.
- Ruled out: speculative script wrappers violate one-for-one module preservation without consumer benefit.

## Recommended Next Focus

Iteration 5 remains mandatory. Audit every tracked source and consumer against this plan, verify post-move inventory/test coverage, and report residual risks for synthesis without changing the selected architecture.
