# Iteration 5: Final Conformance Audit and Adjudication

## Focus

Adversarially audit the target tree and migration plan against tracked inventory, executable consumers, test entrypoints, the manifest-owned bundle set, macOS argument limits, mutable database lifecycle, and iteration-3/4 contradictions. This mandatory fifth iteration adjudicates inputs for later synthesis; it does not synthesize or implement them.

## Final Verdict

The architecture is implementation-ready after four corrections to iteration 4. Retain `library/{bundles,manifests}`, `lib/{engine,database}`, `scripts/`, `database/`, `tests/`, and `docs/`; preserve every production filename one-for-one; move the complete oracle subtree under tests; and add no aliases or speculative wrappers.

Iteration 4 correctly supersedes iteration 3 on two points:

1. Do not create `scripts/style-library.mjs`, `scripts/style-database.mjs`, or `lib/database/oracle.mjs`. `style-library.mjs` and `operator.mjs` already expose callable APIs and guarded direct execution, while every oracle importer is test-owned. [SOURCE: iterations/iteration-004.md:9-16] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/oracle.test.mjs:22-29]
2. Do not use iteration 3's illustrative mutable names. The real default is `style-library.sqlite`, its pointer is `style-library.sqlite.current.json`, and generation files follow `style-library.sqlite.sha256-<hash>.<pid>-<time>.sqlite`. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:11-22] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:1054-1060,1090-1122]

Iteration 5 corrects iteration 4's incomplete command text: G0 must run the real generator consumer test and typecheck; G3 needs exact-content and destination checks; G4 must probe the actual pointer name and establish an explicit mutable-directory ignore policy. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20]

## Confirmed Inventory

Read-only `git ls-files`, filesystem, manifest, and import audits closed the inventory:

| Current owner | Confirmed tracked inventory | Destination |
| --- | ---: | --- |
| `_engine/` | 17 files: 9 production modules, 8 test/support files | Modules to `lib/engine/`; `__tests__` to `tests/engine/` |
| `_db/` | 37 files: 8 production modules, 12 test files, 16 oracle files, 1 README | Modules to `lib/database/`; tests to `tests/database/`; oracle to `tests/oracle/`; README to `database/README.md` |
| `_harness/` | 2 files | Script to `scripts/`; README to `docs/extract-refero.md` |
| Root manifests | 2 files | `library/manifests/{crawl-manifest,retrieval-manifest}.json` |
| Bundle roots | 1,290 roots, 7,740 tracked files | Intact six-file units under `library/bundles/<slug>/` |
| Root docs | `README.md`, `manual-testing-playbook.md` | Keep README; move playbook to `docs/` |

All 17 production modules remain represented:

- `lib/engine/`: `cards.mjs`, `corpus-use-proof.mjs`, `eligibility.mjs`, `hydrate.mjs`, `manifest.mjs`, `ordering.mjs`, `persistent-adapter.mjs`, `rank-fts.mjs`, `style-library.mjs`.
- `lib/database/`: `canonical.mjs`, `generation-manifest.mjs`, `indexer.mjs`, `operator.mjs`, `retrieval.mjs`, `schema.mjs`, `stage-telemetry.mjs`, `vectors.mjs`.

Every manifest slug exists, is unique and safe, and owns exactly six tracked artifacts. The styles tree has 7,800 tracked files total: 7,740 bundle files plus 60 source, test, oracle, harness, manifest, and documentation files. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1] [SOURCE: .opencode/skills/sk-design/styles/README.md:5-12]

## Final Target Tree

```text
.opencode/skills/sk-design/styles/
|-- README.md
|-- library/
|   |-- bundles/
|   |   `-- <1,290-style-slugs>/
|   |       |-- DESIGN.md
|   |       |-- css-variables.css
|   |       |-- tailwind-v4.css
|   |       |-- design-tokens.json
|   |       |-- <style-slug>-canonical.json
|   |       `-- source.md
|   `-- manifests/
|       |-- crawl-manifest.json
|       `-- retrieval-manifest.json
|-- lib/
|   |-- paths.mjs
|   |-- engine/
|   |   |-- cards.mjs
|   |   |-- corpus-use-proof.mjs
|   |   |-- eligibility.mjs
|   |   |-- hydrate.mjs
|   |   |-- manifest.mjs
|   |   |-- ordering.mjs
|   |   |-- persistent-adapter.mjs
|   |   |-- rank-fts.mjs
|   |   `-- style-library.mjs
|   `-- database/
|       |-- canonical.mjs
|       |-- generation-manifest.mjs
|       |-- indexer.mjs
|       |-- operator.mjs
|       |-- retrieval.mjs
|       |-- schema.mjs
|       |-- stage-telemetry.mjs
|       `-- vectors.mjs
|-- scripts/
|   `-- extract-refero.mjs
|-- database/
|   |-- README.md
|   `-- <ignored mutable publication files>
|-- tests/
|   |-- engine/
|   |-- database/
|   `-- oracle/
`-- docs/
    |-- extract-refero.md
    `-- manual-testing-playbook.md
```

`lib/paths.mjs` is the only new source module. It exports independent styles-root, bundle-root, crawl-manifest, retrieval-manifest, and database-root defaults while APIs retain explicit overrides. No `backend/`, `runtime/`, `src/`, compatibility tree, or duplicate CLI layer is justified. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:34-36,76-83,120-127]

## Consumers and Tests

The production cutover consumers are the four mode modules plus generator `study-prepare.ts`. The mode modules import `style-library.mjs`; `study-prepare.ts` positionally derives both executable and retrieval manifest. [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:28] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:28] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-91]

The four mode suites import engine modules and shared engine fixtures directly, so they belong in G2. Engine and database aggregate runners are real and enumerate six and ten tests respectively. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/index.mjs:5-10] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/index.mjs:5-14]

Active documentation requiring path updates includes root `sk-design/README.md`, `SKILL.md`, styles/database/harness docs, feature catalog, both manual-testing-playbook surfaces, mode corpus docs, generator docs, and active packet docs. The styles README contains 1,290 root-relative bundle links; each must become `library/bundles/<slug>/`. Historical changelogs and archived specs may retain old paths only as clearly historical statements. [SOURCE: .opencode/skills/sk-design/styles/README.md:21-31] [SOURCE: .opencode/skills/sk-design/SKILL.md:215-226]

## Adjudicated Migration

```text
G0 scoped-clean baseline and complete green tests
  -> G1 add paths.mjs and independent overrides, defaults still old
       [MIXED A: old locations, decoupled path API]
  -> G2 move 17 modules, tests, oracle, harness, and docs;
       update internal imports, four modes/tests, and generator
       [MIXED B: new code tree, old bundles/manifests]
  -> G3 preflight and move 1,290 bundles in one git-mv argv;
       move manifests; flip defaults and extractor outputs
       [TARGET: new source and committed-data ownership]
  -> G4 add database ignore policy; update active docs/links;
       run classified stale-path and inventory sweeps
  -> G5 full verification, targeted staging, rename review,
       one migration commit
```

Retain iteration 4's exact G2 source lists because they equal the confirmed 9+8 modules. Move test and oracle subtrees only after scoped status is clean; never move `_db` wholesale. [SOURCE: iterations/iteration-004.md:68-92]

## Corrected Test Gates

Iteration 4's engine, database, and mode commands are real, but G0 omitted the generator test promised by its prose. Use:

```bash
set -euo pipefail
ROOT='.opencode/skills/sk-design/styles'
GEN='.opencode/skills/sk-design/design-md-generator/backend'

node "$ROOT/_engine/style-library.mjs" build --check
node "$ROOT/_engine/__tests__/index.mjs"
node "$ROOT/_db/__tests__/index.mjs"
node --test \
  .opencode/skills/sk-design/design-foundations/corpus/__tests__/*.test.mjs \
  .opencode/skills/sk-design/design-interface/corpus/__tests__/*.test.mjs \
  .opencode/skills/sk-design/design-motion/corpus/__tests__/*.test.mjs \
  .opencode/skills/sk-design/design-audit/corpus/__tests__/*.test.mjs
npm --prefix "$GEN" run typecheck
npm --prefix "$GEN" test -- tests/corpus-baseline-v3.test.ts
```

After G2, use `node "$ROOT/tests/engine/index.mjs"` and `node "$ROOT/tests/database/index.mjs"`, then rerun mode suites, generator typecheck, and targeted generator test. G5 additionally runs the full generator suite with `npm --prefix "$GEN" test`, build/query/hydrate smoke tests, and persistent `status` without creating a database. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:75-79,134-147]

## Shell-Safe Bundle Move

Retain one process rather than chunks or 1,290 subprocesses. The measured argv payload is 57,205 bytes, longest slug 56 bytes, and host `ARG_MAX` is 1,048,576. One `spawnSync` avoids shell expansion and minimizes partial-failure boundaries.

Correct iteration 4's preflight by proving exact six-file contents, no untracked passengers, empty destination, no collisions, and conservative argv headroom:

```bash
mkdir -p "$ROOT/library/bundles" "$ROOT/library/manifests"
node --input-type=module <<'NODE'
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root = '.opencode/skills/sk-design/styles';
const destination = path.join(root, 'library/bundles');
const manifest = JSON.parse(fs.readFileSync(path.join(root, '_retrieval-manifest.json'), 'utf8'));
const slugs = manifest.styles.map(({ slug }) => slug).sort();
if (manifest.recordCount !== 1290 || slugs.length !== 1290 || new Set(slugs).size !== 1290) {
  throw new Error('Refusing move: expected exactly 1,290 unique records.');
}
if (!fs.statSync(destination, { throwIfNoEntry: false })?.isDirectory()
    || fs.readdirSync(destination).length !== 0) {
  throw new Error(`Refusing move: destination must exist and be empty: ${destination}`);
}
const tracked = new Set(execFileSync('git', ['ls-files', '-z', '--', root], { encoding: 'utf8' })
  .split('\0').filter(Boolean));
for (const slug of slugs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Unsafe slug: ${slug}`);
  const source = path.join(root, slug);
  const expected = ['DESIGN.md', 'css-variables.css', 'tailwind-v4.css',
    'design-tokens.json', `${slug}-canonical.json`, 'source.md'].sort();
  const actual = fs.readdirSync(source).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)
      || expected.some((name) => !tracked.has(path.join(source, name)))) {
    throw new Error(`Non-canonical bundle: ${source}`);
  }
  if (fs.existsSync(path.join(destination, slug))) throw new Error(`Collision: ${slug}`);
}
const args = ['mv', '--', ...slugs.map((slug) => path.join(root, slug)), destination];
const argvBytes = args.reduce((sum, value) => sum + Buffer.byteLength(value) + 1, 0);
const environmentBytes = Object.entries(process.env)
  .reduce((sum, [key, value]) => sum + Buffer.byteLength(`${key}=${value ?? ''}`) + 1, 0);
const argMax = Number(execFileSync('getconf', ['ARG_MAX'], { encoding: 'utf8' }).trim());
if (argvBytes + environmentBytes >= Math.floor(argMax / 2)) {
  throw new Error('Conservative argv headroom check failed.');
}
const result = spawnSync('git', args, { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
NODE
git mv -- "$ROOT/_manifest.json" "$ROOT/library/manifests/crawl-manifest.json"
git mv -- "$ROOT/_retrieval-manifest.json" "$ROOT/library/manifests/retrieval-manifest.json"
```

`git mv` is not transactional. On nonzero exit, stop, inspect `git status --short -- "$ROOT"`, and restore only manifest-enumerated source/destination pairs with operator confirmation. Do not rerun blindly, reset, clean, stash, or broaden paths. After commit, rollback remains `git revert <migration-commit>` plus the old-path baseline. [SOURCE: iterations/iteration-004.md:168-170]

## Mutable Database Policy

No mutable database file currently exists under `_db`, and `.gitignore` has no sk-design rule. Create only `database/README.md` during source migration and add:

```gitignore
.opencode/skills/sk-design/styles/database/*
!.opencode/skills/sk-design/styles/database/README.md
```

This lifecycle-wide rule ignores logical databases, generations, pointers, build files, sidecars, temporary pointers, and future optional publication artifacts without implying any should be committed. Probe real names without creating files:

```bash
git check-ignore -v \
  "$ROOT/database/style-library.sqlite" \
  "$ROOT/database/style-library.sqlite-wal" \
  "$ROOT/database/style-library.sqlite.current.json" \
  "$ROOT/database/style-library.sqlite.sha256-probe.1-1.sqlite"
git check-ignore -q "$ROOT/database/README.md" && exit 1 || true
```

Do not move old state, fallback-search it, or build a replacement. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:11-22] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-10,34-35,251]

## Adjudications

1. Retain `library/` data versus `lib/` source and one `paths.mjs` seam.
2. Retain one manifest-derived `git mv` argv after exact-content, destination, and headroom checks.
3. Supersede iteration 3 wrappers; preserve all 17 module names and contracts.
4. Supersede iteration 3 production oracle; move all 16 oracle files to tests.
5. Correct iteration 4 with generator typecheck and baseline test.
6. Correct iteration 4 with a mutable-directory ignore and actual pointer probe.
7. Expand iteration 4 to enumerate 1,290 README links and active path docs.

## Ruled Out

- Chunked, `xargs`, wildcard, shell-expanded, or per-bundle moves: unnecessary under measured limits and add failure boundaries.
- Whole backend subtree moves: preserve false ownership and may carry ignored state.
- New wrappers or production oracle code: contradicted by exports and importers.
- Committed example database artifacts: mutable and rebuildable.
- Fixture-local manifest renames: fixtures intentionally exercise explicit paths.
- Aliases, old-database fallback, or database creation: no concrete consumer justifies them.

## Sources Consulted

- Canonical lineage state, strategy, iterations 3-4, and iteration-4 delta.
- Tracked `_engine`, `_db`, `_harness`, manifest, and bundle inventories.
- Four mode corpus production/test trees.
- Generator backend package, `study-prepare.ts`, and baseline test.
- Database schema, indexer, generation-manifest, and operator modules.
- `.gitignore`, scoped `git ls-files`, scoped `git status`, Grep/Glob inventories, and `getconf ARG_MAX`.

## Assessment

- New information ratio: 0.44
- Novelty justification: Three findings are new corrections (measured argv safety, missing generator gate, absent mutable-state ignores); four adjudications consolidate or sharpen prior evidence.
- Questions addressed: all five charter questions, audited rather than reopened.
- Questions answered: all five remain answered; no unresolved architecture question remains.
- Findings count: 7 adjudications.
- Confidence: High for inventory, ownership, consumers, argument safety, test entrypoints, and mutable-state policy. Implementation must still establish a clean scoped baseline.
- Status: complete.

## Reflection

- Worked: closed-set Git classification, exact imports, manifest/filesystem comparison, and real test-runner reads exposed prose omissions.
- Failed: broad old-path searches include historical specs and generated research; implementation must classify active versus historical matches.
- Ruled out: wrappers, production oracle, chunked moves, whole-directory moves, aliases, and database creation remain exhausted.

## Recommended Next Focus

Stop at the configured maximum and hand these adjudicated findings to command-owned synthesis. Do not implement, reduce state, save memory, or migrate source from this iteration.
