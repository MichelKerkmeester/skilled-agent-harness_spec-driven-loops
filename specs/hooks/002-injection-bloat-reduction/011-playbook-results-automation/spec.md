---
title: "Design Specification: Persisted Results for Manual Playbook Scenario Runs"
description: "Record the implemented wrapper-backed manual-testing-playbook run path that persists operator outcomes in the seven-file benchmark record without changing the playbook corpus or Lane C scoring."
status: "built, wired, and exercised end-to-end; full-suite runs pending"
completion_pct: 95
trigger_phrases:
  - "manual playbook results automation"
  - "playbook outcome persistence"
  - "run manual playbook scenario"
  - "benchmark report automation"
importance_tier: "critical"
contextType: "spec"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/011-playbook-results-automation"
    last_updated_at: "2026-08-08T12:28:02Z"
    last_updated_by: "claude"
    recent_action: "Reconciled the packet to the built, wired, and exercised runtime state"
    next_safe_action: "Run the full per-runtime playbook suites"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md"
      - ".opencode/specs/sk-doc/021-benchmark-naming-and-playbook-results/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:488bb87516f622b249b960ff44249b562799129b06be18ae9ac9f35eb4299e35"
      session_id: "2026-08-08-hooks-002-011"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Design Specification: Persisted Results for Manual Playbook Scenario Runs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Built, wired, and exercised end-to-end; full-suite runs pending |
| **Created** | 2026-08-08 |
| **Parent Packet** | `hooks/002-injection-bloat-reduction` |
| **Predecessor** | `010-playbook-cheapest-model` |
| **Successor** | None |
| **Extended Foundation** | `sk-doc/021-benchmark-naming-and-playbook-results` (Complete 2026-07-27) |
| **Change Class** | Implemented, wired, and exercised end-to-end; full per-runtime suites pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 021 established the dated run-label grammar, automatic `benchmark/reports/` destination, seven-file output, and drift-proof index for Lane C `/deep:skill-benchmark` runs. Its shipped writer remains the Lane C boundary, while 011 now exposes its renderers, naming helpers, and index append for the manual wrapper to reuse.

Before 011, the operator-driven manual playbook path recorded nothing. The implemented wrapper now records `PASS`, `FAIL`, and `SKIP` outcomes, including executor failures, and the playbook contract documents that persistence boundary. Six representative runtime exercises produced correctly named seven-file records; the full 28-scenario-per-runtime suites remain pending.

### Purpose

Document the implemented thin wrapper that makes every supported manual scenario incomplete until its outcome is durably written, while reusing 021's naming, rendering, and index infrastructure and leaving the scenario corpus unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A canonical `run-manual-playbook-scenario.cjs` wrapper in the Lane C skill-benchmark directory.
- Direct wrapper reuse of the exported `build-report.cjs` renderers and `appendRunIndex` boundary; the optional shared-writer extraction is deferred.
- Wrapper input validation for `--skill`, `--scenario`, `--feature`, `--variant`, and the structured outcome envelope.
- A manual-outcome report shape with explicit `PASS`, `FAIL`, or `SKIP`, recorded reason, stage, evidence, and execution context.
- Reuse of `renderReport`, `renderResultsCsv`, companion renderers, and `appendRunIndex` for all seven artifacts.
- One `build-report.cjs` fix so the main scenario table honors explicit `row.verdict` and `row.reason`, matching the existing CSV and companion normalization at `build-report.cjs:342-389`.
- Central execution-contract updates in `sk-create-manual-testing-playbook/SKILL.md`, its root and per-feature templates, and `validate-playbook-package.cjs`.
- Correction of the stale report-shape section in `skill-benchmark-storage-guide.md:138-152`.
- `tests/manual-playbook-persist.test.cjs` covering wrapper persistence, collision safety, renderer equality, index cardinality, and executor failure.

### Out of Scope

- The optional DRY extraction into `persist-run-artifacts.cjs`, the Lane C shared-writer refactor, and the full 28-scenario-per-runtime suites.
- Editing any authored playbook scenario command, prompt, feature file, or corpus manifest.
- Changing Lane C's routing measurement or the normative D1-D5 contract. Link the [scoring contract](../../../../skills/system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md) and do not restate it; the authority is `scoring-contract.md:20-57`.
- Creating a hand-authored `report.md` or a fill-in template for any renderer-owned Markdown report. The concrete renderer-owned file is `skill-benchmark-report.md`.
- Repairing the historical goal-hook example; it remains historical evidence.
- Guaranteeing persistence for an operator who bypasses the coordinator wrapper.

### Planned Files to Change

| File Path | Change Type | Design Role |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs` | Created — commit `8a26f0138f` | Wrap one operator scenario and persist in `finally` |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/persist-run-artifacts.cjs` | **DEFERRED** | Optional shared writer; the wrapper reuses exported renderers and `appendRunIndex` directly |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modified — commit `8a26f0138f` | Additive export of naming/allocation helpers; shared-writer refactor deferred |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | Modified — commit `8a26f0138f` | Render explicit manual verdicts and reasons in the main scenario table; render null points as an em dash |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` | Modified — commit `c58cac1aa4` | Make wrapper execution and persistence the completion contract |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | Modified — commit `c58cac1aa4` | Publish the package-level persistence rule |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md` | Modified — commit `c58cac1aa4` | Publish the per-feature completion rule without rewriting scenario commands |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified — commit `c58cac1aa4` | Add the advisory execution-contract marker check |
| `.opencode/skills/sk-doc/sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md` | Modified — commit `c58cac1aa4` | Name the actual seven-file manual/Lane C output |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/manual-playbook-persist.test.cjs` | Added — commit `8a26f0138f` | Prove the six-test persistence acceptance matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every supported manual scenario is invoked through the canonical wrapper. | The coordinator has one wrapper call boundary; the wrapper accepts the declared flags and structured outcome envelope; bypassing the wrapper is explicitly out of scope. |
| REQ-002 | The wrapper cannot return a completed outcome before persistence succeeds. | Normal completion, explicit `SKIP`, and executor failure all enter the persistence path; a writer error is surfaced as a non-completed result. |
| REQ-003 | Manual execution reuses the existing persistence primitives without adding duplicate renderer or index implementations. | The wrapper imports the exported `build-report.cjs` renderers and `appendRunIndex`; `run-skill-benchmark.cjs` receives additive exports only. The optional `persist-run-artifacts.cjs` extraction and Lane C delegation are deferred. |
| REQ-004 | Each manual run emits the seven-file benchmark record in the skill's reports tree. | A PASS, FAIL, and SKIP scenario each create a dated sibling containing `README.md`, `skill-benchmark-report.json`, `skill-benchmark-report.md`, `results.csv`, `failed-runs.md`, `findings-and-recommendations.md`, and `source.md`. |
| REQ-005 | Manual outcomes are non-scoring records. | Manual reports set `aggregateScore: null`; every existing D1-D5 dimension key is marked `not-applicable-manual-outcome`; no numeric D1-D5 value is synthesized. An explicit SKIP records `verdict: SKIP`, a reason, `dispatch:none`, and `stage:documentation`, without executor dispatch. PASS/FAIL/SKIP is never mapped to `100`, `0`, or `null` D1-D5 values. |
| REQ-006 | Allocation is dated, collision-safe, and baseline-safe. | Labels use `<YYYY-MM-DD>--<subject>--<variant>` with lowercase ASCII alphanumerics, single hyphens within fields, double hyphens between fields, and no dots, underscores, or uppercase. Same-day collisions allocate a base sibling, then `-2` and later siblings; `baseline/` remains frozen, and baseline or occupied explicit destinations fail closed before any partial write. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Renderer output reflects explicit row outcomes. | An explicit `SKIP` or `FAIL` verdict and reason appear in `results.csv` and the rendered Markdown scenario table; the JSON-to-Markdown equality check passes. |
| REQ-008 | The execution contract is centralized. | The skill guide, both templates, and validator state that a scenario is incomplete until wrapper persistence succeeds; implementation does not edit each scenario command. |
| REQ-009 | The storage guide matches the shipped writer. | The guide lists all seven files, states renderer ownership, preserves the run-label grammar, and links the Lane C scoring contract without copying it. |
| REQ-010 | Existing Lane C behavior has zero regression delta. | `skill-benchmark.vitest.ts` fails 7/57 and `run-storage-convention.vitest.ts` fails 1/11 identically with and without the two modified files; the failures are pre-existing router/scaffolder fixtures, and routing remains the measured Lane C surface. |
| REQ-011 | Reports-index boundaries remain truthful. | A manual run appends exactly one index row for its newly allocated folder; the parent-owned production corpus diff remains a pending check. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: PASS, FAIL, and SKIP scenarios each allocate distinct dated sibling folders with all seven artifacts.
- **SC-002**: `skill-benchmark-report.md` equals `renderReport(JSON.parse(skill-benchmark-report.json))`, and `results.csv` equals `renderResultsCsv(report)`.
- **SC-003**: An explicit SKIP reason is present in the CSV and the rendered Markdown table; a failed executor persists a FAIL before returning nonzero.
- **SC-004**: Manual reports carry `aggregateScore: null` and D1-D5 statuses marked `not-applicable-manual-outcome`; a doc-only SKIP such as CC-029 carries a reason, `dispatch:none`, and `stage:documentation`, and no verdict maps to `100`, `0`, or `null` D1-D5 values.
- **SC-005**: Same-day runs receive distinct folders; `baseline/` and occupied destinations are refused with no partial writes.
- **SC-006**: Each persisted run gains exactly one reports-index row for its new folder; the exercised records remain under the correctly named reports tree.
- **SC-007**: Existing Lane C suites show zero regression delta, and no new hand-authored `report.md` path or template exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 021's allocator, renderer, companions, and index writer | Duplicate ownership would reintroduce naming drift | Reuse the exported renderers, naming helpers, and index append directly; keep the optional shared-writer extraction deferred |
| Risk | Persistence happens after a process error or is skipped on `SKIP` | The manual result disappears exactly when it is most useful | Normalize executor errors into FAIL and persist from the `finally` path |
| Risk | A renderer drops explicit manual verdict/reason fields | CSV and Markdown disagree about the outcome | Reuse the existing normalized-row semantics in the main scenario table |
| Risk | A run overwrites baseline or an earlier record | Historical evidence becomes mutable or disappears | Reject baseline and occupied destinations before rendering or writing; allocate dated siblings atomically |
| Risk | Manual records acquire invented scores | A non-scoring run is mistaken for Lane C measurement | Use null aggregate and explicit not-applicable statuses; link the scoring contract rather than copying it |
| Risk | Contract wording is added to every command | The corpus becomes noisy and scenario commands drift | Update the shared skill contract, templates, and validator only |
| Constraint | The goal-hook example is historical evidence | Repairing it would exceed 011 and alter the historical record | Leave it unchanged and exclude it from the implementation diff |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No implementation question blocks the packet. The wrapper, contract wiring, tests, and six-runtime representative exercise are complete. The full 28-scenario-per-runtime suites and the optional shared-writer/Lane C refactor remain explicitly deferred; the parent owns strict packet validation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

| Document | Relationship |
|---|---|
| [`plan.md`](./plan.md) | Shared-writer architecture and implementation sequence |
| [`tasks.md`](./tasks.md) | Implemented work, approved deferrals, and remaining verification |
| [`checklist.md`](./checklist.md) | Acceptance matrix and actual evidence |
| [`implementation-summary.md`](./implementation-summary.md) | Built, wired, exercised state and remaining limitations |
| `010-playbook-cheapest-model` | Immediate predecessor; its model standardization is complete and not duplicated |
| `sk-doc/021-benchmark-naming-and-playbook-results` | Extended foundation for naming, allocation, seven-file output, and index append |
<!-- /RELATED DOCUMENTS -->
