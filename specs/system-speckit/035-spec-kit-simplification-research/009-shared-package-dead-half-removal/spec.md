---
title: "Feature Specification: Shared package dead half removal"
description: "Remove the half of @spec-kit/shared that nothing imported once the memory database left, collapse the database-path derivations to the one telemetry directory the engine writes, fix the env-spelling split and the stale exports, and rewrite the README around what remains."
trigger_phrases:
  - "shared package dead half removal"
  - "embeddings monolith removed"
  - "telemetry store directory"
  - "shared readme rewrite"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Shared package dead half removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 003-shared-package-utilization |
| **Successor** | None |
| **Handoff Criteria** | Every row of `003-shared-package-utilization/research/confirmed-findings.md` is removed, fixed or carries a recorded decision, and the three packages build and test green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the spec-kit simplification research program.

**Scope Boundary**: the `shared/` package, the runtime's core config and its telemetry store, the CLI's semantic summarizer and save workflow, the runtime tests that exercised the removed modules, the env template and reference, and the READMEs that described the package.

**Dependencies**:
- `003-shared-package-utilization/research/confirmed-findings.md`, the censused ledger this phase closes

**Deliverables**:
- The embeddings monolith, its CLI shim, the root barrel, adaptive fusion, the MMR reranker, the learned combiner, matrix math, the retrieval-trace contracts, the quality extractors, the structure-aware chunker and the database-path module gone, with the nine tests that were their only exercise
- One telemetry directory export where two packages derived a sentinel path nobody wrote
- One Voyage base-URL spelling, one home for the HF dtype, an internal error class, no shard-path method nobody called
- A package manifest with no root export, no unused ML dependency, no no-op script, and a build that leaves test files out of `dist/`
- A parity test that keeps the model-server socket directory and owner-lease name equal across the two packages that declare them
- A README that describes the package that exists

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Roughly forty percent of the shared package was a second package nothing imported: an in-process embeddings library and the ranking, contract and chunking modules built for the memory pipeline, kept alive by a root barrel and by tests written to explain them. Around the live half, two packages derived a `.db-updated` sentinel path that nothing ever wrote, only to take its directory; the profile spelled the Voyage base URL differently from the provider; and the README described the dead half as the package's primary purpose.

### Purpose
Every module in `shared/` has an importer, every derived path names something that exists, and the README a reader opens describes the code a consumer reaches.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the dead modules, their tests, the barrel, the CLI shim and the database-path module
- Replace the sentinel derivation with a telemetry-directory export and repoint its two readers
- Fix the Voyage spelling, move the HF dtype, make the error class internal, drop the shard-path method
- Update the package manifest, the build config, the lockfile and the allowlist entry that named a removed test import
- Add the model-server constants parity test
- Rewrite the shared and algorithms READMEs; correct the core, lib and parsing READMEs, the env template, the env reference and the architecture document

### Out of Scope
- The skill advisor's isolation doctrine and env allowlist - the advisor's maintainers own them
- Collapsing the `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` spellings - operator configs carry both
- `predicates/boolean-expr.ts` - the command contracts cite it as their predicate grammar

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/{embeddings,index,paths}.ts`, `shared/algorithms/{adaptive-fusion,mmr-reranker,index}.ts`, `shared/ranking/`, `shared/contracts/`, `shared/lib/`, `shared/parsing/quality-extractors{,.test}.ts`, `runtime/cli/lib/embeddings.ts` | Delete | The dead half and its shim |
| `runtime/tests/{adaptive-fusion,mmr-reranker,learned-combiner,structure-aware-chunker,embedding-circuit-breaker,embedding-weighting,memory-roadmap-flags,production-db-isolation}.vitest.ts` | Delete | Tests whose only subject was removed |
| `shared/config.ts`, `shared/gate-3-classifier.ts`, `runtime/lib/graph/access-telemetry.ts`, `shared/config.test.ts` | Modify | Telemetry directory export and its readers |
| `runtime/core/config.ts`, `runtime/core/README.md` | Modify | Database block removed |
| `shared/embeddings/{registry,profile,types}.ts`, `shared/embeddings/providers/hf-local.ts`, `shared/types.ts`, `shared/embeddings/registry.test.ts` | Modify | Internal error class, shard method removed, Voyage spelling, dtype home |
| `shared/package.json`, `shared/tsconfig.json`, `system-spec-kit/package-lock.json` | Modify | Exports, dependency, scripts, test exclusion |
| `shared/embeddings/model-server-constants.test.ts` | Create | Parity test across packages |
| `runtime/cli/lib/semantic-summarizer.ts`, `runtime/cli/core/workflow.ts`, `runtime/cli/tests/memory-pipeline-regressions.vitest.ts`, `runtime/cli/evals/import-policy-allowlist.json` | Modify | Barrel and shim consumers |
| `shared/README.md`, `shared/algorithms/README.md`, `shared/parsing/README.md`, `runtime/cli/lib/README.md`, `ARCHITECTURE.md`, `references/config/environment-variables.md`, `runtime/ENV-REFERENCE.md`, `.env.example` | Modify | Documents that named removed members |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No removed module is imported, required or named by any code or document outside `specs/`, changelogs and benchmark reports |
| REQ-002 | The shared, runtime and CLI packages build, the CLI check gate passes, and the shared tests pass |
| REQ-003 | The telemetry store resolves to the same directory it did before, under the same override |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The Voyage base URL is read under one name across profile, provider and probes |
| REQ-005 | The shared README lists every variable the package reads and names no file that does not exist |
| REQ-006 | The model-server socket directory and owner-lease name are asserted equal across packages by a test |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `shared/dist` contains no compiled test file and no artifact of a removed module
- **SC-002**: The CLI vitest project passes with the same single pre-existing failure as before this phase
- **SC-003**: The sk-doc validator exits zero on every rewritten README
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A module with no code importer is still a contract | Removing it would orphan the documents that cite it | The predicate module was restored once the command contracts were found to name it |
| Risk | A class that looked dead was thrown internally | The build would fail | The build failed on the first pass and the class came back as internal |
| Dependency | The lockfile must follow the dependency removal | A stale lockfile fails `npm ci` in CI | `npm install --package-lock-only` at the skill root, not the repository root |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `shared/dist` shrinks from 69 to 44 files, so consumers resolve fewer artifacts
- **NFR-P02**: The parity test reads two files and finishes in milliseconds

### Security
- **NFR-S01**: The telemetry directory keeps honouring the same override, so no path moves unexpectedly
- **NFR-S02**: No credential handling changed; the Voyage spelling fix reads the variable the provider already read

### Reliability
- **NFR-R01**: The dist-alignment check fails on the next orphaned artifact
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty manifest registry still throws the internal error class the registry always threw
- Maximum length: not applicable
- Invalid format: a relative database-directory override resolves against the skill root, as before

### Error Scenarios
- External service failure: not applicable; nothing here talks to a network
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: removals and README rewrite ship in one commit, so no document names a file that is gone
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About sixty files across three packages |
| Risk | 12/25 | Two shared-contract changes, both verified by tests |
| Research | 4/20 | Findings arrived censused |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The two carried questions live in the research lane's confirmed-findings document with their owners named.
<!-- /ANCHOR:questions -->
