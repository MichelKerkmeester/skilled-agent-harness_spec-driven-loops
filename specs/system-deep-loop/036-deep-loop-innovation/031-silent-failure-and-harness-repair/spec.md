---
title: "Feature Specification: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence"
description: "Twenty-three findings in three lanes share one shape: unmeasured or invalid input presenting as fine. Lane A is strict parsing and honest exit codes, Lane B is test-harness integrity (aggregate suites double-registering ~100+ tests each, poisoning the very counts `021` is reconciling), and Lane C is asset and playbook resolution including the five pre-existing command-contract failures `021` recorded as a RED baseline."
trigger_phrases:
  - "silent failure harness repair"
  - "input validation exit code deep loop"
  - "aggregate suite double registration"
  - "manual playbook dead runtime path"
  - "deep loop 031 silent failure"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/031-silent-failure-and-harness-repair"
    last_updated_at: "2026-08-08T03:00:00Z"
    last_updated_by: "claude"
    recent_action: "Landed 22/23 findings as 8fc33832c9+8b887bef5f+5611f21a15 (3 lanes)"
    next_safe_action: "Re-land skill-benchmark-resume-adapter timeout fix without the hang"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 90
    open_questions:
      - "Does Lane B run before or after `021` re-reconciles its citations? The two children can invalidate each other's numbers."
      - "What is the disposition of the five pre-existing command-contract failures: fix, re-scope, or delete?"
    answered_questions:
      - "Lane B legitimately REDUCES the discovered test count. That is the fix, and it must be reported as such rather than read as lost coverage."
      - "This child owns triage of the 5 pre-existing `F-ORC-01` command-contract failures that `021` recorded as a baseline"
      - "Sequenced after `026` (`reduce-alignment-state.cjs`) and `028` (`fanout-run.cjs`)"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `030-runtime-mirror-and-routing-parity`; successor `032-docs-drift-and-p2-batch`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The report's fourth recurring family is "unmeasured or invalid input presenting as fine", and this child covers it plus the measurement apparatus itself, because both are the same defect one level up. Lane A makes malformed input fail loudly instead of becoming a null placeholder, an empty array, or a `NaN` that reaches array slicing with `status ok`. Lane B repairs the harnesses: three rollback aggregates side-effect-import executable suites that Vitest also discovers independently, so ~100+ tests per aggregate are registered twice and the counts are inflated, directly poisoning the evidence `021` is reconciling. Lane C repairs asset and playbook resolution, including fourteen manual scenarios that `cd` into a path that does not exist and a contract-snapshot verifier that cannot accept its own output.

**Key Decisions**: Invalid input returns `INPUT_VALIDATION` with a distinct exit code rather than a generic script error or a success (ADR-001); Lane B's reduction in discovered test count is a correctness fix and is reported as a delta, not as lost coverage (ADR-002)

**Critical Dependencies**: `021` for count reconciliation (bidirectional), `026` for `reduce-alignment-state.cjs`, `028` for `fanout-run.cjs`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (22/23 findings landed across 3 lanes; skill-benchmark half of F-034-02 deferred) |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W5 |
| **Findings in scope** | 23 (0 P0 / 23 P1 / 0 P2), 0 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | No — robustness and measurement, not on the cutover unblock path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Twenty-three findings in three lanes share one shape. **Lane A, strict parsing and honest exit codes.** Malformed delta rows become `null` placeholders the caller filters, and strict failure consults only the main state log's corruption warnings, so a corrupt row silently removes a finding from the registry and dashboard while the iteration still passes (`F-003-03`, `F-037-04` — same file and line, one work unit). Synthesis catches a parse failure, returns an empty array, then appends `synthesis_complete` (`F-037-02`). Iteration verification skips malformed lines and finds an older valid record, so a malformed newest append is satisfied by a stale one, and the auto workflow uses this as its post-dispatch gate (`F-037-03`). `Number(args.limit || 50)` yields `NaN` into array slicing with `status ok` (`F-032-01`). An `ExecutorConfigError` has no code, so schema failures surface as generic `SCRIPT_ERROR` (`F-032-02`). A misspelled flag leaves the artifact directory undefined and writes to the default root, exiting successfully (`F-032-03`). A valueless flag becomes boolean `true` and reaches `path.resolve` (`F-032-04`). A merge mode is accepted and then reads research-shaped artifacts (`F-032-05`). Pivot events and persisted pivot config are cast to closed types after generic-only checks (`F-036-02`, `F-036-03`), and the run cache erases its pool-item generic (`F-036-01`). **Lane B, test-harness integrity.** Three rollback aggregates side-effect-import executable suites Vitest also discovers independently, so ~100+ tests per aggregate register twice (`F-034-01`). A file-wide timeout override raises a whole file to 24 hours with no reset (`F-034-02`). The shared spawn helper resolves only from `close`, so a child ignoring SIGTERM never settles, and its own unit test uses a cooperative process that never exercises the failure (`F-034-03`). **Lane C, asset and playbook resolution.** Benchmark postconditions accept absolute probe paths (`F-035-03`). Fourteen manual scenarios `cd` into a path that does not exist (`F-030-02`). The playbook root index omits a scenario directory, so four shipped scenarios sit outside the readiness denominator (`F-030-01`), and `PARTIAL` is defined while the governing policy allows only PASS/FAIL/SKIP yet READY stays reachable (`F-030-03`). The contract-snapshot verifier renders without frontmatter and byte-compares against a file that has twelve lines of it, so `--check` returns drift deterministically (`F-040-01`). Seven of ten benchmark profiles reference underscore fixture IDs against hyphenated fixtures (`F-033-01`). The skill fixture loader scans only immediate entries while the README documents subdirectories (`F-033-02`). And one benchmark contract splits its paths between a live packet and an absent one (`F-038-01`).

### Purpose
Make invalid input fail loudly with a distinct classification, and repair the harnesses and playbooks so the evidence they produce is trustworthy.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The review report states that in
> every confirmed case the actor is the operator or a stale local file, not a remote attacker. Read
> every P0 and P1 below as **cutover-readiness and robustness risk, not breach risk**. A finding's
> severity label is not a licence to treat it as a security incident.

> **Finding = hypothesis.** Only 13 of the 166 register findings carry a `CONFIRMED*` mark. Every
> other finding in the scope table below is an unverified single-leaf report. No fix may be built
> against an unconfirmed finding: T001 re-reads every cited `file:line` at HEAD and records
> `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any edit.

### Non-Goals
- Alignment coverage semantics (`026`, which lands first on the same reducer).
- The fan-out artifact contract (`028`, which lands first on the same script).
- Documentation and registry drift (`032`).
- Re-reconciling `021`'s citations. This child changes the counts; `021` owns the reconciliation, and the ordering is recorded in `MANIFEST.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lane A: strict parsing, `INPUT_VALIDATION` classification and a distinct exit code for every invalid-input case in scope.
- Lane A: closed-type casts replaced with real validation for pivot events, persisted pivot config and the run cache pool item.
- Lane B: aggregate suites stop double-registering independently discovered tests.
- Lane B: file-wide timeout overrides scoped and reset.
- Lane B: the shared spawn helper settles when a child ignores SIGTERM, with a test that actually exercises it.
- Lane C: benchmark postconditions reject absolute probe paths outside the repo.
- Lane C: every prescribed playbook `cwd` and test path resolves.
- Lane C: the playbook root index covers every shipped scenario directory, and the verdict vocabulary matches the governing execution policy.
- Lane C: the contract-snapshot verifier can accept its own generated output.
- Lane C: benchmark profile fixture IDs resolve, and the skill fixture loader scans the documented subdirectories.
- Lane C: triage of the five pre-existing command-contract failures `021` recorded as a RED baseline.

### Out of Scope
- Alignment coverage semantics (`026`).
- The fan-out artifact contract (`028`).
- Documentation drift (`032`).

### Findings in Scope (23)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-003-03` | P1 | unverified | `runtime/scripts/reduce-state.cjs:154` | Malformed delta rows bypass strict corruption handling |
| `F-037-02` | P1 | unverified | `commands/deep/assets/deep-review-auto.yaml:1879` | Synthesis silently ignores malformed canonical state records |
| `F-037-03` | P1 | unverified | `runtime/scripts/verify-iteration.cjs:57` | Mechanical iteration verification can accept a stale record after corruption |
| `F-037-04` | P1 | unverified | `runtime/scripts/reduce-state.cjs:154` | Malformed delta rows are dropped while the iteration still passes |
| `F-032-01` | P1 | unverified | `runtime/scripts/query.cjs:100` | Malformed query bounds return success with incorrect data |
| `F-032-02` | P1 | unverified | `runtime/scripts/fanout-run.cjs:2062` | Invalid fanout schemas are reported as generic script failures |
| `F-032-03` | P1 | unverified | `runtime/scripts/reduce-state.cjs:2181` | Misspelled reducer flags silently redirect writes |
| `F-032-04` | P1 | unverified | `runtime/scripts/upsert.cjs:131` | Missing or unreadable event files produce SCRIPT_ERROR instead of input validation |
| `F-032-05` | P1 | unverified | `runtime/scripts/fanout-merge.cjs:1097` | Context merge mode silently reads research artifacts |
| `F-036-01` | P1 | unverified | `runtime/lib/branch-leases-waves/durable-orchestrator.ts:591` | Run cache erases the pool-item generic |
| `F-036-02` | P1 | unverified | `runtime/lib/deep-loop/divergent-pivot.ts:528` | Pivot events are cast after generic-only validation |
| `F-036-03` | P1 | unverified | `runtime/lib/deep-loop/divergent-pivot.ts:995` | Persisted pivot config is asserted as a closed shape after shallow checks |
| `F-034-01` | P1 | unverified | `runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts:64` | Aggregate suites register independently discovered tests a second time |
| `F-034-02` | P1 | unverified | `runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts:16` | File-wide timeout overrides can hide a hung test for a day |
| `F-034-03` | P1 | unverified | `runtime/tests/helpers/spawn-cjs.ts:331` | Shared spawn timeout never settles when the child ignores SIGTERM |
| `F-035-03` | P1 | unverified | `shared/behavior-benchmark/behavior-bench-run.cjs:147` | Benchmark postconditions can depend on arbitrary host paths |
| `F-030-01` | P1 | unverified | `deep-review/manual-testing-playbook/manual-testing-playbook.md:31` | Release coverage omits intra-routing recall scenarios |
| `F-030-02` | P1 | unverified | `runtime/manual-testing-playbook/coverage-graph/coverage-graph-fuzzy-merge.md:45` | Fourteen manual scenarios prescribe test commands with dead runtime paths |
| `F-030-03` | P1 | unverified | `deep-review/manual-testing-playbook/manual-testing-playbook.md:9` | Release rules accept a verdict forbidden by the execution policy |
| `F-040-01` | P1 | unverified | `deep-review/scripts/render-contract-snapshot.cjs:445` | Contract snapshot verifier cannot accept its generated artifact |
| `F-033-01` | P1 | unverified | `deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json:9` | Seven shipped benchmark profiles reference nonexistent fixture IDs |
| `F-033-02` | P1 | unverified | `deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:280` | Documented nested legacy fixture corpus is skipped by the loader |
| `F-038-01` | P1 | unverified | `deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md:38` | Command-surface benchmark mixes live 035 and absent 066 packet |

**Lane assignment.** Lane A (strict parse and honest exit codes): `F-003-03`, `F-037-02`, `F-037-03`, `F-037-04`, `F-032-01`, `F-032-02`, `F-032-03`, `F-032-04`, `F-032-05`, `F-036-01`, `F-036-02`, `F-036-03`. Lane B (harness integrity): `F-034-01`, `F-034-02`, `F-034-03`. Lane C (asset and playbook resolution): `F-035-03`, `F-030-01`, `F-030-02`, `F-030-03`, `F-040-01`, `F-033-01`, `F-033-02`, `F-038-01`. `F-003-03` and `F-037-04` cite the same file and line from different iterations; treat them as one work unit while keeping both IDs mapped. Tasks below are representative per lane rather than one per finding, which is the sizing the WS1 proposal prescribes for a batch child.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/{reduce-state.cjs,verify-iteration.cjs,query.cjs,upsert.cjs,fanout-merge.cjs}` | Modify | Lane A: strict parse, `INPUT_VALIDATION`, honest exit codes |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Lane A: exit-code classification, layered on `028`'s artifact contract |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | Modify | Lane A: strict delta-corruption handling, layered on `026`'s coverage semantics |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Modify | Lane A: validate before casting to closed types |
| `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts` | Modify | Lane A: preserve the run cache pool-item generic |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/{agent,model,skill}-*-rollback-gate.vitest.ts` | Modify | Lane B: stop double-registering independently discovered suites |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/{model,skill}-benchmark-resume-adapter.vitest.ts` | Modify | Lane B: scope and reset the file-wide timeout override |
| `.opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts` | Modify | Lane B: settle when a child ignores SIGTERM; test the failure path |
| `.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` | Modify | Lane C: reject absolute probe paths outside the repo |
| `.opencode/skills/system-deep-loop/runtime/manual-testing-playbook/` | Modify | Lane C: fourteen scenarios with a dead `cd` target |
| `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | Modify | Lane C: root index coverage and verdict vocabulary |
| `.opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` | Modify | Lane C: `--check` can accept its own generated output |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/*.json` | Modify | Lane C: fixture IDs resolve |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | Lane C: scan the documented fixture subdirectories |
| `.opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md` | Modify | Lane C: paths resolve to one packet |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-review-auto.yaml` | Modify | Lane A: the post-dispatch gate must not be satisfied by a stale record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every invalid-input case in Lane A returns `INPUT_VALIDATION` with a distinct exit code, never exit 0 and never a generic script error. | One test per Lane A case asserting the classification and the exit code. |
| REQ-002 | A corrupt delta row cannot silently remove a finding while the iteration passes. | Named test: a corrupt row produces a strict failure rather than a filtered null. |
| REQ-003 | Aggregate suites no longer double-register independently discovered tests. | Discovered-test count before and after, reported as a delta with the reduction explained as the fix. |
| REQ-004 | The shared spawn helper settles when a child ignores SIGTERM. | A SIGTERM-ignoring fixture with a descendant completes within bounds and leaves a clean process tree. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Iteration verification cannot be satisfied by a stale record when the newest append is malformed. | Named test with a malformed newest record and a valid older one. |
| REQ-006 | Synthesis does not append a completion record after a parse failure. | Named test: a parse failure prevents the completion record. |
| REQ-007 | Every prescribed playbook `cwd` and test path resolves. | A resolution check over every scenario file, with zero unresolved paths. |
| REQ-008 | `render-contract-snapshot.cjs --check` exits 0 against the committed snapshot. | Recorded run with exit code 0. |
| REQ-009 | All ten benchmark profiles resolve their fixture IDs, and the skill fixture loader scans the documented subdirectories. | An all-profile asset-resolution gate passes; a nested fixture is loaded. |
| REQ-010 | The playbook readiness denominator covers every shipped scenario directory, and the verdict vocabulary matches the governing execution policy. | Index-versus-directory check clean; `PARTIAL` either removed or the policy updated, with READY unreachable on a forbidden verdict. |
| REQ-011 | The five pre-existing command-contract failures are triaged with a recorded disposition. | Per failure: fixed, re-scoped, or deleted, each with a rationale. |

### Universal - applies to every child in the 021-032 remediation tree

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Confirm before build. Every finding ID in the scope table is re-read at HEAD and classified `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit. | T001 output table in `tasks.md` lists all scoped IDs with a classification and a cited probe, test, commit, or new anchor. |
| REQ-U02 | Baseline before delta. Every suite this child touches is run **before** any edit and its real numbers recorded; the whole gate is re-run at close and reported as a delta. | Pre-edit and post-edit runs of the named runners are recorded in `checklist.md` with discovered-test counts, pass/fail/skip, and exit codes. |
| REQ-U03 | Negative test per confirmed finding. Acceptance is a test that **fails before the fix and passes after** — never a green suite alone. | Each confirmed finding maps to a named test that is demonstrated red at the pre-fix commit and green at the post-fix commit. |
| REQ-U04 | Independent verification. An adversarial pass is run by a different actor than the builder; a gate authored alongside the change is not independent evidence. | A verification pass distinct from the build pass is recorded, naming the actor and the defects it found (or explicitly none). |
| REQ-U05 | Evidence citations are drift-proof. No completion claim cites a bare run count or a raw line number; every claim cites a **test name + suite-content digest + candidate SHA**. | `checklist.md` evidence strings contain a test name, a suite digest, and a commit SHA. Grep for bare "N/N passing" strings returns none. |
| REQ-U06 | Completion discipline. `validate.sh --strict` exits 0 for this child, all `checklist.md` items are `[x]` with evidence, and completion metadata reconciles across `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0; no doc claims a completion state another doc contradicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 23 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: Every invalid-input case returns `INPUT_VALIDATION` with a distinct exit code.
- **SC-003**: The discovered-test count delta is reported with Lane B's reduction explained as the fix rather than as lost coverage.
- **SC-004**: A SIGTERM-ignoring fixture with a descendant completes within bounds with a clean process tree.
- **SC-005**: Every prescribed playbook `cwd` and test path resolves.
- **SC-006**: `render-contract-snapshot.cjs --check` exits 0 against the committed snapshot.
- **SC-007**: All ten benchmark profiles resolve their fixture IDs.
- **SC-008**: The five pre-existing command-contract failures carry a recorded disposition.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lane B changes the counts `021` cited, invalidating its reconciliation | High | The `021` <-> `031` sequencing rule is binding: either `021` cites suite digests that survive de-duplication, or it re-reconciles after this child lands |
| Risk | The count reduction is read as lost coverage | High | ADR-002 and REQ-003: report the delta with the reduction explained, and show that no unique test was removed |
| Risk | `026` and `028` land on the same files first | Medium | This child is sequenced after both; ordering recorded in `MANIFEST.md` |
| Risk | Exit-code changes break automation that branched on the old codes | Medium | Enumerate consumers of the current exit codes before the change |
| Dependency | `021`, `026`, `028` | All three | Sequence last among the fix children except `032` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Honesty
- **NFR-H01**: An invalid input must never produce a success exit code.
- **NFR-H02**: A parse failure must never be followed by a completion record.

### Measurement
- **NFR-M01**: A test count must reflect unique tests; double registration is a defect, not coverage.
- **NFR-M02**: A timeout override must be scoped and reset.

### Resolution
- **NFR-R01**: Every prescribed path in a playbook or profile must resolve from the repository root.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Malformed newest record with a valid older one: verification fails rather than accepting the stale one (`F-037-03`).
- `NaN` limit: rejected rather than slicing (`F-032-01`).
- Valueless flag: rejected rather than becoming boolean `true` (`F-032-04`).
- Misspelled flag: rejected rather than writing to a default root (`F-032-03`).

### Error Scenarios
- Corrupt delta row: strict failure (`F-003-03`, `F-037-04`).
- Parse failure in synthesis: no completion record (`F-037-02`).
- Schema failure: `INPUT_VALIDATION`, not `SCRIPT_ERROR` (`F-032-02`).
- Child ignores SIGTERM: the helper settles anyway (`F-034-03`).

### State Transitions
- Aggregate suite import: a test is registered once, not twice (`F-034-01`).
- Timeout override: does not leak past its file (`F-034-02`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 23 findings across 3 lanes, 16 rows in the Files to Change table spanning CommonJS scripts, TypeScript runtime lib, vitest harnesses, playbooks and benchmark assets |
| Risk | 18/25 | Touches `runtime/lib/` TS files (`divergent-pivot.ts`, `durable-orchestrator.ts`) and exit-code contracts that downstream automation may branch on; the shared spawn helper is used across the whole test suite |
| Research | 14/20 | Zero of 23 findings carry a review `CONFIRMED*` mark (Metadata table); every one requires a fresh HEAD re-read and probe before any fix, more open investigation than a pre-confirmed set |
| Multi-Agent | 9/15 | Three independently-runnable lanes (A/B/C) plus one independent adversarial verification pass (REQ-U04) |
| Coordination | 10/15 | Sequenced after `026` and `028`; bidirectional count-reconciliation dependency with `021`; explicitly does not block `014` cutover |
| **Total** | **71/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Lane B invalidates `021`'s citations | H | H | The `021` <-> `031` sequencing rule; digest-based citations or a post-`031` re-reconcile |
| R-002 | The count reduction reads as lost coverage | H | M | ADR-002; delta reported with unique-test evidence |
| R-003 | File collisions with `026` and `028` | M | M | Sequenced after both; ordering in `MANIFEST.md` |
| R-004 | Exit-code changes break downstream automation | M | M | Consumer enumeration before the change |
| R-005 | Triage of the five command-contract failures expands into a fix project | M | M | Disposition may be re-scope or delete; only a genuine defect is fixed here |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Invalid input is loud (Priority: P0)

**As a** operator running a runtime script, **I want** a misspelled flag or a malformed row to fail with a distinct classification, **so that** a silent success does not hide work that never happened.

**Acceptance Criteria**:
1. Given a misspelled flag, When the script runs, Then it exits with the invalid-input code rather than succeeding against a default root.
2. Given a corrupt delta row, When the reducer runs, Then it fails strictly rather than filtering the row away.

### US-002: A test count means unique tests (Priority: P0)

**As a** reviewer reading a suite count as evidence, **I want** the count to reflect unique tests, **so that** a de-duplication is read as a correction rather than as lost coverage.

**Acceptance Criteria**:
1. Given the aggregate suites, When the suite runs, Then each test is registered once.
2. Given the resulting lower count, When it is reported, Then it is reported as a delta with the reduction explained and no unique test removed.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- Does Lane B run before or after `021` re-reconciles its citations? The two children can invalidate each other's numbers. The `MANIFEST.md` sequencing rule states the constraint; the operator or packet owner picks the order.
- What is the disposition of the five pre-existing command-contract failures? Options are fix, re-scope the contract, or delete the obsolete assertions. Each needs a recorded rationale; only a genuine defect should be fixed inside this child.
- Should `PARTIAL` be removed from the playbook vocabulary, or should the governing execution policy be extended to allow it? Either resolves `F-030-03`, but they have different consequences for existing scenario results.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../016-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../016-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../016-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
