---
title: "Implementation Plan: Phase 4: lane-core"
description: "Delete the lane registry row and let the compiler name every site that follows, remove the status contract fields, the vector DDL and readers, lib/embedders and the symlink, raise SCHEMA_VERSION so an older database is discarded and rescanned, and remove the dead flag at every writer, all in one commit. A moved ratchet halts the phase; a gate that needs a phase 005 edit merges 004 and 005."
trigger_phrases:
  - "lane core plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: lane-core

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime, ESM, built with the spec-kit `tsc`), Node ESM scripts, Python 3 harnesses, the CommonJS launcher, Markdown and two JSON baselines |
| **Framework** | The scorer's lane registry and fusion; the advisor MCP handlers, zod v4 strict schemas, the MCP tool definitions and the CLI manifest; the better-sqlite3 skill graph |
| **Storage** | The gitignored `skill-graph.sqlite`; this phase raises its schema version to 2 and discards any older file |
| **Testing** | Vitest in the advisor runtime (`npm test`, `npm run test:stress`); the CI routing ratchets; the Python corpus gate; the sk-doc script tests, the catalog validator, the leaf manifest check and the link check |

### Overview
The registry row at `lane-registry.ts` 13 is the root: `ScorerLaneId`, both weight records and `AdvisorLaneSchema` derive from it, so deleting it makes `tsc` name every source site that still spells the lane. Those sites are deleted, not renamed. The status contract loses two inputs and two outputs, `skill-graph-db.ts` loses its vector DDL, migrations and readers and gains a discard step, and `lib/embedders/` and the `lib/shared/embeddings` symlink go with every test import of the embeddings package. Typecheck does not read `tests/`, `stress-test/` or the scripts, so the test edits are planned file by file with a case count each, and the pattern `P` grep from `spec.md` closes what the compiler cannot see. Every range was re-read at `35983033f76`; this phase lands on phase 003's commit, so `tasks.md` names the symbol beside each number in the five files 003 also edits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] In `R/`, `npm run typecheck`, `npm test` (0 failed, 11 fewer files and 67 fewer cases than at the start commit), `npm run clean && npm run build` and `npm run test:stress -- --config vitest.stress.config.ts` (21 files, 65 passed) exit 0; the five ratchet files and the corpus gate print the start commit's results; `git diff --stat <start> -- <score baseline files>` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract and store together, compiler-led.

### Key Components
- **Lane registry and weights** (`lib/scorer/lane-registry.ts`, `weights-config.ts`): one `LANE_DEFINITIONS` array derives the lane id type, the id list and the live and shadow weight records. Its fifth row goes; the other four keep 0.42, 0.28, 0.13, 0.12 live and 0.40, 0.25, 0.20, 0.10 shadow, so both totals stay 0.95 (decision Q003).
- **Fusion** (`lib/scorer/fusion.ts`): after phase 003 it still calls the lane in `buildLaneScores`, holds lane keys in the query-class multipliers and turns a stale embedding verdict into a degraded-lane signal in `projectionRuntimeLaneHealth`. All three go; `scoreAdvisorPrompt` passes the caller's runtime lane health through unchanged.
- **Projection** (`lib/scorer/projection.ts`, `types.ts`): reads `vec_metadata` and the `vec_*` model ids into an embedding signature and a staleness verdict on every sqlite projection. The reader with its row types, constants and helpers, and the two projection fields go.
- **Status contract** (`handlers/advisor-status.ts`, `schemas/advisor-tool-schemas.ts`, `tools/advisor-status.ts`, `skill-advisor-cli-manifest.ts`): `includeSemanticHealth` and `debug` add `semanticLaneHealth`, which counts vectors and probes Ollama; `includeEmbeddingsHealth` adds `embeddingsHealth`, which probes the model server through `lib/embedders/embeddings-health.ts`. Both inputs, both outputs and both probes go; `debug` stays accepted and adds nothing.
- **Skill graph store** (`lib/skill-graph/skill-graph-db.ts`): creates the vector tables and embedding columns in `SCHEMA_SQL` and `ensureSchemaMigrations`, and keeps the readers phase 003 left for the status handler and the lane. All of it goes, and `initDb` gains the discard step below.
- **Embedders and the symlink** (`lib/embedders/`, `lib/shared/embeddings`): advisor shims over the shared embeddings package, and a link into it that `tsconfig.build.json` excludes. Both go, so phase 005 can delete the package with no advisor importer left.

### Discard design
`initDb` reads the stored version through a read-only probe before it opens the database for writing, and deletes the files only when the probe actually read an outdated schema:

```ts
// Returns the version of a file the schema has outgrown, or null for a file to keep.
function readOutdatedSchemaVersion(probe: Database.Database): number | null {
  try {
    const row = probe.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version?: unknown } | undefined;
    if (typeof row?.version !== 'number') return null;
    return row.version < SCHEMA_VERSION ? row.version : null;
  } catch (error: unknown) {
    if (!isMissingSchemaVersionTable(error)) throw error;
  }
  const skillTable = probe.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'skill_nodes'").get();
  return skillTable === undefined ? null : 0;
}

function discardOutdatedDatabase(databasePath: string): void {
  if (!existsSync(databasePath)) return;
  let storedVersion: number | null;
  try {
    const probe = new Database(databasePath, { readonly: true, fileMustExist: true });
    try {
      probe.pragma('busy_timeout = 5000');
      storedVersion = readOutdatedSchemaVersion(probe);
    } finally {
      probe.close();
    }
  } catch {
    return;
  }
  if (storedVersion !== null) removeOutdatedDatabase(databasePath, storedVersion);
}
```

It runs in `initDb` after the integrity block at 509 to 512 and before `new Database(dbPath)` at 513. Only two readings condemn a file: a numeric `schema_version` row below 2, or a `skill_nodes` table with no `schema_version` table, which predates versioning. An empty version table, a file with neither table, and any error the probe hits (a lock held past `busy_timeout`, a hot rollback journal a read-only connection may not replay, an I/O, permission or descriptor error) keep the file for the read-write open, which reports the error. When that open reads a version below 2, the version block at 530 to 535 closes it, deletes the files and opens again on a new file, instead of stamping the version current. `SCHEMA_SQL` creates `schema_version` first, so a file another opener is still creating never shows `skill_nodes` without it. A database stored at or above 2 is kept. `removeOutdatedDatabase` deletes the four names and warns; nothing is copied: no `.bak`, no `.corrupt`. `-journal` is removed beside the `-wal` and `-shm` the research names, because `initDb` falls back to `journal_mode = DELETE` at 521 and a stale hot journal would otherwise be replayed into the new file.

### Data Flow
Today the daemon opens the database at `advisor-server.ts` 393, `SCHEMA_SQL` and the migrations create the vector objects, a scan at 413 indexes the skills, and the IPC server starts at 431; the projection then reads the vector model ids, and a status call with a health flag counts vectors and probes Ollama and the model server. After this phase the open at 393 discards a version 1 file, creates a version 2 file with no vector object, and the scan at 413 fills it before the IPC server starts, so the first request sees a full projection. Scoring runs four lanes, and status reads no vector and probes nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The phase cut, by surface. "004" rows change here; every other row names the phase that owns it and why it cannot move into this commit.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lane-registry.ts` 13, `weights-config.ts` 18 | Lane row and its weight constant | 004: delete | REQ-001 node probe; T004 `rg` |
| `fusion.ts` lane import, `buildLaneScores` call, `queryClassLaneMultipliers` lane keys, `projectionRuntimeLaneHealth`, its call in `scoreAdvisorPrompt` | Lane scoring and stale-vector lane health | 004: delete; pass `options.runtimeLaneHealth` | T006 `rg`; typecheck |
| `lanes/semantic-shadow.ts`, `graph-causal.ts` 88, `metrics.ts` 666, `advisor-recommend.ts` 190 to 191, `prompt-policy.ts` 265 | Lane module and lane-specific branches | 004: delete; reword the comment | T007, T016 `rg` |
| `projection.ts` imports 14, 16, 21, 25, 26; 1363 to 1653, 1658 to 1674, 1725, 1744, 1745 (with 002 applied); `types.ts` 84 to 99, 113, 114 | Embedding signature and staleness | 004: delete | T008, T009 `rg` |
| `advisor-status.ts`, `advisor-tool-schemas.ts`, `tools/advisor-status.ts`, `skill-advisor-cli-manifest.ts` | Status contract and its probes | 004: delete both inputs and outputs; keep `debug` inert | REQ-002 probes |
| `skill-graph-db.ts` DDL, migrations, readers, `SCHEMA_VERSION` | Vector schema and readers | 004: delete; version 2 with discard | REQ-004; T010 and T011 `rg`; two new cases |
| `projection.ts` generated bridge block 81 to 1219 | Command bridges written by the generator | Unchanged: the T007 ranges sit below it | T039 bridge `--check` prints fresh |
| `lib/embedders/`, `lib/shared/embeddings`, `tsconfig.build.json` 27 and 28 | Embedder shims and the package link | 004: delete | REQ-003 |
| Dead flag: launcher 163, `advisor-validate.ts` 423, five routing scripts, two Python harnesses, `replay-helpers.mjs`, 18 test files, the CLI test utils, two stress files | Writers of a flag nothing reads | 004: delete, with the `VITEST` assignments beside it | REQ-005 grep |
| `scorer-eval-baseline.json` 9 | The flag inside a frozen score baseline | Unchanged: goal criterion 4; phase 008 decides | REQ-007 diff prints nothing |
| `.env.example` 411, `ENV-REFERENCE.md` 391 and 392 | Prose about the flag and the weight env | 006 | Residue check lists them until 006 |
| `sweep-lane-residue.mjs` 230 | Residue term list | Unchanged: the check must name the flag to find it | Present after the phase |
| 11 lane test files, the seeding fixture and its cache, `tests/embedders/README.md` | Cover only the lane or the embeddings package | 004: delete | T021 status count |
| 21 test files and four stress files that touch the lane beside surviving code | Mixed coverage | 004: edit; each runs alone with its planned count | T022 to T033 |
| `holdout-independent.vitest.ts` 95 and 141 to 155 | Consumer rows for the ablation and sweep files | 004: delete with the two files, in the same commit | Holdout ratchet passes 6 |
| Six catalog SOURCE FILES rows | Name a file this phase deletes; the validator runs at `tier=fail` | 004: delete the rows only | REQ-010 validator line |
| sk-doc `baseline-readme-verdicts.json`, `durable-directory-manifest.json` | Record every tracked README and durable folder | 004: regenerate for the advisor READMEs this phase deletes or edits | `run-script-tests.sh` passes |
| Catalog and reference prose, `SKILL.md` 111, advisor `README.md` 48, four playbook entries, changelogs, the three "five-lane" renames | Describe the lane | 006 | Residue check lists them until 006 |
| `phrase-variants.json`, trigger index, `cite-drift-labels.jsonl` | Generated from the docs | 007 | Their generators' check modes |
| `shared/embeddings/`, `hf-model-server.cjs`, `model-server-supervision.cjs`, launcher 180 to 183, `@huggingface/transformers`, spec-kit `tests/embedders/`, `launcher-bootstrap.vitest.ts` 245 and 269 | The package, the model server and its supervision | 005 | REQ-011 diff prints nothing |

Required inventories:
- Same-class producers: every writer of a lane id, a lane weight key or a status health field is either a source site the compiler names after T004, or a test, stress or script line the pattern `P` grep in REQ-009 names. At `35983033f76` `P` matches 100 runtime files; after phase 003 deletes its seven tests and edits its source files, every remaining match is in the inventory above.
- Consumers of changed symbols: each deleted export was grepped across `.skilled/`, `.github/` and the hooks with `dist/` excluded. `readAdvisorEmbeddingStaleness` has one importer (`advisor-status.ts` 32); `embeddingCoverage` and `readCommandEmbeddingSources` have `advisor-status.ts` 19 and 21 and two tests; `providerModelId` has `projection.ts` 21; `loadSkillEmbeddings` has the lane and `advisor-trust-gate.vitest.ts` 20; `getDbReadOnly` stays, because `handlers/skill-graph/status.ts` 78 reads through it. Outside the advisor, only comments in `system-spec-kit/shared/embeddings/adapter.ts`, `adapters/ollama.ts`, `registry.ts` and `types.ts` name `lib/embedders/`; they are 005's. No CI workflow names a file this phase deletes.
- Matrix axes: lane artifact (registry row, weight key, status field, vector DDL, embedder shim, package import, dead flag) by surface (source, test, stress, script, doc, baseline); each cell is deleted here or named above as another phase's.
- Algorithm invariant: removing a lane at live weight 0 cannot move a score or a confidence, because the lane adds 0 to every weighted sum and the live total stays 0.95; only `uncertainty`, which counts evidence across lanes, can move. Measured on 545 corpus rows with the lane skipped: 0 top-skill, passing-set, score or confidence changes, 225 uncertainty changes. The shadow weights feed only the `_shadow` diagnostic in `advisor-recommend.ts` 478 to 498, which multiplies each raw score by its shadow weight and never divides by their total, so no renormalization happens in either record. If a ratchet or the corpus gate moves anyway, a renormalization or a pinned uncertainty is the first suspect, and the phase halts (ADR-001).

Score baseline files for REQ-007: `R/scripts/routing-accuracy/scorer-eval-baseline.json`, `R/scripts/routing-accuracy/command-routing-baseline.json`, `R/tests/parity/fixtures/local-native-approved-divergences.json`, `R/scripts/routing-accuracy/labeled-prompts.jsonl`, `R/scripts/routing-accuracy/holdout-prompts.jsonl`, `R/scripts/routing-accuracy/ambiguity-prompts.jsonl`, `R/scripts/routing-accuracy/command-prompts.jsonl`, `R/scripts/fixtures/gate2-golden-prompts.jsonl` and `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reprints the Measured Behavior numbers at the phase's start commit, which must be phase 003's, reads the 001, 002 and 003 baselines and records the case count of every test file this phase touches. Implementation deletes the registry row first and follows the compiler through the scorer, then the status contract, the skill graph store with the discard, the embedders and the symlink, the dead flag, the test deletions and edits, and the catalog rows and README baselines. Verification runs typecheck, `npm test`, the clean build, the stress suite, the five ratchet files, the corpus gate, the contract probes, a discard run on a copy of this worktree's version 1 database, the residue greps, the boundary diff and the doc gates. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each edited test file alone with its planned case count; the new discard and keep cases; the new refusal cases at the handler and the CLI; `node --check` and `python3 -m py_compile` on each edited script | `npx vitest run <file>` in `R/`, `node --check`, `python3 -m py_compile` |
| Integration | The advisor suite, typecheck, clean build and stress suite; the four CI routing ratchets and the command-routing slice; the corpus gate; the command bridge check; the catalog validator, leaf manifest check, link check and sk-doc script tests | `npm test`, `npm run typecheck`, `npm run clean && npm run build`, `npm run test:stress -- --config vitest.stress.config.ts`, `npx vitest run <ratchets>`, `score-routing-corpus.py`, `validate_catalog_package.py`, `generate-leaf-manifest.cjs --check`, `check-markdown-links.cjs`, `run-script-tests.sh` |
| Manual | Run the built `initDb` on a copy of this worktree's version 1 database and read `sqlite_master`; read `handleAdvisorStatus` and the discard step | Terminal, `sqlite3 -readonly` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 committed | Internal | Yellow | The lane module still has three callers in `fusion.ts` and `advisor-recommend.ts`; 003 is planned, not built |
| Phase 003's recorded `npm test` totals | Internal | Green | REQ-006 is measured against the start commit, which recorded 189 files and 2521 cases; the lane removal leaves 178 and 2454, and the review fix's six database cases bring it to 2460 |
| Advisor runtime `node_modules` and the built shared dist | Internal | Green | Typecheck, vitest, the stress suite and the ratchets cannot run |
| `python3` and `sqlite3` | External | Green | The corpus gate and the manual discard check cannot run |
| Phase 001's stress baseline | Internal | Green | REQ-006's 21 files and 65 passed come from it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate stays red after three fix rounds; a ratchet, the command slice, the corpus gate or a score baseline file moves, which is a halt and never a reason to recapture; or a gate needs a 005-owned edit, which is ADR-009's merge.
- **Procedure**: `git revert` the phase commit, which restores the lane, the contract, the embedders, the symlink and the tests together. A database already discarded and rebuilt at version 2 stays usable: the reverted code skips its version block for a version above its own and its migrations re-add the vector tables and columns. Before the phase is applied again, delete `R/database/skill-graph.sqlite` and its `-wal`, `-shm` and `-journal` files, because a version 2 file that the reverted code extended is kept by the discard rule and would carry those tables.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (start commit, baselines, case counts) | Phase 003 committed | Implementation |
| Implementation (registry, scorer, contract, store, embedders, flag, tests, docs) | Setup | Verification |
| Verification (gates, ratchets, probes, discard run, greps, boundary diff, validate) | Implementation | Phase 005 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Setup     │────►│ Registry row and │────►│ Tests edited │
│ start SHA   │     │ compiler sites:  │     │ and deleted, │
│ baselines   │     │ scorer, contract,│     │ stress edits │
└─────────────┘     │ store, embedders │     └──────┬───────┘
                    └────────┬─────────┘            │
                    ┌────────▼─────────┐     ┌──────▼───────┐
                    │ Dead flag, docs, │────►│   Verify     │
                    │ catalog rows,    │     │ gates, probes│
                    │ README baselines │     │ ratchets     │
                    └──────────────────┘     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Registry and compiler sites | Setup | A four-lane scorer, contract and store that typecheck | Tests, Verify |
| Discard step | Store edits | Version 2 databases with no vector object | Discard and keep cases, Verify |
| Dead flag and docs | Setup | No code writer of the flag; catalog and README gates intact | Verify |
| Tests and stress | Registry, contract, store | 11 files gone, 25 files passing with planned counts | Verify |
| Verify | All of the above | Gate results in `implementation-summary.md` | Phase 005 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Registry row, then every compiler-named source site, `skill-graph-db.ts` and `advisor-status.ts` first** - about 90 minutes - CRITICAL
2. **Test deletions and edits, the status, bootstrap, database and runtime-lane-health files first** - about 90 minutes - CRITICAL
3. **Gates: `npm test`, the clean build, the stress suite, five ratchet files and the corpus gate** - about 40 minutes - CRITICAL

**Total Critical Path**: about 3.5 hours

**Parallel Opportunities**:
- The dead flag edits in scripts, the launcher and the flag-only tests can run beside the source work
- The catalog rows, runtime READMEs and README baseline regeneration can run after the deletions, apart from the test edits
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Start state confirmed | T001 reprints version 1, five lane keys, `true` for the flag, 9 embedder files, the symlink and the ratchet counts at phase 003's commit | Setup |
| M2 | Compiler green on four lanes | `npm run typecheck` exits 0 with the registry row gone and `lib/embedders/` deleted | Implementation |
| M3 | Phase ready | Every gate in `tasks.md` Phase 3 passes and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One commit, cut by ownership, with a halt on any routing move

**Status**: Accepted

**Context**: Goal decision D1 makes this phase one atomic commit, because the lane type derives from the registry row. Research 5.2 step 3 lists the lane id, the status contract, the vector DDL, `lib/embedders/`, the dead flag and the remaining lane tests. The parent assigns the embeddings package and the model server to 005, prose to 006 and generated indexes to 007, and decision Q003 keeps the weights at 0.95.

**Decision**: Everything in the advisor runtime that names the lane, reads a vector or imports the embeddings package changes here, plus the catalog rows and README baselines a deleted file would otherwise break. Nothing owned by 005, 006 or 007 changes. A ratchet, the command-routing slice or the corpus gate that moves, or a score baseline file that changes, halts the phase: nothing is recaptured, and the finding goes to the goal log.

**Consequences**:
- The commit is large, about 110 files, almost all deletions.
- Prose that describes the lane stays wrong for two phases, and the residue check lists it until 006.

**Alternatives Rejected**:
- Split the contract from the store: the lane type would have to survive one commit with no reader, against D1.

### ADR-002: Discard by schema version, before the database opens

**Status**: Accepted

**Context**: Decision Q008 and research 5.3 choose discard and rescan over a drop migration, because a migration keeps retired table names in the code and leaves dropped rows in free pages. Every database built so far stores version 1. The skill graph is derived state: a scan rebuilds the nodes, edges, docs and the three `skill_graph_metadata` keys (`indexSkillMetadata` writes them at 1149 to 1151 and 1288 to 1290). The daemon opens the database at `advisor-server.ts` 393 and scans at 413, before its IPC server starts at 431.

**Decision**: Raise `SCHEMA_VERSION` to 2 and add the `discardOutdatedDatabase` step in section 3 to `initDb`, before the read-write open. It deletes the database, `-wal`, `-shm` and `-journal` when the version read from the file is lower, or the file holds skill tables with no `schema_version` table, copies nothing, and keeps a file stored at 2 or above. A probe that cannot read the file keeps it, and the read-write open discards it once it reads a lower version. The rule names no retired table.

**Consequences**:
- A user's first daemon start after this phase rebuilds the graph, which the startup scan already does on every start.
- A non-daemon process that opens the database lazily (`skill_graph_validate`, `skill_graph_query`) on a version 1 file sees an empty graph until the next scan; `advisor_rebuild` and `skill_graph_scan` scan right after their open.
- `-journal` is added to the research's three names, because of the `journal_mode = DELETE` fallback at 521.

**Alternatives Rejected**:
- Drop the tables and columns in a migration: rejected by Q008.
- Keep a `.bak` copy before deleting: the residue check's M3 counts every `.bak` and `.corrupt` copy as residue, and the data is derived.

### ADR-003: Delete the two legacy CHECK rebuilds and test the upgrade path through the discard

**Status**: Accepted

**Context**: `ensureSchemaMigrations` rebuilds `skill_nodes` when its SQL holds `CHECK(family IN` (412 to 462) and `skill_edges` when it holds `CHECK(edge_type IN` (468 to 499). `SCHEMA_SQL` (224 to 290) creates neither constraint, so only a database built by older code can trigger them, and every such database is stored at version 1. The `skill_nodes` rebuild also copies the three embedding columns. Their tests at `skill-graph-db.vitest.ts` 211 and 280 plant a legacy database stamped `schema_version` 1 (241 to 247, 306 to 312), which the discard now deletes before either rebuild could run. No other test or stress fixture that builds `skill_nodes` by hand reaches `initDb`: the status, freshness-panel, status-hash and projection-fallback fixtures are read through read-only paths, and the Python fixture through the Python scorer.

**Decision**: Delete both rebuilds. Replace the two tests with a discard case that plants a version 1 database holding both legacy CHECK constraints, an embedding column, a `vec_1024` table and a marker row, and asserts that after `initDb` the marker is gone, no vector object or copy file remains, and a scan indexes an `sk-hub` skill and an edge type the old constraint omitted. Add a keep case for a version 2 database.

**Consequences**:
- The user-visible guarantee of both migrations, that a legacy database never aborts a scan on a stale constraint, keeps coverage through the discard case.
- About 90 lines of migration code with no reachable input leave the store.

**Alternatives Rejected**:
- Keep the rebuilds with the embedding columns stripped: they could only be reached by a test that hand-builds a version 2 database with a version 1 shape, a state no code produces, and the existing tests would pass vacuously through the discard.

### ADR-004: Delete the `lib/shared/embeddings` symlink here

**Status**: Accepted

**Context**: The symlink points at `system-spec-kit/shared/embeddings`, which phase 005 deletes. `tsconfig.build.json` 27 and 28 exclude it, and no file imports through it: every package import uses the `@spec-kit/shared/embeddings` alias. Goal criterion 3 requires that the advisor import nothing from the package, and the residue check counts the link as its one symlink finding.

**Decision**: Delete the symlink, the two excludes and the `lib/shared/README.md` rows 16, 26, 36 and 43 and the link at 73 here.

**Consequences**:
- Phase 005 deletes the package with no advisor path pointing into it.

**Alternatives Rejected**:
- Leave it for 005: the advisor would keep a path into the package after the phase whose handoff says it imports nothing from it, and 005's scope would reach back into the advisor runtime.

### ADR-005: Remove both health inputs, keep `debug` as an inert input

**Status**: Accepted

**Context**: Goal criterion 2 requires that `advisor_status` refuse the semantic-health flag. `AdvisorStatusInputSchema` is `.strict()`, both `readAdvisorStatus` (434) and `handleAdvisorStatus` (577) parse with it, and the tool and manifest schemas set `additionalProperties: false`, so a removed property is refused everywhere. `includeEmbeddingsHealth` reads `lib/embedders/embeddings-health.ts`, which goes with the folder. `debug`'s only effect is the same `semanticLaneHealth` spread at 538 and 562. Phase 002 removed the doctor's use of the semantic-health flag; no other caller in `.skilled/`, the hooks or the commands passes either flag, and four playbook entries, which 006 rewrites, still do.

**Decision**: Delete `includeSemanticHealth`, `includeEmbeddingsHealth`, `semanticLaneHealth` and `embeddingsHealth` from every schema and the handler. Keep `debug` in all three schemas and reword its description in `tools/advisor-status.ts` 18 and `skill-advisor-cli-manifest.ts` 89 to the same new text, "Accepted for compatibility; adds no fields to the status response.", so the manifest parity test still matches.

**Consequences**:
- A caller passing either health flag now gets a schema error, exit 64 on the CLI; a caller passing `debug` keeps working.
- The four playbook commands fail until 006 rewrites them.

**Alternatives Rejected**:
- Delete `debug` too: it would break any caller passing it, which the goal does not ask for.

### ADR-006: Delete a test whose subject is the lane or the package, edit a mixed one

**Status**: Accepted

**Context**: Research step 3 takes "all remaining lane tests". Some files cover the lane beside code that survives. Holdout-independent's ratchet requires that every declared consumer reads its corpus and every corpus reader is declared, and goal criterion 3 counts a test import of the embeddings package as an import.

**Decision**: Delete the five `tests/embedders/` files, the cosine, ablation, promotion, staleness and coverage files, and `lane-weight-sweep.vitest.ts`, whose seeded sweeps need lane vectors; move its one lane-agnostic case, the weight override check, into `native-scorer.vitest.ts` against `derived_generated`, and delete its holdout surface at 141 to 155 with the ablation row at 95. Delete the end-to-end block in `launcher-bootstrap.vitest.ts`, whose only subject is the shared factory resolving the advisor's `vec_metadata` pointer; the cases at 196 to 244 keep the `MEMORY_DB_PATH` contract covered. Edit every other file in place.

**Consequences**:
- 67 cases go: 55 in the 11 deleted files (embedders 29, cosine 7, ablation 4, promotion 5, staleness 6, coverage 1, sweep 3) and 12 in the edited ones (status 11 deleted and 1 added, bootstrap 2, native scorer 1 deleted and 1 moved in, database 2 replaced by 2).
- `laneWeightsOverride` keeps one test; the intent corpus keeps its `bm25-lexical-shadow` consumer and the harder corpus its local-native consumers.

**Alternatives Rejected**:
- Keep the sweep file with only the override case: a file named for a sweep with no sweep, whose holdout surface would still have to go.

### ADR-007: Remove the dead flag and its `VITEST` companion at every code writer

**Status**: Accepted

**Context**: Goal decision D2 removes `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` at every writer site, and nothing reads it. Four capture scripts and the classifier replay helper also set `process.env.VITEST = 'true'`, with comments that say the lane substitutes fixture vectors under it. A whole-word grep for `VITEST` over the runtime and `system-spec-kit/shared`, tests excluded, finds readers only in `lanes/semantic-shadow.ts`; `scripts/skill_advisor.py` 226 lists it in the env allowlist it forwards to the native child, which forwards and never reads it. No ratchet reads the `env` block of `scorer-eval-baseline.json`; the capture-date test compares two captures with each other.

**Decision**: Delete the flag from 31 code files and the `VITEST` assignments, their comments and the two `PROJECTED_ENV_NAMES` entries beside it. Leave `scorer-eval-baseline.json` line 9, which goal criterion 4 freezes, `.env.example` 411, which is 006's prose, and the residue check's term list.

**Consequences**:
- A future recapture writes an `env` block without the flag, which differs from the committed baseline in that one key only.
- `git grep -l SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC -- ':!specs'` drops from 34 files to 3.
- The forward of `VITEST` in `skill_advisor.py` 226 stays: removing a forward is not this phase's change, and the name carries no lane vocabulary.

**Alternatives Rejected**:
- Keep the `VITEST` lines with a reworded comment: there is no true reason left to state, since no scorer code reads the variable.

### ADR-008: Catalog rows and README baselines only where a gate breaks

**Status**: Accepted

**Context**: `validate_catalog_package.py` checks at `tier=fail` that every SOURCE FILES path exists; six advisor catalog leaves name a file this phase deletes. The sk-doc script tests compare every tracked README and durable folder with `baseline-readme-verdicts.json` and `durable-directory-manifest.json`. The parent gives prose to phase 006.

**Decision**: Delete the six SOURCE FILES rows and regenerate the two baselines with each test's `--write`, keeping the diff to rows for advisor READMEs this phase deletes or edits. Leave every prose sentence for 006.

**Consequences**:
- Six catalog leaves describe a removed lane for two phases.

**Alternatives Rejected**:
- Rewrite the catalog leaves here: it brings the root catalog, inbound links and prose review into a runtime phase.

### ADR-009: Fallback: merge with phase 005 if a gate needs a 005-owned edit

**Status**: Proposed

**Context**: Research 5.2 orders the lane core before the package, and this plan found no file outside the advisor that imports `lib/embedders/` or the symlink. Typecheck cannot see the spec-kit shared build, the launcher's model-server path or a spec-kit test that might still reach into the advisor.

**Decision**: If a typecheck, build, test or stress error, or a doc gate, can only be fixed by editing a path REQ-011 names, stop, record it in both goal logs, and land phases 004 and 005 as one commit under this plan with 005's tasks appended, never 004 alone with a 005 edit folded in. A routing move is still a halt under ADR-001, not a merge.

**Consequences**:
- The merged commit would be about 150 files; the ratchets still prove neutrality for the combined change.

**Alternatives Rejected**:
- Edit the 005 path inside 004 without recording it: it hides a cross-phase change from 005's plan and baseline.
