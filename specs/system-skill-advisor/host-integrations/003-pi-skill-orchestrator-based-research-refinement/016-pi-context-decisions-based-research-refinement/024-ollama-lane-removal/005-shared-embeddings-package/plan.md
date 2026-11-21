---
title: "Implementation Plan: Phase 5: shared-embeddings-package"
description: "Edit shared/types.ts first and clean shared/dist, then delete the shared embeddings package, chunking and retry, the HF model server, its supervision and every test and caller, regenerate three lockfiles offline, and prove every build and test still passes, all in one commit. npm ci waits for the conductor's yes; a gate that needs a phase 004 edit merges 004 and 005."
trigger_phrases:
  - "shared embeddings package plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: shared-embeddings-package

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (the `@spec-kit/shared` package, built by `tsc --build`), the CommonJS launcher and IPC bridge, Node test scripts, Bash (the orphan sweeper, the advisor `doctor.sh`), Python 3 (one sk-doc test), YAML (CI workflows and the doctor routes), JSON lockfiles and baselines, Markdown |
| **Framework** | The spec-kit npm workspace (`shared`, `runtime`, `runtime/cli`), the advisor runtime package, the deep-loop skill-root package, npm 11 lockfile version 3 |
| **Storage** | None changes. The untracked `shared/dist/` is cleaned and rebuilt |
| **Testing** | `node --test` in `shared/`, Vitest in the spec-kit runtime and CLI, the advisor runtime and `.skilled/bin`; the doctor `run-all.sh`; the sk-doc script tests; the link, leaf manifest, mirror and gate-input checks |

### Overview
`shared/types.ts` is the one file outside the package that imports from it, so it is edited first: its line 5 import and the five type sections that only the package, `chunking.ts` and `utils/retry.ts` use. A scratch compile at `0c2ab52b3b3` showed that edit leaves errors only in the files deleted next and that the package compiles cleanly once they go. `shared/dist` is cleaned while the sources still exist, so the rebuild cannot keep a compiled copy that would hide a forgotten importer. Then the package, the two helpers, the model server, its supervision, the sidecar allowlist and 25 test files with nine support files go, and every caller the greps in `spec.md` found is edited: the launcher, the IPC bridge, the doctor orphan check, the sweeper, the sk-doc validator's four callers, the router, three package manifests, three lockfiles and 22 workflows. Every range was re-read at `0c2ab52b3b3`; phases 003 and 004 move launcher and test lines first, so `tasks.md` names the symbol beside each number.
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
- [ ] In `K/shared`, `npm run build` and `npm test` (9 files, 9 passed); in `K/`, `npm run typecheck`, `npm run build`, `npm test` (runtime 18 files and 147 cases fewer) and `npm --prefix runtime/cli run check`; in `R/`, `npm run typecheck`, `npm test` (1 file and 18 cases fewer), `npm run clean && npm run build` and the stress suite (21 files, 65 passed); `run-all.sh` (7 suites); `run-script-tests.sh`; the bin vitest suite; the bridge, mirror, link, leaf and gate-input checks; and, after the conductor's yes, `npm ci` in three packages
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Leaf-first deletion behind a compile proof: shrink the one shared type file, delete the leaves, then follow every caller the greps name.

### Key Components
- **Shared package** (`K/shared/`): `types.ts` re-exports the embedding, retry, chunking, profile-slug and task-prefix types and imports `HfLocalDtype` from the package. Sections 3 (folder scoring), 5 (trigger extractor) and 6 (path security) stay; section 3 has no reader either, but it is not this phase's. `package.json` exports `./*` as `./dist/*.js`, so there is no export or `tsconfig` row to remove; the build is `tsc --build`, which never deletes an output whose source is gone.
- **Launcher and IPC bridge** (`B/system-skill-advisor-launcher.cjs`, `B/lib/launcher-ipc-bridge.cjs`): the launcher loads the supervision module, arms a demand listener, pins the model server to the advisor database and forwards `MEMORY_DB_PATH` and `HF_EMBED_SERVER_URL` to its child. The bridge, which the residue check's machine mode loads for `resolveIpcSocketDir`, also carries the model server's HTTP health probe; it requires only Node core modules.
- **Doctor and sweeper** (`D/scripts/orphan-process-check.cjs`, `.skilled/scripts/orphan-mcp-sweeper.sh`): the only code besides the residue check that recognizes a running `hf-model-server.cjs`. Their model-server class goes with the server; the sweeper's `ollama-preserve` guard stays under decision Q005.
- **sk-doc validator** (`sk-doc/scripts/validate-doc-model-refs.js`): reads `registry.ts` as text for its canonical model names and has no other source, so it goes with the package, with its CI step, switch-test row, typo-flag case and README row.
- **Manifests and lockfiles** (`K/package.json`, `R/package.json`, three `package-lock.json`): `@huggingface/transformers` is a spec-kit dev dependency and an advisor dependency. The deep-loop lockfile still lists it under its `file:` link to `shared`, a stale row the regeneration drops.

### Data Flow
Today a launcher with `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1` loads the supervision module, starts `hf-model-server.cjs` on demand, writes `supervisesModelServer` into its owner lease, and hands its child `HF_EMBED_SERVER_URL` and `MEMORY_DB_PATH`, which the shared factory and `hf-local.ts` read. After phase 004 nothing in the child reads either key. After this phase the launcher starts only the daemon child, forwards neither key, writes a lease without the supervision field, and the bridge answers only daemon probes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The phase cut, by surface. "005" rows change here; every other row names the phase that owns it and why it cannot move into this commit.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `K/shared/types.ts` 5, sections 1, 2, 4, 7, 8 | Types only the package and the two helpers use | 005: delete first | The T005 compile lists only files T006 deletes |
| `K/shared/embeddings/`, `chunking.ts`, `utils/retry.ts`, six shared tests | The package and its two helpers | 005: delete | REQ-001, REQ-002 |
| `K/shared/dist/` | Untracked compiled output, incremental | 005: `tsc --build --clean` before the deletion | T006 and T042 dist checks |
| `env-reader-table.mjs` `GROUPS`, `K/shared/README.md` and three shared READMEs | Describe or name the deleted modules | 005: edit; regenerate the env table | `--check` line, T008 and T009 greps |
| `B/hf-model-server.cjs`, `B/lib/model-server-supervision.cjs`, `B/lib/sidecar-env-allowlist.cjs` | Server, supervision, an allowlist with no requirer | 005: delete | REQ-003 |
| Launcher model-server section, loader, lease field, allowlist keys, `MEMORY_DB_PATH` forwarding, exports | Starts and supervises the server | 005: delete | REQ-004 |
| `B/lib/launcher-ipc-bridge.cjs` `probeModelServer` and two constants | The server's health probe | 005: delete; keep the file | REQ-005 |
| 27 files under the spec-kit runtime tests, `R/tests/launcher-model-server-default.vitest.ts` | Cover only deleted code | 005: delete | REQ-006, REQ-007 counts |
| Bridge probe, sweeper, bootstrap, CLI utils, memory-pipeline and memory-residue tests | Mixed coverage | 005: edit, each alone with its planned count | T019, T020, T015, T016, T023, T024 |
| Orphan check class, its test, three doctor doc lines, `_routes.yaml` 388, two fixture rows, the digest | Recognize and describe the server | 005: delete, regenerate the bridges, re-pin | REQ-009 |
| `orphan-mcp-sweeper.sh` 216, 462, 463, 467, 496, 504 and the allowlist row | Classify the server | 005: delete; keep 491 | REQ-010 |
| `validate-doc-model-refs.js` and its four callers | Reads `registry.ts` | 005: delete | REQ-011 |
| `embedder-pluggability.md`, `ROUTER.md` 46 and 243, `memory-system.md` 256, leaf manifest and aliases | A routed doc about the deleted stack | 005: delete and regenerate | REQ-012 |
| Two `package.json` rows, three lockfiles, `doctor.sh` import check | Ship the dependency | 005: delete, regenerate offline | REQ-008 |
| `onnxruntime-node` setting in 22 workflows | Tunes an install no lockfile has afterwards | 005: delete | REQ-013 |
| `node_modules` in three packages | Installed tree | 005: `npm ci` after the conductor's yes | REQ-014 |
| `.env.example`, `ENV-REFERENCE.md`, `environment-variables.md`, `ARCHITECTURE.md`, `db-path-policy.md`, `daemon-lease-contract.md`, the sweeper catalog leaf, two playbook entries, every changelog, README frontmatter | Prose about the stack | 006 | REQ-015 boundary diff |
| Trigger index, `phrase-variants.json`, `corpus-manifest.json`, `generation-diagnostics.json` | Generated from the tree | 007 | REQ-015 boundary diff |
| `sweep-lane-residue.mjs`, its test, the cleanup tool, allowlist rows for non-lane matches | Find and clean residue | 008 | Unchanged here; REQ-008 relies on it |
| Advisor runtime lane code, `lib/embedders/`, the symlink | The lane core | 004 | T001 checks it is gone before this phase starts |

Required inventories:
- Same-class producers: every file that names the package path, the server, the supervision module, the sidecar allowlist, `@huggingface/transformers`, `validate-doc-model-refs`, `chunking.ts` or `utils/retry.ts` was listed with `git grep HEAD -- ':!specs'`; the combined pattern in the session scratchpad matched 118 files. Each is deleted or edited here, owned by 004, 006, 007 or 008 above, or is a historical benchmark report under `sk-doc/benchmark/reports/`, which records a past run's stderr and is left as a record.
- Consumers of changed symbols: `probeModelServer` and `DEFAULT_MODEL_SERVER_LOADING_MAX_MS` have no caller outside the supervision module and the bridge probe test; `buildLeaseObject` has none outside the bridge probe test; `sidecar-env-allowlist.cjs` has no requirer; the launcher's four model-server exports are read only by `launcher-bootstrap.vitest.ts` and `launcher-model-server-default.vitest.ts`; no type removed from `types.ts` is imported anywhere else (`RetryOptions` in `skill-advisor-cli.ts` 133 is a local interface); `MEMORY_DB_PATH` has no code reader once `factory.ts` and `hf-local.ts` go (`config.ts` reads only `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR`). No removed lockfile package is imported by any source under the spec-kit, advisor, deep-loop or bin trees. No CI workflow names a deleted test.
- Matrix axes: artifact (package module, helper, server, supervision, launcher control, bridge probe, process class, validator, routed doc, dependency, install setting) by surface (source, test, doc, manifest, lockfile, workflow, generated); each cell is deleted here or owned by a named phase.
- Algorithm invariant: a deletion that leaves the compiler, every suite and every generator check green with deltas equal to the deleted cases changes no surviving behavior. The one behavior edit outside deleted code is the launcher allowlist, which only shrinks; the one routing input edit is the `_routes.yaml` phrase, guarded by the ratchets and the held-out bar.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: confirm phase 004 is committed, record the start commit `S`, reprint the Measured Behavior numbers and baseline every gate, and clean `shared/dist` while the sources exist.
- **Implementation**: edit `shared/types.ts`, then delete the package, the helpers, the server, the supervision and their tests, and edit every caller, manifest, lockfile, workflow and code-folder README in the order `tasks.md` gives.
- **Verification**: run every build, test, generator and doc gate from the final tree, the goal greps and the residue check, then `npm ci` after the conductor's yes, and validate the packet.

The ordered work and each task's verify command are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each edited test file alone with its planned count; `node --check`, `bash -n` and `python3 -m py_compile` on each edited script; the D1 compile before and after the deletion | `npx vitest run <file>`, `node --test <file>`, `tsc --noEmit --composite false` |
| Integration | The shared, spec-kit, advisor and bin suites, the advisor stress suite, the three parity ratchet files and the command-routing slice, `run-all.sh`, `run-script-tests.sh`, the bridge, mirror, link, leaf, root-metadata and gate-input checks, the residue check in repo and machine mode | `npm test`, `npm run build`, `npm run typecheck`, `npm --prefix runtime/cli run check`, the commands in `tasks.md` Phase 3 |
| Manual | Read the launcher's `createChildEnv` and lease builder after the edit; confirm the lockfile diffs only remove entries; `npm ci` in three packages after the conductor's yes | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 committed | Internal | Yellow | Fourteen advisor files still import the package; 004 is planned, not built |
| Phase 004's recorded advisor `npm test` totals | Internal | Yellow | REQ-007's 177 files and 2438 hold only when the start commit records 004's expected 178 and 2456 |
| npm cache with every tarball the regenerated lockfiles name | External | Green | The offline regeneration already succeeded in scratch; `npm ci --offline` needs the same cache |
| The conductor's yes for `npm ci` | Internal | Green | Goal criterion 3 stays Unmet; every other gate can still run |
| Phases 001 and 002 gate baselines | Internal | Green | The stress, run-all and residue numbers come from them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate stays red after three fix rounds; a ratchet, the command-routing slice, the held-out bar or a score baseline file moves, which is a halt and never a recapture; `npm ci` fails; or a gate needs a 004-owned edit, which is ADR-012's merge.
- **Procedure**: before the commit, `git restore --staged --worktree` over the changed paths restores every tracked file, and `npm run build` in `K/shared` rebuilds the cleaned dist. After the commit, `git revert` the phase commit restores the package, the server, the lockfiles and the tests together. If `npm ci` already ran, run `npm ci --offline` again in `R/`, `K/` and `.skilled/skills/system-deep-loop/` after the revert; it restores the removed packages from the npm cache, and a cache miss that needs a download is its own stop-for-yes.
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
| Setup (start commit, baselines, dist clean) | Phase 004 committed | Implementation |
| Implementation (types, deletions, callers, manifests, lockfiles, workflows, READMEs) | Setup | Verification |
| Verification (builds, tests, generators, greps, residue, `npm ci`, validate) | Implementation | Phase 006 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Setup     │────►│ types.ts edit,   │────►│ Callers: launcher│
│ start SHA   │     │ then delete the  │     │ bridge, doctor,  │
│ dist clean  │     │ package, helpers,│     │ sweeper, sk-doc, │
└─────────────┘     │ server, tests    │     │ router, READMEs  │
                    └────────┬─────────┘     └────────┬─────────┘
                    ┌────────▼─────────┐     ┌────────▼─────────┐
                    │ Manifests, three │────►│ Verify: builds,  │
                    │ lockfiles, CI    │     │ tests, greps,    │
                    │ workflows        │     │ npm ci after yes │
                    └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `types.ts` edit | Setup | A types file that compiles once the package goes | Deletions |
| Deletions | `types.ts` edit | No package, helper, server or supervision file | Callers, Verify |
| Callers and READMEs | Deletions | No live reference to a deleted file | Verify |
| Manifests, lockfiles, workflows | Setup | No dependency row or install setting for the stack | `npm ci`, Verify |
| Verify | All of the above | Gate results in `implementation-summary.md` | Phase 006 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **`types.ts` edit, the deletions, the launcher and the bridge** - about 60 minutes - CRITICAL
2. **Test edits, the doctor class, the bridge regeneration and the held-out re-pin** - about 60 minutes - CRITICAL
3. **Gates: shared, spec-kit and advisor builds and tests, stress, `run-all.sh`, the sk-doc suite** - about 45 minutes - CRITICAL

**Total Critical Path**: about 2.75 hours, plus the wait for the conductor's yes on `npm ci`

**Parallel Opportunities**:
- The lockfile regeneration, the workflow edits and the sk-doc validator removal can run beside the shared and launcher work
- The README edits and the two README baselines can run after the deletions, apart from the test edits
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Start state confirmed | T001 finds no advisor importer and T002 reprints 14 package files, both dependency rows, the four server and helper paths and the sweeper's guard at phase 004's commit | Setup |
| M2 | Shared compiles without the package | T005 lists errors only in files T006 deletes, and T006's compile exits 0 | Implementation |
| M3 | Phase ready | Every gate in `tasks.md` Phase 3 passes, `npm ci` exits 0 after the conductor's yes, and `validate.sh --strict` prints `RESULT: PASSED` | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One commit, cut by ownership; code-folder READMEs follow their code

**Status**: Accepted

**Context**: Research 5.2 step 4 names the package, the server, the launcher supervision, the orphan check class, the sk-doc validator, the dependency and the lockfiles, with shared and spec-kit builds and tests, the advisor clean build, `run-all.sh`, the sk-doc tests and `npm ci` as its gate. The parent gives prose, identity files and changelogs to 006, generated surfaces to 007 and the residue check's wiring to 008. A deleted file breaks the link check, the leaf manifest, the README baselines and the env-table test wherever a doc names it.

**Decision**: Everything that compiles, tests, installs, starts or classifies the stack changes here, together with the README of each code folder this phase changes (body only) and every link, index row or baseline a deleted file would otherwise break. README frontmatter, skill references other than the deleted `embedder-pluggability.md`, `.env.example`, catalog and playbook prose and changelogs stay for 006; generated indexes for 007.

**Consequences**:
- The commit is large, 127 files, 55 of them deletions.
- Prose that names the model server or its keys stays wrong for one phase, and the residue check lists it until 006.

**Alternatives Rejected**:
- Leave the code-folder READMEs for 006: their tree diagrams and rows would describe files that do not exist, and three of them link into deleted files, which the link check rejects.

### ADR-002: Edit `shared/types.ts` first and clean `shared/dist` before the deletion

**Status**: Accepted

**Context**: Goal decision D1 requires the `types.ts` edit to land before the package is deleted. `types.ts` 5 imports `HfLocalDtype` from `./embeddings/types.js`; sections 1, 2, 4, 7 and 8 are used only by the package, `chunking.ts` and `utils/retry.ts`. `shared/dist` is untracked and built incrementally by `tsc --build`, which keeps outputs whose sources are gone, and `package.json` exports `./*` as `./dist/*.js`, so a stale `dist/embeddings/factory.js` keeps resolving for any importer the greps missed. `factory-auto-resolution.vitest.ts` imports exactly that path today.

**Decision**: Inside the one commit, run `tsc --build --clean` in `K/shared` while the sources still exist, then edit `types.ts`, run the compile that must fail only in files about to go, then delete them and compile again. Verify after the rebuild that `dist/embeddings`, `dist/chunking.js` and `dist/utils/retry.js` do not exist.

**Consequences**:
- The order is provable from two compile outputs, and the scratch run at `0c2ab52b3b3` already showed both.
- T006 rebuilds the shared package right after the deletion, so no later task runs against an empty `dist`; between T004 and T006 nothing resolves `@spec-kit/shared` through its export.

**Alternatives Rejected**:
- Two commits, `types.ts` first: the scratch compile shows a commit holding only the `types.ts` edit fails `tsc` in the nine package and helper files, so it would break the shared build at that commit; D1 can only mean order inside the one commit.
- `rm -rf shared/dist`: removes the same files, but `--clean` is the build tool's own contract and deletes nothing it did not produce.

### ADR-003: Delete `chunking.ts`, `utils/retry.ts` and their type sections with the package

**Status**: Accepted

**Context**: Goal decision D2 and decision Q007 delete both helpers with the package. Neither has a production importer outside it. Their tests are `shared/tests/chunking.test.ts`, `retry.test.ts` and `runtime/tests/chunking-semantic.vitest.ts`; their docs are rows in three READMEs.

**Decision**: Delete both files, their three tests, the retry and chunking type sections, and their README rows. Leave section 3 (folder scoring), which has no reader either but belongs to no part of this stack.

**Consequences**:
- `shared/` loses its retry policy; a future caller that needs one writes it against its own need.

**Alternatives Rejected**:
- Keep the helpers as general utilities: no caller exists, and D2 is frozen.

### ADR-004: Stop forwarding `MEMORY_DB_PATH` and drop `SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH`

**Status**: Accepted

**Context**: Phase 004 left this question here. The launcher computes `MEMORY_DB_PATH` for its child from `SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH` or `advisorDbPath()` (332 to 344) so the shared factory would open the advisor's own database. The only code readers are `factory.ts` 239 and 384 and `hf-local.ts` 362. The advisor runtime reads it nowhere outside tests, and `config.ts` reads only `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR`.

**Decision**: Delete the forwarding, the allowlist key at 197 with its comment, the bootstrap cases that test the forwarding (196, 205, 231) and the CLI test utils' `memoryDbPath`, and recast the ambient-path case at 217 into one that passes all three retired keys and asserts the child receives none of them. Keep `advisorDbPath()`, which the launcher's status output and the bootstrap tests still read.

**Consequences**:
- The child environment loses two keys; nothing reads them.
- The bootstrap file drops from 19 cases to 14.

**Alternatives Rejected**:
- Keep the forwarding as harmless: it would keep a key whose only stated purpose is a deleted factory, and keep its allowlist key alive.

### ADR-005: Keep `launcher-ipc-bridge.cjs`, delete only its model-server probe; delete the sidecar allowlist

**Status**: Accepted

**Context**: The residue check's machine mode loads the bridge for `resolveIpcSocketDir` (`sweep-lane-residue.mjs` 733), and the bridge requires only Node core modules, so nothing this phase deletes is imported by it. Its `probeModelServer`, `parseHttpJsonResponse`, `DEFAULT_MODEL_SERVER_LOADING_MAX_MS` and `MODEL_SERVER_HEALTH_PATH` serve only the supervision module. `lib/sidecar-env-allowlist.cjs` has no requirer at all and describes the embedding sidecar.

**Decision**: Delete those four from the bridge with their two exports, and the three bridge probe cases that test them. Delete `sidecar-env-allowlist.cjs` and its README rows.

**Consequences**:
- The bridge keeps every daemon export; the advisor CLI, the hooks fallback, the session proxy and the residue check are unaffected.

**Alternatives Rejected**:
- Leave the probe in the bridge: dead code that reads `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS`.

### ADR-006: Remove the sweeper's model-server lines and add its allowlist row here

**Status**: Accepted

**Context**: `orphan-mcp-sweeper.sh` classifies `hf-model-server.cjs` at 216, describes the embedder sidecar at 462 and 463, matches `hf-embed.sock` at 467 and covers the model server under its launcher at 496 and 504. Line 491 keeps a running Ollama process from being reaped, a guard decision Q005 keeps with an exact-path allowlist row. The residue check matches `ollama` there, so the file stays live until the row exists.

**Decision**: Delete or reword the five model-server lines here, beside the server they classify, and add the allowlist row whose reason names only the guard. Delete the sweeper test case at `orphan-sweeper-temp-path.vitest.ts` 185.

**Consequences**:
- After this phase the sweeper names the lane only in its guard, and repo mode counts it as allowlisted.

**Alternatives Rejected**:
- Leave the lines for 006: they are code that classifies a process this phase deletes, not prose, and the row would then exempt a file that still holds model-server terms.

### ADR-007: Remove the orphan check's model-server class, its route phrase and two fixture rows, and re-pin the held-out digest

**Status**: Accepted

**Context**: Phase 002's ADR-002 left the class, its test, three doc lines, the `_routes.yaml` phrase and the `tune.jsonl` 60 and `heldout.jsonl` 48 rows to this phase, with a bridge regeneration and a digest re-pin. The held-out set is pinned by sha256 so tuning cannot move its bar. Row 48 asks which variable turns off the model server; the matcher ranks it first today.

**Decision**: Delete the class and its test rows, retitle the classify case, keep the shell-text case with its other two assertions, and check table alignment against `stale-advisor-launcher`. Change the route phrase to "helper process still running after the session closed", regenerate the bridge outputs with the generator, delete both fixture rows, and re-pin `HELDOUT_SHA256` to `4b90f1fa6ec1df05f3bbfa56face73f85d32e0df3fa3e7ce3edeeeb6a27ec45c` with a comment that says the prompt left because its subject was removed.

**Consequences**:
- Top-1 moves from 0.854 to 0.851 and top-3 from 0.917 to 0.915, both still above the bar, so the re-pin cannot be read as tuning in the matcher's favor.

**Alternatives Rejected**:
- Keep row 48 with a new expected answer: no doctor command answers it once the variable is gone.

### ADR-008: Delete `embedder-pluggability.md` and `validate-doc-model-refs.js`

**Status**: Accepted

**Context**: Research 4.1 deletes `embedder-pluggability.md` whole; it is the one routed spec-kit reference about the stack, it names `@huggingface/transformers` at 59 (goal criterion 4) and links into the package at 251 to 253. `ROUTER.md` routes `RETRIEVAL_TUNING` to it and `trigger-config.md`. The validator reads `registry.ts` as its only canonical source.

**Decision**: Delete the doc, drop it from `ROUTER.md` 46 and 243 so `RETRIEVAL_TUNING` loads `trigger-config.md` alone, delete `memory-system.md` 256, and regenerate the leaf manifest and aliases with `ci-skill-root-metadata.cjs --fix --skill system-spec-kit`. Delete the validator with its CI step, its switch-test row (`GUARDED_COUNT` 20 to 19), its typo-flag case and its README row.

**Consequences**:
- `advisory-checks.yml` keeps three report-only steps; its job name still mentions doc-model references (spec Out of Scope).

**Alternatives Rejected**:
- Keep the validator with an empty canonical set: it would pass vacuously and keep a CI step that checks nothing.

### ADR-009: Regenerate the lockfiles offline; keep the overrides; `npm ci` is a stop-for-yes

**Status**: Accepted

**Context**: Goal criterion 3 requires `npm ci` to exit 0 in every package whose lockfile changed. `npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund` rewrites only `package-lock.json`, installs nothing and uses no network; in scratch copies it exited 0 for all three packages and removed 78, 72 and 0 entries with none added, and only the root entries changed among the kept ones. `npm ci` deletes and reinstalls `node_modules`, which are real folders in this worktree, and runs install scripts (`better-sqlite3`, `esbuild`, two `postinstall` hooks whose outputs are gitignored). Every darwin-arm64 tarball the new lockfiles name was found in the npm cache. The `sharp`, `protobufjs`, `@protobufjs/utf8` and `tar` overrides now apply to nothing.

**Decision**: Regenerate with the offline command in `R/`, `K/` and `.skilled/skills/system-deep-loop/`. Keep the four overrides. [DEVIATION: the conductor deferred `npm ci` to the operator, because an install is a stop-for-yes the run could not get while unattended; the lockfile-only regeneration installs nothing and stays in this phase.] Run `npm ci --offline --no-audit --no-fund` in the same three folders only after the conductor says yes, with the rollback in section 7.

**Consequences**:
- The lockfile step never needs the network; `npm ci` is expected not to, but it has not been run.
- The advisor launcher does not reinstall on its own: `installedTreeMatchesLockfile` checks only that every locked package is installed at its version, and a lockfile that only lost entries still matches the old tree.

**Alternatives Rejected**:
- Remove the overrides: they pin known-vulnerable transitive versions if any of these packages comes back, and removing them is a policy change outside this phase.
- Run `npm install` instead of the lockfile-only command: it installs, which is the stop-for-yes this plan keeps for `npm ci`.

### ADR-010: Remove the `onnxruntime-node` install setting from 22 workflows

**Status**: Accepted

**Context**: Twenty-two workflows set `ONNXRUNTIME_NODE_INSTALL_CUDA: skip` in a four-line top-level `env:` block whose comment says every model load runs on the CPU. `onnxruntime-node` appears only in the advisor and spec-kit lockfiles, and both lose it here. `onnxruntime` is not a residue term, so no later phase would find the block.

**Decision**: Delete the block in all 22 workflows. Where a workflow's top-level `env:` holds another key, delete only the two comment lines and the key. Verify that all 35 workflows parse and none sets the key.

**Consequences**:
- `.skilled/changelog/skilled/v4.0.2.0.md` still mentions the setting; it is 006's.

**Alternatives Rejected**:
- Keep the block as harmless: its comment would describe model loads that no longer happen.

### ADR-011: Goal criterion 4 reads with the residue check excluded

**Status**: Accepted

**Context**: `005/goal.md` criterion 4 says `git grep -l "@huggingface/transformers" -- ':!specs'` lists no file. `sweep-lane-residue.mjs` 120 lists the term in `PROSE_TERMS`; phase 001 made that file the one place the vocabulary survives, and phase 008 makes it gating. This plan may not edit the goal.

**Decision**: Plan for the grep to print exactly that one path (REQ-008), and read criterion 4 with `':!.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs'` appended to the pathspec. The conductor accepted this reading because the parent goal's objective, which outranks a child criterion, is that the residue check finds nothing outside its own allowlist; the check's own files are that allowlist.

**Consequences**:
- AC-008 can be Met against REQ-008, while the goal's literal criterion 4 stays unchecked until the amendment lands.

**Alternatives Rejected**:
- Spell the term in two string pieces inside the residue check: it hides the term from the grep without changing what the check does, which defeats the criterion instead of meeting it.
- Remove the term from the check: the check would stop finding the dependency it exists to find.

### ADR-012: Fallback: merge with phase 004 if a gate needs a 004-owned edit

**Status**: Proposed

**Context**: Research 5.2 orders the lane core before the package. Phase 004's handoff says the advisor imports nothing from the package, and its own T046 proves it. A spec-kit or advisor test that still reaches into a deleted module through a path neither plan found would only show up once this phase deletes it.

**Decision**: If a typecheck, build, test or stress error, or a doc gate, can only be fixed by editing a path phase 004 owns (`R/lib/embedders/`, the lane code, a lane test), stop, record it in both goal logs, and land 004 and 005 as one commit under 004's plan with this plan's tasks appended, never 005 alone with a 004 edit folded in. If 004 is already committed, the fix is a follow-up commit recorded as a 004 finding, not a silent edit in 005.

**Consequences**:
- A merged commit would be about 240 files; the ratchets and every suite still prove the combined change.

**Alternatives Rejected**:
- Edit the 004 path inside 005 without recording it: it hides a cross-phase change from 004's plan and baseline.
