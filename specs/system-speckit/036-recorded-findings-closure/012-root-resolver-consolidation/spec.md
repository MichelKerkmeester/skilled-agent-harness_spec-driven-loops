---
title: "Feature Specification: Phase 12: root-resolver-consolidation"
description: "Seven or eight independent repo-root and package-root resolution implementations exist across system-spec-kit, three of them divergent walk-up predicates that can disagree on the same input tree."
trigger_phrases:
  - "root resolver consolidation"
  - "divergent skill root predicate"
  - "resolver parity test"
  - "boundary justified duplication"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: root-resolver-consolidation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/012-root-resolver-consolidation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 16 |
| **Predecessor** | 011-advisor-import-and-ollama-consolidation |
| **Successor** | 013-gate1-instruction-parity |
| **Handoff Criteria** | validate.sh reports RESULT: PASSED for this folder and the parity test plus npm run check both pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Recorded findings closure specification.

**Scope Boundary**: Every function under `.opencode/skills/system-spec-kit` that independently walks a directory tree to find a repo, package or skill root, plus a new shared parity test and the `shared/README.md` documentation of the surviving count.

**Dependencies**:
- The consolidated ESM resolver `shared/workspace/repo-root.mjs` and the shell resolver `runtime/cli/common.sh` already exist and are not re-implemented, only used as the merge targets where a boundary allows it.

**Deliverables**:
- The minimum number of independent root-resolution implementations the real import/runtime boundaries require.
- A parity test that feeds the same fixture trees to every surviving resolver and asserts one answer.
- `shared/README.md` states the count and the boundary that keeps each one.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Finding R6-03 (`specs/system-speckit/035-spec-kit-simplification-research/003-shared-package-utilization/research/lineages/deepseek-v4-flash-shared-package/findings-registry.json:36`) counted 8 root-resolution implementations: `shared/config.ts`, `shared/embeddings/factory.ts`, `shared/embeddings/profile.ts`, `shared/workspace/repo-root.mjs`, `check-source-dist-alignment.ts:98`, `check-architecture-boundaries.ts:92`, `retrofit-convention.mjs:1057`, and `generate-trigger-index.mjs:81`. A direct re-read of the current tree found that count has already shifted: `profile.ts`'s five-function database cluster (which held one of the three divergent predicates R6-02 named) was removed by a separate fix (`confirmed-findings.md:66`, "Fixed: removed"), and `retrofit-convention.mjs:1057` and `generate-trigger-index.mjs:82` are thin wrappers that call `resolveRepoRoot()` imported from `runtime/hooks/lib/workspace/repo-root.mjs` rather than independent walks. The genuinely independent, currently-live implementations are: `shared/workspace/repo-root.mjs:59` (the canonical ESM walk, sentinel-file plus outermost-`.opencode` hoist), `runtime/hooks/lib/workspace/repo-root.mjs:7` (a 7-line re-export shim, not a divergent copy), `shared/config.ts:23` (`resolvePackageRoot`, markers `runtime` + `shared`), `shared/embeddings/factory.ts:243` (`resolveSpecKitPackageRoot`, markers `runtime/cli` + `shared`), `runtime/cli/common.sh:16` (`get_repo_root`, git rev-parse with a relative-path fallback), `runtime/cli/evals/check-source-dist-alignment.ts:98` (`resolvePackageRoot`, `REQUIRED_ROOT_DIRS = ['runtime', 'shared']`), and `runtime/cli/evals/check-architecture-boundaries.ts:92` (`resolvePackageRoot`, `REQUIRED_ROOT_DIRS = ['shared', 'runtime', 'runtime/cli']`) - a byte-identical function body with a genuinely divergent marker list from the one in `check-source-dist-alignment.ts`. Both of the last two feed `npm run check` in `runtime/cli/package.json`, so a tree missing `runtime/cli` passes one and fails the other silently, and both are run in the same CI step (`runtime/cli/package.json:24`).

### Purpose
The number of independent root-resolution implementations is reduced to the minimum three real import boundaries require (an ESM-capable caller, a synchronous-CLI caller and a shell caller), a shared parity test proves every surviving resolver agrees on the same fixture trees, and `shared/README.md` states the surviving count with the boundary that keeps each one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merging `check-source-dist-alignment.ts:98`'s and `check-architecture-boundaries.ts:92`'s byte-identical `resolvePackageRoot` bodies into one shared helper, reconciling their divergent `REQUIRED_ROOT_DIRS` lists.
- Deciding whether `shared/config.ts:23` and `shared/embeddings/factory.ts:243` can collapse into one predicate, or documenting the boundary that keeps them separate (both live inside `shared/`, so the "cannot import the workspace package" reason does not apply to either).
- Writing a parity test that feeds identical fixture trees to every surviving resolver (`shared/workspace/repo-root.mjs`, the merged eval-check resolver, `common.sh`'s `get_repo_root` and whichever of `config.ts`/`factory.ts` survive) and asserts they return the same root.
- Stating the surviving count and the boundary reason for each in `shared/README.md`.

### Out of Scope
- `runtime/hooks/lib/workspace/repo-root.mjs`'s 7-line re-export shim - already a boundary copy, not a divergent implementation, not touched.
- `retrofit-convention.mjs`'s and `generate-trigger-index.mjs`'s `findRepoRoot` wrapper functions - already thin delegates to the shared resolver, not independent implementations, left as-is unless the parity test proves otherwise.
- Any root-resolution logic outside `.opencode/skills/system-spec-kit`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts` | Modify | `resolvePackageRoot` merged with `check-architecture-boundaries.ts`'s, or imports a shared helper |
| `.opencode/skills/system-spec-kit/runtime/cli/evals/check-architecture-boundaries.ts` | Modify | Same merge, reconciling the `runtime/cli` marker difference |
| `.opencode/skills/system-spec-kit/shared/config.ts` | Modify (if the boundary review finds no reason to keep it separate) | `resolvePackageRoot` collapsed into `factory.ts`'s or vice versa |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify (if the boundary review finds no reason to keep it separate) | Same collapse |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/` (new file) | Create | The shared parity test |
| `.opencode/skills/system-spec-kit/shared/README.md` | Modify | States the surviving resolver count and the boundary that keeps each |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-source-dist-alignment.ts` and `check-architecture-boundaries.ts` share one `resolvePackageRoot` implementation instead of two byte-identical bodies with divergent marker lists |
| REQ-002 | A parity test feeds the same set of fixture trees to every surviving resolver and asserts they return the same root for each tree |
| REQ-003 | `npm run check` in `runtime/cli/package.json` passes after the merge |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `shared/config.ts:23` and `shared/embeddings/factory.ts:243`'s predicates are either collapsed into one, or `shared/README.md` states the reason each survives independently |
| REQ-005 | `shared/README.md` states the final count of independent root-resolution implementations and the boundary that keeps each |
| REQ-006 | The four lanes of the 035 research program (001-ripgrep-search-system, 002-cli-runtime-utilization, 003-shared-package-utilization and the overengineering-simplification lane that recorded R6-02/R6-03) each still validate clean against this change, since all four touched files this phase edits |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-source-dist-alignment.ts` and `check-architecture-boundaries.ts` no longer contain two independent copies of the same function body.
- **SC-002**: The parity test passes, feeding the same fixture trees to every surviving resolver.
- **SC-003**: `shared/README.md` names the surviving count and the boundary for each.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `check-architecture-boundaries.ts`'s extra `runtime/cli` marker is load-bearing for a check the other file's resolver would silently pass on a tree missing `runtime/cli` | High if merged carelessly | Read `resolveCheckRoot`'s use of `resolvePackageRoot`'s result in both files before merging. The merge keeps the stricter marker set unless a real caller needs the looser one |
| Dependency | `runtime/cli/package.json`'s `check` script runs both `check-architecture-boundaries.ts` and `check-source-dist-alignment.ts` in the same `npm run check` invocation | A broken merge fails CI immediately, which is also the fastest possible detection | Run `npm run check` locally before committing |
| Risk | `shared/config.ts` and `shared/embeddings/factory.ts` are read by different consumer sets even though both live in `shared/`. Collapsing them without checking every caller could change `DEFAULT_DB_DIR`'s resolved path for one of them | Med | Grep every caller of `PACKAGE_ROOT` (`config.ts`) and `resolveSpecKitPackageRoot` (`factory.ts`) before deciding to collapse or keep separate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The merged resolver's directory walk is no slower than either original - same worst-case depth bound.
- **NFR-P02**: Not applicable beyond NFR-P01.

### Security
- **NFR-S01**: Not applicable - no auth surface changes.
- **NFR-S02**: Not applicable - no data storage changes. The resolved root only ever points inside the existing repository tree.

### Reliability
- **NFR-R01**: Every fixture tree in the parity test includes at least one adversarial case (a directory missing `runtime/cli` but present `runtime` and `shared`) so the merge's marker-set choice is exercised, not just the happy path.
- **NFR-R02**: `npm run check` reports the same or better result after the merge than before.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a fixture tree with neither `runtime` nor `shared` present is included in the parity test to confirm every resolver's not-found behavior (throw, or hoist-to-outermost-`.opencode`) is documented, not silently divergent.
- Maximum length: not applicable - directory walks are bounded by `DEFAULT_MAX_DEPTH`/the eval scripts' own depth caps, unchanged by this merge.
- Invalid format: not applicable.

### Error Scenarios
- External service failure: not applicable - no network call.
- Network timeout: not applicable.
- Concurrent access: not applicable - each resolver call is a synchronous, read-only directory walk.

### State Transitions
- Partial completion: the eval-script merge (REQ-001/002/003) and the `shared/config.ts`/`factory.ts` review (REQ-004) are independently completable. If a session ends after only the eval-script merge, `npm run check` still passes and the packet is not left red.
- Session expiry: `goal.md`'s log tracks which of the two independent workstreams (eval-script merge, shared-predicate review) is done if a session ends mid-phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two eval scripts to merge, two shared-package files to review, one new parity test, one README update |
| Risk | 8/25 | `npm run check` is the fast-feedback safety net, and the change is reversible by git revert |
| Research | 5/20 | The current-state inventory is already complete in this spec. Remaining research is the caller audit for `config.ts`/`factory.ts` |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether `shared/config.ts` and `shared/embeddings/factory.ts` collapse into one predicate or stay separate is decided by the caller audit in REQ-004's task, not assumed here. Both currently derive a database directory, but for different consumers (`getDbDir`/telemetry vs the embeddings profile cascade), and a real behavioral divergence in either caller's expectations would be a reason to keep them apart.
- Whether the brief's "the CLI check gate and all four lanes pass" names a literal fourth test lane beyond `npm run check` could not be confirmed against a real artifact. This spec interprets "the four lanes" as the four 035 research lanes/packets that touched these files (REQ-006), since no fourth vitest project or CI lane exists beyond the "root" and "cli" projects in `vitest.config.ts`.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
