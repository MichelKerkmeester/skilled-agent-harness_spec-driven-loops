---
title: "Design Plan: Persisted Results for Manual Playbook Scenario Runs"
description: "Record the implemented wrapper, renderer correction, contract wiring, and representative runtime exercise for non-scoring manual playbook outcomes."
status: "built, wired, and exercised end-to-end; full-suite runs pending"
completion_pct: 95
trigger_phrases:
  - "manual playbook results plan"
  - "shared benchmark artifact writer"
  - "playbook persistence wrapper"
importance_tier: "critical"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/011-playbook-results-automation"
    last_updated_at: "2026-08-08T16:27:56Z"
    last_updated_by: "claude"
    recent_action: "Reconciled the implementation plan to the built, wired, and exercised state"
    next_safe_action: "Run the full per-runtime playbook suites"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
    session_dedup:
      fingerprint: "sha256:9eabe0f02ad521c31fc4280d8fd8abd1944ca1d418b8b723e01e86d450087aeb"
      session_id: "2026-08-08-hooks-002-011"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Design Plan: Persisted Results for Manual Playbook Scenario Runs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts and Markdown contract documents |
| **Framework** | `system-deep-loop` Lane C skill-benchmark and `sk-doc` playbook workflow |
| **Storage** | `<skill>/benchmark/reports/<run-label>/` plus `benchmark/reports/README.md` |
| **Testing** | `node:test` persistence suite, advisory manual-playbook validator, Lane C regression comparison, and parent-owned strict packet validation |

### Overview

The operator-facing `run-manual-playbook-scenario.cjs` wrapper is built and directly reuses the exported `build-report.cjs` renderers plus `appendRunIndex`. It normalizes PASS, FAIL, SKIP, and executor-error outcomes, then persists from `finally`; the optional `persist-run-artifacts.cjs` extraction and Lane C shared-writer delegation were not implemented. Contract wiring, the 6/6 Node test suite, and one representative end-to-end run for each of six runtimes are complete; the full 28-scenario-per-runtime suites remain pending.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] 021's shipped naming, allocation, seven-file output, and index behavior is identified as the reuse boundary — `sk-doc/021-benchmark-naming-and-playbook-results/implementation-summary.md:47-55`.
- [x] The current runner write/index block and renderer normalization seam are identified — `run-skill-benchmark.cjs:575-614` and `build-report.cjs:342-389`.
- [x] Manual execution, template, and validator surfaces are identified — `sk-create-manual-testing-playbook/SKILL.md:248-302` and `validate-playbook-package.cjs:205-246`.

### Definition of Done

- [x] The wrapper passes the PASS/FAIL/SKIP and executor-error matrix — `manual-playbook-persist.test.cjs` is 6/6.
- [x] The seven artifacts and one index row are emitted from each persisted report record — asserted by `manual-playbook-persist.test.cjs`; representative records are committed in `156b35fe93`.
- [x] Baseline and occupied destinations fail closed with no partial writes — asserted by `manual-playbook-persist.test.cjs`.
- [x] Existing Lane C routing/storage suites show zero regression delta — `skill-benchmark.vitest.ts` is 7/57 and `run-storage-convention.vitest.ts` is 1/11 identically with and without the two modified files; failures are pre-existing router/scaffolder fixtures.
- [x] Contract docs and storage guide are updated without a hand-authored report output — commit `c58cac1aa4`; the test asserts `report.md` is absent.
- [~] The optional shared-writer extraction and Lane C delegation remain deferred; the wrapper reuses exported renderers and `appendRunIndex` directly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One lifecycle wrapper owns manual completion semantics and reuses the existing renderer-owned persistence primitives. The wrapper handles destination allocation and calls the exported renderers, companion renderers, and `appendRunIndex` directly. Lane C keeps its existing routing/scoring write path; only naming/allocation helper exports were added to `run-skill-benchmark.cjs`.

### Key Components

- **`run-manual-playbook-scenario.cjs`**: validates `--skill`, `--scenario`, `--feature`, `--variant`, and the structured outcome; converts executor failure to FAIL; persists from `finally`.
- **`persist-run-artifacts.cjs`**: **DEFERRED**. No shared writer was created; the wrapper reuses exported renderers and `appendRunIndex` directly.
- **`run-skill-benchmark.cjs`**: retains Lane C routing/scoring and adds the exported `runFolderName`, `slugField`, `MAX_OUTPUT_ORDINAL`, and `defaultOutputsDir` helpers; shared-writer delegation is deferred.
- **`build-report.cjs`**: reuses explicit row verdict/reason in the main scenario table, matching `normalizeRow` used by CSV and companions.
- **Playbook contract surfaces**: state the wrapper/persistence completion rule once in the guide and templates; the validator checks the canonical package contract without requiring command rewrites.

### Data Flow

1. The scenario coordinator enters the wrapper with skill, scenario, feature, variant, and an outcome callback or envelope source.
2. The wrapper validates the identity fields, executes the authored command sequence, and records evidence and execution context.
3. A normal return supplies PASS/FAIL/SKIP. A nonzero executor exit is normalized to FAIL with its exit evidence. An explicit SKIP does not dispatch and still reaches the same finalization path.
4. The `finally` path sends the normalized envelope through the wrapper's direct persistence boundary. A persistence error is allowed to fail the wrapper; the wrapper must not report completion.
5. The wrapper derives `YYYY-MM-DD--manual-testing-playbook--<feature>-<variant>` after slug normalization, reserves a free sibling, prepares all output bodies, writes the seven files, and appends one index row. The wrapper reuses the exported renderers and index helper directly; no shared writer was introduced.
6. A documentation-only SKIP records `dispatch:none`, `stage:documentation`, a reason, `aggregateScore: null`, and `not-applicable-manual-outcome` for every D1-D5 dimension; verdicts never become numeric D1-D5 values.
7. The Markdown report and CSV are generated from the report object. No hand-authored report file participates in the path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and report shape

- [x] Freeze the wrapper envelope: `scenarioId`, `verdict`, `reason`, `stage`, `evidence[]`, and `executionContext` — commit `8a26f0138f`; assertions in `manual-playbook-persist.test.cjs`.
- [x] Define the manual report fields: explicit row outcome, `aggregateScore: null`, `dispatch:none`/`stage:documentation` for SKIP, and non-scoring D1-D5 statuses — commit `8a26f0138f`; assertions in `manual-playbook-persist.test.cjs`.
- [x] Define the package-level wrapper marker that the skill guide, both templates, and validator share — commit `c58cac1aa4`; existing package violations remain 8→8 with one advisory warning added.

### Phase 2: Persistence and wrapper

- [~] Extract dated allocation and collision ordinal behavior from the runner into `persist-run-artifacts.cjs` — deferred; the wrapper implements its boundary directly and reuses exported naming helpers.
- [~] Move JSON serialization, `renderReport`, `renderResultsCsv`, companion rendering, and `appendRunIndex` behind the shared writer — deferred; the wrapper calls the exported renderers and `appendRunIndex` directly, with no duplicate renderer implementation.
- [x] Add the wrapper's normal, SKIP, executor-error, baseline, and occupied-destination paths — commit `8a26f0138f`; `manual-playbook-persist.test.cjs` is 6/6.
- [~] Refactor Lane C to call the writer without changing routing/scoring inputs or verdict semantics — deferred; `run-skill-benchmark.cjs` received additive exports only in commit `8a26f0138f`.
- [x] Update the main scenario renderer to display explicit verdict/reason and null points as an em dash — commit `8a26f0138f`.

### Phase 3: Verification and contract rollout

- [x] Add the `manual-playbook-persist.test.cjs` Node test for PASS/FAIL/SKIP, render equality, collision allocation, failed-executor persistence, and fail-closed destinations — commit `8a26f0138f`; 6/6 pass.
- [x] Update the manual playbook guide, two templates, advisory validator check, and storage guide — commit `c58cac1aa4`; existing violations remain 8→8 with +1 advisory warning.
- [x] Verify index cardinality, no-new-`report.md`, and the existing Lane C regression delta — `manual-playbook-persist.test.cjs` assertions; `skill-benchmark.vitest.ts` 7/57 and `run-storage-convention.vitest.ts` 1/11 fail identically with and without the two modified files.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Envelope validation, run-label normalization, ordinal allocation, manual report shape | Node `node:test`; `manual-playbook-persist.test.cjs` |
| Renderer | JSON-to-Markdown and JSON-to-CSV equality; explicit SKIP/FAIL reason visibility | `build-report.cjs` renderers |
| Integration | PASS, FAIL, SKIP, executor nonzero, baseline refusal, occupied destination | Temporary skill roots; wrapper module API; `manual-playbook-persist.test.cjs` |
| Storage | Seven artifacts, one index row, no partial writes; production corpus diff remains parent-owned | `manual-playbook-persist.test.cjs`; filesystem assertions |
| Regression | Existing Lane C route and storage behavior; compare failure sets before/after the two modified files | `skill-benchmark.vitest.ts` (7/57) and `run-storage-convention.vitest.ts` (1/11) |
| Contract | Central execution marker, allowed verdicts, specific SKIP reason, no hand-authored report path | `validate-playbook-package.cjs`; repository search |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 021 naming and storage foundation | Internal | Confirmed | A second allocator would duplicate shipped behavior |
| `build-report.cjs` renderers | Internal | Confirmed | The seven-file record cannot remain renderer-owned |
| `append-run-index.cjs` | Internal | Confirmed | Folder/index cardinality would drift |
| Manual playbook coordinator call sites | Internal | Exercised for six runtimes | The guarantee remains limited to supported coordinator calls; direct bypasses stay out of scope |
| Existing Lane C test suite | Internal | Compared with zero regression delta | The two pre-existing router/scaffolder fixture failures remain unchanged |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any Lane C regression, report drift, overwritten destination, missing artifact, or wrapper completion returned without a persisted record.
- **Procedure**: Revert the relevant implementation commit(s) — `8a26f0138f`, `c58cac1aa4`, and/or `156b35fe93` — as a unit for the affected surface; retain already-written run folders as historical evidence; do not delete or rewrite `baseline/`.
- **Contract rollback**: If the documentation update must be backed out independently, revert the guide/template/validator commit together so the static contract does not describe an unavailable wrapper.
<!-- /ANCHOR:rollback -->
