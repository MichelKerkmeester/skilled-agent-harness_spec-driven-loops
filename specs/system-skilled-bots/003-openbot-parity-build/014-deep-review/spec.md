---
title: "Feature Specification: Phase 14: deep-review"
description: "An expanded deep review over every code and doc phase 001 to 013 built, run as a five-lineage fan-out, with every P0 and P1 fixed and the affected tests re-run."
trigger_phrases:
  - "deep review"
  - "phase 14 deep review"
  - "expanded deep review of the parity build"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: deep-review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-skilled-and-doc-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is `Met`, the findings registry holds zero active P0 and zero active P1, every row of the three review inputs is a seeded finding at the severity `design/records.md` section 7.4 assigns, every scenario whose owning phase a fix touched was re-run and recorded, `npm test` exits 0 in the runtime folder, and `validate.sh --strict` prints `RESULT: PASSED` for this folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the OpenBot parity build. Phases 001 to 013 change `.skilled/bin/bots.cjs`, the runtime modules under `.skilled/skills/system-skilled-bots/runtime/lib/`, the skill's own docs, and the packet's own phase documents. Each phase was written and checked alone. Nothing has read them together, and nothing has read the built code against the docs that describe it.

**Scope Boundary**: One expanded `/deep:review` run over the code and docs phases 001 to 013 built, the synthesis of its findings, the fix for every P0 and P1 it reports, and the re-run of the affected tests. New feature work, a change to the parity research, a rewrite of a phase document's scope, and any fix to a P2 finding are out of scope.

**Dependencies**:
- Phase 013 is clean first: every row in its `acceptance-criteria.md` is `Met` and `validate.sh --strict` prints `RESULT: PASSED` for its folder, so the review reads a checked surface rather than an assumed one [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md, section "1. METADATA"]
- The parent map fixes this phase last and names 013 as its predecessor, so no later phase can move the surface under the review [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "PHASE DOCUMENTATION MAP", row 14]
- The review loop is `/deep:review`, whose `--depth-mode=expansive` seeds depth-1 sub-target nodes and vetoes a stop while any node stays open [SOURCE: .skilled/commands/deep/review.md:101]
- The fan-out matrix names only `cli-*` executors, because a native lineage is refused before any lineage spawns [SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:146]
- The five executors this packet's build may use are the roster in `executors.json`, so a review lineage and a build worker share one roster [SOURCE: .skilled/commands/assets/local-skilled-alignment/executors.json:9]

**Review inputs.** Three handoff files are read at setup, before any lineage spawns, and each row of the first two becomes a seeded finding. The paths are fixed by the plan-depth research, so this phase does not choose them [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:298].

| Input | What one row is | What this phase does with it |
|-------|-----------------|------------------------------|
| `specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/failures.md` | one filed product failure, carrying the scenario id, the phase, the requirement, the observed line and the evidence path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/tasks.md:144] | seeds one finding, at the severity `design/records.md` section 7.4 assigns |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/scratch/rebuttals.md` | one `## <finding-id>` heading and the reason under it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/tasks.md, T016] | seeds one finding when the reason is `handed to 014`, and nothing when it is not |
| `specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/evidence/` | one finding in `skilled-alignment/findings.json` or `doc-alignment/findings.json` | seeds one finding per finding that is not fixed |

A missing input is recorded in `review/seeded-findings.json` with its reason and does not stop the run, because a phase that filed nothing has nothing to hand over. An input that exists and holds a row this phase cannot read is refused `review-seed-unreadable`, per `design/refusals.md` section 2.1.

**Deliverables**:
- One `/deep:review:auto` run with `--depth-mode=expansive`, `--spec-folder` bound to this packet, and a five-lineage fan-out, writing its packet under `review/`
- The synthesized `review/review-report.md` with one verdict line, and the merged findings registry
- A fix for every P0 and P1 finding, each with the verification step that proved it
- The re-run of the affected tests, the re-run of every 012 scenario whose owning phase a fix touched, and the whole runtime suite once at the end
- The review outcome, the finding count by severity and the fix list recorded in `implementation-summary.md`
- The design artifacts under `design/`, which fix the record shapes, the state machines, the refusals, the goldens and the operator-facing frames before the run starts
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Thirteen phases each wrote their own code, their own docs and their own acceptance criteria, and each was validated alone. A defect that only appears when two phases meet has no owner: a shared record one phase writes and another reads, a doc that names a verb the CLI does not have, a test that asserts a shape a later phase changed. The parity research already found two P0s of exactly that kind in the plans, and it reviewed plans, not built code [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/research.md:9]. Nothing yet reads the built surface as one artifact.

### Purpose
Run one expanded deep review over everything phases 001 to 013 built, fix every P0 and P1 it reports, and re-run the affected tests, so the program closes on a reviewed surface rather than thirteen separately validated ones.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The command this phase must not regress is the runtime test suite. Run from the repository root, before any fix:

```text
$ cd .skilled/skills/system-skilled-bots/runtime && npm test
 Test Files  35 passed (35)
      Tests  381 passed (381)
   Start at  20:35:10
   Duration  70.80s (transform 3.96s, setup 0ms, import 7.24s, tests 631.88s, environment 1ms)
```

Exit status 0. The suite is 35 files and 381 tests, and the command is the one the tests README names [SOURCE: .skilled/skills/system-skilled-bots/runtime/tests/README.md:107]. Every count this spec states about the current suite quotes this block, and REQ-006 is met only when the same command exits 0 with at least 381 tests passing.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run one expanded deep review over the code and docs phases 001 to 013 built, with depth mode `expansive` and the five review dimensions named in §4
- Run that review as a five-lineage fan-out, one lineage per roster executor, so five independent reads of the same surface are merged
- Synthesize the lineages into one findings registry and one `review-report.md` with a single verdict
- Fix every P0 and P1 finding, each with the verification step that proved the fix
- Re-run the affected tests after each fix wave and the whole runtime suite once at the end

### Out of Scope
- New feature work, a new runtime module or a new CLI verb - the review reports what exists, and a missing feature is a finding for a later packet, not a fix here
- A change to the parity research or to a phase's scope - a finding that says a phase's scope is wrong is recorded and deferred, because the scope is frozen
- Fixing a P2 finding - recorded in the report and left open, since the verdict reads PASS with advisories
- A second review run after the fixes - the fix pass re-runs the affected tests and the validator, not the loop; a re-review is a later operator decision

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/` | Create | The review packet: config, state log, findings registry, strategy, dashboard, iterations, `review-report.md`, `orchestration-summary.json`, `preflight.json`, `seeded-findings.json`, `fix-ledger.md`, `scenario-rerun.json` |
| `specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/design/` | Create | The record shapes, the state machines and sequences, the refusal catalogue, the goldens and the operator-facing frames. Written before the run, so the run copies a shape rather than choosing one |
| `.skilled/skills/system-skilled-bots/runtime/lib/*.ts` | Modify | Only the modules a P0 or P1 finding names |
| `.skilled/skills/system-skilled-bots/runtime/tests/*.vitest.ts` | Modify | Only the suites covering a fixed module, plus one regression test per fixed defect |
| `.skilled/bin/bots.cjs` | Modify | Only when a finding names a CLI verb or flag |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify | Only when a finding names a checker invariant |
| `specs/system-skilled-bots/003-openbot-parity-build/0[01][0-9]-*/` | Modify | Only the doc line a docs-truth finding names |
| `specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/implementation-summary.md` | Modify | The review outcome, the finding count by severity and the fix list |

### Design artifacts

The design work is done before the run, so the run copies a shape rather than choosing one. Each file below is a contract for the builder and none of them is a summary of another.

| File | What it fixes |
|------|---------------|
| `design/records.md` | every field of every record this phase writes, the probe record, the seeded-finding intake, the fix ledger row, the scenario re-run record and the nine report sections |
| `design/state-machines.md` | the run, the lineage, the finding and the fix wave as four state machines, five sequences in Mermaid, and the six ordered tests that produce the verdict |
| `design/refusals.md` | every way the run stops before it writes a verdict, with its layer, its exit code and what is on disk when it stops, plus what is not a refusal |
| `design/fixtures/` | one golden per record, on one data set, with the command that reads each and the count it must print |
| `design/mockups.md` | the console transcript as three frames, the rendered report, the rendered ledger and the dashboard as an operator reads them, plus the two failure frames |

A shape this phase shares with the packet is cited by contract section and never copied. The shared records are in `../contracts/records.md`, the `--json` rule is in `../contracts/cli-json.md`, the refusals the runtime already has are in `../contracts/refusals.md`, and the decisions D3, D4 and D7 are in `../contracts/decisions.md`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### Review dimensions

The review names five dimensions. The loop configures dimensions by id, and a name outside the four canonical ids counts as a custom dimension judged by its own name [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:86]. A fan-out lineage reviews the canonical four only, because fan-out binds `review_dimensions: all` in every lineage [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:477]. The five named dimensions therefore ride on the four canonical ids, and this mapping is what makes each one covered:

| Named dimension | Canonical id | What it checks here |
|---|---|---|
| Correctness | `correctness` | Logic, invariants, state transitions and edge cases in the modules 001 to 013 built, against the behavior their docs claim |
| Security | `security` | Trust boundaries, secret handling, approval authority, path handling and prompt injection across the phases that touch them |
| Cross-phase consistency | `traceability` | Shared records two phases both write, the build order, and whether a later phase's edit composes with an earlier one |
| Docs truth | `traceability` | Whether a doc names a verb, flag, field or file the built code actually has |
| Tests | `maintainability` | Whether a suite asserts the shape the code now has, and whether a fixed defect has a test that fails without the fix |

### Stop rule

The run stops on convergence, not on the iteration ceiling, and only when all five of these hold:

1. Every canonical id the five named dimensions map onto has at least one evidence-bearing iteration in every lineage. A `complete`, `insight` or `stuck` row counts; `thought`, `error` and `timeout` spend no band share.
2. The composite stop score clears `convergenceThreshold` 0.1, or the frontier has drained with at least one answered node, which is the hard `frontier_drained` candidate an expansive run earns.
3. No frontier node stays open or active, because the `frontierOpen` veto holds the loop at CONTINUE while one does.
4. The three quality gates pass: evidence (every active finding carries file:line), scope (nothing outside the declared target) and coverage (the required dimensions and traceability protocols are covered).
5. No lineage reports an active P0 that another lineage contradicts. The merged verdict is strongest-restriction, so any lineage's active P0 makes the merged verdict FAIL.

Hitting `maxIterations` 7 without a false-positive STOP is a legal stop, and the run records which of the two it took. The defaults are the contract's: `maxIterations` 7, `convergenceThreshold` 0.1, `stuckThreshold` 2 [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:152].

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The review starts only after phase 013 is clean: every row in `013-skilled-and-doc-alignment/acceptance-criteria.md` is `Met`, and `validate.sh --strict` prints `RESULT: PASSED` for that folder. |
| REQ-002 | The review runs as `/deep:review:auto` with `--depth-mode=expansive` and `--spec-folder` bound to this packet, over the code and docs phases 001 to 013 built, and its config records `depthMode` `expansive` with the four canonical dimension ids. |
| REQ-003 | The review runs as a fan-out of five lineages, one per roster executor, with `--concurrency=5`, and `review/orchestration-summary.json` lists all five labels with no partition gap. A lineage whose binary is absent is replaced in the fallback order, so the count reads five after the fallback and not before it. |
| REQ-004 | Every P0 finding is fixed, and each fix names the finding id, the file and the command whose output proved it. |
| REQ-005 | Every P1 finding is fixed and verified, or deferred with a recorded reason that names the finding id and what blocks it. |
| REQ-006 | The affected tests are re-run after the last fix and pass: `npm test` in the runtime folder exits 0 with at least 381 tests passing. |
| REQ-011 | Every row of the three review inputs becomes a seeded finding before any lineage spawns, at the severity `design/records.md` section 7.4 assigns, and `review/seeded-findings.json` records each row with its source, its phase and its disposition. A missing input is recorded with its reason and does not stop the run. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The run stops only on the stop rule in §4, and `review/deep-review-config.json` records the convergence threshold and the stuck threshold the run used. |
| REQ-008 | The synthesized `review/review-report.md` carries the nine core sections and exactly one `Review verdict:` line. |
| REQ-009 | The fix pass changes no file outside the surfaces the review named, and `git status --porcelain` lists only those surfaces. The scope check exempts `review/` and `implementation-summary.md`, because they are this phase's own outputs and a review that cannot write its report has nowhere to put its verdict. |
| REQ-010 | The packet records the review outcome, the finding count by severity and the fix list in `implementation-summary.md`. |
| REQ-012 | After the last fix, every 012 scenario whose owning phase a fix touched is re-run and recorded in `review/scenario-rerun.json` with its result and its evidence path. The owning phase is read from the failure row first and from the scenario's category folder second, per `design/records.md` section 8.3. A `FAIL` becomes a new finding and blocks the close. |

### The verdict rule

The verdict is strongest restriction over the lineages, then narrowed by the fix pass's own state. The six ordered tests are in `design/state-machines.md` section 5. Three outcomes follow from them:

| Verdict | When | What it does |
|---------|------|--------------|
| `FAIL` | a finding still reads `active` with severity `P0` | blocks the close. A P0 is a defect no later phase owns |
| `CONDITIONAL` | no active P0, and a P1 is deferred, or a filed product failure from 012 is not fixed, or a frontier node closed short, or a `blocked_stop` event is in the state log | closes the packet and names what blocks a PASS in the report's Deferred Items section |
| `PASS` | none of the above. A deferred P2 is allowed and sets `hasAdvisories` true | closes the packet |

The verdict cannot read `PASS` while a filed product failure from `012-manual-testing-scenarios/scratch/failures.md` is open. That is D4: the failure does not block 012's close once it is filed, and it does block this phase's PASS. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D4]

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/deep-review-config.json` reads `antiConvergence.depthMode` `expansive` and `reviewDimensions` `["correctness","security","traceability","maintainability"]`.
- **SC-002**: `review/orchestration-summary.json` lists five lineage labels and reports no dealt frontier node that a lineage failed to report.
- **SC-003**: The merged findings registry holds zero active P0 and zero active P1 at close.
- **SC-004**: `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints at least `Tests  381 passed`.
- **SC-005**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-deep-review --strict` prints `RESULT: PASSED`.
- **SC-006**: `review/seeded-findings.json` holds one row per row of the three review inputs, each with its source, its phase and its severity, and `seededCount` equals `rows.length`.
- **SC-007**: `review/scenario-rerun.json` holds one entry per scenario whose owning phase a fix touched, each with its result and its evidence path, and `failedCount` is `0` or every failure is a finding with a disposition.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 013 clean | The review reads a moving surface and its findings go stale mid-run | REQ-001 gates the start on 013's validator line, and the run records the commit it reviewed |
| Dependency | Five CLI binaries and their provider credentials | A missing binary or an exhausted plan drops a lineage | Preflight probes every binary and records which are present. At least one must be, and an absent one is replaced in the fallback order in `plan.md` §8.3, so the fan-out keeps five lineages |
| Dependency | The three review inputs | A filed product failure or a handed-on finding that nobody reads is a defect the build closes over | REQ-011 seeds every row before any lineage spawns, and the verdict rule reads a filed product failure |
| Risk | A fix pass widens into a rewrite | The diff leaves the reviewed surface and the verdict no longer describes it | REQ-009 caps the diff to the named surfaces and exempts this phase's own outputs, and a fix that needs a new surface is deferred as a finding |
| Risk | A lineage reports a finding it inferred rather than observed | A P0 is fixed for a defect that does not exist | The evidence quality gate requires file:line evidence on every active finding, and the orchestrator re-reads each P0 before fixing it. A finding that does not hold is withdrawn into `resolvedFindings` with its reason |
| Risk | Two fix workers edit one file | A lost edit and a failing suite | Parallelism follows file overlap: one worker per file per wave, and a fix that needs another worker's file waits for the next wave |
| Risk | A fix breaks a scenario 012 already recorded as passing | The build closes on a suite that passes and an operator flow that does not | REQ-012 re-runs every scenario whose owning phase a fix touched, and a `FAIL` there is a new finding that blocks the close |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each lineage stays inside the loop's `maxDurationMinutes` of 120, and a lineage that reaches it stops on its duration budget rather than being killed.
- **NFR-P02**: A fix wave runs only the suites covering the files it changed; the whole 35-file suite runs once, in the final wave.

### Security
- **NFR-S01**: No credential value appears in a lineage prompt, a review artifact or a fix commit; a prompt names the environment variable, never its value.
- **NFR-S02**: Every lineage runs with `AI_SESSION_CHILD=1` and the child-dispatch preamble, and a review lineage runs read-only, so the review cannot edit the surface it audits.

### Reliability
- **NFR-R01**: A lineage that fails is retried at most the runner's bound, and its findings are reported as partial rather than as clean.
- **NFR-R02**: An interrupted run resumes with `--lineage-mode=resume` and keeps its session id and generation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a scope discovery that finds no file writes an empty `fanout-review-scope.txt`, which the runner reads as no seeded scope, so the run halts before any lineage spawns rather than reviewing nothing and reporting PASS.
- Empty handoff: a build that filed no product failure and handed on no finding leaves `seeded-findings.json` with `seededCount` `0` and `missingSources` naming each absent path with its reason. The run continues, because a phase that filed nothing has nothing to hand over.
- Maximum input: a scope covering every file 001 to 013 touched exceeds one lineage's budget, so the fan-out splits it and each lineage sizes its own budget from its share of the seed; a lineage dealt no seed node runs at the loop default of 7 iterations.
- Failure path: a lineage whose binary is missing or whose plan is exhausted is dropped before spawn and the matrix is re-run with `--count=2` on the next executor in the fallback order; a run that loses every lineage exits non-zero and writes no verdict line.
- Partial fallback: a host with three binaries runs five lineages on three executors, so two labels carry a `-1` and a `-2` suffix. `total_cli_lineages` still reads `5` and the label set is recorded in `orchestration-summary.json`.
- Scenario regression: a fix that breaks a scenario 012 recorded as passing makes the re-run read `FAIL`, which becomes a new finding and blocks the close until it is fixed or deferred with a reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One review packet plus fixes confined to the modules and doc lines the findings name; no new module, verb or dependency |
| Risk | 15/25 | Fixes touch runtime modules and shared records, so a wrong fix can break a phase that already passed; the suite and the validator are the guard |
| Research | 11/20 | The dimensions, the stop rule and the executor roster are documented; what the review finds is unknown until it runs |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the fix pass belong in this packet or in a remediation packet? Decision: this packet, because the review's verdict stays CONDITIONAL until the fixes land and a separate packet would re-open the same scope.
- Which executor absorbs a dropped lineage's share when two CLIs are out of usage at once? Decision: the fallback order in `plan.md` §8.3, and the substitution is recorded in `orchestration-summary.json`.
- Does a P2 finding block the close? Decision: no. The verdict reads PASS with advisories, and the finding stays open in the report.
- Does a deferred P1 block the close? Decision: no. The packet closes on `CONDITIONAL` and the report names what blocks a PASS. A `FAIL` is the one verdict that blocks the close, because an active P0 is a defect no later phase owns.
- Is a missing handoff file a refusal? Decision: no. It is recorded in `seeded-findings.json` with its reason. An input that exists and holds a row this phase cannot read is refused, because that is a real defect.
<!-- /ANCHOR:questions -->

---


