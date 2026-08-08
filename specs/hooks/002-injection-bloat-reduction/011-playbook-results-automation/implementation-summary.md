---
title: "Implementation Summary: Persisted Results for Manual Playbook Scenario Runs"
description: "The wrapper, renderer/export changes, contract wiring, persistence test, and six-runtime representative exercise are built, wired, and exercised; full suites and optional shared-writer refactoring remain pending."
status: "built, wired, and exercised end-to-end; full-suite runs pending"
completion_pct: 95
trigger_phrases:
  - "manual playbook results summary"
  - "playbook persistence design"
  - "benchmark artifact automation summary"
importance_tier: "critical"
contextType: "implementation-summary"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/011-playbook-results-automation"
    last_updated_at: "2026-08-08T16:27:56Z"
    last_updated_by: "claude"
    recent_action: "Reconciled the record to the built, wired, and exercised state"
    next_safe_action: "Run the full per-runtime playbook suites"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/manual-playbook-persist.test.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md"
    session_dedup:
      fingerprint: "sha256:393a8b410092acd2582c73ad9860f0be88a0aee9f562ea772bdbe46d458edf11"
      session_id: "2026-08-08-hooks-002-011"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Persisted Results for Manual Playbook Scenario Runs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-playbook-results-automation |
| **Level** | 2 |
| **Status** | Built, wired, and exercised end-to-end; full-suite runs pending |
| **Completion** | 95% |
| **Implementation Phase** | Wrapper/runtime + contract wiring + representative six-runtime exercise landed; optional shared-writer/Lane C refactor and full suites pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The core operator path now exists and is exercised by tests: a manual scenario outcome is handed to one canonical wrapper, which persists the full seven-file benchmark record into `<skill>/benchmark/reports/<dated-run-label>/`, reusing 021's naming, renderers, and index boundary. The optional shared `persist-run-artifacts.cjs` writer was not introduced; the wrapper calls the exported renderers and `appendRunIndex` directly.

### Landed (committed to the runtime)

| File | Action | Purpose |
|------|--------|---------|
| `run-manual-playbook-scenario.cjs` | Created — commit `8a26f0138f` | Wrapper: takes a `{verdict, reason, stage, evidence}` outcome envelope, builds a non-scoring report object, allocates a fresh dated sibling folder, writes the seven renderer-owned files, appends the index — all from a `finally` path so failed/SKIP runs still record |
| `build-report.cjs` | Modified — commit `8a26f0138f` | The `## Scenarios` table now honors an explicit row verdict/reason (a manual SKIP/FAIL renders as its verdict, not "passed"); inert for existing rows that carry no verdict. `dimLine` renders null points as an em dash |
| `run-skill-benchmark.cjs` | Modified — commit `8a26f0138f` | Additive export of `runFolderName`, `slugField`, `MAX_OUTPUT_ORDINAL`, and `defaultOutputsDir`; the shared-writer refactor was not done |
| `tests/manual-playbook-persist.test.cjs` | Created — commit `8a26f0138f` | Node test suite covering the acceptance matrix; 6/6 pass |

The wrapper marks manual records explicitly non-scoring: the aggregate is null and D1-D5 carry `not-applicable-manual-outcome`, never invented numbers. It refuses the frozen `baseline` and any occupied destination, and allocates a fresh dated sibling via the collision ordinal.

### Wired (the completion contract)

The wrapper is now the documented completion path. Commit `c58cac1aa4` updates the manual-testing-playbook SKILL, its package and snippet templates, and the storage guide so a scenario run is incomplete until its outcome is persisted through the wrapper; the storage guide now names the real seven-file output. `validate-playbook-package.cjs` gained an **advisory** `RESULT_PERSISTENCE_MARKER_MISSING` check that nudges packages toward the contract without failing them — verified non-breaking: an existing package's violation set is unchanged (8→8), only a warning is added.

### Deferred (the remaining follow-on)

The optional DRY extraction of a shared `persist-run-artifacts.cjs` and the refactor that would route Lane C through it were not done. The wrapper reuses the exported renderers and `appendRunIndex` directly, so there is no duplicate renderer/index implementation but there is not literally one shared writer. Full 28-scenario-per-runtime suites are also pending; six representative runtime scenarios were exercised end-to-end. The advisory (not hard-blocking) validator check is a deliberate non-breaking choice.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only investigation mapped the reuse points, then the runtime changes were landed in commit `8a26f0138f`, the contract and guide changes in `c58cac1aa4`, and the six-runtime representative exercise in `156b35fe93`. The resulting evidence is the 6/6 persistence suite, identical pre-existing failure counts in the two Lane C suites with and without the two modified files, the non-breaking validator result, and six correctly named seven-file records.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse 021's writer and naming boundary | A second allocator or report path would recreate the drift 021 removed |
| Persist from the wrapper finalization path | Executor errors and explicit SKIPs must leave evidence, not disappear |
| Keep manual outcomes outside Lane C scoring | An authored command result is not a routing measurement; numeric D1-D5 values would mislead |
| Fix the main renderer through explicit-row normalization | CSV and companions already honor explicit verdict/reason; the scenario table was the remaining drift point |
| Fail closed on baseline and occupied destinations | Historical benchmark evidence is immutable and partial writes are not recoverable records |
| Land contract wiring; defer optional DRY extraction and Lane C delegation | The wrapper now owns the manual boundary and reuses exported renderers/index directly; the shared-writer consolidation is optional follow-on work and was not needed to exercise the end-to-end path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New persistence test suite | PASS — `manual-playbook-persist.test.cjs` reports 6/6 |
| PASS/FAIL/SKIP artifact matrix | PASS — each verdict writes the seven files; SKIP reason appears in both `results.csv` and `skill-benchmark-report.md`; non-scoring and index-cardinality assertions also pass |
| Render parity | PASS — `skill-benchmark-report.md === renderReport(JSON.parse(skill-benchmark-report.json))`; `results.csv === renderResultsCsv(report)` |
| Manual outcome shape | PASS — `aggregateScore` is null; every D1-D5 dimension is `not-applicable-manual-outcome` with no numeric score; explicit evidence and execution context are preserved |
| Regression delta | PASS — `skill-benchmark.vitest.ts` fails 7/57 and `run-storage-convention.vitest.ts` fails 1/11 identically with and without the two modified files; the failures are pre-existing router/scaffolder fixtures |
| Contract-wiring | PASS — SKILL + templates + storage-guide document the wrapper completion path; the validator marker check is advisory and non-breaking (existing package violations 8→8, +1 warning) |
| End-to-end exercise | PASS — all six runtimes run through the wrapper produced correctly named 7-file records; codex/opencode/cursor/pi/devin PASS, claude SKIP (self-invocation guard) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The completion contract is advisory, not hard-blocking.** The guide, templates, and storage guide document the wrapper path and the validator warns when the marker is absent, but it does not fail a package — a deliberate choice so the change does not break the existing fleet of packages.
2. **Coverage is representative, not full-suite.** The automation was exercised end-to-end on all six runtimes — one representative scenario each was run with that runtime's cheapest model and persisted through the wrapper: codex/opencode/cursor/pi/devin PASS, claude SKIP (self-invocation guard). Running the full 28-scenario-per-runtime suites remains pending.
3. **The operator bypass case is out of scope.** The guarantee applies to supported coordinator calls that enter the wrapper.
4. **The optional DRY `persist-run-artifacts.cjs` extraction and Lane C shared-writer refactor are deferred.** The wrapper reuses the existing exported renderers and `appendRunIndex` directly; the storage-guide seven-file correction is wired and complete.
5. **The historical goal-hook example remains unrepaired by design.**
<!-- /ANCHOR:limitations -->
