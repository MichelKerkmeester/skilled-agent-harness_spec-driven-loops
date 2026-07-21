---
title: "Deep Research: sk-design Styles Tree Restructure"
description: "Evidence-backed target layout, dependency-ordered migration, verification gates, and git-mv plan for separating style data from source and mutable database state."
---

# sk-design Styles Tree Restructure

## 1. Executive Summary

The current `.opencode/skills/sk-design/styles/` root mixes 1,290 downloaded style bundles with engine source, database source and tests, extraction tooling, two committed manifests, and documentation. The root contains 7,800 tracked files: 7,740 files in 1,290 six-file bundles and 60 source, test, oracle, harness, manifest, and documentation files. This is an ownership problem rather than a retrieval-algorithm problem. [SOURCE: iterations/iteration-001.md:14-29] [SOURCE: iterations/iteration-005.md:18-36]

Adopt a shallow ownership tree with `library/` for authoritative committed data, `lib/` for importable source, `scripts/` for the standalone extractor, `database/` for ignored mutable SQLite publication state, `tests/` for all test-owned code and evidence, and `docs/` for operational documentation. Preserve all 17 production modules one-for-one and add only `lib/paths.mjs`. Do not add compatibility aliases, duplicate CLI wrappers, production oracle code, or a package wrapper. [SOURCE: iterations/iteration-003.md:38-97] [SOURCE: iterations/iteration-005.md:7-16]

Implement the migration through two green mixed states. First decouple paths while defaults still point to the old tree. Then move code, tests, oracle, harness, and docs while bundles and manifests remain in place. Finally move the manifest-enumerated bundles and manifests, flip defaults, establish the mutable-state ignore policy, update active documentation, and run the full verification ladder. [SOURCE: iterations/iteration-004.md:18-32] [SOURCE: iterations/iteration-005.md:100-116]

## 2. Research Question And Scope

The five-iteration lineage answered these questions:

1. What is the exact ownership and dependency topology of the current tree?
2. Which `system-deep-loop/runtime` ownership boundaries transfer, and where must styles differ?
3. What target layout separates committed data, source, mutable state, tests, scripts, and docs?
4. What dependency order preserves runnable intermediate states?
5. What exact move, verification, compatibility, and rollback policy should implementation use?

The research did not move source or bundles, change retrieval behavior, redesign schemas, make persistent retrieval the default, save shared memory, stage Git changes, or update shared packet documents. The frozen contract remains `legacy|shadow|persistent`, with `legacy` as the default and flat bundle files authoritative. [SOURCE: deep-research-config.json] [SOURCE: deep-research-strategy.md:16-25] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:134-147]

## 3. Current-State Diagnosis

The styles root currently has 1,297 entries: 1,290 bundle directories plus `_engine/`, `_db/`, `_harness/`, `_manifest.json`, `_retrieval-manifest.json`, `README.md`, and `manual-testing-playbook.md`. Every downloaded bundle is an intact unit containing `DESIGN.md`, `css-variables.css`, `tailwind-v4.css`, `design-tokens.json`, `<slug>-canonical.json`, and `source.md`. [SOURCE: iterations/iteration-001.md:14-18]

The backend cannot be relocated as independent directory renames:

- `_engine/persistent-adapter.mjs` imports database retrieval and schema modules.
- `_db/retrieval.mjs` imports engine card assembly.
- Database tests and oracle fixtures import engine fixtures and facade functions.
- `style-library.mjs` derives the corpus root from its parent and locates the retrieval manifest there.
- `manifest.mjs`, the indexer, and the extraction harness assume root-relative committed manifests.

[SOURCE: iterations/iteration-001.md:18-24] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9-18] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:5-7]

Production consumers are the four mode corpus modules and generator `study-prepare.ts`. The four modes import the engine facade directly; the generator positionally derives both the executable and retrieval-manifest paths. Tests add direct engine-module imports, fixture-root assumptions, and both manifest names. Documentation is a broad secondary replacement surface, but exact scoped searches found no command or agent as a direct path consumer. [SOURCE: iterations/iteration-005.md:92-98]

## 4. Transferable Runtime Rules

The proven runtime contributes ownership rules, not a literal directory template:

| Runtime rule | Styles application |
|---|---|
| Importable implementation belongs under `lib/` | Place engine and database domains under `lib/{engine,database}` |
| Executable adapters belong under `scripts/` | Move the proven standalone extractor to `scripts/extract-refero.mjs` |
| Real SQLite files belong under `database/` | Keep mutable logical DBs, generations, pointers, sidecars, and locks out of source |
| Tests have an independent root | Move engine/database tests and all oracle material under `tests/` |
| Paths should have an owner | Add one `lib/paths.mjs` default-path seam while retaining explicit overrides |

Styles must intentionally add `library/` because it owns an authoritative committed corpus and two committed corpus manifests, a lifecycle absent from the runtime reference. The checked-in runtime also does not prove that styles should become a standalone npm package. [SOURCE: iterations/iteration-002.md:14-31]

## 5. Adjudicated Target Tree

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

The direct children each express one lifecycle. Additional `backend/`, `runtime/`, `src/`, or package layers would add depth without adding ownership. [SOURCE: iterations/iteration-005.md:38-90]

## 6. Artifact Ownership Map

| Current owner | Confirmed inventory | Target owner | Rule |
|---|---:|---|---|
| 1,290 bundle roots | 7,740 tracked files | `library/bundles/<slug>/` | Move only manifest-enumerated six-file units |
| `_manifest.json` | 1 file | `library/manifests/crawl-manifest.json` | Committed acquisition/provenance metadata |
| `_retrieval-manifest.json` | 1 file | `library/manifests/retrieval-manifest.json` | Committed deterministic retrieval inventory |
| `_engine/` production | 9 modules | `lib/engine/` | Preserve filenames and exports |
| `_db/` production | 8 modules | `lib/database/` | Preserve filenames and exports |
| `_engine/__tests__/` | 8 files | `tests/engine/` | Preserve aggregate runner and fixtures |
| `_db/__tests__/` | 12 files | `tests/database/` | Preserve aggregate runner and fixtures |
| `_db/oracle/` | 16 files | `tests/oracle/` | Entire subtree is test-owned |
| `_harness/extract-refero.mjs` | 1 file | `scripts/extract-refero.mjs` | Proven standalone executable |
| `_harness/README.md` | 1 file | `docs/extract-refero.md` | Extractor documentation |
| `_db/README.md` | 1 file | `database/README.md` | Mutable-state operating contract |
| `manual-testing-playbook.md` | 1 file | `docs/manual-testing-playbook.md` | Operational documentation |

[SOURCE: iterations/iteration-005.md:18-36]

## 7. Path And Compatibility Contract

`lib/paths.mjs` is the only new source module. It should export independent defaults for:

- styles root;
- bundle root;
- crawl-manifest path;
- retrieval-manifest path;
- database root.

G1 introduces these exports while they still point to the old locations. Callers must accept independent paths instead of deriving both manifests from a corpus parent. Existing explicit fixture and external-call overrides remain valid; fixture-local `_manifest.json` and `_retrieval-manifest.json` names remain unchanged because they exercise explicit paths rather than production defaults. [SOURCE: iterations/iteration-004.md:9-15]

No compatibility filesystem aliases are warranted. Preserve module exports, callable APIs, guarded CLI execution, command names, environment variables, request/response shapes, retrieval modes, and explicit overrides. Update checked-in consumers atomically. Rebuild optional persistent state at the new root rather than fallback-searching `_db`. [SOURCE: iterations/iteration-004.md:151-157]

## 8. Consumer Cutover

G2 must update these executable consumers in the same group as source relocation:

- `design-foundations/corpus/relationship-blueprint.mjs`;
- `design-interface/corpus/relational-exemplar.mjs`;
- `design-motion/corpus/motion-evidence.mjs`;
- `design-audit/corpus/comparison-lane.mjs`;
- `design-md-generator/backend/scripts/study-prepare.ts`;
- the four mode test suites;
- generator `tests/corpus-baseline-v3.test.ts`;
- relocated engine/database tests and their relative imports.

The generator is a hard gate, not documentation cleanup: run both its TypeScript check and targeted corpus-baseline test at the baseline and mixed-state gates. [SOURCE: iterations/iteration-005.md:92-98,120-141]

Active documentation replacement includes `sk-design/README.md`, `SKILL.md`, styles/database/extractor docs, feature catalog entries, both manual-testing-playbook surfaces, mode corpus docs, generator docs, and active packet docs. The styles README contains 1,290 root-relative bundle links that must become `library/bundles/<slug>/`. Clearly historical changelogs and archived specs may retain old paths when the surrounding prose remains historical. [SOURCE: iterations/iteration-005.md:98]

## 9. Dependency-Ordered Migration

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

Mixed A proves path decoupling without renames. Mixed B proves moved source and consumers against the still-stable old corpus. This ordering avoids a flag day and gives each failure a preceding runnable reference state. [SOURCE: iterations/iteration-005.md:100-118]

## 10. Exact Git Move Plan

These commands are an implementation plan and were not executed by this research lineage. Run from the repository root only after G0 and G1 pass.

### G2: Source, Tests, Harness, And Docs

```bash
set -euo pipefail
ROOT='.opencode/skills/sk-design/styles'

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

Update relative imports and all consumers before the G2 gate. Never move `_db` wholesale because ignored mutable files could travel with it. [SOURCE: iterations/iteration-004.md:66-92]

### G3: Manifest-Authoritative Bundle Move

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

The measured move argv is 57,205 bytes, the longest slug is 56 bytes, and host `ARG_MAX` is 1,048,576. One shell-free `spawnSync` call is preferable to chunks, `xargs`, shell expansion, or 1,290 subprocesses because it is well within the measured limit and minimizes partial-failure boundaries. `git mv` is still not transactional: on failure, stop and inspect scoped status rather than rerunning blindly. [SOURCE: iterations/iteration-005.md:143-197]

## 11. Verification And Rollback

### Baseline and mixed-state gate

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

After G2, replace the engine/database runner paths with `tests/engine/index.mjs` and `tests/database/index.mjs`. After G3, additionally verify 1,290 direct target bundles, zero manifest slugs at the old root, both committed manifest destinations, build/query/hydrate smoke behavior, all prior suites, generator typecheck, and the targeted baseline test. G5 runs the full generator suite with `npm --prefix "$GEN" test`. [SOURCE: iterations/iteration-005.md:120-141]

### Mutable-state gate

Add this lifecycle-wide ignore rule:

```gitignore
.opencode/skills/sk-design/styles/database/*
!.opencode/skills/sk-design/styles/database/README.md
```

Then probe real publication names without creating a database:

```bash
git check-ignore -v \
  "$ROOT/database/style-library.sqlite" \
  "$ROOT/database/style-library.sqlite-wal" \
  "$ROOT/database/style-library.sqlite.current.json" \
  "$ROOT/database/style-library.sqlite.sha256-probe.1-1.sqlite"
git check-ignore -q "$ROOT/database/README.md" && exit 1 || true
```

Run persistent `status` only; do not build or publish a database during source migration. [SOURCE: iterations/iteration-005.md:199-219]

### Final gate and rollback

Classify stale-path search results rather than requiring historical records to disappear. Current source, tests, docs, feature catalog, playbooks, generator, and active packet docs must use target paths. Run `git diff --check`, stage only enumerated migration paths, and inspect both `git diff --cached --stat` and `git diff --cached --find-renames`; never use broad staging.

The rollback boundary is one migration commit. Before commit, repair a failed group forward from the preceding green mixed state. If the bundle move fails, inspect `git status --short -- "$ROOT"` and restore only manifest-enumerated source/destination pairs with operator confirmation. After commit, use `git revert <migration-commit>` and rerun the old-path baseline. Do not use hard reset, clean, stash, broad restore, or mutable-state fallback. [SOURCE: iterations/iteration-004.md:159-170] [SOURCE: iterations/iteration-005.md:197]

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Literal runtime-tree copy | Styles additionally owns authoritative bundles and committed corpus manifests | Runtime/styles lifecycle comparison | 1, 2 |
| `corpus/` instead of `library/` | Technically valid, but drifts from the established style-library product vocabulary | Naming adjudication | 3 |
| Top-level shared `manifests/` | Merges committed corpus metadata with mutable publication metadata | Lifecycle classification | 2, 3 |
| Separate top-level engine/database source roots | Current bidirectional imports are better represented as sibling `lib/` domains | Import graph | 1, 2 |
| Additional `backend/`, `runtime/`, or `src/` wrapper | Adds depth without adding an owner | Target-tree analysis | 3 |
| New style-library/database CLI wrappers | Existing modules already expose callable APIs and guarded direct execution | Export/entrypoint reads | 3, 4, 5 |
| Production oracle module | Exact search found only test importers | Import audit | 4, 5 |
| Whole `_db` or backend-directory move | Can preserve false ownership and carry ignored mutable artifacts | Git/filesystem audit | 4, 5 |
| Root wildcard or negative-exclusion bundle move | Can capture backend/docs and is not inventory-authoritative | Manifest/Git inventory | 4 |
| Chunked, `xargs`, shell-expanded, or per-bundle move | Measured single argv is safe and has fewer partial-failure boundaries | ARG_MAX/argv measurement | 5 |
| Old-path aliases or database fallback | No concrete external consumer requires them; state is rebuildable | Consumer search and lifecycle contract | 3, 4, 5 |
| Fixture manifest renames | Fixtures intentionally test explicit overrides | Fixture reads | 4, 5 |
| Database creation during migration | Persistent mode is opt-in and publication state is separately rebuildable | Database contract | 4, 5 |
| Standalone npm package conclusion | Checked-in runtime/package metadata is insufficient to establish that requirement | Reference audit | 2 |

## Divergence Map

The lineage used default convergence mode with the frozen `max-iterations` stop, so it emitted no divergent pivots or Council artifacts. Breadth came from sequential topology, reference-architecture, target-tree, migration, and adversarial-audit passes. The audit superseded iteration 3's speculative wrappers and production-oracle split, then corrected iteration 4's generator gate, bundle preflight, pointer probe, mutable-state ignore policy, and documentation inventory. The remaining frontier is implementation verification, not unresolved architecture. [SOURCE: deep-research-dashboard.md] [SOURCE: iterations/iteration-005.md]

## 13. Open Questions

All five charter questions are answered. Implementation must still confirm these runtime facts at G0, but none changes the target architecture:

- the scoped migration surfaces are clean or explicitly separated from unrelated work;
- the baseline commands pass before path refactoring;
- no untracked passenger exists inside any of the 1,290 bundle roots at move time;
- active versus historical stale-path matches are classified correctly;
- the final Git rename review recognizes the intended moves after import and documentation edits.

## 14. Risks And Controls

| Risk | Control | Stop condition |
|---|---|---|
| Partial bundle relocation | Exact six-file, tracked-set, empty-destination, collision, and argv-headroom preflight | Stop on the first mismatch; inspect scoped status |
| Broken positional paths | G1 independent path seam while old defaults remain | Do not begin G2 until the full baseline remains green |
| Engine/database cycle break | Move all 17 modules as one group and update imports before gate | Stop if any module/test import resolves to an old source path |
| Generator regression | Typecheck plus targeted corpus-baseline test at baseline and mixed-state gates | Stop before G3 |
| Mutable SQLite accidentally committed | Ignore all `database/*` except README and probe real names | Stop if README is ignored or payload is not ignored |
| Documentation drift | Rewrite 1,290 README links and classify active stale-path matches | Stop finalization on active old-path references |
| Unrelated work staged | Use enumerated paths and inspect cached diff/renames | Do not create migration commit from broad staging |
| Rollback damages concurrent changes | One migration commit; scoped repair/revert only | Never reset, clean, stash, or broad-restore |

## 15. Implementation Sequence

### Phase A: Establish baseline

- Capture scoped status for styles, four mode corpora, and generator backend.
- Run engine, database, four mode, generator typecheck, and targeted generator baseline gates.
- Verify the manifest reports 1,290 unique safe slugs and every bundle has exactly six tracked files.

### Phase B: Decouple paths

- Add `lib/paths.mjs` with old defaults.
- Refactor production paths into independent bundle, manifest, and database inputs.
- Preserve explicit fixture overrides and rerun the complete baseline.

### Phase C: Move source and consumers

- Execute the exact G2 move list.
- Update bidirectional relative imports, four mode consumers/tests, generator paths/tests, and relocated runners.
- Prove Mixed B against old bundles/manifests.

### Phase D: Move committed data

- Run the G3 closed-set preflight and one manifest-derived `git mv` invocation.
- Move and rename both committed manifests.
- Flip centralized defaults and extractor outputs.
- Prove target inventory and all runtime/test behavior.

### Phase E: Harden and finalize

- Add mutable-state ignore policy and probe actual publication names.
- Rewrite active docs and 1,290 root-relative README links.
- Run classified stale-path, inventory, test, smoke, formatting, and strict packet gates.
- Stage enumerated paths, review renames, and create one reversible migration commit only under the implementation workflow.

## 16. References

### Iteration evidence

- `iterations/iteration-001.md`: current topology, consumers, coupling, and path assumptions.
- `iterations/iteration-002.md`: transferable runtime rules and styles-specific lifecycle differences.
- `iterations/iteration-003.md`: concrete target tree and ownership naming.
- `iterations/iteration-004.md`: dependency order, move commands, compatibility, verification, and rollback.
- `iterations/iteration-005.md`: final inventory audit, supersessions, command corrections, and measured safety.

### Primary repository sources

- `.opencode/skills/sk-design/styles/README.md`
- `.opencode/skills/sk-design/styles/_engine/**`
- `.opencode/skills/sk-design/styles/_db/**`
- `.opencode/skills/sk-design/styles/_harness/**`
- `.opencode/skills/sk-design/styles/_manifest.json`
- `.opencode/skills/sk-design/styles/_retrieval-manifest.json`
- `.opencode/skills/sk-design/design-{foundations,interface,motion,audit}/corpus/**`
- `.opencode/skills/sk-design/design-md-generator/backend/**`
- `.opencode/skills/system-deep-loop/runtime/README.md`
- `.opencode/skills/system-deep-loop/runtime/database/README.md`

The lineage-local `resource-map.md` is a reducer-generated coverage index. It was emitted after convergence; no packet-level resource map existed at initialization, so it was not used as prior evidence.

## 17. Convergence Report

- Stop reason: `maxIterationsReached` under frozen `stopPolicy=max-iterations`.
- Total iterations: 5 of exactly 5 required.
- Minimum iterations: 3, passed.
- Questions answered: 5/5.
- Remaining charter questions: 0.
- newInfoRatio trend: `0.89 -> 0.88 -> 0.88 -> 0.86 -> 0.44`.
- Average newInfoRatio: `0.79`.
- Convergence threshold: `0.05`, telemetry-only before the hard cap.
- Last three iterations: target layout (`0.88`), dependency/move plan (`0.86`), final audit (`0.44`).
- Mechanical gate: all five narratives, route-proof records, and canonical deltas passed validation.
- Reducer gate before terminal event: five completed iterations, five resolved questions, zero open questions, and zero JSONL corruption.
- Divergent pivots: none.
- Residual uncertainty: implementation baseline cleanliness and runtime execution of the documented gates; neither reopens the selected architecture.

[SOURCE: deep-research-dashboard.md] [SOURCE: findings-registry.json] [SOURCE: deep-research-state.jsonl]
