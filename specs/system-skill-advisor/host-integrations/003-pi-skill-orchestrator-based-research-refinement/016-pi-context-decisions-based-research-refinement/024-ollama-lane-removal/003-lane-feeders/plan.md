---
title: "Implementation Plan: Phase 3: lane-feeders"
description: "Delete every caller and writer that feeds the lane, in one commit with its dedicated tests, the bridge regeneration and the launcher keys, and leave every symbol a phase 004 file imports in place so the compiler stays green between the two commits. A moved ratchet halts the phase; a compile error that needs a 004 edit merges 003 into 004."
trigger_phrases:
  - "lane feeders plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: lane-feeders

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime, ESM, built with the spec-kit `tsc`), Node CommonJS (the launcher, the bridge generator), one ESM script, one GitHub Actions YAML, Markdown |
| **Framework** | The advisor daemon and MCP handlers over a better-sqlite3 skill graph; the scorer's lane registry and fusion; the generated command bridges |
| **Storage** | The gitignored `skill-graph.sqlite`; this phase stops writing its vector tables and changes no schema |
| **Testing** | Vitest in the advisor runtime (`npm test`) and in `.skilled/` (`vitest.config.bin.ts`); the CI routing ratchets; the Python corpus gate; the sk-doc script tests and catalog validator |

### Overview
The change is almost all deletion: the lane's feeders in six advisor source files, the `embeddingText` generator code and its 47 generated fields, the `--real-embedding` capture mode, three forwarded env keys, seven dedicated test files, and the lines in nine tests and six docs that name a removed symbol or a deleted test. Every range below was re-read at `bf6806ad4b3`; it matches research iteration 1 F2 except the generator, whose `embeddingText` code also spans `METADATA_MEANING` (97 to 99, 125, 168 to 174), `entryMeaning` (710 to 717) and the `meaning` constant (1335 to 1337), not only 690 to 693 and 1353. Phase 002 does not edit any file this phase edits except the bridge JSON, so the line numbers hold after 002 lands; the JSON is regenerated, never edited.
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
- [ ] In `R/`, `npm run typecheck`, `npm test` (0 failed, seven fewer files and 55 fewer cases than at the start commit) and `npm run clean && npm run build` exit 0; the five ratchet files and the corpus gate print the Measured Behavior results; `git diff --stat <start> -- <score baseline files>` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feeders before core.

### Key Components
- **Daemon and watcher** (`advisor-server.ts`, `lib/daemon/watcher.ts`): resolve the embedder pointer at start and start the shared background refresh after start and after each reindex. Both calls go.
- **Skill graph store** (`lib/skill-graph/skill-graph-db.ts`): holds the vector writers (refresh, per-skill and per-command embed, outage streak, Ollama probe) and the vector readers. The writers go; the readers stay because `advisor-status.ts` and `lanes/semantic-shadow.ts`, both 004's, import them.
- **Recommend handler** (`handlers/advisor-recommend.ts`): wraps each scored call in the prompt embedding and carries the wrapper's health reason into lane health and warnings. The wrapper and that plumbing go; at weight 0 the reason it carried is always `lane_weight_zero`, which the handler already hides.
- **Fusion** (`lib/scorer/fusion.ts`): the opt-in exact rerank reads stored vectors through the lane module, and the command meaning path reads the lane's `cosine:` evidence. Both go; the lane call at 541 stays.
- **Bridge generator** (`scripts/command-bridges/derive-command-bridges.cjs`): writes `embeddingText` into the bridge JSON, whose only production reader is the store's command coverage count. The code goes and the JSON is regenerated.
- **Launcher** (`.skilled/bin/system-skill-advisor-launcher.cjs`): its child-env allowlist forwards the two Ollama settings and the refresh switch. Those three entries go.

### Data Flow
Today the daemon resolves an embedder pointer into `vec_metadata`, then the background refresh reads skill descriptions and the bridge JSON's `embeddingText`, embeds them through the Ollama adapter and writes `vec_<dim>` and `vec_cmd_<dim>`. On a prompt the recommend handler embeds the prompt, the lane scores cosines against the stored vectors, and fusion feeds those cosines to the meaning path and, when flagged, the exact rerank. After this phase nothing writes the tables or embeds a prompt; the lane, still called at 541, finds no prompt vector and returns an empty list in production, and the staleness probe and the status diagnostics keep reading whatever an older run left until phase 004 removes them and phase 004's `SCHEMA_VERSION` rule discards the tables.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The phase cut, by surface. "003" rows change here; every other row names the phase that owns it and why it cannot move earlier.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-server.ts` 23, 26, 398 to 411, 413, 444 to 468 | Embedder resolution and startup refresh | 003: delete; 413 keeps `await startupSkillGraphScan();` | REQ-001 grep prints nothing |
| `watcher.ts` 15, 494 to 520 | Refresh after each reindex | 003: delete the call; the reindex returns `indexSkillMetadata(skillsRoot)` | REQ-001 grep; `launcher-bootstrap.vitest.ts` passes |
| `scan.ts` 7, 54, 67 | Refresh on a trusted scan and the `embeddings` response field | 003: delete | `rg -n -i embed` on the file prints nothing |
| `skill-graph-db.ts` writers 107 to 112, 138 to 143, 726 to 729, 1296 to 1312, 1433 to 1788; imports 17, 24, 25, 40 | Vector writers, refresh switch, Ollama probe | 003: delete | REQ-002 grep and export count |
| `skill-graph-db.ts` readers `embeddingCoverage`, `tableExists`, `skillDescriptionForEmbedding`, `decodeEmbedding`, `loadSkillEmbeddings`, `appendCommandEmbeddingRows`, `readCommandEmbeddingSources`, `providerModelId`; DDL 224 to 300 and 364 to 500; imports 16, 18 to 23 | Read by `advisor-status.ts`, `lanes/semantic-shadow.ts`, `projection.ts` | 004: unchanged here | REQ-013 diff over the importers prints nothing |
| `advisor-recommend.ts` 27 to 30, 103 to 127, 508 to 528, 565, 601 to 618, 628 | Prompt embedding wrapper and its health reason | 003: delete; the call becomes direct | REQ-003 grep |
| `advisor-recommend.ts` 190 to 191 | Maps `cosine` evidence to `semantic_similarity` | 004: unchanged | Present after the phase |
| `fusion.ts` 32 (exact half), 77, 79, 80, 135 to 139, 169 to 172, 396 to 419, 1292, 1437 to 1439, 1450 to 1459 | Exact semantic rerank | 003: delete | REQ-004 grep |
| `fusion.ts` 863 to 959, 1092 to 1130, 1620 to 1628, 1635 | Command meaning path | 003: delete; the phrase anchor stays, one argument | REQ-005 grep; meaning-anchor and doctor-ordering tests pass |
| `fusion.ts` 32 (`scoreSemanticShadowLane`), 197 to 205, 299 to 315, 541, 1300 to 1304 | Lane call, lane multipliers, lane health | 004: unchanged | `native-scorer.vitest.ts` 116 still passes |
| `derive-command-bridges.cjs` 97 to 99, 125, 168 to 174, 687 to 717, 1335 to 1337, 1353 | Builds `embeddingText` | 003: delete, then regenerate | REQ-006 |
| `command-bridges.generated.json` | 47 `embeddingText` fields at HEAD, 46 after 002 | 003: regenerate, never hand-edit | `--check` fresh; drift guard passes |
| `scoring-compatibility.json`, generated blocks in `projection.ts`, `command-attach.ts`, `skill_advisor.py` | Bridge input and outputs | 002: regenerated there; 003's run must not change them | `git diff --stat` after T012 lists only the JSON |
| `capture-command-routing-baseline.mjs` `--real-embedding` | Live prompt embedding for a probe capture | 003: delete the mode; the fixture regime is unchanged | REQ-010; `command-routing-slice.vitest.ts` passes |
| Launcher 184 to 188 | Forwards the three feeder keys | 003: delete | REQ-007 `createChildEnv` prints `[]` |
| Launcher 163, CLI test utils 80, capture script 89 and 425 | `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, no reader | 004: unchanged here | Still present after the phase |
| Launcher 180 to 183 | Model-server keys | 005: unchanged | Still present after the phase |
| `skill-advisor-stress.yml` 49 to 50, CLI test utils 81 to 82 | Turn the refresh off in CI and in test daemons | 003: delete, the switch has no reader | REQ-007 grep |
| `projection.ts` 1381 to 1692, 1743, 1762 to 1763; `types.ts` 84 to 99, 113 to 114 | Staleness verdict from `vec_*` model ids | 004: unchanged | REQ-013 diff |
| `advisor-status.ts`, `schemas/advisor-tool-schemas.ts`, `tools/advisor-status.ts`, `skill-advisor-cli-manifest.ts`, `lane-registry.ts`, `lanes/semantic-shadow.ts`, `lib/embedders/` | Lane contract, lane module, embedder shims | 004: unchanged | REQ-013 diff |
| Seven feeder test files | Cover only removed feeders | 003: delete | `ls` fails on each |
| Nine mixed test files | Cover a removed feeder beside surviving code | 003: edit the cases that call a removed symbol | Each passes alone with its planned count |
| `semantic-shadow-ablation.vitest.ts` 44 and 297 to 305 | Asserts the removed rerank flag is off, by its literal env name | 003: delete, keeping 300; no case is removed | REQ-007 grep; the file lists 4 cases |
| The rest of `semantic-shadow-ablation.vitest.ts`, and `holdout-independent.vitest.ts` 95 | Opt-in lane ablation and the consumer list that names it | 004: unchanged, the pair moves together | Holdout ratchet passes |
| Runtime READMEs: command bridges 54 and 74, routing accuracy 134, scorer 56, tests 157 and 176, `tests/skill-graph/README.md` | Describe removed code or list deleted tests | 003: edit | REQ-012 |
| Catalog `background-vector-refresh.md` 44 | Names a deleted test in a SOURCE FILES table the validator checks at `tier=fail` | 003: delete the row | `validate_catalog_package.py` PASS |
| Catalog leaves `background-vector-refresh.md`, `command-meaning-matching.md`; `.env.example`, `ENV-REFERENCE.md`, `INSTALL-GUIDE.md`, `ARCHITECTURE.md`, `README.md`, changelogs | Prose about the removed features | 006 | Residue check lists them until 006 |
| `run-command-behaviour.mjs` 1014 | `OLLAMA_` prefix in an env scrub list | Not a feeder; 008's residue check decides | Unchanged |

Required inventories:
- Same-class producers: the Measured Behavior call-site pipeline lists all 11 feeder calls at HEAD; every one is deleted here.
- Consumers of changed symbols: each deleted export was grepped across `.skilled/`, `.github/` and the hooks with `dist/` excluded. Its consumers are the six source files above, the 16 test files above and the six docs above, plus prose phase 006 owns (the two catalog leaves, the `scorer-fusion/ablation.md` catalog leaf and playbook entry, `INSTALL-GUIDE.md`, the changelogs), `lib/embedders/README.md` for phase 004 and the trigger-index fixture `phrase-variants.json` for phase 007; nothing in `stress-test/`, `bench/`, `compat/`, the hooks or the Python scorer names one. `requireCommandPhraseAnchor` keeps two callers, `fusion.ts` 1622 and `doctor-ordering.vitest.ts`, which already call it with one argument.
- Matrix axes: feeder (refresh, prompt embed, exact rerank, meaning path, `embeddingText`, env keys) by surface (source, test, doc, CI); each cell is either deleted here or named above as another phase's.
- Algorithm invariant: a command row passes the anchor only with a positive `explicit_author` contribution; skill rows pass through unchanged. No ratchet result moves, because the meaning path acts only on `cosine:` evidence for a command row and the rerank only under `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK` with RRF on: under Vitest with no prompt embedding set the lane emits `shadow:test-fallback` evidence, and the only production fixture projections, the three in `advisor-validate.ts` 574 to 608, hold no command row. At weight 0 the removed wrapper only stored `lane_weight_zero`, which neither the lane-health merge nor the warning acts on.

Score baseline files for REQ-009: `R/scripts/routing-accuracy/scorer-eval-baseline.json`, `R/scripts/routing-accuracy/command-routing-baseline.json`, `R/tests/parity/fixtures/local-native-approved-divergences.json`, `R/scripts/routing-accuracy/labeled-prompts.jsonl`, `R/scripts/routing-accuracy/holdout-prompts.jsonl`, `R/scripts/routing-accuracy/ambiguity-prompts.jsonl`, `R/scripts/routing-accuracy/command-prompts.jsonl`, `R/scripts/fixtures/gate2-golden-prompts.jsonl` and `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reprints the Measured Behavior numbers at the phase's start commit, which must be phase 002's, reads the 001 and 002 baselines and records the case counts of every test file the phase touches. Implementation deletes the feeders source by source, then the generator code with a regeneration, the capture mode, the launcher and CI keys, the seven feeder tests, the edits to nine tests and the six docs. Verification runs typecheck, `npm test`, the clean build, the five ratchet files, the corpus gate, the bridge check, the bin launcher test, the sk-doc and catalog checks and the link check, then the greps and the boundary diff. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each edited test file alone, with its planned case count, and `node --check` on the generator, the capture script and the launcher | `npx vitest run <file>` in `R/`, `npx vitest run --config vitest.config.bin.ts <file>` in `.skilled/`, `node --check` |
| Integration | The advisor suite, typecheck and clean build; the four CI routing ratchets and the command-routing slice; the corpus gate; the bridge check and drift guard; the sk-doc script tests, the catalog validator and the link check | `npm test`, `npm run typecheck`, `npm run clean && npm run build`, `npx vitest run <ratchets>`, `score-routing-corpus.py`, `derive-command-bridges.cjs --check`, `run-script-tests.sh`, `validate_catalog_package.py`, `check-markdown-links.cjs` |
| Manual | Read the rewritten `requireCommandPhraseAnchor` and the recommend call site, and diff the regenerated JSON to see only removed `embeddingText` lines | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 committed | Internal | Yellow | The bridge JSON would carry both phases' changes; 002 is planned, not built |
| `derive-command-bridges.cjs` | Internal | Green | REQ-006 cannot be met without a regeneration |
| Advisor runtime `node_modules` and the built shared dist | Internal | Green | Typecheck, vitest and the ratchets cannot run |
| `python3` | External | Green | The corpus gate cannot run |
| Phase 001's recorded gate baselines | Internal | Yellow | REQ-008 is measured against the start commit; 189 files and 2523 cases hold only when that commit matches 001's 196 files, 2570 passed and 8 skipped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate stays red after three fix rounds, or a ratchet or score baseline file moves, which is a goal D2 finding and never a reason to recapture.
- **Procedure**: `git revert` the phase commit, which restores the feeders, the seven tests and the 46 `embeddingText` fields together; then `derive-command-bridges.cjs --check` must print `"status":"fresh"` and `git grep -c '"embeddingText"'` on the JSON must print 46.
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
| Setup (start commit, baselines, case counts) | Phase 002 committed | Implementation |
| Implementation (source, generator, script, launcher, tests, docs) | Setup | Verification |
| Verification (gates, ratchets, greps, boundary diff, validate) | Implementation | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Setup     │────►│ Source feeders   │────►│ Tests edited │
│ start SHA   │     │ server, watcher, │     │ and deleted  │
│ baselines   │     │ scan, store,     │     └──────┬───────┘
└─────────────┘     │ recommend, fusion│            │
                    └────────┬─────────┘     ┌──────▼───────┐
                    ┌────────▼─────────┐     │   Verify     │
                    │ Generator, regen,│────►│ gates and    │
                    │ capture, launcher│     │ ratchets     │
                    │ CI, docs         │     └──────────────┘
                    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source feeders | Setup | Six source files with no feeder | Tests, Verify |
| Generator and regeneration | Setup | A bridge JSON with no `embeddingText` | Drift guard edit, Verify |
| Capture, launcher, CI, docs | Setup | No forwarded feeder key, no live capture mode, accurate docs | Verify |
| Tests | Source feeders, generator | Seven files gone, nine files passing | Verify |
| Verify | All of the above | Gate results in `implementation-summary.md` | Phase 004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Source feeders in six files, `fusion.ts` and `skill-graph-db.ts` first** - about 90 minutes - CRITICAL
2. **Test deletions and edits, the meaning-anchor rewrite first** - about 60 minutes - CRITICAL
3. **Gates: `npm test`, the clean build, five ratchet files and the corpus gate** - about 30 minutes - CRITICAL

**Total Critical Path**: about 3 hours

**Parallel Opportunities**:
- The generator change with its regeneration and the capture-script change can run beside the source edits
- The launcher, CI and doc edits can run after Setup, apart from the source work
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Start state confirmed | T001 reprints 11 call sites, 46 `embeddingText` fields, three forwarded keys, `"doctorRoutes":35` and the ratchet counts at phase 002's commit | Setup |
| M2 | Feeders gone, compiler green | The call-site pipeline prints nothing and `npm run typecheck` exits 0 | Implementation |
| M3 | Phase ready | Every gate in `tasks.md` Phase 3 passes and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Cut by ownership, with a two-trigger fallback

**Status**: Accepted

**Context**: Research 5.2 makes step 2 a recommendation and says that if the compiler rejects the split, steps 2 and 3 merge. The advisor's tsconfig chain sets no `noUnusedLocals`, so exports this phase leaves without callers do not fail typecheck. Typecheck also excludes `tests/` and every `.cjs` and `.mjs`, so it cannot judge a test-level split on its own.

**Decision**: This phase deletes every writer and caller of the lane's vectors and keeps every symbol a 004-owned file imports: the vector readers in `skill-graph-db.ts`, the whole lane module, the staleness check, the status handler and the registry row. The fallback has two triggers. A typecheck, build or test error whose only fix is an edit to a 004-owned file merges this phase into phase 004's commit under 004's plan, recorded in both goal logs, and never lands 003 alone. A ratchet that fails or a score baseline file that changes is a goal D2 finding: the phase halts, nothing is recaptured and nothing merges.

**Consequences**:
- `lanes/semantic-shadow.ts` keeps `withSemanticShadowPromptEmbedding` and `scoreSemanticShadowExactSubset` with no production caller for one commit, and `readCommandEmbeddingSources` keeps reading an `embeddingText` field the JSON no longer has, so it returns an empty list.
- `node --check` on the three edited scripts and the per-file test runs cover what typecheck cannot see.

**Alternatives Rejected**:
- Merge 003 and 004 up front: a single commit of about 60 files with the lane type change mixed into the feeder removal, and no checkpoint where the ratchets prove the feeders were routing-neutral.

### ADR-002: The lane call at `fusion.ts` 541 stays with phase 004

**Status**: Accepted

**Context**: Goal criterion 3 says `fusion.ts` computes and reads no vector. The lane scorer it calls at 541 builds 32-wide stand-in vectors and reads stored skill vectors on a fixture projection, which `advisor-validate.ts` and the test regime use, while on a sqlite projection with no prompt vector it returns an empty list before any read. `native-scorer.vitest.ts` 116 asserts a non-zero `semantic_shadow` rawScore through `scoreAdvisorPrompt`, and that test is in research iteration 1 F6's lane-key list for phase 004.

**Decision**: Keep 541 and its `scoreSemanticShadowLane` import. `spec.md` section 3 defines "compute or read a vector" as an embedder call, a model probe, a pointer write or a stored embedding value read, decoded or written, and the REQ-001, REQ-004 and REQ-005 greps test that definition over the five feeder files.

**Consequences**:
- The call that remains is the lane itself, which phase 004 deletes with the registry row it depends on.
- The test regime's shadow channel, which `_shadow` recommendations and `native-scorer.vitest.ts` read, is unchanged, so no 004-owned test moves here.

**Alternatives Rejected**:
- Remove 541 here: it changes every lane contribution in the test regime and forces an edit to a 004 test, which is the fallback's merge trigger.

### ADR-003: "Lane env key" means the three feeder keys

**Status**: Accepted

**Context**: Goal criterion 4 says the launcher forwards no lane env key. Research 5.2 and iteration 5 F3 name "the launcher's three forwarded keys" for this step. The launcher also forwards `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` at 163, which has no reader and which the parent assigns to phase 004 at every site, and four model-server keys at 180 to 183, which configure the server phase 005 deletes.

**Decision**: Delete 184 to 188 here and test it with the `createChildEnv` command, which must print `[]`. Leave 163 to 004 and 180 to 183 to 005; REQ-013 checks they are still present.

**Consequences**:
- An `includeSemanticHealth` status call made before phase 004 probes the default Ollama URL, since the daemon no longer receives `OLLAMA_BASE_URL`.

**Alternatives Rejected**:
- Remove 163 here: it splits the dead flag across two phases and leaves 004 a partial site list.

### ADR-004: The two catalog leaves stay for phase 006, except one row

**Status**: Accepted

**Context**: Research iteration 5 F3 puts `background-vector-refresh.md` and `command-meaning-matching.md` in this step, while the parent phase map gives skill docs to phase 006 and this phase's scope boundary is the advisor runtime. `validate_catalog_package.py` checks that every SOURCE FILES path exists and runs the advisor package at `tier=fail` in CI; `background-vector-refresh.md` 44 names `refresh-in-background.vitest.ts`, which this phase deletes.

**Decision**: Delete only row 44 here. The two leaves, their root catalog entries and their leaf manifest change in phase 006.

**Consequences**:
- Two catalog leaves describe removed features for three phases, and the residue check lists them until 006.
- No leaf manifest or root catalog edit lands here.

**Alternatives Rejected**:
- Delete both leaves here: it brings the root catalog, inbound links and the leaf manifest into a runtime phase whose gates do not include them.

### ADR-005: Delete a test whose subject is a removed feeder, edit a mixed one

**Status**: Accepted

**Context**: Research step 2 takes "the tests dedicated to these" and step 3 takes "all remaining lane tests". Some files cover a removed feeder beside lane code that survives until 004.

**Decision**: Delete the seven files whose every case exercises a removed feeder or the plumbing that only reports it. In the nine mixed files, delete only the cases that call a removed symbol and keep the rest for 004. The surviving `withSemanticShadowPromptEmbedding` and `scoreSemanticShadowExactSubset` keep no dedicated test for one commit, a named gap that closes when 004 deletes them.

**Consequences**:
- 55 cases go: 36 in the deleted files and 19 in the edited ones (1 cosine, 1 coverage, 2 conflict, 15 meaning anchor).
- The weight-zero stale-projection behavior keeps coverage through `semantic-shadow-ablation.vitest.ts` 407 and `projection-embedding-staleness.vitest.ts`.

**Alternatives Rejected**:
- Delete every lane test here: it removes coverage of code that still runs until 004.
